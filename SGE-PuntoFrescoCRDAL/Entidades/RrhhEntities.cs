namespace SGE_PuntoFrescoCRDAL.Entidades;

public class Area
{
    public int AreaId { get; set; }
    public string Nombre { get; set; } = null!;
    public bool Activo { get; set; }

    public ICollection<Empleado> Empleados { get; set; } = new List<Empleado>();
}

public class Empleado
{
    public int EmpleadoId { get; set; }
    public int AreaId { get; set; }
    public int? UsuarioId { get; set; }
    public string NombreCompleto { get; set; } = null!;
    public string Identificacion { get; set; } = null!;
    public string Puesto { get; set; } = null!;
    public string? Telefono { get; set; }
    public string? Correo { get; set; }
    public string? Direccion { get; set; }
    public DateTime? FechaIngreso { get; set; }
    public string? ContactoEmergenciaNombre { get; set; }
    public string? ContactoEmergenciaTel { get; set; }
    public string? AlergiasMedicamentos { get; set; }
    public string? Padecimientos { get; set; }
    public bool Activo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Area Area { get; set; } = null!;
    public Usuario? Usuario { get; set; }
}
