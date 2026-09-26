import Link from "next/link";
import { ArrowUpRight, Swords } from "lucide-react";

export default function PuzzleTeaser() {
  return (
    <div className="puzzle-teasers">
      <Link className="puzzle-teaser puzzle-teaser-raft" href="/play/raft/">
        <div className="puzzle-teaser-copy">
          <h3>Poké Raft</h3>
          <p>Take aim. Make a splash. Challenge a friend on one device, or battle Easy or Hard AI.</p>
          <span className="puzzle-teaser-link">Play raft battle <ArrowUpRight size={17} aria-hidden="true" /></span>
        </div>
        <div className="puzzle-teaser-art" aria-hidden="true">
          <img src="/images/puzzle/charizard.png" alt="" width={190} height={190} loading="lazy" />
          <img src="/images/puzzle/mew.png" alt="" width={145} height={145} loading="lazy" />
          <Swords className="puzzle-teaser-duel" size={26} />
        </div>
      </Link>
      <Link className="puzzle-teaser" href="/play/">
        <div className="puzzle-teaser-copy">
          <h3>Take a break. Solve a puzzle.</h3>
          <p>Eight Pokémon, a sliding board, and your next challenge.</p>
          <span className="puzzle-teaser-link">Play tile puzzle <ArrowUpRight size={17} aria-hidden="true" /></span>
        </div>
        <div className="puzzle-teaser-art" aria-hidden="true">
          <img src="/images/puzzle/gengar.png" alt="" width={190} height={190} loading="lazy" />
          <img src="/images/puzzle/pikachu.png" alt="" width={145} height={145} loading="lazy" />
          <span className="puzzle-teaser-cell">?</span>
        </div>
      </Link>
    </div>
  );
}
