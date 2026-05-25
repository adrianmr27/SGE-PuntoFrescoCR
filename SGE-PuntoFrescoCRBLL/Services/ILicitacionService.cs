using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public interface ILicitacionService
{
    Task<int?> CreateLicitacionAsync(LicitacionCreateDto dto, int usuarioId, CancellationToken ct = default);
    Task<bool> UpdateLicitacionAsync(int id, LicitacionCreateDto dto, CancellationToken ct = default);
    Task<LicitacionDetalleCompletoDto?> GetLicitacionDetalleAsync(int id, CancellationToken ct = default);
    Task<int?> AddLicitacionDocumentoAsync(int id, int usuarioId, LicitacionDocumentoCreateDto dto, CancellationToken ct = default);
    Task<bool> DeleteLicitacionDocumentoAsync(int id, int documentoId, CancellationToken ct = default);
    Task<int?> AddLicitacionRecordatorioAsync(int id, LicitacionRecordatorioCreateDto dto, CancellationToken ct = default);
    Task<bool> DeleteLicitacionRecordatorioAsync(int id, int recordatorioId, CancellationToken ct = default);
    Task<bool> MarkLicitacionRecordatorioEnviadoAsync(int id, int recordatorioId, CancellationToken ct = default);
}
