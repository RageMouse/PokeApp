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

    [HttpGet("{id}")]
    public async Task<ActionResult<Team>> GetTeamById(int id)
    {
        return await _context.Team.FindAsync(id);
    }

    [HttpPost()]
    public async Task<ActionResult<Team>> CreateTeam([FromBody] Team team)
    {
        _context.Team.Add(team);
        await _context.SaveChangesAsync();

        return Ok(team);
    }

    [HttpGet("statistics/{id}")]
    public async Task<ActionResult<object>> GetTeamStatisticsById(int id)
    {
        var team = _context.Team.FindAsync(id);

        return Ok(new
        {
            teamName = team.Result.TeamName,
            pokemonCount = team.Result.PokemonIds.Count,
            isDeleted = team.Result.IsDeleted,
            createdDate = team.Result.IsCreated
        });
    }
}
