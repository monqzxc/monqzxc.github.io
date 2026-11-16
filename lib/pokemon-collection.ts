import { SPECIES, type PokemonSpecies } from "./pokemon-roster.ts";

export type CapturedPokemon = { species: PokemonSpecies; shiny: boolean };
export type PokemonCaptureResult = "captured" | "already-captured" | "storage-error";
export const POKEMON_COLLECTION_STORAGE_KEY = "mon-pokemon-collection";

export function shouldAnimatePokemonCapture(result: PokemonCaptureResult, prefersReducedMotion: boolean): boolean {
  return result === "captured" && !prefersReducedMotion;
}

function isCapturedPokemon(value: unknown): value is CapturedPokemon {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return typeof record.species === "string"
    && Object.hasOwn(SPECIES, record.species)
    && typeof record.shiny === "boolean";
}

export function parsePokemonCollection(raw: string | null): CapturedPokemon[] {
  if (raw === null) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const collection: CapturedPokemon[] = [];
  for (const entry of parsed) {
    if (!isCapturedPokemon(entry)) continue;
    if (!collection.some(capture => capture.species === entry.species && capture.shiny === entry.shiny)) {
      collection.push(entry);
    }
  }
  return collection;
}

export function recordPokemonCapture(
  storage: Pick<Storage, "setItem">,
  collection: CapturedPokemon[],
  capture: CapturedPokemon,
): { collection: CapturedPokemon[]; result: PokemonCaptureResult } {
  if (collection.some(entry => entry.species === capture.species && entry.shiny === capture.shiny)) {
    return { collection, result: "already-captured" };
  }

  const next = [...collection, capture];
  try {
    storage.setItem(POKEMON_COLLECTION_STORAGE_KEY, JSON.stringify(next));
  } catch {
    return { collection, result: "storage-error" };
  }
  return { collection: next, result: "captured" };
}
