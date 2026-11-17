export type PokemonCapturePoint = { x: number; y: number };

/** Fired by a resident when a catch succeeds; `target` is its centre in viewport pixels. */
export const POKEMON_CAPTURE_START_EVENT = "pokemon-capture-start";
/** Fired by the Pokédex once the beam has pulled the capture all the way in. */
export const POKEMON_CAPTURE_END_EVENT = "pokemon-capture-end";
/** Whole beam timeline (see `pokemon-capture-*` keyframes); a fallback if no beam ever plays. */
export const POKEMON_CAPTURE_MS = 1300;

export function isPokemonCaptureAnimation(animationName: string): boolean {
  return animationName === "pokemon-capture-pull";
}

/** Keeps the beam's origin on screen when the Pokédex button has scrolled out of view. */
export function clampPokemonCapturePoint(point: PokemonCapturePoint, width: number, height: number, margin = 16): PokemonCapturePoint {
  return {
    x: Math.min(Math.max(point.x, margin), Math.max(margin, width - margin)),
    y: Math.min(Math.max(point.y, margin), Math.max(margin, height - margin)),
  };
}

export function getPokemonCaptureBoltPoints(start: PokemonCapturePoint, end: PokemonCapturePoint): PokemonCapturePoint[] {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  if (length === 0) return [start, end];

  const offset = Math.min(18, length * .14);
  const normal = { x: -dy / length, y: dx / length };
  return [
    start,
    { x: start.x + dx / 3 + normal.x * offset, y: start.y + dy / 3 + normal.y * offset },
    { x: start.x + dx * 2 / 3 - normal.x * offset, y: start.y + dy * 2 / 3 - normal.y * offset },
    end,
  ];
}
