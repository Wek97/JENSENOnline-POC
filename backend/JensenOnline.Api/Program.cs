using Microsoft.EntityFrameworkCore;
using JensenOnline.Api;
using Microsoft.AspNetCore.Identity;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using JensenOnline.Api.ErrorHandling;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddControllers();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key saknas i user-secrets.");

builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "http://localhost:5000",
            ValidAudience = "http://localhost:5000",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };


        opt.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["X-Access-Token"];
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

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

    if (!db.Users.Any(u => u.Role == "admin"))
    {
        var adminPassword = app.Configuration["Admin:Password"];

        if (!string.IsNullOrWhiteSpace(adminPassword))
        {
            var admin = new User { Email = "admin@jensenonline.se", Role = "admin" };
            admin.PasswordHash = new PasswordHasher<User>().HashPassword(admin, adminPassword);
            db.Users.Add(admin);
            db.SaveChanges();
        }
    }
}

app.UseExceptionHandler();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();