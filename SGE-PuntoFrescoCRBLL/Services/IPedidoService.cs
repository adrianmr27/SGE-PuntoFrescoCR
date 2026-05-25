using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public interface IPedidoService
{
    Task<int?> CreatePedidoAsync(PedidoCreateDto dto, int usuarioId, CancellationToken ct = default);
    Task<bool> UpdatePedidoBorradorAsync(int id, PedidoUpdateDto dto, CancellationToken ct = default);
    Task<PedidoDetalleDto?> GetPedidoDetalleAsync(int id, CancellationToken ct = default);
    Task<bool> ConfirmarPedidoAsync(int id, int usuarioId, CancellationToken ct = default);
    Task<bool> EntregarPedidoAsync(int id, int usuarioId, CancellationToken ct = default);
    Task<bool> CancelarPedidoAsync(int id, int usuarioId, string? motivo, CancellationToken ct = default);
}
