"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { Popover } from "radix-ui";
import { Check, ChevronDown, Pause, Play, Repeat, Shuffle, Sparkles, Star } from "lucide-react";
import { MoveEffect, PokemonMotion, PokemonSprite, ShinyBurst, ShinyGlow, ShinyStars } from "@/components/pokemon-sprite";
import { PokemonScenery } from "@/components/pokemon-scenery";
import { createCast, createPokemonRoutine, isEntranceActivity, isHiddenActivity, isSpecial, isTravelActivity, nextPokemonRoutine, recast, type CastMember } from "@/lib/pokemon-behavior";
import { MOTION } from "@/lib/pokemon-motion";
import { MOVES, RESIDENTS, SPECIES, SPRITE_FEET, SPRITE_SIZE, THEME_ORDER, THEMES, type PokemonSpecies, type PokemonTheme } from "@/lib/pokemon-roster";
import { DEFAULT_ROTATION, intervalMs, nextTheme, parseRotation, parseTheme, ROTATION_INTERVALS, ROTATION_MODES, ROTATION_STORAGE_KEY, THEME_STORAGE_KEY, type Rotation, type RotationMode } from "@/lib/theme-rotation";

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

  useEffect(() => {
    // The pre-paint script in app/layout.tsx has already applied the saved (or per-visit) habitat.
    const read = () => {
      let next = parseTheme(document.documentElement.dataset.pokemonTheme);
      let saved = DEFAULT_ROTATION;
      try {
        next = parseTheme(localStorage.getItem(THEME_STORAGE_KEY) ?? next);
        saved = parseRotation(localStorage.getItem(ROTATION_STORAGE_KEY));
      } catch { /* Themes still work when browser storage is unavailable. */ }
      document.documentElement.dataset.pokemonTheme = next;
      updateTheme(next);
      updateRotation(saved);
    };
    read();
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY || event.key === ROTATION_STORAGE_KEY || event.key === null) read();
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
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* Optional persistence. */ }
  }, []);

  const setRotation = useCallback((next: Rotation) => {
    updateRotation(next);
    try { localStorage.setItem(ROTATION_STORAGE_KEY, JSON.stringify(next)); } catch { /* Optional persistence. */ }
  }, []);

  // Decide the next stop whenever the habitat or the rotation changes; a fresh choice restarts the countdown.
  const { mode, every } = rotation;
  useEffect(() => {
    setUpcoming(mode === "off" ? null : nextTheme(theme, mode));
    setCycle(value => value + 1);
  }, [theme, mode, every]);

  // The countdown keeps its remaining time across pauses and background tabs.
  const ms = intervalMs(every);
  const counting = ready && mode !== "off" && ms !== null && !paused && !hidden && upcoming !== null;
  const clock = useRef<{ cycle: number; remaining: number; since: number | null }>({ cycle: -1, remaining: 0, since: null });
  useEffect(() => {
    if (clock.current.cycle !== cycle) clock.current = { cycle, remaining: ms ?? 0, since: null };
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
    if (counted !== cycle || !ms) return 0;
    return Math.min(ms, ms - remaining + (since === null ? 0 : performance.now() - since));
  }, [cycle, ms]);

  const value = useMemo<ThemeState>(() => ({ theme, setTheme: apply, rotation, setRotation, upcoming, cycle, counting, elapsed, paused, setPaused, ready }), [theme, apply, rotation, setRotation, upcoming, cycle, counting, elapsed, paused, ready]);
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

/** The legendary and mythical who visit a habitat, for the selector's cards. */
function specialsOf(theme: PokemonTheme) {
  return RESIDENTS[theme].filter(species => isSpecial(SPECIES[species]));
}

