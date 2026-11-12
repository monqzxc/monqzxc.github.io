import type { CSSProperties } from "react";
import { MOTION } from "@/lib/pokemon-motion";
import { MOVES, moveUrl, motionUrl, SPRITE_FEET, SPRITE_SIZE, spriteUrl, type MoveId, type PokemonSpecies, type SpriteName } from "@/lib/pokemon-roster";

/**
 * A pixel-art Pokémon from its packed sheet. Frames advance with a stepped transform on
 * the compositor, and the shiny form is the sheet's second row, so swapping it is free.
 */
export function PokemonSprite({ species, shiny = false, className }: { species: SpriteName; shiny?: boolean; className?: string }) {
  return (
    <span className={`pokemon-sprite${shiny ? " is-shiny" : ""}${className ? ` ${className}` : ""}`} aria-hidden="true">
      <span className="pokemon-sprite-sheet" style={{ backgroundImage: `url(${spriteUrl(species)})` }} />
    </span>
  );
}

/**
 * Side-view walk and attack strips, laid over the front sprite and sized so the body
 * matches it, feet on the same line. CSS shows whichever one the current activity needs;
 * both stay in the layout while hidden so their sheets are loaded before the first step.
 */
export function PokemonMotion({ species, shiny = false }: { species: PokemonSpecies; shiny?: boolean }) {
  const info = MOTION[species];
  if (!info) return null;
  const unit = info.scale / SPRITE_SIZE * 100;
  const box = {
    left: `${50 - info.centre * unit}%`,
    top: `${SPRITE_FEET * 100 - info.feet * unit}%`,
    width: `${info.width * unit}%`,
    aspectRatio: `${info.width} / ${info.height}`,
  };
  return (["walk", "attack"] as const).map(anim => (
    <span key={anim} className={`pokemon-motion is-${anim}${shiny ? " is-shiny" : ""}`} style={{ ...box, "--frames": info[anim].frames, "--strip-ms": `${info[anim].ms}ms` } as CSSProperties} aria-hidden="true">
      <span className="pokemon-motion-strip" style={{ width: `${info[anim].frames * 100}%`, backgroundImage: `url(${motionUrl(species, anim)})` }} />
    </span>
  ));
}

/** One play of a move strip from pokemon-moves; frames step across the strip. */
export function MoveEffect({ move, className, style }: { move: MoveId; className?: string; style?: CSSProperties }) {
  const { frames } = MOVES[move];
  return (
    <span className={`move-effect move-${move}${frames > 1 ? " is-strip" : ""}${className ? ` ${className}` : ""}`} style={{ ...style, "--frames": frames } as CSSProperties} aria-hidden="true">
      <span className="move-strip" style={{ width: `${frames * 100}%`, backgroundImage: `url(${moveUrl(move)})` }} />
    </span>
  );
}

// Where the little stars twinkle around a shiny, as fractions of its sprite box, with their size and phase.
const STARS: [x: number, y: number, scale: number, delay: number][] = [
  [.14, .3, 1, 0], [.86, .22, .8, 400], [.9, .62, 1.1, 800], [.1, .7, .75, 1200], [.5, .04, .9, 1600],
];

/** A shiny's flex: a soft gold glow on the ground under it, drawn behind the sprite. */
export function ShinyGlow() {
  return <span className="shiny-glow" aria-hidden="true" />;
}

/** …and little stars twinkling around it, in front. With reduced motion they hold still. */
export function ShinyStars() {
  return (
    <span className="shiny-stars" aria-hidden="true">
      {STARS.map(([x, y, scale, delay], index) => (
        <i key={index} style={{ "--x": x, "--y": y, "--s": scale, "--d": `${delay}ms` } as CSSProperties}>✦</i>
      ))}
    </span>
  );
}

/** The sparkle burst when a shiny arrives: fairy sparkles thrown out in a ring. */
export function ShinyBurst() {
  return (
    <span className="shiny-burst" aria-hidden="true">
      {[0, 60, 120, 180, 240, 300].map((angle, index) => (
        <MoveEffect key={angle} move="fairy-sparkle" style={{ "--a": `${angle}deg`, "--d": `${index % 2 ? 90 : 0}ms` } as CSSProperties} />
      ))}
    </span>
  );
}
