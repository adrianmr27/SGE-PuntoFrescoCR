-- Migración: contraseña temporal obligatoria en primer inicio de sesión
-- Ejecutar en la base de datos SGE Punto Fresco antes de desplegar los cambios.

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('seg.Usuario') AND name = 'RequiereCambioPassword'
)
BEGIN
    ALTER TABLE seg.Usuario
        ADD RequiereCambioPassword BIT NOT NULL
            CONSTRAINT DF_Usuario_RequiereCambioPassword DEFAULT 0;
END;

-- Usuarios existentes no deben verse forzados al cambio
UPDATE seg.Usuario SET RequiereCambioPassword = 0 WHERE RequiereCambioPassword IS NULL;
