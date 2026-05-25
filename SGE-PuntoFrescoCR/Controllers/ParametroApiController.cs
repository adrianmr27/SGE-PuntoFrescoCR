using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class ParametroApiController : BaseSpaApiController
{
    private readonly IParametroService _service;
    public ParametroApiController(IParametroService service, IPermisoService permisoService) : base(permisoService) => _service = service;

    [HttpPut("parametros/{id:int}")]
    public async Task<IActionResult> PutParametro(int id, [FromBody] ParametroMutateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("ADMINISTRATIVO", PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _service.UpdateParametroAsync(id, dto, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpPost("parametros")]
    public async Task<ActionResult<int>> PostParametro([FromBody] ParametroCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("ADMINISTRATIVO", PermisoAccion.Crear, ct)) return Forbid();
        var id = await _service.CreateParametroAsync(dto, ct);
        return id == null ? BadRequest() : Ok(id.Value);
    }
}
