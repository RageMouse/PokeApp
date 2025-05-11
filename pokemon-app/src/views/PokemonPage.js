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
  const [noResultsMessage, setNoResultsMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPokemonData();
  }, []);

  const fetchPokemonData = async (limit = 28, offset = 0) => {
    setIsLoading(true);
    setPokemonData([]);
    setNoResultsMessage('');
    try {
      const response = await fetch(`https://pokeapi-pokemon-fafna8hxe2asa9f6.germanywestcentral-01.azurewebsites.net/api/pokemon?limit=${limit}&offset=${offset}`);
      if (response.ok) {
        const data = await response.json();
        if (data.results.length === 0) {
          console.log('No Pokémon found on this page.');
          setNoResultsMessage('No Pokémon found on this page.');
        }
        setPokemonData(data.results);
        setPokemonCount(data.count);
      } else {
        console.error('Failed to fetch Pokémon data');
      }
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
      setNoResultsMessage('Its not me, its PokeAPI not giving me the data.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPokemonByName = async (name) => {
    setIsLoading(true);
    setPokemonData([]);
    setNoResultsMessage('');
    try {
      const response = await fetch(`https://pokeapi-pokemon-fafna8hxe2asa9f6.germanywestcentral-01.azurewebsites.net/api/pokemon/name/${name}`);
      if (response.ok) {
        const data = await response.json();
        setPokemonData([data]);
        setPokemonCount(1);
        if (!data) {
          setNoResultsMessage('No Pokémon found matching your search. Use their full government-given name (e.g., Ditto).');
        }
      } else {
        setNoResultsMessage('No Pokémon found matching your search. Use their full government-given name (e.g., Ditto).');
      }
    } catch (error) {
      console.error('Error fetching Pokémon by name:', error);
      setNoResultsMessage('No Pokémon found matching your search. Use their full government-given name (e.g., Ditto).');
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
    setSelectedPokemons(prevState => {
      if (isSelected) {
        return {
          ...prevState,
          [pokemonId]: isSelected,
        };
      } else {
        const { [pokemonId]: _, ...updatedSelectedPokemons } = prevState;
        return updatedSelectedPokemons;
      }
    });

    console.log('Selected Pokémon:', selectedPokemons);
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
      <div className="selected-pokemon-list">
        <h5>Selected Pokémon:</h5>
        <ul>
          {Object.keys(selectedPokemons).map(pokemonId => {
            const pokemon = pokemonData.find(p => p.id === parseInt(pokemonId));
            return (
              <li key={pokemonId}>
              {pokemon ? pokemon.name : `ID: ${pokemonId}`}
              </li>
            );
            })}
          </ul>
          </div>
          <div className="search-bar">
          <Form
            onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim() === '') {
              fetchPokemonData();
            } else {
              fetchPokemonByName(searchQuery);
            }
            }}
          >
            <Form.Control
            type="text"
            placeholder="Search Pokémon"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="primary" className="mt-2">
            Search
            </Button>
          </Form>
          </div>
          <div className="page-subtitle">Select your team! (6 Pokémon)</div>
          {isLoading ? (
          <Spinner animation="border" role="status"></Spinner>
          ) : (
          filteredPokemonData.length > 0 ? (
            filteredPokemonData.map((pokemon) => (
              <PokemonCardBase
              key={pokemon.id}
              pokemon={pokemon}
              onToggleSelect={handleToggleSelect}
              selectedPokemons={selectedPokemons}
              isSelectionDisabled={isSelectionDisabled}
              />
            ))
          ) : (
            <div className="no-results-message">{noResultsMessage}</div>
          )
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