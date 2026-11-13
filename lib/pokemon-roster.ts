// Who lives in each theme's habitat, how they move, and which move strip they use.
// Shared by the habitat component, the routine engine, and scripts/build-habitat-sprites.mjs.

/** Each theme is named after its partner, who leads that habitat's cast. */
export type PokemonTheme = "gengar" | "gible" | "piplup" | "charmander" | "bulbasaur";
export type PokemonSpecies =
  | "gengar" | "haunter" | "gastly" | "giratina" | "mismagius" | "drifblim" | "chandelure" | "dusknoir" | "sableye" | "mimikyu" | "marshadow"
  | "gible" | "garchomp" | "flygon" | "diglett" | "donphan" | "groudon" | "cubone" | "sandslash" | "hippowdon" | "gliscor" | "diancie"
  | "piplup" | "squirtle" | "psyduck" | "totodile" | "vaporeon" | "lapras" | "gyarados" | "pelipper" | "kyogre" | "manaphy"
  | "charmander" | "cyndaquil" | "vulpix" | "ponyta" | "arcanine" | "magmar" | "charizard" | "talonflame" | "ho_oh" | "victini"
  | "bulbasaur" | "venusaur" | "chikorita" | "treecko" | "oddish" | "leafeon" | "jumpluff" | "tropius" | "virizion" | "celebi";
export type VisibleActivity = "idle" | "walk" | "run" | "jump" | "fly" | "float" | "roar" | "smile" | "attack";
export type MoveId =
  | "shadow-ball" | "sludge" | "sludge-splat" | "spiral" | "dragon-flame" | "small-ember" | "ember" | "punch-impact" | "claw"
  | "bite" | "gust" | "rock" | "hit" | "fire-plume" | "dragon-plume" | "air-cutter"
  | "water-gun" | "water-splash" | "ice-chunk" | "razor-leaf" | "growth" | "swift"
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
  "water-gun": { frames: 4, kind: "projectile" },
  "water-splash": { frames: 4, kind: "burst" },
  "ice-chunk": { frames: 4, kind: "projectile" },
  "razor-leaf": { frames: 2, kind: "projectile" },
  growth: { frames: 4, kind: "aura" },
  swift: { frames: 1, kind: "projectile" },
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
  /** Legendaries and mythicals make rare, fixed five-second visits; only one is ever on stage. */
  legendary?: boolean;
  mythical?: boolean;
  /** Flyers that cross the whole sky between zones. */
  roams?: boolean;
};

