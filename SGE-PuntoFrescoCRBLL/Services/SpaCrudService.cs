using Microsoft.EntityFrameworkCore;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRDAL.Data;
using SGE_PuntoFrescoCRDAL.Entidades;

namespace SGE_PuntoFrescoCRBLL.Services;

public class SpaCrudService
{
    private readonly SgePuntoFrescoDbContext _db;

    public SpaCrudService(SgePuntoFrescoDbContext db) => _db = db;

    private static int OpUser(int usuarioId) => usuarioId <= 0 ? 1 : usuarioId;

    public async Task<bool> UpdateParametroAsync(int id, ParametroMutateDto dto, CancellationToken ct = default)
    {
        var p = await _db.Parametros.FirstOrDefaultAsync(x => x.ParametroId == id, ct);
        if (p == null) return false;
        p.Valor = dto.Valor.Trim();
        p.Activo = dto.Activo;
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<int?> CreateParametroAsync(ParametroCreateDto dto, CancellationToken ct = default)
    {
        var tipo = dto.Tipo.Trim();
        var nombre = dto.Nombre.Trim();
        if (tipo.Length == 0 || nombre.Length == 0) return null;
        if (await _db.Parametros.AnyAsync(p => p.Tipo == tipo && p.Nombre == nombre, ct)) return null;

        var p = new Parametro
        {
            Tipo = tipo,
            Nombre = nombre,
            Valor = dto.Valor.Trim(),
            Descripcion = string.IsNullOrWhiteSpace(dto.Descripcion) ? null : dto.Descripcion.Trim(),
            Activo = dto.Activo,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Parametros.Add(p);
        await _db.SaveChangesAsync(ct);
        return p.ParametroId;
    }

    public async Task<int?> CreateRolAsync(RolCreateDto dto, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre)) return null;
        var r = new Rol
        {
            Nombre = dto.Nombre.Trim(),
            Descripcion = dto.Descripcion?.Trim(),
            Activo = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Roles.Add(r);
        await _db.SaveChangesAsync(ct);

        var modulos = await _db.Modulos.Where(m => m.Activo).ToListAsync(ct);
        foreach (var m in modulos)
        {
            _db.Permisos.Add(new Permiso
            {
                RolId = r.RolId,
                ModuloId = m.ModuloId,
                PuedeVer = false,
                PuedeCrear = false,
                PuedeEditar = false,
                PuedeElim = false,
                PuedeExport = false
            });
        }
        await _db.SaveChangesAsync(ct);
        return r.RolId;
    }

    private static string PuestoEmpleadoDesdeUsuario(string? puestoUsuario) =>
        !string.IsNullOrWhiteSpace(puestoUsuario) ? puestoUsuario.Trim() : "Sin definir";

    private async Task UpsertEmpleadoVinculadoAsync(Usuario u, int areaId, string? contactoEmergenciaNombre,
        string? contactoEmergenciaTel, string? alergiasMedicamentos, CancellationToken ct)
    {
        var emp = await _db.Empleados.FirstOrDefaultAsync(e => e.UsuarioId == u.UsuarioId, ct)
                  ?? await _db.Empleados.FirstOrDefaultAsync(e => e.Identificacion == u.Identificacion, ct);

        if (emp == null)
        {
            _db.Empleados.Add(new Empleado
            {
                AreaId = areaId,
                UsuarioId = u.UsuarioId,
                NombreCompleto = u.NombreCompleto,
                Identificacion = u.Identificacion,
                Puesto = PuestoEmpleadoDesdeUsuario(u.Puesto),
                Telefono = u.Telefono,
                Correo = u.Correo,
                Direccion = u.Direccion,
                ContactoEmergenciaNombre = contactoEmergenciaNombre,
                ContactoEmergenciaTel = contactoEmergenciaTel,
                AlergiasMedicamentos = alergiasMedicamentos,
                Activo = u.Activo,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
            return;
        }

        emp.UsuarioId = u.UsuarioId;
        emp.AreaId = areaId;
        emp.NombreCompleto = u.NombreCompleto;
        emp.Identificacion = u.Identificacion;
        emp.Puesto = PuestoEmpleadoDesdeUsuario(u.Puesto);
        emp.Telefono = u.Telefono;
        emp.Correo = u.Correo;
        emp.Direccion = u.Direccion;
        if (contactoEmergenciaNombre != null) emp.ContactoEmergenciaNombre = contactoEmergenciaNombre;
        if (contactoEmergenciaTel != null) emp.ContactoEmergenciaTel = contactoEmergenciaTel;
        if (alergiasMedicamentos != null) emp.AlergiasMedicamentos = alergiasMedicamentos;
        emp.Activo = u.Activo;
        emp.UpdatedAt = DateTime.UtcNow;
    }

    public async Task<bool> UpdateRolAsync(int id, RolUpdateDto dto, CancellationToken ct = default)
    {
        var r = await _db.Roles.FirstOrDefaultAsync(x => x.RolId == id, ct);
        if (r == null) return false;
        r.Nombre = dto.Nombre.Trim();
        r.Descripcion = dto.Descripcion?.Trim();
        r.Activo = dto.Activo;
        r.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> UpdatePermisosRolAsync(int rolId, List<PermisoModuloDto> filas, CancellationToken ct = default)
    {
        var rol = await _db.Roles.FirstOrDefaultAsync(r => r.RolId == rolId, ct);
        if (rol == null) return false;

        foreach (var f in filas)
        {
            var p = await _db.Permisos.FirstOrDefaultAsync(x => x.RolId == rolId && x.ModuloId == f.ModuloId, ct);
            if (p == null) continue;
            p.PuedeVer = f.PuedeVer;
            p.PuedeCrear = f.PuedeCrear;
            p.PuedeEditar = f.PuedeEditar;
            p.PuedeElim = f.PuedeElim;
            p.PuedeExport = f.PuedeExport;
        }
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<List<PermisoRolDto>> GetPermisosRolAsync(int rolId, CancellationToken ct = default)
    {
        return await _db.Permisos.AsNoTracking()
            .Where(p => p.RolId == rolId)
            .OrderBy(p => p.ModuloId)
            .Select(p => new PermisoRolDto
            {
                ModuloId = p.ModuloId,
                PuedeVer = p.PuedeVer,
                PuedeCrear = p.PuedeCrear,
                PuedeEditar = p.PuedeEditar,
                PuedeElim = p.PuedeElim,
                PuedeExport = p.PuedeExport
            }).ToListAsync(ct);
    }

    public async Task<int?> CreateUsuarioAsync(UsuarioCreateDto dto, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Password) || string.IsNullOrWhiteSpace(dto.NombreUsuario)) return null;
        var nu = dto.NombreUsuario.Trim();
        var ident = dto.Identificacion.Trim();
        var mail = dto.Correo.Trim();
        if (await _db.Usuarios.AnyAsync(u => u.NombreUsuario == nu || u.Identificacion == ident || u.Correo == mail, ct))
            return null;

        var hash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        var u = new Usuario
        {
            RolId = dto.RolId,
            NombreCompleto = dto.NombreCompleto.Trim(),
            Identificacion = ident,
            NombreUsuario = nu,
            Correo = mail,
            PasswordHash = hash,
            PasswordSalt = hash,
            Puesto = dto.Puesto,
            Telefono = dto.Telefono,
            Direccion = dto.Direccion,
            Activo = dto.Activo,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Usuarios.Add(u);
        await _db.SaveChangesAsync(ct);

        if (dto.AreaId is > 0)
        {
            await UpsertEmpleadoVinculadoAsync(u, dto.AreaId.Value, dto.ContactoEmergenciaNombre,
                dto.ContactoEmergenciaTel, dto.AlergiasMedicamentos, ct);
            await _db.SaveChangesAsync(ct);
        }

        return u.UsuarioId;
    }

    public async Task<bool> UpdateUsuarioAsync(int id, UsuarioUpdateDto dto, CancellationToken ct = default)
    {
        var u = await _db.Usuarios.FirstOrDefaultAsync(x => x.UsuarioId == id, ct);
        if (u == null) return false;
        var nu = dto.NombreUsuario.Trim();
        var ident = dto.Identificacion.Trim();
        var mail = dto.Correo.Trim();
        if (await _db.Usuarios.AnyAsync(
                x => x.UsuarioId != id && (x.NombreUsuario == nu || x.Identificacion == ident || x.Correo == mail), ct))
            return false;

        u.RolId = dto.RolId;
        u.NombreCompleto = dto.NombreCompleto.Trim();
        u.Identificacion = ident;
        u.NombreUsuario = nu;
        u.Correo = mail;
        u.Puesto = dto.Puesto;
        u.Telefono = dto.Telefono;
        u.Direccion = dto.Direccion;
        u.Activo = dto.Activo;
        u.UpdatedAt = DateTime.UtcNow;
        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            var hash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            u.PasswordHash = hash;
            u.PasswordSalt = hash;
        }
        await _db.SaveChangesAsync(ct);

        if (dto.AreaId is > 0)
        {
            await UpsertEmpleadoVinculadoAsync(u, dto.AreaId.Value, dto.ContactoEmergenciaNombre,
                dto.ContactoEmergenciaTel, dto.AlergiasMedicamentos, ct);
            await _db.SaveChangesAsync(ct);
        }

        return true;
    }

    public async Task<int?> CreateEmpleadoAsync(EmpleadoCreateDto dto, CancellationToken ct = default)
    {
        var e = new Empleado
        {
            AreaId = dto.AreaId,
            NombreCompleto = dto.NombreCompleto.Trim(),
            Identificacion = dto.Identificacion.Trim(),
            Puesto = dto.Puesto.Trim(),
            Telefono = dto.Telefono,
            Correo = dto.Correo,
            Direccion = dto.Direccion,
            ContactoEmergenciaNombre = dto.ContactoEmergenciaNombre,
            ContactoEmergenciaTel = dto.ContactoEmergenciaTel,
            AlergiasMedicamentos = dto.AlergiasMedicamentos,
            Padecimientos = dto.Padecimientos,
            Activo = dto.Activo,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Empleados.Add(e);
        await _db.SaveChangesAsync(ct);
        return e.EmpleadoId;
    }

    public async Task<bool> UpdateEmpleadoAsync(int id, EmpleadoUpdateDto dto, CancellationToken ct = default)
    {
        var e = await _db.Empleados.FirstOrDefaultAsync(x => x.EmpleadoId == id, ct);
        if (e == null) return false;
        e.AreaId = dto.AreaId;
        e.NombreCompleto = dto.NombreCompleto.Trim();
        e.Identificacion = dto.Identificacion.Trim();
        e.Puesto = dto.Puesto.Trim();
        e.Telefono = dto.Telefono;
        e.Correo = dto.Correo;
        e.Direccion = dto.Direccion;
        e.ContactoEmergenciaNombre = dto.ContactoEmergenciaNombre;
        e.ContactoEmergenciaTel = dto.ContactoEmergenciaTel;
        e.AlergiasMedicamentos = dto.AlergiasMedicamentos;
        e.Padecimientos = dto.Padecimientos;
        e.Activo = dto.Activo;
        e.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> UpdateEmpleadoSelfAsync(int empleadoId, EmpleadoSelfUpdateDto dto, CancellationToken ct = default)
    {
        var e = await _db.Empleados.FirstOrDefaultAsync(x => x.EmpleadoId == empleadoId, ct);
        if (e == null) return false;
        e.Telefono = dto.Telefono;
        e.Correo = dto.Correo;
        e.ContactoEmergenciaNombre = dto.ContactoEmergenciaNombre;
        e.ContactoEmergenciaTel = dto.ContactoEmergenciaTel;
        e.AlergiasMedicamentos = dto.AlergiasMedicamentos;
        e.Padecimientos = dto.Padecimientos;
        e.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<int?> CreateClienteAsync(ClienteCreateDto dto, CancellationToken ct = default)
    {
        var c = new Cliente
        {
            Nombre = dto.Nombre.Trim(),
            Identificacion = dto.Identificacion.Trim(),
            Telefono = dto.Telefono,
            Correo = dto.Correo,
            Direccion = dto.Direccion,
            Activo = dto.Activo,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Clientes.Add(c);
        await _db.SaveChangesAsync(ct);
        return c.ClienteId;
    }

    public async Task<bool> UpdateClienteAsync(int id, ClienteUpdateDto dto, CancellationToken ct = default)
    {
        var c = await _db.Clientes.FirstOrDefaultAsync(x => x.ClienteId == id, ct);
        if (c == null) return false;
        c.Nombre = dto.Nombre.Trim();
        c.Identificacion = dto.Identificacion.Trim();
        c.Telefono = dto.Telefono;
        c.Correo = dto.Correo;
        c.Direccion = dto.Direccion;
        c.Activo = dto.Activo;
        c.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<int?> CreateProveedorAsync(ProveedorCreateDto dto, CancellationToken ct = default)
    {
        var ident = dto.Identificacion.Trim();
        if (await _db.Proveedores.AnyAsync(x => x.Identificacion == ident, ct))
            throw new InvalidOperationException("Ya existe un proveedor con esa identificación.");

        var p = new Proveedor
        {
            Nombre = dto.Nombre.Trim(),
            Identificacion = dto.Identificacion.Trim(),
            Telefono = dto.Telefono,
            Correo = dto.Correo,
            Direccion = dto.Direccion,
            Activo = dto.Activo,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Proveedores.Add(p);
        await _db.SaveChangesAsync(ct);
        return p.ProveedorId;
    }

    public async Task<bool> UpdateProveedorAsync(int id, ProveedorUpdateDto dto, CancellationToken ct = default)
    {
        var p = await _db.Proveedores.FirstOrDefaultAsync(x => x.ProveedorId == id, ct);
        if (p == null) return false;
        var ident = dto.Identificacion.Trim();
        if (await _db.Proveedores.AnyAsync(x => x.Identificacion == ident && x.ProveedorId != id, ct))
            throw new InvalidOperationException("Ya existe otro proveedor con esa identificación.");

        p.Nombre = dto.Nombre.Trim();
        p.Identificacion = dto.Identificacion.Trim();
        p.Telefono = dto.Telefono;
        p.Correo = dto.Correo;
        p.Direccion = dto.Direccion;
        p.Activo = dto.Activo;
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<int?> CreateProductoAsync(ProductoCreateDto dto, CancellationToken ct = default)
    {
        var p = new Producto
        {
            CategoriaId = dto.CategoriaId,
            ParametroIvaId = dto.ParametroIvaId,
            Nombre = dto.Nombre.Trim(),
            Descripcion = dto.Descripcion,
            PrecioCompra = dto.PrecioCompra,
            PrecioVenta = dto.PrecioVenta,
            Stock = dto.Stock,
            StockMinimo = dto.StockMinimo,
            Activo = dto.Activo,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Productos.Add(p);
        await _db.SaveChangesAsync(ct);
        return p.ProductoId;
    }

    public async Task<bool> UpdateProductoAsync(int id, ProductoUpdateDto dto, CancellationToken ct = default)
    {
        var p = await _db.Productos.FirstOrDefaultAsync(x => x.ProductoId == id, ct);
        if (p == null) return false;
        p.CategoriaId = dto.CategoriaId;
        p.ParametroIvaId = dto.ParametroIvaId;
        p.Nombre = dto.Nombre.Trim();
        p.Descripcion = dto.Descripcion;
        p.PrecioCompra = dto.PrecioCompra;
        p.PrecioVenta = dto.PrecioVenta;
        p.Stock = dto.Stock;
        p.StockMinimo = dto.StockMinimo;
        p.Activo = dto.Activo;
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    private static void CalcularLineaCompra(OrdenCompraDetalle d)
    {
        d.Subtotal = Math.Round(d.Cantidad * d.PrecioUnitario, 2);
        d.MontoIVA = Math.Round(d.Subtotal * (d.PorcentajeIVA / 100m), 2);
        d.Total = d.Subtotal + d.MontoIVA;
    }

    private static void CalcularLineaPedido(PedidoDetalle d)
    {
        d.Subtotal = Math.Round(d.Cantidad * d.PrecioUnitario, 2);
        d.MontoIVA = Math.Round(d.Subtotal * (d.PorcentajeIVA / 100m), 2);
        d.Total = d.Subtotal + d.MontoIVA;
    }

    private static void CalcularLineaLic(LicitacionDetalle d)
    {
        d.Subtotal = Math.Round(d.Cantidad * d.PrecioUnitario, 2);
        d.MontoIVA = Math.Round(d.Subtotal * (d.PorcentajeIVA / 100m), 2);
        d.Total = d.Subtotal + d.MontoIVA;
    }

    public async Task<int?> CreateOrdenCompraAsync(OrdenCompraCreateDto dto, int usuarioId, CancellationToken ct = default)
    {
        if (dto.Lineas.Count == 0) return null;
        var uid = OpUser(usuarioId);
        var anio = DateTime.UtcNow.Year;
        var count = await _db.OrdenesCompra.CountAsync(ct) + 1;
        var oc = new OrdenCompra
        {
            ProveedorId = dto.ProveedorId,
            UsuarioId = uid,
            NumeroOrden = $"OC-{anio}-{count:D4}",
            FechaOrden = dto.FechaOrden?.Date ?? DateTime.UtcNow.Date,
            Estado = "Pendiente",
            Subtotal = 0,
            MontoIVA = 0,
            Total = 0,
            Observaciones = dto.Observaciones,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.OrdenesCompra.Add(oc);
        await _db.SaveChangesAsync(ct);

        decimal st = 0, iva = 0, tot = 0;
        foreach (var line in dto.Lineas)
        {
            var det = new OrdenCompraDetalle
            {
                OrdenCompraId = oc.OrdenCompraId,
                ProductoId = line.ProductoId,
                Cantidad = line.Cantidad,
                PrecioUnitario = line.PrecioUnitario,
                PorcentajeIVA = line.PorcentajeIVA
            };
            CalcularLineaCompra(det);
            st += det.Subtotal;
            iva += det.MontoIVA;
            tot += det.Total;
            _db.OrdenesCompraDetalle.Add(det);
        }
        oc.Subtotal = Math.Round(st, 2);
        oc.MontoIVA = Math.Round(iva, 2);
        oc.Total = Math.Round(tot, 2);
        await _db.SaveChangesAsync(ct);
        return oc.OrdenCompraId;
    }

    public async Task<OrdenCompraDetalleDto?> GetOrdenCompraDetalleAsync(int ordenCompraId, CancellationToken ct = default)
    {
        var oc = await _db.OrdenesCompra.AsNoTracking()
            .Include(o => o.Proveedor)
            .Include(o => o.Detalles)
            .ThenInclude(d => d.Producto)
            .FirstOrDefaultAsync(o => o.OrdenCompraId == ordenCompraId, ct);
        if (oc == null) return null;
        return new OrdenCompraDetalleDto
        {
            OrdenCompraId = oc.OrdenCompraId,
            NumeroOrden = oc.NumeroOrden,
            ProveedorId = oc.ProveedorId,
            Proveedor = oc.Proveedor.Nombre,
            FechaOrden = oc.FechaOrden,
            Estado = oc.Estado,
            Observaciones = oc.Observaciones,
            Subtotal = oc.Subtotal,
            MontoIVA = oc.MontoIVA,
            Total = oc.Total,
            Lineas = oc.Detalles
                .OrderBy(d => d.DetalleId)
                .Select(d => new OrdenCompraDetalleLineaDto
                {
                    ProductoId = d.ProductoId,
                    Producto = d.Producto.Nombre,
                    Cantidad = d.Cantidad,
                    PrecioUnitario = d.PrecioUnitario,
                    PorcentajeIVA = d.PorcentajeIVA,
                    Subtotal = d.Subtotal,
                    MontoIVA = d.MontoIVA,
                    Total = d.Total
                }).ToList()
        };
    }

    public async Task<bool> UpdateOrdenCompraPendienteAsync(int ordenCompraId, OrdenCompraCreateDto dto, CancellationToken ct = default)
    {
        if (dto.Lineas.Count == 0) return false;
        var oc = await _db.OrdenesCompra
            .Include(o => o.Detalles)
            .FirstOrDefaultAsync(o => o.OrdenCompraId == ordenCompraId, ct);
        if (oc == null || oc.Estado != "Pendiente") return false;

        oc.ProveedorId = dto.ProveedorId;
        oc.FechaOrden = dto.FechaOrden?.Date ?? oc.FechaOrden.Date;
        oc.Observaciones = dto.Observaciones;
        oc.UpdatedAt = DateTime.UtcNow;
        _db.OrdenesCompraDetalle.RemoveRange(oc.Detalles);

        decimal st = 0, iva = 0, tot = 0;
        foreach (var line in dto.Lineas)
        {
            var det = new OrdenCompraDetalle
            {
                OrdenCompraId = oc.OrdenCompraId,
                ProductoId = line.ProductoId,
                Cantidad = line.Cantidad,
                PrecioUnitario = line.PrecioUnitario,
                PorcentajeIVA = line.PorcentajeIVA
            };
            CalcularLineaCompra(det);
            st += det.Subtotal;
            iva += det.MontoIVA;
            tot += det.Total;
            _db.OrdenesCompraDetalle.Add(det);
        }
        oc.Subtotal = Math.Round(st, 2);
        oc.MontoIVA = Math.Round(iva, 2);
        oc.Total = Math.Round(tot, 2);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> CancelarOrdenCompraAsync(int ordenCompraId, CancellationToken ct = default)
    {
        var o = await _db.OrdenesCompra.FirstOrDefaultAsync(x => x.OrdenCompraId == ordenCompraId, ct);
        if (o == null) return false;
        if (o.Estado is "Confirmada" or "Cancelada") return false;
        o.Estado = "Cancelada";
        o.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> ConfirmarOrdenCompraAsync(int ordenCompraId, int usuarioId, CancellationToken ct = default)
    {
        var uid = OpUser(usuarioId);
        await _db.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC com.sp_ConfirmarOrdenCompra {ordenCompraId}, {uid}", cancellationToken: ct);
        return true;
    }

    public async Task<int?> CreatePedidoAsync(PedidoCreateDto dto, int usuarioId, CancellationToken ct = default)
    {
        if (dto.Lineas.Count == 0) return null;
        var uid = OpUser(usuarioId);
        var anio = DateTime.UtcNow.Year;
        var count = await _db.Pedidos.CountAsync(ct) + 1;
        var ped = new Pedido
        {
            ClienteId = dto.ClienteId,
            UsuarioId = uid,
            NumeroPedido = $"PED-{anio}-{count:D4}",
            FechaPedido = dto.FechaPedido?.Date ?? DateTime.UtcNow.Date,
            Estado = "Borrador",
            Subtotal = 0,
            MontoIVA = 0,
            Total = 0,
            DireccionEntrega = dto.DireccionEntrega,
            Observaciones = dto.Observaciones,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Pedidos.Add(ped);
        await _db.SaveChangesAsync(ct);

        decimal st = 0, iva = 0, tot = 0;
        foreach (var line in dto.Lineas)
        {
            var det = new PedidoDetalle
            {
                PedidoId = ped.PedidoId,
                ProductoId = line.ProductoId,
                Cantidad = line.Cantidad,
                PrecioUnitario = line.PrecioUnitario,
                PorcentajeIVA = line.PorcentajeIVA
            };
            CalcularLineaPedido(det);
            st += det.Subtotal;
            iva += det.MontoIVA;
            tot += det.Total;
            _db.PedidosDetalle.Add(det);
        }
        ped.Subtotal = Math.Round(st, 2);
        ped.MontoIVA = Math.Round(iva, 2);
        ped.Total = Math.Round(tot, 2);
        await _db.SaveChangesAsync(ct);
        return ped.PedidoId;
    }

    public async Task<bool> UpdatePedidoBorradorAsync(int pedidoId, PedidoUpdateDto dto, CancellationToken ct = default)
    {
        var ped = await _db.Pedidos.Include(p => p.Detalles).FirstOrDefaultAsync(p => p.PedidoId == pedidoId, ct);
        if (ped == null || ped.Estado != "Borrador") return false;
        ped.ClienteId = dto.ClienteId;
        ped.DireccionEntrega = dto.DireccionEntrega;
        ped.Observaciones = dto.Observaciones;
        ped.UpdatedAt = DateTime.UtcNow;
        _db.PedidosDetalle.RemoveRange(ped.Detalles);
        decimal st = 0, iva = 0, tot = 0;
        foreach (var line in dto.Lineas)
        {
            var det = new PedidoDetalle
            {
                PedidoId = pedidoId,
                ProductoId = line.ProductoId,
                Cantidad = line.Cantidad,
                PrecioUnitario = line.PrecioUnitario,
                PorcentajeIVA = line.PorcentajeIVA
            };
            CalcularLineaPedido(det);
            st += det.Subtotal;
            iva += det.MontoIVA;
            tot += det.Total;
            _db.PedidosDetalle.Add(det);
        }
        ped.Subtotal = Math.Round(st, 2);
        ped.MontoIVA = Math.Round(iva, 2);
        ped.Total = Math.Round(tot, 2);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<PedidoDetalleDto?> GetPedidoDetalleAsync(int pedidoId, CancellationToken ct = default)
    {
        var ped = await _db.Pedidos.AsNoTracking()
            .Include(p => p.Cliente)
            .Include(p => p.Detalles)
            .ThenInclude(d => d.Producto)
            .FirstOrDefaultAsync(p => p.PedidoId == pedidoId, ct);
        if (ped == null) return null;
        return new PedidoDetalleDto
        {
            PedidoId = ped.PedidoId,
            NumeroPedido = ped.NumeroPedido,
            ClienteId = ped.ClienteId,
            Cliente = ped.Cliente.Nombre,
            FechaPedido = ped.FechaPedido,
            Estado = ped.Estado,
            DireccionEntrega = ped.DireccionEntrega,
            Subtotal = ped.Subtotal,
            MontoIVA = ped.MontoIVA,
            Total = ped.Total,
            Lineas = ped.Detalles
                .OrderBy(d => d.DetalleId)
                .Select(d => new PedidoDetalleLineaDto
                {
                    ProductoId = d.ProductoId,
                    Producto = d.Producto.Nombre,
                    Cantidad = d.Cantidad,
                    PrecioUnitario = d.PrecioUnitario,
                    PorcentajeIVA = d.PorcentajeIVA,
                    Subtotal = d.Subtotal,
                    MontoIVA = d.MontoIVA,
                    Total = d.Total
                }).ToList()
        };
    }

    public async Task<bool> ConfirmarPedidoAsync(int pedidoId, int usuarioId, CancellationToken ct = default)
    {
        var uid = OpUser(usuarioId);
        await _db.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC ped.sp_ConfirmarPedido {pedidoId}, {uid}", cancellationToken: ct);
        return true;
    }

    public async Task<bool> EntregarPedidoAsync(int pedidoId, int usuarioId, CancellationToken ct = default)
    {
        var uid = OpUser(usuarioId);
        await _db.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC ped.sp_EntregarPedido {pedidoId}, {uid}", cancellationToken: ct);
        return true;
    }

    public async Task<bool> CancelarPedidoAsync(int pedidoId, int usuarioId, string? motivo, CancellationToken ct = default)
    {
        var uid = OpUser(usuarioId);
        var m = motivo ?? "";
        await _db.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC ped.sp_CancelarPedido {pedidoId}, {uid}, {m}", cancellationToken: ct);
        return true;
    }

    public async Task<int?> CreateLicitacionAsync(LicitacionCreateDto dto, int usuarioId, CancellationToken ct = default)
    {
        var uid = OpUser(usuarioId);
        var anio = DateTime.UtcNow.Year;
        var count = await _db.Licitaciones.CountAsync(ct) + 1;
        var lic = new Licitacion
        {
            UsuarioId = uid,
            Codigo = $"LIC-{anio}-{count:D4}",
            Institucion = dto.Institucion.Trim(),
            ContactoNombre = dto.ContactoNombre,
            ContactoTelefono = dto.ContactoTelefono,
            ContactoCorreo = dto.ContactoCorreo,
            Descripcion = dto.Descripcion.Trim(),
            Estado = dto.Estado,
            FechaLimiteConsultas = dto.FechaLimiteConsultas?.Date,
            FechaEnvioOferta = dto.FechaEnvioOferta?.Date,
            FechaEntrega = dto.FechaEntrega?.Date,
            Observaciones = dto.Observaciones,
            Subtotal = 0,
            MontoIVA = 0,
            TotalOferta = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Licitaciones.Add(lic);
        await _db.SaveChangesAsync(ct);

        decimal st = 0, iva = 0, tot = 0;
        foreach (var line in dto.Lineas)
        {
            var det = new LicitacionDetalle
            {
                LicitacionId = lic.LicitacionId,
                ProductoId = line.ProductoId,
                Descripcion = line.Descripcion.Trim(),
                Cantidad = line.Cantidad,
                PrecioUnitario = line.PrecioUnitario,
                PorcentajeIVA = line.PorcentajeIVA
            };
            CalcularLineaLic(det);
            st += det.Subtotal;
            iva += det.MontoIVA;
            tot += det.Total;
            _db.LicitacionesDetalle.Add(det);
        }
        lic.Subtotal = Math.Round(st, 2);
        lic.MontoIVA = Math.Round(iva, 2);
        lic.TotalOferta = Math.Round(tot, 2);
        await _db.SaveChangesAsync(ct);
        return lic.LicitacionId;
    }

    public async Task<int?> GetEmpleadoIdByUsuarioIdAsync(int usuarioId, CancellationToken ct = default)
    {
        return await _db.Empleados.AsNoTracking()
            .Where(e => e.UsuarioId == usuarioId)
            .Select(e => (int?)e.EmpleadoId)
            .FirstOrDefaultAsync(ct);
    }

    public async Task<bool> UpdateLicitacionAsync(int id, LicitacionCreateDto dto, CancellationToken ct = default)
    {
        var lic = await _db.Licitaciones.Include(l => l.Detalles).FirstOrDefaultAsync(l => l.LicitacionId == id, ct);
        if (lic == null) return false;
        lic.Institucion = dto.Institucion.Trim();
        lic.ContactoNombre = dto.ContactoNombre;
        lic.ContactoTelefono = dto.ContactoTelefono;
        lic.ContactoCorreo = dto.ContactoCorreo;
        lic.Descripcion = dto.Descripcion.Trim();
        lic.Estado = dto.Estado;
        lic.FechaLimiteConsultas = dto.FechaLimiteConsultas?.Date;
        lic.FechaEnvioOferta = dto.FechaEnvioOferta?.Date;
        lic.FechaEntrega = dto.FechaEntrega?.Date;
        lic.Observaciones = dto.Observaciones;
        lic.UpdatedAt = DateTime.UtcNow;
        _db.LicitacionesDetalle.RemoveRange(lic.Detalles);
        decimal st = 0, iva = 0, tot = 0;
        foreach (var line in dto.Lineas)
        {
            var det = new LicitacionDetalle
            {
                LicitacionId = id,
                ProductoId = line.ProductoId,
                Descripcion = line.Descripcion.Trim(),
                Cantidad = line.Cantidad,
                PrecioUnitario = line.PrecioUnitario,
                PorcentajeIVA = line.PorcentajeIVA
            };
            CalcularLineaLic(det);
            st += det.Subtotal;
            iva += det.MontoIVA;
            tot += det.Total;
            _db.LicitacionesDetalle.Add(det);
        }
        lic.Subtotal = Math.Round(st, 2);
        lic.MontoIVA = Math.Round(iva, 2);
        lic.TotalOferta = Math.Round(tot, 2);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<LicitacionDetalleCompletoDto?> GetLicitacionDetalleAsync(int id, CancellationToken ct = default)
    {
        var lic = await _db.Licitaciones.AsNoTracking()
            .Include(l => l.Detalles)
            .Include(l => l.Documentos)
            .Include(l => l.Recordatorios)
            .FirstOrDefaultAsync(l => l.LicitacionId == id, ct);
        if (lic == null) return null;
        return new LicitacionDetalleCompletoDto
        {
            LicitacionId = lic.LicitacionId,
            Codigo = lic.Codigo,
            Institucion = lic.Institucion,
            ContactoNombre = lic.ContactoNombre,
            ContactoTelefono = lic.ContactoTelefono,
            ContactoCorreo = lic.ContactoCorreo,
            Descripcion = lic.Descripcion,
            Estado = lic.Estado,
            FechaLimiteConsultas = lic.FechaLimiteConsultas,
            FechaEnvioOferta = lic.FechaEnvioOferta,
            FechaEntrega = lic.FechaEntrega,
            Observaciones = lic.Observaciones,
            Subtotal = lic.Subtotal,
            MontoIVA = lic.MontoIVA,
            TotalOferta = lic.TotalOferta,
            Lineas = lic.Detalles.Select(d => new LicitacionDetalleDto
            {
                ProductoId = d.ProductoId,
                Descripcion = d.Descripcion,
                Cantidad = d.Cantidad,
                PrecioUnitario = d.PrecioUnitario,
                PorcentajeIVA = d.PorcentajeIVA
            }).ToList(),
            Documentos = lic.Documentos.OrderByDescending(d => d.FechaSubida).Select(d => new LicitacionDocumentoDto
            {
                DocumentoId = d.DocumentoId,
                TipoDocumento = d.TipoDocumento,
                NombreArchivo = d.NombreArchivo,
                RutaArchivo = d.RutaArchivo,
                TamanoKB = d.TamanoKB,
                MimeType = d.MimeType,
                FechaSubida = d.FechaSubida
            }).ToList(),
            Recordatorios = lic.Recordatorios.OrderBy(r => r.FechaRecordatorio).Select(r => new LicitacionRecordatorioDto
            {
                RecordatorioId = r.RecordatorioId,
                Titulo = r.Titulo,
                FechaRecordatorio = r.FechaRecordatorio,
                Enviado = r.Enviado
            }).ToList()
        };
    }

    public async Task<int?> AddLicitacionDocumentoAsync(int licitacionId, int usuarioId, LicitacionDocumentoCreateDto dto, CancellationToken ct = default)
    {
        var lic = await _db.Licitaciones.FirstOrDefaultAsync(l => l.LicitacionId == licitacionId, ct);
        if (lic == null) return null;
        var doc = new LicitacionDocumento
        {
            LicitacionId = licitacionId,
            UsuarioId = OpUser(usuarioId),
            TipoDocumento = string.IsNullOrWhiteSpace(dto.TipoDocumento) ? "General" : dto.TipoDocumento.Trim(),
            NombreArchivo = dto.NombreArchivo.Trim(),
            RutaArchivo = dto.RutaArchivo.Trim(),
            TamanoKB = dto.TamanoKB,
            MimeType = dto.MimeType,
            FechaSubida = DateTime.UtcNow
        };
        _db.LicitacionesDocumentos.Add(doc);
        await _db.SaveChangesAsync(ct);
        return doc.DocumentoId;
    }

    public async Task<bool> DeleteLicitacionDocumentoAsync(int licitacionId, int documentoId, CancellationToken ct = default)
    {
        var doc = await _db.LicitacionesDocumentos.FirstOrDefaultAsync(d => d.LicitacionId == licitacionId && d.DocumentoId == documentoId, ct);
        if (doc == null) return false;
        _db.LicitacionesDocumentos.Remove(doc);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<int?> AddLicitacionRecordatorioAsync(int licitacionId, LicitacionRecordatorioCreateDto dto, CancellationToken ct = default)
    {
        var lic = await _db.Licitaciones.FirstOrDefaultAsync(l => l.LicitacionId == licitacionId, ct);
        if (lic == null) return null;
        var rec = new LicitacionRecordatorio
        {
            LicitacionId = licitacionId,
            Titulo = dto.Titulo.Trim(),
            FechaRecordatorio = dto.FechaRecordatorio,
            Enviado = false
        };
        _db.LicitacionesRecordatorios.Add(rec);
        await _db.SaveChangesAsync(ct);
        return rec.RecordatorioId;
    }

    public async Task<bool> DeleteLicitacionRecordatorioAsync(int licitacionId, int recordatorioId, CancellationToken ct = default)
    {
        var rec = await _db.LicitacionesRecordatorios.FirstOrDefaultAsync(r => r.LicitacionId == licitacionId && r.RecordatorioId == recordatorioId, ct);
        if (rec == null) return false;
        _db.LicitacionesRecordatorios.Remove(rec);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    /// <summary>Marca recordatorio como notificado para no repetir la alerta (HU Licitaciones).</summary>
    public async Task<bool> MarkLicitacionRecordatorioEnviadoAsync(int licitacionId, int recordatorioId, CancellationToken ct = default)
    {
        var rec = await _db.LicitacionesRecordatorios.FirstOrDefaultAsync(r => r.LicitacionId == licitacionId && r.RecordatorioId == recordatorioId, ct);
        if (rec == null) return false;
        rec.Enviado = true;
        rec.FechaEnvio = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> UpdateCuentaCobrarEstadoAsync(int id, string estado, CancellationToken ct = default)
    {
        var c = await _db.CuentasCobrar.FirstOrDefaultAsync(x => x.CuentaCobrarId == id, ct);
        if (c == null) return false;
        c.Estado = estado;
        c.UpdatedAt = DateTime.UtcNow;
        if (estado == "Pagado") c.FechaPago = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> UpdateCuentaPagarEstadoAsync(int id, string estado, CancellationToken ct = default)
    {
        var c = await _db.CuentasPagar.FirstOrDefaultAsync(x => x.CuentaPagarId == id, ct);
        if (c == null) return false;
        c.Estado = estado;
        c.UpdatedAt = DateTime.UtcNow;
        if (estado == "Pagado") c.FechaPago = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> AddMovimientoFinancieroManualAsync(MovimientoFinancieroManualDto dto, int usuarioId, CancellationToken ct = default)
    {
        var uid = OpUser(usuarioId);
        var m = new MovimientoFinanciero
        {
            UsuarioId = uid,
            Tipo = dto.Tipo,
            Categoria = dto.Categoria,
            Descripcion = dto.Descripcion,
            Monto = dto.Monto,
            FechaMovimiento = dto.FechaMovimiento ?? DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        _db.MovimientosFinancieros.Add(m);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<int?> CreateCuentaCobrarAsync(CuentaCobrarCreateDto dto, int usuarioId, CancellationToken ct = default)
    {
        if (dto.ClienteId <= 0 || string.IsNullOrWhiteSpace(dto.Concepto) || dto.Monto <= 0) return null;
        var c = new CuentaCobrar
        {
            ClienteId = dto.ClienteId,
            UsuarioId = OpUser(usuarioId),
            Concepto = dto.Concepto.Trim(),
            Monto = dto.Monto,
            Vencimiento = dto.Vencimiento.Date,
            Estado = "Pendiente",
            Observacion = string.IsNullOrWhiteSpace(dto.Observacion) ? null : dto.Observacion.Trim(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.CuentasCobrar.Add(c);
        await _db.SaveChangesAsync(ct);
        return c.CuentaCobrarId;
    }

    public async Task<int?> CreateCuentaPagarAsync(CuentaPagarCreateDto dto, int usuarioId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Concepto) || dto.Monto <= 0) return null;
        var c = new CuentaPagar
        {
            ProveedorId = dto.ProveedorId,
            UsuarioId = OpUser(usuarioId),
            Concepto = dto.Concepto.Trim(),
            Monto = dto.Monto,
            Vencimiento = dto.Vencimiento.Date,
            Estado = "Pendiente",
            Observacion = string.IsNullOrWhiteSpace(dto.Observacion) ? null : dto.Observacion.Trim(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.CuentasPagar.Add(c);
        await _db.SaveChangesAsync(ct);
        return c.CuentaPagarId;
    }

    public async Task RecalcularPrediccionesAsync(CancellationToken ct = default)
    {
        await _db.Database.ExecuteSqlRawAsync("EXEC fin.sp_RecalcularPredicciones", cancellationToken: ct);
    }
}
