export type Side = 0 | 1;
export type Difficulty = "easy" | "hard";
export type ShotKind = "normal" | "special";
export type Point = { x: number; y: number };
export type ShotInput = { angle: number; power: number; kind: ShotKind };
export type ShotResult = {
  points: Point[];
  impact: Point;
  hit: Side | null;
  damage: number;
  direct: boolean;
  kind: ShotKind;
};
export type BattleState = {
  health: [number, number];
  specials: [number, number];
  turn: Side;
  round: number;
  wind: number;
  winner: Side | null;
};

export const WORLD_WIDTH = 1000;
export const WORLD_HEIGHT = 500;
export const WATER_Y = 390;
export const TARGETS: readonly [Point, Point] = [{ x: 150, y: 330 }, { x: 850, y: 330 }];
export const SHOT_ORIGINS: readonly [Point, Point] = [{ x: 175, y: 300 }, { x: 825, y: 300 }];
export const TARGET_RADIUS = 35;
export const MAX_HEALTH = 100;
export const SPECIAL_CHARGES = 3;
export const SHOT_LIMITS = { minAngle: 10, maxAngle: 80, minPower: 20, maxPower: 100 } as const;

const GRAVITY = 250;
const WIND_FORCE = 7;
const STEP_SECONDS = 1 / 60;
const MAX_FLIGHT_SECONDS = 8;
const DIRECT_DAMAGE: Record<ShotKind, number> = { normal: 28, special: 42 };
const SPLASH_DAMAGE: Record<ShotKind, number> = { normal: 18, special: 28 };
const SPLASH_RADIUS: Record<ShotKind, number> = { normal: 95, special: 125 };

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));
const otherSide = (side: Side): Side => side === 0 ? 1 : 0;

function randomUnit(random: () => number): number {
  const value = random();
  return Number.isFinite(value) ? clamp(value, 0, 1 - Number.EPSILON) : 0.5;
}

function nextWind(random: () => number): number {
  return Math.floor(randomUnit(random) * 11) - 5;
}

function normalizeInput(input: ShotInput): ShotInput {
  return {
    angle: clamp(Number.isFinite(input.angle) ? input.angle : 45, SHOT_LIMITS.minAngle, SHOT_LIMITS.maxAngle),
    power: clamp(Number.isFinite(input.power) ? input.power : 75, SHOT_LIMITS.minPower, SHOT_LIMITS.maxPower),
    kind: input.kind === "special" ? "special" : "normal",
  };
}

export function createBattle(random: () => number = Math.random): BattleState {
  return {
    health: [MAX_HEALTH, MAX_HEALTH],
    specials: [SPECIAL_CHARGES, SPECIAL_CHARGES],
    turn: 0,
    round: 1,
    wind: nextWind(random),
    winner: null,
  };
}

// Earliest intersection along one flight segment prevents fast shots from
// skipping a creature between frames and makes animation end at contact.
function circleIntersection(from: Point, to: Point, center: Point): number | null {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const fx = from.x - center.x;
  const fy = from.y - center.y;
  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - TARGET_RADIUS * TARGET_RADIUS;
  const discriminant = b * b - 4 * a * c;
  if (a === 0 || discriminant < 0) return null;
  const first = (-b - Math.sqrt(discriminant)) / (2 * a);
  const second = (-b + Math.sqrt(discriminant)) / (2 * a);
  return first >= 0 && first <= 1 ? first : second >= 0 && second <= 1 ? second : null;
}

function interpolate(from: Point, to: Point, fraction: number): Point {
  return { x: from.x + (to.x - from.x) * fraction, y: from.y + (to.y - from.y) * fraction };
}

