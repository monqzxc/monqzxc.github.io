import type { PokemonSpecies } from "../components/pokemon-art";

export type PokemonActivity = "float" | "vanish" | "hidden" | "appear" | "walk" | "look" | "dig" | "burrow" | "underground" | "emerge";
export type HabitatPoint = { x: number; y: number };
export type PokemonRoutine = {
  activity: PokemonActivity;
  from: HabitatPoint;
  to: HabitatPoint;
  duration: number;
  facing: 1 | -1;
  cycle: number;
  zone: number;
};
type Zone = { left: number; right: number; top: number; bottom: number };
type Random = () => number;

const ghostZones: Zone[] = [
  { left: 1, right: 9, top: 19, bottom: 37 },
  { left: 91, right: 99, top: 22, bottom: 43 },
  { left: 1, right: 8, top: 48, bottom: 73 },
  { left: 92, right: 99, top: 52, bottom: 78 },
  { left: 5, right: 28, top: 85, bottom: 96 },
  { left: 72, right: 95, top: 84, bottom: 96 },
];
const groundZones: Zone[] = [
  { left: 1, right: 28, top: 97, bottom: 97 },
  { left: 39, right: 57, top: 97, bottom: 97 },
  { left: 70, right: 98, top: 97, bottom: 97 },
];

export function isGhostPokemon(species: PokemonSpecies) {
  return species === "gengar" || species === "gastly" || species === "haunter";
}

function zoneFor(index: number, compact: boolean, ghost: boolean, zone = index): Zone {
  if (compact) {
    // Leave a full sprite width between patches, even on a 320px phone.
    const left = (index % 3) * 42 + 1;
    return { left, right: left + 14, top: ghost ? 13 : 87, bottom: ghost ? 60 : 87 };
  }
  const zones = ghost ? ghostZones : groundZones;
  return zones[zone % zones.length];
}

function between(min: number, max: number, random: Random) {
  return min + (max - min) * Math.min(.999999, Math.max(0, random()));
}

function pointIn(zone: Zone, random: Random): HabitatPoint {
  return { x: between(zone.left, zone.right, random), y: between(zone.top, zone.bottom, random) };
}

export function createPokemonRoutine(species: PokemonSpecies, index: number, compact: boolean): PokemonRoutine {
  const ghost = isGhostPokemon(species);
  const zone = zoneFor(index, compact, ghost);
  const point = { x: index % 2 ? zone.right - 2 : zone.left + 2, y: (zone.top + zone.bottom) / 2 };
  return { activity: ghost ? "float" : "look", from: point, to: point, duration: 2200 + index * 750, facing: index % 2 ? -1 : 1, cycle: 0, zone: index % 6 };
}

/** Choose destinations only between activities; hidden phases conceal teleportation. */
export function nextPokemonRoutine(species: PokemonSpecies, index: number, compact: boolean, current: PokemonRoutine, random: Random = Math.random): PokemonRoutine {
  const ghost = isGhostPokemon(species);
  const position = current.to;
  const next = (activity: PokemonActivity, duration: number, to = position, from = position, zone = current.zone): PokemonRoutine => ({
    activity, duration, from, to, zone, cycle: current.cycle + 1,
    facing: to.x === from.x ? current.facing : to.x > from.x ? 1 : -1,
  });

  if (ghost) {
    if (current.activity === "float") return next("vanish", 1300);
    if (current.activity === "vanish") {
      const zone = (current.zone + 1 + Math.floor(between(0, 5, random))) % 6;
      const destination = pointIn(zoneFor(index, compact, true, zone), random);
      return next("hidden", between(1000, 2300, random), destination, destination, zone);
    }
    if (current.activity === "hidden") return next("appear", 1700);
    const destination = pointIn(zoneFor(index, compact, true, current.zone), random);
    return next("float", between(6000, 10500, random), destination);
  }

  const zone = zoneFor(index, compact, false);
  if (current.activity === "burrow") {
    // Even repeated random values move a tunneller to the other half of its patch.
    const middle = (zone.left + zone.right) / 2;
    const destination = pointIn({ ...zone, left: position.x < middle ? middle + 1 : zone.left, right: position.x < middle ? zone.right : middle - 1 }, random);
    return next("underground", between(1400, 3000, random), destination, destination);
  }
  if (current.activity === "underground") return next("emerge", 1600);
  if (current.activity === "emerge") return next("look", between(2200, 4200, random));
  if (current.activity === "dig") return next("burrow", 1200);
  if (current.activity === "walk") return next(species === "sandshrew" ? "dig" : "look", between(2400, 3800, random));
  if (species === "diglett") return next("burrow", 1200);

  const middle = (zone.left + zone.right) / 2;
  const spread = (zone.right - zone.left) * .18;
  const destination = { x: position.x < middle ? between(zone.right - spread, zone.right, random) : between(zone.left, zone.left + spread, random), y: zone.top };
  return next("walk", between(compact ? 4800 : 7500, compact ? 7200 : 11500, random), destination);
}
