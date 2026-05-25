using Microsoft.EntityFrameworkCore;
using SGE_PuntoFrescoCRDAL.Data;

namespace SGE_PuntoFrescoCRBLL.Services;

public class PermisoService : IPermisoService
{
    private readonly SgePuntoFrescoDbContext _db;

    public PermisoService(SgePuntoFrescoDbContext db) => _db = db;

    public async Task<bool> TienePermisoAsync(int usuarioId, string moduloCodigo, PermisoAccion accion, CancellationToken ct = default)
    {
        if (usuarioId <= 0 || string.IsNullOrWhiteSpace(moduloCodigo))
            return false;

        var permiso = await (
            from u in _db.Usuarios.AsNoTracking()
            join m in _db.Modulos.AsNoTracking() on true equals true
            join p in _db.Permisos.AsNoTracking() on new { u.RolId, ModuloId = m.ModuloId } equals new { p.RolId, p.ModuloId }
            where u.UsuarioId == usuarioId && m.Codigo == moduloCodigo.ToUpperInvariant() && m.Activo
            select new
            {
                p.PuedeVer,
                p.PuedeCrear,
                p.PuedeEditar,
                p.PuedeElim,
                p.PuedeExport
            }
        ).FirstOrDefaultAsync(ct);

        if (permiso == null) return false;

        return accion switch
        {
            PermisoAccion.Ver => permiso.PuedeVer,
            PermisoAccion.Crear => permiso.PuedeCrear,
            PermisoAccion.Editar => permiso.PuedeEditar,
            PermisoAccion.Eliminar => permiso.PuedeElim,
            PermisoAccion.Exportar => permiso.PuedeExport,
            _ => false
        };
    }
}
