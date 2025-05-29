import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { HelpCircle, Trophy, Star, Play, Grid, Settings, X, Circle, Cat, Lock } from 'lucide-react';
import { useGameContext } from '../context/GameContext';
import { levels } from '../game/levels';
import DifficultySelector from '../components/DifficultySelector';

interface HomeSceneProps {
  onQuickPlay: () => void;
  onLevelSelect: () => void;
}

const HomeScene: React.FC<HomeSceneProps> = ({ onQuickPlay, onLevelSelect }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showHowToPlay, setShowHowToPlay] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const { levelProgress, endlessHighScore, setEndlessMode, playerCharacter, setPlayerCharacter, unlockedCharacters } = useGameContext();

  // Calculate total stars
  const totalStars = Object.values(levelProgress)
    .reduce((sum, level) => sum + (level.stars || 0), 0);

  useEffect(() => {
    const timeline = gsap.timeline();

    if (titleRef.current && buttonRef.current) {
      // Animate the title letters
      const letters = titleRef.current.querySelectorAll('.letter');
      timeline
        .from(letters, {
          y: -100,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'elastic.out(1, 0.5)',
        })
        .from(
          buttonRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.5)',
          },
          '-=0.5'
        );

      // Add continuous hover animation to the letters
      gsap.to(letters, {
        y: 5,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        stagger: {
          each: 0.1,
          repeat: -1
        }
      });
    }
  }, []);

  const handleEndlessMode = () => {
    setEndlessMode(true);
    onQuickPlay();
  };

  const handleLevelMode = () => {
    setEndlessMode(false);
    onLevelSelect();
  };

  const handleCharacterSelect = (character: 'ball' | 'cat') => {
    if (unlockedCharacters.includes(character)) {
      setPlayerCharacter(character);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 py-8"
    >
      {/* Background particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle absolute w-1 h-1 rounded-full bg-primary opacity-50"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(1px)',
          }}
        />
      ))}
      
      {/* Game Title */}
      <h1 
        ref={titleRef} 
        className="text-5xl sm:text-6xl md:text-8xl font-bold mb-12 text-center font-orbitron select-none relative"
      >
        <div className="inline-flex">
          <span className="letter text-blue-300 glow drop-shadow-[0_0_10px_rgba(147,197,253,0.5)]">Z</span>
          <span className="letter text-indigo-300 glow drop-shadow-[0_0_10px_rgba(165,180,252,0.5)]">I</span>
          <span className="letter text-violet-300 glow drop-shadow-[0_0_10px_rgba(196,181,253,0.5)]">P</span>
        </div>
        {' '}
        <div className="inline-block bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent">
          <span className="letter">G</span>
          <span className="letter">A</span>
          <span className="letter">M</span>
          <span className="letter">E</span>
        </div>
      </h1>

      <div className="flex flex-col items-center space-y-6 w-full max-w-md">
        {/* Stats Section */}
        <div className="bg-surface/50 backdrop-blur-sm p-4 rounded-lg w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center flex-1">
              <p className="text-sm text-gray-400">Endless Mode Best</p>
              <p className="text-2xl font-bold text-primary">{endlessHighScore}</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-sm text-gray-400">Total Stars</p>
              <div className="flex items-center justify-center space-x-1">
                <Star className="w-5 h-5 text-accent fill-accent" />
                <span className="text-2xl font-bold text-accent">{totalStars}</span>
                <span className="text-sm text-gray-400">/30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center space-y-3 w-full">
          {/* Play Button */}
          <button
            onClick={handleEndlessMode}
            className="btn btn-ghost text-lg w-full hover:bg-surface/20 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Play
          </button>

          {/* Challenge Levels Button */}
          <button
            onClick={handleLevelMode}
            className="btn btn-secondary text-xl px-8 py-4 w-full hover:bg-surface/80 transition-colors duration-200"
          >
            <div className="flex items-center justify-center space-x-2">
              <Grid className="w-6 h-6" />
              <span>CHALLENGE LEVELS</span>
            </div>
          </button>

          {/* Settings and Help Buttons */}
          <div className="flex space-x-2 w-full">
            <button
              onClick={() => setShowSettings(true)}
              className="btn btn-ghost text-lg flex-1 hover:bg-surface/20"
            >
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </button>

            <button
              onClick={() => setShowHowToPlay(true)}
              className="btn btn-ghost text-lg flex-1 hover:bg-surface/20"
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              How to Play
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20 p-4">
          <div className="bg-surface p-6 rounded-lg max-w-md mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Difficulty Settings */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Difficulty</h3>
                <DifficultySelector />
              </div>

              {/* Character Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Choose Your Character</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => handleCharacterSelect('ball')}
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      playerCharacter === 'ball'
                        ? 'bg-primary/20 border border-primary'
                        : 'bg-surface hover:bg-surface/70 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Circle className="w-8 h-8 text-primary" />
                      </div>
                      <div className="font-semibold text-xl">Classic Ball</div>
                    </div>
                    <div className="space-y-2 text-sm opacity-80">
                      <p>The original glowing orb with balanced attributes:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Standard movement speed</li>
                        <li>Regular dash cooldown (1.5s)</li>
                        <li>Stable and predictable physics</li>
                        <li>Perfect for learning the game</li>
                      </ul>
                    </div>
                  </button>

                  <button
                    onClick={() => handleCharacterSelect('cat')}
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      !unlockedCharacters.includes('cat')
                        ? 'opacity-75 cursor-not-allowed'
                        : playerCharacter === 'cat'
                        ? 'bg-primary/20 border border-primary'
                        : 'bg-surface hover:bg-surface/70 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center relative">
                        <Cat className="w-8 h-8 text-primary" />
                        {!unlockedCharacters.includes('cat') && (
                          <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                            <Lock className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-xl">Cyber Cat</div>
                        {!unlockedCharacters.includes('cat') && (
                          <div className="text-sm text-gray-400">
                            Unlock at 1000 points in Endless Mode
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm opacity-80">
                      <p>A swift cyber-cat for advanced players:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>20% faster movement speed</li>
                        <li>Quick dash cooldown (1s)</li>
                        <li>Leaves glowing paw trails</li>
                        <li>Higher skill ceiling, greater rewards</li>
                      </ul>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="btn mt-6 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20 p-4">
          <div className="bg-surface p-6 rounded-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-4">How to Play</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong>Movement:</strong> Use WASD or Arrow keys to move your character.
              </p>
              <p>
                <strong>Dash:</strong> Press SPACE to perform a quick dash in your movement direction.
              </p>
              <p>
                <strong>Game Modes:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Endless Mode:</strong> Play without limits and try to achieve the highest score!
                </li>
                <li>
                  <strong>Challenge Levels:</strong> Complete levels by reaching target scores and earn up to 3 stars based on your performance.
                </li>
              </ul>
            </div>
            <button
              onClick={() => setShowHowToPlay(false)}
              className="btn mt-6 w-full"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScene;