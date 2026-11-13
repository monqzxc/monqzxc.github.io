// Automatic habitat changes: walk the themes in order or shuffle them, on a timer or once per visit.
// Shared by the theme provider and the pre-paint script in app/layout.tsx, so a "per visit"
// rotation lands before the first frame instead of flashing the previous habitat.
import { THEME_ORDER, isPokemonTheme, type PokemonTheme } from "./pokemon-roster.ts";

export type RotationMode = "off" | "order" | "shuffle";
export type RotationInterval = "visit" | "30s" | "1m" | "5m";
export type Rotation = { mode: RotationMode; every: RotationInterval };

export const THEME_STORAGE_KEY = "mon-pokemon-theme";
export const ROTATION_STORAGE_KEY = "mon-pokemon-rotation";
export const DEFAULT_ROTATION: Rotation = { mode: "off", every: "1m" };

export const ROTATION_MODES: { id: RotationMode; label: string }[] = [
  { id: "off", label: "Off" },
  { id: "order", label: "In order" },
  { id: "shuffle", label: "Shuffle" },
];

/** `ms: null` changes once per page load instead of on a timer. */
export const ROTATION_INTERVALS: { id: RotationInterval; label: string; ms: number | null }[] = [
  { id: "30s", label: "30s", ms: 30_000 },
  { id: "1m", label: "1 min", ms: 60_000 },
  { id: "5m", label: "5 min", ms: 300_000 },
  { id: "visit", label: "Each visit", ms: null },
];

export function intervalMs(every: RotationInterval) {
  return ROTATION_INTERVALS.find(option => option.id === every)?.ms ?? null;
}

/** The next habitat: the following one in order, or any other one at random. */
export function nextTheme(current: PokemonTheme, mode: Exclude<RotationMode, "off">, random: () => number = Math.random): PokemonTheme {
  const index = Math.max(0, THEME_ORDER.indexOf(current));
  if (mode === "order") return THEME_ORDER[(index + 1) % THEME_ORDER.length];
  const others = THEME_ORDER.length - 1;
  const step = 1 + Math.min(others - 1, Math.floor(Math.max(0, random()) * others));
  return THEME_ORDER[(index + step) % THEME_ORDER.length];
}

export function parseRotation(raw: string | null): Rotation {
  try {
    const value = JSON.parse(raw ?? "null") as Partial<Rotation> | null;
    const mode = ROTATION_MODES.some(option => option.id === value?.mode) ? value!.mode! : DEFAULT_ROTATION.mode;
    const every = ROTATION_INTERVALS.some(option => option.id === value?.every) ? value!.every! : DEFAULT_ROTATION.every;
    return { mode, every };
  } catch {
    return DEFAULT_ROTATION;
  }
}

export const parseTheme = (raw: string | null | undefined): PokemonTheme => isPokemonTheme(raw) ? raw : THEME_ORDER[0];

/**
 * Inline, pre-hydration script: restores the saved habitat and applies a "per visit" rotation
 * before paint. Kept dependency-free; the theme list is embedded at build time.
 */
export function themeBootScript() {
  const themes = JSON.stringify(THEME_ORDER);
  return `(()=>{var t=${themes},d=document.documentElement,s=t[0];try{var v=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t.indexOf(v)>=0)s=v;var r=JSON.parse(localStorage.getItem(${JSON.stringify(ROTATION_STORAGE_KEY)})||"null");if(r&&r.every==="visit"&&(r.mode==="order"||r.mode==="shuffle")){var i=t.indexOf(s);s=r.mode==="order"?t[(i+1)%t.length]:t[(i+1+Math.floor(Math.random()*(t.length-1)))%t.length];localStorage.setItem(${JSON.stringify(THEME_STORAGE_KEY)},s)}}catch(e){}d.dataset.pokemonTheme=s})()`;
}
