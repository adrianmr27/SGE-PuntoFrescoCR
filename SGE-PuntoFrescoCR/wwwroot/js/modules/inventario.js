/* SGE Punto Fresco - split module */
'use strict';

SGE.Router.register('inventario', () => {
  const alertas = SGE.DB.productos.filter(p => p.stock <= p.stock_min && p.estado === 'Activo');
  const cats = [...new Set(SGE.DB.productos.map(p => p.categoria))];
  return `
<div class="page-header">
  <div class="page-title">
    <h2>Módulo de Inventario</h2>
    <p>Consulta, gestión y trazabilidad de productos</p>
  </div>
  <div class="page-actions">
    <button type="button" class="btn btn-outline" onclick="SGE.Router.navigate('inventario-movs')"><i class="bi bi-journal-text me-1" aria-hidden="true"></i>Historial</button>
    <button type="button" class="btn btn-primary" onclick="SGE.Inv.openNew()"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Nuevo Producto</button>
  </div>
</div>

${alertas.length ? `
<div class="alert-banner danger">
  <span class="alert-banner-icon stat-icon-bi" style="font-size:1.25rem;"><i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i></span>
  <div class="alert-banner-body">
    <div class="alert-banner-title"><i class="bi bi-exclamation-circle me-1" aria-hidden="true"></i>${alertas.length} producto(s) con stock crítico</div>
    ${alertas.map(p=>`<span style="margin-right:.5rem;"><strong>${p.nombre}</strong>: ${p.stock} unid. (mín: ${p.stock_min})</span>`).join('')}
  </div>
</div>` : ''}

<div class="stat-grid" style="margin-bottom:1.25rem;">
  <div class="stat-card">
    <div class="stat-icon navy stat-icon-bi"><i class="bi bi-box-seam" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${SGE.DB.productos.filter(p=>p.estado==='Activo').length}</div>
      <div class="stat-lbl">Productos Activos</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon teal stat-icon-bi"><i class="bi bi-folder2-open" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${cats.length}</div>
      <div class="stat-lbl">Categorías</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon coral stat-icon-bi"><i class="bi bi-exclamation-triangle" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${alertas.length}</div>
      <div class="stat-lbl">Stock Bajo</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon green stat-icon-bi"><i class="bi bi-currency-dollar" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${SGE.fmt.currency(SGE.DB.productos.reduce((s,p)=>s+p.precio_venta*p.stock,0))}</div>
      <div class="stat-lbl">Valor en Inventario</div>
    </div>
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon"></span>
    <input class="search-input" placeholder="Buscar producto..." data-table="inv-table">
  </div>
  <select class="filter-select" data-table="inv-table" data-col="2">
    <option value="">Todas las categorías</option>
    ${cats.map(c=>`<option>${c}</option>`).join('')}
  </select>
  <select class="filter-select" data-table="inv-table" data-col="6">
    <option value="">Todos los estados</option>
    <option>Activo</option><option>Inactivo</option>
  </select>
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table id="inv-table">
        <thead><tr>
          <th>#</th><th>Producto</th><th>Categoría</th><th>P. Compra</th><th>P. Venta</th><th>IVA</th><th>Estado</th><th>Stock</th><th>Acciones</th>
        </tr></thead>
        <tbody>
          ${SGE.DB.productos.map(p => {
            const stockClass = p.stock === 0 ? 'color:#c0464b;font-weight:700;' : p.stock <= p.stock_min ? 'color:#b8860b;font-weight:700;' : 'color:var(--green-dark);font-weight:700;';
            const stockIcon = p.stock === 0
              ? '<i class="bi bi-circle-fill me-1" style="font-size:.45rem;vertical-align:.15em;color:#c0464b;" aria-hidden="true"></i>'
              : p.stock <= p.stock_min
                ? '<i class="bi bi-circle-fill me-1" style="font-size:.45rem;vertical-align:.15em;color:#b8860b;" aria-hidden="true"></i>'
                : '<i class="bi bi-circle-fill me-1" style="font-size:.45rem;vertical-align:.15em;color:var(--green-dark);" aria-hidden="true"></i>';
            return `<tr data-fecha="${p.fecha}">
              <td style="color:var(--text-muted)">${p.id}</td>
              <td class="td-name">${p.nombre}</td>
              <td><span class="badge badge-info">${p.categoria}</span></td>
              <td style="font-size:.82rem;">${SGE.fmt.currency(p.precio_compra)}</td>
              <td style="font-weight:600;">${SGE.fmt.currency(p.precio_venta)}</td>
              <td><span class="badge badge-navy">${p.iva}</span></td>
              <td><span class="badge ${p.estado==='Activo'?'badge-active':'badge-inactive'}">${p.estado}</span></td>
              <td style="${stockClass}">${stockIcon} ${p.stock} uds.</td>
              <td>
                <div class="flex gap-1">
                  <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Inv.edit(${p.id})"><i class="bi bi-pencil" aria-hidden="true"></i></button>
                  <button type="button" class="btn btn-ghost btn-sm btn-icon" title="${p.estado==='Activo'?'Desactivar':'Activar'}" onclick="SGE.Inv.toggleActivo(${p.id})"><i class="bi bi-arrow-repeat" aria-hidden="true"></i></button>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div class="pagination">
    <span class="page-info">Mostrando ${SGE.DB.productos.length} de ${SGE.DB.productos.length} productos</span>
    <div class="page-btns">
      <button type="button" class="page-btn" aria-label="Anterior"><i class="bi bi-chevron-left" aria-hidden="true"></i></button><button type="button" class="page-btn active">1</button><button type="button" class="page-btn" aria-label="Siguiente"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
    </div>
  </div>
</div>

<!-- Modal Producto -->
<div class="modal-overlay" id="modal-producto">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title" id="prod-modal-title"><i class="bi bi-box-seam me-1" aria-hidden="true"></i>Nuevo Producto</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-grid cols-3">
        <div class="form-group col-span-2">
          <label class="form-label">Nombre del Producto <span>*</span></label>
          <input class="form-control" id="prod-nombre" placeholder="Nombre descriptivo">
        </div>
        <div class="form-group">
          <label class="form-label">Categoría <span>*</span></label>
          <select class="form-control" id="prod-cat">
            <option value="">Seleccione...</option>
            ${(SGE.DB.categorias || []).map(c => `<option value="${c.id}">${c.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Precio de Compra (₡) <span>*</span></label>
          <input class="form-control" type="number" id="prod-pcompra" placeholder="0" min="0">
        </div>
        <div class="form-group">
          <label class="form-label">Precio de Venta (₡) <span>*</span></label>
          <input class="form-control" type="number" id="prod-pventa" placeholder="0" min="0">
        </div>
        <div class="form-group">
          <label class="form-label">Tipo de Impuesto <span>*</span></label>
          <select class="form-control" id="prod-iva">
            ${(SGE.DB.parametrosIva || []).map(p=>`<option value="${p.id}">${p.nombre} (${p.valor})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Stock Actual</label>
          <input class="form-control" type="number" id="prod-stock" placeholder="0" min="0">
        </div>
        <div class="form-group">
          <label class="form-label">Stock Mínimo</label>
          <input class="form-control" type="number" id="prod-stock-min" placeholder="0" min="0">
          <span class="form-hint">Para alertas de reabastecimiento</span>
        </div>
        <div class="form-group">
          <label class="form-label">Estado</label>
          <select class="form-control" id="prod-estado"><option value="1">Activo</option><option value="0">Inactivo</option></select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button type="button" class="btn btn-primary" onclick="SGE.Inv.saveProduct()"><i class="bi bi-floppy me-1" aria-hidden="true"></i>Guardar</button>
    </div>
  </div>
</div>
`;
});

SGE.Router.register('inventario-movs', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Historial de Movimientos</h2>
    <p>Trazabilidad de entradas, salidas y ajustes de inventario</p>
  </div>
  <div class="page-actions">
    <button type="button" class="btn btn-outline" onclick="SGE.Router.navigate('inventario')"><i class="bi bi-arrow-left me-1" aria-hidden="true"></i>Volver</button>
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon"></span>
    <input class="search-input" placeholder="Buscar producto o referencia..." data-table="movs-table">
  </div>
  <select class="filter-select" data-table="movs-table" data-col="2">
    <option value="">Todos los tipos</option>
    <option>entrada</option><option>salida</option><option>ajuste</option>
  </select>
  <input type="date" class="filter-select" id="movs-date-from" title="Fecha desde" oninput="SGE.Inv.filterMovs()">
  <input type="date" class="filter-select" id="movs-date-to" title="Fecha hasta" oninput="SGE.Inv.filterMovs()">
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table id="movs-table">
        <thead><tr>
          <th style="width:44px;"></th><th>Producto / detalle</th><th style="text-align:center;">Tipo</th><th style="text-align:center;">Cantidad</th><th style="text-align:center;">Stock tras mov.</th><th style="text-align:right;">Fecha</th>
        </tr></thead>
        <tbody>
          ${SGE.DB.movimientos.map(m => `
          <tr class="movement-row mov-row-click" style="cursor:pointer;" role="button" tabindex="0" title="Ver detalle"
            data-tipo="${m.tipo}" data-fecha="${m.fecha}" data-mov-id="${m.id}"
            onclick="SGE.Inv.openMovDetalle(${m.id})"
            onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();SGE.Inv.openMovDetalle(${m.id});}">
            <td>
              <div class="mov-icon ${m.tipo}" style="margin:0 auto;">
                ${m.tipo === 'entrada' ? '<i class="bi bi-box-arrow-in-down" aria-hidden="true"></i>' : m.tipo === 'salida' ? '<i class="bi bi-box-arrow-up" aria-hidden="true"></i>' : '<i class="bi bi-arrow-repeat" aria-hidden="true"></i>'}
              </div>
            </td>
            <td>
              <div style="font-weight:600;font-size:.85rem;">${SGE.Export.escapeHtml(m.producto)}</div>
              <div style="font-size:.75rem;color:var(--text-muted);">${SGE.Export.escapeHtml(m.motivo)} · Ref: <code>${SGE.Export.escapeHtml(m.ref)}</code></div>
            </td>
            <td style="text-align:center;"><span class="badge ${m.tipo === 'entrada' ? 'badge-active' : m.tipo === 'salida' ? 'badge-danger' : 'badge-info'}">${m.tipo}</span></td>
            <td style="text-align:center;font-weight:700;font-size:.9rem;">${m.tipo === 'entrada' ? '+' : m.tipo === 'salida' ? '-' : '±'}${m.cantidad}</td>
            <td style="text-align:center;font-weight:700;">${m.stock_post}</td>
            <td style="text-align:right;font-size:.78rem;color:var(--text-muted);">${SGE.fmt.date(m.fecha)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
</div>

<div class="modal-overlay" id="modal-mov-detalle">
  <div class="modal modal-sm">
    <div class="modal-header">
      <span class="modal-title"><i class="bi bi-journal-text me-1" aria-hidden="true"></i>Detalle de movimiento</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body" id="mov-detalle-body"></div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-close-modal>Cerrar</button>
    </div>
  </div>
</div>
`);

SGE.Inv = {
  _editId: null,

  openNew: () => {
    SGE.Inv._editId = null;
    document.getElementById('prod-modal-title').innerHTML = '<i class="bi bi-box-seam me-1" aria-hidden="true"></i>Nuevo Producto';
    ['prod-nombre','prod-pcompra','prod-pventa','prod-stock','prod-stock-min'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = id === 'prod-stock-min' ? '5' : '';
    });
    const cat = document.getElementById('prod-cat');
    const iva = document.getElementById('prod-iva');
    const est = document.getElementById('prod-estado');
    if (cat) cat.selectedIndex = 0;
    if (iva && iva.options.length) iva.selectedIndex = 0;
    if (est) est.value = '1';
    SGE.Modal.open('modal-producto');
  },

  edit: (id) => {
    const p = SGE.DB.productos.find(x => x.id === id);
    if (!p) return;
    SGE.Inv._editId = id;
    document.getElementById('prod-modal-title').innerHTML = `<i class="bi bi-pencil me-1" aria-hidden="true"></i>Editar Producto — ${typeof SGE.Export?.escapeHtml === 'function' ? SGE.Export.escapeHtml(p.nombre) : p.nombre}`;
    document.getElementById('prod-nombre').value = p.nombre;
    document.getElementById('prod-pcompra').value = p.precio_compra;
    document.getElementById('prod-pventa').value = p.precio_venta;
    document.getElementById('prod-stock').value = p.stock;
    document.getElementById('prod-stock-min').value = p.stock_min;
    const cat = document.getElementById('prod-cat');
    if (cat) cat.value = String(p.categoria_id || '');
    const iva = document.getElementById('prod-iva');
    if (iva) iva.value = String(p.parametros_iva_id || '');
    const est = document.getElementById('prod-estado');
    if (est) est.value = p.estado === 'Activo' ? '1' : '0';
    SGE.Modal.open('modal-producto');
  },

  saveProduct: async () => {
    const nombre = document.getElementById('prod-nombre')?.value?.trim();
    const categoriaId = parseInt(document.getElementById('prod-cat')?.value, 10);
    const paramIva = parseInt(document.getElementById('prod-iva')?.value, 10);
    const body = {
      categoriaId,
      parametroIvaId: paramIva,
      nombre: nombre || '',
      descripcion: null,
      precioCompra: parseFloat(document.getElementById('prod-pcompra')?.value) || 0,
      precioVenta: parseFloat(document.getElementById('prod-pventa')?.value) || 0,
      stock: parseInt(document.getElementById('prod-stock')?.value, 10) || 0,
      stockMinimo: parseInt(document.getElementById('prod-stock-min')?.value, 10) || 0,
      activo: document.getElementById('prod-estado')?.value === '1'
    };
    if (!nombre || !categoriaId || !paramIva) {
      SGE.Toast.show('Complete categoría, IVA y nombre', 'error');
      return;
    }
    if (!SGE.Validate.numeroPositivo(body.precioCompra, false) || !SGE.Validate.numeroPositivo(body.precioVenta, false)) {
      SGE.Toast.show('Los precios deben ser números mayores que cero', 'error');
      return;
    }
    if (!SGE.Validate.enteroPositivo(body.stock, true) || !SGE.Validate.enteroPositivo(body.stockMinimo, true)) {
      SGE.Toast.show('Stock y stock mínimo deben ser números enteros válidos', 'error');
      return;
    }
    try {
      if (SGE.Inv._editId) {
        await SGE.Api.mutations.putProducto(SGE.Inv._editId, body);
      } else {
        await SGE.Api.mutations.postProducto(body);
      }
      await SGE.Api.reloadAfterMutation();
      SGE.Modal.close('modal-producto');
      SGE.Toast.show('Producto guardado');
      SGE.Router.navigate('inventario');
    } catch (e) {
      SGE.Toast.show(e.message || 'Error al guardar', 'error');
    }
  },

  toggleActivo: async (id) => {
    const p = SGE.DB.productos.find(x => x.id === id);
    if (!p) return;
    const body = {
      categoriaId: p.categoria_id,
      parametroIvaId: p.parametros_iva_id,
      nombre: p.nombre,
      descripcion: null,
      precioCompra: p.precio_compra,
      precioVenta: p.precio_venta,
      stock: p.stock,
      stockMinimo: p.stock_min,
      activo: p.estado !== 'Activo'
    };
    try {
      await SGE.Api.mutations.putProducto(id, body);
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show('Estado actualizado');
      SGE.Router.navigate('inventario');
    } catch (e) {
      SGE.Toast.show(e.message || 'Error', 'error');
    }
  },

  filterMovs: () => {
    const from = document.getElementById('movs-date-from')?.value || '';
    const to = document.getElementById('movs-date-to')?.value || '';
    document.querySelectorAll('#movs-table tbody tr').forEach(row => {
      const d = (row.dataset.fecha || '').slice(0, 10);
      const okFrom = !from || d >= from;
      const okTo = !to || d <= to;
      row.style.display = okFrom && okTo ? '' : 'none';
    });
  },

  openMovDetalle: (movId) => {
    const m = (SGE.DB.movimientos || []).find((x) => x.id === movId);
    const body = document.getElementById('mov-detalle-body');
    if (!m || !body) return;
    const esc = typeof SGE.Export?.escapeHtml === 'function' ? SGE.Export.escapeHtml : (s) => String(s ?? '');
    const sign = m.tipo === 'entrada' ? '+' : m.tipo === 'salida' ? '-' : '±';
    body.innerHTML = `
      <div class="info-grid">
        <div class="info-item col-span-2"><div class="info-label">Producto</div><div class="info-value">${esc(m.producto)}</div></div>
        <div class="info-item"><div class="info-label">Tipo</div><div class="info-value">${esc(m.tipo)}</div></div>
        <div class="info-item"><div class="info-label">Cantidad</div><div class="info-value">${sign}${m.cantidad}</div></div>
        <div class="info-item"><div class="info-label">Stock después</div><div class="info-value">${esc(String(m.stock_post))}</div></div>
        <div class="info-item"><div class="info-label">Fecha</div><div class="info-value">${SGE.fmt.date(m.fecha)}</div></div>
        <div class="info-item col-span-2"><div class="info-label">Motivo</div><div class="info-value">${esc(m.motivo)}</div></div>
        <div class="info-item col-span-2"><div class="info-label">Referencia</div><div class="info-value"><code>${esc(m.ref)}</code></div></div>
        <div class="info-item col-span-2"><div class="info-label">Id movimiento</div><div class="info-value">${esc(String(m.id))}</div></div>
      </div>`;
    SGE.Modal.open('modal-mov-detalle');
  }
};