import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/Navgiation';
import HomePage from './views/HomePage';
import PokemonPage from './views/PokemonPage';
import TeamPage from './views/TeamPage';
import CompareTeamPage from './views/CompareTeamPage';
import TeamDetailPage from './views/TeamDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <NavigationBar />
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pokemon" element={<PokemonPage />} />
          <Route path="/teams" element={<TeamPage />} />
          <Route path="/teams/:teamId" element={<TeamDetailPage />} />
          <Route path="/pokemon/:pokemonId" element={<PokemonPage />} />
          <Route path='/battle' element={<CompareTeamPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;