// Ghost types haunt the Gengar graveyard, Ground types roam the Gible trail, Water types
// play on Piplup's shore, Fire types gather at Charmander's volcano, and Grass types
// shelter in Bulbasaur's forest.
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
  marshadow: {
    name: "Marshadow", movement: "ground", exit: "fade", ghost: true, mythical: true, scale: 1.5, compactScale: 1.25,
    repertoire: {}, move: "punch-impact", moveName: "Spectral Thief", reaction: "smile", cry: "Marsha~ ♥",
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
  diancie: {
    name: "Diancie", movement: "air", exit: "fade", mythical: true, scale: 1.5, compactScale: 1.25,
    repertoire: {}, move: "ice-chunk", moveName: "Diamond Storm", reaction: "smile", cry: "Dian~cie ♥",
  },
  piplup: {
    name: "Piplup", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "water-gun", moveName: "Bubble Beam", reaction: "smile", cry: "Pip-lup! ♥",
  },
  squirtle: {
    name: "Squirtle", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, smile: 1.5, attack: 1.5 },
    move: "water-gun", moveName: "Water Gun", reaction: "smile", cry: "Squirtle! ♥",
  },
  psyduck: {
    name: "Psyduck", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, walk: 2, smile: 1, attack: 1 },
    move: "spiral", moveName: "Confusion", reaction: "smile", cry: "Psy…duck? ♥",
  },
  totodile: {
    name: "Totodile", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 1.5, walk: 2, run: 2, jump: 2, smile: 1.5, attack: 1.5 },
    move: "bite", moveName: "Bite", reaction: "smile", cry: "Toto! ♥",
  },
  vaporeon: {
    name: "Vaporeon", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1, smile: 1.5, attack: 1.5 },
    move: "water-splash", moveName: "Hydro Pump", reaction: "smile", cry: "Vapoo~ ♥",
  },
  lapras: {
    name: "Lapras", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "ice-chunk", moveName: "Ice Beam", reaction: "smile", cry: "Laaa~ ♥",
  },
  gyarados: {
    name: "Gyarados", movement: "air", exit: "fade", scale: 4.5, compactScale: 2, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1.5, attack: 1.5 },
    move: "water-splash", moveName: "Waterfall", reaction: "roar", cry: "Gyaaar!",
  },
  pelipper: {
    name: "Pelipper", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5, roams: true,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 },
    move: "water-gun", moveName: "Water Gun", reaction: "smile", cry: "Pelii! ♥",
  },
  kyogre: {
    name: "Kyogre", movement: "air", exit: "fade", legendary: true, scale: 6, compactScale: 2.5,
    repertoire: {}, move: "water-splash", moveName: "Origin Pulse", reaction: "roar", cry: "KYOOOH!",
  },
  manaphy: {
    name: "Manaphy", movement: "air", exit: "fade", mythical: true, scale: 1.5, compactScale: 1.25,
    repertoire: {}, move: "spiral", moveName: "Heart Swap", reaction: "smile", cry: "Mana~phy! ♥",
  },
  charmander: {
    name: "Charmander", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "ember", moveName: "Ember", reaction: "smile", cry: "Char! ♥",
  },
  cyndaquil: {
    name: "Cyndaquil", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 2, run: 2.5, jump: 1, smile: 1.5, attack: 1.5 },
    move: "small-ember", moveName: "Flame Wheel", reaction: "smile", cry: "Cynda! ♥",
  },
  vulpix: {
    name: "Vulpix", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, smile: 2, attack: 1.5 },
    move: "small-ember", moveName: "Fire Spin", reaction: "smile", cry: "Vul~pix ♥",
  },
  ponyta: {
    name: "Ponyta", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 1.5, walk: 2, run: 3, jump: 1.5, smile: 1, attack: 1.5 },
    move: "fire-plume", moveName: "Flame Charge", reaction: "smile", cry: "Neiii! ♥",
  },
  arcanine: {
    name: "Arcanine", movement: "ground", exit: "fade", scale: 3, compactScale: 2,
    repertoire: { idle: 1.5, walk: 2, run: 3, roar: 1.5, attack: 1.5 },
    move: "fire-plume", moveName: "Flare Blitz", reaction: "roar", cry: "Arooo!",
  },
  magmar: {
    name: "Magmar", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 },
    move: "punch-impact", moveName: "Fire Punch", reaction: "roar", cry: "Magmaa!",
  },
  charizard: {
    name: "Charizard", movement: "air", exit: "fade", scale: 4, compactScale: 2, roams: true,
    repertoire: { fly: 3, float: 1.5, roar: 1.5, attack: 1.5 },
    move: "dragon-flame", moveName: "Flamethrower", reaction: "roar", cry: "Rawrgh!",
  },
  talonflame: {
    name: "Talonflame", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5, roams: true,
    repertoire: { fly: 4, float: 1, smile: 1, attack: 1.5 },
    move: "air-cutter", moveName: "Brave Bird", reaction: "smile", cry: "Taloo! ♥",
  },
  ho_oh: {
    name: "Ho-Oh", movement: "air", exit: "fade", legendary: true, scale: 6.5, compactScale: 2.5,
    repertoire: {}, move: "fire-plume", moveName: "Sacred Fire", reaction: "roar", cry: "HOOO-OH!",
  },
  victini: {
    name: "Victini", movement: "air", exit: "fade", mythical: true, scale: 1.5, compactScale: 1.25,
    repertoire: {}, move: "small-ember", moveName: "V-create", reaction: "smile", cry: "Victi~ni! ♥",
  },
  bulbasaur: {
    name: "Bulbasaur", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "razor-leaf", moveName: "Razor Leaf", reaction: "smile", cry: "Bulba! ♥",
  },
  venusaur: {
    name: "Venusaur", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 3, walk: 2, roar: 1.5, attack: 1.5 },
    move: "growth", moveName: "Petal Dance", reaction: "roar", cry: "Venuuu!",
  },
  chikorita: {
    name: "Chikorita", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, jump: 1.5, smile: 2, attack: 1.5 },
    move: "razor-leaf", moveName: "Razor Leaf", reaction: "smile", cry: "Chiko! ♥",
  },
  treecko: {
    name: "Treecko", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 1.5, walk: 2, run: 2.5, jump: 2.5, smile: 1, attack: 1.5 },
    move: "claw", moveName: "Leaf Blade", reaction: "smile", cry: "Treecko! ♥",
  },
  oddish: {
    name: "Oddish", movement: "ground", exit: "burrow", scale: 1, compactScale: 1,
    repertoire: { idle: 3, walk: 2, smile: 2, attack: 1 },
    move: "growth", moveName: "Absorb", reaction: "smile", cry: "Odd~ ♥",
  },
  leafeon: {
    name: "Leafeon", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, smile: 1.5, attack: 1.5 },
    move: "razor-leaf", moveName: "Leaf Blade", reaction: "smile", cry: "Leafy~ ♥",
  },
  jumpluff: {
    name: "Jumpluff", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 },
    move: "gust", moveName: "Cotton Spore", reaction: "smile", cry: "Pluff~ ♥",
  },
  tropius: {
    name: "Tropius", movement: "air", exit: "fade", scale: 3.5, compactScale: 2, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 },
    move: "razor-leaf", moveName: "Leaf Storm", reaction: "roar", cry: "Tropiii!",
  },
  virizion: {
    name: "Virizion", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "claw", moveName: "Sacred Sword", reaction: "roar", cry: "VIRIII!",
  },
  celebi: {
    name: "Celebi", movement: "air", exit: "fade", mythical: true, scale: 1.5, compactScale: 1.25,
    repertoire: {}, move: "growth", moveName: "Leaf Storm", reaction: "smile", cry: "Celebi~ ♥",
  },

};

