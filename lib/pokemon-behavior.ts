import { RESIDENTS, SPECIES, type PokemonSpecies, type PokemonTheme, type SpeciesInfo, type VisibleActivity } from "./pokemon-roster.ts";

export type PokemonActivity = VisibleActivity | "vanish" | "hidden" | "appear" | "burrow" | "underground" | "emerge";
export type HabitatPoint = { x: number; y: number };
export type PokemonRoutine = {
  activity: PokemonActivity;
  from: HabitatPoint;
  to: HabitatPoint;
  duration: number;
  facing: 1 | -1;
  cycle: number;
  zone: number;
  /** Rolled once per reappearance, while the Pokémon is still invisible. */
  shiny: boolean;
  /** Visible activities left before it leaves again. */
  actsLeft: number;
};
type Zone = { left: number; right: number; top: number; bottom: number };
type Random = () => number;

export function rollPokemonCatch(special: boolean, random: Random = Math.random): boolean {
  return !special || random() < 0.5;
}

export const SHINY_ODDS = 20;
/** Legendaries and mythicals: rare visitors who make one fixed appearance, then stay away. */
export const isSpecial = (info: SpeciesInfo) => Boolean(info.legendary || info.mythical);
/** Specials hold the stage this long once fully visible, then stay away just as long. */
export const LEGEND_VISIBLE_MS = 5000;
export const LEGEND_HIDDEN_MS = 5000;
const LEGEND_FIRST_ENTRANCE_MS = 4000;
const LEGEND_ROAR_MS = 1600;
const LEGEND_MOVE_MS = 1800;

// Sky zones hug the page edges so readers are never covered.
const airZones: Zone[] = [
  { left: 1, right: 9, top: 19, bottom: 37 },
  { left: 91, right: 99, top: 22, bottom: 43 },
  { left: 1, right: 8, top: 48, bottom: 73 },
  { left: 92, right: 99, top: 52, bottom: 78 },
  // Starts clear of the habitat dock in the bottom-left corner.
  { left: 12, right: 30, top: 85, bottom: 96 },
  { left: 72, right: 95, top: 84, bottom: 96 },
];
const groundZones: Zone[] = [
  { left: 12, right: 26, top: 97, bottom: 97 },
  { left: 30, right: 46, top: 97, bottom: 97 },
  { left: 54, right: 70, top: 97, bottom: 97 },
  { left: 78, right: 98, top: 97, bottom: 97 },
];

const travelling = new Set<PokemonActivity>(["walk", "run", "jump", "fly", "float"]);
export const isTravelActivity = (activity: PokemonActivity) => travelling.has(activity);
export const isHiddenActivity = (activity: PokemonActivity) => activity === "hidden" || activity === "underground";
export const isEntranceActivity = (activity: PokemonActivity) => activity === "appear" || activity === "emerge";

/** On a phone each resident gets its own patch with a sprite's width between neighbours. */
export function compactPatch(slot: number, air: boolean): Zone {
  const left = slot * 30 + 1;
  return { left, right: Math.min(99, left + 8), top: air ? 8 : 87, bottom: air ? 45 : 87 };
}

function zonesFor(info: SpeciesInfo) {
  return info.movement === "air" ? airZones : groundZones;
}

function zoneFor(info: SpeciesInfo, slot: number, compact: boolean, zone: number): Zone {
  if (compact) return compactPatch(slot, info.movement === "air");
  const zones = zonesFor(info);
  return zones[zone % zones.length];
}

function between(min: number, max: number, random: Random) {
  return min + (max - min) * Math.min(.999999, Math.max(0, random()));
}

function pointIn(zone: Zone, random: Random): HabitatPoint {
  return { x: between(zone.left, zone.right, random), y: between(zone.top, zone.bottom, random) };
}

/** Any zone except the current one, even when the random source repeats itself. */
function otherZone(current: number, count: number, random: Random) {
  return (current + 1 + Math.floor(between(0, count - 1, random))) % count;
}

function pick(repertoire: SpeciesInfo["repertoire"], exclude: PokemonActivity, random: Random): VisibleActivity {
  let options = (Object.entries(repertoire) as [VisibleActivity, number][]).filter(([, weight]) => weight > 0);
  if (options.length > 1) options = options.filter(([activity]) => activity !== exclude);
  const total = options.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = between(0, total, random);
  for (const [activity, weight] of options) {
    if ((roll -= weight) < 0) return activity;
  }
  return options[options.length - 1][0];
}

/**
 * `home` is the desktop zone it starts in. `entering` starts it offstage, so a
 * newcomer swapped into the cast arrives with a proper entrance instead of popping in.
 */
