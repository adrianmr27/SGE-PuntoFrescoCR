using SGE_PuntoFrescoCRBLL.Dtos;

namespace SGE_PuntoFrescoCRBLL.Services;

public interface IUsuarioService
{
    /// <summary>
    /// Crea un usuario aplicando todas las reglas de negocio.
    /// <paramref name="operadorId"/> es quien ejecuta la acción: se necesita para
    /// validar la unicidad y la asignación del rol Administrador.
    /// </summary>
    Task<ResultadoOperacion> CrearAsync(UsuarioCreateDto dto, int operadorId, CancellationToken ct = default);

    /// <summary>
    /// Actualiza un usuario aplicando todas las reglas de negocio: prohibición de
    /// autodesactivación, unicidad del rol Administrador, reactivación reservada a
    /// administradores y cierre inmediato de la sesión afectada.
    /// </summary>
    Task<ResultadoOperacion> ActualizarAsync(int id, UsuarioUpdateDto dto, int operadorId, CancellationToken ct = default);

    /* Firmas heredadas, sin validación de reglas. Se mantienen solo por
       compatibilidad con código existente; no usar en controladores nuevos. */
    Task<int?> CreateUsuarioAsync(UsuarioCreateDto dto, CancellationToken ct = default);
    Task<bool> UpdateUsuarioAsync(int id, UsuarioUpdateDto dto, CancellationToken ct = default);
}
