namespace SGE_PuntoFrescoCRBLL.Services;

/// <summary>
/// Resultado de una operación de negocio.
///
/// Sustituye al patrón anterior (<c>bool</c> o <c>int?</c> nulo), que obligaba al
/// controlador a responder un <c>BadRequest()</c> sin cuerpo. El cliente recibía
/// entonces únicamente el texto "Bad Request" y el modal mostraba "Error" sin
/// decir qué estaba mal. Aquí viaja el motivo, el campo del formulario que lo
/// provoca y un código estable para que el front pueda reaccionar.
/// </summary>
public sealed class ResultadoOperacion
{
    public bool Exito { get; init; }

    /// <summary>Código estable, en mayúsculas, para lógica del cliente. Ej.: AUTODESACTIVACION.</summary>
    public string? Codigo { get; init; }

    /// <summary>Mensaje listo para mostrar al usuario, en español.</summary>
    public string? Mensaje { get; init; }

    /// <summary>
    /// Identificador del control del formulario al que apunta el error
    /// (por ejemplo "u-email"), para resaltarlo en el modal.
    /// </summary>
    public string? Campo { get; init; }

    /// <summary>Identificador del registro creado, cuando aplica.</summary>
    public int? Id { get; init; }

    /// <summary>Sugerencia HTTP: 400 para validación, 403 para permisos, 404 para inexistente, 409 para conflicto.</summary>
    public int EstadoHttp { get; init; } = 400;

    public static ResultadoOperacion Ok(int? id = null) =>
        new() { Exito = true, Id = id, EstadoHttp = 200 };

    /// <summary>Error de validación de un campo concreto del formulario (400).</summary>
    public static ResultadoOperacion Invalido(string codigo, string mensaje, string? campo = null) =>
        new() { Exito = false, Codigo = codigo, Mensaje = mensaje, Campo = campo, EstadoHttp = 400 };

    /// <summary>Conflicto con el estado actual de los datos, p. ej. un duplicado (409).</summary>
    public static ResultadoOperacion Conflicto(string codigo, string mensaje, string? campo = null) =>
        new() { Exito = false, Codigo = codigo, Mensaje = mensaje, Campo = campo, EstadoHttp = 409 };

    /// <summary>La acción existe pero este usuario no puede ejecutarla (403).</summary>
    public static ResultadoOperacion Prohibido(string codigo, string mensaje) =>
        new() { Exito = false, Codigo = codigo, Mensaje = mensaje, EstadoHttp = 403 };

    /// <summary>El registro no existe (404).</summary>
    public static ResultadoOperacion NoEncontrado(string mensaje = "El registro no existe o fue eliminado.") =>
        new() { Exito = false, Codigo = "NO_ENCONTRADO", Mensaje = mensaje, EstadoHttp = 404 };
}
