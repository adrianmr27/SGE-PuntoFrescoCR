using Microsoft.EntityFrameworkCore;
using SGE_PuntoFrescoCRDAL.Entidades;

namespace SGE_PuntoFrescoCRDAL.Data;

public class SgePuntoFrescoDbContext : DbContext
{
    public SgePuntoFrescoDbContext(DbContextOptions<SgePuntoFrescoDbContext> options)
        : base(options)
    {
    }

    public DbSet<Empresa> Empresas => Set<Empresa>();
    public DbSet<Parametro> Parametros => Set<Parametro>();
    public DbSet<Rol> Roles => Set<Rol>();
    public DbSet<Modulo> Modulos => Set<Modulo>();
    public DbSet<Permiso> Permisos => Set<Permiso>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Area> Areas => Set<Area>();
    public DbSet<Empleado> Empleados => Set<Empleado>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Proveedor> Proveedores => Set<Proveedor>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Producto> Productos => Set<Producto>();
    public DbSet<MovimientoInventario> MovimientosInventario => Set<MovimientoInventario>();
    public DbSet<OrdenCompra> OrdenesCompra => Set<OrdenCompra>();
    public DbSet<OrdenCompraDetalle> OrdenesCompraDetalle => Set<OrdenCompraDetalle>();
    public DbSet<Pedido> Pedidos => Set<Pedido>();
    public DbSet<PedidoDetalle> PedidosDetalle => Set<PedidoDetalle>();
    public DbSet<Licitacion> Licitaciones => Set<Licitacion>();
    public DbSet<LicitacionDetalle> LicitacionesDetalle => Set<LicitacionDetalle>();
    public DbSet<LicitacionDocumento> LicitacionesDocumentos => Set<LicitacionDocumento>();
    public DbSet<LicitacionRecordatorio> LicitacionesRecordatorios => Set<LicitacionRecordatorio>();
    public DbSet<MovimientoFinanciero> MovimientosFinancieros => Set<MovimientoFinanciero>();
    public DbSet<CuentaCobrar> CuentasCobrar => Set<CuentaCobrar>();
    public DbSet<CuentaPagar> CuentasPagar => Set<CuentaPagar>();
    public DbSet<PrediccionCompra> PrediccionesCompra => Set<PrediccionCompra>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var restrict = DeleteBehavior.Restrict;

        // SQL Server: tablas con triggers no admiten OUTPUT en INSERT/UPDATE (EF Core 7+).
        modelBuilder.Entity<Empresa>(e =>
        {
            e.ToTable("Empresa", "adm", t => t.UseSqlOutputClause(false));
            e.HasKey(x => x.EmpresaId);
        });

        modelBuilder.Entity<Parametro>(e =>
        {
            e.ToTable("Parametro", "adm", t => t.UseSqlOutputClause(false));
            e.HasKey(x => x.ParametroId);
        });

        modelBuilder.Entity<Rol>(e =>
        {
            e.ToTable("Rol", "seg", t => t.UseSqlOutputClause(false));
            e.HasKey(x => x.RolId);
        });

        modelBuilder.Entity<Modulo>(e =>
        {
            e.ToTable("Modulo", "seg");
            e.HasKey(x => x.ModuloId);
        });

        modelBuilder.Entity<Permiso>(e =>
        {
            e.ToTable("Permiso", "seg");
            e.HasKey(x => x.PermisoId);
            e.HasOne(x => x.Rol).WithMany(r => r.Permisos).HasForeignKey(x => x.RolId).OnDelete(restrict);
            e.HasOne(x => x.Modulo).WithMany(m => m.Permisos).HasForeignKey(x => x.ModuloId).OnDelete(restrict);
        });

        modelBuilder.Entity<Usuario>(e =>
        {
            e.ToTable("Usuario", "seg", t => t.UseSqlOutputClause(false));
            e.HasKey(x => x.UsuarioId);
            e.HasOne(x => x.Rol).WithMany(r => r.Usuarios).HasForeignKey(x => x.RolId).OnDelete(restrict);
        });

        modelBuilder.Entity<Area>(e =>
        {
            e.ToTable("Area", "rrhh");
            e.HasKey(x => x.AreaId);
        });

        modelBuilder.Entity<Empleado>(e =>
        {
            e.ToTable("Empleado", "rrhh", t => t.UseSqlOutputClause(false));
            e.HasKey(x => x.EmpleadoId);
            e.HasOne(x => x.Area).WithMany(a => a.Empleados).HasForeignKey(x => x.AreaId).OnDelete(restrict);
            e.HasOne(x => x.Usuario).WithMany().HasForeignKey(x => x.UsuarioId).OnDelete(restrict);
        });

        modelBuilder.Entity<Cliente>(e =>
        {
            e.ToTable("Cliente", "com", t => t.UseSqlOutputClause(false));
            e.HasKey(x => x.ClienteId);
        });

        modelBuilder.Entity<Proveedor>(e =>
        {
            e.ToTable("Proveedor", "com", t => t.UseSqlOutputClause(false));
            e.HasKey(x => x.ProveedorId);
        });

        modelBuilder.Entity<OrdenCompra>(e =>
        {
            e.ToTable("OrdenCompra", "com", t => t.UseSqlOutputClause(false));
            e.HasKey(x => x.OrdenCompraId);
            e.HasOne(x => x.Proveedor).WithMany().HasForeignKey(x => x.ProveedorId).OnDelete(restrict);
            e.HasOne(x => x.Usuario).WithMany().HasForeignKey(x => x.UsuarioId).OnDelete(restrict);
        });

