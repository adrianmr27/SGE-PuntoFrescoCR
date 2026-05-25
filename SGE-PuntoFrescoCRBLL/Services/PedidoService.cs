using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public class PedidoService : IPedidoService
{
    private readonly SpaCrudService _crud;
    public PedidoService(SpaCrudService crud) => _crud = crud;
    public Task<int?> CreatePedidoAsync(PedidoCreateDto dto, int usuarioId, CancellationToken ct = default) => _crud.CreatePedidoAsync(dto, usuarioId, ct);
    public Task<bool> UpdatePedidoBorradorAsync(int id, PedidoUpdateDto dto, CancellationToken ct = default) => _crud.UpdatePedidoBorradorAsync(id, dto, ct);
    public Task<PedidoDetalleDto?> GetPedidoDetalleAsync(int id, CancellationToken ct = default) => _crud.GetPedidoDetalleAsync(id, ct);
    public Task<bool> ConfirmarPedidoAsync(int id, int usuarioId, CancellationToken ct = default) => _crud.ConfirmarPedidoAsync(id, usuarioId, ct);
    public Task<bool> EntregarPedidoAsync(int id, int usuarioId, CancellationToken ct = default) => _crud.EntregarPedidoAsync(id, usuarioId, ct);
    public Task<bool> CancelarPedidoAsync(int id, int usuarioId, string? motivo, CancellationToken ct = default) => _crud.CancelarPedidoAsync(id, usuarioId, motivo, ct);
}
