namespace SGE_PuntoFrescoCRBLL.Dtos;

public class LicitacionDetalleDto
{
    public int? ProductoId { get; set; }
    public string Descripcion { get; set; } = "";
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal PorcentajeIVA { get; set; } = 13;
}

public class LicitacionCreateDto
{
    public string Institucion { get; set; } = "";
    public string? ContactoNombre { get; set; }
    public string? ContactoTelefono { get; set; }
    public string? ContactoCorreo { get; set; }
    public string Descripcion { get; set; } = "";
    public string Estado { get; set; } = "Analisis";
    public DateTime? FechaLimiteConsultas { get; set; }
    public DateTime? FechaEnvioOferta { get; set; }
    public DateTime? FechaEntrega { get; set; }
    public string? Observaciones { get; set; }
    public List<LicitacionDetalleDto> Lineas { get; set; } = new();
}

public class LicitacionDocumentoCreateDto
{
    public string TipoDocumento { get; set; } = "";
    public string NombreArchivo { get; set; } = "";
    public string RutaArchivo { get; set; } = "";
    public int? TamanoKB { get; set; }
    public string? MimeType { get; set; }
}

public class LicitacionRecordatorioCreateDto
{
    public string Titulo { get; set; } = "";
    public DateTime FechaRecordatorio { get; set; }
}

public class LicitacionDocumentoDto
{
    public int DocumentoId { get; set; }
    public string TipoDocumento { get; set; } = "";
    public string NombreArchivo { get; set; } = "";
    public string RutaArchivo { get; set; } = "";
    public int? TamanoKB { get; set; }
    public string? MimeType { get; set; }
    public DateTime FechaSubida { get; set; }
}

public class LicitacionRecordatorioDto
{
    public int RecordatorioId { get; set; }
    public string Titulo { get; set; } = "";
    public DateTime FechaRecordatorio { get; set; }
    public bool Enviado { get; set; }
}

public class LicitacionDetalleCompletoDto
{
    public int LicitacionId { get; set; }
    public string Codigo { get; set; } = "";
    public string Institucion { get; set; } = "";
    public string? ContactoNombre { get; set; }
    public string? ContactoTelefono { get; set; }
    public string? ContactoCorreo { get; set; }
    public string Descripcion { get; set; } = "";
    public string Estado { get; set; } = "";
    public DateTime? FechaLimiteConsultas { get; set; }
    public DateTime? FechaEnvioOferta { get; set; }
    public DateTime? FechaEntrega { get; set; }
    public string? Observaciones { get; set; }
    public decimal Subtotal { get; set; }
    public decimal MontoIVA { get; set; }
    public decimal TotalOferta { get; set; }
    public List<LicitacionDetalleDto> Lineas { get; set; } = new();
    public List<LicitacionDocumentoDto> Documentos { get; set; } = new();
    public List<LicitacionRecordatorioDto> Recordatorios { get; set; } = new();
}
