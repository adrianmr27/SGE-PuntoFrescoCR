using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

[ApiController]
[Route("api/account")]
public class AccountApiController : ControllerBase
{
    private readonly AuthService _auth;

    public AccountApiController(AuthService auth) => _auth = auth;

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] RecoverResetDto dto, CancellationToken ct)
    {
        // Mensaje por campo faltante, en vez de un 400 sin cuerpo que el
        // cliente acababa mostrando como "Bad Request".
        if (string.IsNullOrWhiteSpace(dto.Correo))
            return BadRequest(new { error = "El correo electrónico es obligatorio.", codigo = "CORREO_REQUERIDO", campo = "rp-email" });

        if (string.IsNullOrWhiteSpace(dto.Token))
            return BadRequest(new { error = "El enlace de recuperación no es válido. Solicite uno nuevo.", codigo = "TOKEN_REQUERIDO" });

        if (string.IsNullOrWhiteSpace(dto.NuevaPassword))
            return BadRequest(new { error = "Debe escribir la nueva contraseña.", codigo = "PASSWORD_REQUERIDA", campo = "rp-pass" });

        var ok = await _auth.RestablecerPasswordAsync(dto.Correo.Trim(), dto.Token.Trim(), dto.NuevaPassword, ct);
        return ok ? Ok() : BadRequest(new { error = "El enlace de recuperación venció o ya fue utilizado. Solicite uno nuevo.", codigo = "TOKEN_INVALIDO" });
    }
}
