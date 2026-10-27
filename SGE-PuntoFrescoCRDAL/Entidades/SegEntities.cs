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

    /// <summary>
    /// Identificador de la sesión vigente. Se regenera en cada inicio de sesión exitoso,
    /// por lo que una sesión anterior queda invalidada automáticamente (sesión única por usuario).
    /// Null = el usuario no tiene ninguna sesión abierta.
    /// </summary>
    public string? SesionToken { get; set; }

    /// <summary>Momento en que se abrió la sesión vigente (UTC).</summary>
    public DateTime? SesionIniciadaEn { get; set; }

    /// <summary>Equipo / agente desde el que se abrió la sesión vigente (informativo para auditoría).</summary>
    public string? SesionOrigen { get; set; }

    public Rol Rol { get; set; } = null!;
}

/// <summary>
/// Estado por usuario de cada alerta del centro de notificaciones.
/// Antes el descarte vivía solo en localStorage, por lo que era por navegador
/// y no por usuario: dos personas en el mismo equipo compartían los descartes
/// y la misma persona volvía a ver todo al cambiar de máquina.
/// </summary>
public class NotificacionEstado
{
    public long NotificacionEstadoId { get; set; }
    public int UsuarioId { get; set; }

    /// <summary>Clave estable de la alerta (por ejemplo "cc-14", "inv-stock-bajo").</summary>
    public string Clave { get; set; } = null!;

    /// <summary>
    /// Huella del contenido de la alerta cuando se ocultó. Si el registro de origen
    /// cambia (monto, fecha, estado), la huella cambia y la alerta vuelve a mostrarse.
    /// </summary>
    public string Huella { get; set; } = null!;

    /// <summary>Oculta | Leida</summary>
    public string Estado { get; set; } = "Oculta";

    public DateTime FechaHora { get; set; }

    public Usuario Usuario { get; set; } = null!;
}

public class Auditoria
{
    public long AuditoriaId { get; set; }
    public int? UsuarioId { get; set; }
    public string? NombreUsuario { get; set; }
    public string Accion { get; set; } = null!;
    public string? Entidad { get; set; }
    public string? EntidadId { get; set; }
    public string? Detalle { get; set; }
    public string? DireccionIp { get; set; }
    public DateTime FechaHora { get; set; }
}
