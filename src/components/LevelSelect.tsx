import React from 'react';
import { Star, Trophy, Target } from 'lucide-react';
import { useGameContext } from '../context/GameContext';
import { levels } from '../game/levels';

interface LevelSelectProps {
  onStartGame: () => void;
  onBack: () => void;
}

const LevelSelect: React.FC<LevelSelectProps> = ({ onStartGame, onBack }) => {
  const { currentLevel, setCurrentLevel, levelProgress } = useGameContext();

  const handleLevelSelect = (levelId: number) => {
    if (levelProgress[levelId]?.unlocked) {
      setCurrentLevel(levelId);
      onStartGame();
    }
  };

  const renderStars = (levelId: number, level: typeof levels[0]) => {
    const progress = levelProgress[levelId];
    const stars = progress?.stars || 0;

    return (
      <div className="space-y-2">
        <div className="flex justify-center space-x-1">
          {[1, 2, 3].map((starNumber) => (
            <Star
              key={starNumber}
              className={`w-8 h-8 ${
                starNumber <= stars
                  ? 'text-accent fill-accent'
                  : 'text-gray-600'
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-gray-400 space-y-1">
          {level.starThresholds.map((threshold, index) => (
            <p key={index} className={`${stars > index ? 'text-accent' : ''}`}>
              {index + 1} Star: {threshold.toLocaleString()} points
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen flex flex-col p-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-orbitron text-primary">Select Level</h2>
        <button onClick={onBack} className="btn btn-secondary">
          Back
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {levels.map((level) => {
            const progress = levelProgress[level.id];
            const isUnlocked = progress?.unlocked || false;
            const highScore = progress?.highScore || 0;

            return (
              <div
                key={level.id}
                className={`bg-surface p-6 rounded-lg ${
                  isUnlocked
                    ? 'cursor-pointer hover:bg-surface/70'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => handleLevelSelect(level.id)}
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    Level {level.id}
                  </h3>
                  <p className="text-gray-400 text-lg">{level.name}</p>
                </div>

                <div className="bg-surface/50 backdrop-blur-sm p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-primary" />
                    <p className="text-lg font-semibold">
                      Target: <span className="text-primary">{level.targetScore.toLocaleString()}</span>
                    </p>
                  </div>
                  {renderStars(level.id, level)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <p className="text-sm">
                      Best: <span className="text-yellow-400">{highScore.toLocaleString()}</span>
                    </p>
                  </div>
                  {!isUnlocked && (
                    <p className="text-sm text-secondary text-center">
                      Complete previous level to unlock
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelSelect; 