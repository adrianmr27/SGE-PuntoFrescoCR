namespace SGE_PuntoFrescoCRBLL.Dtos;

public class EmpleadoCreateDto
{
    public int AreaId { get; set; }
    public string NombreCompleto { get; set; } = "";
    public string Identificacion { get; set; } = "";
    public string Puesto { get; set; } = "";
    public string? Telefono { get; set; }
    public string? Correo { get; set; }
    public string? Direccion { get; set; }
    public string? ContactoEmergenciaNombre { get; set; }
    public string? ContactoEmergenciaTel { get; set; }
    public string? AlergiasMedicamentos { get; set; }
    public string? Padecimientos { get; set; }
    public bool Activo { get; set; } = true;
}

public class EmpleadoUpdateDto : EmpleadoCreateDto { }

public class EmpleadoSelfUpdateDto
{
    public string? Telefono { get; set; }
    public string? Correo { get; set; }
    public string? ContactoEmergenciaNombre { get; set; }
    public string? ContactoEmergenciaTel { get; set; }
    public string? AlergiasMedicamentos { get; set; }
    public string? Padecimientos { get; set; }
}
