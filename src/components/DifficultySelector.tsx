import React from 'react';
import { useGameContext } from '../context/GameContext';

const difficultyInfo = {
  easy: {
    name: 'Easy',
    description: 'Perfect for beginners. Slower obstacles and more forgiving gameplay.',
  },
  medium: {
    name: 'Medium',
    description: 'Balanced challenge with moderate speed and obstacle frequency.',
  },
  hard: {
    name: 'Hard',
    description: 'For experienced players. Fast-paced with frequent obstacles.',
  },
} as const;

const DifficultySelector: React.FC = () => {
  const { difficulty, setDifficulty } = useGameContext();

  return (
    <div className="space-y-3">
      {(['easy', 'medium', 'hard'] as const).map((level) => (
        <button
          key={level}
          onClick={() => setDifficulty(level)}
          className={`w-full p-4 rounded-lg transition-all duration-200 text-left ${
            difficulty === level
              ? 'bg-primary/20 border border-primary'
              : 'bg-surface hover:bg-surface/70 border border-transparent'
          }`}
        >
          <div className="flex flex-col">
            <span className={`text-lg font-semibold ${
              difficulty === level ? 'text-primary' : 'text-gray-300'
            }`}>
              {difficultyInfo[level].name}
            </span>
            <span className="text-sm text-gray-400 mt-1">
              {difficultyInfo[level].description}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;