export function ThemeSelector() {
  const { theme, setTheme, rotation, setRotation, upcoming, cycle, counting, elapsed, paused, setPaused, ready } = usePokemonTheme();
  const [open, setOpen] = useState(false);
  const rotating = rotation.mode !== "off";
  const ms = intervalMs(rotation.every);
  const timed = rotating && ms !== null;

  return (
    <div className="theme-controls">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger className="theme-trigger" disabled={!ready} aria-busy={!ready} aria-label={`Habitat: ${SPECIES[theme].name}, ${THEMES[theme].type} type${rotating ? `, changing ${rotation.mode === "order" ? "in order" : "at random"}` : ""}. Change habitat`}>
          <span className="theme-trigger-sprite" aria-hidden="true"><ThemePartner className="theme-sprite" /></span>
          {rotating && (
            <span className={`theme-rotation-badge ${counting ? "" : "is-held"}`} aria-hidden="true">
              {timed && <Countdown key={cycle} ms={ms} elapsed={elapsed}>{style => <svg viewBox="0 0 20 20" style={style}><circle cx="10" cy="10" r="8.5" /></svg>}</Countdown>}
              {MODE_ICONS[rotation.mode]}
            </span>
          )}
          <ChevronDown className="theme-trigger-chevron" size={14} aria-hidden="true" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="theme-panel" side="bottom" align="end" sideOffset={10} collisionPadding={12} aria-label="Habitat settings">
            <div className="theme-panel-head">
              <p className="theme-panel-title">Choose a habitat</p>
              <p className="theme-panel-sub">Ten Pokémon live in each, with a rare legendary or mythical visitor.</p>
            </div>

            <div className="theme-options" role="radiogroup" aria-label="Habitat">
              {THEME_ORDER.map(option => {
                const info = THEMES[option];
                const selected = option === theme;
                return (
                  <label key={option} className={`theme-option ${selected ? "is-selected" : ""}`} style={{ "--swatch": info.swatch } as CSSProperties}>
                    <input className="sr-only" type="radio" name="pokemon-habitat" value={option} checked={selected} onChange={() => setTheme(option)} />
                    <span className="theme-option-stage" aria-hidden="true"><PokemonSprite species={option} className="theme-option-sprite" /></span>
                    <span className="theme-option-text">
                      <span className="theme-option-name">{SPECIES[option].name}<span className="theme-option-type">{info.type}</span></span>
                      <span className="theme-option-meta">
                        <span className="theme-option-habitat">{info.habitat}</span>
                        <span className="theme-option-specials">
                          {specialsOf(option).map(species => (
                            <span key={species} className={SPECIES[species].mythical ? "is-mythical" : "is-legendary"} title={SPECIES[species].mythical ? "Mythical" : "Legendary"}>
                              {SPECIES[species].mythical ? <Sparkles size={10} aria-hidden="true" /> : <Star size={10} aria-hidden="true" />}
                              {SPECIES[species].name}
                              <span className="sr-only"> ({SPECIES[species].mythical ? "mythical" : "legendary"})</span>
                            </span>
                          ))}
                        </span>
                      </span>
                    </span>
                    <span className="theme-option-check" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
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
              {!rotating ? <>Stays on <strong>{THEMES[theme].habitat}</strong> until you pick another.</>
                : !timed ? <>{rotation.mode === "order" ? "Moves to the next habitat" : "Picks a surprise habitat"} each time you visit.</>
                : !upcoming ? null
                : <>
                    <span className="theme-next-sprite" aria-hidden="true">{rotation.mode === "order" ? <PokemonSprite species={upcoming} /> : <Shuffle size={14} />}</span>
                    <span>Up next: <strong>{rotation.mode === "order" ? SPECIES[upcoming].name : "a surprise"}</strong>{paused ? " · paused" : ""}</span>
                    <Countdown key={cycle} ms={ms} elapsed={elapsed}>{style => <span className={`theme-next-bar ${counting ? "" : "is-held"}`} style={style} aria-hidden="true"><i /></span>}</Countdown>
                  </>}
            </p>
            <Popover.Arrow className="theme-panel-arrow" width={14} height={7} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <button className="habitat-pause" type="button" aria-label={paused ? "Resume Pokémon and habitat changes" : "Pause Pokémon and habitat changes"} aria-pressed={paused} title={paused ? "Resume Pokémon and habitat changes" : "Pause Pokémon and habitat changes"} onClick={() => setPaused(!paused)}>
        {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
      </button>
    </div>
  );
}

type HabitatBounds = { width: number; height: number };
const GREETING_MS = 2400;
/** Chance that a resident who goes offstage is replaced from the bench. */
const SWAP_ODDS = .55;

function PokemonResident({ species, home, entering, slot, compact, bounds, scaleFactor, groundHeight, paused, onOffstage }: {
  species: PokemonSpecies; home: number; entering: boolean; slot: number; compact: boolean; bounds: HabitatBounds; scaleFactor: number; groundHeight: number; paused: boolean;
  onOffstage: (slot: number) => void;
}) {
  const info = SPECIES[species];
  const air = info.movement === "air";
  const [routine, setRoutine] = useState(() => createPokemonRoutine(species, slot, compact, home, entering));
  const [happy, setHappy] = useState(false);
  const [greeting, setGreeting] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activityTimer = useRef({ cycle: -1, remaining: 0 });
  const interacting = happy || hovered || focused;
  const stopped = paused || interacting;
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

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

  // Once it is out of sight, the habitat may swap it for someone on the bench.
  const offstage = useRef(onOffstage);
  offstage.current = onOffstage;
  useEffect(() => {
    if (routine.cycle > 0 && isHiddenActivity(routine.activity)) offstage.current(slot);
  }, [routine, slot]);

  function greet() {
    if (timer.current) clearTimeout(timer.current);
    setHappy(true);
    setGreeting(value => value + 1);
    timer.current = setTimeout(() => setHappy(false), GREETING_MS);
  }

  const size = Math.round(SPRITE_SIZE * (compact ? info.compactScale : info.scale) * scaleFactor);
  const shinyName = `${routine.shiny ? "Shiny " : ""}${info.name}`;
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
    "--facing": routine.facing,
    "--bob-delay": `${-slot * .7}s`,
  } as CSSProperties;

  // On the move or mid-attack it turns side-on; it faces you again to idle, react, or be greeted.
  const pose = MOTION[species] && !interacting ? (activity === "attack" ? "attack" : isTravelActivity(activity) ? "walk" : null) : null;
  const classes = [
    "pokemon-slot", air ? "is-air" : "is-ground", info.ghost && "is-ghost", info.legendary && "is-legendary", info.mythical && "is-mythical", pose && `pose-${pose}`,
    routine.shiny && "is-shiny", interacting && "is-interacting", happy && `is-greeting reacts-${info.reaction}`,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} data-species={species} data-activity={activity} data-exit={info.exit} style={style}>
      <div className="pokemon-traveler">
        {info.exit === "burrow"
          ? <MoveEffect move="mound" className="pokemon-mound" />
          : <span className="pokemon-portal" aria-hidden="true" />}
        {!air && <span className="pokemon-dust" aria-hidden="true"><i /><i /><i /></span>}
        <div className="pokemon-presence">
          {!air && <span className="pokemon-shadow" aria-hidden="true" />}
          {routine.shiny && <ShinyGlow />}
          <button type="button" className="pokemon-resident" onClick={greet} aria-label={`Say hello to ${shinyName}`}
            onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
            onPointerLeave={() => setHovered(false)}
            onPointerDown={() => setFocused(false)}
            onFocus={event => setFocused(event.currentTarget.matches(":focus-visible"))}
            onBlur={() => setFocused(false)}>
            <span className="pokemon-window"><span className="pokemon-emerge"><span className="pokemon-facing"><span className="pokemon-body">
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
          {activity === "attack" && !happy && <span key={`call-${routine.cycle}`} className="pokemon-callout" aria-hidden="true">{info.moveName}!</span>}
          {(hovered || focused) && !happy && (
            <span className="pokemon-hover-hello" aria-hidden="true">
              <PokemonSprite species={species} shiny={routine.shiny} className="pokemon-hover-sprite" />
              <span>Hi!</span>
            </span>
          )}
          {happy && <span key={greeting} className="pokemon-hello" aria-hidden="true">{routine.shiny && <span>✦</span>}{info.cry}</span>}
        </div>
        {/* Outside the fading layer so the sparkle reads while the Pokémon is still materialising. */}
        {routine.shiny && isEntranceActivity(activity) && <>
          <ShinyBurst key={`burst-${routine.cycle}`} />
          <span key={`shiny-${routine.cycle}`} className="pokemon-callout is-shiny-callout" aria-hidden="true">✦ Shiny{rarity ? ` ${rarity}` : ""}!</span>
        </>}
        {rarity && !routine.shiny && isEntranceActivity(activity) && <span key={`rare-${routine.cycle}`} className={`pokemon-callout is-rarity-callout is-${rarity.toLowerCase()}`} aria-hidden="true">{info.mythical ? "✦" : "★"} {rarity}!</span>}
      </div>
      <span className="sr-only" role="status">{happy ? `${shinyName} ${info.reaction === "roar" ? "lets out a mighty roar" : "smiles and waves hello"}!` : ""}</span>
    </div>
  );
}

export function PokemonHabitat() {
  const { theme, paused, ready } = usePokemonTheme();
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
  const stopped = paused || hidden || reducedMotion;
  // Ten residents per theme, five on stage; whoever goes offstage may hand over to the bench.
  const [cast, setCast] = useState<CastMember[]>([]);
  useEffect(() => {
    if (ready) setCast(createCast(theme, compact));
  }, [ready, theme, compact]);
  const onOffstage = useCallback((slot: number) => {
    if (Math.random() < SWAP_ODDS) setCast(current => recast(current, slot, theme));
  }, [theme]);
  return (
    <aside ref={habitatRef} className={`pokemon-habitat habitat-${theme} ${stopped ? "is-paused" : ""}`} data-ready={ready} aria-hidden={!ready || undefined} aria-label={`Pokémon ${THEMES[theme].habitat.toLowerCase()}`} style={{ "--habitat-ground-height": `${groundHeight}px` } as CSSProperties}>
      <PokemonScenery theme={theme} />
      {ready && bounds.width > 0 && cast.map(({ species, home, entering }, slot) => <PokemonResident key={`${theme}-${species}-${compact}-${reducedMotion}`} species={species} home={home} entering={entering} onOffstage={onOffstage} slot={slot} compact={compact} bounds={bounds} scaleFactor={scaleFactor} groundHeight={groundHeight} paused={stopped} />)}
    </aside>
  );
}
