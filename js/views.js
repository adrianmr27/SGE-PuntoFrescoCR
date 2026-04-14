/* ═══════════════════════════════════════════════════════
   SGE Punto Fresco · Views
   ═══════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   DASHBOARD VIEW
   ══════════════════════════════════════════════ */
SGE.Router.register('dashboard', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Panel Principal</h2>
    <p>Bienvenido al Sistema de Gestión Empresarial · Punto Fresco</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-outline"><span>📋</span> Reportes</button>
    <button class="btn btn-primary"><span>➕</span> Acción rápida</button>
  </div>
</div>

<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-icon navy">📦</div>
    <div class="stat-info">
      <div class="stat-val">148</div>
      <div class="stat-lbl">Productos en Inventario</div>
      <div class="stat-change up">↑ 12 esta semana</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon green">🛒</div>
    <div class="stat-info">
      <div class="stat-val">36</div>
      <div class="stat-lbl">Pedidos del Mes</div>
      <div class="stat-change up">↑ 8% vs mes anterior</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon teal">🏢</div>
    <div class="stat-info">
      <div class="stat-val">4</div>
      <div class="stat-lbl">Clientes Activos</div>
      <div class="stat-change up">↑ 1 nuevo este mes</div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon coral">⚠️</div>
    <div class="stat-info">
      <div class="stat-val">3</div>
      <div class="stat-lbl">Alertas de Stock Bajo</div>
      <div class="stat-change down">↓ Revisar inventario</div>
    </div>
  </div>
</div>

<div class="overview-grid">
  <div class="card">
    <div class="card-header">
      <span class="card-title"><div class="card-title-icon" style="background:rgba(28,34,96,.08)">🧩</div> Módulos del Sistema</span>
    </div>
    <div class="card-body">
      <div class="module-grid">
        <div class="module-card" onclick="SGE.Router.navigate('administrativo')">
          <div class="module-card-icon" style="background:rgba(28,34,96,.08)">🏛️</div>
          <div class="module-card-name">Administrativo</div>
          <div class="module-card-count">3 configuraciones</div>
        </div>
        <div class="module-card" onclick="SGE.Router.navigate('roles')">
          <div class="module-card-icon" style="background:rgba(93,210,188,.15)">🔑</div>
          <div class="module-card-name">Roles</div>
          <div class="module-card-count">${SGE.DB.roles.length} roles</div>
        </div>
        <div class="module-card" onclick="SGE.Router.navigate('usuarios')">
          <div class="module-card-icon" style="background:rgba(40,167,69,.1)">👤</div>
          <div class="module-card-name">Usuarios</div>
          <div class="module-card-count">${SGE.DB.usuarios.length} registrados</div>
        </div>
        <div class="module-card" onclick="SGE.Router.navigate('empleados')">
          <div class="module-card-icon" style="background:rgba(255,112,118,.1)">👷</div>
          <div class="module-card-name">Empleados</div>
          <div class="module-card-count">${SGE.DB.empleados.length} empleados</div>
        </div>
        <div class="module-card" onclick="SGE.Router.navigate('clientes')">
          <div class="module-card-icon" style="background:rgba(93,210,188,.15)">🏪</div>
          <div class="module-card-name">Clientes</div>
          <div class="module-card-count">${SGE.DB.clientes.length} clientes</div>
        </div>
        <div class="module-card" onclick="SGE.Router.navigate('proveedores')">
          <div class="module-card-icon" style="background:rgba(28,34,96,.08)">🚚</div>
          <div class="module-card-name">Proveedores</div>
          <div class="module-card-count">${SGE.DB.proveedores.length} proveedores</div>
        </div>
        <div class="module-card" onclick="SGE.Router.navigate('compras')">
          <div class="module-card-icon" style="background:rgba(255,112,118,.1)">🛒</div>
          <div class="module-card-name">Compras</div>
          <div class="module-card-count">${SGE.DB.compras ? SGE.DB.compras.length : 0} órdenes</div>
        </div>
        <div class="module-card" onclick="SGE.Router.navigate('inventario')">
          <div class="module-card-icon" style="background:rgba(93,210,188,.15)">📦</div>
          <div class="module-card-name">Inventario</div>
          <div class="module-card-count">${SGE.DB.productos ? SGE.DB.productos.length : 0} productos</div>
        </div>
        <div class="module-card" onclick="SGE.Router.navigate('pedidos')">
          <div class="module-card-icon" style="background:rgba(40,167,69,.1)">📋</div>
          <div class="module-card-name">Pedidos</div>
          <div class="module-card-count">${SGE.DB.pedidos ? SGE.DB.pedidos.length : 0} pedidos</div>
        </div>
        <div class="module-card" onclick="SGE.Router.navigate('licitaciones')">
          <div class="module-card-icon" style="background:rgba(28,34,96,.08)">📑</div>
          <div class="module-card-name">Licitaciones</div>
          <div class="module-card-count">${SGE.DB.licitaciones ? SGE.DB.licitaciones.length : 0} procesos</div>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-title"><div class="card-title-icon" style="background:rgba(40,167,69,.1)">📊</div> Resumen General</span>
    </div>
    <div class="card-body" style="padding: 1rem 1.5rem; display:flex; flex-direction:column; gap:1rem;">
      <div style="background:var(--surface-alt); border-radius:var(--radius-md); padding:1rem;">
        <div style="font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--text-muted); margin-bottom:.5rem;">Usuarios por Rol</div>
        ${SGE.DB.roles.filter(r=>r.estado==='Activo').map(r=>`
          <div style="display:flex; align-items:center; gap:.75rem; margin-bottom:.5rem;">
            <span style="font-size:.82rem; flex:1; color:var(--text-primary); font-weight:500;">${r.nombre}</span>
            <div style="flex:2; height:6px; background:var(--border); border-radius:99px; overflow:hidden;">
              <div style="height:100%; width:${r.usuarios * 20}%; background:var(--teal); border-radius:99px;"></div>
            </div>
            <span style="font-size:.78rem; color:var(--text-muted); min-width:20px; text-align:right;">${r.usuarios}</span>
          </div>
        `).join('')}
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:.75rem;">
        <div style="background:rgba(40,167,69,.08); border-radius:var(--radius-md); padding:.85rem; text-align:center;">
          <div style="font-size:1.3rem; font-weight:800; color:var(--green);">${SGE.DB.empleados.filter(e=>e.estado==='Activo').length}</div>
          <div style="font-size:.72rem; color:var(--text-muted);">Empleados Activos</div>
        </div>
        <div style="background:rgba(93,210,188,.12); border-radius:var(--radius-md); padding:.85rem; text-align:center;">
          <div style="font-size:1.3rem; font-weight:800; color:#2ca892;">${SGE.DB.proveedores.filter(p=>p.estado==='Activo').length}</div>
          <div style="font-size:.72rem; color:var(--text-muted);">Proveedores Activos</div>
        </div>
      </div>
    </div>
  </div>
</div>
`);

/* ══════════════════════════════════════════════
   ADMINISTRATIVO VIEW
   ══════════════════════════════════════════════ */
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
    <button class="tab-btn active" data-tab="tab-empresa">🏛️ Datos de la Empresa</button>
    <button class="tab-btn" data-tab="tab-params">⚙️ Parámetros del Sistema</button>
    <button class="tab-btn" data-tab="tab-overview">📋 Vista General</button>
  </div>

  <!-- Tab: Empresa -->
  <div class="tab-panel active" id="tab-empresa">
    <div class="card">
      <div class="card-header">
        <span class="card-title"><div class="card-title-icon" style="background:rgba(28,34,96,.08)">🏛️</div> Información General de la Empresa</span>
        <button class="btn btn-primary btn-sm" onclick="SGE.Adm.editEmpresa()">✏️ Editar</button>
      </div>
      <div class="card-body" id="empresa-view">
        <div class="info-grid" style="grid-template-columns: repeat(3,1fr); gap:1.25rem; margin-bottom:1.5rem;">
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
        <div class="info-grid" style="grid-template-columns:repeat(3,1fr);">
          <div class="info-item">
            <div class="info-label">Teléfono Principal</div>
            <div class="info-value">📞 ${e.telefono1}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Teléfono Alternativo</div>
            <div class="info-value">📞 ${e.telefono2}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Sitio Web</div>
            <div class="info-value">🌐 ${e.sitio_web}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Correo Principal</div>
            <div class="info-value">✉️ ${e.correo}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Correo Alternativo</div>
            <div class="info-value">✉️ ${e.correo_alt}</div>
          </div>
          <div class="info-item">
            <div class="info-label">IVA por Defecto</div>
            <div class="info-value"><span class="badge badge-info">${e.impuesto_defecto}%</span></div>
          </div>
          <div class="info-item" style="grid-column:1/-1;">
            <div class="info-label">Dirección</div>
            <div class="info-value">📍 ${e.direccion}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal-overlay" id="modal-empresa">
      <div class="modal modal-lg">
        <div class="modal-header">
          <span class="modal-title">🏛️ Editar Datos de la Empresa</span>
          <button class="modal-close">✕</button>
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
          <button class="btn btn-primary" onclick="SGE.Adm.saveEmpresa()">💾 Guardar Cambios</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Tab: Parámetros -->
  <div class="tab-panel" id="tab-params">
    <div class="card">
      <div class="card-header">
        <span class="card-title"><div class="card-title-icon" style="background:rgba(93,210,188,.15)">⚙️</div> Parámetros Generales</span>
        <button class="btn btn-primary btn-sm" onclick="SGE.Adm.newParam()">➕ Nuevo Parámetro</button>
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
                    <button class="btn btn-ghost btn-sm btn-icon" title="Editar">✏️</button>
                    <button class="btn btn-ghost btn-sm btn-icon" title="Estado">🔄</button>
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
          <span class="modal-title">⚙️ Nuevo Parámetro</span>
          <button class="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-grid cols-1">
            <div class="form-group">
              <label class="form-label">Tipo <span>*</span></label>
              <select class="form-control">
                <option>Impuesto</option><option>Descuento</option><option>Otro</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Nombre <span>*</span></label>
              <input class="form-control" placeholder="Ej: IVA Turismo">
            </div>
            <div class="form-group">
              <label class="form-label">Valor <span>*</span></label>
              <input class="form-control" placeholder="Ej: 8%">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" data-close-modal>Cancelar</button>
          <button class="btn btn-primary" onclick="SGE.Modal.close('modal-param'); SGE.Toast.show('Parámetro guardado')">💾 Guardar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Tab: Vista General -->
  <div class="tab-panel" id="tab-overview">
    <div class="stat-grid" style="grid-template-columns:repeat(3,1fr);">
      <div class="stat-card">
        <div class="stat-icon navy">👤</div>
        <div class="stat-info">
          <div class="stat-val">${SGE.DB.usuarios.length}</div>
          <div class="stat-lbl">Usuarios Registrados</div>
          <div class="stat-change up">${SGE.DB.usuarios.filter(u=>u.estado==='Activo').length} activos</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">👷</div>
        <div class="stat-info">
          <div class="stat-val">${SGE.DB.empleados.length}</div>
          <div class="stat-lbl">Empleados Totales</div>
          <div class="stat-change up">${SGE.DB.empleados.filter(e=>e.estado==='Activo').length} activos</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon teal">🔑</div>
        <div class="stat-info">
          <div class="stat-val">${SGE.DB.roles.length}</div>
          <div class="stat-lbl">Roles del Sistema</div>
          <div class="stat-change up">${SGE.DB.roles.filter(r=>r.estado==='Activo').length} activos</div>
        </div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem;">
      <div class="card">
        <div class="card-header"><span class="card-title">👤 Usuarios por Rol</span></div>
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
        <div class="card-header"><span class="card-title">👷 Distribución por Área</span></div>
        <div class="card-body">
          ${[...new Set(SGE.DB.empleados.map(e=>e.area))].map(area=>{
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
  </div>
</div>`;
});

