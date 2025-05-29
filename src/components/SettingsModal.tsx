import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useGameContext } from '../context/GameContext';

interface SettingsModalProps {
  onClose: () => void;
}

interface SettingsSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
      >
        <h3 className="text-sm font-semibold">{title}</h3>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-3 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { difficulty, setDifficulty, playerCharacter, setPlayerCharacter, unlockedCharacters } = useGameContext();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface w-[90%] max-w-sm mx-auto my-2 rounded-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-none border-b border-white/10">
          <div className="flex justify-between items-center p-3">
            <h2 className="text-lg font-bold text-primary">Settings</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Difficulty Settings */}
          <SettingsSection title="Difficulty">
            <div className="space-y-2">
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`w-full p-2 rounded-lg text-left transition-colors ${
                    difficulty === level
                      ? 'bg-primary text-black'
                      : 'bg-surface hover:bg-surface/70'
                  }`}
                >
                  <div className="font-semibold capitalize text-sm mb-0.5">{level}</div>
                  <div className="text-xs opacity-80">
                    {level === 'easy' && "Perfect for beginners - slower obstacles and more forgiving gameplay"}
                    {level === 'medium' && "Balanced challenge - standard speed and regular gameplay"}
                    {level === 'hard' && "For experienced players - faster obstacles and intense action"}
                  </div>
                </button>
              ))}
            </div>
          </SettingsSection>

          {/* Character Selection */}
          <SettingsSection title="Choose Your Character">
            <div className="space-y-2">
              <button
                onClick={() => setPlayerCharacter('ball')}
                className={`w-full p-2 rounded-lg text-left transition-colors ${
                  playerCharacter === 'ball'
                    ? 'bg-primary text-black'
                    : 'bg-surface hover:bg-surface/70'
                }`}
              >
                <div className="font-semibold text-sm mb-1">Classic Ball</div>
                <div className="space-y-1 text-xs opacity-80">
                  <p>The original glowing orb with balanced attributes:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Standard movement speed</li>
                    <li>Regular dash cooldown (1.5s)</li>
                    <li>Stable and predictable physics</li>
                    <li>Perfect for learning the game</li>
                  </ul>
                </div>
              </button>

              <button
                onClick={() => unlockedCharacters.includes('cat') && setPlayerCharacter('cat')}
                className={`w-full p-2 rounded-lg text-left transition-colors relative ${
                  playerCharacter === 'cat'
                    ? 'bg-primary text-black'
                    : 'bg-surface hover:bg-surface/70'
                } ${!unlockedCharacters.includes('cat') ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                <div className="font-semibold text-sm mb-1 flex items-center gap-2">
                  Cyber Cat
                  {!unlockedCharacters.includes('cat') && (
                    <div className="inline-flex items-center gap-1 text-xs bg-secondary/20 text-secondary px-1.5 py-0.5 rounded">
                      <X className="w-3 h-3" />
                      Locked
                    </div>
                  )}
                </div>
                <div className="space-y-1 text-xs opacity-80">
                  <p>A swift cyber-cat for advanced players:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>20% faster movement speed</li>
                    <li>Quick dash cooldown (1s)</li>
                    <li>Leaves glowing paw trails</li>
                    <li>Higher skill ceiling, greater rewards</li>
                  </ul>
                  {!unlockedCharacters.includes('cat') && (
                    <p className="mt-1 text-secondary">
                      Score 10000+ in endless mode to unlock!
                    </p>
                  )}
                </div>
              </button>
            </div>
          </SettingsSection>
        </div>

        {/* Footer */}
        <div className="flex-none border-t border-white/10 p-3">
          <button
            onClick={onClose}
            className="w-full p-2 bg-surface border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-sm font-semibold"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 
