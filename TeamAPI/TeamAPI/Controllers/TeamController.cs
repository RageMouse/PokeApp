using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeamAPI.Data;
using TeamAPI.Models;

namespace TeamAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TeamController : Controller
{
    private readonly TeamServiceContext _context;

    public TeamController(TeamServiceContext context)
    {
        _context = context;
    }

    [HttpGet()]
    public async Task<ActionResult<IEnumerable<Team>>> GetAllTeams()
    {
        return await _context.Team.ToListAsync();
    }
}
