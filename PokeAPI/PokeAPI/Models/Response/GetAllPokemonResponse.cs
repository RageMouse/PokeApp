namespace PokeAPI.Models.Response;

public class GetAllPokemonResponse
{
    public GetAllPokemonResponse(int id, string name, Sprites sprites)
    {
        Id = id;
        Name = name;
        Sprites = sprites;
    }

    public int Id { get; set; }
    public string Name { get; set; }
    public Sprites Sprites { get; set; }
}
