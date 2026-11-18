// Who lives in each theme's habitat, how they move, and which move strip they use.
// Shared by the habitat component, the routine engine, and scripts/build-habitat-sprites.mjs.

/** Each theme is named after its partner, who leads that habitat's cast. */
export type PokemonTheme =
  | "gengar" | "gible" | "piplup" | "charmander" | "bulbasaur"
  | "eevee" | "pikachu" | "snorunt" | "riolu" | "grimer" | "pidgey" | "ralts" | "caterpie" | "geodude" | "dratini" | "umbreon" | "aron" | "togepi";
export type PokemonSpecies =
  | "gengar" | "haunter" | "gastly" | "giratina" | "mismagius" | "drifblim" | "chandelure" | "dusknoir" | "sableye" | "mimikyu" | "marshadow" | "duskull" | "drifloon" | "litwick" | "phantump" | "pumpkaboo"
  | "misdreavus" | "shuppet" | "banette" | "dusclops" | "spiritomb" | "froslass" | "golett" | "honedge" | "sinistea" | "greavard" | "lunala" | "spectrier" | "hoopa"
  | "gible" | "garchomp" | "flygon" | "diglett" | "donphan" | "groudon" | "cubone" | "sandslash" | "hippowdon" | "gliscor" | "diancie" | "sandshrew" | "trapinch" | "rhyhorn" | "drilbur" | "numel"
  | "phanpy" | "swinub" | "hippopotas" | "gligar" | "sandile" | "mudbray" | "wooper" | "baltoy" | "dugtrio" | "marowak" | "landorus" | "zygarde" | "regirock"
  | "piplup" | "squirtle" | "psyduck" | "totodile" | "vaporeon" | "lapras" | "gyarados" | "pelipper" | "kyogre" | "manaphy" | "mudkip" | "buizel" | "poliwag" | "clamperl" | "finneon"
  | "marill" | "horsea" | "staryu" | "corphish" | "slowpoke" | "seel" | "wingull" | "froakie" | "popplio" | "sobble" | "lugia" | "suicune" | "keldeo"
  | "charmander" | "cyndaquil" | "vulpix" | "ponyta" | "arcanine" | "magmar" | "charizard" | "talonflame" | "ho_oh" | "victini" | "torchic" | "fennekin" | "litten" | "fuecoco" | "charcadet"
  | "growlithe" | "houndour" | "slugma" | "torkoal" | "chimchar" | "tepig" | "scorbunny" | "litleo" | "fletchinder" | "larvesta" | "moltres" | "entei" | "volcanion"
  | "bulbasaur" | "venusaur" | "chikorita" | "treecko" | "oddish" | "leafeon" | "jumpluff" | "tropius" | "virizion" | "celebi" | "snivy" | "turtwig" | "seedot" | "petilil" | "smoliv"
  | "hoppip" | "sunkern" | "budew" | "shroomish" | "cherubi" | "rowlet" | "grookey" | "sprigatito" | "chespin" | "bounsweet" | "tapu_bulu" | "shaymin" | "zarude"
  | "eevee" | "snorlax" | "meowth" | "jigglypuff" | "chansey" | "kangaskhan" | "tauros" | "ditto" | "porygon" | "sentret" | "aipom" | "dunsparce" | "teddiursa" | "miltank" | "zigzagoon" | "slakoth" | "skitty" | "buneary" | "lillipup" | "minccino" | "wooloo" | "lechonk" | "smeargle" | "regigigas" | "terapagos" | "type_null" | "silvally" | "arceus"
  | "pikachu" | "raichu" | "pichu" | "voltorb" | "electabuzz" | "jolteon" | "mareep" | "ampharos" | "electrike" | "manectric" | "plusle" | "minun" | "shinx" | "luxray" | "pachirisu" | "emolga" | "magnemite" | "tynamo" | "dedenne" | "yamper" | "pawmi" | "rotom" | "helioptile" | "raikou" | "zekrom" | "regieleki" | "miraidon" | "zeraora"
  | "snorunt" | "glalie" | "sneasel" | "weavile" | "delibird" | "smoochum" | "jynx" | "spheal" | "walrein" | "snover" | "abomasnow" | "glaceon" | "vanillite" | "vanilluxe" | "cubchoo" | "beartic" | "cryogonal" | "bergmite" | "avalugg" | "snom" | "frosmoth" | "eiscue" | "cetoddle" | "articuno" | "kyurem" | "regice" | "glastrier" | "chien_pao"
  | "riolu" | "lucario" | "machop" | "machamp" | "mankey" | "primeape" | "hitmonlee" | "hitmonchan" | "hitmontop" | "tyrogue" | "makuhita" | "hariyama" | "meditite" | "timburr" | "conkeldurr" | "throh" | "sawk" | "mienfoo" | "scraggy" | "pancham" | "hawlucha" | "stufful" | "passimian" | "zamazenta" | "urshifu" | "kubfu" | "koraidon" | "meloetta"
  | "grimer" | "muk" | "ekans" | "arbok" | "nidoran_f" | "nidoran_m" | "nidoking" | "nidoqueen" | "zubat" | "crobat" | "koffing" | "weezing" | "gulpin" | "swalot" | "seviper" | "stunky" | "croagunk" | "toxicroak" | "trubbish" | "garbodor" | "salandit" | "mareanie" | "shroodle" | "eternatus" | "okidogi" | "munkidori" | "fezandipiti" | "pecharunt"
  | "pidgey" | "pidgeotto" | "pidgeot" | "spearow" | "fearow" | "farfetchd" | "doduo" | "hoothoot" | "noctowl" | "taillow" | "swellow" | "swablu" | "altaria" | "starly" | "staraptor" | "chatot" | "pidove" | "ducklett" | "rufflet" | "braviary" | "pikipek" | "toucannon" | "rookidee" | "tornadus" | "thundurus" | "zapdos" | "rayquaza" | "enamorus"
  | "ralts" | "kirlia" | "gardevoir" | "abra" | "alakazam" | "drowzee" | "hypno" | "mr_mime" | "natu" | "xatu" | "espeon" | "wobbuffet" | "spoink" | "chimecho" | "munna" | "musharna" | "woobat" | "sigilyph" | "gothita" | "solosis" | "elgyem" | "espurr" | "hatenna" | "mewtwo" | "cresselia" | "azelf" | "mew" | "deoxys"
  | "caterpie" | "metapod" | "butterfree" | "weedle" | "beedrill" | "paras" | "venonat" | "scyther" | "pinsir" | "ledyba" | "spinarak" | "yanma" | "heracross" | "wurmple" | "volbeat" | "illumise" | "combee" | "sewaddle" | "karrablast" | "shelmet" | "grubbin" | "cutiefly" | "scatterbug" | "genesect" | "buzzwole" | "pheromosa" | "slither_wing" | "iron_moth"
  | "geodude" | "graveler" | "golem" | "onix" | "aerodactyl" | "omanyte" | "kabuto" | "sudowoodo" | "larvitar" | "tyranitar" | "shuckle" | "nosepass" | "lunatone" | "solrock" | "lileep" | "anorith" | "cranidos" | "shieldon" | "bonsly" | "roggenrola" | "rockruff" | "carbink" | "nacli" | "terrakion" | "nihilego" | "stakataka" | "iron_boulder" | "iron_thorns"
  | "dratini" | "dragonair" | "dragonite" | "bagon" | "shelgon" | "salamence" | "axew" | "haxorus" | "deino" | "hydreigon" | "goomy" | "goodra" | "jangmo_o" | "kommo_o" | "dreepy" | "dragapult" | "noibat" | "noivern" | "druddigon" | "applin" | "cyclizar" | "frigibax" | "drampa" | "reshiram" | "latias" | "latios" | "regidrago" | "palkia"
  | "umbreon" | "poochyena" | "mightyena" | "murkrow" | "honchkrow" | "absol" | "zorua" | "zoroark" | "purrloin" | "liepard" | "pawniard" | "bisharp" | "kingambit" | "vullaby" | "mandibuzz" | "inkay" | "malamar" | "nickit" | "thievul" | "impidimp" | "grimmsnarl" | "maschiff" | "obstagoon" | "yveltal" | "darkrai" | "chi_yu" | "ting_lu" | "guzzlord"
  | "aron" | "lairon" | "aggron" | "steelix" | "scizor" | "skarmory" | "forretress" | "mawile" | "beldum" | "metang" | "metagross" | "bronzor" | "bronzong" | "probopass" | "klink" | "klinklang" | "ferroseed" | "ferrothorn" | "durant" | "cufant" | "copperajah" | "corviknight" | "gimmighoul" | "dialga" | "registeel" | "cobalion" | "heatran" | "jirachi"
  | "togepi" | "togetic" | "togekiss" | "clefairy" | "clefable" | "cleffa" | "snubbull" | "granbull" | "flabebe" | "floette" | "florges" | "spritzee" | "aromatisse" | "swirlix" | "slurpuff" | "sylveon" | "klefki" | "comfey" | "milcery" | "hatterene" | "tinkatink" | "tinkaton" | "fidough" | "xerneas" | "zacian" | "tapu_lele" | "tapu_fini" | "magearna";
export type VisibleActivity = "idle" | "walk" | "run" | "jump" | "fly" | "float" | "roar" | "smile" | "attack";
export type MoveId =
  | "shadow-ball" | "sludge" | "sludge-splat" | "spiral" | "dragon-flame" | "small-ember" | "ember" | "punch-impact" | "claw"
  | "bite" | "gust" | "rock" | "hit" | "fire-plume" | "dragon-plume" | "air-cutter"
  | "water-gun" | "water-splash" | "ice-chunk" | "razor-leaf" | "growth" | "swift"
  | "heart" | "ring" | "fairy-sparkle" | "mound"
  | "electricity" | "icicle" | "fist" | "metal" | "pin";

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
  electricity: { frames: 4, kind: "burst" },
  icicle: { frames: 1, kind: "projectile" },
  fist: { frames: 1, kind: "burst" },
  metal: { frames: 1, kind: "projectile" },
  pin: { frames: 1, kind: "projectile" },
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
  /**
   * Legendaries and mythicals make rare, fixed five-second visits; only one is ever on stage.
   * Types with too few legendaries to go round (Rock, Bug, Dark) fill those slots with Ultra Beasts
   * and Paradox Pokémon, flagged legendary so they visit the same way.
   */
  legendary?: boolean;
  mythical?: boolean;
  /** Flyers that cross the whole sky between zones. */
  roams?: boolean;
};

