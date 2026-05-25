using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public class EmpleadoService : IEmpleadoService
{
    private readonly SpaCrudService _crud;
    public EmpleadoService(SpaCrudService crud) => _crud = crud;
    public Task<int?> CreateEmpleadoAsync(EmpleadoCreateDto dto, CancellationToken ct = default) => _crud.CreateEmpleadoAsync(dto, ct);
    public Task<bool> UpdateEmpleadoAsync(int id, EmpleadoUpdateDto dto, CancellationToken ct = default) => _crud.UpdateEmpleadoAsync(id, dto, ct);
    public Task<int?> GetEmpleadoIdByUsuarioIdAsync(int usuarioId, CancellationToken ct = default) => _crud.GetEmpleadoIdByUsuarioIdAsync(usuarioId, ct);
    public Task<bool> UpdateEmpleadoSelfAsync(int empleadoId, EmpleadoSelfUpdateDto dto, CancellationToken ct = default) => _crud.UpdateEmpleadoSelfAsync(empleadoId, dto, ct);
}
