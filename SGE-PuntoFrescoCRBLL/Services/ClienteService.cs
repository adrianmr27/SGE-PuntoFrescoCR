using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public class ClienteService : IClienteService
{
    private readonly SpaCrudService _crud;
    public ClienteService(SpaCrudService crud) => _crud = crud;
    public Task<int?> CreateClienteAsync(ClienteCreateDto dto, CancellationToken ct = default) => _crud.CreateClienteAsync(dto, ct);
    public Task<bool> UpdateClienteAsync(int id, ClienteUpdateDto dto, CancellationToken ct = default) => _crud.UpdateClienteAsync(id, dto, ct);
}
