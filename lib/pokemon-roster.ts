// Who lives in each theme's habitat, how they move, and which move strip they use.
// Shared by the habitat component, the routine engine, and scripts/build-habitat-sprites.mjs.

export type PokemonTheme = "gengar" | "gible";
export type PokemonSpecies =
  | "gengar" | "haunter" | "gastly" | "giratina" | "mismagius" | "drifblim" | "chandelure" | "dusknoir" | "sableye" | "mimikyu"
  | "gible" | "garchomp" | "flygon" | "diglett" | "donphan" | "groudon" | "cubone" | "sandslash" | "hippowdon" | "gliscor";
export type VisibleActivity = "idle" | "walk" | "run" | "jump" | "fly" | "float" | "roar" | "smile" | "attack";
export type MoveId =
  | "shadow-ball" | "sludge" | "sludge-splat" | "spiral" | "dragon-flame" | "small-ember" | "ember" | "punch-impact" | "claw"
  | "bite" | "gust" | "rock" | "hit" | "fire-plume" | "dragon-plume" | "air-cutter"
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
  "small-ember": { frames: 4, kind: "projectile" },
  ember: { frames: 4, kind: "projectile" },
  "punch-impact": { frames: 1, kind: "burst" },
  claw: { frames: 5, kind: "burst" },
  bite: { frames: 4, kind: "burst" },
  gust: { frames: 2, kind: "projectile" },
  rock: { frames: 1, kind: "projectile" },
  hit: { frames: 5, kind: "burst" },
  "fire-plume": { frames: 5, kind: "burst" },
  "dragon-plume": { frames: 5, kind: "burst" },
  "air-cutter": { frames: 2, kind: "projectile" },
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
  /** Desktop sprite scale loosely follows each species' real height; compactScale keeps them readable on phones. */
  scale: number;
  compactScale: number;
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
};

