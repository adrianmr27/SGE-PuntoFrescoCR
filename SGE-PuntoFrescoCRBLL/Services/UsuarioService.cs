using Microsoft.EntityFrameworkCore;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRDAL.Data;

namespace SGE_PuntoFrescoCRBLL.Services;

/// <summary>
/// Reglas de negocio de la gestión de usuarios.
///
/// Antes esta clase solo reenviaba las llamadas a <see cref="SpaCrudService"/> y
/// devolvía <c>bool</c>, de modo que el sistema aceptaba operaciones que no
/// debería permitir (un usuario podía desactivarse a sí mismo) y, cuando
/// rechazaba algo, el cliente no podía saber por qué.
/// </summary>
public class UsuarioService : IUsuarioService
{
    private readonly SpaCrudService _crud;
    private readonly SgePuntoFrescoDbContext _db;
    private readonly SesionService _sesiones;
    private readonly AuditoriaService _auditoria;

    public UsuarioService(
        SpaCrudService crud,
        SgePuntoFrescoDbContext db,
        SesionService sesiones,
        AuditoriaService auditoria)
    {
        _crud = crud;
        _db = db;
        _sesiones = sesiones;
        _auditoria = auditoria;
    }

    /// <summary>Nombre del rol con privilegios plenos. Centralizado para no repetir el literal.</summary>
    public const string RolAdministrador = "Administrador";

    /* ─────────────────────────── Validaciones de formato ─────────────────────────── */

    private static ResultadoOperacion? ValidarCampos(
        string nombreCompleto, string identificacion, string nombreUsuario, string correo, int rolId)
    {
        if (string.IsNullOrWhiteSpace(nombreCompleto))
            return ResultadoOperacion.Invalido("NOMBRE_REQUERIDO",
                "El nombre completo es obligatorio.", "u-nombre");

        if (nombreCompleto.Trim().Length < 3)
            return ResultadoOperacion.Invalido("NOMBRE_CORTO",
                "El nombre completo debe tener al menos 3 caracteres.", "u-nombre");

        if (string.IsNullOrWhiteSpace(identificacion))
            return ResultadoOperacion.Invalido("IDENTIFICACION_REQUERIDA",
                "La identificación es obligatoria.", "u-ident");

        if (identificacion.Any(c => !char.IsDigit(c) && c is not ('-' or ' ')))
            return ResultadoOperacion.Invalido("IDENTIFICACION_FORMATO",
                "La identificación debe contener únicamente números y guiones.", "u-ident");

        var soloDigitos = identificacion.Count(char.IsDigit);
        if (soloDigitos is < 9 or > 12)
            return ResultadoOperacion.Invalido("IDENTIFICACION_LONGITUD",
                $"La identificación debe tener entre 9 y 12 dígitos (se recibieron {soloDigitos}).", "u-ident");

        if (string.IsNullOrWhiteSpace(nombreUsuario))
            return ResultadoOperacion.Invalido("USUARIO_REQUERIDO",
                "El nombre de usuario es obligatorio.", "u-usuario");

        if (nombreUsuario.Trim().Length < 4)
            return ResultadoOperacion.Invalido("USUARIO_CORTO",
                "El nombre de usuario debe tener al menos 4 caracteres.", "u-usuario");

        if (nombreUsuario.Any(char.IsWhiteSpace))
            return ResultadoOperacion.Invalido("USUARIO_ESPACIOS",
                "El nombre de usuario no puede contener espacios.", "u-usuario");

        if (string.IsNullOrWhiteSpace(correo))
            return ResultadoOperacion.Invalido("CORREO_REQUERIDO",
                "El correo electrónico es obligatorio.", "u-email");

        if (!EsCorreoValido(correo))
            return ResultadoOperacion.Invalido("CORREO_FORMATO",
                "El correo electrónico no tiene un formato válido (ejemplo: nombre@puntofresco.cr).", "u-email");

        if (rolId <= 0)
            return ResultadoOperacion.Invalido("ROL_REQUERIDO",
                "Debe seleccionar un rol para el usuario.", "u-rol");

        return null;
    }

    private static bool EsCorreoValido(string correo)
    {
        var valor = correo.Trim();
        try
        {
            var direccion = new System.Net.Mail.MailAddress(valor);
            return direccion.Address == valor && valor.Contains('.', StringComparison.Ordinal);
        }
        catch
        {
            return false;
        }
    }

