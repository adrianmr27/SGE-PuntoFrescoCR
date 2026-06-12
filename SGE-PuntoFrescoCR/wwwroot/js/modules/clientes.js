/* SGE Punto Fresco - split module */
'use strict';

SGE.Router.register('clientes', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Gestión de Clientes</h2>
    <p>Base de datos de clientes y cuentas comerciales</p>
  </div>
  <div class="page-actions">
    <button type="button" class="btn btn-primary" data-modal="modal-cliente"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Nuevo Cliente</button>
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon"></span>
    <input class="search-input" placeholder="Buscar por nombre, cédula o correo..." data-table="clientes-table">
  </div>
  <select class="filter-select" data-table="clientes-table" data-col="3">
    <option value="">Todos los estados</option>
    <option>Activo</option><option>Inactivo</option>
  </select>
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table id="clientes-table">
        <thead><tr>
          <th>#</th><th>Nombre / Empresa</th><th>Identificación</th><th>Estado</th><th>Teléfono</th><th>Correo</th><th>Acciones</th>
        </tr></thead>
        <tbody>
          ${SGE.DB.clientes.map(c=>`
          <tr>
            <td style="color:var(--text-muted)">${c.id}</td>
            <td>
              <div class="td-name">${c.nombre}</div>
              <div class="td-sub"><i class="bi bi-geo-alt me-1" aria-hidden="true"></i>${c.direccion}</div>
            </td>
            <td style="font-size:.82rem;">${c.identificacion}</td>
            <td><span class="badge ${c.estado==='Activo'?'badge-active':'badge-inactive'}">${c.estado}</span></td>
            <td><i class="bi bi-telephone me-1" aria-hidden="true"></i>${c.telefono}</td>
            <td style="font-size:.82rem;"><i class="bi bi-envelope me-1" aria-hidden="true"></i>${c.correo}</td>
            <td>
              <div class="flex gap-1">
                <button type="button" class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Cli.edit(${c.id})"><i class="bi bi-pencil" aria-hidden="true"></i></button>
                <button type="button" class="btn btn-ghost btn-sm btn-icon" title="${c.estado==='Activo'?'Desactivar':'Activar'}" onclick="SGE.Cli.toggleActivo(${c.id})"><i class="bi bi-arrow-repeat" aria-hidden="true"></i></button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div class="pagination">
    <span class="page-info">Mostrando ${SGE.DB.clientes.length} de ${SGE.DB.clientes.length} clientes</span>
    <div class="page-btns">
      <button type="button" class="page-btn" aria-label="Anterior"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
      <button type="button" class="page-btn active">1</button>
      <button type="button" class="page-btn" aria-label="Siguiente"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
    </div>
  </div>
</div>

<!-- Modal Nuevo/Editar Cliente -->
<div class="modal-overlay" id="modal-cliente">
  <div class="modal">
    <div class="modal-header">
      <span class="modal-title" id="cli-modal-title"><i class="bi bi-shop me-1" aria-hidden="true"></i>Nuevo Cliente</span>
      <button type="button" class="modal-close" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-grid">
        <div class="form-group col-span-2">
          <label class="form-label">Nombre / Razón Social <span>*</span></label>
          <input class="form-control" id="cli-nombre" placeholder="Nombre del cliente o empresa">
        </div>
        <div class="form-group">
          <label class="form-label">Identificación <span>*</span></label>
          <input class="form-control" id="cli-id" placeholder="Cédula / Jurídica">
        </div>
        <div class="form-group">
          <label class="form-label">Teléfono</label>
          <input class="form-control" id="cli-tel" placeholder="0000-0000">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Correo Electrónico</label>
          <input class="form-control" id="cli-email" type="email" placeholder="correo@empresa.com">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Dirección</label>
          <textarea class="form-control" id="cli-dir" placeholder="Provincia, cantón, dirección exacta" style="min-height:70px;"></textarea>
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
      <button type="button" class="btn btn-primary" onclick="SGE.Cli.save()"><i class="bi bi-floppy me-1" aria-hidden="true"></i>Guardar</button>
    </div>
  </div>
</div>
`);

SGE.Cli = {
  edit: (id) => {
    window._cliEditId = id;
    const c = SGE.DB.clientes.find(x => x.id === id);
    if (!c) return;
    document.getElementById('cli-modal-title').innerHTML = `<i class="bi bi-pencil me-1" aria-hidden="true"></i>Editar Cliente — ${c.nombre}`;
    document.getElementById('cli-nombre').value = c.nombre;
    document.getElementById('cli-id').value = c.identificacion;
    document.getElementById('cli-tel').value = c.telefono || '';
    document.getElementById('cli-email').value = c.correo || '';
    document.getElementById('cli-dir').value = c.direccion || '';
    const sw = document.querySelector('#modal-cliente .switch');
    if (sw) sw.classList.toggle('on', c.estado === 'Activo');
    SGE.Modal.open('modal-cliente');
  },
  toggleActivo: async (id) => {
    const c = SGE.DB.clientes.find(x => x.id === id);
    if (!c) return;
    try {
      await SGE.Api.mutations.putCliente(id, {
        nombre: c.nombre,
        identificacion: c.identificacion,
        telefono: c.telefono || null,
        correo: c.correo || null,
        direccion: c.direccion || null,
        activo: c.estado !== 'Activo'
      });
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show(c.estado === 'Activo' ? 'Cliente desactivado' : 'Cliente activado');
      SGE.Router.navigate('dashboard');
      setTimeout(() => SGE.Router.navigate('clientes'), 50);
    } catch (e) {
      SGE.Toast.show(e.message || 'Error', 'error');
    }
  },
  save: async () => {
    const nombre = document.getElementById('cli-nombre')?.value.trim();
    const ident = document.getElementById('cli-id')?.value.trim();
    if (!nombre || !ident) { SGE.Toast.show('Nombre e identificación requeridos', 'error'); return; }
    if (!SGE.Validate.identificacion(ident)) {
      SGE.Toast.show('La identificación debe tener entre 9 y 12 dígitos', 'error'); return;
    }
    const cliTel = document.getElementById('cli-tel')?.value;
    if (!SGE.Validate.telefono(cliTel)) {
      SGE.Toast.show('El teléfono no es válido', 'error'); return;
    }
    const cliMail = document.getElementById('cli-email')?.value?.trim();
    if (cliMail && !SGE.Validate.email(cliMail)) {
      SGE.Toast.show('El correo no es válido', 'error'); return;
    }
    const body = {
      nombre,
      identificacion: ident,
      telefono: document.getElementById('cli-tel')?.value || null,
      correo: document.getElementById('cli-email')?.value || null,
      direccion: document.getElementById('cli-dir')?.value || null,
      activo: document.querySelector('#modal-cliente .switch')?.classList.contains('on') ?? true
    };
    try {
      if (window._cliEditId) {
        await SGE.Api.mutations.putCliente(window._cliEditId, body);
      } else {
        await SGE.Api.mutations.postCliente(body);
      }
      SGE.Modal.close('modal-cliente');
      window._cliEditId = null;
      await SGE.Api.reloadAfterMutation();
      SGE.Toast.show('Cliente guardado');
      SGE.Router.navigate('dashboard');
      setTimeout(() => SGE.Router.navigate('clientes'), 50);
    } catch (e) {
      SGE.Toast.show(e.message || 'Error', 'error');
    }
  }
};