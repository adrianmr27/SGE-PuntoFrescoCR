using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class UsuarioApiController : BaseSpaApiController
{
    private readonly IUsuarioService _service;
    public UsuarioApiController(IUsuarioService service, IPermisoService permisoService, AuditoriaService auditoria) : base(permisoService, auditoria) => _service = service;

    [HttpPost("usuarios")]
    public async Task<ActionResult<int>> PostUsuario([FromBody] UsuarioCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("USUARIOS", PermisoAccion.Crear, ct)) return Forbid();
        var id = await _service.CreateUsuarioAsync(dto, ct);
        if (id == null) return BadRequest();
        await AuditarAsync("USUARIO_CREADO", "Usuario", id.Value.ToString(), dto.NombreUsuario, ct);
        return Ok(id.Value);
    }

    [HttpPut("usuarios/{id:int}")]
    public async Task<IActionResult> PutUsuario(int id, [FromBody] UsuarioUpdateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("USUARIOS", PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _service.UpdateUsuarioAsync(id, dto, ct);
        if (!ok) return NotFound();
        await AuditarAsync("USUARIO_EDITADO", "Usuario", id.ToString(), ct: ct);
        return NoContent();
    }
}
