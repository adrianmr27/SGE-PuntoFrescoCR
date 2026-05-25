using SGE_PuntoFrescoCRDAL.Entidades;

namespace SGE_PuntoFrescoCRBLL.Services;

public enum PermisoAccion
{
    Ver,
    Crear,
    Editar,
    Eliminar,
    Exportar
}

public interface IPermisoService
{
    Task<bool> TienePermisoAsync(int usuarioId, string moduloCodigo, PermisoAccion accion, CancellationToken ct = default);
}
