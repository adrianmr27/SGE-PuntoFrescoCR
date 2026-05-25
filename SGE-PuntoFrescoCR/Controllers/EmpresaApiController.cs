using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EmpresaApiController : ControllerBase
{
    private readonly EmpresaBllService _empresa;
    private readonly IPermisoService _permisoService;

    public EmpresaApiController(EmpresaBllService empresa, IPermisoService permisoService)
    {
        _empresa = empresa;
        _permisoService = permisoService;
    }

    private int UsuarioOperador()
    {
        var v = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(v, out var id) ? id : 0;
    }

    [HttpPut]
    public async Task<IActionResult> Put([FromBody] EmpresaUpdateDto dto, CancellationToken ct)
    {
        var canEdit = await _permisoService.TienePermisoAsync(UsuarioOperador(), "ADMINISTRATIVO", PermisoAccion.Editar, ct);
        if (!canEdit) return Forbid();
        var ok = await _empresa.ActualizarAsync(dto, ct);
        return ok ? NoContent() : NotFound();
    }
}
