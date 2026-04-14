/* ═══════════════════════════════════════════════════════
   SGE Punto Fresco · Views Part 2
   Compras · Inventario · Pedidos · Licitaciones
   ═══════════════════════════════════════════════════════ */

/* ── Extended Mock Data ─────────────────────────────── */
Object.assign(SGE.DB, {
  productos: [
    { id: 1, nombre: 'Tomate Cherry',    categoria: 'Vegetales',   precio_compra: 850,  precio_venta: 1200, iva: '13%', stock: 45,  stock_min: 20, estado: 'Activo' },
    { id: 2, nombre: 'Lechuga Romana',   categoria: 'Vegetales',   precio_compra: 600,  precio_venta: 900,  iva: '13%', stock: 8,   stock_min: 15, estado: 'Activo' },
    { id: 3, nombre: 'Queso Gouda',      categoria: 'Lácteos',     precio_compra: 3200, precio_venta: 4800, iva: '13%', stock: 30,  stock_min: 10, estado: 'Activo' },
    { id: 4, nombre: 'Pechuga de Pollo', categoria: 'Carnes',      precio_compra: 2800, precio_venta: 4200, iva: '13%', stock: 5,   stock_min: 12, estado: 'Activo' },
    { id: 5, nombre: 'Aceite de Oliva',  categoria: 'Aceites',     precio_compra: 4500, precio_venta: 6500, iva: '13%', stock: 22,  stock_min: 8,  estado: 'Activo' },
    { id: 6, nombre: 'Arroz Integral',   categoria: 'Granos',      precio_compra: 900,  precio_venta: 1400, iva: '0%',  stock: 60,  stock_min: 20, estado: 'Activo' },
    { id: 7, nombre: 'Yogurt Natural',   categoria: 'Lácteos',     precio_compra: 1100, precio_venta: 1600, iva: '4%',  stock: 18,  stock_min: 10, estado: 'Activo' },
    { id: 8, nombre: 'Espinaca Fresca',  categoria: 'Vegetales',   precio_compra: 700,  precio_venta: 1050, iva: '13%', stock: 0,   stock_min: 10, estado: 'Inactivo' },
  ],
  compras: [
    { id: 'OC-2024-041', proveedor: 'Agro Tico S.A.',            fecha: '2024-06-05', total: 185000, estado: 'Confirmada', items: 4 },
    { id: 'OC-2024-042', proveedor: 'Distribuidora Nacional S.A.', fecha: '2024-06-07', total: 320000, estado: 'Confirmada', items: 6 },
    { id: 'OC-2024-043', proveedor: 'Lácteos del Trópico S.A.',  fecha: '2024-06-09', total: 95000,  estado: 'Pendiente',  items: 2 },
    { id: 'OC-2024-044', proveedor: 'Agro Tico S.A.',            fecha: '2024-06-10', total: 210000, estado: 'Pendiente',  items: 5 },
    { id: 'OC-2024-045', proveedor: 'Importaciones CR LTDA',     fecha: '2024-06-11', total: 450000, estado: 'Cancelada',  items: 3 },
  ],
  movimientos: [
    { id: 1, producto: 'Tomate Cherry',   tipo: 'entrada', cantidad: 50, stock_post: 45, ref: 'OC-2024-041', fecha: '2024-06-05', motivo: 'Compra' },
    { id: 2, producto: 'Lechuga Romana',  tipo: 'salida',  cantidad: 7,  stock_post: 8,  ref: 'PED-2024-033',fecha: '2024-06-06', motivo: 'Pedido' },
    { id: 3, producto: 'Queso Gouda',     tipo: 'entrada', cantidad: 30, stock_post: 30, ref: 'OC-2024-042', fecha: '2024-06-07', motivo: 'Compra' },
    { id: 4, producto: 'Pechuga de Pollo',tipo: 'salida',  cantidad: 8,  stock_post: 5,  ref: 'PED-2024-034',fecha: '2024-06-08', motivo: 'Pedido' },
    { id: 5, producto: 'Arroz Integral',  tipo: 'ajuste',  cantidad: 5,  stock_post: 60, ref: 'ADJ-001',     fecha: '2024-06-09', motivo: 'Ajuste manual' },
  ],
  pedidos: [
    { id: 'PED-2024-031', cliente: 'Supermercados La Colonia S.A.', fecha: '2024-06-04', total: 248000, estado: 'Entregado',  items: 5 },
    { id: 'PED-2024-032', cliente: 'Restaurant El Fogón Tico',       fecha: '2024-06-06', total: 136500, estado: 'Entregado',  items: 3 },
    { id: 'PED-2024-033', cliente: 'Cafetería Universidad Latina',   fecha: '2024-06-08', total: 89000,  estado: 'Confirmado', items: 4 },
    { id: 'PED-2024-034', cliente: 'Supermercados La Colonia S.A.', fecha: '2024-06-10', total: 315000, estado: 'Confirmado', items: 6 },
    { id: 'PED-2024-035', cliente: 'Mini Super Don Carlos',          fecha: '2024-06-11', total: 54000,  estado: 'Cancelado',  items: 2 },
  ],
  licitaciones: [
    { id: 'LIC-2024-001', institucion: 'CCSS',                  contacto: 'Ing. Roberto Pérez',   estado: 'adjudicado',  fecha_oferta: '2024-05-30', total: 4800000 },
    { id: 'LIC-2024-002', institucion: 'MEP',                   contacto: 'Lic. Ana Solano',      estado: 'enviada',     fecha_oferta: '2024-06-15', total: 2350000 },
    { id: 'LIC-2024-003', institucion: 'ICE',                   contacto: 'Ing. Mario Rodríguez', estado: 'preparacion', fecha_oferta: '2024-06-28', total: 1200000 },
    { id: 'LIC-2024-004', institucion: 'Universidad de Costa Rica', contacto: 'Dr. Carlos Méndez', estado: 'analisis',   fecha_oferta: '2024-07-05', total: 890000  },
    { id: 'LIC-2024-005', institucion: 'BNCR',                  contacto: 'Lic. Sofía Vargas',    estado: 'no-adj',      fecha_oferta: '2024-05-20', total: 3100000 },
  ],
});

/* ══════════════════════════════════════════════════════
   COMPRAS VIEW
   ══════════════════════════════════════════════════════ */