export function createPokemonRoutine(species: PokemonSpecies, slot: number, compact: boolean, home = 0, entering = false): PokemonRoutine {
  const info = SPECIES[species];
  const zone = home;
  const area = zoneFor(info, slot, compact, zone);
  const inset = (area.right - area.left) * .15;
  const point = { x: slot % 2 ? area.right - inset : area.left + inset, y: (area.top + area.bottom) / 2 };
  const base = { from: point, to: point, facing: (point.x > 50 ? -1 : 1) as 1 | -1, cycle: 0, zone, shiny: false };
  const offstage = info.exit === "burrow" ? "underground" : "hidden";
  if (entering) return { ...base, activity: offstage, duration: 700 + slot * 150, actsLeft: 0 };
  // Specials wait offstage so their first entrance is a surprise.
  if (isSpecial(info)) return { ...base, activity: offstage, duration: LEGEND_FIRST_ENTRANCE_MS + slot * 400, actsLeft: 0 };
  return { ...base, activity: info.movement === "air" ? "float" : "idle", duration: 2200 + slot * 750, actsLeft: 3 };
}

// ── The cast: fifteen residents per theme, at most five on stage ────────────
export const CAST_SIZE = 5;
/** Phones get one patch per resident across a short strip. */
export const COMPACT_CAST_SIZE = 4;
export type CastMember = { species: PokemonSpecies; home: number; entering: boolean };

/** The least crowded zone for this species' kind of movement. */
function freeHome(cast: CastMember[], species: PokemonSpecies, random: Random) {
  const { movement } = SPECIES[species];
  const zones = movement === "air" ? airZones : groundZones;
  const used = zones.map((_, zone) => cast.filter(member => SPECIES[member.species].movement === movement && member.home === zone).length);
  const least = Math.min(...used);
  const options = used.flatMap((count, zone) => count === least ? [zone] : []);
  return options[Math.floor(between(0, options.length, random))];
}

/** A benched resident: never a second legendary or mythical, preferably moving like `prefer`. */
function fromBench(theme: PokemonTheme, onStage: PokemonSpecies[], random: Random, prefer?: SpeciesInfo["movement"]) {
  const legend = onStage.some(species => isSpecial(SPECIES[species]));
  let bench = RESIDENTS[theme].filter(species => !onStage.includes(species) && !(legend && isSpecial(SPECIES[species])));
  const alike = bench.filter(species => SPECIES[species].movement === prefer);
  if (alike.length) bench = alike;
  return bench.length ? bench[Math.floor(between(0, bench.length, random))] : undefined;
}

/** The opening cast: the theme's partner first, then walkers and flyers in balance. */
export function createCast(theme: PokemonTheme, compact: boolean, random: Random = Math.random): CastMember[] {
  const size = compact ? COMPACT_CAST_SIZE : CAST_SIZE;
  const cast: CastMember[] = [{ species: theme, home: 0, entering: false }];
  while (cast.length < size) {
    const walkers = cast.filter(member => SPECIES[member.species].movement === "ground").length;
    const species = fromBench(theme, cast.map(member => member.species), random, walkers * 2 <= cast.length ? "ground" : "air");
    if (!species) break;
    cast.push({ species, home: freeHome(cast, species, random), entering: false });
  }
  return cast;
}

function replaceFromBench(cast: CastMember[], slot: number, theme: PokemonTheme, random: Random, allowPartner: boolean): CastMember[] {
  const leaving = cast[slot];
  if (!leaving || (!allowPartner && leaving.species === theme)) return cast;
  const others = cast.filter((_, index) => index !== slot);
  const movement = SPECIES[leaving.species].movement;
  const species = fromBench(theme, [...others.map(member => member.species), leaving.species], random, movement);
  if (!species) return cast;
  const home = SPECIES[species].movement === movement ? leaving.home : freeHome(others, species, random);
  return cast.map((member, index) => index === slot ? { species, home, entering: true } : member);
}

/** Swap the resident in `slot`, who has just gone offstage, for someone from the bench. The partner stays. */
export function recast(cast: CastMember[], slot: number, theme: PokemonTheme, random: Random = Math.random): CastMember[] {
  return replaceFromBench(cast, slot, theme, random, false);
}

/** Replace a captured on-stage resident, including the protected habitat partner. */
export function recastCapturedResident(cast: CastMember[], slot: number, theme: PokemonTheme, random: Random = Math.random): CastMember[] {
  return replaceFromBench(cast, slot, theme, random, true);
}

