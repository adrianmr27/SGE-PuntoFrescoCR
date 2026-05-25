using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class PedidoApiController : BaseSpaApiController
{
    private readonly IPedidoService _service;
    public PedidoApiController(IPedidoService service, IPermisoService permisoService) : base(permisoService) => _service = service;

    [HttpPost("pedidos")]
    public async Task<ActionResult<int>> PostPedido([FromBody] PedidoCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("PEDIDOS", PermisoAccion.Crear, ct)) return Forbid();
        var id = await _service.CreatePedidoAsync(dto, UsuarioOperador(), ct);
        return id == null ? BadRequest() : Ok(id.Value);
    }

    [HttpPut("pedidos/{id:int}")]
    public async Task<IActionResult> PutPedido(int id, [FromBody] PedidoUpdateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("PEDIDOS", PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _service.UpdatePedidoBorradorAsync(id, dto, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpGet("pedidos/{id:int}/detalle")]
    public async Task<ActionResult<PedidoDetalleDto>> GetPedidoDetalle(int id, CancellationToken ct)
    {
        if (!await PuedeAsync("PEDIDOS", PermisoAccion.Ver, ct)) return Forbid();
        var dto = await _service.GetPedidoDetalleAsync(id, ct);
        return dto == null ? NotFound() : Ok(dto);
    }

    [HttpPost("pedidos/{id:int}/confirmar")]
    public async Task<IActionResult> ConfirmarPedido(int id, CancellationToken ct)
    {
        if (!await PuedeAsync("PEDIDOS", PermisoAccion.Editar, ct)) return Forbid();
        try
        {
            await _service.ConfirmarPedidoAsync(id, UsuarioOperador(), ct);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("pedidos/{id:int}/entregar")]
    public async Task<IActionResult> EntregarPedido(int id, CancellationToken ct)
    {
        if (!await PuedeAsync("PEDIDOS", PermisoAccion.Editar, ct)) return Forbid();
        try
        {
            await _service.EntregarPedidoAsync(id, UsuarioOperador(), ct);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("pedidos/{id:int}/cancelar")]
    public async Task<IActionResult> CancelarPedido(int id, [FromBody] PedidoCancelarDto? body, CancellationToken ct)
    {
        if (!await PuedeAsync("PEDIDOS", PermisoAccion.Editar, ct)) return Forbid();
        try
        {
            await _service.CancelarPedidoAsync(id, UsuarioOperador(), body?.Motivo, ct);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
