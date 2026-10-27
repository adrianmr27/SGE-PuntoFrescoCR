/* ═══════════════════════════════════════════════════════════════════════
   SGE Punto Fresco de Costa Rica
   Migración: control de sesión única + estado de notificaciones por usuario
   Fecha: setiembre 2026
   Idempotente: se puede ejecutar varias veces sin efectos secundarios.
   ═══════════════════════════════════════════════════════════════════════ */

SET XACT_ABORT ON;
BEGIN TRANSACTION;

/* ── 1. Columnas de sesión en seg.Usuario ───────────────────────────────
   SesionToken identifica la sesión vigente. Se regenera en cada inicio de
   sesión exitoso, de modo que la sesión anterior del mismo usuario queda
   invalidada (requisito: no mantener sesiones simultáneas en varios equipos).
*/
IF COL_LENGTH('seg.Usuario', 'SesionToken') IS NULL
    ALTER TABLE seg.Usuario ADD SesionToken NVARCHAR(64) NULL;
GO

IF COL_LENGTH('seg.Usuario', 'SesionIniciadaEn') IS NULL
    ALTER TABLE seg.Usuario ADD SesionIniciadaEn DATETIME2(0) NULL;
GO

IF COL_LENGTH('seg.Usuario', 'SesionOrigen') IS NULL
    ALTER TABLE seg.Usuario ADD SesionOrigen NVARCHAR(256) NULL;
GO

/* Índice para la validación de sesión en cada solicitud. */
IF NOT EXISTS (SELECT 1 FROM sys.indexes
               WHERE name = 'IX_Usuario_SesionToken' AND object_id = OBJECT_ID('seg.Usuario'))
    CREATE NONCLUSTERED INDEX IX_Usuario_SesionToken
        ON seg.Usuario (SesionToken)
        WHERE SesionToken IS NOT NULL;
GO

/* ── 2. Estado de notificaciones por usuario ────────────────────────────
   Antes el descarte de alertas vivía únicamente en localStorage: era por
   navegador y no por usuario, así que todos veían siempre lo mismo.
   La columna Huella guarda un hash del contenido de la alerta al ocultarla;
   si el registro de origen cambia, la huella deja de coincidir y la alerta
   reaparece (evita que un cambio real quede silenciado para siempre).
*/
IF OBJECT_ID('seg.NotificacionEstado', 'U') IS NULL
BEGIN
    CREATE TABLE seg.NotificacionEstado
    (
        NotificacionEstadoId BIGINT IDENTITY(1,1) NOT NULL,
        UsuarioId            INT           NOT NULL,
        Clave                NVARCHAR(80)  NOT NULL,
        Huella               NVARCHAR(64)  NOT NULL,
        Estado               NVARCHAR(20)  NOT NULL CONSTRAINT DF_NotificacionEstado_Estado DEFAULT ('Oculta'),
        FechaHora            DATETIME2(0)  NOT NULL CONSTRAINT DF_NotificacionEstado_Fecha  DEFAULT (SYSUTCDATETIME()),

        CONSTRAINT PK_NotificacionEstado PRIMARY KEY CLUSTERED (NotificacionEstadoId),
        CONSTRAINT FK_NotificacionEstado_Usuario
            FOREIGN KEY (UsuarioId) REFERENCES seg.Usuario (UsuarioId) ON DELETE CASCADE,
        CONSTRAINT CK_NotificacionEstado_Estado
            CHECK (Estado IN ('Oculta', 'Leida'))
    );

    CREATE UNIQUE NONCLUSTERED INDEX UX_NotificacionEstado_Usuario_Clave
        ON seg.NotificacionEstado (UsuarioId, Clave);
END
GO

/* ── 3. Higiene de datos: un solo Administrador ─────────────────────────
   El sistema pasa a exigir que el rol Administrador lo tenga un único
   usuario activo. Esta consulta NO corrige nada automáticamente (sería
   peligroso); solo reporta si la base actual ya incumple la regla, para
   que se resuelva a mano antes de publicar el cambio.
*/
DECLARE @admins INT;

SELECT @admins = COUNT(*)
FROM seg.Usuario u
INNER JOIN seg.Rol r ON r.RolId = u.RolId
WHERE r.Nombre = 'Administrador' AND u.Activo = 1;

IF @admins > 1
BEGIN
    PRINT '*** ATENCIÓN: hay ' + CAST(@admins AS NVARCHAR(10))
        + ' usuarios activos con rol Administrador. ';
    PRINT '    La nueva regla de negocio exige exactamente uno. ';
    PRINT '    Revise el listado siguiente y reasigne roles antes de publicar.';

    SELECT u.UsuarioId, u.NombreUsuario, u.NombreCompleto, u.Correo, u.UltimoAcceso
    FROM seg.Usuario u
    INNER JOIN seg.Rol r ON r.RolId = u.RolId
    WHERE r.Nombre = 'Administrador' AND u.Activo = 1
    ORDER BY u.UltimoAcceso DESC;
END
ELSE IF @admins = 0
BEGIN
    PRINT '*** ATENCIÓN: no hay ningún Administrador activo. Active uno antes de publicar.';
END
ELSE
BEGIN
    PRINT 'OK: existe exactamente un Administrador activo.';
END
GO

COMMIT TRANSACTION;
GO

PRINT 'Migración aplicada correctamente.';
GO
