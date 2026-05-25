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
        if (string.IsNullOrWhiteSpace(dto.Correo) || string.IsNullOrWhiteSpace(dto.Token) ||
            string.IsNullOrWhiteSpace(dto.NuevaPassword))
            return BadRequest();

        var ok = await _auth.RestablecerPasswordAsync(dto.Correo.Trim(), dto.Token.Trim(), dto.NuevaPassword, ct);
        return ok ? Ok() : BadRequest(new { error = "Token inválido o expirado." });
    }
}
