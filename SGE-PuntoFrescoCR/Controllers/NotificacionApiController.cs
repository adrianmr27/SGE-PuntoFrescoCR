using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class NotificacionEstadoDto
{
    /// <summary>Identificador de la alerta, tal como viaja en el bootstrap (ej. "cc-14").</summary>
    public string Clave { get; set; } = "";

    /// <summary>Huella del contenido al momento de ocultarla o marcarla.</summary>
    public string Huella { get; set; } = "";
}

/// <summary>
/// Estado del centro de notificaciones del usuario que tiene la sesión abierta.
///
/// Reemplaza al almacenamiento en <c>localStorage</c>, que era por navegador y no
/// por persona: por eso todos los usuarios veían siempre las mismas alertas y los
/// descartes no viajaban de un equipo a otro.
/// </summary>
public class NotificacionApiController : BaseSpaApiController
{
    private readonly INotificacionService _notificaciones;

    public NotificacionApiController(
        INotificacionService notificaciones, IPermisoService permisoService, AuditoriaService auditoria)
        : base(permisoService, auditoria) => _notificaciones = notificaciones;

    /// <summary>Oculta una alerta para este usuario. No afecta a los demás.</summary>
    [HttpPost("notificaciones/ocultar")]
    public async Task<IActionResult> Ocultar([FromBody] NotificacionEstadoDto dto, CancellationToken ct)
    {
        var r = await _notificaciones.OcultarAsync(UsuarioOperador(), dto.Clave, dto.Huella, ct);
        return r.Exito ? NoContent() : ErrorNegocio(r);
    }

    /// <summary>Marca la alerta como leída: sigue visible, pero atenuada y sin contar en el badge.</summary>
    [HttpPost("notificaciones/leida")]
    public async Task<IActionResult> Leida([FromBody] NotificacionEstadoDto dto, CancellationToken ct)
    {
        var r = await _notificaciones.MarcarLeidaAsync(UsuarioOperador(), dto.Clave, dto.Huella, ct);
        return r.Exito ? NoContent() : ErrorNegocio(r);
    }

    /// <summary>Devuelve a la vista todas las alertas que este usuario había ocultado.</summary>
    [HttpPost("notificaciones/restablecer")]
    public async Task<IActionResult> Restablecer(CancellationToken ct)
    {
        var r = await _notificaciones.RestablecerAsync(UsuarioOperador(), ct);
        return r.Exito ? NoContent() : ErrorNegocio(r);
    }
}
