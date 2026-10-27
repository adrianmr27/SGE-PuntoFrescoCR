/* Cliente HTTP (única responsabilidad: peticiones JSON). */
'use strict';

window.SGE = window.SGE || {};

/**
 * Error de negocio devuelto por la API.
 *
 * Además del mensaje transporta `campo` y `codigo`, que es lo que permite a
 * SGE.FormErrors resaltar el control exacto del formulario en vez de mostrar
 * un cuadro genérico que dice "Error".
 */
class ApiError extends Error {
  constructor(mensaje, { campo = null, codigo = null, estado = 0 } = {}) {
    super(mensaje);
    this.name = 'ApiError';
    this.campo = campo;
    this.codigo = codigo;
    this.estado = estado;
  }
}

SGE.ApiError = ApiError;

/** Traduce el motivo que envía el middleware de sesión a un texto para el usuario. */
function motivoASesion(motivo) {
  switch (motivo) {
    case 'cuenta_desactivada':
      return 'Su cuenta fue desactivada. Contacte al administrador.';
    case 'sesion_reemplazada':
      return 'Se inició sesión con su usuario en otro equipo.';
    default:
      return null;
  }
}

SGE.Http = {
  async jsonFetch(url, method, body) {
    const init = { method, credentials: 'same-origin' };
    const m = (method || 'GET').toUpperCase();
    if (body != null && m !== 'GET' && m !== 'HEAD') {
      init.headers = { 'Content-Type': 'application/json' };
      init.body = JSON.stringify(body);
    }

    const res = await fetch(url, init);

    if (res.status === 401) {
      // Sesión expirada, cuenta desactivada o sesión abierta en otro equipo:
      // se regresa al login con el motivo, en vez de mostrar un "Unauthorized"
      // que no le dice nada a la persona.
      const motivo = res.headers.get('X-Sesion-Motivo');
      const texto = motivoASesion(motivo);
      if (texto) {
        try { sessionStorage.setItem('sge_motivo_cierre', texto); } catch (_) { /* modo privado */ }
      }
      window.location.href = '/Account/Login' + (motivo ? `?motivo=${encodeURIComponent(motivo)}` : '');
      return new Promise(() => {}); // corta la cadena mientras redirige
    }

    if (!res.ok) {
      let msg = res.statusText;
      let campo = null;
      let codigo = null;

      try {
        const j = await res.json();

        // Formato propio de la API: { error, codigo, campo }
        if (j.error) {
          msg = j.error;
          campo = j.campo || null;
          codigo = j.codigo || null;
        }
        // Formato de ModelState de ASP.NET Core: { errors: { Campo: [...] } }
        else if (j.errors && typeof j.errors === 'object') {
          const entradas = Object.entries(j.errors);
          if (entradas.length) {
            const [nombreCampo, mensajes] = entradas[0];
            if (Array.isArray(mensajes) && mensajes.length) msg = mensajes[0];
            codigo = 'MODELO_INVALIDO';
            // ModelState nombra la propiedad del DTO (ej. "Correo"); el modal usa
            // ids tipo "u-email", así que no se intenta adivinar la correspondencia.
            if (nombreCampo && !msg) msg = `El campo ${nombreCampo} no es válido.`;
          }
        }
        else if (j.title) {
          msg = j.title;
        }
      } catch (_) {
        // Respuesta sin cuerpo JSON: queda el statusText.
      }

      if (res.status === 403 && msg === res.statusText) {
        msg = 'No tiene permiso para realizar esta acción.';
      }

      throw new ApiError(msg, { campo, codigo, estado: res.status });
    }

    if (res.status === 204) return null;
    const t = await res.text();
    if (!t) return null;
    try {
      return JSON.parse(t);
    } catch {
      return t;
    }
  }
};
