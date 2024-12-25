import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import PlayerSetup from './components/PlayerSetup';
import QuestionDisplay from './components/QuestionDisplay';
import Leaderboard from './components/Leaderboard';
import Results from './components/Results';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [gameState, setGameState] = useState({
    currentPlayer: null,
    score: 0,
    settings: {
      enableTimer: true,
      difficulty: 'medium'
    }
  });

  const updateSettings = (newSettings) => {
    setGameState(prev => ({
      ...prev,
      settings: newSettings
    }));
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/setup" element={<PlayerSetup />} />
          <Route 
            path="/game" 
            element={
              <QuestionDisplay 
                settings={gameState.settings}
                score={gameState.score}
              />
            } 
          />
          <Route 
            path="/results" 
            element={<Results />} 
          />
          <Route 
            path="/leaderboard" 
            element={<Leaderboard />} 
          />
          <Route 
            path="/settings" 
            element={
              <Settings 
                settings={gameState.settings}
                updateSettings={updateSettings}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
