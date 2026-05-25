using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class FinanzaApiController : BaseSpaApiController
{
    private readonly IFinanzaService _service;
    public FinanzaApiController(IFinanzaService service, IPermisoService permisoService) : base(permisoService) => _service = service;

    [HttpPut("cuentas-cobrar/{id:int}/estado")]
    public async Task<IActionResult> PutCuentaCobrarEstado(int id, [FromBody] CuentaEstadoDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("FINANZAS", PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _service.UpdateCuentaCobrarEstadoAsync(id, dto.Estado, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpPut("cuentas-pagar/{id:int}/estado")]
    public async Task<IActionResult> PutCuentaPagarEstado(int id, [FromBody] CuentaEstadoDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("FINANZAS", PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _service.UpdateCuentaPagarEstadoAsync(id, dto.Estado, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpPost("movimientos-financieros")]
    public async Task<IActionResult> PostMovFin([FromBody] MovimientoFinancieroManualDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("FINANZAS", PermisoAccion.Crear, ct)) return Forbid();
        await _service.AddMovimientoFinancieroManualAsync(dto, UsuarioOperador(), ct);
        return NoContent();
    }

    [HttpPost("cuentas-cobrar")]
    public async Task<ActionResult<int>> PostCuentaCobrar([FromBody] CuentaCobrarCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("FINANZAS", PermisoAccion.Crear, ct)) return Forbid();
        var id = await _service.CreateCuentaCobrarAsync(dto, UsuarioOperador(), ct);
        return id == null ? BadRequest() : Ok(id.Value);
    }

    [HttpPost("cuentas-pagar")]
    public async Task<ActionResult<int>> PostCuentaPagar([FromBody] CuentaPagarCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("FINANZAS", PermisoAccion.Crear, ct)) return Forbid();
        var id = await _service.CreateCuentaPagarAsync(dto, UsuarioOperador(), ct);
        return id == null ? BadRequest() : Ok(id.Value);
    }
}
