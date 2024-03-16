import React, { useState, useEffect } from 'react';
import PokemonCard from '../components/PokemonCard';
import './PokemonPage.css';

function PokemonPage() {
  const [pokemonData, setPokemonData] = useState([]);
  const [selectedPokemons, setSelectedPokemons] = useState({});
  const [isSelectionDisabled, setIsSelectionDisabled] = useState(false);

  useEffect(() => {
    fetch('https://localhost:32768/api/pokemon')
      .then(response => response.json())
      .then(data => setPokemonData(data))
      .catch(error => console.error('Error fetching Pokémon data:', error));
  }, []);

  const handleToggleSelect = (pokemonId, isSelected) => {
    console.log(pokemonData)
    if (Object.keys(selectedPokemons).length >= 6 && !isSelected) {
      const { [pokemonId]: _, ...updatedSelectedPokemons } = selectedPokemons;
      setSelectedPokemons(updatedSelectedPokemons);
    } else if (!isSelectionDisabled) {
      setSelectedPokemons(prevState => ({
        ...prevState,
        [pokemonId]: isSelected,
      }));
    }
  };

  useEffect(() => {
    if (Object.keys(selectedPokemons).length >= 6) {
      setIsSelectionDisabled(true);
    } else {
      setIsSelectionDisabled(false);
    }
  }, [selectedPokemons]);

  return (
    <div className="pokemon-page">
      <div className="page-title">Pokémon Collection</div>
      <div className="page-subtitle">Select your team! (6 Pokémon)</div>
      {pokemonData.map(pokemon => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          onToggleSelect={handleToggleSelect}
          selectedPokemons={selectedPokemons}
          isSelectionDisabled={isSelectionDisabled}
        />
      ))}
    </div>
  );
}

export default PokemonPage;