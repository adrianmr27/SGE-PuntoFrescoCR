namespace SGE_PuntoFrescoCRBLL.Dtos;

public class SpaBootstrapDto
{
    public EmpresaClienteDto Empresa { get; set; } = new();
    public int UsuarioId { get; set; }
    public int RolId { get; set; }
    public List<PermisoRolDto> PermisosRol { get; set; } = new();
    public List<ParametroClienteDto> Parametros { get; set; } = new();
    public List<RolClienteDto> Roles { get; set; } = new();
    public List<UsuarioClienteDto> Usuarios { get; set; } = new();
    public List<EmpleadoClienteDto> Empleados { get; set; } = new();
    public List<ClienteClienteDto> Clientes { get; set; } = new();
    public List<ProveedorClienteDto> Proveedores { get; set; } = new();
    public List<ProductoClienteDto> Productos { get; set; } = new();
    public List<CompraClienteDto> Compras { get; set; } = new();
    public List<MovimientoInvClienteDto> Movimientos { get; set; } = new();
    public List<PedidoClienteDto> Pedidos { get; set; } = new();
    public List<LicitacionClienteDto> Licitaciones { get; set; } = new();
    public List<MovFinClienteDto> MovFinancieros { get; set; } = new();
    public List<CuentaCobrarClienteDto> CuentasCobrar { get; set; } = new();
    public List<CuentaPagarClienteDto> CuentasPagar { get; set; } = new();
    public Dictionary<string, List<HistorialMesDto>> HistorialClientes { get; set; } = new();
    public List<AreaClienteDto> Areas { get; set; } = new();
    public List<CategoriaClienteDto> Categorias { get; set; } = new();
    public List<ParametroIvaOptionDto> ParametrosIva { get; set; } = new();
    public List<ModuloClienteDto> Modulos { get; set; } = new();
    public ReportesBootstrapDto Reportes { get; set; } = new();
    public List<PrediccionBootstrapDto> Predicciones { get; set; } = new();
    public List<NotificacionClienteDto> Notificaciones { get; set; } = new();
}

public class NotificacionClienteDto
{
    public string Id { get; set; } = "";
    public string Tipo { get; set; } = "";
    public string Titulo { get; set; } = "";
    public string Mensaje { get; set; } = "";
    public string? Vista { get; set; }
    public string? Ref { get; set; }
    /// <summary>Para marcar recordatorio como notificado (evitar alertas duplicadas).</summary>
    public int? LicitacionId { get; set; }
    public int? RecordatorioId { get; set; }
}

