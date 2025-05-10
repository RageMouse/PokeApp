import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import PokemonCard from '../components/PokemonCard';
import './TeamDetail.css';

function TeamDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { teamId } = location.state || {};
    const [team, setTeam] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        console.log('Team ID from location state:', teamId);
        if (teamId) {
            fetchTeamDetails(teamId);
        } else {
            setErrorMessage('Geen team geselecteerd!');
            setIsLoading(false);
        }
    }, [teamId]);

    const fetchTeamDetails = async (id) => {
        console.log('Fetching team details for ID:', id);
        try {
            const response = await fetch(`https://teamapi-anamh5fgbyavc9a4.canadacentral-01.azurewebsites.net/api/Team/${id}`);
            if (response.ok) {
                const teamData = await response.json();
                const pokemonData = await Promise.all(teamData.pokemonIds.map(fetchPokemonById));
                setTeam({ ...teamData, pokemon: pokemonData });
            } else {
                throw new Error('Failed to fetch team details');
            }
        } catch (error) {
            console.error('Error fetching team details:', error);
            setErrorMessage('Fout bij het ophalen van teamgegevens.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPokemonById = async (id) => {
        try {
            const response = await fetch(`https://pokeapi-pokemon-fafna8hxe2asa9f6.germanywestcentral-01.azurewebsites.net/api/pokemon/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch Pokémon');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching Pokémon:', error);
            throw error;
        }
    };

    return (
        <div className="team-detail-container">
            <div className="team-detail-title">Team Details</div>
            {isLoading ? (
                <Spinner animation="border" role="status">
                </Spinner>
            ) : errorMessage ? (
                <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
                    {errorMessage}
                </Alert>
            ) : team ? (
                <div>
                    <h2>Trainer: {team.name}</h2>
                    <h3>Teamnaam: {team.teamName}</h3>
                    <Row className="team-detail-pokemon">
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
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        Terug
                    </Button>
                </div>
            ) : (
                <Alert variant="warning">Geen teamgegevens beschikbaar.</Alert>
            )}
        </div>
    );
}

export default TeamDetail;