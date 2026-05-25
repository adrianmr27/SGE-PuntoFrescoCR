namespace SGE_PuntoFrescoCRDAL.Entidades;

public class Cliente
{
    public int ClienteId { get; set; }
    public string Nombre { get; set; } = null!;
    public string Identificacion { get; set; } = null!;
    public string? Telefono { get; set; }
    public string? Correo { get; set; }
    public string? Direccion { get; set; }
    public bool Activo { get; set; }
    public DateTime? FechaUltimoPedido { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class Proveedor
{
    public int ProveedorId { get; set; }
    public string Nombre { get; set; } = null!;
    public string Identificacion { get; set; } = null!;
    public string? Telefono { get; set; }
    public string? Correo { get; set; }
    public string? Direccion { get; set; }
    public bool Activo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class OrdenCompra
{
    public int OrdenCompraId { get; set; }
    public int ProveedorId { get; set; }
    public int UsuarioId { get; set; }
    public string NumeroOrden { get; set; } = null!;
    public DateTime FechaOrden { get; set; }
    public DateTime? FechaEntrega { get; set; }
    public string Estado { get; set; } = null!;
    public decimal Subtotal { get; set; }
    public decimal MontoIVA { get; set; }
    public decimal Total { get; set; }
    public string? Observaciones { get; set; }
    public DateTime? FechaConfirmacion { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Proveedor Proveedor { get; set; } = null!;
    public Usuario Usuario { get; set; } = null!;
    public ICollection<OrdenCompraDetalle> Detalles { get; set; } = new List<OrdenCompraDetalle>();
}

public class OrdenCompraDetalle
{
    public int DetalleId { get; set; }
    public int OrdenCompraId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal PorcentajeIVA { get; set; }
    public decimal Subtotal { get; set; }
    public decimal MontoIVA { get; set; }
    public decimal Total { get; set; }

    public OrdenCompra OrdenCompra { get; set; } = null!;
    public Producto Producto { get; set; } = null!;
}
