using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PanamaBackend.Models;

public class Report
{
    [Key]
    public int Id { get; set; }
    
    public string? Name { get; set; } = null!;

    [Required]
    public string? Email { get; set; }
    
    [Required]
    public string? Country { get; set; }

    [Required]
    [Column(TypeName = "decimal(9,6)")]
    public decimal Latitude { get; set; }

    [Required]
    [Column(TypeName = "decimal(9,6)")]
    public decimal Longitude { get; set; }

    // BLOB for image storage
    public byte[]? Image { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}