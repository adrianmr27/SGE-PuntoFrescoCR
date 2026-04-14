/* ═══════════════════════════════════════════════════════
   SGE Punto Fresco · Views Part 3
   Finanzas · Predicciones · Reportes
   ═══════════════════════════════════════════════════════ */

/* ── Extended Mock Data ─────────────────────────────── */
Object.assign(SGE.DB, {
  movFinancieros: [
    { id: 'MF-001', fecha: '2024-06-04', tipo: 'Ingreso',  categoria: 'Pedido',          descripcion: 'PED-2024-031 · La Colonia',         monto: 248000, ref: 'PED-2024-031' },
    { id: 'MF-002', fecha: '2024-06-05', tipo: 'Egreso',   categoria: 'Compra',           descripcion: 'OC-2024-041 · Agro Tico S.A.',      monto: 185000, ref: 'OC-2024-041' },
    { id: 'MF-003', fecha: '2024-06-06', tipo: 'Ingreso',  categoria: 'Pedido',           descripcion: 'PED-2024-032 · El Fogón Tico',      monto: 136500, ref: 'PED-2024-032' },
    { id: 'MF-004', fecha: '2024-06-07', tipo: 'Egreso',   categoria: 'Compra',           descripcion: 'OC-2024-042 · Distribuidora Nac.',  monto: 320000, ref: 'OC-2024-042' },
    { id: 'MF-005', fecha: '2024-06-08', tipo: 'Ingreso',  categoria: 'Licitación',       descripcion: 'LIC-2024-001 · CCSS Adjudicado',   monto: 4800000,ref: 'LIC-2024-001' },
    { id: 'MF-006', fecha: '2024-06-09', tipo: 'Egreso',   categoria: 'Servicio',         descripcion: 'Factura electricidad CNFL',          monto: 87500,  ref: 'SERV-001' },
    { id: 'MF-007', fecha: '2024-06-10', tipo: 'Ingreso',  categoria: 'Pedido',           descripcion: 'PED-2024-034 · La Colonia',         monto: 315000, ref: 'PED-2024-034' },
    { id: 'MF-008', fecha: '2024-06-11', tipo: 'Egreso',   categoria: 'Nómina',           descripcion: 'Pago de nómina quincenal',           monto: 1250000,ref: 'NOM-001' },
  ],
  cuentasCobrar: [
    { id: 'CC-001', cliente: 'Supermercados La Colonia S.A.', concepto: 'PED-2024-034', monto: 315000, vencimiento: '2024-06-25', estado: 'Pendiente' },
    { id: 'CC-002', cliente: 'Cafetería Universidad Latina',  concepto: 'PED-2024-033', monto: 89000,  vencimiento: '2024-06-18', estado: 'Pendiente' },
    { id: 'CC-003', cliente: 'Restaurant El Fogón Tico',      concepto: 'PED-2024-032', monto: 136500, vencimiento: '2024-06-10', estado: 'Pagado'    },
    { id: 'CC-004', cliente: 'Mini Super Don Carlos',         concepto: 'PED-2024-030', monto: 54000,  vencimiento: '2024-06-05', estado: 'Vencido'   },
    { id: 'CC-005', cliente: 'CCSS',                          concepto: 'LIC-2024-001', monto: 4800000,vencimiento: '2024-07-15', estado: 'Pendiente' },
  ],
  cuentasPagar: [
    { id: 'CP-001', proveedor: 'Agro Tico S.A.',              concepto: 'OC-2024-043', monto: 95000,   vencimiento: '2024-06-20', estado: 'Pendiente' },
    { id: 'CP-002', proveedor: 'Distribuidora Nacional S.A.', concepto: 'OC-2024-042', monto: 320000,  vencimiento: '2024-06-22', estado: 'Pendiente' },
    { id: 'CP-003', proveedor: 'CNFL',                        concepto: 'Electricidad', monto: 87500,   vencimiento: '2024-06-15', estado: 'Pagado'    },
    { id: 'CP-004', proveedor: 'INS',                         concepto: 'Póliza Riesgos',monto: 145000, vencimiento: '2024-06-08', estado: 'Vencido'   },
    { id: 'CP-005', proveedor: 'Lácteos del Trópico S.A.',    concepto: 'OC-2024-044', monto: 210000,  vencimiento: '2024-07-01', estado: 'Pendiente' },
  ],
  historialClientes: {
    'Supermercados La Colonia S.A.': [
      { mes: 'Ene', productos: ['Tomate Cherry','Lechuga Romana','Queso Gouda'], total: 215000 },
      { mes: 'Feb', productos: ['Tomate Cherry','Pechuga de Pollo','Aceite de Oliva'], total: 298000 },
      { mes: 'Mar', productos: ['Tomate Cherry','Lechuga Romana','Queso Gouda','Yogurt Natural'], total: 334000 },
      { mes: 'Abr', productos: ['Tomate Cherry','Pechuga de Pollo','Queso Gouda'], total: 278000 },
      { mes: 'May', productos: ['Tomate Cherry','Lechuga Romana','Aceite de Oliva'], total: 245000 },
      { mes: 'Jun', productos: ['Tomate Cherry','Pechuga de Pollo','Queso Gouda'], total: 315000 },
    ],
    'Restaurant El Fogón Tico': [
      { mes: 'Ene', productos: ['Pechuga de Pollo','Aceite de Oliva'], total: 98000 },
      { mes: 'Feb', productos: ['Pechuga de Pollo','Queso Gouda'], total: 112000 },
      { mes: 'Mar', productos: ['Pechuga de Pollo','Aceite de Oliva','Arroz Integral'], total: 134000 },
      { mes: 'Abr', productos: ['Pechuga de Pollo','Queso Gouda'], total: 118000 },
      { mes: 'May', productos: ['Pechuga de Pollo','Aceite de Oliva'], total: 105000 },
      { mes: 'Jun', productos: ['Pechuga de Pollo','Queso Gouda','Arroz Integral'], total: 136500 },
    ],
    'Cafetería Universidad Latina': [
      { mes: 'Abr', productos: ['Arroz Integral','Yogurt Natural'], total: 42000 },
      { mes: 'May', productos: ['Arroz Integral','Yogurt Natural','Tomate Cherry'], total: 68000 },
      { mes: 'Jun', productos: ['Arroz Integral','Yogurt Natural','Tomate Cherry'], total: 89000 },
    ],
    'Mini Super Don Carlos': [
      { mes: 'May', productos: ['Tomate Cherry','Lechuga Romana'], total: 38000 },
      { mes: 'Jun', productos: ['Tomate Cherry'], total: 22000 },
    ],
  },
});

/* ══════════════════════════════════════════════════════
   FINANZAS VIEW
   ══════════════════════════════════════════════════════ */
