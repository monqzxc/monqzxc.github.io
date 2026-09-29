"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, RotateCcw, Undo2, Orbit, Shield, Split, CircleOff, LockKeyhole, Gem } from "lucide-react";
import { pointAlongPath, type Point, type Shift } from "@/lib/laser-grid";
import { advanceCampaign, createCampaignLevel, initialState, monsterAt, monsterFacing, targetAt, traceCampaign, TIERS, type CampaignState } from "@/lib/laser-campaign";

const indices = [0, 1, 2, 3, 4];
const facingNames = ["right", "down", "left", "up"];
const toPath = (points: Point[]) => points.map((p, i) => `${i ? "L" : "M"} ${p.x * 100} ${p.y * 100}`).join(" ");
const placement = (cell: number) => ({ left: `${(cell % 5 + .5) * 20}%`, top: `${(Math.floor(cell / 5) + .5) * 20}%` });
const coordinates = (cell: number) => `row ${Math.floor(cell / 5) + 1}, column ${cell % 5 + 1}`;
const routePath = (route: number[]) => toPath(route.map(cell => ({ x: cell % 5 + .5, y: Math.floor(cell / 5) + .5 })));

export default function LaserGridLock() {
  const [campaign, setCampaign] = useState(() => createCampaignLevel(1));
  const [state, setState] = useState(() => initialState(campaign));
  const [history, setHistory] = useState<CampaignState[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [travel, setTravel] = useState(0);
  const startTime = useRef(0);
  const locked = useRef(false);
  const beam = useMemo(() => traceCampaign(campaign, state), [campaign, state]);
  const portal = campaign.targets.find(target => target.kind === "PORTAL")!;
  const portalCell = targetAt(portal, state.turn);

  const loadLevel = useCallback((number: number) => {
    const next = createCampaignLevel(number);
    setCampaign(next); setState(initialState(next)); setHistory([]); setMoves(0);
    setSeconds(0); setStarted(false); setTravel(0); locked.current = false;
  }, []);

  useEffect(() => {
    if (!started || beam.won) return;
    const timer = window.setInterval(() => setSeconds(Math.floor((Date.now() - startTime.current) / 1000)), 250);
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
      else loadLevel(campaign.number + 1);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [beam.won, campaign.number, loadLevel]);

  function shift(move: Shift) {
    if (locked.current) return;
    if (!started) { startTime.current = Date.now(); setStarted(true); }
    const next = advanceCampaign(campaign, state, move);
    locked.current = traceCampaign(campaign, next).won;
    setHistory([...history, state]); setState(next); setMoves(moves + 1);
  }

  function undo() {
    if (!history.length || locked.current) return;
    setState(history[history.length - 1]); setHistory(history.slice(0, -1)); setMoves(moves + 1);
  }

  const position = pointAlongPath(beam.points, travel);
  const time = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  const control = (axis: Shift["axis"], index: number, direction: Shift["direction"]) => {
    const Icon = axis === "row" ? (direction === 1 ? ArrowRight : ArrowLeft) : (direction === 1 ? ArrowDown : ArrowUp);
    const label = axis === "row" ? (direction === 1 ? "right" : "left") : (direction === 1 ? "down" : "up");
    return <button key={index} className="laser-shift" aria-label={`Shift ${axis} ${index + 1} ${label}`} disabled={beam.won} onClick={() => shift({ axis, index, direction })}><Icon size={18} aria-hidden="true" /></button>;
  };
  const boardDescription = [
    `5 by 5 board. Deoxys at row 1, column 1. Portal at ${coordinates(portalCell)}. Turn ${state.turn}.`,
    ...state.board.flatMap((tile, cell) => tile ? [`${tile === "/" ? "Forward" : "Back"} slash mirror at ${coordinates(cell)}.`] : []),
    ...campaign.immovable.map(cell => `Immovable steel block at ${coordinates(cell)}.`),
    ...campaign.monsters.map(monster => `${monster.kind.replaceAll("_", " ")} at ${coordinates(monsterAt(monster, state.turn))}${monster.kind === "DEFLECTOR" ? `, sends beam ${facingNames[monsterFacing(monster, state.turn)]}` : monster.kind === "BEAM_EATER" ? `, charge ${state.charges[monster.id] ?? 0} of 4` : ""}.`),
    ...campaign.nodes.map((cell, i) => `Sequence node ${i + 1} at ${coordinates(cell)}.`),
    ...campaign.targets.filter(target => target.kind !== "PORTAL").map(target => `${target.color ?? "Any color"} prism core at ${coordinates(targetAt(target, state.turn))}.`),
  ].join(" ");
  const status = beam.won ? (travel >= 1 ? "Portal entered. Next sector incoming…" : "Circuit complete! Deoxys is heading home…")
    : state.emp ? "EMP! Row shifts reset; column shifts kept. Patrols continue. Undo restores the previous turn."
    : campaign.number === 1 && moves === 0 ? "First flight: shift the top row right to connect."
    : beam.eaters.length ? `Beam Eater charging: ${Math.max(...Object.values(state.charges), 0)}/4. Redirect the beam before EMP.`
    : beam.loop ? "Beam looping. Shift a mirror to break the cycle."
    : "Shift, watch the patrols, and complete the circuit.";

  return <div className="laser-page">
    <a className="skip-link" href="#laser-main">Skip to game</a>
    <header className="laser-topbar"><Link href="/play/"><ArrowLeft size={16} /> Playground</Link><span><Orbit size={18} /> MON / ARCADE</span><span className="laser-solo">Solo puzzle</span></header>
    <main id="laser-main" className="laser-main">
      <div className="laser-heading"><h1>Laser Grid <span>Lock.</span></h1><p>Bend the light. Outwit the void.</p></div>
      <div className="laser-layout">
        <aside className="laser-brief">
          <div className="laser-pilot"><img src="/images/laser/deoxys.png" alt="Chibi Deoxys" width="144" height="144" /><span className="laser-pilot-orbit" /></div>
          <h2>A little lost.<br />Light the way.</h2>
          <p>Five tiers of increasingly hostile space. Connect the circuit, then watch Deoxys ride the light into the black hole.</p>
          <div className="laser-instructions"><h3>Flight manual</h3><ol><li>Outside arrows shift a row or column. Free tiles wrap around anchored steel.</li><li>Mirrors bend light by 90°. Monsters act after every shift.</li><li>Complete every target in the same turn to open the portal.</li></ol></div>
          <p className="laser-fixed"><Orbit size={17} /> Undo restores the entire previous turn.</p>
        </aside>
        <section className={`laser-console${beam.won ? " is-solved" : ""}`} aria-label="Laser puzzle">
          <div className="laser-hud"><div><span>Level</span><strong>{String(campaign.number).padStart(2, "0")}</strong></div><div><span>Moves</span><strong>{String(moves).padStart(2, "0")}</strong></div><div><span>Time</span><strong>{time}</strong></div><button onClick={() => loadLevel(campaign.number)} aria-label="Reset current level"><RotateCcw size={16} /><span>Reset</span></button></div>
          <div className="laser-tier-picker"><label htmlFor="laser-tier">Difficulty</label><select id="laser-tier" value={campaign.tier} disabled={beam.won} onChange={event => loadLevel((Number(event.target.value) - 1) * 3 + 1)}>{TIERS.map((name, i) => <option key={name} value={i + 1}>Tier {i + 1} · {name}</option>)}</select></div>
          <div className="laser-sector"><span>{campaign.name}</span><span>Turn {state.turn} · 5 × 5</span></div>
          <p className="laser-mission">{campaign.briefing}</p>
          <div className="laser-objectives" aria-label="Circuit requirements">
            {campaign.targets.map(target => { const hit = beam.targets.find(item => item.id === target.id)!; return <span key={target.id} className={hit.active ? "is-active" : ""}><Gem size={13} aria-hidden="true" />{target.kind === "PORTAL" ? "Portal" : "Amber core"}: {Math.min(hit.angles, target.angles)}/{target.angles}{target.colors > 1 ? ` angles · ${Math.min(hit.colors, target.colors)}/${target.colors} colors` : " lit"}</span>; })}
            {campaign.nodes.length > 0 && <span className={beam.sequenceReached === campaign.nodes.length ? "is-active" : ""}>Sequence: {beam.sequenceReached}/{campaign.nodes.length}</span>}
            {portal.route.length > 1 && <span><Orbit size={13} />Rail moves in {portal.every - state.turn % portal.every} shift{portal.every - state.turn % portal.every === 1 ? "" : "s"}</span>}
          </div>
          <div className="laser-board-frame">
            <div className="laser-controls laser-controls-top">{indices.map(i => control("column", i, -1))}</div>
            <div className="laser-controls laser-controls-left">{indices.map(i => control("row", i, -1))}</div>
            <div className="laser-board" role="img" aria-label={boardDescription}>
              {state.board.map((tile, cell) => {
                const covered = cell === 0 || campaign.immovable.includes(cell) || campaign.monsters.some(monster => monsterAt(monster, state.turn) === cell) || campaign.targets.some(target => targetAt(target, state.turn) === cell);
                return <div key={cell} className={`laser-tile${cell === 0 ? " laser-origin" : ""}${cell === portalCell ? " laser-target" : ""}`}><span className="laser-tile-coordinate">{String(cell + 1).padStart(2, "0")}</span>{tile && <span className={`laser-mirror ${tile === "/" ? "mirror-forward" : "mirror-back"}${covered ? " mirror-covered" : ""}`} />}{campaign.immovable.includes(cell) && <span className="laser-steel"><LockKeyhole aria-hidden="true" /></span>}{campaign.nodes.includes(cell) && <span className="laser-sequence-node">{campaign.nodes.indexOf(cell) + 1}</span>}</div>;
              })}
              <svg className="laser-beam" viewBox="0 0 500 500" aria-hidden="true">
                {campaign.targets.filter(target => target.route.length > 1).map(target => <path key={target.id} className="laser-rail" d={routePath(target.route)} />)}
                {campaign.monsters.filter(monster => monster.route.length > 1).map(monster => <path key={monster.id} className="laser-patrol" d={routePath(monster.route)} />)}
                {beam.paths.map((path, i) => <g key={i} className={`beam-${path.color}`}><path className="laser-beam-glow" d={toPath(path.points)} /><path className="laser-beam-core" d={toPath(path.points)} /></g>)}
              </svg>
              {campaign.monsters.map(monster => <div key={monster.id} className={`laser-entity laser-entity-${monster.kind.toLowerCase()}`} style={placement(monsterAt(monster, state.turn))} aria-hidden="true">
                {monster.kind === "DEFLECTOR" ? <><Shield /><ArrowRight className="laser-deflector-arrow" style={{ transform: `rotate(${monsterFacing(monster, state.turn) * 90}deg)` }} /></> : monster.kind === "SPLIT_JAW" ? <Split /> : <><CircleOff /><small>{state.charges[monster.id] ?? 0}/4</small></>}
              </div>)}
              {campaign.targets.filter(target => target.kind !== "PORTAL").map(target => <div key={target.id} className={`laser-prism${beam.targets.find(hit => hit.id === target.id)?.active ? " is-active" : ""}`} style={placement(targetAt(target, state.turn))} aria-hidden="true"><Gem /></div>)}
              <div className="laser-black-hole" style={placement(portalCell)} aria-hidden="true"><div /><span />{portal.angles > 1 && <b>{Math.min(beam.targets.find(hit => hit.id === portal.id)!.angles, portal.angles)}/{portal.angles}</b>}</div>
              <img className={`laser-deoxys${travel >= 1 ? " is-entering" : ""}`} src="/images/laser/deoxys.png" alt="" style={{ left: `${position.x * 20}%`, top: `${position.y * 20}%` }} width="96" height="96" />
            </div>
            <div className="laser-controls laser-controls-right">{indices.map(i => control("row", i, 1))}</div>
            <div className="laser-controls laser-controls-bottom">{indices.map(i => control("column", i, 1))}</div>
          </div>
          <div className={`laser-status${state.emp ? " has-emp" : ""}`} role="status"><span className="laser-status-dot" /><span>{status}</span></div>
          <details className="laser-field-guide"><summary>Board guide & turn rules</summary><ul>
            <li><LockKeyhole /> Steel blocks absorb light. Free tiles wrap around them.</li>
            <li><Shield /> Deflectors patrol one tile, then rotate their beam arrow clockwise.</li>
            <li><Split /> Split-Jaw sends cyan counterclockwise and amber clockwise, perpendicular to the incoming beam.</li>
            <li><CircleOff /> Eaters absorb light. Four consecutive shift hits trigger EMP. Missing one hit clears charge.</li>
            <li><Gem /> An amber core needs amber light. A prism portal needs both colors from different angles in the same turn.</li>
            <li><Orbit /> Numbered nodes must be visited in order on one branch, with a mirror between each. Rails move every two shifts.</li>
          </ul><p>Each shift moves tiles, advances patrols and rails, traces all beams, then charges Eaters. A completed circuit wins before EMP. Reset restarts the level; Undo restores the previous board and all entities. Moves counts both shifts and undo actions; Turn rewinds on undo.</p></details>
          <div className="laser-console-footer"><span><i /> Cyan <i className="laser-amber-line" /> Amber <span className="laser-legend-hole" /> Portal</span><button disabled={!history.length || beam.won} onClick={undo}><Undo2 size={15} /> Undo</button></div>
        </section>
      </div>
    </main>
    <footer className="laser-footer"><span>A small escape by Mon.</span><span>Pokémon fan game · Sprite via <a href="https://github.com/PokeAPI/sprites">PokéAPI</a> · Pokémon © Nintendo / Creatures / GAME FREAK</span></footer>
  </div>;
}
