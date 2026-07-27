using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class ClienteApiController : BaseSpaApiController
{
    private readonly IClienteService _service;
    public ClienteApiController(IClienteService service, IPermisoService permisoService, AuditoriaService auditoria) : base(permisoService, auditoria) => _service = service;

    [HttpPost("clientes")]
    public async Task<ActionResult<int>> PostCliente([FromBody] ClienteCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("CLIENTES", PermisoAccion.Crear, ct)) return Forbid();
        try
        {
            var id = await _service.CreateClienteAsync(dto, ct);
            if (id == null) return BadRequest();
            await AuditarAsync("CLIENTE_CREADO", "Cliente", id.Value.ToString(), dto.Nombre, ct);
            return Ok(id.Value);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    [HttpPut("clientes/{id:int}")]
    public async Task<IActionResult> PutCliente(int id, [FromBody] ClienteUpdateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("CLIENTES", PermisoAccion.Editar, ct)) return Forbid();
        try
        {
            var ok = await _service.UpdateClienteAsync(id, dto, ct);
            if (!ok) return NotFound();
            await AuditarAsync("CLIENTE_EDITADO", "Cliente", id.ToString(), ct: ct);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }
}
