using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class ParametroApiController : BaseSpaApiController
{
    private readonly IParametroService _service;
    public ParametroApiController(IParametroService service, IPermisoService permisoService, AuditoriaService auditoria) : base(permisoService, auditoria) => _service = service;

    [HttpPut("parametros/{id:int}")]
    public async Task<IActionResult> PutParametro(int id, [FromBody] ParametroMutateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("ADMINISTRATIVO", PermisoAccion.Editar, ct)) return SinPermiso("editar parámetros administrativos");
        var ok = await _service.UpdateParametroAsync(id, dto, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpPost("parametros")]
    public async Task<IActionResult> PostParametro([FromBody] ParametroCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("ADMINISTRATIVO", PermisoAccion.Crear, ct)) return SinPermiso("crear parámetros administrativos");
        var id = await _service.CreateParametroAsync(dto, ct);
        return id == null ? BadRequest() : Ok(id.Value);
    }
}
