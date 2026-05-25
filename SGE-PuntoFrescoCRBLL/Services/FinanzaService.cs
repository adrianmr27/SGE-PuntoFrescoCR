using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public class FinanzaService : IFinanzaService
{
    private readonly SpaCrudService _crud;
    public FinanzaService(SpaCrudService crud) => _crud = crud;
    public Task<bool> UpdateCuentaCobrarEstadoAsync(int id, string estado, CancellationToken ct = default) => _crud.UpdateCuentaCobrarEstadoAsync(id, estado, ct);
    public Task<bool> UpdateCuentaPagarEstadoAsync(int id, string estado, CancellationToken ct = default) => _crud.UpdateCuentaPagarEstadoAsync(id, estado, ct);
    public Task<bool> AddMovimientoFinancieroManualAsync(MovimientoFinancieroManualDto dto, int usuarioId, CancellationToken ct = default) => _crud.AddMovimientoFinancieroManualAsync(dto, usuarioId, ct);
    public Task<int?> CreateCuentaCobrarAsync(CuentaCobrarCreateDto dto, int usuarioId, CancellationToken ct = default) => _crud.CreateCuentaCobrarAsync(dto, usuarioId, ct);
    public Task<int?> CreateCuentaPagarAsync(CuentaPagarCreateDto dto, int usuarioId, CancellationToken ct = default) => _crud.CreateCuentaPagarAsync(dto, usuarioId, ct);
}
