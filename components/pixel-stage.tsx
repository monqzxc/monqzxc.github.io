"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { MoveEffect, PokemonMotion } from "@/components/pokemon-sprite";
import { MOVES, SPECIES, type PokemonSpecies } from "@/lib/pokemon-roster";
import styles from "./pixel-stage.module.css";

const ATTACK_MS = 1500;
/** The defender flinches as the move connects. */
const IMPACT_MS = 620;
const AUTOPLAY_MS = 3400;

type Side = "left" | "right";
const FIGHTERS: Record<Side, { species: PokemonSpecies; scale: number }> = {
  left: { species: "gengar", scale: 5 },
  right: { species: "gible", scale: 3.5 },
};
const other = (side: Side): Side => side === "left" ? "right" : "left";

// A pixel-stepped oval for each fighter to stand on.
const PAD_ROWS = [10, 18, 22, 24, 24, 22, 18, 10];
function Pad() {
  const width = 24;
  return (
    <svg className={styles.pad} viewBox={`0 0 ${width} ${PAD_ROWS.length}`} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {PAD_ROWS.map((span, y) => <rect key={y} x={(width - span) / 2} y={y} width={span} height={1} className={y < 3 ? styles.padRim : styles.padFill} />)}
    </svg>
  );
}

/**
 * Mon's partners, side-on and facing off. With `interactive`, tapping one makes it
 * attack; either way they trade moves on their own while the stage is on screen.
 */
export function PixelStage({ interactive = false, className }: { interactive?: boolean; className?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const [turn, setTurn] = useState<{ side: Side; cycle: number; byVisitor: boolean } | null>(null);
  const [hit, setHit] = useState<Side | null>(null);
  const [live, setLive] = useState(false);
  const last = useRef<Side>("right");
  const timers = useRef<number[]>([]);

  function attack(side: Side, byVisitor = false) {
    timers.current.forEach(window.clearTimeout);
    last.current = side;
    setHit(null);
    setTurn(current => ({ side, cycle: (current?.cycle ?? 0) + 1, byVisitor }));
    timers.current = [
      window.setTimeout(() => setHit(other(side)), IMPACT_MS),
      window.setTimeout(() => setHit(null), IMPACT_MS + 420),
      window.setTimeout(() => setTurn(null), ATTACK_MS),
    ];
  }

  // Autoplay only while visible, and never with reduced motion.
  useEffect(() => {
    const element = stage.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setLive(Boolean(entry?.isIntersecting) && !motion.matches), { threshold: .3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!live) return;
    const loop = window.setInterval(() => attack(other(last.current)), AUTOPLAY_MS);
    return () => window.clearInterval(loop);
  }, [live]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  return (
    <div ref={stage} className={`${styles.stage}${className ? ` ${className}` : ""}`}>
      {(["left", "right"] as const).map(side => {
        const { species, scale } = FIGHTERS[side];
        const info = SPECIES[species];
        const attacking = turn?.side === side;
        const state = attacking ? "attack" : hit === side ? "hit" : "idle";
        const body = (
          <>
            <Pad />
            <span className={styles.facing}>
              <span className={styles.body}>
                <PokemonMotion species={species} />
              </span>
              <span className={styles.fx} aria-hidden="true">
                {attacking && <MoveEffect key={turn.cycle} move={info.move} className={`fx-move fx-${MOVES[info.move].kind}`} />}
              </span>
            </span>
            {attacking && <span key={`call-${turn.cycle}`} className={styles.callout} aria-hidden="true">{info.moveName}!</span>}
          </>
        );
        const props = {
          className: `${styles.fighter} ${styles[side]}`,
          "data-state": state,
          style: { "--scale": scale, "--activity-duration": `${ATTACK_MS}ms` } as CSSProperties,
        };
        return interactive
          ? <button key={side} type="button" {...props} onClick={() => attack(side, true)} aria-label={`${info.name}, use ${info.moveName}`}>{body}</button>
          : <span key={side} {...props} aria-hidden="true">{body}</span>;
      })}
      {interactive && <span className="sr-only" role="status">{turn?.byVisitor ? `${SPECIES[FIGHTERS[turn.side].species].name} used ${SPECIES[FIGHTERS[turn.side].species].moveName}!` : ""}</span>}
    </div>
  );
}
