using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public class LicitacionService : ILicitacionService
{
    private readonly SpaCrudService _crud;
    public LicitacionService(SpaCrudService crud) => _crud = crud;
    public Task<int?> CreateLicitacionAsync(LicitacionCreateDto dto, int usuarioId, CancellationToken ct = default) => _crud.CreateLicitacionAsync(dto, usuarioId, ct);
    public Task<bool> UpdateLicitacionAsync(int id, LicitacionCreateDto dto, CancellationToken ct = default) => _crud.UpdateLicitacionAsync(id, dto, ct);
    public Task<LicitacionDetalleCompletoDto?> GetLicitacionDetalleAsync(int id, CancellationToken ct = default) => _crud.GetLicitacionDetalleAsync(id, ct);
    public Task<int?> AddLicitacionDocumentoAsync(int id, int usuarioId, LicitacionDocumentoCreateDto dto, CancellationToken ct = default) => _crud.AddLicitacionDocumentoAsync(id, usuarioId, dto, ct);
    public Task<bool> DeleteLicitacionDocumentoAsync(int id, int documentoId, CancellationToken ct = default) => _crud.DeleteLicitacionDocumentoAsync(id, documentoId, ct);
    public Task<int?> AddLicitacionRecordatorioAsync(int id, LicitacionRecordatorioCreateDto dto, CancellationToken ct = default) => _crud.AddLicitacionRecordatorioAsync(id, dto, ct);
    public Task<bool> DeleteLicitacionRecordatorioAsync(int id, int recordatorioId, CancellationToken ct = default) => _crud.DeleteLicitacionRecordatorioAsync(id, recordatorioId, ct);
    public Task<bool> MarkLicitacionRecordatorioEnviadoAsync(int id, int recordatorioId, CancellationToken ct = default) => _crud.MarkLicitacionRecordatorioEnviadoAsync(id, recordatorioId, ct);
}
