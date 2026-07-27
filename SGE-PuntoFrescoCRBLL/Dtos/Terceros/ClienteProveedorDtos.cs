using System.ComponentModel.DataAnnotations;

namespace SGE_PuntoFrescoCRBLL.Dtos;

public class ClienteCreateDto
{
    [Required(ErrorMessage = "El nombre es obligatorio."), StringLength(150, MinimumLength = 2)]
    public string Nombre { get; set; } = "";

    [Required(ErrorMessage = "La identificación es obligatoria."), StringLength(30, MinimumLength = 3)]
    public string Identificacion { get; set; } = "";

    [StringLength(30)]
    public string? Telefono { get; set; }

    [EmailAddress(ErrorMessage = "El correo no tiene un formato válido."), StringLength(150)]
    public string? Correo { get; set; }

    [StringLength(250)]
    public string? Direccion { get; set; }

    public bool Activo { get; set; } = true;
}

public class ClienteUpdateDto : ClienteCreateDto { }

public class ProveedorCreateDto
{
    [Required(ErrorMessage = "El nombre es obligatorio."), StringLength(150, MinimumLength = 2)]
    public string Nombre { get; set; } = "";

    [Required(ErrorMessage = "La identificación es obligatoria."), StringLength(30, MinimumLength = 3)]
    public string Identificacion { get; set; } = "";

    [StringLength(30)]
    public string? Telefono { get; set; }

    [EmailAddress(ErrorMessage = "El correo no tiene un formato válido."), StringLength(150)]
    public string? Correo { get; set; }

    [StringLength(250)]
    public string? Direccion { get; set; }

    public bool Activo { get; set; } = true;
}

public class ProveedorUpdateDto : ProveedorCreateDto { }
