// Prize-wheel motion for the habitat roulette. Pure maths, so it can be tested without a browser:
// the component turns these angles into Web Animations keyframes.

/** A spin always lasts exactly this long, whether the visitor or a timed rotation starts it. */
export const SPIN_MS = 4000;
/** Phase boundaries (ms): speeding up, full speed, slowing, then the final creep onto the winner. */
export const SPIN_PHASES = { accelerate: 0, fast: 500, slow: 2500, landing: 3500 } as const;
export type SpinPhase = keyof typeof SPIN_PHASES;
/** Whole turns before landing, so the wheel reads as spun rather than nudged. */
export const SPIN_TURNS = 5;

const ACCEL_END = SPIN_PHASES.fast / SPIN_MS;
const DECEL_START = SPIN_PHASES.slow / SPIN_MS;

/** Wheel speed at t∈[0,1], peaking at 1: a smooth ramp, a cruise, then a quadratic glide to rest. */
function velocity(t: number) {
  if (t <= 0 || t >= 1) return 0;
  if (t < ACCEL_END) {
    const u = t / ACCEL_END;
    return u * u * (3 - 2 * u);
  }
  if (t < DECEL_START) return 1;
  const u = (t - DECEL_START) / (1 - DECEL_START);
  return (1 - u) * (1 - u);
}

const SAMPLES = 400;
/** Cumulative distance travelled, normalised so spinProgress(0) = 0 and spinProgress(1) = 1. */
const DISTANCE = (() => {
  const table = new Float64Array(SAMPLES + 1);
  for (let i = 1; i <= SAMPLES; i++) {
    const a = (i - 1) / SAMPLES, b = i / SAMPLES;
    table[i] = table[i - 1] + (velocity(a) + 4 * velocity((a + b) / 2) + velocity(b)) / 6 / SAMPLES;
  }
  const total = table[SAMPLES];
  return table.map(value => value / total);
})();

export function spinProgress(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const at = t * SAMPLES, i = Math.floor(at);
  return DISTANCE[i] + (DISTANCE[i + 1] - DISTANCE[i]) * (at - i);
}

/** Keyframe offsets and progress values for a spin, linear between samples. */
export function spinCurve(steps = 64): { offset: number; progress: number }[] {
  return Array.from({ length: steps + 1 }, (_, i) => ({ offset: i / steps, progress: spinProgress(i / steps) }));
}

/** Angle of slot `index` around a wheel of `count` slots, clockwise from the pointer at the top. */
export const slotAngle = (index: number, count: number) => index * 360 / count;

const mod = (value: number, by: number) => ((value % by) + by) % by;

/**
 * The wheel rotation that puts slot `index` under the pointer, reached from `current`.
 * `spin` goes clockwise through SPIN_TURNS full turns; otherwise it takes the shorter way round.
 */
export function landingAngle(current: number, index: number, count: number, spin = false) {
  const delta = mod(-slotAngle(index, count) - current, 360);
  if (spin) return current + delta + SPIN_TURNS * 360;
  return current + (delta > 180 ? delta - 360 : delta);
}

/** Which slot sits under the pointer at a given wheel rotation. */
export function slotAtPointer(angle: number, count: number) {
  return mod(Math.round(-angle / (360 / count)), count);
}
