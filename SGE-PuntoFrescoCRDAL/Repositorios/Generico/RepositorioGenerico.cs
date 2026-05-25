using Microsoft.EntityFrameworkCore;
using SGE_PuntoFrescoCRDAL.Data;

namespace SGE_PuntoFrescoCRDAL.Repositorios.Generico;

public class RepositorioGenerico<T> : IRepositorioGenerico<T> where T : class
{
    private readonly SgePuntoFrescoDbContext _context;
    private readonly DbSet<T> _dbSet;

    public RepositorioGenerico(SgePuntoFrescoDbContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    public void Actualizar(T entidad)
    {
        var entityType = _context.Model.FindEntityType(typeof(T));
        var primaryKey = entityType?.FindPrimaryKey();
        if (primaryKey != null)
        {
            var keyValues = primaryKey.Properties
                .Select(p => _context.Entry(entidad).Property(p.Name).CurrentValue)
                .ToArray();

            var tracked = _dbSet.Local.FirstOrDefault(local =>
            {
                var entry = _context.Entry(local);
                var localKeys = primaryKey.Properties.Select(p => entry.Property(p.Name).CurrentValue);
                return localKeys.SequenceEqual(keyValues);
            });

            if (tracked != null && !ReferenceEquals(tracked, entidad))
                _context.Entry(tracked).State = EntityState.Detached;
        }

        _dbSet.Update(entidad);
    }

    public void Agregar(T entidad) => _dbSet.Add(entidad);

    public void Eliminar(T entidad) => _dbSet.Remove(entidad);

    public void EliminarPorId(params object[] keyValues)
    {
        var entidad = _dbSet.Find(keyValues);
        if (entidad != null)
            _dbSet.Remove(entidad);
    }

    public async Task<bool> GuardarCambiosAsync() => await _context.SaveChangesAsync() > 0;

    public async Task<T?> ObtenerPorIdAsync(params object[] keyValues) =>
        await _dbSet.FindAsync(keyValues);

    public async Task<List<T>> ObtenerTodosAsync() => await _dbSet.ToListAsync();
}
