/* SGE Punto Fresco - split module */
'use strict';

SGE.Router.register('predicciones', () => {
  const hc = SGE.DB.historialClientes || {};
  const clientes = Object.keys(hc);
  const preds = SGE.DB.predicciones || [];
  if (!clientes.length && !preds.length) {
    return `
<div class="page-header">
  <div class="page-title">
    <h2>Módulo de Predicciones</h2>
    <p>Análisis automático de patrones de compra y predicción de demanda</p>
  </div>
  <div class="page-actions">
    <button type="button" class="btn btn-primary btn-sm" onclick="SGE.Pre.recalcular()"><i class="bi bi-arrow-repeat me-1" aria-hidden="true"></i>Recalcular predicciones</button>
  </div>
</div></div>`;
  }

  if (!clientes.length && preds.length) {
    return `
<div class="page-header">
  <div class="page-title">
    <h2>Módulo de Predicciones</h2>
    <p>Resultados del modelo (tabla <code>PrediccionCompra</code>)</p>
  </div>
  <div class="page-actions">
    <button type="button" class="btn btn-primary btn-sm" onclick="SGE.Pre.recalcular()"><i class="bi bi-arrow-repeat me-1" aria-hidden="true"></i>Recalcular predicciones</button>
  </div>
</div>
<div class="card"><div class="card-body" style="padding:0;">
  <div class="table-wrap">
    <table>
      <thead><tr><th>Cliente</th><th>Producto</th><th>Veces</th><th>Prob. %</th><th>Confianza</th><th>Prom. u.</th></tr></thead>
      <tbody>
        ${preds.map(p => `<tr>
          <td>${p.cliente}</td><td>${p.producto}</td><td>${p.veces}</td><td>${p.prob ?? '—'}</td><td>${p.confianza ?? '—'}</td><td>${p.promedio ?? '—'}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div></div>`;
  }

  // Analyze patterns: find most recurring products per client
  const analizar = (cliente) => {
    const historial = (SGE.DB.historialClientes || {})[cliente] || [];
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
    ${SGE.hasPerm('PREDICCIONES', 'exportar') ? `<button type="button" class="btn btn-outline btn-sm" onclick="SGE.Pre.export('excel')"><i class="bi bi-file-earmark-excel me-1" aria-hidden="true"></i>Excel</button>
    <button type="button" class="btn btn-outline btn-sm" onclick="SGE.Pre.export('pdf')"><i class="bi bi-file-earmark-pdf me-1" aria-hidden="true"></i>PDF</button>` : ''}
    <button type="button" class="btn btn-primary btn-sm" onclick="SGE.Pre.recalcular()"><i class="bi bi-arrow-repeat me-1" aria-hidden="true"></i>Recalcular</button>
  </div>
</div>

<!-- Selector de cliente -->
<div class="card" style="margin-bottom:1.25rem;">
  <div class="card-body" style="padding:1.1rem 1.5rem;">
    <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
      <div style="font-weight:700;color:var(--navy);font-size:.9rem;"><i class="bi bi-search me-1" aria-hidden="true"></i>Analizar cliente:</div>
      <select class="filter-select" id="pred-cliente-sel" onchange="SGE.Pre.loadCliente(this.value)" style="min-width:260px;">
        ${clientes.map((c,i) => `<option value="${c}" ${i===0?'selected':''}>${c}</option>`).join('')}
      </select>
      <div style="margin-left:auto;font-size:.8rem;color:var(--text-muted);">
        <i class="bi bi-graph-up me-1" aria-hidden="true"></i>Análisis basado en historial de compras registrado
      </div>
    </div>
  </div>
</div>

<div class="responsive-grid-pred" id="pred-content">
  ${SGE.Pre.renderClientePanel(primeraCliente)}
</div>
`;
});

SGE.Pre = {
  recalcular: async () => {
    try {
      await SGE.Api.mutations.recalcularPredicciones();
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show('Predicciones actualizadas');
      SGE.Router.navigate('predicciones');
    } catch (e) {
      SGE.Toast.show(e.message || 'No se pudo recalcular', 'error');
    }
  },

  renderClientePanel: (cliente) => {
    const historial = (SGE.DB.historialClientes || {})[cliente] || [];
    if (!historial.length) return '<div class="empty-state"><div class="empty-icon stat-icon-bi" style="font-size:2rem;opacity:.35;"><i class="bi bi-inbox" aria-hidden="true"></i></div><div class="empty-title">Sin historial</div></div>';

    const conteo = {};
    historial.forEach(mes => mes.productos.forEach(p => { conteo[p] = (conteo[p] || 0) + 1; }));
    const patrones = Object.entries(conteo).sort((a,b)=>b[1]-a[1]);
    const totalMeses = historial.length;
    const promMensual = Math.round(historial.reduce((s,m)=>s+m.total,0) / totalMeses);
    const tendencia = historial.slice(-3).reduce((s,m)=>s+m.total,0) > historial.slice(0,3).reduce((s,m)=>s+m.total,0)
      ? 'Creciente <i class="bi bi-arrow-up-right" aria-hidden="true"></i>'
      : 'Estable <i class="bi bi-arrow-right" aria-hidden="true"></i>';

    return `
    <!-- Panel Izq: Historial + Patrones -->
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="bi bi-graph-up-arrow me-1" aria-hidden="true"></i>Historial de Compras — <span style="font-size:.82rem;font-weight:400;color:var(--text-muted);">${cliente}</span></span>
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
            <span style="color:var(--text-muted);">Tendencia: <strong style="color:${tendencia.includes('Creciente')?'var(--green-dark)':'var(--text-secondary)'};">${tendencia}</strong></span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="bi bi-arrow-repeat me-1" aria-hidden="true"></i>Productos Recurrentes</span>
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
        <span class="card-title" style="color:white;"><i class="bi bi-cpu me-1" aria-hidden="true"></i>Predicción — Próximo Pedido</span>
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
          <div style="font-weight:700;color:var(--navy);margin-bottom:.35rem;"><i class="bi bi-lightbulb me-1" aria-hidden="true"></i>Recomendación de Inventario</div>
          <div style="color:var(--text-secondary);">
            Asegúrese de tener stock suficiente de <strong>${patrones.slice(0,2).map(([p])=>p).join(' y ')}</strong> para el próximo pedido de este cliente.
          </div>
        </div>

        ${SGE.hasPerm('PREDICCIONES', 'exportar') ? `
        <button type="button" class="btn btn-outline w-full" style="margin-top:1rem;justify-content:center;" onclick="SGE.Pre.export('excel')">
          <i class="bi bi-download me-1" aria-hidden="true"></i>Exportar predicción
        </button>` : ''}
      </div>
    </div>`;
  },

  loadCliente: (cliente) => {
    const content = document.getElementById('pred-content');
    if (!content) return;
    content.innerHTML = SGE.Pre.renderClientePanel(cliente);
    SGE.initView('predicciones');
  },
  export: (tipo = 'excel') => {
    if (typeof SGE.hasPerm === 'function' && !SGE.hasPerm('PREDICCIONES', 'exportar')) {
      SGE.Toast.show('No tiene permiso para exportar', 'error');
      return;
    }
    if (!SGE.Export) {
      SGE.Toast.show('Módulo de exportación no cargado', 'error');
      return;
    }
    const cli = document.getElementById('pred-cliente-sel')?.value || '';
    const historial = (SGE.DB.historialClientes || {})[cli] || [];
    if (!historial.length) { SGE.Toast.show('No hay datos para exportar', 'error'); return; }
    const rows = historial.map(h => [cli, h.mes, Number(h.total || 0).toFixed(2), (h.productos || []).join(' | ')]);
    const t1 = SGE.Export.buildTable('Historial mensual', ['Cliente', 'Mes', 'Total CRC', 'Productos'], rows, [2]);
    const preds = (SGE.DB.predicciones || []).filter(p => p.cliente === cli);
    const prow = preds.map(p => [p.producto, p.veces, p.prob ?? '—', p.confianza ?? '—', p.promedio ?? '—']);
    const t2 = SGE.Export.buildTable('Modelo PrediccionCompra', ['Producto', 'Veces pedido', 'Prob. %', 'Confianza', 'Prom. u.'],
      prow.length ? prow : [['—', '—', '—', '—', '—']], [1]);
    const inner = t1 + t2;
    if (tipo === 'pdf') {
      SGE.Export.openPrintDocument('Predicciones', SGE.Export.wrapLetterhead('Predicciones de demanda', `Cliente: ${cli}`, inner));
      return;
    }
    SGE.Export.downloadExcelHtml(`predicciones_${(cli || 'cliente').replace(/\s+/g, '_')}.xls`, `Predicciones — ${cli}`, inner);
  }
};
