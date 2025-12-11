import React, { useState } from 'react';
import { Flashcard } from '../../types';
import { FlipHorizontal } from 'lucide-react';

interface FlashcardViewProps {
  card: Flashcard;
  index: number;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({ card, index }) => {
  const [flipped, setFlipped] = useState(false);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFlipped(!flipped);
    }
  };

  return (
    <div 
      className="perspective-1000 w-full h-64 cursor-pointer group"
      onClick={() => setFlipped(!flipped)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`Flashcard ${index + 1}. Currently showing ${flipped ? 'Back' : 'Front'}. ${flipped ? 'Answer: ' + card.back : 'Question: ' + card.front}. Press Enter to flip.`}
    >
      <div className={`relative w-full h-full transition-all duration-500 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div 
          className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-md border border-slate-200 p-8 flex flex-col items-center justify-center text-center hover:shadow-lg hover:border-indigo-300 transition-all"
          aria-hidden={flipped}
        >
          <div className="text-xs text-indigo-500 font-bold uppercase mb-4 tracking-wider bg-indigo-50 px-3 py-1 rounded-full">
            Card {index + 1}
          </div>
          <h3 className="text-xl font-bold text-slate-800">{card.front}</h3>
          <div className="mt-4 text-xs text-slate-400 group-hover:text-indigo-500 flex items-center font-medium">
            <FlipHorizontal className="w-4 h-4 mr-1" />
            Click or Press Enter to flip
          </div>
        </div>
        
        {/* Back */}
        <div 
          className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-md p-8 flex flex-col items-center justify-center text-center"
          aria-hidden={!flipped}
        >
          <p className="text-white font-medium text-lg leading-relaxed">{card.back}</p>
        </div>
      </div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};