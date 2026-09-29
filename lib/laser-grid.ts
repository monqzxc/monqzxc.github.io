export type Tile = "/" | "\\" | null;
export type Shift = { axis: "row" | "column"; index: number; direction: 1 | -1 };
export type Point = { x: number; y: number };
export const SIZE = 5;

export function shiftTiles(board: Tile[], { axis, index, direction }: Shift, immovable: readonly number[] = []): Tile[] {
  const next = [...board];
  const movable = Array.from({ length: SIZE }, (_, i) => axis === "row" ? index * SIZE + i : i * SIZE + index)
    .filter(cell => !immovable.includes(cell));
  for (let i = 0; i < movable.length; i++) {
    const source = movable[i];
    const target = movable[(i + direction + movable.length) % movable.length];
    next[target] = board[source];
  }
  return next;
}

/** Endpoint devices stay fixed; mirrors underneath them are bypassed. */
export function traceLaser(board: Tile[]) {
  let x = 0, y = 0, dx = 1, dy = 0;
  const points: Point[] = [{ x: 0.5, y: 0.5 }];
  const seen = new Set<string>();
  while (true) {
    const state = `${x},${y},${dx},${dy}`;
    if (seen.has(state)) return { points, won: false, loop: true };
    seen.add(state);
    const nx = x + dx, ny = y + dy;
    if (nx < 0 || nx >= SIZE || ny < 0 || ny >= SIZE) {
      points.push({ x: x + 0.5 + dx * 0.5, y: y + 0.5 + dy * 0.5 });
      return { points, won: false, loop: false };
    }
    x = nx; y = ny;
    points.push({ x: x + 0.5, y: y + 0.5 });
    if (x === 4 && y === 4) return { points, won: true, loop: false };
    if (x === 0 && y === 0) continue;
    const tile = board[y * SIZE + x];
    if (tile === "/") [dx, dy] = [-dy, -dx];
    if (tile === "\\") [dx, dy] = [dy, dx];
  }
}

export function createLevel(level: number) {
  let board: Tile[] = Array(25).fill(null);
  const scramble: Shift[] = [];
  if (level === 1) {
    board[4] = "\\";
    const move: Shift = { axis: "row", index: 0, direction: -1 };
    return { board: shiftTiles(board, move), scramble: [move] };
  }
  // A known solved zigzag. Every scramble can be undone, guaranteeing a solution.
  board[1] = "\\"; board[11] = "\\"; board[13] = "\\"; board[23] = "\\";
  // Off-route mirrors introduce both orientations without obstructing the solution.
  board[8] = "/"; board[16] = "/";
  let seed = level * 7919;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < Math.min(level + 1, 18); i++) {
    const move: Shift = { axis: random() > 0.5 ? "row" : "column", index: Math.floor(random() * 5), direction: random() > 0.5 ? 1 : -1 };
    board = shiftTiles(board, move); scramble.push(move);
  }
  while (traceLaser(board).won) {
    const move: Shift = { axis: "row", index: 0, direction: 1 };
    board = shiftTiles(board, move); scramble.push(move);
  }
  return { board, scramble };
}

export function pointAlongPath(points: Point[], progress: number): Point {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
  let remaining = lengths.reduce((a, b) => a + b, 0) * Math.max(0, Math.min(1, progress));
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i]) {
      const t = lengths[i] ? remaining / lengths[i] : 0;
      return { x: points[i].x + (points[i + 1].x - points[i].x) * t, y: points[i].y + (points[i + 1].y - points[i].y) * t };
    }
    remaining -= lengths[i];
  }
  return points.at(-1)!;
}
