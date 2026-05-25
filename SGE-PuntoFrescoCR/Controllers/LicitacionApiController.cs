using System.IO;
using Microsoft.AspNetCore.Mvc;
using SGE_PuntoFrescoCRBLL.Dtos;
using SGE_PuntoFrescoCRBLL.Services;

namespace SGE_PuntoFrescoCR.Controllers;

public class LicitacionApiController : BaseSpaApiController
{
    private readonly ILicitacionService _service;
    private readonly IWebHostEnvironment _env;

    public LicitacionApiController(ILicitacionService service, IPermisoService permisoService, IWebHostEnvironment env) : base(permisoService)
    {
        _service = service;
        _env = env;
    }

    [HttpPost("licitaciones")]
    public async Task<ActionResult<int>> PostLicitacion([FromBody] LicitacionCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("LICITACIONES", PermisoAccion.Crear, ct)) return Forbid();
        var id = await _service.CreateLicitacionAsync(dto, UsuarioOperador(), ct);
        return id == null ? BadRequest() : Ok(id.Value);
    }

    [HttpPut("licitaciones/{id:int}")]
    public async Task<IActionResult> PutLicitacion(int id, [FromBody] LicitacionCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("LICITACIONES", PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _service.UpdateLicitacionAsync(id, dto, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpGet("licitaciones/{id:int}/detalle")]
    public async Task<ActionResult<LicitacionDetalleCompletoDto>> GetLicitacionDetalle(int id, CancellationToken ct)
    {
        if (!await PuedeAsync("LICITACIONES", PermisoAccion.Ver, ct)) return Forbid();
        var dto = await _service.GetLicitacionDetalleAsync(id, ct);
        return dto == null ? NotFound() : Ok(dto);
    }

    [HttpPost("licitaciones/{id:int}/documentos")]
    public async Task<ActionResult<int>> PostLicitacionDocumento(int id, [FromBody] LicitacionDocumentoCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("LICITACIONES", PermisoAccion.Editar, ct)) return Forbid();
        if (string.IsNullOrWhiteSpace(dto.NombreArchivo) || string.IsNullOrWhiteSpace(dto.RutaArchivo)) return BadRequest();
        var docId = await _service.AddLicitacionDocumentoAsync(id, UsuarioOperador(), dto, ct);
        return docId == null ? NotFound() : Ok(docId.Value);
    }

    [HttpPost("licitaciones/{id:int}/documentos/upload")]
    [RequestSizeLimit(12_000_000)]
    public async Task<ActionResult<int>> UploadLicitacionDocumento(int id, IFormFile file, [FromForm] string? tipoDocumento, CancellationToken ct)
    {
        if (!await PuedeAsync("LICITACIONES", PermisoAccion.Editar, ct)) return Forbid();
        if (file == null || file.Length == 0) return BadRequest(new { error = "Seleccione un archivo." });

        var orig = Path.GetFileName(file.FileName);
        if (string.IsNullOrWhiteSpace(orig)) orig = "documento";
        var ext = Path.GetExtension(orig).ToLowerInvariant();
        var permitidos = new HashSet<string>(StringComparer.Ordinal)
        {
            ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".csv", ".txt", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".zip", ".rar", ".7z"
        };
        if (string.IsNullOrEmpty(ext) || !permitidos.Contains(ext))
        {
            return BadRequest(new
            {
                error = "Tipo de archivo no permitido. Use PDF, Word, Excel, CSV, imágenes o archivos comprimidos (ZIP, RAR, 7z)."
            });
        }

        var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var dir = Path.Combine(webRoot, "uploads", "lic", id.ToString());
        Directory.CreateDirectory(dir);
        var safe = $"{Guid.NewGuid():N}_{orig}";
        var fullPath = Path.Combine(dir, safe);
        await using (var fs = new FileStream(fullPath, FileMode.Create, FileAccess.Write))
            await file.CopyToAsync(fs, ct);
        var rel = $"/uploads/lic/{id}/{safe}".Replace('\\', '/');
        if (rel.Length > 500)
        {
            try { System.IO.File.Delete(fullPath); } catch { }
            return BadRequest(new { error = "Nombre de archivo demasiado largo." });
        }

        var dto = new LicitacionDocumentoCreateDto
        {
            TipoDocumento = string.IsNullOrWhiteSpace(tipoDocumento) ? "General" : tipoDocumento.Trim(),
            NombreArchivo = orig,
            RutaArchivo = rel,
            TamanoKB = (int)Math.Min(int.MaxValue, file.Length / 1024),
            MimeType = string.IsNullOrWhiteSpace(file.ContentType) ? null : file.ContentType
        };
        var docId = await _service.AddLicitacionDocumentoAsync(id, UsuarioOperador(), dto, ct);
        return docId == null ? NotFound() : Ok(docId.Value);
    }

    [HttpDelete("licitaciones/{id:int}/documentos/{documentoId:int}")]
    public async Task<IActionResult> DeleteLicitacionDocumento(int id, int documentoId, CancellationToken ct)
    {
        if (!await PuedeAsync("LICITACIONES", PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _service.DeleteLicitacionDocumentoAsync(id, documentoId, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpPost("licitaciones/{id:int}/recordatorios")]
    public async Task<ActionResult<int>> PostLicitacionRecordatorio(int id, [FromBody] LicitacionRecordatorioCreateDto dto, CancellationToken ct)
    {
        if (!await PuedeAsync("LICITACIONES", PermisoAccion.Editar, ct)) return Forbid();
        if (string.IsNullOrWhiteSpace(dto.Titulo)) return BadRequest();
        var recId = await _service.AddLicitacionRecordatorioAsync(id, dto, ct);
        return recId == null ? NotFound() : Ok(recId.Value);
    }

    [HttpPost("licitaciones/{id:int}/recordatorios/{recordatorioId:int}/marcar-enviado")]
    public async Task<IActionResult> PostLicitacionRecordatorioMarcarEnviado(int id, int recordatorioId, CancellationToken ct)
    {
        if (!await PuedeAsync("LICITACIONES", PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _service.MarkLicitacionRecordatorioEnviadoAsync(id, recordatorioId, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("licitaciones/{id:int}/recordatorios/{recordatorioId:int}")]
    public async Task<IActionResult> DeleteLicitacionRecordatorio(int id, int recordatorioId, CancellationToken ct)
    {
        if (!await PuedeAsync("LICITACIONES", PermisoAccion.Editar, ct)) return Forbid();
        var ok = await _service.DeleteLicitacionRecordatorioAsync(id, recordatorioId, ct);
        return ok ? NoContent() : NotFound();
    }
}
