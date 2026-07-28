/* SGE Punto Fresco - Licitaciones */
'use strict';

SGE.Router.register('licitaciones', () => {
    const hoy = new Date();
    const proxFechas = SGE.DB.licitaciones.filter(l => {
        const dias = Math.ceil((new Date(l.fecha_oferta) - hoy) / 86400000);
        return dias >= 0 && dias <= 7;
    });

    const estadoLabel = { analisis: 'En Análisis', preparacion: 'En Preparación', enviada: 'Oferta Enviada', adjudicado: 'Adjudicado', 'no-adj': 'No Adjudicado' };
    const estadoCls = { analisis: 'lic-analisis', preparacion: 'lic-preparacion', enviada: 'lic-enviada', adjudicado: 'lic-adjudicado', 'no-adj': 'lic-no-adj' };

    return `
<div class="page-header">
  <div class="page-title">
    <h2>Módulo de Licitaciones</h2>
    <p>Seguimiento de concursos y cotizaciones institucionales</p>
  </div>
  <div class="page-actions">
    ${SGE.hasPerm('LICITACIONES', 'exportar') ? `<button type="button" class="btn btn-outline btn-sm" onclick="SGE.Lic.exportListadoExcel()"><i class="bi bi-file-earmark-excel me-1" aria-hidden="true"></i>Excel</button>
    <button type="button" class="btn btn-outline btn-sm" onclick="SGE.Lic.exportListadoPdf()"><i class="bi bi-file-earmark-pdf me-1" aria-hidden="true"></i>PDF</button>` : ''}
    <button type="button" class="btn btn-primary" onclick="SGE.Lic.openNew()"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Nueva Licitación</button>
  </div>
</div>

${proxFechas.length ? `
<div class="alert-banner warning">
  <span class="alert-banner-icon stat-icon-bi" style="font-size:1.25rem;"><i class="bi bi-calendar-event" aria-hidden="true"></i></span>
  <div class="alert-banner-body">
    <div class="alert-banner-title"><i class="bi bi-bell me-1" aria-hidden="true"></i>Fechas clave próximas (próximos 7 días)</div>
    ${proxFechas.map(l => `<strong>${SGE.Export.escapeHtml(l.institucion)}</strong> — Envío oferta: ${SGE.fmt.date(l.fecha_oferta)}`).join(' · ')}
  </div>
</div>` : ''}

<div class="stat-grid">
  ${[
            { label: 'En Análisis', key: 'analisis', icon: 'bi-search', cls: 'navy' },
            { label: 'En Preparación', key: 'preparacion', icon: 'bi-pencil-square', cls: 'teal' },
            { label: 'Oferta Enviada', key: 'enviada', icon: 'bi-send', cls: 'green' },
            { label: 'Adjudicadas', key: 'adjudicado', icon: 'bi-trophy', cls: 'green' },
            { label: 'No Adjudicadas', key: 'no-adj', icon: 'bi-x-octagon', cls: 'coral' },
        ].map(s => `
  <div class="stat-card">
    <div class="stat-icon ${s.cls} stat-icon-bi"><i class="bi ${s.icon}" aria-hidden="true"></i></div>
    <div class="stat-info">
      <div class="stat-val">${SGE.DB.licitaciones.filter(l => l.estado === s.key).length}</div>
      <div class="stat-lbl">${s.label}</div>
    </div>
  </div>`).join('')}
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon"></span>
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
  <input type="date" class="filter-select" id="lic-date-from" title="Fecha desde" onchange="SGE.Lic.applyFilters()">
  <input type="date" class="filter-select" id="lic-date-to" title="Fecha hasta" onchange="SGE.Lic.applyFilters()">
  <select class="sort-select" data-table="lic-table" title="Ordenar">
    <option value="">Ordenar por...</option>
    <option value="1:asc:text">Institución A → Z</option>
    <option value="1:desc:text">Institución Z → A</option>
    <option value="4:desc:date">Fecha oferta más reciente</option>
    <option value="4:asc:date">Fecha oferta más antigua</option>
    <option value="5:desc:number">Monto oferta mayor a menor</option>
    <option value="5:asc:number">Monto oferta menor a mayor</option>
  </select>
  <button type="button" class="btn btn-ghost btn-sm" onclick="SGE.resetFilters(this)"><i class="bi bi-x-circle me-1" aria-hidden="true"></i>Restablecer filtros</button>
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
            const alerta = dias >= 0 && dias <= 5 ? `<span style="font-size:.7rem;color:var(--coral);font-weight:700;display:block;"><i class="bi bi-exclamation-triangle-fill me-1" aria-hidden="true"></i>${dias}d restantes</span>` : '';
            const lid = l.licitacion_id;
            const fd = (l.fecha_oferta || '').slice(0, 10);
            return `<tr data-fecha="${fd}">
              <td><code style="background:var(--surface-alt);padding:2px 7px;border-radius:4px;font-size:.8rem;font-weight:700;">${l.id}</code></td>
              <td>
                <div class="td-name">${SGE.Export.escapeHtml(l.institucion)}</div>
              </td>
              <td>
                <span class="lic-status-badge ${estadoCls[l.estado]}">${estadoLabel[l.estado]}</span>
              </td>
              <td style="font-size:.82rem;">${l.contacto}</td>
              <td style="font-size:.82rem;">
                ${SGE.fmt.date(l.fecha_oferta)}${alerta}
              </td>
              <td style="font-weight:700;color:var(--navy);" data-sort="${l.total}">${SGE.fmt.currency(l.total)}</td>
              <td>
                <div class="flex gap-1">
                  <button class="btn btn-ghost btn-sm btn-icon" title="Ver detalle" onclick="SGE.Lic.view('${l.id}')"><i class="bi bi-eye" aria-hidden="true"></i></button>
                  <button class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Lic.edit(${lid})"><i class="bi bi-pencil" aria-hidden="true"></i></button>
                  <button class="btn btn-ghost btn-sm btn-icon" title="Documentos" onclick="SGE.Lic.docs('${l.id}')"><i class="bi bi-paperclip" aria-hidden="true"></i></button>
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
      <button type="button" class="page-btn" aria-label="Anterior"><i class="bi bi-chevron-left" aria-hidden="true"></i></button><button type="button" class="page-btn active">1</button><button type="button" class="page-btn" aria-label="Siguiente"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
    </div>
  </div>
</div>

<!-- Modal Nueva / Editar Licitación -->
<div class="modal-overlay" id="modal-licitacion">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title" id="lic-modal-title"><i class="bi bi-file-earmark-text me-1" aria-hidden="true"></i>Nueva Licitación</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <div data-tabs>
        <div class="tabs">
          <button type="button" class="tab-btn active" data-tab="lic-tab-general"><i class="bi bi-ui-checks-grid me-1" aria-hidden="true"></i>General</button>
          <button type="button" class="tab-btn" data-tab="lic-tab-productos"><i class="bi bi-box-seam me-1" aria-hidden="true"></i>Productos</button>
          <button type="button" class="tab-btn" data-tab="lic-tab-docs"><i class="bi bi-paperclip me-1" aria-hidden="true"></i>Documentos</button>
          <button type="button" class="tab-btn" data-tab="lic-tab-recordatorios"><i class="bi bi-bell me-1" aria-hidden="true"></i>Recordatorios</button>
        </div>

        <div class="tab-panel active" id="lic-tab-general">
          <div class="form-grid">
            <div class="form-group col-span-2">
              <label class="form-label">Institución <span>*</span></label>
              <input class="form-control" id="lic-inst" placeholder="Nombre de la institución pública o privada" onblur="SGE.Lic.refreshPlantillaSelect()">
            </div>
            <div class="form-group">
              <label class="form-label">Persona de Contacto</label>
              <input class="form-control" id="lic-contacto" placeholder="Nombre completo">
            </div>
            <div class="form-group">
              <label class="form-label">Teléfono de Contacto</label>
              <input class="form-control" id="lic-tel" placeholder="0000-0000">
            </div>
            <div class="form-group">
              <label class="form-label">Correo de Contacto</label>
              <input class="form-control" id="lic-email" type="email" placeholder="contacto@institucion.go.cr">
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
              <textarea class="form-control" id="lic-desc" style="min-height:90px;" placeholder="Describa el objeto de la licitación..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Fecha Límite de Consultas</label>
              <input class="form-control" type="date" id="lic-fecha-consultas">
            </div>
            <div class="form-group">
              <label class="form-label">Fecha Envío de Oferta</label>
              <input class="form-control" type="date" id="lic-fecha-oferta">
            </div>
            <div class="form-group">
              <label class="form-label">Fecha de Entrega</label>
              <input class="form-control" type="date" id="lic-fecha-entrega">
            </div>
            <div class="form-group col-span-2">
              <label class="form-label">Datos Institucionales para Oferta</label>
              <div style="background:var(--surface-alt);border:1px solid var(--border);border-radius:var(--radius-sm);padding:.85rem;font-size:.82rem;">
                <div style="display:flex;justify-content:space-between;margin-bottom:.4rem;">
                  <strong style="color:var(--navy);"><i class="bi bi-magic me-1" aria-hidden="true"></i>Autocompletado</strong>
                  <button type="button" class="btn btn-teal btn-sm" onclick="SGE.Lic.autoFill()">Usar datos de la empresa</button>
                </div>
                <div id="lic-autofill-preview" style="color:var(--text-muted);">
                  Haga clic en el botón para completar automáticamente los datos legales de la empresa.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-panel" id="lic-tab-productos">
          <div style="margin-bottom:.75rem;">
            <div class="order-line-head">
              <span>Producto / Servicio</span><span>Cantidad</span><span>Precio Unit.</span><span>Subtotal</span><span></span>
            </div>
            <div id="lic-lines"></div>
            <button type="button" class="btn-add-line" onclick="SGE.Lic.addLine()"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Agregar ítem</button>
            <div class="form-grid" style="margin-top:1rem;padding:.85rem;background:var(--surface-alt);border-radius:var(--radius-sm);border:1px solid var(--border);align-items:end;grid-template-columns:1fr auto;gap:.75rem;">
              <div class="form-group" style="margin:0;">
                <label class="form-label"><i class="bi bi-journal-bookmark me-1" aria-hidden="true"></i>Plantilla — rubros de otra licitación</label>
                <select class="form-control" id="lic-plantilla-src" style="font-size:.82rem;"></select>
                <span class="form-hint">Prioriza la misma institución. Importa descripciones, cantidades y precios para ajustar antes de guardar.</span>
              </div>
              <button type="button" class="btn btn-outline btn-sm" onclick="SGE.Lic.importarPlantillaRubros()"><i class="bi bi-download me-1" aria-hidden="true"></i>Importar</button>
            </div>
          </div>
          <div class="order-totals">
            <div class="order-total-row"><span class="lbl">Subtotal:</span><span class="val" id="lt-sub">₡0.00</span></div>
            <div class="order-total-row"><span class="lbl">IVA:</span><span class="val" id="lt-iva">₡0.00</span></div>
            <div class="order-total-row grand"><span class="lbl">Total Oferta:</span><span class="val" id="lt-total">₡0.00</span></div>
          </div>
        </div>

        <div class="tab-panel" id="lic-tab-docs">
          <p class="muted" style="font-size:.84rem;margin-bottom:.75rem;color:var(--text-secondary);">
            <i class="bi bi-info-circle me-1" aria-hidden="true"></i>
            Puede adjuntar archivos antes de guardar; se subirán automáticamente al crear o actualizar la licitación.
          </p>
          <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:.75rem;align-items:end;">
            <div class="form-group">
              <label class="form-label">Archivo</label>
              <input type="file" class="form-control" id="lic-pending-file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.webp,.gif,.zip,.rar,.7z">
            </div>
            <div class="form-group">
              <label class="form-label">Tipo</label>
              <select class="form-control" id="lic-pending-tipo">
                <option>General</option>
                <option>Pliego</option>
                <option>Oferta</option>
                <option>Otro</option>
              </select>
            </div>
            <div class="form-group" style="grid-column:1/-1;">
              <button type="button" class="btn btn-outline btn-sm" onclick="SGE.Lic.addPendingDoc()"><i class="bi bi-plus-circle me-1" aria-hidden="true"></i>Añadir a la cola</button>
            </div>
          </div>
          <div id="lic-pending-docs-list" style="margin-top:1rem;"></div>
        </div>

        <div class="tab-panel" id="lic-tab-recordatorios">
          <p class="muted" style="font-size:.84rem;margin-bottom:.75rem;color:var(--text-secondary);">
            <i class="bi bi-info-circle me-1" aria-hidden="true"></i>
            Defina recordatorios aquí; se crearán en el servidor al guardar la licitación nueva o al guardar cambios.
          </p>
          <div class="form-grid" style="grid-template-columns:1fr 160px auto;gap:.75rem;align-items:end;">
            <div class="form-group">
              <label class="form-label">Título</label>
              <input class="form-control" id="lic-pending-rec-titulo" placeholder="Ej: Revisar pliego">
            </div>
            <div class="form-group">
              <label class="form-label">Fecha</label>
              <input class="form-control" type="date" id="lic-pending-rec-fecha">
            </div>
            <button type="button" class="btn btn-outline btn-sm" style="margin-bottom:2px;" onclick="SGE.Lic.addPendingReminder()"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Añadir</button>
          </div>
          <div id="lic-pending-rec-list" style="margin-top:1rem;"></div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button type="button" class="btn btn-primary" onclick="SGE.Lic.save()"><i class="bi bi-floppy me-1" aria-hidden="true"></i>Guardar</button>
    </div>
  </div>
</div>

<div class="modal-overlay" id="modal-lic-detail">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title"><i class="bi bi-file-earmark-text me-1" aria-hidden="true"></i>Detalle de Licitación</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body" id="lic-detail-body"></div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-close-modal>Cerrar</button>
      ${SGE.hasPerm('LICITACIONES', 'exportar') ? `<button type="button" class="btn btn-outline" onclick="SGE.Lic.exportDetalleCsv()"><i class="bi bi-filetype-csv me-1" aria-hidden="true"></i>CSV</button>
      <button type="button" class="btn btn-outline" onclick="SGE.Lic.exportDetalleExcel()"><i class="bi bi-file-earmark-excel me-1" aria-hidden="true"></i>Excel</button>
      <button type="button" class="btn btn-outline" onclick="SGE.Lic.exportInformePdf()"><i class="bi bi-file-earmark-pdf me-1" aria-hidden="true"></i>PDF completo</button>` : ''}
      <button type="button" class="btn btn-primary" onclick="SGE.Lic.editFromDetail()"><i class="bi bi-pencil me-1" aria-hidden="true"></i>Editar</button>
    </div>
  </div>
</div>

<div class="modal-overlay" id="modal-lic-upload">
  <div class="modal modal-sm">
    <div class="modal-header">
      <span class="modal-title"><i class="bi bi-cloud-upload me-1" aria-hidden="true"></i>Adjuntar archivo</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Archivo <span>*</span></label>
        <input type="file" class="form-control" id="lic-upload-file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.webp,.gif,.zip,.rar,.7z">
      </div>
      <div class="form-group">
        <label class="form-label">Tipo de documento</label>
        <select class="form-control" id="lic-upload-tipo">
          <option>General</option>
          <option>Pliego</option>
          <option>Oferta</option>
          <option>Otro</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button type="button" class="btn btn-primary" onclick="SGE.Lic.submitUpload()"><i class="bi bi-upload me-1" aria-hidden="true"></i>Subir</button>
    </div>
  </div>
</div>

<div class="modal-overlay" id="modal-lic-reminder-form">
  <div class="modal modal-sm">
    <div class="modal-header">
      <span class="modal-title"><i class="bi bi-bell me-1" aria-hidden="true"></i>Nuevo recordatorio</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Título <span>*</span></label>
        <input class="form-control" id="lic-reminder-titulo" placeholder="Descripción breve">
      </div>
      <div class="form-group">
        <label class="form-label">Fecha <span>*</span></label>
        <input class="form-control" type="date" id="lic-reminder-fecha">
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button type="button" class="btn btn-primary" onclick="SGE.Lic.submitReminderModal()"><i class="bi bi-check-lg me-1" aria-hidden="true"></i>Guardar</button>
    </div>
  </div>
</div>
`;
});

SGE.Lic = {
    lineCount: 0,
    _editLicId: null,
    _selectedLicId: null,
    _lastDetail: null,
    _pendingDocs: [],
    _pendingReminders: [],

    _allowedDocExt: new Set(['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.txt', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.zip', '.rar', '.7z']),

    _docExtOk: (f) => {
        if (!f || !f.name) return false;
        const i = f.name.lastIndexOf('.');
        const ext = i >= 0 ? f.name.slice(i).toLowerCase() : '';
        return SGE.Lic._allowedDocExt.has(ext);
    },

    validateDocFile: (f) => {
        if (SGE.Lic._docExtOk(f)) return true;
        SGE.Toast.show('Tipo de archivo no permitido. Use PDF, Word, Excel, imágenes o ZIP.', 'error');
        return false;
    },

    estadoDbToUi: (db) => {
        const m = { Analisis: 'analisis', Preparacion: 'preparacion', Enviada: 'enviada', Adjudicado: 'adjudicado', NoAdjudicado: 'no-adj' };
        return m[db] || 'analisis';
    },

    _estadoUiToApi: (ui) => {
        const m = { analisis: 'Analisis', preparacion: 'Preparacion', enviada: 'Enviada', adjudicado: 'Adjudicado', 'no-adj': 'NoAdjudicado' };
        return m[ui] || 'Analisis';
    },

    _estadoApiToLabel: (api) => {
        const m = { Analisis: 'En Análisis', Preparacion: 'En Preparación', Enviada: 'Oferta Enviada', Adjudicado: 'Adjudicado', NoAdjudicado: 'No Adjudicado' };
        return m[api] || api || '—';
    },

    _resetDefaultLines: () => {
        const lines = document.getElementById('lic-lines');
        if (!lines) return;
        SGE.Lic.lineCount = 0;
        lines.innerHTML = '';
        SGE.Lic.addLine();
        SGE.Lic.addLine();
        SGE.Lic.calcTotals();
    },

    addPendingDoc: () => {
        const inp = document.getElementById('lic-pending-file');
        const tipo = document.getElementById('lic-pending-tipo')?.value || 'General';
        const f = inp?.files?.[0];
        if (!f) {
            SGE.Toast.show('Seleccione un archivo', 'error');
            return;
        }
        if (!SGE.Lic.validateDocFile(f)) return;
        SGE.Lic._pendingDocs.push({ file: f, tipo, name: f.name });
        inp.value = '';
        SGE.Lic._renderPendingDocs();
    },

    removePendingDoc: (idx) => {
        SGE.Lic._pendingDocs.splice(idx, 1);
        SGE.Lic._renderPendingDocs();
    },

    _renderPendingDocs: () => {
        const el = document.getElementById('lic-pending-docs-list');
        if (!el) return;
        if (!SGE.Lic._pendingDocs.length) {
            el.innerHTML = '<p style="color:var(--text-muted);font-size:.82rem;margin:0;"><i class="bi bi-inbox me-1" aria-hidden="true"></i>Sin archivos en cola.</p>';
            return;
        }
        el.innerHTML = SGE.Lic._pendingDocs.map((d, i) => `
      <div class="doc-item" style="margin-bottom:.35rem;">
        <span class="doc-icon"><i class="bi bi-file-earmark-arrow-up" aria-hidden="true"></i></span>
        <span class="doc-name">${SGE.Export.escapeHtml(d.name)}</span>
        <span class="doc-size">${SGE.Export.escapeHtml(d.tipo)}</span>
        <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Quitar" onclick="SGE.Lic.removePendingDoc(${i})"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
      </div>`).join('');
    },

    addPendingReminder: () => {
        const titulo = document.getElementById('lic-pending-rec-titulo')?.value?.trim();
        const fecha = document.getElementById('lic-pending-rec-fecha')?.value;
        if (!titulo || !fecha) {
            SGE.Toast.show('Indique título y fecha del recordatorio', 'error');
            return;
        }
        SGE.Lic._pendingReminders.push({ titulo, fecha });
        document.getElementById('lic-pending-rec-titulo').value = '';
        document.getElementById('lic-pending-rec-fecha').value = '';
        SGE.Lic._renderPendingReminders();
    },

    removePendingReminder: (idx) => {
        SGE.Lic._pendingReminders.splice(idx, 1);
        SGE.Lic._renderPendingReminders();
    },

    _renderPendingReminders: () => {
        const el = document.getElementById('lic-pending-rec-list');
        if (!el) return;
        if (!SGE.Lic._pendingReminders.length) {
            el.innerHTML = '<p style="color:var(--text-muted);font-size:.82rem;margin:0;"><i class="bi bi-inbox me-1" aria-hidden="true"></i>Sin recordatorios en cola.</p>';
            return;
        }
        el.innerHTML = SGE.Lic._pendingReminders.map((r, i) => `
      <div class="reminder-item">
        <span class="reminder-date">${SGE.Export.escapeHtml(r.fecha)}</span>
        <div style="flex:1;font-size:.84rem;"><strong>${SGE.Export.escapeHtml(r.titulo)}</strong></div>
        <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Quitar" onclick="SGE.Lic.removePendingReminder(${i})"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
      </div>`).join('');
    },

    _flushPendingAfterSave: async (licId) => {
        for (const d of SGE.Lic._pendingDocs) {
            if (!SGE.Lic._docExtOk(d.file)) {
                SGE.Toast.show('Revise la cola: hay un tipo de archivo no permitido.', 'error');
                return false;
            }
        }
        for (const d of SGE.Lic._pendingDocs) {
            await SGE.Api.mutations.uploadLicitacionDocumento(licId, d.file, d.tipo);
        }
        for (const r of SGE.Lic._pendingReminders) {
            await SGE.Api.mutations.postLicitacionRecordatorio(licId, {
                titulo: r.titulo,
                fechaRecordatorio: r.fecha
            });
        }
        SGE.Lic._pendingDocs = [];
        SGE.Lic._pendingReminders = [];
        return true;
    },

    refreshPlantillaSelect: () => {
        const sel = document.getElementById('lic-plantilla-src');
        if (!sel || !Array.isArray(SGE.DB.licitaciones)) return;
        const current = SGE.Lic._editLicId;
        const instNeedle = (document.getElementById('lic-inst')?.value || '').trim().toLowerCase();
        const list = [...SGE.DB.licitaciones]
            .filter((x) => x.licitacion_id != null && x.licitacion_id !== current)
            .map((x) => ({
                id: x.licitacion_id,
                label: `${x.id ?? x.licitacion_id} — ${x.institucion || 'Sin institución'}`,
                inst: (x.institucion || '').toLowerCase()
            }))
            .sort((a, b) => {
                const ai = instNeedle && a.inst.includes(instNeedle) ? 0 : 1;
                const bi = instNeedle && b.inst.includes(instNeedle) ? 0 : 1;
                if (ai !== bi) return ai - bi;
                return String(b.label).localeCompare(String(a.label), undefined, { numeric: true });
            });
        const prev = sel.value;
        sel.innerHTML = '<option value="">— Elegir licitación plantilla —</option>' +
            list.map((x) => `<option value="${x.id}">${SGE.Export.escapeHtml(x.label)}</option>`).join('');
        if (prev && [...sel.options].some((o) => o.value === prev)) sel.value = prev;
    },

    importarPlantillaRubros: async () => {
        const sel = document.getElementById('lic-plantilla-src');
        const licitacionId = parseInt(sel?.value, 10);
        if (!licitacionId) {
            SGE.Toast.show('Seleccione una licitación plantilla', 'error');
            return;
        }
        if (licitacionId === SGE.Lic._editLicId) {
            SGE.Toast.show('No puede importar desde la misma licitación', 'error');
            return;
        }
        let d;
        try {
            d = await SGE.Api.mutations.getLicitacionDetalle(licitacionId);
        } catch {
            SGE.Toast.show('No se pudo cargar la plantilla', 'error');
            return;
        }
        const lineas = d?.lineas || [];
        if (!lineas.length) {
            SGE.Toast.show('La licitación elegida no tiene rubros', 'error');
            return;
        }
        const lines = document.getElementById('lic-lines');
        if (!lines) return;
        lines.innerHTML = '';
        SGE.Lic.lineCount = 0;
        lineas.forEach((ln) => {
            const idx = SGE.Lic.lineCount++;
            lines.insertAdjacentHTML('beforeend', SGE.Lic.renderLine(idx));
            const row = document.getElementById(`lline-${idx}`);
            if (!row) return;
            const descEl = row.querySelector('.lic-line-desc');
            if (descEl) descEl.value = ln.descripcion || '';
            const ins = row.querySelectorAll('input[type=number]');
            if (ins[0]) ins[0].value = String(ln.cantidad || 1);
            if (ins[1]) ins[1].value = String(ln.precioUnitario != null ? ln.precioUnitario : 0);
        });
        SGE.Lic.calcTotals();
        SGE.Toast.show('Rubros importados. Revise y guarde.');
    },

    openNew: () => {
        SGE.Lic._editLicId = null;
        SGE.Lic._selectedLicId = null;
        SGE.Lic._pendingDocs = [];
        SGE.Lic._pendingReminders = [];
        const t = document.getElementById('lic-modal-title');
        if (t) t.innerHTML = '<i class="bi bi-file-earmark-text me-1" aria-hidden="true"></i>Nueva Licitación';
        ['lic-inst', 'lic-contacto', 'lic-tel', 'lic-email', 'lic-desc'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        const est = document.getElementById('lic-estado');
        if (est) est.value = 'analisis';
        // Bloquear fechas pasadas: aplicar min=hojey dejar sin valor por defecto
        const hoy = new Date().toISOString().split('T')[0];
        ['lic-fecha-consultas', 'lic-fecha-oferta', 'lic-fecha-entrega'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.min = hoy; el.value = ''; }
        });
        SGE.Modal.open('modal-licitacion');
        setTimeout(() => {
            SGE.Lic._resetDefaultLines();
            SGE.Lic._renderPendingDocs();
            SGE.Lic._renderPendingReminders();
            SGE.Lic.refreshPlantillaSelect();
            const pr = document.getElementById('lic-autofill-preview');
            if (pr) pr.textContent = 'Haga clic en el botón para completar automáticamente los datos legales de la empresa.';
        }, 0);
    },

    collectLineas: () => {
        const lineas = [];
        document.querySelectorAll('#lic-lines .order-line').forEach(row => {
            const desc = row.querySelector('.lic-line-desc')?.value?.trim() || 'Ítem';
            const inputs = row.querySelectorAll('input[type=number]');
            const qty = parseInt(inputs[0]?.value, 10) || 0;
            const price = parseFloat(inputs[1]?.value) || 0;
            if (qty > 0 && price >= 0) lineas.push({ productoId: null, descripcion: desc, cantidad: qty, precioUnitario: price, porcentajeIVA: 13 });
        });
        return lineas;
    },

    save: async () => {
        const inst = document.getElementById('lic-inst')?.value?.trim();
        const desc = document.getElementById('lic-desc')?.value?.trim();
        if (!inst || !desc) {
            SGE.Toast.show('Institución y descripción son obligatorios', 'error');
            return;
        }
        const lineas = SGE.Lic.collectLineas();
        if (!lineas.length) {
            SGE.Toast.show('Agregue al menos una línea en la pestaña Productos', 'error');
            return;
        }
        const estUi = document.getElementById('lic-estado')?.value || 'analisis';
        const body = {
            institucion: inst,
            contactoNombre: document.getElementById('lic-contacto')?.value?.trim() || null,
            contactoTelefono: document.getElementById('lic-tel')?.value?.trim() || null,
            contactoCorreo: document.getElementById('lic-email')?.value?.trim() || null,
            descripcion: desc,
            estado: SGE.Lic._estadoUiToApi(estUi),
            fechaLimiteConsultas: document.getElementById('lic-fecha-consultas')?.value || null,
            fechaEnvioOferta: document.getElementById('lic-fecha-oferta')?.value || null,
            fechaEntrega: document.getElementById('lic-fecha-entrega')?.value || null,
            observaciones: null,
            lineas
        };
        try {
            let licId = SGE.Lic._editLicId;
            if (licId) {
                await SGE.Api.mutations.putLicitacion(licId, body);
            } else {
                const created = await SGE.Api.mutations.postLicitacion(body);
                licId = typeof created === 'number' ? created : null;
            }
            if (!licId) {
                SGE.Toast.show('No se obtuvo el identificador de la licitación', 'error');
                return;
            }
            if (SGE.Lic._pendingDocs.length || SGE.Lic._pendingReminders.length) {
                const okFlush = await SGE.Lic._flushPendingAfterSave(licId);
                if (okFlush === false) return;
            }
            SGE.Lic._editLicId = null;
            SGE.Modal.close('modal-licitacion');
            SGE.Toast.show('Licitación guardada');
            SGE.Router.navigate('licitaciones');
        } catch (e) {
            SGE.Toast.show(e.message || 'No se pudo guardar', 'error');
        }
    },

    renderLine: (idx) => `
    <div class="order-line" id="lline-${idx}">
      <input class="form-control lic-line-desc" style="font-size:.82rem;" placeholder="Descripción del producto/servicio">
      <input class="form-control" type="number" min="1" value="1" style="font-size:.82rem;" oninput="SGE.Lic.calcTotals()">
      <input class="form-control" type="number" min="0" placeholder="0" style="font-size:.82rem;" oninput="SGE.Lic.calcTotals()">
      <span style="font-size:.82rem;font-weight:600;color:var(--navy);text-align:right;padding:.4rem;">₡0.00</span>
      <button type="button" class="btn btn-ghost btn-sm btn-icon" onclick="document.getElementById('lline-${idx}').remove(); SGE.Lic.calcTotals()" style="color:var(--coral);" aria-label="Eliminar línea"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
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
        if (el('lt-sub')) el('lt-sub').textContent = SGE.fmt.currency(sub);
        if (el('lt-iva')) el('lt-iva').textContent = SGE.fmt.currency(iva);
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

    view: async (id) => {
        const l = SGE.DB.licitaciones.find(x => x.id === id);
        if (!l) return;
        const bodyEl = document.getElementById('lic-detail-body');
        if (bodyEl) bodyEl.innerHTML = '<p style="color:var(--text-muted);"><i class="bi bi-hourglass-split" aria-hidden="true"></i> Cargando…</p>';
        SGE.Lic._selectedLicId = l.licitacion_id;
        SGE.Lic._lastDetail = null;
        SGE.Modal.open('modal-lic-detail');
        let d;
        try {
            d = await SGE.Api.mutations.getLicitacionDetalle(l.licitacion_id);
        } catch (e) {
            if (bodyEl) bodyEl.innerHTML = `<p style="color:var(--coral);">${String(e.message || 'Error al cargar')}</p>`;
            SGE.Toast.show(e.message || 'No se pudo cargar el detalle', 'error');
            return;
        }
        SGE.Lic._lastDetail = d;
        const estadoLabel = { analisis: 'En Análisis', preparacion: 'En Preparación', enviada: 'Oferta Enviada', adjudicado: 'Adjudicado', 'no-adj': 'No Adjudicado' };
        const estadoCls = { analisis: 'lic-analisis', preparacion: 'lic-preparacion', enviada: 'lic-enviada', adjudicado: 'lic-adjudicado', 'no-adj': 'lic-no-adj' };
        const uiEst = d && d.estado ? SGE.Lic.estadoDbToUi(d.estado) : l.estado;
        const docs = d?.documentos || [];
        const recs = d?.recordatorios || [];
        const lineas = d?.lineas || [];
        const lineRows = lineas.map(ln => {
            const st = Number(ln.cantidad) * Number(ln.precioUnitario);
            const pct = Number(ln.porcentajeIVA != null ? ln.porcentajeIVA : 13) / 100;
            const iva = st * pct;
            const tot = st + iva;
            return `<tr>
        <td style="font-size:.82rem;">${(ln.descripcion || '').replace(/</g, '&lt;') || ('Producto #' + ln.productoId)}</td>
        <td style="text-align:right;">${ln.cantidad}</td>
        <td style="text-align:right;">${SGE.fmt.currency(ln.precioUnitario)}</td>
        <td style="text-align:right;">${ln.porcentajeIVA ?? 13}%</td>
        <td style="text-align:right;font-weight:600;">${SGE.fmt.currency(tot)}</td>
      </tr>`;
        }).join('');
        const descHtml = (d && d.descripcion) ? String(d.descripcion).replace(/</g, '&lt;').replace(/\n/g, '<br>') : '';
        bodyEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
        <div>
          <div style="font-size:.75rem;color:var(--text-muted);text-transform:uppercase;">Licitación</div>
          <div style="font-size:1.2rem;font-weight:800;color:var(--navy);">${l.id}</div>
        </div>
        <span class="lic-status-badge ${estadoCls[uiEst]}">${estadoLabel[uiEst]}</span>
      </div>
      <div class="info-grid">
        <div class="info-item col-span-2"><div class="info-label">Institución</div><div class="info-value" style="font-size:1rem;font-weight:700;">${SGE.Export.escapeHtml((d && d.institucion) || l.institucion)}</div></div>
        <div class="info-item"><div class="info-label">Contacto</div><div class="info-value">${d ? [d.contactoNombre, d.contactoTelefono, d.contactoCorreo].filter(Boolean).join(' · ') || l.contacto : l.contacto}</div></div>
        <div class="info-item"><div class="info-label">Fecha Envío Oferta</div><div class="info-value">${SGE.fmt.date((d && d.fechaEnvioOferta) || l.fecha_oferta)}</div></div>
        <div class="info-item"><div class="info-label">Subtotal / IVA / Total</div><div class="info-value" style="font-size:1rem;font-weight:700;color:var(--navy);">${d ? `${SGE.fmt.currency(d.subtotal)} · ${SGE.fmt.currency(d.montoIVA)} · ${SGE.fmt.currency(d.totalOferta)}` : SGE.fmt.currency(l.total)}</div></div>
      </div>
      ${descHtml ? `<div style="margin-top:.75rem;font-size:.85rem;color:var(--text-secondary);"><strong>Descripción</strong><br>${descHtml}</div>` : ''}
      <h4 style="margin:1rem 0 .5rem 0;font-size:.95rem;"><i class="bi bi-box-seam me-1" aria-hidden="true"></i>Rubros / ítems</h4>
      <div class="table-wrap" style="max-height:220px;overflow:auto;margin-bottom:1rem;">
        <table style="font-size:.8rem;width:100%;border-collapse:collapse;">
          <thead><tr><th>Descripción</th><th style="text-align:right;">Cant.</th><th style="text-align:right;">P. unit.</th><th style="text-align:right;">IVA</th><th style="text-align:right;">Total</th></tr></thead>
          <tbody>${lineRows || '<tr><td colspan="5" style="color:var(--text-muted);">Sin líneas.</td></tr>'}</tbody>
        </table>
      </div>
      <div style="margin-top:1rem;">
        <h4 style="margin:.2rem 0 .5rem 0;font-size:.95rem;"><i class="bi bi-paperclip me-1" aria-hidden="true"></i>Documentos</h4>
        <div style="display:flex;gap:.5rem;margin-bottom:.6rem;">
          <button type="button" class="btn btn-outline btn-sm" onclick="SGE.Lic.openUploadModal()"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Adjuntar archivo</button>
        </div>
        ${(docs.length ? docs.map(x => `<div class="doc-item">
          <span class="doc-icon"><i class="bi bi-file-earmark-text" aria-hidden="true"></i></span>
          <a class="doc-name" href="${x.rutaArchivo ? encodeURI(x.rutaArchivo) : '#'}" target="_blank" rel="noopener noreferrer">${String(x.nombreArchivo || '').replace(/</g, '&lt;')}</a>
          <span class="doc-size">${x.tamanoKB ? `${x.tamanoKB} KB` : ''}</span>
          <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Eliminar" onclick="SGE.Lic.delDocumento(${x.documentoId})"><i class="bi bi-trash" aria-hidden="true"></i></button>
        </div>`).join('') : '<div style="color:var(--text-muted);font-size:.82rem;">Sin documentos adjuntos.</div>')}
      </div>
      <div style="margin-top:1rem;">
        <h4 style="margin:.2rem 0 .5rem 0;font-size:.95rem;"><i class="bi bi-bell me-1" aria-hidden="true"></i>Recordatorios</h4>
        <div style="display:flex;gap:.5rem;margin-bottom:.6rem;">
          <button type="button" class="btn btn-outline btn-sm" onclick="SGE.Lic.openReminderModal()"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Nuevo recordatorio</button>
        </div>
        ${(recs.length ? recs.map(r => {
            const fr = new Date(r.fechaRecordatorio);
            const hoyR = new Date();
            hoyR.setHours(0, 0, 0, 0);
            const overdue = fr < hoyR;
            return `<div class="reminder-item ${overdue ? 'reminder-overdue' : ''}">
          <span class="reminder-date">${fr.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          <div style="flex:1;font-size:.84rem;"><strong>${String(r.titulo || '').replace(/</g, '&lt;')}</strong>${overdue ? ' <span class="badge badge-danger" style="font-size:.65rem;">Vencido</span>' : ''}</div>
          <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Eliminar" onclick="SGE.Lic.delReminder(${r.recordatorioId})"><i class="bi bi-trash" aria-hidden="true"></i></button>
        </div>`;
        }).join('') : '<div style="color:var(--text-muted);font-size:.82rem;">Sin recordatorios.</div>')}
      </div>`;
    },

    openReminderModal: () => {
        if (!SGE.Lic._selectedLicId) return;
        const f = document.getElementById('lic-reminder-fecha');
        const hoy = new Date().toISOString().slice(0, 10);
        if (f) { f.min = hoy; f.value = hoy; }
        const t = document.getElementById('lic-reminder-titulo');
        if (t) t.value = '';
        SGE.Modal.open('modal-lic-reminder-form');
    },

    submitReminderModal: async () => {
        if (!SGE.Lic._selectedLicId) return;
        const titulo = document.getElementById('lic-reminder-titulo')?.value?.trim();
        const fecha = document.getElementById('lic-reminder-fecha')?.value;
        if (!titulo || !fecha) {
            SGE.Toast.show('Complete título y fecha', 'error');
            return;
        }
        try {
            await SGE.Api.mutations.postLicitacionRecordatorio(SGE.Lic._selectedLicId, { titulo, fechaRecordatorio: fecha });
            SGE.Modal.close('modal-lic-reminder-form');
            SGE.Toast.show('Recordatorio creado');
            const row = SGE.DB.licitaciones.find(x => x.licitacion_id === SGE.Lic._selectedLicId);
            if (row) await SGE.Lic.view(row.id);
            if (typeof SGE.Notifications?.syncFromBootstrap === 'function') SGE.Notifications.syncFromBootstrap();
        } catch (e) {
            SGE.Toast.show(e.message || 'No se pudo crear recordatorio', 'error');
        }
    },

    edit: async (licitacionId) => {
        const l = SGE.DB.licitaciones.find(x => x.licitacion_id === licitacionId);
        if (!l) return;
        const d = await SGE.Api.mutations.getLicitacionDetalle(licitacionId).catch(() => null);
        SGE.Lic._editLicId = licitacionId;
        SGE.Lic._selectedLicId = licitacionId;
        SGE.Lic._pendingDocs = [];
        SGE.Lic._pendingReminders = [];
        document.getElementById('lic-modal-title').innerHTML = `<i class="bi bi-pencil me-1" aria-hidden="true"></i>Editar Licitación — ${l.id}`;
        const inst = document.getElementById('lic-inst');
        if (inst) inst.value = (d && d.institucion) ? d.institucion : l.institucion;
        if (d) {
            const hoy = new Date().toISOString().split('T')[0];
            const setVal = (id, v) => { const el = document.getElementById(id); if (el) { if (el.type === 'date') el.min = hoy; el.value = v || ''; } };
            setVal('lic-contacto', d.contactoNombre);
            setVal('lic-tel', d.contactoTelefono);
            setVal('lic-email', d.contactoCorreo);
            setVal('lic-desc', d.descripcion);
            setVal('lic-fecha-consultas', (d.fechaLimiteConsultas || '').slice(0, 10));
            setVal('lic-fecha-oferta', (d.fechaEnvioOferta || '').slice(0, 10));
            setVal('lic-fecha-entrega', (d.fechaEntrega || '').slice(0, 10));
            const estEl = document.getElementById('lic-estado');
            if (estEl && d.estado) estEl.value = SGE.Lic.estadoDbToUi(d.estado);
            const lines = document.getElementById('lic-lines');
            if (lines) {
                lines.innerHTML = '';
                SGE.Lic.lineCount = 0;
                (d.lineas || []).forEach((ln) => {
                    const idx = SGE.Lic.lineCount++;
                    lines.insertAdjacentHTML('beforeend', SGE.Lic.renderLine(idx));
                    const row = document.getElementById(`lline-${idx}`);
                    if (!row) return;
                    row.querySelector('.lic-line-desc').value = ln.descripcion || '';
                    const ins = row.querySelectorAll('input[type=number]');
                    if (ins[0]) ins[0].value = String(ln.cantidad || 1);
                    if (ins[1]) ins[1].value = String(ln.precioUnitario || 0);
                });
                if (!(d.lineas || []).length) SGE.Lic._resetDefaultLines();
            }
            SGE.Lic.calcTotals();
        } else {
            SGE.Lic._resetDefaultLines();
        }
        SGE.Modal.open('modal-licitacion');
        setTimeout(() => {
            SGE.Lic._renderPendingDocs();
            SGE.Lic._renderPendingReminders();
            SGE.Lic.refreshPlantillaSelect();
        }, 0);
    },

    editFromDetail: async () => {
        const id = SGE.Lic._selectedLicId;
        if (!id) return;
        SGE.Modal.close('modal-lic-detail');
        await SGE.Lic.edit(id);
    },

    docs: async (id) => {
        const l = SGE.DB.licitaciones.find(x => x.id === id);
        if (!l) return;
        await SGE.Lic.view(id);
    },

    openUploadModal: () => {
        if (!SGE.Lic._selectedLicId) return;
        const inp = document.getElementById('lic-upload-file');
        if (inp) inp.value = '';
        SGE.Modal.open('modal-lic-upload');
    },

    submitUpload: async () => {
        if (!SGE.Lic._selectedLicId) return;
        const file = document.getElementById('lic-upload-file')?.files?.[0];
        const tipo = document.getElementById('lic-upload-tipo')?.value || 'General';
        if (!file) {
            SGE.Toast.show('Seleccione un archivo', 'error');
            return;
        }
        if (!SGE.Lic.validateDocFile(file)) return;
        try {
            await SGE.Api.mutations.uploadLicitacionDocumento(SGE.Lic._selectedLicId, file, tipo);
            SGE.Modal.close('modal-lic-upload');
            SGE.Toast.show('Archivo adjuntado');
            const row = SGE.DB.licitaciones.find(x => x.licitacion_id === SGE.Lic._selectedLicId);
            if (row) await SGE.Lic.view(row.id);
            if (typeof SGE.Notifications?.syncFromBootstrap === 'function') SGE.Notifications.syncFromBootstrap();
        } catch (e) {
            SGE.Toast.show(e.message || 'No se pudo subir el archivo', 'error');
        }
    },

    delDocumento: async (documentoId) => {
        if (!SGE.Lic._selectedLicId) return;
        try {
            await SGE.Api.mutations.deleteLicitacionDocumento(SGE.Lic._selectedLicId, documentoId);
            const row = SGE.DB.licitaciones.find(x => x.licitacion_id === SGE.Lic._selectedLicId);
            if (row) await SGE.Lic.view(row.id);
        } catch (e) {
            SGE.Toast.show(e.message || 'No se pudo eliminar', 'error');
        }
    },

    delReminder: async (recordatorioId) => {
        if (!SGE.Lic._selectedLicId) return;
        try {
            await SGE.Api.mutations.deleteLicitacionRecordatorio(SGE.Lic._selectedLicId, recordatorioId);
            const row = SGE.DB.licitaciones.find(x => x.licitacion_id === SGE.Lic._selectedLicId);
            if (row) await SGE.Lic.view(row.id);
            if (typeof SGE.Notifications?.syncFromBootstrap === 'function') SGE.Notifications.syncFromBootstrap();
        } catch (e) {
            SGE.Toast.show(e.message || 'No se pudo eliminar', 'error');
        }
    },

    exportListadoExcel: () => {
        if (typeof SGE.hasPerm === 'function' && !SGE.hasPerm('LICITACIONES', 'exportar')) {
            SGE.Toast.show('No tiene permiso para exportar', 'error');
            return;
        }
        const rows = (SGE.DB.licitaciones || []).map(l => ([
            l.id,
            l.institucion,
            SGE.Lic._estadoApiToLabel(SGE.Lic._estadoUiToApi(l.estado)) || l.estado,
            l.contacto,
            l.fecha_oferta,
            Number(l.total || 0).toFixed(2)
        ]));
        const table = SGE.Export.buildTable('Listado de licitaciones',
            ['Código', 'Institución', 'Estado', 'Contacto', 'Fecha oferta', 'Total CRC'],
            rows,
            [5]);
        SGE.Export.downloadExcelHtml(`licitaciones_${new Date().toISOString().slice(0, 10)}.xls`, 'Licitaciones — listado', table);
    },

    exportListadoPdf: () => {
        if (typeof SGE.hasPerm === 'function' && !SGE.hasPerm('LICITACIONES', 'exportar')) {
            SGE.Toast.show('No tiene permiso para exportar', 'error');
            return;
        }
        const rows = (SGE.DB.licitaciones || []).map((l, i) => ([
            String(i + 1),
            l.id,
            l.institucion,
            l.estado,
            l.contacto,
            l.fecha_oferta,
            SGE.fmt.currency(l.total)
        ]));
        const inner = SGE.Export.buildTable('Listado',
            ['#', 'Código', 'Institución', 'Estado', 'Contacto', 'Fecha oferta', 'Total'],
            rows,
            [0, 6]);
        SGE.Export.openPrintDocument('Licitaciones', SGE.Export.wrapLetterhead('Listado de licitaciones', 'Vista general del portafolio de concursos', inner));
    },

    exportDetalleCsv: () => {
        if (typeof SGE.hasPerm === 'function' && !SGE.hasPerm('LICITACIONES', 'exportar')) {
            SGE.Toast.show('No tiene permiso para exportar', 'error');
            return;
        }
        if (!SGE.Lic._selectedLicId) return;
        const d = SGE.Lic._lastDetail;
        const row = SGE.DB.licitaciones.find(x => x.licitacion_id === SGE.Lic._selectedLicId);
        if (!row) return;
        if (d && d.lineas && d.lineas.length) {
            const cols = ['Rubro', 'Cantidad', 'PrecioUnit', 'IVApct', 'Subtotal', 'IVA', 'TotalLinea'];
            const body = [];
            for (const ln of d.lineas) {
                const st = Number(ln.cantidad) * Number(ln.precioUnitario);
                const pct = Number(ln.porcentajeIVA != null ? ln.porcentajeIVA : 13) / 100;
                const iva = st * pct;
                body.push({
                    Rubro: ln.descripcion || '',
                    Cantidad: ln.cantidad,
                    PrecioUnit: ln.precioUnitario,
                    IVApct: ln.porcentajeIVA ?? 13,
                    Subtotal: st.toFixed(2),
                    IVA: iva.toFixed(2),
                    TotalLinea: (st + iva).toFixed(2)
                });
            }
            SGE.Export.downloadCsv(`${row.id}_rubros.csv`, body, cols);
            return;
        }
        SGE.Export.downloadCsv(`${row.id}.csv`, [{
            Codigo: row.id,
            Institucion: row.institucion,
            Estado: row.estado,
            Contacto: row.contacto,
            FechaOferta: row.fecha_oferta,
            Total: row.total
        }], ['Codigo', 'Institucion', 'Estado', 'Contacto', 'FechaOferta', 'Total']);
    },

    exportDetalleExcel: () => {
        if (typeof SGE.hasPerm === 'function' && !SGE.hasPerm('LICITACIONES', 'exportar')) {
            SGE.Toast.show('No tiene permiso para exportar', 'error');
            return;
        }
        if (!SGE.Lic._selectedLicId || !SGE.Lic._lastDetail) {
            SGE.Toast.show('Abra el detalle de la licitación primero', 'error');
            return;
        }
        const d = SGE.Lic._lastDetail;
        const row = SGE.DB.licitaciones.find(x => x.licitacion_id === SGE.Lic._selectedLicId);
        const lineas = d.lineas || [];
        const rows = lineas.map(ln => {
            const st = Number(ln.cantidad) * Number(ln.precioUnitario);
            const pct = Number(ln.porcentajeIVA != null ? ln.porcentajeIVA : 13) / 100;
            const iva = st * pct;
            return [
                ln.descripcion || '',
                Number(ln.cantidad || 0),
                Number(ln.precioUnitario || 0).toFixed(2),
                `${ln.porcentajeIVA ?? 13}%`,
                st.toFixed(2),
                iva.toFixed(2),
                (st + iva).toFixed(2)
            ];
        });
        const t1 = SGE.Export.buildTable('Rubros / ítems',
            ['Descripción', 'Cant.', 'P. unit.', 'IVA', 'Subtotal', 'Monto IVA', 'Total línea'],
            rows,
            [1, 2, 4, 5, 6]);
        const info = `<table style="margin-bottom:16px;font-size:11px;"><tr><td><b>Institución</b></td><td>${SGE.Export.escapeHtml(d.institucion)}</td></tr>
      <tr><td><b>Código</b></td><td>${SGE.Export.escapeHtml(row?.id || '')}</td></tr>
      <tr><td><b>Total oferta</b></td><td>${Number(d.totalOferta || 0).toFixed(2)}</td></tr></table>`;
        SGE.Export.downloadExcelHtml(`${row?.id || 'licitacion'}_detalle.xls`, `Licitación ${row?.id || ''}`, info + t1);
    },

    exportInformePdf: () => {
        if (typeof SGE.hasPerm === 'function' && !SGE.hasPerm('LICITACIONES', 'exportar')) {
            SGE.Toast.show('No tiene permiso para exportar', 'error');
            return;
        }
        if (!SGE.Lic._lastDetail) {
            SGE.Toast.show('No hay datos cargados para el informe', 'error');
            return;
        }
        const d = SGE.Lic._lastDetail;
        const row = SGE.DB.licitaciones.find(x => x.licitacion_id === SGE.Lic._selectedLicId);
        const lineas = d.lineas || [];
        const lineRows = lineas.map((ln, i) => {
            const st = Number(ln.cantidad) * Number(ln.precioUnitario);
            const pct = Number(ln.porcentajeIVA != null ? ln.porcentajeIVA : 13) / 100;
            const iva = st * pct;
            const tot = st + iva;
            return [String(i + 1), ln.descripcion || '—', ln.cantidad, SGE.fmt.currency(ln.precioUnitario), `${ln.porcentajeIVA ?? 13}%`, SGE.fmt.currency(tot)];
        });
        const tabRubros = SGE.Export.buildTable('Detalle de rubros e ítems ofertados',
            ['#', 'Descripción', 'Cantidad', 'Precio unit.', 'IVA', 'Total línea'],
            lineRows.length ? lineRows : [['—', 'Sin rubros registrados', '—', '—', '—', '—']],
            [0, 2, 3, 4, 5]);
        const docs = (d.documentos || []).map(x => [x.nombreArchivo || '—', x.tipoDocumento || 'General', x.tamanoKB != null ? `${x.tamanoKB} KB` : '—']);
        const tabDocs = SGE.Export.buildTable('Documentación adjunta', ['Archivo', 'Tipo', 'Tamaño'], docs.length ? docs : [['—', 'Sin adjuntos', '—']], []);
        const meta = `
      <div class="section">
        <h2>Resumen</h2>
        <table>
          <tr><th>Institución</th><td>${SGE.Export.escapeHtml(d.institucion)}</td></tr>
          <tr><th>Contacto</th><td>${SGE.Export.escapeHtml([d.contactoNombre, d.contactoTelefono, d.contactoCorreo].filter(Boolean).join(' · ') || '—')}</td></tr>
          <tr><th>Estado</th><td>${SGE.Export.escapeHtml(SGE.Lic._estadoApiToLabel(d.estado))}</td></tr>
          <tr><th>Fecha límite consultas</th><td>${SGE.Export.escapeHtml((d.fechaLimiteConsultas || '').slice(0, 10) || '—')}</td></tr>
          <tr><th>Fecha envío oferta</th><td>${SGE.Export.escapeHtml((d.fechaEnvioOferta || '').slice(0, 10) || '—')}</td></tr>
          <tr><th>Fecha entrega</th><td>${SGE.Export.escapeHtml((d.fechaEntrega || '').slice(0, 10) || '—')}</td></tr>
          <tr><th>Subtotal</th><td class="num">${SGE.Export.escapeHtml(SGE.fmt.currency(d.subtotal))}</td></tr>
          <tr><th>IVA</th><td class="num">${SGE.Export.escapeHtml(SGE.fmt.currency(d.montoIVA))}</td></tr>
          <tr><th>Total oferta</th><td class="num">${SGE.Export.escapeHtml(SGE.fmt.currency(d.totalOferta))}</td></tr>
        </table>
      </div>
      <div class="section"><h2>Descripción del requerimiento</h2><p class="lead" style="white-space:pre-wrap;">${SGE.Export.escapeHtml(d.descripcion || '—')}</p></div>
    `;
        const inner = meta + tabRubros + tabDocs;
        SGE.Export.openPrintDocument('Informe de licitación', SGE.Export.wrapLetterhead(`Informe de licitación ${row?.id || ''}`, 'Documento con rubros, montos y anexos registrados en el sistema', inner));
    },

    applyFilters: () => {
        const from = document.getElementById('lic-date-from')?.value || '';
        const to = document.getElementById('lic-date-to')?.value || '';
        document.querySelectorAll('#lic-table tbody tr').forEach(tr => {
            const d = (tr.dataset.fecha || '').slice(0, 10);
            const okFrom = !from || d >= from;
            const okTo = !to || d <= to;
            tr.style.display = okFrom && okTo ? '' : 'none';
        });
    }
};

document.addEventListener('view:ready', (e) => {
    if (e.detail?.view === 'licitaciones') {
        SGE.Lic.applyFilters();
    }
});