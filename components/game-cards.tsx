import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { games, gameHref } from "@/lib/games";

export default function GameCards({ headingLevel = 2, idPrefix = "game" }: { headingLevel?: 2 | 3; idPrefix?: string }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <ul className="games-list">
      {games.map(game => (
        <li key={game.slug}>
          <Link className="game-card" href={gameHref(game)} aria-labelledby={`${idPrefix}-${game.slug}`}>
            <div className="game-card-art" aria-hidden="true">
              {game.artwork.map((image, index) => <img key={image} src={image} alt="" width={240} height={240} loading="lazy" className={index === 0 ? "game-art-first" : "game-art-second"} />)}
            </div>
            <div className="game-card-copy">
              <Heading id={`${idPrefix}-${game.slug}`}>{game.name}</Heading>
              <p>{game.description}</p>
              <div className="game-card-footer"><span><Users size={14} aria-hidden="true" /> {game.players}</span><span>{game.category}</span><span className="game-card-play">Play <ArrowUpRight size={17} aria-hidden="true" /></span></div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
