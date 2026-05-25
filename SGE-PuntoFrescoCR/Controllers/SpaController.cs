using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;
using System.Security.Claims;

namespace SGE_PuntoFrescoCR.Controllers;

[Authorize]
[ApiController]
[Route("api/spa")]
public class SpaController : ControllerBase
{
    private readonly SpaDataService _spa;

    public SpaController(SpaDataService spa) => _spa = spa;

    [HttpGet("bootstrap")]
    [ProducesResponseType(typeof(SpaBootstrapDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<SpaBootstrapDto>> Bootstrap(CancellationToken ct)
    {
        var uid = 0;
        var userClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userClaim) && int.TryParse(userClaim, out var parsed)) uid = parsed;
        var data = await _spa.ObtenerBootstrapAsync(uid, ct);
        return Ok(data);
    }
}
