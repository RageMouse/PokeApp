namespace TeamAPI.Models;

public class Team
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string TeamName { get; set; }
    public List<int> PokemonIds { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime IsCreated { get; set; } = DateTime.Now;
}
