using Microsoft.EntityFrameworkCore;
using PanamaBackend.Data;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel for Railway port binding
builder.WebHost.ConfigureKestrel(options =>
{
    var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
    options.ListenAnyIP(int.Parse(port));
});

// Add services to the container.
builder.Services.AddControllers();

// Register HttpClient
builder.Services.AddHttpClient();

// ---- Configure SQLite ----

// Try to get connection string from environment or appsettings
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"[DEBUG] Raw connection string read: '{connectionString}'");

// Determine final path
string dbPath;

// Railway container writable directory: /app or /tmp
var possiblePaths = new[]
{
    "/data/file_metadata.db",
    "/app/app.db",
    "/tmp/app.db"
};

dbPath = possiblePaths.FirstOrDefault(path =>
{
    try
    {
        var dir = Path.GetDirectoryName(path)!;
        if (!Directory.Exists(dir))
            Directory.CreateDirectory(dir);
        return true;
    }
    catch
    {
        return false;
    }
}) ?? "app.db";

// If a connection string was defined but not valid, ignore it
if (string.IsNullOrWhiteSpace(connectionString) || !connectionString.Contains("Data Source"))
{
    connectionString = $"Data Source={dbPath}";
    Console.WriteLine($"[WARN] Connection string not set — using fallback: {connectionString}");
}
else
{
    // Ensure it points to a valid path
    var existingSource = connectionString.Split('=')[1].Trim();
    if (!existingSource.StartsWith("/"))
    {
        // convert relative paths to absolute
        var absPath = Path.GetFullPath(existingSource);
        connectionString = $"Data Source={absPath}";
    }
}

Console.WriteLine($"[DEBUG] Final SQLite connection string: '{connectionString}'");

// Register EF Core context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
var allowedOrigins = builder.Configuration["AllowedOrigins"];
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        if (!string.IsNullOrEmpty(allowedOrigins))
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
        else
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Ensure database exists and is writable
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        db.Database.EnsureCreated();
        Console.WriteLine($"[INFO] SQLite database ready at: {connectionString}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ERROR] Failed to open or create SQLite database: {ex.Message}");
    }
}

app.Run();