/* SGE Punto Fresco - split module */
'use strict';

SGE.Router.register('proveedores', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Gestión de Proveedores</h2>
    <p>Registro y administración de proveedores de la empresa</p>
  </div>
  <div class="page-actions">
    <button type="button" class="btn btn-primary" data-modal="modal-proveedor"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Nuevo Proveedor</button>
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon"></span>
    <input class="search-input" placeholder="Buscar por nombre, identificación..." data-table="prov-table">
  </div>
  <select class="filter-select" data-table="prov-table" data-col="3">
    <option value="">Todos los estados</option>
    <option>Activo</option><option>Inactivo</option>
  </select>
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table id="prov-table">
        <thead><tr>
          <th>#</th><th>Empresa Proveedora</th><th>Identificación</th><th>Estado</th><th>Teléfono</th><th>Correo</th><th>Acciones</th>
        </tr></thead>
        <tbody>
          ${SGE.DB.proveedores.map(p=>`
          <tr>
            <td style="color:var(--text-muted)">${p.id}</td>
            <td>
              <div class="td-name">${p.nombre}</div>
              <div class="td-sub"><i class="bi bi-geo-alt me-1" aria-hidden="true"></i>${p.direccion}</div>
            </td>
            <td style="font-size:.82rem;">${p.identificacion}</td>
            <td><span class="badge ${p.estado==='Activo'?'badge-active':'badge-inactive'}">${p.estado}</span></td>
            <td><i class="bi bi-telephone me-1" aria-hidden="true"></i>${p.telefono}</td>
            <td style="font-size:.82rem;"><i class="bi bi-envelope me-1" aria-hidden="true"></i>${p.correo}</td>
            <td>
              <div class="flex gap-1">
                <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Prov.edit(${p.id})"><i class="bi bi-pencil" aria-hidden="true"></i></button>
                <button type="button" class="btn btn-ghost btn-sm btn-icon" title="${p.estado==='Activo'?'Desactivar':'Activar'}" onclick="SGE.Prov.toggleActivo(${p.id})"><i class="bi bi-arrow-repeat" aria-hidden="true"></i></button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div class="pagination">
    <span class="page-info">Mostrando ${SGE.DB.proveedores.length} de ${SGE.DB.proveedores.length} proveedores</span>
    <div class="page-btns">
      <button class="page-btn">‹</button>
      <button class="page-btn active">1</button>
      <button class="page-btn">›</button>
    </div>
  </div>
</div>

<!-- Modal Nuevo/Editar Proveedor -->
<div class="modal-overlay" id="modal-proveedor">
  <div class="modal">
    <div class="modal-header">
      <span class="modal-title" id="prov-modal-title"><i class="bi bi-truck me-1" aria-hidden="true"></i>Nuevo Proveedor</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-grid">
        <div class="form-group col-span-2">
          <label class="form-label">Nombre de la Empresa <span>*</span></label>
          <input class="form-control" id="prov-nombre" placeholder="Nombre o razón social">
        </div>
        <div class="form-group">
          <label class="form-label">Identificación <span>*</span></label>
          <input class="form-control" id="prov-id" placeholder="Cédula Jurídica">
        </div>
        <div class="form-group">
          <label class="form-label">Teléfono</label>
          <input class="form-control" id="prov-tel" placeholder="0000-0000">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Correo Electrónico</label>
          <input class="form-control" id="prov-email" type="email" placeholder="contacto@proveedor.com">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Dirección</label>
          <textarea class="form-control" id="prov-dir" placeholder="Provincia, cantón, dirección exacta" style="min-height:70px;"></textarea>
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Estado</label>
          <label class="switch-wrap">
            <div class="switch on"></div>
            <span>Activo</span>
          </label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button type="button" class="btn btn-primary" onclick="SGE.Prov.save()"><i class="bi bi-floppy me-1" aria-hidden="true"></i>Guardar</button>
    </div>
  </div>
</div>
`);

SGE.Prov = {
  edit: (id) => {
    window._provEditId = id;
    const p = SGE.DB.proveedores.find(x => x.id === id);
    if (!p) return;
    document.getElementById('prov-modal-title').innerHTML = `<i class="bi bi-pencil me-1" aria-hidden="true"></i>Editar Proveedor — ${p.nombre}`;
    document.getElementById('prov-nombre').value = p.nombre;
    document.getElementById('prov-id').value = p.identificacion;
    document.getElementById('prov-tel').value = p.telefono || '';
    document.getElementById('prov-email').value = p.correo || '';
    document.getElementById('prov-dir').value = p.direccion || '';
    const sw = document.querySelector('#modal-proveedor .switch');
    if (sw) sw.classList.toggle('on', p.estado === 'Activo');
    SGE.Modal.open('modal-proveedor');
  },
  toggleActivo: async (id) => {
    const p = SGE.DB.proveedores.find(x => x.id === id);
    if (!p) return;
    try {
      await SGE.Api.mutations.putProveedor(id, {
        nombre: p.nombre,
        identificacion: p.identificacion,
        telefono: p.telefono || null,
        correo: p.correo || null,
        direccion: p.direccion || null,
        activo: p.estado !== 'Activo'
      });
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show(p.estado === 'Activo' ? 'Proveedor desactivado' : 'Proveedor activado');
      SGE.Router.navigate('dashboard');
      setTimeout(() => SGE.Router.navigate('proveedores'), 50);
    } catch (e) {
      SGE.Toast.show(e.message || 'Error', 'error');
    }
  },
  save: async () => {
    const nombre = document.getElementById('prov-nombre')?.value.trim();
    const ident = document.getElementById('prov-id')?.value.trim();
    if (!nombre || !ident) { SGE.Toast.show('Nombre e identificación requeridos', 'error'); return; }
    if (!SGE.Validate.identificacion(ident)) {
      SGE.Toast.show('La identificación debe tener entre 9 y 12 dígitos', 'error'); return;
    }
    const provTel = document.getElementById('prov-tel')?.value;
    if (!SGE.Validate.telefono(provTel)) {
      SGE.Toast.show('El teléfono no es válido', 'error'); return;
    }
    const provMail = document.getElementById('prov-email')?.value?.trim();
    if (provMail && !SGE.Validate.email(provMail)) {
      SGE.Toast.show('El correo no es válido', 'error'); return;
    }
    const body = {
      nombre,
      identificacion: ident,
      telefono: document.getElementById('prov-tel')?.value || null,
      correo: document.getElementById('prov-email')?.value || null,
      direccion: document.getElementById('prov-dir')?.value || null,
      activo: document.querySelector('#modal-proveedor .switch')?.classList.contains('on') ?? true
    };
    try {
      if (window._provEditId) {
        await SGE.Api.mutations.putProveedor(window._provEditId, body);
      } else {
        await SGE.Api.mutations.postProveedor(body);
      }
      SGE.Modal.close('modal-proveedor');
      window._provEditId = null;
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show('Proveedor guardado');
      SGE.Router.navigate('dashboard');
      setTimeout(() => SGE.Router.navigate('proveedores'), 50);
    } catch (e) {
      SGE.Toast.show(e.message || 'Error', 'error');
    }
  }
};