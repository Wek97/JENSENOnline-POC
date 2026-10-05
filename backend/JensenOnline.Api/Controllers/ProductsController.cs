using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JensenOnline.Api.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _db;

        // Här sätts DI upp för controllern
        public ProductsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts(string? search)
        {
            var value = (search ?? "").Trim().ToLower();

            var products = await _db.Products
                .Where(p => p.Name.ToLower().Contains(value) || p.Category.ToLower().Contains(value))
                .Select(p => new { p.Id, p.Name, p.Description, p.Category, p.Price })
                .ToListAsync();

            return Ok(products);
        }
        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CreateProduct(ProductRequest request)
        {
            var error = ValidateProduct(request);
            if (error != null)
                return BadRequest(new { message = error });

            var product = new Product
            {
                Name = request.Name.Trim(),
                Description = (request.Description ?? "").Trim(),
                Category = request.Category.Trim(),
                Price = request.Price
            };

            _db.Products.Add(product);
            await _db.SaveChangesAsync();

            return Created($"/api/products/{product.Id}",
                new { product.Id, product.Name, product.Description, product.Category, product.Price });
        }

        // Samma kontroller används när produkter skapas och ändras
        private static string? ValidateProduct(ProductRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Category))
                return "Namn och kategori måste fyllas i.";

            if (request.Name.Length > 100 || request.Category.Length > 50 || (request.Description ?? "").Length > 500)
                return "Texten är för lång.";

            if (request.Price <= 0 || request.Price > 1000000)
                return "Priset måste vara mellan 1 och 1 000 000 kr.";

            return null;
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductRequest request)
        {
            var error = ValidateProduct(request);
            if (error != null)
                return BadRequest(new { message = error });

            var product = await _db.Products.FindAsync(id);
            if (product == null)
                return NotFound(new { message = "Produkten hittades inte." });

            product.Name = request.Name.Trim();
            product.Description = (request.Description ?? "").Trim();
            product.Category = request.Category.Trim();
            product.Price = request.Price;

            await _db.SaveChangesAsync();

            return Ok(new { product.Id, product.Name, product.Description, product.Category, product.Price });
        }

    }
}