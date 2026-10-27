using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class EmpresaApiController : BaseSpaApiController
{
    private readonly EmpresaBllService _empresa;

    public EmpresaApiController(EmpresaBllService empresa, IPermisoService permisoService, AuditoriaService auditoria)
        : base(permisoService, auditoria)
    {
        _empresa = empresa;
    }

    [HttpPut("~/api/EmpresaApi")]
    public async Task<IActionResult> Put([FromBody] EmpresaUpdateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("ADMINISTRATIVO", PermisoAccion.Editar, ct))
            return SinPermiso("editar los datos de la empresa");
        var ok = await _empresa.ActualizarAsync(dto, ct);
        return ok ? NoContent() : NoExiste("La empresa");
    }
}
