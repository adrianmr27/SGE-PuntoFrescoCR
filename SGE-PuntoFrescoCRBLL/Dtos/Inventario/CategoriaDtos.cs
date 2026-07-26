namespace SGE_PuntoFrescoCRBLL.Dtos;

public class CategoriaCreateDto
{
    public string Nombre { get; set; } = "";
}

public class CategoriaUpdateDto
{
    public string Nombre { get; set; } = "";
    public bool Activo { get; set; } = true;
}
