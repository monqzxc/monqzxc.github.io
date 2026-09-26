import type { Metadata } from "next";
import RaftBattle from "@/components/raft-battle";
import "./raft.css";

export const metadata: Metadata = {
  title: "Poké Raft — Mon's Playground",
  description: "A Pokémon-inspired artillery battle on the water. Challenge a friend on one device or take on Easy or Hard AI. Pick your Pokémon, aim, and make a splash.",
};

export default function RaftPage() {
  return <RaftBattle />;
}
