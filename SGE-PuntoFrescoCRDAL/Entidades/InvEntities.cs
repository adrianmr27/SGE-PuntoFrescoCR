namespace SGE_PuntoFrescoCRDAL.Entidades;

public class Categoria
{
    public int CategoriaId { get; set; }
    public string Nombre { get; set; } = null!;
    public bool Activo { get; set; }

    public ICollection<Producto> Productos { get; set; } = new List<Producto>();
}

public class Producto
{
    public int ProductoId { get; set; }
    public int CategoriaId { get; set; }
    public int ParametroIvaId { get; set; }
    public string Nombre { get; set; } = null!;
    public string? Descripcion { get; set; }
    public decimal PrecioCompra { get; set; }
    public decimal PrecioVenta { get; set; }
    public int Stock { get; set; }
    public int StockMinimo { get; set; }
    public bool Activo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Categoria Categoria { get; set; } = null!;
    public Parametro ParametroIva { get; set; } = null!;
}

public class MovimientoInventario
{
    public long MovimientoId { get; set; }
    public int ProductoId { get; set; }
    public int? UsuarioId { get; set; }
    public string TipoMov { get; set; } = null!;
    public int Cantidad { get; set; }
    public int StockAnterior { get; set; }
    public int StockPosterior { get; set; }
    public string? OrigenTipo { get; set; }
    public int? OrigenId { get; set; }
    public string? Observacion { get; set; }
    public DateTime FechaMovimiento { get; set; }

    public Producto Producto { get; set; } = null!;
    public Usuario? Usuario { get; set; }
}
