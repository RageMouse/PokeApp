using Microsoft.AspNetCore.Mvc;
using PokeAPI.Data;
using PokeAPI.Models;
using PokeAPI.Models.Request;
using PokeAPI.Models.Response;

namespace PokeAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PokemonController : Controller
{
    private readonly PokemonServiceContext _context;

    public PokemonController(PokemonServiceContext context)
    {
        _context = context;
    }

    [HttpGet()]
    public async Task<GetAll> GetAllPokemon([FromQuery] int? limit, [FromQuery] int? offset)
    {
        var queryParameters = new QueryOptions
        {
            Limit = limit ?? 30,
            Offset = offset ?? 0
        };

        var pokemon = await _context.GetAllPokemon(queryParameters);

        return pokemon;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Pokemon>> GetPokemonById(int id)
    {
        var pokemon = await _context.GetPokemonById(id);

        if (pokemon == null)
        {
            return NotFound();
        }

        return pokemon;
    }

    [HttpGet("name/{name}")]
    public async Task<ActionResult<GetAllPokemonResponse>> GetPokemonByName(string name)
    {
        var pokemon = await _context.GetPokemonByName(name);
        if (pokemon == null)
        {
            return NotFound();
        }
        return pokemon;
    }
}
