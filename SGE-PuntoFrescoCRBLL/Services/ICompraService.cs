using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public interface ICompraService
{
    Task<int?> CreateOrdenCompraAsync(OrdenCompraCreateDto dto, int usuarioId, CancellationToken ct = default);
    Task<OrdenCompraDetalleDto?> GetOrdenCompraDetalleAsync(int id, CancellationToken ct = default);
    Task<bool> UpdateOrdenCompraPendienteAsync(int id, OrdenCompraCreateDto dto, CancellationToken ct = default);
    Task<bool> ConfirmarOrdenCompraAsync(int id, int usuarioId, CancellationToken ct = default);
    Task<bool> CancelarOrdenCompraAsync(int id, CancellationToken ct = default);
}
