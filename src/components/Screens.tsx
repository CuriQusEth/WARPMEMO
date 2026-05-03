import { motion } from 'motion/react';
import { GameMode } from '../types';
import { Play, RotateCcw, Home, Zap } from 'lucide-react';

interface ScreenProps {
  onStart?: (mode: GameMode) => void;
  onNextLevel?: () => void;
  onQuit?: () => void;
  score?: number;
  level?: number;
}

export function SplashScreen({ onStart }: ScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#050a14] p-6 relative overflow-hidden">
      <BackgroundEffects />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="z-10 flex flex-col items-center"
      >
        <div className="relative mb-8">
           <Zap className="w-24 h-24 text-cyan-400 absolute opacity-50 blur-xl animate-pulse" />
           <Zap className="w-24 h-24 text-cyan-400 relative z-10" />
        </div>
        
        <h1 className="text-[42px] leading-[0.9] font-black tracking-[-2px] uppercase text-[#E0E0FF] mb-2 text-center">
          WARP
          <br/>
          <span className="text-[#00F3FF] text-[shadow:0_0_10px_rgba(0,243,255,0.5)]">MEMORY</span>
        </h1>
        <p className="text-[10px] text-[#00F3FF] tracking-[2px] uppercase opacity-80 font-bold mb-12">Enter the Void</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative px-8 py-4 bg-transparent border border-[#FF00E5] text-[#FF00E5] font-bold tracking-[2px] uppercase hover:bg-[#FF00E5] hover:text-white transition-colors duration-200 text-[14px]"
          onClick={() => onStart?.('story')}
        >
          <span className="relative z-10 flex items-center gap-2">
            <Play className="w-4 h-4 fill-current" />
            Enter the Warp
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}

export function MainMenu({ onStart }: ScreenProps) {
  // simple menu
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#050508] p-6 relative overflow-hidden">
      <BackgroundEffects />
      <h2 className="text-[32px] font-black text-[#E0E0FF] tracking-[-1px] mb-8 z-10 uppercase">SELECT MODE</h2>
      
      <div className="flex flex-col gap-4 w-full max-w-sm z-10">
        <MenuButton onClick={() => onStart?.('story')} title="Story Mode" desc="30 Levels of Increasing Difficulty" />
        <MenuButton onClick={() => onStart?.('classic')} title="Classic" desc="Endless Memory Challenge" />
        <MenuButton onClick={() => onStart?.('timeAttack')} title="Time Attack" desc="Beat The Clock" disabled />
      </div>
    </div>
  );
}

