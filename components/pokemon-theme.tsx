"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { MoveEffect, PokemonSprite, ShinyBurst, ShinyGlow, ShinyStars } from "@/components/pokemon-sprite";
import { PokemonScenery } from "@/components/pokemon-scenery";
import { createPokemonRoutine, isEntranceActivity, nextPokemonRoutine } from "@/lib/pokemon-behavior";
import { MOVES, RESIDENTS, SPECIES, SPRITE_FEET, SPRITE_SIZE, type PokemonSpecies, type PokemonTheme } from "@/lib/pokemon-roster";

const STORAGE_KEY = "mon-pokemon-theme";
const ThemeContext = createContext<{
  theme: PokemonTheme;
  setTheme: (theme: PokemonTheme) => void;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  ready: boolean;
} | null>(null);

export function PokemonThemeProvider({ children }: { children: ReactNode }) {
  const [theme, updateTheme] = useState<PokemonTheme>("gengar");
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const readTheme = () => {
      let next: PokemonTheme = document.documentElement.dataset.pokemonTheme === "gible" ? "gible" : "gengar";
      try {
        next = localStorage.getItem(STORAGE_KEY) === "gible" ? "gible" : "gengar";
      } catch { /* The theme still works when browser storage is unavailable. */ }
      document.documentElement.dataset.pokemonTheme = next;
      updateTheme(next);
    };
    readTheme();
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) readTheme();
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function setTheme(next: PokemonTheme) {
    updateTheme(next);
    document.documentElement.dataset.pokemonTheme = next;
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Optional persistence. */ }
  }

  return <ThemeContext.Provider value={{ theme, setTheme, paused, setPaused, ready }}>{children}</ThemeContext.Provider>;
}

function usePokemonTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("Pokémon themes require PokemonThemeProvider.");
  return context;
}

export function ThemeSelector() {
  const { theme, setTheme, paused, setPaused, ready } = usePokemonTheme();
  return (
    <div className="theme-controls">
      <fieldset className="theme-selector" aria-busy={!ready} disabled={!ready}>
        <legend className="sr-only">Portfolio theme</legend>
        {(["gengar", "gible"] as const).map(option => (
          <label className={`theme-choice ${ready && theme === option ? "is-selected" : ""}`} key={option}>
            <input className="sr-only" type="radio" name="pokemon-theme" value={option} checked={theme === option} onChange={() => setTheme(option)} />
            <PokemonSprite species={option} className="theme-sprite" />
            <span>{SPECIES[option].name}</span>
          </label>
        ))}
      </fieldset>
      <button className="habitat-pause" type="button" aria-label={paused ? "Resume Pokémon animation" : "Pause Pokémon animation"} aria-pressed={paused} title={paused ? "Resume Pokémon animation" : "Pause Pokémon animation"} onClick={() => setPaused(!paused)}>
        {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
      </button>
    </div>
  );
}

type HabitatBounds = { width: number; height: number };
const GREETING_MS = 2400;

function PokemonResident({ species, slot, compact, bounds, scaleFactor, groundHeight, paused }: {
  species: PokemonSpecies; slot: number; compact: boolean; bounds: HabitatBounds; scaleFactor: number; groundHeight: number; paused: boolean;
}) {
  const info = SPECIES[species];
  const air = info.movement === "air";
  const [routine, setRoutine] = useState(() => createPokemonRoutine(species, slot, compact));
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

  function greet() {
    if (timer.current) clearTimeout(timer.current);
    setHappy(true);
    setGreeting(value => value + 1);
    timer.current = setTimeout(() => setHappy(false), GREETING_MS);
  }

  const size = Math.round(SPRITE_SIZE * (compact ? info.compactScale : info.scale) * scaleFactor);
  const shinyName = `${routine.shiny ? "Shiny " : ""}${info.name}`;
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

  const classes = [
    "pokemon-slot", air ? "is-air" : "is-ground", info.ghost && "is-ghost", info.legendary && "is-legendary",
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
          {(hovered || focused) && !happy && <span className="pokemon-name" aria-hidden="true">{routine.shiny && <span>✦</span>}{info.name}</span>}
          {happy && <span key={greeting} className="pokemon-hello" aria-hidden="true">{routine.shiny && <span>✦</span>}{info.cry}</span>}
        </div>
        {/* Outside the fading layer so the sparkle reads while the Pokémon is still materialising. */}
        {routine.shiny && isEntranceActivity(activity) && <>
          <ShinyBurst key={`burst-${routine.cycle}`} />
          <span key={`shiny-${routine.cycle}`} className="pokemon-callout is-shiny-callout" aria-hidden="true">✦ Shiny!</span>
        </>}
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
  const residents = compact ? RESIDENTS[theme].filter(species => SPECIES[species].compact) : RESIDENTS[theme];
  return (
    <aside ref={habitatRef} className={`pokemon-habitat habitat-${theme} ${stopped ? "is-paused" : ""}`} data-ready={ready} aria-hidden={!ready || undefined} aria-label={theme === "gengar" ? "Moonlit Pokémon graveyard" : "Pokémon mountain trail"} style={{ "--habitat-ground-height": `${groundHeight}px` } as CSSProperties}>
      <PokemonScenery theme={theme} />
      {ready && bounds.width > 0 && residents.map((species, slot) => <PokemonResident key={`${theme}-${species}-${compact}-${reducedMotion}`} species={species} slot={slot} compact={compact} bounds={bounds} scaleFactor={scaleFactor} groundHeight={groundHeight} paused={stopped} />)}
    </aside>
  );
}
