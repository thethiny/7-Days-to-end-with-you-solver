
import React, { useState, useEffect, useRef, useMemo } from 'react';
import './fonts.css';
import './keyboard-responsive.css';
import { fetchAndIndexWords, IndexedDictionary } from './services/wordService';
import { analyzeShifts } from './services/caesarService';
import { ShiftResult } from './types';
import Keyboard from './components/Keyboard';

const getRankHighlight = (res: ShiftResult, input: string) => {
  if (res.score <= 0 || !input) return '';
  switch (res.rank) {
    case 1: return 'rank-top-1 scale-[1.02] z-20 shadow-md';
    case 2: return 'rank-top-2 z-10';
    case 3: return 'rank-top-3 z-10';
    default: return '';
  }
};

interface ResultCardProps {
  res: ShiftResult;
  isHero?: boolean;
  highlightClass: string;
  originalText: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ res, isHero = false, highlightClass, originalText }) => (
  <div className={`quest-card transition-all duration-300 ${highlightClass} ${isHero ? 'shadow-lg' : ''}`}>
    {/* Card Top: Shift (Left) | Original Input (Center) | Score (Right) */}
    <div className="quest-card-header">
      <div className="quest-card-header-inner flex w-full items-center justify-center gap-2">
        <div className="dot-deco dot-tl"></div><div className="dot-deco dot-tr"></div>
        <div className="dot-deco dot-bl"></div><div className="dot-deco dot-br"></div>
        <span className="font-mono shrink-0 text-[14px] flex items-center justify-center">{res.shift === 0 ? 'RAW' : `+${res.shift}`}</span>
        <span className="flex-1 text-center truncate mx-2 opacity-80 font-7days text-[15px] uppercase px-1 flex items-center justify-center">
          {originalText || '---'}
        </span>
        <span className="opacity-80 shrink-0 text-[14px] flex items-center justify-center">{res.score}</span>
      </div>
    </div>
    {/* Card Body: Deciphered Text + Rank Box now inside body-inner */}
    <div className="quest-card-body">
      <div className="quest-card-body-inner flex items-center justify-center relative">
        {/* Rank Box: Now inside body-inner, absolutely positioned bottom left */}
        <div className="rank-box">
          <span className="w-full h-full flex items-center justify-center text-[13px] font-extrabold absolute left-0 top-0 z-10">{res.rank}</span>
          <div className="rank-box-inner relative z-0">
            <div className="dot-deco dot-tl"></div><div className="dot-deco dot-tr"></div>
            <div className="dot-deco dot-bl"></div><div className="dot-deco dot-br"></div>
          </div>
        </div>
        <div className="dot-deco dot-tl"></div><div className="dot-deco dot-tr"></div>
        <div className="dot-deco dot-bl"></div><div className="dot-deco dot-br"></div>
        <p className={`${isHero ? 'text-[19px]' : 'text-[15px]'} font-bold text-center break-all leading-tight px-3 py-1 text-[#2b1b13] w-full flex items-center justify-center`}>
          {res.text || <span className="opacity-10">—</span>}
        </p>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [dictionary, setDictionary] = useState<IndexedDictionary | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ShiftResult[]>(
    Array.from({ length: 26 }, (_, i) => ({ shift: i, text: '', score: 0, rank: i + 1 }))
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scoringMode, setScoringMode] = useState(true);
  const analysisTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    fetchAndIndexWords().then(dict => {
      setDictionary(dict);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!dictionary) return;
    if (!input) {
      setResults(Array.from({ length: 26 }, (_, i) => ({ shift: i, text: '', score: 0, rank: i + 1 })));
      return;
    }

    if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);

    setIsAnalyzing(true);
    analysisTimeoutRef.current = window.setTimeout(() => {
      let newResults = analyzeShifts(input, dictionary);
      if (!scoringMode) {
        // Set all scores to 0 and rank to original order
        newResults = newResults.map((r, i) => ({ ...r, score: 0, rank: i + 1 }));
      }
      setResults(newResults);
      setIsAnalyzing(false);
    }, 50);

    return () => {
      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
    };
  }, [input, dictionary, scoringMode]);

  const topThree = useMemo(() => {
    if (!scoringMode || !input || results.every(r => r.score === 0)) return [];
    return [...results].sort((a, b) => a.rank - b.rank).slice(0, 3);
  }, [results, input, scoringMode]);

  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const pressedKeyTimeout = useRef<number | null>(null);

  const handleKeyPress = (char: string) => {
    setInput(prev => prev + char);
    setPressedKey(char);
    if (pressedKeyTimeout.current) clearTimeout(pressedKeyTimeout.current);
    pressedKeyTimeout.current = window.setTimeout(() => setPressedKey(null), 120);
  };
  const handleBackspace = () => setInput(prev => prev.slice(0, -1));
  const handleClear = () => setInput('');

  // Global Keyboard Listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        const upper = e.key.toUpperCase();
        setPressedKey(upper);
        if (pressedKeyTimeout.current) clearTimeout(pressedKeyTimeout.current);
        pressedKeyTimeout.current = window.setTimeout(() => setPressedKey(null), 120);
        handleKeyPress(upper);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-[#e6dfcc] flex flex-col items-center justify-center text-[#2b1b13]">
        <div className="w-12 h-12 border-4 border-[#2b1b13] border-t-transparent rounded-full animate-spin mb-4"></div>
        <h1 className="text-xl font-bold uppercase tracking-widest animate-pulse">Consulting the Archives...</h1>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#e6dfcc] text-[#2b1b13] overflow-hidden">
      {/* Top Header */}
      <div className="bg-[#5d4231] text-[#e6dfcc] px-4 py-2 flex justify-between items-center shadow-md border-b-2 border-[#2b1b13] z-50">
        <h1 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <i className="fa-solid fa-feather"></i> 7 Days to End With You Solver
        </h1>
        <div className="flex items-center gap-3">
          {isAnalyzing && <i className="fa-solid fa-feather-pointed animate-bounce text-amber-200 text-xs"></i>}
          <div className="text-[10px] bg-[#2b1b13] text-[#b08d66] px-2 py-0.5 rounded border border-[#b08d66]">
            {dictionary ? Array.from(dictionary.values()).reduce((sum: number, set: Set<string>) => sum + set.size, 0) : 0} WORDS LOADED
          </div>
          {/* Scoring Mode Toggle */}
          <div className="flex items-center gap-1 ml-2">
            <label htmlFor="scoring-toggle" className="text-[10px] font-bold uppercase tracking-widest cursor-pointer select-none flex items-center gap-1">
              <span>Scoring</span>
              <input
                id="scoring-toggle"
                type="checkbox"
                className="accent-[#b08d66] w-4 h-4 cursor-pointer"
                checked={scoringMode}
                onChange={() => setScoringMode((v) => !v)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Main Results Grid */}
      <section className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        
        {/* Top 3 Section */}
        {topThree.length > 0 && (
          <div className="mb-10">
             <div className="flex items-center gap-2 mb-4">
               <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8c7e6a]">Top Suspects</h2>
               <div className="flex-1 h-[1px] bg-[#d6ccb3]"></div>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
               {topThree.map(res => (
                 <ResultCard 
                    key={`top-${res.shift}`} 
                    res={res} 
                    isHero={true} 
                    highlightClass={scoringMode ? getRankHighlight(res, input) : ''} 
                    originalText={input}
                 />
               ))}
             </div>
          </div>
        )}

        {/* Full Grid Header */}
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8c7e6a]">All Rotations</h2>
          <div className="flex-1 h-[1px] bg-[#d6ccb3]"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-8 pb-8">
          {results.map((res) => (
            <ResultCard 
                key={res.shift} 
                res={res} 
                highlightClass={scoringMode ? getRankHighlight(res, input) : ''} 
                originalText={input}
            />
          ))}
        </div>
      </section>

      {/* Input Display Area */}
      <section className="px-4 py-3 bg-[#4d3221] border-t-2 border-[#2b1b13] shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] z-40">
        <div className="max-w-4xl mx-auto">
          <div className="w-full bg-[#1a110c] border border-[#2b1b13] rounded-lg p-3 text-center text-3xl font-lcd tracking-[0.1em] text-[#b08d66] min-h-[4rem] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] break-all">
            <div className="w-full flex gap-4">
              <div className="flex-1 flex items-center justify-center">
                <span className={input ? "font-console text-sm tracking-normal" : "opacity-20 italic font-console text-sm tracking-normal"}>
                  {input || "Awaiting Cipher Input..."}
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className={input ? "font-7days text-sm tracking-normal" : "opacity-20 font-7days text-sm tracking-normal"}>
                  {input || "Awaiting Cipher Input..."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width Wood Keyboard */}
      <Keyboard 
        onKeyPress={handleKeyPress} 
        onBackspace={handleBackspace} 
        onClear={handleClear} 
        pressedKey={pressedKey}
      />
    </div>
  );
};

export default App;
