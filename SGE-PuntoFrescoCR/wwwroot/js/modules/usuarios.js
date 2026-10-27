
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
  <select class="sort-select" data-table="usuarios-table" title="Ordenar">
    <option value="">Ordenar por...</option>
    <option value="1:asc:text">Nombre A → Z</option>
    <option value="1:desc:text">Nombre Z → A</option>
    <option value="0:asc:number">ID ascendente</option>
    <option value="0:desc:number">ID descendente</option>
    <option value="3:asc:text">Rol A → Z</option>
    <option value="5:desc:date">Último acceso más reciente</option>
    <option value="5:asc:date">Último acceso más antiguo</option>
  </select>
  <button type="button" class="btn btn-ghost btn-sm" onclick="SGE.resetFilters(this)"><i class="bi bi-x-circle me-1" aria-hidden="true"></i>Restablecer filtros</button>
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table id="usuarios-table">
        <thead><tr>
          <th>#</th><th>Nombre</th><th>Usuario</th><th>Rol</th><th>Estado</th><th>Último Acceso</th><th>Acciones</th>
        </tr></thead>
        <tbody>
          ${SGE.DB.usuarios.map(u=>{
          const esc = typeof SGE.Export?.escapeHtml === 'function' ? SGE.Export.escapeHtml : (s) => String(s ?? '');
          return `
          <tr>
            <td style="color:var(--text-muted)">${u.id}</td>
            <td>
              <div style="display:flex;align-items:center;gap:.65rem;">
                <div class="user-avatar" style="width:30px;height:30px;font-size:.72rem;">${esc(u.nombre.split(' ').map(n=>n[0]).join('').slice(0,2))}</div>
                <div>
                  <div class="td-name">${esc(u.nombre)}</div>
                  <div class="td-sub">${esc(u.correo)}</div>
                </div>
              </div>
            </td>
            <td><code style="background:var(--surface-alt);padding:2px 6px;border-radius:4px;font-size:.8rem;">${esc(u.usuario)}</code></td>
            <td><span class="badge badge-navy">${esc(u.rol)}</span></td>
            <td><span class="badge ${u.estado==='Activo'?'badge-active':'badge-inactive'}">${u.estado}</span></td>
            <td style="color:var(--text-muted); font-size:.82rem;">${u.ultimo_acceso ? SGE.fmt.date(u.ultimo_acceso) : '—'}</td>
            <td>
              <div class="flex gap-1">
                ${SGE.hasPerm('USUARIOS', 'editar') ? `<button type="button" class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Usu.edit(${u.id})"><i class="bi bi-pencil" aria-hidden="true"></i></button>` : ''}
                ${SGE.hasPerm('USUARIOS', 'editar') ? `<button type="button" class="btn btn-ghost btn-sm btn-icon" title="${u.estado==='Activo'?'Desactivar usuario':'Activar usuario'}" onclick="SGE.Usu.toggleActivo(${u.id})" aria-pressed="${u.estado==='Activo'}"><i class="bi ${u.estado==='Activo' ? 'bi-toggle-on text-success' : 'bi-toggle-off text-muted'}" aria-hidden="true"></i></button>` : ''}
              </div>
            </td>
          </tr>`;}).join('')}
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
        <div class="form-group col-span-2" id="u-pass-info">
          <div class="info-banner" style="background:rgba(93,210,188,.1);border:1px solid rgba(93,210,188,.3);border-radius:var(--radius-sm);padding:.75rem .9rem;font-size:.84rem;color:var(--navy);">
            <i class="bi bi-envelope-check me-1" aria-hidden="true"></i>
            Se generará una <strong>contraseña temporal</strong> y se enviará al correo del usuario. El administrador no verá ni almacena la contraseña.
          </div>
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
  /** Id del usuario con la sesión abierta. Se usa para impedir la autodesactivación. */
  yo: () => (typeof window.SGE_CURRENT_USER_ID === 'number' ? window.SGE_CURRENT_USER_ID : 0),

  /** ¿El operador tiene rol Administrador? Solo él puede reactivar cuentas. */
  soyAdmin: () => String(window.SGE_CURRENT_USER_ROL || '') === 'Administrador',

  openNew: () => {
    if (!SGE.hasPerm('USUARIOS', 'crear')) {
      SGE.Toast.show('No tiene permisos para crear usuarios', 'error');
      return;
    }
    window._usuEditId = null;
    SGE.FormErrors.limpiar('modal-usuario');

    const t = document.getElementById('u-modal-title');
    if (t) t.innerHTML = '<i class="bi bi-person" aria-hidden="true"></i>Nuevo Usuario';

    const passInfo = document.getElementById('u-pass-info');
    if (passInfo) passInfo.style.display = '';

    ['u-nombre', 'u-ident', 'u-usuario', 'u-email', 'u-puesto', 'u-tel', 'u-dir',
     'u-emerg-nombre', 'u-emerg-tel', 'u-alerg'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    document.getElementById('u-rol').value = '';
    document.getElementById('u-area').value = '';

    const sw = document.getElementById('u-estado-sw');
    if (sw) sw.classList.add('on');

    // Al crear, el interruptor de estado siempre está disponible.
    SGE.Usu._bloquearEstado(false, '');

    SGE.Modal.open('modal-usuario');
  },

  edit: (id) => {
    if (!SGE.hasPerm('USUARIOS', 'editar')) {
      SGE.Toast.show('No tiene permisos para editar usuarios', 'error');
      return;
    }
    const u = SGE.DB.usuarios.find((x) => x.id === id);
    if (!u) return;

    window._usuEditId = id;
    SGE.FormErrors.limpiar('modal-usuario');

    const esc = (v) => (typeof SGE.Export?.escapeHtml === 'function' ? SGE.Export.escapeHtml(v) : String(v ?? ''));
    document.getElementById('u-modal-title').innerHTML =
      `<i class="bi bi-pencil" aria-hidden="true"></i>Editar Usuario — ${esc(u.nombre)}`;

    const passInfo = document.getElementById('u-pass-info');
    if (passInfo) passInfo.style.display = 'none';

    document.getElementById('u-nombre').value = u.nombre;
    document.getElementById('u-ident').value = u.identificacion || '';
    document.getElementById('u-usuario').value = u.usuario;
    document.getElementById('u-email').value = u.correo;
    document.getElementById('u-rol').value = String(u.rol_id);
    document.getElementById('u-puesto').value = u.puesto || '';
    document.getElementById('u-tel').value = u.telefono || '';
    document.getElementById('u-dir').value = u.direccion || '';
    document.getElementById('u-area').value = u.empleado_area_id ? String(u.empleado_area_id) : '';
    document.getElementById('u-emerg-nombre').value = u.contacto_emergencia_nombre || '';
    document.getElementById('u-emerg-tel').value = u.contacto_emergencia_tel || '';
    document.getElementById('u-alerg').value = u.alergias || '';

    const sw = document.getElementById('u-estado-sw');
    if (sw) sw.classList.toggle('on', u.estado === 'Activo');

    /* Autodesactivación: el servidor la rechaza siempre, pero además se
       deshabilita el control aquí para que la persona no llegue a intentarlo
       y entienda de una vez por qué no puede. */
    if (id === SGE.Usu.yo()) {
      SGE.Usu._bloquearEstado(true, 'No puede cambiar el estado de su propio usuario.');
    } else if (u.estado !== 'Activo' && !SGE.Usu.soyAdmin()) {
      SGE.Usu._bloquearEstado(true, 'Solo un Administrador puede reactivar un usuario desactivado.');
    } else {
      SGE.Usu._bloquearEstado(false, '');
    }

    SGE.Modal.open('modal-usuario');
  },

  /** Habilita o bloquea el interruptor de estado y explica el motivo. */
  _bloquearEstado: (bloquear, motivo) => {
    const wrap = document.getElementById('u-estado-wrap');
    if (!wrap) return;

    wrap.classList.toggle('switch-wrap-disabled', !!bloquear);
    wrap.setAttribute('aria-disabled', bloquear ? 'true' : 'false');
    wrap.title = bloquear ? motivo : '';

    let nota = document.getElementById('u-estado-nota');
    if (bloquear) {
      if (!nota) {
        nota = document.createElement('p');
        nota.id = 'u-estado-nota';
        nota.className = 'form-hint';
        wrap.parentElement?.appendChild(nota);
      }
      nota.textContent = motivo;
    } else if (nota) {
      nota.remove();
    }
  },

  toggleActivo: async (id) => {
    if (!SGE.hasPerm('USUARIOS', 'editar')) {
      SGE.Toast.show('No tiene permisos para editar usuarios', 'error');
      return;
    }
    const u = SGE.DB.usuarios.find((x) => x.id === id);
    if (!u) return;

    const activar = u.estado !== 'Activo';

    /* Guardas previas: se avisa antes de abrir la confirmación, para no hacerle
       confirmar a la persona una acción que el servidor va a rechazar. */
    if (!activar && id === SGE.Usu.yo()) {
      SGE.Toast.show(
        'No puede desactivar su propio usuario. Solicite el cambio a otro Administrador.',
        'error');
      return;
    }

    if (activar && !SGE.Usu.soyAdmin()) {
      SGE.Toast.show('Solo un Administrador puede reactivar un usuario desactivado.', 'error');
      return;
    }

    const ok = await SGE.Confirm({
      title: activar ? 'Activar usuario' : 'Desactivar usuario',
      text: activar
        ? `¿Confirma activar al usuario ${u.nombre}? Podrá volver a ingresar al sistema.`
        : `¿Confirma desactivar al usuario ${u.nombre}? Su sesión se cerrará de inmediato.`,
      confirmText: activar ? 'Sí, activar' : 'Sí, desactivar'
    });
    if (!ok) return;

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
        activo: activar,
        areaId,
        contactoEmergenciaNombre: u.contacto_emergencia_nombre || null,
        contactoEmergenciaTel: u.contacto_emergencia_tel || null,
        alergiasMedicamentos: u.alergias || null
      });
      SGE.Toast.show(activar ? 'Usuario activado' : 'Usuario desactivado');
    } catch (e) {
      // Sin modal de por medio: el motivo se muestra tal como lo envió el servidor.
      SGE.Toast.show(e.message || 'No fue posible cambiar el estado del usuario.', 'error');
    }
  },

  /** Reglas de validación en el cliente, una por campo y con su propio mensaje. */
  _reglas: (v) => [
    { campo: 'u-nombre', valido: !!v.nombre,
      mensaje: 'El nombre completo es obligatorio.' },
    { campo: 'u-nombre', valido: !v.nombre || v.nombre.length >= 3,
      mensaje: 'El nombre completo debe tener al menos 3 caracteres.' },

    { campo: 'u-ident', valido: !!v.ident,
      mensaje: 'La identificación es obligatoria.' },
    { campo: 'u-ident', valido: !v.ident || /^[\d\s-]+$/.test(v.ident),
      mensaje: 'La identificación debe contener únicamente números y guiones.' },
    { campo: 'u-ident', valido: !v.ident || SGE.Validate.identificacion(v.ident),
      mensaje: `La identificación debe tener entre 9 y 12 dígitos (tiene ${(v.ident.match(/\d/g) || []).length}).` },

    { campo: 'u-usuario', valido: !!v.usuario,
      mensaje: 'El nombre de usuario es obligatorio.' },
    { campo: 'u-usuario', valido: !v.usuario || v.usuario.length >= 4,
      mensaje: 'El nombre de usuario debe tener al menos 4 caracteres.' },
    { campo: 'u-usuario', valido: !/\s/.test(v.usuario),
      mensaje: 'El nombre de usuario no puede contener espacios.' },

    { campo: 'u-email', valido: !!v.correo,
      mensaje: 'El correo electrónico es obligatorio.' },
    { campo: 'u-email', valido: !v.correo || SGE.Validate.email(v.correo),
      mensaje: 'El correo no tiene un formato válido (ejemplo: nombre@puntofresco.cr).' },

    { campo: 'u-rol', valido: v.rolId > 0,
      mensaje: 'Debe seleccionar un rol para el usuario.' },

    { campo: 'u-tel', valido: SGE.Validate.telefono(v.tel),
      mensaje: 'El teléfono debe tener entre 8 y 15 dígitos.' },
    { campo: 'u-emerg-tel', valido: SGE.Validate.telefono(v.emergTel),
      mensaje: 'El teléfono de emergencia debe tener entre 8 y 15 dígitos.' }
  ],

  save: async () => {
    const editId = window._usuEditId;

    if (editId && !SGE.hasPerm('USUARIOS', 'editar')) {
      SGE.Toast.show('No tiene permisos para editar usuarios', 'error');
      return;
    }
    if (!editId && !SGE.hasPerm('USUARIOS', 'crear')) {
      SGE.Toast.show('No tiene permisos para crear usuarios', 'error');
      return;
    }

    const leer = (id) => document.getElementById(id)?.value?.trim() || '';

    const v = {
      nombre: leer('u-nombre'),
      ident: leer('u-ident'),
      usuario: leer('u-usuario'),
      correo: leer('u-email'),
      rolId: parseInt(document.getElementById('u-rol')?.value || '0', 10),
      tel: leer('u-tel'),
      emergTel: leer('u-emerg-tel')
    };

    // Se detiene en el primer campo inválido y lo resalta dentro del modal.
    if (!SGE.FormErrors.validar('modal-usuario', SGE.Usu._reglas(v))) return;

    const activo = document.getElementById('u-estado-sw')?.classList.contains('on') ?? true;

    // Última barrera en el cliente contra la autodesactivación.
    if (editId && editId === SGE.Usu.yo() && !activo) {
      SGE.FormErrors.mostrar('u-estado-sw',
        'No puede desactivar su propio usuario. Solicite el cambio a otro Administrador.');
      return;
    }

    const areaSel = document.getElementById('u-area')?.value || '';
    const areaId = areaSel ? parseInt(areaSel, 10) : null;

    const body = {
      rolId: v.rolId,
      nombreCompleto: v.nombre,
      identificacion: v.ident,
      nombreUsuario: v.usuario,
      correo: v.correo,
      puesto: leer('u-puesto') || null,
      telefono: v.tel || null,
      direccion: leer('u-dir') || null,
      activo,
      areaId: areaId && areaId > 0 ? areaId : null,
      contactoEmergenciaNombre: leer('u-emerg-nombre') || null,
      contactoEmergenciaTel: v.emergTel || null,
      alergiasMedicamentos: leer('u-alerg') || null
    };

    const boton = document.querySelector('#modal-usuario .modal-footer .btn-primary');
    if (boton) boton.disabled = true;

    try {
      if (editId) {
        await SGE.Api.mutations.putUsuario(editId, body);
      } else {
        await SGE.Api.mutations.postUsuario(body);
      }

      SGE.Modal.close('modal-usuario');
      window._usuEditId = null;
      SGE.FormErrors.limpiar('modal-usuario');

      SGE.Toast.show(editId
        ? 'Usuario guardado'
        : 'Usuario creado. Se envió la contraseña temporal al correo registrado.');
    } catch (e) {
      /* El modal permanece abierto y el error se pinta sobre el campo culpable:
         la persona corrige y reintenta sin volver a escribir todo. */
      SGE.FormErrors.manejar(e, 'modal-usuario', 'No fue posible guardar el usuario.');
    } finally {
      if (boton) boton.disabled = false;
    }
  }
};
