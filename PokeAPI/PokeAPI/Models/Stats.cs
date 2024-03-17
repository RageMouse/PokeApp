namespace PokeAPI.Models;

public class Stats
{
    public Stats(int base_Stat, Stat stat)
    {
        Base_Stat = base_Stat;
        this.stat = stat;
    }

    public int Base_Stat {  get; set; }
    public Stat stat { get; set; }
}
