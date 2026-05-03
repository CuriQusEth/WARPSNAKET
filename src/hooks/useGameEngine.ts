import { useState, useEffect, useRef, useCallback } from 'react';
import { Position, Direction, GameState, Orb, Portal, Asteroid, Particle } from '../types';
import { GRID_W, GRID_H, INITIAL_SPEED, SPEED_DECREMENT, MIN_SPEED, COLORS } from '../constants';
import { playSound } from '../lib/audio';

// Helper to check same pos
const eq = (a: Position, b: Position) => a.x === b.x && a.y === b.y;

// Get random free position
const getRandomPos = (snake: Position[], asteroids: Asteroid[], portals: Portal[]): Position => {
  let p: Position;
  let attempts = 0;
  while (attempts < 1000) {
    p = { x: Math.floor(Math.random() * GRID_W), y: Math.floor(Math.random() * GRID_H) };
    const inSnake = snake.some(s => eq(s, p));
    const inAsteroid = asteroids.some(a => eq(a.pos, p));
    const inPortal = portals.some(pt => eq(pt.pos, p));
    if (!inSnake && !inAsteroid && !inPortal) return p;
    attempts++;
  }
  return { x: 0, y: 0 };
};

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  
  const snakeRef = useRef<Position[]>([{ x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 17 }]);
  const dirRef = useRef<Direction>('UP');
  const nextDirRef = useRef<Direction>('UP');
  
  const orbRef = useRef<Orb>({ pos: { x: 10, y: 5 }, type: 'NORMAL' });
  const asteroidsRef = useRef<Asteroid[]>([]);
  const portalsRef = useRef<Portal[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  
  const speedRef = useRef(INITIAL_SPEED);
  const warpChargeRef = useRef(0);
  const snakeColorRef = useRef('#00ffff');

  useEffect(() => {
    const saved = localStorage.getItem('warpSnakeHigh');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const spawnParticles = (pos: Position, color: string, count: number) => {
    const p: Particle[] = [];
    for(let i=0; i<count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.5 + 0.1;
      p.push({
        x: pos.x, y: pos.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1, maxLife: 1,
        color,
        size: Math.random() * 0.5 + 0.2
      });
    }
    particlesRef.current.push(...p);
  };

  const setupLevel = (newLevel: number, currentSnake: Position[]) => {
    if (newLevel > 1) playSound.levelUp();
    asteroidsRef.current = [];
    portalsRef.current = [];
    
    // Add asteroids based on level
    if (newLevel >= 5) {
      const count = Math.min((newLevel - 4) * 2, 15);
      for(let i=0; i<count; i++) {
        asteroidsRef.current.push({ pos: getRandomPos(currentSnake, asteroidsRef.current, portalsRef.current) });
      }
    }
    
    // Add portals randomly
    if (newLevel >= 2) {
      const p1Pos = getRandomPos(currentSnake, asteroidsRef.current, []);
      const p2Pos = getRandomPos(currentSnake, asteroidsRef.current, [{ id: '1', targetId: '2', color: 'blue', pos: p1Pos }]);
      portalsRef.current.push({ id: 'P1', pos: p1Pos, targetId: 'P2', color: COLORS.portalA });
      portalsRef.current.push({ id: 'P2', pos: p2Pos, targetId: 'P1', color: COLORS.portalB });
    }
  };

  const startGame = useCallback(() => {
    setGameState('PLAYING');
    setScore(0);
    scoreRef.current = 0;
    setLevel(1);
    snakeRef.current = [{ x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 17 }];
    dirRef.current = 'UP';
    nextDirRef.current = 'UP';
    speedRef.current = INITIAL_SPEED;
    warpChargeRef.current = 0;
    snakeColorRef.current = '#00ffff';
    asteroidsRef.current = [];
    portalsRef.current = [];
    particlesRef.current = [];
    orbRef.current = { pos: getRandomPos(snakeRef.current, [], []), type: 'NORMAL' };
  }, []);

  const changeDirection = useCallback((newDir: Direction) => {
    const cur = dirRef.current;
    if (
      (newDir === 'UP' && cur !== 'DOWN') ||
      (newDir === 'DOWN' && cur !== 'UP') ||
      (newDir === 'LEFT' && cur !== 'RIGHT') ||
      (newDir === 'RIGHT' && cur !== 'LEFT')
    ) {
      nextDirRef.current = newDir;
    }
  }, []);

  const triggerManualWarp = useCallback(() => {
    if (warpChargeRef.current > 0) {
      warpChargeRef.current--;
      playSound.warp();
      const head = snakeRef.current[0];
      spawnParticles(head, '#ffffff', 20);
      snakeRef.current[0] = getRandomPos(snakeRef.current, asteroidsRef.current, portalsRef.current);
      spawnParticles(snakeRef.current[0], '#ffffff', 20);
    }
  }, []);

  const gameOver = useCallback(() => {
    setGameState('GAME_OVER');
    playSound.crash();
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
      localStorage.setItem('warpSnakeHigh', scoreRef.current.toString());
    }
  }, [highScore]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    let lastTime = 0;
    let accumulator = 0;
    let reqId: number;

    const gameLoop = (timestamp: number) => {
      const dt = timestamp - lastTime;
      lastTime = timestamp;
      
      // Update particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx * dt * 0.05;
        p.y += p.vy * dt * 0.05;
        p.life -= dt * 0.002;
        return p.life > 0;
      });

      accumulator += dt;
      if (accumulator >= speedRef.current) {
        accumulator -= speedRef.current;
        
        dirRef.current = nextDirRef.current;
        const dir = dirRef.current;
        const head = { ...snakeRef.current[0] };

        if (dir === 'UP') head.y -= 1;
        if (dir === 'DOWN') head.y += 1;
        if (dir === 'LEFT') head.x -= 1;
        if (dir === 'RIGHT') head.x += 1;

        // Wall wrapping (or crash)
        // Let's do wall wrapping for real warp snake feel
        if (head.x < 0) head.x = GRID_W - 1;
        if (head.x >= GRID_W) head.x = 0;
        if (head.y < 0) head.y = GRID_H - 1;
        if (head.y >= GRID_H) head.y = 0;

        // Collision with self
        if (snakeRef.current.some(s => eq(s, head))) {
          gameOver();
          return;
        }

        // Collision with asteroids
        if (asteroidsRef.current.some(a => eq(a.pos, head))) {
          spawnParticles(head, '#555555', 30);
          gameOver();
          return;
        }

        // Check Portals
        const portal = portalsRef.current.find(p => eq(p.pos, head));
        if (portal) {
          const target = portalsRef.current.find(p => p.id === portal.targetId);
          if (target) {
            playSound.warp();
            spawnParticles(head, portal.color, 15);
            head.x = target.pos.x;
            head.y = target.pos.y;
            spawnParticles(head, target.color, 15);
            
            // Auto push out of portal to avoid immediate re-trigger
            if (dir === 'UP') head.y -= 1;
            if (dir === 'DOWN') head.y += 1;
            if (dir === 'LEFT') head.x -= 1;
            if (dir === 'RIGHT') head.x += 1;
            
            // Re-wrap if needed
            if (head.x < 0) head.x = GRID_W - 1;
            if (head.x >= GRID_W) head.x = 0;
            if (head.y < 0) head.y = GRID_H - 1;
            if (head.y >= GRID_H) head.y = 0;
          }
        }

        snakeRef.current.unshift(head);

        // Check Orb
        if (eq(head, orbRef.current.pos)) {
          navigator.vibrate?.(50);
          const isWarp = orbRef.current.type === 'WARP';
          if (isWarp) {
            playSound.eatWarp();
            warpChargeRef.current++;
            scoreRef.current += 50;
            spawnParticles(head, COLORS.orbWarp, 20);
          } else {
            playSound.eat();
            scoreRef.current += 10;
            spawnParticles(head, COLORS.orbNormal, 10);
          }
          
          setScore(scoreRef.current);
          
          // Level up?
          const newLevel = Math.floor(scoreRef.current / 150) + 1;
          if (newLevel > level) {
            setLevel(newLevel);
            setupLevel(newLevel, snakeRef.current);
          }

          // Speed up
          speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_DECREMENT);
          
          // Next orb
          const nextType = Math.random() > 0.8 ? 'WARP' : 'NORMAL';
          orbRef.current = { pos: getRandomPos(snakeRef.current, asteroidsRef.current, portalsRef.current), type: nextType };
          
          // Skin upgrade (visual flair only)
          if (scoreRef.current > 500) snakeColorRef.current = COLORS.orbWarp;
          if (scoreRef.current > 1000) snakeColorRef.current = COLORS.orbNormal;
          
        } else {
          snakeRef.current.pop();
        }
      }

      reqId = requestAnimationFrame(gameLoop);
    };

    reqId = requestAnimationFrame((ts) => {
      lastTime = ts;
      gameLoop(ts);
    });

    return () => cancelAnimationFrame(reqId);
  }, [gameState, gameOver, level]); // score removed from deps to avoid re-binds if possible, but we use useState for it. Actually, score update inside loop requires careful handling to not break loop. 

  return {
    gameState,
    score,
    level,
    highScore,
    warpCharges: warpChargeRef.current,
    startGame,
    changeDirection,
    triggerManualWarp,
    setGameState,
    refs: {
      snake: snakeRef,
      orb: orbRef,
      asteroids: asteroidsRef,
      portals: portalsRef,
      particles: particlesRef,
      snakeColor: snakeColorRef
    }
  };
}