// ── Legendaries and mythicals don't sit still for a cursor ───────────────────
export type LegendEvasion = "teleport" | "phase";
/** Blink out, then back in somewhere else. */
export const LEGEND_TELEPORT_OUT_MS = 200;
export const LEGEND_TELEPORT_IN_MS = 340;
/** Gone intangible: the cursor passes straight through. */
export const LEGEND_PHASE_MS = 1500;
/** After a teleport it lingers at least this long before leaving, so there is still a chance. */
export const LEGEND_TELEPORT_HOLD_MS = 1800;

/** Slips the cursor 1–3 times per visit before it tires and lets you say hello; a shiny has one more. */
export function rollLegendStamina(shiny: boolean, random: Random = Math.random): number {
  return 1 + Math.floor(between(0, 3, random)) + (shiny ? 1 : 0);
}

/** Ghosts would rather phase through you; everyone else would rather be somewhere else. */
export function pickLegendEvasion(info: SpeciesInfo, random: Random = Math.random): LegendEvasion {
  return random() < (info.ghost ? .7 : .3) ? "phase" : "teleport";
}

/**
 * Where a legendary or mythical reappears after blinking out: another part of the sky or trail on
 * desktop, the far half of its patch on a phone. It holds still there for at least `hold` ms.
 */
export function teleportPokemonRoutine(species: PokemonSpecies, slot: number, compact: boolean, current: PokemonRoutine, hold = LEGEND_TELEPORT_HOLD_MS, random: Random = Math.random): PokemonRoutine {
  const info = SPECIES[species];
  const air = info.movement === "air";
  let zone = current.zone;
  let area = zoneFor(info, slot, compact, zone);
  if (compact) {
    const middle = (area.left + area.right) / 2;
    area = current.to.x < middle ? { ...area, left: Math.min(area.right, middle + .5) } : { ...area, right: Math.max(area.left, middle - .5) };
  } else {
    zone = otherZone(current.zone, zonesFor(info).length, random);
    area = zoneFor(info, slot, compact, zone);
  }
  const to = pointIn(area, random);
  return {
    activity: air ? "float" : "idle", from: to, to, duration: Math.round(Math.max(LEGEND_TELEPORT_HOLD_MS, hold)),
    facing: to.x > 50 ? -1 : 1, cycle: current.cycle + 1, zone, shiny: current.shiny, actsLeft: current.actsLeft,
  };
}

/** Shortest dash worth making, in % of the habitat; a cornered resident bolts the other way instead. */
const MIN_DASH = 4;

/**
 * A grumpy resident that has just fired at the cursor bolts away, starting from wherever it really
 * stood (`position`, measured mid-stride) so nothing teleports. `away` is the direction away from the
 * cursor. It keeps its zone and remaining acts, so its routine carries on as normal afterwards.
 */
export function dashPokemonRoutine(species: PokemonSpecies, slot: number, compact: boolean, current: PokemonRoutine, position: HabitatPoint, away: 1 | -1, random: Random = Math.random): PokemonRoutine {
  const info = SPECIES[species];
  const air = info.movement === "air";
  const area = zoneFor(info, slot, compact, current.zone);
  const clamp = (value: number) => Math.min(100, Math.max(0, value));
  const from = { x: clamp(position.x), y: clamp(position.y) };
  const ahead = away > 0 ? area.right : area.left;
  const behind = away > 0 ? area.left : area.right;
  const edge = (ahead - from.x) * away >= MIN_DASH ? ahead : behind;
  // Stop a little short of the edge so repeated dashes don't all pile onto the same pixel.
  const x = clamp(edge - (edge - from.x) * between(0, .2, random));
  const y = air ? between(area.top, area.bottom, random) : area.top;
  const distance = Math.hypot(x - from.x, air ? y - from.y : 0);
  return {
    activity: air ? "fly" : "run", from, to: { x, y }, duration: Math.round(Math.max(420, distance * 38)),
    facing: x === from.x ? current.facing : x > from.x ? 1 : -1,
    cycle: current.cycle + 1, zone: current.zone, shiny: current.shiny, actsLeft: current.actsLeft,
  };
}

