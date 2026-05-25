/* Centro de notificaciones (datos desde bootstrap + descartes locales) */
'use strict';

window.SGE = window.SGE || {};

const LS_KEY = 'sge_notif_dismissed_v1';

function loadDismissed() {
  try {
    return new Set(JSON.parse(localStorage.getItem(LS_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function saveDismissed(set) {
  localStorage.setItem(LS_KEY, JSON.stringify([...set]));
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

function activeItems() {
  const raw = SGE.DB?.notificaciones || [];
  const d = loadDismissed();
  return raw.filter((n) => n.id && !d.has(n.id));
}

function renderBadge() {
  const badge = document.getElementById('header-notif-count');
  if (!badge) return;
  const n = activeItems().length;
  badge.textContent = n > 99 ? '99+' : String(n);
  badge.hidden = n === 0;
}

async function marcarRecordatorioSiCorresponde(item, tipo) {
  if (tipo !== 'recordatorio' || !SGE.Api?.mutations?.postLicitacionRecordatorioMarcarEnviado) return;
  const lic = parseInt(item?.getAttribute('data-licitacion-id') || '', 10);
  const rec = parseInt(item?.getAttribute('data-recordatorio-id') || '', 10);
  if (!(lic > 0 && rec > 0)) return;
  try {
    await SGE.Api.mutations.postLicitacionRecordatorioMarcarEnviado(lic, rec);
    if (typeof SGE.Api.reloadAfterMutation === 'function') await SGE.Api.reloadAfterMutation();
  } catch (e) {
    console.warn('marcar recordatorio', e);
  }
}

function renderDropdown() {
  const panel = document.getElementById('notif-dropdown-body');
  if (!panel) return;
  const items = activeItems();
  if (!items.length) {
    panel.innerHTML = '<p class="notif-empty"><i class="bi bi-check2-circle me-2" aria-hidden="true"></i>No hay alertas pendientes.</p>';
    return;
  }
  panel.innerHTML = items.map((n) => {
    const lic = n.licitacion_id != null ? String(n.licitacion_id) : '';
    const rec = n.recordatorio_id != null ? String(n.recordatorio_id) : '';
    return `
    <div class="notif-item" data-id="${SGE.Export.escapeHtml(n.id)}" data-tipo="${SGE.Export.escapeHtml(n.tipo)}" data-licitacion-id="${SGE.Export.escapeHtml(lic)}" data-recordatorio-id="${SGE.Export.escapeHtml(rec)}">
      <div class="notif-item-icon"><i class="bi ${tipoIcon(n.tipo)}" aria-hidden="true"></i></div>
      <div class="notif-item-body">
        <div class="notif-item-title">${SGE.Export.escapeHtml(n.titulo)}</div>
        <div class="notif-item-msg">${SGE.Export.escapeHtml(n.mensaje)}</div>
        <div class="notif-item-actions">
          ${n.vista ? `<button type="button" class="btn btn-link btn-sm notif-go" data-vista="${SGE.Export.escapeHtml(n.vista)}" data-ref="${SGE.Export.escapeHtml(n.ref || '')}">Ir al módulo</button>` : ''}
          <button type="button" class="btn btn-ghost btn-sm notif-dismiss" data-id="${SGE.Export.escapeHtml(n.id)}">Ocultar</button>
        </div>
      </div>
    </div>`;
  }).join('');

  panel.querySelectorAll('.notif-dismiss').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (!id) return;
      const item = btn.closest('.notif-item');
      const tipo = item?.getAttribute('data-tipo');
      if (tipo === 'recordatorio') await marcarRecordatorioSiCorresponde(item, tipo);
      const s = loadDismissed();
      s.add(id);
      saveDismissed(s);
      renderBadge();
      renderDropdown();
    });
  });

  panel.querySelectorAll('.notif-go').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const vista = btn.getAttribute('data-vista');
      const ref = btn.getAttribute('data-ref');
      document.getElementById('notif-dropdown')?.classList.remove('open');
      if (vista && typeof SGE.Router?.navigate === 'function') {
        await SGE.Router.navigate(vista);
        if (vista === 'licitaciones' && ref && typeof SGE.Lic?.view === 'function') {
          setTimeout(() => SGE.Lic.view(ref), 400);
        }
      }
    });
  });
}

function bindToggle() {
  const btn = document.getElementById('header-notif-btn');
  const drop = document.getElementById('notif-dropdown');
  if (!btn || !drop || btn.dataset.bound) return;
  btn.dataset.bound = '1';
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    drop.classList.toggle('open');
    drop.setAttribute('aria-hidden', drop.classList.contains('open') ? 'false' : 'true');
    if (drop.classList.contains('open')) renderDropdown();
  });
  document.addEventListener('click', () => {
    drop.classList.remove('open');
    drop.setAttribute('aria-hidden', 'true');
  });
  drop.addEventListener('click', (e) => e.stopPropagation());

  document.getElementById('notif-clear-dismissed')?.addEventListener('click', (e) => {
    e.stopPropagation();
    SGE.Notifications.clearDismissed();
    renderDropdown();
  });
}

SGE.Notifications = {
  syncFromBootstrap() {
    renderBadge();
    const drop = document.getElementById('notif-dropdown');
    if (drop?.classList.contains('open')) renderDropdown();
  },
  init() {
    bindToggle();
    renderBadge();
  },
  activeItems,
  clearDismissed() {
    localStorage.removeItem(LS_KEY);
    this.syncFromBootstrap();
  }
};
