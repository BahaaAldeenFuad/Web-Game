import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGameContext } from '../context/GameContext';

interface GameOverSceneProps {
  score: number;
  onRetry: () => void;
  onHome: () => void;
}

const GameOverScene: React.FC<GameOverSceneProps> = ({ score, onRetry, onHome }) => {
  const { highScore } = useGameContext();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const isNewHighScore = score > 0 && score >= highScore;

  useEffect(() => {
    const timeline = gsap.timeline();
    
    timeline.fromTo(
      titleRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' }
    );
    
    timeline.fromTo(
      scoreRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
    );
    
    timeline.fromTo(
      buttonsRef.current?.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.3, ease: 'power2.out' }
    );

    if (isNewHighScore) {
      timeline.to('.highlight', {
        color: '#ffcc00',
        textShadow: '0 0 10px rgba(255, 204, 0, 0.7)',
        duration: 0.3,
        repeat: 5,
        yoyo: true,
      }, '-=0.5');
    }

    return () => {
      timeline.kill();
    };
  }, [isNewHighScore]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 overflow-hidden">
      <h1 
        ref={titleRef} 
        className="text-4xl md:text-6xl font-bold mb-8 text-center font-orbitron text-secondary glow-secondary"
      >
        GAME OVER
      </h1>
      
      <div 
        ref={scoreRef}
        className="bg-surface/70 backdrop-blur-sm p-8 rounded-lg mb-8 text-center w-full max-w-md"
      >
        <div className="mb-4">
          <p className="text-lg text-gray-300">Your Score</p>
          <p className={`text-4xl font-bold ${isNewHighScore ? 'highlight text-accent' : 'text-white'}`}>
            {score}
          </p>
          {isNewHighScore && (
            <p className="text-accent mt-2 font-bold">NEW HIGH SCORE!</p>
          )}
        </div>
        
        <div>
          <p className="text-lg text-gray-300">High Score</p>
          <p className="text-3xl font-bold text-primary">{highScore}</p>
        </div>
      </div>
      
      <div ref={buttonsRef} className="flex flex-col space-y-4 w-full max-w-xs">
        <button 
          onClick={onRetry}
          className="btn"
        >
          PLAY AGAIN
        </button>
        
        <button 
          onClick={onHome}
          className="btn btn-secondary"
        >
          MAIN MENU
        </button>
      </div>
    </div>
  );
};

export default GameOverScene;