import type { Metadata } from "next";
import TilePuzzle from "@/components/tile-puzzle";
import "./puzzle.css";

export const metadata: Metadata = {
  title: "Pokémon Tile Puzzle — Mon",
  description: "Pick one of eight Pokémon and solve a sliding-tile puzzle. Play a 3×3 or 4×4 board and keep your best times and moves on this browser.",
};

export default function PlayPage() {
  return <TilePuzzle />;
}
