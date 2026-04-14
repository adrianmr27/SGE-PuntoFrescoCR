/* ═══════════════════════════════════════════════════════
   SGE Punto Fresco · Core JS
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── Simple SPA Router ─────────────────────────────── */
const Router = (() => {
  const views = {};
  let current = null;

  const register = (id, loader) => { views[id] = loader; };

  const navigate = async (id, params = {}) => {
    if (current === id) return;
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
    main.style.transform = 'translateY(8px)';

    await new Promise(r => setTimeout(r, 150));

    if (views[id]) {
      main.innerHTML = await views[id](params);
      main.style.transition = 'opacity .3s ease, transform .3s ease';
      main.style.opacity = '1';
      main.style.transform = 'translateY(0)';
      initView(id);
    }
  };

  return { register, navigate, current: () => current };
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
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  const show = (msg, type = 'success') => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
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

/* ── Per-view initializer ──────────────────────────── */
const initView = (id) => {
  initSwitches();
  initTabs();
  initSearch();
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

/* ── Mock data store ───────────────────────────────── */
const DB = {
  empresa: {
    nombre_comercial: 'Punto Fresco de Costa Rica S.A.',
    razon_social: 'Punto Fresco de Costa Rica Sociedad Anónima',
    cedula_juridica: '3-101-758432',
    telefono1: '2234-5678',
    telefono2: '8812-3456',
    correo: 'info@puntofresco.cr',
    correo_alt: 'admin@puntofresco.cr',
    direccion: 'San José, Escazú, Centro Comercial Multiplaza, Local 214',
    sitio_web: 'www.puntofresco.cr',
    impuesto_defecto: '13',
  },
  parametros: [
    { id: 1, tipo: 'Impuesto', nombre: 'IVA General',   valor: '13%', estado: 'Activo' },
    { id: 2, tipo: 'Impuesto', nombre: 'IVA Reducido',  valor: '4%',  estado: 'Activo' },
    { id: 3, tipo: 'Impuesto', nombre: 'Exento',        valor: '0%',  estado: 'Activo' },
  ],
  roles: [
    { id: 1, nombre: 'Administrador', descripcion: 'Acceso total al sistema', usuarios: 2, estado: 'Activo' },
    { id: 2, nombre: 'Ventas',        descripcion: 'Gestión de pedidos y clientes', usuarios: 4, estado: 'Activo' },
    { id: 3, nombre: 'Proveeduría',   descripcion: 'Gestión de compras e inventario', usuarios: 3, estado: 'Activo' },
    { id: 4, nombre: 'Logística',     descripcion: 'Coordinación de despacho', usuarios: 2, estado: 'Activo' },
    { id: 5, nombre: 'Finanzas',      descripcion: 'Control financiero',       usuarios: 1, estado: 'Inactivo' },
  ],
  usuarios: [
    { id: 1, nombre: 'Adrián Mora',    usuario: 'amora',    rol: 'Administrador', correo: 'amora@puntofresco.cr',    estado: 'Activo',   ultimo_acceso: '2024-06-10' },
    { id: 2, nombre: 'Sofía Jiménez', usuario: 'sjimenez', rol: 'Ventas',        correo: 'sjimenez@puntofresco.cr', estado: 'Activo',   ultimo_acceso: '2024-06-09' },
    { id: 3, nombre: 'Carlos Vargas',  usuario: 'cvargas',  rol: 'Proveeduría',   correo: 'cvargas@puntofresco.cr',  estado: 'Activo',   ultimo_acceso: '2024-06-08' },
    { id: 4, nombre: 'María Solano',  usuario: 'msolano',  rol: 'Logística',     correo: 'msolano@puntofresco.cr',  estado: 'Inactivo', ultimo_acceso: '2024-05-20' },
  ],
  empleados: [
    { id: 1, nombre: 'Adrián Mora',    identificacion: '1-0934-0281', puesto: 'Gerente',   telefono: '8812-3456', correo: 'amora@puntofresco.cr',    area: 'Gerencia',  estado: 'Activo' },
    { id: 2, nombre: 'Sofía Jiménez', identificacion: '1-1122-3344', puesto: 'Ejecutiva de Ventas', telefono: '8834-5678', correo: 'sjimenez@puntofresco.cr', area: 'Ventas', estado: 'Activo' },
    { id: 3, nombre: 'Carlos Vargas',  identificacion: '2-0445-0678', puesto: 'Encargado Bodega', telefono: '8856-7890', correo: 'cvargas@puntofresco.cr',  area: 'Proveeduría', estado: 'Activo' },
    { id: 4, nombre: 'María Solano',  identificacion: '3-0219-0443', puesto: 'Logística',    telefono: '8878-9012', correo: 'msolano@puntofresco.cr',  area: 'Operaciones', estado: 'Inactivo' },
    { id: 5, nombre: 'Luis Fonseca',  identificacion: '1-0763-0890', puesto: 'Contador',     telefono: '8890-1234', correo: 'lfonseca@puntofresco.cr', area: 'Finanzas',    estado: 'Activo' },
  ],
  clientes: [
    { id: 1, nombre: 'Supermercados La Colonia S.A.', identificacion: '3-101-112233', telefono: '2200-1100', correo: 'compras@lacolonia.cr', estado: 'Activo',   direccion: 'San José, Barrio Tournón' },
    { id: 2, nombre: 'Restaurant El Fogón Tico',       identificacion: '3-102-445566', telefono: '2255-8899', correo: 'elfogonantico@gmail.com', estado: 'Activo', direccion: 'Heredia, Barva' },
    { id: 3, nombre: 'Mini Super Don Carlos',          identificacion: '1-0882-3344',  telefono: '2277-3344', correo: 'dcarlos.mini@gmail.com',  estado: 'Inactivo', direccion: 'Cartago, Paraíso' },
    { id: 4, nombre: 'Cafetería Universidad Latina',   identificacion: '3-101-667788', telefono: '2224-5555', correo: 'cafeteria@ulatina.ac.cr',  estado: 'Activo',   direccion: 'San José, Moravia' },
  ],
  proveedores: [
    { id: 1, nombre: 'Distribuidora Nacional S.A.',  identificacion: '3-101-223344', telefono: '2200-5566', correo: 'ventas@disnacional.cr', estado: 'Activo',   direccion: 'San José, Zona Franca' },
    { id: 2, nombre: 'Agro Tico S.A.',               identificacion: '3-101-334455', telefono: '2233-7788', correo: 'pedidos@agrotico.cr',   estado: 'Activo',   direccion: 'Alajuela, Grecia' },
    { id: 3, nombre: 'Importaciones CR LTDA',        identificacion: '3-102-556677', telefono: '2244-9900', correo: 'import@importcr.com',   estado: 'Inactivo', direccion: 'Limón, Puerto' },
    { id: 4, nombre: 'Lácteos del Trópico S.A.',     identificacion: '3-101-778899', telefono: '2299-1122', correo: 'ventas@lacteostt.cr',   estado: 'Activo',   direccion: 'Cartago, Llanos de Santa Lucía' },
  ],
};

window.SGE = { Router, Modal, Toast, DB, fmt, initView };
