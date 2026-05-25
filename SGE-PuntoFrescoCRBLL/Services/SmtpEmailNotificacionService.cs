using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace SGE_PuntoFrescoCRBLL.Services;

public class SmtpEmailNotificacionService : IEmailNotificacionService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SmtpEmailNotificacionService> _logger;

    public SmtpEmailNotificacionService(IConfiguration configuration, ILogger<SmtpEmailNotificacionService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public Task EnviarAsync(string destinatario, string asunto, string cuerpoTexto, string? cuerpoHtml,
        CancellationToken ct = default)
    {
        var host = _configuration["Email:Smtp:Host"];
        if (string.IsNullOrWhiteSpace(host))
        {
            _logger.LogInformation(
                "Correo no enviado (Email:Smtp:Host vacío). Destinatario={To}, Asunto={Subject}",
                destinatario, asunto);
            return Task.CompletedTask;
        }

        var port = int.TryParse(_configuration["Email:Smtp:Port"], out var p) ? p : 587;
        var user = _configuration["Email:Smtp:User"];
        var password = _configuration["Email:Smtp:Password"];
        var from = _configuration["Email:Smtp:From"] ?? user ?? "noreply@localhost";

        using var msg = new MailMessage { From = new MailAddress(from), Subject = asunto };
        msg.To.Add(destinatario);
        if (!string.IsNullOrEmpty(cuerpoHtml))
        {
            msg.IsBodyHtml = true;
            msg.Body = cuerpoHtml;
        }
        else
        {
            msg.IsBodyHtml = false;
            msg.Body = cuerpoTexto;
        }

        var useSsl = !string.Equals(_configuration["Email:Smtp:UseSsl"], "false", StringComparison.OrdinalIgnoreCase);
        using var client = new SmtpClient(host, port)
        {
            EnableSsl = useSsl,
            Credentials = string.IsNullOrEmpty(user)
                ? CredentialCache.DefaultNetworkCredentials
                : new NetworkCredential(user, password)
        };

        try
        {
            client.Send(msg);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al enviar correo a {To}", destinatario);
            throw;
        }

        return Task.CompletedTask;
    }
}
