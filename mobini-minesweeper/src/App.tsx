import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import Cell from './components/Cell';

function App() {
  const { grid, gameStatus, mineCount, flagCount, cols, initGame, handleCellClick, handleCellRightClick } = useGameStore();
  
  useEffect(() => {
    initGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      return '🎉 شما برنده شدید!';
    }
    if (gameStatus === 'lost') {
      return '💥 بازی تمام شد!';
    }
    return 'در حال بازی...';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">بازی مین روب</h1>
          <div className="flex justify-center items-center gap-6 mt-4">
            <div className="text-lg font-semibold text-gray-700">
              مین‌ها: {mineCount}
            </div>
            <div className="text-lg font-semibold text-gray-700">
              پرچم‌ها: {flagCount}
            </div>
            <div className={`text-lg font-semibold ${
              gameStatus === 'won' ? 'text-green-600' : 
              gameStatus === 'lost' ? 'text-red-600' : 
              'text-blue-600'
            }`}>
              {getStatusMessage()}
            </div>
          </div>
          <button
            onClick={initGame}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
          >
            بازی جدید
          </button>
        </div>
        
        <div className="flex justify-center">
          <div 
            className="grid gap-0 border-2 border-gray-600 bg-gray-400 p-1"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  cell={cell}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onRightClick={() => handleCellRightClick(rowIndex, colIndex)}
                  gameStatus={gameStatus}
                />
              ))
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>کلیک چپ: آشکار کردن | کلیک راست: علامت‌گذاری</p>
        </div>
      </div>
    </div>
  );
}

export default App;

