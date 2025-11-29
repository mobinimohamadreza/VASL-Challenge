import { create } from 'zustand';
import { Cell, GameStatus } from '../types';
import { createGrid, revealCell, toggleFlag, checkWinCondition, revealAllMines } from '../utils/gameLogic';

interface GameStore {
  grid: Cell[][];
  gameStatus: GameStatus;
  mineCount: number;
  flagCount: number;
  rows: number;
  cols: number;
  
  initGame: () => void;
  handleCellClick: (row: number, col: number) => void;
  handleCellRightClick: (row: number, col: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  grid: [],
  gameStatus: 'playing',
  mineCount: 40,
  flagCount: 0,
  rows: 16,
  cols: 16,
  
  initGame: () => {
    const { rows, cols, mineCount } = get();
    const grid = createGrid(rows, cols, mineCount);
    set({ grid, gameStatus: 'playing', flagCount: 0 });
  },
  
  handleCellClick: (row: number, col: number) => {
    const { grid, gameStatus, rows, cols } = get();
    
    if (gameStatus !== 'playing') return;
    
    const cell = grid[row][col];
    
    // اگر سلول علامت‌گذاری شده یا قبلاً آشکار شده، کاری نکن
    if (cell.state !== 'hidden') return;
    
    // اگر روی مین کلیک شد
    if (cell.isMine) {
      const revealedGrid = revealAllMines(grid);
      set({ grid: revealedGrid, gameStatus: 'lost' });
      return;
    }
    
    // آشکار کردن سلول
    const newGrid = revealCell(grid, row, col, rows, cols);
    
    // بررسی برنده شدن
    const won = checkWinCondition(newGrid);
    
    set({
      grid: newGrid,
      gameStatus: won ? 'won' : 'playing',
    });
  },
  
  handleCellRightClick: (row: number, col: number) => {
    const { grid, gameStatus } = get();
    
    if (gameStatus !== 'playing') return;
    
    const cell = grid[row][col];
    
    // فقط سلول‌های مخفی را می‌توان علامت‌گذاری کرد
    if (cell.state === 'hidden' || cell.state === 'flagged') {
      const newGrid = toggleFlag(grid, row, col);
      
      // شمارش تعداد پرچم‌ها
      const flagCount = newGrid.reduce(
        (count, row) => count + row.filter(cell => cell.state === 'flagged').length,
        0
      );
      
      set({ grid: newGrid, flagCount });
    }
  },
}));

