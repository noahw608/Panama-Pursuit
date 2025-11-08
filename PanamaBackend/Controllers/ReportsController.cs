using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PanamaBackend.Data;
using PanamaBackend.Models;

namespace PanamaBackend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReportsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Reports
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReportDto>>> GetReports()
    {
        var reports = await _context.Reports
            .Select(r => new ReportDto
            {
                Id = r.Id,
                Name = r.Name,
                Email = r.Email,
                Country = r.Country,
                Latitude = r.Latitude,
                Longitude = r.Longitude,
                CreatedAt = r.CreatedAt,
                ImageBase64 = r.Image != null ? Convert.ToBase64String(r.Image) : null
            })
            .ToListAsync();

        return Ok(reports);
    }

    // POST: api/Reports
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ReportDto>> PostReport([FromForm] ReportCreateDto reportDto)
    {
        var report = new Report
        {
            Name = reportDto.Name,
            Email = reportDto.Email ?? throw new ArgumentNullException(nameof(reportDto.Email)),
            Country = reportDto.Country ?? throw new ArgumentNullException(nameof(reportDto.Country)),
            Latitude = reportDto.Latitude,
            Longitude = reportDto.Longitude,
            CreatedAt = DateTime.UtcNow
        };

        // If an image was uploaded, convert to byte[]
        if (reportDto.Image != null)
        {
            using var ms = new MemoryStream();
            await reportDto.Image.CopyToAsync(ms);
            report.Image = ms.ToArray();
        }

        _context.Reports.Add(report);
        await _context.SaveChangesAsync();

        var result = new ReportDto
        {
            Id = report.Id,
            Name = report.Name,
            Email = report.Email,
            Country = report.Country,
            Latitude = report.Latitude,
            Longitude = report.Longitude,
            CreatedAt = report.CreatedAt,
            ImageBase64 = report.Image != null ? Convert.ToBase64String(report.Image) : null
        };

        return CreatedAtAction(nameof(GetReports), new { id = report.Id }, result);
    }
}

// DTO for reading reports
public class ReportDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string Email { get; set; } = null!;
    public string Country { get; set; } = null!;
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? ImageBase64 { get; set; } // send image as base64
}

// DTO for creating reports
public class ReportCreateDto
{
    public string? Name { get; set; }
    
    [Required]
    public string? Email { get; set; }
    
    [Required]
    public string? Country { get; set; }

    [Required]
    public decimal Latitude { get; set; }

    [Required]
    public decimal Longitude { get; set; }

    public IFormFile? Image { get; set; } // uploaded image
}