namespace SGE_PuntoFrescoCRBLL.Dtos;

public class PedidoLineaDto
{
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal PorcentajeIVA { get; set; } = 13;
}

public class PedidoCreateDto
{
    public int ClienteId { get; set; }
    public DateTime? FechaPedido { get; set; }
    public string? DireccionEntrega { get; set; }
    public string? Observaciones { get; set; }
    public List<PedidoLineaDto> Lineas { get; set; } = new();
}

public class PedidoUpdateDto
{
    public int ClienteId { get; set; }
    public string? DireccionEntrega { get; set; }
    public string? Observaciones { get; set; }
    public List<PedidoLineaDto> Lineas { get; set; } = new();
}

public class PedidoDetalleLineaDto
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

public class PedidoDetalleDto
{
    public int PedidoId { get; set; }
    public string NumeroPedido { get; set; } = "";
    public int ClienteId { get; set; }
    public string Cliente { get; set; } = "";
    public DateTime FechaPedido { get; set; }
    public string Estado { get; set; } = "";
    public string? DireccionEntrega { get; set; }
    public decimal Subtotal { get; set; }
    public decimal MontoIVA { get; set; }
    public decimal Total { get; set; }
    public List<PedidoDetalleLineaDto> Lineas { get; set; } = new();
}

public class PedidoCancelarDto
{
    public string? Motivo { get; set; }
}
