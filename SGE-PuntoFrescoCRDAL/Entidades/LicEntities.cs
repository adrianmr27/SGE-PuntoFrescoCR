namespace SGE_PuntoFrescoCRDAL.Entidades;

public class Licitacion
{
    public int LicitacionId { get; set; }
    public int UsuarioId { get; set; }
    public string Codigo { get; set; } = null!;
    public string Institucion { get; set; } = null!;
    public string? ContactoNombre { get; set; }
    public string? ContactoTelefono { get; set; }
    public string? ContactoCorreo { get; set; }
    public string Descripcion { get; set; } = null!;
    public string Estado { get; set; } = null!;
    public DateTime? FechaLimiteConsultas { get; set; }
    public DateTime? FechaEnvioOferta { get; set; }
    public DateTime? FechaEntrega { get; set; }
    public decimal Subtotal { get; set; }
    public decimal MontoIVA { get; set; }
    public decimal TotalOferta { get; set; }
    public string? DatosLegalesSnapshot { get; set; }
    public string? Observaciones { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Usuario Usuario { get; set; } = null!;
    public ICollection<LicitacionDetalle> Detalles { get; set; } = new List<LicitacionDetalle>();
    public ICollection<LicitacionDocumento> Documentos { get; set; } = new List<LicitacionDocumento>();
    public ICollection<LicitacionRecordatorio> Recordatorios { get; set; } = new List<LicitacionRecordatorio>();
}

public class LicitacionDetalle
{
    public int DetalleId { get; set; }
    public int LicitacionId { get; set; }
    public int? ProductoId { get; set; }
    public string Descripcion { get; set; } = null!;
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal PorcentajeIVA { get; set; }
    public decimal Subtotal { get; set; }
    public decimal MontoIVA { get; set; }
    public decimal Total { get; set; }

    public Licitacion Licitacion { get; set; } = null!;
    public Producto? Producto { get; set; }
}

public class LicitacionDocumento
{
    public int DocumentoId { get; set; }
    public int LicitacionId { get; set; }
    public int UsuarioId { get; set; }
    public string TipoDocumento { get; set; } = null!;
    public string NombreArchivo { get; set; } = null!;
    public string RutaArchivo { get; set; } = null!;
    public int? TamanoKB { get; set; }
    public string? MimeType { get; set; }
    public DateTime FechaSubida { get; set; }

    public Licitacion Licitacion { get; set; } = null!;
    public Usuario Usuario { get; set; } = null!;
}

public class LicitacionRecordatorio
{
    public int RecordatorioId { get; set; }
    public int LicitacionId { get; set; }
    public string Titulo { get; set; } = null!;
    public DateTime FechaRecordatorio { get; set; }
    public bool Enviado { get; set; }
    public DateTime? FechaEnvio { get; set; }

    public Licitacion Licitacion { get; set; } = null!;
}
