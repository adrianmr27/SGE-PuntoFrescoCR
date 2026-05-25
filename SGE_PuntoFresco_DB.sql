-- ============================================================
--  SGE Punto Fresco de Costa Rica S.A.
--  Sistema de Gestión Empresarial — Base de Datos SQL Server
--  Versión  : 1.0
--  Motor    : SQL Server 2019+ / Azure SQL
--  Encoding : UTF-8
--  Autor    : SIAG · Super IT Advisory Group
-- ============================================================
--
--  ARQUITECTURA
--  ┌─────────────────────────────────────────────────────────┐
--  │  ASP.NET Core MVC                                       │
--  │  ├── Web  (Vistas / Controllers)                        │
--  │  ├── BLL  (Business Logic Layer)                        │
--  │  └── DAL  (Data Access Layer → ADO.NET / EF Core)       │
--  │           ↕                                             │
--  │  SQL Server  ·  Base de datos: SGE_PuntoFresco          │
--  └─────────────────────────────────────────────────────────┘
--
--  MÓDULOS
--  01. Utilitarios (Auditoría)
--  02. Administrativo (Empresa · Parámetros)
--  03. Roles y Permisos
--  04. Usuarios
--  05. Empleados
--  06. Clientes
--  07. Proveedores
--  08. Compras
--  09. Inventario
--  10. Pedidos
--  11. Licitaciones
--  12. Finanzas
--  13. Predicciones
--  14. Vistas (Views) de consulta
--  15. Stored Procedures principales
--  16. Datos semilla (Seed data)
-- ============================================================

USE master;
GO

IF DB_ID('SGE_PuntoFresco') IS NOT NULL
BEGIN
    ALTER DATABASE SGE_PuntoFresco SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE SGE_PuntoFresco;
END
GO

CREATE DATABASE SGE_PuntoFresco
    COLLATE Modern_Spanish_CI_AI;   -- insensible a mayúsculas y acentos
GO

USE SGE_PuntoFresco;
GO

-- ============================================================
-- 01.  UTILITARIOS — AUDITORÍA
-- ============================================================
-- Tabla base de auditoría heredada por convención en el DAL.
-- Las columnas CreatedAt / UpdatedAt se manejan desde BLL o
-- mediante triggers definidos al final del script.

-- Esquema de organización
CREATE SCHEMA adm;   -- Administrativo
GO
CREATE SCHEMA seg;   -- Seguridad (roles / usuarios)
GO
CREATE SCHEMA rrhh;  -- Empleados
GO
CREATE SCHEMA com;   -- Comercial (clientes / proveedores)
GO
CREATE SCHEMA inv;   -- Inventario
GO
CREATE SCHEMA ped;   -- Pedidos
GO
CREATE SCHEMA lic;   -- Licitaciones
GO
CREATE SCHEMA fin;   -- Finanzas
GO


-- ============================================================
-- 02.  ADMINISTRATIVO
-- ============================================================

-- ── 02.1 Empresa (única fila) ───────────────────────────────
CREATE TABLE adm.Empresa (
    EmpresaId        INT             NOT NULL CONSTRAINT PK_Empresa PRIMARY KEY DEFAULT 1,
    NombreComercial  NVARCHAR(150)   NOT NULL,
    RazonSocial      NVARCHAR(200)   NOT NULL,
    CedulaJuridica   NVARCHAR(20)    NOT NULL CONSTRAINT UQ_Empresa_Cedula UNIQUE,
    Telefono1        NVARCHAR(20)    NOT NULL,
    Telefono2        NVARCHAR(20)    NULL,
    CorreoPrincipal  NVARCHAR(150)   NOT NULL,
    CorreoAlt        NVARCHAR(150)   NULL,
    Direccion        NVARCHAR(300)   NOT NULL,
    SitioWeb         NVARCHAR(150)   NULL,
    Representante    NVARCHAR(150)   NULL,     -- para licitaciones [LIC-005]
    LogoPath         NVARCHAR(500)   NULL,
    CreatedAt        DATETIME2       NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt        DATETIME2       NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CHK_Empresa_OneRow CHECK (EmpresaId = 1)
);

-- ── 02.2 Parámetros generales ──────────────────────────────
--  Tipos: 'Impuesto', 'Descuento', 'Configuracion', etc.
CREATE TABLE adm.Parametro (
    ParametroId  INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_Parametro PRIMARY KEY,
    Tipo         NVARCHAR(60)   NOT NULL,
    Nombre       NVARCHAR(100)  NOT NULL,
    Valor        NVARCHAR(50)   NOT NULL,   -- ej: '13', '4', '0'
    Descripcion  NVARCHAR(200)  NULL,
    Activo       BIT            NOT NULL DEFAULT 1,
    CreatedAt    DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt    DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Parametro_TipoNombre UNIQUE (Tipo, Nombre)
);


-- ============================================================
-- 03.  ROLES Y PERMISOS
-- ============================================================

CREATE TABLE seg.Rol (
    RolId       INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_Rol PRIMARY KEY,
    Nombre      NVARCHAR(80)   NOT NULL CONSTRAINT UQ_Rol_Nombre UNIQUE,
    Descripcion NVARCHAR(200)  NULL,
    Activo      BIT            NOT NULL DEFAULT 1,
    CreatedAt   DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt   DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);

-- Catálogo de módulos del sistema
CREATE TABLE seg.Modulo (
    ModuloId    INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_Modulo PRIMARY KEY,
    Codigo      NVARCHAR(40)   NOT NULL CONSTRAINT UQ_Modulo_Codigo UNIQUE,  -- ej: 'INVENTARIO'
    Nombre      NVARCHAR(80)   NOT NULL,
    Icono       NVARCHAR(10)   NULL,
    Orden       SMALLINT       NOT NULL DEFAULT 0,
    Activo      BIT            NOT NULL DEFAULT 1
);

-- Permisos granulares por rol y módulo [ROL-003]
CREATE TABLE seg.Permiso (
    PermisoId   INT   NOT NULL IDENTITY(1,1) CONSTRAINT PK_Permiso PRIMARY KEY,
    RolId       INT   NOT NULL CONSTRAINT FK_Permiso_Rol REFERENCES seg.Rol(RolId),
    ModuloId    INT   NOT NULL CONSTRAINT FK_Permiso_Modulo REFERENCES seg.Modulo(ModuloId),
    PuedeVer    BIT   NOT NULL DEFAULT 0,
    PuedeCrear  BIT   NOT NULL DEFAULT 0,
    PuedeEditar BIT   NOT NULL DEFAULT 0,
    PuedeElim   BIT   NOT NULL DEFAULT 0,
    PuedeExport BIT   NOT NULL DEFAULT 0,
    CONSTRAINT UQ_Permiso_RolModulo UNIQUE (RolId, ModuloId)
);


-- ============================================================
-- 04.  USUARIOS  [USR-001, USR-002, USR-003]
-- ============================================================

