using System.ComponentModel.DataAnnotations;

namespace SGE_PuntoFrescoCRBLL.Dtos;

public class ProductoCreateDto
{
    [Required]
    public int CategoriaId { get; set; }

    [Required]
    public int ParametroIvaId { get; set; }

    [Required(ErrorMessage = "El nombre es obligatorio."), StringLength(150, MinimumLength = 2)]
    public string Nombre { get; set; } = "";

    [StringLength(500)]
    public string? Descripcion { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "El precio de compra no puede ser negativo.")]
    public decimal PrecioCompra { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "El precio de venta no puede ser negativo.")]
    public decimal PrecioVenta { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "El stock no puede ser negativo.")]
    public int Stock { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "El stock mínimo no puede ser negativo.")]
    public int StockMinimo { get; set; }

    public bool Activo { get; set; } = true;
}

public class ProductoUpdateDto : ProductoCreateDto { }
