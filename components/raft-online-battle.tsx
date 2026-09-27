"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, Copy, Crosshair, Gamepad2, Link, LogOut, Radio, RotateCcw, Smile, Sparkles, Trophy, Users, Waves, WifiOff, Wind } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import RaftArena from "@/components/raft-arena";
import { useRaftOnline } from "@/hooks/use-raft-online";
import { GAMES_HREF } from "@/lib/games";
import { createBattle, simulateShot, type ShotInput, type Side } from "@/lib/raft-battle";
import { raftCrew } from "@/lib/raft-crew";
import { formatTurnTime, remainingTurnSeconds, type RaftPokemon, type RoomEvent } from "@/lib/raft-online";

const emptyBattle = createBattle(() => 0.5);
const defaultAim: ShotInput = { angle: 45, power: 75, kind: "normal" };

export default function OnlineRaftBattle({ onBack, initialCode }: { onBack: () => void; initialCode?: string }) {
  const online = useRaftOnline(initialCode);
  const { snapshot, side, connection, clockOffset } = online;
  const [selected, setSelected] = useState<RaftPokemon>("pikachu");
  const [code, setCode] = useState(initialCode?.toUpperCase() || "");
  const [draft, setDraft] = useState<{ turnId: number; input: ShotInput } | null>(null);
  const [now, setNow] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");
  const [copyFallback, setCopyFallback] = useState("");
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const copyInput = useRef<HTMLInputElement>(null);
  const angleInput = useRef<HTMLInputElement>(null);
  const lastEvent = useRef<string | null>(null);
  const room = snapshot;
  const battle = room?.battle || emptyBattle;
  const players = ([0, 1] as const).map(player => raftCrew.find(pokemon => pokemon.id === (room?.players[player]?.pokemon || (player === 0 ? selected : "gengar"))) || raftCrew[0]);
  const myPlayer = side === null ? null : room?.players[side];
  const connected = connection === "connected";
  const busy = connection === "checking" || connection === "connecting" || connection === "reconnecting";
  const serverNow = now + clockOffset;
  const remaining = remainingTurnSeconds(room?.turnDeadline ?? null, serverNow);
  const myTurn = !!room && side === battle.turn;
  const canAim = connected && room?.phase === "playing" && myTurn && !room.shot && !online.firePending && remaining > 0;
  const authoritativeAim = room?.aims[battle.turn] || defaultAim;
  const aim = myTurn && draft?.turnId === room?.turnId ? draft.input : authoritativeAim;
  const shot = room?.shot;
  const emote = room?.emote;
  const canTaunt = canAim && (!emote || serverNow >= emote.startedAt + 5000);
  const label = (player: Side) => side === player ? "You" : "Your rival";
  const winner = battle.winner;
  const winnerText = winner === null ? "Good game." : winner === side ? "You take the lagoon!" : "Your rival takes the lagoon!";
  const preview = useMemo(() => simulateShot(battle.turn, aim, battle.wind).points, [battle.turn, battle.wind, aim]);
  // Keep each animation's performance clock stable as unrelated aim/sync snapshots arrive.
  const flight = useMemo(() => shot ? {
    shot: shot.result, shooter: shot.shooter,
    startedAt: performance.now() - (Date.now() + clockOffset - shot.startedAt),
    duration: Math.max(1, shot.endsAt - shot.startedAt - 200),
  } : null, [shot?.id, shot?.startedAt]);
  const arenaEmote = useMemo(() => emote ? {
    side: emote.side, startedAt: performance.now() - (Date.now() + clockOffset - emote.startedAt),
  } : null, [emote?.id, emote?.startedAt]);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 250);
    document.addEventListener("visibilitychange", tick);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", tick); };
  }, []);
  useEffect(() => {
    if (canAim) angleInput.current?.focus({ preventScroll: true });
  }, [room?.turnId, connected]);
  useEffect(() => {
    if (copyFallback) { copyInput.current?.focus(); copyInput.current?.select(); }
  }, [copyFallback]);
  useEffect(() => {
    if (!room?.lastEvent || side === null) return;
    const event = room.lastEvent;
    const key = `${room.code}:${event.id}`;
    if (key === lastEvent.current) return;
    lastEvent.current = key;
    const name = (player: Side) => side === player ? "You" : "Your rival";
    const eventText = (entry: RoomEvent) => {
      if (entry.kind === "timeout") return `${name(entry.side)} ran out of time. The turn passed to the other raft.`;
      if (entry.kind === "forfeit") return `${name(entry.side)} left the battle.`;
      if (entry.kind === "start" || entry.kind === "rematch") return "Both players are ready. Each turn lasts two minutes.";
      if (entry.damage && entry.hit !== null && entry.hit !== undefined) return `${name(entry.hit)} took ${entry.damage} damage${entry.hit === entry.side ? " from a returning shot" : ""}.`;
      return `${name(entry.side)} missed. Watch the wind and adjust your aim.`;
    };
    setHistory(previous => event.kind === "start" || event.kind === "rematch" ? [eventText(event)] : [eventText(event), ...previous].slice(0, 3));
  }, [room?.code, room?.lastEvent, side]);

  function updateAim(change: Partial<ShotInput>) {
    if (!canAim || !room) return;
    const next = { ...aim, ...change };
    setDraft({ turnId: room.turnId, input: next });
    online.updateAim(next);
  }
  function choose(pokemon: RaftPokemon) {
    setSelected(pokemon);
    if (room) online.choose(pokemon);
  }
  function leave() { online.leave(); onBack(); }
  function requestLeave() { if (room?.phase === "playing") setConfirmLeave(true); else leave(); }
  async function copyInvite(kind: "code" | "link") {
    if (!room) return;
    const url = new URL(window.location.href);
    url.searchParams.set("room", room.code);
    const value = kind === "code" ? room.code : url.href;
    try {
      await navigator.clipboard.writeText(value);
      setCopyFallback("");
      setCopyStatus(kind === "code" ? "Room code copied." : "Invite link copied.");
    } catch {
      setCopyFallback(value);
      setCopyStatus("Select and copy the invite below.");
    }
  }
  const status = connection === "reconnecting" ? "Reconnecting to your raft…"
    : room && !connected ? "Connection lost. Your turn clock keeps running."
    : room?.phase === "finished" ? winnerText
    : room?.phase === "waiting" ? room.players.every(Boolean) ? "Both rafts are here. Ready when you are." : "Waiting for your rival to join."
    : shot ? "Shot away. Watch the splash!"
    : online.firePending ? "Sending your shot…"
    : room?.phase === "playing" ? remaining === 0 ? "Time is up. Passing the turn…" : myTurn ? "Your turn. Make it count." : "Your rival is lining up a shot."
    : "Two devices. One lagoon. Bring a friend.";
  const finishReason = room?.finishReason === "disconnect" ? "The connection grace period ended. The player still connected wins."
    : room?.finishReason === "left" ? "A player left the match. The other raft wins."
    : "A little aim, a little strategy, and one last splash.";
  const crewPicker = <fieldset className="raft-fieldset raft-crew-field" disabled={busy || (!!room && (!connected || room.phase !== "waiting" || !!myPlayer?.ready))}>
    <legend>Your Pokémon</legend><div className="raft-crew-picker">{raftCrew.map(pokemon => {
      const chosen = (myPlayer?.pokemon || selected) === pokemon.id;
      return <button key={pokemon.id} aria-pressed={chosen} aria-label={`Choose ${pokemon.name}`} style={{ "--crew-color": pokemon.color } as CSSProperties} onClick={() => choose(pokemon.id)}><img src={`/images/puzzle/${pokemon.id}.png`} width={60} height={60} alt="" /><span>{pokemon.name}</span>{chosen && <Check className="raft-crew-check" size={12} />}</button>;
    })}</div>
  </fieldset>;

  return <div className="raft-page raft-online-page">
    <a className="skip-link" href="#raft-main">Skip to game</a>
    <header className="raft-topbar"><a href="/" className="wordmark" aria-label="Mon home"><strong>mon<span>.</span></strong><span className="raft-wordmark-label">Playground</span></a><nav aria-label="Playground navigation"><a href={GAMES_HREF}><Gamepad2 size={16} /> All games</a><button className="raft-text-button" onClick={requestLeave}><ArrowLeft size={16} /> Local play</button></nav></header>
    <main id="raft-main" className="raft-main">
      <div className="raft-intro"><div><h1>Poké <span>Raft.</span></h1><p>Invite your rival. Meet on the water. Make a splash.</p></div><span className="raft-mode-note"><Radio size={16} /> Live two-player battle</span></div>
      {room && <div className="raft-room-strip"><div><span>Room</span><input aria-label="Room code" readOnly value={room.code} onFocus={event => event.currentTarget.select()} /></div><div className="raft-invite-actions"><button className="raft-text-button" onClick={() => copyInvite("code")}><Copy size={15} /> Copy code</button><button className="raft-text-button" onClick={() => copyInvite("link")}><Link size={15} /> Copy invite</button></div><span className={`raft-connection ${connected ? "is-connected" : ""}`}><span />{connected ? "Connected" : connection === "reconnecting" ? "Reconnecting" : "Offline"}</span></div>}
      {copyStatus && <div className="raft-copy-result"><span role="status">{copyStatus}</span>{copyFallback && <input ref={copyInput} value={copyFallback} readOnly aria-label="Invite to copy" onFocus={event => event.currentTarget.select()} />}</div>}
      {(connection === "reconnecting" || (room && connection === "disconnected")) && <div className="raft-connection-notice" role="status"><WifiOff size={18} /><p>{connection === "reconnecting" ? "Reconnecting… Your place is held briefly, but the turn clock keeps running." : "You're disconnected. Reconnect to return to your raft."}</p><button className="raft-text-button" onClick={online.reconnect}>Reconnect</button><button className="raft-text-button" onClick={requestLeave}>Leave</button></div>}
      {online.error && <p className="raft-online-error" role="alert">{online.error}</p>}
      <div className="raft-layout"><section className="raft-game" aria-label="Battle arena">
        <div className="raft-scoreboard">{([0, 1] as const).map(player => <div className={`raft-player raft-player-${player} ${room?.phase === "playing" && battle.turn === player ? "is-active" : ""}`} key={player}><img src={`/images/puzzle/${players[player].id}.png`} alt="" width={52} height={52} /><div className="raft-player-info"><div className="raft-player-name"><strong>{room && !room.players[player] ? "Open raft" : players[player].name}</strong><span>{room ? room.players[player] ? `${label(player)}${!room.players[player]?.connected ? " · Offline" : ""}` : "Waiting for rival" : player === 0 ? "Your raft" : "Rival's raft"}</span></div><div className="raft-health" role="progressbar" aria-label={`${label(player)} health`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={battle.health[player]}><span style={{ width: `${battle.health[player]}%` }} /></div><span className="raft-health-value">{battle.health[player]} <span>/ 100 HP</span></span></div></div>)}<span className="raft-versus" aria-hidden="true">vs</span></div>
        <div className="raft-scene"><div className="raft-weather"><span><Waves size={14} /> Moonlit lagoon</span><span aria-label={`Wind strength ${Math.abs(battle.wind)}, blowing ${battle.wind < 0 ? "left" : "right"}`}><Wind size={15} />{battle.wind === 0 ? "No wind" : <>{battle.wind < 0 ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}{Math.abs(battle.wind)} wind</>}</span></div>
          <RaftArena pokemon={[players[0].id, players[1].id]} health={battle.health} turn={battle.turn} preview={room?.phase === "playing" && !shot ? preview : []} flight={flight} impact={null} active={room?.phase === "playing"} emote={arenaEmote} />
          {room?.phase === "finished" && <div className="raft-scene-message"><Trophy size={25} /><strong>{winnerText}</strong><span>{winner === null ? "The battle has ended." : `${players[winner].name} is the last Pokémon afloat.`}</span></div>}
        </div>
        <div className="raft-status"><span className={`raft-status-dot ${busy || shot ? "is-busy" : ""}`} /><strong>{status}</strong>{room?.phase === "playing" ? <span className={`raft-online-timer ${remaining <= 20 && room.turnDeadline !== null ? "is-urgent" : ""}`} aria-label={room.turnDeadline === null ? "Turn clock paused during shot" : `Turn time remaining: ${formatTurnTime(remaining)}`} aria-live="off"><Clock3 size={14} />{room.turnDeadline === null ? "Shot in flight" : formatTurnTime(remaining)}</span> : <span className="raft-round">{room?.phase === "finished" ? `Round ${battle.round}` : "2 min / turn"}</span>}</div>
        <div className="raft-below-arena"><p><Crosshair size={17} /><span>{room?.phase === "playing" ? "Aim is shared live. When the timer ends, your turn passes to your rival." : "Share a room code or invite link. Both players get two minutes to aim each turn."}</span></p>{room && <button className="raft-text-button" onClick={requestLeave}><LogOut size={15} /> Leave room</button>}</div>
        <div className="raft-log" aria-label="Recent shots"><h2>Battle notes</h2>{history.length ? <ol>{history.map((entry, index) => <li key={`${index}-${entry}`} className={index === 0 ? "is-latest" : ""}>{entry}</li>)}</ol> : <p>Every great battle starts with a friendly invitation.</p>}</div>
      </section>
      <aside className="raft-sidebar" aria-label={!room ? "Online match setup" : room.phase === "waiting" ? "Room lobby" : "Shot controls"}>
        {connection === "unavailable" ? <div className="raft-online-unavailable"><WifiOff size={30} /><h2>Online play unavailable.</h2><p>The online lagoon isn't open right now. You can still challenge a friend on this device or play against AI.</p><button className="raft-primary" onClick={onBack}><ArrowLeft size={16} /> Play locally</button></div> : !room ? <>
          <div className="raft-panel-heading"><h2>Meet on the water.</h2><p>Create a room and invite a friend, or join with their six-letter code.</p></div>{crewPicker}
          <button className="raft-primary raft-start" disabled={busy} onClick={() => online.create(selected)}>{busy ? "Connecting…" : "Create a room"}<ArrowRight size={17} /></button>
          <div className="raft-join-divider"><span>Have an invite?</span></div><form className="raft-join-form" onSubmit={event => { event.preventDefault(); if (/^[A-Z]{6}$/.test(code) && !busy) online.join(code, selected); }}><label htmlFor="raft-room-code">Room code</label><input id="raft-room-code" name="room" value={code} placeholder="ABCDEF" maxLength={6} autoComplete="off" autoCapitalize="characters" spellCheck={false} disabled={busy} onChange={event => setCode(event.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 6))} /><button className="raft-online-secondary" disabled={busy || !/^[A-Z]{6}$/.test(code)} type="submit"><Users size={16} /> Join room</button></form>
          {connection === "disconnected" && <button className="raft-text-button" onClick={online.reconnect}><RotateCcw size={15} /> Try connecting again</button>}<p className="raft-fair-note">One friend. Two devices. No account needed.</p>
        </> : room.phase === "waiting" ? <>
          <div className="raft-panel-heading"><h2>Almost afloat.</h2><p>Share the invite above. The match starts when you're both ready.</p></div><ul className="raft-lobby-players">{([0, 1] as const).map(player => <li key={player}><span><strong>{room.players[player] ? `${players[player].name} · ${label(player)}` : "Your rival's raft"}</strong><small>{!room.players[player] ? "Waiting for someone to join" : !room.players[player]?.connected ? "Reconnecting…" : room.players[player]?.ready ? "Ready to battle" : "Choosing a Pokémon"}</small></span>{room.players[player]?.ready ? <Check size={18} /> : <Users size={18} />}</li>)}</ul>{crewPicker}
          <button className="raft-primary raft-start" onClick={online.ready} disabled={!connected || !!myPlayer?.ready || !room.players.every(player => player?.connected)}>{myPlayer?.ready ? <><Check size={17} /> Waiting for your rival</> : <>I'm ready <ArrowRight size={17} /></>}</button><p className="raft-fair-note">{room.players.every(Boolean) ? "Once ready, your Pokémon is locked in." : "Your friend can join using the code or invite link."}</p>
        </> : room.phase === "finished" ? <div className="raft-match-result"><Trophy size={36} /><h2>Good game.</h2><p>{finishReason}</p><dl><div><dt>Winner</dt><dd>{winner === null ? "—" : players[winner].name}</dd></div><div><dt>Rounds</dt><dd>{battle.round}</dd></div></dl><button className="raft-primary" onClick={online.rematch} disabled={!connected || !!myPlayer?.rematch || !room.players.every(player => player?.connected)}><RotateCcw size={16} />{myPlayer?.rematch ? "Waiting for rival…" : "Request rematch"}</button>{room.players.some((player, index) => index !== side && player?.rematch) && !myPlayer?.rematch && <p className="raft-fair-note">Your rival wants another round.</p>}{!room.players.every(player => player?.connected) && <p className="raft-fair-note">Both players must be connected for a rematch.</p>}<button className="raft-text-button" onClick={requestLeave}>Leave room <ArrowRight size={15} /></button></div> : <>
          <div className="raft-panel-heading"><h2>{shot || online.firePending ? "Shot away." : myTurn ? "Make a splash." : "Watch their aim."}</h2><p>{myTurn ? `${players[battle.turn].name} is on your raft. Set your shot before time runs out.` : `${players[battle.turn].name} is aiming. Their angle and power update live.`}</p></div>
          <fieldset className="raft-fieldset" disabled={!canAim}><legend>Choose your shot</legend><div className="raft-shots"><button className={aim.kind === "normal" ? "is-selected" : ""} aria-pressed={aim.kind === "normal"} onClick={() => updateAim({ kind: "normal" })}><Crosshair size={19} /><span><strong>{players[battle.turn].move}</strong><small>28 direct damage · Unlimited</small></span></button><button className={aim.kind === "special" ? "is-selected" : ""} aria-pressed={aim.kind === "special"} disabled={battle.specials[battle.turn] === 0} onClick={() => updateAim({ kind: "special" })}><Sparkles size={19} /><span><strong>Charged {players[battle.turn].move}</strong><small>42 direct damage · {battle.specials[battle.turn]} left</small></span></button></div></fieldset>
          <div className="raft-slider-group"><label htmlFor="raft-online-angle">Angle <output htmlFor="raft-online-angle">{aim.angle}°</output></label><input ref={angleInput} id="raft-online-angle" type="range" min={10} max={80} step={1} value={aim.angle} disabled={!canAim} onChange={event => updateAim({ angle: Number(event.target.value) })} /><div className="raft-range-ends"><span>Low &amp; direct</span><span>High arc</span></div></div>
          <div className="raft-slider-group"><label htmlFor="raft-online-power">Power <output htmlFor="raft-online-power">{aim.power}%</output></label><input id="raft-online-power" type="range" min={20} max={100} step={1} value={aim.power} disabled={!canAim} onChange={event => updateAim({ power: Number(event.target.value) })} /><div className="raft-range-ends"><span>A gentle toss</span><span>Full send</span></div></div>
          <button className="raft-primary raft-fire" disabled={!canAim} onClick={() => { if (canAim) online.fire(aim); }}><Crosshair size={19} />{shot ? "Shot in flight…" : online.firePending ? "Sending shot…" : !myTurn ? "Rival's turn" : remaining === 0 ? "Time's up" : `Fire ${aim.kind === "special" ? "charged shot" : players[battle.turn].move}`}</button>
          <button className="raft-text-button raft-online-taunt" disabled={!canTaunt} onClick={online.taunt}><Smile size={17} />{canAim && !canTaunt ? "Taunt cooling down…" : "Taunt your rival"}</button><p className="raft-fair-note">Taunts don't use your turn. Your rival can see them.</p>
        </>}
      </aside></div>
      <details className="raft-howto"><summary>First time on a raft? Here's how to play.</summary><div><p><strong>Aim together, from anywhere.</strong> Share the room code or invite link with a friend, pick your Pokémon, and both tap “I'm ready.” Your rival sees your aim and shots live.</p><p><strong>Two minutes per turn.</strong> Adjust your angle and power, then fire. If time runs out, the turn passes without a shot. Wind bends the arc, and nearby shots can still cause splash damage.</p><p><strong>Three charged shots.</strong> Each Pokémon has equal health and power. Use charged moves wisely, and reduce your rival's 100 HP to zero to win.</p><p><strong>Stay aboard.</strong> A lost connection gives you a short chance to reconnect while the clock continues. Use touch or a mouse, or Tab between controls and arrow keys to aim.</p></div></details>
    </main>
    <footer className="raft-footer"><span>A little side quest by Mon.</span><span>Fan-made game. Artwork via <a href="https://github.com/PokeAPI/sprites" target="_blank" rel="noreferrer">PokéAPI</a>. Pokémon © Nintendo / Creatures / GAME FREAK.</span></footer>
    <div className="raft-sr-only" role="status" aria-live="polite" aria-atomic="true">{status}{history[0] ? ` ${history[0]}` : ""}{canAim && remaining <= 10 ? " Ten seconds or less remain in your turn." : ""}</div>
    <AlertDialog open={confirmLeave} onOpenChange={setConfirmLeave}><AlertDialogContent className="raft-confirm"><AlertDialogHeader><AlertDialogTitle>Leave this battle?</AlertDialogTitle><AlertDialogDescription>Your rival will win this match if you leave. You can create another room whenever you're ready.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep playing</AlertDialogCancel><AlertDialogAction onClick={leave}>Leave battle</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>;
}