    private static ResultadoOperacion? ValidarTelefono(string? telefono, string campo, string etiqueta)
    {
        if (string.IsNullOrWhiteSpace(telefono)) return null;

        if (telefono.Any(c => !char.IsDigit(c) && c is not ('-' or ' ' or '+' or '(' or ')')))
            return ResultadoOperacion.Invalido("TELEFONO_FORMATO",
                $"{etiqueta} solo admite números, espacios, guiones y paréntesis.", campo);

        var digitos = telefono.Count(char.IsDigit);
        if (digitos is < 8 or > 15)
            return ResultadoOperacion.Invalido("TELEFONO_LONGITUD",
                $"{etiqueta} debe tener entre 8 y 15 dígitos (se recibieron {digitos}).", campo);

        return null;
    }

    /* ─────────────────────────── Duplicados ─────────────────────────── */

    private async Task<ResultadoOperacion?> ValidarDuplicadosAsync(
        int? idExcluir, string nombreUsuario, string identificacion, string correo, CancellationToken ct)
    {
        var nu = nombreUsuario.Trim();
        var ident = identificacion.Trim();
        var mail = correo.Trim();

        var choque = await _db.Usuarios.AsNoTracking()
            .Where(x => idExcluir == null || x.UsuarioId != idExcluir.Value)
            .Where(x => x.NombreUsuario == nu || x.Identificacion == ident || x.Correo == mail)
            .Select(x => new { x.NombreUsuario, x.Identificacion, x.Correo })
            .FirstOrDefaultAsync(ct);

        if (choque == null) return null;

        // Se indica exactamente cuál de los tres campos está repetido.
        if (string.Equals(choque.NombreUsuario, nu, StringComparison.OrdinalIgnoreCase))
            return ResultadoOperacion.Conflicto("USUARIO_DUPLICADO",
                $"El nombre de usuario «{nu}» ya está registrado. Elija otro.", "u-usuario");

        if (string.Equals(choque.Identificacion, ident, StringComparison.OrdinalIgnoreCase))
            return ResultadoOperacion.Conflicto("IDENTIFICACION_DUPLICADA",
                $"La identificación «{ident}» ya pertenece a otro usuario.", "u-ident");

        return ResultadoOperacion.Conflicto("CORREO_DUPLICADO",
            $"El correo «{mail}» ya está registrado para otro usuario.", "u-email");
    }

    /* ─────────────────────────── Reglas del rol Administrador ─────────────────────────── */

    private async Task<bool> EsRolAdministradorAsync(int rolId, CancellationToken ct) =>
        await _db.Roles.AsNoTracking()
            .AnyAsync(r => r.RolId == rolId && r.Nombre == RolAdministrador, ct);

    private async Task<bool> OperadorEsAdministradorAsync(int operadorId, CancellationToken ct) =>
        await _db.Usuarios.AsNoTracking()
            .Include(u => u.Rol)
            .AnyAsync(u => u.UsuarioId == operadorId && u.Activo && u.Rol.Nombre == RolAdministrador, ct);



    /// <summary>
    /// Impide dejar el sistema sin ningún Administrador activo, ya sea al
    /// desactivar al único que hay o al quitarle el rol.
    /// </summary>
    private async Task<ResultadoOperacion?> ValidarNoDejarSinAdminAsync(
        int id, int nuevoRolId, bool quedaraActivo, CancellationToken ct)
    {
        var actual = await _db.Usuarios.AsNoTracking()
            .Include(u => u.Rol)
            .Where(u => u.UsuarioId == id)
            .Select(u => new { u.Activo, EsAdmin = u.Rol.Nombre == RolAdministrador })
            .FirstOrDefaultAsync(ct);

        if (actual is not { Activo: true, EsAdmin: true }) return null;

        var seguiraSiendoAdmin = quedaraActivo && await EsRolAdministradorAsync(nuevoRolId, ct);
        if (seguiraSiendoAdmin) return null;

        var quedanOtros = await _db.Usuarios.AsNoTracking()
            .Include(u => u.Rol)
            .AnyAsync(u => u.UsuarioId != id && u.Activo && u.Rol.Nombre == RolAdministrador, ct);

        if (quedanOtros) return null;

        return ResultadoOperacion.Conflicto("ULTIMO_ADMIN",
            "Este es el único Administrador activo del sistema. Asigne el rol a otro usuario antes " +
            "de desactivarlo o de cambiarle el rol.",
            quedaraActivo ? "u-rol" : "u-estado-sw");
    }