public class EmpresaClienteDto { public string NombreComercial { get; set; } = ""; public string RazonSocial { get; set; } = ""; public string CedulaJuridica { get; set; } = ""; public string Telefono1 { get; set; } = ""; public string? Telefono2 { get; set; } public string Correo { get; set; } = ""; public string? CorreoAlt { get; set; } public string Direccion { get; set; } = ""; public string? SitioWeb { get; set; } public string ImpuestoDefecto { get; set; } = "13"; }
public class ParametroClienteDto { public int Id { get; set; } public string Tipo { get; set; } = ""; public string Nombre { get; set; } = ""; public string Valor { get; set; } = ""; public string Estado { get; set; } = "Activo"; }
public class RolClienteDto { public int Id { get; set; } public string Nombre { get; set; } = ""; public string? Descripcion { get; set; } public int Usuarios { get; set; } public string Estado { get; set; } = "Activo"; }
public class UsuarioClienteDto { public int Id { get; set; } public int RolId { get; set; } public string Nombre { get; set; } = ""; public string Identificacion { get; set; } = ""; public string Usuario { get; set; } = ""; public string Rol { get; set; } = ""; public string Correo { get; set; } = ""; public string? Puesto { get; set; } public string? Telefono { get; set; } public string? Direccion { get; set; } public int? EmpleadoAreaId { get; set; } public string? ContactoEmergenciaNombre { get; set; } public string? ContactoEmergenciaTel { get; set; } public string? AlergiasMedicamentos { get; set; } public string Estado { get; set; } = "Activo"; public string? UltimoAcceso { get; set; } }
public class EmpleadoClienteDto { public int Id { get; set; } public int? UsuarioId { get; set; } public int AreaId { get; set; } public string Nombre { get; set; } = ""; public string Identificacion { get; set; } = ""; public string Puesto { get; set; } = ""; public string? Telefono { get; set; } public string? Correo { get; set; } public string? Direccion { get; set; } public string? ContactoEmergenciaNombre { get; set; } public string? ContactoEmergenciaTel { get; set; } public string? AlergiasMedicamentos { get; set; } public string? Padecimientos { get; set; } public string Area { get; set; } = ""; public string Estado { get; set; } = "Activo"; }
public class ClienteClienteDto { public int Id { get; set; } public string Nombre { get; set; } = ""; public string Identificacion { get; set; } = ""; public string? Telefono { get; set; } public string? Correo { get; set; } public string Estado { get; set; } = "Activo"; public string? Direccion { get; set; } }
public class ProveedorClienteDto { public int Id { get; set; } public string Nombre { get; set; } = ""; public string Identificacion { get; set; } = ""; public string? Telefono { get; set; } public string? Correo { get; set; } public string Estado { get; set; } = "Activo"; public string? Direccion { get; set; } }
public class ProductoClienteDto { public int Id { get; set; } public int CategoriaId { get; set; } public int ParametroIvaId { get; set; } public string Nombre { get; set; } = ""; public string Categoria { get; set; } = ""; public decimal PrecioCompra { get; set; } public decimal PrecioVenta { get; set; } public string Iva { get; set; } = "13%"; public int Stock { get; set; } public int StockMin { get; set; } public string Estado { get; set; } = "Activo"; }
public class CompraClienteDto { public int OrdenCompraId { get; set; } public string Id { get; set; } = ""; public string Proveedor { get; set; } = ""; public string Fecha { get; set; } = ""; public decimal Total { get; set; } public string Estado { get; set; } = ""; public int Items { get; set; } }
public class MovimientoInvClienteDto { public long Id { get; set; } public string Producto { get; set; } = ""; public string Tipo { get; set; } = ""; public int Cantidad { get; set; } public int StockPost { get; set; } public string Ref { get; set; } = ""; public string Fecha { get; set; } = ""; public string Motivo { get; set; } = ""; }
public class PedidoClienteDto { public int PedidoId { get; set; } public string Id { get; set; } = ""; public string Cliente { get; set; } = ""; public string Fecha { get; set; } = ""; public decimal Total { get; set; } public string Estado { get; set; } = ""; public int Items { get; set; } }
public class LicitacionClienteDto { public int LicitacionId { get; set; } public string Id { get; set; } = ""; public string Institucion { get; set; } = ""; public string Contacto { get; set; } = ""; public string Estado { get; set; } = ""; public string FechaOferta { get; set; } = ""; public decimal Total { get; set; } }
public class MovFinClienteDto { public string Id { get; set; } = ""; public string Fecha { get; set; } = ""; public string Tipo { get; set; } = ""; public string Categoria { get; set; } = ""; public string Descripcion { get; set; } = ""; public decimal Monto { get; set; } public string Ref { get; set; } = ""; }
public class CuentaCobrarClienteDto { public int CuentaCobrarId { get; set; } public string Id { get; set; } = ""; public string Cliente { get; set; } = ""; public string Concepto { get; set; } = ""; public decimal Monto { get; set; } public string Vencimiento { get; set; } = ""; public string Estado { get; set; } = ""; }
public class CuentaPagarClienteDto { public int CuentaPagarId { get; set; } public string Id { get; set; } = ""; public string Proveedor { get; set; } = ""; public string Concepto { get; set; } = ""; public decimal Monto { get; set; } public string Vencimiento { get; set; } = ""; public string Estado { get; set; } = ""; }
public class HistorialMesDto { public string Mes { get; set; } = ""; public List<string> Productos { get; set; } = new(); public decimal Total { get; set; } }
public class EmpresaUpdateDto { public string NombreComercial { get; set; } = ""; public string RazonSocial { get; set; } = ""; public string CedulaJuridica { get; set; } = ""; public string Telefono1 { get; set; } = ""; public string? Telefono2 { get; set; } public string CorreoPrincipal { get; set; } = ""; public string? CorreoAlt { get; set; } public string Direccion { get; set; } = ""; public string? SitioWeb { get; set; } public string ImpuestoDefecto { get; set; } = "13"; }
public class AreaClienteDto { public int Id { get; set; } public string Nombre { get; set; } = ""; }
public class CategoriaClienteDto { public int Id { get; set; } public string Nombre { get; set; } = ""; }
public class ParametroIvaOptionDto { public int Id { get; set; } public string Nombre { get; set; } = ""; public string Valor { get; set; } = ""; }
public class ModuloClienteDto { public int Id { get; set; } public string Codigo { get; set; } = ""; public string Nombre { get; set; } = ""; }
public class ReportesBootstrapDto { public decimal IngresosPeriodo { get; set; } public decimal EgresosPeriodo { get; set; } public int PedidosActivos { get; set; } public int ProductosStockBajo { get; set; } public int LicitacionesAdjudicadas { get; set; } public decimal ValorInventario { get; set; } public List<VentaMesReporteDto> VentasPorMes { get; set; } = new(); public List<VentaClienteReporteDto> VentasPorCliente { get; set; } = new(); public List<ProductoVendidoReporteDto> ProductosMasVendidos { get; set; } = new(); }
public class VentaMesReporteDto { public string Mes { get; set; } = ""; public string Etiqueta { get; set; } = ""; public decimal Total { get; set; } }
public class VentaClienteReporteDto { public string Cliente { get; set; } = ""; public int Pedidos { get; set; } public decimal Total { get; set; } }
public class ProductoVendidoReporteDto { public string Producto { get; set; } = ""; public string Categoria { get; set; } = ""; public int Unidades { get; set; } public decimal Ingresos { get; set; } }
public class PrediccionBootstrapDto { public int ClienteId { get; set; } public string ClienteNombre { get; set; } = ""; public int ProductoId { get; set; } public string ProductoNombre { get; set; } = ""; public int VecesPedido { get; set; } public decimal ProbabilidadPct { get; set; } public string NivelConfianza { get; set; } = ""; public decimal? PromedioUnidades { get; set; } }
