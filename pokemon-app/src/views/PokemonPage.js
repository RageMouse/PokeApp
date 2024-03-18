import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import PokemonCard from '../components/PokemonCard';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './PokemonPage.css';

function PokemonPage() {
  const [pokemonData, setPokemonData] = useState([]);
  const [selectedPokemons, setSelectedPokemons] = useState({});
  const [isSelectionDisabled, setIsSelectionDisabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    fetchPokemonData();
  }, []);

  const fetchPokemonData = async () => {
    try {
      const response = await fetch('https://pokeappapi.azurewebsites.net/api/pokemon');
      if (response.ok) {
        const data = await response.json();
        setPokemonData(data);
      } else {
        console.error('Failed to fetch Pokémon data');
      }
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const data = {
      Name: Cookies.get('username'),
      TeamName: Cookies.get('teamName'),
      PokemonIds: Object.keys(selectedPokemons),
    };
  
    try {
      const response = await fetch('https://poketeamapi.azurewebsites.net/api/Team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit team.');
      }
  
      console.log('Team submitted successfully!');
      navigate('/teams');
    } catch (error) {
      console.error('Error submitting team:', error);
    }
  };

  const handleToggleSelect = (pokemonId, isSelected) => {
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
    setIsSelectionDisabled(Object.keys(selectedPokemons).length >= 6);
  }, [selectedPokemons]);

  const filteredPokemonData = pokemonData.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pokemon-page">
      <div className="page-title">Pokémon Collection</div>
      <Button variant="primary" onClick={handleSubmit} disabled={!isSelectionDisabled}>
        Submit
      </Button>
      <div className="search-bar">
        <Form.Control
          type="text"
          placeholder="Search Pokémon"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="page-subtitle">Select your team! (6 Pokémon)</div>
      {isLoading ? (
        <Spinner animation="border" role="status">
        </Spinner>
      ) : (
        filteredPokemonData.map(pokemon => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onToggleSelect={handleToggleSelect}
            selectedPokemons={selectedPokemons}
            isSelectionDisabled={isSelectionDisabled}
          />
        ))
      )}
    </div>
  );
}

export default PokemonPage;