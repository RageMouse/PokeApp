import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import '../styling/PokemonCard.css';

function PokemonCard({ pokemon, onToggleSelect, selectedPokemons, isSelectionDisabled }) {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(selectedPokemons[pokemon.id] || false);
  }, [selectedPokemons, pokemon.id]);

  const toggleSelection = () => {
    if (isSelectionDisabled && !isSelected) {
      return;
    }
  
    setIsSelected(!isSelected);
    onToggleSelect(pokemon.id, !isSelected);
  };

  return (
    <Card className={`pokemon-card ${isSelected ? 'selected' : ''}`} onClick={toggleSelection}>
      <Card.Img variant="top" src={pokemon.sprites.front_Default} alt={pokemon.name} />
      <Card.Body>
        <Card.Title className="pokemon-name">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Card.Title>
        <Card.Text className="pokemon-info">
          Type: {pokemon.type}<br />
          HP: {pokemon.stats[0].base_Stat}<br />
          Attack: {pokemon.stats[1].base_Stat}<br />
          Defense: {pokemon.stats[2].base_Stat}<br />
          SA: {pokemon.stats[3].base_Stat}<br />
          SD: {pokemon.stats[4].base_Stat}<br />
          Speed: {pokemon.stats[5].base_Stat}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default PokemonCard;