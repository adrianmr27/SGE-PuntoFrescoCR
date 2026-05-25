using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public interface IProductoService
{
    Task<int?> CreateProductoAsync(ProductoCreateDto dto, CancellationToken ct = default);
    Task<bool> UpdateProductoAsync(int id, ProductoUpdateDto dto, CancellationToken ct = default);
}
