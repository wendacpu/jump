import React from 'react';

interface CharacterProps {
  position: { x: number; y: number };
  isJumping: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export const Character: React.FC<CharacterProps> = ({
  position,
  isJumping,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
}) => {
  return (
    <div
      className={`absolute w-10 h-10 cursor-pointer transform-gpu ${
        isJumping ? 'scale-90' : 'scale-100 hover:scale-105'
      }`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isJumping ? 'none' : 'all 0.3s ease-out',
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Main ball body */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full shadow-lg">
        {/* Shine effect */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full opacity-50" />
      </div>
      {/* Shadow */}
      <div className="absolute -bottom-1 left-1/2 w-8 h-2 -translate-x-1/2 bg-black/20 rounded-full blur-sm" />
    </div>
  );
};