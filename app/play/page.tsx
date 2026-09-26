import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GameCards from "@/components/game-cards";
import { games } from "@/lib/games";

export const metadata: Metadata = {
  title: "Games — Mon's Playground",
  description: "Explore Mon's games in one place. Solve a Pokémon tile puzzle, battle across the water in Poké Raft, and find your next side quest.",
};

export default function PlayPage() {
  return (
    <div className="games-page">
      <a className="skip-link" href="#games-main">Skip to games</a>
      <header className="games-topbar"><Link className="wordmark" href="/" aria-label="Mon home"><strong>mon<span>.</span></strong><span className="games-wordmark-label">Playground</span></Link><Link className="games-back" href="/#craft-hobbies"><ArrowLeft size={16} aria-hidden="true" /> Back to portfolio</Link></header>
      <main id="games-main" className="games-main">
        <div className="games-intro"><h1>A little more <span>play.</span></h1><p>All my games, in one place. Take a solo break or bring a worthy rival.</p></div>
        <div className="games-library-heading"><h2>All games</h2><span>{games.length} games to explore</span></div>
        <GameCards headingLevel={3} />
      </main>
      <footer className="games-footer"><span>Little side quests by Mon.</span><span>Pokémon artwork via <a href="https://github.com/PokeAPI/sprites" target="_blank" rel="noreferrer">PokéAPI</a>. Pokémon © Nintendo / Creatures / GAME FREAK.</span></footer>
    </div>
  );
}
