"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Dices, RotateCw } from "lucide-react";
import { PokemonSprite } from "@/components/pokemon-sprite";
import { SPECIES, THEME_ORDER, THEMES, type PokemonTheme } from "@/lib/pokemon-roster";
import { landingAngle, SPIN_MS, SPIN_PHASES, spinCurve, type SpinPhase } from "@/lib/roulette-motion";
import { nextTheme } from "@/lib/theme-rotation";

const COUNT = THEME_ORDER.length;
const CURVE = spinCurve();
const CELEBRATE_MS = 1400;
const HUB_LEAVE_MS = 260;
/** Taps and Pick Random glide the short way round with a little overshoot, like a nudged wheel. */
const SETTLE_EASING = "cubic-bezier(.3, 1.35, .5, 1)";
const settleMs = (degrees: number) => Math.min(900, 380 + Math.abs(degrees) * 2.4);

type SpinKind = "user" | "auto";
type Celebration = { index: number; big: boolean; id: number };

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Rotation in degrees of an element mid-animation (−180…180); landingAngle accepts any turn count. */
function liveAngle(element: Element) {
  const transform = getComputedStyle(element).transform;
  if (!transform || transform === "none") return 0;
  const matrix = new DOMMatrixReadOnly(transform);
  return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
}

// A fixed scatter so neighbours never hop in step; deterministic so every open looks the same.
const idleStyle = (index: number) => ({
  "--a": `${index * 360 / COUNT}deg`,
  "--idle-ms": `${5200 + (index * 977) % 3400}ms`,
  "--idle-delay": `${-((index * 1531) % 6000)}ms`,
  "--jitter-delay": `${-((index * 113) % 320)}ms`,
});

