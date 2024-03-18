import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import '../styling/PokemonCard.css';

function PokemonCard({ pokemon, onToggleSelect, selectedPokemons, isSelectionDisabled, disabled }) {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(selectedPokemons[pokemon.id] || false);
  }, [selectedPokemons, pokemon.id]);

  const toggleSelection = () => {
    if (disabled || (isSelectionDisabled && !isSelected)) {
      return;
    }

    setIsSelected(!isSelected);
    onToggleSelect(pokemon.id, !isSelected);
  };

  return (
    <Card className={`pokemon-card ${isSelected ? 'selected' : ''}`} onClick={toggleSelection}>
      <Card.Img variant="top" src={pokemon.sprites.front_Default} alt={pokemon.name} />
      <Card.Body>
        <Card.Title className="pokemon-name">{pokemon.name.split('-')[0].charAt(0).toUpperCase() + pokemon.name.split('-')[0].slice(1)} #{pokemon.id}</Card.Title>
        <Card.Text className="pokemon-info">
          Types: {pokemon.types.map((type, index) => (
            <span key={index}>
              {type.type.name}
              {index < pokemon.types.length - 1 && ', '}
            </span>
          ))}
          <br />
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