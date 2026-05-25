namespace SGE_PuntoFrescoCRBLL.Dtos;

public class OrdenCompraLineaDto
{
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal PorcentajeIVA { get; set; } = 13;
}

public class OrdenCompraCreateDto
{
    public int ProveedorId { get; set; }
    public DateTime? FechaOrden { get; set; }
    public string? Observaciones { get; set; }
    public List<OrdenCompraLineaDto> Lineas { get; set; } = new();
}

public class OrdenCompraDetalleLineaDto
{
    public int ProductoId { get; set; }
    public string Producto { get; set; } = "";
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal PorcentajeIVA { get; set; }
    public decimal Subtotal { get; set; }
    public decimal MontoIVA { get; set; }
    public decimal Total { get; set; }
}

public class OrdenCompraDetalleDto
{
    public int OrdenCompraId { get; set; }
    public string NumeroOrden { get; set; } = "";
    public int ProveedorId { get; set; }
    public string Proveedor { get; set; } = "";
    public DateTime FechaOrden { get; set; }
    public string Estado { get; set; } = "";
    public string? Observaciones { get; set; }
    public decimal Subtotal { get; set; }
    public decimal MontoIVA { get; set; }
    public decimal Total { get; set; }
    public List<OrdenCompraDetalleLineaDto> Lineas { get; set; } = new();
}
