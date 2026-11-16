export type PokemonCapturePoint = { x: number; y: number };

export function isPokemonCaptureAnimation(animationName: string): boolean {
  return animationName === "pokemon-capture-pull";
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
