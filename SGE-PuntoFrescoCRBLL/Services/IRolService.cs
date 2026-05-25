using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public interface IRolService
{
    Task<int?> CreateRolAsync(RolCreateDto dto, CancellationToken ct = default);
    Task<bool> UpdateRolAsync(int id, RolUpdateDto dto, CancellationToken ct = default);
    Task<bool> UpdatePermisosRolAsync(int rolId, List<PermisoModuloDto> filas, CancellationToken ct = default);
    Task<List<PermisoRolDto>> GetPermisosRolAsync(int rolId, CancellationToken ct = default);
}
