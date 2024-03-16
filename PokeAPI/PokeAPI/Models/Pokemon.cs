namespace PokeAPI.Models;

public class Pokemon
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Base_Experience { get; set; }
    public string Height { get; set; }
    public Sprites Sprites { get; set; }
    public List<Stats> Stats { get; set; }
}
