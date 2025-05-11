import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Spinner, Button, Alert } from 'react-bootstrap';
import PokemonCard from '../components/PokemonCard';
import './CompareTeamPage.css';

function CompareTeamPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { teamIds } = location.state || {};
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!teamIds || teamIds.length !== 2) {
            setErrorMessage('Er zijn geen twee teams geselecteerd!');
            setIsLoading(false);
            return;
        }
        fetchTeams();
    }, [teamIds]);

    const fetchTeams = async () => {
        try {
            const teamPromises = teamIds.map(fetchTeamById);
            const fetchedTeams = await Promise.all(teamPromises);
            setTeams(fetchedTeams);
        } catch (error) {
            console.error('Error fetching teams:', error);
            setErrorMessage('Er is een fout opgetreden bij het ophalen van de teams.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTeamById = async (id) => {
        try {
            const response = await fetch(`https://teamapi-anamh5fgbyavc9a4.canadacentral-01.azurewebsites.net/api/Team/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch team');
            }
            const team = await response.json();
            const pokemonPromises = team.pokemonIds.map(fetchPokemonById);
            const pokemonData = await Promise.all(pokemonPromises);
            return { ...team, pokemon: pokemonData };
        } catch (error) {
            console.error('Error fetching team:', error);
            throw error;
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

    const [selectedPokemon, setSelectedPokemon] = useState([null, null]);
    const [battleResult, setBattleResult] = useState('');

    const handleSelectPokemon = (teamIndex, pokemon) => {
        const newSelection = [...selectedPokemon];
        newSelection[teamIndex] = pokemon;
        setSelectedPokemon(newSelection);
    };

    const handleBattle = () => {
        if (selectedPokemon[0] && selectedPokemon[1]) {
            const calculatePower = (pokemon, opponentType) => {
                const attack = pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_Stat || 0;
                const defense = pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_Stat || 0;
                const speed = pokemon.stats.find(stat => stat.stat.name === 'speed')?.base_Stat || 0;

                // Kracht berekenen, ITS OVER 9000!
                let power = attack * 2 + defense + speed;

                // Power aanpassen op basis van type-effectiviteit
                const typeEffectiveness = (pokemon.types || []).reduce((effectiveness, type) => {
                    const typeName = type.type.name;
                    if (opponentType.some(opType => isWeakAgainst(typeName, opType))) {
                        return effectiveness * 0.5;
                    } else if (opponentType.some(opType => isStrongAgainst(typeName, opType))) {
                        return effectiveness * 2;
                    }
                    return effectiveness;
                }, 1);

                return power * typeEffectiveness;
            };

            // Type-effectiviteit controleren
            const isWeakAgainst = (type, opponentType) => {
                const weaknesses = {
                    fire: ['water', 'rock', 'ground'],
                    water: ['electric', 'grass'],
                    grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
                    electric: ['ground'],
                    ground: ['water', 'grass', 'ice'],
                    rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
                };
                return weaknesses[type]?.includes(opponentType);
            };

            // Type-effectiviteit controleren
            const isStrongAgainst = (type, opponentType) => {
                const strengths = {
                    fire: ['grass', 'bug', 'ice', 'steel'],
                    water: ['fire', 'rock', 'ground'],
                    grass: ['water', 'rock', 'ground'],
                    electric: ['water', 'flying'],
                    ground: ['electric', 'fire', 'rock', 'steel', 'poison'],
                    rock: ['fire', 'ice', 'flying', 'bug'],
                };
                return strengths[type]?.includes(opponentType);
            };

            const power1 = calculatePower(selectedPokemon[0], selectedPokemon[1].types.map(type => type.type.name));
            const power2 = calculatePower(selectedPokemon[1], selectedPokemon[0].types.map(type => type.type.name));

            console.log('Power 1:', power1);
            console.log('Power 2:', power2);
            if (power1 > power2) {
                setBattleResult(`${selectedPokemon[0].name} wint!`);
            } else if (power1 < power2) {
                setBattleResult(`${selectedPokemon[1].name} wint!`);
            } else {
                setBattleResult('Het is een gelijkspel!');
            }
        } else {
            setBattleResult('Selecteer een Pokémon van beide teams om te vechten.');
        }
    };

    return (
        <div className="compare-team-page">
            <div className="page-title">Pokémon Battle</div>
            <div className="page-subtitle">Selecteer een Pokémon van elk team om te vechten!</div>
            <div className="selected-pokemons">
                <h3>Geselecteerde Pokémon:</h3>
                {selectedPokemon.map((pokemon, index) => (
                    <div key={index} className="selected-pokemon">
                        {pokemon ? (
                            <PokemonCard
                                pokemon={pokemon}
                                selectedPokemons={selectedPokemon}
                                disabled={true}
                            />
                        ) : (
                            <div className="no-pokemon">Geen Pokémon geselecteerd</div>
                        )}
                    </div>
                ))}
            </div>
            <div className='battle-button-container'>
                <Button variant="primary" onClick={handleBattle} className="battle-button">
                    Laat ze vechten!
                </Button>
            </div>

            {battleResult && <div className="battle-result">{battleResult}</div>}

            {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
                    {errorMessage}
                </Alert>
            )}
            {isLoading ? (
                <Spinner animation="border" role="status" />
            ) : (
                <div className="teams-container">
                    {teams.map((team, teamIndex) => (
                        <div key={teamIndex} className="team-section">
                            <div className="team-header">
                                <h3>Trainer: {team.name}</h3>
                                <h4>Team naam: {team.teamName}</h4>
                            </div>
                            <Row className="team-pokemon">
                                {team.pokemon.map((pokemon) => (
                                    <Col key={pokemon.id}>
                                        <PokemonCard
                                            pokemon={pokemon}
                                            selectedPokemons={selectedPokemon}
                                            disabled={false}
                                            onToggleSelect={() => handleSelectPokemon(teamIndex, pokemon)}
                                        />
                                        {selectedPokemon[teamIndex]?.id === pokemon.id && (
                                            <div className="selected-indicator">Geselecteerd</div>
                                        )}
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    ))}
                </div>
            )}

            
            <Button variant="secondary" onClick={() => navigate('/teams')}>
                Terug naar Teams
            </Button>
        </div>
    );
}

export default CompareTeamPage;