namespace PokeAPI.Models.Response;

public class GetAll
{
    public GetAll(int count, List<GetAllPokemonResponse> results)
    {
        Count = count;
        Results = results;
    }
    public int Count { get; set; }
    public List<GetAllPokemonResponse> Results { get; set; }
}
