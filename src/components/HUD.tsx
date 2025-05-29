import React from 'react';
import { Pause } from 'lucide-react';

interface HUDProps {
  score: number;
  dashCooldown: number;
  isPaused: boolean;
  onPauseToggle: () => void;
}

const HUD: React.FC<HUDProps> = ({ 
  score, 
  dashCooldown, 
  isPaused, 
  onPauseToggle,
}) => {
  return (
    <div className="game-ui p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="bg-surface/50 backdrop-blur-sm px-4 py-2 rounded-lg mb-4">
            <p className="text-3xl font-orbitron text-primary">{score}</p>
          </div>
          
          <div className="bg-surface/50 backdrop-blur-sm px-4 py-2 rounded-lg">
            <h2 className="text-xl font-bold mb-1">Dash</h2>
            <div className="w-24 h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary"
                style={{ 
                  width: `${(1 - dashCooldown) * 100}%`,
                  transition: 'width 0.1s linear'
                }}
              />
            </div>
          </div>
        </div>
        
        <button
          onClick={onPauseToggle}
          className="bg-surface/50 backdrop-blur-sm p-3 rounded-full"
        >
          <Pause className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default HUD;