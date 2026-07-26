using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class CategoriaApiController : BaseSpaApiController
{
    private readonly SpaCrudService _service;
    public CategoriaApiController(SpaCrudService service, IPermisoService permisoService) : base(permisoService) => _service = service;

    [HttpPost("categorias")]
    public async Task<ActionResult<int>> PostCategoria([FromBody] CategoriaCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("INVENTARIO", PermisoAccion.Crear, ct)) return Forbid();
        try
        {
            var id = await _service.CreateCategoriaAsync(dto, ct);
            return id == null ? BadRequest() : Ok(id.Value);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }
}
