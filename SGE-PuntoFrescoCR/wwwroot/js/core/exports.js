/* Exportación Excel (HTML tabulado) y PDF (ventana de impresión) — SGE Punto Fresco */
'use strict';

window.SGE = window.SGE || {};

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const EXPORT_PRINT_CSS = `
  @page { margin: 14mm; size: A4; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1d3a; font-size: 11px; line-height: 1.45; }
  .doc-head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1C2260; padding-bottom: 10px; margin-bottom: 14px; }
  .doc-brand { font-size: 15px; font-weight: 800; color: #1C2260; letter-spacing: -0.02em; }
  .doc-sub { font-size: 10px; color: #5a5f8a; margin-top: 2px; }
  .doc-meta { text-align: right; font-size: 10px; color: #5a5f8a; }
  h1 { font-size: 16px; margin: 0 0 6px 0; color: #1C2260; }
  h2 { font-size: 12px; margin: 18px 0 8px 0; color: #232b7a; text-transform: uppercase; letter-spacing: .04em; }
  p.lead { margin: 0 0 12px 0; color: #5a5f8a; font-size: 11px; }
  table { border-collapse: collapse; width: 100%; margin: 8px 0 14px 0; }
  th, td { border: 1px solid #d5d9ec; padding: 7px 9px; text-align: left; vertical-align: top; }
  th { background: linear-gradient(180deg, #eef1fb 0%, #e4e8f8 100%); font-size: 10px; text-transform: uppercase; letter-spacing: .03em; color: #1a1d3a; }
  tbody tr:nth-child(even) { background: #fafbff; }
  tfoot td { font-weight: 700; background: #f2f4fc; font-size: 11px; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .muted { color: #5a5f8a; font-size: 10px; }
  .section { page-break-inside: avoid; }
`;

SGE.Export = {
  escapeHtml,

  /** Descarga CSV con BOM UTF-8 (abre bien en Excel) */
  downloadCsv(filename, rows, columns) {
    const esc = (v) => {
      const s = String(v ?? '');
      if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const header = columns.map((c) => (typeof c === 'string' ? c : c.key));
    const keys = columns.map((c) => (typeof c === 'string' ? c : c.key));
    const lines = [header.map(esc).join(',')];
    for (const row of rows) {
      lines.push(keys.map((k) => esc(row[k])).join(','));
    }
    const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  },

  /** Excel vía tabla HTML (mejor formato que CSV plano) */
  downloadExcelHtml(filename, title, innerTablesHtml) {
    const html = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
  table { border-collapse: collapse; }
  th, td { border: 1px solid #94a3b8; padding: 6px 8px; font-size: 11px; }
  th { background: #1e3a5f; color: #fff; font-weight: 600; }
</style></head><body>
  <h2 style="font-family:Segoe UI,sans-serif;color:#1C2260;">${escapeHtml(title)}</h2>
  <p style="font-family:Segoe UI,sans-serif;font-size:11px;color:#64748b;">${escapeHtml(new Date().toLocaleString('es-CR'))}</p>
  ${innerTablesHtml}
</body></html>`;
    const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename.endsWith('.xls') ? filename : `${filename}.xls`;
    a.click();
    URL.revokeObjectURL(a.href);
  },

  buildTable(caption, colLabels, rows, numericCols = []) {
    const numSet = new Set(numericCols);
    const th = colLabels.map((l) => `<th>${escapeHtml(l)}</th>`).join('');
    const body = rows.map((row) => {
      const cells = row.map((cell, i) => {
        const cls = numSet.has(i) ? ' class="num"' : '';
        return `<td${cls}>${escapeHtml(cell)}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<div class="section"><h2>${escapeHtml(caption)}</h2><table><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table></div>`;
  },

  openPrintDocument(title, bodyInnerHtml) {
    const w = window.open('', '_blank');
    if (!w) {
      if (typeof SGE.Toast?.show === 'function') SGE.Toast.show('Permita ventanas emergentes para exportar a PDF', 'error');
      return;
    }
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
      <style>${EXPORT_PRINT_CSS}</style></head><body>${bodyInnerHtml}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => {
      try { w.print(); } catch (_) { /* ignore */ }
    }, 350);
  },

  wrapLetterhead(title, subtitle, inner) {
    const e = SGE.DB?.empresa || {};
    const brand = escapeHtml(e.razon_social || e.nombre_comercial || 'Punto Fresco de Costa Rica');
    const ced = escapeHtml(e.cedula_juridica || '');
    return `
      <div class="doc-head">
        <div>
          <div class="doc-brand">${brand}</div>
          <div class="doc-sub">${ced ? 'Cédula jurídica: ' + ced + ' · ' : ''}${escapeHtml(e.correo || '')}</div>
        </div>
        <div class="doc-meta">SGE Punto Fresco<br>${escapeHtml(new Date().toLocaleString('es-CR'))}</div>
      </div>
      <h1>${escapeHtml(title)}</h1>
      ${subtitle ? `<p class="lead">${escapeHtml(subtitle)}</p>` : ''}
      ${inner}`;
  }
};
