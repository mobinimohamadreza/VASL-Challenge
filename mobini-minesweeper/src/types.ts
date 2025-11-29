export type CellState = 'hidden' | 'revealed' | 'flagged';

export interface Cell {
  isMine: boolean;
  state: CellState;
  adjacentMines: number;
  row: number;
  col: number;
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  grid: Cell[][];
  gameStatus: GameStatus;
  mineCount: number;
  flagCount: number;
  rows: number;
  cols: number;
}

