import React, { useEffect, useRef } from 'react';
import { GRID_W, GRID_H, CELL_SIZE, COLORS } from '../constants';
import { Position, Orb, Asteroid, Portal, Particle } from '../types';

interface GameCanvasProps {
  refs: {
    snake: React.MutableRefObject<Position[]>;
    orb: React.MutableRefObject<Orb>;
    asteroids: React.MutableRefObject<Asteroid[]>;
    portals: React.MutableRefObject<Portal[]>;
    particles: React.MutableRefObject<Particle[]>;
    snakeColor: React.MutableRefObject<string>;
  };
}

export function GameCanvas({ refs }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let reqId: number;

    const render = () => {
      // Clear bg using theme color
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid (sleek grid)
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.05)'; // cyan-400 with very low opacity
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvas.width; x += CELL_SIZE) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += CELL_SIZE) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Draw Portals
      refs.portals.current.forEach(p => {
        ctx.strokeStyle = p.color; // fuchsia-500
        ctx.lineWidth = 4;
        ctx.shadowBlur = 30;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.pos.x * CELL_SIZE + CELL_SIZE/2, p.pos.y * CELL_SIZE + CELL_SIZE/2, CELL_SIZE, 0, Math.PI*2);
        ctx.stroke();

        // Inner portal
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(217, 70, 239, 0.5)'; // fuchsia-400/50
        ctx.beginPath();
        ctx.arc(p.pos.x * CELL_SIZE + CELL_SIZE/2, p.pos.y * CELL_SIZE + CELL_SIZE/2, CELL_SIZE/1.5, 0, Math.PI*2);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
      });

      // Draw Asteroids
      refs.asteroids.current.forEach(a => {
        ctx.fillStyle = COLORS.asteroid;
        ctx.strokeStyle = COLORS.asteroidBorder;
        ctx.lineWidth = 1;
        ctx.fillRect(a.pos.x * CELL_SIZE + 2, a.pos.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        ctx.strokeRect(a.pos.x * CELL_SIZE + 2, a.pos.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        
        // Inner detail
        ctx.fillStyle = COLORS.asteroidBorder;
        ctx.beginPath();
        ctx.arc(a.pos.x * CELL_SIZE + CELL_SIZE/2, a.pos.y * CELL_SIZE + CELL_SIZE/2, 2, 0, Math.PI*2);
        ctx.fill();
      });

      // Draw Orb
      const orb = refs.orb.current;
      ctx.fillStyle = orb.type === 'WARP' ? COLORS.orbWarp : COLORS.orbNormal;
      ctx.shadowBlur = 20;
      ctx.shadowColor = ctx.fillStyle;
      ctx.beginPath();
      ctx.arc(orb.pos.x * CELL_SIZE + CELL_SIZE/2, orb.pos.y * CELL_SIZE + CELL_SIZE/2, CELL_SIZE/2 - 4, 0, Math.PI*2);
      ctx.fill();
      
      if (orb.type === 'NORMAL') {
         ctx.fillStyle = '#ffffff';
         ctx.beginPath();
         ctx.arc(orb.pos.x * CELL_SIZE + CELL_SIZE/2, orb.pos.y * CELL_SIZE + CELL_SIZE/2, 2, 0, Math.PI*2);
         ctx.fill();
      }

      ctx.shadowBlur = 0;

      // Draw Snake
      const snake = refs.snake.current;
      snake.forEach((s, idx) => {
        if (idx === 0) {
          ctx.fillStyle = COLORS.snakeHead;
          ctx.shadowBlur = 15;
          ctx.shadowColor = COLORS.snakeHead;
        } else {
          // Fading effect for tail
          const alpha = Math.max(0.2, 1 - (idx / snake.length));
          ctx.fillStyle = COLORS.snakeBody;
          ctx.globalAlpha = alpha;
          ctx.shadowBlur = 5;
          ctx.shadowColor = COLORS.snakeBody;
        }
        
        ctx.fillRect(s.x * CELL_SIZE + 1, s.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        ctx.globalAlpha = 1.0;
      });
      ctx.shadowBlur = 0;

      // Draw particles
      refs.particles.current.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x * CELL_SIZE + CELL_SIZE/2, p.y * CELL_SIZE + CELL_SIZE/2, p.size * CELL_SIZE, 0, Math.PI*2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      reqId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(reqId);
  }, [refs]);

  return (
    <canvas
      ref={canvasRef}
      width={GRID_W * CELL_SIZE}
      height={GRID_H * CELL_SIZE}
      className="bg-[#020617] rounded-xl border-2 border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] z-10"
      style={{
        maxWidth: '100%',
        maxHeight: '100vh',
        objectFit: 'contain',
        touchAction: 'none'
      }}
    />
  );
}
