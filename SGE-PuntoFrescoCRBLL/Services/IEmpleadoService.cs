using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public interface IEmpleadoService
{
    Task<int?> CreateEmpleadoAsync(EmpleadoCreateDto dto, CancellationToken ct = default);
    Task<bool> UpdateEmpleadoAsync(int id, EmpleadoUpdateDto dto, CancellationToken ct = default);
    Task<int?> GetEmpleadoIdByUsuarioIdAsync(int usuarioId, CancellationToken ct = default);
    Task<bool> UpdateEmpleadoSelfAsync(int empleadoId, EmpleadoSelfUpdateDto dto, CancellationToken ct = default);
}
