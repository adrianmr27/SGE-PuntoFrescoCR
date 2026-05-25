namespace SGE_PuntoFrescoCRDAL.Repositorios.Generico;

public interface IRepositorioGenerico<T> where T : class
{
    Task<T?> ObtenerPorIdAsync(params object[] keyValues);
    Task<List<T>> ObtenerTodosAsync();
    void Agregar(T entidad);
    void Actualizar(T entidad);
    void Eliminar(T entidad);
    void EliminarPorId(params object[] keyValues);
    Task<bool> GuardarCambiosAsync();
}
