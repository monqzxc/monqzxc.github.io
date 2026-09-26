import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GameCards from "@/components/game-cards";
import { GAMES_HREF } from "@/lib/games";

export default function GamesTeaser() {
  return (
    <section className="games-teaser" aria-labelledby="games-heading">
      <div className="games-section-heading"><div><h2 id="games-heading">Games</h2><p>A few side quests, all in one place.</p></div><Link className="games-browse-link" href={GAMES_HREF}>All games <ArrowRight size={17} aria-hidden="true" /></Link></div>
      <GameCards headingLevel={3} idPrefix="home-game" />
    </section>
  );
}
