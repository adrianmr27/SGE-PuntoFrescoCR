using Microsoft.EntityFrameworkCore;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRDAL.Data;
using SGE_PuntoFrescoCRDAL.Entidades;

namespace SGE_PuntoFrescoCRBLL.Services;

public class RolService : IRolService
{
    private readonly SgePuntoFrescoDbContext _db;

    public RolService(SgePuntoFrescoDbContext db) => _db = db;

    public async Task<int?> CreateRolAsync(RolCreateDto dto, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre)) return null;
        var r = new Rol
        {
            Nombre = dto.Nombre.Trim(),
            Descripcion = dto.Descripcion?.Trim(),
            Activo = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Roles.Add(r);
        await _db.SaveChangesAsync(ct);

        var modulos = await _db.Modulos.Where(m => m.Activo).ToListAsync(ct);
        foreach (var m in modulos)
        {
            _db.Permisos.Add(new Permiso
            {
                RolId = r.RolId,
                ModuloId = m.ModuloId,
                PuedeVer = false,
                PuedeCrear = false,
                PuedeEditar = false,
                PuedeElim = false,
                PuedeExport = false
            });
        }
        await _db.SaveChangesAsync(ct);
        return r.RolId;
    }

    public async Task<bool> UpdateRolAsync(int id, RolUpdateDto dto, CancellationToken ct = default)
    {
        var r = await _db.Roles.FirstOrDefaultAsync(x => x.RolId == id, ct);
        if (r == null) return false;
        r.Nombre = dto.Nombre.Trim();
        r.Descripcion = dto.Descripcion?.Trim();
        r.Activo = dto.Activo;
        r.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> UpdatePermisosRolAsync(int rolId, List<PermisoModuloDto> filas, CancellationToken ct = default)
    {
        var rol = await _db.Roles.FirstOrDefaultAsync(r => r.RolId == rolId, ct);
        if (rol == null) return false;

        var existentes = await _db.Permisos.Where(p => p.RolId == rolId).ToDictionaryAsync(p => p.ModuloId, ct);
        foreach (var f in filas)
        {
            if (!existentes.TryGetValue(f.ModuloId, out var p))
            {
                p = new Permiso
                {
                    RolId = rolId,
                    ModuloId = f.ModuloId
                };
                _db.Permisos.Add(p);
            }

            p.PuedeVer = f.PuedeVer;
            p.PuedeCrear = f.PuedeCrear;
            p.PuedeEditar = f.PuedeEditar;
            p.PuedeElim = f.PuedeElim;
            p.PuedeExport = f.PuedeExport;
        }
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<List<PermisoRolDto>> GetPermisosRolAsync(int rolId, CancellationToken ct = default)
    {
        return await _db.Permisos.AsNoTracking()
            .Where(p => p.RolId == rolId)
            .OrderBy(p => p.ModuloId)
            .Select(p => new PermisoRolDto
            {
                ModuloId = p.ModuloId,
                PuedeVer = p.PuedeVer,
                PuedeCrear = p.PuedeCrear,
                PuedeEditar = p.PuedeEditar,
                PuedeElim = p.PuedeElim,
                PuedeExport = p.PuedeExport
            }).ToListAsync(ct);
    }
}
