using Microsoft.EntityFrameworkCore;
using PokeAPI.Controllers;
using PokeAPI.Data;
using PokeAPI.Models;

namespace PokemonTests;

public class Tests
{
    class ReadPokemonTest
    {
        public PokemonServiceContext _context { get; private set; }
        public PokemonController controller { get; private set; }

        [OneTimeSetUp]
        public void Setup()
        {
            SeedDb();
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            _context.Dispose();
            controller.Dispose();
        }

        private void SeedDb()
        {
            var options = new DbContextOptionsBuilder<PokemonServiceContext>()
            .UseInMemoryDatabase("DatabaseReadPokemon")
            .Options;

            var httpClient = new HttpClient();

            controller = new PokemonController(new PokemonServiceContext(options, httpClient));
            _context = new PokemonServiceContext(options, httpClient);

            var dateTime = new DateTime();

            var sprites = new Sprites("front_default");
            

            _context.Pokemon.Add(new Pokemon(1, "Squirtle", "65", "15", sprites));
            _context.Pokemon.Add(new Pokemon(2, "Squirtle", "65", "15", sprites));
            _context.Pokemon.Add(new Pokemon(3, "Squirtle", "65", "15", sprites));
            _context.SaveChanges();
        }

        [Test]
        public void ReadOnePokemon()
        {
            var pokemon = controller.GetPokemonById(1);

            Assert.That(pokemon.Result.Value.Id, Is.EqualTo(1));
            Assert.That(pokemon.Result.Value.Name, Is.EqualTo("Squirtle"));
            Assert.That(pokemon.Result.Value.Base_Experience, Is.EqualTo("65"));
            Assert.That(pokemon.Result.Value.Height, Is.EqualTo("15"));
            Assert.That(pokemon.Result.Value.Sprites.Front_Default, Is.EqualTo("front_default"));
        }
    }
}