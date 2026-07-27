/* Exportación Excel (HTML tabulado) y PDF (iframe oculto) — SGE Punto Fresco
   Mejoras vs versión original:
   - PDF vía <iframe> oculto en lugar de window.open() -> sin bloqueo de popups
   - Espera real a que cargue el documento (iframe.onload) en lugar de setTimeout fijo
   - print-color-adjust: exact -> los fondos/gradientes sí se imprimen
   - thead/tfoot se repiten en cada página, filas no se cortan a la mitad
   - Membrete con logo opcional
   - Marca de agua opcional (ej. "BORRADOR")
   - Nombres de archivo con fecha/hora para no sobrescribir exports anteriores
*/
'use strict';

window.SGE = window.SGE || {};

function escapeHtml(s) {
    return String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function timestampedName(base, ext) {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
    return `${base}_${stamp}.${ext}`;
}

const EXPORT_PRINT_CSS = `
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; box-sizing: border-box; }
  @page { margin: 14mm; size: A4; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1d3a; font-size: 11px; line-height: 1.45; margin: 0; }
  .doc-head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1C2260; padding-bottom: 10px; margin-bottom: 14px; }
  .doc-brand-row { display: flex; align-items: center; gap: 10px; }
  .doc-logo { height: 34px; width: auto; object-fit: contain; }
  .doc-brand { font-size: 15px; font-weight: 800; color: #1C2260; letter-spacing: -0.02em; }
  .doc-sub { font-size: 10px; color: #5a5f8a; margin-top: 2px; }
  .doc-meta { text-align: right; font-size: 10px; color: #5a5f8a; }
  h1 { font-size: 16px; margin: 0 0 6px 0; color: #1C2260; }
  h2 { font-size: 12px; margin: 18px 0 8px 0; color: #232b7a; text-transform: uppercase; letter-spacing: .04em; }
  p.lead { margin: 0 0 12px 0; color: #5a5f8a; font-size: 11px; }
  table { border-collapse: collapse; width: 100%; margin: 8px 0 14px 0; }
  thead { display: table-header-group; }
  tfoot { display: table-footer-group; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  th, td { border: 1px solid #d5d9ec; padding: 7px 9px; text-align: left; vertical-align: top; }
  th { background: #eef1fb; font-size: 10px; text-transform: uppercase; letter-spacing: .03em; color: #1a1d3a; }
  tbody tr:nth-child(even) { background: #fafbff; }
  tfoot td { font-weight: 700; background: #f2f4fc; font-size: 11px; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .muted { color: #5a5f8a; font-size: 10px; }
  .section { page-break-inside: avoid; break-inside: avoid; }
  .doc-foot { position: fixed; bottom: -8mm; left: 0; right: 0; font-size: 9px; color: #8a8fb0; border-top: 1px solid #e4e8f8; padding-top: 4px; display: flex; justify-content: space-between; }
  .watermark { position: fixed; top: 42%; left: 8%; font-size: 70px; font-weight: 800; color: rgba(28,34,96,0.07); transform: rotate(-25deg); z-index: -1; pointer-events: none; }
`;

SGE.Export = {
    escapeHtml,
    timestampedName,

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
        a.download = timestampedName(filename.replace(/\.csv$/i, ''), 'csv');
        a.click();
        URL.revokeObjectURL(a.href);
    },

    /** Excel vía tabla HTML (mejor formato que CSV plano) */
    downloadExcelHtml(filename, title, innerTablesHtml) {
        const html = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<!--[if gte mso 9]><xml>
  <x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>${escapeHtml(title).slice(0, 31)}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
  </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>
</xml><![endif]-->
<style>
  body { font-family: 'Segoe UI', Calibri, sans-serif; }
  table { border-collapse: collapse; width: 100%; margin: 4px 0 20px 0; }
  th, td { border: 1px solid #c8cde8; padding: 6px 9px; font-size: 11px; mso-number-format:'\\@'; }
  th { background: #1C2260; color: #ffffff; font-weight: 700; text-align: left; }
  td.num, th.num { mso-number-format:'#,##0.00'; text-align: right; }
  tbody tr:nth-child(even) td { background: #f4f5fc; }
  caption, h2 { text-align: left; }
</style></head><body>
  <h2 style="font-family:'Segoe UI',sans-serif;color:#1C2260;">${escapeHtml(title)}</h2>
  <p style="font-family:'Segoe UI',sans-serif;font-size:11px;color:#5a5f8a;">Generado: ${escapeHtml(new Date().toLocaleString('es-CR'))}</p>
  ${innerTablesHtml}
</body></html>`;
        const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        const base = filename.replace(/\.xls$/i, '');
        a.download = timestampedName(base, 'xls');
        a.click();
        URL.revokeObjectURL(a.href);
    },

    buildTable(caption, colLabels, rows, numericCols = []) {
        const numSet = new Set(numericCols);
        const th = colLabels.map((l, i) => `<th${numSet.has(i) ? ' class="num"' : ''}>${escapeHtml(l)}</th>`).join('');
        const body = rows.map((row) => {
            const cells = row.map((cell, i) => {
                const cls = numSet.has(i) ? ' class="num"' : '';
                return `<td${cls}>${escapeHtml(cell)}</td>`;
            }).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        return `<div class="section"><h2>${escapeHtml(caption)}</h2><table><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table></div>`;
    },

    /**
     * Abre el diálogo de impresión/PDF usando un iframe oculto (evita bloqueo de popups).
     * opts.watermark: string opcional, ej. "BORRADOR"
     * opts.footerLeft / opts.footerRight: strings opcionales para el pie de página
     */
    openPrintDocument(title, bodyInnerHtml, opts = {}) {
        const { watermark, footerLeft, footerRight } = opts;

        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.setAttribute('aria-hidden', 'true');
        document.body.appendChild(iframe);

        const watermarkHtml = watermark ? `<div class="watermark">${escapeHtml(watermark)}</div>` : '';
        const footerHtml = (footerLeft || footerRight)
            ? `<div class="doc-foot"><span>${escapeHtml(footerLeft || '')}</span><span>${escapeHtml(footerRight || '')}</span></div>`
            : '';

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
      <style>${EXPORT_PRINT_CSS}</style></head><body>${watermarkHtml}${bodyInnerHtml}${footerHtml}</body></html>`);
        doc.close();

        const cleanup = () => setTimeout(() => iframe.remove(), 1000);

        // Fallback por si onload no dispara (algunos navegadores con about:blank)
        const fallbackTimer = setTimeout(() => triggerPrint(), 600);

        function triggerPrint() {
            clearTimeout(fallbackTimer);
            try {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
            } catch (err) {
                if (typeof SGE.Toast?.show === 'function') {
                    SGE.Toast.show('No se pudo abrir el diálogo de impresión/PDF', 'error');
                }
            }
            cleanup();
        }

        iframe.onload = () => {
            // Un frame extra para asegurar que estilos/imágenes ya aplicaron
            requestAnimationFrame(() => requestAnimationFrame(triggerPrint));
        };
    },

    /**
     * opts.logoUrl: URL o data-URI del logo (opcional)
     */
    wrapLetterhead(title, subtitle, inner, opts = {}) {
        const e = SGE.DB?.empresa || {};
        const brand = escapeHtml(e.razon_social || e.nombre_comercial || 'Punto Fresco de Costa Rica');
        const ced = escapeHtml(e.cedula_juridica || '');
        const logoUrl = opts.logoUrl || e.logo_url;
        const logoHtml = logoUrl ? `<img class="doc-logo" src="${escapeHtml(logoUrl)}" alt="">` : '';

        return `
      <div class="doc-head">
        <div class="doc-brand-row">
          ${logoHtml}
          <div>
            <div class="doc-brand">${brand}</div>
            <div class="doc-sub">${ced ? 'Cédula jurídica: ' + ced + ' · ' : ''}${escapeHtml(e.correo || '')}</div>
          </div>
        </div>
        <div class="doc-meta">SGE Punto Fresco<br>${escapeHtml(new Date().toLocaleString('es-CR'))}</div>
      </div>
      <h1>${escapeHtml(title)}</h1>
      ${subtitle ? `<p class="lead">${escapeHtml(subtitle)}</p>` : ''}
      ${inner}`;
    }
};