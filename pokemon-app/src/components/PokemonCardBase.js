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
      </Card.Body>
    </Card>
  );
}

export default PokemonCard;