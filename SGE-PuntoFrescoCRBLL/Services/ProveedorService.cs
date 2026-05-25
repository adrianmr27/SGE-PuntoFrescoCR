using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public class ProveedorService : IProveedorService
{
    private readonly SpaCrudService _crud;
    public ProveedorService(SpaCrudService crud) => _crud = crud;
    public Task<int?> CreateProveedorAsync(ProveedorCreateDto dto, CancellationToken ct = default) => _crud.CreateProveedorAsync(dto, ct);
    public Task<bool> UpdateProveedorAsync(int id, ProveedorUpdateDto dto, CancellationToken ct = default) => _crud.UpdateProveedorAsync(id, dto, ct);
}
