export type GridSize = 3 | 4;
export type PuzzleId = "gengar" | "charizard" | "pikachu" | "ho-oh" | "rayquaza" | "bidoof" | "mew" | "mewtwo";

export type PuzzleSession = {
  id: string;
  pokemon: PuzzleId;
  size: GridSize;
  tiles: number[];
  moves: number;
  elapsedMs: number;
  status: "playing" | "won";
};

export type PuzzleWin = {
  id: string;
  pokemon: PuzzleId;
  size: GridSize;
  moves: number;
  elapsedMs: number;
  completedAt: string;
};

export type PuzzleSave = { version: 1; session: PuzzleSession | null; wins: PuzzleWin[] };
export const STORAGE_KEY = "mon-tile-puzzle-v1";

const pokemonIds = new Set<PuzzleId>(["gengar", "charizard", "pikachu", "ho-oh", "rayquaza", "bidoof", "mew", "mewtwo"]);
const MAX_MOVES = 1_000_000;
const MAX_ELAPSED_MS = 365 * 24 * 60 * 60 * 1000;
const MAX_HISTORY = 50;
let nextId = 0;

function isGridSize(value: unknown): value is GridSize {
  return value === 3 || value === 4;
}

function isPokemon(value: unknown): value is PuzzleId {
  return typeof value === "string" && pokemonIds.has(value as PuzzleId);
}

function isBoard(value: unknown, size: GridSize): value is number[] {
  return Array.isArray(value) && value.length === size * size &&
    value.every(tile => Number.isInteger(tile) && tile >= 0 && tile < value.length) &&
    new Set(value).size === value.length;
}

export function isSolved(tiles: number[]): boolean {
  return (tiles.length === 9 || tiles.length === 16) &&
    tiles.every((tile, index) => tile === (index + 1) % tiles.length);
}

export function canMoveTile(tiles: number[], index: number, size: GridSize): boolean {
  if (!isGridSize(size) || !isBoard(tiles, size) || !Number.isInteger(index) || index < 0 || index >= tiles.length) return false;
  const blank = tiles.indexOf(0);
  return Math.abs(Math.floor(index / size) - Math.floor(blank / size)) + Math.abs(index % size - blank % size) === 1;
}

export function moveTile(tiles: number[], index: number, size: GridSize): number[] {
  if (!canMoveTile(tiles, index, size)) return tiles;
  const next = [...tiles];
  const blank = next.indexOf(0);
  [next[blank], next[index]] = [next[index], next[blank]];
  return next;
}

function neighbors(blank: number, size: GridSize): number[] {
  const result: number[] = [];
  if (blank >= size) result.push(blank - size);
  if (blank % size > 0) result.push(blank - 1);
  if (blank % size < size - 1) result.push(blank + 1);
  if (blank < size * (size - 1)) result.push(blank + size);
  return result;
}

function distanceFromSolved(tiles: number[], size: GridSize): number {
  return tiles.reduce((distance, tile, index) => tile === 0 ? distance : distance +
    Math.abs(Math.floor(index / size) - Math.floor((tile - 1) / size)) +
    Math.abs(index % size - (tile - 1) % size), 0);
}

