using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class ClienteApiController : BaseSpaApiController
{
    private readonly IClienteService _service;
    public ClienteApiController(IClienteService service, IPermisoService permisoService) : base(permisoService) => _service = service;

    [HttpPost("clientes")]
    public async Task<ActionResult<int>> PostCliente([FromBody] ClienteCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("CLIENTES", PermisoAccion.Crear, ct)) return Forbid();
        var id = await _service.CreateClienteAsync(dto, ct);
        return id == null ? BadRequest() : Ok(id.Value);
    }

    [HttpPut("clientes/{id:int}")]
    public async Task<IActionResult> PutCliente(int id, [FromBody] ClienteUpdateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("CLIENTES", PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _service.UpdateClienteAsync(id, dto, ct);
        return ok ? NoContent() : NotFound();
    }
}
