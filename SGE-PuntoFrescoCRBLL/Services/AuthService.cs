using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SGE_PuntoFrescoCRDAL.Data;
using SGE_PuntoFrescoCRDAL.Entidades;

namespace SGE_PuntoFrescoCRBLL.Services;

public class AuthService
{
    private readonly SgePuntoFrescoDbContext _db;
    private readonly IConfiguration _configuration;

    public AuthService(SgePuntoFrescoDbContext db, IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    /// <summary>Resultado detallado del intento de inicio de sesión (HU Usuarios esc. 2 y 3).</summary>
    public async Task<(Usuario? Usuario, string? CodigoError)> AutenticarAsync(string nombreUsuario, string password, CancellationToken ct = default)
    {
        await AsegurarPasswordAdminAsync(ct);

        var usuario = await _db.Usuarios
            .Include(u => u.Rol)
            .FirstOrDefaultAsync(u => u.NombreUsuario == nombreUsuario, ct);

        if (usuario == null)
            return (null, "usuario_invalido");

        if (usuario.BloqueadoHasta.HasValue && usuario.BloqueadoHasta.Value > DateTime.UtcNow)
            return (null, "cuenta_bloqueada");

        if (!usuario.Activo)
            return (null, "cuenta_inactiva");

        if (!BCrypt.Net.BCrypt.Verify(password, usuario.PasswordHash))
            return (null, "clave_incorrecta");

        return (usuario, null);
    }

    public async Task<Usuario?> ValidarCredencialesAsync(string nombreUsuario, string password, CancellationToken ct = default)
    {
        var (u, err) = await AutenticarAsync(nombreUsuario, password, ct);
        return err == null ? u : null;
    }

    /// <summary>
    /// Reemplaza el hash placeholder del script SQL por uno válido (desarrollo / primer arranque).
    /// </summary>
    public async Task AsegurarPasswordAdminAsync(CancellationToken ct = default)
    {
        var pwd = _configuration["Admin:InitialPassword"] ?? "Admin2024!";
        var usuarios = await _db.Usuarios.Where(u => u.PasswordHash.Contains("PLACEHOLDER")).ToListAsync(ct);
        foreach (var u in usuarios)
        {
            var hash = BCrypt.Net.BCrypt.HashPassword(pwd);
            u.PasswordHash = hash;
            u.PasswordSalt = hash;
            u.UpdatedAt = DateTime.UtcNow;
        }

        if (usuarios.Count > 0)
            await _db.SaveChangesAsync(ct);
    }

    public async Task RegistrarAccesoAsync(int usuarioId, CancellationToken ct = default)
    {
        var u = await _db.Usuarios.FirstOrDefaultAsync(x => x.UsuarioId == usuarioId, ct);
        if (u == null) return;
        u.UltimoAcceso = DateTime.UtcNow;
        u.FallasAcceso = 0;
        u.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
    }

    /// <summary>Devuelve el token generado si el correo existe (para pruebas en desarrollo).</summary>
    public async Task<(bool Ok, string? Token)> SolicitarRecuperacionAsync(string correo, CancellationToken ct = default)
    {
        var u = await _db.Usuarios.FirstOrDefaultAsync(x => x.Correo == correo, ct);
        if (u == null) return (false, null);

        var token = Convert.ToHexString(Guid.NewGuid().ToByteArray()) + Convert.ToHexString(Guid.NewGuid().ToByteArray());
        token = token[..Math.Min(64, token.Length)];
        u.TokenRecuperacion = token;
        u.TokenExpiracion = DateTime.UtcNow.AddMinutes(30);
        u.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return (true, token);
    }

    public async Task<bool> RestablecerPasswordAsync(string correo, string token, string nuevaPassword, CancellationToken ct = default)
    {
        var u = await _db.Usuarios.FirstOrDefaultAsync(x => x.Correo == correo && x.TokenRecuperacion == token, ct);
        if (u == null || u.TokenExpiracion == null || u.TokenExpiracion < DateTime.UtcNow)
            return false;

        u.PasswordHash = BCrypt.Net.BCrypt.HashPassword(nuevaPassword);
        u.PasswordSalt = u.PasswordHash;
        u.TokenRecuperacion = null;
        u.TokenExpiracion = null;
        u.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
