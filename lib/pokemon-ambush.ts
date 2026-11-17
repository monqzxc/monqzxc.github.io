import type { MoveId } from "./pokemon-roster.ts";

export type AmbushPoint = { x: number; y: number };
export type PokemonAmbushShot = {
  origin: AmbushPoint;
  target: AmbushPoint;
  move: MoveId;
  /** For the screen-reader line: "Shiny Gengar used Shadow Ball!" */
  attacker: string;
  moveName: string;
};

/** Fired as a resident starts winding up; `at` is just above its head, in viewport pixels. */
export const POKEMON_AMBUSH_TAUNT_EVENT = "pokemon-ambush-taunt";
export type PokemonAmbushTaunt = { at: AmbushPoint; text: string };

/** Fired by a grumpy resident; the cursor layer flies the shot and decides hit or miss. */
export const POKEMON_AMBUSH_EVENT = "pokemon-ambush-fire";

/** Chance that a hovered regular would rather be left alone. */
export const AMBUSH_ODDS = .2;
/** Quiet time after any ambush, across the whole habitat, so it stays a surprise. */
export const AMBUSH_COOLDOWN_MS = 7000;
/** Turn, glare, and wind up before the shot leaves. */
export const AMBUSH_WINDUP_MS = 420;
/** How long the cursor stays knocked out before it pieces itself back together. */
export const CURSOR_KO_MS = 500;
/** Within this many pixels of the aim point when the shot lands counts as a hit. */
export const CURSOR_HIT_RADIUS = 30;

const SHOT_SPEED = 1.5; // px per ms
const SHOT_MIN_MS = 170;
const SHOT_MAX_MS = 340;

type Random = () => number;

export function rollAmbush(now: number, lastAmbushAt: number, random: Random = Math.random): boolean {
  return now - lastAmbushAt >= AMBUSH_COOLDOWN_MS && random() < AMBUSH_ODDS;
}

/** Fast enough that a still cursor gets hit, slow enough that a flick can dodge it. */
export function shotDuration(origin: AmbushPoint, target: AmbushPoint): number {
  const distance = Math.hypot(target.x - origin.x, target.y - origin.y);
  return Math.round(Math.min(SHOT_MAX_MS, Math.max(SHOT_MIN_MS, distance / SHOT_SPEED)));
}

/** `pointer` is null once the cursor has left the window, which always dodges. */
export function isCursorHit(target: AmbushPoint, pointer: AmbushPoint | null, radius = CURSOR_HIT_RADIUS): boolean {
  return pointer !== null && Math.hypot(pointer.x - target.x, pointer.y - target.y) <= radius;
}

/** What the knocked-out cursor's shards are tinted with, by the element of the move that hit it. */
export const MOVE_TINT: Record<MoveId, string> = {
  "shadow-ball": "#9b6cf0", spiral: "#9b6cf0",
  sludge: "#c065e6", "sludge-splat": "#c065e6",
  "dragon-flame": "#7d78ff", "dragon-plume": "#7d78ff",
  "small-ember": "#ff7a2a", ember: "#ff7a2a", "fire-plume": "#ff7a2a",
  "punch-impact": "#ffd36b", claw: "#f1f1f1", bite: "#f1f1f1", hit: "#ffd36b",
  gust: "#cdeeff", "air-cutter": "#cdeeff",
  rock: "#c8a46a", mound: "#c8a46a",
  "water-gun": "#3fa9ff", "water-splash": "#3fa9ff",
  "ice-chunk": "#a6ecff",
  "razor-leaf": "#62c96c", growth: "#62c96c",
  swift: "#ffd23f",
  heart: "#ff9be0", ring: "#ff9be0", "fairy-sparkle": "#ff9be0",
};
