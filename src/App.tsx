import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import HomeScene from './scenes/HomeScene';
import GameScene from './scenes/GameScene';
import LevelSelect from './components/LevelSelect';

export type GameState = 'home' | 'levelSelect' | 'game';

function App() {
  const [gameState, setGameState] = useState<GameState>('home');
  const [key, setKey] = useState(0); // Add a key for forcing re-renders

  const handleQuickPlay = () => {
    setGameState('game');
  };

  const handleStartGame = () => {
    setGameState('game');
  };

  const handleGameOver = (finalScore: number) => {
    setKey(prev => prev + 1); // Increment key to force re-render
    setGameState('home');
  };

  const handleHome = () => {
    setKey(prev => prev + 1); // Increment key to force re-render
    setGameState('home');
  };

  const handleLevelSelect = () => {
    setKey(prev => prev + 1); // Increment key to force re-render
    setGameState('levelSelect');
  };

  return (
    <GameProvider>
      <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden">
        {gameState === 'home' && (
          <HomeScene 
            key={`home-${key}`}
            onQuickPlay={handleQuickPlay}
            onLevelSelect={handleLevelSelect} 
          />
        )}
        {gameState === 'levelSelect' && (
          <LevelSelect 
            key={`level-select-${key}`}
            onStartGame={handleStartGame} 
            onBack={handleHome} 
          />
        )}
        {gameState === 'game' && (
          <GameScene 
            key={`game-${key}`}
            onGameOver={handleGameOver} 
          />
        )}
      </div>
    </GameProvider>
  );
}

export default App;