/* SGE Punto Fresco - split module */
'use strict';

SGE.Router.register('roles', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Gestión de Roles</h2>
    <p>Defina niveles de acceso y permisos para cada rol del sistema</p>
  </div>
  <div class="page-actions">
    ${SGE.hasPerm('ROLES', 'crear') ? '<button type="button" class="btn btn-primary" onclick="SGE.Roles.openNew()"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Nuevo Rol</button>' : ''}
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon"></span>
    <input class="search-input" placeholder="Buscar rol..." data-table="roles-table">
  </div>
  <select class="filter-select" data-table="roles-table" data-col="3">
    <option value="">Todos los estados</option>
    <option>Activo</option><option>Inactivo</option>
  </select>
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table id="roles-table">
        <thead><tr>
          <th>#</th><th>Nombre del Rol</th><th>Descripción</th><th>Estado</th><th>Usuarios</th><th>Acciones</th>
        </tr></thead>
        <tbody>
          ${SGE.DB.roles.map(r=>`
          <tr>
            <td style="color:var(--text-muted)">${r.id}</td>
            <td class="td-name">${r.nombre}</td>
            <td style="color:var(--text-secondary)">${r.descripcion}</td>
            <td><span class="badge ${r.estado==='Activo'?'badge-active':'badge-inactive'}">${r.estado}</span></td>
            <td><span class="badge badge-navy"><i class="bi bi-person me-1" aria-hidden="true"></i>${r.usuarios}</span></td>
            <td>
              <div class="flex gap-1">
                ${SGE.hasPerm('ROLES', 'editar') ? `<button type="button" class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Roles.edit(${r.id})"><i class="bi bi-pencil" aria-hidden="true"></i></button><button type="button" class="btn btn-ghost btn-sm btn-icon" title="Permisos" onclick="SGE.Roles.perms(${r.id})"><i class="bi bi-key" aria-hidden="true"></i></button><button type="button" class="btn btn-ghost btn-sm btn-icon" title="Activar / Desactivar" onclick="SGE.Roles.toggleActivo(${r.id})"><i class="bi bi-arrow-repeat" aria-hidden="true"></i></button>` : ''}
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div class="pagination">
    <span class="page-info">Mostrando ${SGE.DB.roles.length} de ${SGE.DB.roles.length} roles</span>
    <div class="page-btns">
      <button type="button" class="page-btn" aria-label="Anterior"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
      <button type="button" class="page-btn active">1</button>
      <button type="button" class="page-btn" aria-label="Siguiente"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
    </div>
  </div>
</div>

<!-- Modal Nuevo/Editar Rol -->
<div class="modal-overlay" id="modal-rol">
  <div class="modal modal-sm">
    <div class="modal-header">
      <span class="modal-title" id="rol-modal-title"><i class="bi bi-key me-1" aria-hidden="true"></i>Nuevo Rol</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-grid cols-1">
        <div class="form-group">
          <label class="form-label">Nombre del Rol <span>*</span></label>
          <input class="form-control" id="rol-nombre" placeholder="Ej: Supervisor Ventas">
        </div>
        <div class="form-group">
          <label class="form-label">Descripción</label>
          <textarea class="form-control" id="rol-desc" placeholder="Describa las responsabilidades del rol..." style="min-height:80px;"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Estado</label>
          <label class="switch-wrap">
            <div class="switch on"></div>
            <span>Activo</span>
          </label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button type="button" class="btn btn-primary" onclick="SGE.Roles.save()"><i class="bi bi-floppy me-1" aria-hidden="true"></i>Guardar Rol</button>
    </div>
  </div>
</div>

<!-- Modal Permisos -->
<div class="modal-overlay" id="modal-permisos">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title"><i class="bi bi-key me-1" aria-hidden="true"></i>Asignar Permisos — <span id="perm-rol-name"></span></span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <p style="font-size:.84rem; color:var(--text-muted); margin-bottom:1rem;">
        Seleccione los módulos y acciones a los que tendrá acceso este rol.
      </p>
      <div class="table-wrap">
        <table class="perm-table">
          <thead><tr>
            <th>Módulo</th><th>Ver</th><th>Crear</th><th>Editar</th><th>Eliminar</th><th>Exportar</th>
          </tr></thead>
          <tbody id="perm-body"></tbody>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button type="button" class="btn btn-primary" onclick="SGE.Roles.savePermisos()"><i class="bi bi-floppy me-1" aria-hidden="true"></i>Guardar Permisos</button>
    </div>
  </div>
</div>
`);

SGE.Roles = {
  openNew: () => {
    if (!SGE.hasPerm('ROLES', 'crear')) { SGE.Toast.show('No tiene permiso para crear roles', 'error'); return; }
    window._rolEditId = null;
    const t = document.getElementById('rol-modal-title');
    if (t) t.innerHTML = '<i class="bi bi-key me-1" aria-hidden="true"></i>Nuevo Rol';
    document.getElementById('rol-nombre').value = '';
    document.getElementById('rol-desc').value = '';
    const sw = document.querySelector('#modal-rol .switch');
    if (sw) sw.classList.add('on');
    SGE.Modal.open('modal-rol');
  },
  toggleActivo: async (id) => {
    if (!SGE.hasPerm('ROLES', 'editar')) { SGE.Toast.show('No tiene permiso para editar roles', 'error'); return; }
    const rol = SGE.DB.roles.find(r => r.id === id);
    if (!rol) return;
    const activo = rol.estado !== 'Activo';
    try {
      await SGE.Api.mutations.putRol(id, { nombre: rol.nombre, descripcion: rol.descripcion || '', activo });
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show(activo ? 'Rol activado' : 'Rol desactivado');
      SGE.Router.navigate('dashboard');
      setTimeout(() => SGE.Router.navigate('roles'), 50);
    } catch (e) {
      SGE.Toast.show(e.message || 'Error', 'error');
    }
  },
  edit: (id) => {
    if (!SGE.hasPerm('ROLES', 'editar')) { SGE.Toast.show('No tiene permiso para editar roles', 'error'); return; }
    window._rolEditId = id;
    const rol = SGE.DB.roles.find(r => r.id === id);
    if (!rol) return;
    document.getElementById('rol-modal-title').innerHTML = `<i class="bi bi-key me-1" aria-hidden="true"></i>Editar Rol — ${typeof SGE.Export?.escapeHtml === 'function' ? SGE.Export.escapeHtml(rol.nombre) : rol.nombre}`;
    document.getElementById('rol-nombre').value = rol.nombre;
    document.getElementById('rol-desc').value = rol.descripcion || '';
    const sw = document.querySelector('#modal-rol .switch');
    if (sw) sw.classList.toggle('on', rol.estado === 'Activo');
    SGE.Modal.open('modal-rol');
  },
  perms: async (id) => {
    if (!SGE.hasPerm('ROLES', 'editar')) { SGE.Toast.show('No tiene permiso para editar permisos', 'error'); return; }
    const rol = SGE.DB.roles.find(r => r.id === id);
    document.getElementById('perm-rol-name').textContent = rol?.nombre || '';
    window._permRolId = id;
    try {
      const permisos = await SGE.Api.mutations.getPermisosRol(id);
      const mods = SGE.DB.modulos || [];
      const tbody = document.getElementById('perm-body');
      const pmap = Object.fromEntries(permisos.map(p => [p.moduloId, p]));
      tbody.innerHTML = mods.map(m => {
        const p = pmap[m.id] || {};
        return `<tr data-mid="${m.id}">
          <td style="font-weight:600">${m.nombre}</td>
          <td><input type="checkbox" class="perm-v" ${p.puedeVer ? 'checked' : ''}></td>
          <td><input type="checkbox" class="perm-c" ${p.puedeCrear ? 'checked' : ''}></td>
          <td><input type="checkbox" class="perm-e" ${p.puedeEditar ? 'checked' : ''}></td>
          <td><input type="checkbox" class="perm-x" ${p.puedeElim ? 'checked' : ''}></td>
          <td><input type="checkbox" class="perm-p" ${p.puedeExport ? 'checked' : ''}></td>
        </tr>`;
      }).join('');
      SGE.Modal.open('modal-permisos');
    } catch (e) {
      SGE.Toast.show(e.message || 'Error al cargar permisos', 'error');
    }
  },
  savePermisos: async () => {
    const rid = window._permRolId;
    if (!rid) return;
    const rows = [...document.querySelectorAll('#perm-body tr')].map(tr => ({
      moduloId: parseInt(tr.dataset.mid, 10),
      puedeVer: tr.querySelector('.perm-v')?.checked || false,
      puedeCrear: tr.querySelector('.perm-c')?.checked || false,
      puedeEditar: tr.querySelector('.perm-e')?.checked || false,
      puedeElim: tr.querySelector('.perm-x')?.checked || false,
      puedeExport: tr.querySelector('.perm-p')?.checked || false
    }));
    try {
      await SGE.Api.mutations.putPermisosRol(rid, rows);
      SGE.Modal.close('modal-permisos');
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show('Permisos actualizados');
    } catch (e) {
      SGE.Toast.show(e.message || 'Error', 'error');
    }
  },
  save: async () => {
    const nombre = document.getElementById('rol-nombre')?.value.trim();
    if (!nombre) { SGE.Toast.show('Ingrese el nombre del rol', 'error'); return; }
    const desc = document.getElementById('rol-desc')?.value || '';
    const sw = document.querySelector('#modal-rol .switch');
    const activo = sw?.classList.contains('on') ?? true;
    try {
      if (window._rolEditId) {
        await SGE.Api.mutations.putRol(window._rolEditId, { nombre, descripcion: desc, activo });
      } else {
        await SGE.Api.mutations.postRol({ nombre, descripcion: desc });
      }
      SGE.Modal.close('modal-rol');
      window._rolEditId = null;
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show('Rol guardado correctamente');
      SGE.Router.navigate('dashboard');
      setTimeout(() => SGE.Router.navigate('roles'), 50);
    } catch (e) {
      SGE.Toast.show(e.message || 'Error', 'error');
    }
  },
};