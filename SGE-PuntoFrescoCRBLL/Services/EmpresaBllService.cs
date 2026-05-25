using Microsoft.EntityFrameworkCore;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRDAL.Data;

namespace SGE_PuntoFrescoCRBLL.Services;

public class EmpresaBllService
{
    private readonly SgePuntoFrescoDbContext _db;

    public EmpresaBllService(SgePuntoFrescoDbContext db) => _db = db;

    public async Task<bool> ActualizarAsync(EmpresaUpdateDto dto, CancellationToken ct = default)
    {
        var e = await _db.Empresas.FirstOrDefaultAsync(x => x.EmpresaId == 1, ct);
        if (e == null) return false;

        e.NombreComercial = dto.NombreComercial.Trim();
        e.RazonSocial = dto.RazonSocial.Trim();
        e.CedulaJuridica = dto.CedulaJuridica.Trim();
        e.Telefono1 = dto.Telefono1.Trim();
        e.Telefono2 = string.IsNullOrWhiteSpace(dto.Telefono2) ? null : dto.Telefono2.Trim();
        e.CorreoPrincipal = dto.CorreoPrincipal.Trim();
        e.CorreoAlt = string.IsNullOrWhiteSpace(dto.CorreoAlt) ? null : dto.CorreoAlt.Trim();
        e.Direccion = dto.Direccion.Trim();
        e.SitioWeb = string.IsNullOrWhiteSpace(dto.SitioWeb) ? null : dto.SitioWeb.Trim();
        e.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(dto.ImpuestoDefecto))
        {
            var param = await _db.Parametros.FirstOrDefaultAsync(p => p.Tipo == "Impuesto" && p.Nombre.Contains("General"), ct);
            if (param != null)
            {
                param.Valor = dto.ImpuestoDefecto.Trim().TrimEnd('%');
                param.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _db.SaveChangesAsync(ct);
        return true;
    }
}

