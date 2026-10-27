/* ═══════════════════════════════════════════════════════
   Centro de notificaciones.

   El estado (ocultas y leídas) vive en el servidor, por usuario. Antes se
   guardaba en localStorage bajo una clave global, lo que provocaba los tres
   defectos reportados: todos veían siempre las mismas alertas, dos personas
   en el mismo equipo compartían los descartes, y una alerta ocultada quedaba
   silenciada para siempre aunque su registro de origen cambiara.

   El filtrado por permisos y la huella de contenido los aplica el backend;
   aquí solo se pinta lo que llega y se notifican los cambios.
   ═══════════════════════════════════════════════════════ */
'use strict';

window.SGE = window.SGE || {};

const RUTA_OCULTAR = '/api/spa/notificaciones/ocultar';
const RUTA_LEIDA = '/api/spa/notificaciones/leida';
const RUTA_RESTABLECER = '/api/spa/notificaciones/restablecer';

/* Ocultadas en esta misma sesión de pantalla. Sirve para que la alerta
   desaparezca al instante sin esperar la recarga del bootstrap; el estado real
   es siempre el del servidor. */
const ocultasLocalmente = new Set();

function esc(v) {
  return typeof SGE.Export?.escapeHtml === 'function' ? SGE.Export.escapeHtml(v) : String(v ?? '');
}

function tipoIcon(tipo) {
  const m = {
    recordatorio: 'bi-bell',
    licitacion_fecha: 'bi-calendar-event',
    finanza_cobrar: 'bi-cash-coin',
    finanza_pagar: 'bi-wallet2',
    inventario: 'bi-box-seam'
  };
  return m[tipo] || 'bi-info-circle';
}

/** Alertas que el servidor envió para este usuario y siguen visibles. */
function activeItems() {
  const raw = SGE.DB?.notificaciones || [];
  return raw.filter((n) => n.id && !ocultasLocalmente.has(n.id));
}

/** Solo las no leídas cuentan en el contador del encabezado. */
function pendientes() {
  return activeItems().filter((n) => !n.leida);
}

function renderBadge() {
  const badge = document.getElementById('header-notif-count');
  if (!badge) return;
  const n = pendientes().length;
  badge.textContent = n > 99 ? '99+' : String(n);
  badge.hidden = n === 0;
}

/* ── Comunicación con el servidor ─────────────────────── */

async function guardarEstado(ruta, item) {
  if (!SGE.Http?.jsonFetch) return false;
  try {
    await SGE.Http.jsonFetch(ruta, 'POST', { clave: item.id, huella: item.huella || '' });
    return true;
  } catch (e) {
    SGE.Toast.show(e.message || 'No se pudo guardar el cambio en la notificación.', 'error');
    return false;
  }
}

/** Marca el recordatorio de licitación como enviado, si corresponde. */
async function marcarRecordatorioSiCorresponde(n) {
  if (n.tipo !== 'recordatorio') return;
  if (!SGE.Api?.mutations?.postLicitacionRecordatorioMarcarEnviado) return;
  const lic = parseInt(n.licitacionId ?? n.licitacion_id ?? '', 10);
  const rec = parseInt(n.recordatorioId ?? n.recordatorio_id ?? '', 10);
  if (!(lic > 0 && rec > 0)) return;
  try {
    await SGE.Api.mutations.postLicitacionRecordatorioMarcarEnviado(lic, rec);
  } catch (e) {
    console.warn('marcar recordatorio', e);
  }
}

/* ── Pintado ──────────────────────────────────────────── */

function renderDropdown() {
  const panel = document.getElementById('notif-dropdown-body');
  if (!panel) return;

  const items = activeItems();

  if (!items.length) {
    panel.innerHTML =
      '<p class="notif-empty"><i class="bi bi-check2-circle" aria-hidden="true"></i>' +
      'No hay alertas pendientes.</p>';
    return;
  }

  panel.innerHTML = items.map((n) => `
    <div class="notif-item${n.leida ? ' notif-item-leida' : ''}" data-id="${esc(n.id)}">
      <div class="notif-item-icon"><i class="bi ${tipoIcon(n.tipo)}" aria-hidden="true"></i></div>
      <div class="notif-item-body">
        <div class="notif-item-title">${esc(n.titulo)}</div>
        <div class="notif-item-msg">${esc(n.mensaje)}</div>
        <div class="notif-item-actions">
          ${n.vista
            ? `<button type="button" class="btn btn-ghost btn-sm notif-go" data-id="${esc(n.id)}" data-vista="${esc(n.vista)}" data-ref="${esc(n.ref || '')}">Ir al módulo</button>`
            : ''}
          ${!n.leida
            ? `<button type="button" class="btn btn-ghost btn-sm notif-read" data-id="${esc(n.id)}">Marcar leída</button>`
            : ''}
          <button type="button" class="btn btn-ghost btn-sm notif-dismiss" data-id="${esc(n.id)}">Ocultar</button>
        </div>
      </div>
    </div>`).join('');

  enlazarAcciones(panel, items);
}

