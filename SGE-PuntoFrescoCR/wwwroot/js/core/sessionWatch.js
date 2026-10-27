/* ═══════════════════════════════════════════════════════
   Vigilante de sesión.

   Resuelve el escenario planteado: alguien deja la sesión abierta en la
   oficina, lo desactivan, y llega a la casa y sigue entrando. Con esto, en
   el instante en que el administrador guarda la desactivación, la pestaña
   abierta recibe el aviso y cae — no espera a que el usuario haga clic en
   algo.

   Mecanismo principal: Server-Sent Events contra /api/spa/sesion/stream.
   Respaldo: sondeo cada 20 s si SSE no logra establecerse (algunos proxies
   corporativos cortan las conexiones largas).
   ═══════════════════════════════════════════════════════ */
'use strict';

window.SGE = window.SGE || {};

const RUTA_STREAM = '/api/spa/sesion/stream';
const RUTA_ESTADO = '/api/spa/sesion/estado';

const INTERVALO_SONDEO_MS = 20000;
const REINTENTO_BASE_MS = 3000;
const REINTENTO_MAX_MS = 30000;
const MAX_FALLOS_ANTES_DE_SONDEO = 3;

let fuente = null;
let temporizadorSondeo = null;
let temporizadorReintento = null;
let fallosSeguidos = 0;
let cerrando = false;

/** Cierra la sesión en el cliente y lleva al login con el motivo a la vista. */
function expulsar(mensaje) {
  if (cerrando) return;
  cerrando = true;

  detener();

  try {
    sessionStorage.setItem('sge_motivo_cierre', mensaje);
  } catch (_) { /* modo privado */ }

  const irAlLogin = () => { window.location.href = '/Account/Logout'; };

  // Se avisa antes de redirigir para que la persona entienda qué pasó.
  // Si SweetAlert2 no está disponible, se redirige de una vez.
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      icon: 'warning',
      title: 'Sesión finalizada',
      text: mensaje,
      confirmButtonText: 'Entendido',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then(irAlLogin);

    // Red de seguridad: si la persona no toca el botón, igual se sale.
    setTimeout(irAlLogin, 8000);
  } else {
    irAlLogin();
  }
}

function detener() {
  if (fuente) {
    try { fuente.close(); } catch (_) { /* ya cerrado */ }
    fuente = null;
  }
  clearTimeout(temporizadorReintento);
  clearInterval(temporizadorSondeo);
  temporizadorReintento = null;
  temporizadorSondeo = null;
}

/* ── Respaldo por sondeo ─────────────────────────────── */

async function comprobarEstado() {
  if (cerrando) return;
  try {
    const res = await fetch(RUTA_ESTADO, { credentials: 'same-origin' });

    if (res.status === 401) {
      expulsar('Su sesión finalizó. Vuelva a iniciar sesión.');
      return;
    }

    if (!res.ok) return; // fallo puntual de red: se reintenta en el siguiente ciclo

    const datos = await res.json();
    if (datos && datos.valida === false) {
      expulsar(datos.estado === 'CuentaDesactivada'
        ? 'Su cuenta fue desactivada por un administrador.'
        : 'Se inició sesión con su usuario en otro equipo.');
    }
  } catch (_) {
    // Sin conexión. No se expulsa por esto: se reintentará.
  }
}

function iniciarSondeo() {
  if (temporizadorSondeo) return;
  console.info('[SGE] Canal de sesión no disponible; se usa sondeo periódico.');
  temporizadorSondeo = setInterval(comprobarEstado, INTERVALO_SONDEO_MS);
  comprobarEstado();
}

/* ── Canal principal (SSE) ───────────────────────────── */

function conectar() {
  if (cerrando || typeof EventSource === 'undefined') {
    iniciarSondeo();
    return;
  }

  try {
    fuente = new EventSource(RUTA_STREAM, { withCredentials: true });
  } catch (_) {
    iniciarSondeo();
    return;
  }

  fuente.addEventListener('conectado', () => {
    fallosSeguidos = 0;
    // Si el sondeo estaba activo como respaldo, ya no hace falta.
    clearInterval(temporizadorSondeo);
    temporizadorSondeo = null;
  });

  fuente.addEventListener('cerrar-sesion', (e) => {
    let mensaje = 'Su sesión fue cerrada.';
    try {
      const datos = JSON.parse(e.data);
      if (datos && datos.mensaje) mensaje = datos.mensaje;
    } catch (_) { /* se usa el mensaje por defecto */ }
    expulsar(mensaje);
  });

  fuente.onerror = () => {
    if (cerrando) return;

    try { fuente.close(); } catch (_) { /* ya cerrado */ }
    fuente = null;

    fallosSeguidos += 1;

    // Tras varios fallos seguidos se asume que SSE no va a funcionar en esta
    // red y se levanta el sondeo, que es menos inmediato pero siempre pasa.
    if (fallosSeguidos >= MAX_FALLOS_ANTES_DE_SONDEO) {
      iniciarSondeo();
      return;
    }

    // Reintento con espera creciente para no castigar al servidor.
    const espera = Math.min(REINTENTO_BASE_MS * fallosSeguidos, REINTENTO_MAX_MS);
    temporizadorReintento = setTimeout(conectar, espera);
  };
}

SGE.SessionWatch = {
  init() {
    if (fuente || temporizadorSondeo) return; // ya iniciado

    // Sin usuario identificado no hay sesión que vigilar. Es el caso del modo
    // de desarrollo sin login: activarlo provocaría cierres en bucle.
    if (!(typeof window.SGE_CURRENT_USER_ID === 'number' && window.SGE_CURRENT_USER_ID > 0)) {
      return;
    }

    conectar();

    // Al volver a la pestaña se comprueba de inmediato: si el equipo estuvo
    // suspendido, el canal pudo haberse caído sin que llegara el evento.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible' || cerrando) return;
      if (!fuente && !temporizadorSondeo) conectar();
      else comprobarEstado();
    });

    window.addEventListener('pagehide', detener);
  },

  detener
};
