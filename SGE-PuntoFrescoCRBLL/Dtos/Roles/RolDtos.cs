namespace SGE_PuntoFrescoCRBLL.Dtos;

public class RolCreateDto
{
    public string Nombre { get; set; } = "";
    public string? Descripcion { get; set; }
}

public class RolUpdateDto
{
    public string Nombre { get; set; } = "";
    public string? Descripcion { get; set; }
    public bool Activo { get; set; } = true;
}

public class PermisoModuloDto
{
    public int ModuloId { get; set; }
    public bool PuedeVer { get; set; }
    public bool PuedeCrear { get; set; }
    public bool PuedeEditar { get; set; }
    public bool PuedeElim { get; set; }
    public bool PuedeExport { get; set; }
}

public class PermisoRolDto
{
    public int ModuloId { get; set; }
    public bool PuedeVer { get; set; }
    public bool PuedeCrear { get; set; }
    public bool PuedeEditar { get; set; }
    public bool PuedeElim { get; set; }
    public bool PuedeExport { get; set; }
}
