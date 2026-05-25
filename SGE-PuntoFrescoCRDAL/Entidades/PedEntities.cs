namespace SGE_PuntoFrescoCRDAL.Entidades;

public class Pedido
{
    public int PedidoId { get; set; }
    public int ClienteId { get; set; }
    public int UsuarioId { get; set; }
    public string NumeroPedido { get; set; } = null!;
    public DateTime FechaPedido { get; set; }
    public DateTime? FechaEntrega { get; set; }
    public string Estado { get; set; } = null!;
    public decimal Subtotal { get; set; }
    public decimal MontoIVA { get; set; }
    public decimal Total { get; set; }
    public string? DireccionEntrega { get; set; }
    public string? Observaciones { get; set; }
    public DateTime? FechaConfirmacion { get; set; }
    public DateTime? FechaCancelacion { get; set; }
    public string? MotivoCancelacion { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Cliente Cliente { get; set; } = null!;
    public Usuario Usuario { get; set; } = null!;
    public ICollection<PedidoDetalle> Detalles { get; set; } = new List<PedidoDetalle>();
}

public class PedidoDetalle
{
    public int DetalleId { get; set; }
    public int PedidoId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal PorcentajeIVA { get; set; }
    public decimal Subtotal { get; set; }
    public decimal MontoIVA { get; set; }
    public decimal Total { get; set; }

    public Pedido Pedido { get; set; } = null!;
    public Producto Producto { get; set; } = null!;
}
