import * as React from 'react';
import { motion } from 'motion/react';
import { CardData } from '../types';
import { SCI_FI_ICONS, SciFiIconName } from '../icons';

interface CardProps {
  key?: React.Key;
  card: CardData;
  onClick: (id: string) => void;
}

export function Card({ card, onClick }: CardProps) {
  const IconComponent = SCI_FI_ICONS[card.icon as SciFiIconName];

  return (
    <motion.div
      layout
      style={{ order: card.position }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
      whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
      onClick={() => onClick(card.id)}
      className="relative w-full aspect-[3/4] cursor-pointer perspective-1000"
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Back of Card (Hidden icon) */}
        <div className="absolute inset-0 backface-hidden flex items-center justify-center bg-[linear-gradient(135deg,#0A1128_0%,#1c2a4d_100%)] border border-[#2D5A8E] rounded transition-all">
          <HexagonPattern />
        </div>

        {/* Front of Card (Visible Icon) */}
        <div 
          className={`absolute inset-0 backface-hidden flex items-center justify-center rounded transition-all ${
            card.isMatched 
              ? 'bg-[#00F3FF]/10 border border-dashed border-[#00F3FF] opacity-40 grayscale' 
              : 'bg-[#00F3FF] border-none shadow-[0_0_15px_#00F3FF]'
          }`}
          style={{ transform: 'rotateY(180deg)' }}
        >
          {IconComponent && (
            <IconComponent 
              className={`w-1/2 h-1/2 ${card.isMatched ? 'text-[#00F3FF]' : 'text-[#050508]'}`} 
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function HexagonPattern() {
  return (
    <div className="opacity-20 absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexagons" width="28" height="49" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
            <path stroke="#22d3ee" strokeWidth="2" fill="none" d="M14 0 l14 7 v14 l-14 7 l-14 -7 v-14 z M28 24.5 l14 7 v14 l-14 7 l-14 -7 v-14 z"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)"/>
      </svg>
    </div>
  );
}
