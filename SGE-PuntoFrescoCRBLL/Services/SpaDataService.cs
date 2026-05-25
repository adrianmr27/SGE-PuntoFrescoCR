using Microsoft.EntityFrameworkCore;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRDAL.Data;

namespace SGE_PuntoFrescoCRBLL.Services;

public class SpaDataService
{
    private readonly SgePuntoFrescoDbContext _db;

    public SpaDataService(SgePuntoFrescoDbContext db) => _db = db;

    public async Task<SpaBootstrapDto> ObtenerBootstrapAsync(int usuarioId = 0, CancellationToken ct = default)
    {
        var dto = new SpaBootstrapDto();

        var empresa = await _db.Empresas.AsNoTracking().FirstOrDefaultAsync(ct);
        var ivaParam = await _db.Parametros.AsNoTracking()
            .Where(p => p.Tipo == "Impuesto" && p.Nombre.Contains("General"))
            .Select(p => p.Valor)
            .FirstOrDefaultAsync(ct) ?? "13";

        if (empresa != null)
        {
            dto.Empresa = new EmpresaClienteDto
            {
                NombreComercial = empresa.NombreComercial,
                RazonSocial = empresa.RazonSocial,
                CedulaJuridica = empresa.CedulaJuridica,
                Telefono1 = empresa.Telefono1,
                Telefono2 = empresa.Telefono2,
                Correo = empresa.CorreoPrincipal,
                CorreoAlt = empresa.CorreoAlt,
                Direccion = empresa.Direccion,
                SitioWeb = empresa.SitioWeb,
                ImpuestoDefecto = ivaParam.TrimEnd('%')
            };
        }

        dto.Parametros = await _db.Parametros.AsNoTracking()
            .OrderBy(p => p.ParametroId)
            .Select(p => new ParametroClienteDto
            {
                Id = p.ParametroId,
                Tipo = p.Tipo,
                Nombre = p.Nombre,
                Valor = p.Valor.Contains('%') ? p.Valor : p.Valor + "%",
                Estado = p.Activo ? "Activo" : "Inactivo"
            }).ToListAsync(ct);

        var roles = await _db.Roles.AsNoTracking().OrderBy(r => r.RolId).ToListAsync(ct);
        foreach (var r in roles)
        {
            var n = await _db.Usuarios.CountAsync(u => u.RolId == r.RolId, ct);
            dto.Roles.Add(new RolClienteDto
            {
                Id = r.RolId,
                Nombre = r.Nombre,
                Descripcion = r.Descripcion,
                Usuarios = n,
                Estado = r.Activo ? "Activo" : "Inactivo"
            });
        }

        var usuariosRaw = await _db.Usuarios.AsNoTracking()
            .Include(u => u.Rol)
            .OrderBy(u => u.UsuarioId)
            .ToListAsync(ct);
        var empPorUsuario = await _db.Empleados.AsNoTracking()
            .Where(e => e.UsuarioId != null)
            .ToDictionaryAsync(e => e.UsuarioId!.Value, ct);
        dto.Usuarios = usuariosRaw.Select(u =>
        {
            empPorUsuario.TryGetValue(u.UsuarioId, out var emp);
            return new UsuarioClienteDto
            {
                Id = u.UsuarioId,
                RolId = u.RolId,
                Nombre = u.NombreCompleto,
                Identificacion = u.Identificacion,
                Usuario = u.NombreUsuario,
                Rol = u.Rol.Nombre,
                Correo = u.Correo,
                Puesto = u.Puesto,
                Telefono = u.Telefono,
                Direccion = u.Direccion,
                EmpleadoAreaId = emp?.AreaId,
                ContactoEmergenciaNombre = emp?.ContactoEmergenciaNombre,
                ContactoEmergenciaTel = emp?.ContactoEmergenciaTel,
                AlergiasMedicamentos = emp?.AlergiasMedicamentos,
                Estado = u.Activo ? "Activo" : "Inactivo",
                UltimoAcceso = u.UltimoAcceso.HasValue ? u.UltimoAcceso.Value.ToString("yyyy-MM-dd") : null
            };
        }).ToList();

        dto.Empleados = await _db.Empleados.AsNoTracking()
            .Include(e => e.Area)
            .OrderBy(e => e.EmpleadoId)
            .Select(e => new EmpleadoClienteDto
            {
                Id = e.EmpleadoId,
                UsuarioId = e.UsuarioId,
                AreaId = e.AreaId,
                Nombre = e.NombreCompleto,
                Identificacion = e.Identificacion,
                Puesto = e.Puesto,
                Telefono = e.Telefono,
                Correo = e.Correo,
                Direccion = e.Direccion,
                ContactoEmergenciaNombre = e.ContactoEmergenciaNombre,
                ContactoEmergenciaTel = e.ContactoEmergenciaTel,
                AlergiasMedicamentos = e.AlergiasMedicamentos,
                Padecimientos = e.Padecimientos,
                Area = e.Area.Nombre,
                Estado = e.Activo ? "Activo" : "Inactivo"
            }).ToListAsync(ct);

        dto.Clientes = await _db.Clientes.AsNoTracking()
            .OrderBy(c => c.ClienteId)
            .Select(c => new ClienteClienteDto
            {
                Id = c.ClienteId,
                Nombre = c.Nombre,
                Identificacion = c.Identificacion,
                Telefono = c.Telefono,
                Correo = c.Correo,
                Estado = c.Activo ? "Activo" : "Inactivo",
                Direccion = c.Direccion
            }).ToListAsync(ct);

        dto.Proveedores = await _db.Proveedores.AsNoTracking()
            .OrderBy(p => p.ProveedorId)
            .Select(p => new ProveedorClienteDto
            {
                Id = p.ProveedorId,
                Nombre = p.Nombre,
                Identificacion = p.Identificacion,
                Telefono = p.Telefono,
                Correo = p.Correo,
                Estado = p.Activo ? "Activo" : "Inactivo",
                Direccion = p.Direccion
            }).ToListAsync(ct);

        var productos = await _db.Productos.AsNoTracking()
            .Include(p => p.Categoria)
            .Include(p => p.ParametroIva)
            .OrderBy(p => p.ProductoId)
            .ToListAsync(ct);

        foreach (var p in productos)
        {
            var pct = p.ParametroIva.Valor.TrimEnd('%');
            dto.Productos.Add(new ProductoClienteDto
            {
                Id = p.ProductoId,
                CategoriaId = p.CategoriaId,
                ParametroIvaId = p.ParametroIvaId,
                Nombre = p.Nombre,
                Categoria = p.Categoria.Nombre,
                PrecioCompra = p.PrecioCompra,
                PrecioVenta = p.PrecioVenta,
                Iva = pct + "%",
                Stock = p.Stock,
                StockMin = p.StockMinimo,
                Estado = p.Activo ? "Activo" : "Inactivo"
            });
        }

        var ocs = await _db.OrdenesCompra.AsNoTracking()
            .Include(o => o.Proveedor)
            .Include(o => o.Detalles)
            .OrderByDescending(o => o.OrdenCompraId)
            .ToListAsync(ct);

        foreach (var o in ocs)
        {
            dto.Compras.Add(new CompraClienteDto
            {
                OrdenCompraId = o.OrdenCompraId,
                Id = o.NumeroOrden,
                Proveedor = o.Proveedor.Nombre,
                Fecha = o.FechaOrden.ToString("yyyy-MM-dd"),
                Total = o.Total,
                Estado = o.Estado,
                Items = o.Detalles.Count
            });
        }

        var movs = await _db.MovimientosInventario.AsNoTracking()
            .Include(m => m.Producto)
            .OrderByDescending(m => m.FechaMovimiento)
            .Take(100)
            .ToListAsync(ct);

        foreach (var m in movs)
        {
            dto.Movimientos.Add(new MovimientoInvClienteDto
            {
                Id = m.MovimientoId,
                Producto = m.Producto.Nombre,
                Tipo = m.TipoMov.ToLowerInvariant(),
                Cantidad = m.Cantidad,
                StockPost = m.StockPosterior,
                Ref = m.OrigenTipo != null && m.OrigenId != null ? $"{m.OrigenTipo}-{m.OrigenId}" : "—",
                Fecha = m.FechaMovimiento.ToString("yyyy-MM-dd"),
                Motivo = m.Observacion ?? m.OrigenTipo ?? ""
            });
        }

        var peds = await _db.Pedidos.AsNoTracking()
            .Include(p => p.Cliente)
            .Include(p => p.Detalles)
            .OrderByDescending(p => p.PedidoId)
            .ToListAsync(ct);

        foreach (var p in peds)
        {
            dto.Pedidos.Add(new PedidoClienteDto
            {
                PedidoId = p.PedidoId,
                Id = p.NumeroPedido,
                Cliente = p.Cliente.Nombre,
                Fecha = p.FechaPedido.ToString("yyyy-MM-dd"),
                Total = p.Total,
                Estado = p.Estado,
                Items = p.Detalles.Count
            });
        }

        var lics = await _db.Licitaciones.AsNoTracking().OrderByDescending(l => l.LicitacionId).ToListAsync(ct);
        foreach (var l in lics)
        {
            dto.Licitaciones.Add(new LicitacionClienteDto
            {
                LicitacionId = l.LicitacionId,
                Id = l.Codigo,
                Institucion = l.Institucion,
                Contacto = l.ContactoNombre ?? "—",
                Estado = MapLicEstadoUi(l.Estado),
                FechaOferta = l.FechaEnvioOferta?.ToString("yyyy-MM-dd") ?? "",
                Total = l.TotalOferta
            });
        }

        var mfs = await _db.MovimientosFinancieros.AsNoTracking()
            .OrderByDescending(m => m.FechaMovimiento)
            .Take(200)
            .ToListAsync(ct);

        foreach (var m in mfs)
        {
            dto.MovFinancieros.Add(new MovFinClienteDto
            {
                Id = "MF-" + m.MovFinancieroId,
                Fecha = m.FechaMovimiento.ToString("yyyy-MM-dd"),
                Tipo = m.Tipo,
                Categoria = m.Categoria,
                Descripcion = m.Descripcion,
                Monto = m.Monto,
                Ref = m.OrigenTipo != null && m.OrigenId != null ? $"{m.OrigenTipo}-{m.OrigenId}" : ""
            });
        }

        var ccs = await _db.CuentasCobrar.AsNoTracking().Include(c => c.Cliente).ToListAsync(ct);
        foreach (var c in ccs)
        {
            dto.CuentasCobrar.Add(new CuentaCobrarClienteDto
            {
                CuentaCobrarId = c.CuentaCobrarId,
                Id = "CC-" + c.CuentaCobrarId.ToString("D3"),
                Cliente = c.Cliente.Nombre,
                Concepto = c.Concepto,
                Monto = c.Monto,
                Vencimiento = c.Vencimiento.ToString("yyyy-MM-dd"),
                Estado = c.Estado
            });
        }

        var cps = await _db.CuentasPagar.AsNoTracking().Include(c => c.Proveedor).ToListAsync(ct);
        foreach (var c in cps)
        {
            dto.CuentasPagar.Add(new CuentaPagarClienteDto
            {
                CuentaPagarId = c.CuentaPagarId,
                Id = "CP-" + c.CuentaPagarId.ToString("D3"),
                Proveedor = c.Proveedor?.Nombre ?? c.Concepto,
                Concepto = c.Concepto,
                Monto = c.Monto,
                Vencimiento = c.Vencimiento.ToString("yyyy-MM-dd"),
                Estado = c.Estado
            });
        }

        dto.Areas = await _db.Areas.AsNoTracking()
            .Where(a => a.Activo)
            .OrderBy(a => a.Nombre)
            .Select(a => new AreaClienteDto { Id = a.AreaId, Nombre = a.Nombre })
            .ToListAsync(ct);

        dto.Categorias = await _db.Categorias.AsNoTracking()
            .Where(c => c.Activo)
            .OrderBy(c => c.Nombre)
            .Select(c => new CategoriaClienteDto { Id = c.CategoriaId, Nombre = c.Nombre })
            .ToListAsync(ct);

        dto.ParametrosIva = await _db.Parametros.AsNoTracking()
            .Where(p => p.Tipo == "Impuesto" && p.Activo)
            .OrderBy(p => p.ParametroId)
            .Select(p => new ParametroIvaOptionDto
            {
                Id = p.ParametroId,
                Nombre = p.Nombre,
                Valor = p.Valor
            })
            .ToListAsync(ct);

        dto.Modulos = await _db.Modulos.AsNoTracking()
            .Where(m => m.Activo)
            .OrderBy(m => m.Orden)
            .Select(m => new ModuloClienteDto { Id = m.ModuloId, Codigo = m.Codigo, Nombre = m.Nombre })
            .ToListAsync(ct);

        // Si se provee usuario, incluir permisos asociados a su rol
        if (usuarioId > 0)
        {
            var usuario = await _db.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.UsuarioId == usuarioId, ct);
            if (usuario != null)
            {
                dto.UsuarioId = usuario.UsuarioId;
                dto.RolId = usuario.RolId;
                var permisos = await _db.Permisos.AsNoTracking()
                    .Where(p => p.RolId == usuario.RolId)
                    .Select(p => new PermisoRolDto
                    {
                        ModuloId = p.ModuloId,
                        PuedeVer = p.PuedeVer,
                        PuedeCrear = p.PuedeCrear,
                        PuedeEditar = p.PuedeEditar,
                        PuedeElim = p.PuedeElim,
                        PuedeExport = p.PuedeExport
                    }).ToListAsync(ct);

                dto.PermisosRol = permisos;
            }
        }