export function createPuzzle(pokemon: PuzzleId, size: GridSize): PuzzleSession {
  if (!isPokemon(pokemon) || !isGridSize(size)) throw new RangeError("Choose a supported Pokemon and grid size.");
  let tiles = Array.from({ length: size * size }, (_, index) => (index + 1) % (size * size));
  let blank = tiles.length - 1;
  let previousBlank = -1;
  let furthest = tiles;
  let furthestDistance = 0;

  // Legal moves preserve solvability. Avoid immediate undo and keep a fallback
  // so a random walk that returns near the solution cannot produce a trivial game.
  for (let step = 0; step < size * size * 30; step++) {
    const choices = neighbors(blank, size).filter(index => index !== previousBlank);
    const nextBlank = choices[Math.floor(Math.random() * choices.length)];
    [tiles[blank], tiles[nextBlank]] = [tiles[nextBlank], tiles[blank]];
    previousBlank = blank;
    blank = nextBlank;
    const distance = distanceFromSolved(tiles, size);
    if (distance > furthestDistance) {
      furthestDistance = distance;
      furthest = [...tiles];
    }
  }
  if (distanceFromSolved(tiles, size) < size * 3) tiles = furthest;

  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${(nextId++).toString(36)}-${Math.random().toString(36).slice(2)}`,
    pokemon,
    size,
    tiles,
    moves: 0,
    elapsedMs: 0,
    status: "playing",
  };
}

function isSolvable(tiles: number[], size: GridSize): boolean {
  let inversions = 0;
  for (let left = 0; left < tiles.length; left++) {
    if (tiles[left] === 0) continue;
    for (let right = left + 1; right < tiles.length; right++) {
      if (tiles[right] !== 0 && tiles[left] > tiles[right]) inversions++;
    }
  }
  if (size % 2 === 1) return inversions % 2 === 0;
  const blankRowFromBottom = size - Math.floor(tiles.indexOf(0) / size);
  return (inversions + blankRowFromBottom) % 2 === 1;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function boundedNumber(value: unknown, maximum: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= maximum;
}

function isId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(value);
}

function readSession(value: unknown): PuzzleSession | null {
  if (!isRecord(value) || !isId(value.id) || !isPokemon(value.pokemon) || !isGridSize(value.size) ||
    !isBoard(value.tiles, value.size) || !isSolvable(value.tiles, value.size) ||
    !boundedNumber(value.moves, MAX_MOVES) || !Number.isInteger(value.moves) ||
    !boundedNumber(value.elapsedMs, MAX_ELAPSED_MS) || (value.status !== "playing" && value.status !== "won")) return null;
  const solved = isSolved(value.tiles);
  if ((value.status === "won") !== solved || (solved && value.moves === 0)) return null;
  return { id: value.id, pokemon: value.pokemon, size: value.size, tiles: [...value.tiles], moves: value.moves, elapsedMs: value.elapsedMs, status: value.status };
}

function readWin(value: unknown): PuzzleWin | null {
  if (!isRecord(value) || !isId(value.id) || !isPokemon(value.pokemon) || !isGridSize(value.size) ||
    !boundedNumber(value.moves, MAX_MOVES) || !Number.isInteger(value.moves) || value.moves === 0 ||
    !boundedNumber(value.elapsedMs, MAX_ELAPSED_MS) || typeof value.completedAt !== "string" || value.completedAt.length !== 24) return null;
  const completed = Date.parse(value.completedAt);
  if (!Number.isFinite(completed) || new Date(completed).toISOString() !== value.completedAt) return null;
  return { id: value.id, pokemon: value.pokemon, size: value.size, moves: value.moves, elapsedMs: value.elapsedMs, completedAt: value.completedAt };
}

function normalizeWins(values: unknown[]): PuzzleWin[] {
  const valid = values.map(readWin).filter((value): value is PuzzleWin => value !== null);
  valid.sort((left, right) => Date.parse(right.completedAt) - Date.parse(left.completedAt));
  const seen = new Set<string>();
  return valid.filter(win => {
    if (seen.has(win.id)) return false;
    seen.add(win.id);
    return true;
  }).slice(0, MAX_HISTORY);
}

export function parsePuzzleSave(raw: string | null): PuzzleSave {
  const empty: PuzzleSave = { version: 1, session: null, wins: [] };
  if (typeof raw !== "string" || raw.length > 250_000) return empty;
  try {
    const saved: unknown = JSON.parse(raw);
    if (!isRecord(saved) || saved.version !== 1) return empty;
    return { version: 1, session: readSession(saved.session), wins: Array.isArray(saved.wins) ? normalizeWins(saved.wins) : [] };
  } catch {
    return empty;
  }
}

export function addPuzzleWin(wins: PuzzleWin[], win: PuzzleWin): PuzzleWin[] {
  const existing = normalizeWins(wins);
  // A reload or repeated completion effect must not replace the original score.
  return existing.some(saved => saved.id === win.id) ? existing : normalizeWins([win, ...existing]);
}