/** Choose destinations only between activities; hidden phases conceal teleportation and shiny rolls. */
export function nextPokemonRoutine(species: PokemonSpecies, slot: number, compact: boolean, current: PokemonRoutine, random: Random = Math.random): PokemonRoutine {
  const info = SPECIES[species];
  const air = info.movement === "air";
  const burrows = info.exit === "burrow";
  const special = isSpecial(info);
  const position = current.to;
  const area = zoneFor(info, slot, compact, current.zone);
  const next = (activity: PokemonActivity, duration: number, to = position, extra: Partial<Pick<PokemonRoutine, "zone" | "shiny" | "actsLeft" | "facing">> = {}, from = position): PokemonRoutine => ({
    activity, from, to, duration: Math.round(duration), cycle: current.cycle + 1,
    zone: extra.zone ?? current.zone, shiny: extra.shiny ?? current.shiny, actsLeft: extra.actsLeft ?? current.actsLeft,
    facing: extra.facing ?? (to.x === from.x ? current.facing : to.x > from.x ? 1 : -1),
  });
  // Reappear facing the middle of the page, so moves fly inward instead of off-screen.
  const inward = (point: HabitatPoint): 1 | -1 => point.x > 50 ? -1 : 1;
  const leave = () => next(burrows ? "burrow" : "vanish", special ? 1000 : burrows ? 1200 : 1300);

  // Gone: pick the next spot while nobody can see the jump.
  if (current.activity === "vanish" || current.activity === "burrow") {
    const hiddenAs = burrows ? "underground" : "hidden";
    if (special || (air && !compact)) {
      const zone = compact ? current.zone : otherZone(current.zone, zonesFor(info).length, random);
      const destination = pointIn(zoneFor(info, slot, compact, zone), random);
      return next(hiddenAs, special ? LEGEND_HIDDEN_MS : between(1000, 2300, random), destination, { zone, facing: inward(destination) }, destination);
    }
    // Ground residents stay in their patch but always resurface on its other half.
    const middle = (area.left + area.right) / 2;
    const half = position.x < middle ? { ...area, left: Math.min(area.right, middle + .5) } : { ...area, right: Math.max(area.left, middle - .5) };
    const destination = pointIn(half, random);
    return next(hiddenAs, between(1400, 3000, random), destination, { facing: inward(destination) }, destination);
  }

  // Coming back: this is the only moment a shiny can be rolled.
  if (isHiddenActivity(current.activity)) {
    const shiny = random() * SHINY_ODDS < 1;
    const acts = special ? 0 : Math.round(between(species === "diglett" ? 1 : 3, species === "diglett" ? 3 : 6, random));
    return next(burrows ? "emerge" : "appear", special ? 1200 : burrows ? 1500 : 1400, position, { shiny, actsLeft: acts });
  }

  // A special's visit is a fixed five-second show: a roar (or a mythical's smile), signature move, a moment to pose.
  if (special) {
    const greeting = info.legendary ? "roar" : "smile";
    if (isEntranceActivity(current.activity)) return next(greeting, LEGEND_ROAR_MS);
    if (current.activity === greeting) return next("attack", LEGEND_MOVE_MS);
    if (current.activity === "attack") return next(air ? "float" : "idle", LEGEND_VISIBLE_MS - LEGEND_ROAR_MS - LEGEND_MOVE_MS);
    return leave();
  }

  if (!isEntranceActivity(current.activity) && current.actsLeft <= 0) return leave();
  const activity = pick(info.repertoire, current.activity, random);
  const actsLeft = current.actsLeft - 1;

  switch (activity) {
    case "walk":
    case "run": {
      const middle = (area.left + area.right) / 2;
      const x = position.x < middle ? between(middle, area.right, random) : between(area.left, middle, random);
      const distance = Math.abs(x - position.x);
      const duration = activity === "run" ? Math.max(1100, distance * 150) : Math.max(2200, distance * 420);
      return next(activity, duration, { x, y: area.top }, { actsLeft });
    }
    case "jump": {
      // A hop forward, turning back at the edge of the patch.
      const step = current.facing * 3;
      const x = position.x + step >= area.left && position.x + step <= area.right ? position.x + step : Math.min(area.right, Math.max(area.left, position.x - step));
      return next("jump", 1300, { x, y: position.y }, { actsLeft });
    }
    case "float":
      return next("float", between(3500, 6500, random), pointIn(area, random), { actsLeft });
    case "fly": {
      if (info.roams && !compact) {
        const zone = otherZone(current.zone, airZones.length, random);
        const destination = pointIn(airZones[zone], random);
        const distance = Math.hypot(destination.x - position.x, destination.y - position.y);
        return next("fly", Math.min(8000, Math.max(2600, distance * 85)), destination, { zone, actsLeft });
      }
      return next("fly", between(2500, 4500, random), pointIn(area, random), { actsLeft });
    }
    case "idle":
      return next("idle", between(2000, 3800, random), position, { actsLeft });
    case "smile":
      return next("smile", 1800, position, { actsLeft });
    case "roar":
      return next("roar", 1700, position, { actsLeft });
    case "attack":
      return next("attack", 1700, position, { actsLeft });
  }
}