export function HabitatRoulette({ theme, onSelect, onSpinLand, onHold, upcoming, counting, cycle, nextIn, markUpcoming }: {
  theme: PokemonTheme;
  /** A pick by hand (tap, arrow keys, Pick Random): saved, and timed changes stop there. */
  onSelect: (theme: PokemonTheme) => void;
  /** Where a spin lands: saved like a pick, but any timed changes carry on (and release the hold). */
  onSpinLand: (theme: PokemonTheme) => void;
  /** Holds the timed countdown while a spin is in flight, so a change can't fire mid-spin. */
  onHold: (held: boolean) => void;
  upcoming: PokemonTheme | null;
  counting: boolean;
  cycle: number;
  /** Milliseconds until the timed rotation moves on. */
  nextIn: () => number;
  /** In "In order" mode the next stop is no secret, so its slot gets a small marker. */
  markUpcoming: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const target = useRef(-1);
  const motion = useRef<{ token: number; animations: Animation[]; timers: number[] }>({ token: 0, animations: [], timers: [] });
  const spinKind = useRef<SpinKind | null>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const [spinning, setSpinning] = useState<SpinKind | null>(null);
  // What the wheel points at. The provider applies a habitat inside a view transition (a frame or so
  // later), so the hub and highlight follow the wheel rather than waiting for `theme`.
  const [pointed, setPointed] = useState(theme);
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const celebrateTimer = useRef<number | undefined>(undefined);

  const setRestingAngle = useCallback((value: number) => {
    angle.current = value;
    rootRef.current?.style.setProperty("--wheel", `${value}deg`);
  }, []);

  /** Freezes the wheel where it is, cancelling any glide or spin in flight. */
  const stop = useCallback(() => {
    const current = motion.current;
    current.token++;
    current.timers.forEach(clearTimeout);
    current.timers = [];
    if (current.animations.length && wheelRef.current) setRestingAngle(liveAngle(wheelRef.current));
    current.animations.forEach(animation => animation.cancel());
    current.animations = [];
    delete rootRef.current?.dataset.phase;
    if (spinKind.current) {
      // A spin cut short never lands, so nothing else will let the countdown go.
      if (spinKind.current === "user") onHold(false);
      spinKind.current = null;
      setSpinning(null);
    }
    return angle.current;
  }, [onHold, setRestingAngle]);

  /**
   * Turns the wheel to `to`. The wheel and every sprite's upright wrapper run identical timings, so
   * the sprites stay level on the compositor without a per-frame React render.
   */
  const turn = useCallback((to: number, duration: number, spin: boolean) => {
    const from = stop();
    const token = motion.current.token;
    const wheel = wheelRef.current;
    if (!wheel || duration <= 0 || reducedMotion()) {
      setRestingAngle(to);
      return { token, done: Promise.resolve(true) };
    }
    const frames = spin
      ? CURVE.map(({ offset, progress }) => ({ offset, value: from + (to - from) * progress }))
      : [{ offset: 0, value: from }, { offset: 1, value: to }];
    const timing: KeyframeAnimationOptions = { duration, easing: spin ? "linear" : SETTLE_EASING, fill: "forwards" };
    const main = wheel.animate(frames.map(({ offset, value }) => ({ offset, transform: `rotate(${value}deg)` })), timing);
    const uprights = Array.from(wheel.querySelectorAll<HTMLElement>(".roulette-upright"), element =>
      element.animate(frames.map(({ offset, value }) => ({ offset, transform: `rotate(${-value}deg)` })), timing));
    motion.current.animations = [main, ...uprights];
    angle.current = to;
    const done = main.finished.then(() => {
      if (motion.current.token !== token) return false;
      // Hand the final angle to the resting style in the same frame the animations are dropped.
      setRestingAngle(to);
      motion.current.animations.forEach(animation => animation.cancel());
      motion.current.animations = [];
      return true;
    }, () => false);
    return { token, done };
  }, [setRestingAngle, stop]);

  const celebrate = useCallback((index: number, big: boolean) => {
    window.clearTimeout(celebrateTimer.current);
    setCelebration(current => ({ index, big, id: (current?.id ?? 0) + 1 }));
    celebrateTimer.current = window.setTimeout(() => setCelebration(null), big ? CELEBRATE_MS : CELEBRATE_MS / 2);
  }, []);

  /** Four seconds, start to reveal; the winner is fixed before the wheel moves. */
  const spinTo = useCallback((index: number, kind: SpinKind) => {
    const { token, done } = turn(landingAngle(stop(), index, COUNT, true), SPIN_MS, true);
    target.current = index;
    spinKind.current = kind;
    setSpinning(kind);
    setCelebration(null);
    setAnnouncement(kind === "user" ? "Spinning the wheel…" : "Changing habitat…");
    const root = rootRef.current;
    if (root && !reducedMotion()) {
      motion.current.timers = (Object.entries(SPIN_PHASES) as [SpinPhase, number][]).map(([phase, at]) =>
        window.setTimeout(() => { root.dataset.phase = phase; }, at));
    }
    done.then(finished => {
      if (!finished || motion.current.token !== token) return;
      delete root?.dataset.phase;
      spinKind.current = null;
      setSpinning(null);
      const winner = THEME_ORDER[index];
      // A timed change is applied by the provider's own clock, landing at the same moment.
      setPointed(winner);
      if (kind === "user") onSpinLand(winner);
      setAnnouncement(`The wheel landed on ${SPECIES[winner].name}, ${THEMES[winner].type} type.`);
      celebrate(index, true);
    });
    return token;
  }, [celebrate, onSpinLand, stop, turn]);

  /** Taps, arrow keys and Pick Random: no spin, just a short glide to the chosen slot. */
  const choose = useCallback((index: number, random = false, commit = onSelect) => {
    if (spinKind.current === "user") return;
    const from = stop();
    const to = landingAngle(from, index, COUNT);
    target.current = index;
    turn(to, settleMs(to - from), false);
    setPointed(THEME_ORDER[index]);
    commit(THEME_ORDER[index]);
    celebrate(index, false);
    const picked = THEME_ORDER[index];
    setAnnouncement(`${random ? "Picked at random: " : ""}${SPECIES[picked].name}, ${THEMES[picked].type} type.`);
  }, [celebrate, onSelect, stop, turn]);

  useLayoutEffect(() => {
    const index = THEME_ORDER.indexOf(themeRef.current);
    target.current = index;
    setRestingAngle(landingAngle(0, index, COUNT));
    const current = motion.current;
    return () => {
      current.token++;
      current.timers.forEach(clearTimeout);
      current.animations.forEach(animation => animation.cancel());
      window.clearTimeout(celebrateTimer.current);
    };
  }, [setRestingAngle]);
  // Closed mid-spin: the spin is abandoned, so the countdown picks up where it was held.
  useEffect(() => () => { if (spinKind.current === "user") onHold(false); }, [onHold]);

  // The habitat changed from outside (a timed rotation that wasn't spun, another control): follow it.
  useEffect(() => {
    const index = THEME_ORDER.indexOf(theme);
    if (target.current === index || spinKind.current === "user") return;
    const from = stop();
    const to = landingAngle(from, index, COUNT);
    target.current = index;
    turn(to, settleMs(to - from), false);
    setPointed(theme);
    celebrate(index, false);
  }, [theme, celebrate, stop, turn]);

  // A timed change about to happen spins the wheel itself, timed to land exactly when the habitat changes.
  useEffect(() => {
    if (!counting || !upcoming) return;
    const remaining = nextIn();
    if (remaining < SPIN_MS) return;
    let token = -1;
    const timer = window.setTimeout(() => { token = spinTo(THEME_ORDER.indexOf(upcoming), "auto"); }, remaining - SPIN_MS);
    return () => {
      window.clearTimeout(timer);
      // Paused, hidden or switched off mid-spin: the habitat won't change, so swing back to it.
      // If the change already landed, let the wheel finish its last few degrees on its own.
      if (token === motion.current.token && spinKind.current === "auto" && themeRef.current !== upcoming) {
        const from = stop();
        const index = THEME_ORDER.indexOf(themeRef.current);
        const to = landingAngle(from, index, COUNT);
        target.current = index;
        turn(to, settleMs(to - from), false);
        setPointed(themeRef.current);
      }
    };
  }, [counting, upcoming, cycle, nextIn, spinTo, stop, turn]);

  function spin() {
    if (spinKind.current === "user") return;
    const winner = THEME_ORDER.indexOf(nextTheme(theme, "shuffle"));
    if (reducedMotion()) return choose(winner, true, onSpinLand);
    onHold(true);
    spinTo(winner, "user");
  }

  const userSpinning = spinning === "user";
  const hub: PokemonTheme | null = spinning ? null : pointed;
  const upcomingIndex = markUpcoming && upcoming ? THEME_ORDER.indexOf(upcoming) : -1;

  return (
    <div className="roulette-block">
      <div ref={rootRef} className={`roulette ${spinning ? "is-spinning" : ""}`} style={{ "--n": COUNT } as CSSProperties}>
        <span className="roulette-face" aria-hidden="true" />
        <span className="roulette-spot" aria-hidden="true" />
        <fieldset className="roulette-wheel-field" disabled={userSpinning}>
          <legend className="sr-only">Habitat partner</legend>
          <div ref={wheelRef} className="roulette-wheel" role="radiogroup" aria-label="Habitat">
            {THEME_ORDER.map((option, index) => {
              const selected = !spinning && option === pointed;
              const cheering = celebration?.index === index;
              return (
                <span key={option} className={["roulette-slot", index % 3 === 1 ? "is-sway" : "is-hop", selected && "is-selected", cheering && (celebration.big ? "is-winner" : "is-picked"), index === upcomingIndex && "is-next"].filter(Boolean).join(" ")}
                  style={{ ...idleStyle(index), "--swatch": THEMES[option].swatch } as CSSProperties}>
                  <span className="roulette-upright">
                    <label className="roulette-pick" title={`${SPECIES[option].name} · ${THEMES[option].type}`}>
                      <input className="sr-only" type="radio" name="pokemon-habitat" value={option} checked={option === theme}
                        onChange={() => choose(index)} onClick={() => { if (option === theme && !spinning) onSelect(option); }}
                        aria-label={`${SPECIES[option].name}, ${THEMES[option].type} type`} />
                      <span className="roulette-bob" key={cheering ? `cheer-${celebration.id}` : "idle"}>
                        <PokemonSprite species={option} className="roulette-sprite" />
                      </span>
                    </label>
                  </span>
                </span>
              );
            })}
          </div>
        </fieldset>

        <RouletteHub theme={hub} cheering={celebration?.big ? celebration.id : 0} />
        <span className="roulette-pointer" aria-hidden="true"><i /></span>
        {celebration?.big && <span key={celebration.id} className="roulette-confetti" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} style={{ "--i": i } as CSSProperties} />)}</span>}
      </div>

      <div className="roulette-actions">
        <button type="button" className="roulette-spin" onClick={spin} disabled={userSpinning}>
          <RotateCw size={18} strokeWidth={2.6} aria-hidden="true" />{userSpinning ? "Spinning…" : "Spin"}
        </button>
        <button type="button" className="roulette-random" onClick={() => choose(THEME_ORDER.indexOf(nextTheme(theme, "shuffle")), true)} disabled={userSpinning}>
          <Dices size={17} aria-hidden="true" />Random
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    </div>
  );
}

