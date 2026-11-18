"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { Popover } from "radix-ui";
import { Check, ChevronUp, Pause, Play, Repeat, Shuffle } from "lucide-react";
import { MoveEffect, PokemonMotion, PokemonSprite, ShinyBurst, ShinyGlow, ShinyStars } from "@/components/pokemon-sprite";
import { PokemonCollection } from "@/components/pokemon-collection";
import { PokemonScenery } from "@/components/pokemon-scenery";
import { CursorAmbushLayer } from "@/components/cursor-ambush";
import { createCast, createPokemonRoutine, dashPokemonRoutine, LEGEND_PHASE_MS, LEGEND_TELEPORT_IN_MS, LEGEND_TELEPORT_OUT_MS, pickLegendEvasion, rollLegendStamina, teleportPokemonRoutine, type LegendEvasion, isEntranceActivity, isHiddenActivity, isSpecial, isTravelActivity, nextPokemonRoutine, recast, recastCapturedResident, rollPokemonCatch, type CastMember } from "@/lib/pokemon-behavior";
import { POKEMON_COLLECTION_STORAGE_KEY, parsePokemonCollection, recordPokemonCapture, releaseAllPokemonCaptures, releasePokemonCapture, shouldAnimatePokemonCapture, type CapturedPokemon, type PokemonReleaseResult } from "@/lib/pokemon-collection";
import { isPokemonCaptureAnimation, POKEMON_CAPTURE_END_EVENT, POKEMON_CAPTURE_MS, POKEMON_CAPTURE_START_EVENT, type PokemonCapturePoint } from "@/lib/pokemon-capture-animation";
import { MOTION } from "@/lib/pokemon-motion";
import { AMBUSH_WINDUP_MS, LEGEND_ATTACK_ODDS, POKEMON_AMBUSH_EVENT, POKEMON_AMBUSH_TAUNT_EVENT, rollAmbush, type AmbushPoint, type PokemonAmbushShot, type PokemonAmbushTaunt } from "@/lib/pokemon-ambush";
import { MOVES, RESIDENTS, SPECIES, SPRITE_FEET, SPRITE_SIZE, THEME_ORDER, THEMES, type PokemonSpecies, type PokemonTheme } from "@/lib/pokemon-roster";
import { DEFAULT_ROTATION, intervalMs, nextTheme, parseTheme, ROTATION_INTERVALS, ROTATION_MODES, THEME_STORAGE_KEY, type Rotation, type RotationMode } from "@/lib/theme-rotation";

type ThemeState = {
  theme: PokemonTheme;
  setTheme: (theme: PokemonTheme) => void;
  rotation: Rotation;
  setRotation: (rotation: Rotation) => void;
  /** Where a running rotation goes next, decided ahead so the selector can show it. */
  upcoming: PokemonTheme | null;
  /** Restarts whenever the countdown does, so progress indicators can restart with it. */
  cycle: number;
  /** True while a timed rotation is counting down (not paused, not in a background tab). */
  counting: boolean;
  /** Milliseconds of the current countdown already spent, so a freshly drawn progress bar joins in sync. */
  elapsed: () => number;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  capturedPokemon: CapturedPokemon[];
  collectionError: string | null;
  capturePokemon: (capture: CapturedPokemon) => "captured" | "already-captured" | "storage-error";
  releasePokemon: (release: CapturedPokemon) => PokemonReleaseResult;
  releaseAllPokemon: () => PokemonReleaseResult;
  ready: boolean;
};
const ThemeContext = createContext<ThemeState | null>(null);

