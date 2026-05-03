export type Position = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type Portal = {
  id: string;
  pos: Position;
  targetId: string;
  color: string;
};

export type Orb = {
  pos: Position;
  type: 'NORMAL' | 'WARP';
};

export type Asteroid = {
  pos: Position;
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};
