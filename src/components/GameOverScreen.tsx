import React, { useEffect } from 'react';
import { Star, RotateCcw, Home, Trophy } from 'lucide-react';
import { gsap } from 'gsap';
import { useGameContext } from '../context/GameContext';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  onHome: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart, onHome }) => {
  const { 
    isEndlessMode, 
    currentLevel, 
    getLevelConfig, 
    endlessHighScore, 
    setEndlessHighScore 
  } = useGameContext();
  
  const levelConfig = !isEndlessMode ? getLevelConfig(currentLevel) : null;
  const isNewHighScore = isEndlessMode && score > endlessHighScore;

  // Update high score if in endless mode and score is higher
  useEffect(() => {
    if (isEndlessMode && score > endlessHighScore) {
      setEndlessHighScore(score);
    }
  }, [score, isEndlessMode, endlessHighScore, setEndlessHighScore]);

  useEffect(() => {
    // Create a timeline for sequential animations
    const timeline = gsap.timeline();

    // Animate the score counter
    timeline.from('.score-value', {
      textContent: 0,
      duration: 1.5,
      snap: { textContent: 1 },
      ease: 'power1.out'
    });

    if (!isEndlessMode && levelConfig) {
      // Animate each star with a pop effect and glow
      timeline.from('.star', {
        scale: 0,
        opacity: 0,
        rotation: -180,
        duration: 0.5,
        stagger: 0.3,
        ease: 'back.out(2)',
        onStart: (i) => {
          if (levelConfig && i < levelConfig.starThresholds.length) {
            gsap.to(`.star-${i + 1}`, {
              filter: 'drop-shadow(0 0 10px #FFD700)',
              duration: 0.3,
              yoyo: true,
              repeat: 1
            });
          }
        }
      });
    }
  }, [score, levelConfig, isEndlessMode]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface p-8 rounded-xl max-w-md w-full mx-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-primary">
          {isEndlessMode ? 'Game Over!' : levelConfig?.name}
        </h2>

        <div className="bg-surface/50 backdrop-blur-sm p-4 rounded-lg mb-6">
          <p className="text-gray-400 mb-2">Your Score</p>
          <p className="text-4xl font-bold text-white">{score}</p>
          
          {isEndlessMode && (
            <div className="mt-4">
              <p className="text-gray-400 mb-2">High Score</p>
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <p className="text-3xl font-bold text-yellow-400">
                  {Math.max(endlessHighScore, score)}
                </p>
              </div>
              {isNewHighScore && (
                <p className="text-green-400 mt-2 font-bold">New High Score! 🎉</p>
              )}
            </div>
          )}

          {!isEndlessMode && levelConfig && (
            <>
              <p className="text-gray-400 mt-4 mb-2">
                Target Score: {levelConfig.targetScore}
              </p>
              <div className="flex justify-center gap-4 my-4">
                {[1, 2, 3].map((starIndex) => (
                  <Star
                    key={starIndex}
                    className={`w-8 h-8 ${
                      score >= (levelConfig.starThresholds[starIndex - 1] || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              {score >= levelConfig.targetScore && (
                <p className="text-green-400 mt-2 font-bold">Level Complete! 🎮</p>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={onRestart}
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          <button
            onClick={onHome}
            className="btn btn-ghost flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen; 