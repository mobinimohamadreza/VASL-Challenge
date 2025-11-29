import { Cell, CellState } from '../types';

const GRID_SIZE = 16;
const MINE_COUNT = 40; // تعداد مین‌ها

export function createGrid(rows: number = GRID_SIZE, cols: number = GRID_SIZE, mineCount: number = MINE_COUNT): Cell[][] {
  const grid: Cell[][] = [];
  
  // ایجاد شبکه خالی
  for (let row = 0; row < rows; row++) {
    grid[row] = [];
    for (let col = 0; col < cols; col++) {
      grid[row][col] = {
        isMine: false,
        state: 'hidden',
        adjacentMines: 0,
        row,
        col,
      };
    }
  }
  
  // قرار دادن مین‌ها به صورت تصادفی
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    
    if (!grid[row][col].isMine) {
      grid[row][col].isMine = true;
      minesPlaced++;
    }
  }
  
  // محاسبه تعداد مین‌های مجاور
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!grid[row][col].isMine) {
        grid[row][col].adjacentMines = countAdjacentMines(grid, row, col, rows, cols);
      }
    }
  }
  
  return grid;
}

function countAdjacentMines(grid: Cell[][], row: number, col: number, rows: number, cols: number): number {
  let count = 0;
  
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      
      const newRow = row + i;
      const newCol = col + j;
      
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        if (grid[newRow][newCol].isMine) {
          count++;
        }
      }
    }
  }
  
  return count;
}

export function revealCell(grid: Cell[][], row: number, col: number, rows: number, cols: number): Cell[][] {
  let newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  const cell = newGrid[row][col];
  
  if (cell.state !== 'hidden' || cell.isMine) {
    return newGrid;
  }
  
  // آشکار کردن سلول
  cell.state = 'revealed';
  
  // اگر تعداد مین‌های مجاور 0 باشد، همسایه‌ها را به صورت خودکار آشکار کن (flood fill)
  if (cell.adjacentMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        
        const newRow = row + i;
        const newCol = col + j;
        
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          const neighbor = newGrid[newRow][newCol];
          if (neighbor.state === 'hidden' && !neighbor.isMine) {
            newGrid = revealCell(newGrid, newRow, newCol, rows, cols);
          }
        }
      }
    }
  }
  
  return newGrid;
}

export function toggleFlag(grid: Cell[][], row: number, col: number): Cell[][] {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  const cell = newGrid[row][col];
  
  if (cell.state === 'hidden') {
    cell.state = 'flagged';
  } else if (cell.state === 'flagged') {
    cell.state = 'hidden';
  }
  
  return newGrid;
}

export function checkWinCondition(grid: Cell[][]): boolean {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      // اگر سلولی که مین نیست هنوز مخفی است، بازی تمام نشده
      if (!cell.isMine && cell.state !== 'revealed') {
        return false;
      }
    }
  }
  return true;
}

export function revealAllMines(grid: Cell[][]): Cell[][] {
  return grid.map(row =>
    row.map(cell => {
      if (cell.isMine) {
        return { ...cell, state: 'revealed' as CellState };
      }
      return cell;
    })
  );
}

