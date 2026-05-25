namespace SGE_PuntoFrescoCRBLL.Services;

public interface IPrediccionService
{
    Task RecalcularPrediccionesAsync(CancellationToken ct = default);
}
