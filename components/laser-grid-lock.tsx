"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, RotateCcw, Undo2, Orbit, MoveHorizontal } from "lucide-react";
import { createLevel, shiftTiles, traceLaser, pointAlongPath, type Shift, type Tile } from "@/lib/laser-grid";

const indices = [0, 1, 2, 3, 4];
const names = ["First contact", "A bend in space", "Orbital drift", "Mirror dimension", "Deep space"];

export default function LaserGridLock() {
  const [level, setLevel] = useState(1);
  const [board, setBoard] = useState<Tile[]>(() => createLevel(1).board);
  const [history, setHistory] = useState<Tile[][]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [travel, setTravel] = useState(0);
  const startTime = useRef(0);
  const locked = useRef(false);
  const beam = useMemo(() => traceLaser(board), [board]);

  useEffect(() => {
    if (!started || beam.won) return;
    const tick = () => setSeconds(Math.floor((Date.now() - startTime.current) / 1000));
    const timer = window.setInterval(tick, 250);
    return () => window.clearInterval(timer);
  }, [started, beam.won]);

  useEffect(() => {
    if (!beam.won) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 150 : 2600;
    const start = performance.now();
    let frame: number;
    const animate = (now: number) => {
      const elapsed = now - start;
      setTravel(reduced ? (elapsed >= 450 ? 1 : 0) : Math.min(1, Math.max(0, (elapsed - 450) / duration)));
      if (elapsed < duration + 1400) frame = requestAnimationFrame(animate);
      else {
        const next = level + 1;
        setLevel(next); setBoard(createLevel(next).board); setHistory([]);
        setMoves(0); setSeconds(0); setStarted(false); setTravel(0); locked.current = false;
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [beam.won, level]);

  function shift(move: Shift) {
    if (locked.current) return;
    if (!started) { startTime.current = Date.now(); setStarted(true); }
    const next = shiftTiles(board, move);
    locked.current = traceLaser(next).won;
    setHistory([...history, board]); setBoard(next); setMoves(moves + 1);
  }

  function reset() {
    locked.current = false;
    setBoard(createLevel(level).board); setHistory([]); setMoves(0);
    setSeconds(0); setStarted(false); setTravel(0);
  }

  const position = pointAlongPath(beam.points, travel);
  const path = beam.points.map((p, i) => `${i ? "L" : "M"} ${p.x * 100} ${p.y * 100}`).join(" ");
  const time = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  const control = (axis: Shift["axis"], index: number, direction: Shift["direction"]) => {
    const Icon = axis === "row" ? (direction === 1 ? ArrowRight : ArrowLeft) : (direction === 1 ? ArrowDown : ArrowUp);
    const label = axis === "row" ? (direction === 1 ? "right" : "left") : (direction === 1 ? "down" : "up");
    return <button key={index} className="laser-shift" aria-label={`Shift ${axis} ${index + 1} ${label}`} disabled={beam.won} onClick={() => shift({ axis, index, direction })}><Icon size={18} aria-hidden="true" /></button>;
  };

  return <div className="laser-page">
    <a className="skip-link" href="#laser-main">Skip to game</a>
    <header className="laser-topbar"><Link href="/play/"><ArrowLeft size={16} /> Playground</Link><span><Orbit size={18} /> MON / ARCADE</span><span className="laser-solo">Solo puzzle</span></header>
    <main id="laser-main" className="laser-main">
      <div className="laser-heading"><h1>Laser Grid <span>Lock.</span></h1><p>Bend the light. Find a way home.</p></div>
      <div className="laser-layout">
        <aside className="laser-brief">
          <div className="laser-pilot"><img src="/images/laser/deoxys.png" alt="Chibi Deoxys" width="144" height="144" /><span className="laser-pilot-orbit" /></div>
          <h2>A little lost.<br />Light the way.</h2>
          <p>Deoxys needs a route through the void. Shift the mirrors to connect its laser to the black hole.</p>
          <div className="laser-instructions"><h3>Flight manual</h3><ol><li>Use the outside arrows to shift a whole row or column.</li><li>Tiles wrap around. Mirrors turn the beam by 90°.</li><li>Reach the black hole. Deoxys follows the light to the next sector.</li></ol></div>
          <p className="laser-fixed"><Orbit size={17} /> Deoxys and the black hole stay fixed.</p>
        </aside>
        <section className={`laser-console${beam.won ? " is-solved" : ""}`} aria-label="Laser puzzle">
          <div className="laser-hud"><div><span>Level</span><strong>{String(level).padStart(2, "0")}</strong></div><div><span>Moves</span><strong>{String(moves).padStart(2, "0")}</strong></div><div><span>Time</span><strong>{time}</strong></div><button onClick={reset} aria-label="Reset current level"><RotateCcw size={16} /><span>Reset</span></button></div>
          <div className="laser-sector"><span>{names[Math.min(level - 1, names.length - 1)]}</span><span>5 × 5</span></div>
          <div className="laser-board-frame">
            <div className="laser-controls laser-controls-top">{indices.map(i => control("column", i, -1))}</div>
            <div className="laser-controls laser-controls-left">{indices.map(i => control("row", i, -1))}</div>
            <div className="laser-board" role="img" aria-label={`5 by 5 board. Deoxys at row 1 column 1, black hole at row 5 column 5. ${board.map((tile, i) => tile ? `${tile === "/" ? "Forward" : "Back"} slash mirror at row ${Math.floor(i / 5) + 1} column ${i % 5 + 1}` : "").filter(Boolean).join(". ")}`}>
              {board.map((tile, i) => <div key={i} className={`laser-tile${i === 0 ? " laser-origin" : ""}${i === 24 ? " laser-target" : ""}`}><span className="laser-tile-coordinate">{String(i + 1).padStart(2, "0")}</span>{tile && <span className={`laser-mirror ${tile === "/" ? "mirror-forward" : "mirror-back"}${i === 0 || i === 24 ? " mirror-covered" : ""}`} />}</div>)}
              <svg className="laser-beam" viewBox="0 0 500 500" aria-hidden="true"><path className="laser-beam-glow" d={path} /><path className="laser-beam-core" d={path} /></svg>
              <div className="laser-black-hole" aria-hidden="true"><div /><span /></div>
              <img className={`laser-deoxys${travel >= 1 ? " is-entering" : ""}`} src="/images/laser/deoxys.png" alt="" style={{ left: `${position.x * 20}%`, top: `${position.y * 20}%` }} width="96" height="96" />
            </div>
            <div className="laser-controls laser-controls-right">{indices.map(i => control("row", i, 1))}</div>
            <div className="laser-controls laser-controls-bottom">{indices.map(i => control("column", i, 1))}</div>
          </div>
          <div className="laser-status" role="status"><span className="laser-status-dot" /><span>{beam.won ? (travel >= 1 ? "Portal entered. Next sector incoming…" : "Path connected! Deoxys is heading home…") : beam.loop ? "Beam looping. Shift a mirror to break the cycle." : level === 1 && moves === 0 ? "First flight: shift the top row right to connect." : "Find a path to the black hole."}</span></div>
          <div className="laser-console-footer"><span><i /> Laser <b>/</b> Mirror <span className="laser-legend-hole" /> Black hole</span><button disabled={!history.length || beam.won} onClick={() => { setBoard(history[history.length - 1]); setHistory(history.slice(0, -1)); setMoves(moves + 1); }}><Undo2 size={15} /> Undo</button></div>
        </section>
        <div className="laser-mobile-tip"><MoveHorizontal size={16} /><span>Tap an outside arrow to wrap a row or column. Mirrors bend the laser toward the black hole. Deoxys and the black hole stay fixed.</span></div>
      </div>
    </main>
    <footer className="laser-footer"><span>A small escape by Mon.</span><span>Pokémon fan game · Sprite via <a href="https://github.com/PokeAPI/sprites">PokéAPI</a> · Pokémon © Nintendo / Creatures / GAME FREAK</span></footer>
  </div>;
}
