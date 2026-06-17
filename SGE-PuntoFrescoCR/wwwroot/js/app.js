/* ═══════════════════════════════════════════════════════
   SGE Punto Fresco · Core JS
   ═══════════════════════════════════════════════════════ */

'use strict';

const VIEW_MODULO_MAP = {
  administrativo: 'Administrativo',
  roles: 'Roles',
  usuarios: 'Usuarios',
  empleados: 'Empleados',
  'empleados-stats': 'Empleados',
  clientes: 'Clientes',
  proveedores: 'Proveedores',
  compras: 'Compras',
  inventario: 'Inventario',
  'inventario-movs': 'Inventario',
  pedidos: 'Pedidos',
  'pedidos-analytics': 'Pedidos',
  licitaciones: 'Licitaciones',
  finanzas: 'Finanzas',
  predicciones: 'Predicciones',
  reportes: 'Reportes'
};

async function loadPartialView(viewId) {
  const res = await fetch(`/spa/views/${encodeURIComponent(viewId)}`, { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`No se pudo cargar la vista ${viewId}`);
  return res.text();
}

const ACTION_ALIAS_TO_MODULO = {
  Adm: 'ADMINISTRATIVO',
  Roles: 'ROLES',
  Usu: 'USUARIOS',
  Emp: 'EMPLEADOS',
  Cli: 'CLIENTES',
  Prov: 'PROVEEDORES',
  Com: 'COMPRAS',
  Inv: 'INVENTARIO',
  Ped: 'PEDIDOS',
  Lic: 'LICITACIONES',
  Fin: 'FINANZAS',
  Pre: 'PREDICCIONES',
  Rep: 'REPORTES'
};

const DATA_MODAL_PERMISSIONS = {
  'modal-cliente': { modulo: 'CLIENTES', accion: 'crear' },
  'modal-proveedor': { modulo: 'PROVEEDORES', accion: 'crear' },
  'modal-mov-manual': { modulo: 'FINANZAS', accion: 'crear' },
  'modal-cuenta-cobrar': { modulo: 'FINANZAS', accion: 'crear' },
  'modal-cuenta-pagar': { modulo: 'FINANZAS', accion: 'crear' }
};

function resolveActionByMethod(methodName = '') {
  const fn = String(methodName || '').toLowerCase();
  if (!fn) return null;
  if (fn.includes('export')) return 'exportar';
  if (fn.startsWith('new') || fn.startsWith('opennew') || fn.startsWith('add')) return 'crear';
  if (fn.startsWith('create') || fn.startsWith('save') || fn.startsWith('submitupload')) return 'crear';
  if (fn.startsWith('edit') || fn.startsWith('toggle') || fn.startsWith('confirm') || fn.startsWith('cancel') || fn.startsWith('entregar')) return 'editar';
  if (fn.startsWith('docs') || fn.startsWith('del') || fn.startsWith('perms') || fn.startsWith('recalcular')) return 'editar';
  if (fn.startsWith('marcar')) return 'editar';
  return null;
}

function hideUnauthorizedActions(root = document) {
  if (!root || typeof SGE?.hasPerm !== 'function') return;

  root.querySelectorAll('[data-modal]').forEach(el => {
    const req = DATA_MODAL_PERMISSIONS[el.dataset.modal];
    if (!req) return;
    if (!SGE.hasPerm(req.modulo, req.accion)) el.style.display = 'none';
  });

  root.querySelectorAll('[onclick]').forEach(el => {
    const onclick = el.getAttribute('onclick') || '';
    const m = onclick.match(/SGE\.(\w+)\.(\w+)\s*\(/);
    if (!m) return;
    const alias = m[1];
    const method = m[2];
    const modulo = ACTION_ALIAS_TO_MODULO[alias];
    if (!modulo) return;
    const accion = resolveActionByMethod(method);
    if (!accion) return;
    if (!SGE.hasPerm(modulo, accion)) el.style.display = 'none';
  });
}

function canAccessView(viewId) {
  const modName = VIEW_MODULO_MAP[viewId];
  if (!modName) return true;
  const db = window.SGE?.DB;
  if (!db?.permisosRol?.length || !db?.modulos?.length) return true;
  const mod = db.modulos.find(mm => mm.nombre === modName || mm.codigo === modName);
  if (!mod) return true;
  const p = db.permisosRol.find(pr => pr.modulo_id === mod.id);
  return !!(p && p.puedeVer);
}

const VIEW_SESSION_KEY = 'sge_spa_view';

/* ── Simple SPA Router ─────────────────────────────── */
const Router = (() => {
  const views = {};
  let current = null;

  const register = (id, loader) => { views[id] = loader; };

  const renderView = async (id, params = {}) => {
    if (!canAccessView(id)) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'warning',
          title: 'Acceso restringido',
          text: 'No tiene permiso para acceder a este módulo.'
        });
      } else {
        Toast.show('No tiene permiso para acceder a este módulo', 'error');
      }
      return;
    }
    current = id;

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === id);
    });

    // Update breadcrumb
    const breadcrumb = document.querySelector('.breadcrumb-current');
    const navLabel = document.querySelector(`.nav-item[data-view="${id}"] .nav-label`);
    if (breadcrumb && navLabel) breadcrumb.textContent = navLabel.textContent;

    const main = document.getElementById('main-content');
    main.style.opacity = '0';
    /* No usar transform aquí: rompe position:fixed de los modales dentro del main */

    await new Promise(r => setTimeout(r, 150));

    if (views[id]) {
      main.innerHTML = await views[id](params);
      main.style.transition = 'opacity .3s ease';
      main.style.opacity = '1';
      try {
        sessionStorage.setItem(VIEW_SESSION_KEY, id);
      } catch (_) { /* private mode */ }
      initView(id);
    }
  };

  const navigate = async (id, params = {}) => {
    if (current === id) return;
    await renderView(id, params);
  };

  /** Vuelve a pintar la vista activa (misma ruta) con datos actualizados de SGE.DB */
  const refresh = async (params = {}) => {
    const id = current;
    if (!id || !views[id]) return;
    await renderView(id, params);
  };

  return { register, navigate, refresh, current: () => current };
})();

