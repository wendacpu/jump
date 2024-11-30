import React from 'react';
import { Character } from './components/Game/Character';
import { Platform } from './components/Game/Platform';
import { GameOverlay } from './components/Game/GameOverlay';
import { useGameLogic } from './hooks/useGameLogic';

function App() {
  const {
    gameState,
    jumpPower,
    isCharging,
    startJump,
    executeJump,
    startGame,
    restartGame,
  } = useGameLogic();

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
      {/* Game container */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-600">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_#00000010_20%)] bg-[length:32px_32px]" />
        </div>
        
        {/* Game world */}
        <div 
          className="absolute h-full"
          style={{
            transform: `translateX(-${gameState.viewOffset}px)`,
            transition: gameState.isJumping ? 'none' : 'transform 0.3s ease-out',
            width: `${gameState.groundWidth}px`, // 使用动态地面宽度
          }}
        >
          {/* Ground */}
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-green-700 to-green-900">
            <div className="w-full h-full opacity-30 bg-[radial-gradient(circle,_transparent_20%,_#00000010_20%)] bg-[length:16px_16px]" />
          </div>
          
          {/* Platforms */}
          {gameState.platforms.map((platform, index) => (
            <Platform key={index} {...platform} />
          ))}
          
          {/* Character */}
          <Character
            position={gameState.characterPosition}
            isJumping={gameState.isJumping}
            onMouseDown={startJump}
            onMouseUp={executeJump}
            onTouchStart={startJump}
            onTouchEnd={executeJump}
          />
        </div>
        
        {/* UI Overlays */}
        <GameOverlay
          score={gameState.score}
          gameOver={gameState.gameOver}
          gameStarted={gameState.gameStarted}
          onRestart={restartGame}
          onStartGame={startGame}
        />
        
        {/* Power meter */}
        {isCharging && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="w-48 h-4 bg-white/20 backdrop-blur rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-100"
                style={{ width: `${jumpPower}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;