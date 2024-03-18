import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import PokemonCard from '../components/PokemonCard';
import { useNavigate } from 'react-router-dom';
import './TeamPage.css';

function TeamPage() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      // Fetch teams data from the API
      const response = await fetch('https://poketeamapi.azurewebsites.net/api/Team');
      if (response.ok) {
        const teamsData = await response.json();
        const teamsWithPokemon = await Promise.all(teamsData.map(fetchPokemonForTeam));
        setTeams(teamsWithPokemon);
      } else {
        setTeams([]);
      }
    } catch (error) {
      console.error('Error fetching teams data:', error);
    }
  };

  const fetchPokemonForTeam = async (team) => {
    try {
      const pokemonPromises = team.pokemonIds.map(fetchPokemonById);
      const pokemonData = await Promise.all(pokemonPromises);
      return { ...team, pokemon: pokemonData };
    } catch (error) {
      console.error('Error fetching Pokémon data for team:', error);
      return team; // Return team as is if there's an error
    }
  };

  const fetchPokemonById = async (id) => {
    try {
      const response = await fetch(`https://pokeappapi.azurewebsites.net/api/Pokemon/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Pokémon');
      }
      const pokemon = await response.json();
      return pokemon;
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
      throw error;
    }
  };

  const handleTeamSelection = (teamId) => {
    navigate(`/team/${teamId}`);
  };

  return (
    <div className="team-page">
      <div className="page-title">Teams</div>
      {teams.map((team, index) => (
        <Row key={index} className="team-row">
          <Row>
            <Button disabled variant="primary" onClick={() => handleTeamSelection(team.id)}>
              <h3>Trainer: {team.name} <br></br>Team naam: {team.teamName}</h3>
            </Button>
          </Row>
          <Row className="team-pokemon">
            {team.pokemon.map(pokemon => (
              <Col key={pokemon.id}>
                <PokemonCard
                  pokemon={pokemon}
                  selectedPokemons={[]}
                  disabled={true}
                />
              </Col>
            ))}
          </Row>
        </Row>
      ))}
    </div>
  );
}

export default TeamPage;