/* ── Modal Manager ─────────────────────────────────── */
const Modal = (() => {
  const open = (id) => {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = (id) => {
    const overlay = id
      ? document.getElementById(id)
      : document.querySelector('.modal-overlay.open');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  const init = () => {
    document.addEventListener('click', (e) => {
      if (e.target.matches('.modal-overlay')) close();
      if (e.target.matches('.modal-close') || e.target.closest('.modal-close')) {
        const overlay = e.target.closest('.modal-overlay');
        if (overlay) close(overlay.id);
      }
      if (e.target.dataset.modal) open(e.target.dataset.modal);
      if (e.target.dataset.closeModal || e.target.closest('[data-close-modal]')) close();
    });
  };

  return { open, close, init };
})();

/* ── Toast Manager ─────────────────────────────────── */
const Toast = (() => {
  const show = (msg, type = 'success') => {
    if (type === 'error' && typeof Swal !== 'undefined') {
      Swal.fire({ icon: 'error', title: 'Error', text: String(msg || 'Ocurrió un problema.') });
      return;
    }
    if (type === 'info' && typeof Swal !== 'undefined') {
      Swal.fire({ icon: 'info', title: 'Información', text: String(msg || '') });
      return;
    }
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon"><i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'error' ? 'bi-x-circle-fill' : 'bi-info-circle-fill'}" aria-hidden="true"></i></span>
      <span class="toast-msg">${msg}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3600);
  };

  return { show };
})();

/* ── Switch Toggle ─────────────────────────────────── */
const initSwitches = () => {
  document.querySelectorAll('.switch-wrap').forEach(wrap => {
    if (wrap.dataset.init) return;
    wrap.dataset.init = '1';
    const sw = wrap.querySelector('.switch');
    if (!sw) return;
    wrap.addEventListener('click', () => {
      sw.classList.toggle('on');
      const cb = wrap.querySelector('input[type=checkbox]');
      if (cb) cb.checked = sw.classList.contains('on');
    });
  });
};

/* ── Tabs ──────────────────────────────────────────── */
const initTabs = () => {
  document.querySelectorAll('.tabs').forEach(tabsEl => {
    if (tabsEl.dataset.init) return;
    tabsEl.dataset.init = '1';
    tabsEl.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = btn.dataset.tab;
        const parent = tabsEl.closest('[data-tabs]') || document;
        tabsEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        parent.querySelectorAll('.tab-panel').forEach(p => {
          p.classList.toggle('active', p.id === panel);
        });
      });
    });
  });
};