// One habitat per type, each led by its partner: Ghost types haunt Gengar's graveyard, Ground
// types roam Gible's trail, Water types play on Piplup's shore, Fire types gather at Charmander's
// volcano, and Grass types shelter in Bulbasaur's forest. The other thirteen types follow in
// THEME_ORDER: Normal (Eevee), Electric (Pikachu), Ice (Snorunt), Fighting (Riolu), Poison (Grimer),
// Flying (Pidgey), Psychic (Ralts), Bug (Caterpie), Rock (Geodude), Dragon (Dratini), Dark (Umbreon),
// Steel (Aron) and Fairy (Togepi).
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
    repertoire: {}, move: "shadow-ball", moveName: "Shadow Force", reaction: "roar", cry: "GRAAAH!",
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
  duskull: {
    name: "Duskull", movement: "air", exit: "fade", ghost: true, scale: 1.5, compactScale: 1,
    repertoire: { float: 3, fly: 2, smile: 1, attack: 1 },
    move: "shadow-ball", moveName: "Night Shade", reaction: "smile", cry: "Duskull~ ♥",
  },
  drifloon: {
    name: "Drifloon", movement: "air", exit: "fade", ghost: true, scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 },
    move: "spiral", moveName: "Ominous Wind", reaction: "smile", cry: "Drifloo~ ♥",
  },
  litwick: {
    name: "Litwick", movement: "ground", exit: "fade", ghost: true, scale: 1, compactScale: 1,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "small-ember", moveName: "Ember", reaction: "smile", cry: "Wick~ ♥",
  },
  phantump: {
    name: "Phantump", movement: "ground", exit: "fade", ghost: true, scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 2, jump: 1, smile: 1.5, attack: 1 },
    move: "growth", moveName: "Horn Leech", reaction: "smile", cry: "Phan~ ♥",
  },
  pumpkaboo: {
    name: "Pumpkaboo", movement: "air", exit: "fade", ghost: true, scale: 1.5, compactScale: 1,
    repertoire: { float: 3, fly: 1.5, smile: 1.5, attack: 1 },
    move: "fairy-sparkle", moveName: "Trick-or-Treat", reaction: "smile", cry: "Pum~kaboo! ♥",
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
    repertoire: {}, move: "rock", moveName: "Precipice Blades", reaction: "roar", cry: "GROOOAR!",
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
  sandshrew: {
    name: "Sandshrew", movement: "ground", exit: "burrow", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 2, run: 2, jump: 1.5, smile: 1, attack: 1 },
    move: "rock", moveName: "Rock Tomb", reaction: "smile", cry: "Shrew! ♥",
  },
  trapinch: {
    name: "Trapinch", movement: "ground", exit: "burrow", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 2, run: 1.5, jump: 1, smile: 1.5, attack: 1 },
    move: "bite", moveName: "Crunch", reaction: "smile", cry: "Trap! ♥",
  },
  rhyhorn: {
    name: "Rhyhorn", movement: "ground", exit: "burrow", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 2, run: 2.5, roar: 1, attack: 1 },
    move: "rock", moveName: "Rock Blast", reaction: "roar", cry: "Rhy! Rhy! ♥",
  },
  drilbur: {
    name: "Drilbur", movement: "ground", exit: "burrow", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 2, run: 2.5, jump: 1, smile: 1, attack: 1 },
    move: "claw", moveName: "Metal Claw", reaction: "smile", cry: "Dril! ♥",
  },
  numel: {
    name: "Numel", movement: "ground", exit: "burrow", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 2, jump: 1, smile: 1.5, attack: 1 },
    move: "ember", moveName: "Ember", reaction: "smile", cry: "Nuu~mel! ♥",
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
  mudkip: {
    name: "Mudkip", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1 },
    move: "water-gun", moveName: "Water Gun", reaction: "smile", cry: "Mudkip! ♥",
  },
  buizel: {
    name: "Buizel", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 2, run: 2, jump: 1.5, smile: 1, attack: 1 },
    move: "water-splash", moveName: "Aqua Jet", reaction: "smile", cry: "Buizel! ♥",
  },
  poliwag: {
    name: "Poliwag", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 2, jump: 1.5, smile: 2, attack: 1 },
    move: "water-gun", moveName: "Bubble Beam", reaction: "smile", cry: "Poli~wag! ♥",
  },
  clamperl: {
    name: "Clamperl", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, walk: 1.5, smile: 1.5, attack: 1 },
    move: "ice-chunk", moveName: "Ice Beam", reaction: "smile", cry: "Clam~perl! ♥",
  },
  finneon: {
    name: "Finneon", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 3, fly: 1.5, smile: 2, attack: 1 },
    move: "water-splash", moveName: "Water Pulse", reaction: "smile", cry: "Finneon~ ♥",
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
  torchic: {
    name: "Torchic", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 2, run: 1.5, jump: 1.5, smile: 2, attack: 1 },
    move: "small-ember", moveName: "Ember", reaction: "smile", cry: "Torchic! ♥",
  },
  fennekin: {
    name: "Fennekin", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 2, run: 1.5, jump: 1, smile: 1.5, attack: 1 },
    move: "small-ember", moveName: "Psyshock", reaction: "smile", cry: "Fen~nekin! ♥",
  },
  litten: {
    name: "Litten", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 2, jump: 1, smile: 1.5, attack: 1 },
    move: "small-ember", moveName: "Ember", reaction: "smile", cry: "Litten! ♥",
  },
  fuecoco: {
    name: "Fuecoco", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, walk: 2, jump: 1, smile: 2, attack: 1 },
    move: "ember", moveName: "Flamethrower", reaction: "smile", cry: "Fueco! ♥",
  },
  charcadet: {
    name: "Charcadet", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 2, run: 1.5, jump: 1.5, smile: 1, attack: 1.5 },
    move: "small-ember", moveName: "Flame Charge", reaction: "smile", cry: "Char~cadet! ♥",
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
  snivy: {
    name: "Snivy", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 2.5, run: 1.5, jump: 1, smile: 2, attack: 1 },
    move: "razor-leaf", moveName: "Leaf Tornado", reaction: "smile", cry: "Sni~vy! ♥",
  },
  turtwig: {
    name: "Turtwig", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 2, run: 1.5, jump: 1, smile: 1.5, attack: 1 },
    move: "razor-leaf", moveName: "Razor Leaf", reaction: "smile", cry: "Turtwig! ♥",
  },
  seedot: {
    name: "Seedot", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "growth", moveName: "Seed Bomb", reaction: "smile", cry: "Seedot! ♥",
  },
  petilil: {
    name: "Petilil", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 2, jump: 1, smile: 2, attack: 1 },
    move: "growth", moveName: "Giga Drain", reaction: "smile", cry: "Peti~lil! ♥",
  },
  smoliv: {
    name: "Smoliv", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "growth", moveName: "Absorb", reaction: "smile", cry: "Smo~liv! ♥",
  },

  // ── gengar additions ──
  misdreavus: {
    name: "Misdreavus", movement: "air", exit: "fade", ghost: true, scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 },
    move: "shadow-ball", moveName: "Shadow Ball", reaction: "smile", cry: "Mis~dree! ♥",
  },
  shuppet: {
    name: "Shuppet", movement: "air", exit: "fade", ghost: true, scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 },
    move: "spiral", moveName: "Night Shade", reaction: "smile", cry: "Shup shup~ ♥",
  },
  banette: {
    name: "Banette", movement: "air", exit: "fade", ghost: true, scale: 2, compactScale: 1.5,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 },
    move: "claw", moveName: "Shadow Claw", reaction: "smile", cry: "Ba-nette! ♥",
  },
  dusclops: {
    name: "Dusclops", movement: "ground", exit: "fade", ghost: true, scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "punch-impact", moveName: "Shadow Punch", reaction: "roar", cry: "Dusss…",
  },
  spiritomb: {
    name: "Spiritomb", movement: "ground", exit: "fade", ghost: true, scale: 2, compactScale: 1.5,
    repertoire: { idle: 3, smile: 2, attack: 1.5 },
    move: "shadow-ball", moveName: "Dark Pulse", reaction: "roar", cry: "Ooooh…",
  },
  froslass: {
    name: "Froslass", movement: "air", exit: "fade", ghost: true, scale: 2.5, compactScale: 1.5,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 },
    move: "ice-chunk", moveName: "Ice Shard", reaction: "smile", cry: "Fros~lass ♥",
  },
  golett: {
    name: "Golett", movement: "ground", exit: "fade", ghost: true, scale: 2, compactScale: 1.5,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "punch-impact", moveName: "Shadow Punch", reaction: "smile", cry: "Go… lett! ♥",
  },
  honedge: {
    name: "Honedge", movement: "air", exit: "fade", ghost: true, scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 },
    move: "claw", moveName: "Fury Cutter", reaction: "smile", cry: "Shing! ♥",
  },
  sinistea: {
    name: "Sinistea", movement: "air", exit: "fade", ghost: true, scale: 1, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 },
    move: "sludge", moveName: "Astonish", reaction: "smile", cry: "Tea~ ♥",
  },
  greavard: {
    name: "Greavard", movement: "ground", exit: "fade", ghost: true, scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "bite", moveName: "Bite", reaction: "smile", cry: "Woof~ ♥",
  },
  lunala: {
    name: "Lunala", movement: "air", exit: "fade", ghost: true, legendary: true, scale: 6, compactScale: 2.5,
    repertoire: {}, move: "spiral", moveName: "Moongeist Beam", reaction: "roar", cry: "LUNAAA!",
  },
  spectrier: {
    name: "Spectrier", movement: "ground", exit: "fade", ghost: true, legendary: true, scale: 4, compactScale: 2.5,
    repertoire: {}, move: "shadow-ball", moveName: "Astral Barrage", reaction: "roar", cry: "SPECTRRR!",
  },
  hoopa: {
    name: "Hoopa", movement: "air", exit: "fade", ghost: true, mythical: true, scale: 1.5, compactScale: 1.25,
    repertoire: {}, move: "spiral", moveName: "Hyperspace Hole", reaction: "smile", cry: "Hoopa~ ♥",
  },
  // ── gible additions ──
  phanpy: {
    name: "Phanpy", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "hit", moveName: "Rollout", reaction: "smile", cry: "Phan-py! ♥",
  },
  swinub: {
    name: "Swinub", movement: "ground", exit: "burrow", scale: 1, compactScale: 1,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "ice-chunk", moveName: "Powder Snow", reaction: "smile", cry: "Swi~nub ♥",
  },
  hippopotas: {
    name: "Hippopotas", movement: "ground", exit: "burrow", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "rock", moveName: "Sand Tomb", reaction: "smile", cry: "Hippo~ ♥",
  },
  gligar: {
    name: "Gligar", movement: "air", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 },
    move: "air-cutter", moveName: "Wing Attack", reaction: "smile", cry: "Gli-gar! ♥",
  },
  sandile: {
    name: "Sandile", movement: "ground", exit: "burrow", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "bite", moveName: "Crunch", reaction: "smile", cry: "Sandi~le ♥",
  },
  mudbray: {
    name: "Mudbray", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "rock", moveName: "Mud Shot", reaction: "smile", cry: "Hee-haw! ♥",
  },
  wooper: {
    name: "Wooper", movement: "ground", exit: "burrow", scale: 1, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "sludge-splat", moveName: "Mud Bomb", reaction: "smile", cry: "Woo~per ♥",
  },
  baltoy: {
    name: "Baltoy", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 },
    move: "spiral", moveName: "Confusion", reaction: "smile", cry: "Bal-toy~ ♥",
  },
  dugtrio: {
    name: "Dugtrio", movement: "ground", exit: "burrow", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, smile: 2, attack: 1.5 },
    move: "rock", moveName: "Earthquake", reaction: "smile", cry: "Dug-trio! ♥",
  },
  marowak: {
    name: "Marowak", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1, roar: 1, attack: 1.5 },
    move: "rock", moveName: "Bone Club", reaction: "roar", cry: "Marowak!",
  },
  landorus: {
    name: "Landorus", movement: "air", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "gust", moveName: "Sandsear Storm", reaction: "roar", cry: "LANDOOR!",
  },
  zygarde: {
    name: "Zygarde", movement: "ground", exit: "burrow", legendary: true, scale: 5, compactScale: 2.5,
    repertoire: {}, move: "dragon-plume", moveName: "Thousand Arrows", reaction: "roar", cry: "ZYGAAAR!",
  },
  regirock: {
    name: "Regirock", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "rock", moveName: "Stone Edge", reaction: "roar", cry: "REGI-ROCK!",
  },
  // ── piplup additions ──
  marill: {
    name: "Marill", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "water-gun", moveName: "Bubble", reaction: "smile", cry: "Ma-rill! ♥",
  },
  horsea: {
    name: "Horsea", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "water-gun", moveName: "Water Gun", reaction: "smile", cry: "Hor~sea ♥",
  },
  staryu: {
    name: "Staryu", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "swift", moveName: "Swift", reaction: "smile", cry: "Hyah! ♥",
  },
  corphish: {
    name: "Corphish", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "claw", moveName: "Crabhammer", reaction: "smile", cry: "Corph! ♥",
  },
  slowpoke: {
    name: "Slowpoke", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "spiral", moveName: "Confusion", reaction: "smile", cry: "…Slow? ♥",
  },
  seel: {
    name: "Seel", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "ice-chunk", moveName: "Aurora Beam", reaction: "smile", cry: "Seel! ♥",
  },
  wingull: {
    name: "Wingull", movement: "air", exit: "fade", roams: true, scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 },
    move: "gust", moveName: "Gust", reaction: "smile", cry: "Wiing~ ♥",
  },
  froakie: {
    name: "Froakie", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "water-gun", moveName: "Water Pulse", reaction: "smile", cry: "Froa~ ♥",
  },
  popplio: {
    name: "Popplio", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "water-splash", moveName: "Bubble Beam", reaction: "smile", cry: "Pop pop! ♥",
  },
  sobble: {
    name: "Sobble", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "water-gun", moveName: "Water Gun", reaction: "smile", cry: "Sob… ♥",
  },
  lugia: {
    name: "Lugia", movement: "air", exit: "fade", legendary: true, scale: 6.5, compactScale: 2.5,
    repertoire: {}, move: "gust", moveName: "Aeroblast", reaction: "roar", cry: "LUUGIA!",
  },
  suicune: {
    name: "Suicune", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "water-splash", moveName: "Hydro Pump", reaction: "roar", cry: "SUICUUUNE!",
  },
  keldeo: {
    name: "Keldeo", movement: "ground", exit: "fade", mythical: true, scale: 2.5, compactScale: 1.5,
    repertoire: {}, move: "water-gun", moveName: "Secret Sword", reaction: "smile", cry: "Kel~deo! ♥",
  },
  // ── charmander additions ──
  growlithe: {
    name: "Growlithe", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "ember", moveName: "Ember", reaction: "smile", cry: "Grrowl! ♥",
  },
  houndour: {
    name: "Houndour", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "bite", moveName: "Bite", reaction: "roar", cry: "Arooo!",
  },
  slugma: {
    name: "Slugma", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "fire-plume", moveName: "Lava Plume", reaction: "smile", cry: "Blub~ ♥",
  },
  torkoal: {
    name: "Torkoal", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "fire-plume", moveName: "Overheat", reaction: "roar", cry: "Toorrk!",
  },
  chimchar: {
    name: "Chimchar", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "punch-impact", moveName: "Fire Punch", reaction: "smile", cry: "Chim-char! ♥",
  },
  tepig: {
    name: "Tepig", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "ember", moveName: "Ember", reaction: "smile", cry: "Te-pig! ♥",
  },
  scorbunny: {
    name: "Scorbunny", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "small-ember", moveName: "Flame Charge", reaction: "smile", cry: "Scor~! ♥",
  },
  litleo: {
    name: "Litleo", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "small-ember", moveName: "Ember", reaction: "roar", cry: "Rawr!",
  },
  fletchinder: {
    name: "Fletchinder", movement: "air", exit: "fade", roams: true, scale: 2, compactScale: 1.5,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 },
    move: "air-cutter", moveName: "Flame Charge", reaction: "smile", cry: "Fletch! ♥",
  },
  larvesta: {
    name: "Larvesta", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "ember", moveName: "Ember", reaction: "smile", cry: "Larva~ ♥",
  },
  moltres: {
    name: "Moltres", movement: "air", exit: "fade", legendary: true, scale: 5.5, compactScale: 2.5,
    repertoire: {}, move: "fire-plume", moveName: "Sky Attack", reaction: "roar", cry: "MOLTREEES!",
  },
  entei: {
    name: "Entei", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "fire-plume", moveName: "Eruption", reaction: "roar", cry: "ENTEEEI!",
  },
  volcanion: {
    name: "Volcanion", movement: "ground", exit: "fade", mythical: true, scale: 3.5, compactScale: 2,
    repertoire: {}, move: "water-splash", moveName: "Steam Eruption", reaction: "roar", cry: "VOLCAAA!",
  },
  // ── bulbasaur additions ──
  hoppip: {
    name: "Hoppip", movement: "air", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 },
    move: "gust", moveName: "Fairy Wind", reaction: "smile", cry: "Hop~pip ♥",
  },
  sunkern: {
    name: "Sunkern", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "growth", moveName: "Absorb", reaction: "smile", cry: "Kern! ♥",
  },
  budew: {
    name: "Budew", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 },
    move: "growth", moveName: "Stun Spore", reaction: "smile", cry: "Bu~dew ♥",
  },
  shroomish: {
    name: "Shroomish", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "sludge-splat", moveName: "Spore", reaction: "smile", cry: "Shroo~ ♥",
  },
  cherubi: {
    name: "Cherubi", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "razor-leaf", moveName: "Bullet Seed", reaction: "smile", cry: "Cheru~! ♥",
  },
  rowlet: {
    name: "Rowlet", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 },
    move: "razor-leaf", moveName: "Leafage", reaction: "smile", cry: "Hoo hoo! ♥",
  },
  grookey: {
    name: "Grookey", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "hit", moveName: "Branch Poke", reaction: "smile", cry: "Grook! ♥",
  },
  sprigatito: {
    name: "Sprigatito", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "fairy-sparkle", moveName: "Leafage", reaction: "smile", cry: "Nya~ ♥",
  },
  chespin: {
    name: "Chespin", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "razor-leaf", moveName: "Pin Missile", reaction: "smile", cry: "Ches-pin! ♥",
  },
  bounsweet: {
    name: "Bounsweet", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 },
    move: "fairy-sparkle", moveName: "Sweet Scent", reaction: "smile", cry: "Bounce~ ♥",
  },
  tapu_bulu: {
    name: "Tapu Bulu", movement: "air", exit: "fade", legendary: true, scale: 3.5, compactScale: 2,
    repertoire: {}, move: "growth", moveName: "Nature's Madness", reaction: "roar", cry: "BULUUU!",
  },
  shaymin: {
    name: "Shaymin", movement: "ground", exit: "fade", mythical: true, scale: 1.5, compactScale: 1.25,
    repertoire: {}, move: "fairy-sparkle", moveName: "Seed Flare", reaction: "smile", cry: "Shay~min! ♥",
  },
  zarude: {
    name: "Zarude", movement: "ground", exit: "fade", mythical: true, scale: 3, compactScale: 2,
    repertoire: {}, move: "razor-leaf", moveName: "Power Whip", reaction: "roar", cry: "ZARUUUDE!",
  },
  eevee: {
    name: "Eevee", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Quick Attack", reaction: "smile", cry: "Vee~! ♥",
  },
  snorlax: {
    name: "Snorlax", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 3, walk: 2, roar: 1.5, attack: 1 }, move: "hit", moveName: "Body Slam", reaction: "roar", cry: "Snoooorlax…",
  },
  meowth: {
    name: "Meowth", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "claw", moveName: "Fury Swipes", reaction: "smile", cry: "Meowth! ♥",
  },
  jigglypuff: {
    name: "Jigglypuff", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "heart", moveName: "Sing", reaction: "smile", cry: "Jiggly~puff ♥",
  },
  chansey: {
    name: "Chansey", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Egg Bomb", reaction: "smile", cry: "Chaaansey! ♥",
  },
  kangaskhan: {
    name: "Kangaskhan", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "punch-impact", moveName: "Mega Punch", reaction: "roar", cry: "KANGAAA!",
  },
  tauros: {
    name: "Tauros", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "hit", moveName: "Take Down", reaction: "roar", cry: "TAAAUROS!",
  },
  ditto: {
    name: "Ditto", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 }, move: "swift", moveName: "Transform", reaction: "smile", cry: "Ditto~ ♥",
  },
  porygon: {
    name: "Porygon", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "swift", moveName: "Tri Attack", reaction: "smile", cry: "Bzzt-pory! ♥",
  },
  sentret: {
    name: "Sentret", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "claw", moveName: "Scratch", reaction: "smile", cry: "Sentret! ♥",
  },
  aipom: {
    name: "Aipom", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Double Hit", reaction: "smile", cry: "Ai-pom! ♥",
  },
  dunsparce: {
    name: "Dunsparce", movement: "ground", exit: "burrow", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Drill Run", reaction: "smile", cry: "Dunspaa~ ♥",
  },
  teddiursa: {
    name: "Teddiursa", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "claw", moveName: "Fury Swipes", reaction: "smile", cry: "Teddi! ♥",
  },
  miltank: {
    name: "Miltank", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Rollout", reaction: "smile", cry: "Moo-tank! ♥",
  },
  zigzagoon: {
    name: "Zigzagoon", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Headbutt", reaction: "smile", cry: "Zig-zag! ♥",
  },
  slakoth: {
    name: "Slakoth", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, smile: 2, attack: 1.5 }, move: "claw", moveName: "Scratch", reaction: "smile", cry: "Slaaa… ♥",
  },
  skitty: {
    name: "Skitty", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "heart", moveName: "Attract", reaction: "smile", cry: "Nyaa~ ♥",
  },
  buneary: {
    name: "Buneary", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Pound", reaction: "smile", cry: "Bun-bun! ♥",
  },
  lillipup: {
    name: "Lillipup", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "bite", moveName: "Bite", reaction: "smile", cry: "Yip yip! ♥",
  },
  minccino: {
    name: "Minccino", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Tail Slap", reaction: "smile", cry: "Chino~ ♥",
  },
  wooloo: {
    name: "Wooloo", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Tackle", reaction: "smile", cry: "Baaa~ ♥",
  },
  lechonk: {
    name: "Lechonk", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Tackle", reaction: "smile", cry: "Oink oink! ♥",
  },
  smeargle: {
    name: "Smeargle", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "spiral", moveName: "Sketch", reaction: "smile", cry: "Smeee~ ♥",
  },
  regigigas: {
    name: "Regigigas", movement: "ground", exit: "fade", legendary: true, scale: 6.5, compactScale: 2.5,
    repertoire: {}, move: "punch-impact", moveName: "Crush Grip", reaction: "roar", cry: "GIGAAA!",
  },
  terapagos: {
    name: "Terapagos", movement: "ground", exit: "fade", legendary: true, scale: 5.5, compactScale: 2.5,
    repertoire: {}, move: "swift", moveName: "Tera Starstorm", reaction: "roar", cry: "TERAPAGOOOS!",
  },
  type_null: {
    name: "Type: Null", movement: "ground", exit: "fade", legendary: true, scale: 3, compactScale: 2,
    repertoire: {}, move: "claw", moveName: "Crush Claw", reaction: "roar", cry: "NULL…!",
  },
  silvally: {
    name: "Silvally", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "claw", moveName: "Multi-Attack", reaction: "roar", cry: "SILVAAALLY!",
  },
  arceus: {
    name: "Arceus", movement: "ground", exit: "fade", mythical: true, scale: 6, compactScale: 2.5,
    repertoire: {}, move: "swift", moveName: "Judgment", reaction: "smile", cry: "Arceus~ ♥",
  },
  pikachu: {
    name: "Pikachu", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "electricity", moveName: "Thunder Shock", reaction: "smile", cry: "Pika pika! ♥",
  },
  raichu: {
    name: "Raichu", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "electricity", moveName: "Thunderbolt", reaction: "smile", cry: "Raaai! ♥",
  },
  pichu: {
    name: "Pichu", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "electricity", moveName: "Thunder Shock", reaction: "smile", cry: "Pichu! ♥",
  },
  voltorb: {
    name: "Voltorb", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "hit", moveName: "Rollout", reaction: "roar", cry: "Bzzzt!",
  },
  electabuzz: {
    name: "Electabuzz", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "punch-impact", moveName: "Thunder Punch", reaction: "roar", cry: "BUZZZZ!",
  },
  jolteon: {
    name: "Jolteon", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "pin", moveName: "Pin Missile", reaction: "smile", cry: "Jolt! ♥",
  },
  mareep: {
    name: "Mareep", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "electricity", moveName: "Thunder Wave", reaction: "smile", cry: "Meeep~ ♥",
  },
  ampharos: {
    name: "Ampharos", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1, smile: 1.5, attack: 1.5 }, move: "electricity", moveName: "Thunderbolt", reaction: "smile", cry: "Amphaaa! ♥",
  },
  electrike: {
    name: "Electrike", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "electricity", moveName: "Spark", reaction: "smile", cry: "Rike! ♥",
  },
  manectric: {
    name: "Manectric", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "bite", moveName: "Thunder Fang", reaction: "roar", cry: "Manectriiic!",
  },
  plusle: {
    name: "Plusle", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "electricity", moveName: "Spark", reaction: "smile", cry: "Plus! ♥",
  },
  minun: {
    name: "Minun", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "electricity", moveName: "Spark", reaction: "smile", cry: "Minun! ♥",
  },
  shinx: {
    name: "Shinx", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "electricity", moveName: "Spark", reaction: "smile", cry: "Shinx! ♥",
  },
  luxray: {
    name: "Luxray", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "bite", moveName: "Thunder Fang", reaction: "roar", cry: "LUXRAAAY!",
  },
  pachirisu: {
    name: "Pachirisu", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "electricity", moveName: "Nuzzle", reaction: "smile", cry: "Pachi! ♥",
  },
  emolga: {
    name: "Emolga", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "electricity", moveName: "Discharge", reaction: "smile", cry: "Emooo~ ♥",
  },
  magnemite: {
    name: "Magnemite", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "electricity", moveName: "Thunder Shock", reaction: "smile", cry: "Bzz-mite! ♥",
  },
  tynamo: {
    name: "Tynamo", movement: "air", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "electricity", moveName: "Spark", reaction: "smile", cry: "Tyna~ ♥",
  },
  dedenne: {
    name: "Dedenne", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "electricity", moveName: "Nuzzle", reaction: "smile", cry: "Dene-dene! ♥",
  },
  yamper: {
    name: "Yamper", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "electricity", moveName: "Spark", reaction: "smile", cry: "Yap yap! ♥",
  },
  pawmi: {
    name: "Pawmi", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "electricity", moveName: "Nuzzle", reaction: "smile", cry: "Pawmi! ♥",
  },
  rotom: {
    name: "Rotom", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "electricity", moveName: "Discharge", reaction: "smile", cry: "Zzzrrt! ♥",
  },
  helioptile: {
    name: "Helioptile", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "electricity", moveName: "Parabolic Charge", reaction: "smile", cry: "Helio! ♥",
  },
  raikou: {
    name: "Raikou", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "electricity", moveName: "Thunderbolt", reaction: "roar", cry: "RAIIIKOU!",
  },
  zekrom: {
    name: "Zekrom", movement: "ground", exit: "fade", legendary: true, scale: 6.5, compactScale: 2.5,
    repertoire: {}, move: "electricity", moveName: "Bolt Strike", reaction: "roar", cry: "ZEKROOOM!",
  },
  regieleki: {
    name: "Regieleki", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "electricity", moveName: "Thunder Cage", reaction: "roar", cry: "ZZT-ZZT-ZZT!",
  },
  miraidon: {
    name: "Miraidon", movement: "ground", exit: "fade", legendary: true, scale: 6, compactScale: 2.5,
    repertoire: {}, move: "electricity", moveName: "Electro Drift", reaction: "roar", cry: "MIRAIDOOON!",
  },
  zeraora: {
    name: "Zeraora", movement: "ground", exit: "fade", mythical: true, scale: 1.5, compactScale: 1.25,
    repertoire: {}, move: "electricity", moveName: "Plasma Fists", reaction: "smile", cry: "Zeraaa! ♥",
  },
  snorunt: {
    name: "Snorunt", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "ice-chunk", moveName: "Powder Snow", reaction: "smile", cry: "Snoru~! ♥",
  },
  glalie: {
    name: "Glalie", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { float: 3, fly: 1.5, roar: 1, attack: 1.5 }, move: "bite", moveName: "Ice Fang", reaction: "roar", cry: "GLAAALIE!",
  },
  sneasel: {
    name: "Sneasel", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "icicle", moveName: "Ice Shard", reaction: "smile", cry: "Snea-sel! ♥",
  },
  weavile: {
    name: "Weavile", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "claw", moveName: "Night Slash", reaction: "roar", cry: "Weaaavile!",
  },
  delibird: {
    name: "Delibird", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "swift", moveName: "Present", reaction: "smile", cry: "Deli~ ♥",
  },
  smoochum: {
    name: "Smoochum", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "heart", moveName: "Sweet Kiss", reaction: "smile", cry: "Smooch! ♥",
  },
  jynx: {
    name: "Jynx", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1, smile: 1.5, attack: 1.5 }, move: "heart", moveName: "Lovely Kiss", reaction: "smile", cry: "Jyyynx~ ♥",
  },
  spheal: {
    name: "Spheal", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Ice Ball", reaction: "smile", cry: "Spheal! ♥",
  },
  walrein: {
    name: "Walrein", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 3, walk: 2, roar: 1.5, attack: 1 }, move: "icicle", moveName: "Icicle Crash", reaction: "roar", cry: "WALREEEIN!",
  },
  snover: {
    name: "Snover", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "icicle", moveName: "Ice Shard", reaction: "smile", cry: "Snoover~ ♥",
  },
  abomasnow: {
    name: "Abomasnow", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "ice-chunk", moveName: "Blizzard", reaction: "roar", cry: "ABOMAAASNOW!",
  },
  glaceon: {
    name: "Glaceon", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "icicle", moveName: "Icicle Spear", reaction: "smile", cry: "Glace~ ♥",
  },
  vanillite: {
    name: "Vanillite", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "ice-chunk", moveName: "Powder Snow", reaction: "smile", cry: "Vani~ ♥",
  },
  vanilluxe: {
    name: "Vanilluxe", movement: "air", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "ice-chunk", moveName: "Blizzard", reaction: "smile", cry: "Vanilluxe! ♥",
  },
  cubchoo: {
    name: "Cubchoo", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "ice-chunk", moveName: "Powder Snow", reaction: "smile", cry: "Chooo~ ♥",
  },
  beartic: {
    name: "Beartic", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "icicle", moveName: "Icicle Crash", reaction: "roar", cry: "BEARRRTIC!",
  },
  cryogonal: {
    name: "Cryogonal", movement: "air", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { float: 3, fly: 1.5, roar: 1, attack: 1.5 }, move: "ice-chunk", moveName: "Ice Beam", reaction: "roar", cry: "Kriiii…",
  },
  bergmite: {
    name: "Bergmite", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "icicle", moveName: "Ice Shard", reaction: "smile", cry: "Berg! ♥",
  },
  avalugg: {
    name: "Avalugg", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 3, walk: 2, roar: 1.5, attack: 1 }, move: "ice-chunk", moveName: "Avalanche", reaction: "roar", cry: "AVALUUUGG!",
  },
  snom: {
    name: "Snom", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "icicle", moveName: "Powder Snow", reaction: "smile", cry: "Snom~ ♥",
  },
  frosmoth: {
    name: "Frosmoth", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "ice-chunk", moveName: "Icy Wind", reaction: "smile", cry: "Frooos~ ♥",
  },
  eiscue: {
    name: "Eiscue", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "icicle", moveName: "Icicle Spear", reaction: "smile", cry: "Eis-cue! ♥",
  },
  cetoddle: {
    name: "Cetoddle", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "icicle", moveName: "Avalanche", reaction: "smile", cry: "Toddle! ♥",
  },
  articuno: {
    name: "Articuno", movement: "air", exit: "fade", legendary: true, scale: 5.5, compactScale: 2.5,
    repertoire: {}, move: "ice-chunk", moveName: "Freeze-Dry", reaction: "roar", cry: "ARTICUNOOO!",
  },
  kyurem: {
    name: "Kyurem", movement: "ground", exit: "fade", legendary: true, scale: 6, compactScale: 2.5,
    repertoire: {}, move: "ice-chunk", moveName: "Glaciate", reaction: "roar", cry: "KYUREEEM!",
  },
  regice: {
    name: "Regice", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "ice-chunk", moveName: "Ice Beam", reaction: "roar", cry: "ZZT-ICE!",
  },
  glastrier: {
    name: "Glastrier", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "icicle", moveName: "Glacial Lance", reaction: "roar", cry: "GLAAASTRIER!",
  },
  chien_pao: {
    name: "Chien-Pao", movement: "ground", exit: "fade", legendary: true, scale: 4, compactScale: 2,
    repertoire: {}, move: "icicle", moveName: "Icicle Crash", reaction: "roar", cry: "CHIEN-PAO!",
  },
  riolu: {
    name: "Riolu", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "fist", moveName: "Force Palm", reaction: "smile", cry: "Rio! ♥",
  },
  lucario: {
    name: "Lucario", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "fist", moveName: "Aura Sphere", reaction: "roar", cry: "LUCAAARIO!",
  },
  machop: {
    name: "Machop", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "fist", moveName: "Karate Chop", reaction: "smile", cry: "Machop! ♥",
  },
  machamp: {
    name: "Machamp", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "fist", moveName: "Dynamic Punch", reaction: "roar", cry: "MACHAAAMP!",
  },
  mankey: {
    name: "Mankey", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "punch-impact", moveName: "Low Kick", reaction: "roar", cry: "Mankey!!",
  },
  primeape: {
    name: "Primeape", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "fist", moveName: "Cross Chop", reaction: "roar", cry: "PRIMEAAAPE!",
  },
  hitmonlee: {
    name: "Hitmonlee", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "hit", moveName: "High Jump Kick", reaction: "roar", cry: "Hit-LEE!",
  },
  hitmonchan: {
    name: "Hitmonchan", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "fist", moveName: "Mach Punch", reaction: "roar", cry: "Hit-CHAN!",
  },
  hitmontop: {
    name: "Hitmontop", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Triple Kick", reaction: "smile", cry: "Top-top! ♥",
  },
  tyrogue: {
    name: "Tyrogue", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "punch-impact", moveName: "Fake Out", reaction: "smile", cry: "Tyro! ♥",
  },
  makuhita: {
    name: "Makuhita", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "punch-impact", moveName: "Arm Thrust", reaction: "smile", cry: "Maku! ♥",
  },
  hariyama: {
    name: "Hariyama", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "punch-impact", moveName: "Force Palm", reaction: "roar", cry: "HARIYAMA!",
  },
  meditite: {
    name: "Meditite", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "fist", moveName: "Drain Punch", reaction: "smile", cry: "Medi~ ♥",
  },
  timburr: {
    name: "Timburr", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Low Kick", reaction: "smile", cry: "Timbu! ♥",
  },
  conkeldurr: {
    name: "Conkeldurr", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "rock", moveName: "Rock Slide", reaction: "roar", cry: "CONKELDURR!",
  },
  throh: {
    name: "Throh", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "hit", moveName: "Seismic Toss", reaction: "roar", cry: "THROH!",
  },
  sawk: {
    name: "Sawk", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "fist", moveName: "Karate Chop", reaction: "roar", cry: "SAWK!",
  },
  mienfoo: {
    name: "Mienfoo", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Jump Kick", reaction: "smile", cry: "Mienfoo! ♥",
  },
  scraggy: {
    name: "Scraggy", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "hit", moveName: "Headbutt", reaction: "roar", cry: "Scraggy!",
  },
  pancham: {
    name: "Pancham", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "punch-impact", moveName: "Arm Thrust", reaction: "smile", cry: "Pancham! ♥",
  },
  hawlucha: {
    name: "Hawlucha", movement: "air", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "hit", moveName: "Flying Press", reaction: "roar", cry: "Haw-LUCHA!",
  },
  stufful: {
    name: "Stufful", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "punch-impact", moveName: "Hammer Arm", reaction: "smile", cry: "Stuff! ♥",
  },
  passimian: {
    name: "Passimian", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "rock", moveName: "Fling", reaction: "smile", cry: "Passi! ♥",
  },
  zamazenta: {
    name: "Zamazenta", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "hit", moveName: "Behemoth Bash", reaction: "roar", cry: "ZAMAZENTA!",
  },
  urshifu: {
    name: "Urshifu", movement: "ground", exit: "fade", legendary: true, scale: 3, compactScale: 2,
    repertoire: {}, move: "fist", moveName: "Wicked Blow", reaction: "roar", cry: "URSHIFU!",
  },
  kubfu: {
    name: "Kubfu", movement: "ground", exit: "fade", legendary: true, scale: 2, compactScale: 1.5,
    repertoire: {}, move: "fist", moveName: "Rock Smash", reaction: "roar", cry: "Kubfu!",
  },
  koraidon: {
    name: "Koraidon", movement: "ground", exit: "fade", legendary: true, scale: 6, compactScale: 2.5,
    repertoire: {}, move: "hit", moveName: "Collision Course", reaction: "roar", cry: "KORAIDOOON!",
  },
  meloetta: {
    name: "Meloetta", movement: "air", exit: "fade", mythical: true, scale: 1.5, compactScale: 1.25,
    repertoire: {}, move: "spiral", moveName: "Relic Song", reaction: "smile", cry: "La-la-loetta~ ♥",
  },
  grimer: {
    name: "Grimer", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "sludge", moveName: "Sludge", reaction: "smile", cry: "Grrrime~ ♥",
  },
  muk: {
    name: "Muk", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "sludge", moveName: "Gunk Shot", reaction: "roar", cry: "MUUUK!",
  },
  ekans: {
    name: "Ekans", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "bite", moveName: "Poison Fang", reaction: "smile", cry: "Ekans~ ♥",
  },
  arbok: {
    name: "Arbok", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "bite", moveName: "Poison Fang", reaction: "roar", cry: "CHAAARBOK!",
  },
  nidoran_f: {
    name: "Nidoran♀", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "pin", moveName: "Poison Sting", reaction: "smile", cry: "Nido~ ♥",
  },
  nidoran_m: {
    name: "Nidoran♂", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "pin", moveName: "Poison Sting", reaction: "smile", cry: "Nido! ♥",
  },
  nidoking: {
    name: "Nidoking", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "sludge", moveName: "Sludge Wave", reaction: "roar", cry: "NIDOKIIING!",
  },
  nidoqueen: {
    name: "Nidoqueen", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "hit", moveName: "Body Slam", reaction: "roar", cry: "NIDOQUEEN!",
  },
  zubat: {
    name: "Zubat", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "bite", moveName: "Leech Life", reaction: "smile", cry: "Zu-zu! ♥",
  },
  crobat: {
    name: "Crobat", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "air-cutter", moveName: "Cross Poison", reaction: "roar", cry: "CROOOBAT!",
  },
  koffing: {
    name: "Koffing", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "sludge-splat", moveName: "Smog", reaction: "smile", cry: "Koffing~ ♥",
  },
  weezing: {
    name: "Weezing", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { float: 3, fly: 1.5, roar: 1, attack: 1.5 }, move: "sludge-splat", moveName: "Poison Gas", reaction: "roar", cry: "WEEEZING!",
  },
  gulpin: {
    name: "Gulpin", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "sludge", moveName: "Stockpile", reaction: "smile", cry: "Gulp! ♥",
  },
  swalot: {
    name: "Swalot", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 3, walk: 2, roar: 1.5, attack: 1 }, move: "sludge", moveName: "Spit Up", reaction: "roar", cry: "SWAAALOT!",
  },
  seviper: {
    name: "Seviper", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "bite", moveName: "Poison Fang", reaction: "roar", cry: "Sssseviper!",
  },
  stunky: {
    name: "Stunky", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "sludge-splat", moveName: "Poison Gas", reaction: "smile", cry: "Stunk! ♥",
  },
  croagunk: {
    name: "Croagunk", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "punch-impact", moveName: "Poison Jab", reaction: "smile", cry: "Croak! ♥",
  },
  toxicroak: {
    name: "Toxicroak", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "punch-impact", moveName: "Poison Jab", reaction: "roar", cry: "TOXICROAK!",
  },
  trubbish: {
    name: "Trubbish", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "sludge", moveName: "Sludge", reaction: "smile", cry: "Trubb~ ♥",
  },
  garbodor: {
    name: "Garbodor", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 3, walk: 2, roar: 1.5, attack: 1 }, move: "sludge", moveName: "Gunk Shot", reaction: "roar", cry: "GARBODOR!",
  },
  salandit: {
    name: "Salandit", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "sludge-splat", moveName: "Poison Gas", reaction: "smile", cry: "Sala~ ♥",
  },
  mareanie: {
    name: "Mareanie", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "pin", moveName: "Poison Sting", reaction: "smile", cry: "Marea~ ♥",
  },
  shroodle: {
    name: "Shroodle", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "sludge", moveName: "Toxic", reaction: "smile", cry: "Shroo! ♥",
  },
  eternatus: {
    name: "Eternatus", movement: "air", exit: "fade", legendary: true, scale: 6.5, compactScale: 2.5,
    repertoire: {}, move: "sludge", moveName: "Dynamax Cannon", reaction: "roar", cry: "ETERNAAATUS!",
  },
  okidogi: {
    name: "Okidogi", movement: "ground", exit: "fade", legendary: true, scale: 3.5, compactScale: 2,
    repertoire: {}, move: "punch-impact", moveName: "Poison Jab", reaction: "roar", cry: "OKIDOGI!",
  },
  munkidori: {
    name: "Munkidori", movement: "ground", exit: "fade", legendary: true, scale: 2, compactScale: 1.5,
    repertoire: {}, move: "sludge", moveName: "Sludge Bomb", reaction: "roar", cry: "MUNKIDORI!",
  },
  fezandipiti: {
    name: "Fezandipiti", movement: "air", exit: "fade", legendary: true, scale: 2.5, compactScale: 1.5,
    repertoire: {}, move: "fairy-sparkle", moveName: "Moonblast", reaction: "roar", cry: "FEZANDIPITI!",
  },
  pecharunt: {
    name: "Pecharunt", movement: "ground", exit: "fade", mythical: true, scale: 1.5, compactScale: 1.25,
    repertoire: {}, move: "sludge-splat", moveName: "Malignant Chain", reaction: "smile", cry: "Peach~! ♥",
  },
  pidgey: {
    name: "Pidgey", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "gust", moveName: "Gust", reaction: "smile", cry: "Pidge! ♥",
  },
  pidgeotto: {
    name: "Pidgeotto", movement: "air", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "gust", moveName: "Gust", reaction: "smile", cry: "Pidgeo! ♥",
  },
  pidgeot: {
    name: "Pidgeot", movement: "air", exit: "fade", scale: 3.5, compactScale: 2, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "air-cutter", moveName: "Hurricane", reaction: "roar", cry: "PIDGEOOOT!",
  },
  spearow: {
    name: "Spearow", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "air-cutter", moveName: "Fury Attack", reaction: "roar", cry: "Spear!",
  },
  fearow: {
    name: "Fearow", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "air-cutter", moveName: "Drill Peck", reaction: "roar", cry: "FEAAAROW!",
  },
  farfetchd: {
    name: "Farfetch’d", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "razor-leaf", moveName: "Leaf Blade", reaction: "smile", cry: "Far-fetch! ♥",
  },
  doduo: {
    name: "Doduo", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Double Hit", reaction: "smile", cry: "Do-duo! ♥",
  },
  hoothoot: {
    name: "Hoothoot", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "spiral", moveName: "Hypnosis", reaction: "smile", cry: "Hoo-hoo~ ♥",
  },
  noctowl: {
    name: "Noctowl", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "spiral", moveName: "Extrasensory", reaction: "roar", cry: "Noct-OWL!",
  },
  taillow: {
    name: "Taillow", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "hit", moveName: "Quick Attack", reaction: "smile", cry: "Tail-low! ♥",
  },
  swellow: {
    name: "Swellow", movement: "air", exit: "fade", scale: 2, compactScale: 1.5, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "air-cutter", moveName: "Aerial Ace", reaction: "roar", cry: "Swellooow!",
  },
  swablu: {
    name: "Swablu", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "heart", moveName: "Sing", reaction: "smile", cry: "Swa~blu ♥",
  },
  altaria: {
    name: "Altaria", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5, roams: true,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "dragon-flame", moveName: "Dragon Breath", reaction: "smile", cry: "Altariaaa~ ♥",
  },
  starly: {
    name: "Starly", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "gust", moveName: "Gust", reaction: "smile", cry: "Star! ♥",
  },
  staraptor: {
    name: "Staraptor", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "air-cutter", moveName: "Brave Bird", reaction: "roar", cry: "STARAPTOR!",
  },
  chatot: {
    name: "Chatot", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "spiral", moveName: "Chatter", reaction: "smile", cry: "Chatter-chatter! ♥",
  },
  pidove: {
    name: "Pidove", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "gust", moveName: "Gust", reaction: "smile", cry: "Pi-dove! ♥",
  },
  ducklett: {
    name: "Ducklett", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "water-gun", moveName: "Water Gun", reaction: "smile", cry: "Duck! ♥",
  },
  rufflet: {
    name: "Rufflet", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "claw", moveName: "Crush Claw", reaction: "roar", cry: "Ruffle!",
  },
  braviary: {
    name: "Braviary", movement: "air", exit: "fade", scale: 3.5, compactScale: 2, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "air-cutter", moveName: "Sky Attack", reaction: "roar", cry: "BRAVIAAARY!",
  },
  pikipek: {
    name: "Pikipek", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "pin", moveName: "Peck", reaction: "smile", cry: "Pek-pek! ♥",
  },
  toucannon: {
    name: "Toucannon", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "small-ember", moveName: "Beak Blast", reaction: "roar", cry: "TOUCANNON!",
  },
  rookidee: {
    name: "Rookidee", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Peck", reaction: "smile", cry: "Rook! ♥",
  },
  tornadus: {
    name: "Tornadus", movement: "air", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "gust", moveName: "Hurricane", reaction: "roar", cry: "TORNADUS!",
  },
  thundurus: {
    name: "Thundurus", movement: "air", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "electricity", moveName: "Thunder", reaction: "roar", cry: "THUNDURUS!",
  },
  zapdos: {
    name: "Zapdos", movement: "air", exit: "fade", legendary: true, scale: 5.5, compactScale: 2.5,
    repertoire: {}, move: "electricity", moveName: "Drill Peck", reaction: "roar", cry: "ZAPDOOOS!",
  },
  rayquaza: {
    name: "Rayquaza", movement: "air", exit: "fade", legendary: true, scale: 6.5, compactScale: 2.5,
    repertoire: {}, move: "dragon-flame", moveName: "Dragon Ascent", reaction: "roar", cry: "RAYQUAZAAA!",
  },
  enamorus: {
    name: "Enamorus", movement: "air", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "fairy-sparkle", moveName: "Springtide Storm", reaction: "roar", cry: "ENAMORUS!",
  },
  ralts: {
    name: "Ralts", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "spiral", moveName: "Confusion", reaction: "smile", cry: "Ralts~ ♥",
  },
  kirlia: {
    name: "Kirlia", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "spiral", moveName: "Psybeam", reaction: "smile", cry: "Kirli~ ♥",
  },
  gardevoir: {
    name: "Gardevoir", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1, smile: 1.5, attack: 1.5 }, move: "fairy-sparkle", moveName: "Moonblast", reaction: "smile", cry: "Gardevoir~ ♥",
  },
  abra: {
    name: "Abra", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, smile: 2, attack: 1.5 }, move: "spiral", moveName: "Confusion", reaction: "smile", cry: "Abra… zzz ♥",
  },
  alakazam: {
    name: "Alakazam", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "spiral", moveName: "Psychic", reaction: "roar", cry: "ALAKAZAM!",
  },
  drowzee: {
    name: "Drowzee", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "spiral", moveName: "Hypnosis", reaction: "smile", cry: "Drowww~ ♥",
  },
  hypno: {
    name: "Hypno", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "spiral", moveName: "Hypnosis", reaction: "roar", cry: "Hyp-NO!",
  },
  mr_mime: {
    name: "Mr. Mime", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "spiral", moveName: "Psybeam", reaction: "smile", cry: "Mime-mime! ♥",
  },
  natu: {
    name: "Natu", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "spiral", moveName: "Future Sight", reaction: "smile", cry: "Na-tu! ♥",
  },
  xatu: {
    name: "Xatu", movement: "air", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "spiral", moveName: "Psychic", reaction: "roar", cry: "Xaaatu…",
  },
  espeon: {
    name: "Espeon", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "spiral", moveName: "Psybeam", reaction: "smile", cry: "Espi~ ♥",
  },
  wobbuffet: {
    name: "Wobbuffet", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 }, move: "hit", moveName: "Counter", reaction: "smile", cry: "Wobbuffet! ♥",
  },
  spoink: {
    name: "Spoink", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "spiral", moveName: "Psybeam", reaction: "smile", cry: "Spoink-spoink! ♥",
  },
  chimecho: {
    name: "Chimecho", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "spiral", moveName: "Extrasensory", reaction: "smile", cry: "Chiiime~ ♥",
  },
  munna: {
    name: "Munna", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "spiral", moveName: "Psybeam", reaction: "smile", cry: "Munna~ ♥",
  },
  musharna: {
    name: "Musharna", movement: "air", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "spiral", moveName: "Dream Eater", reaction: "smile", cry: "Mushaaa~ ♥",
  },
  woobat: {
    name: "Woobat", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "heart", moveName: "Heart Stamp", reaction: "smile", cry: "Woo! ♥",
  },
  sigilyph: {
    name: "Sigilyph", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "spiral", moveName: "Psybeam", reaction: "roar", cry: "Sigiii!",
  },
  gothita: {
    name: "Gothita", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "spiral", moveName: "Psybeam", reaction: "smile", cry: "Gothi~ ♥",
  },
  solosis: {
    name: "Solosis", movement: "air", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "spiral", moveName: "Psyshock", reaction: "smile", cry: "Solo~ ♥",
  },
  elgyem: {
    name: "Elgyem", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "spiral", moveName: "Psybeam", reaction: "smile", cry: "Elgy… ♥",
  },
  espurr: {
    name: "Espurr", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "spiral", moveName: "Psychic", reaction: "smile", cry: "Mew-purr ♥",
  },
  hatenna: {
    name: "Hatenna", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "spiral", moveName: "Confusion", reaction: "smile", cry: "Hat~ ♥",
  },
  mewtwo: {
    name: "Mewtwo", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "spiral", moveName: "Psystrike", reaction: "roar", cry: "MEWTWO!",
  },
  cresselia: {
    name: "Cresselia", movement: "air", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "spiral", moveName: "Lunar Dance", reaction: "roar", cry: "CRESSELIA!",
  },
  azelf: {
    name: "Azelf", movement: "air", exit: "fade", legendary: true, scale: 2, compactScale: 1.5,
    repertoire: {}, move: "spiral", moveName: "Extrasensory", reaction: "roar", cry: "AZELF!",
  },
  mew: {
    name: "Mew", movement: "air", exit: "fade", mythical: true, scale: 1.5, compactScale: 1.25,
    repertoire: {}, move: "spiral", moveName: "Psychic", reaction: "smile", cry: "Mew~ ♥",
  },
  deoxys: {
    name: "Deoxys", movement: "ground", exit: "fade", mythical: true, scale: 3, compactScale: 2,
    repertoire: {}, move: "spiral", moveName: "Psycho Boost", reaction: "smile", cry: "Deoxys~ ♥",
  },
  caterpie: {
    name: "Caterpie", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "pin", moveName: "String Shot", reaction: "smile", cry: "Cater~ ♥",
  },
  metapod: {
    name: "Metapod", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, smile: 2, attack: 1.5 }, move: "hit", moveName: "Harden", reaction: "smile", cry: "…pod. ♥",
  },
  butterfree: {
    name: "Butterfree", movement: "air", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "gust", moveName: "Gust", reaction: "smile", cry: "Freeee~ ♥",
  },
  weedle: {
    name: "Weedle", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "pin", moveName: "Poison Sting", reaction: "smile", cry: "Weedle! ♥",
  },
  beedrill: {
    name: "Beedrill", movement: "air", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "pin", moveName: "Twineedle", reaction: "roar", cry: "BZZZZZ!",
  },
  paras: {
    name: "Paras", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "sludge-splat", moveName: "Spore", reaction: "smile", cry: "Paras~ ♥",
  },
  venonat: {
    name: "Venonat", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "spiral", moveName: "Psybeam", reaction: "smile", cry: "Veno~ ♥",
  },
  scyther: {
    name: "Scyther", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "claw", moveName: "X-Scissor", reaction: "roar", cry: "SCYTHER!",
  },
  pinsir: {
    name: "Pinsir", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "claw", moveName: "Vise Grip", reaction: "roar", cry: "PINSIR!",
  },
  ledyba: {
    name: "Ledyba", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "punch-impact", moveName: "Comet Punch", reaction: "smile", cry: "Ledy~ ♥",
  },
  spinarak: {
    name: "Spinarak", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "pin", moveName: "Poison Sting", reaction: "smile", cry: "Spina~ ♥",
  },
  yanma: {
    name: "Yanma", movement: "air", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "air-cutter", moveName: "Air Slash", reaction: "smile", cry: "Yanma! ♥",
  },
  heracross: {
    name: "Heracross", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "hit", moveName: "Megahorn", reaction: "roar", cry: "HERACROSS!",
  },
  wurmple: {
    name: "Wurmple", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "pin", moveName: "Poison Sting", reaction: "smile", cry: "Wurm~ ♥",
  },
  volbeat: {
    name: "Volbeat", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "swift", moveName: "Signal Beam", reaction: "smile", cry: "Vol~ ♥",
  },
  illumise: {
    name: "Illumise", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "heart", moveName: "Sweet Scent", reaction: "smile", cry: "Illu~ ♥",
  },
  combee: {
    name: "Combee", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "pin", moveName: "Bug Bite", reaction: "smile", cry: "Bzz-bee! ♥",
  },
  sewaddle: {
    name: "Sewaddle", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "razor-leaf", moveName: "Razor Leaf", reaction: "smile", cry: "Waddle~ ♥",
  },
  karrablast: {
    name: "Karrablast", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "pin", moveName: "Fury Attack", reaction: "roar", cry: "Karra!",
  },
  shelmet: {
    name: "Shelmet", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, walk: 2, smile: 1.5, attack: 1 }, move: "sludge", moveName: "Acid", reaction: "smile", cry: "Shel~ ♥",
  },
  grubbin: {
    name: "Grubbin", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "bite", moveName: "Bug Bite", reaction: "smile", cry: "Grub! ♥",
  },
  cutiefly: {
    name: "Cutiefly", movement: "air", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "fairy-sparkle", moveName: "Fairy Wind", reaction: "smile", cry: "Cutie~ ♥",
  },
  scatterbug: {
    name: "Scatterbug", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "pin", moveName: "String Shot", reaction: "smile", cry: "Scatter~ ♥",
  },
  genesect: {
    name: "Genesect", movement: "ground", exit: "fade", mythical: true, scale: 2.5, compactScale: 1.5,
    repertoire: {}, move: "swift", moveName: "Techno Blast", reaction: "smile", cry: "Gene-sect! ♥",
  },
  buzzwole: {
    name: "Buzzwole", movement: "ground", exit: "fade", legendary: true, scale: 4, compactScale: 2,
    repertoire: {}, move: "fist", moveName: "Power-Up Punch", reaction: "roar", cry: "BZZWOLE!",
  },
  pheromosa: {
    name: "Pheromosa", movement: "ground", exit: "fade", legendary: true, scale: 3, compactScale: 2,
    repertoire: {}, move: "hit", moveName: "High Jump Kick", reaction: "roar", cry: "PHEROMOSA!",
  },
  slither_wing: {
    name: "Slither Wing", movement: "air", exit: "fade", legendary: true, scale: 4, compactScale: 2,
    repertoire: {}, move: "fist", moveName: "Close Combat", reaction: "roar", cry: "SLITHER WING!",
  },
  iron_moth: {
    name: "Iron Moth", movement: "air", exit: "fade", legendary: true, scale: 3.5, compactScale: 2,
    repertoire: {}, move: "small-ember", moveName: "Fiery Dance", reaction: "roar", cry: "IRON MOTH!",
  },
  geodude: {
    name: "Geodude", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "rock", moveName: "Rock Throw", reaction: "smile", cry: "Geo-dude! ♥",
  },
  graveler: {
    name: "Graveler", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "hit", moveName: "Rollout", reaction: "roar", cry: "Graveler!",
  },
  golem: {
    name: "Golem", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "rock", moveName: "Stone Edge", reaction: "roar", cry: "GOLEEEM!",
  },
  onix: {
    name: "Onix", movement: "ground", exit: "burrow", scale: 4.5, compactScale: 2.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "rock", moveName: "Rock Slide", reaction: "roar", cry: "ONIIIX!",
  },
  aerodactyl: {
    name: "Aerodactyl", movement: "air", exit: "fade", scale: 3.5, compactScale: 2, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "rock", moveName: "Ancient Power", reaction: "roar", cry: "AERODACTYL!",
  },
  omanyte: {
    name: "Omanyte", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "water-gun", moveName: "Water Gun", reaction: "smile", cry: "Oma~ ♥",
  },
  kabuto: {
    name: "Kabuto", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "claw", moveName: "Scratch", reaction: "smile", cry: "Kabu! ♥",
  },
  sudowoodo: {
    name: "Sudowoodo", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "rock", moveName: "Rock Slide", reaction: "smile", cry: "Sudo-woodo! ♥",
  },
  larvitar: {
    name: "Larvitar", movement: "ground", exit: "burrow", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "bite", moveName: "Bite", reaction: "roar", cry: "Larvi!",
  },
  tyranitar: {
    name: "Tyranitar", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "rock", moveName: "Stone Edge", reaction: "roar", cry: "TYRANITAAAR!",
  },
  shuckle: {
    name: "Shuckle", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, smile: 2, attack: 1.5 }, move: "rock", moveName: "Rock Throw", reaction: "smile", cry: "Shuck~ ♥",
  },
  nosepass: {
    name: "Nosepass", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 3, roar: 2, attack: 1.5 }, move: "rock", moveName: "Rock Tomb", reaction: "roar", cry: "Nose-PASS!",
  },
  lunatone: {
    name: "Lunatone", movement: "air", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { float: 3, fly: 1.5, roar: 1, attack: 1.5 }, move: "spiral", moveName: "Psychic", reaction: "roar", cry: "Lunaaa…",
  },
  solrock: {
    name: "Solrock", movement: "air", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { float: 3, fly: 1.5, roar: 1, attack: 1.5 }, move: "ember", moveName: "Flare Blitz", reaction: "roar", cry: "Solrrrock!",
  },
  lileep: {
    name: "Lileep", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, smile: 2, attack: 1.5 }, move: "growth", moveName: "Absorb", reaction: "smile", cry: "Lileep~ ♥",
  },
  anorith: {
    name: "Anorith", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "claw", moveName: "Metal Claw", reaction: "smile", cry: "Anori! ♥",
  },
  cranidos: {
    name: "Cranidos", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "hit", moveName: "Headbutt", reaction: "roar", cry: "Cranidos!",
  },
  shieldon: {
    name: "Shieldon", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Tackle", reaction: "smile", cry: "Shiel~ ♥",
  },
  bonsly: {
    name: "Bonsly", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "rock", moveName: "Rock Throw", reaction: "smile", cry: "Bon-bon~ ♥",
  },
  roggenrola: {
    name: "Roggenrola", movement: "ground", exit: "burrow", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "rock", moveName: "Rock Blast", reaction: "smile", cry: "Rogg! ♥",
  },
  rockruff: {
    name: "Rockruff", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "bite", moveName: "Bite", reaction: "smile", cry: "Ruff ruff! ♥",
  },
  carbink: {
    name: "Carbink", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "fairy-sparkle", moveName: "Dazzling Gleam", reaction: "smile", cry: "Car~bink ♥",
  },
  nacli: {
    name: "Nacli", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "rock", moveName: "Salt Cure", reaction: "smile", cry: "Nacli! ♥",
  },
  terrakion: {
    name: "Terrakion", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "rock", moveName: "Head Smash", reaction: "roar", cry: "TERRAKION!",
  },
  nihilego: {
    name: "Nihilego", movement: "air", exit: "fade", legendary: true, scale: 3.5, compactScale: 2,
    repertoire: {}, move: "rock", moveName: "Power Gem", reaction: "roar", cry: "…NIHILEGO…",
  },
  stakataka: {
    name: "Stakataka", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "rock", moveName: "Rock Slide", reaction: "roar", cry: "STAKATAKA!",
  },
  iron_boulder: {
    name: "Iron Boulder", movement: "ground", exit: "fade", legendary: true, scale: 3.5, compactScale: 2,
    repertoire: {}, move: "rock", moveName: "Mighty Cleave", reaction: "roar", cry: "IRON BOULDER!",
  },
  iron_thorns: {
    name: "Iron Thorns", movement: "ground", exit: "fade", legendary: true, scale: 4, compactScale: 2,
    repertoire: {}, move: "electricity", moveName: "Thunder Fang", reaction: "roar", cry: "IRON THORNS!",
  },
  dratini: {
    name: "Dratini", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "spiral", moveName: "Twister", reaction: "smile", cry: "Dra~tini ♥",
  },
  dragonair: {
    name: "Dragonair", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "dragon-flame", moveName: "Dragon Breath", reaction: "smile", cry: "Dragonaaair~ ♥",
  },
  dragonite: {
    name: "Dragonite", movement: "air", exit: "fade", scale: 3.5, compactScale: 2, roams: true,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "dragon-plume", moveName: "Dragon Rush", reaction: "smile", cry: "Dragonite! ♥",
  },
  bagon: {
    name: "Bagon", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "hit", moveName: "Headbutt", reaction: "roar", cry: "Bagon!",
  },
  shelgon: {
    name: "Shelgon", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 3, roar: 2, attack: 1.5 }, move: "dragon-flame", moveName: "Dragon Breath", reaction: "roar", cry: "Shelgon…",
  },
  salamence: {
    name: "Salamence", movement: "air", exit: "fade", scale: 3.5, compactScale: 2, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "dragon-flame", moveName: "Outrage", reaction: "roar", cry: "SALAMENCE!",
  },
  axew: {
    name: "Axew", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "claw", moveName: "Scratch", reaction: "smile", cry: "Axew! ♥",
  },
  haxorus: {
    name: "Haxorus", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "claw", moveName: "Dragon Claw", reaction: "roar", cry: "HAXORUS!",
  },
  deino: {
    name: "Deino", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "bite", moveName: "Bite", reaction: "roar", cry: "Dei!",
  },
  hydreigon: {
    name: "Hydreigon", movement: "air", exit: "fade", scale: 3.5, compactScale: 2, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "dragon-flame", moveName: "Dragon Pulse", reaction: "roar", cry: "HYDREIGON!",
  },
  goomy: {
    name: "Goomy", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "water-gun", moveName: "Water Gun", reaction: "smile", cry: "Goomy~ ♥",
  },
  goodra: {
    name: "Goodra", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1, smile: 1.5, attack: 1.5 }, move: "dragon-flame", moveName: "Dragon Pulse", reaction: "smile", cry: "Goodraaa~ ♥",
  },
  jangmo_o: {
    name: "Jangmo-o", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Headbutt", reaction: "smile", cry: "Jangmo! ♥",
  },
  kommo_o: {
    name: "Kommo-o", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "punch-impact", moveName: "Sky Uppercut", reaction: "roar", cry: "KOMMO-O!",
  },
  dreepy: {
    name: "Dreepy", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "shadow-ball", moveName: "Infestation", reaction: "smile", cry: "Dreep~ ♥",
  },
  dragapult: {
    name: "Dragapult", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5, roams: true,
    repertoire: { float: 3, fly: 1.5, roar: 1, attack: 1.5 }, move: "shadow-ball", moveName: "Dragon Darts", reaction: "roar", cry: "DRAGAPULT!",
  },
  noibat: {
    name: "Noibat", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "spiral", moveName: "Supersonic", reaction: "smile", cry: "Noi! ♥",
  },
  noivern: {
    name: "Noivern", movement: "air", exit: "fade", scale: 3.5, compactScale: 2, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "spiral", moveName: "Boomburst", reaction: "roar", cry: "NOIVERN!",
  },
  druddigon: {
    name: "Druddigon", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "claw", moveName: "Dragon Claw", reaction: "roar", cry: "Druddigon!",
  },
  applin: {
    name: "Applin", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 3, smile: 2, attack: 1.5 }, move: "razor-leaf", moveName: "Grav Apple", reaction: "smile", cry: "Apple~ ♥",
  },
  cyclizar: {
    name: "Cyclizar", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Dragon Rush", reaction: "smile", cry: "Cyclizar! ♥",
  },
  frigibax: {
    name: "Frigibax", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "icicle", moveName: "Ice Shard", reaction: "smile", cry: "Frigi! ♥",
  },
  drampa: {
    name: "Drampa", movement: "air", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "dragon-flame", moveName: "Dragon Breath", reaction: "smile", cry: "Drampaaa~ ♥",
  },
  reshiram: {
    name: "Reshiram", movement: "air", exit: "fade", legendary: true, scale: 6.5, compactScale: 2.5,
    repertoire: {}, move: "fire-plume", moveName: "Blue Flare", reaction: "roar", cry: "RESHIRAAAM!",
  },
  latias: {
    name: "Latias", movement: "air", exit: "fade", legendary: true, scale: 3, compactScale: 2,
    repertoire: {}, move: "dragon-flame", moveName: "Mist Ball", reaction: "roar", cry: "LATIAAAS!",
  },
  latios: {
    name: "Latios", movement: "air", exit: "fade", legendary: true, scale: 3, compactScale: 2,
    repertoire: {}, move: "dragon-flame", moveName: "Luster Purge", reaction: "roar", cry: "LATIOOOS!",
  },
  regidrago: {
    name: "Regidrago", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "dragon-plume", moveName: "Dragon Energy", reaction: "roar", cry: "ZZT-DRAGO!",
  },
  palkia: {
    name: "Palkia", movement: "ground", exit: "fade", legendary: true, scale: 6.5, compactScale: 2.5,
    repertoire: {}, move: "water-splash", moveName: "Spacial Rend", reaction: "roar", cry: "PAAALKIA!",
  },
  umbreon: {
    name: "Umbreon", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "shadow-ball", moveName: "Feint Attack", reaction: "smile", cry: "Umbre~ ♥",
  },
  poochyena: {
    name: "Poochyena", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "bite", moveName: "Bite", reaction: "roar", cry: "Pooch!",
  },
  mightyena: {
    name: "Mightyena", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "bite", moveName: "Crunch", reaction: "roar", cry: "MIGHTYENAAA!",
  },
  murkrow: {
    name: "Murkrow", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "air-cutter", moveName: "Pursuit", reaction: "smile", cry: "Murk-murk! ♥",
  },
  honchkrow: {
    name: "Honchkrow", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "air-cutter", moveName: "Night Slash", reaction: "roar", cry: "HONCHKROW!",
  },
  absol: {
    name: "Absol", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "claw", moveName: "Night Slash", reaction: "roar", cry: "Absooool!",
  },
  zorua: {
    name: "Zorua", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "claw", moveName: "Fury Swipes", reaction: "smile", cry: "Zoru~ ♥",
  },
  zoroark: {
    name: "Zoroark", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "shadow-ball", moveName: "Night Daze", reaction: "roar", cry: "ZOROARK!",
  },
  purrloin: {
    name: "Purrloin", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "claw", moveName: "Fury Swipes", reaction: "smile", cry: "Purr~ ♥",
  },
  liepard: {
    name: "Liepard", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "claw", moveName: "Night Slash", reaction: "roar", cry: "Liepard!",
  },
  pawniard: {
    name: "Pawniard", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "claw", moveName: "Fury Cutter", reaction: "roar", cry: "Pawn!",
  },
  bisharp: {
    name: "Bisharp", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "claw", moveName: "Night Slash", reaction: "roar", cry: "BISHARP!",
  },
  kingambit: {
    name: "Kingambit", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "claw", moveName: "Kowtow Cleave", reaction: "roar", cry: "KINGAMBIT!",
  },
  vullaby: {
    name: "Vullaby", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "gust", moveName: "Gust", reaction: "smile", cry: "Vulla~ ♥",
  },
  mandibuzz: {
    name: "Mandibuzz", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "rock", moveName: "Bone Rush", reaction: "roar", cry: "MANDIBUZZ!",
  },
  inkay: {
    name: "Inkay", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "spiral", moveName: "Psybeam", reaction: "smile", cry: "Inkay~ ♥",
  },
  malamar: {
    name: "Malamar", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { float: 3, fly: 1.5, roar: 1, attack: 1.5 }, move: "spiral", moveName: "Topsy-Turvy", reaction: "roar", cry: "Malamaaar…",
  },
  nickit: {
    name: "Nickit", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "bite", moveName: "Snarl", reaction: "smile", cry: "Nickit! ♥",
  },
  thievul: {
    name: "Thievul", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "bite", moveName: "Thief", reaction: "roar", cry: "Thievul!",
  },
  impidimp: {
    name: "Impidimp", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "heart", moveName: "Draining Kiss", reaction: "smile", cry: "Impi~ ♥",
  },
  grimmsnarl: {
    name: "Grimmsnarl", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "punch-impact", moveName: "Spirit Break", reaction: "roar", cry: "GRIMMSNARL!",
  },
  maschiff: {
    name: "Maschiff", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "bite", moveName: "Bite", reaction: "roar", cry: "Masch!",
  },
  obstagoon: {
    name: "Obstagoon", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "hit", moveName: "Throat Chop", reaction: "roar", cry: "OBSTAGOON!",
  },
  yveltal: {
    name: "Yveltal", movement: "air", exit: "fade", legendary: true, scale: 6.5, compactScale: 2.5,
    repertoire: {}, move: "shadow-ball", moveName: "Oblivion Wing", reaction: "roar", cry: "YVELTAAAL!",
  },
  darkrai: {
    name: "Darkrai", movement: "air", exit: "fade", mythical: true, scale: 3, compactScale: 2,
    repertoire: {}, move: "shadow-ball", moveName: "Dark Void", reaction: "smile", cry: "…Darkrai~ ♥",
  },
  chi_yu: {
    name: "Chi-Yu", movement: "air", exit: "fade", legendary: true, scale: 2, compactScale: 1.5,
    repertoire: {}, move: "ember", moveName: "Flamethrower", reaction: "roar", cry: "CHI-YU!",
  },
  ting_lu: {
    name: "Ting-Lu", movement: "ground", exit: "fade", legendary: true, scale: 5, compactScale: 2.5,
    repertoire: {}, move: "rock", moveName: "Stomping Tantrum", reaction: "roar", cry: "TING-LU!",
  },
  guzzlord: {
    name: "Guzzlord", movement: "ground", exit: "fade", legendary: true, scale: 5, compactScale: 2.5,
    repertoire: {}, move: "bite", moveName: "Crunch", reaction: "roar", cry: "GUZZLORD!",
  },
  aron: {
    name: "Aron", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Headbutt", reaction: "smile", cry: "Aron! ♥",
  },
  lairon: {
    name: "Lairon", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "hit", moveName: "Iron Head", reaction: "roar", cry: "Lairon!",
  },
  aggron: {
    name: "Aggron", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "hit", moveName: "Heavy Slam", reaction: "roar", cry: "AGGROOON!",
  },
  steelix: {
    name: "Steelix", movement: "ground", exit: "burrow", scale: 4.5, compactScale: 2.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "metal", moveName: "Gyro Ball", reaction: "roar", cry: "STEELIX!",
  },
  scizor: {
    name: "Scizor", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "fist", moveName: "Bullet Punch", reaction: "roar", cry: "SCIZOR!",
  },
  skarmory: {
    name: "Skarmory", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "air-cutter", moveName: "Steel Wing", reaction: "roar", cry: "SKARMORY!",
  },
  forretress: {
    name: "Forretress", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 3, roar: 2, attack: 1.5 }, move: "metal", moveName: "Gyro Ball", reaction: "roar", cry: "Forre!",
  },
  mawile: {
    name: "Mawile", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "bite", moveName: "Crunch", reaction: "smile", cry: "Mawile~ ♥",
  },
  beldum: {
    name: "Beldum", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 3, fly: 1.5, roar: 1, attack: 1.5 }, move: "hit", moveName: "Take Down", reaction: "roar", cry: "Bel-dum.",
  },
  metang: {
    name: "Metang", movement: "air", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { float: 3, fly: 1.5, roar: 1, attack: 1.5 }, move: "fist", moveName: "Bullet Punch", reaction: "roar", cry: "Metang!",
  },
  metagross: {
    name: "Metagross", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "fist", moveName: "Meteor Mash", reaction: "roar", cry: "METAGROSS!",
  },
  bronzor: {
    name: "Bronzor", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "metal", moveName: "Gyro Ball", reaction: "smile", cry: "Bronz~ ♥",
  },
  bronzong: {
    name: "Bronzong", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { float: 3, fly: 1.5, roar: 1, attack: 1.5 }, move: "metal", moveName: "Gyro Ball", reaction: "roar", cry: "BRONZONG…",
  },
  probopass: {
    name: "Probopass", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 3, roar: 2, attack: 1.5 }, move: "metal", moveName: "Flash Cannon", reaction: "roar", cry: "Probo!",
  },
  klink: {
    name: "Klink", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "metal", moveName: "Gear Grind", reaction: "smile", cry: "Klink-klink! ♥",
  },
  klinklang: {
    name: "Klinklang", movement: "air", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { float: 3, fly: 1.5, roar: 1, attack: 1.5 }, move: "metal", moveName: "Gear Grind", reaction: "roar", cry: "KLINKLANG!",
  },
  ferroseed: {
    name: "Ferroseed", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 3, smile: 2, attack: 1.5 }, move: "pin", moveName: "Pin Missile", reaction: "smile", cry: "Ferro~ ♥",
  },
  ferrothorn: {
    name: "Ferrothorn", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 3, roar: 2, attack: 1.5 }, move: "pin", moveName: "Pin Missile", reaction: "roar", cry: "Ferrothorn!",
  },
  durant: {
    name: "Durant", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "claw", moveName: "Metal Claw", reaction: "roar", cry: "Durant!",
  },
  cufant: {
    name: "Cufant", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Iron Head", reaction: "smile", cry: "Cufant! ♥",
  },
  copperajah: {
    name: "Copperajah", movement: "ground", exit: "fade", scale: 3.5, compactScale: 2,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "hit", moveName: "Heavy Slam", reaction: "roar", cry: "COPPERAJAH!",
  },
  corviknight: {
    name: "Corviknight", movement: "air", exit: "fade", scale: 3.5, compactScale: 2, roams: true,
    repertoire: { fly: 3, float: 2, roar: 1, attack: 1.5 }, move: "air-cutter", moveName: "Steel Wing", reaction: "roar", cry: "CORVIKNIGHT!",
  },
  gimmighoul: {
    name: "Gimmighoul", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "swift", moveName: "Make It Rain", reaction: "smile", cry: "Gimmi! ♥",
  },
  dialga: {
    name: "Dialga", movement: "ground", exit: "fade", legendary: true, scale: 6.5, compactScale: 2.5,
    repertoire: {}, move: "dragon-plume", moveName: "Roar of Time", reaction: "roar", cry: "DIAAALGA!",
  },
  registeel: {
    name: "Registeel", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "metal", moveName: "Flash Cannon", reaction: "roar", cry: "ZZT-STEEL!",
  },
  cobalion: {
    name: "Cobalion", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "metal", moveName: "Iron Head", reaction: "roar", cry: "COBALION!",
  },
  heatran: {
    name: "Heatran", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "fire-plume", moveName: "Magma Storm", reaction: "roar", cry: "HEATRAAAN!",
  },
  jirachi: {
    name: "Jirachi", movement: "air", exit: "fade", mythical: true, scale: 1.5, compactScale: 1.25,
    repertoire: {}, move: "swift", moveName: "Doom Desire", reaction: "smile", cry: "Jira~chi ♥",
  },
  togepi: {
    name: "Togepi", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "heart", moveName: "Charm", reaction: "smile", cry: "Toge-priii! ♥",
  },
  togetic: {
    name: "Togetic", movement: "air", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "fairy-sparkle", moveName: "Fairy Wind", reaction: "smile", cry: "Togetic~ ♥",
  },
  togekiss: {
    name: "Togekiss", movement: "air", exit: "fade", scale: 2.5, compactScale: 1.5, roams: true,
    repertoire: { fly: 3, float: 2, smile: 1, attack: 1.5 }, move: "air-cutter", moveName: "Air Slash", reaction: "smile", cry: "Togekiss~ ♥",
  },
  clefairy: {
    name: "Clefairy", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "swift", moveName: "Metronome", reaction: "smile", cry: "Clefairy~ ♥",
  },
  clefable: {
    name: "Clefable", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "fairy-sparkle", moveName: "Moonblast", reaction: "smile", cry: "Clefaaa~ ♥",
  },
  cleffa: {
    name: "Cleffa", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "heart", moveName: "Charm", reaction: "smile", cry: "Cleffa~ ♥",
  },
  snubbull: {
    name: "Snubbull", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "bite", moveName: "Bite", reaction: "roar", cry: "Snub!",
  },
  granbull: {
    name: "Granbull", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "bite", moveName: "Crunch", reaction: "roar", cry: "GRANBULL!",
  },
  flabebe: {
    name: "Flabébé", movement: "air", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "fairy-sparkle", moveName: "Fairy Wind", reaction: "smile", cry: "Flabé~ ♥",
  },
  floette: {
    name: "Floette", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "fairy-sparkle", moveName: "Dazzling Gleam", reaction: "smile", cry: "Floe~ ♥",
  },
  florges: {
    name: "Florges", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "fairy-sparkle", moveName: "Moonblast", reaction: "smile", cry: "Florgesss~ ♥",
  },
  spritzee: {
    name: "Spritzee", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "heart", moveName: "Sweet Scent", reaction: "smile", cry: "Spritz~ ♥",
  },
  aromatisse: {
    name: "Aromatisse", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "heart", moveName: "Aromatherapy", reaction: "smile", cry: "Aroma~ ♥",
  },
  swirlix: {
    name: "Swirlix", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "heart", moveName: "Sweet Scent", reaction: "smile", cry: "Swirl~ ♥",
  },
  slurpuff: {
    name: "Slurpuff", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "heart", moveName: "Draining Kiss", reaction: "smile", cry: "Slurpuff! ♥",
  },
  sylveon: {
    name: "Sylveon", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "fairy-sparkle", moveName: "Moonblast", reaction: "smile", cry: "Sylveon~ ♥",
  },
  klefki: {
    name: "Klefki", movement: "air", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "fairy-sparkle", moveName: "Fairy Lock", reaction: "smile", cry: "Klink-klefki! ♥",
  },
  comfey: {
    name: "Comfey", movement: "air", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { float: 4, fly: 1.5, smile: 1.5, attack: 1 }, move: "fairy-sparkle", moveName: "Draining Kiss", reaction: "smile", cry: "Comfey~ ♥",
  },
  milcery: {
    name: "Milcery", movement: "ground", exit: "fade", scale: 1, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "heart", moveName: "Sweet Kiss", reaction: "smile", cry: "Milcery~ ♥",
  },
  hatterene: {
    name: "Hatterene", movement: "ground", exit: "fade", scale: 2.5, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, roar: 1, attack: 1.5 }, move: "fairy-sparkle", moveName: "Dazzling Gleam", reaction: "roar", cry: "Hatterene…",
  },
  tinkatink: {
    name: "Tinkatink", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "hit", moveName: "Play Rough", reaction: "smile", cry: "Tinka! ♥",
  },
  tinkaton: {
    name: "Tinkaton", movement: "ground", exit: "fade", scale: 2, compactScale: 1.5,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1, roar: 1, attack: 1.5 }, move: "hit", moveName: "Gigaton Hammer", reaction: "roar", cry: "TINKATON!",
  },
  fidough: {
    name: "Fidough", movement: "ground", exit: "fade", scale: 1.5, compactScale: 1,
    repertoire: { idle: 2, walk: 3, run: 1.5, jump: 1.5, smile: 1.5, attack: 1.5 }, move: "bite", moveName: "Play Rough", reaction: "smile", cry: "Fido! ♥",
  },
  xerneas: {
    name: "Xerneas", movement: "ground", exit: "fade", legendary: true, scale: 5, compactScale: 2.5,
    repertoire: {}, move: "fairy-sparkle", moveName: "Geomancy", reaction: "roar", cry: "XERNEAS!",
  },
  zacian: {
    name: "Zacian", movement: "ground", exit: "fade", legendary: true, scale: 4.5, compactScale: 2.5,
    repertoire: {}, move: "claw", moveName: "Behemoth Blade", reaction: "roar", cry: "ZACIAN!",
  },
  tapu_lele: {
    name: "Tapu Lele", movement: "air", exit: "fade", legendary: true, scale: 2.5, compactScale: 1.5,
    repertoire: {}, move: "fairy-sparkle", moveName: "Dazzling Gleam", reaction: "roar", cry: "TAPU LELE!",
  },
  tapu_fini: {
    name: "Tapu Fini", movement: "air", exit: "fade", legendary: true, scale: 2.5, compactScale: 1.5,
    repertoire: {}, move: "water-splash", moveName: "Muddy Water", reaction: "roar", cry: "TAPU FINI!",
  },
  magearna: {
    name: "Magearna", movement: "ground", exit: "fade", mythical: true, scale: 1.5, compactScale: 1.25,
    repertoire: {}, move: "fairy-sparkle", moveName: "Fleur Cannon", reaction: "smile", cry: "Magearna~ ♥",
  },
};

