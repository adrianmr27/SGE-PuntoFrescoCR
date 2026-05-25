using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class ProveedorApiController : BaseSpaApiController
{
    private readonly IProveedorService _service;
    public ProveedorApiController(IProveedorService service, IPermisoService permisoService) : base(permisoService) => _service = service;

    [HttpPost("proveedores")]
    public async Task<ActionResult<int>> PostProveedor([FromBody] ProveedorCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("PROVEEDORES", PermisoAccion.Crear, ct)) return Forbid();
        try
        {
            var id = await _service.CreateProveedorAsync(dto, ct);
            return id == null ? BadRequest() : Ok(id.Value);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    [HttpPut("proveedores/{id:int}")]
    public async Task<IActionResult> PutProveedor(int id, [FromBody] ProveedorUpdateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("PROVEEDORES", PermisoAccion.Editar, ct)) return Forbid();
        try
        {
            var ok = await _service.UpdateProveedorAsync(id, dto, ct);
            return ok ? NoContent() : NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }
}