SGE.Router.register('compras', () => {
  const alertas = SGE.DB.productos.filter(p => p.stock <= p.stock_min && p.estado === 'Activo');
  return `
<div class="page-header">
  <div class="page-title">
    <h2>Módulo de Compras</h2>
    <p>Gestión de órdenes de compra a proveedores</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-primary" data-modal="modal-compra">➕ Nueva Orden de Compra</button>
  </div>
</div>

${alertas.length ? `
<div class="alert-banner warning">
  <span class="alert-banner-icon">⚠️</span>
  <div class="alert-banner-body">
    <div class="alert-banner-title">Stock bajo detectado</div>
    ${alertas.map(p=>`<strong>${p.nombre}</strong> (${p.stock} unid.) `).join(' · ')} — Se recomienda generar una orden de compra.
  </div>
</div>` : ''}

<!-- Filtros -->
<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon">🔍</span>
    <input class="search-input" placeholder="Buscar por proveedor o número de orden..." data-table="compras-table">
  </div>
  <select class="filter-select" data-table="compras-table" data-col="3">
    <option value="">Todos los estados</option>
    <option>Pendiente</option><option>Confirmada</option><option>Cancelada</option>
  </select>
  <input type="date" class="filter-select" title="Filtrar por fecha">
  <button class="btn btn-outline btn-sm">🔄 Limpiar</button>
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
            return `<tr>
              <td><code style="background:var(--surface-alt);padding:2px 7px;border-radius:4px;font-size:.8rem;font-weight:700;">${c.id}</code></td>
              <td class="td-name">${c.proveedor}</td>
              <td style="color:var(--text-muted);font-size:.82rem;">${SGE.fmt.date(c.fecha)}</td>
              <td><span class="badge ${estadoClass}">${c.estado}</span></td>
              <td><span class="badge badge-navy">📦 ${c.items}</span></td>
              <td style="font-weight:700;color:var(--navy);">${SGE.fmt.currency(c.total)}</td>
              <td>
                <div class="flex gap-1">
                  <button class="btn btn-ghost btn-sm btn-icon" title="Ver detalle" onclick="SGE.Com.view('${c.id}')">👁️</button>
                  ${c.estado === 'Pendiente' ? `
                  <button class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Com.edit('${c.id}')">✏️</button>
                  <button class="btn btn-success btn-sm" onclick="SGE.Com.confirm('${c.id}')">✅ Confirmar</button>
                  <button class="btn btn-danger btn-sm btn-icon" title="Cancelar" onclick="SGE.Com.cancel('${c.id}')">✕</button>
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
      <button class="page-btn">‹</button>
      <button class="page-btn active">1</button>
      <button class="page-btn">›</button>
    </div>
  </div>
</div>

<!-- Modal Nueva Orden de Compra -->
<div class="modal-overlay" id="modal-compra">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title" id="compra-modal-title">🛒 Nueva Orden de Compra</span>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-grid" style="margin-bottom:1.25rem;">
        <div class="form-group">
          <label class="form-label">Proveedor <span>*</span></label>
          <select class="form-control" id="compra-prov">
            <option value="">Seleccione proveedor...</option>
            ${SGE.DB.proveedores.filter(p=>p.estado==='Activo').map(p=>`<option>${p.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Fecha de Orden <span>*</span></label>
          <input class="form-control" type="date" id="compra-fecha" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Observaciones</label>
          <input class="form-control" placeholder="Notas adicionales para el proveedor...">
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
        <button class="btn-add-line" onclick="SGE.Com.addLine()">➕ Agregar producto</button>
      </div>

      <div class="order-totals" id="compra-totals">
        <div class="order-total-row"><span class="lbl">Subtotal:</span><span class="val" id="ct-sub">₡0.00</span></div>
        <div class="order-total-row"><span class="lbl">IVA (13%):</span><span class="val" id="ct-iva">₡0.00</span></div>
        <div class="order-total-row grand"><span class="lbl">Total:</span><span class="val" id="ct-total">₡0.00</span></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button class="btn btn-outline" onclick="SGE.Com.saveDraft()">💾 Guardar como Borrador</button>
      <button class="btn btn-primary" onclick="SGE.Com.saveOrder()">📤 Registrar Orden</button>
    </div>
  </div>
</div>

<!-- Modal Detalle Orden -->
<div class="modal-overlay" id="modal-compra-detail">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title">🛒 Detalle de Orden de Compra</span>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body" id="compra-detail-body"></div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cerrar</button>
    </div>
  </div>
</div>

<!-- Modal Confirmar -->
<div class="modal-overlay" id="modal-confirm-oc">
  <div class="modal modal-sm">
    <div class="modal-header">
      <span class="modal-title">✅ Confirmar Orden de Compra</span>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body">
      <p style="font-size:.9rem;color:var(--text-secondary);margin-bottom:1rem;">
        Al confirmar esta orden, los productos serán <strong>ingresados automáticamente al inventario</strong>. ¿Desea continuar?
      </p>
      <div style="background:var(--teal-light);border-radius:var(--radius-sm);padding:.85rem;font-size:.83rem;color:#2ca892;">
        📦 El sistema actualizará el stock de cada producto según las cantidades indicadas en la orden.
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button class="btn btn-success" id="btn-confirm-oc">✅ Sí, Confirmar</button>
    </div>
  </div>
</div>
`;
});

/* ══════════════════════════════════════════════════════
   INVENTARIO VIEW
   ══════════════════════════════════════════════════════ */
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
    <button class="btn btn-outline" onclick="SGE.Router.navigate('inventario-movs')">📋 Historial</button>
    <button class="btn btn-primary" data-modal="modal-producto">➕ Nuevo Producto</button>
  </div>
</div>

${alertas.length ? `
<div class="alert-banner danger">
  <span class="alert-banner-icon">🚨</span>
  <div class="alert-banner-body">
    <div class="alert-banner-title">⚠️ ${alertas.length} producto(s) con stock crítico</div>
    ${alertas.map(p=>`<span style="margin-right:.5rem;"><strong>${p.nombre}</strong>: ${p.stock} unid. (mín: ${p.stock_min})</span>`).join('')}
  </div>
</div>` : ''}

<div class="stat-grid" style="grid-template-columns:repeat(4,1fr); margin-bottom:1.25rem;">
  <div class="stat-card">
    <div class="stat-icon navy">📦</div>
    <div class="stat-info">
      <div class="stat-val">${SGE.DB.productos.filter(p=>p.estado==='Activo').length}</div>
      <div class="stat-lbl">Productos Activos</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon teal">🗂️</div>
    <div class="stat-info">
      <div class="stat-val">${cats.length}</div>
      <div class="stat-lbl">Categorías</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon coral">⚠️</div>
    <div class="stat-info">
      <div class="stat-val">${alertas.length}</div>
      <div class="stat-lbl">Stock Bajo</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon green">💰</div>
    <div class="stat-info">
      <div class="stat-val">${SGE.fmt.currency(SGE.DB.productos.reduce((s,p)=>s+p.precio_venta*p.stock,0))}</div>
      <div class="stat-lbl">Valor en Inventario</div>
    </div>
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon">🔍</span>
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
            const stockIcon = p.stock === 0 ? '🔴' : p.stock <= p.stock_min ? '🟡' : '🟢';
            return `<tr>
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
                  <button class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Inv.edit(${p.id})">✏️</button>
                  <button class="btn btn-ghost btn-sm btn-icon" title="${p.estado==='Activo'?'Desactivar':'Activar'}" onclick="SGE.Toast.show('Estado actualizado')">🔄</button>
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
      <button class="page-btn">‹</button><button class="page-btn active">1</button><button class="page-btn">›</button>
    </div>
  </div>
</div>

<!-- Modal Producto -->
<div class="modal-overlay" id="modal-producto">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title" id="prod-modal-title">📦 Nuevo Producto</span>
      <button class="modal-close">✕</button>
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
            <option>Vegetales</option><option>Frutas</option><option>Lácteos</option>
            <option>Carnes</option><option>Granos</option><option>Aceites</option><option>Otro</option>
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
            ${SGE.DB.parametros.map(p=>`<option value="${p.valor}">${p.nombre} (${p.valor})</option>`).join('')}
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
          <label class="switch-wrap"><div class="switch on"></div><span>Activo</span></label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button class="btn btn-primary" onclick="SGE.Modal.close('modal-producto'); SGE.Toast.show('Producto guardado correctamente')">💾 Guardar</button>
    </div>
  </div>
</div>
`;
});

/* Inventario — Historial de Movimientos */
SGE.Router.register('inventario-movs', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Historial de Movimientos</h2>
    <p>Trazabilidad de entradas, salidas y ajustes de inventario</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-outline" onclick="SGE.Router.navigate('inventario')">← Volver</button>
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon">🔍</span>
    <input class="search-input" placeholder="Buscar producto o referencia..." data-table="movs-table">
  </div>
  <select class="filter-select" data-table="movs-table" data-col="2">
    <option value="">Todos los tipos</option>
    <option>entrada</option><option>salida</option><option>ajuste</option>
  </select>
  <input type="date" class="filter-select" title="Fecha desde">
  <input type="date" class="filter-select" title="Fecha hasta">
</div>

<div class="card">
  <div class="card-body" style="padding:1rem 1.5rem;">
    <div id="movs-table">
      ${SGE.DB.movimientos.map(m => `
      <div class="movement-row">
        <div class="mov-icon ${m.tipo}">
          ${ m.tipo==='entrada'?'📥': m.tipo==='salida'?'📤':'🔄' }
        </div>
        <div>
          <div style="font-weight:600;font-size:.85rem;">${m.producto}</div>
          <div style="font-size:.75rem;color:var(--text-muted);">${m.motivo} · Ref: <code>${m.ref}</code></div>
        </div>
        <div style="text-align:center;">
          <span class="badge ${m.tipo==='entrada'?'badge-active':m.tipo==='salida'?'badge-danger':'badge-info'}">${m.tipo}</span>
        </div>
        <div style="text-align:center;font-weight:700;font-size:.9rem;">
          ${m.tipo==='entrada'?'+':m.tipo==='salida'?'-':'±'}${m.cantidad}
        </div>
        <div style="text-align:center;">
          <div style="font-size:.78rem;color:var(--text-muted);">Stock tras mov.</div>
          <div style="font-weight:700;">${m.stock_post}</div>
        </div>
        <div style="text-align:right;font-size:.78rem;color:var(--text-muted);">${SGE.fmt.date(m.fecha)}</div>
      </div>`).join('')}
    </div>
  </div>
</div>
`);

/* ══════════════════════════════════════════════════════
   PEDIDOS VIEW
   ══════════════════════════════════════════════════════ */
SGE.Router.register('pedidos', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Módulo de Pedidos</h2>
    <p>Registro y seguimiento de órdenes de venta a clientes</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-outline" onclick="SGE.Router.navigate('pedidos-analytics')">📊 Análisis</button>
    <button class="btn btn-primary" data-modal="modal-pedido">➕ Nuevo Pedido</button>
  </div>
</div>

<div class="stat-grid" style="grid-template-columns:repeat(4,1fr);">
  <div class="stat-card">
    <div class="stat-icon green">✅</div>
    <div class="stat-info">
      <div class="stat-val">${SGE.DB.pedidos.filter(p=>p.estado==='Confirmado').length}</div>
      <div class="stat-lbl">Confirmados</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon teal">🚚</div>
    <div class="stat-info">
      <div class="stat-val">${SGE.DB.pedidos.filter(p=>p.estado==='Entregado').length}</div>
      <div class="stat-lbl">Entregados</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon coral">✕</div>
    <div class="stat-info">
      <div class="stat-val">${SGE.DB.pedidos.filter(p=>p.estado==='Cancelado').length}</div>
      <div class="stat-lbl">Cancelados</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon navy">💰</div>
    <div class="stat-info">
      <div class="stat-val">${SGE.fmt.currency(SGE.DB.pedidos.filter(p=>p.estado!=='Cancelado').reduce((s,p)=>s+p.total,0))}</div>
      <div class="stat-lbl">Total del Mes</div>
    </div>
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon">🔍</span>
    <input class="search-input" placeholder="Buscar por cliente o número de pedido..." data-table="pedidos-table">
  </div>
  <select class="filter-select" data-table="pedidos-table" data-col="2">
    <option value="">Todos los estados</option>
    <option>Confirmado</option><option>Entregado</option><option>Cancelado</option>
  </select>
  <input type="date" class="filter-select" title="Filtrar por fecha">
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
            const eCls = { Confirmado:'badge-active', Entregado:'badge-info', Cancelado:'badge-danger' }[p.estado] || 'badge-navy';
            return `<tr>
              <td><code style="background:var(--surface-alt);padding:2px 7px;border-radius:4px;font-size:.8rem;font-weight:700;">${p.id}</code></td>
              <td class="td-name">${p.cliente}</td>
              <td><span class="badge ${eCls}">${p.estado}</span></td>
              <td style="color:var(--text-muted);font-size:.82rem;">${SGE.fmt.date(p.fecha)}</td>
              <td><span class="badge badge-navy">📋 ${p.items}</span></td>
              <td style="font-weight:700;color:var(--navy);">${SGE.fmt.currency(p.total)}</td>
              <td>
                <div class="flex gap-1">
                  <button class="btn btn-ghost btn-sm btn-icon" title="Ver / Entregar" onclick="SGE.Ped.view('${p.id}')">👁️</button>
                  ${p.estado === 'Confirmado' ? `
                  <button class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Ped.edit('${p.id}')">✏️</button>
                  <button class="btn btn-danger btn-sm btn-icon" title="Cancelar" onclick="SGE.Ped.cancel('${p.id}')">✕</button>
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
      <button class="page-btn">‹</button><button class="page-btn active">1</button><button class="page-btn">›</button>
    </div>
  </div>
</div>

<!-- Modal Nuevo Pedido -->
<div class="modal-overlay" id="modal-pedido">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title" id="ped-modal-title">📋 Nuevo Pedido</span>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-grid" style="margin-bottom:1.25rem;">
        <div class="form-group">
          <label class="form-label">Cliente <span>*</span></label>
          <select class="form-control" id="ped-cliente" onchange="SGE.Ped.showClientInfo(this.value)">
            <option value="">Seleccione cliente...</option>
            ${SGE.DB.clientes.filter(c=>c.estado==='Activo').map(c=>`<option>${c.nombre}</option>`).join('')}
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
        <strong style="color:var(--navy);">📍 Dirección de entrega:</strong>
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
        <button class="btn-add-line" onclick="SGE.Ped.addLine()">➕ Agregar producto</button>
      </div>

      <div class="order-totals">
        <div class="order-total-row"><span class="lbl">Subtotal:</span><span class="val" id="pt-sub">₡0.00</span></div>
        <div class="order-total-row"><span class="lbl">IVA:</span><span class="val" id="pt-iva">₡0.00</span></div>
        <div class="order-total-row grand"><span class="lbl">Total:</span><span class="val" id="pt-total">₡0.00</span></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button class="btn btn-primary" onclick="SGE.Ped.saveOrder()">📋 Registrar Pedido</button>
    </div>
  </div>
</div>

<!-- Modal Detalle Pedido -->
<div class="modal-overlay" id="modal-pedido-detail">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title">📋 Detalle de Pedido</span>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body" id="ped-detail-body"></div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cerrar</button>
    </div>
  </div>
</div>
`);

/* Pedidos — Analytics */
SGE.Router.register('pedidos-analytics', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Análisis de Pedidos</h2>
    <p>Clientes frecuentes y productos más solicitados</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-outline" onclick="SGE.Router.navigate('pedidos')">← Volver</button>
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;">
  <div class="card">
    <div class="card-header">
      <span class="card-title"><div class="card-title-icon" style="background:rgba(40,167,69,.1)">🏆</div> Clientes Más Frecuentes</span>
    </div>
    <div class="card-body">
      <div class="top-list">
        ${[
          {name:'Supermercados La Colonia S.A.', count:'12 pedidos', pct:100},
          {name:'Cafetería Universidad Latina',  count:'8 pedidos',  pct:67},
          {name:'Restaurant El Fogón Tico',      count:'6 pedidos',  pct:50},
          {name:'Mini Super Don Carlos',         count:'3 pedidos',  pct:25},
        ].map((c,i)=>`
        <div class="top-item">
          <div class="top-rank ${i===0?'gold':i===1?'silver':i===2?'bronze':''}">${i+1}</div>
          <div class="top-bar-wrap">
            <div style="font-weight:600;font-size:.84rem;">${c.name}</div>
            <div class="top-bar"><div class="top-bar-fill" style="width:${c.pct}%"></div></div>
          </div>
          <div class="top-count">${c.count}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-title"><div class="card-title-icon" style="background:rgba(93,210,188,.15)">📦</div> Productos Más Solicitados</span>
    </div>
    <div class="card-body">
      <div class="top-list">
        ${[
          {name:'Tomate Cherry',    count:'87 unid.',  pct:100},
          {name:'Lechuga Romana',   count:'64 unid.',  pct:74},
          {name:'Pechuga de Pollo', count:'55 unid.',  pct:63},
          {name:'Queso Gouda',      count:'42 unid.',  pct:48},
          {name:'Aceite de Oliva',  count:'38 unid.',  pct:44},
        ].map((p,i)=>`
        <div class="top-item">
          <div class="top-rank ${i===0?'gold':i===1?'silver':i===2?'bronze':''}">${i+1}</div>
          <div class="top-bar-wrap">
            <div style="font-weight:600;font-size:.84rem;">${p.name}</div>
            <div class="top-bar"><div class="top-bar-fill" style="width:${p.pct}%"></div></div>
          </div>
          <div class="top-count">${p.count}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</div>
`);

/* ══════════════════════════════════════════════════════
   LICITACIONES VIEW
   ══════════════════════════════════════════════════════ */
SGE.Router.register('licitaciones', () => {
  const hoy = new Date();
  const proxFechas = SGE.DB.licitaciones.filter(l => {
    const dias = Math.ceil((new Date(l.fecha_oferta) - hoy) / 86400000);
    return dias >= 0 && dias <= 7;
  });

  const estadoLabel = { analisis:'En Análisis', preparacion:'En Preparación', enviada:'Oferta Enviada', adjudicado:'Adjudicado', 'no-adj':'No Adjudicado' };
  const estadoCls   = { analisis:'lic-analisis', preparacion:'lic-preparacion', enviada:'lic-enviada', adjudicado:'lic-adjudicado', 'no-adj':'lic-no-adj' };

  return `
<div class="page-header">
  <div class="page-title">
    <h2>Módulo de Licitaciones</h2>
    <p>Seguimiento de concursos y cotizaciones institucionales</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-outline btn-sm">📥 Exportar Excel</button>
    <button class="btn btn-outline btn-sm">📄 Exportar PDF</button>
    <button class="btn btn-primary" data-modal="modal-licitacion">➕ Nueva Licitación</button>
  </div>
</div>

${proxFechas.length ? `
<div class="alert-banner warning">
  <span class="alert-banner-icon">📅</span>
  <div class="alert-banner-body">
    <div class="alert-banner-title">🔔 Fechas clave próximas (próximos 7 días)</div>
    ${proxFechas.map(l=>`<strong>${l.institucion}</strong> — Envío oferta: ${SGE.fmt.date(l.fecha_oferta)}`).join(' · ')}
  </div>
</div>` : ''}

<div class="stat-grid" style="grid-template-columns:repeat(5,1fr);">
  ${[
    {label:'En Análisis',    key:'analisis',    icon:'🔍', cls:'navy'},
    {label:'En Preparación', key:'preparacion', icon:'📝', cls:'teal'},
    {label:'Oferta Enviada', key:'enviada',     icon:'📤', cls:'green'},
    {label:'Adjudicadas',    key:'adjudicado',  icon:'🏆', cls:'green'},
    {label:'No Adjudicadas', key:'no-adj',      icon:'❌', cls:'coral'},
  ].map(s=>`
  <div class="stat-card">
    <div class="stat-icon ${s.cls}">${s.icon}</div>
    <div class="stat-info">
      <div class="stat-val">${SGE.DB.licitaciones.filter(l=>l.estado===s.key).length}</div>
      <div class="stat-lbl">${s.label}</div>
    </div>
  </div>`).join('')}
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon">🔍</span>
    <input class="search-input" placeholder="Buscar por institución o contacto..." data-table="lic-table">
  </div>
  <select class="filter-select" data-table="lic-table" data-col="2">
    <option value="">Todos los estados</option>
    <option value="En Análisis">En Análisis</option>
    <option value="En Preparación">En Preparación</option>
    <option value="Oferta Enviada">Oferta Enviada</option>
    <option value="Adjudicado">Adjudicado</option>
    <option value="No Adjudicado">No Adjudicado</option>
  </select>
  <input type="date" class="filter-select" title="Fecha desde">
  <input type="date" class="filter-select" title="Fecha hasta">
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table id="lic-table">
        <thead><tr>
          <th>Código</th><th>Institución</th><th>Estado</th><th>Contacto</th><th>Fecha Oferta</th><th>Monto Oferta</th><th>Acciones</th>
        </tr></thead>
        <tbody>
          ${SGE.DB.licitaciones.map(l => {
            const dias = Math.ceil((new Date(l.fecha_oferta) - hoy) / 86400000);
            const alerta = dias >= 0 && dias <= 5 ? `<span style="font-size:.7rem;color:var(--coral);font-weight:700;display:block;">⚠️ ${dias}d restantes</span>` : '';
            return `<tr>
              <td><code style="background:var(--surface-alt);padding:2px 7px;border-radius:4px;font-size:.8rem;font-weight:700;">${l.id}</code></td>
              <td>
                <div class="td-name">${l.institucion}</div>
              </td>
              <td>
                <span class="lic-status-badge ${estadoCls[l.estado]}">${estadoLabel[l.estado]}</span>
              </td>
              <td style="font-size:.82rem;">${l.contacto}</td>
              <td style="font-size:.82rem;">
                ${SGE.fmt.date(l.fecha_oferta)}${alerta}
              </td>
              <td style="font-weight:700;color:var(--navy);">${SGE.fmt.currency(l.total)}</td>
              <td>
                <div class="flex gap-1">
                  <button class="btn btn-ghost btn-sm btn-icon" title="Ver detalle" onclick="SGE.Lic.view('${l.id}')">👁️</button>
                  <button class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Lic.edit('${l.id}')">✏️</button>
                  <button class="btn btn-ghost btn-sm btn-icon" title="Documentos" onclick="SGE.Lic.docs('${l.id}')">📎</button>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div class="pagination">
    <span class="page-info">Mostrando ${SGE.DB.licitaciones.length} de ${SGE.DB.licitaciones.length} licitaciones</span>
    <div class="page-btns">
      <button class="page-btn">‹</button><button class="page-btn active">1</button><button class="page-btn">›</button>
    </div>
  </div>
</div>

<!-- Modal Nueva / Editar Licitación -->
<div class="modal-overlay" id="modal-licitacion">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title" id="lic-modal-title">📑 Nueva Licitación</span>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body">
      <div data-tabs>
        <div class="tabs">
          <button class="tab-btn active" data-tab="lic-tab-general">📋 General</button>
          <button class="tab-btn" data-tab="lic-tab-productos">📦 Productos</button>
          <button class="tab-btn" data-tab="lic-tab-docs">📎 Documentos</button>
          <button class="tab-btn" data-tab="lic-tab-recordatorios">🔔 Recordatorios</button>
        </div>

        <!-- Tab General -->
        <div class="tab-panel active" id="lic-tab-general">
          <div class="form-grid">
            <div class="form-group col-span-2">
              <label class="form-label">Institución <span>*</span></label>
              <input class="form-control" id="lic-inst" placeholder="Nombre de la institución pública o privada">
            </div>
            <div class="form-group">
              <label class="form-label">Persona de Contacto</label>
              <input class="form-control" id="lic-contacto" placeholder="Nombre completo">
            </div>
            <div class="form-group">
              <label class="form-label">Teléfono de Contacto</label>
              <input class="form-control" placeholder="0000-0000">
            </div>
            <div class="form-group">
              <label class="form-label">Correo de Contacto</label>
              <input class="form-control" type="email" placeholder="contacto@institucion.go.cr">
            </div>
            <div class="form-group">
              <label class="form-label">Estado <span>*</span></label>
              <select class="form-control" id="lic-estado">
                <option value="analisis">En Análisis</option>
                <option value="preparacion">En Preparación</option>
                <option value="enviada">Oferta Enviada</option>
                <option value="adjudicado">Adjudicado</option>
                <option value="no-adj">No Adjudicado</option>
              </select>
            </div>
            <div class="form-group col-span-2">
              <label class="form-label">Descripción del Requerimiento <span>*</span></label>
              <textarea class="form-control" style="min-height:90px;" placeholder="Describa el objeto de la licitación..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Fecha Límite de Consultas</label>
              <input class="form-control" type="date">
            </div>
            <div class="form-group">
              <label class="form-label">Fecha Envío de Oferta</label>
              <input class="form-control" type="date">
            </div>
            <div class="form-group">
              <label class="form-label">Fecha de Entrega</label>
              <input class="form-control" type="date">
            </div>

            <!-- Autocompletado datos empresa [LIC-005] -->
            <div class="form-group col-span-2">
              <label class="form-label">Datos Institucionales para Oferta</label>
              <div style="background:var(--surface-alt);border:1px solid var(--border);border-radius:var(--radius-sm);padding:.85rem;font-size:.82rem;">
                <div style="display:flex;justify-content:space-between;margin-bottom:.4rem;">
                  <strong style="color:var(--navy);">✨ Autocompletado</strong>
                  <button class="btn btn-teal btn-sm" onclick="SGE.Lic.autoFill()">Usar datos de la empresa</button>
                </div>
                <div id="lic-autofill-preview" style="color:var(--text-muted);">
                  Haga clic en el botón para completar automáticamente los datos legales de la empresa.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Productos -->
        <div class="tab-panel" id="lic-tab-productos">
          <div style="margin-bottom:.75rem;">
            <div class="order-line-head">
              <span>Producto / Servicio</span><span>Cantidad</span><span>Precio Unit.</span><span>Subtotal</span><span></span>
            </div>
            <div id="lic-lines">
              ${SGE.Lic.renderLine(0)}
              ${SGE.Lic.renderLine(1)}
            </div>
            <button class="btn-add-line" onclick="SGE.Lic.addLine()">➕ Agregar ítem</button>
          </div>
          <div class="order-totals">
            <div class="order-total-row"><span class="lbl">Subtotal:</span><span class="val" id="lt-sub">₡0.00</span></div>
            <div class="order-total-row"><span class="lbl">IVA:</span><span class="val" id="lt-iva">₡0.00</span></div>
            <div class="order-total-row grand"><span class="lbl">Total Oferta:</span><span class="val" id="lt-total">₡0.00</span></div>
          </div>
        </div>

        <!-- Tab Documentos -->
        <div class="tab-panel" id="lic-tab-docs">
          <div class="doc-list" style="margin-bottom:1rem;">
            <div class="doc-item">
              <span class="doc-icon">📄</span>
              <span class="doc-name">Solicitud_Recibida_CCSS.pdf</span>
              <span class="doc-size">2.3 MB</span>
              <button class="btn btn-ghost btn-sm btn-icon" title="Descargar">⬇️</button>
              <button class="btn btn-ghost btn-sm btn-icon" title="Eliminar">🗑️</button>
            </div>
            <div class="doc-item">
              <span class="doc-icon">📊</span>
              <span class="doc-name">Cotizacion_v1.xlsx</span>
              <span class="doc-size">145 KB</span>
              <button class="btn btn-ghost btn-sm btn-icon" title="Descargar">⬇️</button>
              <button class="btn btn-ghost btn-sm btn-icon" title="Eliminar">🗑️</button>
            </div>
            <div class="doc-item">
              <span class="doc-icon">📋</span>
              <span class="doc-name">Certificacion_Juridica.pdf</span>
              <span class="doc-size">890 KB</span>
              <button class="btn btn-ghost btn-sm btn-icon" title="Descargar">⬇️</button>
              <button class="btn btn-ghost btn-sm btn-icon" title="Eliminar">🗑️</button>
            </div>
          </div>
          <div class="upload-zone" onclick="SGE.Toast.show('Seleccione archivo para adjuntar', 'info')">
            <div style="font-size:2rem;margin-bottom:.5rem;">📎</div>
            <div style="font-weight:600;margin-bottom:.25rem;">Adjuntar documento</div>
            <div style="font-size:.78rem;">PDF, Excel, Word · Máx. 10 MB por archivo</div>
          </div>
        </div>

        <!-- Tab Recordatorios -->
        <div class="tab-panel" id="lic-tab-recordatorios">
          <div style="margin-bottom:1.25rem;">
            <div class="reminder-item">
              <span class="reminder-date soon">15 Jun</span>
              <div style="flex:1;font-size:.84rem;"><strong>Envío de Oferta — MEP</strong><br><span style="color:var(--text-muted);">Fecha límite para enviar la cotización</span></div>
              <button class="btn btn-ghost btn-sm btn-icon" title="Eliminar">🗑️</button>
            </div>
            <div class="reminder-item">
              <span class="reminder-date">28 Jun</span>
              <div style="flex:1;font-size:.84rem;"><strong>Consultas — ICE</strong><br><span style="color:var(--text-muted);">Cierre del período de consultas</span></div>
              <button class="btn btn-ghost btn-sm btn-icon" title="Eliminar">🗑️</button>
            </div>
            <div class="reminder-item">
              <span class="reminder-date">5 Jul</span>
              <div style="flex:1;font-size:.84rem;"><strong>Envío de Oferta — UCR</strong><br><span style="color:var(--text-muted);">Fecha límite para enviar propuesta</span></div>
              <button class="btn btn-ghost btn-sm btn-icon" title="Eliminar">🗑️</button>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="SGE.Lic.addReminder()">➕ Agregar recordatorio</button>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button class="btn btn-primary" onclick="SGE.Modal.close('modal-licitacion'); SGE.Toast.show('Licitación guardada correctamente')">💾 Guardar</button>
    </div>
  </div>
</div>

<!-- Modal Detalle Licitación -->
<div class="modal-overlay" id="modal-lic-detail">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title">📑 Detalle de Licitación</span>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body" id="lic-detail-body"></div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cerrar</button>
      <button class="btn btn-outline" onclick="SGE.Toast.show('Exportando PDF...','info')">📄 Exportar PDF</button>
      <button class="btn btn-outline" onclick="SGE.Toast.show('Exportando Excel...','info')">📊 Exportar Excel</button>
      <button class="btn btn-primary" onclick="SGE.Lic.editFromDetail()">✏️ Editar</button>
    </div>
  </div>
</div>
`;
});

/* ══════════════════════════════════════════════════════
   HANDLERS — Compras
   ══════════════════════════════════════════════════════ */
SGE.Com = {
  lineCount: 2,

  renderLine: (idx) => `
    <div class="order-line" id="cline-${idx}">
      <select class="form-control" style="font-size:.82rem;" onchange="SGE.Com.calcTotals()">
        <option value="">Seleccione producto...</option>
        ${SGE.DB.productos.filter(p=>p.estado==='Activo').map(p=>`<option value="${p.precio_compra}" data-iva="13">${p.nombre}</option>`).join('')}
      </select>
      <input class="form-control" type="number" min="1" value="1" style="font-size:.82rem;" oninput="SGE.Com.calcTotals()">
      <input class="form-control" type="number" min="0" placeholder="0" style="font-size:.82rem;" oninput="SGE.Com.calcTotals()">
      <span style="font-size:.82rem;font-weight:600;color:var(--navy);text-align:right;padding:.4rem;">₡0.00</span>
      <button class="btn btn-ghost btn-sm btn-icon" onclick="document.getElementById('cline-${idx}').remove(); SGE.Com.calcTotals()" style="color:var(--coral);">✕</button>
    </div>`,

  addLine: () => {
    const c = SGE.Com.lineCount++;
    const container = document.getElementById('compra-lines');
    if (!container) return;
    container.insertAdjacentHTML('beforeend', SGE.Com.renderLine(c));
    SGE.initView && SGE.initView('compras');
  },

  calcTotals: () => {
    let sub = 0;
    document.querySelectorAll('#compra-lines .order-line').forEach(row => {
      const sel = row.querySelector('select');
      const qty = parseFloat(row.querySelector('input[type=number]')?.value) || 0;
      const price = parseFloat(row.querySelectorAll('input[type=number]')[1]?.value || sel?.value) || 0;
      const s = qty * price;
      sub += s;
      const subEl = row.querySelector('span');
      if (subEl) subEl.textContent = SGE.fmt.currency(s);
    });
    const iva = sub * 0.13;
    const el = (id) => document.getElementById(id);
    if (el('ct-sub'))   el('ct-sub').textContent   = SGE.fmt.currency(sub);
    if (el('ct-iva'))   el('ct-iva').textContent   = SGE.fmt.currency(iva);
    if (el('ct-total')) el('ct-total').textContent = SGE.fmt.currency(sub + iva);
  },

  view: (id) => {
    const oc = SGE.DB.compras.find(c => c.id === id);
    if (!oc) return;
    document.getElementById('compra-detail-body').innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
        <div>
          <div style="font-size:.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;">Orden de Compra</div>
          <div style="font-size:1.2rem;font-weight:800;color:var(--navy);">${oc.id}</div>
        </div>
        <span class="badge ${ {Confirmada:'badge-active',Pendiente:'badge-pending',Cancelada:'badge-danger'}[oc.estado] }" style="font-size:.8rem;">${oc.estado}</span>
      </div>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">Proveedor</div><div class="info-value">${oc.proveedor}</div></div>
        <div class="info-item"><div class="info-label">Fecha</div><div class="info-value">${SGE.fmt.date(oc.fecha)}</div></div>
        <div class="info-item"><div class="info-label">Ítems</div><div class="info-value">${oc.items} productos</div></div>
        <div class="info-item"><div class="info-label">Total</div><div class="info-value" style="font-size:1.1rem;font-weight:800;color:var(--navy);">${SGE.fmt.currency(oc.total)}</div></div>
      </div>`;
    SGE.Modal.open('modal-compra-detail');
  },

  edit: (id) => {
    document.getElementById('compra-modal-title').textContent = `✏️ Editar Orden — ${id}`;
    SGE.Modal.open('modal-compra');
  },

  confirm: (id) => {
    document.getElementById('btn-confirm-oc').onclick = () => {
      const oc = SGE.DB.compras.find(c => c.id === id);
      if (oc) oc.estado = 'Confirmada';
      SGE.Modal.close('modal-confirm-oc');
      SGE.Toast.show(`Orden ${id} confirmada. Inventario actualizado automáticamente.`);
      SGE.Router.navigate('dashboard');
      setTimeout(() => SGE.Router.navigate('compras'), 50);
    };
    SGE.Modal.open('modal-confirm-oc');
  },

  cancel: (id) => {
    const oc = SGE.DB.compras.find(c => c.id === id);
    if (oc) oc.estado = 'Cancelada';
    SGE.Toast.show(`Orden ${id} cancelada`, 'error');
    SGE.Router.navigate('dashboard');
    setTimeout(() => SGE.Router.navigate('compras'), 50);
  },

  saveOrder: () => {
    const prov = document.getElementById('compra-prov')?.value;
    if (!prov) { SGE.Toast.show('Seleccione un proveedor', 'error'); return; }
    SGE.Modal.close('modal-compra');
    SGE.Toast.show('Orden de compra registrada correctamente');
  },

  saveDraft: () => {
    SGE.Modal.close('modal-compra');
    SGE.Toast.show('Borrador guardado', 'info');
  }
};

/* ══════════════════════════════════════════════════════
   HANDLERS — Inventario
   ══════════════════════════════════════════════════════ */
SGE.Inv = {
  edit: (id) => {
    const p = SGE.DB.productos.find(x => x.id === id);
    if (!p) return;
    document.getElementById('prod-modal-title').textContent = `✏️ Editar Producto — ${p.nombre}`;
    document.getElementById('prod-nombre').value = p.nombre;
    document.getElementById('prod-pcompra').value = p.precio_compra;
    document.getElementById('prod-pventa').value = p.precio_venta;
    document.getElementById('prod-stock').value = p.stock;
    document.getElementById('prod-stock-min').value = p.stock_min;
    SGE.Modal.open('modal-producto');
  }
};

/* ══════════════════════════════════════════════════════
   HANDLERS — Pedidos
   ══════════════════════════════════════════════════════ */
SGE.Ped = {
  lineCount: 2,

  renderLine: (idx) => `
    <div class="order-line" id="pline-${idx}">
      <select class="form-control" style="font-size:.82rem;" onchange="SGE.Ped.calcTotals(this)">
        <option value="">Seleccione producto...</option>
        ${SGE.DB.productos.filter(p=>p.estado==='Activo'&&p.stock>0).map(p=>`<option value="${p.precio_venta}" data-iva="${p.iva}">${p.nombre} (Stock: ${p.stock})</option>`).join('')}
      </select>
      <input class="form-control" type="number" min="1" value="1" style="font-size:.82rem;" oninput="SGE.Ped.calcTotals()">
      <span style="font-size:.82rem;color:var(--text-muted);padding:.4rem;">—</span>
      <span style="font-size:.82rem;font-weight:600;color:var(--navy);text-align:right;padding:.4rem;">₡0.00</span>
      <button class="btn btn-ghost btn-sm btn-icon" onclick="document.getElementById('pline-${idx}').remove(); SGE.Ped.calcTotals()" style="color:var(--coral);">✕</button>
    </div>`,

  addLine: () => {
    const c = SGE.Ped.lineCount++;
    const container = document.getElementById('ped-lines');
    if (!container) return;
    container.insertAdjacentHTML('beforeend', SGE.Ped.renderLine(c));
  },

  calcTotals: (sel) => {
    if (sel) {
      const row = sel.closest('.order-line');
      const priceEl = row?.querySelectorAll('span')[0];
      if (priceEl) priceEl.textContent = sel.value ? SGE.fmt.currency(parseFloat(sel.value)) : '—';
    }
    let sub = 0, ivaTotal = 0;
    document.querySelectorAll('#ped-lines .order-line').forEach(row => {
      const selEl = row.querySelector('select');
      const qty   = parseFloat(row.querySelector('input[type=number]')?.value) || 0;
      const price = parseFloat(selEl?.value) || 0;
      const ivaStr = selEl?.selectedOptions[0]?.dataset.iva || '13';
      const ivaRate = parseFloat(ivaStr) / 100;
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

  showClientInfo: (nombre) => {
    const c = SGE.DB.clientes.find(x => x.nombre === nombre);
    const panel = document.getElementById('ped-client-info');
    const addr  = document.getElementById('ped-client-addr');
    if (c && panel && addr) {
      addr.textContent = c.direccion + ' · 📞 ' + c.telefono;
      panel.style.display = 'flex';
    }
  },

  view: (id) => {
    const ped = SGE.DB.pedidos.find(p => p.id === id);
    const cli = ped ? SGE.DB.clientes.find(c => c.nombre === ped.cliente) : null;
    if (!ped) return;
    const eCls = { Confirmado:'badge-active', Entregado:'badge-info', Cancelado:'badge-danger' }[ped.estado] || 'badge-navy';
    document.getElementById('ped-detail-body').innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
        <div>
          <div style="font-size:.75rem;color:var(--text-muted);text-transform:uppercase;">Pedido</div>
          <div style="font-size:1.2rem;font-weight:800;color:var(--navy);">${ped.id}</div>
        </div>
        <span class="badge ${eCls}">${ped.estado}</span>
      </div>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">Cliente</div><div class="info-value">${ped.cliente}</div></div>
        <div class="info-item"><div class="info-label">Fecha</div><div class="info-value">${SGE.fmt.date(ped.fecha)}</div></div>
        ${cli ? `<div class="info-item"><div class="info-label">📍 Dirección de Entrega</div><div class="info-value">${cli.direccion}</div></div>
        <div class="info-item"><div class="info-label">📞 Teléfono</div><div class="info-value">${cli.telefono}</div></div>
        <div class="info-item"><div class="info-label">✉️ Correo</div><div class="info-value">${cli.correo}</div></div>` : ''}
        <div class="info-item"><div class="info-label">Total</div><div class="info-value" style="font-size:1.1rem;font-weight:800;color:var(--navy);">${SGE.fmt.currency(ped.total)}</div></div>
      </div>`;
    SGE.Modal.open('modal-pedido-detail');
  },

  edit: (id) => {
    document.getElementById('ped-modal-title').textContent = `✏️ Editar Pedido — ${id}`;
    SGE.Modal.open('modal-pedido');
  },

  cancel: (id) => {
    const ped = SGE.DB.pedidos.find(p => p.id === id);
    if (ped) ped.estado = 'Cancelado';
    SGE.Toast.show(`Pedido ${id} cancelado`, 'error');
    SGE.Router.navigate('dashboard');
    setTimeout(() => SGE.Router.navigate('pedidos'), 50);
  },

  saveOrder: () => {
    const cli = document.getElementById('ped-cliente')?.value;
    if (!cli) { SGE.Toast.show('Seleccione un cliente', 'error'); return; }
    SGE.Modal.close('modal-pedido');
    SGE.Toast.show('Pedido registrado correctamente');
  }
};

/* ══════════════════════════════════════════════════════
   HANDLERS — Licitaciones
   ══════════════════════════════════════════════════════ */
SGE.Lic = {
  lineCount: 2,

  renderLine: (idx) => `
    <div class="order-line" id="lline-${idx}">
      <input class="form-control" style="font-size:.82rem;" placeholder="Descripción del producto/servicio">
      <input class="form-control" type="number" min="1" value="1" style="font-size:.82rem;" oninput="SGE.Lic.calcTotals()">
      <input class="form-control" type="number" min="0" placeholder="0" style="font-size:.82rem;" oninput="SGE.Lic.calcTotals()">
      <span style="font-size:.82rem;font-weight:600;color:var(--navy);text-align:right;padding:.4rem;">₡0.00</span>
      <button class="btn btn-ghost btn-sm btn-icon" onclick="document.getElementById('lline-${idx}').remove(); SGE.Lic.calcTotals()" style="color:var(--coral);">✕</button>
    </div>`,

  addLine: () => {
    const c = SGE.Lic.lineCount++;
    const container = document.getElementById('lic-lines');
    if (!container) return;
    container.insertAdjacentHTML('beforeend', SGE.Lic.renderLine(c));
  },

  calcTotals: () => {
    let sub = 0;
    document.querySelectorAll('#lic-lines .order-line').forEach(row => {
      const inputs = row.querySelectorAll('input[type=number]');
      const qty = parseFloat(inputs[0]?.value) || 0;
      const price = parseFloat(inputs[1]?.value) || 0;
      const s = qty * price;
      sub += s;
      const subEl = row.querySelector('span');
      if (subEl) subEl.textContent = SGE.fmt.currency(s);
    });
    const iva = sub * 0.13;
    const el = (id) => document.getElementById(id);
    if (el('lt-sub'))   el('lt-sub').textContent   = SGE.fmt.currency(sub);
    if (el('lt-iva'))   el('lt-iva').textContent   = SGE.fmt.currency(iva);
    if (el('lt-total')) el('lt-total').textContent = SGE.fmt.currency(sub + iva);
  },

  autoFill: () => {
    const e = SGE.DB.empresa;
    const preview = document.getElementById('lic-autofill-preview');
    if (preview) {
      preview.innerHTML = `
        <div style="color:var(--text-primary);line-height:1.7;">
          <strong>${e.razon_social}</strong><br>
          Cédula Jurídica: ${e.cedula_juridica}<br>
          Tel: ${e.telefono1} · ${e.correo}<br>
          ${e.direccion}
        </div>`;
    }
    SGE.Toast.show('Datos de la empresa aplicados', 'info');
  },

  view: (id) => {
    const l = SGE.DB.licitaciones.find(x => x.id === id);
    if (!l) return;
    const estadoLabel = { analisis:'En Análisis', preparacion:'En Preparación', enviada:'Oferta Enviada', adjudicado:'Adjudicado', 'no-adj':'No Adjudicado' };
    const estadoCls   = { analisis:'lic-analisis', preparacion:'lic-preparacion', enviada:'lic-enviada', adjudicado:'lic-adjudicado', 'no-adj':'lic-no-adj' };
    document.getElementById('lic-detail-body').innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
        <div>
          <div style="font-size:.75rem;color:var(--text-muted);text-transform:uppercase;">Licitación</div>
          <div style="font-size:1.2rem;font-weight:800;color:var(--navy);">${l.id}</div>
        </div>
        <span class="lic-status-badge ${estadoCls[l.estado]}">${estadoLabel[l.estado]}</span>
      </div>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">Institución</div><div class="info-value" style="font-size:1rem;font-weight:700;">${l.institucion}</div></div>
        <div class="info-item"><div class="info-label">Contacto</div><div class="info-value">${l.contacto}</div></div>
        <div class="info-item"><div class="info-label">Fecha Envío Oferta</div><div class="info-value">${SGE.fmt.date(l.fecha_oferta)}</div></div>
        <div class="info-item"><div class="info-label">Monto Total Oferta</div><div class="info-value" style="font-size:1.1rem;font-weight:800;color:var(--navy);">${SGE.fmt.currency(l.total)}</div></div>
      </div>`;
    SGE.Modal.open('modal-lic-detail');
  },

  edit: (id) => {
    const l = SGE.DB.licitaciones.find(x => x.id === id);
    if (!l) return;
    document.getElementById('lic-modal-title').textContent = `✏️ Editar Licitación — ${l.id}`;
    const inst = document.getElementById('lic-inst');
    if (inst) inst.value = l.institucion;
    SGE.Modal.open('modal-licitacion');
  },

  editFromDetail: () => {
    SGE.Modal.close('modal-lic-detail');
    SGE.Modal.open('modal-licitacion');
  },

  docs: (id) => {
    document.getElementById('lic-modal-title').textContent = `📎 Documentos — ${id}`;
    SGE.Modal.open('modal-licitacion');
    setTimeout(() => {
      document.querySelector('[data-tab="lic-tab-docs"]')?.click();
    }, 100);
  },

  addReminder: () => {
    SGE.Toast.show('Use el formulario para agregar recordatorios', 'info');
  }
};
