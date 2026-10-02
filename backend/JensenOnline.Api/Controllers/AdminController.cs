
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JensenOnline.Api.Controllers
{
    [Route("api/admin")]
    [ApiController]

    [Authorize(Roles = "admin")]
    public class AdminController : ControllerBase
    {
        [HttpGet("check")]
        public IActionResult CheckAdmin()
        {
            return Ok(new { message = "Inloggad som admin" });
        }
    }
}