/** Crossfade between habitats where the browser supports it and motion is welcome. */
function withTransition(update: () => void) {
  const start = (document as Document & { startViewTransition?: (callback: () => void) => unknown }).startViewTransition;
  if (!start || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return update();
  start.call(document, () => flushSync(update));
}

export function PokemonThemeProvider({ children }: { children: ReactNode }) {
  const [theme, updateTheme] = useState<PokemonTheme>(THEME_ORDER[0]);
  const [rotation, updateRotation] = useState<Rotation>(DEFAULT_ROTATION);
  const [upcoming, setUpcoming] = useState<PokemonTheme | null>(null);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);
  const [capturedPokemon, updateCapturedPokemon] = useState<CapturedPokemon[]>([]);
  const capturedPokemonRef = useRef<CapturedPokemon[]>([]);
  const [collectionError, setCollectionError] = useState<string | null>(null);

  useEffect(() => {
    // The pre-paint script in app/layout.tsx has already picked this visit's habitat. Rotation is
    // never restored: every visit starts on DEFAULT_ROTATION. Each tab keeps its own habitat, so two
    // open tabs don't drag each other along; only the Pokédex is shared between them.
    const next = parseTheme(document.documentElement.dataset.pokemonTheme);
    document.documentElement.dataset.pokemonTheme = next;
    updateTheme(next);
    const read = () => {
      try {
        const collection = parsePokemonCollection(localStorage.getItem(POKEMON_COLLECTION_STORAGE_KEY));
        capturedPokemonRef.current = collection;
        updateCapturedPokemon(collection);
        setCollectionError(null);
      } catch {
        setCollectionError("The Pokédex couldn't read this browser's storage.");
      }
    };
    read();
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key === POKEMON_COLLECTION_STORAGE_KEY || event.key === null) read();
    };
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    window.addEventListener("storage", sync);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("storage", sync);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const apply = useCallback((next: PokemonTheme) => {
    withTransition(() => {
      updateTheme(next);
      document.documentElement.dataset.pokemonTheme = next;
    });
    // Remembered only so the next visit opens somewhere else.
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* Optional persistence. */ }
  }, []);

  /** A habitat picked by hand stays put for the rest of this visit. */
  const pickTheme = useCallback((next: PokemonTheme) => {
    apply(next);
    updateRotation(current => current.mode === "off" ? current : { ...current, mode: "off" });
  }, [apply]);

  /** Rotation choices last for this visit only. */
  const setRotation = useCallback((next: Rotation) => updateRotation(next), []);

  const capturePokemon = useCallback((capture: CapturedPokemon) => {
    try {
      const result = recordPokemonCapture(localStorage, capturedPokemonRef.current, capture);
      if (result.result === "captured") {
        capturedPokemonRef.current = result.collection;
        updateCapturedPokemon(result.collection);
      }
      setCollectionError(result.result === "storage-error" ? "The Pokédex couldn't save this capture. Check this browser's storage settings and try again." : null);
      return result.result;
    } catch {
      setCollectionError("The Pokédex couldn't save this capture. Check this browser's storage settings and try again.");
      return "storage-error";
    }
  }, []);

  const updateRelease = useCallback((release: (collection: CapturedPokemon[]) => { collection: CapturedPokemon[]; result: PokemonReleaseResult }): PokemonReleaseResult => {
    const failed = "The Pokédex couldn't release this Pokémon. Check this browser's storage settings and try again.";
    try {
      const result = release(capturedPokemonRef.current);
      if (result.result === "released") {
        capturedPokemonRef.current = result.collection;
        updateCapturedPokemon(result.collection);
      }
      setCollectionError(result.result === "storage-error" ? failed : null);
      return result.result;
    } catch {
      setCollectionError(failed);
      return "storage-error";
    }
  }, []);
  const releasePokemon = useCallback((release: CapturedPokemon) => updateRelease(collection => releasePokemonCapture(localStorage, collection, release)), [updateRelease]);
  const releaseAllPokemon = useCallback(() => updateRelease(collection => releaseAllPokemonCaptures(localStorage, collection)), [updateRelease]);

  // Decide the next stop whenever the habitat or the rotation changes; a fresh choice restarts the countdown.
  const { mode, every } = rotation;
  useEffect(() => {
    setUpcoming(mode === "off" ? null : nextTheme(theme, mode));
    setCycle(value => value + 1);
  }, [theme, mode, every]);

  // The countdown keeps its remaining time across pauses and background tabs.
  const ms = intervalMs(every);
  const counting = ready && mode !== "off" && !paused && !hidden && upcoming !== null;
  const clock = useRef<{ cycle: number; remaining: number; since: number | null }>({ cycle: -1, remaining: 0, since: null });
  useEffect(() => {
    if (clock.current.cycle !== cycle) clock.current = { cycle, remaining: ms, since: null };
    if (!counting || !upcoming) return;
    const started = performance.now();
    clock.current.since = started;
    let fired = false;
    const timeout = window.setTimeout(() => { fired = true; apply(upcoming); }, clock.current.remaining);
    return () => {
      window.clearTimeout(timeout);
      clock.current.since = null;
      if (!fired) clock.current.remaining = Math.max(0, clock.current.remaining - (performance.now() - started));
    };
  }, [counting, cycle, ms, upcoming, apply]);
  const elapsed = useCallback(() => {
    const { cycle: counted, remaining, since } = clock.current;
    if (counted !== cycle) return 0;
    return Math.min(ms, ms - remaining + (since === null ? 0 : performance.now() - since));
  }, [cycle, ms]);

  const value = useMemo<ThemeState>(() => ({ theme, setTheme: pickTheme, rotation, setRotation, upcoming, cycle, counting, elapsed, paused, setPaused, capturedPokemon, collectionError, capturePokemon, releasePokemon, releaseAllPokemon, ready }), [theme, pickTheme, rotation, setRotation, upcoming, cycle, counting, elapsed, paused, setPaused, capturedPokemon, collectionError, capturePokemon, releasePokemon, releaseAllPokemon, ready]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function usePokemonTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("Pokémon themes require PokemonThemeProvider.");
  return context;
}

/**
 * One partner per theme, all rendered; CSS keeps only the active theme's visible. The pre-paint
 * script sets the theme before hydration, so the right partner shows on the very first frame.
 */
export function ThemePartner({ className, theme }: { className?: string; theme?: PokemonTheme }) {
  if (theme) return <PokemonSprite species={theme} className={className} />;
  return THEME_ORDER.map(option => <span key={option} className="for-theme" data-for={option}><PokemonSprite species={option} className={className} /></span>);
}

const MODE_ICONS: Record<RotationMode, ReactNode> = {
  off: <Pause size={13} aria-hidden="true" />,
  order: <Repeat size={13} aria-hidden="true" />,
  shuffle: <Shuffle size={13} aria-hidden="true" />,
};

/**
 * A CSS-driven countdown that joins the provider's clock where it stands. The offset is fixed at
 * mount (changing animation-delay on a running animation would make it jump); key it by cycle.
 */
