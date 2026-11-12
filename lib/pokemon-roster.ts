// Who lives in each theme's habitat, how they move, and which move strip they use.
// Shared by the habitat component, the routine engine, and scripts/build-habitat-sprites.mjs.

export type PokemonTheme = "gengar" | "gible";
export type PokemonSpecies =
  | "gengar" | "haunter" | "gastly" | "giratina" | "darkrai"
  | "gible" | "flygon" | "diglett" | "donphan" | "groudon";
export type VisibleActivity = "idle" | "walk" | "run" | "jump" | "fly" | "float" | "roar" | "smile" | "attack";
export type MoveId =
  | "shadow-ball" | "sludge" | "sludge-splat" | "spiral" | "dragon-flame"
  | "bite" | "gust" | "rock" | "hit" | "fire-plume"
  | "heart" | "ring" | "fairy-sparkle" | "mound";

/** projectile: flies forward from the mouth · burst: plays in front · aura: spins over the body · fx: decoration. */
export type MoveKind = "projectile" | "burst" | "aura" | "fx";
export type MoveInfo = { frames: number; kind: MoveKind };

export const MOVES: Record<MoveId, MoveInfo> = {
  "shadow-ball": { frames: 1, kind: "projectile" },
  sludge: { frames: 1, kind: "projectile" },
  "sludge-splat": { frames: 2, kind: "burst" },
  spiral: { frames: 1, kind: "aura" },
  "dragon-flame": { frames: 4, kind: "projectile" },
  bite: { frames: 4, kind: "burst" },
  gust: { frames: 2, kind: "projectile" },
  rock: { frames: 1, kind: "projectile" },
  hit: { frames: 5, kind: "burst" },
  "fire-plume": { frames: 5, kind: "burst" },
  heart: { frames: 3, kind: "fx" },
  ring: { frames: 1, kind: "fx" },
  "fairy-sparkle": { frames: 4, kind: "fx" },
  mound: { frames: 1, kind: "fx" },
};

export type SpeciesInfo = {
  name: string;
  movement: "ground" | "air";
  /** How it leaves before reappearing somewhere else. */
  exit: "fade" | "burrow";
  /** Multiples of the 44px sprite; halves keep pixels whole on 2x screens. */
  scale: number;
  compactScale: number;
  /** Desktop home zone: a ground patch, or the first sky zone for flyers. */
  home: number;
  /** Relative weights of what it does while visible. */
  repertoire: Partial<Record<VisibleActivity, number>>;
  move: MoveId;
  moveName: string;
  reaction: "smile" | "roar";
  cry: string;
  ghost?: boolean;
  legendary?: boolean;
  /** Flyers that cross the whole sky between zones. */
  roams?: boolean;
  /** Shown on narrow screens, where the habitat is a short strip. */
  compact?: boolean;
};

export const SPECIES: Record<PokemonSpecies, SpeciesInfo> = {
  gengar: {
    name: "Gengar", movement: "ground", exit: "fade", ghost: true, scale: 2.5, compactScale: 1.5, home: 0, compact: true,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "shadow-ball", moveName: "Shadow Ball", reaction: "smile", cry: "Kekeke! ♥",
  },
  haunter: {
    name: "Haunter", movement: "air", exit: "fade", ghost: true, scale: 2, compactScale: 1.5, home: 1, compact: true,
    repertoire: { float: 3, fly: 2, smile: 1, attack: 1.5 },
    move: "sludge", moveName: "Sludge Bomb", reaction: "smile", cry: "Boo! ♥",
  },
  gastly: {
    name: "Gastly", movement: "air", exit: "fade", ghost: true, scale: 2, compactScale: 1.5, home: 2, compact: true,
    repertoire: { float: 3, fly: 2, smile: 1.5, attack: 1 },
    move: "sludge-splat", moveName: "Poison Gas", reaction: "smile", cry: "Gasss~ ♥",
  },
  giratina: {
    name: "Giratina", movement: "air", exit: "fade", ghost: true, scale: 3, compactScale: 2, home: 3, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1.5, attack: 1.5 },
    move: "dragon-flame", moveName: "Dragon Breath", reaction: "roar", cry: "GRAAAH!",
  },
  darkrai: {
    name: "Darkrai", movement: "air", exit: "fade", ghost: true, legendary: true, scale: 2.5, compactScale: 2, home: 0, compact: true,
    repertoire: {}, move: "spiral", moveName: "Dark Void", reaction: "roar", cry: "…!",
  },
  gible: {
    name: "Gible", movement: "ground", exit: "burrow", scale: 2, compactScale: 1.5, home: 0, compact: true,
    repertoire: { idle: 2, walk: 3, run: 2, jump: 2, roar: 1, smile: 1.5, attack: 1.5 },
    move: "bite", moveName: "Bite", reaction: "smile", cry: "Gib gib! ♥",
  },
  flygon: {
    name: "Flygon", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5, home: 0, roams: true, compact: true,
    repertoire: { fly: 3, float: 2, roar: 1, smile: 1, attack: 1.5 },
    move: "gust", moveName: "Gust", reaction: "smile", cry: "Flyyy~ ♥",
  },
  diglett: {
    name: "Diglett", movement: "ground", exit: "burrow", scale: 1.5, compactScale: 1.5, home: 1, compact: true,
    repertoire: { idle: 3, smile: 2, attack: 1.5 },
    move: "rock", moveName: "Rock Throw", reaction: "smile", cry: "Dig dig! ♥",
  },
  donphan: {
    name: "Donphan", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5, home: 2,
    repertoire: { idle: 2, walk: 2, run: 3, jump: .7, roar: 1, attack: 1.5 },
    move: "hit", moveName: "Rollout", reaction: "roar", cry: "Phaaan!",
  },
  groudon: {
    name: "Groudon", movement: "ground", exit: "burrow", legendary: true, scale: 3.5, compactScale: 2, home: 3, compact: true,
    repertoire: {}, move: "fire-plume", moveName: "Eruption", reaction: "roar", cry: "GROOOAR!",
  },
};

export const RESIDENTS: Record<PokemonTheme, PokemonSpecies[]> = {
  gengar: ["gengar", "haunter", "gastly", "giratina", "darkrai"],
  gible: ["gible", "flygon", "diglett", "donphan", "groudon"],
};

/** Native size of one sprite frame. Sheets hold two frames × (normal, shiny). */
export const SPRITE_SIZE = 44;
/** Feet sit on row 42 of 44 in every sprite. */
export const SPRITE_FEET = 42 / 44;

export const spriteUrl = (species: PokemonSpecies) => `/sprites/pokemon/${species}.png`;
export const moveUrl = (move: MoveId) => `/sprites/moves/${move}.png`;
