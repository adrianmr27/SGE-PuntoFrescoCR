namespace SGE_PuntoFrescoCRBLL.Services;

public class PrediccionService : IPrediccionService
{
    private readonly SpaCrudService _crud;
    public PrediccionService(SpaCrudService crud) => _crud = crud;
    public Task RecalcularPrediccionesAsync(CancellationToken ct = default) => _crud.RecalcularPrediccionesAsync(ct);
}
