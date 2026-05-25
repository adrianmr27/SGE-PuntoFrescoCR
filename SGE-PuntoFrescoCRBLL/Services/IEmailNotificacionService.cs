namespace SGE_PuntoFrescoCRBLL.Services;

public interface IEmailNotificacionService
{
    Task EnviarAsync(string destinatario, string asunto, string cuerpoTexto, string? cuerpoHtml, CancellationToken ct = default);
}
