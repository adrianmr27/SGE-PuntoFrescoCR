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

    protected BaseSpaApiController(IPermisoService permisoService) => _permisoService = permisoService;

    protected int UsuarioOperador()
    {
        var v = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(v, out var id) ? id : 0;
    }

    protected Task<bool> PuedeAsync(string modulo, PermisoAccion accion, CancellationToken ct)
        => _permisoService.TienePermisoAsync(UsuarioOperador(), modulo, accion, ct);
}
