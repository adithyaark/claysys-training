using Microsoft.AspNetCore.Mvc;
using QuizAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace QuizAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PromoteAdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public PromoteAdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Promote()
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == "das");
        if (user == null) return NotFound("User 'das' not found");

        user.Role = "Admin";
        await _context.SaveChangesAsync();
        return Ok("User 'das' promoted to Admin");
    }
}
