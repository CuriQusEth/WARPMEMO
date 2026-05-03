import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

interface HUDProps {
  score: number;
  timer: number;
  level: number;
  warpEnergy: number;
  maxEnergy: number;
  onManualWarp: () => void;
  energyCost: number;
}

export function HUD({ score, timer, level, warpEnergy, maxEnergy, onManualWarp, energyCost }: HUDProps) {
  const canWarp = warpEnergy >= energyCost;

  return (
    <div className="w-full bg-[#050508]/90 border-t border-[#1A3A5A] p-6 pb-8 flex flex-col gap-6 backdrop-blur-md">
      <div className="flex justify-between items-start text-[#E0E0FF]">
        <div className="flex flex-col border-l-3 border-[#00F3FF] pl-3">
          <span className="text-[10px] uppercase tracking-[2px] text-[#00F3FF] opacity-80 font-bold">Level</span>
          <span className="text-[32px] font-black tracking-[-1px] leading-none mt-1">{level}</span>
        </div>
        
        <div className="flex flex-col border-l-3 border-[#00F3FF] pl-3">
          <span className="text-[10px] uppercase tracking-[2px] text-[#00F3FF] opacity-80 font-bold">Time</span>
          <span className={`text-[32px] font-black tracking-[-1px] leading-none mt-1 ${timer <= 10 ? 'text-[#FF00E5] animate-pulse' : ''}`}>
            0:{timer.toString().padStart(2, '0')}
          </span>
        </div>

        <div className="flex flex-col border-l-3 border-[#FF00E5] pl-3 text-right">
          <span className="text-[10px] uppercase tracking-[2px] text-[#FF00E5] opacity-80 font-bold text-left">Score</span>
          <span className="text-[32px] font-black tracking-[-1px] leading-none mt-1 text-left">{score}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[10px] uppercase tracking-[2px] text-[#00F3FF] opacity-80 font-bold">
            <span>Warp Energy</span>
            <span>{Math.round((warpEnergy / maxEnergy) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-[#1A3A5A] rounded-full relative">
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-[#FF00E5] shadow-[0_0_10px_#FF00E5] rounded-full max-w-full"
              initial={{ width: 0 }}
              animate={{ width: `${(warpEnergy / maxEnergy) * 100}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            />
          </div>
        </div>

        <button
          onClick={onManualWarp}
          disabled={!canWarp}
          className={`w-full py-4 px-8 font-bold tracking-[2px] uppercase text-[14px] transition-colors border ${
            canWarp 
              ? 'border-[#FF00E5] text-[#FF00E5] bg-transparent hover:bg-[#FF00E5] hover:text-white cursor-pointer shadow-[0_0_10px_rgba(255,0,229,0.2)]' 
              : 'border-[#1A3A5A] text-[#1A3A5A] cursor-not-allowed'
          }`}
        >
          {canWarp ? 'Trigger Manual Warp' : 'Charging Warp...'}
        </button>
      </div>
    </div>
  );
}
