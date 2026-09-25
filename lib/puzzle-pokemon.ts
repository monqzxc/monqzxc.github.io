import type { PuzzleId } from "./tile-puzzle";

export const puzzlePokemon: { id: PuzzleId; name: string; number: string; color: string; tint: string }[] = [
  { id: "gengar", name: "Gengar", number: "094", color: "#bd9bff", tint: "#483163" },
  { id: "charizard", name: "Charizard", number: "006", color: "#ffb075", tint: "#663c2f" },
  { id: "pikachu", name: "Pikachu", number: "025", color: "#f7d56b", tint: "#5d5028" },
  { id: "ho-oh", name: "Ho-Oh", number: "250", color: "#ff998a", tint: "#60342e" },
  { id: "rayquaza", name: "Rayquaza", number: "384", color: "#83dbb2", tint: "#215745" },
  { id: "bidoof", name: "Bidoof", number: "399", color: "#dfb98e", tint: "#584231" },
  { id: "mew", name: "Mew", number: "151", color: "#f2accf", tint: "#60394f" },
  { id: "mewtwo", name: "Mewtwo", number: "150", color: "#b8b0fb", tint: "#413859" },
];

export function puzzleImage(id: PuzzleId) {
  return `/images/puzzle/${id}.png`;
}

export function formatPuzzleTime(milliseconds: number) {
  const total = Math.floor(milliseconds / 1000);
  const seconds = String(total % 60).padStart(2, "0");
  const minutes = Math.floor(total / 60);
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}:${seconds}`
    : `${String(minutes).padStart(2, "0")}:${seconds}`;
}
