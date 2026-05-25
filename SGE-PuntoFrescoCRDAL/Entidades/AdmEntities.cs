namespace SGE_PuntoFrescoCRDAL.Entidades;

public class Empresa
{
    public int EmpresaId { get; set; }
    public string NombreComercial { get; set; } = null!;
    public string RazonSocial { get; set; } = null!;
    public string CedulaJuridica { get; set; } = null!;
    public string Telefono1 { get; set; } = null!;
    public string? Telefono2 { get; set; }
    public string CorreoPrincipal { get; set; } = null!;
    public string? CorreoAlt { get; set; }
    public string Direccion { get; set; } = null!;
    public string? SitioWeb { get; set; }
    public string? Representante { get; set; }
    public string? LogoPath { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class Parametro
{
    public int ParametroId { get; set; }
    public string Tipo { get; set; } = null!;
    public string Nombre { get; set; } = null!;
    public string Valor { get; set; } = null!;
    public string? Descripcion { get; set; }
    public bool Activo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
