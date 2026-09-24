"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { PokemonArt, type PokemonSpecies } from "@/components/pokemon-art";

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
  gible: ["gible", "diglett", "sandshrew", "sandshrew", "gible", "diglett"],
};
const names: Record<PokemonSpecies, string> = {
  gengar: "Gengar", gastly: "Gastly", haunter: "Haunter", gible: "Gible", sandshrew: "Sandshrew", diglett: "Diglett",
};

function PokemonResident({ species, index, ghost }: { species: PokemonSpecies; index: number; ghost: boolean }) {
  const [happy, setHappy] = useState(false);
  const [greeting, setGreeting] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function greet() {
    if (timer.current) clearTimeout(timer.current);
    setHappy(true);
    setGreeting(value => value + 1);
    timer.current = setTimeout(() => setHappy(false), 2400);
  }

  const style = {
    "--wander-duration": `${18 + index * 3}s`,
    "--appear-duration": `${13 + index * 2}s`,
    "--pokemon-delay": `${-index * 3 - 4}s`,
    "--bob-delay": `${-index * 0.3}s`,
  } as CSSProperties;

  return (
    <div className={`pokemon-slot pokemon-slot-${index} ${ghost ? "is-ghost" : "is-ground"} ${species === "diglett" ? "is-burrower" : ""} ${happy ? "is-greeting" : ""}`} style={style}>
      <div className="pokemon-traveler">
        {!ghost && <span className="pokemon-soil" aria-hidden="true" />}
        <div className="pokemon-presence">
          <button type="button" className="pokemon-resident" onClick={greet} aria-label={`Say hello to ${names[species]}`}>
            <span className="pokemon-window"><span className="pokemon-emerge"><PokemonArt species={species} happy={happy} className="pokemon-character" /></span></span>
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
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
  return (
    <aside className={`pokemon-habitat habitat-${theme} ${paused || hidden ? "is-paused" : ""}`} data-ready={ready} aria-hidden={!ready || undefined} aria-label={theme === "gengar" ? "Ghost Pokémon garden" : "Ground Pokémon garden"}>
      <div className="habitat-scenery" aria-hidden="true"><span /><span /><span /></div>
      {ready && residents[theme].map((species, index) => <PokemonResident key={`${theme}-${index}`} species={species} index={index} ghost={theme === "gengar"} />)}
    </aside>
  );
}
