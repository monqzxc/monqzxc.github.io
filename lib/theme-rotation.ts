// Automatic habitat changes: every visit opens in a shuffled habitat and keeps shuffling every
// 30 seconds until the visitor picks one. Shared by the theme provider and the pre-paint script in
// app/layout.tsx, so the visit's first habitat lands before the first frame.
import { THEME_ORDER, isPokemonTheme, type PokemonTheme } from "./pokemon-roster.ts";

export type RotationMode = "off" | "order" | "shuffle";
export type RotationInterval = "30s" | "1m" | "5m";
export type Rotation = { mode: RotationMode; every: RotationInterval };

/** Only the last habitat is remembered, so a new visit never opens where the last one was. */
export const THEME_STORAGE_KEY = "mon-pokemon-theme";
/**
 * Every visit starts here: shuffling every 30 seconds. Rotation settings are never saved; picking a
 * habitat turns it off for the rest of that visit, and the next visit starts shuffling again.
 */
export const DEFAULT_ROTATION: Rotation = { mode: "shuffle", every: "30s" };

export const ROTATION_MODES: { id: RotationMode; label: string }[] = [
  { id: "off", label: "Off" },
  { id: "order", label: "In order" },
  { id: "shuffle", label: "Shuffle" },
];

export const ROTATION_INTERVALS: { id: RotationInterval; label: string; ms: number }[] = [
  { id: "30s", label: "30s", ms: 30_000 },
  { id: "1m", label: "1 min", ms: 60_000 },
  { id: "5m", label: "5 min", ms: 300_000 },
];

export function intervalMs(every: RotationInterval) {
  return ROTATION_INTERVALS.find(option => option.id === every)?.ms ?? ROTATION_INTERVALS[0].ms;
}

/** The next habitat: the following one in order, or any other one at random. */
export function nextTheme(current: PokemonTheme, mode: Exclude<RotationMode, "off">, random: () => number = Math.random): PokemonTheme {
  const index = Math.max(0, THEME_ORDER.indexOf(current));
  if (mode === "order") return THEME_ORDER[(index + 1) % THEME_ORDER.length];
  const others = THEME_ORDER.length - 1;
  const step = 1 + Math.min(others - 1, Math.floor(Math.max(0, random()) * others));
  return THEME_ORDER[(index + step) % THEME_ORDER.length];
}

export const parseTheme = (raw: string | null | undefined): PokemonTheme => isPokemonTheme(raw) ? raw : THEME_ORDER[0];

/** The habitat a visit opens in: anywhere on a first visit, then always somewhere other than last time. */
export function visitTheme(last: string | null, random: () => number = Math.random): PokemonTheme {
  if (!isPokemonTheme(last)) return THEME_ORDER[Math.min(THEME_ORDER.length - 1, Math.floor(Math.max(0, random()) * THEME_ORDER.length))];
  return nextTheme(last, "shuffle", random);
}

/**
 * Inline, pre-hydration script: the same pick as visitTheme, made before paint so the page never
 * flashes the previous habitat. Kept dependency-free; the theme list is embedded at build time.
 */
export function themeBootScript() {
  const themes = JSON.stringify(THEME_ORDER);
  const themeKey = JSON.stringify(THEME_STORAGE_KEY);
  return `(()=>{var t=${themes},n=t.length,v=null,ls=null;try{ls=localStorage;v=ls.getItem(${themeKey})}catch(e){}var i=t.indexOf(v),s=i<0?t[Math.floor(Math.random()*n)]:t[(i+1+Math.floor(Math.random()*(n-1)))%n];try{ls&&ls.setItem(${themeKey},s)}catch(e){}document.documentElement.dataset.pokemonTheme=s})()`;
}
