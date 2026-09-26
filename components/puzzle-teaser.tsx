import { ArrowUpRight, Gamepad2 } from "lucide-react";

export default function PuzzleTeaser() {
  return (
    <a className="puzzle-teaser" href="/play/">
      <div className="puzzle-teaser-copy"><div className="eyebrow"><Gamepad2 size={16} /> A LITTLE SIDE QUEST</div><h3>Take a break. Solve a puzzle.</h3><p>Eight Pokémon, a sliding board, and your next challenge.</p><span className="puzzle-teaser-link">Play tile puzzle <ArrowUpRight size={17} /></span></div>
      <div className="puzzle-teaser-art" aria-hidden="true"><img src="/images/puzzle/gengar.png" alt="" width={180} height={180} loading="lazy" /><img src="/images/puzzle/pikachu.png" alt="" width={150} height={150} loading="lazy" /><span className="puzzle-teaser-cell">?</span></div>
    </a>
  );
}