/** Both players measure elevation toward the opposing raft. Positive wind blows right. */
export function simulateShot(side: Side, input: ShotInput, wind: number): ShotResult {
  const shot = normalizeInput(input);
  const origin = SHOT_ORIGINS[side];
  const radians = shot.angle * Math.PI / 180;
  const speed = 100 + shot.power * 3.7;
  const velocityX = Math.cos(radians) * speed * (side === 0 ? 1 : -1);
  const velocityY = -Math.sin(radians) * speed;
  const accelerationX = (Number.isFinite(wind) ? clamp(wind, -5, 5) : 0) * WIND_FORCE;
  const points: Point[] = [{ ...origin }];

  for (let frame = 1; frame <= MAX_FLIGHT_SECONDS / STEP_SECONDS; frame++) {
    const time = frame * STEP_SECONDS;
    const previous = points[points.length - 1];
    const next = {
      x: origin.x + velocityX * time + 0.5 * accelerationX * time * time,
      y: origin.y + velocityY * time + 0.5 * GRAVITY * time * time,
    };
    let hit: Side | null = null;
    let contactFraction = Infinity;
    for (const targetSide of [0, 1] as const) {
      // The shot starts beside its owner. Once it leaves, a returning shot
      // can still hit its own raft; neither player gets immunity from wind.
      if (targetSide === side && time < 0.25) continue;
      const fraction = circleIntersection(previous, next, TARGETS[targetSide]);
      if (fraction !== null && fraction < contactFraction) {
        hit = targetSide;
        contactFraction = fraction;
      }
    }
    if (hit !== null) {
      const impact = interpolate(previous, next, contactFraction);
      points.push(impact);
      return { points, impact, hit, damage: DIRECT_DAMAGE[shot.kind], direct: true, kind: shot.kind };
    }

    if (next.y >= WATER_Y) {
      const impact = interpolate(previous, next, (WATER_Y - previous.y) / (next.y - previous.y));
      points.push(impact);
      let splashHit: Side | null = null;
      let damage = 0;
      for (const targetSide of [0, 1] as const) {
        const distance = Math.abs(impact.x - TARGETS[targetSide].x);
        const splash = Math.round(SPLASH_DAMAGE[shot.kind] * Math.max(0, 1 - distance / SPLASH_RADIUS[shot.kind]));
        if (splash > damage) {
          splashHit = targetSide;
          damage = splash;
        }
      }
      return { points, impact, hit: splashHit, damage, direct: false, kind: shot.kind };
    }
    points.push(next);
    // Stop far outside the arena, but do not stop at the top of the viewport:
    // high arcs must be allowed to return and follow the same gravity.
    if (next.x < -250 || next.x > WORLD_WIDTH + 250) break;
  }
  return { points, impact: points[points.length - 1], hit: null, damage: 0, direct: false, kind: shot.kind };
}

/** Resolves exactly one turn without mutating the previous battle. */
export function applyShot(state: BattleState, input: ShotInput, random: () => number = Math.random): { state: BattleState; shot: ShotResult } {
  const normalized = normalizeInput(input);
  if (state.winner !== null) {
    const origin = { ...SHOT_ORIGINS[state.turn] };
    return { state, shot: { points: [origin], impact: origin, hit: null, damage: 0, direct: false, kind: normalized.kind } };
  }

  const kind = normalized.kind === "special" && state.specials[state.turn] > 0 ? "special" : "normal";
  const shot = simulateShot(state.turn, { ...normalized, kind }, state.wind);
  const health: [number, number] = [...state.health];
  const specials: [number, number] = [...state.specials];
  if (kind === "special") specials[state.turn] -= 1;
  if (shot.hit !== null) health[shot.hit] = Math.max(0, health[shot.hit] - shot.damage);
  const winner: Side | null = health[0] <= 0 ? 1 : health[1] <= 0 ? 0 : null;
  const roundComplete = state.turn === 1 && winner === null;
  return {
    shot,
    state: {
      health,
      specials,
      turn: winner === null ? otherSide(state.turn) : state.turn,
      round: state.round + (roundComplete ? 1 : 0),
      wind: roundComplete ? nextWind(random) : state.wind,
      winner,
    },
  };
}

/** AI always submits a legal shot to the same simulator used by the player. */
export function chooseAiShot(state: BattleState, difficulty: Difficulty, random: () => number = Math.random): ShotInput {
  const side = state.turn;
  const opponent = otherSide(side);
  const kind: ShotKind = state.specials[side] > 0 && state.health[opponent] > DIRECT_DAMAGE.normal &&
    (difficulty === "hard" || randomUnit(random) < 0.4) ? "special" : "normal";

  if (difficulty === "easy") {
    // Estimate a calm-weather arc, then introduce ordinary aiming error.
    // Easy never gets hidden damage or accuracy bonuses.
    const angle = 43 + randomUnit(random) * 10;
    const radians = angle * Math.PI / 180;
    const distance = Math.abs(TARGETS[opponent].x - SHOT_ORIGINS[side].x);
    const height = TARGETS[opponent].y - SHOT_ORIGINS[side].y;
    const speed = Math.sqrt(GRAVITY * distance * distance / (2 * Math.cos(radians) ** 2 * (distance * Math.tan(radians) + height)));
    return normalizeInput({ angle: angle + (randomUnit(random) - 0.5) * 16, power: (speed - 100) / 3.7 + (randomUnit(random) - 0.5) * 18, kind });
  }

  let best: ShotInput = { angle: 45, power: 80, kind };
  let bestScore = -Infinity;
  for (let angle = 25; angle <= 73; angle += 3) {
    for (let power = 40; power <= 100; power += 2) {
      const candidate = { angle, power, kind };
      const shot = simulateShot(side, candidate, state.wind);
      const distance = Math.hypot(shot.impact.x - TARGETS[opponent].x, shot.impact.y - TARGETS[opponent].y);
      const damageScore = shot.hit === opponent ? shot.damage * 1000 : shot.hit === side ? -shot.damage * 1000 : 0;
      const score = damageScore - distance - Math.abs(angle - 45) * 0.1 - power * 0.001;
      if (score > bestScore) {
        bestScore = score;
        best = candidate;
      }
    }
  }
  return best;
}
