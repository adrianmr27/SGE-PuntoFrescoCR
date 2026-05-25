using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public interface IProveedorService
{
    Task<int?> CreateProveedorAsync(ProveedorCreateDto dto, CancellationToken ct = default);
    Task<bool> UpdateProveedorAsync(int id, ProveedorUpdateDto dto, CancellationToken ct = default);
}
