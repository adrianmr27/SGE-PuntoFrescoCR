/* SGE Punto Fresco - split module */
'use strict';

SGE.Router.register('reportes', () => {
    const periodo = SGE.Rep?._periodo || 'mensual';
    const days = periodo === 'semanal' ? 7 : (periodo === 'quincenal' ? 15 : 30);
    const curStart = new Date();
    curStart.setHours(0, 0, 0, 0);
    curStart.setDate(curStart.getDate() - days);
    const pedidosPeriodo = (SGE.DB.pedidos || []).filter(p => p.estado !== 'Cancelado' && new Date(p.fecha) >= curStart);
    const ventasPeriodo = pedidosPeriodo.reduce((s, p) => s + (p.total || 0), 0);
    const prevEnd = new Date(curStart);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - days + 1);
    prevStart.setHours(0, 0, 0, 0);
    const pedidosPrev = (SGE.DB.pedidos || []).filter((p) => {
        if (p.estado === 'Cancelado') return false;
        const d = new Date(p.fecha);
        return d >= prevStart && d <= prevEnd;
    });
    const ventasPrev = pedidosPrev.reduce((s, p) => s + (p.total || 0), 0);
    const pctVsPrev = ventasPrev > 0 ? Math.round(((ventasPeriodo - ventasPrev) / ventasPrev) * 1000) / 10 : null;
    const vsPrevTxt = ventasPrev <= 0
        ? 'Sin ventas en período anterior'
        : `${pctVsPrev >= 0 ? '+' : ''}${pctVsPrev}% vs período anterior (${SGE.fmt.currency(ventasPrev)})`;

    const ventasClientePeriodo = Object.values(pedidosPeriodo.reduce((acc, p) => {
        const key = p.cliente || '—';
        acc[key] = acc[key] || { cliente: key, pedidos: 0, total: 0 };
        acc[key].pedidos += 1;
        acc[key].total += p.total || 0;
        return acc;
    }, {})).sort((a, b) => b.total - a.total).slice(0, 15);

    const rep = SGE.DB.reportes || {};
    const ingresos = rep.ingresos_periodo ?? SGE.DB.movFinancieros.filter(m => m.tipo === 'Ingreso').reduce((s, m) => s + m.monto, 0);
    const egresos = rep.egresos_periodo ?? SGE.DB.movFinancieros.filter(m => m.tipo === 'Egreso').reduce((s, m) => s + m.monto, 0);
    const pedidosAct = pedidosPeriodo.length;
    const stockBajo = rep.productos_stock_bajo ?? SGE.DB.productos.filter(p => p.stock <= p.stock_min && p.estado === 'Activo').length;
    const licAdj = rep.licitaciones_adjudicadas ?? SGE.DB.licitaciones.filter(l => l.estado === 'adjudicado').length;
    const vpm = rep.ventas_por_mes || [];
    const vpc = ventasClientePeriodo.length ? ventasClientePeriodo : (rep.ventas_por_cliente || []);
    const pmv = rep.productos_mas_vendidos || [];

    return `
<div class="page-header">
  <div class="page-title">
    <h2>Módulo de Reportes</h2>
    <p>Dashboard ejecutivo y generación de reportes estratégicos (${days} días · comparativa con el período inmediato anterior)</p>
  </div>
  <div class="page-actions">
    <select class="filter-select" id="rep-periodo" onchange="SGE.Rep.updatePeriod(this.value)">
      <option value="semanal" ${periodo === 'semanal' ? 'selected' : ''}>Semanal</option>
      <option value="quincenal" ${periodo === 'quincenal' ? 'selected' : ''}>Quincenal</option>
      <option value="mensual" ${periodo === 'mensual' ? 'selected' : ''}>Mensual</option>
    </select>
    ${SGE.hasPerm('REPORTES', 'exportar') ? '<button type="button" class="btn btn-outline btn-sm" onclick="SGE.Rep.export(\'excel\')"><i class="bi bi-file-earmark-excel me-1" aria-hidden="true"></i>Excel</button><button type="button" class="btn btn-outline btn-sm" onclick="SGE.Rep.export(\'pdf\')"><i class="bi bi-file-earmark-pdf me-1" aria-hidden="true"></i>PDF</button>' : ''}
  </div>
</div>

<!-- KPIs Ejecutivos -->
<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-icon green stat-icon-bi"><i class="bi bi-currency-dollar" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val" style="font-size:1.1rem;">${SGE.fmt.currency(ventasPeriodo || ingresos)}</div>
      <div class="stat-lbl">Ingresos (${days} días)</div>
      <div class="stat-change">${vsPrevTxt}</div>
      <div class="stat-change" style="opacity:.9;font-size:.78rem;margin-top:.15rem;">Egresos (12 m. reporte): ${SGE.fmt.currency(egresos)}</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon navy stat-icon-bi"><i class="bi bi-receipt" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${pedidosAct}</div>
      <div class="stat-lbl">Pedidos (${days} días)</div>
      <div class="stat-change">Stock bajo: ${stockBajo}</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon teal stat-icon-bi"><i class="bi bi-box-seam" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${SGE.fmt.currency(rep.valor_inventario || 0)}</div>
      <div class="stat-lbl">Valor inventario</div>
      <div class="stat-change">Productos activos: ${SGE.DB.productos.filter(p => p.estado === 'Activo').length}</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon coral stat-icon-bi"><i class="bi bi-file-earmark-text" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${licAdj}</div>
      <div class="stat-lbl">Licitaciones adjudicadas</div>
      <div class="stat-change">En catálogo: ${SGE.DB.licitaciones.length}</div>
    </div>
  </div>
</div>

<div data-tabs>
  <div class="tabs">
    <button type="button" class="tab-btn active" data-tab="rep-tab-ventas"><i class="bi bi-graph-up-arrow me-1" aria-hidden="true"></i>Ventas</button>
    <button type="button" class="tab-btn" data-tab="rep-tab-inventario"><i class="bi bi-box-seam me-1" aria-hidden="true"></i>Inventario</button>
    <button type="button" class="tab-btn" data-tab="rep-tab-licitaciones"><i class="bi bi-file-earmark-text me-1" aria-hidden="true"></i>Licitaciones</button>
    <button type="button" class="tab-btn" data-tab="rep-tab-predicciones"><i class="bi bi-cpu me-1" aria-hidden="true"></i>Predicciones</button>
  </div>

  <!-- Reporte Ventas -->
  <div class="tab-panel active" id="rep-tab-ventas">
    <div class="responsive-grid-2">

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="bi bi-graph-up-arrow me-1" aria-hidden="true"></i>Ventas por Período</span>
          ${SGE.hasPerm('REPORTES', 'exportar') ? '<button type="button" class="btn btn-ghost btn-sm" onclick="SGE.Rep.export(\'excel\')"><i class="bi bi-download me-1" aria-hidden="true"></i>Excel</button>' : ''}
        </div>
        <div class="card-body" style="padding:.75rem 1.5rem;">
          ${(vpm.length ? vpm : [{ etiqueta: 'Sin datos', total: 0 }]).map(r => {
        const max = Math.max(...vpm.map(x => x.total), 1);
        const val = r.total != null ? r.total : 0;
        return `
          <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.65rem;">
            <span style="font-size:.72rem;font-weight:600;color:var(--text-muted);width:120px;overflow:hidden;text-overflow:ellipsis;">${r.etiqueta || r.mes}</span>
            <div style="flex:1;height:10px;background:var(--border);border-radius:99px;overflow:hidden;">
              <div style="height:100%;width:${Math.min(100, Math.round((val / max) * 100))}%;background:linear-gradient(90deg,var(--navy),var(--teal));border-radius:99px;"></div>
            </div>
            <span style="font-size:.8rem;font-weight:700;color:var(--navy);min-width:80px;text-align:right;">${SGE.fmt.currency(val)}</span>
          </div>`;
    }).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="bi bi-shop me-1" aria-hidden="true"></i>Ventas por Cliente</span>
          ${SGE.hasPerm('REPORTES', 'exportar') ? '<button type="button" class="btn btn-ghost btn-sm" onclick="SGE.Rep.export(\'pdf\')"><i class="bi bi-printer me-1" aria-hidden="true"></i>PDF</button>' : ''}
        </div>
        <div class="card-body" style="padding:0;">
          <table>
            <thead><tr><th>Cliente</th><th>Pedidos</th><th>Total</th><th>%</th></tr></thead>
            <tbody>
              ${(vpc.length ? vpc : [{ cliente: 'Sin datos', pedidos: 0, total: 0 }]).map((r, i, arr) => {
        const tot = arr.reduce((s, x) => s + (x.total || 0), 0) || 1;
        return `<tr>
                  <td class="td-name">${r.cliente}</td>
                  <td>${r.pedidos}</td>
                  <td style="font-weight:700;">${SGE.fmt.currency(r.total)}</td>
                  <td><span class="badge badge-info">${Math.round(((r.total || 0) / tot) * 100)}%</span></td>
                </tr>`;
    }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card" style="grid-column:1/-1;">
        <div class="card-header">
          <span class="card-title"><i class="bi bi-trophy me-1" aria-hidden="true"></i>Productos Más Vendidos del Período</span>
          ${SGE.hasPerm('REPORTES', 'exportar') ? '<button type="button" class="btn btn-ghost btn-sm" onclick="SGE.Rep.export(\'excel\')"><i class="bi bi-download me-1" aria-hidden="true"></i>Excel</button>' : ''}
        </div>
        <div class="card-body" style="padding:0;">
          <table>
            <thead><tr><th>#</th><th>Producto</th><th>Categoría</th><th>Unidades</th><th>Ingresos</th><th>Margen</th></tr></thead>
            <tbody>
              ${(pmv.length ? pmv : [{ producto: '—', categoria: '—', unidades: 0, ingresos: 0 }]).map((r, i) => `
              <tr>
                <td style="color:var(--text-muted)">${i + 1}</td>
                <td class="td-name">${r.producto}</td>
                <td><span class="badge badge-info">${r.categoria}</span></td>
                <td style="font-weight:600;">${r.unidades} uds.</td>
                <td style="font-weight:700;color:var(--navy);">${SGE.fmt.currency(r.ingresos)}</td>
                <td><span class="badge badge-active">—</span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Reporte Inventario -->
  <div class="tab-panel" id="rep-tab-inventario">
    <div class="responsive-grid-2">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="bi bi-box-seam me-1" aria-hidden="true"></i>Estado del Inventario</span>
          ${SGE.hasPerm('REPORTES', 'exportar') ? '<button type="button" class="btn btn-ghost btn-sm" onclick="SGE.Rep.export(\'excel\')"><i class="bi bi-download me-1" aria-hidden="true"></i>Excel</button>' : ''}
        </div>
        <div class="card-body" style="padding:0;">
          <table>
            <thead><tr><th>Producto</th><th>Stock</th><th>Mín.</th><th>Valor</th><th>Alerta</th></tr></thead>
            <tbody>
              ${SGE.DB.productos.map(p => `
              <tr>
                <td class="td-name">${p.nombre}<div class="td-sub">${p.categoria}</div></td>
                <td style="font-weight:700;">${p.stock}</td>
                <td style="color:var(--text-muted);">${p.stock_min}</td>
                <td>${SGE.fmt.currency(p.precio_venta * p.stock)}</td>
                <td>${p.stock <= 0 ? '<span class="badge badge-danger">Sin stock</span>' : p.stock <= p.stock_min ? '<span class="badge badge-pending">Bajo</span>' : '<span class="badge badge-active">OK</span>'}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="card-footer" style="font-size:.84rem;text-align:right;">
          Valor total en inventario: <strong>${SGE.fmt.currency(SGE.DB.productos.reduce((s, p) => s + p.precio_venta * p.stock, 0))}</strong>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="bi bi-pie-chart me-1" aria-hidden="true"></i>Distribución por Categoría</span>
        </div>
        <div class="card-body">
          ${[...new Set(SGE.DB.productos.map(p => p.categoria))].map(cat => {
        const prods = SGE.DB.productos.filter(p => p.categoria === cat);
        const totalStock = prods.reduce((s, p) => s + p.stock, 0);
        const totalVal = prods.reduce((s, p) => s + p.precio_venta * p.stock, 0);
        const maxStock = 200;
        return `
            <div style="margin-bottom:1rem;">
              <div style="display:flex;justify-content:space-between;margin-bottom:.35rem;font-size:.83rem;">
                <span style="font-weight:700;">${cat}</span>
                <span style="color:var(--text-muted);">${prods.length} prod. · ${totalStock} uds. · ${SGE.fmt.currency(totalVal)}</span>
              </div>
              <div style="height:8px;background:var(--border);border-radius:99px;overflow:hidden;">
                <div style="height:100%;width:${Math.min(Math.round((totalStock / maxStock) * 100), 100)}%;background:linear-gradient(90deg,var(--teal),var(--green));border-radius:99px;"></div>
              </div>
            </div>`;
    }).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- Reporte Licitaciones -->
  <div class="tab-panel" id="rep-tab-licitaciones">
    <div class="responsive-grid-split">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="bi bi-file-earmark-text me-1" aria-hidden="true"></i>Resumen de Licitaciones</span>
          ${SGE.hasPerm('REPORTES', 'exportar') ? '<button type="button" class="btn btn-ghost btn-sm" onclick="SGE.Rep.export(\'pdf\')"><i class="bi bi-printer me-1" aria-hidden="true"></i>PDF</button>' : ''}
        </div>
        <div class="card-body" style="padding:0;">
          <table>
            <thead><tr><th>Código</th><th>Institución</th><th>Estado</th><th>Monto</th></tr></thead>
            <tbody>
              ${SGE.DB.licitaciones.map(l => {
        const cls = { analisis: 'lic-analisis', preparacion: 'lic-preparacion', enviada: 'lic-enviada', adjudicado: 'lic-adjudicado', 'no-adj': 'lic-no-adj' }[l.estado];
        const lbl = { analisis: 'Análisis', preparacion: 'Preparación', enviada: 'Enviada', adjudicado: 'Adjudicado', 'no-adj': 'No Adj.' }[l.estado];
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
          <span>Adjudicadas: <strong style="color:var(--green-dark);">${SGE.DB.licitaciones.filter(l => l.estado === 'adjudicado').length}</strong></span>
          <span>Total adjudicado: <strong style="color:var(--navy);">${SGE.fmt.currency(SGE.DB.licitaciones.filter(l => l.estado === 'adjudicado').reduce((s, l) => s + l.total, 0))}</strong></span>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title"><i class="bi bi-pie-chart me-1" aria-hidden="true"></i>Por Estado</span></div>
        <div class="card-body">
          ${[
            { label: 'Adjudicado', key: 'adjudicado', color: 'var(--green)' },
            { label: 'Oferta Enviada', key: 'enviada', color: 'var(--teal)' },
            { label: 'En Preparación', key: 'preparacion', color: '#f59e0b' },
            { label: 'En Análisis', key: 'analisis', color: 'var(--navy)' },
            { label: 'No Adjudicado', key: 'no-adj', color: 'var(--coral)' },
        ].map(s => {
            const count = SGE.DB.licitaciones.filter(l => l.estado === s.key).length;
            const pct = Math.round((count / SGE.DB.licitaciones.length) * 100);
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
      <select class="filter-select" id="rep-pred-cliente" style="min-width:220px;" onchange="SGE.Rep.refreshPredTab()">
        <option value="">Todos los clientes</option>
        ${Object.keys(SGE.DB.historialClientes || {}).sort().map((c) => {
            const esc = typeof SGE.Export?.escapeHtml === 'function' ? SGE.Export.escapeHtml : (s) => String(s ?? '');
            return `<option value="${encodeURIComponent(c)}">${esc(c)}</option>`;
        }).join('')}
      </select>
      <select class="filter-select" id="rep-pred-horizonte" onchange="SGE.Rep.refreshPredTab()">
        <option value="90">Último trimestre</option>
        <option value="180">Últimos 6 meses</option>
        <option value="365">Último año</option>
      </select>
      ${SGE.hasPerm('REPORTES', 'exportar') ? '<button type="button" class="btn btn-outline btn-sm" onclick="SGE.Rep.export(\'excel\')"><i class="bi bi-file-earmark-excel me-1" aria-hidden="true"></i>Exportar</button>' : ''}
    </div>
    <div id="rep-pred-container" style="min-height:120px;"></div>
  </div>
</div>
`;
});

SGE.Rep = {
    _periodo: 'mensual',
    _daysFor: (periodo) => periodo === 'semanal' ? 7 : (periodo === 'quincenal' ? 15 : 30),
    _filteredPedidos: () => {
        const days = SGE.Rep._daysFor(SGE.Rep._periodo);
        const from = new Date();
        from.setDate(from.getDate() - days);
        return (SGE.DB.pedidos || []).filter(p => p.estado !== 'Cancelado' && new Date(p.fecha) >= from);
    },
    export: (tipo) => {
        if (!SGE.hasPerm('REPORTES', 'exportar')) {
            SGE.Toast.show('No tiene permiso para exportar reportes', 'error');
            return;
        }
        if (!SGE.Export) {
            SGE.Toast.show('Módulo de exportación no cargado', 'error');
            return;
        }
        const peds = SGE.Rep._filteredPedidos();
        const rep = SGE.DB.reportes || {};
        const vpc = Object.values(peds.reduce((acc, p) => {
            const key = p.cliente || '—';
            acc[key] = acc[key] || { cliente: key, pedidos: 0, total: 0 };
            acc[key].pedidos += 1;
            acc[key].total += p.total || 0;
            return acc;
        }, {})).sort((a, b) => b.total - a.total).slice(0, 25);
        const pmv = rep.productos_mas_vendidos || [];
        const licRows = (SGE.DB.licitaciones || []).map(l => [
            l.id, l.institucion, l.estado, Number(l.total || 0).toFixed(2)
        ]);
        if (tipo === 'pdf') {
            const pedRows = peds.map((p, i) => [String(i + 1), p.id, p.cliente, p.fecha, p.estado, SGE.fmt.currency(p.total)]);
            const t1 = SGE.Export.buildTable('Pedidos del período', ['#', 'Pedido', 'Cliente', 'Fecha', 'Estado', 'Total'], pedRows, [0, 5]);
            const t2 = SGE.Export.buildTable('Ventas por cliente (resumen)', ['Cliente', 'Pedidos', 'Total'],
                vpc.map(r => [r.cliente, r.pedidos, SGE.fmt.currency(r.total)]), [1, 2]);
            const t3 = SGE.Export.buildTable('Licitaciones', ['Código', 'Institución', 'Estado', 'Monto CRC'],
                licRows, [3]);
            const inner = t1 + t2 + t3;
            SGE.Export.openPrintDocument('Reportes ejecutivos', SGE.Export.wrapLetterhead('Reporte ejecutivo', `Período: ${SGE.Rep._periodo} (${SGE.Rep._daysFor(SGE.Rep._periodo)} días)`, inner));
            return;
        }
        const pedRows = peds.map((p, i) => [String(i + 1), p.id, p.cliente, p.fecha, p.estado, Number(p.total || 0).toFixed(2)]);
        const t1 = SGE.Export.buildTable('Pedidos del período', ['#', 'Pedido', 'Cliente', 'Fecha', 'Estado', 'Total CRC'], pedRows, [0, 5]);
        const t2 = SGE.Export.buildTable('Ventas por cliente', ['Cliente', 'Pedidos', 'Total CRC'],
            vpc.map(r => [r.cliente, r.pedidos, Number(r.total || 0).toFixed(2)]), [1, 2]);
        const t3 = SGE.Export.buildTable('Productos más vendidos (reporte)', ['Producto', 'Categoría', 'Unidades', 'Ingresos CRC'],
            (pmv.length ? pmv : [{ producto: '—', categoria: '—', unidades: 0, ingresos: 0 }]).map(r => [r.producto, r.categoria, r.unidades, Number(r.ingresos || 0).toFixed(2)]), [2, 3]);
        const t4 = SGE.Export.buildTable('Licitaciones', ['Código', 'Institución', 'Estado', 'Total CRC'],
            licRows, [3]);
        const html = t1 + t2 + t3 + t4;
        SGE.Export.downloadExcelHtml(`reporte_ejecutivo_${SGE.Rep._periodo}_${new Date().toISOString().slice(0, 10)}.xls`, `Reporte ejecutivo (${SGE.Rep._periodo})`, html);
    },
    updatePeriod: (periodo) => {
        SGE.Rep._periodo = periodo;
        SGE.Router.navigate('dashboard');
        setTimeout(() => SGE.Router.navigate('reportes'), 50);
    },

    refreshPredTab: () => {
        const container = document.getElementById('rep-pred-container');
        if (!container) return;
        const days = parseInt(document.getElementById('rep-pred-horizonte')?.value || '90', 10) || 90;
        const clienteEnc = document.getElementById('rep-pred-cliente')?.value || '';
        let cliente = '';
        if (clienteEnc) {
            try {
                cliente = decodeURIComponent(clienteEnc);
            } catch {
                cliente = clienteEnc;
            }
        }
        const hc = SGE.DB.historialClientes || {};
        const cutoff = new Date();
        cutoff.setHours(0, 0, 0, 0);
        cutoff.setDate(cutoff.getDate() - days);
        const minMes = cutoff.toISOString().slice(0, 7);
        const esc = typeof SGE.Export?.escapeHtml === 'function' ? SGE.Export.escapeHtml : (s) => String(s ?? '');
        const clientes = cliente ? [cliente] : Object.keys(hc).sort();
        const cards = [];
        for (const cli of clientes) {
            const hist = hc[cli];
            if (!Array.isArray(hist) || !hist.length) continue;
            const filtered = hist.filter((h) => {
                const mes = h.mes || h.Mes || '';
                return String(mes) >= minMes;
            });
            if (!filtered.length) continue;
            const conteo = {};
            filtered.forEach((m) => {
                const prods = m.productos || m.Productos || [];
                if (!Array.isArray(prods)) return;
                prods.forEach((p) => {
                    conteo[p] = (conteo[p] || 0) + 1;
                });
            });
            const top3 = Object.entries(conteo).sort((a, b) => b[1] - a[1]).slice(0, 3);
            if (!top3.length) continue;
            const totalPeriodo = filtered.reduce((s, m) => s + (Number(m.total) || Number(m.Total) || 0), 0);
            const prom = filtered.length ? Math.round(totalPeriodo / filtered.length) : 0;
            const hlen = filtered.length;
            cards.push(`
        <div class="card">
          <div class="card-header">
            <span class="card-title" style="font-size:.85rem;"><i class="bi bi-cpu me-1" aria-hidden="true"></i>${esc(cli)}</span>
            <span class="badge badge-teal" style="background:var(--teal-light);color:#2ca892;">Historial</span>
          </div>
          <div class="card-body">
            <div style="margin-bottom:.85rem;font-size:.8rem;color:var(--text-muted);">
              ${hlen} mes(es) en ventana · Promedio mensual: ${SGE.fmt.currency(prom)}
            </div>
            <div style="font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);margin-bottom:.5rem;">
              Sugerencia según frecuencia en el período
            </div>
            ${top3.map(([prod, cnt], i) => `
            <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.5rem;font-size:.83rem;">
              <span style="width:18px;height:18px;border-radius:50%;background:${i === 0 ? 'var(--green)' : i === 1 ? 'var(--teal)' : 'var(--navy)'};color:white;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;flex-shrink:0;">${i + 1}</span>
              <span style="flex:1;font-weight:500;">${esc(prod)}</span>
              <span class="badge badge-active" style="font-size:.68rem;">${hlen ? Math.round((cnt / hlen) * 100) : 0}%</span>
            </div>`).join('')}
          </div>
        </div>`);
        }
        if (!cards.length) {
            container.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;padding:.5rem 0;">No hay historial suficiente en el horizonte elegido. Amplíe el período o elija otro cliente.</p>';
            return;
        }
        container.innerHTML = `<div class="responsive-grid-2">${cards.join('')}</div>`;
    }
};

document.addEventListener('view:ready', (e) => {
    if (e.detail?.view !== 'reportes' || typeof SGE.Rep?.refreshPredTab !== 'function') return;
    SGE.Rep.refreshPredTab();
    document.querySelectorAll('.tabs .tab-btn[data-tab="rep-tab-predicciones"]').forEach((btn) => {
        if (btn.dataset.predHook) return;
        btn.dataset.predHook = '1';
        btn.addEventListener('click', () => {
            setTimeout(() => SGE.Rep.refreshPredTab(), 0);
        });
    });
});