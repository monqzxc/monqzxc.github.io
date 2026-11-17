"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { MoveEffect } from "@/components/pokemon-sprite";
import { CURSOR_KO_MS, isCursorHit, MOVE_TINT, POKEMON_AMBUSH_EVENT, POKEMON_AMBUSH_TAUNT_EVENT, shotDuration, type AmbushPoint, type PokemonAmbushShot, type PokemonAmbushTaunt } from "@/lib/pokemon-ambush";
import { MOVES, type MoveId } from "@/lib/pokemon-roster";

type Shot = PokemonAmbushShot & { id: number; ms: number };
type Impact = { id: number; at: AmbushPoint; move: MoveId; hit: boolean };
type Taunt = PokemonAmbushTaunt & { id: number };

const IMPACT_MS = 650;
const TAUNT_MS = 900;

// The arrow on a 12×19 grid, hotspot at its tip (0, 0), and the five pieces it shatters into:
// each is a clip polygon plus where it flies (px) and how far it spins.
const ARROW = "M.5 .5v16l4-4 3 6 2.2-1-3-6h5.5Z";
const SHARDS: { clip: string; x: number; y: number; r: number }[] = [
  { clip: "polygon(0 0, 60% 0, 0 45%)", x: -22, y: -26, r: -140 },
  { clip: "polygon(60% 0, 100% 62%, 30% 45%, 0 45%)", x: 26, y: -18, r: 120 },
  { clip: "polygon(0 45%, 30% 45%, 45% 70%, 0 90%)", x: -28, y: 10, r: -90 },
  { clip: "polygon(30% 45%, 100% 62%, 60% 62%, 45% 70%)", x: 30, y: 16, r: 200 },
  { clip: "polygon(0 90%, 45% 70%, 60% 62%, 85% 100%, 0 100%)", x: 4, y: 30, r: -60 },
];

function CursorShards({ className, tint }: { className: string; tint?: string }) {
  return (
    <span className={className} style={tint ? { "--tint": tint } as CSSProperties : undefined} aria-hidden="true">
      {SHARDS.map((shard, index) => (
        <span key={index} className="cursor-shard" style={{ clipPath: shard.clip, "--sx": `${shard.x}px`, "--sy": `${shard.y}px`, "--sr": `${shard.r}deg` } as CSSProperties}>
          <svg viewBox="0 0 12 19" width="12" height="19"><path d={ARROW} /></svg>
        </span>
      ))}
    </span>
  );
}

/** Orient a sprite drawn facing right along the flight path, mirroring rather than flipping it upside down. */
function aim(origin: AmbushPoint, target: AmbushPoint) {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  return dx >= 0 ? `rotate(${Math.atan2(dy, dx)}rad)` : `scaleX(-1) rotate(${Math.atan2(dy, -dx)}rad)`;
}

/**
 * The habitat's grumpy side. Residents fire shots at the cursor through POKEMON_AMBUSH_EVENT; this
 * layer flies them, and if the cursor is still on the aim point when one lands, the cursor shatters,
 * vanishes for CURSOR_KO_MS, and pieces itself back together wherever the pointer has got to.
 */
