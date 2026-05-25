namespace SGE_PuntoFrescoCRBLL.Dtos;

public class CuentaEstadoDto
{
    public string Estado { get; set; } = "";
}

public class MovimientoFinancieroManualDto
{
    public string Tipo { get; set; } = "";
    public string Categoria { get; set; } = "";
    public string Descripcion { get; set; } = "";
    public decimal Monto { get; set; }
    public DateTime? FechaMovimiento { get; set; }
}

public class CuentaCobrarCreateDto
{
    public int ClienteId { get; set; }
    public string Concepto { get; set; } = "";
    public decimal Monto { get; set; }
    public DateTime Vencimiento { get; set; }
    public string? Observacion { get; set; }
}

public class CuentaPagarCreateDto
{
    public int? ProveedorId { get; set; }
    public string Concepto { get; set; } = "";
    public decimal Monto { get; set; }
    public DateTime Vencimiento { get; set; }
    public string? Observacion { get; set; }
}
