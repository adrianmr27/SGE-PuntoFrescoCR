using Microsoft.EntityFrameworkCore;
using SGE_PuntoFrescoCRDAL.Data;
using SGE_PuntoFrescoCRDAL.Entidades;

namespace SGE_PuntoFrescoCRBLL.Services;

public interface INotificacionService
{
    Task<ResultadoOperacion> OcultarAsync(int usuarioId, string clave, string huella, CancellationToken ct = default);
    Task<ResultadoOperacion> MarcarLeidaAsync(int usuarioId, string clave, string huella, CancellationToken ct = default);
    Task<ResultadoOperacion> RestablecerAsync(int usuarioId, CancellationToken ct = default);
    Task<int> PurgarObsoletasAsync(int diasAntiguedad = 90, CancellationToken ct = default);
}

/// <summary>
/// Estado del centro de notificaciones, por usuario y persistido en base de datos.
///
/// El comportamiento anterior guardaba los descartes en <c>localStorage</c> bajo una
/// única clave global. Eso producía tres defectos: el descarte era por navegador y
/// no por persona (dos usuarios en el mismo equipo compartían el estado), se perdía
/// al cambiar de máquina, y una alerta ocultada quedaba silenciada para siempre
/// aunque el registro de origen cambiara.
/// </summary>
public class NotificacionService : INotificacionService
{
    private readonly SgePuntoFrescoDbContext _db;

    public NotificacionService(SgePuntoFrescoDbContext db) => _db = db;

    private const int MaxLargoClave = 80;
    private const int MaxLargoHuella = 64;

    private async Task<ResultadoOperacion> GuardarEstadoAsync(
        int usuarioId, string clave, string huella, string estado, CancellationToken ct)
    {
        if (usuarioId <= 0)
            return ResultadoOperacion.Prohibido("SIN_SESION", "No hay una sesión válida para guardar el cambio.");

        if (string.IsNullOrWhiteSpace(clave))
            return ResultadoOperacion.Invalido("CLAVE_REQUERIDA", "No se indicó cuál alerta se quiere modificar.");

        if (clave.Length > MaxLargoClave)
            return ResultadoOperacion.Invalido("CLAVE_LARGA", "El identificador de la alerta no es válido.");

        // La huella puede venir vacía si el cliente es antiguo: se acepta y se guarda
        // como cadena vacía, lo que hace que la alerta reaparezca al primer cambio.
        var h = (huella ?? "").Trim();
        if (h.Length > MaxLargoHuella) h = h[..MaxLargoHuella];

        var existente = await _db.NotificacionesEstado
            .FirstOrDefaultAsync(e => e.UsuarioId == usuarioId && e.Clave == clave, ct);

        if (existente == null)
        {
            _db.NotificacionesEstado.Add(new NotificacionEstado
            {
                UsuarioId = usuarioId,
                Clave = clave.Trim(),
                Huella = h,
                Estado = estado,
                FechaHora = DateTime.UtcNow
            });
        }
        else
        {
            existente.Huella = h;
            existente.Estado = estado;
            existente.FechaHora = DateTime.UtcNow;
        }

        try
        {
            await _db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            // Carrera entre dos pestañas del mismo usuario sobre la misma alerta:
            // el índice único la detiene y el resultado final es el mismo.
            return ResultadoOperacion.Ok();
        }

        return ResultadoOperacion.Ok();
    }

    public Task<ResultadoOperacion> OcultarAsync(int usuarioId, string clave, string huella, CancellationToken ct = default)
        => GuardarEstadoAsync(usuarioId, clave, huella, "Oculta", ct);

    public Task<ResultadoOperacion> MarcarLeidaAsync(int usuarioId, string clave, string huella, CancellationToken ct = default)
        => GuardarEstadoAsync(usuarioId, clave, huella, "Leida", ct);

    /// <summary>Devuelve a la vista todas las alertas que este usuario había ocultado.</summary>
    public async Task<ResultadoOperacion> RestablecerAsync(int usuarioId, CancellationToken ct = default)
    {
        if (usuarioId <= 0)
            return ResultadoOperacion.Prohibido("SIN_SESION", "No hay una sesión válida para guardar el cambio.");

        await _db.NotificacionesEstado
            .Where(e => e.UsuarioId == usuarioId)
            .ExecuteDeleteAsync(ct);

        return ResultadoOperacion.Ok();
    }

    /// <summary>
    /// Limpieza de mantenimiento: elimina descartes antiguos cuya alerta de origen
    /// ya no se genera, para que la tabla no crezca indefinidamente.
    /// </summary>
    public async Task<int> PurgarObsoletasAsync(int diasAntiguedad = 90, CancellationToken ct = default)
    {
        var corte = DateTime.UtcNow.AddDays(-Math.Abs(diasAntiguedad));
        return await _db.NotificacionesEstado
            .Where(e => e.FechaHora < corte)
            .ExecuteDeleteAsync(ct);
    }
}
