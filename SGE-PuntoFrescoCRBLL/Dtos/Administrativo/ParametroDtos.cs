namespace SGE_PuntoFrescoCRBLL.Dtos;

public class ParametroMutateDto
{
    public string Valor { get; set; } = "";
    public bool Activo { get; set; } = true;
}

public class ParametroCreateDto
{
    public string Tipo { get; set; } = "";
    public string Nombre { get; set; } = "";
    public string Valor { get; set; } = "";
    public string? Descripcion { get; set; }
    public bool Activo { get; set; } = true;
}
