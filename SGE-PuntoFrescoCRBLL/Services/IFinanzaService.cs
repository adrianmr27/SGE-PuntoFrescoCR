using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public interface IFinanzaService
{
    Task<bool> UpdateCuentaCobrarEstadoAsync(int id, string estado, CancellationToken ct = default);
    Task<bool> UpdateCuentaPagarEstadoAsync(int id, string estado, CancellationToken ct = default);
    Task<bool> AddMovimientoFinancieroManualAsync(MovimientoFinancieroManualDto dto, int usuarioId, CancellationToken ct = default);
    Task<int?> CreateCuentaCobrarAsync(CuentaCobrarCreateDto dto, int usuarioId, CancellationToken ct = default);
    Task<int?> CreateCuentaPagarAsync(CuentaPagarCreateDto dto, int usuarioId, CancellationToken ct = default);
}
