"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { MoveEffect } from "@/components/pokemon-sprite";
import { afflictedStep, CURSOR_KO_MS, isCursorHit, MOVE_STATUS, MOVE_TINT, STATUS_TEXT, type CursorStatus, POKEMON_AMBUSH_EVENT, POKEMON_AMBUSH_TAUNT_EVENT, shotDuration, type AmbushPoint, type PokemonAmbushShot, type PokemonAmbushTaunt } from "@/lib/pokemon-ambush";
import { MOVES, type MoveId } from "@/lib/pokemon-roster";

type Shot = PokemonAmbushShot & { id: number; ms: number };
type Impact = { id: number; at: AmbushPoint; move: MoveId; hit: boolean };
type Taunt = PokemonAmbushTaunt & { id: number };

/** The hit flash and battle text stay up as long as the cursor is knocked out. */
const IMPACT_MS = CURSOR_KO_MS;
type Knockout = { id: number; status: CursorStatus; tint: string; dir: AmbushPoint; hit: AmbushPoint };
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

function Arrow({ className = "cursor-arrow" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 12 19" width="12" height="19"><path d={ARROW} /></svg>;
}

/** `count` little particles, each knowing its index through --i. */
function bits(count: number, className: string) {
  return Array.from({ length: count }, (_, index) => <i key={index} className={className} style={{ "--i": index } as CSSProperties} />);
}

/**
 * What the move does to the cursor, drawn at twice its size around the arrow's tip at (0, 0). Each
 * status sets in, holds (looping its flames, drips, stars…) and finishes within CURSOR_KO_MS; the
 * last stretch belongs to the reform at the pointer.
 */
function CursorStatusEffect({ status, tint, dir }: { status: CursorStatus; tint: string; dir: AmbushPoint }) {
  const style = { "--tint": tint, "--bx": `${Math.round(dir.x * 26)}px`, "--by": `${Math.round(dir.y * 26)}px`, "--ba": `${Math.atan2(dir.y, dir.x)}rad` } as CSSProperties;
  return (
    <span className={`cursor-status is-${status}`} style={style}>
      {status === "shatter" && <CursorShards className="cursor-shatter" tint={tint} />}
      {/* Frozen solid: the arrow is already in pieces under the ice, waiting to fall apart. */}
      {status === "freeze" && <><CursorShards className="cursor-ice-shards" /><i className="cursor-ice" /><i className="cursor-frost" /></>}
      {status !== "shatter" && status !== "freeze" && <span className="cursor-body"><Arrow /></span>}
      {status === "burn" && <><i className="cursor-heat" />{[0, 1, 2, 3].map(index => <MoveEffect key={index} move="small-ember" className="cursor-flame" style={{ "--i": index } as CSSProperties} />)}{bits(8, "cursor-ash")}</>}
      {status === "soak" && <>{bits(6, "cursor-drop")}<i className="cursor-puddle" /></>}
      {status === "tangle" && <>
        <svg className="cursor-vines" viewBox="-6 -4 24 28" width="24" height="28">
          <path pathLength={1} d="M-4 21C2 15 13 17 14 9S4-2-3 5" /><path pathLength={1} d="M17 22C9 18-2 13 2 3" /><path pathLength={1} d="M-4 11C4 13 10 7 15 13" />
        </svg>
        {bits(5, "cursor-leaf")}
      </>}
      {status === "melt" && <><i className="cursor-puddle" />{bits(5, "cursor-bubble")}</>}
      {status === "possess" && <><i className="cursor-aura" /><Arrow className="cursor-arrow cursor-ghost" /><Arrow className="cursor-arrow cursor-ghost" />{bits(5, "cursor-smoke")}</>}
      {status === "confuse" && <span className="cursor-dizzy-ring">{bits(3, "cursor-dizzy")}</span>}
      {status === "blow" && <span className="cursor-gusts">{bits(4, "cursor-gust")}</span>}
      {status === "crush" && <><MoveEffect move="rock" className="cursor-rock" />{bits(4, "cursor-dust")}</>}
      {status === "charm" && [0, 1, 2, 3, 4].map(index => <MoveEffect key={index} move="heart" className="cursor-heart" style={{ "--i": index } as CSSProperties} />)}
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
 * layer flies them, and if the cursor is still on the aim point when one lands, the move does its
 * thing to the cursor (burns, freezes, soaks it…) for CURSOR_KO_MS while the real one is hidden,
 * then it pieces itself back together wherever the pointer has got to. Taunts are said here too.
 */
export function CursorAmbushLayer() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [taunts, setTaunts] = useState<Taunt[]>([]);
  const [ko, setKo] = useState<Knockout | null>(null);
  const afflicted = useRef<HTMLSpanElement>(null);
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
        const dx = detail.target.x - detail.origin.x;
        const dy = detail.target.y - detail.origin.y;
        const length = Math.hypot(dx, dy);
        const dir = length > 0 ? { x: dx / length, y: dy / length } : { x: 1, y: 0 };
        setShots(current => current.filter(shot => shot.id !== id));
        setImpacts(current => [...current, { id, at: detail.target, move: detail.move, hit }]);
        later(() => setImpacts(current => current.filter(impact => impact.id !== id)), IMPACT_MS);
        setAnnouncement(`${detail.attacker} used ${detail.moveName}! ${hit ? `It's super effective. Your cursor ${STATUS_TEXT[MOVE_STATUS[detail.move]]}` : "It missed!"}`);
        if (!hit) return;
        // A second hit while knocked out just restarts the count.
        root.dataset.cursorKo = "";
        setKo({ id, status: MOVE_STATUS[detail.move], tint: MOVE_TINT[detail.move], dir, hit: detail.target });
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

  // Steer the afflicted cursor every frame: pinned, stuck to the pointer, trailing it, or mirrored.
  useEffect(() => {
    if (!ko) return;
    let at = ko.hit;
    let frame = requestAnimationFrame(function step() {
      at = afflictedStep(ko.status, at, ko.hit, pointer.current, { width: innerWidth, height: innerHeight });
      if (afflicted.current) afflicted.current.style.translate = `${at.x}px ${at.y}px`;
      frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [ko]);

  const start = pointer.current;
  return (
    <>
      <span className="sr-only" role="status">{announcement}</span>
      {(taunts.length > 0 || shots.length > 0 || impacts.length > 0 || ko !== null) && createPortal(
        <div className="cursor-ambush-layer" style={{ "--ko-ms": `${CURSOR_KO_MS}ms` } as CSSProperties} aria-hidden="true">
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
              <span className="cursor-impact-text">{impact.hit ? <><b>It&rsquo;s super effective!</b>Your cursor {STATUS_TEXT[MOVE_STATUS[impact.move]]}</> : "It missed!"}</span>
            </span>
          ))}
          {ko !== null && (
            <span key={`afflicted-${ko.id}`} ref={afflicted} className="cursor-afflicted" style={{ translate: `${ko.hit.x}px ${ko.hit.y}px` }}>
              <CursorStatusEffect status={ko.status} tint={ko.tint} dir={ko.dir} />
            </span>
          )}
          {ko !== null && (
            <span key={ko.id} ref={reform} className="cursor-reform" style={{ translate: start ? `${start.x}px ${start.y}px` : undefined, "--tint": ko.tint } as CSSProperties}>
              <CursorShards className="cursor-reform-shards" />
            </span>
          )}
        </div>,
        document.body,
      )}
    </>
  );
}