/** The spotlight in the middle: the partner pops in on a spring, the previous one shrinks away. */
function RouletteHub({ theme, cheering }: { theme: PokemonTheme | null; cheering: number }) {
  const [leaving, setLeaving] = useState<{ theme: PokemonTheme | null; id: number } | null>(null);
  const shown = useRef(theme);
  useEffect(() => {
    if (shown.current === theme) return;
    const previous = shown.current;
    shown.current = theme;
    setLeaving(current => ({ theme: previous, id: (current?.id ?? 0) + 1 }));
    const timer = window.setTimeout(() => setLeaving(null), HUB_LEAVE_MS);
    return () => window.clearTimeout(timer);
  }, [theme]);

  return (
    <div className="roulette-hub" aria-hidden="true">
      <span className="roulette-hub-sparkles"><i>✦</i><i>✦</i><i>✦</i></span>
      {leaving && <HubFace key={`out-${leaving.id}`} theme={leaving.theme} className="is-leaving" />}
      <HubFace key={theme ?? "mystery"} theme={theme} className={cheering ? "is-cheering" : ""} cheerKey={cheering} />
    </div>
  );
}

function HubFace({ theme, className, cheerKey = 0 }: { theme: PokemonTheme | null; className: string; cheerKey?: number }) {
  return (
    <span className={`roulette-hub-face ${theme ? "" : "is-mystery"} ${className}`}>
      <span className="roulette-hub-stage" key={cheerKey}>
        {theme ? <PokemonSprite species={theme} className="roulette-hub-sprite" /> : <span className="roulette-mystery"><b>?</b></span>}
      </span>
      <span className="roulette-hub-name">{theme ? SPECIES[theme].name : "Who's next?"}</span>
    </span>
  );
}
