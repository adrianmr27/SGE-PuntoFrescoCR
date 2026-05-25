using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public class UsuarioService : IUsuarioService
{
    private readonly SpaCrudService _crud;
    public UsuarioService(SpaCrudService crud) => _crud = crud;
    public Task<int?> CreateUsuarioAsync(UsuarioCreateDto dto, CancellationToken ct = default) => _crud.CreateUsuarioAsync(dto, ct);
    public Task<bool> UpdateUsuarioAsync(int id, UsuarioUpdateDto dto, CancellationToken ct = default) => _crud.UpdateUsuarioAsync(id, dto, ct);
}
