
import React from 'react';

interface LetterTileProps {
  letter: string | null;
  revealed: boolean;
  status?: 'correct' | 'wrong' | 'default';
}

const LetterTile: React.FC<LetterTileProps> = ({ letter, revealed, status = 'default' }) => {
  const bgColors: Record<string, string> = {
    correct: '4CAF50',
    wrong: 'F44336',
    default: '374151'
  };

  const bgColor = bgColors[status];
  const avatarUrl = letter 
    ? `https://ui-avatars.com/api/?name=${letter}&background=${bgColor}&color=fff&size=128&bold=true`
    : null;

  return (
    <div className={`w-12 h-16 md:w-16 md:h-20 flex items-center justify-center rounded-lg shadow-lg border-2 border-slate-700 overflow-hidden transition-all duration-500 transform ${revealed ? 'rotate-0' : 'rotate-y-180 bg-slate-800'}`}>
      {revealed && letter ? (
        <img src={avatarUrl!} alt={letter} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
           <div className="w-4 h-1 bg-slate-600 rounded"></div>
        </div>
      )}
    </div>
  );
};

export default LetterTile;
