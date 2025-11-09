using Microsoft.EntityFrameworkCore;
using PanamaBackend.Data;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel for Railway or local dev
builder.WebHost.ConfigureKestrel(options =>
{
    var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
    options.ListenAnyIP(int.Parse(port));
});

// Add services to the container
builder.Services.AddControllers();

// Read database path or connection string
var dbPathOrConn = Environment.GetEnvironmentVariable("DATABASE_PATH")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "/data/app.db";

// Ensure valid SQLite connection string format
var connectionString = dbPathOrConn.StartsWith("Data Source=")
    ? dbPathOrConn
    : $"Data Source={dbPathOrConn}";

Console.WriteLine($"[DEBUG] Final SQLite connection string: '{connectionString}'");

// Register DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient();

// CORS setup
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
        else
        {
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    });
});

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

// Ensure SQLite DB exists
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    Console.WriteLine("[INFO] SQLite database ensured/created successfully.");
}

app.Run();