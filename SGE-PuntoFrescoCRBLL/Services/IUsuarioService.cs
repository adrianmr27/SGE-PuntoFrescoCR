using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public interface IUsuarioService
{
    Task<int?> CreateUsuarioAsync(UsuarioCreateDto dto, CancellationToken ct = default);
    Task<bool> UpdateUsuarioAsync(int id, UsuarioUpdateDto dto, CancellationToken ct = default);
}
