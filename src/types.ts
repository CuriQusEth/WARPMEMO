export type GameMode = 'classic' | 'story' | 'timeAttack' | 'warpRush';

export type ScreenState = 'splash' | 'menu' | 'playing' | 'gameover' | 'levelcomplete';

export interface CardData {
  id: string; // Unique ID for the DOM element
  pairId: string; // ID linking the two pairs (e.g. icon name)
  icon: string; // Name of the lucide icon
  isFlipped: boolean;
  isMatched: boolean;
  position: number; // Current index in the grid, used for layout and warping
}

export interface GameState {
  screen: ScreenState;
  mode: GameMode;
  level: number;
  score: number;
  timer: number;
  warpEnergy: number;
  gridSize: { cols: number; rows: number };
}
