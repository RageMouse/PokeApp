namespace PokeAPI.Models.Response;

public class PokemonBaseResponse
{
    public int Count { get; set; }
    public List<PokemonBase> Results { get; set; }
}
