import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap } from 'lucide-react';

interface ControlPadProps {
  onMove: (x: number, y: number) => void;
  onDash: () => void;
}

const ControlPad: React.FC<ControlPadProps> = ({ onMove, onDash }) => {
  return (
    <div className="control-pad">
      {/* Empty space */}
      <div></div>
      
      {/* Up button */}
      <button 
        className="control-btn" 
        onTouchStart={() => onMove(0, -1)}
      >
        <ArrowUp size={24} />
      </button>
      
      {/* Empty space */}
      <div></div>
      
      {/* Left button */}
      <button 
        className="control-btn" 
        onTouchStart={() => onMove(-1, 0)}
      >
        <ArrowLeft size={24} />
      </button>
      
      {/* Dash button */}
      <button 
        className="control-btn bg-primary/30" 
        onTouchStart={onDash}
      >
        <Zap size={24} className="text-primary" />
      </button>
      
      {/* Right button */}
      <button 
        className="control-btn" 
        onTouchStart={() => onMove(1, 0)}
      >
        <ArrowRight size={24} />
      </button>
      
      {/* Empty space */}
      <div></div>
      
      {/* Down button */}
      <button 
        className="control-btn" 
        onTouchStart={() => onMove(0, 1)}
      >
        <ArrowDown size={24} />
      </button>
      
      {/* Empty space */}
      <div></div>
    </div>
  );
};

export default ControlPad;