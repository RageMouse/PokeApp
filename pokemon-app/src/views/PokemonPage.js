import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import PokemonCardBase from '../components/PokemonCardBase';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './PokemonPage.css';
import Pagination from '../components/Pagination';

function PokemonPage() {
  const [pokemonData, setPokemonData] = useState([]);
  const [pokemonCount, setPokemonCount] = useState(0);
  const [selectedPokemons, setSelectedPokemons] = useState({});
  const [isSelectionDisabled, setIsSelectionDisabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPokemonData();
  }, []);

  const fetchPokemonData = async (limit = 28, offset = 0) => {
    setIsLoading(true);
    setPokemonData([]);
    try {
      const response = await fetch(`https://pokeapi-pokemon-fafna8hxe2asa9f6.germanywestcentral-01.azurewebsites.net/api/pokemon?limit=${limit}&offset=${offset}`);
      if (response.ok) {
        const data = await response.json();
        setPokemonData(data.results);
        setPokemonCount(data.count);
      } else {
        console.error('Failed to fetch Pokémon data');
      }
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();

    const data = {
      Name: Cookies.get('username'),
      TeamName: Cookies.get('teamName'),
      PokemonIds: Object.keys(selectedPokemons),
    };

    try {
      const response = await fetch('https://teamapi-anamh5fgbyavc9a4.canadacentral-01.azurewebsites.net/api/Team', {
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
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={!isSelectionDisabled || isLoading}
      >
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
          <PokemonCardBase
            key={pokemon.id}
            pokemon={pokemon}
            onToggleSelect={handleToggleSelect}
            selectedPokemons={selectedPokemons}
            isSelectionDisabled={isSelectionDisabled}
          />
        ))
      )}
      <div>
        <Pagination
          totalPages={Math.ceil(pokemonCount / 28)}
          onPageChange={(page) => {
            const offset = (page - 1) * 28;
            fetchPokemonData(28, offset);
          }}
          loading={isLoading}
        />
      </div>
    </div>
  );
}

export default PokemonPage;