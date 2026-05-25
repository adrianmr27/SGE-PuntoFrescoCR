/* Panel principal: KPIs reales + módulos visibles según permisos del rol */
'use strict';

SGE.Router.register('dashboard', () => {
  const mods = SGE.DB.modulos || [];
  const perms = SGE.DB.permisosRol || [];
  const allowed = new Set(perms.filter(p => p.puedeVer).map(p => p.modulo_id));

  const ingresos = (SGE.DB.movFinancieros || []).filter(m => m.tipo === 'Ingreso').reduce((s, m) => s + m.monto, 0);
  const egresos = (SGE.DB.movFinancieros || []).filter(m => m.tipo === 'Egreso').reduce((s, m) => s + m.monto, 0);
  const balance = ingresos - egresos;
  const stockAlerts = (SGE.DB.productos || []).filter(p => p.stock <= p.stock_min && p.estado === 'Activo').length;
  const prodsActivos = (SGE.DB.productos || []).filter(p => p.estado === 'Activo').length;
  const pedidosActivos = (SGE.DB.pedidos || []).filter(p => p.estado !== 'Cancelado').length;
  const licGanadas = (SGE.DB.licitaciones || []).filter(l => l.estado === 'adjudicado').length;

  const meta = [
    { id: 'administrativo', icon: 'bi-building', name: 'Administrativo', bg: 'rgba(28,34,96,.08)', count: 'Config. general' },
    { id: 'roles', icon: 'bi-key', name: 'Roles', bg: 'rgba(93,210,188,.15)', count: `${SGE.DB.roles.length} roles` },
    { id: 'usuarios', icon: 'bi-people', name: 'Usuarios', bg: 'rgba(40,167,69,.1)', count: `${SGE.DB.usuarios.length} usuarios` },
    { id: 'empleados', icon: 'bi-person-badge', name: 'Empleados', bg: 'rgba(255,112,118,.1)', count: `${SGE.DB.empleados.length} empleados` },
    { id: 'clientes', icon: 'bi-globe2', name: 'Clientes', bg: 'rgba(93,210,188,.15)', count: `${SGE.DB.clientes.length} clientes` },
    { id: 'proveedores', icon: 'bi-truck', name: 'Proveedores', bg: 'rgba(28,34,96,.08)', count: `${SGE.DB.proveedores.length} proveedores` },
    { id: 'compras', icon: 'bi-cart3', name: 'Compras', bg: 'rgba(255,112,118,.1)', count: `${(SGE.DB.compras || []).length} órdenes` },
    { id: 'inventario', icon: 'bi-box-seam', name: 'Inventario', bg: 'rgba(93,210,188,.15)', count: `${(SGE.DB.productos || []).length} productos` },
    { id: 'pedidos', icon: 'bi-clipboard-check', name: 'Pedidos', bg: 'rgba(40,167,69,.1)', count: `${(SGE.DB.pedidos || []).length} pedidos` },
    { id: 'licitaciones', icon: 'bi-file-earmark-text', name: 'Licitaciones', bg: 'rgba(28,34,96,.08)', count: `${(SGE.DB.licitaciones || []).length} procesos` },
    { id: 'finanzas', icon: 'bi-cash-stack', name: 'Finanzas', bg: 'rgba(40,167,69,.1)', count: 'Control financiero' },
    { id: 'predicciones', icon: 'bi-cpu', name: 'Predicciones', bg: 'rgba(93,210,188,.15)', count: 'Análisis IA' },
    { id: 'reportes', icon: 'bi-graph-up-arrow', name: 'Reportes', bg: 'rgba(28,34,96,.08)', count: 'Dashboard ejecutivo' }
  ];

  const cardsHtml = meta.map(m => {
    const mod = mods.find(mm => {
      const route = (mm.nombre || '').toLowerCase().replace(/\s+/g, '-');
      return route === m.id || (mm.codigo && String(mm.codigo).toLowerCase() === m.id);
    });
    if (mod && !allowed.has(mod.id)) return '';
    return `
      <div class="module-card" onclick="SGE.Router.navigate('${m.id}')">
        <div class="module-card-icon module-card-icon-bi" style="background:${m.bg}"><i class="bi ${m.icon}" aria-hidden="true"></i></div>
        <div class="module-card-name">${m.name}</div>
        <div class="module-card-count">${m.count}</div>
      </div>`;
  }).filter(Boolean).join('') || '<div style="color:var(--text-muted);">No tiene módulos asignados.</div>';

  const cobrosSnippet = (SGE.DB.cuentasCobrar || []).filter(c => c.estado === 'Pendiente').slice(0, 3).map(c => `
        <div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:.4rem;padding:.4rem .6rem;background:var(--surface-alt);border-radius:6px;">
          <span style="color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:160px;">${c.cliente}</span>
          <span style="font-weight:700;color:var(--navy);flex-shrink:0;margin-left:.5rem;">${SGE.fmt.currency(c.monto)}</span>
        </div>`).join('');

  return `
<div class="page-header">
  <div class="page-title">
    <h2>Panel Principal</h2>
    <p>Vista consolidada con KPI operativos, accesos rápidos y enlaces solo a los módulos que su rol puede ver.</p>
  </div>
  <div class="page-actions">
    <button type="button" class="btn btn-outline" onclick="SGE.Router.navigate('reportes')"><i class="bi bi-clipboard-data me-1" aria-hidden="true"></i> Reportes</button>
    <button type="button" class="btn btn-primary" onclick="SGE.Router.navigate('pedidos')"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i> Nuevo pedido</button>
  </div>
</div>

<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-icon navy stat-icon-bi"><i class="bi bi-box-seam" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${prodsActivos}</div>
      <div class="stat-lbl">Productos activos</div>
      <div class="stat-change ${stockAlerts > 0 ? 'down' : 'up'}">${stockAlerts > 0 ? `${stockAlerts} con stock bajo` : 'Stock saludable'}</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon green stat-icon-bi"><i class="bi bi-cart3" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${pedidosActivos}</div>
      <div class="stat-lbl">Pedidos activos</div>
      <div class="stat-change up">No cancelados</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon teal stat-icon-bi"><i class="bi bi-wallet2" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val" style="font-size:1.1rem;">${SGE.fmt.currency(balance)}</div>
      <div class="stat-lbl">Balance general</div>
      <div class="stat-change ${ingresos >= egresos ? 'up' : 'down'}">${ingresos >= egresos ? 'Superávit' : 'Déficit'}</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon coral stat-icon-bi"><i class="bi bi-trophy" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${licGanadas}</div>
      <div class="stat-lbl">Licitaciones ganadas</div>
      <div class="stat-change up">Estado adjudicado</div>
    </div>
  </div>
</div>

<div class="overview-grid">
  <div class="card">
    <div class="card-header">
      <span class="card-title"><span class="card-title-icon card-title-icon-bi" style="background:rgba(28,34,96,.08)"><i class="bi bi-grid-3x3-gap" aria-hidden="true"></i></span> Módulos del sistema</span>
    </div>
    <div class="card-body">
      <div class="module-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr));">
        ${cardsHtml}
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-title"><span class="card-title-icon card-title-icon-bi" style="background:rgba(40,167,69,.1)"><i class="bi bi-pie-chart" aria-hidden="true"></i></span> Resumen</span>
    </div>
    <div class="card-body" style="padding:1rem 1.5rem;display:flex;flex-direction:column;gap:1rem;">
      <div style="background:var(--surface-alt);border-radius:var(--radius-md);padding:1rem;">
        <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);margin-bottom:.5rem;">Usuarios por rol</div>
        ${SGE.DB.roles.filter(r => r.estado === 'Activo').map(r => `
          <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem;">
            <span style="font-size:.82rem;flex:1;color:var(--text-primary);font-weight:500;">${r.nombre}</span>
            <div style="flex:2;height:6px;background:var(--border);border-radius:99px;overflow:hidden;">
              <div style="height:100%;width:${Math.min(100, r.usuarios * 20)}%;background:var(--teal);border-radius:99px;"></div>
            </div>
            <span style="font-size:.78rem;color:var(--text-muted);min-width:20px;text-align:right;">${r.usuarios}</span>
          </div>`).join('')}
      </div>
      <div class="responsive-grid-2" style="gap:.75rem;">
        <div style="background:rgba(40,167,69,.08);border-radius:var(--radius-md);padding:.85rem;text-align:center;">
          <div style="font-size:1.3rem;font-weight:800;color:var(--green);">${SGE.DB.empleados.filter(e => e.estado === 'Activo').length}</div>
          <div style="font-size:.72rem;color:var(--text-muted);">Empleados activos</div>
        </div>
        <div style="background:rgba(93,210,188,.12);border-radius:var(--radius-md);padding:.85rem;text-align:center;">
          <div style="font-size:1.3rem;font-weight:800;color:#2ca892;">${SGE.DB.proveedores.filter(p => p.estado === 'Activo').length}</div>
          <div style="font-size:.72rem;color:var(--text-muted);">Proveedores activos</div>
        </div>
      </div>
      <div style="padding:.5rem 0 0;border-top:1px solid var(--border);">
        <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);margin-bottom:.6rem;">Finanzas rápidas</div>
        ${[
    { lbl: 'Ingresos', val: ingresos, color: 'var(--green-dark)', icon: 'bi-arrow-down-circle' },
    { lbl: 'Egresos', val: egresos, color: '#c0464b', icon: 'bi-arrow-up-circle' },
    { lbl: 'Balance', val: balance, color: ingresos >= egresos ? 'var(--teal)' : 'var(--coral)', icon: 'bi-scale-balanced' }
  ].map(r => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem;background:var(--surface-alt);border-radius:var(--radius-md);margin-bottom:.5rem;">
          <span style="font-size:.84rem;color:var(--text-secondary);"><i class="bi ${r.icon} me-1" aria-hidden="true"></i>${r.lbl}</span>
          <span style="font-weight:800;font-size:.95rem;color:${r.color};">${SGE.fmt.currency(r.val)}</span>
        </div>`).join('')}
        ${cobrosSnippet ? `
        <div style="margin-top:.25rem;">
          <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);margin-bottom:.6rem;">Cobros próximos a revisar</div>
          ${cobrosSnippet}
        </div>` : ''}
      </div>
    </div>
  </div>
</div>`;
});