/**
 * Ten of each theme's type; the first is the theme's partner and never leaves the stage.
 * Drifblim and Sandslash are benched to make room for the mythicals; swap a name back in to return them.
 */
export const RESIDENTS: Record<PokemonTheme, PokemonSpecies[]> = {
  gengar: ["gengar", "haunter", "gastly", "giratina", "mismagius", "marshadow", "chandelure", "dusknoir", "sableye", "mimikyu"],
  gible: ["gible", "garchomp", "flygon", "diglett", "donphan", "groudon", "cubone", "diancie", "hippowdon", "gliscor"],
  piplup: ["piplup", "squirtle", "psyduck", "totodile", "vaporeon", "lapras", "gyarados", "pelipper", "kyogre", "manaphy"],
  charmander: ["charmander", "cyndaquil", "vulpix", "ponyta", "arcanine", "magmar", "charizard", "talonflame", "ho_oh", "victini"],
  bulbasaur: ["bulbasaur", "venusaur", "chikorita", "treecko", "oddish", "leafeon", "jumpluff", "tropius", "virizion", "celebi"],
};

export type ThemeInfo = {
  /** The habitat's type, shown on its badge. */
  type: string;
  habitat: string;
  /** Badge and swatch colour in the selector, readable on every theme's background. */
  swatch: string;
};

/** Selector order, and the order "In order" rotation walks through. */
export const THEME_ORDER: PokemonTheme[] = ["gengar", "gible", "piplup", "charmander", "bulbasaur"];
export const THEMES: Record<PokemonTheme, ThemeInfo> = {
  gengar: { type: "Ghost", habitat: "Moonlit graveyard", swatch: "#b79aff" },
  gible: { type: "Ground", habitat: "Mountain trail", swatch: "#e2b666" },
  piplup: { type: "Water", habitat: "Starlit shore", swatch: "#6ec3f5" },
  charmander: { type: "Fire", habitat: "Ember caldera", swatch: "#ff8a4c" },
  bulbasaur: { type: "Grass", habitat: "Mossy grove", swatch: "#86d17a" },
};
export const isPokemonTheme = (value: unknown): value is PokemonTheme => typeof value === "string" && value in THEMES;

/** Native size of one sprite frame. Sheets hold two frames × (normal, shiny). */
export const SPRITE_SIZE = 44;
/** Feet sit on row 42 of 44 in every sprite. */
export const SPRITE_FEET = 42 / 44;

/** Pokémon drawn as portraits only (game cards), packed like the residents' front sheets. */
export const PORTRAITS = ["deoxys", "mew", "bidoof", "pikachu"] as const;
export type SpriteName = PokemonSpecies | (typeof PORTRAITS)[number];

export const spriteUrl = (species: SpriteName) => `/sprites/pokemon/${species}.png`;
export const motionUrl = (species: PokemonSpecies, anim: "walk" | "attack") => `/sprites/pokemon/${species}-${anim}.png`;
export const moveUrl = (move: MoveId) => `/sprites/moves/${move}.png`;
