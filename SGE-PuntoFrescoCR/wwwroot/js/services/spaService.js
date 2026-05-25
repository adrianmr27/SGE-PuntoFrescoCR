/* Bootstrap SPA, mapeo DTO y mutaciones (usa SGE.Http). */
'use strict';

function mapEmpresa(e) {
  if (!e) return {};
  return {
    nombre_comercial: e.nombreComercial || '',
    razon_social: e.razonSocial || '',
    cedula_juridica: e.cedulaJuridica || '',
    telefono1: e.telefono1 || '',
    telefono2: e.telefono2 || '',
    correo: e.correo || '',
    correo_alt: e.correoAlt || '',
    direccion: e.direccion || '',
    sitio_web: e.sitioWeb || '',
    impuesto_defecto: e.impuestoDefecto || '13'
  };
}

function mapBootstrap(data) {
  const d = data || {};
  return {
    empresa: mapEmpresa(d.empresa),
    parametros: (d.parametros || []).map(p => ({
      id: p.id,
      tipo: p.tipo,
      nombre: p.nombre,
      valor: p.valor,
      estado: p.estado
    })),
    roles: (d.roles || []).map(r => ({
      id: r.id,
      nombre: r.nombre,
      descripcion: r.descripcion || '',
      usuarios: r.usuarios,
      estado: r.estado
    })),
    usuarios: (d.usuarios || []).map(u => ({
      id: u.id,
      rol_id: u.rolId,
      nombre: u.nombre,
      identificacion: u.identificacion || '',
      usuario: u.usuario,
      rol: u.rol,
      correo: u.correo,
      puesto: u.puesto || '',
      telefono: u.telefono || '',
      direccion: u.direccion || '',
      empleado_area_id: u.empleadoAreaId ?? null,
      contacto_emergencia_nombre: u.contactoEmergenciaNombre || '',
      contacto_emergencia_tel: u.contactoEmergenciaTel || '',
      alergias: u.alergiasMedicamentos || '',
      estado: u.estado,
      ultimo_acceso: u.ultimoAcceso || null
    })),
    empleados: (d.empleados || []).map(e => ({
      id: e.id,
      usuario_id: e.usuarioId ?? null,
      area_id: e.areaId,
      nombre: e.nombre,
      identificacion: e.identificacion,
      puesto: e.puesto,
      telefono: e.telefono,
      correo: e.correo,
      direccion: e.direccion,
      contacto_emergencia_nombre: e.contactoEmergenciaNombre,
      contacto_emergencia_tel: e.contactoEmergenciaTel,
      alergias: e.alergiasMedicamentos,
      padecimientos: e.padecimientos,
      area: e.area,
      estado: e.estado
    })),
    clientes: (d.clientes || []).map(c => ({
      id: c.id,
      nombre: c.nombre,
      identificacion: c.identificacion,
      telefono: c.telefono,
      correo: c.correo,
      estado: c.estado,
      direccion: c.direccion
    })),
    proveedores: (d.proveedores || []).map(p => ({
      id: p.id,
      nombre: p.nombre,
      identificacion: p.identificacion,
      telefono: p.telefono,
      correo: p.correo,
      estado: p.estado,
      direccion: p.direccion
    })),
    productos: (d.productos || []).map(p => ({
      id: p.id,
      categoria_id: p.categoriaId,
      parametros_iva_id: p.parametroIvaId,
      nombre: p.nombre,
      categoria: p.categoria,
      precio_compra: p.precioCompra,
      precio_venta: p.precioVenta,
      iva: p.iva,
      stock: p.stock,
      stock_min: p.stockMin,
      estado: p.estado
    })),
    compras: (d.compras || []).map(c => ({
      orden_compra_id: c.ordenCompraId,
      id: c.id,
      proveedor: c.proveedor,
      fecha: c.fecha,
      total: c.total,
      estado: c.estado,
      items: c.items
    })),
    movimientos: (d.movimientos || []).map(m => ({
      id: m.id,
      producto: m.producto,
      tipo: m.tipo,
      cantidad: m.cantidad,
      stock_post: m.stockPost,
      ref: m.ref,
      fecha: m.fecha,
      motivo: m.motivo
    })),
    pedidos: (d.pedidos || []).map(p => ({
      pedido_id: p.pedidoId,
      id: p.id,
      cliente: p.cliente,
      fecha: p.fecha,
      total: p.total,
      estado: p.estado,
      items: p.items
    })),
    licitaciones: (d.licitaciones || []).map(l => ({
      licitacion_id: l.licitacionId,
      id: l.id,
      institucion: l.institucion,
      contacto: l.contacto,
      estado: l.estado,
      fecha_oferta: l.fechaOferta,
      total: l.total
    })),
    movFinancieros: (d.movFinancieros || []).map(m => ({
      id: m.id,
      fecha: m.fecha,
      tipo: m.tipo,
      categoria: m.categoria,
      descripcion: m.descripcion,
      monto: m.monto,
      ref: m.ref
    })),
    cuentasCobrar: (d.cuentasCobrar || []).map(c => ({
      cuenta_id: c.cuentaCobrarId,
      id: c.id,
      cliente: c.cliente,
      concepto: c.concepto,
      monto: c.monto,
      vencimiento: c.vencimiento,
      estado: c.estado
    })),
    cuentasPagar: (d.cuentasPagar || []).map(c => ({
      cuenta_id: c.cuentaPagarId,
      id: c.id,
      proveedor: c.proveedor,
      concepto: c.concepto,
      monto: c.monto,
      vencimiento: c.vencimiento,
      estado: c.estado
    })),
    historialClientes: d.historialClientes || {},
    areas: (d.areas || []).map(a => ({ id: a.id, nombre: a.nombre })),
    categorias: (d.categorias || []).map(c => ({ id: c.id, nombre: c.nombre })),
    parametrosIva: (d.parametrosIva || []).map(p => ({ id: p.id, nombre: p.nombre, valor: p.valor })),
    modulos: (d.modulos || []).map(m => ({ id: m.id, codigo: m.codigo, nombre: m.nombre })),
    permisosRol: (d.permisosRol || []).map(p => ({
      modulo_id: p.moduloId,
      puedeVer: p.puedeVer,
      puedeCrear: p.puedeCrear,
      puedeEditar: p.puedeEditar,
      puedeElim: p.puedeElim,
      puedeExport: p.puedeExport
    })),
    usuarioId: d.usuarioId || 0,
    rolId: d.rolId || 0,
    predicciones: (d.predicciones || []).map(p => ({
      cliente_id: p.clienteId,
      cliente: p.clienteNombre,
      producto_id: p.productoId,
      producto: p.productoNombre,
      veces: p.vecesPedido,
      prob: p.probabilidadPct,
      confianza: p.nivelConfianza,
      promedio: p.promedioUnidades
    })),
    notificaciones: (d.notificaciones || []).map(n => ({
      id: n.id,
      tipo: n.tipo,
      titulo: n.titulo,
      mensaje: n.mensaje,
      vista: n.vista,
      ref: n.ref,
      licitacion_id: n.licitacionId ?? null,
      recordatorio_id: n.recordatorioId ?? null
    })),
    reportes: {
      ingresos_periodo: d.reportes?.ingresosPeriodo ?? 0,
      egresos_periodo: d.reportes?.egresosPeriodo ?? 0,
      pedidos_activos: d.reportes?.pedidosActivos ?? 0,
      productos_stock_bajo: d.reportes?.productosStockBajo ?? 0,
      licitaciones_adjudicadas: d.reportes?.licitacionesAdjudicadas ?? 0,
      valor_inventario: d.reportes?.valorInventario ?? 0,
      ventas_por_mes: (d.reportes?.ventasPorMes || []).map(v => ({
        mes: v.mes,
        etiqueta: v.etiqueta,
        total: v.total
      })),
      ventas_por_cliente: (d.reportes?.ventasPorCliente || []).map(v => ({
        cliente: v.cliente,
        pedidos: v.pedidos,
        total: v.total
      })),
      productos_mas_vendidos: (d.reportes?.productosMasVendidos || []).map(p => ({
        producto: p.producto,
        categoria: p.categoria,
        unidades: p.unidades,
        ingresos: p.ingresos
      }))
    }
  };
}

