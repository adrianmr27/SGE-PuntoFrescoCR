using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class AccountController : Controller
{
    private readonly AuthService _auth;
    private readonly IWebHostEnvironment _env;
    private readonly IEmailNotificacionService _email;

    public AccountController(AuthService auth, IWebHostEnvironment env, IEmailNotificacionService email)
    {
        _auth = auth;
        _env = env;
        _email = email;
    }

    [HttpGet]
    [AllowAnonymous]
    public IActionResult Login(string? returnUrl = null)
    {
        ViewData["ReturnUrl"] = returnUrl;
        return View();
    }

    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login([FromForm] string usuario, [FromForm] string password, string? returnUrl, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(usuario) || string.IsNullOrEmpty(password))
        {
            ViewData["Error"] = "Ingrese usuario y contraseña.";
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        var (u, codigo) = await _auth.AutenticarAsync(usuario.Trim(), password, ct);
        if (u == null)
        {
            ViewData["Error"] = codigo switch
            {
                "cuenta_inactiva" => "Su usuario está inactivo. Contacte al administrador.",
                "cuenta_bloqueada" => "Su cuenta está temporalmente bloqueada por intentos fallidos. Intente más tarde o contacte al administrador.",
                _ => "Usuario o contraseña incorrectos."
            };
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, u.UsuarioId.ToString()),
            new(ClaimTypes.Name, u.NombreCompleto),
            new(ClaimTypes.Email, u.Correo),
            new("usuario", u.NombreUsuario),
            new(ClaimTypes.Role, u.Rol.Nombre)
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(identity));

        await _auth.RegistrarAccesoAsync(u.UsuarioId, ct);

        if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
            return Redirect(returnUrl);

        return RedirectToAction("Index", "Home");
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction(nameof(Login));
    }

    [HttpGet]
    [AllowAnonymous]
    public IActionResult Recover() => View();

    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Recover(string correo, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(correo) || !correo.Contains('@'))
        {
            ViewData["Error"] = "Ingrese un correo válido.";
            return View();
        }

        var correoTrim = correo.Trim();
        var (ok, token) = await _auth.SolicitarRecuperacionAsync(correoTrim, ct);
        if (!ok)
        {
            ViewData["Error"] = "No encontramos una cuenta con ese correo.";
            return View();
        }

        if (token != null)
        {
            var resetUrl = Url.Action(nameof(ResetPassword), "Account", new { correo = correoTrim, token },
                Request.Scheme) ?? "";

            // HTML responsive y elegante con la paleta de colores
            var html = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes'>
    <title>Recuperación de contraseña - Punto Fresco CR</title>
    <style>
        /* Reset y estilos base */
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Roboto, Arial, sans-serif;
            background-color: #FAFBFE;
            line-height: 1.6;
            color: #2D3748;
        }}
        
        /* Contenedor principal */
        .container {{
            max-width: 600px;
            width: 100%;
            margin: 0 auto;
            padding: 20px 16px;
        }}
        
        /* Tarjeta principal */
        .email-card {{
            background: #FFFFFF;
            border-radius: 28px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(28, 34, 96, 0.15);
            border: 1px solid rgba(28, 34, 96, 0.08);
        }}
        
        /* Header con gradiente */
        .header {{
            background: linear-gradient(135deg, #1C2260 0%, #2A3180 100%);
            padding: 40px 24px;
            text-align: center;
            position: relative;
        }}
        
        .logo {{
            font-size: 26px;
            font-weight: 700;
            color: #FFFFFF;
            margin-bottom: 12px;
            letter-spacing: -0.3px;
        }}
        
        .logo-accent {{
            color: #5DD2BC;
            position: relative;
            display: inline-block;
        }}
        
        .header-subtitle {{
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            margin-top: 8px;
            font-weight: 400;
        }}
        
        /* Contenido principal */
        .content {{
            padding: 40px 32px;
            background: #FFFFFF;
        }}
        
        /* Título de saludo */
        .greeting {{
            font-size: 26px;
            font-weight: 700;
            color: #1C2260;
            margin-bottom: 20px;
            line-height: 1.3;
        }}
        
        /* Mensaje principal */
        .message {{
            color: #4A5568;
            font-size: 16px;
            margin-bottom: 32px;
            line-height: 1.6;
        }}
        
        .message strong {{
            color: #1C2260;
            font-weight: 600;
        }}
        
        /* Botón principal */
        .button-container {{
            text-align: center;
            margin: 40px 0;
        }}
        
        .button {{
            display: inline-block;
            background: linear-gradient(135deg, #28A745 0%, #34CE57 100%);
            color: #FFFFFF !important;
            text-decoration: none;
            padding: 14px 36px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.25);
            text-align: center;
            cursor: pointer;
        }}
        
        .button:hover {{
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(40, 167, 69, 0.35);
        }}
        
        /* Caja de información */
        .info-box {{
            background: #FAFBFE;
            border-left: 4px solid #5DD2BC;
            padding: 20px 24px;
            border-radius: 16px;
            margin: 32px 0;
        }}
        
        .info-text {{
            color: #4A5568;
            font-size: 14px;
            margin: 0;
            line-height: 1.5;
        }}
        
        .info-text strong {{
            color: #1C2260;
        }}
        
        /* Caja de advertencia */
        .warning-box {{
            background: rgba(255, 112, 118, 0.08);
            border-left: 4px solid #FF7076;
            padding: 20px 24px;
            border-radius: 16px;
            margin: 24px 0;
        }}
        
        .warning-text {{
            font-size: 13px;
            color: #DC2626;
            margin: 0;
            line-height: 1.5;
        }}
        
        .warning-text strong {{
            color: #FF7076;
        }}
        
        /* Divisor decorativo */
        .divider {{
            height: 2px;
            background: linear-gradient(90deg, #5DD2BC, #FF7076, #28A745);
            margin: 32px 0 24px 0;
            border-radius: 2px;
        }}
        
        /* Texto de ayuda */
        .help-text {{
            text-align: center;
            font-size: 13px;
            color: #718096;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid rgba(28, 34, 96, 0.08);
        }}
        
        /* Footer */
        .footer {{
            padding: 32px 24px;
            background: #FAFBFE;
            text-align: center;
            border-top: 1px solid rgba(28, 34, 96, 0.08);
        }}
        
        .footer-text {{
            color: #718096;
            font-size: 12px;
            margin: 8px 0;
            line-height: 1.5;
        }}
        
        .footer-link {{
            color: #28A745;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s ease;
        }}
        
        .footer-link:hover {{
            color: #1C2260;
            text-decoration: underline;
        }}
        
        /* Enlace para móviles (texto alternativo) */
        .mobile-link {{
            display: none;
            word-break: break-all;
            background: #FAFBFE;
            padding: 12px;
            border-radius: 12px;
            font-size: 12px;
            margin-top: 16px;
            color: #28A745;
            text-decoration: none;
            border: 1px solid rgba(40, 167, 69, 0.2);
        }}
        
        /* Responsive Design */
        @media only screen and (max-width: 600px) {{
            .container {{
                padding: 16px 12px;
            }}
            
            .content {{
                padding: 28px 20px;
            }}
            
            .header {{
                padding: 32px 20px;
            }}
            
            .logo {{
                font-size: 22px;
            }}
            
            .greeting {{
                font-size: 22px;
                margin-bottom: 16px;
            }}
            
            .message {{
                font-size: 15px;
                margin-bottom: 24px;
            }}
            
            .button {{
                padding: 12px 28px;
                font-size: 15px;
                width: 100%;
                max-width: 280px;
            }}
            
            .info-box, .warning-box {{
                padding: 16px 20px;
            }}
            
            .info-text, .warning-text {{
                font-size: 13px;
            }}
            
            .footer {{
                padding: 24px 20px;
            }}
            
            .footer-text {{
                font-size: 11px;
            }}
            
            .mobile-link {{
                display: block;
            }}
        }}
        
        /* Soporte para Outlook y clientes antiguos */
        @media only screen and (max-width: 600px) {{
            table[class='container'] {{
                width: 100% !important;
            }}
        }}
        
        /* Modo oscuro para clientes que lo soporten */
        @media (prefers-color-scheme: dark) {{
            body {{
                background-color: #1a202c;
            }}
            .email-card {{
                background: #2d3748;
            }}
            .content {{
                background: #2d3748;
            }}
            .greeting {{
                color: #5DD2BC;
            }}
            .message {{
                color: #e2e8f0;
            }}
            .info-box {{
                background: #1a202c;
            }}
            .footer {{
                background: #1a202c;
            }}
            .footer-text {{
                color: #a0aec0;
            }}
        }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='email-card'>
            <div class='header'>
                <div class='logo'>
                    SGE <span class='logo-accent'>Punto Fresco CR</span>
                </div>
                <div class='header-subtitle'>
                    Sistema de Gestión Empresarial
                </div>
            </div>
            
            <div class='content'>
                <div class='greeting'>
                    ¡Hola!
                </div>
                
                <div class='message'>
                    Recibimos una solicitud para restablecer la contraseña de tu cuenta asociada a 
                    <strong>{correoTrim}</strong>. Si realizaste esta solicitud, haz clic en el botón 
                    para crear una nueva contraseña.
                </div>
                
                <div class='button-container'>
                    <a href='{resetUrl}' class='button'>
                        Restablecer contraseña
                    </a>
                </div>
                
                <!-- Enlace visible en móviles por si el botón no funciona -->
                <div class='mobile-link'>
                    Si el botón no funciona, copia y pega este enlace:<br>
                    <a href='{resetUrl}' style='color: #28A745; word-break: break-all;'>{resetUrl}</a>
                </div>
                
                <div class='info-box'>
                    <div class='info-text'>
                        <strong>⏰ Este enlace expira en 30 minutos</strong><br>
                        Por razones de seguridad, el enlace solo será válido por 30 minutos desde que se envió esta solicitud.
                        Si expira, puedes solicitar un nuevo enlace de recuperación.
                    </div>
                </div>
                
                <div class='warning-box'>
                    <div class='warning-text'>
                        <strong>🔒 ¿No solicitaste este cambio?</strong><br>
                        Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje de forma segura.
                        Tu cuenta permanecerá protegida y nadie podrá acceder sin tu confirmación.
                    </div>
                </div>
                
                <div class='divider'></div>
                
                <div class='help-text'>
                    💡 ¿Necesitas ayuda? Contacta a nuestro equipo de soporte en 
                    <a href='mailto:puntofrescocrsa@gmail.com' style='color: #28A745; text-decoration: none;'>soporte@puntofresco.com</a>
                </div>
            </div>
            
            <div class='footer'>
                <div class='footer-text'>
                    © 2026 SGE - Punto Fresco de Costa Rica.<br>
                    Todos los derechos reservados.
                </div>
                <div class='footer-text'>
                    <a href='#' class='footer-link'>Contacto</a>
                </div>
                <div class='footer-text' style='margin-top: 16px; font-size: 11px;'>
                    Este es un mensaje automático, por favor no responder a este correo.
                </div>
            </div>
        </div>
    </div>
</body>
</html>";

            var textoPlano = $@"
============================================
    RECUPERACIÓN DE CONTRASEÑA
    SGE - Punto Fresco de Costa Rica
============================================

Hola,

Hemos recibido una solicitud para restablecer la contraseña de tu cuenta ({correoTrim}).

Para crear una nueva contraseña, copia y pega el siguiente enlace en tu navegador:

{resetUrl}

⚠️ IMPORTANTE:
• Este enlace expirará en 30 minutos
• Por seguridad, no compartas este enlace con nadie
• Si no solicitaste este cambio, ignora este mensaje

¿Necesitas ayuda?
Contacta a nuestro equipo de soporte: soporte@puntofresco.com

============================================
© 2024 SGE - Punto Fresco de Costa Rica
Este es un mensaje automático, por favor no responder.
============================================";

            try
            {
                await _email.EnviarAsync(
                    correoTrim,
                    "🔐 Recuperación de contraseña — Punto Fresco CR",
                    textoPlano,
                    html,
                    ct);
            }
            catch (Exception ex)
            {
                // Log del error si tienes logger
                // _logger.LogError(ex, "Error al enviar correo de recuperación a {Email}", correoTrim);
                ViewData["Error"] = "No se pudo enviar el correo. Intente más tarde o contacte al administrador.";
                return View();
            }
        }

        ViewData["Ok"] = true;
        ViewBag.RecoverEmail = correoTrim;
        if (_env.IsDevelopment() && token != null)
            ViewBag.RecoveryToken = token;

        return View();
    }

    [HttpGet]
    [AllowAnonymous]
    public IActionResult ResetPassword(string? correo, string? token)
    {
        if (string.IsNullOrWhiteSpace(correo) || string.IsNullOrWhiteSpace(token))
            return RedirectToAction(nameof(Recover));
        ViewBag.ResetCorreo = correo.Trim();
        ViewBag.ResetToken = token.Trim();
        return View();
    }

    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ResetPassword([FromForm] string correo, [FromForm] string token,
        [FromForm] string nuevaPassword, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(correo) || string.IsNullOrWhiteSpace(token) ||
            string.IsNullOrWhiteSpace(nuevaPassword) || nuevaPassword.Length < 8)
        {
            ViewBag.ResetCorreo = correo?.Trim();
            ViewBag.ResetToken = token?.Trim();
            ViewData["Error"] = "Datos inválidos. La contraseña debe tener al menos 8 caracteres.";
            return View();
        }

        var ok = await _auth.RestablecerPasswordAsync(correo.Trim(), token.Trim(), nuevaPassword, ct);
        if (!ok)
        {
            ViewBag.ResetCorreo = correo.Trim();
            ViewBag.ResetToken = token.Trim();
            ViewData["Error"] = "El enlace no es válido o expiró. Solicite uno nuevo.";
            return View();
        }

        return RedirectToAction(nameof(Login));
    }
}
