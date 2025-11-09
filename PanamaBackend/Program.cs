using Microsoft.EntityFrameworkCore;
using PanamaBackend.Data;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
    options.ListenAnyIP(int.Parse(port));
});

// Add services to the container.
builder.Services.AddControllers();

// Configure EF Core with SQLite
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Log what was found (to stdout so you can see it in Railway logs)
Console.WriteLine($"[DEBUG] Connection string read: '{connectionString}'");

// Fallback if it's null or empty
if (string.IsNullOrWhiteSpace(connectionString))
{
    connectionString = "Data Source=/app/app.db";
    Console.WriteLine("[WARN] Connection string was empty — using fallback: Data Source=/app/app.db");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// Add Swagger/OpenAPI services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient();

// ✅ Add CORS configuration
var allowedOrigins = builder.Configuration["AllowedOrigins"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        if (!string.IsNullOrEmpty(allowedOrigins))
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    });
});

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ✅ Enable CORS before authorization and controllers
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated(); // Automatically creates app.db if missing
}

app.Run();