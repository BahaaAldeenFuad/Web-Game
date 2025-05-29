import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { levels, LevelConfig } from '../game/levels';

type Difficulty = 'easy' | 'medium' | 'hard';
type PlayerCharacter = 'ball' | 'cat';

interface LevelProgress {
  stars: number;
  highScore: number;
  unlocked: boolean;
  completed: boolean;
}

export interface GameContextType {
  currentLevel: number;
  setCurrentLevel: (level: number) => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  endlessHighScore: number;
  setEndlessHighScore: (score: number) => void;
  isEndlessMode: boolean;
  setEndlessMode: (isEndless: boolean) => void;
  playerCharacter: PlayerCharacter;
  setPlayerCharacter: (character: PlayerCharacter) => void;
  levelProgress: { [key: number]: LevelProgress };
  updateLevelProgress: (level: number, score: number) => void;
  getLevelConfig: (level: number) => LevelConfig;
  unlockedCharacters: PlayerCharacter[];
  unlockCharacter: (character: PlayerCharacter) => void;
}

interface GameProviderProps {
  children: ReactNode;
}

export const GameContext = React.createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    return (localStorage.getItem('zipGameDifficulty') as Difficulty) || 'medium';
  });
  const [endlessHighScore, setEndlessHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('zipGameEndlessHighScore') || '0', 10);
  });
  const [isEndlessMode, setEndlessMode] = useState<boolean>(true);
  const [playerCharacter, setPlayerCharacter] = useState<PlayerCharacter>(() => {
    return (localStorage.getItem('zipGameCharacter') as PlayerCharacter) || 'ball';
  });
  const [unlockedCharacters, setUnlockedCharacters] = useState<PlayerCharacter[]>(() => {
    const saved = localStorage.getItem('zipGameUnlockedCharacters');
    if (saved) {
      return JSON.parse(saved);
    }
    return ['ball']; // Ball is always unlocked by default
  });
  const [levelProgress, setLevelProgress] = useState<{ [key: number]: LevelProgress}>(() => {
    const savedProgress = localStorage.getItem('zipGameLevelProgress');
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }
    // Initialize first level as unlocked
    return {
      1: { stars: 0, highScore: 0, unlocked: true, completed: false }
    };
  });

  // Save difficulty setting
  useEffect(() => {
    localStorage.setItem('zipGameDifficulty', difficulty);
  }, [difficulty]);

  // Save endless mode high score
  useEffect(() => {
    localStorage.setItem('zipGameEndlessHighScore', endlessHighScore.toString());
  }, [endlessHighScore]);

  // Save character selection
  useEffect(() => {
    localStorage.setItem('zipGameCharacter', playerCharacter);
  }, [playerCharacter]);

  // Save level progress
  useEffect(() => {
    localStorage.setItem('zipGameLevelProgress', JSON.stringify(levelProgress));
  }, [levelProgress]);

  // Save unlocked characters
  useEffect(() => {
    localStorage.setItem('zipGameUnlockedCharacters', JSON.stringify(unlockedCharacters));
  }, [unlockedCharacters]);

  const updateLevelProgress = (levelId: number, score: number) => {
    setLevelProgress(prev => {
      const level = levels[levelId - 1];
      const currentProgress = prev[levelId] || { stars: 0, highScore: 0, unlocked: false, completed: false };
      const newStars = level.starThresholds.reduce((stars, threshold) => 
        score >= threshold ? stars + 1 : stars, 0);
      
      // Determine if next level should be unlocked
      const nextLevelId = levelId + 1;
      let nextLevel = prev[nextLevelId];
      if (score >= level.targetScore && nextLevelId <= levels.length) {
        nextLevel = {
          ...(nextLevel || { stars: 0, highScore: 0, completed: false }),
          unlocked: true
        };
      }

      return {
        ...prev,
        [levelId]: {
          ...currentProgress,
          stars: Math.max(currentProgress.stars, newStars),
          highScore: Math.max(currentProgress.highScore, score),
          completed: score >= level.targetScore
        },
        ...(nextLevel ? { [nextLevelId]: nextLevel } : {})
      };
    });
  };

  const updateEndlessHighScore = (score: number) => {
    setEndlessHighScore(score);
    if (score >= 10000 && !unlockedCharacters.includes('cat')) {
      setUnlockedCharacters(prev => [...prev, 'cat']);
    }
  };

  const getLevelConfig = (levelId: number): LevelConfig => {
    return levels[levelId - 1];
  };

  // Function to unlock a character
  const unlockCharacter = (character: PlayerCharacter) => {
    if (!unlockedCharacters.includes(character)) {
      setUnlockedCharacters(prev => [...prev, character]);
    }
  };

  return (
    <GameContext.Provider
      value={{
        currentLevel,
        setCurrentLevel,
        difficulty,
        setDifficulty,
        endlessHighScore,
        setEndlessHighScore: updateEndlessHighScore,
        isEndlessMode,
        setEndlessMode,
        playerCharacter,
        setPlayerCharacter,
        levelProgress,
        updateLevelProgress,
        getLevelConfig,
        unlockedCharacters,
        unlockCharacter,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
