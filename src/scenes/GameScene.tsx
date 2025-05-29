import React, { useEffect, useRef, useState } from 'react';
import { useGameEngine } from '../game/useGameEngine';
import { useGameContext } from '../context/GameContext';
import ControlPad from '../components/ControlPad';
import HUD from '../components/HUD';
import GameOverScreen from '../components/GameOverScreen';

interface GameSceneProps {
  onGameOver: (score: number) => void;
}

const GameScene: React.FC<GameSceneProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentLevel, updateLevelProgress, getLevelConfig, isEndlessMode } = useGameContext();
  const levelConfig = getLevelConfig(currentLevel);
  const [score, setScore] = useState(0);
  const [dashCooldown, setDashCooldown] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'collision' | 'completion' | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());

  const handleGameOver = (finalScore: number, reason: 'collision' | 'completion' = 'collision') => {
    if (!isEndlessMode) {
      updateLevelProgress(currentLevel, finalScore);
    }
    setScore(finalScore);
    setGameOverReason(reason);
    setShowGameOver(true);
  };

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    // Check for level completion in challenge mode
    if (!isEndlessMode && newScore >= levelConfig.targetScore) {
      handleGameOver(newScore, 'completion');
    }
  };

  const handleDashCooldownUpdate = (cooldown: number) => {
    setDashCooldown(cooldown);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleRestart = () => {
    setShowGameOver(false);
    setGameOverReason(null);
    setScore(0);
    setIsPaused(false);
    resetGame();
  };

  const handleHome = () => {
    // Only call onGameOver for endless mode or collision
    if (isEndlessMode || gameOverReason === 'collision') {
      onGameOver(score);
    } else {
      // For level completion, just go home directly
      onGameOver(0);
    }
  };

  const { movePlayer, dashPlayer, resetGame } = useGameEngine({
    canvasRef,
    containerRef,
    levelConfig,
    onGameOver: (finalScore) => handleGameOver(finalScore, 'collision'),
    onScoreUpdate: handleScoreUpdate,
    onDashCooldownUpdate: handleDashCooldownUpdate,
    isPaused: isPaused || showGameOver,
  });

  const updatePlayerMovement = () => {
    let dx = 0;
    let dy = 0;

    if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a') || keysPressed.current.has('A')) {
      dx -= 1;
    }
    if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d') || keysPressed.current.has('D')) {
      dx += 1;
    }
    if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('w') || keysPressed.current.has('W')) {
      dy -= 1;
    }
    if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('s') || keysPressed.current.has('S')) {
      dy += 1;
    }

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const magnitude = Math.sqrt(dx * dx + dy * dy);
      dx /= magnitude;
      dy /= magnitude;
    }

    movePlayer(dx, dy);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (showGameOver) return; // Disable controls when game is over
    
    if (e.key === ' ') {
      dashPlayer();
    } else if (e.key === 'Escape') {
      togglePause();
    } else {
      keysPressed.current.add(e.key);
      updatePlayerMovement();
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    keysPressed.current.delete(e.key);
    updatePlayerMovement();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      keysPressed.current.clear();
    };
  }, [dashCooldown, isPaused, showGameOver]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full flex flex-col bg-background">
      <div className="relative flex-1">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
          style={{ touchAction: 'none' }}
        />
        
        <HUD 
          score={score} 
          dashCooldown={dashCooldown} 
          isPaused={isPaused}
          onPauseToggle={togglePause}
        />
        
        <ControlPad onMove={movePlayer} onDash={dashPlayer} />
      </div>
      
      {isPaused && !showGameOver && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="bg-surface p-6 rounded-lg max-w-md mx-auto text-center">
            <h2 className="text-4xl font-orbitron text-primary mb-4">PAUSED</h2>
            <p className="mb-2 text-lg">Level {currentLevel}</p>
            <p className="mb-6 text-lg">Current Score: {score}</p>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={togglePause}
                className="btn"
              >
                RESUME
              </button>
              <button 
                onClick={() => onGameOver(score)}
                className="btn btn-secondary"
              >
                QUIT
              </button>
            </div>
          </div>
        </div>
      )}

      {showGameOver && (
        <GameOverScreen
          score={score}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}
    </div>
  );
};

export default GameScene;