/**
 * Twenty-eight of each theme's type, five of them rare visitors (legendary, mythical, or for Rock, Bug and Dark an Ultra
 * Beast or Paradox Pokémon); the first is the theme's partner and never leaves the stage.
 * Drifblim and Sandslash are benched to make room for the mythicals; swap a name back in to return them.
 */
export const RESIDENTS: Record<PokemonTheme, PokemonSpecies[]> = {
  gengar: ["gengar", "haunter", "gastly", "giratina", "mismagius", "marshadow", "chandelure", "dusknoir", "sableye", "mimikyu", "duskull", "drifloon", "litwick", "phantump", "pumpkaboo", "misdreavus", "shuppet", "banette", "dusclops", "spiritomb", "froslass", "golett", "honedge", "sinistea", "greavard", "lunala", "spectrier", "hoopa"],
  gible: ["gible", "garchomp", "flygon", "diglett", "donphan", "groudon", "cubone", "diancie", "hippowdon", "gliscor", "sandshrew", "trapinch", "rhyhorn", "drilbur", "numel", "phanpy", "swinub", "hippopotas", "gligar", "sandile", "mudbray", "wooper", "baltoy", "dugtrio", "marowak", "landorus", "zygarde", "regirock"],
  piplup: ["piplup", "squirtle", "psyduck", "totodile", "vaporeon", "lapras", "gyarados", "pelipper", "kyogre", "manaphy", "mudkip", "buizel", "poliwag", "clamperl", "finneon", "marill", "horsea", "staryu", "corphish", "slowpoke", "seel", "wingull", "froakie", "popplio", "sobble", "lugia", "suicune", "keldeo"],
  charmander: ["charmander", "cyndaquil", "vulpix", "ponyta", "arcanine", "magmar", "charizard", "talonflame", "ho_oh", "victini", "torchic", "fennekin", "litten", "fuecoco", "charcadet", "growlithe", "houndour", "slugma", "torkoal", "chimchar", "tepig", "scorbunny", "litleo", "fletchinder", "larvesta", "moltres", "entei", "volcanion"],
  bulbasaur: ["bulbasaur", "venusaur", "chikorita", "treecko", "oddish", "leafeon", "jumpluff", "tropius", "virizion", "celebi", "snivy", "turtwig", "seedot", "petilil", "smoliv", "hoppip", "sunkern", "budew", "shroomish", "cherubi", "rowlet", "grookey", "sprigatito", "chespin", "bounsweet", "tapu_bulu", "shaymin", "zarude"],
  eevee: ["eevee", "snorlax", "meowth", "jigglypuff", "chansey", "kangaskhan", "tauros", "ditto", "porygon", "sentret", "aipom", "dunsparce", "teddiursa", "miltank", "zigzagoon", "slakoth", "skitty", "buneary", "lillipup", "minccino", "wooloo", "lechonk", "smeargle", "regigigas", "terapagos", "type_null", "silvally", "arceus"],
  pikachu: ["pikachu", "raichu", "pichu", "voltorb", "electabuzz", "jolteon", "mareep", "ampharos", "electrike", "manectric", "plusle", "minun", "shinx", "luxray", "pachirisu", "emolga", "magnemite", "tynamo", "dedenne", "yamper", "pawmi", "rotom", "helioptile", "raikou", "zekrom", "regieleki", "miraidon", "zeraora"],
  snorunt: ["snorunt", "glalie", "sneasel", "weavile", "delibird", "smoochum", "jynx", "spheal", "walrein", "snover", "abomasnow", "glaceon", "vanillite", "vanilluxe", "cubchoo", "beartic", "cryogonal", "bergmite", "avalugg", "snom", "frosmoth", "eiscue", "cetoddle", "articuno", "kyurem", "regice", "glastrier", "chien_pao"],
  riolu: ["riolu", "lucario", "machop", "machamp", "mankey", "primeape", "hitmonlee", "hitmonchan", "hitmontop", "tyrogue", "makuhita", "hariyama", "meditite", "timburr", "conkeldurr", "throh", "sawk", "mienfoo", "scraggy", "pancham", "hawlucha", "stufful", "passimian", "zamazenta", "urshifu", "kubfu", "koraidon", "meloetta"],
  grimer: ["grimer", "muk", "ekans", "arbok", "nidoran_f", "nidoran_m", "nidoking", "nidoqueen", "zubat", "crobat", "koffing", "weezing", "gulpin", "swalot", "seviper", "stunky", "croagunk", "toxicroak", "trubbish", "garbodor", "salandit", "mareanie", "shroodle", "eternatus", "okidogi", "munkidori", "fezandipiti", "pecharunt"],
  pidgey: ["pidgey", "pidgeotto", "pidgeot", "spearow", "fearow", "farfetchd", "doduo", "hoothoot", "noctowl", "taillow", "swellow", "swablu", "altaria", "starly", "staraptor", "chatot", "pidove", "ducklett", "rufflet", "braviary", "pikipek", "toucannon", "rookidee", "tornadus", "thundurus", "zapdos", "rayquaza", "enamorus"],
  ralts: ["ralts", "kirlia", "gardevoir", "abra", "alakazam", "drowzee", "hypno", "mr_mime", "natu", "xatu", "espeon", "wobbuffet", "spoink", "chimecho", "munna", "musharna", "woobat", "sigilyph", "gothita", "solosis", "elgyem", "espurr", "hatenna", "mewtwo", "cresselia", "azelf", "mew", "deoxys"],
  caterpie: ["caterpie", "metapod", "butterfree", "weedle", "beedrill", "paras", "venonat", "scyther", "pinsir", "ledyba", "spinarak", "yanma", "heracross", "wurmple", "volbeat", "illumise", "combee", "sewaddle", "karrablast", "shelmet", "grubbin", "cutiefly", "scatterbug", "genesect", "buzzwole", "pheromosa", "slither_wing", "iron_moth"],
  geodude: ["geodude", "graveler", "golem", "onix", "aerodactyl", "omanyte", "kabuto", "sudowoodo", "larvitar", "tyranitar", "shuckle", "nosepass", "lunatone", "solrock", "lileep", "anorith", "cranidos", "shieldon", "bonsly", "roggenrola", "rockruff", "carbink", "nacli", "terrakion", "nihilego", "stakataka", "iron_boulder", "iron_thorns"],
  dratini: ["dratini", "dragonair", "dragonite", "bagon", "shelgon", "salamence", "axew", "haxorus", "deino", "hydreigon", "goomy", "goodra", "jangmo_o", "kommo_o", "dreepy", "dragapult", "noibat", "noivern", "druddigon", "applin", "cyclizar", "frigibax", "drampa", "reshiram", "latias", "latios", "regidrago", "palkia"],
  umbreon: ["umbreon", "poochyena", "mightyena", "murkrow", "honchkrow", "absol", "zorua", "zoroark", "purrloin", "liepard", "pawniard", "bisharp", "kingambit", "vullaby", "mandibuzz", "inkay", "malamar", "nickit", "thievul", "impidimp", "grimmsnarl", "maschiff", "obstagoon", "yveltal", "darkrai", "chi_yu", "ting_lu", "guzzlord"],
  aron: ["aron", "lairon", "aggron", "steelix", "scizor", "skarmory", "forretress", "mawile", "beldum", "metang", "metagross", "bronzor", "bronzong", "probopass", "klink", "klinklang", "ferroseed", "ferrothorn", "durant", "cufant", "copperajah", "corviknight", "gimmighoul", "dialga", "registeel", "cobalion", "heatran", "jirachi"],
  togepi: ["togepi", "togetic", "togekiss", "clefairy", "clefable", "cleffa", "snubbull", "granbull", "flabebe", "floette", "florges", "spritzee", "aromatisse", "swirlix", "slurpuff", "sylveon", "klefki", "comfey", "milcery", "hatterene", "tinkatink", "tinkaton", "fidough", "xerneas", "zacian", "tapu_lele", "tapu_fini", "magearna"],
};

