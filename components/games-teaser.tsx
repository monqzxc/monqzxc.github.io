import { ArrowUpRight, Gamepad2 } from "lucide-react";
import { GAMES_HREF } from "@/lib/navigation";

export default function GamesTeaser() {
  return (
    <section className="games-teaser" aria-labelledby="games-heading">
      <a className="games-teaser-card" href={GAMES_HREF} aria-describedby="games-desc">
        <span className="games-teaser-icon" aria-hidden="true"><Gamepad2 size={22} /></span>
        <span className="games-teaser-copy">
          <h2 id="games-heading">Games</h2>
          <p id="games-desc">10+ browser games live on Raro, my separate games site.</p>
        </span>
        <span className="games-browse-link">Play on Raro <ArrowUpRight size={17} aria-hidden="true" /></span>
      </a>
    </section>
  );
}