        dto.HistorialClientes = await BuildHistorialClientesAsync(ct);

        dto.Predicciones = await _db.PrediccionesCompra.AsNoTracking()
            .Include(p => p.Cliente)
            .Include(p => p.Producto)
            .OrderByDescending(p => p.ProbabilidadPct)
            .Take(500)
            .Select(p => new PrediccionBootstrapDto
            {
                ClienteId = p.ClienteId,
                ClienteNombre = p.Cliente.Nombre,
                ProductoId = p.ProductoId,
                ProductoNombre = p.Producto.Nombre,
                VecesPedido = p.VecesPedido,
                ProbabilidadPct = p.ProbabilidadPct,
                NivelConfianza = p.NivelConfianza,
                PromedioUnidades = p.PromedioUnidades
            }).ToListAsync(ct);

        dto.Reportes = await BuildReportesAsync(ct);

        dto.Notificaciones = await BuildNotificacionesAsync(ct);

        return dto;
    }

    private async Task<List<NotificacionClienteDto>> BuildNotificacionesAsync(CancellationToken ct)
    {
        var list = new List<NotificacionClienteDto>();
        var hoy = DateTime.UtcNow.Date;

        var recs = await (
            from r in _db.LicitacionesRecordatorios.AsNoTracking()
            join l in _db.Licitaciones.AsNoTracking() on r.LicitacionId equals l.LicitacionId
            where !r.Enviado
                  && r.FechaRecordatorio.Date >= hoy.AddDays(-7)
                  && r.FechaRecordatorio.Date <= hoy.AddDays(30)
            orderby r.FechaRecordatorio
            select new { r.RecordatorioId, r.Titulo, r.FechaRecordatorio, l.Codigo, l.Institucion, r.LicitacionId }
        ).Take(100).ToListAsync(ct);

        foreach (var x in recs)
        {
            list.Add(new NotificacionClienteDto
            {
                Id = "rec-" + x.RecordatorioId,
                Tipo = "recordatorio",
                Titulo = string.IsNullOrWhiteSpace(x.Titulo) ? "Recordatorio de licitación" : x.Titulo,
                Mensaje = x.Codigo + " · " + x.Institucion + " — " + x.FechaRecordatorio.ToString("dd/MM/yyyy"),
                Vista = "licitaciones",
                Ref = x.Codigo,
                LicitacionId = x.LicitacionId,
                RecordatorioId = x.RecordatorioId
            });
        }

        var licOfertas = await _db.Licitaciones.AsNoTracking()
            .Where(l => l.FechaEnvioOferta != null
                        && l.FechaEnvioOferta.Value.Date >= hoy
                        && l.FechaEnvioOferta.Value.Date < hoy.AddDays(8)
                        && l.Estado != "Adjudicado"
                        && l.Estado != "NoAdjudicado")
            .OrderBy(l => l.FechaEnvioOferta)
            .Take(50)
            .Select(l => new { l.LicitacionId, l.Codigo, l.Institucion, l.FechaEnvioOferta })
            .ToListAsync(ct);

        foreach (var l in licOfertas)
        {
            list.Add(new NotificacionClienteDto
            {
                Id = "lic-oferta-" + l.LicitacionId,
                Tipo = "licitacion_fecha",
                Titulo = "Envío de oferta próximo",
                Mensaje = l.Codigo + " · " + l.Institucion + " — " + (l.FechaEnvioOferta!.Value.ToString("dd/MM/yyyy")),
                Vista = "licitaciones",
                Ref = l.Codigo
            });
        }

        var cc = await _db.CuentasCobrar.AsNoTracking()
            .Include(c => c.Cliente)
            .Where(c => c.Estado == "Pendiente" || c.Estado == "Vencido")
            .Where(c => c.Vencimiento.Date <= hoy.AddDays(7))
            .OrderBy(c => c.Vencimiento)
            .Take(40)
            .ToListAsync(ct);

        foreach (var c in cc)
        {
            list.Add(new NotificacionClienteDto
            {
                Id = "cc-" + c.CuentaCobrarId,
                Tipo = "finanza_cobrar",
                Titulo = c.Estado == "Vencido" ? "Cuenta por cobrar vencida" : "Cuenta por cobrar por vencer",
                Mensaje = c.Cliente.Nombre + " — " + c.Concepto + " — " + c.Monto.ToString("N2") + " CRC · vence " + c.Vencimiento.ToString("dd/MM/yyyy"),
                Vista = "finanzas",
                Ref = "CC-" + c.CuentaCobrarId.ToString("D3")
            });
        }

        var cp = await _db.CuentasPagar.AsNoTracking()
            .Include(c => c.Proveedor)
            .Where(c => c.Estado == "Pendiente" || c.Estado == "Vencido")
            .Where(c => c.Vencimiento.Date <= hoy.AddDays(7))
            .OrderBy(c => c.Vencimiento)
            .Take(40)
            .ToListAsync(ct);

        foreach (var c in cp)
        {
            var nom = c.Proveedor?.Nombre ?? c.Concepto;
            list.Add(new NotificacionClienteDto
            {
                Id = "cp-" + c.CuentaPagarId,
                Tipo = "finanza_pagar",
                Titulo = c.Estado == "Vencido" ? "Cuenta por pagar vencida" : "Cuenta por pagar por vencer",
                Mensaje = nom + " — " + c.Concepto + " — " + c.Monto.ToString("N2") + " CRC · vence " + c.Vencimiento.ToString("dd/MM/yyyy"),
                Vista = "finanzas",
                Ref = "CP-" + c.CuentaPagarId.ToString("D3")
            });
        }

        var stockBajo = await _db.Productos.AsNoTracking()
            .CountAsync(p => p.Activo && p.Stock <= p.StockMinimo, ct);
        if (stockBajo > 0)
        {
            list.Add(new NotificacionClienteDto
            {
                Id = "inv-stock-bajo",
                Tipo = "inventario",
                Titulo = "Stock bajo o crítico",
                Mensaje = stockBajo + " producto(s) activo(s) con stock en o por debajo del mínimo.",
                Vista = "inventario",
                Ref = null
            });
        }

        return list;
    }

    private async Task<Dictionary<string, List<HistorialMesDto>>> BuildHistorialClientesAsync(CancellationToken ct)
    {
        var desde = DateTime.UtcNow.AddMonths(-12).Date;
        var pedidos = await _db.Pedidos.AsNoTracking()
            .Where(p => p.FechaPedido >= desde && p.Estado != "Cancelado")
            .Include(p => p.Cliente)
            .Include(p => p.Detalles)
            .ThenInclude(d => d.Producto)
            .ToListAsync(ct);

        var dict = new Dictionary<string, List<HistorialMesDto>>(StringComparer.OrdinalIgnoreCase);
        foreach (var p in pedidos)
        {
            var nombre = p.Cliente.Nombre;
            if (!dict.ContainsKey(nombre))
                dict[nombre] = new List<HistorialMesDto>();

            var mesKey = p.FechaPedido.ToString("yyyy-MM");
            var prodNombres = p.Detalles.Select(d => d.Producto.Nombre).Distinct().ToList();
            var existente = dict[nombre].FirstOrDefault(h => h.Mes == mesKey);
            if (existente == null)
            {
                dict[nombre].Add(new HistorialMesDto
                {
                    Mes = mesKey,
                    Productos = prodNombres,
                    Total = p.Total
                });
            }
            else
            {
                foreach (var pr in prodNombres)
                    if (!existente.Productos.Contains(pr)) existente.Productos.Add(pr);
                existente.Total += p.Total;
            }
        }

        foreach (var kv in dict)
            kv.Value.Sort((a, b) => string.Compare(a.Mes, b.Mes, StringComparison.Ordinal));

        return dict;
    }

    private async Task<ReportesBootstrapDto> BuildReportesAsync(CancellationToken ct)
    {
        var desde = DateTime.UtcNow.AddMonths(-12);
        var r = new ReportesBootstrapDto();

        r.IngresosPeriodo = await _db.MovimientosFinancieros.AsNoTracking()
            .Where(m => m.Tipo == "Ingreso" && m.FechaMovimiento >= desde)
            .SumAsync(m => m.Monto, ct);

        r.EgresosPeriodo = await _db.MovimientosFinancieros.AsNoTracking()
            .Where(m => m.Tipo == "Egreso" && m.FechaMovimiento >= desde)
            .SumAsync(m => m.Monto, ct);

        r.PedidosActivos = await _db.Pedidos.AsNoTracking()
            .CountAsync(p => p.Estado != "Cancelado", ct);

        r.ProductosStockBajo = await _db.Productos.AsNoTracking()
            .CountAsync(p => p.Activo && p.Stock <= p.StockMinimo, ct);

        r.LicitacionesAdjudicadas = await _db.Licitaciones.AsNoTracking()
            .CountAsync(l => l.Estado == "Adjudicado", ct);

        r.ValorInventario = await _db.Productos.AsNoTracking()
            .Where(p => p.Activo)
            .SumAsync(p => p.PrecioVenta * p.Stock, ct);

        var ventasMes = await _db.Pedidos.AsNoTracking()
            .Where(p => p.Estado != "Cancelado" && p.FechaPedido >= desde.Date)
            .GroupBy(p => new { p.FechaPedido.Year, p.FechaPedido.Month })
            .Select(g => new { g.Key.Year, g.Key.Month, Total = g.Sum(x => x.Total) })
            .OrderBy(x => x.Year).ThenBy(x => x.Month)
            .ToListAsync(ct);

        var cult = new System.Globalization.CultureInfo("es-CR");
        foreach (var v in ventasMes)
        {
            var dt = new DateTime(v.Year, v.Month, 1);
            r.VentasPorMes.Add(new VentaMesReporteDto
            {
                Mes = $"{v.Year}-{v.Month:D2}",
                Etiqueta = dt.ToString("MMMM yyyy", cult),
                Total = v.Total
            });
        }

        r.VentasPorCliente = await _db.Pedidos.AsNoTracking()
            .Where(p => p.Estado != "Cancelado" && p.FechaPedido >= desde.Date)
            .Include(p => p.Cliente)
            .GroupBy(p => p.Cliente.Nombre)
            .Select(g => new VentaClienteReporteDto
            {
                Cliente = g.Key,
                Pedidos = g.Count(),
                Total = g.Sum(x => x.Total)
            })
            .OrderByDescending(x => x.Total)
            .Take(15)
            .ToListAsync(ct);

        var prodVend = await (
            from d in _db.PedidosDetalle.AsNoTracking()
            join p in _db.Pedidos.AsNoTracking() on d.PedidoId equals p.PedidoId
            join pr in _db.Productos.AsNoTracking() on d.ProductoId equals pr.ProductoId
            join c in _db.Categorias.AsNoTracking() on pr.CategoriaId equals c.CategoriaId
            where p.Estado != "Cancelado" && p.FechaPedido >= desde.Date
            group d by new { d.ProductoId, ProductoNombre = pr.Nombre, CatNombre = c.Nombre } into g
            select new ProductoVendidoReporteDto
            {
                Producto = g.Key.ProductoNombre,
                Categoria = g.Key.CatNombre,
                Unidades = g.Sum(x => x.Cantidad),
                Ingresos = g.Sum(x => x.Total)
            }).ToListAsync(ct);
        r.ProductosMasVendidos = prodVend.OrderByDescending(x => x.Ingresos).Take(15).ToList();

        return r;
    }

    private static string MapLicEstadoUi(string db)
    {
        return db switch
        {
            "Analisis" => "analisis",
            "Preparacion" => "preparacion",
            "Enviada" => "enviada",
            "Adjudicado" => "adjudicado",
            "NoAdjudicado" => "no-adj",
            _ => "analisis"
        };
    }

}
