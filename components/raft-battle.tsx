"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Bot, Check, Crosshair, Flag, Gamepad2, RotateCcw, Settings2, Sparkles, Trophy, Users, Waves, Wind } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import RaftArena from "@/components/raft-arena";
import { applyShot, chooseAiShot, createBattle, simulateShot, type BattleState, type Difficulty, type Point, type ShotInput, type ShotKind, type ShotResult, type Side } from "@/lib/raft-battle";

const crew = [
  { id: "pikachu", name: "Pikachu", type: "Electric", move: "Electro Ball", color: "#f4d278" },
  { id: "gengar", name: "Gengar", type: "Ghost", move: "Shadow Ball", color: "#bf9cf7" },
  { id: "charizard", name: "Charizard", type: "Fire", move: "Flame Burst", color: "#ffb482" },
  { id: "mew", name: "Mew", type: "Psychic", move: "Aura Sphere", color: "#f2accf" },
] as const;
type Mode = "ai" | "local";
type Phase = "setup" | "aiming" | "flying" | "thinking" | "handoff" | "finished";
type Flight = { shot: ShotResult; startedAt: number; duration: number; next: BattleState; shooter: Side };
const defaultAim: ShotInput = { angle: 45, power: 75, kind: "normal" };

export default function RaftBattle() {
  const [mode, setMode] = useState<Mode>("ai");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [selected, setSelected] = useState<[number, number]>([0, 1]);
  const [battle, setBattle] = useState<BattleState>(() => createBattle(() => 0.5));
  const [phase, setPhase] = useState<Phase>("setup");
  const [aims, setAims] = useState<[ShotInput, ShotInput]>([{ ...defaultAim }, { ...defaultAim }]);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [impact, setImpact] = useState<{ point: Point; damage: number; color: string } | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState("Choose your crew to start a battle.");
  const [confirmReset, setConfirmReset] = useState(false);
  const actionLock = useRef(false);
  const angleInput = useRef<HTMLInputElement>(null);
  const readyButton = useRef<HTMLButtonElement>(null);
  const rematchButton = useRef<HTMLButtonElement>(null);
  const sceneElement = useRef<HTMLDivElement>(null);
  const players = [crew[selected[0]], crew[selected[1]]];
  const aim = aims[battle.turn];
  const isSetup = phase === "setup";
  const canAim = phase === "aiming";
  const winner = battle.winner;
  const label = useCallback((side: Side) => side === 0 ? (mode === "ai" ? "You" : "Player 1") : (mode === "ai" ? `${difficulty === "easy" ? "Easy" : "Hard"} AI` : "Player 2"), [difficulty, mode]);
  const preview = useMemo(() => simulateShot(battle.turn, aim, battle.wind).points, [battle.turn, battle.wind, aim]);

  function updateAim(change: Partial<ShotInput>) {
    if (!canAim || actionLock.current) return;
    setAims(previous => previous.map((value, index) => index === battle.turn ? { ...value, ...change } : value) as [ShotInput, ShotInput]);
  }

  function startBattle() {
    actionLock.current = false;
    setBattle(createBattle());
    setAims([{ ...defaultAim }, { ...defaultAim }]);
    setFlight(null);
    setImpact(null);
    setHistory([]);
    setPhase("aiming");
    setAnnouncement(`${label(0)} go first. Set your angle and power, then fire.`);
  }

  const fire = useCallback((input: ShotInput) => {
    if (actionLock.current || battle.winner !== null) return;
    actionLock.current = true;
    const result = applyShot(battle, input);
    setImpact(null);
    setFlight({ shot: result.shot, next: result.state, shooter: battle.turn, startedAt: performance.now(), duration: Math.min(2100, Math.max(900, result.shot.points.length * 9)) });
    setPhase("flying");
    setAnnouncement(`${label(battle.turn)} fired ${input.kind === "special" ? "a special shot" : "an Energy Orb"}.`);
    const bounds = sceneElement.current?.getBoundingClientRect();
    if (bounds && (bounds.top < 0 || bounds.bottom > window.innerHeight)) {
      sceneElement.current?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  }, [battle, label]);

  useEffect(() => {
    if (phase !== "thinking") return;
    const timer = window.setTimeout(() => {
      const suggested = chooseAiShot(battle, difficulty);
      const choice = { ...suggested, angle: Math.round(suggested.angle), power: Math.round(suggested.power) };
      setAims(previous => [previous[0], choice]);
      fire(choice);
    }, 1150);
    return () => window.clearTimeout(timer);
  }, [phase, battle, difficulty, fire]);

  useEffect(() => {
    if (!flight) return;
    const timer = window.setTimeout(() => {
      const { shot, next, shooter } = flight;
      const result = shot.damage > 0
        ? shot.hit === shooter
          ? `Backfire! ${label(shooter)} took ${shot.damage} damage from their own shot.`
          : `${shot.direct ? "Direct hit" : "Splash hit"}! ${label(shooter)} dealt ${shot.damage} damage to ${label(shot.hit!)}.`
        : `${label(shooter)} missed. Try adjusting the angle or power.`;
      setBattle(next);
      setFlight(null);
      setImpact({ point: shot.impact, damage: shot.damage, color: shot.damage > 0 ? "#f4d278" : "#a6dcf1" });
      setHistory(previous => [result, ...previous].slice(0, 3));
      setAims(previous => previous.map((value, index) => next.specials[index] === 0 ? { ...value, kind: "normal" as ShotKind } : value) as [ShotInput, ShotInput]);
      actionLock.current = false;
      if (next.winner !== null) {
        setPhase("finished");
        setAnnouncement(`${result} ${label(next.winner)} won the battle!`);
      } else if (mode === "local") {
        setPhase("handoff");
        setAnnouncement(`${result} Pass the controls to ${label(next.turn)}.`);
      } else {
        setPhase(next.turn === 1 ? "thinking" : "aiming");
        setAnnouncement(`${result} ${next.turn === 1 ? "The AI is lining up a shot." : "Your turn."}`);
      }
    }, Math.max(0, flight.duration - (performance.now() - flight.startedAt)) + 200);
    return () => window.clearTimeout(timer);
  }, [flight, label, mode]);

  useEffect(() => {
    if (!impact) return;
    const timer = window.setTimeout(() => setImpact(null), 1600);
    return () => window.clearTimeout(timer);
  }, [impact]);

  useEffect(() => {
    if (phase === "aiming") angleInput.current?.focus({ preventScroll: true });
    if (phase === "handoff") readyButton.current?.focus({ preventScroll: true });
    if (phase === "finished") rematchButton.current?.focus({ preventScroll: true });
  }, [phase]);

  const status = isSetup ? "The water’s calm. For now." : phase === "finished" ? `${label(winner!)} won the battle!` : phase === "thinking" ? "Your rival is lining up a shot…" : phase === "flying" ? "Here comes the splash…" : phase === "handoff" ? `Pass the controls to ${label(battle.turn)}` : `${label(battle.turn)}${mode === "ai" && battle.turn === 0 ? "r" : "’s"} turn. Make it count.`;

  return (
    <div className="raft-page">
      <a className="skip-link" href="#raft-main">Skip to game</a>
      <header className="raft-topbar">
        <a href="/" className="wordmark" aria-label="Mon home"><strong>mon<span>.</span></strong><span className="raft-wordmark-label">Playground</span></a>
        <nav aria-label="Playground navigation"><a href="/play/"><Gamepad2 size={16} /> Tile puzzle</a><a href="/#craft-hobbies"><ArrowLeft size={16} /><span>Portfolio</span></a></nav>
      </header>
      <main id="raft-main" className="raft-main">
        <div className="raft-intro"><div><h1>Poké <span>Raft.</span></h1><p>A friendly rivalry. A perfectly aimed shot. A very big splash.</p></div><span className="raft-mode-note"><Users size={16} /> One device. One worthy rival.</span></div>
        <div className="raft-layout">
          <section className="raft-game" aria-label="Battle arena">
            <div className="raft-scoreboard">
              {([0, 1] as const).map(side => <div className={`raft-player raft-player-${side} ${battle.turn === side && !isSetup && winner === null ? "is-active" : ""}`} key={side}>
                <img src={`/images/puzzle/${players[side].id}.png`} alt="" width={52} height={52} />
                <div className="raft-player-info"><div className="raft-player-name"><strong>{players[side].name}</strong><span>{label(side)}</span></div><div className="raft-health" role="progressbar" aria-label={`${label(side)} health`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={battle.health[side]}><span style={{ width: `${battle.health[side]}%` }} /></div><span className="raft-health-value">{battle.health[side]} <span>/ 100 HP</span></span></div>
              </div>)}
              <span className="raft-versus" aria-hidden="true">vs</span>
            </div>
            <div className="raft-scene" ref={sceneElement}>
              <div className="raft-weather"><span><Waves size={14} /> Moonlit lagoon</span><span aria-label={battle.wind === 0 ? "No wind" : `Wind strength ${Math.abs(battle.wind)}, blowing ${battle.wind < 0 ? "left" : "right"}`}><Wind size={15} /> {battle.wind === 0 ? "No wind" : <>{battle.wind < 0 ? <ArrowLeft size={14} /> : <ArrowRight size={14} />} {Math.abs(battle.wind)} <span className="raft-wind-unit">wind</span></>}</span></div>
              <RaftArena pokemon={[players[0].id, players[1].id]} health={battle.health} turn={battle.turn} preview={canAim ? preview : []} flight={flight} impact={impact} active={!isSetup && phase !== "finished"} />
              {(phase === "handoff" || phase === "finished") && <div className="raft-scene-message">
                {phase === "finished" ? <><Trophy size={25} /><strong>{label(winner!)} take{mode === "ai" && winner === 0 ? "" : "s"} the lagoon!</strong><span>{players[winner!].name} is the last Pokémon afloat.</span><button className="raft-primary" ref={rematchButton} onClick={startBattle}><RotateCcw size={16} /> Play again</button></> : <><Flag size={22} /><strong>{label(battle.turn)}, you’re up.</strong><span>Pass the device, then line up your shot.</span><button className="raft-primary" ref={readyButton} onClick={() => { setPhase("aiming"); setAnnouncement(`${label(battle.turn)} is ready. Set your shot.`); }}>I’m ready <ArrowRight size={16} /></button></>}
              </div>}
            </div>
            <div className="raft-status"><span className={`raft-status-dot ${phase === "thinking" || phase === "flying" ? "is-busy" : ""}`} /><strong>{status}</strong><span className="raft-round">Round {battle.round}</span></div>
            <div className="raft-below-arena"><p><Crosshair size={17} /><span>{isSetup ? "Choose your crew, then send your first shot across the lagoon." : "The dots show your launch direction. Wind bends your shot along the way."}</span></p>{!isSetup && <button className="raft-text-button" onClick={() => setConfirmReset(true)} disabled={phase === "flying" || phase === "thinking"}><Settings2 size={15} /> New match</button>}</div>
            <div className="raft-log" aria-label="Recent shots"><h2>Battle notes</h2>{history.length ? <ol>{history.map((entry, index) => <li key={`${index}-${entry}`} className={index === 0 ? "is-latest" : ""}>{entry}</li>)}</ol> : <p>Every great battle starts with a little guesswork.</p>}</div>
          </section>
          <aside className="raft-sidebar" aria-label={isSetup ? "Match setup" : "Shot controls"}>
            {isSetup ? <>
              <div className="raft-panel-heading"><h2>Set sail.</h2><p>Pick a rival. Bring your favorite Pokémon.</p></div>
              <fieldset className="raft-fieldset"><legend>Who’s on the other raft?</legend><div className="raft-segmented"><button aria-pressed={mode === "ai"} onClick={() => setMode("ai")}><Bot size={17} /> Play AI</button><button aria-pressed={mode === "local"} onClick={() => setMode("local")}><Users size={17} /> 2 players</button></div></fieldset>
              {mode === "ai" ? <fieldset className="raft-fieldset"><legend>AI difficulty</legend><div className="raft-segmented"><button aria-pressed={difficulty === "easy"} onClick={() => setDifficulty("easy")}>Easy</button><button aria-pressed={difficulty === "hard"} onClick={() => setDifficulty("hard")}>Hard</button></div><p className="raft-field-hint">{difficulty === "easy" ? "A relaxed rival with a little room for error." : "A sharp rival that calculates the wind."}</p></fieldset> : <p className="raft-local-hint">Take turns on this device. Each player gets their own aim and power settings.</p>}
              {([0, 1] as const).map(side => <fieldset className="raft-fieldset raft-crew-field" key={side}><legend>{side === 0 ? "Your Pokémon" : mode === "local" ? "Player 2’s Pokémon" : "Rival’s Pokémon"}{mode === "local" && side === 0 && <span>Player 1</span>}</legend><div className="raft-crew-picker">{crew.map((pokemon, index) => <button key={pokemon.id} aria-pressed={selected[side] === index} aria-label={`${label(side)}: choose ${pokemon.name}`} style={{ "--crew-color": pokemon.color } as CSSProperties} onClick={() => setSelected(previous => side === 0 ? [index, previous[1]] : [previous[0], index])}><img src={`/images/puzzle/${pokemon.id}.png`} width={60} height={60} alt="" /><span>{pokemon.name}</span>{selected[side] === index && <Check className="raft-crew-check" size={12} />}</button>)}</div></fieldset>)}
              <button className="raft-primary raft-start" onClick={startBattle}>Start battle <ArrowRight size={18} /></button><p className="raft-fair-note">Every Pokémon has equal health and power.</p>
            </> : phase === "finished" ? <div className="raft-match-result"><Trophy size={36} /><h2>Good game.</h2><p>{mode === "ai" && winner === 1 ? "The lagoon has a new champion. Adjust your aim and give it another go." : "A little aim, a little strategy, and one last splash."}</p><dl><div><dt>Winner</dt><dd>{players[winner!].name}</dd></div><div><dt>Rounds</dt><dd>{battle.round}</dd></div></dl><button className="raft-primary" onClick={startBattle}><RotateCcw size={16} /> Rematch</button><button className="raft-text-button" onClick={() => { setPhase("setup"); setBattle(createBattle(() => 0.5)); setHistory([]); setAnnouncement("Choose settings for a new battle."); }}>Choose a new crew <ArrowRight size={15} /></button></div> : <>
              <div className="raft-panel-heading"><span className="raft-turn-label">{label(battle.turn)} · {players[battle.turn].name}</span><h2>{phase === "thinking" ? "Thinking…" : phase === "flying" ? "Shot away." : phase === "handoff" ? "Switch sides." : "Make a splash."}</h2><p>{canAim ? "Find your angle. Put some power behind it." : phase === "handoff" ? "Tap “I’m ready” in the arena to take your turn." : "Watch the arc. Plan your next move."}</p></div>
              <fieldset className="raft-fieldset" disabled={!canAim}><legend>Choose your shot</legend><div className="raft-shots"><button className={aim.kind === "normal" ? "is-selected" : ""} aria-pressed={aim.kind === "normal"} onClick={() => updateAim({ kind: "normal" })}><Crosshair size={19} /><span><strong>Energy Orb</strong><small>28 direct damage · Unlimited</small></span></button><button className={aim.kind === "special" ? "is-selected" : ""} aria-pressed={aim.kind === "special"} disabled={battle.specials[battle.turn] === 0} onClick={() => updateAim({ kind: "special" })}><Sparkles size={19} /><span><strong>{players[battle.turn].move}</strong><small>42 direct damage · {battle.specials[battle.turn]} left</small></span></button></div></fieldset>
              <div className="raft-slider-group"><label htmlFor="raft-angle">Angle <output htmlFor="raft-angle">{aim.angle}°</output></label><input ref={angleInput} id="raft-angle" type="range" min={10} max={80} step={1} value={aim.angle} disabled={!canAim} onChange={event => updateAim({ angle: Number(event.target.value) })} /><div className="raft-range-ends"><span>Low & direct</span><span>High arc</span></div></div>
              <div className="raft-slider-group"><label htmlFor="raft-power">Power <output htmlFor="raft-power">{aim.power}%</output></label><input id="raft-power" type="range" min={20} max={100} step={1} value={aim.power} disabled={!canAim} onChange={event => updateAim({ power: Number(event.target.value) })} /><div className="raft-range-ends"><span>A gentle toss</span><span>Full send</span></div></div>
              <button className="raft-primary raft-fire" disabled={!canAim} onClick={() => { if (canAim) fire(aim); }}><Crosshair size={19} /> {phase === "thinking" ? "AI is aiming…" : phase === "flying" ? "Shot in flight…" : phase === "handoff" ? "Waiting for player…" : `Fire ${aim.kind === "special" ? players[battle.turn].move : "Energy Orb"}`}</button><p className="raft-fair-note">Tip: start near 45°. More power sends it farther.</p>
            </>}
          </aside>
        </div>
        <details className="raft-howto"><summary>First time on a raft? Here’s how to play.</summary><div><p><strong>Aim, then fire.</strong> Adjust the angle and power to land a shot on the other raft. Higher angles arc upward; more power adds distance. Both players aim toward their rival.</p><p><strong>Watch the wind.</strong> The arrow shows which way the wind pushes. It changes after both players have fired. A shot that lands nearby can still deal splash damage.</p><p><strong>Make your specials count.</strong> You get three stronger shots per match. Reduce the rival’s 100 HP to zero to win. All four Pokémon play with equal stats.</p><p><strong>Share the controls.</strong> In two-player mode, pass the device after every shot. Use touch or a mouse, or Tab between controls and use the arrow keys on the sliders.</p></div></details>
      </main>
      <footer className="raft-footer"><span>A little side quest by Mon.</span><span>Fan-made game. Artwork via <a href="https://github.com/PokeAPI/sprites" target="_blank" rel="noreferrer">PokéAPI</a>. Pokémon © Nintendo / Creatures / GAME FREAK.</span></footer>
      <div className="raft-sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}><AlertDialogContent className="raft-confirm"><AlertDialogHeader><AlertDialogTitle>Start a new match?</AlertDialogTitle><AlertDialogDescription>This battle will end. You can choose a new crew, opponent, or difficulty.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep playing</AlertDialogCancel><AlertDialogAction onClick={() => { actionLock.current = false; setPhase("setup"); setFlight(null); setImpact(null); setHistory([]); setBattle(createBattle(() => 0.5)); setAnnouncement("Choose settings for a new battle."); }}>New match</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}
