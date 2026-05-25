namespace SGE_PuntoFrescoCRBLL.Dtos;

public class ClienteCreateDto
{
    public string Nombre { get; set; } = "";
    public string Identificacion { get; set; } = "";
    public string? Telefono { get; set; }
    public string? Correo { get; set; }
    public string? Direccion { get; set; }
    public bool Activo { get; set; } = true;
}

public class ClienteUpdateDto : ClienteCreateDto { }

public class ProveedorCreateDto
{
    public string Nombre { get; set; } = "";
    public string Identificacion { get; set; } = "";
    public string? Telefono { get; set; }
    public string? Correo { get; set; }
    public string? Direccion { get; set; }
    public bool Activo { get; set; } = true;
}

public class ProveedorUpdateDto : ProveedorCreateDto { }