async function loadBootstrap() {
  const res = await fetch('/api/spa/bootstrap', { credentials: 'same-origin' });
  if (!res.ok) {
    SGE.Toast.show('No se pudieron cargar los datos del servidor', 'error');
    return false;
  }
  const json = await res.json();
  Object.assign(SGE.DB, mapBootstrap(json));
  if (typeof SGE.applyPermissions === 'function') SGE.applyPermissions();
  if (typeof SGE.Notifications?.syncFromBootstrap === 'function') SGE.Notifications.syncFromBootstrap();
  return true;
}

async function saveEmpresaApi() {
  if (typeof SGE.hasPerm === 'function' && !SGE.hasPerm('ADMINISTRATIVO', 'editar')) {
    SGE.Toast.show('No tiene permisos para editar datos de empresa', 'error');
    return false;
  }
  const e = SGE.DB.empresa;
  const cedulaJuridica = document.getElementById('f-cedula')?.value ?? e.cedula_juridica;
  if (!SGE.Validate.juridica(cedulaJuridica)) {
    SGE.Toast.show('La cédula jurídica debe contener entre 9 y 12 dígitos', 'error');
    return false;
  }
  const body = {
    nombreComercial: document.getElementById('f-ncomer')?.value ?? e.nombre_comercial,
    razonSocial: document.getElementById('f-razon')?.value ?? e.razon_social,
    cedulaJuridica,
    telefono1: document.getElementById('f-tel1')?.value ?? e.telefono1,
    telefono2: document.getElementById('f-tel2')?.value ?? e.telefono2,
    correoPrincipal: document.getElementById('f-email1')?.value ?? e.correo,
    correoAlt: document.getElementById('f-email2')?.value ?? e.correo_alt,
    direccion: document.getElementById('f-dir')?.value ?? e.direccion,
    sitioWeb: document.getElementById('f-web')?.value ?? e.sitio_web,
    impuestoDefecto: document.getElementById('f-iva')?.value ?? e.impuesto_defecto
  };
  if (!body.correoPrincipal || !String(body.correoPrincipal).trim()) {
    SGE.Toast.show('El correo principal es obligatorio', 'error');
    return false;
  }
  if (!SGE.Validate.email(body.correoPrincipal)) {
    SGE.Toast.show('El correo principal no es válido', 'error');
    return false;
  }
  if (body.correoAlt && String(body.correoAlt).trim() && !SGE.Validate.email(body.correoAlt)) {
    SGE.Toast.show('El correo alternativo no es válido', 'error');
    return false;
  }
  const res = await fetch('/api/EmpresaApi', {
    method: 'PUT',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    SGE.Toast.show('No se pudo guardar la empresa', 'error');
    return false;
  }
  await scheduleDataRefresh();
  SGE.Toast.show('Datos de la empresa actualizados');
  return true;
}

const spaBase = '/api/spa';
function resolvePermForRequest(url, method) {
  const m = String(method || 'GET').toUpperCase();
  const path = String(url || '').replace(spaBase, '');
  const is = (rx) => rx.test(path);

  if (m === 'GET' && is(/^\/permisos\/\d+$/)) return { modulo: 'ROLES', accion: 'ver' };
  if (m === 'POST' && is(/^\/roles$/)) return { modulo: 'ROLES', accion: 'crear' };
  if (m === 'PUT' && is(/^\/roles\/\d+$/)) return { modulo: 'ROLES', accion: 'editar' };
  if (m === 'PUT' && is(/^\/roles\/\d+\/permisos$/)) return { modulo: 'ROLES', accion: 'editar' };
  if (m === 'POST' && is(/^\/parametros$/)) return { modulo: 'ADMINISTRATIVO', accion: 'crear' };
  if (m === 'PUT' && is(/^\/parametros\/\d+$/)) return { modulo: 'ADMINISTRATIVO', accion: 'editar' };
  if (m === 'POST' && is(/^\/usuarios$/)) return { modulo: 'USUARIOS', accion: 'crear' };
  if (m === 'PUT' && is(/^\/usuarios\/\d+$/)) return { modulo: 'USUARIOS', accion: 'editar' };
  if (m === 'POST' && is(/^\/empleados$/)) return { modulo: 'EMPLEADOS', accion: 'crear' };
  if (m === 'PUT' && is(/^\/empleados\/\d+$/)) return { modulo: 'EMPLEADOS', accion: 'editar' };
  if (m === 'POST' && is(/^\/clientes$/)) return { modulo: 'CLIENTES', accion: 'crear' };
  if (m === 'PUT' && is(/^\/clientes\/\d+$/)) return { modulo: 'CLIENTES', accion: 'editar' };
  if (m === 'POST' && is(/^\/proveedores$/)) return { modulo: 'PROVEEDORES', accion: 'crear' };
  if (m === 'PUT' && is(/^\/proveedores\/\d+$/)) return { modulo: 'PROVEEDORES', accion: 'editar' };
  if (m === 'POST' && is(/^\/productos$/)) return { modulo: 'INVENTARIO', accion: 'crear' };
  if (m === 'PUT' && is(/^\/productos\/\d+$/)) return { modulo: 'INVENTARIO', accion: 'editar' };
  if (m === 'POST' && is(/^\/ordenes-compra$/)) return { modulo: 'COMPRAS', accion: 'crear' };
  if (m === 'GET' && is(/^\/ordenes-compra\/\d+\/detalle$/)) return { modulo: 'COMPRAS', accion: 'ver' };
  if (m === 'PUT' && is(/^\/ordenes-compra\/\d+$/)) return { modulo: 'COMPRAS', accion: 'editar' };
  if (m === 'POST' && is(/^\/ordenes-compra\/\d+\/(confirmar|cancelar)$/)) return { modulo: 'COMPRAS', accion: 'editar' };
  if (m === 'POST' && is(/^\/pedidos$/)) return { modulo: 'PEDIDOS', accion: 'crear' };
  if (m === 'PUT' && is(/^\/pedidos\/\d+$/)) return { modulo: 'PEDIDOS', accion: 'editar' };
  if (m === 'GET' && is(/^\/pedidos\/\d+\/detalle$/)) return { modulo: 'PEDIDOS', accion: 'ver' };
  if (m === 'POST' && is(/^\/pedidos\/\d+\/(confirmar|cancelar|entregar)$/)) return { modulo: 'PEDIDOS', accion: 'editar' };
  if (m === 'POST' && is(/^\/licitaciones$/)) return { modulo: 'LICITACIONES', accion: 'crear' };
  if (m === 'PUT' && is(/^\/licitaciones\/\d+$/)) return { modulo: 'LICITACIONES', accion: 'editar' };
  if (m === 'GET' && is(/^\/licitaciones\/\d+\/detalle$/)) return { modulo: 'LICITACIONES', accion: 'ver' };
  if (m === 'POST' && is(/^\/licitaciones\/\d+\/recordatorios\/\d+\/marcar-enviado$/)) return { modulo: 'LICITACIONES', accion: 'editar' };
  if ((m === 'POST' || m === 'DELETE') && is(/^\/licitaciones\/\d+\/(documentos|recordatorios)(\/\d+)?(\/upload)?$/)) return { modulo: 'LICITACIONES', accion: 'editar' };
  if (m === 'PUT' && is(/^\/cuentas-(cobrar|pagar)\/\d+\/estado$/)) return { modulo: 'FINANZAS', accion: 'editar' };
  if (m === 'POST' && is(/^\/(cuentas-cobrar|cuentas-pagar|movimientos-financieros)$/)) return { modulo: 'FINANZAS', accion: 'crear' };
  if (m === 'POST' && is(/^\/predicciones\/recalcular$/)) return { modulo: 'PREDICCIONES', accion: 'editar' };
  return null;
}

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const jf = async (url, method, body) => {
  const reqPerm = resolvePermForRequest(url, method);
  if (reqPerm && typeof SGE.hasPerm === 'function' && !SGE.hasPerm(reqPerm.modulo, reqPerm.accion)) {
    throw new Error('No tiene permisos para realizar esta acción.');
  }
  const result = await SGE.Http.jsonFetch(url, method, body);
  if (MUTATING_METHODS.has(String(method || 'GET').toUpperCase())) {
    await scheduleDataRefresh();
  }
  return result;
};

const mutations = {
  putParametro: (id, body) => jf(`${spaBase}/parametros/${id}`, 'PUT', body),
  postParametro: (body) => jf(`${spaBase}/parametros`, 'POST', body),
  postRol: (body) => jf(`${spaBase}/roles`, 'POST', body),
  putRol: (id, body) => jf(`${spaBase}/roles/${id}`, 'PUT', body),
  putPermisosRol: (id, body) => jf(`${spaBase}/roles/${id}/permisos`, 'PUT', body),
  getPermisosRol: async (id) => {
    const r = await fetch(`${spaBase}/permisos/${id}`, { credentials: 'same-origin' });
    if (!r.ok) throw new Error('No se pudieron cargar permisos');
    return r.json();
  },
  postUsuario: (body) => jf(`${spaBase}/usuarios`, 'POST', body),
  putUsuario: (id, body) => jf(`${spaBase}/usuarios/${id}`, 'PUT', body),
  postEmpleado: (body) => jf(`${spaBase}/empleados`, 'POST', body),
  putEmpleado: (id, body) => jf(`${spaBase}/empleados/${id}`, 'PUT', body),
  putEmpleadoYo: (body) => jf(`${spaBase}/empleados/yo`, 'PUT', body),
  postCliente: (body) => jf(`${spaBase}/clientes`, 'POST', body),
  putCliente: (id, body) => jf(`${spaBase}/clientes/${id}`, 'PUT', body),
  postProveedor: (body) => jf(`${spaBase}/proveedores`, 'POST', body),
  putProveedor: (id, body) => jf(`${spaBase}/proveedores/${id}`, 'PUT', body),
  postProducto: (body) => jf(`${spaBase}/productos`, 'POST', body),
  putProducto: (id, body) => jf(`${spaBase}/productos/${id}`, 'PUT', body),
  postOrdenCompra: (body) => jf(`${spaBase}/ordenes-compra`, 'POST', body),
  getOrdenCompraDetalle: (id) => jf(`${spaBase}/ordenes-compra/${id}/detalle`, 'GET', null),
  putOrdenCompra: (id, body) => jf(`${spaBase}/ordenes-compra/${id}`, 'PUT', body),
  confirmarOrdenCompra: (id) => jf(`${spaBase}/ordenes-compra/${id}/confirmar`, 'POST', null),
  cancelarOrdenCompra: (id) => jf(`${spaBase}/ordenes-compra/${id}/cancelar`, 'POST', null),
  postPedido: (body) => jf(`${spaBase}/pedidos`, 'POST', body),
  putPedido: (id, body) => jf(`${spaBase}/pedidos/${id}`, 'PUT', body),
  getPedidoDetalle: (id) => jf(`${spaBase}/pedidos/${id}/detalle`, 'GET', null),
  confirmarPedido: (id) => jf(`${spaBase}/pedidos/${id}/confirmar`, 'POST', null),
  entregarPedido: (id) => jf(`${spaBase}/pedidos/${id}/entregar`, 'POST', null),
  cancelarPedido: (id, motivo) => jf(`${spaBase}/pedidos/${id}/cancelar`, 'POST', { motivo: motivo || '' }),
  postLicitacion: (body) => jf(`${spaBase}/licitaciones`, 'POST', body),
  putLicitacion: (id, body) => jf(`${spaBase}/licitaciones/${id}`, 'PUT', body),
  getLicitacionDetalle: (id) => jf(`${spaBase}/licitaciones/${id}/detalle`, 'GET', null),
  postLicitacionDocumento: (id, body) => jf(`${spaBase}/licitaciones/${id}/documentos`, 'POST', body),
  uploadLicitacionDocumento: async (licId, file, tipoDocumento) => {
    const fd = new FormData();
    fd.append('file', file);
    if (tipoDocumento) fd.append('tipoDocumento', tipoDocumento);
    const res = await fetch(`${spaBase}/licitaciones/${licId}/documentos/upload`, {
      method: 'POST',
      credentials: 'same-origin',
      body: fd
    });
    if (!res.ok) {
      let msg = res.statusText;
      try {
        const j = await res.json();
        if (j.error) msg = j.error;
      } catch (_) { /* ignore */ }
      throw new Error(msg);
    }
    const data = await res.json();
    await scheduleDataRefresh();
    return data;
  },
  deleteLicitacionDocumento: (id, documentoId) => jf(`${spaBase}/licitaciones/${id}/documentos/${documentoId}`, 'DELETE', null),
  postLicitacionRecordatorio: (id, body) => jf(`${spaBase}/licitaciones/${id}/recordatorios`, 'POST', body),
  deleteLicitacionRecordatorio: (id, recordatorioId) => jf(`${spaBase}/licitaciones/${id}/recordatorios/${recordatorioId}`, 'DELETE', null),
  postLicitacionRecordatorioMarcarEnviado: (licId, recordatorioId) =>
    jf(`${spaBase}/licitaciones/${licId}/recordatorios/${recordatorioId}/marcar-enviado`, 'POST', {}),
  putCuentaCobrarEstado: (id, estado) => jf(`${spaBase}/cuentas-cobrar/${id}/estado`, 'PUT', { estado }),
  putCuentaPagarEstado: (id, estado) => jf(`${spaBase}/cuentas-pagar/${id}/estado`, 'PUT', { estado }),
  postCuentaCobrar: (body) => jf(`${spaBase}/cuentas-cobrar`, 'POST', body),
  postCuentaPagar: (body) => jf(`${spaBase}/cuentas-pagar`, 'POST', body),
  postMovFin: (body) => jf(`${spaBase}/movimientos-financieros`, 'POST', body),
  recalcularPredicciones: () => jf(`${spaBase}/predicciones/recalcular`, 'POST', null)
};

let _dataRefreshPromise = null;

/** Recarga bootstrap y repinta la vista actual (una sola vez si hay varias mutaciones seguidas). */
async function scheduleDataRefresh() {
  if (_dataRefreshPromise) return _dataRefreshPromise;
  _dataRefreshPromise = (async () => {
    try {
      await loadBootstrap();
      if (typeof SGE.Router?.refresh === 'function') {
        await SGE.Router.refresh();
      }
    } finally {
      _dataRefreshPromise = null;
    }
  })();
  return _dataRefreshPromise;
}

async function reloadAfterMutation() {
  return scheduleDataRefresh();
}

SGE.Api = {
  loadBootstrap,
  mapBootstrap,
  saveEmpresaApi,
  jsonFetch: SGE.Http.jsonFetch,
  mutations,
  reloadAfterMutation
};
