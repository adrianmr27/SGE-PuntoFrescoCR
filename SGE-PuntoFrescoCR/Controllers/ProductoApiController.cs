using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class ProductoApiController : BaseSpaApiController
{
    private readonly IProductoService _service;
    public ProductoApiController(IProductoService service, IPermisoService permisoService, AuditoriaService auditoria) : base(permisoService, auditoria) => _service = service;

    [HttpPost("productos")]
    public async Task<ActionResult<int>> PostProducto([FromBody] ProductoCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("INVENTARIO", PermisoAccion.Crear, ct)) return Forbid();
        try
        {
            var id = await _service.CreateProductoAsync(dto, ct);
            if (id == null) return BadRequest();
            await AuditarAsync("PRODUCTO_CREADO", "Producto", id.Value.ToString(), dto.Nombre, ct);
            return Ok(id.Value);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    [HttpPut("productos/{id:int}")]
    public async Task<IActionResult> PutProducto(int id, [FromBody] ProductoUpdateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("INVENTARIO", PermisoAccion.Editar, ct)) return Forbid();
        try
        {
            var ok = await _service.UpdateProductoAsync(id, dto, ct);
            if (!ok) return NotFound();
            await AuditarAsync("PRODUCTO_EDITADO", "Producto", id.ToString(), ct: ct);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }
}
