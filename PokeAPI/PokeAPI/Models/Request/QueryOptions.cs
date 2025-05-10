namespace PokeAPI.Models.Request;

public class QueryOptions
{
    public int Limit { get; set; } = 50;
    public int Offset { get; set; } = 0;
}