    /* ─────────────────────────── Operaciones públicas ─────────────────────────── */

    public async Task<ResultadoOperacion> CrearAsync(UsuarioCreateDto dto, int operadorId, CancellationToken ct = default)
    {
        var formato = ValidarCampos(dto.NombreCompleto, dto.Identificacion, dto.NombreUsuario, dto.Correo, dto.RolId);
        if (formato != null) return formato;

        var tel = ValidarTelefono(dto.Telefono, "u-tel", "El teléfono");
        if (tel != null) return tel;

        var telEmergencia = ValidarTelefono(dto.ContactoEmergenciaTel, "u-emerg-tel", "El teléfono de emergencia");
        if (telEmergencia != null) return telEmergencia;

        if (!await _db.Roles.AsNoTracking().AnyAsync(r => r.RolId == dto.RolId && r.Activo, ct))
            return ResultadoOperacion.Invalido("ROL_INEXISTENTE",
                "El rol seleccionado no existe o está inactivo.", "u-rol");

        var duplicado = await ValidarDuplicadosAsync(null, dto.NombreUsuario, dto.Identificacion, dto.Correo, ct);
        if (duplicado != null) return duplicado;

        // Crear un Administrador exige ser Administrador y respetar la unicidad del rol.
        if (await EsRolAdministradorAsync(dto.RolId, ct))
        {
            if (!await OperadorEsAdministradorAsync(operadorId, ct))
                return ResultadoOperacion.Prohibido("REQUIERE_ADMIN",
                    "Solo un Administrador puede crear otro usuario con rol Administrador.");
        }

        var id = await _crud.CreateUsuarioAsync(dto, ct);
        if (id == null)
            return ResultadoOperacion.Conflicto("NO_CREADO",
                "No fue posible crear el usuario. Verifique que los datos no estén ya registrados.");

        return ResultadoOperacion.Ok(id);
    }

