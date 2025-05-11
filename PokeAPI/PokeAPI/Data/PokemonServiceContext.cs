using Microsoft.EntityFrameworkCore;
using PokeAPI.Models;
using Newtonsoft.Json;
using PokeAPI.Models.Response;
using PokeAPI.Models.Request;

namespace PokeAPI.Data;

public class PokemonServiceContext : DbContext
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl = "https://pokeapi.co/api/v2/pokemon";

    public PokemonServiceContext(DbContextOptions<PokemonServiceContext> options, HttpClient httpClient)
        : base(options)
    {
        _httpClient = httpClient;
    }

    public DbSet<Pokemon> Pokemon { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
    }

    public async Task<GetAll> GetAllPokemon(QueryOptions queryOptions)
    {
        try
        {
            string requestUrl = $"{_baseUrl}?limit={queryOptions.Limit}&offset={queryOptions.Offset}";
            HttpResponseMessage response = await _httpClient.GetAsync(requestUrl);

            if (response.IsSuccessStatusCode)
            {
                string responseBody = await response.Content.ReadAsStringAsync();
                PokemonBaseResponse responseObject = JsonConvert.DeserializeObject<PokemonBaseResponse>(responseBody);

                var pokemonDetails = new List<GetAllPokemonResponse>();

                foreach (var pokemonItem in responseObject.Results)
                {
                    HttpResponseMessage pokemonResponse = await _httpClient.GetAsync(pokemonItem.Url);

                    if (pokemonResponse.IsSuccessStatusCode)
                    {
                        string pokemonResponseBody = await pokemonResponse.Content.ReadAsStringAsync();
                        var pokemon = JsonConvert.DeserializeObject<GetAllPokemonResponse>(pokemonResponseBody);
                        pokemonDetails.Add(pokemon);
                    }
                }

                return new GetAll(responseObject.Count, pokemonDetails);
            }
            else
            {
                Console.WriteLine("Failed to fetch data: " + response.ReasonPhrase);
                return null;
            }
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine("Request exception: " + e.Message);
            return null;
        }
    }

    public async Task<Pokemon> GetPokemonById(int id)
    {
        try
        {
            string pokemonId = $"/{id}";
            string requestUrl = _baseUrl + pokemonId;

            HttpResponseMessage response = await _httpClient.GetAsync(requestUrl);

            if (response.IsSuccessStatusCode)
            {
                string responseBody = await response.Content.ReadAsStringAsync();

                Pokemon pokemon = JsonConvert.DeserializeObject<Pokemon>(responseBody);

                return pokemon;
            }
            else
            {
                Console.WriteLine("Failed to fetch data: " + response.ReasonPhrase);
                return null;
            }
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine("Request exception: " + e.Message);
            return null;
        }
    }

    public async Task<GetAllPokemonResponse> GetPokemonByName(string name)
    {
        try
        {
            string requestUrl = $"{_baseUrl}/{name}?fields=id,name,sprites";
            HttpResponseMessage response = await _httpClient.GetAsync(requestUrl);
            if (response.IsSuccessStatusCode)
            {
                string responseBody = await response.Content.ReadAsStringAsync();
                GetAllPokemonResponse pokemon = JsonConvert.DeserializeObject<GetAllPokemonResponse>(responseBody);
                return pokemon;
            }
            else
            {
                Console.WriteLine("Failed to fetch data: " + response.ReasonPhrase);
                return null;
            }
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine("Request exception: " + e.Message);
            return null;
        }
    }

    public async Task<Dictionary<string, int>> CalculateTeamWeaknesses(List<int> teamPokemonIds)
    {
        var typeWeaknesses = new Dictionary<string, List<string>>
        {
            { "fire", new List<string> { "Water", "Rock", "Ground" } },
            { "water", new List<string> { "Electric", "Grass" } },
            { "grass", new List<string> { "Fire", "Ice", "Poison", "Flying", "Bug" } },
            { "electric", new List<string> { "Ground" } },
            { "rock", new List<string> { "Water", "Grass", "Fighting", "Ground", "Steel" } },
            { "ground", new List<string> { "Water", "Grass", "Ice" } },
            { "flying", new List<string> { "Electric", "Ice", "Rock" } },
            { "psychic", new List<string> { "Bug", "Ghost", "Dark" } },
            { "dark", new List<string> { "Fighting", "Bug", "Fairy" } },
            { "fairy", new List<string> { "Poison", "Steel" } },
            { "steel", new List<string> { "Fire", "Fighting", "Ground" } },
            { "fighting", new List<string> { "Flying", "Psychic", "Fairy" } },
            { "poison", new List<string> { "Ground", "Psychic" } },
            { "bug", new List<string> { "Fire", "Flying", "Rock" } },
            { "ice", new List<string> { "Fire", "Fighting", "Rock", "Steel" } },
            { "dragon", new List<string> { "Ice", "Dragon", "Fairy" } },
            { "ghost", new List<string> { "Ghost", "Dark" } },
            { "normal", new List<string> { "Fighting" } }
        };

        var teamWeaknesses = new Dictionary<string, int>();

        foreach (var pokemonId in teamPokemonIds)
        {
            // Fetch Pokémon details
            var pokemon = await GetPokemonById(pokemonId);
            if (pokemon == null || pokemon.Types == null) continue;

            // Calculate weaknesses for each type
            foreach (var type in pokemon.Types)
            {
                if (typeWeaknesses.TryGetValue(type.Type.Name, out var weaknesses))
                {
                    foreach (var weakness in weaknesses)
                    {
                        if (teamWeaknesses.ContainsKey(weakness))
                        {
                            teamWeaknesses[weakness]++;
                        }
                        else
                        {
                            teamWeaknesses[weakness] = 1;
                        }
                    }
                }
            }
        }

        return teamWeaknesses;
    }
}
