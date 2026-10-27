using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class UsuarioApiController : BaseSpaApiController
{
    private readonly IUsuarioService _service;

    public UsuarioApiController(IUsuarioService service, IPermisoService permisoService, AuditoriaService auditoria)
        : base(permisoService, auditoria) => _service = service;

    [HttpPost("usuarios")]
    public async Task<IActionResult> PostUsuario([FromBody] UsuarioCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("USUARIOS", PermisoAccion.Crear, ct))
            return ErrorNegocio(ResultadoOperacion.Prohibido("SIN_PERMISO",
                "No tiene permiso para crear usuarios."));

        var resultado = await _service.CrearAsync(dto, UsuarioOperador(), ct);
        if (!resultado.Exito) return ErrorNegocio(resultado);

        await AuditarAsync("USUARIO_CREADO", "Usuario", resultado.Id!.Value.ToString(), dto.NombreUsuario, ct);
        return Ok(new { id = resultado.Id!.Value });
    }

    [HttpPut("usuarios/{id:int}")]
    public async Task<IActionResult> PutUsuario(int id, [FromBody] UsuarioUpdateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("USUARIOS", PermisoAccion.Editar, ct))
            return ErrorNegocio(ResultadoOperacion.Prohibido("SIN_PERMISO",
                "No tiene permiso para editar usuarios."));

        var resultado = await _service.ActualizarAsync(id, dto, UsuarioOperador(), ct);
        if (!resultado.Exito) return ErrorNegocio(resultado);

        await AuditarAsync("USUARIO_EDITADO", "Usuario", id.ToString(), ct: ct);
        return NoContent();
    }
}
