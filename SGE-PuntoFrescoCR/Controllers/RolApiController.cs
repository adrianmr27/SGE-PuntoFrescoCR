using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

[Authorize]
[ApiController]
[Route("api/spa")]
public class RolApiController : ControllerBase
{
    private readonly IRolService _rolService;
    private readonly IPermisoService _permisoService;

    public RolApiController(IRolService rolService, IPermisoService permisoService)
    {
        _rolService = rolService;
        _permisoService = permisoService;
    }

    private int UsuarioOperador()
    {
        var v = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(v, out var id) ? id : 0;
    }

    private async Task<bool> PuedeAsync(PermisoAccion accion, CancellationToken ct)
    {
        return await _permisoService.TienePermisoAsync(UsuarioOperador(), "ROLES", accion, ct);
    }

    [HttpGet("permisos/{rolId:int}")]
    public async Task<ActionResult<List<PermisoRolDto>>> GetPermisos(int rolId, CancellationToken ct)
    {
        if (!await PuedeAsync(PermisoAccion.Ver, ct)) return Forbid();
        var list = await _rolService.GetPermisosRolAsync(rolId, ct);
        return Ok(list);
    }

    [HttpPost("roles")]
    public async Task<ActionResult<int>> PostRol([FromBody] RolCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync(PermisoAccion.Crear, ct)) return Forbid();
        var id = await _rolService.CreateRolAsync(dto, ct);
        return id == null ? BadRequest() : Ok(id.Value);
    }

    [HttpPut("roles/{id:int}")]
    public async Task<IActionResult> PutRol(int id, [FromBody] RolUpdateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync(PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _rolService.UpdateRolAsync(id, dto, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpPut("roles/{id:int}/permisos")]
    public async Task<IActionResult> PutPermisosRol(int id, [FromBody] List<PermisoModuloDto> filas, CancellationToken ct)
    {
        if (!await PuedeAsync(PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _rolService.UpdatePermisosRolAsync(id, filas ?? new(), ct);
        return ok ? NoContent() : NotFound();
    }
}
