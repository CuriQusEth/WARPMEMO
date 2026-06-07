import { useGame } from './useGame';
import { Card } from './components/Card';
import { HUD } from './components/HUD';
import { SplashScreen, MainMenu, LevelCompleteScreen, GameOverScreen } from './components/Screens';
import { WalletConnect } from './components/WalletConnect';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount } from 'wagmi';
import { useERC8021Transaction } from './lib/erc8021/hooks/useERC8021Transaction';
import { Sun } from 'lucide-react';

export default function App() {
  const { isConnected } = useAccount();
  const { sendTransaction } = useERC8021Transaction();

  const sendGMTransaction = () => {
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      value: 0n,
    });
  };

  const {
    gameState,
    cards,
    startGame,
    handleCardClick,
    manualWarp,
    nextLevel,
    quitToMenu,
    goToMenu,
    MAX_ENERGY,
    ENERGY_COST_WARP
  } = useGame();

  const renderScreen = () => {
    switch (gameState.screen) {
      case 'splash':
        return <SplashScreen onStart={goToMenu} />;
      case 'menu':
        return <MainMenu onStart={startGame} />;
      case 'levelcomplete':
        return (
          <LevelCompleteScreen 
             onNextLevel={nextLevel} 
             onQuit={quitToMenu}
             level={gameState.level}
             score={gameState.score}
          />
        );
      case 'gameover':
        return (
          <GameOverScreen 
             onStart={startGame} 
             onQuit={quitToMenu}
             level={gameState.level}
             score={gameState.score}
          />
        );
      case 'playing':
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-lg mx-auto bg-[#050508] text-[#E0E0FF] relative overflow-hidden select-none">
      {isConnected && (
        <div className="absolute top-4 left-4 z-[60] pointer-events-auto">
          <button 
            onClick={sendGMTransaction}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
          >
            <Sun size={16} />
            Say GM
          </button>
        </div>
      )}
      <WalletConnect />
      
      <AnimatePresence mode="wait">
        {gameState.screen !== 'playing' && (
          <motion.div 
            key={gameState.screen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-[#050508]"
          >
            {renderScreen()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Playing Area always rendered underneath to keep state/animations looking good when menus overlay */}
      <div className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
         {/* Background */}
         <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[20%] left-[50%] translate-x-[-50%] w-[80%] h-[50%] bg-[#0A1128]/80 rounded-full blur-[100px]" />
         </div>

         <div 
           className="w-full bg-[#001428]/30 border border-[#1A3A5A] rounded-lg shadow-[0_0_30px_rgba(0,150,255,0.1)] p-4 grid gap-3 relative z-10"
           style={{
             gridTemplateColumns: `repeat(${gameState.gridSize.cols}, minmax(0, 1fr))`
           }}
         >
           <AnimatePresence>
              {cards.map(card => (
                <Card 
                   key={card.id} 
                   card={card} 
                   onClick={handleCardClick} 
                />
              ))}
           </AnimatePresence>
         </div>
      </div>

      {/* HUD at the bottom */}
      <div className="z-20 shrink-0">
         <HUD 
            score={gameState.score}
            timer={gameState.timer}
            level={gameState.level}
            warpEnergy={gameState.warpEnergy}
            maxEnergy={MAX_ENERGY}
            energyCost={ENERGY_COST_WARP}
            onManualWarp={manualWarp}
         />
      </div>
    </div>
  );
}

