using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class ClienteApiController : BaseSpaApiController
{
    private readonly IClienteService _service;
    public ClienteApiController(IClienteService service, IPermisoService permisoService, AuditoriaService auditoria) : base(permisoService, auditoria) => _service = service;

    [HttpPost("clientes")]
    public async Task<ActionResult<int>> PostCliente([FromBody] ClienteCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("CLIENTES", PermisoAccion.Crear, ct)) return SinPermiso("crear clientes");
        try
        {
            var id = await _service.CreateClienteAsync(dto, ct);
            if (id == null) return NoSeGuardo("No fue posible crear el cliente. Verifique que la identificación y el correo no estén ya registrados.");
            await AuditarAsync("CLIENTE_CREADO", "Cliente", id.Value.ToString(), dto.Nombre, ct);
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

    [HttpPut("clientes/{id:int}")]
    public async Task<IActionResult> PutCliente(int id, [FromBody] ClienteUpdateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("CLIENTES", PermisoAccion.Editar, ct)) return SinPermiso("editar clientes");
        try
        {
            var ok = await _service.UpdateClienteAsync(id, dto, ct);
            if (!ok) return NoExiste("El cliente");
            await AuditarAsync("CLIENTE_EDITADO", "Cliente", id.ToString(), ct: ct);
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
