using Microsoft.EntityFrameworkCore;
using SGE_PuntoFrescoCRDAL.Data;
using SGE_PuntoFrescoCRDAL.Entidades;

namespace SGE_PuntoFrescoCRBLL.Services;

/// <summary>
/// Registro de auditoría de acciones relevantes (RQNF-008). El registro nunca debe
/// interrumpir la operación de negocio: cualquier fallo al escribir se ignora
/// silenciosamente (mejor perder una línea de auditoría que romper un guardado).
/// </summary>
public class AuditoriaService
{
    private readonly SgePuntoFrescoDbContext _db;

    public AuditoriaService(SgePuntoFrescoDbContext db) => _db = db;

    public async Task RegistrarAsync(
        int? usuarioId,
        string? nombreUsuario,
        string accion,
        string? entidad = null,
        string? entidadId = null,
        string? detalle = null,
        string? direccionIp = null,
        CancellationToken ct = default)
    {
        try
        {
            _db.Auditorias.Add(new Auditoria
            {
                UsuarioId = usuarioId,
                NombreUsuario = nombreUsuario,
                Accion = accion,
                Entidad = entidad,
                EntidadId = entidadId,
                Detalle = detalle,
                DireccionIp = direccionIp,
                FechaHora = DateTime.UtcNow
            });
            await _db.SaveChangesAsync(ct);
        }
        catch
        {
            // No se propaga: un fallo de auditoría no debe tumbar la acción del usuario.
        }
    }

    public async Task<List<Auditoria>> ConsultarAsync(
        DateTime? desde = null, DateTime? hasta = null, string? accion = null, int? usuarioId = null,
        int limit = 200, CancellationToken ct = default)
    {
        var q = _db.Auditorias.AsNoTracking().AsQueryable();
        if (desde.HasValue) q = q.Where(a => a.FechaHora >= desde.Value);
        if (hasta.HasValue) q = q.Where(a => a.FechaHora <= hasta.Value);
        if (!string.IsNullOrWhiteSpace(accion)) q = q.Where(a => a.Accion == accion);
        if (usuarioId.HasValue) q = q.Where(a => a.UsuarioId == usuarioId.Value);
        return await q.OrderByDescending(a => a.FechaHora).Take(limit).ToListAsync(ct);
    }
}
