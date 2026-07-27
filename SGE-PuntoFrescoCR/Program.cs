using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using SGE_PuntoFrescoCRBLL.Extensions;
using SGE_PuntoFrescoCRBLL.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddPuntoFrescoServices(builder.Configuration);

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    // Límite por IP en rutas de autenticación: complementa el bloqueo de cuenta,
    // frenando además ataques distribuidos contra muchos usuarios distintos.
    options.AddFixedWindowLimiter("auth", limiterOptions =>
    {
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.PermitLimit = 10;
        limiterOptions.QueueLimit = 0;
    });
});

builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.LogoutPath = "/Account/Logout";
        options.SlidingExpiration = true;
        // RQNF-004: cierre automático de sesión tras 15 minutos de inactividad.
        // Al ser deslizante, cada solicitud del usuario reinicia el conteo;
        // si no hay ninguna solicitud en 15 minutos, la cookie expira sola.
        options.ExpireTimeSpan = TimeSpan.FromMinutes(15);
        options.Cookie.Name = "SGE.Auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Lax;
    });

builder.Services.AddAuthorization();

builder.Services.AddControllersWithViews();

builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        o.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

var app = builder.Build();

var disableLogin = app.Environment.IsDevelopment() && app.Configuration.GetValue<bool>("Auth:DisableLogin");

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.Use(async (context, next) =>
{
    var headers = context.Response.Headers;
    headers["X-Content-Type-Options"] = "nosniff";
    headers["X-Frame-Options"] = "DENY";
    headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
    // 'unsafe-inline' es necesario porque el SPA usa onclick="" inline y <style> embebidos;
    // si en el futuro se elimina ese patrón, se puede endurecer quitando 'unsafe-inline'.
    // Compose CSP and allow additional development origins when in Development environment
    // Always allow Google Fonts hosts (if you decide to use them in production)
    var csp =
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; " +
        "font-src 'self' https://cdn.jsdelivr.net https://fonts.gstatic.com; " +
        "img-src 'self' data:; " +
        "object-src 'none'; " +
        "frame-ancestors 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self';";

    if (app.Environment.IsDevelopment())
    {
        // Allow local dev tooling (BrowserLink / LiveReload / websockets) to connect to localhost on any port
        // Note: we add connect-src so it overrides default-src for connections.
        csp += " connect-src 'self' http://localhost:* ws://localhost:*;";
    }

    headers["Content-Security-Policy"] = csp;
    await next();
});

app.UseRouting();
app.UseRateLimiter();

app.UseAuthentication();

if (disableLogin)
{
    app.Use(async (context, next) =>
    {
        var authResult = await context.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        if (!authResult.Succeeded || authResult.Principal?.Identity?.IsAuthenticated != true)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, "0"),
                new(ClaimTypes.Name, "Modo sin login"),
                new(ClaimTypes.Email, "dev@local"),
                new("usuario", "dev"),
                new(ClaimTypes.Role, "Administrador")
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            await context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
            context.User = principal;
        }

        await next();
    });
}

app.UseAuthorization();

// RQNF-003: si el administrador desactiva la cuenta, la sesión activa se cierra
// de inmediato en la siguiente solicitud (no espera a que expire la cookie).
if (!disableLogin)
{
    app.Use(async (context, next) =>
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var idClaim = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(idClaim, out var usuarioId) && usuarioId > 0)
            {
                var authSvc = context.RequestServices.GetRequiredService<AuthService>();
                var usuario = await authSvc.ObtenerUsuarioConRolAsync(usuarioId, context.RequestAborted);
                if (usuario == null || !usuario.Activo)
                {
                    await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                    var path = context.Request.Path.Value ?? "";
                    if (path.StartsWith("/api/", StringComparison.OrdinalIgnoreCase))
                    {
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        return;
                    }
                    context.Response.Redirect("/Account/Login");
                    return;
                }
            }
        }

        await next();
    });
}

app.Use(async (context, next) =>
{
    if (context.User.Identity?.IsAuthenticated == true &&
        context.User.HasClaim("requiere_cambio_password", "1"))
    {
        var path = context.Request.Path.Value ?? "";
        var allowed =
            path.StartsWith("/Account/ChangePassword", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/Account/Logout", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/css/", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/js/", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/lib/", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/favicon", StringComparison.OrdinalIgnoreCase);

        if (!allowed)
        {
            context.Response.Redirect("/Account/ChangePassword");
            return;
        }
    }

    await next();
});

app.MapStaticAssets();

if (disableLogin)
{
    app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}")
        .WithStaticAssets();
}
else
{
    app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Account}/{action=Login}/{id?}")
        .WithStaticAssets();
}

app.MapControllers();

app.Run();
