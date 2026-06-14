/* SGE Punto Fresco - split module */
'use strict';

SGE.Router.register('compras', () => {
  const alertas = SGE.DB.productos.filter(p => p.stock <= p.stock_min && p.estado === 'Activo');
  return `
<div class="page-header">
  <div class="page-title">
    <h2>Módulo de Compras</h2>
    <p>Gestión de órdenes de compra a proveedores</p>
  </div>
  <div class="page-actions">
    <button type="button" class="btn btn-primary" onclick="SGE.Com.openNew()"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Nueva Orden de Compra</button>
  </div>
</div>

${alertas.length ? `
<div class="alert-banner warning">
  <span class="alert-banner-icon stat-icon-bi" style="font-size:1.2rem;"><i class="bi bi-exclamation-triangle" aria-hidden="true"></i></span>
  <div class="alert-banner-body">
    <div class="alert-banner-title">Stock bajo detectado</div>
    ${alertas.map(p=>`<strong>${p.nombre}</strong> (${p.stock} unid.) `).join(' · ')} — Se recomienda generar una orden de compra.
  </div>
</div>` : ''}

<!-- Filtros -->
<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon"></span>
    <input class="search-input" placeholder="Buscar por proveedor o número de orden..." data-table="compras-table">
  </div>
  <select class="filter-select" data-table="compras-table" data-col="3">
    <option value="">Todos los estados</option>
    <option>Pendiente</option><option>Confirmada</option><option>Cancelada</option>
  </select>
  <input type="date" class="filter-select" id="compras-date-filter" title="Filtrar por fecha" onchange="SGE.Com.applyFilters()">
  <button type="button" class="btn btn-outline btn-sm" onclick="SGE.Com.clearFilters()"><i class="bi bi-arrow-counterclockwise me-1" aria-hidden="true"></i>Limpiar</button>
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table id="compras-table">
        <thead><tr>
          <th>Nº Orden</th><th>Proveedor</th><th>Fecha</th><th>Estado</th><th>Ítems</th><th>Total</th><th>Acciones</th>
        </tr></thead>
        <tbody>
          ${SGE.DB.compras.map(c => {
            const estadoClass = { Confirmada:'badge-active', Pendiente:'badge-pending', Cancelada:'badge-danger' }[c.estado] || 'badge-info';
            const oid = c.orden_compra_id;
            return `<tr data-fecha="${c.fecha}">
              <td><code style="background:var(--surface-alt);padding:2px 7px;border-radius:4px;font-size:.8rem;font-weight:700;">${c.id}</code></td>
              <td class="td-name">${c.proveedor}</td>
              <td style="color:var(--text-muted);font-size:.82rem;">${SGE.fmt.date(c.fecha)}</td>
              <td><span class="badge ${estadoClass}">${c.estado}</span></td>
              <td><span class="badge badge-navy"><i class="bi bi-box-seam me-1" aria-hidden="true"></i>${c.items}</span></td>
              <td style="font-weight:700;color:var(--navy);">${SGE.fmt.currency(c.total)}</td>
              <td>
                <div class="flex gap-1">
                  <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Ver detalle" onclick="SGE.Com.view(${oid})"><i class="bi bi-eye" aria-hidden="true"></i></button>
                  ${c.estado === 'Pendiente' ? `
                  <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Com.edit('${c.id}', ${oid})"><i class="bi bi-pencil" aria-hidden="true"></i></button>
                  <button type="button" class="btn btn-success btn-sm" onclick="SGE.Com.confirm(${oid})"><i class="bi bi-check-lg me-1" aria-hidden="true"></i>Confirmar</button>
                  <button type="button" class="btn btn-danger btn-sm btn-icon" title="Cancelar" onclick="SGE.Com.cancel(${oid})"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
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
    <span class="page-info">Mostrando ${SGE.DB.compras.length} de ${SGE.DB.compras.length} órdenes</span>
    <div class="page-btns">
      <button type="button" class="page-btn" aria-label="Anterior"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
      <button type="button" class="page-btn active">1</button>
      <button type="button" class="page-btn" aria-label="Siguiente"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
    </div>
  </div>
</div>

<!-- Modal Nueva Orden de Compra -->
<div class="modal-overlay" id="modal-compra">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title" id="compra-modal-title"><i class="bi bi-cart3 me-1" aria-hidden="true"></i>Nueva Orden de Compra</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-grid" style="margin-bottom:1.25rem;">
        <div class="form-group">
          <label class="form-label">Proveedor <span>*</span></label>
          <select class="form-control" id="compra-prov">
            <option value="">Seleccione proveedor...</option>
            ${SGE.DB.proveedores.filter(p=>p.estado==='Activo').map(p=>`<option value="${p.id}">${p.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Fecha de Orden <span>*</span></label>
          <input class="form-control" type="date" id="compra-fecha" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Observaciones</label>
          <input class="form-control" id="compra-obs" placeholder="Notas adicionales para el proveedor...">
        </div>
      </div>

      <div class="form-divider-label">Productos</div>
      <div style="margin-top:.75rem;">
        <div class="order-line-head">
          <span>Producto</span><span>Cantidad</span><span>Precio Unit.</span><span>Subtotal</span><span></span>
        </div>
        <div id="compra-lines">
          ${SGE.Com.renderLine(0)}
          ${SGE.Com.renderLine(1)}
        </div>
        <button type="button" class="btn-add-line" onclick="SGE.Com.addLine()"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Agregar producto</button>
      </div>

      <div class="order-totals" id="compra-totals">
        <div class="order-total-row"><span class="lbl">Subtotal:</span><span class="val" id="ct-sub">₡0.00</span></div>
        <div class="order-total-row"><span class="lbl">IVA (13%):</span><span class="val" id="ct-iva">₡0.00</span></div>
        <div class="order-total-row grand"><span class="lbl">Total:</span><span class="val" id="ct-total">₡0.00</span></div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button type="button" class="btn btn-outline" onclick="SGE.Com.saveDraft()"><i class="bi bi-floppy me-1" aria-hidden="true"></i>Guardar como Borrador</button>
      <button type="button" class="btn btn-primary" onclick="SGE.Com.saveOrder()"><i class="bi bi-send me-1" aria-hidden="true"></i>Registrar Orden</button>
    </div>
  </div>
</div>

<!-- Modal Detalle Orden -->
<div class="modal-overlay" id="modal-compra-detail">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title"><i class="bi bi-cart3 me-1" aria-hidden="true"></i>Detalle de Orden de Compra</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body" id="compra-detail-body"></div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-close-modal>Cerrar</button>
    </div>
  </div>
</div>

<!-- Modal Confirmar -->
<div class="modal-overlay" id="modal-confirm-oc">
  <div class="modal modal-sm">
    <div class="modal-header">
      <span class="modal-title"><i class="bi bi-check-circle me-1" aria-hidden="true"></i>Confirmar Orden de Compra</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <p style="font-size:.9rem;color:var(--text-secondary);margin-bottom:1rem;">
        Al confirmar esta orden, los productos serán <strong>ingresados automáticamente al inventario</strong>. ¿Desea continuar?
      </p>
      <div style="background:var(--teal-light);border-radius:var(--radius-sm);padding:.85rem;font-size:.83rem;color:#2ca892;">
        <i class="bi bi-box-seam me-1" aria-hidden="true"></i>El sistema actualizará el stock de cada producto según las cantidades indicadas en la orden.
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button type="button" class="btn btn-success" id="btn-confirm-oc"><i class="bi bi-check-lg me-1" aria-hidden="true"></i>Sí, Confirmar</button>
    </div>
  </div>
</div>
`;
});

SGE.Com = {
  lineCount: 2,
  _editOrdenCompraId: null,
  openNew: () => {
    SGE.Com._editOrdenCompraId = null;
    document.getElementById('compra-modal-title').innerHTML = '<i class="bi bi-cart3 me-1" aria-hidden="true"></i>Nueva Orden de Compra';
    const prov = document.getElementById('compra-prov');
    if (prov) prov.value = '';
    const f = document.getElementById('compra-fecha');
    if (f) f.value = new Date().toISOString().split('T')[0];
    const obs = document.getElementById('compra-obs');
    if (obs) obs.value = '';
    const lines = document.getElementById('compra-lines');
    if (lines) lines.innerHTML = `${SGE.Com.renderLine(SGE.Com.lineCount++)}${SGE.Com.renderLine(SGE.Com.lineCount++)}`;
    SGE.Com.calcTotals();
    SGE.Modal.open('modal-compra');
  },

  renderLine: (idx) => `
    <div class="order-line" id="cline-${idx}">
      <select class="form-control" style="font-size:.82rem;" onchange="SGE.Com.onLineChange(this)">
        <option value="">Seleccione producto...</option>
        ${SGE.DB.productos.filter(p=>p.estado==='Activo').map(p=>{
          const iva = (parseFloat(String(p.iva).replace('%','')) || 13);
          return `<option value="${p.id}" data-precio="${p.precio_compra}" data-iva="${iva}">${p.nombre}</option>`;
        }).join('')}
      </select>
      <input class="form-control" type="number" min="1" value="1" style="font-size:.82rem;" oninput="SGE.Com.calcTotals()">
      <input class="form-control" type="number" min="0" placeholder="0" style="font-size:.82rem;" oninput="SGE.Com.calcTotals()">
      <span style="font-size:.82rem;font-weight:600;color:var(--navy);text-align:right;padding:.4rem;">₡0.00</span>
      <button type="button" class="btn btn-ghost btn-sm btn-icon" onclick="document.getElementById('cline-${idx}').remove(); SGE.Com.calcTotals()" style="color:var(--coral);" aria-label="Quitar línea"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>`,

  onLineChange: (sel) => {
    const row = sel.closest('.order-line');
    const opt = sel.selectedOptions[0];
    const priceInp = row?.querySelectorAll('input[type=number]')[1];
    if (opt && priceInp && opt.dataset.precio) priceInp.value = opt.dataset.precio;
    SGE.Com.calcTotals();
  },

  addLine: () => {
    const c = SGE.Com.lineCount++;
    const container = document.getElementById('compra-lines');
    if (!container) return;
    container.insertAdjacentHTML('beforeend', SGE.Com.renderLine(c));
    SGE.initView && SGE.initView('compras');
  },

  calcTotals: () => {
    let sub = 0, iva = 0;
    document.querySelectorAll('#compra-lines .order-line').forEach(row => {
      const sel = row.querySelector('select');
      const opt = sel?.selectedOptions[0];
      const qty = parseFloat(row.querySelectorAll('input[type=number]')[0]?.value) || 0;
      const priceInp = row.querySelectorAll('input[type=number]')[1];
      const price = parseFloat(priceInp?.value) || parseFloat(opt?.dataset?.precio) || 0;
      const pct = parseFloat(opt?.dataset?.iva) || 13;
      const s = qty * price;
      const lineIva = s * (pct / 100);
      sub += s;
      iva += lineIva;
      const subEl = row.querySelector('span');
      if (subEl) subEl.textContent = SGE.fmt.currency(s + lineIva);
    });
    const el = (id) => document.getElementById(id);
    if (el('ct-sub'))   el('ct-sub').textContent   = SGE.fmt.currency(sub);
    if (el('ct-iva'))   el('ct-iva').textContent   = SGE.fmt.currency(iva);
    if (el('ct-total')) el('ct-total').textContent = SGE.fmt.currency(sub + iva);
  },

  view: async (ordenCompraId) => {
    const oc = SGE.DB.compras.find(c => c.orden_compra_id === ordenCompraId);
    const bodyEl = document.getElementById('compra-detail-body');
    if (!bodyEl) return;
    if (!oc) {
      SGE.Toast.show('No se encontró la orden', 'error');
      return;
    }
    bodyEl.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;"><i class="bi bi-hourglass-split" aria-hidden="true"></i> Cargando detalle…</p>';
    SGE.Modal.open('modal-compra-detail');
    let d;
    try {
      d = await SGE.Api.mutations.getOrdenCompraDetalle(ordenCompraId);
    } catch (e) {
      SGE.Modal.close('modal-compra-detail');
      SGE.Toast.show(e.message || 'No se pudo cargar el detalle', 'error');
      return;
    }
    const eCls = { Confirmada:'badge-active', Pendiente:'badge-pending', Cancelada:'badge-danger' }[(d && d.estado) || oc.estado] || 'badge-info';
    const lineas = (d && d.lineas) || [];
    const rows = lineas.map(ln => `<tr>
        <td style="font-size:.82rem;">${ln.producto || ('#' + ln.productoId)}</td>
        <td style="text-align:right;">${ln.cantidad}</td>
        <td style="text-align:right;">${SGE.fmt.currency(ln.precioUnitario)}</td>
        <td style="text-align:right;">${ln.porcentajeIVA ?? '—'}%</td>
        <td style="text-align:right;">${SGE.fmt.currency(ln.subtotal)}</td>
        <td style="text-align:right;">${SGE.fmt.currency(ln.montoIVA)}</td>
        <td style="text-align:right;font-weight:600;">${SGE.fmt.currency(ln.total)}</td>
      </tr>`).join('');
    bodyEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
        <div>
          <div style="font-size:.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;">Orden de Compra</div>
          <div style="font-size:1.2rem;font-weight:800;color:var(--navy);">${oc.id}</div>
        </div>
        <span class="badge ${eCls}" style="font-size:.8rem;">${(d && d.estado) || oc.estado}</span>
      </div>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">Proveedor</div><div class="info-value">${(d && d.proveedor) || oc.proveedor}</div></div>
        <div class="info-item"><div class="info-label">Fecha</div><div class="info-value">${SGE.fmt.date((d && d.fechaOrden) || oc.fecha)}</div></div>
        ${d && d.observaciones ? `<div class="info-item col-span-2"><div class="info-label">Observaciones</div><div class="info-value">${d.observaciones}</div></div>` : ''}
        <div class="info-item"><div class="info-label">Subtotal</div><div class="info-value">${d ? SGE.fmt.currency(d.subtotal) : '—'}</div></div>
        <div class="info-item"><div class="info-label">IVA</div><div class="info-value">${d ? SGE.fmt.currency(d.montoIVA) : '—'}</div></div>
        <div class="info-item"><div class="info-label">Total</div><div class="info-value" style="font-size:1.1rem;font-weight:800;color:var(--navy);">${SGE.fmt.currency((d && d.total) != null ? d.total : oc.total)}</div></div>
      </div>
      <h4 style="margin:1rem 0 .5rem 0;font-size:.95rem;"><i class="bi bi-box-seam me-1" aria-hidden="true"></i>Productos</h4>
      <div class="table-wrap" style="max-height:260px;overflow:auto;">
        <table style="font-size:.8rem;width:100%;border-collapse:collapse;">
          <thead><tr><th>Producto</th><th style="text-align:right;">Cant.</th><th style="text-align:right;">P. unit.</th><th style="text-align:right;">IVA %</th><th style="text-align:right;">Subt.</th><th style="text-align:right;">IVA</th><th style="text-align:right;">Total</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="7" style="color:var(--text-muted);">Sin líneas.</td></tr>'}</tbody>
        </table>
      </div>`;
  },

  edit: async (displayId, ordenCompraId) => {
    try {
      const d = await SGE.Api.mutations.getOrdenCompraDetalle(ordenCompraId);
      if (!d || d.estado !== 'Pendiente') {
        SGE.Toast.show('Solo se pueden editar órdenes pendientes', 'error');
        return;
      }
      SGE.Com._editOrdenCompraId = ordenCompraId;
      document.getElementById('compra-modal-title').innerHTML = `<i class="bi bi-pencil me-1" aria-hidden="true"></i>Editar Orden — ${typeof SGE.Export?.escapeHtml === 'function' ? SGE.Export.escapeHtml(displayId) : displayId}`;
      document.getElementById('compra-prov').value = String(d.proveedorId);
      document.getElementById('compra-fecha').value = (d.fechaOrden || '').slice(0, 10);
      document.getElementById('compra-obs').value = d.observaciones || '';
      const lines = document.getElementById('compra-lines');
      if (!lines) return;
      lines.innerHTML = '';
      const lns = d.lineas || [];
      if (!lns.length) {
        lines.innerHTML = `${SGE.Com.renderLine(0)}`;
      } else {
        lns.forEach((ln, i) => {
          const idx = SGE.Com.lineCount++;
          lines.insertAdjacentHTML('beforeend', SGE.Com.renderLine(idx));
          const row = document.getElementById(`cline-${idx}`);
          if (!row) return;
          const sel = row.querySelector('select');
          const qty = row.querySelectorAll('input[type=number]')[0];
          const price = row.querySelectorAll('input[type=number]')[1];
          if (sel) sel.value = String(ln.productoId);
          if (qty) qty.value = String(ln.cantidad || 1);
          if (price) price.value = String(ln.precioUnitario || 0);
        });
      }
      SGE.Com.calcTotals();
      SGE.Modal.open('modal-compra');
    } catch (e) {
      SGE.Toast.show(e.message || 'No se pudo cargar la orden', 'error');
    }
  },

  confirm: (ordenCompraId) => {
    document.getElementById('btn-confirm-oc').onclick = async () => {
      try {
        await SGE.Api.mutations.confirmarOrdenCompra(ordenCompraId);
        await SGE.Api.reloadAfterMutation();
        SGE.Modal.close('modal-confirm-oc');
        SGE.Toast.show('Orden confirmada. Inventario actualizado.');
        SGE.Router.navigate('compras');
      } catch (e) {
        SGE.Toast.show(e.message || 'No se pudo confirmar', 'error');
      }
    };
    SGE.Modal.open('modal-confirm-oc');
  },

  cancel: async (ordenCompraId) => {
    try {
      await SGE.Api.mutations.cancelarOrdenCompra(ordenCompraId);
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show('Orden cancelada', 'error');
      SGE.Router.navigate('compras');
    } catch (e) {
      SGE.Toast.show(e.message || 'No se pudo cancelar', 'error');
    }
  },

  collectLineas: () => {
    const lineas = [];
    document.querySelectorAll('#compra-lines .order-line').forEach(row => {
      const sel = row.querySelector('select');
      const pid = parseInt(sel?.value, 10);
      if (!pid) return;
      const qty = parseInt(row.querySelectorAll('input[type=number]')[0]?.value, 10) || 0;
      const price = parseFloat(row.querySelectorAll('input[type=number]')[1]?.value) || 0;
      const opt = sel.selectedOptions[0];
      const pct = parseFloat(opt?.dataset?.iva) || 13;
      if (qty > 0 && price >= 0) lineas.push({ productoId: pid, cantidad: qty, precioUnitario: price, porcentajeIVA: pct });
    });
    return lineas;
  },

  saveOrder: async () => {
    const prov = document.getElementById('compra-prov')?.value;
    if (!prov) { SGE.Toast.show('Seleccione un proveedor', 'error'); return; }
    const lineas = SGE.Com.collectLineas();
    if (!lineas.length) { SGE.Toast.show('Agregue al menos un producto', 'error'); return; }
    const fecha = document.getElementById('compra-fecha')?.value;
    const obs = document.getElementById('compra-obs')?.value || '';
    try {
      const payload = {
        proveedorId: parseInt(prov, 10),
        fechaOrden: fecha || null,
        observaciones: obs || null,
        lineas
      };
      if (SGE.Com._editOrdenCompraId) {
        await SGE.Api.mutations.putOrdenCompra(SGE.Com._editOrdenCompraId, payload);
      } else {
        await SGE.Api.mutations.postOrdenCompra(payload);
      }
      await SGE.Api.reloadAfterMutation();
      SGE.Modal.close('modal-compra');
      SGE.Toast.show(SGE.Com._editOrdenCompraId ? 'Orden de compra actualizada' : 'Orden de compra registrada');
      SGE.Com._editOrdenCompraId = null;
      SGE.Router.navigate('compras');
    } catch (e) {
      SGE.Toast.show(e.message || 'No se pudo registrar', 'error');
    }
  },

  saveDraft: () => {
    SGE.Toast.show('Use "Registrar orden" para guardar como pendiente en el sistema.', 'info');
  },

  applyFilters: () => {
    const f = document.getElementById('compras-date-filter')?.value || '';
    document.querySelectorAll('#compras-table tbody tr').forEach(tr => {
      if (!f) { tr.style.display = ''; return; }
      const d = (tr.dataset.fecha || '').slice(0, 10);
      tr.style.display = d === f ? '' : 'none';
    });
  },

  clearFilters: () => {
    const f = document.getElementById('compras-date-filter');
    if (f) f.value = '';
    SGE.Com.applyFilters();
  }
};