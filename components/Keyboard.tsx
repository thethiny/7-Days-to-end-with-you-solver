
import React from 'react';
import { KEYBOARD_ROWS } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, onBackspace, onClear }) => {
  const getAvatarUrl = (char: string) => 
    `https://ui-avatars.com/api/?name=${char}&background=b08d66&color=2b1b13&size=64&bold=true&rounded=true`;

  return (
    <div className="w-full px-2 pb-6 bg-[#2b1b13] pt-4 border-t-4 border-[#4d3221] shadow-2xl">
      <div className="max-w-4xl mx-auto">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 mb-2">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className="android-key flex-1 max-w-[55px] aspect-[4/5] rounded-lg overflow-hidden shadow-lg border-b-4 border-[#1a110c] active:border-b-0 active:translate-y-1 transition-all"
              >
                <img src={getAvatarUrl(key)} alt={key} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        ))}
        <div className="flex justify-center gap-3 mt-4 px-4">
          <button 
            onClick={onBackspace}
            className="flex-1 max-w-xs bg-[#4d3221] hover:bg-[#5d4231] text-[#b08d66] py-3 rounded-lg font-bold flex items-center justify-center gap-2 uppercase text-xs tracking-widest border-b-4 border-[#1a110c] active:border-b-0"
          >
            <i className="fa-solid fa-delete-left"></i> Delete
          </button>
          <button 
            onClick={onClear}
            className="flex-1 max-w-xs bg-[#4d3221] hover:bg-[#5d4231] text-[#b08d66] py-3 rounded-lg font-bold flex items-center justify-center gap-2 uppercase text-xs tracking-widest border-b-4 border-[#1a110c] active:border-b-0"
          >
            <i className="fa-solid fa-trash-can"></i> Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