/* ── Search / Filter Tables ────────────────────────── */
const initSearchIcons = () => {
  document.querySelectorAll('.search-wrap .search-icon:not([data-bi])').forEach(el => {
    el.dataset.bi = '1';
    el.innerHTML = '<i class="bi bi-search" aria-hidden="true"></i>';
  });
};

const initSearch = () => {
  document.querySelectorAll('.search-input[data-table]').forEach(input => {
    if (input.dataset.init) return;
    input.dataset.init = '1';
    input.addEventListener('input', () => {
      const tableId = input.dataset.table;
      const table = document.getElementById(tableId);
      if (!table) return;
      const q = input.value.toLowerCase();
      table.querySelectorAll('tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  });

  document.querySelectorAll('.filter-select[data-table]').forEach(sel => {
    if (sel.dataset.init) return;
    sel.dataset.init = '1';
    sel.addEventListener('change', () => {
      const tableId = sel.dataset.table;
      const col     = parseInt(sel.dataset.col || '0');
      const table   = document.getElementById(tableId);
      if (!table) return;
      const val = sel.value;
      table.querySelectorAll('tbody tr').forEach(row => {
        const cell = row.cells[col];
        row.style.display = (!val || (cell && cell.textContent.trim() === val)) ? '' : 'none';
      });
    });
  });
};

const getTableSortValue = (row, colIndex, type) => {
  const cell = row.cells[colIndex];
  if (!cell) return type === 'number' || type === 'date' ? 0 : '';
  const dataVal = cell.dataset.sort || row.dataset.sort;
  const text = (dataVal || cell.textContent).trim();
  if (type === 'number') {
    const n = parseFloat(String(text).replace(/[^\d.,-]/g, '').replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  }
  if (type === 'date') {
    const fecha = row.getAttribute('data-fecha') || text;
    if (!fecha || fecha === '—') return 0;
    const t = Date.parse(fecha);
    return Number.isFinite(t) ? t : 0;
  }
  return text.toLowerCase();
};

const sortTableRows = (tableId, colIndex, direction, type) => {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const dir = direction === 'desc' ? 'desc' : 'asc';
  rows.sort((a, b) => {
    const va = getTableSortValue(a, colIndex, type);
    const vb = getTableSortValue(b, colIndex, type);
    if (va < vb) return dir === 'asc' ? -1 : 1;
    if (va > vb) return dir === 'asc' ? 1 : -1;
    return 0;
  });
  rows.forEach(r => tbody.appendChild(r));
};

const initTableSort = () => {
  document.querySelectorAll('.sort-select[data-table]').forEach(sel => {
    if (sel.dataset.init) return;
    sel.dataset.init = '1';
    sel.addEventListener('change', () => {
      if (!sel.value) return;
      const parts = sel.value.split(':');
      if (parts.length < 3) return;
      const col = parseInt(parts[0], 10);
      const dir = parts[1];
      const type = parts[2];
      sortTableRows(sel.dataset.table, col, dir, type);
    });
  });

  document.querySelectorAll('table[data-sortable] thead th[data-sort-col]').forEach(th => {
    if (th.dataset.init) return;
    th.dataset.init = '1';
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const table = th.closest('table');
      if (!table?.id) return;
      const col = parseInt(th.dataset.sortCol, 10);
      const type = th.dataset.sortType || 'text';
      const current = th.dataset.sortDir || '';
      const dir = current === 'asc' ? 'desc' : 'asc';
      table.querySelectorAll('thead th[data-sort-col]').forEach(h => {
        h.dataset.sortDir = '';
        h.classList.remove('sort-asc', 'sort-desc');
      });
      th.dataset.sortDir = dir;
      th.classList.add(dir === 'asc' ? 'sort-asc' : 'sort-desc');
      sortTableRows(table.id, col, dir, type);
    });
  });
};

/* ── Per-view initializer ──────────────────────────── */
const initView = (id) => {
  initSwitches();
  initTabs();
  initSearchIcons();
  initSearch();
  initTableSort();
  hideUnauthorizedActions();
  // Dispatch custom event for per-view JS
  document.dispatchEvent(new CustomEvent('view:ready', { detail: { view: id } }));
};

/* ── Sidebar toggle (mobile) ───────────────────────── */
const initSidebar = () => {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (!toggle || !sidebar) return;
  toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
};

/* ── Format helpers ────────────────────────────────── */
const fmt = {
  currency: (n) => '₡' + Number(n).toLocaleString('es-CR', { minimumFractionDigits: 2 }),
  date: (d) => new Date(d).toLocaleDateString('es-CR'),
  phone: (p) => p ? p.replace(/(\d{4})(\d{4})/, '$1-$2') : '—',
};

/* ── Datos de la SPA (rellenados desde /api/spa/bootstrap vía spaService.js) ── */
const DB = {
  empresa: {},
  parametros: [],
  roles: [],
  usuarios: [],
  empleados: [],
  clientes: [],
  proveedores: [],
  productos: [],
  compras: [],
  movimientos: [],
  pedidos: [],
  licitaciones: [],
  movFinancieros: [],
  cuentasCobrar: [],
  cuentasPagar: [],
  historialClientes: {},
  areas: [],
  categorias: [],
  parametrosIva: [],
  modulos: [],
  permisosRol: [],
  predicciones: [],
  notificaciones: [],
  reportes: {}
};

window.SGE = { Router, Modal, Toast, DB, fmt, initView, initSidebar, canAccessView, hideUnauthorizedActions, loadPartialView, VIEW_SESSION_KEY, sortTableRows };
// Aplica permisos de rol: bloquea módulos sin permiso (visible pero no clickeable)
SGE.applyPermissions = function () {
  try {
    const db = SGE.DB;
    if (!db || !db.permisosRol || !db.modulos) return;

    const allowedModuloIds = (db.permisosRol || []).filter(p => p.puedeVer).map(p => p.modulo_id);
    db.modulos.forEach(m => { m._allowed = allowedModuloIds.includes(m.id); });

    document.querySelectorAll('.nav-item[data-modulo]').forEach(el => {
      const name = el.dataset.modulo;
      const mod = db.modulos.find(mm => mm.nombre === name || (mm.codigo && mm.codigo === name));
      if (!mod) return;
      const allowed = !!mod._allowed;
      el.classList.toggle('nav-item-locked', !allowed);
      el.style.display = allowed ? '' : 'none';
      el.style.opacity = '';
      el.style.pointerEvents = '';
      el.title = '';
    });
  } catch (e) { console.error('applyPermissions', e); }
};

SGE.hasPerm = function (moduloCodigo, accion) {
  const db = SGE.DB;
  if (!db?.permisosRol?.length || !db?.modulos?.length) return true;
  const mod = db.modulos.find(mm => mm.codigo === moduloCodigo || mm.nombre === moduloCodigo);
  if (!mod) return false;
  const p = db.permisosRol.find(pr => pr.modulo_id === mod.id);
  if (!p) return false;
  if (accion === 'ver') return !!p.puedeVer;
  if (accion === 'crear') return !!p.puedeCrear;
  if (accion === 'editar') return !!p.puedeEditar;
  if (accion === 'eliminar') return !!p.puedeElim;
  if (accion === 'exportar') return !!p.puedeExport;
  return false;
};
