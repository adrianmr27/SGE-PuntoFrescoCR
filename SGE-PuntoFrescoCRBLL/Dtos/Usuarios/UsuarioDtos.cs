namespace SGE_PuntoFrescoCRBLL.Dtos;

public class UsuarioCreateDto
{
    public int RolId { get; set; }
    public string NombreCompleto { get; set; } = "";
    public string Identificacion { get; set; } = "";
    public string NombreUsuario { get; set; } = "";
    public string Correo { get; set; } = "";
    public string Password { get; set; } = "";
    public string? Puesto { get; set; }
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public bool Activo { get; set; } = true;
    public int? AreaId { get; set; }
    public string? ContactoEmergenciaNombre { get; set; }
    public string? ContactoEmergenciaTel { get; set; }
    public string? AlergiasMedicamentos { get; set; }
}

public class UsuarioUpdateDto
{
    public int RolId { get; set; }
    public string NombreCompleto { get; set; } = "";
    public string Identificacion { get; set; } = "";
    public string NombreUsuario { get; set; } = "";
    public string Correo { get; set; } = "";
    public string? Password { get; set; }
    public string? Puesto { get; set; }
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public bool Activo { get; set; } = true;
    public int? AreaId { get; set; }
    public string? ContactoEmergenciaNombre { get; set; }
    public string? ContactoEmergenciaTel { get; set; }
    public string? AlergiasMedicamentos { get; set; }
}

public class LoginRequestDto
{
    public string Usuario { get; set; } = "";
    public string Password { get; set; } = "";
}

public class RecoverRequestDto
{
    public string Correo { get; set; } = "";
}

public class RecoverResetDto
{
    public string Correo { get; set; } = "";
    public string Token { get; set; } = "";
    public string NuevaPassword { get; set; } = "";
}
