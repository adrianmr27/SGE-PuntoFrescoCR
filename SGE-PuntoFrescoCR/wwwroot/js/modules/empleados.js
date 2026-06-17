/* SGE Punto Fresco - split module */
'use strict';

SGE.Router.register('empleados', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Gestión de Empleados</h2>
    <p>Registro, consulta y administración del personal de la empresa</p>
  </div>
  <div class="page-actions">
    <button type="button" class="btn btn-outline" onclick="SGE.Router.navigate('empleados-stats')"><i class="bi bi-pie-chart me-1" aria-hidden="true"></i>Distribución</button>
    <button type="button" class="btn btn-primary" data-modal="modal-empleado"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Nuevo Empleado</button>
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon"></span>
    <input class="search-input" placeholder="Buscar por nombre, cédula o puesto..." data-table="empleados-table">
  </div>
  <select class="filter-select" data-table="empleados-table" data-col="4">
    <option value="">Todas las áreas</option>
    ${[...new Set(SGE.DB.empleados.map(e => e.area))].map(a => `<option>${a}</option>`).join('')}
  </select>
  <select class="filter-select" data-table="empleados-table" data-col="5">
    <option value="">Todos los estados</option>
    <option>Activo</option><option>Inactivo</option>
  </select>
  <select class="sort-select" data-table="empleados-table" title="Ordenar">
    <option value="">Ordenar por...</option>
    <option value="1:asc:text">Nombre A → Z</option>
    <option value="1:desc:text">Nombre Z → A</option>
    <option value="0:asc:number">ID ascendente</option>
    <option value="0:desc:number">ID descendente</option>
    <option value="4:asc:text">Área A → Z</option>
    <option value="3:asc:text">Puesto A → Z</option>
  </select>
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table id="empleados-table">
        <thead><tr>
          <th>#</th><th>Empleado</th><th>Identificación</th><th>Puesto</th><th>Área</th><th>Estado</th><th>Acciones</th>
        </tr></thead>
        <tbody>
          ${SGE.DB.empleados.map(emp => `
          <tr>
            <td style="color:var(--text-muted)">${emp.id}</td>
            <td>
              <div style="display:flex;align-items:center;gap:.65rem;">
                <div class="user-avatar" style="width:32px;height:32px;font-size:.75rem;">${emp.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                <div>
                  <div class="td-name">${emp.nombre}</div>
                  <div class="td-sub">${emp.correo}</div>
                </div>
              </div>
            </td>
            <td style="font-size:.82rem;">${emp.identificacion}</td>
            <td>${emp.puesto}</td>
            <td><span class="badge badge-info">${emp.area}</span></td>
            <td><span class="badge ${emp.estado === 'Activo' ? 'badge-active' : 'badge-inactive'}">${emp.estado}</span></td>
            <td>
              <div class="flex gap-1">
                <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Ver detalle" onclick="SGE.Emp.view(${emp.id})"><i class="bi bi-eye" aria-hidden="true"></i></button>
                <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Emp.edit(${emp.id})"><i class="bi bi-pencil" aria-hidden="true"></i></button>
                <button type="button" class="btn btn-ghost btn-sm btn-icon" title="${emp.estado === 'Activo' ? 'Desactivar' : 'Activar'}" onclick="SGE.Emp.toggleActivo(${emp.id})"><i class="bi bi-arrow-repeat" aria-hidden="true"></i></button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div class="pagination">
    <span class="page-info">Mostrando ${SGE.DB.empleados.length} de ${SGE.DB.empleados.length} empleados</span>
    <div class="page-btns">
      <button class="page-btn">‹</button>
      <button class="page-btn active">1</button>
      <button class="page-btn">›</button>
    </div>
  </div>
</div>

<!-- Modal Nuevo/Editar Empleado -->
<div class="modal-overlay" id="modal-empleado">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title" id="emp-modal-title"><i class="bi bi-person-badge me-1" aria-hidden="true"></i>Nuevo Empleado</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-grid">
        <div class="form-group col-span-2">
          <label class="form-label">Nombre Completo <span>*</span></label>
          <input class="form-control" id="emp-nombre" placeholder="Nombre y apellidos">
        </div>
        <div class="form-group">
          <label class="form-label">Identificación <span>*</span></label>
          <input class="form-control" id="emp-id" placeholder="1-0000-0000">
        </div>
        <div class="form-group">
          <label class="form-label">Puesto <span>*</span></label>
          <input class="form-control" id="emp-puesto" placeholder="Cargo">
        </div>
        <div class="form-group">
          <label class="form-label">Área / Departamento</label>
          <select class="form-control" id="emp-area">
            ${(SGE.DB.areas || []).map(a => `<option value="${a.id}">${a.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Teléfono</label>
          <input class="form-control" id="emp-tel" placeholder="0000-0000">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Correo Electrónico</label>
          <input class="form-control" id="emp-email" type="email" placeholder="correo@puntofresco.cr">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Dirección</label>
          <input class="form-control" id="emp-dir" placeholder="Provincia, cantón, distrito">
        </div>
        <div class="form-divider-label">Información de Emergencia</div>
        <div class="form-group">
          <label class="form-label">Contacto de Emergencia</label>
          <input class="form-control" id="emp-emerg-nombre" placeholder="Nombre del contacto">
        </div>
        <div class="form-group">
          <label class="form-label">Teléfono de Emergencia</label>
          <input class="form-control" id="emp-emerg-tel" placeholder="0000-0000">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Alergias a Medicamentos</label>
          <input class="form-control" id="emp-alerg" placeholder="Ninguna / Descripción de alergias">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Padecimientos / Enfermedades</label>
          <textarea class="form-control" id="emp-pad" placeholder="Ninguno / Descripción" style="min-height:60px;"></textarea>
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
      <button type="button" class="btn btn-primary" onclick="SGE.Emp.save()"><i class="bi bi-floppy me-1" aria-hidden="true"></i>Guardar</button>
    </div>
  </div>
</div>

<!-- Modal Ver Detalle Empleado -->
<div class="modal-overlay" id="modal-emp-detail">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title"><i class="bi bi-person-lines-fill me-1" aria-hidden="true"></i>Detalle del Empleado</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body" id="emp-detail-body">
      <!-- Cargado dinámicamente -->
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cerrar</button>
      <button type="button" class="btn btn-primary" onclick="SGE.Emp.editFromDetail()"><i class="bi bi-pencil me-1" aria-hidden="true"></i>Editar</button>
    </div>
  </div>
</div>
`);

SGE.Router.register('empleados-stats', () => {
    const emps = SGE.DB.empleados || [];
    const total = Math.max(emps.length, 1);
    const byArea = [...new Set(emps.map(e => e.area))].map(area => ({
        key: area,
        count: emps.filter(e => e.area === area).length
    })).sort((a, b) => b.count - a.count);
    const byPuesto = [...new Set(emps.map(e => e.puesto))].map(puesto => ({
        key: puesto,
        count: emps.filter(e => e.puesto === puesto).length
    })).sort((a, b) => b.count - a.count);
    const bar = (count) => {
        const pct = Math.round((count / total) * 100);
        return `<div style="height:8px;background:var(--border);border-radius:99px;overflow:hidden;">
      <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--navy),var(--teal));border-radius:99px;"></div>
    </div>`;
    };
    return `
<div class="page-header">
  <div class="page-title">
    <h2>Distribución del personal</h2>
    <p>Personal por área y por puesto (EMP-002)</p>
  </div>
  <div class="page-actions">
    <button type="button" class="btn btn-outline" onclick="SGE.Router.navigate('empleados')"><i class="bi bi-arrow-left me-1" aria-hidden="true"></i>Volver a empleados</button>
  </div>
</div>
<div class="responsive-grid-2">
  <div class="card">
    <div class="card-header"><span class="card-title">Por área</span></div>
    <div class="card-body">
      ${emps.length === 0 ? '<p style="color:var(--text-muted);font-size:.88rem;">Sin datos.</p>' : byArea.map(a => `
        <div style="margin-bottom:.9rem;">
          <div style="display:flex;justify-content:space-between;font-size:.82rem;margin-bottom:.3rem;">
            <span style="font-weight:600">${a.key}</span><span style="color:var(--text-muted)">${a.count}</span>
          </div>
          ${bar(a.count)}
        </div>`).join('')}
    </div>
  </div>
  <div class="card">
    <div class="card-header"><span class="card-title">Por puesto</span></div>
    <div class="card-body">
      ${emps.length === 0 ? '<p style="color:var(--text-muted);font-size:.88rem;">Sin datos.</p>' : byPuesto.map(a => `
        <div style="margin-bottom:.9rem;">
          <div style="display:flex;justify-content:space-between;font-size:.82rem;margin-bottom:.3rem;">
            <span style="font-weight:600">${a.key}</span><span style="color:var(--text-muted)">${a.count}</span>
          </div>
          ${bar(a.count)}
        </div>`).join('')}
    </div>
  </div>
</div>`;
});

SGE.Emp = {
    toggleActivo: async (id) => {
        const emp = SGE.DB.empleados.find(e => e.id === id);
        if (!emp) return;
        const activo = emp.estado !== 'Activo';
        try {
            await SGE.Api.mutations.putEmpleado(id, {
                areaId: emp.area_id,
                nombreCompleto: emp.nombre,
                identificacion: emp.identificacion,
                puesto: emp.puesto,
                telefono: emp.telefono || null,
                correo: emp.correo || null,
                direccion: emp.direccion || null,
                contactoEmergenciaNombre: emp.contacto_emergencia_nombre || null,
                contactoEmergenciaTel: emp.contacto_emergencia_tel || null,
                alergiasMedicamentos: emp.alergias || null,
                padecimientos: emp.padecimientos || null,
                activo
            });
            await SGE.Api.reloadAfterMutation();
            SGE.Toast.show(activo ? 'Empleado activado' : 'Empleado desactivado');
            SGE.Router.navigate('dashboard');
            setTimeout(() => SGE.Router.navigate('empleados'), 50);
        } catch (e) {
            SGE.Toast.show(e.message || 'Error', 'error');
        }
    },
    view: (id) => {
        const emp = SGE.DB.empleados.find(e => e.id === id);
        if (!emp) return;
        document.getElementById('emp-detail-body').innerHTML = `
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;padding-bottom:1.25rem;border-bottom:1px solid var(--border);">
        <div class="user-avatar" style="width:56px;height:56px;font-size:1.2rem;">${emp.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
        <div>
          <div style="font-size:1.1rem;font-weight:700;color:var(--navy);">${emp.nombre}</div>
          <div style="color:var(--text-muted);font-size:.85rem;">${emp.puesto} · <span class="badge ${emp.estado === 'Activo' ? 'badge-active' : 'badge-inactive'}">${emp.estado}</span></div>
        </div>
      </div>
      <div class="info-grid info-grid--3cols">
        <div class="info-item"><div class="info-label">Identificación</div><div class="info-value">${emp.identificacion}</div></div>
        <div class="info-item"><div class="info-label">Área</div><div class="info-value"><span class="badge badge-info">${emp.area}</span></div></div>
        <div class="info-item"><div class="info-label">Teléfono</div><div class="info-value"><i class="bi bi-telephone me-1" aria-hidden="true"></i>${emp.telefono || '—'}</div></div>
        <div class="info-item col-span-2"><div class="info-label">Correo</div><div class="info-value"><i class="bi bi-envelope me-1" aria-hidden="true"></i>${emp.correo || '—'}</div></div>
        <div class="info-item col-span-3"><div class="info-label">Dirección</div><div class="info-value"><i class="bi bi-geo-alt me-1" aria-hidden="true"></i>${emp.direccion || '—'}</div></div>
        <div class="info-item col-span-3"><div class="info-label">Contacto de emergencia</div><div class="info-value">${emp.contacto_emergencia_nombre || '—'} · <i class="bi bi-telephone me-1" aria-hidden="true"></i>${emp.contacto_emergencia_tel || '—'}</div></div>
        <div class="info-item col-span-3"><div class="info-label">Alergias a medicamentos</div><div class="info-value">${emp.alergias || '—'}</div></div>
        <div class="info-item col-span-3"><div class="info-label">Padecimientos / enfermedades</div><div class="info-value">${emp.padecimientos || '—'}</div></div>
        <div class="info-item"><div class="info-label">Estado</div><div class="info-value"><span class="badge ${emp.estado === 'Activo' ? 'badge-active' : 'badge-inactive'}">${emp.estado}</span></div></div>
      </div>
    `;
        window._empEditId = id;
        SGE.Modal.open('modal-emp-detail');
    },
    edit: (id) => {
        window._empEditId = id;
        const emp = SGE.DB.empleados.find(e => e.id === id);
        if (!emp) return;
        document.getElementById('emp-modal-title').innerHTML = `<i class="bi bi-pencil me-1" aria-hidden="true"></i>Editar Empleado — ${emp.nombre}`;
        document.getElementById('emp-nombre').value = emp.nombre;
        document.getElementById('emp-id').value = emp.identificacion;
        document.getElementById('emp-puesto').value = emp.puesto;
        const ar = document.getElementById('emp-area');
        if (ar) ar.value = String(emp.area_id || '');
        document.getElementById('emp-tel').value = emp.telefono || '';
        document.getElementById('emp-email').value = emp.correo || '';
        document.getElementById('emp-dir').value = emp.direccion || '';
        document.getElementById('emp-emerg-nombre').value = emp.contacto_emergencia_nombre || '';
        document.getElementById('emp-emerg-tel').value = emp.contacto_emergencia_tel || '';
        document.getElementById('emp-alerg').value = emp.alergias || '';
        document.getElementById('emp-pad').value = emp.padecimientos || '';
        const sw = document.querySelector('#modal-empleado .switch');
        if (sw) sw.classList.toggle('on', emp.estado === 'Activo');
        SGE.Modal.open('modal-empleado');
    },
    editFromDetail: () => { SGE.Modal.close('modal-emp-detail'); if (window._empEditId) SGE.Emp.edit(window._empEditId); },
    save: async () => {
        const areaId = parseInt(document.getElementById('emp-area')?.value || '0', 10);
        const nombre = document.getElementById('emp-nombre')?.value.trim();
        const ident = document.getElementById('emp-id')?.value.trim();
        const puesto = document.getElementById('emp-puesto')?.value.trim();
        if (!nombre || !ident || !puesto || !areaId) {
            SGE.Toast.show('Complete nombre, identificación, puesto y área', 'error'); return;
        }
        if (!SGE.Validate.identificacion(ident)) {
            SGE.Toast.show('La identificación debe tener entre 9 y 12 dígitos', 'error'); return;
        }
        const empTel = document.getElementById('emp-tel')?.value;
        if (!SGE.Validate.telefono(empTel)) {
            SGE.Toast.show('El teléfono no es válido', 'error'); return;
        }
        const empMail = document.getElementById('emp-email')?.value?.trim();
        if (empMail && !SGE.Validate.email(empMail)) {
            SGE.Toast.show('El correo no es válido', 'error'); return;
        }
        const empEmergTel = document.getElementById('emp-emerg-tel')?.value?.trim();
        if (empEmergTel && !SGE.Validate.telefono(empEmergTel)) {
            SGE.Toast.show('El teléfono de emergencia no es válido', 'error'); return;
        }
        const body = {
            areaId,
            nombreCompleto: nombre,
            identificacion: ident,
            puesto,
            telefono: document.getElementById('emp-tel')?.value || null,
            correo: document.getElementById('emp-email')?.value || null,
            direccion: document.getElementById('emp-dir')?.value || null,
            contactoEmergenciaNombre: document.getElementById('emp-emerg-nombre')?.value || null,
            contactoEmergenciaTel: document.getElementById('emp-emerg-tel')?.value || null,
            alergiasMedicamentos: document.getElementById('emp-alerg')?.value || null,
            padecimientos: document.getElementById('emp-pad')?.value || null,
            activo: document.querySelector('#modal-empleado .switch')?.classList.contains('on') ?? true
        };
        try {
            if (window._empEditId) {
                await SGE.Api.mutations.putEmpleado(window._empEditId, body);
            } else {
                await SGE.Api.mutations.postEmpleado(body);
            }
            SGE.Modal.close('modal-empleado');
            window._empEditId = null;
            await SGE.Api.reloadAfterMutation();
            SGE.Toast.show('Empleado guardado');
            SGE.Router.navigate('dashboard');
            setTimeout(() => SGE.Router.navigate('empleados'), 50);
        } catch (e) {
            SGE.Toast.show(e.message || 'Error', 'error');
        }
    }
};