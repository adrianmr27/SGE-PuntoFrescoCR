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
}
