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
}
