using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public class ProductoService : IProductoService
{
    private readonly SpaCrudService _crud;
    public ProductoService(SpaCrudService crud) => _crud = crud;
    public Task<int?> CreateProductoAsync(ProductoCreateDto dto, CancellationToken ct = default) => _crud.CreateProductoAsync(dto, ct);
    public Task<bool> UpdateProductoAsync(int id, ProductoUpdateDto dto, CancellationToken ct = default) => _crud.UpdateProductoAsync(id, dto, ct);
}