export type ThemeInfo = {
  /** The habitat's type, shown on its badge. */
  type: string;
  habitat: string;
  /** Badge and swatch colour in the selector, readable on every theme's background. */
  swatch: string;
};

/** Selector order, and the order "In order" rotation walks through. */
export const THEME_ORDER: PokemonTheme[] = [
  "gengar", "gible", "piplup", "charmander", "bulbasaur",
  "eevee", "pikachu", "snorunt", "riolu", "grimer", "pidgey", "ralts", "caterpie", "geodude", "dratini", "umbreon", "aron", "togepi",
];
export const THEMES: Record<PokemonTheme, ThemeInfo> = {
  gengar: { type: "Ghost", habitat: "Moonlit graveyard", swatch: "#b79aff" },
  gible: { type: "Ground", habitat: "Mountain trail", swatch: "#e2b666" },
  piplup: { type: "Water", habitat: "Starlit shore", swatch: "#6ec3f5" },
  charmander: { type: "Fire", habitat: "Ember caldera", swatch: "#ff8a4c" },
  bulbasaur: { type: "Grass", habitat: "Mossy grove", swatch: "#86d17a" },
  eevee: { type: "Normal", habitat: "Sunny pasture", swatch: "#e3cfa8" },
  pikachu: { type: "Electric", habitat: "Thunder plateau", swatch: "#f7d84a" },
  snorunt: { type: "Ice", habitat: "Aurora tundra", swatch: "#9fe6f2" },
  riolu: { type: "Fighting", habitat: "Mountain dojo", swatch: "#f07257" },
  grimer: { type: "Poison", habitat: "Toxic marsh", swatch: "#c98ae6" },
  pidgey: { type: "Flying", habitat: "Cloud cliffs", swatch: "#b2c6ff" },
  ralts: { type: "Psychic", habitat: "Astral garden", swatch: "#ff86ba" },
  caterpie: { type: "Bug", habitat: "Bramble thicket", swatch: "#bad84a" },
  geodude: { type: "Rock", habitat: "Boulder canyon", swatch: "#ccb48a" },
  dratini: { type: "Dragon", habitat: "Waterfall shrine", swatch: "#949aff" },
  umbreon: { type: "Dark", habitat: "Midnight ruins", swatch: "#a0a8c8" },
  aron: { type: "Steel", habitat: "Iron foundry", swatch: "#c3cfd9" },
  togepi: { type: "Fairy", habitat: "Candy garden", swatch: "#ffb3dc" },
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
