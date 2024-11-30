import React from 'react';

interface GameOverlayProps {
  score: number;
  gameOver: boolean;
  gameStarted: boolean;
  onRestart: () => void;
  onStartGame: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  score,
  gameOver,
  gameStarted,
  onRestart,
  onStartGame,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Score display */}
      <div className="absolute top-4 left-4 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg">
        <div className="text-2xl font-bold text-white drop-shadow-lg">
          Score: {score}
        </div>
      </div>
      
      {/* Start screen */}
      {!gameStarted && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
          <div className="text-center p-8 bg-white/10 rounded-xl backdrop-blur-md">
            <div className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Jump Jump Game
            </div>
            <button
              onClick={onStartGame}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xl rounded-lg 
                       hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all
                       shadow-lg hover:shadow-purple-500/30"
            >
              Start Game
            </button>
            <p className="mt-6 text-white text-lg opacity-90">
              Click and hold on the purple ball to charge your jump!
            </p>
          </div>
        </div>
      )}
      
      {/* Game over screen */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
          <div className="text-center p-8 bg-white/10 rounded-xl backdrop-blur-md">
            <div className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Game Over!
            </div>
            <div className="text-2xl text-white mb-6">
              Final Score: {score}
            </div>
            <button
              onClick={onRestart}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xl rounded-lg 
                       hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all
                       shadow-lg hover:shadow-purple-500/30"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};