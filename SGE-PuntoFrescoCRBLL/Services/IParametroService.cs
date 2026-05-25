using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public interface IParametroService
{
    Task<bool> UpdateParametroAsync(int id, ParametroMutateDto dto, CancellationToken ct = default);
    Task<int?> CreateParametroAsync(ParametroCreateDto dto, CancellationToken ct = default);
}
