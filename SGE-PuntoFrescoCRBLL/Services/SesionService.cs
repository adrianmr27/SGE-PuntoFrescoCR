using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using SGE_PuntoFrescoCRDAL.Data;

namespace SGE_PuntoFrescoCRBLL.Services;

/// <summary>Resultado de validar la sesión que viaja en la cookie.</summary>
public enum EstadoSesion
{
    Valida,

    /// <summary>El usuario ya no existe.</summary>
    UsuarioInexistente,

    /// <summary>La cuenta fue desactivada.</summary>
    CuentaDesactivada,

    /// <summary>La cookie trae un token que ya no es el vigente: se inició sesión en otro equipo.</summary>
    Reemplazada
}

/// <summary>
/// Gestiona la sesión vigente de cada usuario.
///
/// El modelo es de sesión única: <c>seg.Usuario.SesionToken</c> guarda el
/// identificador de la única sesión válida. Al iniciar sesión se genera uno
/// nuevo, con lo que cualquier cookie anterior (otro equipo, otro navegador)
/// deja de ser válida en la siguiente solicitud, y de inmediato si esa otra
/// pestaña está escuchando el canal de eventos.
/// </summary>
public class SesionService
{
    private readonly SgePuntoFrescoDbContext _db;
    private readonly ISesionEventBus _bus;
    private readonly AuditoriaService _auditoria;

    public SesionService(SgePuntoFrescoDbContext db, ISesionEventBus bus, AuditoriaService auditoria)
    {
        _db = db;
        _bus = bus;
        _auditoria = auditoria;
    }

    /// <summary>Nombre del claim que transporta el identificador de sesión en la cookie.</summary>
    public const string ClaimSesion = "sid";

    private static string GenerarToken()
    {
        Span<byte> bytes = stackalloc byte[32];
        RandomNumberGenerator.Fill(bytes);
        return Convert.ToHexString(bytes);
    }

    /// <summary>
    /// Abre una sesión nueva para el usuario y descarta la anterior.
    /// Devuelve el token que debe guardarse como claim en la cookie.
    /// </summary>
    public async Task<string> AbrirSesionAsync(int usuarioId, string? origen, CancellationToken ct = default)
    {
        var u = await _db.Usuarios.FirstOrDefaultAsync(x => x.UsuarioId == usuarioId, ct)
                ?? throw new InvalidOperationException($"Usuario {usuarioId} inexistente.");

        var habiaSesionPrevia = !string.IsNullOrEmpty(u.SesionToken);

        u.SesionToken = GenerarToken();
        u.SesionIniciadaEn = DateTime.UtcNow;
        u.SesionOrigen = origen is { Length: > 256 } ? origen[..256] : origen;
        u.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        if (habiaSesionPrevia)
        {
            // Expulsa en el acto la sesión que estaba abierta en el otro equipo.
            _bus.Publicar(usuarioId, MotivoCierreSesion.SesionReemplazada);
            await _auditoria.RegistrarAsync(usuarioId, u.NombreUsuario, "SESION_REEMPLAZADA",
                "Usuario", usuarioId.ToString(), origen, ct: ct);
        }

        return u.SesionToken;
    }

    /// <summary>
    /// Comprueba, en cada solicitud, que la cookie siga correspondiendo a la
    /// sesión vigente y que la cuenta siga activa.
    /// </summary>
    public async Task<EstadoSesion> ValidarAsync(int usuarioId, string? tokenCookie, CancellationToken ct = default)
    {
        var u = await _db.Usuarios.AsNoTracking()
            .Where(x => x.UsuarioId == usuarioId)
            .Select(x => new { x.Activo, x.SesionToken })
            .FirstOrDefaultAsync(ct);

        if (u == null) return EstadoSesion.UsuarioInexistente;
        if (!u.Activo) return EstadoSesion.CuentaDesactivada;

        // Sesiones emitidas antes de esta migración no traen token: se consideran
        // reemplazadas para forzar un inicio de sesión limpio una sola vez.
        if (string.IsNullOrEmpty(tokenCookie) || string.IsNullOrEmpty(u.SesionToken))
            return EstadoSesion.Reemplazada;

        return CryptographicOperations.FixedTimeEquals(
                   System.Text.Encoding.UTF8.GetBytes(tokenCookie),
                   System.Text.Encoding.UTF8.GetBytes(u.SesionToken))
            ? EstadoSesion.Valida
            : EstadoSesion.Reemplazada;
    }

    /// <summary>Cierra la sesión del usuario indicado y avisa a sus pestañas abiertas.</summary>
    public async Task CerrarSesionAsync(int usuarioId, MotivoCierreSesion motivo,
        int? operadorId = null, string? operadorNombre = null, CancellationToken ct = default)
    {
        var u = await _db.Usuarios.FirstOrDefaultAsync(x => x.UsuarioId == usuarioId, ct);
        if (u == null) return;

        u.SesionToken = null;
        u.SesionIniciadaEn = null;
        u.SesionOrigen = null;
        u.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        _bus.Publicar(usuarioId, motivo);

        await _auditoria.RegistrarAsync(operadorId ?? usuarioId, operadorNombre ?? u.NombreUsuario,
            "SESION_CERRADA", "Usuario", usuarioId.ToString(), motivo.ToString(), ct: ct);
    }

    /// <summary>Cierre voluntario desde el botón "Cerrar sesión".</summary>
    public async Task CerrarPropiaAsync(int usuarioId, CancellationToken ct = default)
    {
        var u = await _db.Usuarios.FirstOrDefaultAsync(x => x.UsuarioId == usuarioId, ct);
        if (u == null) return;
        u.SesionToken = null;
        u.SesionIniciadaEn = null;
        u.SesionOrigen = null;
        u.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
    }
}
