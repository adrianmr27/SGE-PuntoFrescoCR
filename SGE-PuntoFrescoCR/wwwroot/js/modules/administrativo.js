/* SGE Punto Fresco - split module */
'use strict';

SGE.Router.register('administrativo', () => {
  const e = SGE.DB.empresa;
  return `
<div class="page-header">
  <div class="page-title">
    <h2>Módulo Administrativo</h2>
    <p>Configuración general del sistema y datos institucionales</p>
  </div>
</div>

<div data-tabs>
  <div class="tabs">
    <button type="button" class="tab-btn active" data-tab="tab-empresa"><i class="bi bi-building me-1" aria-hidden="true"></i>Datos de la Empresa</button>
    <button type="button" class="tab-btn" data-tab="tab-params"><i class="bi bi-gear me-1" aria-hidden="true"></i>Parámetros del Sistema</button>
    <button type="button" class="tab-btn" data-tab="tab-overview"><i class="bi bi-ui-checks me-1" aria-hidden="true"></i>Vista General</button>
  </div>

  <!-- Tab: Empresa -->
  <div class="tab-panel active" id="tab-empresa">
    <div class="card">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon card-title-icon-bi" style="background:rgba(28,34,96,.08)"><i class="bi bi-building" aria-hidden="true"></i></span> Información General de la Empresa</span>
        <button type="button" class="btn btn-primary btn-sm" onclick="SGE.Adm.editEmpresa()"><i class="bi bi-pencil me-1" aria-hidden="true"></i>Editar</button>
      </div>
      <div class="card-body" id="empresa-view">
        <div class="info-grid info-grid--3cols" style="margin-bottom:1.5rem;">
          <div class="info-item col-span-2">
            <div class="info-label">Nombre Comercial</div>
            <div class="info-value" style="font-size:1.05rem; font-weight:700; color:var(--navy);">${e.nombre_comercial}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Cédula Jurídica</div>
            <div class="info-value">${e.cedula_juridica}</div>
          </div>
          <div class="info-item" style="grid-column:1/-1;">
            <div class="info-label">Razón Social</div>
            <div class="info-value">${e.razon_social}</div>
          </div>
        </div>
        <div style="height:1px; background:var(--border); margin-bottom:1.25rem;"></div>
        <div class="info-grid info-grid--3cols">
          <div class="info-item">
            <div class="info-label">Teléfono Principal</div>
            <div class="info-value"><i class="bi bi-telephone me-1" aria-hidden="true"></i>${e.telefono1}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Teléfono Alternativo</div>
            <div class="info-value"><i class="bi bi-telephone me-1" aria-hidden="true"></i>${e.telefono2}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Sitio Web</div>
            <div class="info-value"><i class="bi bi-globe2 me-1" aria-hidden="true"></i>${e.sitio_web}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Correo Principal</div>
            <div class="info-value"><i class="bi bi-envelope me-1" aria-hidden="true"></i>${e.correo}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Correo Alternativo</div>
            <div class="info-value"><i class="bi bi-envelope me-1" aria-hidden="true"></i>${e.correo_alt}</div>
          </div>
          <div class="info-item">
            <div class="info-label">IVA por Defecto</div>
            <div class="info-value"><span class="badge badge-info">${e.impuesto_defecto}%</span></div>
          </div>
          <div class="info-item" style="grid-column:1/-1;">
            <div class="info-label">Dirección</div>
            <div class="info-value"><i class="bi bi-geo-alt me-1" aria-hidden="true"></i>${e.direccion}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal-overlay" id="modal-empresa">
      <div class="modal modal-lg">
        <div class="modal-header">
          <span class="modal-title"><i class="bi bi-building me-1" aria-hidden="true"></i>Editar Datos de la Empresa</span>
          <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-grid cols-3">
            <div class="form-group col-span-2">
              <label class="form-label">Nombre Comercial <span>*</span></label>
              <input class="form-control" id="f-ncomer" value="${e.nombre_comercial}">
            </div>
            <div class="form-group">
              <label class="form-label">Cédula Jurídica <span>*</span></label>
              <input class="form-control" id="f-cedula" value="${e.cedula_juridica}">
            </div>
            <div class="form-group col-span-3">
              <label class="form-label">Razón Social <span>*</span></label>
              <input class="form-control" id="f-razon" value="${e.razon_social}">
            </div>
            <div class="form-divider-label">Contacto</div>
            <div class="form-group">
              <label class="form-label">Teléfono Principal</label>
              <input class="form-control" id="f-tel1" value="${e.telefono1}">
            </div>
            <div class="form-group">
              <label class="form-label">Teléfono Alternativo</label>
              <input class="form-control" id="f-tel2" value="${e.telefono2}">
            </div>
            <div class="form-group">
              <label class="form-label">Sitio Web</label>
              <input class="form-control" id="f-web" value="${e.sitio_web}">
            </div>
            <div class="form-group">
              <label class="form-label">Correo Principal</label>
              <input class="form-control" type="email" id="f-email1" value="${e.correo}">
            </div>
            <div class="form-group">
              <label class="form-label">Correo Alternativo</label>
              <input class="form-control" type="email" id="f-email2" value="${e.correo_alt}">
            </div>
            <div class="form-group">
              <label class="form-label">IVA por Defecto</label>
              <select class="form-control" id="f-iva">
                <option value="0" ${e.impuesto_defecto==='0'?'selected':''}>0% - Exento</option>
                <option value="4" ${e.impuesto_defecto==='4'?'selected':''}>4% - Reducido</option>
                <option value="13" ${e.impuesto_defecto==='13'?'selected':''}>13% - General</option>
              </select>
            </div>
            <div class="form-group col-span-3">
              <label class="form-label">Dirección</label>
              <textarea class="form-control" id="f-dir">${e.direccion}</textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" data-close-modal>Cancelar</button>
          <button type="button" class="btn btn-primary" onclick="SGE.Adm.saveEmpresa()"><i class="bi bi-floppy me-1" aria-hidden="true"></i>Guardar Cambios</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Tab: Parámetros -->
  <div class="tab-panel" id="tab-params">
    <div class="card">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon card-title-icon-bi" style="background:rgba(93,210,188,.15)"><i class="bi bi-gear" aria-hidden="true"></i></span> Parámetros Generales</span>
        <button type="button" class="btn btn-primary btn-sm" onclick="SGE.Adm.newParam()"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Nuevo Parámetro</button>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table id="params-table">
            <thead><tr>
              <th>#</th><th>Tipo</th><th>Nombre</th><th>Valor</th><th>Estado</th><th>Acciones</th>
            </tr></thead>
            <tbody>
              ${SGE.DB.parametros.map(p=>`
              <tr>
                <td style="color:var(--text-muted)">${p.id}</td>
                <td><span class="badge badge-navy">${p.tipo}</span></td>
                <td class="td-name">${p.nombre}</td>
                <td><strong>${p.valor}</strong></td>
                <td><span class="badge ${p.estado==='Activo'?'badge-active':'badge-inactive'}">${p.estado}</span></td>
                <td>
                  <div class="flex gap-1">
                    <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Adm.editParam(${p.id})"><i class="bi bi-pencil" aria-hidden="true"></i></button>
                    <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Activar/Desactivar" onclick="SGE.Adm.toggleParam(${p.id})"><i class="bi bi-arrow-repeat" aria-hidden="true"></i></button>
                  </div>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="modal-overlay" id="modal-param">
      <div class="modal modal-sm">
        <div class="modal-header">
          <span class="modal-title" id="param-modal-title"><i class="bi bi-gear me-1" aria-hidden="true"></i>Nuevo Parámetro</span>
          <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-grid cols-1">
            <div class="form-group">
              <label class="form-label">Tipo <span>*</span></label>
              <select class="form-control" id="p-tipo">
                <option>Impuesto</option><option>Descuento</option><option>Otro</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Nombre <span>*</span></label>
              <input class="form-control" id="p-nombre" placeholder="Ej: IVA Turismo">
            </div>
            <div class="form-group">
              <label class="form-label">Valor <span>*</span></label>
              <input class="form-control" id="p-valor" placeholder="Ej: 8 o 8%">
            </div>
            <div class="form-group">
              <label class="form-label">Descripción</label>
              <input class="form-control" id="p-desc" placeholder="Opcional">
            </div>
            <div class="form-group">
              <label class="form-label">Estado</label>
              <label class="switch-wrap" id="p-estado-wrap">
                <div class="switch on" id="p-estado-sw"></div>
                <span>Activo</span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" data-close-modal>Cancelar</button>
          <button type="button" class="btn btn-primary" onclick="SGE.Adm.saveParam()"><i class="bi bi-floppy me-1" aria-hidden="true"></i>Guardar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Tab: Vista General -->
  <div class="tab-panel" id="tab-overview">
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon navy stat-icon-bi"><i class="bi bi-person" aria-hidden="true"></i></div>
        <div class="stat-info">
          <div class="stat-val">${SGE.DB.usuarios.length}</div>
          <div class="stat-lbl">Usuarios Registrados</div>
          <div class="stat-change up">${SGE.DB.usuarios.filter(u=>u.estado==='Activo').length} activos</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green stat-icon-bi"><i class="bi bi-person-badge" aria-hidden="true"></i></div>
        <div class="stat-info">
          <div class="stat-val">${SGE.DB.empleados.length}</div>
          <div class="stat-lbl">Empleados Totales</div>
          <div class="stat-change up">${SGE.DB.empleados.filter(e=>e.estado==='Activo').length} activos</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon teal stat-icon-bi"><i class="bi bi-key" aria-hidden="true"></i></div>
        <div class="stat-info">
          <div class="stat-val">${SGE.DB.roles.length}</div>
          <div class="stat-lbl">Roles del Sistema</div>
          <div class="stat-change up">${SGE.DB.roles.filter(r=>r.estado==='Activo').length} activos</div>
        </div>
      </div>
    </div>

    <div class="responsive-grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title"><i class="bi bi-person me-1" aria-hidden="true"></i>Usuarios por Rol</span></div>
        <div class="card-body" style="padding:0;">
          <table><thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th></tr></thead><tbody>
            ${SGE.DB.usuarios.map(u=>`
            <tr>
              <td><div class="td-name">${u.nombre}</div><div class="td-sub">${u.usuario}</div></td>
              <td>${u.rol}</td>
              <td><span class="badge ${u.estado==='Activo'?'badge-active':'badge-inactive'}">${u.estado}</span></td>
            </tr>`).join('')}
          </tbody></table>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title"><i class="bi bi-diagram-3 me-1" aria-hidden="true"></i>Distribución por Área</span></div>
        <div class="card-body">
          ${SGE.DB.empleados.length === 0 ? '<p style="color:var(--text-muted);font-size:.88rem;">Sin empleados registrados.</p>' : [...new Set(SGE.DB.empleados.map(e=>e.area))].map(area=>{
            const count = SGE.DB.empleados.filter(e=>e.area===area).length;
            const pct = Math.round((count/SGE.DB.empleados.length)*100);
            return `<div style="margin-bottom:.9rem;">
              <div style="display:flex; justify-content:space-between; margin-bottom:.3rem; font-size:.82rem;">
                <span style="font-weight:600">${area}</span>
                <span style="color:var(--text-muted)">${count} personas</span>
              </div>
              <div style="height:8px; background:var(--border); border-radius:99px; overflow:hidden;">
                <div style="height:100%; width:${pct}%; background:linear-gradient(90deg,var(--navy),var(--teal)); border-radius:99px;"></div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:1.25rem;">
      <div class="card-header"><span class="card-title"><i class="bi bi-key me-1" aria-hidden="true"></i>Roles del sistema</span></div>
      <div class="card-body" style="padding:0;">
        <table><thead><tr><th>Rol</th><th>Descripción</th><th>Usuarios</th><th>Estado</th></tr></thead><tbody>
          ${SGE.DB.roles.map(r=>`<tr>
            <td class="td-name">${r.nombre}</td>
            <td style="color:var(--text-muted);font-size:.85rem;">${r.descripcion || '—'}</td>
            <td>${r.usuarios}</td>
            <td><span class="badge ${r.estado==='Activo'?'badge-active':'badge-inactive'}">${r.estado}</span></td>
          </tr>`).join('')}
        </tbody></table>
      </div>
    </div>
  </div>
</div>`;
});

/* Administrativo */
SGE.Adm = {
  editEmpresa: () => SGE.Modal.open('modal-empresa'),
  saveEmpresa: async () => {
    const ok = await SGE.Api.saveEmpresaApi();
    if (!ok) return;
    SGE.Modal.close('modal-empresa');
    SGE.Router.navigate('dashboard');
    setTimeout(() => SGE.Router.navigate('administrativo'), 50);
  },
  newParam: () => {
    window._paramEditId = null;
    document.getElementById('param-modal-title').innerHTML = '<i class="bi bi-gear me-1" aria-hidden="true"></i>Nuevo Parámetro';
    document.getElementById('p-tipo').value = 'Impuesto';
    document.getElementById('p-tipo').disabled = false;
    document.getElementById('p-nombre').value = '';
    document.getElementById('p-nombre').readOnly = false;
    document.getElementById('p-valor').value = '';
    document.getElementById('p-desc').value = '';
    const sw = document.getElementById('p-estado-sw');
    if (sw) sw.classList.add('on');
    SGE.Modal.open('modal-param');
  },
  editParam: (id) => {
    const p = SGE.DB.parametros.find(x => x.id === id);
    if (!p) return;
    window._paramEditId = id;
    document.getElementById('param-modal-title').innerHTML = '<i class="bi bi-gear me-1" aria-hidden="true"></i>Editar Parámetro';
    document.getElementById('p-tipo').value = p.tipo;
    document.getElementById('p-tipo').disabled = true;
    document.getElementById('p-nombre').value = p.nombre;
    document.getElementById('p-nombre').readOnly = true;
    document.getElementById('p-valor').value = p.valor.replace(/%$/, '');
    document.getElementById('p-desc').value = '';
    const sw = document.getElementById('p-estado-sw');
    if (sw) sw.classList.toggle('on', p.estado === 'Activo');
    SGE.Modal.open('modal-param');
  },
  toggleParam: async (id) => {
    const p = SGE.DB.parametros.find(x => x.id === id);
    if (!p) return;
    const raw = (p.valor || '').replace(/%$/, '');
    const activo = p.estado !== 'Activo';
    try {
      await SGE.Api.mutations.putParametro(id, { valor: raw, activo });
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show(activo ? 'Parámetro activado' : 'Parámetro desactivado');
      SGE.Router.navigate('dashboard');
      setTimeout(() => SGE.Router.navigate('administrativo'), 50);
    } catch (e) {
      SGE.Toast.show(e.message || 'Error', 'error');
    }
  },
  saveParam: async () => {
    const tipo = document.getElementById('p-tipo')?.value?.trim();
    const nombre = document.getElementById('p-nombre')?.value?.trim();
    let valor = document.getElementById('p-valor')?.value?.trim() || '';
    if (!tipo || !nombre || !valor) { SGE.Toast.show('Complete tipo, nombre y valor', 'error'); return; }
    if (tipo === 'Impuesto' || tipo === 'Descuento') {
      const num = parseFloat(String(valor).replace('%', '').replace(',', '.'));
      if (Number.isNaN(num) || num < 0 || num > 100) {
        SGE.Toast.show('El valor debe ser un porcentaje numérico entre 0 y 100', 'error'); return;
      }
    }
    if (tipo === 'Impuesto' && !valor.endsWith('%')) valor += '%';
    const activo = document.getElementById('p-estado-sw')?.classList.contains('on') ?? true;
    const desc = document.getElementById('p-desc')?.value?.trim() || null;
    try {
      if (window._paramEditId) {
        await SGE.Api.mutations.putParametro(window._paramEditId, { valor, activo });
      } else {
        await SGE.Api.mutations.postParametro({ tipo, nombre, valor, descripcion: desc, activo });
      }
      SGE.Modal.close('modal-param');
      window._paramEditId = null;
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show('Parámetro guardado');
      SGE.Router.navigate('dashboard');
      setTimeout(() => SGE.Router.navigate('administrativo'), 50);
    } catch (e) {
      SGE.Toast.show(e.message || 'Error', 'error');
    }
  },
};