    public async Task<ResultadoOperacion> ActualizarAsync(
        int id, UsuarioUpdateDto dto, int operadorId, CancellationToken ct = default)
    {
        var actual = await _db.Usuarios.AsNoTracking()
            .Include(u => u.Rol)
            .Where(u => u.UsuarioId == id)
            .Select(u => new { u.Activo, u.RolId, u.NombreCompleto, u.NombreUsuario })
            .FirstOrDefaultAsync(ct);

        if (actual == null) return ResultadoOperacion.NoEncontrado("El usuario no existe o fue eliminado.");

        /* ── Regla 1: nadie puede autodesactivarse ──
           Se evalúa antes que nada: es la prueba que se pide explícitamente y
           debe fallar aunque el resto del formulario sea válido. */
        if (id == operadorId && !dto.Activo)
            return ResultadoOperacion.Prohibido("AUTODESACTIVACION",
                "No puede desactivar su propio usuario. Solicite el cambio a otro Administrador.");

        /* ── Regla 2: tampoco puede quitarse a sí mismo el rol de Administrador ──
           Es la misma puerta trasera por otra vía: al perder el rol perdería el
           acceso y podría dejar el sistema sin administrador. */
        if (id == operadorId && actual.RolId != dto.RolId && await EsRolAdministradorAsync(actual.RolId, ct))
            return ResultadoOperacion.Prohibido("AUTOCAMBIO_ROL",
                "No puede cambiar su propio rol de Administrador. Solicítelo a otro Administrador.");

        var formato = ValidarCampos(dto.NombreCompleto, dto.Identificacion, dto.NombreUsuario, dto.Correo, dto.RolId);
        if (formato != null) return formato;

        var tel = ValidarTelefono(dto.Telefono, "u-tel", "El teléfono");
        if (tel != null) return tel;

        var telEmergencia = ValidarTelefono(dto.ContactoEmergenciaTel, "u-emerg-tel", "El teléfono de emergencia");
        if (telEmergencia != null) return telEmergencia;

        if (!await _db.Roles.AsNoTracking().AnyAsync(r => r.RolId == dto.RolId && r.Activo, ct))
            return ResultadoOperacion.Invalido("ROL_INEXISTENTE",
                "El rol seleccionado no existe o está inactivo.", "u-rol");

        var duplicado = await ValidarDuplicadosAsync(id, dto.NombreUsuario, dto.Identificacion, dto.Correo, ct);
        if (duplicado != null) return duplicado;

        /* ── Regla 3: reactivar exige rol Administrador ──
           El permiso USUARIOS.editar no basta: reactivar devuelve el acceso al
           sistema a una cuenta que alguien cerró deliberadamente. */
        var esReactivacion = !actual.Activo && dto.Activo;
        if (esReactivacion && !await OperadorEsAdministradorAsync(operadorId, ct))
            return ResultadoOperacion.Prohibido("REACTIVACION_REQUIERE_ADMIN",
                "Solo un Administrador activo puede reactivar un usuario desactivado.");

        /* ── Regla 4: asignar el rol Administrador exige ser Administrador ── */
        var pasaASerAdmin = actual.RolId != dto.RolId && await EsRolAdministradorAsync(dto.RolId, ct);
        if (pasaASerAdmin && !await OperadorEsAdministradorAsync(operadorId, ct))
            return ResultadoOperacion.Prohibido("REQUIERE_ADMIN",
                "Solo un Administrador puede asignar el rol Administrador.");


        /* ── Regla 5: no dejar el sistema sin Administrador ── */
        var sinAdmin = await ValidarNoDejarSinAdminAsync(id, dto.RolId, dto.Activo, ct);
        if (sinAdmin != null) return sinAdmin;

        var ok = await _crud.UpdateUsuarioAsync(id, dto, ct);
        if (!ok)
            return ResultadoOperacion.Conflicto("NO_ACTUALIZADO",
                "No fue posible actualizar el usuario. Verifique que los datos no estén ya registrados.");

        /* ── Efectos sobre la sesión del usuario afectado ──
           Esta es la parte que el sistema no hacía: al desactivar o al cambiar el
           rol, la sesión abierta se cierra en el acto, sin esperar a que el
           usuario haga una petición nueva. */
        var operador = await _db.Usuarios.AsNoTracking()
            .Where(u => u.UsuarioId == operadorId)
            .Select(u => u.NombreUsuario)
            .FirstOrDefaultAsync(ct);

        if (actual.Activo && !dto.Activo)
        {
            await _sesiones.CerrarSesionAsync(id, MotivoCierreSesion.CuentaDesactivada, operadorId, operador, ct);
            await _auditoria.RegistrarAsync(operadorId, operador, "USUARIO_DESACTIVADO",
                "Usuario", id.ToString(), actual.NombreUsuario, ct: ct);
        }
        else if (esReactivacion)
        {
            await _auditoria.RegistrarAsync(operadorId, operador, "USUARIO_REACTIVADO",
                "Usuario", id.ToString(), actual.NombreUsuario, ct: ct);
        }
        else if (actual.RolId != dto.RolId)
        {
            // El rol viaja dentro de la cookie: hay que rehacer la sesión para que
            // los permisos nuevos surtan efecto y no queden los antiguos en caché.
            await _sesiones.CerrarSesionAsync(id, MotivoCierreSesion.PermisosCambiados, operadorId, operador, ct);
            await _auditoria.RegistrarAsync(operadorId, operador, "USUARIO_ROL_CAMBIADO",
                "Usuario", id.ToString(), $"{actual.RolId} → {dto.RolId}", ct: ct);
        }

        return ResultadoOperacion.Ok(id);
    }

    /* ── Compatibilidad con la interfaz anterior ──
       Se conservan para no romper llamadas existentes, pero los controladores
       deben usar CrearAsync / ActualizarAsync para poder devolver el motivo. */
    public Task<int?> CreateUsuarioAsync(UsuarioCreateDto dto, CancellationToken ct = default) =>
        _crud.CreateUsuarioAsync(dto, ct);

    public Task<bool> UpdateUsuarioAsync(int id, UsuarioUpdateDto dto, CancellationToken ct = default) =>
        _crud.UpdateUsuarioAsync(id, dto, ct);
}
