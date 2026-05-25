using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public interface IClienteService
{
    Task<int?> CreateClienteAsync(ClienteCreateDto dto, CancellationToken ct = default);
    Task<bool> UpdateClienteAsync(int id, ClienteUpdateDto dto, CancellationToken ct = default);
}
