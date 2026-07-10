/* SGE Punto Fresco - split module */
'use strict';

SGE.Router.register('finanzas', () => {
  const hoy = new Date();
  const movs = SGE.DB.movFinancieros || [];
  const cobrar = SGE.DB.cuentasCobrar || [];
  const pagar = SGE.DB.cuentasPagar || [];
  const clientes = SGE.DB.clientes || [];
  const proveedores = SGE.DB.proveedores || [];

  const ingresos = movs.filter(m => m.tipo === 'Ingreso').reduce((s, m) => s + m.monto, 0);
  const egresos  = movs.filter(m => m.tipo === 'Egreso').reduce((s, m) => s + m.monto, 0);
  const balance  = ingresos - egresos;

  const proxVencer = [
    ...cobrar.filter(c => c.estado === 'Pendiente'),
    ...pagar.filter(c => c.estado === 'Pendiente'),
  ].filter(c => {
    const dias = Math.ceil((new Date(c.vencimiento) - hoy) / 86400000);
    return dias >= 0 && dias <= 7;
  });

  const vencidos = [
    ...cobrar.filter(c => c.estado === 'Vencido'),
    ...pagar.filter(c => c.estado === 'Vencido'),
  ];

  return `
<div class="page-header">
  <div class="page-title">
    <h2>Módulo de Finanzas</h2>
    <p>Control financiero, cuentas por cobrar y pagar</p>
  </div>
  <div class="page-actions">
    ${SGE.hasPerm('FINANZAS', 'exportar') ? `<button type="button" class="btn btn-outline btn-sm" onclick="SGE.Fin.export('excel')"><i class="bi bi-file-earmark-excel me-1" aria-hidden="true"></i>Excel</button>
    <button type="button" class="btn btn-outline btn-sm" onclick="SGE.Fin.export('pdf')"><i class="bi bi-file-earmark-pdf me-1" aria-hidden="true"></i>PDF</button>` : ''}
    <button type="button" class="btn btn-primary" data-modal="modal-mov-manual"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Movimiento Manual</button>
  </div>
</div>

${(proxVencer.length || vencidos.length) ? `
<div class="alert-banner ${vencidos.length ? 'danger' : 'warning'}">
  <span class="alert-banner-icon stat-icon-bi" style="font-size:1.2rem;"><i class="bi ${vencidos.length ? 'bi-exclamation-octagon' : 'bi-alarm'}" aria-hidden="true"></i></span>
  <div class="alert-banner-body">
    ${vencidos.length ? `<div class="alert-banner-title">${vencidos.length} pago(s)/cobro(s) vencidos sin regularizar</div>` : ''}
    ${proxVencer.length ? `<div class="alert-banner-title"><i class="bi bi-exclamation-triangle me-1" aria-hidden="true"></i>${proxVencer.length} vencimiento(s) en los próximos 7 días</div>` : ''}
    ${proxVencer.map(c => `<span style="margin-right:.75rem;"><strong>${c.cliente || c.proveedor}</strong> — ${SGE.fmt.currency(c.monto)} · vence ${SGE.fmt.date(c.vencimiento)}</span>`).join('')}
  </div>
</div>` : ''}

<!-- Balance Cards -->
<div class="stat-grid" style="grid-template-columns: repeat(3,1fr); margin-bottom:1.5rem;">
  <div class="stat-card" style="border-left: 4px solid var(--green);">
    <div class="stat-icon green stat-icon-bi"><i class="bi bi-cash-stack" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val" style="font-size:1.2rem;">${SGE.fmt.currency(ingresos)}</div>
      <div class="stat-lbl">Total Ingresos</div>
      <div class="stat-change up"><i class="bi bi-arrow-up me-1" aria-hidden="true"></i>Del período actual</div>
    </div>
  </div>
  <div class="stat-card" style="border-left: 4px solid var(--coral);">
    <div class="stat-icon coral stat-icon-bi"><i class="bi bi-graph-down-arrow" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val" style="font-size:1.2rem;">${SGE.fmt.currency(egresos)}</div>
      <div class="stat-lbl">Total Egresos</div>
      <div class="stat-change down"><i class="bi bi-arrow-down me-1" aria-hidden="true"></i>Del período actual</div>
    </div>
  </div>
  <div class="stat-card" style="border-left: 4px solid ${balance >= 0 ? 'var(--teal)' : 'var(--coral)'};">
    <div class="stat-icon ${balance >= 0 ? 'teal' : 'coral'} stat-icon-bi"><i class="bi bi-${balance >= 0 ? 'scale-balanced' : 'exclamation-diamond'}" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val" style="font-size:1.2rem; color:${balance >= 0 ? 'var(--green-dark)' : '#c0464b'};">${SGE.fmt.currency(Math.abs(balance))}</div>
      <div class="stat-lbl">Balance General</div>
      <div class="stat-change ${balance >= 0 ? 'up' : 'down'}">${balance >= 0 ? '<i class="bi bi-check-circle me-1" aria-hidden="true"></i>Superávit' : '<i class="bi bi-exclamation-triangle me-1" aria-hidden="true"></i>Déficit'}</div>
    </div>
  </div>
</div>

<div data-tabs>
  <div class="tabs">
    <button type="button" class="tab-btn active" data-tab="fin-tab-movs"><i class="bi bi-arrow-left-right me-1" aria-hidden="true"></i>Movimientos</button>
    <button type="button" class="tab-btn" data-tab="fin-tab-cobrar"><i class="bi bi-download me-1" aria-hidden="true"></i>Por Cobrar</button>
    <button type="button" class="tab-btn" data-tab="fin-tab-pagar"><i class="bi bi-upload me-1" aria-hidden="true"></i>Por Pagar</button>
  </div>

  <!-- Movimientos Financieros -->
  <div class="tab-panel active" id="fin-tab-movs">
    <div class="filter-bar">
      <div class="search-wrap">
        <span class="search-icon"></span>
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
      <input type="date" class="filter-select" id="fin-mov-from" title="Fecha desde" onchange="SGE.Fin.filterMovs()">
      <input type="date" class="filter-select" id="fin-mov-to" title="Fecha hasta" onchange="SGE.Fin.filterMovs()">
      <select class="sort-select" data-table="movs-fin-table" title="Ordenar">
        <option value="">Ordenar por...</option>
        <option value="1:desc:date">Fecha más reciente</option>
        <option value="1:asc:date">Fecha más antigua</option>
        <option value="6:desc:number">Monto mayor a menor</option>
        <option value="6:asc:number">Monto menor a mayor</option>
      </select>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table id="movs-fin-table">
            <thead><tr>
              <th>ID</th><th>Fecha</th><th>Tipo</th><th>Categoría</th><th>Descripción</th><th>Referencia</th><th>Monto</th>
            </tr></thead>
            <tbody>
              ${movs.map(m => `
              <tr data-fecha="${m.fecha}">
                <td><code style="font-size:.75rem;background:var(--surface-alt);padding:1px 5px;border-radius:3px;">${m.id}</code></td>
                <td style="font-size:.82rem;color:var(--text-muted);">${SGE.fmt.date(m.fecha)}</td>
                <td><span class="badge ${m.tipo==='Ingreso'?'badge-active':'badge-danger'}">${m.tipo}</span></td>
                <td><span class="badge badge-navy">${m.categoria}</span></td>
                <td style="font-size:.83rem;">${m.descripcion}</td>
                <td><code style="font-size:.75rem;color:var(--text-muted);">${m.ref}</code></td>
                <td style="font-weight:700;color:${m.tipo==='Ingreso'?'var(--green-dark)':'#c0464b'};" data-sort="${m.monto}">
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
        <span class="search-icon"></span>
        <input class="search-input" placeholder="Buscar cliente o concepto..." data-table="cobrar-table">
      </div>
      <select class="filter-select" data-table="cobrar-table" data-col="3">
        <option value="">Todos los estados</option>
        <option>Pendiente</option><option>Pagado</option><option>Vencido</option>
      </select>
      <button type="button" class="btn btn-primary btn-sm" data-modal="modal-cuenta-cobrar"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Nueva Cuenta</button>
      <select class="sort-select" data-table="cobrar-table" title="Ordenar">
        <option value="">Ordenar por...</option>
        <option value="4:asc:date">Vencimiento más antiguo</option>
        <option value="4:desc:date">Vencimiento más reciente</option>
        <option value="5:desc:number">Monto mayor a menor</option>
        <option value="5:asc:number">Monto menor a mayor</option>
      </select>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table id="cobrar-table">
            <thead><tr>
              <th>ID</th><th>Cliente</th><th>Concepto</th><th>Estado</th><th>Vencimiento</th><th>Monto</th><th>Acciones</th>
            </tr></thead>
            <tbody>
              ${cobrar.map(c => {
                const dias = Math.ceil((new Date(c.vencimiento) - new Date()) / 86400000);
                const diasLabel = c.estado==='Pendiente' && dias >= 0 ? `<div style="font-size:.7rem;color:${dias<=3?'var(--coral)':'var(--text-muted)'};">${dias}d restantes</div>` : '';
                const eCls = {Pendiente:'badge-pending',Pagado:'badge-active',Vencido:'badge-danger'}[c.estado];
                return `<tr>
                  <td><code style="font-size:.75rem;">${c.id}</code></td>
                  <td class="td-name">${c.cliente}</td>
                  <td style="font-size:.82rem;">${c.concepto}</td>
                  <td><span class="badge ${eCls}">${c.estado}</span></td>
                  <td style="font-size:.82rem;">${SGE.fmt.date(c.vencimiento)}${diasLabel}</td>
                  <td style="font-weight:700;color:var(--navy);" data-sort="${c.monto}">${SGE.fmt.currency(c.monto)}</td>
                  <td>
                    <div class="flex gap-1">
                      ${c.estado==='Pendiente'||c.estado==='Vencido'?`
                      <button type="button" class="btn btn-success btn-sm" onclick="SGE.Fin.marcarPagado('cobrar', ${c.cuenta_id})"><i class="bi bi-check-lg me-1" aria-hidden="true"></i>Cobrado</button>`:
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
        <span style="color:var(--text-muted);">${cobrar.filter(c=>c.estado==='Pendiente').length} pendientes · ${cobrar.filter(c=>c.estado==='Vencido').length} vencidas</span>
        <span>Total por cobrar: <strong style="color:var(--navy);">${SGE.fmt.currency(cobrar.filter(c=>c.estado!=='Pagado').reduce((s,c)=>s+c.monto,0))}</strong></span>
      </div>
    </div>
  </div>

  <!-- Cuentas por Pagar -->
  <div class="tab-panel" id="fin-tab-pagar">
    <div class="filter-bar">
      <div class="search-wrap">
        <span class="search-icon"></span>
        <input class="search-input" placeholder="Buscar proveedor o concepto..." data-table="pagar-table">
      </div>
      <select class="filter-select" data-table="pagar-table" data-col="3">
        <option value="">Todos los estados</option>
        <option>Pendiente</option><option>Pagado</option><option>Vencido</option>
      </select>
      <button type="button" class="btn btn-primary btn-sm" data-modal="modal-cuenta-pagar"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Nueva Cuenta</button>
      <select class="sort-select" data-table="pagar-table" title="Ordenar">
        <option value="">Ordenar por...</option>
        <option value="4:asc:date">Vencimiento más antiguo</option>
        <option value="4:desc:date">Vencimiento más reciente</option>
        <option value="5:desc:number">Monto mayor a menor</option>
        <option value="5:asc:number">Monto menor a mayor</option>
      </select>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table id="pagar-table">
            <thead><tr>
              <th>ID</th><th>Proveedor / Servicio</th><th>Concepto</th><th>Estado</th><th>Vencimiento</th><th>Monto</th><th>Acciones</th>
            </tr></thead>
            <tbody>
              ${pagar.map(c => {
                const dias = Math.ceil((new Date(c.vencimiento) - new Date()) / 86400000);
                const diasLabel = c.estado==='Pendiente' && dias >= 0 ? `<div style="font-size:.7rem;color:${dias<=3?'var(--coral)':'var(--text-muted)'};">${dias}d restantes</div>` : '';
                const eCls = {Pendiente:'badge-pending',Pagado:'badge-active',Vencido:'badge-danger'}[c.estado];
                return `<tr>
                  <td><code style="font-size:.75rem;">${c.id}</code></td>
                  <td class="td-name">${c.proveedor}</td>
                  <td style="font-size:.82rem;">${c.concepto}</td>
                  <td><span class="badge ${eCls}">${c.estado}</span></td>
                  <td style="font-size:.82rem;">${SGE.fmt.date(c.vencimiento)}${diasLabel}</td>
                  <td style="font-weight:700;color:#c0464b;" data-sort="${c.monto}">${SGE.fmt.currency(c.monto)}</td>
                  <td>
                    <div class="flex gap-1">
                      ${c.estado==='Pendiente'||c.estado==='Vencido'?`
                      <button type="button" class="btn btn-success btn-sm" onclick="SGE.Fin.marcarPagado('pagar', ${c.cuenta_id})"><i class="bi bi-check-lg me-1" aria-hidden="true"></i>Pagado</button>`:
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
        <span style="color:var(--text-muted);">${pagar.filter(c=>c.estado==='Pendiente').length} pendientes · ${pagar.filter(c=>c.estado==='Vencido').length} vencidas</span>
        <span>Total por pagar: <strong style="color:#c0464b;">${SGE.fmt.currency(pagar.filter(c=>c.estado!=='Pagado').reduce((s,c)=>s+c.monto,0))}</strong></span>
      </div>
    </div>
  </div>
</div>

<!-- Modal: Movimiento Manual -->
<div class="modal-overlay" id="modal-mov-manual">
  <div class="modal modal-sm">
    <div class="modal-header">
      <span class="modal-title"><i class="bi bi-currency-exchange me-1" aria-hidden="true"></i>Registrar Movimiento Manual</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-grid cols-1">
        <div class="form-group">
          <label class="form-label">Tipo <span>*</span></label>
          <select class="form-control" id="fin-mov-tipo">
            <option>Ingreso</option><option>Egreso</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Categoría <span>*</span></label>
          <select class="form-control" id="fin-mov-cat">
            <option>Pedido</option><option>Compra</option><option>Licitación</option><option>Servicio</option><option>Nómina</option><option>Otro</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Descripción <span>*</span></label>
          <input class="form-control" id="fin-mov-desc" placeholder="Detalle del movimiento">
        </div>
        <div class="form-group">
          <label class="form-label">Monto (₡) <span>*</span></label>
          <input class="form-control" id="fin-mov-monto" type="number" min="0" placeholder="0.00">
        </div>
        <div class="form-group">
          <label class="form-label">Fecha <span>*</span></label>
          <input class="form-control" id="fin-mov-fecha" type="date" value="${new Date().toISOString().split('T')[0]}">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button type="button" class="btn btn-primary" onclick="SGE.Fin.saveMovManual()"><i class="bi bi-floppy me-1" aria-hidden="true"></i>Guardar</button>
    </div>
  </div>
</div>

<!-- Modal: Cuenta por Cobrar -->
<div class="modal-overlay" id="modal-cuenta-cobrar">
  <div class="modal modal-sm">
    <div class="modal-header">
      <span class="modal-title"><i class="bi bi-download me-1" aria-hidden="true"></i>Nueva Cuenta por Cobrar</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-grid cols-1">
        <div class="form-group">
          <label class="form-label">Cliente <span>*</span></label>
          <select class="form-control" id="fin-cc-cliente">
            <option value="">Seleccione...</option>
            ${clientes.map(c=>`<option>${c.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Concepto / Referencia</label>
          <input class="form-control" id="fin-cc-concepto" placeholder="Ej: PED-2024-036">
        </div>
        <div class="form-group">
          <label class="form-label">Monto (₡) <span>*</span></label>
          <input class="form-control" id="fin-cc-monto" type="number" min="0" placeholder="0.00">
        </div>
        <div class="form-group">
          <label class="form-label">Fecha de Vencimiento <span>*</span></label>
          <input class="form-control" id="fin-cc-venc" type="date">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button type="button" class="btn btn-primary" onclick="SGE.Fin.saveCuentaCobrar()"><i class="bi bi-floppy me-1" aria-hidden="true"></i>Guardar</button>
    </div>
  </div>
</div>

<!-- Modal: Cuenta por Pagar -->
<div class="modal-overlay" id="modal-cuenta-pagar">
  <div class="modal modal-sm">
    <div class="modal-header">
      <span class="modal-title"><i class="bi bi-upload me-1" aria-hidden="true"></i>Nueva Cuenta por Pagar</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-grid cols-1">
        <div class="form-group">
          <label class="form-label">Proveedor / Servicio <span>*</span></label>
          <select class="form-control" id="fin-cp-proveedor">
            <option value="">Seleccione...</option>
            ${proveedores.map(p=>`<option value="${p.id}">${p.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Concepto / Referencia</label>
          <input class="form-control" id="fin-cp-concepto" placeholder="Ej: OC-2024-045 / Factura luz">
        </div>
        <div class="form-group">
          <label class="form-label">Monto (₡) <span>*</span></label>
          <input class="form-control" id="fin-cp-monto" type="number" min="0" placeholder="0.00">
        </div>
        <div class="form-group">
          <label class="form-label">Fecha de Vencimiento <span>*</span></label>
          <input class="form-control" id="fin-cp-venc" type="date">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button type="button" class="btn btn-primary" onclick="SGE.Fin.saveCuentaPagar()"><i class="bi bi-floppy me-1" aria-hidden="true"></i>Guardar</button>
    </div>
  </div>
</div>
`;
});

SGE.Fin = {
  export: (tipo) => {
    if (typeof SGE.hasPerm === 'function' && !SGE.hasPerm('FINANZAS', 'exportar')) {
      SGE.Toast.show('No tiene permiso para exportar', 'error');
      return;
    }
    if (!SGE.Export) {
      SGE.Toast.show('Módulo de exportación no cargado', 'error');
      return;
    }
    const movs = SGE.DB.movFinancieros || [];
    const cobrar = SGE.DB.cuentasCobrar || [];
    const pagar = SGE.DB.cuentasPagar || [];
    const movRows = movs.map(m => [m.id, m.fecha, m.tipo, m.categoria, m.descripcion, m.ref, Number(m.monto || 0).toFixed(2)]);
    const tMov = SGE.Export.buildTable('Movimientos financieros', ['ID', 'Fecha', 'Tipo', 'Categoría', 'Descripción', 'Ref.', 'Monto CRC'], movRows, [6]);
    const cobRows = cobrar.map(c => [c.id, c.cliente, c.concepto, c.estado, c.vencimiento, Number(c.monto || 0).toFixed(2)]);
    const tCob = SGE.Export.buildTable('Cuentas por cobrar', ['ID', 'Cliente', 'Concepto', 'Estado', 'Vencimiento', 'Monto CRC'], cobRows, [5]);
    const pagRows = pagar.map(c => [c.id, c.proveedor, c.concepto, c.estado, c.vencimiento, Number(c.monto || 0).toFixed(2)]);
    const tPag = SGE.Export.buildTable('Cuentas por pagar', ['ID', 'Proveedor', 'Concepto', 'Estado', 'Vencimiento', 'Monto CRC'], pagRows, [5]);
    const ingresos = movs.filter(m => m.tipo === 'Ingreso').reduce((s, m) => s + m.monto, 0);
    const egresos = movs.filter(m => m.tipo === 'Egreso').reduce((s, m) => s + m.monto, 0);
    const inner = tMov + tCob + tPag + `<p class="lead">Resumen: ingresos ${SGE.fmt.currency(ingresos)} · egresos ${SGE.fmt.currency(egresos)} · balance ${SGE.fmt.currency(ingresos - egresos)}</p>`;
    if (tipo === 'pdf') {
      SGE.Export.openPrintDocument('Finanzas', SGE.Export.wrapLetterhead('Informe financiero', 'Movimientos, cuentas por cobrar y por pagar', inner));
      return;
    }
    SGE.Export.downloadExcelHtml(`finanzas_${new Date().toISOString().slice(0, 10)}.xls`, 'Finanzas — exportación', inner);
  },
  filterMovs: () => {
    const from = document.getElementById('fin-mov-from')?.value || '';
    const to = document.getElementById('fin-mov-to')?.value || '';
    document.querySelectorAll('#movs-fin-table tbody tr').forEach(tr => {
      const d = (tr.dataset.fecha || '').slice(0, 10);
      const okFrom = !from || d >= from;
      const okTo = !to || d <= to;
      tr.style.display = okFrom && okTo ? '' : 'none';
    });
  },
  marcarPagado: async (tipo, cuentaId) => {
    try {
      if (tipo === 'cobrar') {
        await SGE.Api.mutations.putCuentaCobrarEstado(cuentaId, 'Pagado');
      } else {
        await SGE.Api.mutations.putCuentaPagarEstado(cuentaId, 'Pagado');
      }
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show(tipo === 'cobrar' ? 'Cobro registrado' : 'Pago registrado');
      SGE.Router.navigate('finanzas');
    } catch (e) {
      SGE.Toast.show(e.message || 'No se pudo actualizar', 'error');
    }
  },

  saveMovManual: async () => {
    const body = {
      tipo: document.getElementById('fin-mov-tipo')?.value || 'Ingreso',
      categoria: document.getElementById('fin-mov-cat')?.value || 'Otro',
      descripcion: document.getElementById('fin-mov-desc')?.value?.trim() || '',
      monto: parseFloat(document.getElementById('fin-mov-monto')?.value) || 0,
      fechaMovimiento: document.getElementById('fin-mov-fecha')?.value || null
    };
    if (!body.descripcion || !body.monto) {
      SGE.Toast.show('Complete descripción y monto', 'error');
      return;
    }
    try {
      await SGE.Api.mutations.postMovFin(body);
      await SGE.Api.reloadAfterMutation();
      SGE.Modal.close('modal-mov-manual');
      SGE.Toast.show('Movimiento registrado');
      SGE.Router.navigate('finanzas');
    } catch (e) {
      SGE.Toast.show(e.message || 'Error', 'error');
    }
  },
  saveCuentaCobrar: async () => {
    const clienteNombre = document.getElementById('fin-cc-cliente')?.value || '';
    const cliente = (SGE.DB.clientes || []).find(c => c.nombre === clienteNombre);
    const concepto = document.getElementById('fin-cc-concepto')?.value?.trim() || '';
    const monto = parseFloat(document.getElementById('fin-cc-monto')?.value) || 0;
    const venc = document.getElementById('fin-cc-venc')?.value || '';
    if (!cliente || !concepto || !monto || !venc) {
      SGE.Toast.show('Complete cliente, concepto, monto y vencimiento', 'error');
      return;
    }
    try {
      await SGE.Api.mutations.postCuentaCobrar({
        clienteId: cliente.id,
        concepto,
        monto,
        vencimiento: venc
      });
      await SGE.Api.reloadAfterMutation();
      SGE.Modal.close('modal-cuenta-cobrar');
      SGE.Toast.show('Cuenta por cobrar registrada');
      SGE.Router.navigate('finanzas');
    } catch (e) {
      SGE.Toast.show(e.message || 'Error', 'error');
    }
  },
  saveCuentaPagar: async () => {
    const proveedorId = parseInt(document.getElementById('fin-cp-proveedor')?.value || '0', 10) || null;
    const concepto = document.getElementById('fin-cp-concepto')?.value?.trim() || '';
    const monto = parseFloat(document.getElementById('fin-cp-monto')?.value) || 0;
    const venc = document.getElementById('fin-cp-venc')?.value || '';
    if (!concepto || !monto || !venc) {
      SGE.Toast.show('Complete concepto, monto y vencimiento', 'error');
      return;
    }
    try {
      await SGE.Api.mutations.postCuentaPagar({
        proveedorId,
        concepto,
        monto,
        vencimiento: venc
      });
      await SGE.Api.reloadAfterMutation();
      SGE.Modal.close('modal-cuenta-pagar');
      SGE.Toast.show('Cuenta por pagar registrada');
      SGE.Router.navigate('finanzas');
    } catch (e) {
      SGE.Toast.show(e.message || 'Error', 'error');
    }
  }
};