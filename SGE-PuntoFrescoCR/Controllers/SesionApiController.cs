using System.Security.Claims;
using System.Text.Json;
using System.Threading.Channels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

/// <summary>
/// Canal de eventos de sesión.
///
/// El requisito es que, si a una persona la desactivan mientras tiene la pestaña
/// abierta, la sesión se caiga en ese mismo instante y no en su próxima petición.
/// HTTP no permite que el servidor hable primero, así que el navegador deja
/// abierta una conexión contra <c>/api/spa/sesion/stream</c> (Server-Sent Events)
/// y el servidor escribe en ella en cuanto el administrador guarda el cambio.
///
/// Se eligió SSE en vez de WebSockets porque el flujo es unidireccional, funciona
/// sobre HTTP normal sin negociación adicional y el navegador reconecta solo.
/// </summary>
[Authorize]
[ApiController]
[Route("api/spa/sesion")]
public class SesionApiController : ControllerBase
{
    private readonly ISesionEventBus _bus;
    private readonly SesionService _sesiones;
    private readonly ILogger<SesionApiController> _log;

    public SesionApiController(ISesionEventBus bus, SesionService sesiones, ILogger<SesionApiController> log)
    {
        _bus = bus;
        _sesiones = sesiones;
        _log = log;
    }

    /// <summary>Intervalo del latido que mantiene viva la conexión a través de proxies.</summary>
    private static readonly TimeSpan Latido = TimeSpan.FromSeconds(25);

    private int UsuarioActual()
    {
        var v = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(v, out var id) ? id : 0;
    }

    [HttpGet("stream")]
    public async Task Stream(CancellationToken ct)
    {
        var usuarioId = UsuarioActual();
        if (usuarioId <= 0)
        {
            // Modo de desarrollo sin login (Auth:DisableLogin): no hay sesión real
            // que vigilar. Se responde 204 en vez de 401 para que el cliente
            // sencillamente no active el vigilante, en lugar de creer que la
            // sesión caducó y entrar en un ciclo de cierres.
            Response.StatusCode = StatusCodes.Status204NoContent;
            return;
        }

        Response.Headers["Content-Type"] = "text/event-stream";
        Response.Headers["Cache-Control"] = "no-cache, no-transform";
        Response.Headers["Connection"] = "keep-alive";
        // Evita que un proxy inverso (nginx, IIS ARR) acumule la respuesta en búfer
        // y retrase justamente el evento que se quiere entregar al instante.
        Response.Headers["X-Accel-Buffering"] = "no";

        var (lector, suscripcion) = _bus.Suscribir(usuarioId);

        try
        {
            // Mensaje inicial: confirma al cliente que el canal quedó establecido.
            await EscribirAsync("conectado", new { ok = true }, ct);

            while (!ct.IsCancellationRequested)
            {
                using var latido = CancellationTokenSource.CreateLinkedTokenSource(ct);
                latido.CancelAfter(Latido);

                EventoSesion? evento = null;
                try
                {
                    evento = await lector.ReadAsync(latido.Token);
                }
                catch (OperationCanceledException) when (!ct.IsCancellationRequested)
                {
                    // Venció el temporizador del latido, no la conexión: se manda
                    // un comentario SSE (línea que empieza con ':') para mantenerla viva.
                    await Response.WriteAsync(": latido\n\n", ct);
                    await Response.Body.FlushAsync(ct);
                    continue;
                }
                catch (ChannelClosedException)
                {
                    break;
                }

                if (evento == null) continue;

                await EscribirAsync("cerrar-sesion", new
                {
                    motivo = evento.Motivo.ToString(),
                    mensaje = evento.Mensaje
                }, ct);

                // Ya se avisó: no tiene sentido mantener el canal abierto.
                break;
            }
        }
        catch (OperationCanceledException)
        {
            // El usuario cerró la pestaña. Es el final normal de esta conexión.
        }
        catch (Exception ex)
        {
            _log.LogWarning(ex, "Se interrumpió el canal de sesión del usuario {UsuarioId}.", usuarioId);
        }
        finally
        {
            suscripcion.Dispose();
        }
    }

    private async Task EscribirAsync(string evento, object datos, CancellationToken ct)
    {
        var json = JsonSerializer.Serialize(datos);
        await Response.WriteAsync($"event: {evento}\ndata: {json}\n\n", ct);
        await Response.Body.FlushAsync(ct);
    }

    /// <summary>
    /// Respaldo por sondeo para navegadores o redes donde SSE no prospera
    /// (algunos proxies corporativos lo cortan). El cliente lo consulta cada pocos
    /// segundos solo si el canal SSE falló.
    /// </summary>
    [HttpGet("estado")]
    public async Task<IActionResult> Estado(CancellationToken ct)
    {
        var usuarioId = UsuarioActual();
        if (usuarioId <= 0) return Ok(new { valida = true, estado = "SinControl" });

        var token = User.FindFirstValue(SesionService.ClaimSesion);
        var estado = await _sesiones.ValidarAsync(usuarioId, token, ct);

        return Ok(new
        {
            valida = estado == EstadoSesion.Valida,
            estado = estado.ToString()
        });
    }
}