export function CursorAmbushLayer() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [taunts, setTaunts] = useState<Taunt[]>([]);
  const [ko, setKo] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const pointer = useRef<AmbushPoint | null>(null);
  const reform = useRef<HTMLSpanElement>(null);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const later = (callback: () => void, ms: number) => {
      const timer = setTimeout(() => { timers.current.delete(timer); callback(); }, ms);
      timers.current.add(timer);
    };
    let koTimer: ReturnType<typeof setTimeout> | undefined;
    const root = document.documentElement;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.current = { x: event.clientX, y: event.clientY };
      if (reform.current) reform.current.style.translate = `${event.clientX}px ${event.clientY}px`;
    };
    const onLeave = () => { pointer.current = null; };

    const onTaunt = (event: Event) => {
      const detail = (event as CustomEvent<PokemonAmbushTaunt>).detail;
      if (!detail) return;
      const id = nextId.current++;
      setTaunts(current => [...current, { ...detail, id }]);
      later(() => setTaunts(current => current.filter(taunt => taunt.id !== id)), TAUNT_MS);
    };

    const onFire = (event: Event) => {
      const detail = (event as CustomEvent<PokemonAmbushShot>).detail;
      if (!detail) return;
      const id = nextId.current++;
      const ms = shotDuration(detail.origin, detail.target);
      setShots(current => [...current, { ...detail, id, ms }]);
      later(() => {
        const hit = isCursorHit(detail.target, pointer.current);
        setShots(current => current.filter(shot => shot.id !== id));
        setImpacts(current => [...current, { id, at: detail.target, move: detail.move, hit }]);
        later(() => setImpacts(current => current.filter(impact => impact.id !== id)), IMPACT_MS);
        setAnnouncement(`${detail.attacker} used ${detail.moveName}! ${hit ? "It's super effective. Your cursor fainted!" : "It missed!"}`);
        if (!hit) return;
        // A second hit while knocked out just restarts the count.
        root.dataset.cursorKo = "";
        setKo(id);
        clearTimeout(koTimer);
        koTimer = setTimeout(() => {
          delete root.dataset.cursorKo;
          setKo(null);
        }, CURSOR_KO_MS);
      }, ms);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener(POKEMON_AMBUSH_EVENT, onFire);
    window.addEventListener(POKEMON_AMBUSH_TAUNT_EVENT, onTaunt);
    const pending = timers.current;
    return () => {
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener(POKEMON_AMBUSH_EVENT, onFire);
      window.removeEventListener(POKEMON_AMBUSH_TAUNT_EVENT, onTaunt);
      pending.forEach(clearTimeout);
      pending.clear();
      clearTimeout(koTimer);
      delete root.dataset.cursorKo;
    };
  }, []);

  const start = pointer.current;
  return (
    <>
      <span className="sr-only" role="status">{announcement}</span>
      {(taunts.length > 0 || shots.length > 0 || impacts.length > 0 || ko !== null) && createPortal(
        <div className="cursor-ambush-layer" aria-hidden="true">
          {taunts.map(taunt => <span key={taunt.id} className="cursor-taunt" style={{ left: taunt.at.x, top: taunt.at.y }}>{taunt.text}</span>)}
          {shots.map(shot => {
            const travels = MOVES[shot.move].kind !== "burst";
            const style = {
              left: shot.origin.x, top: shot.origin.y,
              "--dx": `${shot.target.x - shot.origin.x}px`, "--dy": `${shot.target.y - shot.origin.y}px`,
              "--shot-ms": `${shot.ms}ms`, "--tint": MOVE_TINT[shot.move],
            } as CSSProperties;
            return (
              <span key={shot.id}>
                {/* Lock-on: shrinks onto the aim point for as long as the shot is in the air. */}
                <span className="cursor-lock" style={{ left: shot.target.x, top: shot.target.y, "--shot-ms": `${shot.ms}ms`, "--tint": MOVE_TINT[shot.move] } as CSSProperties} />
                {travels && <span className="cursor-shot" style={style}>
                  <span className="cursor-shot-aim" style={{ transform: aim(shot.origin, shot.target) }}><MoveEffect move={shot.move} className="cursor-shot-move" /></span>
                </span>}
              </span>
            );
          })}
          {impacts.map(impact => (
            <span key={impact.id} className={`cursor-impact ${impact.hit ? "is-hit" : "is-miss"}`} style={{ left: impact.at.x, top: impact.at.y } as CSSProperties}>
              <MoveEffect move={MOVES[impact.move].kind === "burst" ? impact.move : "hit"} className="cursor-impact-move" />
              {impact.hit && <CursorShards className="cursor-shatter" tint={MOVE_TINT[impact.move]} />}
              <span className="cursor-impact-text">{impact.hit ? "It's super effective!" : "It missed!"}</span>
            </span>
          ))}
          {ko !== null && (
            <span key={ko} ref={reform} className="cursor-reform" style={{ translate: start ? `${start.x}px ${start.y}px` : undefined, "--ko-ms": `${CURSOR_KO_MS}ms` } as CSSProperties}>
              <CursorShards className="cursor-reform-shards" />
            </span>
          )}
        </div>,
        document.body,
      )}
    </>
  );
}
