namespace SGE_PuntoFrescoCRDAL.Entidades;

public class MovimientoFinanciero
{
    public long MovFinancieroId { get; set; }
    public int? UsuarioId { get; set; }
    public string Tipo { get; set; } = null!;
    public string Categoria { get; set; } = null!;
    public string Descripcion { get; set; } = null!;
    public decimal Monto { get; set; }
    public string? OrigenTipo { get; set; }
    public int? OrigenId { get; set; }
    public DateTime FechaMovimiento { get; set; }
    public string? Observacion { get; set; }
    public DateTime CreatedAt { get; set; }

    public Usuario? Usuario { get; set; }
}

public class CuentaCobrar
{
    public int CuentaCobrarId { get; set; }
    public int ClienteId { get; set; }
    public int? UsuarioId { get; set; }
    public string Concepto { get; set; } = null!;
    public string? OrigenTipo { get; set; }
    public int? OrigenId { get; set; }
    public decimal Monto { get; set; }
    public DateTime Vencimiento { get; set; }
    public string Estado { get; set; } = null!;
    public DateTime? FechaPago { get; set; }
    public string? Observacion { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Cliente Cliente { get; set; } = null!;
    public Usuario? Usuario { get; set; }
}

public class CuentaPagar
{
    public int CuentaPagarId { get; set; }
    public int? ProveedorId { get; set; }
    public int? UsuarioId { get; set; }
    public string Concepto { get; set; } = null!;
    public string? OrigenTipo { get; set; }
    public int? OrigenId { get; set; }
    public decimal Monto { get; set; }
    public DateTime Vencimiento { get; set; }
    public string Estado { get; set; } = null!;
    public DateTime? FechaPago { get; set; }
    public string? Observacion { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Proveedor? Proveedor { get; set; }
    public Usuario? Usuario { get; set; }
}

public class PrediccionCompra
{
    public int PrediccionId { get; set; }
    public int ClienteId { get; set; }
    public int ProductoId { get; set; }
    public int VecesPedido { get; set; }
    public int TotalMesesAnalisis { get; set; }
    public decimal ProbabilidadPct { get; set; }
    public string NivelConfianza { get; set; } = null!;
    public decimal? PromedioUnidades { get; set; }
    public DateTime FechaCalculo { get; set; }

    public Cliente Cliente { get; set; } = null!;
    public Producto Producto { get; set; } = null!;
}
