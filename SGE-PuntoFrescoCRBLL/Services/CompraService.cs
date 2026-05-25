using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public class CompraService : ICompraService
{
    private readonly SpaCrudService _crud;
    public CompraService(SpaCrudService crud) => _crud = crud;
    public Task<int?> CreateOrdenCompraAsync(OrdenCompraCreateDto dto, int usuarioId, CancellationToken ct = default) => _crud.CreateOrdenCompraAsync(dto, usuarioId, ct);
    public Task<OrdenCompraDetalleDto?> GetOrdenCompraDetalleAsync(int id, CancellationToken ct = default) => _crud.GetOrdenCompraDetalleAsync(id, ct);
    public Task<bool> UpdateOrdenCompraPendienteAsync(int id, OrdenCompraCreateDto dto, CancellationToken ct = default) => _crud.UpdateOrdenCompraPendienteAsync(id, dto, ct);
    public Task<bool> ConfirmarOrdenCompraAsync(int id, int usuarioId, CancellationToken ct = default) => _crud.ConfirmarOrdenCompraAsync(id, usuarioId, ct);
    public Task<bool> CancelarOrdenCompraAsync(int id, CancellationToken ct = default) => _crud.CancelarOrdenCompraAsync(id, ct);
}
