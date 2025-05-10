import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import PokemonCard from '../components/PokemonCard';
import { useNavigate } from 'react-router-dom';
import './TeamPage.css';

function TeamPage() {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('https://teamapi-anamh5fgbyavc9a4.canadacentral-01.azurewebsites.net/api/Team');
      if (response.ok) {
        const teamsData = await response.json();
        const teamsWithPokemon = await Promise.all(teamsData.map(fetchPokemonForTeam));
        setTeams(teamsWithPokemon);
      } else {
        setTeams([]);
      }
    } catch (error) {
      console.error('Error fetching teams data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPokemonForTeam = async (team) => {
    try {
      const pokemonPromises = team.pokemonIds.map(fetchPokemonById);
      const pokemonData = await Promise.all(pokemonPromises);
      return { ...team, pokemon: pokemonData };
    } catch (error) {
      console.error('Error fetching Pokémon data for team:', error);
      return team;
    }
  };

  const fetchPokemonById = async (id) => {
    try {
      const response = await fetch(`https://pokeapi-pokemon-fafna8hxe2asa9f6.germanywestcentral-01.azurewebsites.net/api/pokemon/${id}`);
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
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter(id => id !== teamId));
      setErrorMessage('');
    } else if (selectedTeams.length < 2) {
      setSelectedTeams([...selectedTeams, teamId]);
      setErrorMessage('');
    } else {
      setErrorMessage('Je kan maar 2 teams selecteren!');
    }
  };

  return (
    <div className="team-page">
      <div className="page-title">Teams</div>
      <div className="page-subtitle">Selecteer 2 teams om tegen elkaar te laten vechten!</div>
      <div>
        <h3>Geselecteerde teams:</h3>
        {selectedTeams.map((teamId, index) => (
          <div key={index} className="selected-team">
            Trainer: {teams.find(team => team.id === teamId)?.name} <br/> Teamnaam: {teams.find(team => team.id === teamId)?.teamName}
          </div>
        ))}
      </div>
      <Button
        className='battle-button'
        variant="secondary"
        onClick={() => {
          if (selectedTeams.length === 2) {
            navigate('/battle', { state: { teamIds: selectedTeams } });
          } else {
            setErrorMessage('Selecteer 2 teams om te vechten!');
          }
        }}
        disabled={selectedTeams.length !== 2}
      >
        Ga naar de battle!
      </Button>

      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
          {errorMessage}
        </Alert>
      )}
      {isLoading ? (
        <Spinner animation="border" role="status">
        </Spinner>
      ) : (
        teams.map((team, index) => (
          <Row key={index} className="team-row">
            <Row>
              <Button
                variant={selectedTeams.includes(team.id) ? "success" : "primary"}
                onClick={() => handleTeamSelection(team.id)}
              >
                <h3>Trainer: {team.name} <br />Team naam: {team.teamName}</h3>
              </Button>
              <Button
                variant="info"
                onClick={() => navigate(`/teams/${team.id}`, { state: { teamId: team.id } })}
                className="detail-button"
              >
                Bekijk details
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
        ))
      )}
    </div>
  );
}

export default TeamPage;