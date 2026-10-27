/* Module: perfil.js - ensures detailed mi-perfil router registration remains available */
// This module overrides mi-perfil registration to the detailed employee/profile implementation
// Use the data already present in SGE.DB to render the profile
SGE.Router.register('mi-perfil', () => {
    const uid = typeof window.SGE_CURRENT_USER_ID === 'number' ? window.SGE_CURRENT_USER_ID : 0;
    const emp = (SGE.DB.empleados || []).find(e => e.usuario_id === uid);
    if (!uid) {
        return `<div class="page-header"><div class="page-title"><h2>Mi perfil</h2><p>No se pudo identificar la sesión.</p></div></div>`;
    }
    if (!emp) {
        return `<div class="page-header">
      <div class="page-title"><h2>Mi perfil</h2><p>No tiene ficha de empleado vinculada. Solicite el registro en RRHH para usar esta pantalla.</p></div>
      <div class="page-actions"><button type="button" class="btn btn-outline" onclick="SGE.Router.navigate('dashboard')">Volver al panel</button></div>
    </div>`;
    }
    return `
<div class="page-header">
  <div class="page-title">
    <h2>Mi perfil</h2>
    <p>Actualice sus datos personales permitidos.</p>
  </div>
</div>
<div class="card" style="width:100%;">
  <div class="card-header"><span class="card-title"><i class="bi bi-person-badge me-1" aria-hidden="true"></i>${SGE.Export.escapeHtml(emp.nombre)}</span></div>
  <div class="card-body">
    <p style="font-size:.85rem;color:var(--text-muted);margin-bottom:1rem;">Puesto: <strong>${SGE.Export.escapeHtml(emp.puesto)}</strong> · Área: <strong>${SGE.Export.escapeHtml(emp.area)}</strong></p>
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Teléfono</label>
        <input class="form-control" id="yo-tel" value="${SGE.Export.escapeHtml(emp.telefono || '')}" placeholder="0000-0000">
      </div>
      <div class="form-group">
        <label class="form-label">Correo</label>
        <input class="form-control" id="yo-email" type="email" value="${SGE.Export.escapeHtml(emp.correo || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">Contacto de emergencia</label>
        <input class="form-control" id="yo-emerg-n" value="${emp.contacto_emergencia_nombre || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Teléfono emergencia</label>
        <input class="form-control" id="yo-emerg-t" value="${emp.contacto_emergencia_tel || ''}">
      </div>
      <div class="form-group col-span-2">
        <label class="form-label">Alergias a medicamentos</label>
        <input class="form-control" id="yo-alerg" value="${emp.alergias || ''}">
      </div>
      <div class="form-group col-span-2">
        <label class="form-label">Padecimientos o enfermedades</label>
        <textarea class="form-control" id="yo-pad" style="min-height:72px;">${emp.padecimientos || ''}</textarea>
      </div>
    </div>
    <button type="button" class="btn btn-primary" style="margin-top:1rem;" onclick="SGE.Perfil.saveYo()"><i class="bi bi-floppy me-1" aria-hidden="true"></i> Guardar cambios</button>
  </div>
</div>`;
});

SGE.Perfil = {
    saveYo: async () => {
        const tel = document.getElementById('yo-tel')?.value;
        const correo = document.getElementById('yo-email')?.value?.trim();
        const emergT = document.getElementById('yo-emerg-t')?.value?.trim();

        // Mi perfil no vive en un modal: se valida sobre la página completa.
        if (!SGE.FormErrors.validar(null, [
            { campo: 'yo-tel', valido: SGE.Validate.telefono(tel),
              mensaje: 'El teléfono debe tener entre 8 y 15 dígitos.' },
            { campo: 'yo-email', valido: !correo || SGE.Validate.email(correo),
              mensaje: 'El correo no tiene un formato válido (ejemplo: nombre@puntofresco.cr).' },
            { campo: 'yo-emerg-t', valido: !emergT || SGE.Validate.telefono(emergT),
              mensaje: 'El teléfono de emergencia debe tener entre 8 y 15 dígitos.' }
        ])) return;
        const body = {
            telefono: tel || null,
            correo: correo || null,
            contactoEmergenciaNombre: document.getElementById('yo-emerg-n')?.value || null,
            contactoEmergenciaTel: emergT || null,
            alergiasMedicamentos: document.getElementById('yo-alerg')?.value || null,
            padecimientos: document.getElementById('yo-pad')?.value || null
        };
        try {
            await SGE.Api.mutations.putEmpleadoYo(body);
            SGE.Toast.show('Perfil actualizado');
        } catch (e) {
            SGE.Toast.show(e.message || 'No fue posible guardar los cambios de su perfil.', 'error');
        }
    }
};
