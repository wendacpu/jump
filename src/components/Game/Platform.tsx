import React from 'react';

interface PlatformProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const Platform: React.FC<PlatformProps> = ({ x, y, width, height }) => {
  return (
    <div
      className="absolute"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* Platform top */}
      <div className="w-full h-2 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-t-lg" />
      {/* Platform body */}
      <div className="w-full h-full bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-b-lg shadow-lg">
        {/* Platform texture */}
        <div className="w-full h-full opacity-30 bg-[radial-gradient(circle,_transparent_20%,_#00000010_20%)] bg-[length:8px_8px]" />
      </div>
      {/* Platform shadow */}
      <div className="absolute -bottom-2 left-1/2 w-[90%] h-4 -translate-x-1/2 bg-black/20 rounded-full blur-sm" />
    </div>
  );
};