using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class RolApiController : BaseSpaApiController
{
    private readonly IRolService _rolService;

    public RolApiController(IRolService rolService, IPermisoService permisoService, AuditoriaService auditoria)
        : base(permisoService, auditoria)
    {
        _rolService = rolService;
    }

    private Task<bool> PuedeAsync(PermisoAccion accion, CancellationToken ct)
        => PuedeAsync("ROLES", accion, ct);

    [HttpGet("permisos/{rolId:int}")]
    public async Task<ActionResult<List<PermisoRolDto>>> GetPermisos(int rolId, CancellationToken ct)
    {
        if (!await PuedeAsync(PermisoAccion.Ver, ct)) return SinPermiso("consultar roles y permisos");
        var list = await _rolService.GetPermisosRolAsync(rolId, ct);
        return Ok(list);
    }

    [HttpPost("roles")]
    public async Task<ActionResult<int>> PostRol([FromBody] RolCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync(PermisoAccion.Crear, ct)) return SinPermiso("crear roles");
        var id = await _rolService.CreateRolAsync(dto, ct);
        if (id == null) return NoSeGuardo("No fue posible crear el rol. Verifique que el nombre no esté ya en uso.");
        await AuditarAsync("ROL_CREADO", "Rol", id.Value.ToString(), dto.Nombre, ct);
        return Ok(id.Value);
    }

    [HttpPut("roles/{id:int}")]
    public async Task<IActionResult> PutRol(int id, [FromBody] RolUpdateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync(PermisoAccion.Editar, ct)) return SinPermiso("editar roles y permisos");
        var ok = await _rolService.UpdateRolAsync(id, dto, ct);
        if (!ok) return NoExiste("El rol");
        await AuditarAsync("ROL_EDITADO", "Rol", id.ToString(), ct: ct);
        return NoContent();
    }

    [HttpPut("roles/{id:int}/permisos")]
    public async Task<IActionResult> PutPermisosRol(int id, [FromBody] List<PermisoModuloDto> filas, CancellationToken ct)
    {
        if (!await PuedeAsync(PermisoAccion.Editar, ct)) return SinPermiso("editar roles y permisos");
        var ok = await _rolService.UpdatePermisosRolAsync(id, filas ?? new(), ct);
        if (!ok) return NoExiste("El rol");
        await AuditarAsync("ROL_PERMISOS_EDITADOS", "Rol", id.ToString(), ct: ct);
        return NoContent();
    }
}
