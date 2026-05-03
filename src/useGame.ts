import { useState, useEffect, useCallback, useRef } from 'react';
import { CardData, GameState, ScreenState, GameMode } from './types';
import { ICON_NAMES } from './icons';

const MAX_ENERGY = 100;
const ENERGY_PER_MATCH = 20;
const ENERGY_COST_WARP = 50;

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function generateDeck(cols: number, rows: number): CardData[] {
  const pairCount = (cols * rows) / 2;
  // Get random icons
  const shuffledIcons = shuffleArray(ICON_NAMES);
  const selectedIcons = shuffledIcons.slice(0, pairCount);
  
  let cards: CardData[] = [];
  selectedIcons.forEach((icon, index) => {
    cards.push({
      id: `${icon}-A`,
      pairId: icon,
      icon: icon,
      isFlipped: false,
      isMatched: false,
      position: 0,
    });
    cards.push({
      id: `${icon}-B`,
      pairId: icon,
      icon: icon,
      isFlipped: false,
      isMatched: false,
      position: 0,
    });
  });

  cards = shuffleArray(cards);
  // assign initial positions
  return cards.map((card, index) => ({ ...card, position: index }));
}

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    screen: 'splash',
    mode: 'story',
    level: 1,
    score: 0,
    timer: 60,
    warpEnergy: 0,
    gridSize: { cols: 4, rows: 4 }, // Level 1 is 4x4
  });

  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [combo, setCombo] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize a level
  const initLevel = useCallback((level: number) => {
    let cols = 4;
    let rows = 4;
    let timer = 60;
    
    if (level > 10) { cols = 6; rows = 6; timer = 120; }
    else if (level > 5) { cols = 4; rows = 5; timer = 90; }

    const newCards = generateDeck(cols, rows);
    setCards(newCards);
    setFlippedIndices([]);
    setIsProcessing(false);
    setCombo(0);
    setGameState(prev => ({
      ...prev,
      level,
      gridSize: { cols, rows },
      timer,
      screen: 'playing'
    }));
  }, []);

  const startGame = useCallback((mode: GameMode) => {
    setGameState(prev => ({ ...prev, mode, score: 0, warpEnergy: 0 }));
    initLevel(1);
  }, [initLevel]);

  // Handle Timer
  useEffect(() => {
    if (gameState.screen === 'playing' && gameState.timer > 0) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.timer <= 1) {
            clearInterval(timerRef.current!);
            return { ...prev, timer: 0, screen: 'gameover' };
          }
          return { ...prev, timer: prev.timer - 1 };
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.screen, gameState.timer]);

  // Check Level Complete
  useEffect(() => {
    if (gameState.screen === 'playing' && cards.length > 0) {
      const allMatched = cards.every(c => c.isMatched);
      if (allMatched) {
        setGameState(prev => ({ ...prev, screen: 'levelcomplete', score: prev.score + prev.timer * 10 }));
      }
    }
  }, [cards, gameState.screen]);

  // Execute Warp (Swap positions of some unmatched cards)
  const executeWarp = useCallback(() => {
      setCards(prevCards => {
        const unmatched = prevCards.filter(c => !c.isMatched);
        if (unmatched.length < 2) return prevCards;

        // Pick 2-4 random cards to swap depending on remaining logic, let's swap all unmatched's positions pseudo-randomly
        const positions = unmatched.map(c => c.position);
        const shuffledPositions = shuffleArray(positions);
        
        return prevCards.map(c => {
          if (c.isMatched) return c;
          const indexInUnmatched = unmatched.findIndex(u => u.id === c.id);
          return { ...c, position: shuffledPositions[indexInUnmatched], isFlipped: false };
        });
      });
      setFlippedIndices([]); // clear selection on warp warp
  }, []);


  const handleCardClick = (id: string) => {
    if (isProcessing) return;
    
    setCards(prevCards => {
      const clickedIndex = prevCards.findIndex(c => c.id === id);
      const clickedCard = prevCards[clickedIndex];

      if (clickedCard.isFlipped || clickedCard.isMatched) return prevCards;

      if (flippedIndices.length === 0) {
        setFlippedIndices([clickedIndex]);
        const next = [...prevCards];
        next[clickedIndex] = { ...clickedCard, isFlipped: true };
        return next;
      }

      if (flippedIndices.length === 1) {
        const firstIndex = flippedIndices[0];
        const firstCard = prevCards[firstIndex];
        
        setIsProcessing(true);
        setFlippedIndices([firstIndex, clickedIndex]);
        
        const next = [...prevCards];
        next[clickedIndex] = { ...clickedCard, isFlipped: true };

        if (firstCard.pairId === clickedCard.pairId) {
          // Match!
          setTimeout(() => {
            setCards(currentCards => {
              const matchedCards = [...currentCards];
              matchedCards[firstIndex] = { ...matchedCards[firstIndex], isMatched: true };
              matchedCards[clickedIndex] = { ...matchedCards[clickedIndex], isMatched: true };
              return matchedCards;
            });
            setFlippedIndices([]);
            setIsProcessing(false);
            setCombo(prev => prev + 1);
            setGameState(prev => ({
              ...prev,
              score: prev.score + 100 * (combo + 1),
              warpEnergy: Math.min(MAX_ENERGY, prev.warpEnergy + ENERGY_PER_MATCH)
            }));
          }, 600); // Wait bit for animation
        } else {
          // No match
          setTimeout(() => {
            setCards(currentCards => {
              const resetCards = [...currentCards];
              resetCards[firstIndex] = { ...resetCards[firstIndex], isFlipped: false };
              resetCards[clickedIndex] = { ...resetCards[clickedIndex], isFlipped: false };
              return resetCards;
            });
            setFlippedIndices([]);
            setIsProcessing(false);
            setCombo(0);
            
            // Random chance to warp on wrong match (30% chance)
            if (Math.random() < 0.3) {
                executeWarp();
            }

          }, 1000);
        }
        return next;
      }
      return prevCards;
    });
  };

  const manualWarp = () => {
      if (gameState.warpEnergy >= ENERGY_COST_WARP) {
          setGameState(prev => ({ ...prev, warpEnergy: prev.warpEnergy - ENERGY_COST_WARP }));
          executeWarp();
      }
  };

  const nextLevel = () => {
    initLevel(gameState.level + 1);
  };

  const quitToMenu = () => {
      setGameState(prev => ({ ...prev, screen: 'menu' }));
  }

  const goToMenu = () => {
      setGameState(prev => ({ ...prev, screen: 'menu' }));
  }

  return {
    gameState,
    cards,
    startGame,
    initLevel,
    handleCardClick,
    manualWarp,
    nextLevel,
    quitToMenu,
    goToMenu,
    ENERGY_COST_WARP,
    MAX_ENERGY
  };
}
