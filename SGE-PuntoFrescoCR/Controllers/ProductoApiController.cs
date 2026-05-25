using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class ProductoApiController : BaseSpaApiController
{
    private readonly IProductoService _service;
    public ProductoApiController(IProductoService service, IPermisoService permisoService) : base(permisoService) => _service = service;

    [HttpPost("productos")]
    public async Task<ActionResult<int>> PostProducto([FromBody] ProductoCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("INVENTARIO", PermisoAccion.Crear, ct)) return Forbid();
        var id = await _service.CreateProductoAsync(dto, ct);
        return id == null ? BadRequest() : Ok(id.Value);
    }

    [HttpPut("productos/{id:int}")]
    public async Task<IActionResult> PutProducto(int id, [FromBody] ProductoUpdateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("INVENTARIO", PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _service.UpdateProductoAsync(id, dto, ct);
        return ok ? NoContent() : NotFound();
    }
}
