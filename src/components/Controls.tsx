import React, { useEffect, useRef } from 'react';
import { Direction } from '../types';

interface ControlsProps {
  onDirection: (dir: Direction) => void;
}

export function Controls({ onDirection }: ControlsProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          onDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          onDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          onDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          onDirection('RIGHT');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDirection]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const dx = endX - touchStart.current.x;
    const dy = endY - touchStart.current.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) {
        onDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(dy) > 30) {
        onDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStart.current = null;
  };

  return (
    <div 
      className="absolute inset-0 z-10" 
      onTouchStart={handleTouchStart} 
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    />
  );
}