export function LevelCompleteScreen({ onNextLevel, onQuit, score, level }: ScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#050508]/90 backdrop-blur-md p-6 relative z-50 absolute inset-0">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center p-8 bg-[#0A1128] border border-[#00F3FF] shadow-[0_0_30px_rgba(0,243,255,0.2)] max-w-sm w-full text-center"
      >
        <h2 className="text-[32px] font-black text-[#00F3FF] tracking-[-1px] uppercase mb-2">Level {level}</h2>
        <h3 className="text-[12px] font-bold text-[#E0E0FF] opacity-80 uppercase tracking-[2px] mb-6">Restored</h3>
        
        <div className="bg-[#050508] p-4 w-full mb-8 border-l-3 border-[#FF00E5]">
           <span className="block text-[10px] uppercase tracking-[2px] text-[#FF00E5] opacity-80 font-bold mb-1">Total Score</span>
           <span className="block text-[32px] font-black tracking-[-1px] leading-none text-[#E0E0FF]">{score}</span>
        </div>

        <div className="flex gap-4 w-full">
          <motion.button 
             whileTap={{ scale: 0.95 }}
             onClick={onQuit}
             className="flex-1 py-4 px-4 bg-transparent border border-[#1A3A5A] text-[#1A3A5A] hover:bg-[#1A3A5A] hover:text-[#E0E0FF] transition-colors flex items-center justify-center gap-2 font-bold"
          >
            <Home className="w-5 h-5" />
          </motion.button>
          <motion.button 
             whileTap={{ scale: 0.95 }}
             onClick={onNextLevel}
             className="flex-[2] py-4 px-4 bg-transparent border border-[#00F3FF] text-[#00F3FF] hover:bg-[#00F3FF] hover:text-[#050508] transition-colors flex items-center justify-center gap-2 font-bold uppercase tracking-[2px] text-[14px]"
          >
            <Play className="w-5 h-5 fill-current" />
            Next Level
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export function GameOverScreen({ onStart, onQuit, score, level }: ScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#050508]/90 backdrop-blur-md p-6 relative z-50 absolute inset-0">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center p-8 bg-[#0A1128] border border-[#FF00E5] shadow-[0_0_30px_rgba(255,0,229,0.2)] max-w-sm w-full text-center"
      >
        <h2 className="text-[32px] font-black text-[#FF00E5] mb-2 tracking-[-1px] uppercase">Signal Lost</h2>
        <p className="text-[10px] uppercase tracking-[2px] text-[#E0E0FF] opacity-80 font-bold mb-6">Warp core destabilized</p>
        
        <div className="bg-[#050508] p-4 w-full mb-8 grid grid-cols-2 gap-4 border-l-3 border-[#FF00E5]">
           <div>
             <span className="block text-[10px] uppercase tracking-[2px] text-[#FF00E5] opacity-80 font-bold mb-1">Level</span>
             <span className="block text-[24px] font-black tracking-[-1px] leading-none text-[#E0E0FF]">{level}</span>
           </div>
           <div>
             <span className="block text-[10px] uppercase tracking-[2px] text-[#FF00E5] opacity-80 font-bold mb-1">Score</span>
             <span className="block text-[24px] font-black tracking-[-1px] leading-none text-[#E0E0FF]">{score}</span>
           </div>
        </div>

        <div className="flex gap-4 w-full">
          <motion.button 
             whileTap={{ scale: 0.95 }}
             onClick={onQuit}
             className="flex-1 py-4 px-4 bg-transparent border border-[#1A3A5A] text-[#1A3A5A] hover:bg-[#1A3A5A] hover:text-[#E0E0FF] transition-colors flex items-center justify-center gap-2 font-bold"
          >
            <Home className="w-5 h-5" />
          </motion.button>
          <motion.button 
             whileTap={{ scale: 0.95 }}
             onClick={() => onStart?.('story')}
             className="flex-[2] py-4 px-4 bg-transparent border border-[#FF00E5] text-[#FF00E5] hover:bg-[#FF00E5] hover:text-[#050508] transition-colors flex items-center justify-center gap-2 font-bold uppercase tracking-[2px] text-[14px]"
          >
            <RotateCcw className="w-5 h-5" />
            Retry
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function MenuButton({ onClick, title, desc, disabled }: { onClick: () => void, title: string, desc: string, disabled?: boolean }) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      className={`w-full text-left p-4 border relative overflow-hidden transition-colors ${
        disabled 
          ? 'bg-[#0A1128]/50 border-[#1A3A5A]/50 opacity-50 cursor-not-allowed text-[#E0E0FF]/50' 
          : 'bg-[#0A1128] border-[#2D5A8E] shadow-[0_0_15px_rgba(0,243,255,0.1)] hover:border-[#00F3FF]'
      }`}
    >
      <div className={`text-[16px] font-bold uppercase tracking-[2px] ${disabled ? 'text-inherit' : 'text-[#00F3FF]'}`}>{title}</div>
      <div className={`text-[12px] mt-1 ${disabled ? 'opacity-50 text-inherit' : 'text-[#E0E0FF] opacity-70'}`}>{desc}</div>
      {!disabled && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#FF00E5] shadow-[0_0_10px_#FF00E5]" />}
    </motion.button>
  );
}

function BackgroundEffects() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden block">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF00E5]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#00F3FF]/10 rounded-full blur-[100px]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />
    </div>
  );
}