function enlazarAcciones(panel, items) {
  const buscar = (id) => items.find((x) => String(x.id) === String(id));

  panel.querySelectorAll('.notif-dismiss').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const n = buscar(btn.getAttribute('data-id'));
      if (!n) return;

      btn.disabled = true;
      await marcarRecordatorioSiCorresponde(n);

      const ok = await guardarEstado(RUTA_OCULTAR, n);
      btn.disabled = false;
      if (!ok) return;

      ocultasLocalmente.add(n.id);
      renderBadge();
      renderDropdown();
    });
  });

  panel.querySelectorAll('.notif-read').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const n = buscar(btn.getAttribute('data-id'));
      if (!n) return;

      btn.disabled = true;
      const ok = await guardarEstado(RUTA_LEIDA, n);
      btn.disabled = false;
      if (!ok) return;

      n.leida = true;
      renderBadge();
      renderDropdown();
    });
  });

  panel.querySelectorAll('.notif-go').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const n = buscar(btn.getAttribute('data-id'));
      const vista = btn.getAttribute('data-vista');
      const ref = btn.getAttribute('data-ref');

      document.getElementById('notif-dropdown')?.classList.remove('open');

      // Abrir la alerta equivale a leerla.
      if (n && !n.leida) {
        n.leida = true;
        guardarEstado(RUTA_LEIDA, n);
        renderBadge();
      }

      if (vista && typeof SGE.Router?.navigate === 'function') {
        await SGE.Router.navigate(vista);
        if (vista === 'licitaciones' && ref && typeof SGE.Lic?.view === 'function') {
          setTimeout(() => SGE.Lic.view(ref), 400);
        }
      }
    });
  });
}

/* ── Apertura y cierre del panel ──────────────────────── */

function bindToggle() {
  const btn = document.getElementById('header-notif-btn');
  const drop = document.getElementById('notif-dropdown');
  if (!btn || !drop || btn.dataset.bound) return;
  btn.dataset.bound = '1';

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const abierto = drop.classList.toggle('open');
    drop.setAttribute('aria-hidden', abierto ? 'false' : 'true');
    btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    if (abierto) renderDropdown();
  });

  document.addEventListener('click', () => {
    drop.classList.remove('open');
    drop.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
  });

  drop.addEventListener('click', (e) => e.stopPropagation());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drop.classList.contains('open')) {
      drop.classList.remove('open');
      drop.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });

  document.getElementById('notif-clear-dismissed')?.addEventListener('click', async (e) => {
    e.stopPropagation();
    await SGE.Notifications.restablecer();
  });
}

SGE.Notifications = {
  syncFromBootstrap() {
    // El servidor ya devolvió el listado que corresponde a este usuario,
    // así que los ocultamientos locales dejan de hacer falta.
    ocultasLocalmente.clear();
    renderBadge();
    const drop = document.getElementById('notif-dropdown');
    if (drop?.classList.contains('open')) renderDropdown();
  },

  init() {
    bindToggle();
    renderBadge();
  },

  activeItems,

  /** Devuelve a la vista todas las alertas que este usuario había ocultado. */
  async restablecer() {
    try {
      await SGE.Http.jsonFetch(RUTA_RESTABLECER, 'POST');
      ocultasLocalmente.clear();
      if (typeof SGE.Api?.reloadAfterMutation === 'function') {
        await SGE.Api.reloadAfterMutation();
      }
      renderBadge();
      renderDropdown();
      SGE.Toast.show('Se restablecieron las alertas ocultas.');
    } catch (e) {
      SGE.Toast.show(e.message || 'No se pudieron restablecer las alertas.', 'error');
    }
  }
};
