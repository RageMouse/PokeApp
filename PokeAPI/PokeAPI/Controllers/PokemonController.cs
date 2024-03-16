using Microsoft.AspNetCore.Mvc;
using PokeAPI.Data;
using PokeAPI.Models;

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
    public async Task<ActionResult<List<Pokemon>>> GetAllPokemon()
    {
        var pokemon = await _context.GetAllPokemon();

        if (pokemon == null)
        {
            return NotFound();
        }

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
}
