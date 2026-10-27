using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

[Authorize]
[ApiController]
[Route("api/spa")]
public abstract class BaseSpaApiController : ControllerBase
{
    private readonly IPermisoService _permisoService;
    private readonly AuditoriaService _auditoria;

    protected BaseSpaApiController(IPermisoService permisoService, AuditoriaService auditoria)
    {
        _permisoService = permisoService;
        _auditoria = auditoria;
    }

    protected int UsuarioOperador()
    {
        var v = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(v, out var id) ? id : 0;
    }

    protected Task<bool> PuedeAsync(string modulo, PermisoAccion accion, CancellationToken ct)
        => _permisoService.TienePermisoAsync(UsuarioOperador(), modulo, accion, ct);

    protected Task AuditarAsync(string accion, string? entidad = null, string? entidadId = null, string? detalle = null, CancellationToken ct = default)
        => _auditoria.RegistrarAsync(UsuarioOperador(), User.FindFirstValue("usuario"), accion, entidad, entidadId, detalle, ct: ct);

    /// <summary>
    /// Traduce un <see cref="ResultadoOperacion"/> fallido a una respuesta HTTP con
    /// cuerpo explicativo.
    ///
    /// Antes los controladores respondían <c>BadRequest()</c> sin contenido, por lo
    /// que el cliente solo podía mostrar el texto "Bad Request" y el modal acababa
    /// diciendo "Error" sin indicar el motivo. El cuerpo que se emite aquí es el que
    /// consume <c>httpClient.js</c> para resaltar el campo culpable del formulario:
    ///
    ///   { "error": "El correo ya está registrado...", "codigo": "CORREO_DUPLICADO", "campo": "u-email" }
    /// </summary>
    protected ActionResult ErrorNegocio(ResultadoOperacion resultado)
    {
        var cuerpo = new
        {
            error = resultado.Mensaje ?? "No fue posible completar la operación.",
            codigo = resultado.Codigo,
            campo = resultado.Campo
        };

        return StatusCode(resultado.EstadoHttp, cuerpo);
    }

    /// <summary>Conflicto de negocio tipado: conserva el campo del formulario.</summary>
    protected ActionResult ErrorNegocio(ConflictoNegocioException ex) => ErrorNegocio(ex.AResultado());

    /// <summary>
    /// Falta de permiso, con el módulo y la acción nombrados.
    ///
    /// Reemplaza a <c>Forbid()</c>, que además de no llevar cuerpo provoca que el
    /// esquema de cookies intente redirigir al login en vez de responder un 403
    /// limpio a una llamada de API.
    /// </summary>
    protected ActionResult SinPermiso(string accion) =>
        ErrorNegocio(ResultadoOperacion.Prohibido("SIN_PERMISO",
            $"No tiene permiso para {accion}."));

    /// <summary>
    /// Operación rechazada sin un campo concreto al que apuntar.
    /// Reemplaza a los <c>BadRequest()</c> vacíos, que llegaban al cliente como
    /// el texto "Bad Request" y terminaban mostrándose como "Error".
    /// </summary>
    protected ActionResult NoSeGuardo(string detalle) =>
        ErrorNegocio(ResultadoOperacion.Conflicto("NO_GUARDADO", detalle));

    /// <summary>Registro inexistente, con el nombre de la entidad en el mensaje.</summary>
    protected ActionResult NoExiste(string entidad) =>
        ErrorNegocio(ResultadoOperacion.NoEncontrado(
            $"{entidad} no existe o fue eliminado. Actualice la pantalla e intente de nuevo."));
}
