using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class PrediccionApiController : BaseSpaApiController
{
    private readonly IPrediccionService _service;
    public PrediccionApiController(IPrediccionService service, IPermisoService permisoService) : base(permisoService) => _service = service;

    [HttpPost("predicciones/recalcular")]
    public async Task<IActionResult> RecalcularPredicciones(CancellationToken ct)
    {
        if (!await PuedeAsync("PREDICCIONES", PermisoAccion.Editar, ct)) return Forbid();
        await _service.RecalcularPrediccionesAsync(ct);
        return NoContent();
    }
}
