import { SPECIES, type PokemonSpecies, type SpeciesInfo, type VisibleActivity } from "./pokemon-roster.ts";

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

export const SHINY_ODDS = 20;
/** Legendaries hold the stage this long once fully visible, then stay away just as long. */
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
  { left: 5, right: 28, top: 85, bottom: 96 },
  { left: 72, right: 95, top: 84, bottom: 96 },
];
const groundZones: Zone[] = [
  { left: 1, right: 22, top: 97, bottom: 97 },
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

export function createPokemonRoutine(species: PokemonSpecies, slot: number, compact: boolean): PokemonRoutine {
  const info = SPECIES[species];
  const zone = info.home;
  const area = zoneFor(info, slot, compact, zone);
  const inset = (area.right - area.left) * .15;
  const point = { x: slot % 2 ? area.right - inset : area.left + inset, y: (area.top + area.bottom) / 2 };
  const base = { from: point, to: point, facing: (point.x > 50 ? -1 : 1) as 1 | -1, cycle: 0, zone, shiny: false };
  // Legendaries wait offstage so their first entrance is a surprise.
  if (info.legendary) return { ...base, activity: info.exit === "burrow" ? "underground" : "hidden", duration: LEGEND_FIRST_ENTRANCE_MS + slot * 400, actsLeft: 0 };
  return { ...base, activity: info.movement === "air" ? "float" : "idle", duration: 2200 + slot * 750, actsLeft: 3 };
}

/** Choose destinations only between activities; hidden phases conceal teleportation and shiny rolls. */
export function nextPokemonRoutine(species: PokemonSpecies, slot: number, compact: boolean, current: PokemonRoutine, random: Random = Math.random): PokemonRoutine {
  const info = SPECIES[species];
  const air = info.movement === "air";
  const burrows = info.exit === "burrow";
  const position = current.to;
  const area = zoneFor(info, slot, compact, current.zone);
  const next = (activity: PokemonActivity, duration: number, to = position, extra: Partial<Pick<PokemonRoutine, "zone" | "shiny" | "actsLeft" | "facing">> = {}, from = position): PokemonRoutine => ({
    activity, from, to, duration: Math.round(duration), cycle: current.cycle + 1,
    zone: extra.zone ?? current.zone, shiny: extra.shiny ?? current.shiny, actsLeft: extra.actsLeft ?? current.actsLeft,
    facing: extra.facing ?? (to.x === from.x ? current.facing : to.x > from.x ? 1 : -1),
  });
  // Reappear facing the middle of the page, so moves fly inward instead of off-screen.
  const inward = (point: HabitatPoint): 1 | -1 => point.x > 50 ? -1 : 1;
  const leave = () => next(burrows ? "burrow" : "vanish", info.legendary ? 1000 : burrows ? 1200 : 1300);

  // Gone: pick the next spot while nobody can see the jump.
  if (current.activity === "vanish" || current.activity === "burrow") {
    const hiddenAs = burrows ? "underground" : "hidden";
    if (info.legendary || (air && !compact)) {
      const zone = compact ? current.zone : otherZone(current.zone, zonesFor(info).length, random);
      const destination = pointIn(zoneFor(info, slot, compact, zone), random);
      return next(hiddenAs, info.legendary ? LEGEND_HIDDEN_MS : between(1000, 2300, random), destination, { zone, facing: inward(destination) }, destination);
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
    const acts = info.legendary ? 0 : Math.round(between(species === "diglett" ? 1 : 3, species === "diglett" ? 3 : 6, random));
    return next(burrows ? "emerge" : "appear", info.legendary ? 1200 : burrows ? 1500 : 1400, position, { shiny, actsLeft: acts });
  }

  // A legendary's visit is a fixed five-second show: roar, signature move, a moment to pose.
  if (info.legendary) {
    if (isEntranceActivity(current.activity)) return next("roar", LEGEND_ROAR_MS);
    if (current.activity === "roar") return next("attack", LEGEND_MOVE_MS);
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