/* ══════════════════════════════════════════════
   ROLES VIEW
   ══════════════════════════════════════════════ */
SGE.Router.register('roles', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Gestión de Roles</h2>
    <p>Defina niveles de acceso y permisos para cada rol del sistema</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-primary" data-modal="modal-rol">➕ Nuevo Rol</button>
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon">🔍</span>
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
            <td><span class="badge badge-navy">👤 ${r.usuarios}</span></td>
            <td>
              <div class="flex gap-1">
                <button class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Roles.edit(${r.id})">✏️</button>
                <button class="btn btn-ghost btn-sm btn-icon" title="Permisos" onclick="SGE.Roles.perms(${r.id})">🔑</button>
                <button class="btn btn-ghost btn-sm btn-icon" title="Desactivar">🔄</button>
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
      <button class="page-btn">‹</button>
      <button class="page-btn active">1</button>
      <button class="page-btn">›</button>
    </div>
  </div>
</div>

<!-- Modal Nuevo/Editar Rol -->
<div class="modal-overlay" id="modal-rol">
  <div class="modal modal-sm">
    <div class="modal-header">
      <span class="modal-title" id="rol-modal-title">🔑 Nuevo Rol</span>
      <button class="modal-close">✕</button>
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
      <button class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button class="btn btn-primary" onclick="SGE.Roles.save()">💾 Guardar Rol</button>
    </div>
  </div>
</div>

<!-- Modal Permisos -->
<div class="modal-overlay" id="modal-permisos">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title">🔑 Asignar Permisos — <span id="perm-rol-name"></span></span>
      <button class="modal-close">✕</button>
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
          <tbody id="perm-body">
            ${['Administrativo','Roles','Usuarios','Empleados','Clientes','Proveedores','Compras','Inventario','Pedidos','Licitaciones','Finanzas','Reportes'].map((m,i)=>`
            <tr>
              <td style="font-weight:600">${m}</td>
              <td><input type="checkbox" class="perm-check" ${i<4?'checked':''}></td>
              <td><input type="checkbox" class="perm-check" ${i<2?'checked':''}></td>
              <td><input type="checkbox" class="perm-check" ${i<2?'checked':''}></td>
              <td><input type="checkbox" class="perm-check" ${i<1?'checked':''}></td>
              <td><input type="checkbox" class="perm-check" ${i<3?'checked':''}></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cancelar</button>
      <button class="btn btn-primary" onclick="SGE.Modal.close('modal-permisos'); SGE.Toast.show('Permisos actualizados')">💾 Guardar Permisos</button>
    </div>
  </div>
</div>
`);

/* ══════════════════════════════════════════════
   USUARIOS VIEW
   ══════════════════════════════════════════════ */
SGE.Router.register('usuarios', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Gestión de Usuarios</h2>
    <p>Registro y control de acceso de usuarios al sistema</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-primary" data-modal="modal-usuario">➕ Nuevo Usuario</button>
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon">🔍</span>
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
            <td style="color:var(--text-muted); font-size:.82rem;">${SGE.fmt.date(u.ultimo_acceso)}</td>
            <td>
              <div class="flex gap-1">
                <button class="btn btn-ghost btn-sm btn-icon" title="Editar">✏️</button>
                <button class="btn btn-ghost btn-sm btn-icon" title="Restablecer contraseña" onclick="SGE.Toast.show('Correo de recuperación enviado','info')">🔐</button>
                <button class="btn btn-ghost btn-sm btn-icon" title="${u.estado==='Activo'?'Desactivar':'Activar'}" onclick="SGE.Toast.show('Estado actualizado')">🔄</button>
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
      <button class="page-btn">‹</button>
      <button class="page-btn active">1</button>
      <button class="page-btn">›</button>
    </div>
  </div>
</div>

<!-- Modal Nuevo Usuario -->
<div class="modal-overlay" id="modal-usuario">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title">👤 Nuevo Usuario</span>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-grid">
        <div class="form-group col-span-2">
          <label class="form-label">Nombre Completo <span>*</span></label>
          <input class="form-control" placeholder="Nombre y apellidos">
        </div>
        <div class="form-group">
          <label class="form-label">Identificación <span>*</span></label>
          <input class="form-control" placeholder="1-0000-0000">
        </div>
        <div class="form-group">
          <label class="form-label">Nombre de Usuario <span>*</span></label>
          <input class="form-control" placeholder="usuario.apellido">
        </div>
        <div class="form-group">
          <label class="form-label">Correo Electrónico <span>*</span></label>
          <input class="form-control" type="email" placeholder="correo@puntofresco.cr">
        </div>
        <div class="form-group">
          <label class="form-label">Rol <span>*</span></label>
          <select class="form-control">
            <option value="">Seleccione un rol...</option>
            ${SGE.DB.roles.filter(r=>r.estado==='Activo').map(r=>`<option>${r.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Contraseña Temporal <span>*</span></label>
          <input class="form-control" type="password" placeholder="Mínimo 8 caracteres">
        </div>
        <div class="form-group">
          <label class="form-label">Puesto</label>
          <input class="form-control" placeholder="Cargo del empleado">
        </div>
        <div class="form-group">
          <label class="form-label">Teléfono</label>
          <input class="form-control" placeholder="0000-0000">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Dirección</label>
          <input class="form-control" placeholder="Provincia, cantón, distrito">
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
      <button class="btn btn-primary" onclick="SGE.Modal.close('modal-usuario'); SGE.Toast.show('Usuario registrado exitosamente')">💾 Guardar</button>
    </div>
  </div>
</div>
`);

/* ══════════════════════════════════════════════
   EMPLEADOS VIEW
   ══════════════════════════════════════════════ */
SGE.Router.register('empleados', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Gestión de Empleados</h2>
    <p>Registro, consulta y administración del personal de la empresa</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-outline" onclick="SGE.Router.navigate('empleados-stats')">📊 Distribución</button>
    <button class="btn btn-primary" data-modal="modal-empleado">➕ Nuevo Empleado</button>
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon">🔍</span>
    <input class="search-input" placeholder="Buscar por nombre, cédula o puesto..." data-table="empleados-table">
  </div>
  <select class="filter-select" data-table="empleados-table" data-col="4">
    <option value="">Todas las áreas</option>
    ${[...new Set(SGE.DB.empleados.map(e=>e.area))].map(a=>`<option>${a}</option>`).join('')}
  </select>
  <select class="filter-select" data-table="empleados-table" data-col="5">
    <option value="">Todos los estados</option>
    <option>Activo</option><option>Inactivo</option>
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
          ${SGE.DB.empleados.map(emp=>`
          <tr>
            <td style="color:var(--text-muted)">${emp.id}</td>
            <td>
              <div style="display:flex;align-items:center;gap:.65rem;">
                <div class="user-avatar" style="width:32px;height:32px;font-size:.75rem;">${emp.nombre.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                <div>
                  <div class="td-name">${emp.nombre}</div>
                  <div class="td-sub">${emp.correo}</div>
                </div>
              </div>
            </td>
            <td style="font-size:.82rem;">${emp.identificacion}</td>
            <td>${emp.puesto}</td>
            <td><span class="badge badge-info">${emp.area}</span></td>
            <td><span class="badge ${emp.estado==='Activo'?'badge-active':'badge-inactive'}">${emp.estado}</span></td>
            <td>
              <div class="flex gap-1">
                <button class="btn btn-ghost btn-sm btn-icon" title="Ver detalle" onclick="SGE.Emp.view(${emp.id})">👁️</button>
                <button class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Emp.edit(${emp.id})">✏️</button>
                <button class="btn btn-ghost btn-sm btn-icon" title="${emp.estado==='Activo'?'Desactivar':'Activar'}" onclick="SGE.Toast.show('Estado actualizado')">🔄</button>
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
      <span class="modal-title" id="emp-modal-title">👷 Nuevo Empleado</span>
      <button class="modal-close">✕</button>
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
            <option>Tecnología</option><option>Ventas</option><option>Proveeduría</option>
            <option>Operaciones</option><option>Finanzas</option><option>Administración</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Teléfono</label>
          <input class="form-control" placeholder="0000-0000">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Correo Electrónico</label>
          <input class="form-control" type="email" placeholder="correo@puntofresco.cr">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Dirección</label>
          <input class="form-control" placeholder="Provincia, cantón, distrito">
        </div>
        <div class="form-divider-label">Información de Emergencia</div>
        <div class="form-group">
          <label class="form-label">Contacto de Emergencia</label>
          <input class="form-control" placeholder="Nombre del contacto">
        </div>
        <div class="form-group">
          <label class="form-label">Teléfono de Emergencia</label>
          <input class="form-control" placeholder="0000-0000">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Alergias a Medicamentos</label>
          <input class="form-control" placeholder="Ninguna / Descripción de alergias">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Padecimientos / Enfermedades</label>
          <textarea class="form-control" placeholder="Ninguno / Descripción" style="min-height:60px;"></textarea>
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
      <button class="btn btn-primary" onclick="SGE.Modal.close('modal-empleado'); SGE.Toast.show('Empleado registrado exitosamente')">💾 Guardar</button>
    </div>
  </div>
</div>

<!-- Modal Ver Detalle Empleado -->
<div class="modal-overlay" id="modal-emp-detail">
  <div class="modal modal-lg">
    <div class="modal-header">
      <span class="modal-title">👷 Detalle del Empleado</span>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body" id="emp-detail-body">
      <!-- Cargado dinámicamente -->
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close-modal>Cerrar</button>
      <button class="btn btn-primary" onclick="SGE.Emp.editFromDetail()">✏️ Editar</button>
    </div>
  </div>
</div>
`);

/* ══════════════════════════════════════════════
   CLIENTES VIEW
   ══════════════════════════════════════════════ */
SGE.Router.register('clientes', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Gestión de Clientes</h2>
    <p>Base de datos de clientes y cuentas comerciales</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-primary" data-modal="modal-cliente">➕ Nuevo Cliente</button>
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon">🔍</span>
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
              <div class="td-sub">📍 ${c.direccion}</div>
            </td>
            <td style="font-size:.82rem;">${c.identificacion}</td>
            <td><span class="badge ${c.estado==='Activo'?'badge-active':'badge-inactive'}">${c.estado}</span></td>
            <td>📞 ${c.telefono}</td>
            <td style="font-size:.82rem;">✉️ ${c.correo}</td>
            <td>
              <div class="flex gap-1">
                <button class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Cli.edit(${c.id})">✏️</button>
                <button class="btn btn-ghost btn-sm btn-icon" title="${c.estado==='Activo'?'Desactivar':'Activar'}" onclick="SGE.Toast.show('Estado actualizado')">🔄</button>
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
      <button class="page-btn">‹</button>
      <button class="page-btn active">1</button>
      <button class="page-btn">›</button>
    </div>
  </div>
</div>

<!-- Modal Nuevo/Editar Cliente -->
<div class="modal-overlay" id="modal-cliente">
  <div class="modal">
    <div class="modal-header">
      <span class="modal-title" id="cli-modal-title">🏪 Nuevo Cliente</span>
      <button class="modal-close">✕</button>
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
          <input class="form-control" placeholder="0000-0000">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Correo Electrónico</label>
          <input class="form-control" type="email" placeholder="correo@empresa.com">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Dirección</label>
          <textarea class="form-control" placeholder="Provincia, cantón, dirección exacta" style="min-height:70px;"></textarea>
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
      <button class="btn btn-primary" onclick="SGE.Modal.close('modal-cliente'); SGE.Toast.show('Cliente registrado exitosamente')">💾 Guardar</button>
    </div>
  </div>
</div>
`);

/* ══════════════════════════════════════════════
   PROVEEDORES VIEW
   ══════════════════════════════════════════════ */
SGE.Router.register('proveedores', () => `
<div class="page-header">
  <div class="page-title">
    <h2>Gestión de Proveedores</h2>
    <p>Registro y administración de proveedores de la empresa</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-primary" data-modal="modal-proveedor">➕ Nuevo Proveedor</button>
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrap">
    <span class="search-icon">🔍</span>
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
              <div class="td-sub">📍 ${p.direccion}</div>
            </td>
            <td style="font-size:.82rem;">${p.identificacion}</td>
            <td><span class="badge ${p.estado==='Activo'?'badge-active':'badge-inactive'}">${p.estado}</span></td>
            <td>📞 ${p.telefono}</td>
            <td style="font-size:.82rem;">✉️ ${p.correo}</td>
            <td>
              <div class="flex gap-1">
                <button class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="SGE.Prov.edit(${p.id})">✏️</button>
                <button class="btn btn-ghost btn-sm btn-icon" title="${p.estado==='Activo'?'Desactivar':'Activar'}" onclick="SGE.Toast.show('Estado actualizado')">🔄</button>
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
      <span class="modal-title" id="prov-modal-title">🚚 Nuevo Proveedor</span>
      <button class="modal-close">✕</button>
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
          <input class="form-control" placeholder="0000-0000">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Correo Electrónico</label>
          <input class="form-control" type="email" placeholder="contacto@proveedor.com">
        </div>
        <div class="form-group col-span-2">
          <label class="form-label">Dirección</label>
          <textarea class="form-control" placeholder="Provincia, cantón, dirección exacta" style="min-height:70px;"></textarea>
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
      <button class="btn btn-primary" onclick="SGE.Modal.close('modal-proveedor'); SGE.Toast.show('Proveedor registrado exitosamente')">💾 Guardar</button>
    </div>
  </div>
</div>
`);

/* ══════════════════════════════════════════════
   MODULE-SPECIFIC HANDLERS
   ══════════════════════════════════════════════ */

/* Administrativo */
SGE.Adm = {
  editEmpresa: () => SGE.Modal.open('modal-empresa'),
  saveEmpresa: () => {
    SGE.DB.empresa.nombre_comercial = document.getElementById('f-ncomer')?.value || SGE.DB.empresa.nombre_comercial;
    SGE.Modal.close('modal-empresa');
    SGE.Toast.show('Datos de la empresa actualizados');
    SGE.Router.navigate('dashboard');
    setTimeout(() => SGE.Router.navigate('administrativo'), 50);
  },
  newParam: () => SGE.Modal.open('modal-param'),
};

/* Roles */
SGE.Roles = {
  edit: (id) => {
    const rol = SGE.DB.roles.find(r => r.id === id);
    if (!rol) return;
    document.getElementById('rol-modal-title').textContent = `🔑 Editar Rol — ${rol.nombre}`;
    document.getElementById('rol-nombre').value = rol.nombre;
    document.getElementById('rol-desc').value = rol.descripcion;
    SGE.Modal.open('modal-rol');
  },
  perms: (id) => {
    const rol = SGE.DB.roles.find(r => r.id === id);
    document.getElementById('perm-rol-name').textContent = rol?.nombre || '';
    SGE.Modal.open('modal-permisos');
  },
  save: () => {
    const nombre = document.getElementById('rol-nombre')?.value.trim();
    if (!nombre) { SGE.Toast.show('Ingrese el nombre del rol', 'error'); return; }
    SGE.Modal.close('modal-rol');
    SGE.Toast.show('Rol guardado correctamente');
  },
};

/* Empleados */
SGE.Emp = {
  view: (id) => {
    const emp = SGE.DB.empleados.find(e => e.id === id);
    if (!emp) return;
    document.getElementById('emp-detail-body').innerHTML = `
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;padding-bottom:1.25rem;border-bottom:1px solid var(--border);">
        <div class="user-avatar" style="width:56px;height:56px;font-size:1.2rem;">${emp.nombre.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
        <div>
          <div style="font-size:1.1rem;font-weight:700;color:var(--navy);">${emp.nombre}</div>
          <div style="color:var(--text-muted);font-size:.85rem;">${emp.puesto} · <span class="badge ${emp.estado==='Activo'?'badge-active':'badge-inactive'}">${emp.estado}</span></div>
        </div>
      </div>
      <div class="info-grid" style="grid-template-columns:repeat(3,1fr);">
        <div class="info-item"><div class="info-label">Identificación</div><div class="info-value">${emp.identificacion}</div></div>
        <div class="info-item"><div class="info-label">Área</div><div class="info-value"><span class="badge badge-info">${emp.area}</span></div></div>
        <div class="info-item"><div class="info-label">Teléfono</div><div class="info-value">📞 ${emp.telefono}</div></div>
        <div class="info-item col-span-2"><div class="info-label">Correo</div><div class="info-value">✉️ ${emp.correo}</div></div>
        <div class="info-item"><div class="info-label">Estado</div><div class="info-value"><span class="badge ${emp.estado==='Activo'?'badge-active':'badge-inactive'}">${emp.estado}</span></div></div>
      </div>
    `;
    SGE.Modal.open('modal-emp-detail');
  },
  edit: (id) => {
    const emp = SGE.DB.empleados.find(e => e.id === id);
    if (!emp) return;
    document.getElementById('emp-modal-title').textContent = `✏️ Editar Empleado — ${emp.nombre}`;
    document.getElementById('emp-nombre').value = emp.nombre;
    document.getElementById('emp-id').value    = emp.identificacion;
    document.getElementById('emp-puesto').value = emp.puesto;
    SGE.Modal.open('modal-empleado');
  },
  editFromDetail: () => { SGE.Modal.close('modal-emp-detail'); SGE.Modal.open('modal-empleado'); }
};

/* Clientes */
SGE.Cli = {
  edit: (id) => {
    const c = SGE.DB.clientes.find(x => x.id === id);
    if (!c) return;
    document.getElementById('cli-modal-title').textContent = `✏️ Editar Cliente — ${c.nombre}`;
    document.getElementById('cli-nombre').value = c.nombre;
    document.getElementById('cli-id').value = c.identificacion;
    SGE.Modal.open('modal-cliente');
  }
};

/* Proveedores */
SGE.Prov = {
  edit: (id) => {
    const p = SGE.DB.proveedores.find(x => x.id === id);
    if (!p) return;
    document.getElementById('prov-modal-title').textContent = `✏️ Editar Proveedor — ${p.nombre}`;
    document.getElementById('prov-nombre').value = p.nombre;
    document.getElementById('prov-id').value = p.identificacion;
    SGE.Modal.open('modal-proveedor');
  }
};