        modelBuilder.Entity<OrdenCompraDetalle>(e =>
        {
            e.ToTable("OrdenCompraDetalle", "com");
            e.HasKey(x => x.DetalleId);
            e.HasOne(x => x.OrdenCompra).WithMany(o => o.Detalles).HasForeignKey(x => x.OrdenCompraId).OnDelete(restrict);
            e.HasOne(x => x.Producto).WithMany().HasForeignKey(x => x.ProductoId).OnDelete(restrict);
        });

        modelBuilder.Entity<Categoria>(e =>
        {
            e.ToTable("Categoria", "inv");
            e.HasKey(x => x.CategoriaId);
        });

        modelBuilder.Entity<Producto>(e =>
        {
            e.ToTable("Producto", "inv", t => t.UseSqlOutputClause(false));
            e.HasKey(x => x.ProductoId);
            e.HasOne(x => x.Categoria).WithMany(c => c.Productos).HasForeignKey(x => x.CategoriaId).OnDelete(restrict);
            e.HasOne(x => x.ParametroIva).WithMany().HasForeignKey(x => x.ParametroIvaId).OnDelete(restrict);
        });

        modelBuilder.Entity<MovimientoInventario>(e =>
        {
            e.ToTable("MovimientoInventario", "inv");
            e.HasKey(x => x.MovimientoId);
            e.HasOne(x => x.Producto).WithMany().HasForeignKey(x => x.ProductoId).OnDelete(restrict);
            e.HasOne(x => x.Usuario).WithMany().HasForeignKey(x => x.UsuarioId).OnDelete(restrict);
        });

        modelBuilder.Entity<Pedido>(e =>
        {
            e.ToTable("Pedido", "ped", t => t.UseSqlOutputClause(false));
            e.HasKey(x => x.PedidoId);
            e.HasOne(x => x.Cliente).WithMany().HasForeignKey(x => x.ClienteId).OnDelete(restrict);
            e.HasOne(x => x.Usuario).WithMany().HasForeignKey(x => x.UsuarioId).OnDelete(restrict);
        });

        modelBuilder.Entity<PedidoDetalle>(e =>
        {
            e.ToTable("PedidoDetalle", "ped");
            e.HasKey(x => x.DetalleId);
            e.HasOne(x => x.Pedido).WithMany(p => p.Detalles).HasForeignKey(x => x.PedidoId).OnDelete(restrict);
            e.HasOne(x => x.Producto).WithMany().HasForeignKey(x => x.ProductoId).OnDelete(restrict);
        });

        modelBuilder.Entity<Licitacion>(e =>
        {
            e.ToTable("Licitacion", "lic", t => t.UseSqlOutputClause(false));
            e.HasKey(x => x.LicitacionId);
            e.HasOne(x => x.Usuario).WithMany().HasForeignKey(x => x.UsuarioId).OnDelete(restrict);
        });

        modelBuilder.Entity<LicitacionDetalle>(e =>
        {
            e.ToTable("LicitacionDetalle", "lic");
            e.HasKey(x => x.DetalleId);
            e.HasOne(x => x.Licitacion).WithMany(l => l.Detalles).HasForeignKey(x => x.LicitacionId).OnDelete(restrict);
            e.HasOne(x => x.Producto).WithMany().HasForeignKey(x => x.ProductoId).OnDelete(restrict);
        });

        modelBuilder.Entity<LicitacionDocumento>(e =>
        {
            e.ToTable("LicitacionDocumento", "lic");
            e.HasKey(x => x.DocumentoId);
            e.HasOne(x => x.Licitacion).WithMany(l => l.Documentos).HasForeignKey(x => x.LicitacionId).OnDelete(restrict);
            e.HasOne(x => x.Usuario).WithMany().HasForeignKey(x => x.UsuarioId).OnDelete(restrict);
        });

        modelBuilder.Entity<LicitacionRecordatorio>(e =>
        {
            e.ToTable("LicitacionRecordatorio", "lic");
            e.HasKey(x => x.RecordatorioId);
            e.HasOne(x => x.Licitacion).WithMany(l => l.Recordatorios).HasForeignKey(x => x.LicitacionId).OnDelete(restrict);
        });

        modelBuilder.Entity<MovimientoFinanciero>(e =>
        {
            e.ToTable("MovimientoFinanciero", "fin");
            e.HasKey(x => x.MovFinancieroId);
            e.HasOne(x => x.Usuario).WithMany().HasForeignKey(x => x.UsuarioId).OnDelete(restrict);
        });

        modelBuilder.Entity<CuentaCobrar>(e =>
        {
            e.ToTable("CuentaCobrar", "fin", t => t.UseSqlOutputClause(false));
            e.HasKey(x => x.CuentaCobrarId);
            e.HasOne(x => x.Cliente).WithMany().HasForeignKey(x => x.ClienteId).OnDelete(restrict);
            e.HasOne(x => x.Usuario).WithMany().HasForeignKey(x => x.UsuarioId).OnDelete(restrict);
        });

        modelBuilder.Entity<CuentaPagar>(e =>
        {
            e.ToTable("CuentaPagar", "fin", t => t.UseSqlOutputClause(false));
            e.HasKey(x => x.CuentaPagarId);
            e.HasOne(x => x.Proveedor).WithMany().HasForeignKey(x => x.ProveedorId).OnDelete(restrict);
            e.HasOne(x => x.Usuario).WithMany().HasForeignKey(x => x.UsuarioId).OnDelete(restrict);
        });

        modelBuilder.Entity<PrediccionCompra>(e =>
        {
            e.ToTable("PrediccionCompra", "fin");
            e.HasKey(x => x.PrediccionId);
            e.HasOne(x => x.Cliente).WithMany().HasForeignKey(x => x.ClienteId).OnDelete(restrict);
            e.HasOne(x => x.Producto).WithMany().HasForeignKey(x => x.ProductoId).OnDelete(restrict);
        });
    }
}
