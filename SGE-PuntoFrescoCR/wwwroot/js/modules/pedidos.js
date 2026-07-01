/* SGE Punto Fresco - split module */
'use strict';

SGE.Router.register('pedidos', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Módulo de Pedidos</h2>
    <p>Registro y seguimiento de órdenes. <strong>Confirmado</strong>: puede marcar como <strong>Entregado</strong> o cancelar. El stock ya se descontó al confirmar.</p>
  </div>
  <div class="page-actions">
    <button type="button" class="btn btn-outline" onclick="SGE.Router.navigate('pedidos-analytics')"><i class="bi bi-bar-chart-line me-1" aria-hidden="true"></i>Análisis</button>
    <button type="button" class="btn btn-primary" onclick="SGE.Ped.openNew()"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Nuevo Pedido</button>
  </div>
</div>

<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-icon navy stat-icon-bi"><i class="bi bi-file-earmark-text" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${SGE.DB.pedidos.filter(p=>p.estado==='Borrador').length}</div>
      <div class="stat-lbl">Borradores</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon green stat-icon-bi"><i class="bi bi-check-circle" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${SGE.DB.pedidos.filter(p=>p.estado==='Confirmado').length}</div>
      <div class="stat-lbl">Confirmados</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon teal stat-icon-bi"><i class="bi bi-truck" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${SGE.DB.pedidos.filter(p=>p.estado==='Entregado').length}</div>
      <div class="stat-lbl">Entregados</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon coral stat-icon-bi"><i class="bi bi-x-circle" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${SGE.DB.pedidos.filter(p=>p.estado==='Cancelado').length}</div>
      <div class="stat-lbl">Cancelados</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon navy stat-icon-bi"><i class="bi bi-currency-dollar" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${SGE.fmt.currency(SGE.DB.pedidos.filter(p=>p.estado!=='Cancelado').reduce((s,p)=>s+p.total,0))}</div>
      <div class="stat-lbl">Total (no cancel.)</div>
    </div>
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon"></span>
    <input class="search-input" id="pedidos-search" placeholder="Buscar por cliente o número de pedido..." oninput="SGE.Ped.applyFilters()">
  </div>
  <select class="filter-select" id="ped-estado-filter" onchange="SGE.Ped.applyFilters()">
    <option value="">Todos los estados</option>
    <option value="Borrador">Borrador</option><option value="Confirmado">Confirmado</option><option value="Entregado">Entregado</option><option value="Cancelado">Cancelado</option>
  </select>
  <input type="date" class="filter-select" id="pedidos-date-filter" title="Filtrar por fecha" onchange="SGE.Ped.applyFilters()">
  <label class="filter-select" style="display:flex;align-items:center;gap:.45rem;cursor:pointer;white-space:nowrap;font-size:.82rem;border:none;background:transparent;padding:.35rem .5rem;">
    <input type="checkbox" id="ped-solo-logistica" onchange="SGE.Ped.applyFilters()"> Solo confirmados (logística)
  </label>
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table id="pedidos-table">
        <thead><tr>
          <th>Nº Pedido</th><th>Cliente</th><th>Estado</th><th>Fecha</th><th>Ítems</th><th>Total</th><th>Acciones</th>
        </tr></thead>
        <tbody>
          ${SGE.DB.pedidos.map(p => {
            const eCls = { Borrador:'badge-pending', Confirmado:'badge-active', Entregado:'badge-info', Cancelado:'badge-danger' }[p.estado] || 'badge-navy';
            const estadoLbl = p.estado === 'Borrador' ? 'Borrador (pendiente)' : p.estado;
            const pid = p.pedido_id;
            return `<tr data-fecha="${p.fecha}" data-estado="${p.estado}">
              <td><code style="background:var(--surface-alt);padding:2px 7px;border-radius:4px;font-size:.8rem;font-weight:700;">${p.id}</code></td>
              <td class="td-name">${p.cliente}</td>
              <td><span class="badge ${eCls}">${estadoLbl}</span></td>
              <td style="color:var(--text-muted);font-size:.82rem;">${SGE.fmt.date(p.fecha)}</td>
              <td><span class="badge badge-navy"><i class="bi bi-journal-text me-1" aria-hidden="true"></i>${p.items}</span></td>
              <td style="font-weight:700;color:var(--navy);">${SGE.fmt.currency(p.total)}</td>
              <td>
                <div class="flex gap-1">
                  <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Ver detalle" onclick="SGE.Ped.view(${pid})"><i class="bi bi-eye" aria-hidden="true"></i></button>
                  ${p.estado === 'Borrador' ? `
                  <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Ped.edit(${pid})"><i class="bi bi-pencil" aria-hidden="true"></i></button>
                  <button type="button" class="btn btn-success btn-sm" title="Confirmar" onclick="SGE.Ped.confirm(${pid})"><i class="bi bi-check-lg me-1" aria-hidden="true"></i></button>
                  <button type="button" class="btn btn-danger btn-sm btn-icon" title="Cancelar" onclick="SGE.Ped.cancel(${pid})"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
                  ` : ''}
                  ${p.estado === 'Confirmado' ? `
                  <button type="button" class="btn btn-outline btn-sm" title="Marcar como entregado" onclick="SGE.Ped.entregar(${pid})"><i class="bi bi-truck me-1" aria-hidden="true"></i>Entregado</button>
                  <button type="button" class="btn btn-danger btn-sm btn-icon" title="Cancelar pedido" onclick="SGE.Ped.cancel(${pid})"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
                  ` : ''}
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div class="pagination">
    <span class="page-info">Mostrando ${SGE.DB.pedidos.length} de ${SGE.DB.pedidos.length} pedidos</span>
    <div class="page-btns">
      <button type="button" class="page-btn" aria-label="Anterior"><i class="bi bi-chevron-left" aria-hidden="true"></i></button><button type="button" class="page-btn active">1</button><button type="button" class="page-btn" aria-label="Siguiente"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
    </div>
  </div>
</div>

<!-- Modal Nuevo Pedido -->
<div class="modal-overlay" id="modal-pedido">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title" id="ped-modal-title"><i class="bi bi-journal-text me-1" aria-hidden="true"></i>Nuevo Pedido</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-grid" style="margin-bottom:1.25rem;">
        <div class="form-group">
          <label class="form-label">Cliente <span>*</span></label>
          <select class="form-control" id="ped-cliente" onchange="SGE.Ped.showClientInfo(this.value)">
            <option value="">Seleccione cliente...</option>
            ${SGE.DB.clientes.filter(c=>c.estado==='Activo').map(c=>`<option value="${c.id}">${c.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Fecha de Pedido <span>*</span></label>
          <input class="form-control" type="date" id="ped-fecha" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Fecha de Entrega Estimada</label>
          <input class="form-control" type="date" id="ped-fecha-entrega">
        </div>
      </div>

      <div id="ped-client-info" style="display:none;background:rgba(93,210,188,.1);border:1px solid var(--teal);border-radius:var(--radius-sm);padding:.75rem 1rem;margin-bottom:1rem;font-size:.83rem;">
        <strong style="color:var(--navy);"><i class="bi bi-geo-alt me-1" aria-hidden="true"></i>Dirección de entrega:</strong>
        <span id="ped-client-addr" style="color:var(--text-secondary);margin-left:.5rem;"></span>
      </div>

      <div class="form-divider-label">Productos del Pedido</div>
      <div style="margin-top:.75rem;">
        <div class="order-line-head">
          <span>Producto</span><span>Cantidad</span><span>Precio Unit.</span><span>Subtotal</span><span></span>
        </div>
        <div id="ped-lines">
          ${SGE.Ped.renderLine(0)}
          ${SGE.Ped.renderLine(1)}
        </div>
        <button type="button" class="btn-add-line" onclick="SGE.Ped.addLine()"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Agregar producto</button>
      </div>

      <div class="order-totals">
        <div class="order-total-row"><span class="lbl">Subtotal:</span><span class="val" id="pt-sub">₡0.00</span></div>
        <div class="order-total-row"><span class="lbl">IVA:</span><span class="val" id="pt-iva">₡0.00</span></div>
        <div class="order-total-row grand"><span class="lbl">Total:</span><span class="val" id="pt-total">₡0.00</span></div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button type="button" class="btn btn-primary" onclick="SGE.Ped.saveOrder()"><i class="bi bi-journal-check me-1" aria-hidden="true"></i>Registrar Pedido</button>
    </div>
  </div>
</div>

<!-- Modal Detalle Pedido -->
<div class="modal-overlay" id="modal-pedido-detail">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title"><i class="bi bi-journal-text me-1" aria-hidden="true"></i>Detalle de Pedido</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body" id="ped-detail-body"></div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-close-modal>Cerrar</button>
    </div>
  </div>
</div>
`);

SGE.Router.register('pedidos-analytics', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Análisis de Pedidos</h2>
    <p>Clientes frecuentes y productos más solicitados</p>
  </div>
  <div class="page-actions">
    <select class="filter-select" id="ped-analytics-meses" onchange="SGE.Ped.refreshAnalytics()" title="Ventana de meses">
      <option value="1">Último mes</option>
      <option value="3">Últimos 3 meses</option>
      <option value="6" selected>Últimos 6 meses</option>
      <option value="12">Último año</option>
    </select>
    <button type="button" class="btn btn-outline" onclick="SGE.Router.navigate('pedidos')"><i class="bi bi-arrow-left me-1" aria-hidden="true"></i>Volver</button>
  </div>
</div>

<div class="responsive-grid-2">
  <div class="card">
    <div class="card-header">
      <span class="card-title"><div class="card-title-icon card-title-icon-bi" style="background:rgba(40,167,69,.1)"><i class="bi bi-trophy" aria-hidden="true"></i></div> Clientes Más Frecuentes</span>
    </div>
    <div class="card-body">
      <div class="top-list" id="ped-analytics-clientes"><div style="color:var(--text-muted);font-size:.85rem;">Cargando…</div></div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-title"><div class="card-title-icon card-title-icon-bi" style="background:rgba(93,210,188,.15)"><i class="bi bi-box-seam" aria-hidden="true"></i></div> Productos Más Solicitados</span>
    </div>
    <div class="card-body">
      <p style="font-size:.78rem;color:var(--text-muted);margin:0 0 .65rem 0;">Productos según reporte consolidado (detalle por mes requiere líneas de pedido en servidor).</p>
      <div class="top-list" id="ped-analytics-prods"><div style="color:var(--text-muted);font-size:.85rem;">Cargando…</div></div>
    </div>
  </div>
</div>
`);

SGE.Ped = {
  lineCount: 2,
  _editPedidoId: null,

  openNew: () => {
    SGE.Ped._editPedidoId = null;
    const t = document.getElementById('ped-modal-title');
    if (t) t.innerHTML = '<i class="bi bi-journal-text me-1" aria-hidden="true"></i>Nuevo Pedido';
    const fe = document.getElementById('ped-fecha');
    if (fe) fe.value = new Date().toISOString().split('T')[0];
    const fent = document.getElementById('ped-fecha-entrega');
    if (fent) fent.value = '';
    const cl = document.getElementById('ped-cliente');
    if (cl) cl.selectedIndex = 0;
    const lines = document.getElementById('ped-lines');
    if (lines) {
      lines.innerHTML = SGE.Ped.renderLine(0) + SGE.Ped.renderLine(1);
      SGE.Ped.lineCount = 2;
      SGE.Ped.calcTotals();
    }
    const panel = document.getElementById('ped-client-info');
    if (panel) panel.style.display = 'none';
    SGE.Modal.open('modal-pedido');
  },

  renderLine: (idx) => `
    <div class="order-line" id="pline-${idx}">
      <select class="form-control" style="font-size:.82rem;" onchange="SGE.Ped.onLineChange(this)">
        <option value="">Seleccione producto...</option>
        ${SGE.DB.productos.filter(p=>p.estado==='Activo'&&p.stock>0).map(p=>{
          const iv = parseFloat(String(p.iva).replace('%','')) || 13;
          return `<option value="${p.id}" data-precio="${p.precio_venta}" data-iva="${iv}">${p.nombre} (Stock: ${p.stock})</option>`;
        }).join('')}
      </select>
      <input class="form-control" type="number" min="1" value="1" style="font-size:.82rem;" oninput="SGE.Ped.calcTotals()">
      <span class="ped-line-unit" style="font-size:.82rem;color:var(--text-muted);padding:.4rem;">—</span>
      <span style="font-size:.82rem;font-weight:600;color:var(--navy);text-align:right;padding:.4rem;">₡0.00</span>
      <button type="button" class="btn btn-ghost btn-sm btn-icon" onclick="document.getElementById('pline-${idx}').remove(); SGE.Ped.calcTotals()" style="color:var(--coral);" aria-label="Quitar línea"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>`,

  onLineChange: (sel) => {
    const row = sel.closest('.order-line');
    const opt = sel.selectedOptions[0];
    const unit = row?.querySelector('.ped-line-unit');
    if (unit && opt?.dataset?.precio) unit.textContent = SGE.fmt.currency(parseFloat(opt.dataset.precio));
    else if (unit) unit.textContent = '—';
    SGE.Ped.calcTotals();
  },

  addLine: () => {
    const c = SGE.Ped.lineCount++;
    const container = document.getElementById('ped-lines');
    if (!container) return;
    container.insertAdjacentHTML('beforeend', SGE.Ped.renderLine(c));
  },

  calcTotals: () => {
    let sub = 0, ivaTotal = 0;
    document.querySelectorAll('#ped-lines .order-line').forEach(row => {
      const selEl = row.querySelector('select');
      const opt = selEl?.selectedOptions[0];
      const qty = parseFloat(row.querySelector('input[type=number]')?.value) || 0;
      const price = parseFloat(opt?.dataset?.precio) || 0;
      const ivaRate = (parseFloat(opt?.dataset?.iva) || 13) / 100;
      const s = qty * price;
      sub += s / (1 + ivaRate);
      ivaTotal += s - s / (1 + ivaRate);
      const subEl = row.querySelectorAll('span')[1];
      if (subEl) subEl.textContent = SGE.fmt.currency(s);
    });
    const el = (id) => document.getElementById(id);
    if (el('pt-sub'))   el('pt-sub').textContent   = SGE.fmt.currency(sub);
    if (el('pt-iva'))   el('pt-iva').textContent   = SGE.fmt.currency(ivaTotal);
    if (el('pt-total')) el('pt-total').textContent = SGE.fmt.currency(sub + ivaTotal);
  },

  showClientInfo: (clienteId) => {
    const panel = document.getElementById('ped-client-info');
    const addr = document.getElementById('ped-client-addr');
    if (!clienteId) {
      if (panel) panel.style.display = 'none';
      return;
    }
    const c = SGE.DB.clientes.find(x => String(x.id) === String(clienteId));
    if (c && panel && addr) {
      const esc = typeof SGE.Export?.escapeHtml === 'function' ? SGE.Export.escapeHtml : (s) => String(s ?? '');
      addr.innerHTML = `${esc(c.direccion)} <span style="opacity:.5">·</span> <i class="bi bi-telephone me-1" aria-hidden="true"></i>${esc(c.telefono)}`;
      panel.style.display = 'flex';
    } else if (panel) {
      panel.style.display = 'none';
    }
  },

  _ensureProductOption: (selectEl, productoId, nombre, precioUnitario, porcentajeIVA) => {
    if (!selectEl || productoId == null) return;
    const idStr = String(productoId);
    if ([...selectEl.options].some((o) => o.value === idStr)) return;
    const opt = document.createElement('option');
    opt.value = idStr;
    opt.dataset.precio = String(Number(precioUnitario) || 0);
    opt.dataset.iva = String(Number(porcentajeIVA) || 13);
    const esc = typeof SGE.Export?.escapeHtml === 'function' ? SGE.Export.escapeHtml : (s) => String(s ?? '');
    opt.textContent = `${esc(nombre || ('#' + idStr))} (pedido)`;
    selectEl.appendChild(opt);
  },

  collectLineas: () => {
    const lineas = [];
    document.querySelectorAll('#ped-lines .order-line').forEach(row => {
      const sel = row.querySelector('select');
      const pid = parseInt(sel?.value, 10);
      if (!pid) return;
      const qty = parseInt(row.querySelector('input[type=number]')?.value, 10) || 0;
      const opt = sel.selectedOptions[0];
      const price = parseFloat(opt?.dataset?.precio) || 0;
      const pct = parseFloat(opt?.dataset?.iva) || 13;
      if (qty > 0 && price >= 0) lineas.push({ productoId: pid, cantidad: qty, precioUnitario: price, porcentajeIVA: pct });
    });
    return lineas;
  },

  view: async (pedidoId) => {
    const ped = SGE.DB.pedidos.find(p => p.pedido_id === pedidoId);
    const bodyEl = document.getElementById('ped-detail-body');
    if (!bodyEl) return;
    if (!ped) {
      SGE.Toast.show('No se encontró el pedido', 'error');
      return;
    }
    bodyEl.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;"><i class="bi bi-hourglass-split" aria-hidden="true"></i> Cargando detalle…</p>';
    SGE.Modal.open('modal-pedido-detail');
    let d;
    try {
      d = await SGE.Api.mutations.getPedidoDetalle(pedidoId);
    } catch (e) {
      SGE.Modal.close('modal-pedido-detail');
      SGE.Toast.show(e.message || 'No se pudo cargar el detalle', 'error');
      return;
    }
    const cli = (SGE.DB.clientes || []).find(c => c.nombre === ped.cliente);
    const rawEst = (d && d.estado) || ped.estado;
    const eCls = { Borrador:'badge-pending', Confirmado:'badge-active', Entregado:'badge-info', Cancelado:'badge-danger' }[rawEst] || 'badge-navy';
    const estadoLbl = rawEst === 'Borrador' ? 'Borrador (pendiente)' : rawEst;
    const lineas = (d && d.lineas) || [];
    const rows = lineas.map(ln => {
      const lineTot = Number(ln.total != null ? ln.total : (ln.cantidad * ln.precioUnitario));
      return `<tr>
        <td style="font-size:.82rem;">${ln.producto || ('#' + ln.productoId)}</td>
        <td style="text-align:right;">${ln.cantidad}</td>
        <td style="text-align:right;">${SGE.fmt.currency(ln.precioUnitario)}</td>
        <td style="text-align:right;">${ln.porcentajeIVA ?? '—'}%</td>
        <td style="text-align:right;font-weight:600;">${SGE.fmt.currency(lineTot)}</td>
      </tr>`;
    }).join('');
    bodyEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
        <div>
          <div style="font-size:.75rem;color:var(--text-muted);text-transform:uppercase;">Pedido</div>
          <div style="font-size:1.2rem;font-weight:800;color:var(--navy);">${ped.id}</div>
        </div>
        <span class="badge ${eCls}">${estadoLbl}</span>
      </div>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">Cliente</div><div class="info-value">${(d && d.cliente) || ped.cliente}</div></div>
        <div class="info-item"><div class="info-label">Fecha</div><div class="info-value">${SGE.fmt.date((d && d.fechaPedido) || ped.fecha)}</div></div>
        ${(d && d.direccionEntrega) ? `<div class="info-item col-span-2"><div class="info-label">Dirección de entrega</div><div class="info-value">${d.direccionEntrega}</div></div>` : ''}
        ${cli ? `<div class="info-item"><div class="info-label">Teléfono</div><div class="info-value">${cli.telefono}</div></div>
        <div class="info-item"><div class="info-label">Correo</div><div class="info-value">${cli.correo}</div></div>` : ''}
        <div class="info-item"><div class="info-label">Subtotal</div><div class="info-value">${d ? SGE.fmt.currency(d.subtotal) : '—'}</div></div>
        <div class="info-item"><div class="info-label">IVA</div><div class="info-value">${d ? SGE.fmt.currency(d.montoIVA) : '—'}</div></div>
        <div class="info-item"><div class="info-label">Total</div><div class="info-value" style="font-size:1.1rem;font-weight:800;color:var(--navy);">${SGE.fmt.currency((d && d.total) != null ? d.total : ped.total)}</div></div>
      </div>
      <h4 style="margin:1rem 0 .5rem 0;font-size:.95rem;"><i class="bi bi-box-seam me-1" aria-hidden="true"></i>Productos</h4>
      <div class="table-wrap" style="max-height:240px;overflow:auto;">
        <table style="font-size:.82rem;width:100%;border-collapse:collapse;">
          <thead><tr><th>Producto</th><th style="text-align:right;">Cant.</th><th style="text-align:right;">P. unit.</th><th style="text-align:right;">IVA</th><th style="text-align:right;">Total</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="5" style="color:var(--text-muted);">Sin líneas.</td></tr>'}</tbody>
        </table>
      </div>`;
  },

  edit: async (pedidoId) => {
    const ped = SGE.DB.pedidos.find((p) => p.pedido_id === pedidoId);
    if (!ped) {
      SGE.Toast.show('No se encontró el pedido', 'error');
      return;
    }
    if (ped.estado !== 'Borrador') {
      SGE.Toast.show('Solo se pueden editar pedidos en borrador.', 'error');
      return;
    }
    SGE.Ped._editPedidoId = pedidoId;
    SGE.Modal.open('modal-pedido');
    const titleEl = document.getElementById('ped-modal-title');
    if (titleEl) titleEl.innerHTML = '<i class="bi bi-hourglass-split me-1" aria-hidden="true"></i>Cargando pedido…';
    let d;
    try {
      d = await SGE.Api.mutations.getPedidoDetalle(pedidoId);
    } catch (e) {
      SGE.Modal.close('modal-pedido');
      SGE.Ped._editPedidoId = null;
      SGE.Toast.show(e.message || 'No se pudo cargar el pedido', 'error');
      return;
    }
    if (!d) {
      SGE.Modal.close('modal-pedido');
      SGE.Ped._editPedidoId = null;
      SGE.Toast.show('No se recibió el detalle del pedido', 'error');
      return;
    }
    const estado = d.estado || ped.estado;
    if (estado !== 'Borrador') {
      SGE.Modal.close('modal-pedido');
      SGE.Ped._editPedidoId = null;
      SGE.Toast.show('Este pedido ya no está en borrador y no se puede editar.', 'error');
      return;
    }
    const num = d.numeroPedido || d.numero_pedido || ped.id;
    if (titleEl) titleEl.innerHTML = `<i class="bi bi-pencil me-1" aria-hidden="true"></i>Editar ${num}`;
    const clienteId = d.clienteId ?? d.cliente_id;
    const cl = document.getElementById('ped-cliente');
    if (cl && clienteId != null) cl.value = String(clienteId);
    const fe = document.getElementById('ped-fecha');
    const fp = d.fechaPedido || d.fecha_pedido;
    if (fe && fp) fe.value = String(fp).slice(0, 10);
    const fent = document.getElementById('ped-fecha-entrega');
    const fentApi = d.fechaEntregaEstimada || d.fecha_entrega_estimada;
    if (fent) fent.value = fentApi ? String(fentApi).slice(0, 10) : '';
    SGE.Ped.showClientInfo(clienteId != null ? String(clienteId) : '');
    const lines = document.getElementById('ped-lines');
    if (!lines) return;
    lines.innerHTML = '';
    const lineas = d.lineas || d.Lineas || [];
    SGE.Ped.lineCount = 0;
    lineas.forEach(() => {
      const idx = SGE.Ped.lineCount++;
      lines.insertAdjacentHTML('beforeend', SGE.Ped.renderLine(idx));
    });
    if (!lineas.length) {
      lines.innerHTML = SGE.Ped.renderLine(0) + SGE.Ped.renderLine(1);
      SGE.Ped.lineCount = 2;
    }
    lineas.forEach((ln, i) => {
      const row = document.getElementById(`pline-${i}`);
      if (!row) return;
      const sel = row.querySelector('select');
      const pid = ln.productoId ?? ln.producto_id;
      const precio = ln.precioUnitario ?? ln.precio_unitario ?? 0;
      const iva = ln.porcentajeIVA ?? ln.porcentaje_iva ?? 13;
      const nombre = ln.producto || '';
      SGE.Ped._ensureProductOption(sel, pid, nombre, precio, iva);
      if (sel) sel.value = String(pid);
      const qtyInp = row.querySelector('input[type=number]');
      if (qtyInp) qtyInp.value = String(ln.cantidad ?? 1);
      if (sel) SGE.Ped.onLineChange(sel);
    });
    SGE.Ped.calcTotals();
  },

  confirm: async (pedidoId) => {
    try {
      await SGE.Api.mutations.confirmarPedido(pedidoId);
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show('Pedido confirmado');
      SGE.Router.navigate('pedidos');
    } catch (e) {
      SGE.Toast.show(e.message || 'No se pudo confirmar', 'error');
    }
  },

  entregar: async (pedidoId) => {
    const ok = typeof Swal !== 'undefined'
      ? (await Swal.fire({
        icon: 'question',
        title: 'Marcar como entregado',
        text: '¿Confirma que el pedido ya fue entregado al cliente?',
        showCancelButton: true,
        confirmButtonText: 'Sí, entregado',
        cancelButtonText: 'Cancelar'
      })).isConfirmed
      : window.confirm('¿Marcar este pedido como entregado al cliente?');
    if (!ok) return;
    try {
      await SGE.Api.mutations.entregarPedido(pedidoId);
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show('Pedido marcado como entregado');
      SGE.Router.navigate('pedidos');
    } catch (e) {
      SGE.Toast.show(e.message || 'No se pudo marcar como entregado', 'error');
    }
  },

  cancel: async (pedidoId) => {
    const motivo = window.prompt('Motivo de cancelación (opcional):', '') || '';
    try {
      await SGE.Api.mutations.cancelarPedido(pedidoId, motivo);
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show('Pedido cancelado', 'error');
      SGE.Router.navigate('pedidos');
    } catch (e) {
      SGE.Toast.show(e.message || 'No se pudo cancelar', 'error');
    }
  },

  saveOrder: async () => {
    const cli = document.getElementById('ped-cliente')?.value;
    if (!cli) { SGE.Toast.show('Seleccione un cliente', 'error'); return; }
    const lineas = SGE.Ped.collectLineas();
    if (!lineas.length) { SGE.Toast.show('Agregue al menos un producto', 'error'); return; }
    const fecha = document.getElementById('ped-fecha')?.value;
    const cliRow = SGE.DB.clientes.find(c => String(c.id) === String(cli));
    const body = {
      clienteId: parseInt(cli, 10),
      fechaPedido: fecha || null,
      direccionEntrega: cliRow?.direccion || null,
      observaciones: null,
      lineas
    };
    try {
      const wasEdit = !!SGE.Ped._editPedidoId;
      if (wasEdit) {
        await SGE.Api.mutations.putPedido(SGE.Ped._editPedidoId, {
          clienteId: body.clienteId,
          direccionEntrega: body.direccionEntrega,
          observaciones: body.observaciones,
          lineas: body.lineas
        });
      } else {
        await SGE.Api.mutations.postPedido(body);
      }
      await SGE.Api.reloadAfterMutation();
      SGE.Ped._editPedidoId = null;
      SGE.Modal.close('modal-pedido');
      SGE.Toast.show(wasEdit ? 'Pedido actualizado' : 'Pedido registrado (borrador). Confirme desde la tabla.');
      SGE.Router.navigate('pedidos');
    } catch (e) {
      SGE.Toast.show(e.message || 'Error al guardar pedido', 'error');
    }
  },

  applyFilters: () => {
    const table = document.getElementById('pedidos-table');
    if (!table) return;
    const q = (document.getElementById('pedidos-search')?.value || '').toLowerCase().trim();
    const est = document.getElementById('ped-estado-filter')?.value || '';
    const f = document.getElementById('pedidos-date-filter')?.value || '';
    const soloConf = !!document.getElementById('ped-solo-logistica')?.checked;
    table.querySelectorAll('tbody tr').forEach((tr) => {
      const estado = tr.dataset.estado || '';
      const texto = tr.textContent.toLowerCase();
      const okSearch = !q || texto.includes(q);
      const okEst = !est || estado === est;
      const d = (tr.dataset.fecha || '').slice(0, 10);
      const okDate = !f || d === f;
      const okLog = !soloConf || estado === 'Confirmado';
      tr.style.display = okSearch && okEst && okDate && okLog ? '' : 'none';
    });
  },

  _pedidosDesdeMeses: (months) => {
    const from = new Date();
    from.setMonth(from.getMonth() - months);
    from.setHours(0, 0, 0, 0);
    return (SGE.DB.pedidos || []).filter((p) => {
      if (p.estado === 'Cancelado') return false;
      const d = new Date(p.fecha);
      return !Number.isNaN(d.getTime()) && d >= from;
    });
  },

  _rankClientesDesdePedidos: (months) => {
    const peds = SGE.Ped._pedidosDesdeMeses(months);
    const acc = {};
    peds.forEach((p) => {
      const k = p.cliente || '—';
      if (!acc[k]) acc[k] = { cliente: k, pedidos: 0, total: 0 };
      acc[k].pedidos += 1;
      acc[k].total += Number(p.total) || 0;
    });
    return Object.values(acc).sort((a, b) => (b.pedidos - a.pedidos) || (b.total - a.total)).slice(0, 10);
  },

  refreshAnalytics: () => {
    const meses = parseInt(document.getElementById('ped-analytics-meses')?.value || '6', 10) || 6;
    const cliEl = document.getElementById('ped-analytics-clientes');
    const prodEl = document.getElementById('ped-analytics-prods');
    const esc = typeof SGE.Export?.escapeHtml === 'function' ? SGE.Export.escapeHtml : (s) => String(s ?? '');
    const rows = SGE.Ped._rankClientesDesdePedidos(meses);
    if (cliEl) {
      if (!rows.length) {
        cliEl.innerHTML = '<div style="color:var(--text-muted);font-size:.85rem;">Sin pedidos en el período seleccionado.</div>';
      } else {
        const max = Math.max(...rows.map((x) => x.pedidos || 0), 1);
        cliEl.innerHTML = rows.map((c, i) => `
        <div class="top-item">
          <div class="top-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}">${i + 1}</div>
          <div class="top-bar-wrap">
            <div style="font-weight:600;font-size:.84rem;">${esc(c.cliente)}</div>
            <div class="top-bar"><div class="top-bar-fill" style="width:${Math.round(((c.pedidos || 0) / max) * 100)}%"></div></div>
          </div>
          <div class="top-count">${c.pedidos || 0} pedidos</div>
        </div>`).join('');
      }
    }
    const pmv = ((SGE.DB.reportes && SGE.DB.reportes.productos_mas_vendidos) || []).slice()
      .sort((a, b) => (b.unidades || 0) - (a.unidades || 0))
      .slice(0, 10);
    if (prodEl) {
      if (!pmv.length) {
        prodEl.innerHTML = '<div style="color:var(--text-muted);font-size:.85rem;">Sin datos disponibles.</div>';
      } else {
        const max = Math.max(...pmv.map((x) => x.unidades || 0), 1);
        prodEl.innerHTML = pmv.map((p, i) => `
        <div class="top-item">
          <div class="top-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}">${i + 1}</div>
          <div class="top-bar-wrap">
            <div style="font-weight:600;font-size:.84rem;">${esc(p.producto)}</div>
            <div class="top-bar"><div class="top-bar-fill" style="width:${Math.round(((p.unidades || 0) / max) * 100)}%"></div></div>
          </div>
          <div class="top-count">${p.unidades || 0} unid.</div>
        </div>`).join('');
      }
    }
  }
};

document.addEventListener('view:ready', (e) => {
  if (e.detail?.view === 'pedidos' && typeof SGE.Ped?.applyFilters === 'function') {
    SGE.Ped.applyFilters();
  }
  if (e.detail?.view === 'pedidos-analytics' && typeof SGE.Ped?.refreshAnalytics === 'function') {
    SGE.Ped.refreshAnalytics();
  }
});