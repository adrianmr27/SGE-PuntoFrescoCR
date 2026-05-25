using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class EmpleadoApiController : BaseSpaApiController
{
    private readonly IEmpleadoService _service;
    public EmpleadoApiController(IEmpleadoService service, IPermisoService permisoService) : base(permisoService) => _service = service;

    [HttpPost("empleados")]
    public async Task<ActionResult<int>> PostEmpleado([FromBody] EmpleadoCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("EMPLEADOS", PermisoAccion.Crear, ct)) return Forbid();
        var id = await _service.CreateEmpleadoAsync(dto, ct);
        return id == null ? BadRequest() : Ok(id.Value);
    }

    [HttpPut("empleados/{id:int}")]
    public async Task<IActionResult> PutEmpleado(int id, [FromBody] EmpleadoUpdateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("EMPLEADOS", PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _service.UpdateEmpleadoAsync(id, dto, ct);
        return ok ? NoContent() : NotFound();
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
