
'use strict';

SGE.Router.register('usuarios', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Gestión de Usuarios</h2>
    <p>Registro y control de acceso de usuarios al sistema</p>
  </div>
  <div class="page-actions">
    ${SGE.hasPerm('USUARIOS', 'crear') ? '<button type="button" class="btn btn-primary" onclick="SGE.Usu.openNew()"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Nuevo Usuario</button>' : ''}
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon"></span>
    <input class="search-input" placeholder="Buscar usuario..." data-table="usuarios-table">
  </div>
  <select class="filter-select" data-table="usuarios-table" data-col="3">
    <option value="">Todos los roles</option>
    ${[...new Set(SGE.DB.usuarios.map(u=>u.rol))].map(r=>`<option>${r}</option>`).join('')}
  </select>
  <select class="filter-select" data-table="usuarios-table" data-col="4">
    <option value="">Todos los estados</option>
    <option>Activo</option><option>Inactivo</option>
  </select>
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table id="usuarios-table">
        <thead><tr>
          <th>#</th><th>Nombre</th><th>Usuario</th><th>Rol</th><th>Estado</th><th>Último Acceso</th><th>Acciones</th>
        </tr></thead>
        <tbody>
          ${SGE.DB.usuarios.map(u=>`
          <tr>
            <td style="color:var(--text-muted)">${u.id}</td>
            <td>
              <div style="display:flex;align-items:center;gap:.65rem;">
                <div class="user-avatar" style="width:30px;height:30px;font-size:.72rem;">${u.nombre.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                <div>
                  <div class="td-name">${u.nombre}</div>
                  <div class="td-sub">${u.correo}</div>
                </div>
              </div>
            </td>
            <td><code style="background:var(--surface-alt);padding:2px 6px;border-radius:4px;font-size:.8rem;">${u.usuario}</code></td>
            <td><span class="badge badge-navy">${u.rol}</span></td>
            <td><span class="badge ${u.estado==='Activo'?'badge-active':'badge-inactive'}">${u.estado}</span></td>
            <td style="color:var(--text-muted); font-size:.82rem;">${u.ultimo_acceso ? SGE.fmt.date(u.ultimo_acceso) : '—'}</td>
            <td>
              <div class="flex gap-1">
                ${SGE.hasPerm('USUARIOS', 'editar') ? `<button type="button" class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Usu.edit(${u.id})"><i class="bi bi-pencil" aria-hidden="true"></i></button>` : ''}
                <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Restablecer contraseña" onclick="SGE.Toast.show('Use Recuperar contraseña en la pantalla de inicio de sesión con su correo','info')"><i class="bi bi-key" aria-hidden="true"></i></button>
                ${SGE.hasPerm('USUARIOS', 'editar') ? `<button type="button" class="btn btn-ghost btn-sm btn-icon" title="${u.estado==='Activo'?'Desactivar':'Activar'}" onclick="SGE.Usu.toggleActivo(${u.id})"><i class="bi bi-arrow-repeat" aria-hidden="true"></i></button>` : ''}
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div class="pagination">
    <span class="page-info">Mostrando ${SGE.DB.usuarios.length} de ${SGE.DB.usuarios.length} usuarios</span>
    <div class="page-btns">
      <button type="button" class="page-btn" aria-label="Anterior"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
      <button type="button" class="page-btn active">1</button>
      <button type="button" class="page-btn" aria-label="Siguiente"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
    </div>
  </div>
</div>

<!-- Modal Nuevo Usuario -->
<div class="modal-overlay" id="modal-usuario">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title" id="u-modal-title"><i class="bi bi-person me-1" aria-hidden="true"></i>Nuevo Usuario</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-grid">
        <div class="form-group col-span-2">
          <label class="form-label">Nombre Completo <span>*</span></label>
          <input class="form-control" id="u-nombre" placeholder="Nombre y apellidos">
        </div>
        <div class="form-group">
          <label class="form-label">Identificación <span>*</span></label>
          <input class="form-control" id="u-ident" placeholder="1-0000-0000">
        </div>
        <div class="form-group">
          <label class="form-label">Nombre de Usuario <span>*</span></label>
          <input class="form-control" id="u-usuario" placeholder="usuario.apellido">
        </div>
        <div class="form-group">
          <label class="form-label">Correo Electrónico <span>*</span></label>
          <input class="form-control" id="u-email" type="email" placeholder="correo@puntofresco.cr">
        </div>
        <div class="form-group">
          <label class="form-label">Rol <span>*</span></label>
          <select class="form-control" id="u-rol">
            <option value="">Seleccione un rol...</option>
            ${SGE.DB.roles.filter(r=>r.estado==='Activo').map(r=>`<option value="${r.id}">${r.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Contraseña <span>*</span></label>
          <input class="form-control" id="u-pass" type="password" placeholder="Mínimo 8 caracteres">
        </div>
        <div class="form-group">
          <label class="form-label">Puesto</label>
          <input class="form-control" id="u-puesto" placeholder="Cargo del empleado">
        </div>
        <div class="form-group">
          <label class="form-label">Teléfono</label>
          <input class="form-control" id="u-tel" placeholder="0000-0000">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Dirección</label>
          <input class="form-control" id="u-dir" placeholder="Provincia, cantón, distrito">
        </div>
        <div class="form-divider-label col-span-2">Ficha empleado (RRHH) — opcional</div>
        <div class="form-group col-span-2">
          <label class="form-label">Área / Departamento</label>
          <select class="form-control" id="u-area">
            <option value="">— Sin vincular a empleado —</option>
            ${(SGE.DB.areas || []).map(a=>`<option value="${a.id}">${a.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Contacto emergencia</label>
          <input class="form-control" id="u-emerg-nombre" placeholder="Nombre">
        </div>
        <div class="form-group">
          <label class="form-label">Tel. emergencia</label>
          <input class="form-control" id="u-emerg-tel" placeholder="0000-0000">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Alergias a medicamentos</label>
          <input class="form-control" id="u-alerg" placeholder="Ninguna / detalle">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Estado</label>
          <label class="switch-wrap" id="u-estado-wrap">
            <div class="switch on" id="u-estado-sw"></div>
            <span>Activo</span>
          </label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button type="button" class="btn btn-primary" onclick="SGE.Usu.save()"><i class="bi bi-floppy me-1" aria-hidden="true"></i>Guardar</button>
    </div>
  </div>
</div>
`);

SGE.Usu = {
  openNew: () => {
    if (!SGE.hasPerm('USUARIOS', 'crear')) { SGE.Toast.show('No tiene permisos para crear usuarios', 'error'); return; }
    window._usuEditId = null;
    const t = document.getElementById('u-modal-title');
    if (t) t.innerHTML = '<i class="bi bi-person me-1" aria-hidden="true"></i>Nuevo Usuario';
    ['u-nombre','u-ident','u-usuario','u-email','u-pass','u-puesto','u-tel','u-dir','u-emerg-nombre','u-emerg-tel','u-alerg'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.getElementById('u-rol').value = '';
    document.getElementById('u-area').value = '';
    const sw = document.getElementById('u-estado-sw');
    if (sw) sw.classList.add('on');
    SGE.Modal.open('modal-usuario');
  },
  edit: (id) => {
    if (!SGE.hasPerm('USUARIOS', 'editar')) { SGE.Toast.show('No tiene permisos para editar usuarios', 'error'); return; }
    const u = SGE.DB.usuarios.find(x => x.id === id);
    if (!u) return;
    window._usuEditId = id;
    document.getElementById('u-modal-title').innerHTML = `<i class="bi bi-pencil me-1" aria-hidden="true"></i>Editar Usuario — ${u.nombre}`;
    document.getElementById('u-nombre').value = u.nombre;
    document.getElementById('u-ident').value = u.identificacion || '';
    document.getElementById('u-usuario').value = u.usuario;
    document.getElementById('u-email').value = u.correo;
    document.getElementById('u-rol').value = String(u.rol_id);
    document.getElementById('u-pass').value = '';
    document.getElementById('u-puesto').value = u.puesto || '';
    document.getElementById('u-tel').value = u.telefono || '';
    document.getElementById('u-dir').value = u.direccion || '';
    document.getElementById('u-area').value = u.empleado_area_id ? String(u.empleado_area_id) : '';
    document.getElementById('u-emerg-nombre').value = u.contacto_emergencia_nombre || '';
    document.getElementById('u-emerg-tel').value = u.contacto_emergencia_tel || '';
    document.getElementById('u-alerg').value = u.alergias || '';
    const sw = document.getElementById('u-estado-sw');
    if (sw) sw.classList.toggle('on', u.estado === 'Activo');
    SGE.Modal.open('modal-usuario');
  },
  toggleActivo: async (id) => {
    if (!SGE.hasPerm('USUARIOS', 'editar')) { SGE.Toast.show('No tiene permisos para editar usuarios', 'error'); return; }
    const u = SGE.DB.usuarios.find(x => x.id === id);
    if (!u) return;
    const activo = u.estado !== 'Activo';
    const areaId = u.empleado_area_id && u.empleado_area_id > 0 ? u.empleado_area_id : null;
    try {
      await SGE.Api.mutations.putUsuario(id, {
        rolId: u.rol_id,
        nombreCompleto: u.nombre,
        identificacion: u.identificacion,
        nombreUsuario: u.usuario,
        correo: u.correo,
        puesto: u.puesto || null,
        telefono: u.telefono || null,
        direccion: u.direccion || null,
        activo,
        areaId: areaId && areaId > 0 ? areaId : null,
        contactoEmergenciaNombre: u.contacto_emergencia_nombre || null,
        contactoEmergenciaTel: u.contacto_emergencia_tel || null,
        alergiasMedicamentos: u.alergias || null
      });
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show(activo ? 'Usuario activado' : 'Usuario desactivado');
      SGE.Router.navigate('dashboard');
      setTimeout(() => SGE.Router.navigate('usuarios'), 50);
    } catch (e) {
      SGE.Toast.show(e.message || 'Error', 'error');
    }
  },
  save: async () => {
    if (window._usuEditId && !SGE.hasPerm('USUARIOS', 'editar')) { SGE.Toast.show('No tiene permisos para editar usuarios', 'error'); return; }
    if (!window._usuEditId && !SGE.hasPerm('USUARIOS', 'crear')) { SGE.Toast.show('No tiene permisos para crear usuarios', 'error'); return; }
    const nombre = document.getElementById('u-nombre')?.value.trim();
    const ident = document.getElementById('u-ident')?.value.trim();
    const usuario = document.getElementById('u-usuario')?.value.trim();
    const correo = document.getElementById('u-email')?.value.trim();
    const rolId = parseInt(document.getElementById('u-rol')?.value || '0', 10);
    const pass = document.getElementById('u-pass')?.value || '';
    const areaSel = document.getElementById('u-area')?.value || '';
    const areaId = areaSel ? parseInt(areaSel, 10) : null;
    if (!nombre || !ident || !usuario || !correo || !rolId) {
      SGE.Toast.show('Complete los campos obligatorios', 'error'); return;
    }
    if (!SGE.Validate.identificacion(ident)) {
      SGE.Toast.show('La identificación debe tener entre 9 y 12 dígitos', 'error'); return;
    }
    if (!SGE.Validate.email(correo)) {
      SGE.Toast.show('El correo electrónico no es válido', 'error'); return;
    }
    const telRaw = document.getElementById('u-tel')?.value;
    if (!SGE.Validate.telefono(telRaw)) {
      SGE.Toast.show('El teléfono debe tener entre 8 y 15 dígitos', 'error'); return;
    }
    const emergTel = document.getElementById('u-emerg-tel')?.value?.trim();
    if (emergTel && !SGE.Validate.telefono(emergTel)) {
      SGE.Toast.show('El teléfono de emergencia no es válido', 'error'); return;
    }
    if (!window._usuEditId && pass.length < 4) {
      SGE.Toast.show('Indique una contraseña', 'error'); return;
    }
    const hr = {
      areaId: areaId && areaId > 0 ? areaId : null,
      contactoEmergenciaNombre: document.getElementById('u-emerg-nombre')?.value?.trim() || null,
      contactoEmergenciaTel: document.getElementById('u-emerg-tel')?.value?.trim() || null,
      alergiasMedicamentos: document.getElementById('u-alerg')?.value?.trim() || null
    };
    const body = {
      rolId,
      nombreCompleto: nombre,
      identificacion: ident,
      nombreUsuario: usuario,
      correo,
      password: pass,
      puesto: document.getElementById('u-puesto')?.value || null,
      telefono: document.getElementById('u-tel')?.value || null,
      direccion: document.getElementById('u-dir')?.value || null,
      activo: document.getElementById('u-estado-sw')?.classList.contains('on') ?? true,
      ...hr
    };
    try {
      if (window._usuEditId) {
        const payload = {
          rolId,
          nombreCompleto: nombre,
          identificacion: ident,
          nombreUsuario: usuario,
          correo,
          puesto: body.puesto,
          telefono: body.telefono,
          direccion: body.direccion,
          activo: body.activo,
          ...hr
        };
        if (pass) payload.password = pass;
        await SGE.Api.mutations.putUsuario(window._usuEditId, payload);
      } else {
        await SGE.Api.mutations.postUsuario(body);
      }
      SGE.Modal.close('modal-usuario');
      window._usuEditId = null;
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show('Usuario guardado');
      SGE.Router.navigate('dashboard');
      setTimeout(() => SGE.Router.navigate('usuarios'), 50);
    } catch (e) {
      SGE.Toast.show(e.message || 'Error', 'error');
    }
  }
};