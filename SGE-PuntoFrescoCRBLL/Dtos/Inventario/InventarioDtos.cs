namespace SGE_PuntoFrescoCRBLL.Dtos;

public class ProductoCreateDto
{
    public int CategoriaId { get; set; }
    public int ParametroIvaId { get; set; }
    public string Nombre { get; set; } = "";
    public string? Descripcion { get; set; }
    public decimal PrecioCompra { get; set; }
    public decimal PrecioVenta { get; set; }
    public int Stock { get; set; }
    public int StockMinimo { get; set; }
    public bool Activo { get; set; } = true;
}

public class ProductoUpdateDto : ProductoCreateDto { }
