using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SGE_PuntoFrescoCRBLL.Services;
using SGE_PuntoFrescoCRDAL.Data;
using SGE_PuntoFrescoCRDAL.Repositorios.Generico;

namespace SGE_PuntoFrescoCRBLL.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddPuntoFrescoServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<SgePuntoFrescoDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped(typeof(IRepositorioGenerico<>), typeof(RepositorioGenerico<>));
        services.AddScoped<IEmailNotificacionService, SmtpEmailNotificacionService>();
        services.AddScoped<AuthService>();
        services.AddScoped<SpaDataService>();
        services.AddScoped<SpaCrudService>();
        services.AddScoped<IParametroService, ParametroService>();
        services.AddScoped<IRolService, RolService>();
        services.AddScoped<IUsuarioService, UsuarioService>();
        services.AddScoped<IEmpleadoService, EmpleadoService>();
        services.AddScoped<IClienteService, ClienteService>();
        services.AddScoped<IProveedorService, ProveedorService>();
        services.AddScoped<IProductoService, ProductoService>();
        services.AddScoped<ICompraService, CompraService>();
        services.AddScoped<IPedidoService, PedidoService>();
        services.AddScoped<ILicitacionService, LicitacionService>();
        services.AddScoped<IFinanzaService, FinanzaService>();
        services.AddScoped<IPrediccionService, PrediccionService>();
        services.AddScoped<IPermisoService, PermisoService>();
        services.AddScoped<EmpresaBllService>();

        return services;
    }
}
