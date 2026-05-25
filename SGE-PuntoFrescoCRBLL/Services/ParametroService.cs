using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public class ParametroService : IParametroService
{
    private readonly SpaCrudService _crud;
    public ParametroService(SpaCrudService crud) => _crud = crud;
    public Task<bool> UpdateParametroAsync(int id, ParametroMutateDto dto, CancellationToken ct = default) => _crud.UpdateParametroAsync(id, dto, ct);
    public Task<int?> CreateParametroAsync(ParametroCreateDto dto, CancellationToken ct = default) => _crud.CreateParametroAsync(dto, ct);
}
