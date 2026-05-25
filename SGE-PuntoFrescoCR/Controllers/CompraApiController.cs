using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class CompraApiController : BaseSpaApiController
{
    private readonly ICompraService _service;
    public CompraApiController(ICompraService service, IPermisoService permisoService) : base(permisoService) => _service = service;

    [HttpPost("ordenes-compra")]
    public async Task<ActionResult<int>> PostOrdenCompra([FromBody] OrdenCompraCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("COMPRAS", PermisoAccion.Crear, ct)) return Forbid();
        var id = await _service.CreateOrdenCompraAsync(dto, UsuarioOperador(), ct);
        return id == null ? BadRequest() : Ok(id.Value);
    }

    [HttpGet("ordenes-compra/{id:int}/detalle")]
    public async Task<ActionResult<OrdenCompraDetalleDto>> GetOrdenCompraDetalle(int id, CancellationToken ct)
    {
        if (!await PuedeAsync("COMPRAS", PermisoAccion.Ver, ct)) return Forbid();
        var dto = await _service.GetOrdenCompraDetalleAsync(id, ct);
        return dto == null ? NotFound() : Ok(dto);
    }

    [HttpPut("ordenes-compra/{id:int}")]
    public async Task<IActionResult> PutOrdenCompra(int id, [FromBody] OrdenCompraCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("COMPRAS", PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _service.UpdateOrdenCompraPendienteAsync(id, dto, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpPost("ordenes-compra/{id:int}/confirmar")]
    public async Task<IActionResult> ConfirmarOrdenCompra(int id, CancellationToken ct)
    {
        if (!await PuedeAsync("COMPRAS", PermisoAccion.Editar, ct)) return Forbid();
        try
        {
            await _service.ConfirmarOrdenCompraAsync(id, UsuarioOperador(), ct);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("ordenes-compra/{id:int}/cancelar")]
    public async Task<IActionResult> CancelarOrdenCompra(int id, CancellationToken ct)
    {
        if (!await PuedeAsync("COMPRAS", PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _service.CancelarOrdenCompraAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }
}
