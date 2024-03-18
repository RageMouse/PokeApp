namespace PokeAPI.Models;

public class Pokemon
{
    public Pokemon(int id, string name, string base_Experience, string height, Sprites sprites)
    {
        Id = id;
        Name = name;
        Base_Experience = base_Experience;
        Height = height;
        Sprites = sprites;
    }

    public int Id { get; set; }
    public string Name { get; set; }
    public string Base_Experience { get; set; }
    public string Height { get; set; }
    public Sprites Sprites { get; set; }
    public List<Stats> Stats { get; set; }
    public List<Types> Types { get; set; }
}