function Countdown({ ms, elapsed, children }: { ms: number; elapsed: () => number; children: (style: CSSProperties) => ReactNode }) {
  const [delay] = useState(() => -Math.round(elapsed()));
  return children({ "--rotation-ms": `${ms}ms`, "--rotation-delay": `${delay}ms` } as CSSProperties);
}

/** Regulars only: the legendaries and mythicals who visit are kept a surprise. */
function regularsOf(theme: PokemonTheme) {
  return RESIDENTS[theme].filter(species => !isSpecial(SPECIES[species]));
}

/** The Pokédex, on its own wherever a page puts it (the trainer card's shoulder, the header). */
export function PokedexButton() {
  const { capturedPokemon, collectionError, releasePokemon, releaseAllPokemon } = usePokemonTheme();
  return (
    <div className="theme-controls">
      <PokemonCollection capturedPokemon={capturedPokemon} storageError={collectionError} onRelease={releasePokemon} onReleaseAll={releaseAllPokemon} />
    </div>
  );
}

/**
 * The habitat picker, docked at the bottom-left of the screen away from the page's own controls:
 * the partner in a circle whose rim is the countdown to the next habitat, a mode badge, and pause.
 */
export function HabitatDock() {
  const { theme, setTheme, rotation, setRotation, upcoming, cycle, counting, elapsed, paused, setPaused, ready } = usePokemonTheme();
  const [open, setOpen] = useState(false);
  const rotating = rotation.mode !== "off";
  const ms = intervalMs(rotation.every);

  return (
    <div className="habitat-dock">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger className="habitat-dock-trigger" disabled={!ready} aria-busy={!ready} aria-label={`Habitat: ${SPECIES[theme].name}, ${THEMES[theme].type} type${rotating ? `, changing ${rotation.mode === "order" ? "in order" : "at random"}` : ""}. Change habitat`}>
          <span className="habitat-dock-stage" aria-hidden="true"><ThemePartner className="habitat-dock-sprite" /></span>
          {/* The ring and the button are the same circle, so the countdown always sits on its rim. */}
          {rotating && <Countdown key={cycle} ms={ms} elapsed={elapsed}>{style => (
            <svg className={`habitat-dock-ring ${counting ? "" : "is-held"}`} viewBox="0 0 48 48" style={style} aria-hidden="true">
              <circle className="habitat-dock-track" cx="24" cy="24" r="22.5" />
              <circle className="habitat-dock-progress" cx="24" cy="24" r="22.5" pathLength={1} />
            </svg>
          )}</Countdown>}
          <span className="habitat-dock-mode" aria-hidden="true">{rotating ? MODE_ICONS[rotation.mode] : <ChevronUp size={13} strokeWidth={3} />}</span>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="theme-panel" side="top" align="start" sideOffset={12} collisionPadding={12} aria-label="Habitat settings">
            <div className="theme-panel-head">
              <p className="theme-panel-title">Choose a habitat</p>
              <p className="theme-panel-sub">{regularsOf(theme).length} Pokémon live in each. Rumour has it something rarer passes through…</p>
            </div>

            <div className="theme-options" role="radiogroup" aria-label="Habitat">
              {THEME_ORDER.map(option => {
                const info = THEMES[option];
                const selected = option === theme;
                return (
                  // Just the partner: its sprite and name. The type stays in the accessible name. Choosing the
                  // habitat already showing also counts as a pick, so it stops rotating there too.
                  <label key={option} className={`theme-option ${selected ? "is-selected" : ""}`} style={{ "--swatch": info.swatch } as CSSProperties} title={`${SPECIES[option].name} · ${info.type}`}>
                    <input className="sr-only" type="radio" name="pokemon-habitat" value={option} checked={selected} onChange={() => setTheme(option)} onClick={() => { if (selected) setTheme(option); }} aria-label={`${SPECIES[option].name}, ${info.type} type`} />
                    <span className="theme-option-stage" aria-hidden="true"><PokemonSprite species={option} className="theme-option-sprite" /></span>
                    <span className="theme-option-name" aria-hidden="true">{SPECIES[option].name}</span>
                    <span className="theme-option-check" aria-hidden="true"><Check size={10} strokeWidth={3.5} /></span>
                  </label>
                );
              })}
            </div>

            <fieldset className="theme-setting">
              <legend>Change automatically</legend>
              <div className="theme-segmented" role="radiogroup" aria-label="Change automatically">
                {ROTATION_MODES.map(({ id, label }) => (
                  <label key={id} className={rotation.mode === id ? "is-selected" : ""}>
                    <input className="sr-only" type="radio" name="pokemon-rotation" value={id} checked={rotation.mode === id} onChange={() => setRotation({ ...rotation, mode: id })} />
                    {id === "off" ? null : MODE_ICONS[id]}{label}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="theme-setting" disabled={!rotating}>
              <legend>Every</legend>
              <div className="theme-chips" role="radiogroup" aria-label="Change every">
                {ROTATION_INTERVALS.map(({ id, label }) => (
                  <label key={id} className={rotation.every === id ? "is-selected" : ""}>
                    <input className="sr-only" type="radio" name="pokemon-interval" value={id} checked={rotation.every === id} onChange={() => setRotation({ ...rotation, every: id })} />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="theme-next" aria-live="polite">
              {!rotating ? <>Stays with <strong>{SPECIES[theme].name}</strong> for this visit.</>
                : !upcoming ? null
                : <>
                    <span className="theme-next-sprite" aria-hidden="true">{rotation.mode === "order" ? <PokemonSprite species={upcoming} /> : <Shuffle size={14} />}</span>
                    <span>Up next: <strong>{rotation.mode === "order" ? SPECIES[upcoming].name : "a surprise"}</strong>{paused ? " · paused" : ""}</span>
                    <Countdown key={cycle} ms={ms} elapsed={elapsed}>{style => <span className={`theme-next-bar ${counting ? "" : "is-held"}`} style={style} aria-hidden="true"><i /></span>}</Countdown>
                  </>}
            </p>
            {/* On phones the dock is just the partner circle, so pausing lives here instead. */}
            <button className="theme-panel-pause" type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>
              {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
              {paused ? "Resume Pokémon and habitat changes" : "Pause Pokémon and habitat changes"}
            </button>
            <Popover.Arrow className="theme-panel-arrow" width={14} height={7} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <button className="habitat-pause" type="button" aria-label={paused ? "Resume Pokémon and habitat changes" : "Pause Pokémon and habitat changes"} aria-pressed={paused} title={paused ? "Resume Pokémon and habitat changes" : "Pause Pokémon and habitat changes"} onClick={() => setPaused(!paused)}>
        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      </button>
    </div>
  );
}

type HabitatBounds = { width: number; height: number };
const GREETING_MS = 2400;
/** With reduced motion a legendary doesn't teleport; it just says so. */
const DODGE_FEEDBACK_MS = 900;
const TELEPORT_TAUNTS = ["Too slow!", "Over here!", "Catch me if you can!"];
const PHASE_TAUNTS = ["Can't touch this!", "Missed me!", "Right through you!"];
const pickTaunt = (taunts: string[]) => taunts[Math.floor(Math.random() * taunts.length)];
/** Chance that a resident who goes offstage is replaced from the bench. */
const SWAP_ODDS = .55;
/** Shared by every resident, so only one of them picks a fight at a time. */
let lastAmbushAt = -Infinity;

function PokemonResident({ species, home, entering, slot, compact, bounds, scaleFactor, groundHeight, paused, reducedMotion, onOffstage, onCaptured, onSpotlight, capturedPokemon, capturePokemon }: {
  species: PokemonSpecies; home: number; entering: boolean; slot: number; compact: boolean; bounds: HabitatBounds; scaleFactor: number; groundHeight: number; paused: boolean;
  reducedMotion: boolean;
  onOffstage: (slot: number) => void;
  onCaptured: (slot: number) => void;
  onSpotlight: (slot: number, active: boolean) => void;
  capturedPokemon: CapturedPokemon[];
  capturePokemon: ThemeState["capturePokemon"];
}) {
  const info = SPECIES[species];
  const air = info.movement === "air";
  const [routine, setRoutine] = useState(() => createPokemonRoutine(species, slot, compact, home, entering));
  const [happy, setHappy] = useState(false);
  const [greeting, setGreeting] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const [captureMessage, setCaptureMessage] = useState<"captured" | "already-captured" | "storage-error" | "dodged" | "">("");
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hoverDodgeFeedback, setHoverDodgeFeedback] = useState(false);
  // Legendaries and mythicals slip the cursor a few times per visit: blinking elsewhere, or going intangible.
  const [evasion, setEvasion] = useState<"teleport-out" | "teleport-in" | "phase" | null>(null);
  const evadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stamina = useRef(0);
  // Not every Pokémon wants to be bothered: a hover can earn a move to the cursor and a getaway dash.
  const [ambush, setAmbush] = useState<{ facing: 1 | -1 } | null>(null);
  const [dashCycle, setDashCycle] = useState(-1);
  const dashing = routine.cycle === dashCycle;
  const aimRef = useRef<AmbushPoint>({ x: 0, y: 0 });
  const ambushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const residentRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dodgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activityTimer = useRef({ cycle: -1, remaining: 0 });
  const alreadyCaptured = capturedPokemon.some(entry => entry.species === species && entry.shiny === routine.shiny);
  const interacting = happy || hovered || focused || hoverDodgeFeedback;
  const foreground = happy || hoverDodgeFeedback || capturing;
  const teleporting = evasion === "teleport-out" || evasion === "teleport-in";
  const stopped = paused || interacting || capturing || ambush !== null || teleporting;
  // Hovered, greeted or being caught: lift it above the page and dim everything else.
  const spotlight = interacting || foreground;
  const spotlightChange = useRef(onSpotlight);
  spotlightChange.current = onSpotlight;
  useEffect(() => {
    if (!spotlight) return;
    spotlightChange.current(slot, true);
    return () => spotlightChange.current(slot, false);
  }, [spotlight, slot]);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    if (dodgeTimer.current) clearTimeout(dodgeTimer.current);
    if (ambushTimer.current) clearTimeout(ambushTimer.current);
    if (evadeTimer.current) clearTimeout(evadeTimer.current);
  }, []);
  useEffect(() => { if (reducedMotion) setCapturing(false); }, [reducedMotion]);
  // Keep aiming at the cursor while winding up; the shot leaves toward wherever it is then.
  useEffect(() => {
    if (!ambush) return;
    const follow = (event: PointerEvent) => { aimRef.current = { x: event.clientX, y: event.clientY }; };
    window.addEventListener("pointermove", follow, { passive: true });
    return () => window.removeEventListener("pointermove", follow);
  }, [ambush]);

  // Pause the routine clock together with CSS, including its remaining time.
  // A greeting or a background tab must never teleport a visible resident.
  useEffect(() => {
    const clock = activityTimer.current;
    if (clock.cycle !== routine.cycle) {
      clock.cycle = routine.cycle;
      clock.remaining = routine.duration;
    }
    if (stopped) return;
    const started = performance.now();
    let finished = false;
    const timeout = window.setTimeout(() => {
      finished = true;
      setRoutine(nextPokemonRoutine(species, slot, compact, routine));
    }, clock.remaining);
    return () => {
      window.clearTimeout(timeout);
      if (!finished) clock.remaining = Math.max(0, clock.remaining - (performance.now() - started));
    };
  }, [routine, species, slot, compact, stopped]);

  // Each visit a legendary or mythical arrives rested; going offstage ends any phasing.
  useEffect(() => {
    if (isSpecial(info) && isEntranceActivity(routine.activity)) stamina.current = rollLegendStamina(routine.shiny);
    if (routine.activity === "vanish" || routine.activity === "burrow" || isHiddenActivity(routine.activity)) {
      setEvasion(current => current === "phase" ? null : current);
    }
  }, [routine, info]);

  // Once it is out of sight, the habitat may swap it for someone on the bench.
  const offstage = useRef(onOffstage);
  offstage.current = onOffstage;
  useEffect(() => {
    if (routine.cycle > 0 && isHiddenActivity(routine.activity)) offstage.current(slot);
  }, [routine, slot]);

  function greet() {
    if (ambush || dashing || evasion) return;
    if (timer.current) clearTimeout(timer.current);
    clearDodge();
    setHappy(true);
    setGreeting(value => value + 1);
    setCaptureMessage("");
    timer.current = setTimeout(() => setHappy(false), GREETING_MS);
  }

  function clearDodge() {
    if (dodgeTimer.current) clearTimeout(dodgeTimer.current);
    dodgeTimer.current = null;
    setHoverDodgeFeedback(false);
  }

  function taunt(at: AmbushPoint, text: string, legend = false) {
    if (!text) return;
    window.dispatchEvent(new CustomEvent<PokemonAmbushTaunt>(POKEMON_AMBUSH_TAUNT_EVENT, { detail: { at, text, legend } }));
  }

  /** Legendaries and mythicals, fully on stage and not already busy with you. */
  function canEvade() {
    const { activity } = routine;
    return !paused && !happy && !capturing && evasion === null
      && !isHiddenActivity(activity) && !isEntranceActivity(activity) && activity !== "vanish" && activity !== "burrow";
  }

  /** Blink out and back in elsewhere, or go intangible so the cursor passes straight through. No text, no taunt. */
  function evade(kind: LegendEvasion, text = "") {
    if (timer.current) clearTimeout(timer.current);
    if (evadeTimer.current) clearTimeout(evadeTimer.current);
    clearDodge();
    setHappy(false);
    setHovered(false);
    const resident = residentRef.current?.getBoundingClientRect();
    if (kind === "phase") {
      if (resident) taunt({ x: resident.left + resident.width / 2, y: resident.top + resident.height * .12 }, text);
      setEvasion("phase");
      evadeTimer.current = setTimeout(() => { evadeTimer.current = null; setEvasion(null); }, LEGEND_PHASE_MS);
      return;
    }
    setEvasion("teleport-out");
    evadeTimer.current = setTimeout(() => {
      // Keeps whatever was left of this part of its visit, so a teleport never shortens the chase.
      const next = teleportPokemonRoutine(species, slot, compact, routine, activityTimer.current.remaining);
      setRoutine(next);
      setEvasion("teleport-in");
      // The habitat covers the viewport, so its coordinates are the viewport's.
      const top = air ? (bounds.height - size) * next.to.y / 100 : Math.max(0, bounds.height - groundHeight - size * SPRITE_FEET + 4);
      taunt({ x: (bounds.width - size) * next.to.x / 100 + size / 2, y: top + size * .12 }, text);
      evadeTimer.current = setTimeout(() => { evadeTimer.current = null; setEvasion(null); }, LEGEND_TELEPORT_IN_MS);
    }, LEGEND_TELEPORT_OUT_MS);
  }

  /** Regulars only, fully on stage and minding their own business. Legendaries slip away instead. */
  function canAmbush() {
    const { activity } = routine;
    return !reducedMotion && !paused && !happy && !capturing && !ambush && !dashing && evasion === null
      && !isHiddenActivity(activity) && !isEntranceActivity(activity) && activity !== "vanish" && activity !== "burrow";
  }

  function startAmbush(cursor: AmbushPoint, facing: 1 | -1, resident: DOMRect) {
    lastAmbushAt = performance.now();
    // Said in the cursor layer, above the page, since the resident itself may sit behind a card.
    // A legendary or mythical announces its signature move with its own cry.
    const legend = isSpecial(info);
    taunt({ x: resident.left + resident.width / 2, y: resident.top + resident.height * .12 }, legend ? `${info.cry} ${info.moveName}!` : `Hmph! ${info.moveName}!`, legend);
    aimRef.current = cursor;
    setAmbush({ facing });
    ambushTimer.current = setTimeout(() => fireAmbush(facing), AMBUSH_WINDUP_MS);
  }

  function fireAmbush(facing: 1 | -1) {
    ambushTimer.current = null;
    const resident = residentRef.current?.getBoundingClientRect();
    const slotElement = slotRef.current;
    if (!resident || !slotElement) return setAmbush(null);
    const target = aimRef.current;
    const origin = { x: resident.left + resident.width * (facing > 0 ? .64 : .36), y: resident.top + resident.height * .48 };
    const legend = isSpecial(info);
    const shot: PokemonAmbushShot = { origin, target, move: info.move, attacker: shinyName, moveName: info.moveName, legend };
    window.dispatchEvent(new CustomEvent(POKEMON_AMBUSH_EVENT, { detail: shot }));
    // A legendary or mythical doesn't run: it vanishes and reappears somewhere else.
    if (legend) {
      setAmbush(null);
      evade("teleport");
      return;
    }
    // Bolt from where it really stands: travel may have been paused mid-stride, so read the live offset.
    const offset = new DOMMatrixReadOnly(getComputedStyle(slotElement).transform);
    const position = {
      x: routine.from.x + offset.m41 * 100 / Math.max(1, bounds.width - size),
      y: air ? routine.from.y + offset.m42 * 100 / Math.max(1, bounds.height - size) : routine.from.y,
    };
    const dash = dashPokemonRoutine(species, slot, compact, routine, position, target.x < origin.x ? 1 : -1);
    setDashCycle(dash.cycle);
    setRoutine(dash);
    setAmbush(null);
  }

  function catchResident() {
    clearDodge();
    if (!rollPokemonCatch(isSpecial(info))) {
      setCaptureMessage("dodged");
      // It breaks free and gets away, so you have to chase it down again.
      if (!reducedMotion) evade(pickLegendEvasion(info), "Broke free!");
      return;
    }

    const result = capturePokemon({ species, shiny: routine.shiny });
    setCaptureMessage(result);
    if (result !== "captured") return;
    if (!shouldAnimatePokemonCapture(result, reducedMotion)) {
      onCaptured(slot);
      return;
    }

    if (timer.current) clearTimeout(timer.current);
    setHappy(false);
    setCapturing(true);
    const resident = residentRef.current?.getBoundingClientRect();
    if (resident) {
      const target: PokemonCapturePoint = { x: resident.left + resident.width / 2, y: resident.top + resident.height / 2 };
      window.dispatchEvent(new CustomEvent(POKEMON_CAPTURE_START_EVENT, { detail: { target } }));
    }
  }

  const size = Math.round(SPRITE_SIZE * (compact ? info.compactScale : info.scale) * scaleFactor);
  const shinyName = `${routine.shiny ? "Shiny " : ""}${info.name}`;
  const captureAnnouncement = captureMessage === "captured" ? `${shinyName} was added to your Pokédex.`
    : captureMessage === "already-captured" ? `${shinyName} is already in your Pokédex.`
    : captureMessage === "storage-error" ? `Could not save ${shinyName}. Check this browser's storage settings and try again.`
    : captureMessage === "dodged" ? `${shinyName} broke free! Try again.`
    : "";
  const rarity = info.legendary ? "Legendary" : info.mythical ? "Mythical" : null;
  const { activity } = routine;
  const style = {
    width: size,
    left: (bounds.width - size) * routine.from.x / 100,
    // Ground residents plant their feet on the same terrain line at every screen height.
    top: air ? (bounds.height - size) * routine.from.y / 100 : Math.max(0, bounds.height - groundHeight - size * SPRITE_FEET + 4),
    "--slot-size": `${size}px`,
    "--z": 12 - Math.round((compact ? info.compactScale : info.scale) * 2),
    "--travel-x": `${(bounds.width - size) * (routine.to.x - routine.from.x) / 100}px`,
    "--travel-y": `${air ? (bounds.height - size) * (routine.to.y - routine.from.y) / 100 : 0}px`,
    "--activity-duration": `${routine.duration}ms`,
    "--facing": ambush?.facing ?? routine.facing,
    "--ambush-ms": `${AMBUSH_WINDUP_MS}ms`,
    "--bob-delay": `${-slot * .7}s`,
    "--blink-out-ms": `${LEGEND_TELEPORT_OUT_MS}ms`,
    "--blink-in-ms": `${LEGEND_TELEPORT_IN_MS}ms`,
    "--phase-ms": `${LEGEND_PHASE_MS}ms`,
  } as CSSProperties;

  // On the move or mid-attack it turns side-on; it faces you again to idle, react, or be greeted.
  const pose = MOTION[species] && !interacting ? (ambush || activity === "attack" ? "attack" : isTravelActivity(activity) ? "walk" : null) : null;
  const classes = [
    "pokemon-slot", air ? "is-air" : "is-ground", info.ghost && "is-ghost", info.legendary && "is-legendary", info.mythical && "is-mythical", pose && `pose-${pose}`,
    routine.shiny && "is-shiny", interacting && "is-interacting", happy && `is-greeting reacts-${info.reaction}`, foreground && "is-foreground", spotlight && "is-spotlight", capturing && "is-catching",
    ambush && "is-ambushing", dashing && "is-dashing", evasion && `is-evading is-${evasion}`,
  ].filter(Boolean).join(" ");

  return (
    <div ref={slotRef} className={classes} data-species={species} data-activity={activity} data-exit={info.exit} style={style}>
      <div className="pokemon-traveler">
        {info.exit === "burrow"
          ? <MoveEffect move="mound" className="pokemon-mound" />
          : <span className="pokemon-portal" aria-hidden="true" />}
        {!air && <span className="pokemon-dust" aria-hidden="true"><i /><i /><i /></span>}
        <div className="pokemon-presence">
          {!air && <span className="pokemon-shadow" aria-hidden="true" />}
          {routine.shiny && <ShinyGlow />}
          <button ref={residentRef} type="button" className="pokemon-resident" onClick={greet} aria-label={`Say hello to ${shinyName}`}
            onPointerEnter={event => {
              if (event.pointerType !== "mouse") return;
              const rect = event.currentTarget.getBoundingClientRect();
              const facing = event.clientX < rect.left + rect.width / 2 ? -1 : 1;
              if (!isSpecial(info) && canAmbush() && rollAmbush(performance.now(), lastAmbushAt)) {
                startAmbush({ x: event.clientX, y: event.clientY }, facing, rect);
                return;
              }
              // A legendary or mythical you haven't caught slips away until it tires…
              const slips = isSpecial(info) && !alreadyCaptured && canEvade() && stamina.current > 0;
              if (slips) stamina.current -= 1;
              // …and sometimes hits the cursor with its signature move on the way out.
              if (slips && canAmbush() && rollAmbush(performance.now(), lastAmbushAt, Math.random, LEGEND_ATTACK_ODDS)) {
                startAmbush({ x: event.clientX, y: event.clientY }, facing, rect);
                return;
              }
              if (slips && !reducedMotion) {
                const kind = pickLegendEvasion(info);
                evade(kind, pickTaunt(kind === "phase" ? PHASE_TAUNTS : TELEPORT_TAUNTS));
                return;
              }
              setHovered(true);
              if (!slips) return;
              if (dodgeTimer.current) clearTimeout(dodgeTimer.current);
              setHoverDodgeFeedback(true);
              dodgeTimer.current = setTimeout(() => {
                setHoverDodgeFeedback(false);
                dodgeTimer.current = null;
              }, DODGE_FEEDBACK_MS);
            }}
            onPointerLeave={() => setHovered(false)}
            onPointerDown={() => setFocused(false)}
            onFocus={event => setFocused(event.currentTarget.matches(":focus-visible"))}
            onBlur={() => setFocused(false)}>
            <span className="pokemon-window"><span className="pokemon-emerge"><span className="pokemon-facing"><span className="pokemon-body" onAnimationEnd={event => {
              if (event.target !== event.currentTarget || !isPokemonCaptureAnimation(event.animationName)) return;
              setCapturing(false);
              onCaptured(slot);
            }}>
              <PokemonSprite species={species} shiny={routine.shiny} className="pokemon-character" />
              <PokemonMotion species={species} shiny={routine.shiny} />
            </span></span></span></span>
          </button>
          <span className="pokemon-fx" aria-hidden="true">
            {activity === "attack" && <MoveEffect key={`move-${routine.cycle}`} move={info.move} className={`fx-move fx-${MOVES[info.move].kind}`} />}
            {activity === "roar" && <span key={`roar-${routine.cycle}`} className="fx-roar"><MoveEffect move="ring" /><MoveEffect move="ring" /><MoveEffect move="ring" /></span>}
            {activity === "smile" && <MoveEffect key={`smile-${routine.cycle}`} move="heart" className="fx-heart" />}
            {happy && (info.reaction === "roar"
              ? <span key={`greet-${greeting}`} className="fx-roar fx-greeting"><MoveEffect move="ring" /><MoveEffect move="ring" /><MoveEffect move="ring" /></span>
              : <MoveEffect key={`greet-${greeting}`} move="heart" className="fx-heart fx-greeting" />)}
          </span>
          {routine.shiny && <ShinyStars />}
          {activity === "attack" && !happy && !ambush && <span key={`call-${routine.cycle}`} className="pokemon-callout" aria-hidden="true">{info.moveName}!</span>}
          {(hovered || focused) && !happy && !hoverDodgeFeedback && (
            <span className="pokemon-hover-hello" aria-hidden="true">
              <PokemonSprite species={species} shiny={routine.shiny} className="pokemon-hover-sprite" />
              <span>Hi!</span>
            </span>
          )}
          {hoverDodgeFeedback && <span className="pokemon-dodge-callout" aria-hidden="true">Dodged!</span>}
          {happy && <div key={greeting} className="pokemon-hello" role="group" aria-label={`${shinyName} says hello`}>
            <span className="pokemon-hello-cry" aria-hidden="true">{routine.shiny && <span>✦</span>}{info.cry}</span>
            {captureMessage === "dodged" && <span className="pokemon-catch-status" aria-hidden="true">Broke free! Try again.</span>}
            <button type="button" className="pokemon-catch-button" aria-label={alreadyCaptured ? `${shinyName} is already caught` : `Catch ${shinyName}`} disabled={alreadyCaptured} onClick={catchResident}>
              {alreadyCaptured ? "Caught" : "Catch"}
            </button>
          </div>}
        </div>
        {/* Outside the fading layer so the sparkle reads while the Pokémon is still materialising. */}
        {routine.shiny && isEntranceActivity(activity) && <>
          <ShinyBurst key={`burst-${routine.cycle}`} />
          <span key={`shiny-${routine.cycle}`} className="pokemon-callout is-shiny-callout" aria-hidden="true">✦ Shiny{rarity ? ` ${rarity}` : ""}!</span>
        </>}
        {rarity && !routine.shiny && isEntranceActivity(activity) && <span key={`rare-${routine.cycle}`} className={`pokemon-callout is-rarity-callout is-${rarity.toLowerCase()}`} aria-hidden="true">{info.mythical ? "✦" : "★"} {rarity}!</span>}
      </div>
      <span className="sr-only" role="status">{hoverDodgeFeedback ? "Dodged!" : captureAnnouncement || (happy ? `${shinyName} ${info.reaction === "roar" ? "lets out a mighty roar" : "smiles and waves hello"}!` : "")}</span>
    </div>
  );
}

export function PokemonHabitat() {
  const { theme, paused, ready, capturedPokemon, capturePokemon } = usePokemonTheme();
  const habitatRef = useRef<HTMLElement>(null);
  const [bounds, setBounds] = useState<HabitatBounds>({ width: 0, height: 0 });
  const [hidden, setHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPreference = () => setReducedMotion(preference.matches);
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setBounds({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    if (habitatRef.current) observer.observe(habitatRef.current);
    onVisibility();
    onPreference();
    document.addEventListener("visibilitychange", onVisibility);
    preference.addEventListener("change", onPreference);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      preference.removeEventListener("change", onPreference);
    };
  }, []);
  const compact = bounds.width <= 760;
  // Tablets get slightly smaller residents so the edge zones stay clear of the content.
  const scaleFactor = compact || bounds.width >= 1100 ? 1 : .8;
  const groundHeight = compact ? 24 : 38;
  const stopped = paused || hidden;
  // Ten residents per theme, five on stage; whoever goes offstage may hand over to the bench.
  const [cast, setCast] = useState<CastMember[]>([]);
  useEffect(() => {
    if (ready) setCast(createCast(theme, compact));
  }, [ready, theme, compact]);
  const onOffstage = useCallback((slot: number) => {
    if (Math.random() < SWAP_ODDS) setCast(current => recast(current, slot, theme));
  }, [theme]);
  const onCaptured = useCallback((slot: number) => {
    setCast(current => recastCapturedResident(current, slot, theme));
  }, [theme]);

  // Spotlight: residents report hover/greeting; a capture holds it until the Pokédex has
  // pulled the energy in (the resident itself is replaced halfway through the beam).
  const spotlightSlots = useRef(new Set<number>());
  const [residentSpotlight, setResidentSpotlight] = useState(false);
  const [captureSpotlight, setCaptureSpotlight] = useState(false);
  const onSpotlight = useCallback((slot: number, active: boolean) => {
    if (active) spotlightSlots.current.add(slot);
    else spotlightSlots.current.delete(slot);
    setResidentSpotlight(spotlightSlots.current.size > 0);
  }, []);
  useEffect(() => {
    let fallback: ReturnType<typeof setTimeout> | undefined;
    const end = () => {
      clearTimeout(fallback);
      setCaptureSpotlight(false);
    };
    const start = () => {
      clearTimeout(fallback);
      setCaptureSpotlight(true);
      fallback = setTimeout(end, POKEMON_CAPTURE_MS + 600);
    };
    window.addEventListener(POKEMON_CAPTURE_START_EVENT, start);
    window.addEventListener(POKEMON_CAPTURE_END_EVENT, end);
    return () => {
      clearTimeout(fallback);
      window.removeEventListener(POKEMON_CAPTURE_START_EVENT, start);
      window.removeEventListener(POKEMON_CAPTURE_END_EVENT, end);
    };
  }, []);
  const spotlight = captureSpotlight ? "capture" : residentSpotlight ? "hover" : null;
  // The dimming lives on the page wrapper so it works on every page that hosts a habitat.
  useEffect(() => {
    const page = habitatRef.current?.parentElement;
    if (!page) return;
    page.dataset.pokemonStage = "";
    if (spotlight) page.dataset.pokemonSpotlight = spotlight;
    else delete page.dataset.pokemonSpotlight;
  }, [spotlight]);
  useEffect(() => {
    const page = habitatRef.current?.parentElement;
    return () => { if (page) delete page.dataset.pokemonSpotlight; };
  }, []);
  return (
    <aside ref={habitatRef} className={`pokemon-habitat habitat-${theme} ${stopped ? "is-paused" : ""} ${spotlight ? "has-spotlight" : ""}`} data-ready={ready} aria-hidden={!ready || undefined} aria-label={`Pokémon ${THEMES[theme].habitat.toLowerCase()}`} style={{ "--habitat-ground-height": `${groundHeight}px` } as CSSProperties}>
      <PokemonScenery theme={theme} />
      <CursorAmbushLayer />
      {ready && bounds.width > 0 && cast.map(({ species, home, entering }, slot) => <PokemonResident key={`${theme}-${species}-${compact}-${reducedMotion}`} species={species} home={home} entering={entering} onOffstage={onOffstage} onCaptured={onCaptured} onSpotlight={onSpotlight} slot={slot} compact={compact} bounds={bounds} scaleFactor={scaleFactor} groundHeight={groundHeight} paused={stopped} reducedMotion={reducedMotion} capturedPokemon={capturedPokemon} capturePokemon={capturePokemon} />)}
    </aside>
  );
}
