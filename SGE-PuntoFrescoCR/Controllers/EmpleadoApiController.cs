using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class EmpleadoApiController : BaseSpaApiController
{
    private readonly IEmpleadoService _service;
    public EmpleadoApiController(IEmpleadoService service, IPermisoService permisoService, AuditoriaService auditoria) : base(permisoService, auditoria) => _service = service;

    [HttpPost("empleados")]
    public async Task<ActionResult<int>> PostEmpleado([FromBody] EmpleadoCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("EMPLEADOS", PermisoAccion.Crear, ct)) return Forbid();
        var id = await _service.CreateEmpleadoAsync(dto, ct);
        if (id == null) return BadRequest();
        await AuditarAsync("EMPLEADO_CREADO", "Empleado", id.Value.ToString(), ct: ct);
        return Ok(id.Value);
    }

    [HttpPut("empleados/{id:int}")]
    public async Task<IActionResult> PutEmpleado(int id, [FromBody] EmpleadoUpdateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("EMPLEADOS", PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _service.UpdateEmpleadoAsync(id, dto, ct);
        if (!ok) return NotFound();
        await AuditarAsync("EMPLEADO_EDITADO", "Empleado", id.ToString(), ct: ct);
        return NoContent();
    }

    [HttpPut("empleados/yo")]
    public async Task<IActionResult> PutEmpleadoYo([FromBody] EmpleadoSelfUpdateDto dto, CancellationToken ct)
    {
        var empId = await _service.GetEmpleadoIdByUsuarioIdAsync(UsuarioOperador(), ct);
        if (empId == null) return NotFound();
        var ok = await _service.UpdateEmpleadoSelfAsync(empId.Value, dto, ct);
        return ok ? NoContent() : NotFound();
    }
}
