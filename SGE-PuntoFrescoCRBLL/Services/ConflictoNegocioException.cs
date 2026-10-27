namespace SGE_PuntoFrescoCRBLL.Services;

/// <summary>
/// Conflicto con el estado actual de los datos: un duplicado, un registro en uso,
/// una operación que contradice algo ya guardado.
///
/// Sustituye a los <see cref="InvalidOperationException"/> que se lanzaban con un
/// texto suelto. Al llevar <see cref="Campo"/> y <see cref="Codigo"/>, el
/// controlador puede devolver una respuesta que el modal sabe aprovechar:
/// resalta el control culpable en vez de mostrar un aviso genérico.
/// </summary>
public class ConflictoNegocioException : InvalidOperationException
{
    /// <summary>
    /// Identificador del control del formulario al que apunta el conflicto
    /// (por ejemplo "cli-id"). Null cuando el conflicto no pertenece a un campo.
    /// </summary>
    public string? Campo { get; }

    /// <summary>Código estable para lógica del cliente. Ej.: IDENTIFICACION_DUPLICADA.</summary>
    public string? Codigo { get; }

    public ConflictoNegocioException(string mensaje, string? campo = null, string? codigo = null)
        : base(mensaje)
    {
        Campo = campo;
        Codigo = codigo;
    }

    /// <summary>Convierte el conflicto al resultado que consumen los controladores.</summary>
    public ResultadoOperacion AResultado() =>
        ResultadoOperacion.Conflicto(Codigo ?? "CONFLICTO", Message, Campo);
}