// Ghost types haunt the Gengar graveyard; Ground types roam the Gible trail.
export const SPECIES: Record<PokemonSpecies, SpeciesInfo> = {
  gengar: {
    name: "Gengar", movement: "ground", exit: "fade", ghost: true, scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "shadow-ball", moveName: "Shadow Ball", reaction: "smile", cry: "Kekeke! ♥",
  },
  haunter: {
    name: "Haunter", movement: "air", exit: "fade", ghost: true, scale: 2.5, compactScale: 1.5,
    repertoire: { float: 3, fly: 2, smile: 1, attack: 1.5 },
    move: "sludge", moveName: "Sludge Bomb", reaction: "smile", cry: "Boo! ♥",
  },
  gastly: {
    name: "Gastly", movement: "air", exit: "fade", ghost: true, scale: 2, compactScale: 1.5,
    repertoire: { float: 3, fly: 2, smile: 1.5, attack: 1 },
    move: "sludge-splat", moveName: "Poison Gas", reaction: "smile", cry: "Gasss~ ♥",
  },
  giratina: {
    name: "Giratina", movement: "air", exit: "fade", ghost: true, legendary: true, scale: 6.5, compactScale: 2.5,
    repertoire: {}, move: "dragon-flame", moveName: "Dragon Breath", reaction: "roar", cry: "GRAAAH!",
  },
  mismagius: {
    name: "Mismagius", movement: "air", exit: "fade", ghost: true, scale: 2, compactScale: 1.5,
    repertoire: { float: 3, fly: 2, smile: 1.5, attack: 1.5 },
    move: "small-ember", moveName: "Mystical Fire", reaction: "smile", cry: "Mismaa~ ♥",
  },
  drifblim: {
    name: "Drifblim", movement: "air", exit: "fade", ghost: true, scale: 2.5, compactScale: 1.5,
    repertoire: { float: 4, fly: 1.5, smile: 1, attack: 1 },
    move: "spiral", moveName: "Ominous Wind", reaction: "smile", cry: "Bwuuu~ ♥",
  },
  chandelure: {
    name: "Chandelure", movement: "air", exit: "fade", ghost: true, scale: 2, compactScale: 1.5,
    repertoire: { float: 3, fly: 1.5, roar: 1, attack: 1.5 },
    move: "ember", moveName: "Flamethrower", reaction: "roar", cry: "Chaaan!",
  },
  dusknoir: {
    name: "Dusknoir", movement: "ground", exit: "fade", ghost: true, scale: 3.5, compactScale: 2,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 },
    move: "punch-impact", moveName: "Shadow Punch", reaction: "roar", cry: "Noooir!",
  },
  sableye: {
    name: "Sableye", movement: "ground", exit: "fade", ghost: true, scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 2, run: 2, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "claw", moveName: "Shadow Claw", reaction: "smile", cry: "Sable~ ♥",
  },
  mimikyu: {
    name: "Mimikyu", movement: "ground", exit: "fade", ghost: true, scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, jump: 1.5, smile: 1, attack: 1.5 },
    move: "hit", moveName: "Play Rough", reaction: "smile", cry: "Mimikyu~ ♥",
  },
  gible: {
    name: "Gible", movement: "ground", exit: "burrow", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 2, jump: 2, roar: 1, smile: 1.5, attack: 1.5 },
    move: "bite", moveName: "Bite", reaction: "smile", cry: "Gib gib! ♥",
  },
  garchomp: {
    name: "Garchomp", movement: "ground", exit: "burrow", scale: 3.5, compactScale: 2,
    repertoire: { idle: 1.5, walk: 2, run: 3, jump: 1, roar: 1.5, attack: 1.5 },
    move: "dragon-plume", moveName: "Dragon Rush", reaction: "roar", cry: "Gaaarch!",
  },
  flygon: {
    name: "Flygon", movement: "air", exit: "fade", scale: 3.5, compactScale: 1.5, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, smile: 1, attack: 1.5 },
    move: "gust", moveName: "Gust", reaction: "smile", cry: "Flyyy~ ♥",
  },
  diglett: {
    name: "Diglett", movement: "ground", exit: "burrow", scale: 1, compactScale: 1,
    repertoire: { idle: 3, smile: 2, attack: 1.5 },
    move: "rock", moveName: "Rock Throw", reaction: "smile", cry: "Dig dig! ♥",
  },
  donphan: {
    name: "Donphan", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 2, run: 3, jump: .7, roar: 1, attack: 1.5 },
    move: "hit", moveName: "Rollout", reaction: "roar", cry: "Phaaan!",
  },
  groudon: {
    name: "Groudon", movement: "ground", exit: "burrow", legendary: true, scale: 5.5, compactScale: 2.5,
    repertoire: {}, move: "fire-plume", moveName: "Eruption", reaction: "roar", cry: "GROOOAR!",
  },
  cubone: {
    name: "Cubone", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1, jump: 1, smile: 1, attack: 1.5 },
    move: "rock", moveName: "Bonemerang", reaction: "smile", cry: "Cuboo! ♥",
  },
  sandslash: {
    name: "Sandslash", movement: "ground", exit: "burrow", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 2, run: 2, roar: .7, attack: 1.5 },
    move: "claw", moveName: "Slash", reaction: "roar", cry: "Shaaash!",
  },
  hippowdon: {
    name: "Hippowdon", movement: "ground", exit: "burrow", scale: 3.5, compactScale: 2,
    repertoire: { idle: 3, walk: 2, roar: 1.5, attack: 1 },
    move: "hit", moveName: "Earthquake", reaction: "roar", cry: "Hippooo!",
  },
  gliscor: {
    name: "Gliscor", movement: "air", exit: "fade", scale: 3.5, compactScale: 1.5, roams: true,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 },
    move: "air-cutter", moveName: "Air Slash", reaction: "smile", cry: "Glis glis! ♥",
  },
};

/** Ten of each theme's type; the first is the theme's partner and never leaves the stage. */
export const RESIDENTS: Record<PokemonTheme, PokemonSpecies[]> = {
  gengar: ["gengar", "haunter", "gastly", "giratina", "mismagius", "drifblim", "chandelure", "dusknoir", "sableye", "mimikyu"],
  gible: ["gible", "garchomp", "flygon", "diglett", "donphan", "groudon", "cubone", "sandslash", "hippowdon", "gliscor"],
};

/** Native size of one sprite frame. Sheets hold two frames × (normal, shiny). */
export const SPRITE_SIZE = 44;
/** Feet sit on row 42 of 44 in every sprite. */
export const SPRITE_FEET = 42 / 44;

/** Pokémon drawn as portraits only (game cards), packed like the residents' front sheets. */
export const PORTRAITS = ["deoxys", "mew", "charizard", "bidoof", "pikachu"] as const;
export type SpriteName = PokemonSpecies | (typeof PORTRAITS)[number];

export const spriteUrl = (species: SpriteName) => `/sprites/pokemon/${species}.png`;
export const motionUrl = (species: PokemonSpecies, anim: "walk" | "attack") => `/sprites/pokemon/${species}-${anim}.png`;
export const moveUrl = (move: MoveId) => `/sprites/moves/${move}.png`;
