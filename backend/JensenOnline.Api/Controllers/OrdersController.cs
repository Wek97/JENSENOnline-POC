using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JensenOnline.Api.Controllers
{
    [Route("api/orders")]
    [ApiController]

    // Alla endpoints för order kräver att man är inloggad
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public OrdersController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(OrderRequest request)
        {
            if (request.Items == null || request.Items.Count == 0)
                return BadRequest(new { message = "Ordern är tom." });


            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var order = new Order { UserId = userId };

            foreach (var item in request.Items)
            {
                if (item.Quantity < 1 || item.Quantity > 100)
                    return BadRequest(new { message = "Antal måste vara mellan 1 och 100." });

                var product = await _db.Products.FindAsync(item.ProductId);
                if (product == null)
                    return BadRequest(new { message = "En produkt i ordern finns inte." });

                // Priset hämtas från databasen, aldrig från klienten
                order.Items.Add(new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price
                });
            }

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            var total = order.Items.Sum(i => i.UnitPrice * i.Quantity);
            return Created($"/api/orders/{order.Id}", new { order.Id, total });
        }

        [HttpGet("mine")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var orders = await _db.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                .OrderByDescending(o => o.Id)
                .ToListAsync();

            var productNames = await _db.Products.ToDictionaryAsync(p => p.Id, p => p.Name);

            var result = orders.Select(o => new
            {
                o.Id,
                o.CreatedAt,
                total = o.Items.Sum(i => i.UnitPrice * i.Quantity),
                items = o.Items.Select(i => new
                {
                    productName = productNames.GetValueOrDefault(i.ProductId, "Okänd produkt"),
                    i.Quantity,
                    i.UnitPrice
                })
            });

            return Ok(result);
        }
    }
}