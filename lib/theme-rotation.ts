// Automatic habitat changes: walk the themes in order or shuffle them, on a timer or once per visit.
// Shared by the theme provider and the pre-paint script in app/layout.tsx, so a "per visit"
// rotation lands before the first frame instead of flashing the previous habitat.
import { THEME_ORDER, isPokemonTheme, type PokemonTheme } from "./pokemon-roster.ts";

export type RotationMode = "off" | "order" | "shuffle";
export type RotationInterval = "visit" | "30s" | "1m" | "5m";
export type Rotation = { mode: RotationMode; every: RotationInterval };

export const THEME_STORAGE_KEY = "mon-pokemon-theme";
/** Renamed (v2) when the default became a shuffle per visit, so older saved choices start over once. */
export const ROTATION_STORAGE_KEY = "mon-pokemon-rotation-v2";
/** Every visit lands in a different habitat until the visitor picks otherwise. */
export const DEFAULT_ROTATION: Rotation = { mode: "shuffle", every: "visit" };

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

/** The habitat a page load opens on, given what was saved (null if nothing or unavailable). */
export function visitTheme(saved: string | null, rotation: Rotation, random: () => number = Math.random): PokemonTheme {
  const known = isPokemonTheme(saved);
  const current = known ? saved : THEME_ORDER[0];
  if (rotation.every !== "visit" || rotation.mode === "off") return current;
  // A first visit can open anywhere; after that it always moves on.
  if (!known) return rotation.mode === "order" ? THEME_ORDER[0] : THEME_ORDER[Math.min(THEME_ORDER.length - 1, Math.floor(Math.max(0, random()) * THEME_ORDER.length))];
  return nextTheme(current, rotation.mode, random);
}

/**
 * Inline, pre-hydration script: picks the habitat for this visit (visitTheme) before paint, using
 * the default rotation when none is saved. Kept dependency-free; the lists are embedded at build time.
 */
export function themeBootScript() {
  const themes = JSON.stringify(THEME_ORDER);
  const fallback = JSON.stringify(DEFAULT_ROTATION);
  const themeKey = JSON.stringify(THEME_STORAGE_KEY);
  const rotationKey = JSON.stringify(ROTATION_STORAGE_KEY);
  return `(()=>{var t=${themes},n=t.length,d=document.documentElement,r=${fallback},v=null,ls=null;try{ls=localStorage;v=ls.getItem(${themeKey});var x=JSON.parse(ls.getItem(${rotationKey})||"null");if(x&&x.mode&&x.every)r=x}catch(e){}var k=t.indexOf(v)>=0,s=k?v:t[0];if(r.every==="visit"&&(r.mode==="order"||r.mode==="shuffle")){var i=t.indexOf(s);s=!k?(r.mode==="order"?t[0]:t[Math.floor(Math.random()*n)]):r.mode==="order"?t[(i+1)%n]:t[(i+1+Math.floor(Math.random()*(n-1)))%n];try{ls&&ls.setItem(${themeKey},s)}catch(e){}}d.dataset.pokemonTheme=s})()`;
}
