using System.Collections.Concurrent;
using System.Threading.Channels;

namespace SGE_PuntoFrescoCRBLL.Services;

/// <summary>Motivo por el que se expulsa una sesión.</summary>
public enum MotivoCierreSesion
{
    /// <summary>Un administrador desactivó la cuenta.</summary>
    CuentaDesactivada,

    /// <summary>El mismo usuario inició sesión en otro equipo.</summary>
    SesionReemplazada,

    /// <summary>Cambió el rol o los permisos del usuario.</summary>
    PermisosCambiados,

    /// <summary>Un administrador forzó el cierre.</summary>
    CierreForzado
}

public sealed record EventoSesion(int UsuarioId, MotivoCierreSesion Motivo, string Mensaje);

public interface ISesionEventBus
{
    /// <summary>Publica el cierre para todas las pestañas abiertas del usuario indicado.</summary>
    void Publicar(int usuarioId, MotivoCierreSesion motivo, string? mensaje = null);

    /// <summary>
    /// Registra un suscriptor (una pestaña del navegador) y devuelve su canal de lectura
    /// junto con la acción de baja, que debe invocarse al cerrarse la conexión.
    /// </summary>
    (ChannelReader<EventoSesion> Lector, IDisposable Suscripcion) Suscribir(int usuarioId);
}

/// <summary>
/// Bus en memoria, proceso único. Es lo que convierte la expulsión en inmediata:
/// el navegador mantiene abierta una conexión SSE y recibe el evento en el
/// instante en que el administrador guarda el cambio, sin esperar a la
/// siguiente petición del usuario.
///
/// Limitación conocida: al vivir en memoria, si la aplicación se publica en
/// varias instancias (granja web o escalado horizontal), cada instancia solo
/// avisa a sus propios suscriptores. En ese escenario hay que sustituir esta
/// implementación por Redis pub/sub o Azure SignalR conservando la interfaz.
/// Aun así, la validación contra base de datos de <see cref="SesionService"/>
/// sigue cerrando la sesión en la siguiente solicitud, por lo que nunca queda
/// una sesión válida indefinidamente.
/// </summary>
public sealed class SesionEventBus : ISesionEventBus
{
    private readonly ConcurrentDictionary<int, ConcurrentDictionary<Guid, Channel<EventoSesion>>> _suscriptores = new();

    private static string MensajePorDefecto(MotivoCierreSesion motivo) => motivo switch
    {
        MotivoCierreSesion.CuentaDesactivada =>
            "Su cuenta fue desactivada por un administrador. La sesión se cerró.",
        MotivoCierreSesion.SesionReemplazada =>
            "Se inició sesión con su usuario en otro equipo. Esta sesión se cerró.",
        MotivoCierreSesion.PermisosCambiados =>
            "Sus permisos cambiaron. Vuelva a iniciar sesión para aplicarlos.",
        _ => "Su sesión fue cerrada por un administrador."
    };

    public void Publicar(int usuarioId, MotivoCierreSesion motivo, string? mensaje = null)
    {
        if (usuarioId <= 0) return;
        if (!_suscriptores.TryGetValue(usuarioId, out var canales)) return;

        var evento = new EventoSesion(usuarioId, motivo, mensaje ?? MensajePorDefecto(motivo));

        foreach (var canal in canales.Values)
        {
            // Escritura sin bloqueo: si el canal está lleno o cerrado se descarta,
            // porque la validación contra base de datos cubre igualmente el caso.
            canal.Writer.TryWrite(evento);
        }
    }

    public (ChannelReader<EventoSesion> Lector, IDisposable Suscripcion) Suscribir(int usuarioId)
    {
        var canal = Channel.CreateBounded<EventoSesion>(new BoundedChannelOptions(4)
        {
            FullMode = BoundedChannelFullMode.DropOldest,
            SingleReader = true,
            SingleWriter = false
        });

        var id = Guid.NewGuid();
        var canales = _suscriptores.GetOrAdd(usuarioId, _ => new ConcurrentDictionary<Guid, Channel<EventoSesion>>());
        canales[id] = canal;

        return (canal.Reader, new Baja(() =>
        {
            if (!_suscriptores.TryGetValue(usuarioId, out var mapa)) return;
            mapa.TryRemove(id, out _);
            if (mapa.IsEmpty) _suscriptores.TryRemove(usuarioId, out _);
            canal.Writer.TryComplete();
        }));
    }

    private sealed class Baja : IDisposable
    {
        private Action? _accion;
        public Baja(Action accion) => _accion = accion;
        public void Dispose() => Interlocked.Exchange(ref _accion, null)?.Invoke();
    }
}
