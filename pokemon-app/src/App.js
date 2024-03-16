import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/Navgiation';
import HomePage from './views/HomePage';
import PokemonPage from './views/PokemonPage';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;