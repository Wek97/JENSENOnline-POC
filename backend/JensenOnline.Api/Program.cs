using Microsoft.EntityFrameworkCore;
using JensenOnline.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.Products.Any())
    {
        db.Products.AddRange(
            new Product { Name = "Laptop Pro 14", Description = "14 tum, 16 GB RAM", Category = "Dator", Price = 14990 },
            new Product { Name = "27 tum skärm", Description = "IPS, 1440p", Category = "Bildskärm", Price = 3499 },
            new Product { Name = "Trådlöst tangentbord", Description = "Nordisk layout", Category = "Tillbehör", Price = 799 },
            new Product { Name = "USB-C docka", Description = "HDMI, USB-A, nätverk", Category = "Tillbehör", Price = 1299 },
            new Product { Name = "Kontorsstol", Description = "Justerbart ryggstöd", Category = "Kontor", Price = 2490 }
        );
        db.SaveChanges();
    }
}

app.UseCors("Frontend");

app.MapGet("/api/products", async (AppDbContext db) =>
    Results.Ok(await db.Products
        .Select(p => new { p.Id, p.Name, p.Description, p.Category, p.Price })
        .ToListAsync()));

app.Run();