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
        if (!await PuedeAsync("INVENTARIO", PermisoAccion.Crear, ct)) return SinPermiso("crear productos del inventario");
        try
        {
            var id = await _service.CreateProductoAsync(dto, ct);
            if (id == null) return NoSeGuardo("No fue posible crear el producto. Verifique que el nombre no exista ya en esa categoría.");
            await AuditarAsync("PRODUCTO_CREADO", "Producto", id.Value.ToString(), dto.Nombre, ct);
            return Ok(id.Value);
        }
        catch (ConflictoNegocioException ex)
        {
            // Lleva el campo del formulario: el modal lo resalta en vez de
            // mostrar un aviso suelto.
            return ErrorNegocio(ex);
        }
        catch (InvalidOperationException ex)
        {
            return ErrorNegocio(ResultadoOperacion.Conflicto("CONFLICTO", ex.Message));
        }
    }

    [HttpPut("productos/{id:int}")]
    public async Task<IActionResult> PutProducto(int id, [FromBody] ProductoUpdateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("INVENTARIO", PermisoAccion.Editar, ct)) return SinPermiso("editar productos del inventario");
        try
        {
            var ok = await _service.UpdateProductoAsync(id, dto, ct);
            if (!ok) return NoExiste("El producto");
            await AuditarAsync("PRODUCTO_EDITADO", "Producto", id.ToString(), ct: ct);
            return NoContent();
        }
        catch (ConflictoNegocioException ex)
        {
            // Lleva el campo del formulario: el modal lo resalta en vez de
            // mostrar un aviso suelto.
            return ErrorNegocio(ex);
        }
        catch (InvalidOperationException ex)
        {
            return ErrorNegocio(ResultadoOperacion.Conflicto("CONFLICTO", ex.Message));
        }
    }
}
