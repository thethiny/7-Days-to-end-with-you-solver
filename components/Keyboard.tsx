
import React from 'react';
import { KEYBOARD_ROWS } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  pressedKey?: string | null;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, onBackspace, onClear, pressedKey }) => {
  // Removed getAlphabetImageUrl; using font instead

  // Helper to check for special keys
  const getSpecialKey = (key: string) => {
    if (/^\[.*\]$/.test(key)) {
      return key.slice(1, -1).toUpperCase();
    }
    return null;
  };

  // Map special key to icon and handler
  const renderSpecialKey = (specialKey: string) => {
    switch (specialKey) {
      case 'BACKSPACE':
        return <i className="fa-solid fa-delete-left text-2xl" title="Backspace" />;
      case 'CLEAR':
        return <i className="fa-solid fa-trash-can text-2xl" title="Clear" />;
      // Add more special keys and icons as needed
      default:
        return <span>{specialKey}</span>;
    }
  };

  const handleSpecialKey = (specialKey: string) => {
    switch (specialKey) {
      case 'BACKSPACE':
        onBackspace();
        break;
      case 'CLEAR':
        onClear();
        break;
      // Add more special key handlers as needed
      default:
        break;
    }
  };

  return (
    <div className="w-full px-2 pb-6 bg-[#2b1b13] pt-4 border-t-4 border-[#4d3221] shadow-2xl keyboard-bottom-section">
      <div className="max-w-4xl mx-auto">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 mb-2">
            {row.map((key) => {
              const isPressed = pressedKey === key;
              const specialKey = getSpecialKey(key);
              if (specialKey) {
                return (
                  <button
                    key={key}
                    onClick={() => handleSpecialKey(specialKey)}
                    className={
                      `android-key flex-1 max-w-[55px] aspect-[4/5] rounded-lg overflow-hidden shadow-lg border-b-4 border-[#1a110c] transition-all relative bg-[#4d3221]` +
                      (isPressed ? ' border-b-0 translate-y-1' : ' active:border-b-0 active:translate-y-1')
                    }
                    style={{ borderTop: '2px solid #5d4231', ...(isPressed ? { zIndex: 2 } : {}) }}
                  >
                    <span className="w-full h-full flex items-center justify-center select-none">
                      {renderSpecialKey(specialKey)}
                    </span>
                  </button>
                );
              }
              return (
                <button
                  key={key}
                  onClick={() => onKeyPress(key)}
                  className={
                    `android-key flex-1 max-w-[55px] aspect-[4/5] rounded-lg overflow-hidden shadow-lg border-b-4 border-[#1a110c] transition-all relative ` +
                    (isPressed ? ' border-b-0 translate-y-1 bg-[#4d3221] ' : ' active:border-b-0 active:translate-y-1 active:bg-[#4d3221] ')
                  }
                  style={{ borderTop: '2px solid #5d4231', ...(isPressed ? { zIndex: 2 } : {}) }}
                >
                  <span
                    className="w-full h-full flex items-center justify-center font-7days text-4xl text-[#b08d66] select-none"
                    style={{ fontFamily: '7DaysToLiveWithYou, sans-serif' }}
                  >
                    {key}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;
