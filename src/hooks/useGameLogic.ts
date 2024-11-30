import { useState, useEffect, useCallback, useRef } from 'react';

interface GameState {
  characterPosition: { x: number; y: number };
  platforms: Array<{ x: number; y: number; width: number; height: number }>;
  isJumping: boolean;
  score: number;
  gameOver: boolean;
  gameStarted: boolean;
  viewOffset: number;
  groundWidth: number; // 新增：跟踪地面宽度
}

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    characterPosition: { x: 50, y: 350 },
    platforms: [
      { x: 50, y: 350, width: 60, height: 60 },
      { x: 200, y: 350, width: 60, height: 60 },
    ],
    isJumping: false,
    score: 0,
    gameOver: false,
    gameStarted: false,
    viewOffset: 0,
    groundWidth: window.innerWidth * 2, // 初始地面宽度
  });

  const [jumpPower, setJumpPower] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const chargeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number>();
  const jumpStartTimeRef = useRef<number>(0);
  const initialPositionRef = useRef({ x: 0, y: 0 });
  const targetPositionRef = useRef({ x: 0, y: 0 });
  const minJumpPowerRef = useRef(20); // 新增：最小跳跃力度

  const startJump = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!gameState.gameStarted || gameState.gameOver) return;
    
    setIsCharging(true);
    initialPositionRef.current = { ...gameState.characterPosition };
    
    if (chargeIntervalRef.current) {
      clearInterval(chargeIntervalRef.current);
    }
    
    setJumpPower(minJumpPowerRef.current); // 设置初始力度
    
    const interval = setInterval(() => {
      setJumpPower((prev) => Math.min(prev + 1.5, 100)); // 降低蓄力速度
    }, 30);
    chargeIntervalRef.current = interval;
  }, [gameState.gameStarted, gameState.gameOver, gameState.characterPosition]);

  const extendGround = useCallback((currentMaxX: number) => {
    setGameState(prev => ({
      ...prev,
      groundWidth: Math.max(prev.groundWidth, currentMaxX + window.innerWidth),
    }));
  }, []);

  const animateJump = useCallback((timestamp: number) => {
    if (!jumpStartTimeRef.current) {
      jumpStartTimeRef.current = timestamp;
    }

    const progress = (timestamp - jumpStartTimeRef.current) / 500;
    
    if (progress < 1) {
      const t = progress;
      const oneMinusT = 1 - t;
      const midPointY = Math.min(initialPositionRef.current.y - 200, 50);
      
      const newX = initialPositionRef.current.x + (targetPositionRef.current.x - initialPositionRef.current.x) * t;
      const newY = oneMinusT * oneMinusT * initialPositionRef.current.y + 
                   2 * oneMinusT * t * midPointY + 
                   t * t * targetPositionRef.current.y;

      const viewOffset = Math.max(0, newX - window.innerWidth / 3);
      
      // 检查是否需要扩展地面
      extendGround(newX);

      setGameState(prev => ({
        ...prev,
        characterPosition: { x: newX, y: newY },
        viewOffset,
      }));

      animationFrameRef.current = requestAnimationFrame(animateJump);
    } else {
      const landed = gameState.platforms.some(
        (platform) =>
          targetPositionRef.current.x >= platform.x &&
          targetPositionRef.current.x <= platform.x + platform.width
      );

      setGameState(prev => {
        if (!landed) {
          return { ...prev, gameOver: true, isJumping: false };
        }

        // 生成新平台时保持至少两个平台
        const newPlatforms = [...prev.platforms];
        while (newPlatforms.length < 3) {
          const lastPlatform = newPlatforms[newPlatforms.length - 1];
          const newPlatform = {
            x: lastPlatform.x + Math.random() * 100 + 150,
            y: 350,
            width: 60,
            height: 60,
          };
          newPlatforms.push(newPlatform);
        }

        const viewOffset = Math.max(0, targetPositionRef.current.x - window.innerWidth / 3);
        extendGround(newPlatforms[newPlatforms.length - 1].x + 200);

        return {
          ...prev,
          characterPosition: { x: targetPositionRef.current.x, y: 350 },
          platforms: newPlatforms,
          isJumping: false,
          score: prev.score + 1,
          viewOffset,
        };
      });

      jumpStartTimeRef.current = 0;
    }
  }, [gameState.platforms, extendGround]);

  const executeJump = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!gameState.gameStarted || gameState.gameOver || !isCharging) return;
    
    if (chargeIntervalRef.current) {
      clearInterval(chargeIntervalRef.current);
      chargeIntervalRef.current = null;
    }
    
    setIsCharging(false);
    setGameState(prev => ({ ...prev, isJumping: true }));

    const jumpDistance = Math.max(jumpPower, minJumpPowerRef.current) * 2.5;
    targetPositionRef.current = {
      x: initialPositionRef.current.x + jumpDistance,
      y: 350
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    jumpStartTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(animateJump);
    setJumpPower(0);
  }, [jumpPower, isCharging, gameState.gameStarted, gameState.gameOver, animateJump]);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
    }));
  }, []);

  const restartGame = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (chargeIntervalRef.current) {
      clearInterval(chargeIntervalRef.current);
      chargeIntervalRef.current = null;
    }
    
    setGameState({
      characterPosition: { x: 50, y: 350 },
      platforms: [
        { x: 50, y: 350, width: 60, height: 60 },
        { x: 200, y: 350, width: 60, height: 60 },
      ],
      isJumping: false,
      score: 0,
      gameOver: false,
      gameStarted: true,
      viewOffset: 0,
      groundWidth: window.innerWidth * 2,
    });
    
    setJumpPower(0);
    setIsCharging(false);
    jumpStartTimeRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      if (chargeIntervalRef.current) {
        clearInterval(chargeIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    gameState,
    jumpPower,
    isCharging,
    startJump,
    executeJump,
    startGame,
    restartGame,
  };
};