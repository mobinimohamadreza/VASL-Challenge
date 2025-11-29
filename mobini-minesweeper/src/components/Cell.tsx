import { Cell as CellType, GameStatus } from '../types';

interface CellProps {
  cell: CellType;
  onClick: () => void;
  onRightClick: () => void;
  gameStatus: GameStatus;
}

export default function Cell({ cell, onClick, onRightClick, gameStatus }: CellProps) {
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick();
  };
  
  const getCellContent = () => {
    if (cell.state === 'flagged') {
      return '🚩';
    }
    
    if (cell.state === 'revealed') {
      if (cell.isMine) {
        return '💣';
      }
      if (cell.adjacentMines > 0) {
        return cell.adjacentMines;
      }
      return '';
    }
    
    return '';
  };
  
  const getCellClassName = () => {
    const isGameOver = gameStatus !== 'playing';
    const baseClasses = `w-8 h-8 flex items-center justify-center text-sm font-bold border border-gray-400 transition-all ${isGameOver ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`;
    
    if (cell.state === 'revealed') {
      if (cell.isMine) {
        return `${baseClasses} bg-red-500 text-white`;
      }
      return `${baseClasses} bg-gray-200 text-gray-800`;
    }
    
    if (cell.state === 'flagged') {
      return `${baseClasses} bg-yellow-200 hover:bg-yellow-300`;
    }
    
    return `${baseClasses} bg-gray-300 hover:bg-gray-400`;
  };
  
  const getNumberColor = () => {
    const colors = [
      '', // 0
      'text-blue-600', // 1
      'text-green-600', // 2
      'text-red-600', // 3
      'text-purple-600', // 4
      'text-yellow-600', // 5
      'text-pink-600', // 6
      'text-gray-800', // 7
      'text-black', // 8
    ];
    return colors[cell.adjacentMines] || '';
  };
  
  return (
    <div
      className={`${getCellClassName()} ${cell.state === 'revealed' && cell.adjacentMines > 0 ? getNumberColor() : ''}`}
      onClick={onClick}
      onContextMenu={handleRightClick}
    >
      {getCellContent()}
    </div>
  );
}

