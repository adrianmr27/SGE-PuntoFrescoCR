namespace SGE_PuntoFrescoCRDAL.Entidades;

public class Rol
{
    public int RolId { get; set; }
    public string Nombre { get; set; } = null!;
    public string? Descripcion { get; set; }
    public bool Activo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
    public ICollection<Permiso> Permisos { get; set; } = new List<Permiso>();
}

public class Modulo
{
    public int ModuloId { get; set; }
    public string Codigo { get; set; } = null!;
    public string Nombre { get; set; } = null!;
    public string? Icono { get; set; }
    public short Orden { get; set; }
    public bool Activo { get; set; }

    public ICollection<Permiso> Permisos { get; set; } = new List<Permiso>();
}

public class Permiso
{
    public int PermisoId { get; set; }
    public int RolId { get; set; }
    public int ModuloId { get; set; }
    public bool PuedeVer { get; set; }
    public bool PuedeCrear { get; set; }
    public bool PuedeEditar { get; set; }
    public bool PuedeElim { get; set; }
    public bool PuedeExport { get; set; }

    public Rol Rol { get; set; } = null!;
    public Modulo Modulo { get; set; } = null!;
}

public class Usuario
{
    public int UsuarioId { get; set; }
    public int RolId { get; set; }
    public string NombreCompleto { get; set; } = null!;
    public string Identificacion { get; set; } = null!;
    public string NombreUsuario { get; set; } = null!;
    public string Correo { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string PasswordSalt { get; set; } = null!;
    public string? Puesto { get; set; }
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public bool Activo { get; set; }
    public bool RequiereCambioPassword { get; set; }
    public string? TokenRecuperacion { get; set; }
    public DateTime? TokenExpiracion { get; set; }
    public DateTime? UltimoAcceso { get; set; }
    public byte FallasAcceso { get; set; }
    public DateTime? BloqueadoHasta { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Rol Rol { get; set; } = null!;
}
