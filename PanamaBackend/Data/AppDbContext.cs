using Microsoft.EntityFrameworkCore;
using PanamaBackend.Models;

namespace PanamaBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Report> Reports { get; set; } = null!;
    }
}