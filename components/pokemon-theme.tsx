"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { PokemonArt, type PokemonSpecies } from "@/components/pokemon-art";
import { PokemonScenery } from "@/components/pokemon-scenery";
import { createPokemonRoutine, isGhostPokemon, nextPokemonRoutine } from "@/lib/pokemon-behavior";

type PokemonTheme = "gengar" | "gible";
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
            <PokemonArt species={option} />
            <span>{option === "gengar" ? "Gengar" : "Gible"}</span>
          </label>
        ))}
      </fieldset>
      <button className="habitat-pause" type="button" aria-label={paused ? "Resume Pokémon animation" : "Pause Pokémon animation"} aria-pressed={paused} title={paused ? "Resume Pokémon animation" : "Pause Pokémon animation"} onClick={() => setPaused(!paused)}>
        {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
      </button>
    </div>
  );
}

const residents: Record<PokemonTheme, PokemonSpecies[]> = {
  gengar: ["gengar", "gastly", "haunter", "gastly", "haunter", "gengar"],
  gible: ["gible", "diglett", "sandshrew"],
};
const names: Record<PokemonSpecies, string> = {
  gengar: "Gengar", gastly: "Gastly", haunter: "Haunter", gible: "Gible", sandshrew: "Sandshrew", diglett: "Diglett",
};

type HabitatBounds = { width: number; height: number };

function PokemonResident({ species, index, compact, bounds, size, groundHeight, paused }: {
  species: PokemonSpecies; index: number; compact: boolean; bounds: HabitatBounds; size: number; groundHeight: number; paused: boolean;
}) {
  const ghost = isGhostPokemon(species);
  const [routine, setRoutine] = useState(() => createPokemonRoutine(species, index, compact));
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
      setRoutine(nextPokemonRoutine(species, index, compact, routine));
    }, clock.remaining);
    return () => {
      window.clearTimeout(timeout);
      if (!finished) clock.remaining = Math.max(0, clock.remaining - (performance.now() - started));
    };
  }, [routine, species, index, compact, stopped]);

  function greet() {
    if (timer.current) clearTimeout(timer.current);
    setHappy(true);
    setGreeting(value => value + 1);
    timer.current = setTimeout(() => setHappy(false), 2400);
  }

  const style = {
    left: (bounds.width - size) * routine.from.x / 100,
    // Ground residents stand on the same terrain baseline at every screen height.
    top: ghost ? (bounds.height - size) * routine.from.y / 100 : Math.max(0, bounds.height - groundHeight - size * .88 + 5),
    "--travel-x": `${(bounds.width - size) * (routine.to.x - routine.from.x) / 100}px`,
    "--travel-y": `${ghost ? (bounds.height - size) * (routine.to.y - routine.from.y) / 100 : 0}px`,
    "--activity-duration": `${routine.duration}ms`,
    "--facing": routine.facing,
    "--bob-delay": `${-index * .7}s`,
  } as CSSProperties;

  return (
    <div className={`pokemon-slot ${ghost ? "is-ghost" : "is-ground"} ${interacting ? "is-interacting" : ""} ${happy ? "is-greeting" : ""}`} data-species={species} data-activity={routine.activity} style={style}>
      <div className="pokemon-traveler">
        {ghost ? <span className="pokemon-portal" aria-hidden="true" /> : <><span className="pokemon-soil" aria-hidden="true" /><span className="pokemon-dust" aria-hidden="true"><i /><i /><i /></span></>}
        <div className="pokemon-presence">
          <button type="button" className="pokemon-resident" onClick={greet} aria-label={`Say hello to ${names[species]}`}
            onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
            onPointerLeave={() => setHovered(false)}
            onPointerDown={() => setFocused(false)}
            onFocus={event => setFocused(event.currentTarget.matches(":focus-visible"))}
            onBlur={() => setFocused(false)}>
            <span className="pokemon-window"><span className="pokemon-emerge"><span className="pokemon-facing"><PokemonArt species={species} happy={happy} className="pokemon-character" /></span></span></span>
            {happy && <span key={greeting} className="pokemon-hello" aria-hidden="true">Hi! <span>♥</span></span>}
          </button>
        </div>
      </div>
      <span className="sr-only" role="status">{happy ? `${names[species]} smiles and waves hello!` : ""}</span>
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
  const size = compact ? 64 : Math.min(88, Math.max(64, bounds.width * .06));
  const groundHeight = compact ? 24 : 38;
  const stopped = paused || hidden || reducedMotion;
  return (
    <aside ref={habitatRef} className={`pokemon-habitat habitat-${theme} ${stopped ? "is-paused" : ""}`} data-ready={ready} aria-hidden={!ready || undefined} aria-label={theme === "gengar" ? "Moonlit Pokémon graveyard" : "Pokémon mountain trail"} style={{ "--pokemon-size": `${size}px`, "--habitat-ground-height": `${groundHeight}px` } as CSSProperties}>
      <PokemonScenery theme={theme} />
      {ready && bounds.width > 0 && (compact ? residents[theme].slice(0, 3) : residents[theme]).map((species, index) => <PokemonResident key={`${theme}-${compact}-${reducedMotion}-${index}`} species={species} index={index} compact={compact} bounds={bounds} size={size} groundHeight={groundHeight} paused={stopped} />)}
    </aside>
  );
}