CREATE TABLE seg.Usuario (
    UsuarioId          INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_Usuario PRIMARY KEY,
    RolId              INT            NOT NULL CONSTRAINT FK_Usuario_Rol REFERENCES seg.Rol(RolId),
    NombreCompleto     NVARCHAR(150)  NOT NULL,
    Identificacion     NVARCHAR(20)   NOT NULL CONSTRAINT UQ_Usuario_Ident UNIQUE,
    NombreUsuario      NVARCHAR(60)   NOT NULL CONSTRAINT UQ_Usuario_Login UNIQUE,
    Correo             NVARCHAR(150)  NOT NULL CONSTRAINT UQ_Usuario_Correo UNIQUE,
    PasswordHash       NVARCHAR(256)  NOT NULL,   -- BCrypt hash
    PasswordSalt       NVARCHAR(128)  NOT NULL,
    Puesto             NVARCHAR(100)  NULL,
    Telefono           NVARCHAR(20)   NULL,
    Direccion          NVARCHAR(300)  NULL,
    Activo             BIT            NOT NULL DEFAULT 1,
    -- Recuperación de contraseña [USR-003]
    TokenRecuperacion  NVARCHAR(256)  NULL,
    TokenExpiracion    DATETIME2      NULL,
    -- Auditoría de acceso
    UltimoAcceso       DATETIME2      NULL,
    FallasAcceso       TINYINT        NOT NULL DEFAULT 0,
    BloqueadoHasta     DATETIME2      NULL,
    CreatedAt          DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt          DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE INDEX IX_Usuario_Correo ON seg.Usuario(Correo);
CREATE INDEX IX_Usuario_RolId  ON seg.Usuario(RolId);


-- ============================================================
-- 05.  EMPLEADOS  [EMP-001, EMP-002, EMP-003]
-- ============================================================

CREATE TABLE rrhh.Area (
    AreaId  INT           NOT NULL IDENTITY(1,1) CONSTRAINT PK_Area PRIMARY KEY,
    Nombre  NVARCHAR(80)  NOT NULL CONSTRAINT UQ_Area_Nombre UNIQUE,
    Activo  BIT           NOT NULL DEFAULT 1
);

CREATE TABLE rrhh.Empleado (
    EmpleadoId             INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_Empleado PRIMARY KEY,
    AreaId                 INT            NOT NULL CONSTRAINT FK_Empleado_Area REFERENCES rrhh.Area(AreaId),
    -- Relación opcional con usuario del sistema
    UsuarioId              INT            NULL CONSTRAINT FK_Empleado_Usuario REFERENCES seg.Usuario(UsuarioId),
    NombreCompleto         NVARCHAR(150)  NOT NULL,
    Identificacion         NVARCHAR(20)   NOT NULL CONSTRAINT UQ_Empleado_Ident UNIQUE,
    Puesto                 NVARCHAR(100)  NOT NULL,
    Telefono               NVARCHAR(20)   NULL,
    Correo                 NVARCHAR(150)  NULL,
    Direccion              NVARCHAR(300)  NULL,
    FechaIngreso           DATE           NULL,
    -- Información de emergencia
    ContactoEmergenciaNombre   NVARCHAR(100) NULL,
    ContactoEmergenciaTel      NVARCHAR(20)  NULL,
    -- Información médica [EMP-003]
    AlergiasMedicamentos   NVARCHAR(500)  NULL,
    Padecimientos          NVARCHAR(500)  NULL,
    Activo                 BIT            NOT NULL DEFAULT 1,
    CreatedAt              DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt              DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE INDEX IX_Empleado_AreaId  ON rrhh.Empleado(AreaId);


-- ============================================================
-- 06.  CLIENTES  [CLI-001, CLI-002]
-- ============================================================

CREATE TABLE com.Cliente (
    ClienteId    INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_Cliente PRIMARY KEY,
    Nombre       NVARCHAR(200)  NOT NULL,
    Identificacion NVARCHAR(20) NOT NULL CONSTRAINT UQ_Cliente_Ident UNIQUE,
    Telefono     NVARCHAR(20)   NULL,
    Correo       NVARCHAR(150)  NULL,
    Direccion    NVARCHAR(300)  NULL,
    Activo       BIT            NOT NULL DEFAULT 1,
    -- Metadatos para predicciones
    FechaUltimoPedido DATETIME2 NULL,
    CreatedAt    DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt    DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE INDEX IX_Cliente_Nombre ON com.Cliente(Nombre);


-- ============================================================
-- 07.  PROVEEDORES  [PRO-001, PRO-002]
-- ============================================================

CREATE TABLE com.Proveedor (
    ProveedorId    INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_Proveedor PRIMARY KEY,
    Nombre         NVARCHAR(200)  NOT NULL,
    Identificacion NVARCHAR(20)   NOT NULL CONSTRAINT UQ_Proveedor_Ident UNIQUE,
    Telefono       NVARCHAR(20)   NULL,
    Correo         NVARCHAR(150)  NULL,
    Direccion      NVARCHAR(300)  NULL,
    Activo         BIT            NOT NULL DEFAULT 1,
    CreatedAt      DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt      DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE INDEX IX_Proveedor_Nombre ON com.Proveedor(Nombre);


-- ============================================================
-- 08.  INVENTARIO — PRODUCTOS  [INV-001 … INV-005]
-- ============================================================

CREATE TABLE inv.Categoria (
    CategoriaId INT           NOT NULL IDENTITY(1,1) CONSTRAINT PK_Categoria PRIMARY KEY,
    Nombre      NVARCHAR(80)  NOT NULL CONSTRAINT UQ_Categoria_Nombre UNIQUE,
    Activo      BIT           NOT NULL DEFAULT 1
);

CREATE TABLE inv.Producto (
    ProductoId   INT              NOT NULL IDENTITY(1,1) CONSTRAINT PK_Producto PRIMARY KEY,
    CategoriaId  INT              NOT NULL CONSTRAINT FK_Producto_Categoria REFERENCES inv.Categoria(CategoriaId),
    -- ParametroId apunta al parámetro de tipo 'Impuesto'
    ParametroIvaId INT            NOT NULL CONSTRAINT FK_Producto_IVA REFERENCES adm.Parametro(ParametroId),
    Nombre       NVARCHAR(150)    NOT NULL,
    Descripcion  NVARCHAR(500)    NULL,
    PrecioCompra DECIMAL(12,2)    NOT NULL DEFAULT 0 CONSTRAINT CHK_Prod_PCompra CHECK (PrecioCompra >= 0),
    PrecioVenta  DECIMAL(12,2)    NOT NULL DEFAULT 0 CONSTRAINT CHK_Prod_PVenta  CHECK (PrecioVenta  >= 0),
    Stock        INT              NOT NULL DEFAULT 0  CONSTRAINT CHK_Prod_Stock  CHECK (Stock >= 0),
    StockMinimo  INT              NOT NULL DEFAULT 0  CONSTRAINT CHK_Prod_StockMin CHECK (StockMinimo >= 0),
    Activo       BIT              NOT NULL DEFAULT 1,
    CreatedAt    DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt    DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE INDEX IX_Producto_CategoriaId ON inv.Producto(CategoriaId);
CREATE INDEX IX_Producto_StockBajo   ON inv.Producto(Stock, StockMinimo) WHERE Activo = 1;

-- Historial de movimientos de inventario [INV-003, INV-005]
-- TipoMov: 'Entrada', 'Salida', 'Ajuste'
CREATE TABLE inv.MovimientoInventario (
    MovimientoId   BIGINT        NOT NULL IDENTITY(1,1) CONSTRAINT PK_MovInv PRIMARY KEY,
    ProductoId     INT           NOT NULL CONSTRAINT FK_MovInv_Producto REFERENCES inv.Producto(ProductoId),
    UsuarioId      INT           NULL CONSTRAINT FK_MovInv_Usuario REFERENCES seg.Usuario(UsuarioId),
    TipoMov        NVARCHAR(10)  NOT NULL CONSTRAINT CHK_MovInv_Tipo CHECK (TipoMov IN ('Entrada','Salida','Ajuste')),
    Cantidad       INT           NOT NULL,
    StockAnterior  INT           NOT NULL,
    StockPosterior INT           NOT NULL,
    -- Referencia flexible al documento origen
    OrigenTipo     NVARCHAR(20)  NULL,   -- 'Compra','Pedido','Ajuste'
    OrigenId       INT           NULL,
    Observacion    NVARCHAR(300) NULL,
    FechaMovimiento DATETIME2   NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE INDEX IX_MovInv_ProductoId ON inv.MovimientoInventario(ProductoId);
CREATE INDEX IX_MovInv_Fecha      ON inv.MovimientoInventario(FechaMovimiento DESC);


-- ============================================================
-- 09.  COMPRAS  [COM-001, COM-002, COM-003]
-- ============================================================

-- Estado: 'Borrador','Pendiente','Confirmada','Cancelada'
CREATE TABLE com.OrdenCompra (
    OrdenCompraId  INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_OC PRIMARY KEY,
    ProveedorId    INT            NOT NULL CONSTRAINT FK_OC_Proveedor REFERENCES com.Proveedor(ProveedorId),
    UsuarioId      INT            NOT NULL CONSTRAINT FK_OC_Usuario   REFERENCES seg.Usuario(UsuarioId),
    NumeroOrden    NVARCHAR(20)   NOT NULL CONSTRAINT UQ_OC_Numero UNIQUE,  -- OC-2024-001
    FechaOrden     DATE           NOT NULL DEFAULT CAST(SYSUTCDATETIME() AS DATE),
    FechaEntrega   DATE           NULL,
    Estado         NVARCHAR(15)   NOT NULL DEFAULT 'Pendiente'
                       CONSTRAINT CHK_OC_Estado CHECK (Estado IN ('Borrador','Pendiente','Confirmada','Cancelada')),
    Subtotal       DECIMAL(14,2)  NOT NULL DEFAULT 0,
    MontoIVA       DECIMAL(14,2)  NOT NULL DEFAULT 0,
    Total          DECIMAL(14,2)  NOT NULL DEFAULT 0,
    Observaciones  NVARCHAR(500)  NULL,
    FechaConfirmacion DATETIME2   NULL,
    CreatedAt      DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt      DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE INDEX IX_OC_ProveedorId ON com.OrdenCompra(ProveedorId);
CREATE INDEX IX_OC_Estado      ON com.OrdenCompra(Estado);
CREATE INDEX IX_OC_FechaOrden  ON com.OrdenCompra(FechaOrden DESC);

CREATE TABLE com.OrdenCompraDetalle (
    DetalleId      INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_OCD PRIMARY KEY,
    OrdenCompraId  INT            NOT NULL CONSTRAINT FK_OCD_OC  REFERENCES com.OrdenCompra(OrdenCompraId),
    ProductoId     INT            NOT NULL CONSTRAINT FK_OCD_Prod REFERENCES inv.Producto(ProductoId),
    Cantidad       INT            NOT NULL CONSTRAINT CHK_OCD_Cant CHECK (Cantidad > 0),
    PrecioUnitario DECIMAL(12,2)  NOT NULL CONSTRAINT CHK_OCD_Precio CHECK (PrecioUnitario >= 0),
    PorcentajeIVA  DECIMAL(5,2)   NOT NULL DEFAULT 13,
    Subtotal       DECIMAL(14,2)  NOT NULL DEFAULT 0,
    MontoIVA       DECIMAL(14,2)  NOT NULL DEFAULT 0,
    Total          DECIMAL(14,2)  NOT NULL DEFAULT 0
);

CREATE INDEX IX_OCD_OrdenId ON com.OrdenCompraDetalle(OrdenCompraId);


-- ============================================================
-- 10.  PEDIDOS  [PED-001 … PED-006]
-- ============================================================

-- Estado: 'Borrador','Confirmado','Entregado','Cancelado'
CREATE TABLE ped.Pedido (
    PedidoId         INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_Pedido PRIMARY KEY,
    ClienteId        INT            NOT NULL CONSTRAINT FK_Ped_Cliente  REFERENCES com.Cliente(ClienteId),
    UsuarioId        INT            NOT NULL CONSTRAINT FK_Ped_Usuario  REFERENCES seg.Usuario(UsuarioId),
    NumeroPedido     NVARCHAR(20)   NOT NULL CONSTRAINT UQ_Ped_Numero UNIQUE,  -- PED-2024-001
    FechaPedido      DATE           NOT NULL DEFAULT CAST(SYSUTCDATETIME() AS DATE),
    FechaEntrega     DATE           NULL,
    Estado           NVARCHAR(15)   NOT NULL DEFAULT 'Confirmado'
                         CONSTRAINT CHK_Ped_Estado CHECK (Estado IN ('Borrador','Confirmado','Entregado','Cancelado')),
    Subtotal         DECIMAL(14,2)  NOT NULL DEFAULT 0,
    MontoIVA         DECIMAL(14,2)  NOT NULL DEFAULT 0,
    Total            DECIMAL(14,2)  NOT NULL DEFAULT 0,
    DireccionEntrega NVARCHAR(300)  NULL,   -- copia de com.Cliente.Direccion al momento [PED-006]
    Observaciones    NVARCHAR(500)  NULL,
    FechaConfirmacion DATETIME2     NULL,
    FechaCancelacion  DATETIME2     NULL,
    MotivoCancelacion NVARCHAR(300) NULL,   -- [PED-002]
    CreatedAt        DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt        DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE INDEX IX_Ped_ClienteId  ON ped.Pedido(ClienteId);
CREATE INDEX IX_Ped_Estado     ON ped.Pedido(Estado);
CREATE INDEX IX_Ped_Fecha      ON ped.Pedido(FechaPedido DESC);

CREATE TABLE ped.PedidoDetalle (
    DetalleId      INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_PedDet PRIMARY KEY,
    PedidoId       INT            NOT NULL CONSTRAINT FK_PedDet_Ped  REFERENCES ped.Pedido(PedidoId),
    ProductoId     INT            NOT NULL CONSTRAINT FK_PedDet_Prod REFERENCES inv.Producto(ProductoId),
    Cantidad       INT            NOT NULL CONSTRAINT CHK_PedDet_Cant  CHECK (Cantidad > 0),
    PrecioUnitario DECIMAL(12,2)  NOT NULL CONSTRAINT CHK_PedDet_Precio CHECK (PrecioUnitario >= 0),
    PorcentajeIVA  DECIMAL(5,2)   NOT NULL DEFAULT 13,
    Subtotal       DECIMAL(14,2)  NOT NULL DEFAULT 0,
    MontoIVA       DECIMAL(14,2)  NOT NULL DEFAULT 0,
    Total          DECIMAL(14,2)  NOT NULL DEFAULT 0
);

CREATE INDEX IX_PedDet_PedidoId ON ped.PedidoDetalle(PedidoId);


-- ============================================================
-- 11.  LICITACIONES  [LIC-001 … LIC-005]
-- ============================================================

-- Estado: 'Analisis','Preparacion','Enviada','Adjudicado','NoAdjudicado'
CREATE TABLE lic.Licitacion (
    LicitacionId     INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_Lic PRIMARY KEY,
    UsuarioId        INT            NOT NULL CONSTRAINT FK_Lic_Usuario REFERENCES seg.Usuario(UsuarioId),
    Codigo           NVARCHAR(20)   NOT NULL CONSTRAINT UQ_Lic_Codigo UNIQUE,  -- LIC-2024-001
    Institucion      NVARCHAR(200)  NOT NULL,
    ContactoNombre   NVARCHAR(150)  NULL,
    ContactoTelefono NVARCHAR(20)   NULL,
    ContactoCorreo   NVARCHAR(150)  NULL,
    Descripcion      NVARCHAR(1000) NOT NULL,
    Estado           NVARCHAR(20)   NOT NULL DEFAULT 'Analisis'
                         CONSTRAINT CHK_Lic_Estado CHECK (Estado IN
                             ('Analisis','Preparacion','Enviada','Adjudicado','NoAdjudicado')),
    -- Fechas clave [LIC-004]
    FechaLimiteConsultas DATE        NULL,
    FechaEnvioOferta     DATE        NULL,
    FechaEntrega         DATE        NULL,
    -- Totales calculados desde LicitacionDetalle
    Subtotal         DECIMAL(14,2)  NOT NULL DEFAULT 0,
    MontoIVA         DECIMAL(14,2)  NOT NULL DEFAULT 0,
    TotalOferta      DECIMAL(14,2)  NOT NULL DEFAULT 0,
    -- Datos legales autocompletados [LIC-005]
    DatosLegalesSnapshot NVARCHAR(MAX) NULL,  -- JSON snapshot de adm.Empresa
    Observaciones    NVARCHAR(1000) NULL,
    CreatedAt        DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt        DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE INDEX IX_Lic_Estado      ON lic.Licitacion(Estado);
CREATE INDEX IX_Lic_Institucion ON lic.Licitacion(Institucion);
CREATE INDEX IX_Lic_FechaOferta ON lic.Licitacion(FechaEnvioOferta);

-- Productos ofertados por licitación [LIC-003]
CREATE TABLE lic.LicitacionDetalle (
    DetalleId    INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_LicDet PRIMARY KEY,
    LicitacionId INT            NOT NULL CONSTRAINT FK_LicDet_Lic REFERENCES lic.Licitacion(LicitacionId),
    -- Producto puede ser del catálogo o descripción libre
    ProductoId   INT            NULL CONSTRAINT FK_LicDet_Prod REFERENCES inv.Producto(ProductoId),
    Descripcion  NVARCHAR(200)  NOT NULL,
    Cantidad     INT            NOT NULL CONSTRAINT CHK_LicDet_Cant CHECK (Cantidad > 0),
    PrecioUnitario DECIMAL(12,2) NOT NULL,
    PorcentajeIVA  DECIMAL(5,2)  NOT NULL DEFAULT 13,
    Subtotal     DECIMAL(14,2)  NOT NULL DEFAULT 0,
    MontoIVA     DECIMAL(14,2)  NOT NULL DEFAULT 0,
    Total        DECIMAL(14,2)  NOT NULL DEFAULT 0
);

-- Documentos adjuntos [LIC-002]
-- TipoDocumento: 'Solicitud','Cotizacion','Certificacion','FichaTecnica','Otro'
CREATE TABLE lic.LicitacionDocumento (
    DocumentoId   INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_LicDoc PRIMARY KEY,
    LicitacionId  INT            NOT NULL CONSTRAINT FK_LicDoc_Lic REFERENCES lic.Licitacion(LicitacionId),
    UsuarioId     INT            NOT NULL CONSTRAINT FK_LicDoc_Usr REFERENCES seg.Usuario(UsuarioId),
    TipoDocumento NVARCHAR(30)   NOT NULL,
    NombreArchivo NVARCHAR(200)  NOT NULL,
    RutaArchivo   NVARCHAR(500)  NOT NULL,   -- path en servidor / blob storage
    TamanoKB      INT            NULL,
    MimeType      NVARCHAR(80)   NULL,
    FechaSubida   DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);

-- Recordatorios de fechas clave [LIC-004]
CREATE TABLE lic.LicitacionRecordatorio (
    RecordatorioId INT           NOT NULL IDENTITY(1,1) CONSTRAINT PK_LicRec PRIMARY KEY,
    LicitacionId   INT           NOT NULL CONSTRAINT FK_LicRec_Lic REFERENCES lic.Licitacion(LicitacionId),
    Titulo         NVARCHAR(150) NOT NULL,
    FechaRecordatorio DATE       NOT NULL,
    Enviado        BIT           NOT NULL DEFAULT 0,
    FechaEnvio     DATETIME2     NULL
);

CREATE INDEX IX_LicRec_Fecha ON lic.LicitacionRecordatorio(FechaRecordatorio) WHERE Enviado = 0;


-- ============================================================
-- 12.  FINANZAS  [FIN-001 … FIN-005]
-- ============================================================

-- Movimientos financieros generados automáticamente [FIN-001]
-- Tipo: 'Ingreso','Egreso'
-- Categoria: 'Pedido','Compra','Licitacion','Servicio','Nomina','Otro'
CREATE TABLE fin.MovimientoFinanciero (
    MovFinancieroId BIGINT         NOT NULL IDENTITY(1,1) CONSTRAINT PK_MovFin PRIMARY KEY,
    UsuarioId       INT            NULL CONSTRAINT FK_MovFin_Usuario REFERENCES seg.Usuario(UsuarioId),
    Tipo            NVARCHAR(10)   NOT NULL CONSTRAINT CHK_MovFin_Tipo CHECK (Tipo IN ('Ingreso','Egreso')),
    Categoria       NVARCHAR(20)   NOT NULL,
    Descripcion     NVARCHAR(300)  NOT NULL,
    Monto           DECIMAL(14,2)  NOT NULL CONSTRAINT CHK_MovFin_Monto CHECK (Monto > 0),
    -- Referencia al documento que lo originó
    OrigenTipo      NVARCHAR(20)   NULL,  -- 'Pedido','Compra','Licitacion','Manual'
    OrigenId        INT            NULL,
    FechaMovimiento DATE           NOT NULL DEFAULT CAST(SYSUTCDATETIME() AS DATE),
    Observacion     NVARCHAR(300)  NULL,
    CreatedAt       DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE INDEX IX_MovFin_Tipo  ON fin.MovimientoFinanciero(Tipo);
CREATE INDEX IX_MovFin_Fecha ON fin.MovimientoFinanciero(FechaMovimiento DESC);
CREATE INDEX IX_MovFin_Orig  ON fin.MovimientoFinanciero(OrigenTipo, OrigenId);

-- Cuentas por Cobrar [FIN-003]
-- Estado: 'Pendiente','Pagado','Vencido'
CREATE TABLE fin.CuentaCobrar (
    CuentaCobrarId INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_CC PRIMARY KEY,
    ClienteId      INT            NOT NULL CONSTRAINT FK_CC_Cliente REFERENCES com.Cliente(ClienteId),
    UsuarioId      INT            NULL CONSTRAINT FK_CC_Usuario REFERENCES seg.Usuario(UsuarioId),
    Concepto       NVARCHAR(150)  NOT NULL,
    OrigenTipo     NVARCHAR(20)   NULL,
    OrigenId       INT            NULL,
    Monto          DECIMAL(14,2)  NOT NULL CONSTRAINT CHK_CC_Monto CHECK (Monto > 0),
    Vencimiento    DATE           NOT NULL,
    Estado         NVARCHAR(10)   NOT NULL DEFAULT 'Pendiente'
                       CONSTRAINT CHK_CC_Estado CHECK (Estado IN ('Pendiente','Pagado','Vencido')),
    FechaPago      DATETIME2      NULL,
    Observacion    NVARCHAR(300)  NULL,
    CreatedAt      DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt      DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE INDEX IX_CC_ClienteId  ON fin.CuentaCobrar(ClienteId);
CREATE INDEX IX_CC_Estado     ON fin.CuentaCobrar(Estado);
CREATE INDEX IX_CC_Vencimiento ON fin.CuentaCobrar(Vencimiento) WHERE Estado = 'Pendiente';

-- Cuentas por Pagar [FIN-004]
-- Estado: 'Pendiente','Pagado','Vencido'
CREATE TABLE fin.CuentaPagar (
    CuentaPagarId  INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_CP PRIMARY KEY,
    ProveedorId    INT            NULL CONSTRAINT FK_CP_Proveedor REFERENCES com.Proveedor(ProveedorId),
    UsuarioId      INT            NULL CONSTRAINT FK_CP_Usuario REFERENCES seg.Usuario(UsuarioId),
    Concepto       NVARCHAR(150)  NOT NULL,
    OrigenTipo     NVARCHAR(20)   NULL,
    OrigenId       INT            NULL,
    Monto          DECIMAL(14,2)  NOT NULL CONSTRAINT CHK_CP_Monto CHECK (Monto > 0),
    Vencimiento    DATE           NOT NULL,
    Estado         NVARCHAR(10)   NOT NULL DEFAULT 'Pendiente'
                       CONSTRAINT CHK_CP_Estado CHECK (Estado IN ('Pendiente','Pagado','Vencido')),
    FechaPago      DATETIME2      NULL,
    Observacion    NVARCHAR(300)  NULL,
    CreatedAt      DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt      DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE INDEX IX_CP_ProveedorId  ON fin.CuentaPagar(ProveedorId);
CREATE INDEX IX_CP_Estado       ON fin.CuentaPagar(Estado);
CREATE INDEX IX_CP_Vencimiento  ON fin.CuentaPagar(Vencimiento) WHERE Estado = 'Pendiente';


-- ============================================================
-- 13.  PREDICCIONES  [PRE-001, PRE-002]
-- ============================================================
-- Tabla materializada: el BLL corre el análisis periódicamente
-- (ej: tarea programada diaria) y guarda los resultados aquí.
-- El frontend consume esta tabla, no recalcula en tiempo real.

CREATE TABLE fin.PrediccionCompra (
    PrediccionId    INT            NOT NULL IDENTITY(1,1) CONSTRAINT PK_Pred PRIMARY KEY,
    ClienteId       INT            NOT NULL CONSTRAINT FK_Pred_Cliente REFERENCES com.Cliente(ClienteId),
    ProductoId      INT            NOT NULL CONSTRAINT FK_Pred_Producto REFERENCES inv.Producto(ProductoId),
    -- Métricas del análisis
    VecesPedido     INT            NOT NULL DEFAULT 0,  -- cuántas veces aparece en pedidos
    TotalMesesAnalisis INT         NOT NULL DEFAULT 0,
    ProbabilidadPct  DECIMAL(5,2) NOT NULL DEFAULT 0,   -- 0-100
    NivelConfianza  NVARCHAR(10)   NOT NULL DEFAULT 'Baja'
                        CONSTRAINT CHK_Pred_Conf CHECK (NivelConfianza IN ('Alta','Media','Baja')),
    PromedioUnidades DECIMAL(10,2) NULL,
    FechaCalculo    DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Pred_ClienteProd UNIQUE (ClienteId, ProductoId)
);

CREATE INDEX IX_Pred_ClienteId ON fin.PrediccionCompra(ClienteId);
CREATE INDEX IX_Pred_Prob      ON fin.PrediccionCompra(ProbabilidadPct DESC);


-- ============================================================
-- 14.  VISTAS DE CONSULTA  (usadas desde el DAL / Reportes)
-- ============================================================

-- Vista: Stock bajo para alertas [INV-004, FIN-005]
CREATE VIEW inv.vw_StockBajo AS
SELECT
    p.ProductoId,
    p.Nombre          AS Producto,
    c.Nombre          AS Categoria,
    p.Stock,
    p.StockMinimo,
    p.Stock - p.StockMinimo AS Diferencia,
    p.PrecioCompra,
    p.PrecioVenta
FROM inv.Producto p
JOIN inv.Categoria c ON c.CategoriaId = p.CategoriaId
WHERE p.Activo = 1
  AND p.Stock <= p.StockMinimo;
GO

-- Vista: Balance financiero del período
CREATE VIEW fin.vw_Balance AS
SELECT
    FechaMovimiento,
    SUM(CASE WHEN Tipo = 'Ingreso' THEN Monto ELSE 0 END) AS TotalIngresos,
    SUM(CASE WHEN Tipo = 'Egreso'  THEN Monto ELSE 0 END) AS TotalEgresos,
    SUM(CASE WHEN Tipo = 'Ingreso' THEN Monto ELSE -Monto END) AS Balance
FROM fin.MovimientoFinanciero
GROUP BY FechaMovimiento;
GO

-- Vista: Vencimientos próximos (próximos 7 días) [FIN-005]
CREATE VIEW fin.vw_VencimientosProximos AS
SELECT
    'CuentaCobrar'      AS TipoDocumento,
    cc.CuentaCobrarId   AS DocumentoId,
    cli.Nombre          AS Contraparte,
    cc.Concepto,
    cc.Monto,
    cc.Vencimiento,
    DATEDIFF(DAY, CAST(SYSUTCDATETIME() AS DATE), cc.Vencimiento) AS DiasRestantes
FROM fin.CuentaCobrar cc
JOIN com.Cliente cli ON cli.ClienteId = cc.ClienteId
WHERE cc.Estado = 'Pendiente'
  AND cc.Vencimiento BETWEEN CAST(SYSUTCDATETIME() AS DATE)
                         AND DATEADD(DAY, 7, CAST(SYSUTCDATETIME() AS DATE))

UNION ALL

SELECT
    'CuentaPagar'       AS TipoDocumento,
    cp.CuentaPagarId    AS DocumentoId,
    ISNULL(prov.Nombre, cp.Concepto) AS Contraparte,
    cp.Concepto,
    cp.Monto,
    cp.Vencimiento,
    DATEDIFF(DAY, CAST(SYSUTCDATETIME() AS DATE), cp.Vencimiento) AS DiasRestantes
FROM fin.CuentaPagar cp
LEFT JOIN com.Proveedor prov ON prov.ProveedorId = cp.ProveedorId
WHERE cp.Estado = 'Pendiente'
  AND cp.Vencimiento BETWEEN CAST(SYSUTCDATETIME() AS DATE)
                         AND DATEADD(DAY, 7, CAST(SYSUTCDATETIME() AS DATE));
GO

-- Vista: Resumen de pedidos por cliente [PED-003, REP-002]
CREATE VIEW ped.vw_ResumenCliente AS
SELECT
    c.ClienteId,
    c.Nombre        AS Cliente,
    COUNT(*)        AS TotalPedidos,
    SUM(p.Total)    AS MontoTotal,
    MAX(p.FechaPedido) AS UltimoPedido
FROM ped.Pedido p
JOIN com.Cliente c ON c.ClienteId = p.ClienteId
WHERE p.Estado <> 'Cancelado'
GROUP BY c.ClienteId, c.Nombre;
GO

-- Vista: Productos más pedidos [PED-003]
CREATE VIEW ped.vw_TopProductos AS
SELECT
    pr.ProductoId,
    pr.Nombre          AS Producto,
    cat.Nombre         AS Categoria,
    SUM(pd.Cantidad)   AS UnidadesVendidas,
    SUM(pd.Total)      AS IngresoTotal,
    COUNT(DISTINCT pd.PedidoId) AS NumeroPedidos
FROM ped.PedidoDetalle pd
JOIN ped.Pedido p ON p.PedidoId = pd.PedidoId AND p.Estado <> 'Cancelado'
JOIN inv.Producto pr  ON pr.ProductoId  = pd.ProductoId
JOIN inv.Categoria cat ON cat.CategoriaId = pr.CategoriaId
GROUP BY pr.ProductoId, pr.Nombre, cat.Nombre;
GO

-- Vista: Licitaciones con alertas [LIC-004]
CREATE VIEW lic.vw_LicitacionesAlertas AS
SELECT
    l.LicitacionId,
    l.Codigo,
    l.Institucion,
    l.Estado,
    l.FechaEnvioOferta,
    DATEDIFF(DAY, CAST(SYSUTCDATETIME() AS DATE), l.FechaEnvioOferta) AS DiasParaOferta,
    l.TotalOferta
FROM lic.Licitacion l
WHERE l.Estado NOT IN ('Adjudicado','NoAdjudicado')
  AND l.FechaEnvioOferta IS NOT NULL
  AND l.FechaEnvioOferta >= CAST(SYSUTCDATETIME() AS DATE);
GO

-- Vista: Dashboard ejecutivo [REP-001]
CREATE VIEW fin.vw_DashboardEjecutivo AS
SELECT
    (SELECT COUNT(*) FROM inv.Producto WHERE Activo = 1)                          AS ProductosActivos,
    (SELECT COUNT(*) FROM inv.Producto WHERE Activo = 1 AND Stock <= StockMinimo) AS ProductosStockBajo,
    (SELECT COUNT(*) FROM ped.Pedido WHERE Estado IN ('Confirmado'))              AS PedidosActivos,
    (SELECT ISNULL(SUM(Total),0) FROM ped.Pedido WHERE Estado <> 'Cancelado'
        AND MONTH(FechaPedido) = MONTH(SYSUTCDATETIME())
        AND YEAR(FechaPedido)  = YEAR(SYSUTCDATETIME()))                          AS VentasMes,
    (SELECT COUNT(*) FROM lic.Licitacion WHERE Estado = 'Adjudicado')            AS LicitacionesGanadas,
    (SELECT ISNULL(SUM(Monto),0) FROM fin.MovimientoFinanciero WHERE Tipo='Ingreso'
        AND MONTH(FechaMovimiento)=MONTH(SYSUTCDATETIME())
        AND YEAR(FechaMovimiento)=YEAR(SYSUTCDATETIME()))                         AS IngresosMes,
    (SELECT ISNULL(SUM(Monto),0) FROM fin.MovimientoFinanciero WHERE Tipo='Egreso'
        AND MONTH(FechaMovimiento)=MONTH(SYSUTCDATETIME())
        AND YEAR(FechaMovimiento)=YEAR(SYSUTCDATETIME()))                         AS EgresosMes;
GO


-- ============================================================
-- 15.  STORED PROCEDURES PRINCIPALES
-- ============================================================

-- ── SP: Confirmar Orden de Compra → ingresa stock [COM-003] ─
CREATE OR ALTER PROCEDURE com.sp_ConfirmarOrdenCompra
    @OrdenCompraId  INT,
    @UsuarioId      INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY

        -- Validar que esté en estado Pendiente
        IF NOT EXISTS (
            SELECT 1 FROM com.OrdenCompra
            WHERE OrdenCompraId = @OrdenCompraId AND Estado = 'Pendiente'
        )
        BEGIN
            RAISERROR('La orden no existe o no está en estado Pendiente.', 16, 1);
            RETURN;
        END

        -- Actualizar estado de la orden
        UPDATE com.OrdenCompra
        SET Estado = 'Confirmada',
            FechaConfirmacion = SYSUTCDATETIME(),
            UpdatedAt = SYSUTCDATETIME()
        WHERE OrdenCompraId = @OrdenCompraId;

        -- Ingresar stock por cada línea y registrar movimiento [INV-003]
        DECLARE @ProductoId     INT;
        DECLARE @Cantidad       INT;
        DECLARE @StockAnterior  INT;
        DECLARE @StockPosterior INT;

        DECLARE cur CURSOR LOCAL FAST_FORWARD FOR
            SELECT ProductoId, Cantidad
            FROM com.OrdenCompraDetalle
            WHERE OrdenCompraId = @OrdenCompraId;

        OPEN cur;
        FETCH NEXT FROM cur INTO @ProductoId, @Cantidad;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            SELECT @StockAnterior = Stock FROM inv.Producto WHERE ProductoId = @ProductoId;
            SET @StockPosterior = @StockAnterior + @Cantidad;

            UPDATE inv.Producto
            SET Stock = @StockPosterior,
                UpdatedAt = SYSUTCDATETIME()
            WHERE ProductoId = @ProductoId;

            INSERT INTO inv.MovimientoInventario
                (ProductoId, UsuarioId, TipoMov, Cantidad,
                 StockAnterior, StockPosterior, OrigenTipo, OrigenId, Observacion)
            VALUES
                (@ProductoId, @UsuarioId, 'Entrada', @Cantidad,
                 @StockAnterior, @StockPosterior, 'Compra', @OrdenCompraId,
                 'Ingreso automático por confirmación de orden de compra');

            FETCH NEXT FROM cur INTO @ProductoId, @Cantidad;
        END

        CLOSE cur; DEALLOCATE cur;

        -- Registrar egreso financiero automático [FIN-001]
        DECLARE @Total DECIMAL(14,2);
        SELECT @Total = Total FROM com.OrdenCompra WHERE OrdenCompraId = @OrdenCompraId;

        INSERT INTO fin.MovimientoFinanciero
            (UsuarioId, Tipo, Categoria, Descripcion, Monto, OrigenTipo, OrigenId)
        VALUES
            (@UsuarioId, 'Egreso', 'Compra',
             'Pago OC confirmada #' + CAST(@OrdenCompraId AS NVARCHAR),
             @Total, 'Compra', @OrdenCompraId);

        -- Crear cuenta por pagar automáticamente [FIN-004]
        DECLARE @ProveedorId INT;
        SELECT @ProveedorId = ProveedorId FROM com.OrdenCompra WHERE OrdenCompraId = @OrdenCompraId;

        INSERT INTO fin.CuentaPagar
            (ProveedorId, UsuarioId, Concepto, OrigenTipo, OrigenId, Monto, Vencimiento)
        SELECT
            @ProveedorId, @UsuarioId,
            'OC-' + NumeroOrden, 'Compra', @OrdenCompraId,
            Total,
            DATEADD(DAY, 30, FechaOrden)  -- 30 días crédito por defecto
        FROM com.OrdenCompra
        WHERE OrdenCompraId = @OrdenCompraId;

        COMMIT TRANSACTION;
        SELECT 'OK' AS Resultado, @OrdenCompraId AS OrdenCompraId;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ── SP: Confirmar Pedido → descuenta stock [PED-001] ────────
CREATE OR ALTER PROCEDURE ped.sp_ConfirmarPedido
    @PedidoId   INT,
    @UsuarioId  INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY

        IF NOT EXISTS (
            SELECT 1 FROM ped.Pedido WHERE PedidoId = @PedidoId AND Estado = 'Borrador'
        )
        BEGIN
            RAISERROR('El pedido no existe o no está en estado Borrador.', 16, 1);
            RETURN;
        END

        -- Verificar stock disponible para todos los productos
        IF EXISTS (
            SELECT 1
            FROM ped.PedidoDetalle pd
            JOIN inv.Producto pr ON pr.ProductoId = pd.ProductoId
            WHERE pd.PedidoId = @PedidoId
              AND pr.Stock < pd.Cantidad
        )
        BEGIN
            RAISERROR('Stock insuficiente para uno o más productos del pedido.', 16, 1);
            RETURN;
        END

        UPDATE ped.Pedido
        SET Estado = 'Confirmado',
            FechaConfirmacion = SYSUTCDATETIME(),
            UpdatedAt = SYSUTCDATETIME()
        WHERE PedidoId = @PedidoId;

        -- Descontar stock y registrar movimiento [INV-003]
        DECLARE @ProductoId INT, @Cantidad INT, @StockAnt INT, @StockPost INT;

        DECLARE cur2 CURSOR LOCAL FAST_FORWARD FOR
            SELECT ProductoId, Cantidad FROM ped.PedidoDetalle WHERE PedidoId = @PedidoId;

        OPEN cur2;
        FETCH NEXT FROM cur2 INTO @ProductoId, @Cantidad;
        WHILE @@FETCH_STATUS = 0
        BEGIN
            SELECT @StockAnt = Stock FROM inv.Producto WHERE ProductoId = @ProductoId;
            SET @StockPost = @StockAnt - @Cantidad;

            UPDATE inv.Producto
            SET Stock = @StockPost, UpdatedAt = SYSUTCDATETIME()
            WHERE ProductoId = @ProductoId;

            INSERT INTO inv.MovimientoInventario
                (ProductoId, UsuarioId, TipoMov, Cantidad,
                 StockAnterior, StockPosterior, OrigenTipo, OrigenId, Observacion)
            VALUES
                (@ProductoId, @UsuarioId, 'Salida', @Cantidad,
                 @StockAnt, @StockPost, 'Pedido', @PedidoId,
                 'Salida automática por confirmación de pedido');

            FETCH NEXT FROM cur2 INTO @ProductoId, @Cantidad;
        END
        CLOSE cur2; DEALLOCATE cur2;

        -- Registrar ingreso financiero automático [FIN-001]
        DECLARE @Total2 DECIMAL(14,2);
        SELECT @Total2 = Total FROM ped.Pedido WHERE PedidoId = @PedidoId;

        INSERT INTO fin.MovimientoFinanciero
            (UsuarioId, Tipo, Categoria, Descripcion, Monto, OrigenTipo, OrigenId)
        VALUES
            (@UsuarioId, 'Ingreso', 'Pedido',
             'Venta pedido #' + CAST(@PedidoId AS NVARCHAR),
             @Total2, 'Pedido', @PedidoId);

        -- Crear cuenta por cobrar automáticamente [FIN-003]
        DECLARE @ClienteId2 INT;
        SELECT @ClienteId2 = ClienteId FROM ped.Pedido WHERE PedidoId = @PedidoId;

        INSERT INTO fin.CuentaCobrar
            (ClienteId, UsuarioId, Concepto, OrigenTipo, OrigenId, Monto, Vencimiento)
        SELECT
            @ClienteId2, @UsuarioId,
            'PED-' + NumeroPedido, 'Pedido', @PedidoId,
            Total,
            DATEADD(DAY, 15, FechaPedido)
        FROM ped.Pedido WHERE PedidoId = @PedidoId;

        -- Actualizar fecha último pedido en cliente
        UPDATE com.Cliente
        SET FechaUltimoPedido = SYSUTCDATETIME(), UpdatedAt = SYSUTCDATETIME()
        WHERE ClienteId = @ClienteId2;

        COMMIT TRANSACTION;
        SELECT 'OK' AS Resultado, @PedidoId AS PedidoId;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ── SP: Marcar pedido como entregado (solo desde Confirmado) ────────
CREATE OR ALTER PROCEDURE ped.sp_EntregarPedido
    @PedidoId   INT,
    @UsuarioId  INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (
        SELECT 1 FROM ped.Pedido WHERE PedidoId = @PedidoId AND Estado = N'Confirmado'
    )
    BEGIN
        RAISERROR(N'El pedido no existe o no está en estado Confirmado.', 16, 1);
        RETURN;
    END

    UPDATE ped.Pedido
    SET Estado = N'Entregado',
        FechaEntrega = COALESCE(FechaEntrega, CAST(SYSUTCDATETIME() AS DATE)),
        UpdatedAt = SYSUTCDATETIME()
    WHERE PedidoId = @PedidoId;

    SELECT 'OK' AS Resultado, @PedidoId AS PedidoId;
END;
GO

-- ── SP: Cancelar Pedido → devuelve stock si estaba confirmado
CREATE OR ALTER PROCEDURE ped.sp_CancelarPedido
    @PedidoId  INT,
    @UsuarioId INT,
    @Motivo    NVARCHAR(300) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY

        DECLARE @EstadoActual NVARCHAR(15);
        SELECT @EstadoActual = Estado FROM ped.Pedido WHERE PedidoId = @PedidoId;

        IF @EstadoActual IS NULL OR @EstadoActual = 'Cancelado'
        BEGIN
            RAISERROR('El pedido no existe o ya está cancelado.', 16, 1);
            RETURN;
        END

        IF @EstadoActual = 'Entregado'
        BEGIN
            RAISERROR('No se puede cancelar un pedido que ya fue entregado.', 16, 1);
            RETURN;
        END

        UPDATE ped.Pedido
        SET Estado = 'Cancelado',
            FechaCancelacion = SYSUTCDATETIME(),
            MotivoCancelacion = @Motivo,
            UpdatedAt = SYSUTCDATETIME()
        WHERE PedidoId = @PedidoId;

        -- Revertir stock solo si estaba Confirmado [PED-002]
        IF @EstadoActual = 'Confirmado'
        BEGIN
            DECLARE @PId INT, @Cant INT, @SAnt INT, @SPost INT;
            DECLARE cur3 CURSOR LOCAL FAST_FORWARD FOR
                SELECT ProductoId, Cantidad FROM ped.PedidoDetalle WHERE PedidoId = @PedidoId;

            OPEN cur3;
            FETCH NEXT FROM cur3 INTO @PId, @Cant;
            WHILE @@FETCH_STATUS = 0
            BEGIN
                SELECT @SAnt = Stock FROM inv.Producto WHERE ProductoId = @PId;
                SET @SPost = @SAnt + @Cant;

                UPDATE inv.Producto SET Stock = @SPost, UpdatedAt = SYSUTCDATETIME()
                WHERE ProductoId = @PId;

                INSERT INTO inv.MovimientoInventario
                    (ProductoId, UsuarioId, TipoMov, Cantidad,
                     StockAnterior, StockPosterior, OrigenTipo, OrigenId, Observacion)
                VALUES
                    (@PId, @UsuarioId, 'Entrada', @Cant,
                     @SAnt, @SPost, 'Pedido', @PedidoId, 'Devolución por cancelación de pedido');

                FETCH NEXT FROM cur3 INTO @PId, @Cant;
            END
            CLOSE cur3; DEALLOCATE cur3;

            -- Cerrar cuenta por cobrar asociada
            UPDATE fin.CuentaCobrar
            SET Estado = 'Pagado', FechaPago = SYSUTCDATETIME(), UpdatedAt = SYSUTCDATETIME(),
                Observacion = 'Anulado por cancelación de pedido'
            WHERE OrigenTipo = 'Pedido' AND OrigenId = @PedidoId AND Estado = 'Pendiente';
        END

        COMMIT TRANSACTION;
        SELECT 'OK' AS Resultado;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ── SP: Calcular Predicciones de compra [PRE-001, PRE-002] ──
CREATE OR ALTER PROCEDURE fin.sp_RecalcularPredicciones
AS
BEGIN
    SET NOCOUNT ON;

    -- Limpiar predicciones anteriores
    TRUNCATE TABLE fin.PrediccionCompra;

    -- Calcular desde historial de pedidos (últimos 12 meses)
    INSERT INTO fin.PrediccionCompra
        (ClienteId, ProductoId, VecesPedido, TotalMesesAnalisis, ProbabilidadPct, NivelConfianza, PromedioUnidades)
    SELECT
        p.ClienteId,
        pd.ProductoId,
        COUNT(DISTINCT p.PedidoId)                          AS VecesPedido,
        DATEDIFF(MONTH,
            MIN(p.FechaPedido),
            MAX(p.FechaPedido)) + 1                         AS TotalMesesAnalisis,
        CAST(
            COUNT(DISTINCT p.PedidoId) * 100.0 /
            NULLIF(DATEDIFF(MONTH, MIN(p.FechaPedido),
                            MAX(p.FechaPedido)) + 1, 0)
        AS DECIMAL(5,2))                                    AS ProbabilidadPct,
        CASE
            WHEN COUNT(DISTINCT p.PedidoId) * 100.0 /
                 NULLIF(DATEDIFF(MONTH, MIN(p.FechaPedido),
                                 MAX(p.FechaPedido)) + 1, 0) >= 70 THEN 'Alta'
            WHEN COUNT(DISTINCT p.PedidoId) * 100.0 /
                 NULLIF(DATEDIFF(MONTH, MIN(p.FechaPedido),
                                 MAX(p.FechaPedido)) + 1, 0) >= 40 THEN 'Media'
            ELSE 'Baja'
        END                                                 AS NivelConfianza,
        AVG(CAST(pd.Cantidad AS DECIMAL(10,2)))             AS PromedioUnidades
    FROM ped.Pedido p
    JOIN ped.PedidoDetalle pd ON pd.PedidoId = p.PedidoId
    WHERE p.Estado <> 'Cancelado'
      AND p.FechaPedido >= DATEADD(MONTH, -12, CAST(SYSUTCDATETIME() AS DATE))
    GROUP BY p.ClienteId, pd.ProductoId;

    SELECT @@ROWCOUNT AS PrediccionesCalculadas, SYSUTCDATETIME() AS FechaCalculo;
END;
GO

-- ── SP: Marcar vencimientos automáticamente (programar con SQL Agent)
CREATE OR ALTER PROCEDURE fin.sp_ActualizarVencidos
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Hoy DATE = CAST(SYSUTCDATETIME() AS DATE);

    UPDATE fin.CuentaCobrar
    SET Estado = 'Vencido', UpdatedAt = SYSUTCDATETIME()
    WHERE Estado = 'Pendiente' AND Vencimiento < @Hoy;

    UPDATE fin.CuentaPagar
    SET Estado = 'Vencido', UpdatedAt = SYSUTCDATETIME()
    WHERE Estado = 'Pendiente' AND Vencimiento < @Hoy;

    SELECT
        (SELECT COUNT(*) FROM fin.CuentaCobrar WHERE Estado='Vencido') AS CobrarVencidas,
        (SELECT COUNT(*) FROM fin.CuentaPagar  WHERE Estado='Vencido') AS PagarVencidas;
END;
GO


-- ============================================================
-- 16.  DATOS SEMILLA (Seed Data)
-- ============================================================

-- Empresa
INSERT INTO adm.Empresa
    (NombreComercial, RazonSocial, CedulaJuridica,
     Telefono1, Telefono2, CorreoPrincipal, CorreoAlt,
     Direccion, SitioWeb, Representante)
VALUES
    ('Punto Fresco de Costa Rica S.A.',
     'Punto Fresco de Costa Rica Sociedad Anónima',
     '3-101-758432',
     '2234-5678', '8812-3456',
     'info@puntofresco.cr', 'admin@puntofresco.cr',
     'San José, Escazú, Centro Comercial Multiplaza, Local 214',
     'www.puntofresco.cr',
     'Adrián Mora');

-- Parámetros — Impuestos
INSERT INTO adm.Parametro (Tipo, Nombre, Valor, Descripcion) VALUES
    ('Impuesto', 'IVA General',  '13', 'Impuesto al Valor Agregado tarifa general'),
    ('Impuesto', 'IVA Reducido', '4',  'Tarifa reducida medicamentos y canasta básica'),
    ('Impuesto', 'Exento',       '0',  'Productos exentos de IVA');

-- Módulos del sistema
INSERT INTO seg.Modulo (Codigo, Nombre, Icono, Orden) VALUES
    ('ADMINISTRATIVO', 'Administrativo',  '🏛️', 1),
    ('ROLES',          'Roles',           '🔑', 2),
    ('USUARIOS',       'Usuarios',        '👤', 3),
    ('EMPLEADOS',      'Empleados',       '👷', 4),
    ('CLIENTES',       'Clientes',        '🏪', 5),
    ('PROVEEDORES',    'Proveedores',     '🚚', 6),
    ('COMPRAS',        'Compras',         '🛒', 7),
    ('INVENTARIO',     'Inventario',      '📦', 8),
    ('PEDIDOS',        'Pedidos',         '📋', 9),
    ('LICITACIONES',   'Licitaciones',    '📑', 10),
    ('FINANZAS',       'Finanzas',        '💰', 11),
    ('PREDICCIONES',   'Predicciones',    '🤖', 12),
    ('REPORTES',       'Reportes',        '📊', 13);

-- Roles
INSERT INTO seg.Rol (Nombre, Descripcion) VALUES
    ('Administrador', 'Acceso total al sistema'),
    ('Ventas',        'Gestión de pedidos y clientes'),
    ('Proveeduría',   'Gestión de compras e inventario'),
    ('Logística',     'Coordinación de despacho'),
    ('Finanzas',      'Control financiero y reportes');

-- Permisos — Administrador tiene todo
INSERT INTO seg.Permiso (RolId, ModuloId, PuedeVer, PuedeCrear, PuedeEditar, PuedeElim, PuedeExport)
SELECT
    1 AS RolId,
    ModuloId,
    1, 1, 1, 1, 1
FROM seg.Modulo;

-- Permisos — Ventas
INSERT INTO seg.Permiso (RolId, ModuloId, PuedeVer, PuedeCrear, PuedeEditar, PuedeElim, PuedeExport)
SELECT 2, ModuloId, 1, 1, 1, 0, 1
FROM seg.Modulo WHERE Codigo IN ('CLIENTES','PEDIDOS','INVENTARIO');

-- Usuario administrador (contraseña: Admin2024! — hash BCrypt de ejemplo)
INSERT INTO seg.Usuario
    (RolId, NombreCompleto, Identificacion, NombreUsuario, Correo,
     PasswordHash, PasswordSalt, Puesto, Activo)
VALUES
    (1, 'Adrián Mora', '1-0934-0281', 'amora', 'amora@puntofresco.cr',
     '$2a$12$PLACEHOLDER_HASH_REPLACE_ME_IN_PRODUCTION',
     '$2a$12$PLACEHOLDER_SALT',
     'Gerente TI', 1);

-- Áreas
INSERT INTO rrhh.Area (Nombre) VALUES
    ('Tecnología'),('Ventas'),('Proveeduría'),
    ('Operaciones'),('Finanzas'),('Administración');

-- Categorías de productos
INSERT INTO inv.Categoria (Nombre) VALUES
    ('Vegetales'),('Frutas'),('Lácteos'),
    ('Carnes'),('Granos'),('Aceites');

-- Clientes
INSERT INTO com.Cliente (Nombre, Identificacion, Telefono, Correo, Direccion, Activo) VALUES
    ('Supermercados La Colonia S.A.', '3-101-112233', '2200-1100', 'compras@lacolonia.cr',   'San José, Barrio Tournón',   1),
    ('Restaurant El Fogón Tico',      '3-102-445566', '2255-8899', 'elfogonantico@gmail.com','Heredia, Barva',             1),
    ('Mini Super Don Carlos',         '1-0882-3344',  '2277-3344', 'dcarlos.mini@gmail.com', 'Cartago, Paraíso',           0),
    ('Cafetería Universidad Latina',  '3-101-667788', '2224-5555', 'cafeteria@ulatina.ac.cr','San José, Moravia',          1);

-- Proveedores
INSERT INTO com.Proveedor (Nombre, Identificacion, Telefono, Correo, Direccion, Activo) VALUES
    ('Distribuidora Nacional S.A.',  '3-101-223344', '2200-5566', 'ventas@disnacional.cr', 'San José, Zona Franca', 1),
    ('Agro Tico S.A.',               '3-101-334455', '2233-7788', 'pedidos@agrotico.cr',   'Alajuela, Grecia',      1),
    ('Importaciones CR LTDA',        '3-102-556677', '2244-9900', 'import@importcr.com',   'Limón, Puerto',         0),
    ('Lácteos del Trópico S.A.',     '3-101-778899', '2299-1122', 'ventas@lacteostt.cr',   'Cartago, Llanos Santa Lucía', 1);

-- Productos (ParametroIvaId=1 → 13%, 2 → 4%, 3 → 0%)
INSERT INTO inv.Producto (CategoriaId, ParametroIvaId, Nombre, PrecioCompra, PrecioVenta, Stock, StockMinimo, Activo) VALUES
    (1, 1, 'Tomate Cherry',    850,  1200, 45, 20, 1),
    (1, 1, 'Lechuga Romana',   600,  900,  8,  15, 1),
    (3, 1, 'Queso Gouda',      3200, 4800, 30, 10, 1),
    (4, 1, 'Pechuga de Pollo', 2800, 4200, 5,  12, 1),
    (6, 1, 'Aceite de Oliva',  4500, 6500, 22, 8,  1),
    (5, 3, 'Arroz Integral',   900,  1400, 60, 20, 1),
    (3, 2, 'Yogurt Natural',   1100, 1600, 18, 10, 1),
    (1, 1, 'Espinaca Fresca',  700,  1050, 0,  10, 0);

GO

-- ============================================================
--  TRIGGERS — UpdatedAt automático
-- ============================================================

CREATE TRIGGER adm.trg_Empresa_UpdatedAt ON adm.Empresa AFTER UPDATE AS
BEGIN SET NOCOUNT ON; UPDATE adm.Empresa SET UpdatedAt = SYSUTCDATETIME() WHERE EmpresaId IN (SELECT EmpresaId FROM inserted); END;
GO
CREATE TRIGGER adm.trg_Parametro_UpdatedAt ON adm.Parametro AFTER UPDATE AS
BEGIN SET NOCOUNT ON; UPDATE adm.Parametro SET UpdatedAt = SYSUTCDATETIME() WHERE ParametroId IN (SELECT ParametroId FROM inserted); END;
GO
CREATE TRIGGER seg.trg_Rol_UpdatedAt ON seg.Rol AFTER UPDATE AS
BEGIN SET NOCOUNT ON; UPDATE seg.Rol SET UpdatedAt = SYSUTCDATETIME() WHERE RolId IN (SELECT RolId FROM inserted); END;
GO
CREATE TRIGGER seg.trg_Usuario_UpdatedAt ON seg.Usuario AFTER UPDATE AS
BEGIN SET NOCOUNT ON; UPDATE seg.Usuario SET UpdatedAt = SYSUTCDATETIME() WHERE UsuarioId IN (SELECT UsuarioId FROM inserted); END;
GO
CREATE TRIGGER rrhh.trg_Empleado_UpdatedAt ON rrhh.Empleado AFTER UPDATE AS
BEGIN SET NOCOUNT ON; UPDATE rrhh.Empleado SET UpdatedAt = SYSUTCDATETIME() WHERE EmpleadoId IN (SELECT EmpleadoId FROM inserted); END;
GO
CREATE TRIGGER com.trg_Cliente_UpdatedAt ON com.Cliente AFTER UPDATE AS
BEGIN SET NOCOUNT ON; UPDATE com.Cliente SET UpdatedAt = SYSUTCDATETIME() WHERE ClienteId IN (SELECT ClienteId FROM inserted); END;
GO
CREATE TRIGGER com.trg_Proveedor_UpdatedAt ON com.Proveedor AFTER UPDATE AS
BEGIN SET NOCOUNT ON; UPDATE com.Proveedor SET UpdatedAt = SYSUTCDATETIME() WHERE ProveedorId IN (SELECT ProveedorId FROM inserted); END;
GO
CREATE TRIGGER inv.trg_Producto_UpdatedAt ON inv.Producto AFTER UPDATE AS
BEGIN SET NOCOUNT ON; UPDATE inv.Producto SET UpdatedAt = SYSUTCDATETIME() WHERE ProductoId IN (SELECT ProductoId FROM inserted); END;
GO
CREATE TRIGGER com.trg_OC_UpdatedAt ON com.OrdenCompra AFTER UPDATE AS
BEGIN SET NOCOUNT ON; UPDATE com.OrdenCompra SET UpdatedAt = SYSUTCDATETIME() WHERE OrdenCompraId IN (SELECT OrdenCompraId FROM inserted); END;
GO
CREATE TRIGGER ped.trg_Pedido_UpdatedAt ON ped.Pedido AFTER UPDATE AS
BEGIN SET NOCOUNT ON; UPDATE ped.Pedido SET UpdatedAt = SYSUTCDATETIME() WHERE PedidoId IN (SELECT PedidoId FROM inserted); END;
GO
CREATE TRIGGER lic.trg_Licitacion_UpdatedAt ON lic.Licitacion AFTER UPDATE AS
BEGIN SET NOCOUNT ON; UPDATE lic.Licitacion SET UpdatedAt = SYSUTCDATETIME() WHERE LicitacionId IN (SELECT LicitacionId FROM inserted); END;
GO
CREATE TRIGGER fin.trg_CC_UpdatedAt ON fin.CuentaCobrar AFTER UPDATE AS
BEGIN SET NOCOUNT ON; UPDATE fin.CuentaCobrar SET UpdatedAt = SYSUTCDATETIME() WHERE CuentaCobrarId IN (SELECT CuentaCobrarId FROM inserted); END;
GO
CREATE TRIGGER fin.trg_CP_UpdatedAt ON fin.CuentaPagar AFTER UPDATE AS
BEGIN SET NOCOUNT ON; UPDATE fin.CuentaPagar SET UpdatedAt = SYSUTCDATETIME() WHERE CuentaPagarId IN (SELECT CuentaPagarId FROM inserted); END;
GO

-- ============================================================
--  VERIFICACIÓN FINAL
-- ============================================================
SELECT
    s.name    AS Esquema,
    t.name    AS Tabla,
    p.rows    AS Filas
FROM sys.tables t
JOIN sys.schemas s ON s.schema_id = t.schema_id
JOIN sys.partitions p ON p.object_id = t.object_id AND p.index_id <= 1
ORDER BY s.name, t.name;
GO

PRINT '============================================================';
PRINT ' SGE PuntoFresco — Base de datos creada exitosamente.';
PRINT ' Tablas : 26  |  Vistas : 6  |  SPs : 5  |  Triggers : 13';
PRINT '============================================================';
GO