SGE.Router.register('finanzas', () => {
  const hoy = new Date();
  const ingresos = SGE.DB.movFinancieros.filter(m => m.tipo === 'Ingreso').reduce((s, m) => s + m.monto, 0);
  const egresos  = SGE.DB.movFinancieros.filter(m => m.tipo === 'Egreso').reduce((s, m) => s + m.monto, 0);
  const balance  = ingresos - egresos;

  const proxVencer = [
    ...SGE.DB.cuentasCobrar.filter(c => c.estado === 'Pendiente'),
    ...SGE.DB.cuentasPagar.filter(c => c.estado === 'Pendiente'),
  ].filter(c => {
    const dias = Math.ceil((new Date(c.vencimiento) - hoy) / 86400000);
    return dias >= 0 && dias <= 7;
  });

  const vencidos = [
    ...SGE.DB.cuentasCobrar.filter(c => c.estado === 'Vencido'),
    ...SGE.DB.cuentasPagar.filter(c => c.estado === 'Vencido'),
  ];

  return `
<div class="page-header">
  <div class="page-title">
    <h2>Módulo de Finanzas</h2>
    <p>Control financiero, cuentas por cobrar y pagar</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-outline btn-sm" onclick="SGE.Toast.show('Exportando estado financiero...','info')">📄 Exportar PDF</button>
    <button class="btn btn-primary" data-modal="modal-mov-manual">➕ Movimiento Manual</button>
  </div>
</div>

${(proxVencer.length || vencidos.length) ? `
<div class="alert-banner ${vencidos.length ? 'danger' : 'warning'}">
  <span class="alert-banner-icon">${vencidos.length ? '🚨' : '⏰'}</span>
  <div class="alert-banner-body">
    ${vencidos.length ? `<div class="alert-banner-title">${vencidos.length} pago(s)/cobro(s) vencidos sin regularizar</div>` : ''}
    ${proxVencer.length ? `<div class="alert-banner-title">⚠️ ${proxVencer.length} vencimiento(s) en los próximos 7 días</div>` : ''}
    ${proxVencer.map(c => `<span style="margin-right:.75rem;"><strong>${c.cliente || c.proveedor}</strong> — ${SGE.fmt.currency(c.monto)} · vence ${SGE.fmt.date(c.vencimiento)}</span>`).join('')}
  </div>
</div>` : ''}

<!-- Balance Cards -->
<div class="stat-grid" style="grid-template-columns: repeat(3,1fr); margin-bottom:1.5rem;">
  <div class="stat-card" style="border-left: 4px solid var(--green);">
    <div class="stat-icon green">💵</div>
    <div class="stat-info">
      <div class="stat-val" style="font-size:1.2rem;">${SGE.fmt.currency(ingresos)}</div>
      <div class="stat-lbl">Total Ingresos</div>
      <div class="stat-change up">↑ Del período actual</div>
    </div>
  </div>
  <div class="stat-card" style="border-left: 4px solid var(--coral);">
    <div class="stat-icon coral">💸</div>
    <div class="stat-info">
      <div class="stat-val" style="font-size:1.2rem;">${SGE.fmt.currency(egresos)}</div>
      <div class="stat-lbl">Total Egresos</div>
      <div class="stat-change down">↓ Del período actual</div>
    </div>
  </div>
  <div class="stat-card" style="border-left: 4px solid ${balance >= 0 ? 'var(--teal)' : 'var(--coral)'};">
    <div class="stat-icon ${balance >= 0 ? 'teal' : 'coral'}">⚖️</div>
    <div class="stat-info">
      <div class="stat-val" style="font-size:1.2rem; color:${balance >= 0 ? 'var(--green-dark)' : '#c0464b'};">${SGE.fmt.currency(Math.abs(balance))}</div>
      <div class="stat-lbl">Balance General</div>
      <div class="stat-change ${balance >= 0 ? 'up' : 'down'}">${balance >= 0 ? '✅ Superávit' : '⚠️ Déficit'}</div>
    </div>
  </div>
</div>

<div data-tabs>
  <div class="tabs">
    <button class="tab-btn active" data-tab="fin-tab-movs">📊 Movimientos</button>
    <button class="tab-btn" data-tab="fin-tab-cobrar">📥 Por Cobrar</button>
    <button class="tab-btn" data-tab="fin-tab-pagar">📤 Por Pagar</button>
  </div>

  <!-- Movimientos Financieros -->
  <div class="tab-panel active" id="fin-tab-movs">
    <div class="filter-bar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input class="search-input" placeholder="Buscar descripción o referencia..." data-table="movs-fin-table">
      </div>
      <select class="filter-select" data-table="movs-fin-table" data-col="2">
        <option value="">Ingreso / Egreso</option>
        <option>Ingreso</option><option>Egreso</option>
      </select>
      <select class="filter-select" data-table="movs-fin-table" data-col="3">
        <option value="">Todas las categorías</option>
        <option>Pedido</option><option>Compra</option><option>Licitación</option><option>Servicio</option><option>Nómina</option>
      </select>
      <input type="date" class="filter-select" title="Fecha desde">
      <input type="date" class="filter-select" title="Fecha hasta">
    </div>
    <div class="card">
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table id="movs-fin-table">
            <thead><tr>
              <th>ID</th><th>Fecha</th><th>Tipo</th><th>Categoría</th><th>Descripción</th><th>Referencia</th><th>Monto</th>
            </tr></thead>
            <tbody>
              ${SGE.DB.movFinancieros.map(m => `
              <tr>
                <td><code style="font-size:.75rem;background:var(--surface-alt);padding:1px 5px;border-radius:3px;">${m.id}</code></td>
                <td style="font-size:.82rem;color:var(--text-muted);">${SGE.fmt.date(m.fecha)}</td>
                <td><span class="badge ${m.tipo==='Ingreso'?'badge-active':'badge-danger'}">${m.tipo}</span></td>
                <td><span class="badge badge-navy">${m.categoria}</span></td>
                <td style="font-size:.83rem;">${m.descripcion}</td>
                <td><code style="font-size:.75rem;color:var(--text-muted);">${m.ref}</code></td>
                <td style="font-weight:700;color:${m.tipo==='Ingreso'?'var(--green-dark)':'#c0464b'};">
                  ${m.tipo==='Ingreso'?'+':'−'}${SGE.fmt.currency(m.monto)}
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer" style="display:flex;justify-content:flex-end;gap:2rem;font-size:.85rem;">
        <span>Total Ingresos: <strong style="color:var(--green-dark);">${SGE.fmt.currency(ingresos)}</strong></span>
        <span>Total Egresos: <strong style="color:#c0464b;">${SGE.fmt.currency(egresos)}</strong></span>
        <span>Balance: <strong style="color:${balance>=0?'var(--green-dark)':'#c0464b'};">${SGE.fmt.currency(balance)}</strong></span>
      </div>
    </div>
  </div>

  <!-- Cuentas por Cobrar -->
  <div class="tab-panel" id="fin-tab-cobrar">
    <div class="filter-bar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input class="search-input" placeholder="Buscar cliente o concepto..." data-table="cobrar-table">
      </div>
      <select class="filter-select" data-table="cobrar-table" data-col="3">
        <option value="">Todos los estados</option>
        <option>Pendiente</option><option>Pagado</option><option>Vencido</option>
      </select>
      <button class="btn btn-primary btn-sm" data-modal="modal-cuenta-cobrar">➕ Nueva Cuenta</button>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table id="cobrar-table">
            <thead><tr>
              <th>ID</th><th>Cliente</th><th>Concepto</th><th>Estado</th><th>Vencimiento</th><th>Monto</th><th>Acciones</th>
            </tr></thead>
            <tbody>
              ${SGE.DB.cuentasCobrar.map(c => {
                const dias = Math.ceil((new Date(c.vencimiento) - new Date()) / 86400000);
                const diasLabel = c.estado==='Pendiente' && dias >= 0 ? `<div style="font-size:.7rem;color:${dias<=3?'var(--coral)':'var(--text-muted)'};">${dias}d restantes</div>` : '';
                const eCls = {Pendiente:'badge-pending',Pagado:'badge-active',Vencido:'badge-danger'}[c.estado];
                return `<tr>
                  <td><code style="font-size:.75rem;">${c.id}</code></td>
                  <td class="td-name">${c.cliente}</td>
                  <td style="font-size:.82rem;">${c.concepto}</td>
                  <td><span class="badge ${eCls}">${c.estado}</span></td>
                  <td style="font-size:.82rem;">${SGE.fmt.date(c.vencimiento)}${diasLabel}</td>
                  <td style="font-weight:700;color:var(--navy);">${SGE.fmt.currency(c.monto)}</td>
                  <td>
                    <div class="flex gap-1">
                      ${c.estado==='Pendiente'||c.estado==='Vencido'?`
                      <button class="btn btn-success btn-sm" onclick="SGE.Fin.marcarPagado('cobrar','${c.id}')">✅ Cobrado</button>`:
                      `<span style="font-size:.78rem;color:var(--text-muted);">—</span>`}
                    </div>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer" style="display:flex;justify-content:space-between;font-size:.85rem;align-items:center;">
        <span style="color:var(--text-muted);">${SGE.DB.cuentasCobrar.filter(c=>c.estado==='Pendiente').length} pendientes · ${SGE.DB.cuentasCobrar.filter(c=>c.estado==='Vencido').length} vencidas</span>
        <span>Total por cobrar: <strong style="color:var(--navy);">${SGE.fmt.currency(SGE.DB.cuentasCobrar.filter(c=>c.estado!=='Pagado').reduce((s,c)=>s+c.monto,0))}</strong></span>
      </div>
    </div>
  </div>

  <!-- Cuentas por Pagar -->
  <div class="tab-panel" id="fin-tab-pagar">
    <div class="filter-bar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input class="search-input" placeholder="Buscar proveedor o concepto..." data-table="pagar-table">
      </div>
      <select class="filter-select" data-table="pagar-table" data-col="3">
        <option value="">Todos los estados</option>
        <option>Pendiente</option><option>Pagado</option><option>Vencido</option>
      </select>
      <button class="btn btn-primary btn-sm" data-modal="modal-cuenta-pagar">➕ Nueva Cuenta</button>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table id="pagar-table">
            <thead><tr>
              <th>ID</th><th>Proveedor / Servicio</th><th>Concepto</th><th>Estado</th><th>Vencimiento</th><th>Monto</th><th>Acciones</th>
            </tr></thead>
            <tbody>
              ${SGE.DB.cuentasPagar.map(c => {
                const dias = Math.ceil((new Date(c.vencimiento) - new Date()) / 86400000);
                const diasLabel = c.estado==='Pendiente' && dias >= 0 ? `<div style="font-size:.7rem;color:${dias<=3?'var(--coral)':'var(--text-muted)'};">${dias}d restantes</div>` : '';
                const eCls = {Pendiente:'badge-pending',Pagado:'badge-active',Vencido:'badge-danger'}[c.estado];
                return `<tr>
                  <td><code style="font-size:.75rem;">${c.id}</code></td>
                  <td class="td-name">${c.proveedor}</td>
                  <td style="font-size:.82rem;">${c.concepto}</td>
                  <td><span class="badge ${eCls}">${c.estado}</span></td>
                  <td style="font-size:.82rem;">${SGE.fmt.date(c.vencimiento)}${diasLabel}</td>
                  <td style="font-weight:700;color:#c0464b;">${SGE.fmt.currency(c.monto)}</td>
                  <td>
                    <div class="flex gap-1">
                      ${c.estado==='Pendiente'||c.estado==='Vencido'?`
                      <button class="btn btn-success btn-sm" onclick="SGE.Fin.marcarPagado('pagar','${c.id}')">✅ Pagado</button>`:
                      `<span style="font-size:.78rem;color:var(--text-muted);">—</span>`}
                    </div>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer" style="display:flex;justify-content:space-between;font-size:.85rem;align-items:center;">
        <span style="color:var(--text-muted);">${SGE.DB.cuentasPagar.filter(c=>c.estado==='Pendiente').length} pendientes · ${SGE.DB.cuentasPagar.filter(c=>c.estado==='Vencido').length} vencidas</span>
        <span>Total por pagar: <strong style="color:#c0464b;">${SGE.fmt.currency(SGE.DB.cuentasPagar.filter(c=>c.estado!=='Pagado').reduce((s,c)=>s+c.monto,0))}</strong></span>
      </div>
    </div>
  </div>
</div>

<!-- Modal: Movimiento Manual -->
<div class="modal-overlay" id="modal-mov-manual">
  <div class="modal modal-sm">
    <div class="modal-header">
      <span class="modal-title">💰 Registrar Movimiento Manual</span>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-grid cols-1">
        <div class="form-group">
          <label class="form-label">Tipo <span>*</span></label>
          <select class="form-control">
            <option>Ingreso</option><option>Egreso</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Categoría <span>*</span></label>
          <select class="form-control">
            <option>Pedido</option><option>Compra</option><option>Licitación</option><option>Servicio</option><option>Nómina</option><option>Otro</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Descripción <span>*</span></label>
          <input class="form-control" placeholder="Detalle del movimiento">
        </div>
        <div class="form-group">
          <label class="form-label">Monto (₡) <span>*</span></label>
          <input class="form-control" type="number" min="0" placeholder="0.00">
        </div>
        <div class="form-group">
          <label class="form-label">Fecha <span>*</span></label>
          <input class="form-control" type="date" value="${new Date().toISOString().split('T')[0]}">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button class="btn btn-primary" onclick="SGE.Modal.close('modal-mov-manual'); SGE.Toast.show('Movimiento registrado')">💾 Guardar</button>
    </div>
  </div>
</div>

<!-- Modal: Cuenta por Cobrar -->
<div class="modal-overlay" id="modal-cuenta-cobrar">
  <div class="modal modal-sm">
    <div class="modal-header">
      <span class="modal-title">📥 Nueva Cuenta por Cobrar</span>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-grid cols-1">
        <div class="form-group">
          <label class="form-label">Cliente <span>*</span></label>
          <select class="form-control">
            <option value="">Seleccione...</option>
            ${SGE.DB.clientes.map(c=>`<option>${c.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Concepto / Referencia</label>
          <input class="form-control" placeholder="Ej: PED-2024-036">
        </div>
        <div class="form-group">
          <label class="form-label">Monto (₡) <span>*</span></label>
          <input class="form-control" type="number" min="0" placeholder="0.00">
        </div>
        <div class="form-group">
          <label class="form-label">Fecha de Vencimiento <span>*</span></label>
          <input class="form-control" type="date">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button class="btn btn-primary" onclick="SGE.Modal.close('modal-cuenta-cobrar'); SGE.Toast.show('Cuenta por cobrar registrada')">💾 Guardar</button>
    </div>
  </div>
</div>

<!-- Modal: Cuenta por Pagar -->
<div class="modal-overlay" id="modal-cuenta-pagar">
  <div class="modal modal-sm">
    <div class="modal-header">
      <span class="modal-title">📤 Nueva Cuenta por Pagar</span>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-grid cols-1">
        <div class="form-group">
          <label class="form-label">Proveedor / Servicio <span>*</span></label>
          <select class="form-control">
            <option value="">Seleccione...</option>
            ${SGE.DB.proveedores.map(p=>`<option>${p.nombre}</option>`).join('')}
            <option>CNFL</option><option>AyA</option><option>ICE</option><option>INS</option><option>Otro</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Concepto / Referencia</label>
          <input class="form-control" placeholder="Ej: OC-2024-045 / Factura luz">
        </div>
        <div class="form-group">
          <label class="form-label">Monto (₡) <span>*</span></label>
          <input class="form-control" type="number" min="0" placeholder="0.00">
        </div>
        <div class="form-group">
          <label class="form-label">Fecha de Vencimiento <span>*</span></label>
          <input class="form-control" type="date">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button class="btn btn-primary" onclick="SGE.Modal.close('modal-cuenta-pagar'); SGE.Toast.show('Cuenta por pagar registrada')">💾 Guardar</button>
    </div>
  </div>
</div>
`;
});

/* ══════════════════════════════════════════════════════
   PREDICCIONES VIEW
   ══════════════════════════════════════════════════════ */
SGE.Router.register('predicciones', () => {
  const clientes = Object.keys(SGE.DB.historialClientes);

  // Analyze patterns: find most recurring products per client
  const analizar = (cliente) => {
    const historial = SGE.DB.historialClientes[cliente] || [];
    const conteo = {};
    historial.forEach(mes => {
      mes.productos.forEach(p => { conteo[p] = (conteo[p] || 0) + 1; });
    });
    const total = historial.length;
    return Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])
      .map(([prod, count]) => ({ prod, count, pct: Math.round((count / total) * 100) }));
  };

  const primeraCliente = clientes[0];
  const patronesPrimero = analizar(primeraCliente);

  return `
<div class="page-header">
  <div class="page-title">
    <h2>Módulo de Predicciones</h2>
    <p>Análisis automático de patrones de compra y predicción de demanda</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-outline btn-sm" onclick="SGE.Toast.show('Exportando reporte de predicciones...','info')">📄 Exportar</button>
  </div>
</div>

<!-- Selector de cliente -->
<div class="card" style="margin-bottom:1.25rem;">
  <div class="card-body" style="padding:1.1rem 1.5rem;">
    <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
      <div style="font-weight:700;color:var(--navy);font-size:.9rem;">🔍 Analizar cliente:</div>
      <select class="filter-select" id="pred-cliente-sel" onchange="SGE.Pre.loadCliente(this.value)" style="min-width:260px;">
        ${clientes.map((c,i) => `<option value="${c}" ${i===0?'selected':''}>${c}</option>`).join('')}
      </select>
      <div style="margin-left:auto;font-size:.8rem;color:var(--text-muted);">
        📊 Análisis basado en historial de compras registrado
      </div>
    </div>
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1.4fr;gap:1.25rem;" id="pred-content">
  ${SGE.Pre.renderClientePanel(primeraCliente)}
</div>
`;
});

/* ══════════════════════════════════════════════════════
   REPORTES VIEW
   ══════════════════════════════════════════════════════ */
SGE.Router.register('reportes', () => {
  const ingresos = SGE.DB.movFinancieros.filter(m=>m.tipo==='Ingreso').reduce((s,m)=>s+m.monto,0);
  const egresos  = SGE.DB.movFinancieros.filter(m=>m.tipo==='Egreso').reduce((s,m)=>s+m.monto,0);

  return `
<div class="page-header">
  <div class="page-title">
    <h2>Módulo de Reportes</h2>
    <p>Dashboard ejecutivo y generación de reportes estratégicos</p>
  </div>
  <div class="page-actions">
    <select class="filter-select" id="rep-periodo" onchange="SGE.Rep.updatePeriod(this.value)">
      <option value="semanal">Semanal</option>
      <option value="quincenal">Quincenal</option>
      <option value="mensual" selected>Mensual</option>
    </select>
    <button class="btn btn-outline btn-sm" onclick="SGE.Rep.export('excel')">📊 Excel</button>
    <button class="btn btn-outline btn-sm" onclick="SGE.Rep.export('pdf')">📄 PDF</button>
  </div>
</div>

<!-- KPIs Ejecutivos -->
<div class="stat-grid" style="grid-template-columns:repeat(4,1fr);">
  <div class="stat-card">
    <div class="stat-icon green">💰</div>
    <div class="stat-info">
      <div class="stat-val" style="font-size:1.1rem;">${SGE.fmt.currency(ingresos)}</div>
      <div class="stat-lbl">Ingresos del Período</div>
      <div class="stat-change up">↑ 18% vs período ant.</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon navy">📋</div>
    <div class="stat-info">
      <div class="stat-val">${SGE.DB.pedidos.filter(p=>p.estado!=='Cancelado').length}</div>
      <div class="stat-lbl">Pedidos Activos</div>
      <div class="stat-change up">↑ 3 nuevos esta semana</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon teal">📦</div>
    <div class="stat-info">
      <div class="stat-val">${SGE.DB.productos.filter(p=>p.estado==='Activo').length}</div>
      <div class="stat-lbl">Productos en Stock</div>
      <div class="stat-change down">↓ 3 con stock bajo</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon coral">📑</div>
    <div class="stat-info">
      <div class="stat-val">${SGE.DB.licitaciones.filter(l=>l.estado==='adjudicado').length}</div>
      <div class="stat-lbl">Licitaciones Adjudicadas</div>
      <div class="stat-change up">↑ ${SGE.fmt.currency(SGE.DB.licitaciones.filter(l=>l.estado==='adjudicado').reduce((s,l)=>s+l.total,0))}</div>
    </div>
  </div>
</div>

<div data-tabs>
  <div class="tabs">
    <button class="tab-btn active" data-tab="rep-tab-ventas">📈 Ventas</button>
    <button class="tab-btn" data-tab="rep-tab-inventario">📦 Inventario</button>
    <button class="tab-btn" data-tab="rep-tab-licitaciones">📑 Licitaciones</button>
    <button class="tab-btn" data-tab="rep-tab-predicciones">🤖 Predicciones</button>
  </div>

  <!-- Reporte Ventas -->
  <div class="tab-panel active" id="rep-tab-ventas">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;">

      <div class="card">
        <div class="card-header">
          <span class="card-title">📈 Ventas por Período</span>
          <button class="btn btn-ghost btn-sm" onclick="SGE.Rep.export('excel')">⬇️ Excel</button>
        </div>
        <div class="card-body" style="padding:.75rem 1.5rem;">
          ${[
            {mes:'Enero',   val:215000, max:400000},
            {mes:'Febrero', val:298000, max:400000},
            {mes:'Marzo',   val:334000, max:400000},
            {mes:'Abril',   val:278000, max:400000},
            {mes:'Mayo',    val:245000, max:400000},
            {mes:'Junio',   val:315000, max:400000},
          ].map(r => `
          <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.65rem;">
            <span style="font-size:.78rem;font-weight:600;color:var(--text-muted);width:55px;">${r.mes}</span>
            <div style="flex:1;height:10px;background:var(--border);border-radius:99px;overflow:hidden;">
              <div style="height:100%;width:${Math.round((r.val/r.max)*100)}%;background:linear-gradient(90deg,var(--navy),var(--teal));border-radius:99px;"></div>
            </div>
            <span style="font-size:.8rem;font-weight:700;color:var(--navy);min-width:80px;text-align:right;">${SGE.fmt.currency(r.val)}</span>
          </div>`).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">🏪 Ventas por Cliente</span>
          <button class="btn btn-ghost btn-sm" onclick="SGE.Rep.export('pdf')">⬇️ PDF</button>
        </div>
        <div class="card-body" style="padding:0;">
          <table>
            <thead><tr><th>Cliente</th><th>Pedidos</th><th>Total</th><th>%</th></tr></thead>
            <tbody>
              ${[
                {c:'La Colonia S.A.',    n:12, total:1245000},
                {c:'Cafetería ULatina', n:8,  total:560000},
                {c:'El Fogón Tico',     n:6,  total:384500},
                {c:'Mini Super Don C.', n:3,  total:114000},
              ].map((r,i,arr) => {
                const tot = arr.reduce((s,x)=>s+x.total,0);
                return `<tr>
                  <td class="td-name">${r.c}</td>
                  <td>${r.n}</td>
                  <td style="font-weight:700;">${SGE.fmt.currency(r.total)}</td>
                  <td><span class="badge badge-info">${Math.round((r.total/tot)*100)}%</span></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card" style="grid-column:1/-1;">
        <div class="card-header">
          <span class="card-title">📦 Productos Más Vendidos del Período</span>
          <button class="btn btn-ghost btn-sm" onclick="SGE.Rep.export('excel')">⬇️ Excel</button>
        </div>
        <div class="card-body" style="padding:0;">
          <table>
            <thead><tr><th>#</th><th>Producto</th><th>Categoría</th><th>Unidades</th><th>Ingresos</th><th>Margen</th></tr></thead>
            <tbody>
              ${[
                {n:'Tomate Cherry',    cat:'Vegetales', u:87, ing:104400, mg:29},
                {n:'Pechuga de Pollo', cat:'Carnes',    u:55, ing:231000, mg:33},
                {n:'Queso Gouda',      cat:'Lácteos',   u:42, ing:201600, mg:33},
                {n:'Aceite de Oliva',  cat:'Aceites',   u:38, ing:247000, mg:31},
                {n:'Lechuga Romana',   cat:'Vegetales', u:64, ing:57600,  mg:33},
              ].map((r,i)=>`
              <tr>
                <td style="color:var(--text-muted)">${i+1}</td>
                <td class="td-name">${r.n}</td>
                <td><span class="badge badge-info">${r.cat}</span></td>
                <td style="font-weight:600;">${r.u} uds.</td>
                <td style="font-weight:700;color:var(--navy);">${SGE.fmt.currency(r.ing)}</td>
                <td><span class="badge badge-active">${r.mg}%</span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Reporte Inventario -->
  <div class="tab-panel" id="rep-tab-inventario">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;">
      <div class="card">
        <div class="card-header">
          <span class="card-title">📦 Estado del Inventario</span>
          <button class="btn btn-ghost btn-sm" onclick="SGE.Rep.export('excel')">⬇️ Excel</button>
        </div>
        <div class="card-body" style="padding:0;">
          <table>
            <thead><tr><th>Producto</th><th>Stock</th><th>Mín.</th><th>Valor</th><th>Alerta</th></tr></thead>
            <tbody>
              ${SGE.DB.productos.map(p=>`
              <tr>
                <td class="td-name">${p.nombre}<div class="td-sub">${p.categoria}</div></td>
                <td style="font-weight:700;">${p.stock}</td>
                <td style="color:var(--text-muted);">${p.stock_min}</td>
                <td>${SGE.fmt.currency(p.precio_venta*p.stock)}</td>
                <td>${p.stock<=0?'<span class="badge badge-danger">Sin stock</span>':p.stock<=p.stock_min?'<span class="badge badge-pending">Bajo</span>':'<span class="badge badge-active">OK</span>'}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="card-footer" style="font-size:.84rem;text-align:right;">
          Valor total en inventario: <strong>${SGE.fmt.currency(SGE.DB.productos.reduce((s,p)=>s+p.precio_venta*p.stock,0))}</strong>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">📊 Distribución por Categoría</span>
        </div>
        <div class="card-body">
          ${[...new Set(SGE.DB.productos.map(p=>p.categoria))].map(cat => {
            const prods = SGE.DB.productos.filter(p=>p.categoria===cat);
            const totalStock = prods.reduce((s,p)=>s+p.stock,0);
            const totalVal = prods.reduce((s,p)=>s+p.precio_venta*p.stock,0);
            const maxStock = 200;
            return `
            <div style="margin-bottom:1rem;">
              <div style="display:flex;justify-content:space-between;margin-bottom:.35rem;font-size:.83rem;">
                <span style="font-weight:700;">${cat}</span>
                <span style="color:var(--text-muted);">${prods.length} prod. · ${totalStock} uds. · ${SGE.fmt.currency(totalVal)}</span>
              </div>
              <div style="height:8px;background:var(--border);border-radius:99px;overflow:hidden;">
                <div style="height:100%;width:${Math.min(Math.round((totalStock/maxStock)*100),100)}%;background:linear-gradient(90deg,var(--teal),var(--green));border-radius:99px;"></div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- Reporte Licitaciones -->
  <div class="tab-panel" id="rep-tab-licitaciones">
    <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:1.25rem;">
      <div class="card">
        <div class="card-header">
          <span class="card-title">📑 Resumen de Licitaciones</span>
          <button class="btn btn-ghost btn-sm" onclick="SGE.Rep.export('pdf')">⬇️ PDF</button>
        </div>
        <div class="card-body" style="padding:0;">
          <table>
            <thead><tr><th>Código</th><th>Institución</th><th>Estado</th><th>Monto</th></tr></thead>
            <tbody>
              ${SGE.DB.licitaciones.map(l=>{
                const cls={analisis:'lic-analisis',preparacion:'lic-preparacion',enviada:'lic-enviada',adjudicado:'lic-adjudicado','no-adj':'lic-no-adj'}[l.estado];
                const lbl={analisis:'Análisis',preparacion:'Preparación',enviada:'Enviada',adjudicado:'Adjudicado','no-adj':'No Adj.'}[l.estado];
                return `<tr>
                  <td><code style="font-size:.75rem;">${l.id}</code></td>
                  <td class="td-name">${l.institucion}</td>
                  <td><span class="lic-status-badge ${cls}" style="font-size:.7rem;">${lbl}</span></td>
                  <td style="font-weight:700;">${SGE.fmt.currency(l.total)}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div class="card-footer" style="font-size:.84rem;display:flex;justify-content:space-between;">
          <span>Adjudicadas: <strong style="color:var(--green-dark);">${SGE.DB.licitaciones.filter(l=>l.estado==='adjudicado').length}</strong></span>
          <span>Total adjudicado: <strong style="color:var(--navy);">${SGE.fmt.currency(SGE.DB.licitaciones.filter(l=>l.estado==='adjudicado').reduce((s,l)=>s+l.total,0))}</strong></span>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">📊 Por Estado</span></div>
        <div class="card-body">
          ${[
            {label:'Adjudicado',    key:'adjudicado',  color:'var(--green)'},
            {label:'Oferta Enviada',key:'enviada',     color:'var(--teal)'},
            {label:'En Preparación',key:'preparacion', color:'#f59e0b'},
            {label:'En Análisis',   key:'analisis',    color:'var(--navy)'},
            {label:'No Adjudicado', key:'no-adj',      color:'var(--coral)'},
          ].map(s=>{
            const count = SGE.DB.licitaciones.filter(l=>l.estado===s.key).length;
            const pct = Math.round((count/SGE.DB.licitaciones.length)*100);
            return `
            <div style="margin-bottom:.85rem;">
              <div style="display:flex;justify-content:space-between;font-size:.82rem;margin-bottom:.3rem;">
                <span style="font-weight:600;">${s.label}</span>
                <span style="color:var(--text-muted);">${count} (${pct}%)</span>
              </div>
              <div style="height:8px;background:var(--border);border-radius:99px;overflow:hidden;">
                <div style="height:100%;width:${pct}%;background:${s.color};border-radius:99px;"></div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- Reporte Predicciones -->
  <div class="tab-panel" id="rep-tab-predicciones">
    <div class="filter-bar">
      <select class="filter-select" style="min-width:240px;">
        <option value="">Todos los clientes</option>
        ${Object.keys(SGE.DB.historialClientes).map(c=>`<option>${c}</option>`).join('')}
      </select>
      <select class="filter-select">
        <option>Último trimestre</option>
        <option>Últimos 6 meses</option>
        <option>Último año</option>
      </select>
      <button class="btn btn-outline btn-sm" onclick="SGE.Rep.export('excel')">📊 Exportar</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;">
      ${Object.entries(SGE.DB.historialClientes).map(([cli, hist]) => {
        const conteo = {};
        hist.forEach(m=>m.productos.forEach(p=>{ conteo[p]=(conteo[p]||0)+1; }));
        const top3 = Object.entries(conteo).sort((a,b)=>b[1]-a[1]).slice(0,3);
        const totalPeriodo = hist.reduce((s,m)=>s+m.total,0);
        return `
        <div class="card">
          <div class="card-header">
            <span class="card-title" style="font-size:.85rem;">🤖 ${cli}</span>
            <span class="badge badge-teal" style="background:var(--teal-light);color:#2ca892;">IA</span>
          </div>
          <div class="card-body">
            <div style="margin-bottom:.85rem;font-size:.8rem;color:var(--text-muted);">
              Historial: ${hist.length} meses · Compra prom: ${SGE.fmt.currency(Math.round(totalPeriodo/hist.length))}
            </div>
            <div style="font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);margin-bottom:.5rem;">
              Predicción próximo pedido
            </div>
            ${top3.map(([prod,cnt],i)=>`
            <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.5rem;font-size:.83rem;">
              <span style="width:18px;height:18px;border-radius:50%;background:${i===0?'var(--green)':i===1?'var(--teal)':'var(--navy)'};color:white;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;flex-shrink:0;">${i+1}</span>
              <span style="flex:1;font-weight:500;">${prod}</span>
              <span class="badge badge-active" style="font-size:.68rem;">${Math.round((cnt/hist.length)*100)}% prob.</span>
            </div>`).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>
</div>
`;
});

/* ══════════════════════════════════════════════════════
   HANDLERS — Finanzas
   ══════════════════════════════════════════════════════ */
SGE.Fin = {
  marcarPagado: (tipo, id) => {
    const lista = tipo === 'cobrar' ? SGE.DB.cuentasCobrar : SGE.DB.cuentasPagar;
    const item = lista.find(c => c.id === id);
    if (item) item.estado = 'Pagado';
    SGE.Toast.show(tipo === 'cobrar' ? 'Cobro registrado exitosamente' : 'Pago registrado exitosamente');
    SGE.Router.navigate('dashboard');
    setTimeout(() => SGE.Router.navigate('finanzas'), 50);
  },
};

/* ══════════════════════════════════════════════════════
   HANDLERS — Predicciones
   ══════════════════════════════════════════════════════ */
SGE.Pre = {
  renderClientePanel: (cliente) => {
    const historial = SGE.DB.historialClientes[cliente] || [];
    if (!historial.length) return '<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-title">Sin historial</div></div>';

    const conteo = {};
    historial.forEach(mes => mes.productos.forEach(p => { conteo[p] = (conteo[p] || 0) + 1; }));
    const patrones = Object.entries(conteo).sort((a,b)=>b[1]-a[1]);
    const totalMeses = historial.length;
    const promMensual = Math.round(historial.reduce((s,m)=>s+m.total,0) / totalMeses);
    const tendencia = historial.slice(-3).reduce((s,m)=>s+m.total,0) > historial.slice(0,3).reduce((s,m)=>s+m.total,0) ? 'Creciente ↑' : 'Estable →';

    return `
    <!-- Panel Izq: Historial + Patrones -->
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="card">
        <div class="card-header">
          <span class="card-title">📊 Historial de Compras — <span style="font-size:.82rem;font-weight:400;color:var(--text-muted);">${cliente}</span></span>
        </div>
        <div class="card-body" style="padding:.75rem 1.5rem;">
          ${historial.map(m=>`
          <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.6rem;font-size:.83rem;">
            <span style="font-weight:700;color:var(--text-muted);width:40px;">${m.mes}</span>
            <div style="flex:1;height:10px;background:var(--border);border-radius:99px;overflow:hidden;">
              <div style="height:100%;width:${Math.round((m.total/500000)*100)}%;background:linear-gradient(90deg,var(--navy),var(--teal));border-radius:99px;"></div>
            </div>
            <span style="font-weight:700;color:var(--navy);min-width:90px;text-align:right;">${SGE.fmt.currency(m.total)}</span>
          </div>`).join('')}
          <div style="border-top:1px solid var(--border);padding-top:.75rem;margin-top:.5rem;font-size:.82rem;display:flex;gap:2rem;">
            <span style="color:var(--text-muted);">Promedio mensual: <strong>${SGE.fmt.currency(promMensual)}</strong></span>
            <span style="color:var(--text-muted);">Tendencia: <strong style="color:${tendencia.includes('↑')?'var(--green-dark)':'var(--text-secondary)'};">${tendencia}</strong></span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">🔁 Productos Recurrentes</span>
        </div>
        <div class="card-body" style="padding:1rem 1.5rem;">
          ${patrones.map(([prod, cnt]) => {
            const pct = Math.round((cnt/totalMeses)*100);
            return `
            <div style="margin-bottom:.85rem;">
              <div style="display:flex;justify-content:space-between;font-size:.83rem;margin-bottom:.3rem;">
                <span style="font-weight:600;">${prod}</span>
                <span style="color:var(--text-muted);">${cnt}/${totalMeses} meses · <strong style="color:var(--navy);">${pct}%</strong></span>
              </div>
              <div style="height:7px;background:var(--border);border-radius:99px;overflow:hidden;">
                <div style="height:100%;width:${pct}%;background:${pct>=70?'var(--green)':pct>=40?'var(--teal)':'var(--border-strong)'};border-radius:99px;"></div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Panel Der: Predicción IA -->
    <div class="card" style="align-self:start;">
      <div class="card-header" style="background:linear-gradient(135deg,var(--navy),#2d3690);border-radius:var(--radius-lg) var(--radius-lg) 0 0;">
        <span class="card-title" style="color:white;">🤖 Predicción — Próximo Pedido</span>
        <span style="font-size:.7rem;background:rgba(93,210,188,.25);color:var(--teal);padding:2px 8px;border-radius:99px;font-weight:700;">IA</span>
      </div>
      <div class="card-body">
        <div style="background:var(--surface-alt);border-radius:var(--radius-md);padding:.85rem;margin-bottom:1.1rem;font-size:.83rem;color:var(--text-secondary);">
          Basado en <strong>${totalMeses} meses</strong> de historial. El modelo detectó patrones de compra consistentes para este cliente.
        </div>

        <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);margin-bottom:.75rem;">
          Productos predichos (probabilidad)
        </div>

        ${patrones.slice(0,5).map(([prod, cnt], i) => {
          const pct = Math.round((cnt/totalMeses)*100);
          const conf = pct >= 70 ? {lbl:'Alta', cls:'badge-active'} : pct >= 40 ? {lbl:'Media', cls:'badge-info'} : {lbl:'Baja', cls:'badge-inactive'};
          return `
          <div style="display:flex;align-items:center;gap:.85rem;padding:.7rem;background:var(--surface-alt);border-radius:var(--radius-sm);margin-bottom:.5rem;border-left:3px solid ${pct>=70?'var(--green)':pct>=40?'var(--teal)':'var(--border-strong)'};">
            <div style="width:32px;height:32px;border-radius:50%;background:${pct>=70?'rgba(40,167,69,.15)':pct>=40?'rgba(93,210,188,.2)':'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:800;color:${pct>=70?'var(--green-dark)':pct>=40?'#2ca892':'var(--text-muted)'};flex-shrink:0;">${i+1}</div>
            <div style="flex:1;">
              <div style="font-weight:700;font-size:.85rem;margin-bottom:2px;">${prod}</div>
              <div style="font-size:.72rem;color:var(--text-muted);">Presente en ${cnt} de ${totalMeses} pedidos</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:1rem;font-weight:800;color:var(--navy);">${pct}%</div>
              <span class="badge ${conf.cls}" style="font-size:.65rem;">${conf.lbl}</span>
            </div>
          </div>`;
        }).join('')}

        <div style="margin-top:1.1rem;padding:.85rem;background:rgba(93,210,188,.08);border:1px solid rgba(93,210,188,.25);border-radius:var(--radius-md);font-size:.82rem;">
          <div style="font-weight:700;color:var(--navy);margin-bottom:.35rem;">💡 Recomendación de Inventario</div>
          <div style="color:var(--text-secondary);">
            Asegúrese de tener stock suficiente de <strong>${patrones.slice(0,2).map(([p])=>p).join(' y ')}</strong> para el próximo pedido de este cliente.
          </div>
        </div>

        <button class="btn btn-outline w-full" style="margin-top:1rem;justify-content:center;" onclick="SGE.Toast.show('Reporte de predicción exportado','info')">
          📄 Exportar Predicción
        </button>
      </div>
    </div>`;
  },

  loadCliente: (cliente) => {
    const content = document.getElementById('pred-content');
    if (!content) return;
    content.innerHTML = SGE.Pre.renderClientePanel(cliente);
    SGE.initView('predicciones');
  },
};

/* ══════════════════════════════════════════════════════
   HANDLERS — Reportes
   ══════════════════════════════════════════════════════ */
SGE.Rep = {
  export: (tipo) => {
    const periodo = document.getElementById('rep-periodo')?.value || 'mensual';
    SGE.Toast.show(`Generando reporte ${tipo.toUpperCase()} — período ${periodo}...`, 'info');
  },
  updatePeriod: (periodo) => {
    SGE.Toast.show(`Datos actualizados al período: ${periodo}`, 'info');
  },
};

/* ── Also update dashboard module-grid with Finanzas / Pred / Reportes ── */
const _origDashboard = SGE.Router._views?.dashboard;
SGE.Router.register('dashboard', async () => {
  const base = await (async () => {
    const ingresos = (SGE.DB.movFinancieros||[]).filter(m=>m.tipo==='Ingreso').reduce((s,m)=>s+m.monto,0);
    const egresos  = (SGE.DB.movFinancieros||[]).filter(m=>m.tipo==='Egreso').reduce((s,m)=>s+m.monto,0);
    const stockAlerts = (SGE.DB.productos||[]).filter(p=>p.stock<=p.stock_min&&p.estado==='Activo').length;

    return `
<div class="page-header">
  <div class="page-title">
    <h2>Panel Principal</h2>
    <p>Bienvenido al Sistema de Gestión Empresarial · Punto Fresco</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-outline" onclick="SGE.Router.navigate('reportes')">📋 Reportes</button>
    <button class="btn btn-primary" onclick="SGE.Router.navigate('pedidos')" >➕ Nuevo Pedido</button>
  </div>
</div>

<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-icon navy">📦</div>
    <div class="stat-info">
      <div class="stat-val">${(SGE.DB.productos||[]).filter(p=>p.estado==='Activo').length}</div>
      <div class="stat-lbl">Productos Activos</div>
      <div class="stat-change ${stockAlerts>0?'down':'up'}">${stockAlerts>0?`⚠️ ${stockAlerts} con stock bajo`:'Stock saludable'}</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon green">🛒</div>
    <div class="stat-info">
      <div class="stat-val">${(SGE.DB.pedidos||[]).filter(p=>p.estado!=='Cancelado').length}</div>
      <div class="stat-lbl">Pedidos Activos</div>
      <div class="stat-change up">↑ Este período</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon teal">💰</div>
    <div class="stat-info">
      <div class="stat-val" style="font-size:1.1rem;">${SGE.fmt.currency(ingresos-egresos)}</div>
      <div class="stat-lbl">Balance General</div>
      <div class="stat-change ${ingresos>=egresos?'up':'down'}">${ingresos>=egresos?'✅ Superávit':'⚠️ Déficit'}</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon coral">📑</div>
    <div class="stat-info">
      <div class="stat-val">${(SGE.DB.licitaciones||[]).filter(l=>l.estado==='adjudicado').length}</div>
      <div class="stat-lbl">Licitaciones Ganadas</div>
      <div class="stat-change up">↑ Del período</div>
    </div>
  </div>
</div>

<div class="overview-grid">
  <div class="card">
    <div class="card-header">
      <span class="card-title"><div class="card-title-icon" style="background:rgba(28,34,96,.08)">🧩</div> Módulos del Sistema</span>
    </div>
    <div class="card-body">
      <div class="module-grid" style="grid-template-columns:repeat(4,1fr);">
        ${[
          {id:'administrativo', icon:'🏛️', name:'Administrativo', bg:'rgba(28,34,96,.08)', count:'Config. general'},
          {id:'roles',          icon:'🔑', name:'Roles',          bg:'rgba(93,210,188,.15)', count:`${SGE.DB.roles.length} roles`},
          {id:'usuarios',       icon:'👤', name:'Usuarios',       bg:'rgba(40,167,69,.1)', count:`${SGE.DB.usuarios.length} usuarios`},
          {id:'empleados',      icon:'👷', name:'Empleados',      bg:'rgba(255,112,118,.1)', count:`${SGE.DB.empleados.length} empleados`},
          {id:'clientes',       icon:'🏪', name:'Clientes',       bg:'rgba(93,210,188,.15)', count:`${SGE.DB.clientes.length} clientes`},
          {id:'proveedores',    icon:'🚚', name:'Proveedores',    bg:'rgba(28,34,96,.08)', count:`${SGE.DB.proveedores.length} proveedores`},
          {id:'compras',        icon:'🛒', name:'Compras',        bg:'rgba(255,112,118,.1)', count:`${(SGE.DB.compras||[]).length} órdenes`},
          {id:'inventario',     icon:'📦', name:'Inventario',     bg:'rgba(93,210,188,.15)', count:`${(SGE.DB.productos||[]).length} productos`},
          {id:'pedidos',        icon:'📋', name:'Pedidos',        bg:'rgba(40,167,69,.1)', count:`${(SGE.DB.pedidos||[]).length} pedidos`},
          {id:'licitaciones',   icon:'📑', name:'Licitaciones',   bg:'rgba(28,34,96,.08)', count:`${(SGE.DB.licitaciones||[]).length} procesos`},
          {id:'finanzas',       icon:'💰', name:'Finanzas',       bg:'rgba(40,167,69,.1)', count:'Control financiero'},
          {id:'predicciones',   icon:'🤖', name:'Predicciones',   bg:'rgba(93,210,188,.15)', count:'Análisis IA'},
          {id:'reportes',       icon:'📊', name:'Reportes',       bg:'rgba(28,34,96,.08)', count:'Dashboard ejecutivo'},
        ].map(m=>`
        <div class="module-card" onclick="SGE.Router.navigate('${m.id}')">
          <div class="module-card-icon" style="background:${m.bg}">${m.icon}</div>
          <div class="module-card-name">${m.name}</div>
          <div class="module-card-count">${m.count}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-title"><div class="card-title-icon" style="background:rgba(40,167,69,.1)">📊</div> Resumen Financiero</span>
    </div>
    <div class="card-body" style="padding:1rem 1.5rem; display:flex; flex-direction:column; gap:.85rem;">
      ${[
        {lbl:'Ingresos', val:ingresos, color:'var(--green-dark)', icon:'📥'},
        {lbl:'Egresos',  val:egresos,  color:'#c0464b',           icon:'📤'},
        {lbl:'Balance',  val:ingresos-egresos, color:ingresos>=egresos?'var(--teal)':'var(--coral)', icon:'⚖️'},
      ].map(r=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem;background:var(--surface-alt);border-radius:var(--radius-md);">
        <span style="font-size:.84rem;color:var(--text-secondary);">${r.icon} ${r.lbl}</span>
        <span style="font-weight:800;font-size:.95rem;color:${r.color};">${SGE.fmt.currency(r.val)}</span>
      </div>`).join('')}

      <div style="margin-top:.25rem;">
        <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);margin-bottom:.6rem;">Cobros próximos a vencer</div>
        ${(SGE.DB.cuentasCobrar||[]).filter(c=>c.estado==='Pendiente').slice(0,3).map(c=>`
        <div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:.4rem;padding:.4rem .6rem;background:var(--surface-alt);border-radius:6px;">
          <span style="color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:160px;">${c.cliente}</span>
          <span style="font-weight:700;color:var(--navy);flex-shrink:0;margin-left:.5rem;">${SGE.fmt.currency(c.monto)}</span>
        </div>`).join('')}
      </div>
    </div>
  </div>
</div>`;
  })();
  return base;
});
