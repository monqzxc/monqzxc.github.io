import type { Metadata } from "next";
import RaftBattle from "@/components/raft-battle";
import "./raft.css";
import "./online.css";

export const metadata: Metadata = {
  title: "Poké Raft — Mon's Playground",
  description: "A Pokémon-inspired artillery battle on the water. Play a friend online or on one device, or take on Easy or Hard AI. Two minutes per turn to make a splash.",
};

export default function RaftPage() {
  return <RaftBattle />;
}
