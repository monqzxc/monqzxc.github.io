"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Eye, EyeOff, Gamepad2, Hash, Move, Pause, Play, Shuffle, Trophy, X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { addPuzzleWin, canMoveTile, createPuzzle, isSolved, moveTile, parsePuzzleSave, STORAGE_KEY, type GridSize, type PuzzleId, type PuzzleSave, type PuzzleSession, type PuzzleWin } from "@/lib/tile-puzzle";
import { formatPuzzleTime, puzzleImage, puzzlePokemon } from "@/lib/puzzle-pokemon";

type PuzzleChoice = { pokemon: PuzzleId; size: GridSize };

export default function TilePuzzle() {
  const [session, setSession] = useState<PuzzleSession | null>(null);
  const [wins, setWins] = useState<PuzzleWin[]>([]);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(true);
  const [displayTime, setDisplayTime] = useState(0);
  const [showNumbers, setShowNumbers] = useState(true);
  const [showReference, setShowReference] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<PuzzleChoice | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const sessionRef = useRef<PuzzleSession | null>(null);
  const winsRef = useRef<PuzzleWin[]>([]);
  const runningSince = useRef<number | null>(null);
  const board = useRef<HTMLDivElement>(null);
  const referenceToggle = useRef<HTMLButtonElement>(null);
  const choiceTrigger = useRef<HTMLElement | null>(null);

  const selected = puzzlePokemon.find(pokemon => pokemon.id === session?.pokemon) ?? puzzlePokemon[0];
  const size = session?.size ?? 3;
  const won = session?.status === "won";
  const matchingWins = wins.filter(win => win.pokemon === selected.id && win.size === size);
  const bestTime = matchingWins.length ? Math.min(...matchingWins.map(win => win.elapsedMs)) : null;
  const bestMoves = matchingWins.length ? Math.min(...matchingWins.map(win => win.moves)) : null;
  const image = puzzleImage(selected.id);
  const backdrop = `radial-gradient(ellipse at 15% 10%, ${selected.tint}, transparent 75%), linear-gradient(135deg, #232234, #10131e)`;
  const artwork = `url("${image}"), ${backdrop}`;

  function elapsedNow() {
    return (sessionRef.current?.elapsedMs ?? 0) + (runningSince.current === null ? 0 : performance.now() - runningSince.current);
  }

  function persist(next: PuzzleSave) {
    try {
      // Merge score history so another open tab cannot silently erase a win.
      const previous = parsePuzzleSave(window.localStorage.getItem(STORAGE_KEY));
      const combined = new Map([...previous.wins, ...next.wins].map(win => [win.id, win]));
      const merged = [...combined.values()].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 50);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...next, wins: merged }));
      winsRef.current = merged;
      setWins(merged);
      setStorageUnavailable(false);
    } catch {
      setStorageUnavailable(true);
    }
  }

  function commit(next: PuzzleSession, nextWins = winsRef.current) {
    sessionRef.current = next;
    winsRef.current = nextWins;
    setSession(next);
    setWins(nextWins);
    setDisplayTime(next.elapsedMs);
    persist({ version: 1, session: next, wins: nextWins });
  }

  function pauseGame() {
    const current = sessionRef.current;
    if (!current || current.status === "won" || runningSince.current === null) return;
    const elapsedMs = elapsedNow();
    runningSince.current = null;
    setPaused(true);
    commit({ ...current, elapsedMs });
    setAnnouncement("Puzzle paused. Your progress has been kept.");
  }

  useEffect(() => {
    let saved = parsePuzzleSave(null);
    try {
      saved = parsePuzzleSave(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      setStorageUnavailable(true);
    }
    const initial = saved.session ?? createPuzzle("gengar", 3);
    sessionRef.current = initial;
    winsRef.current = saved.wins;
    setSession(initial);
    setWins(saved.wins);
    setDisplayTime(initial.elapsedMs);
    setReady(true);
    if (saved.session?.status === "playing" && saved.session.moves > 0) {
      setAnnouncement("Your last puzzle is ready to continue.");
    }
    const onVisibility = () => { if (document.hidden) pauseGame(); };
    const onPageHide = () => pauseGame();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
    // These handlers read the current game through refs, not a captured render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || paused || won) return;
    let ticks = 0;
    const interval = window.setInterval(() => {
      const elapsedMs = elapsedNow();
      setDisplayTime(elapsedMs);
      if (++ticks % 5 === 0 && sessionRef.current) {
        persist({ version: 1, session: { ...sessionRef.current, elapsedMs }, wins: winsRef.current });
      }
    }, 1000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, paused, won, session?.id]);

  function begin() {
    if (!sessionRef.current || sessionRef.current.status === "won") return;
    runningSince.current = performance.now();
    setPaused(false);
    persist({ version: 1, session: sessionRef.current, wins: winsRef.current });
    setAnnouncement("Puzzle started. Slide a neighboring tile into the empty space.");
    board.current?.focus();
  }

  function startNew(choice: PuzzleChoice) {
    runningSince.current = null;
    setPaused(true);
    setShowReference(false);
    setImageFailed(false);
    commit(createPuzzle(choice.pokemon, choice.size));
    setAnnouncement("A new puzzle is ready. Select Start puzzle to play.");
  }

  function requestNew(choice: PuzzleChoice) {
    const current = sessionRef.current;
    if (current?.status === "playing" && current.moves > 0) {
      choiceTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      pauseGame();
      setPendingChoice(choice);
    } else {
      startNew(choice);
    }
  }

  function slide(index: number) {
    const current = sessionRef.current;
    if (!current || current.status === "won" || runningSince.current === null) return;
    const tiles = moveTile(current.tiles, index, current.size);
    if (tiles === current.tiles) return;
    const elapsedMs = elapsedNow();
    const complete = isSolved(tiles);
    const next: PuzzleSession = { ...current, tiles, moves: current.moves + 1, elapsedMs, status: complete ? "won" : "playing" };
    runningSince.current = complete ? null : performance.now();
    if (complete) {
      const win: PuzzleWin = { id: next.id, pokemon: next.pokemon, size: next.size, moves: next.moves, elapsedMs, completedAt: new Date().toISOString() };
      commit(next, addPuzzleWin(winsRef.current, win));
      setAnnouncement(`Puzzle complete! ${next.moves} moves in ${formatPuzzleTime(elapsedMs)}.`);
    } else {
      commit(next);
    }
  }

  function keyboardMove(event: KeyboardEvent<HTMLDivElement>) {
    const current = sessionRef.current;
    if (!current || paused || current.status === "won") return;
    const blank = current.tiles.indexOf(0);
    const direction: Record<string, number> = { ArrowLeft: 1, ArrowRight: -1, ArrowUp: current.size, ArrowDown: -current.size };
    if (!(event.key in direction)) return;
    event.preventDefault();
    slide(blank + direction[event.key]);
  }

  return (
    <div className="puzzle-page" style={{ "--puzzle-color": selected.color, "--puzzle-tint": selected.tint } as CSSProperties}>
      <a className="skip-link" href="#puzzle-main">Skip to puzzle</a>
      <header className="puzzle-topbar">
        <a className="wordmark" href="/" aria-label="Mon home"><strong>mon<span>.</span></strong><span className="puzzle-wordmark-label">PLAYGROUND</span></a>
        <a className="puzzle-back" href="/#craft-hobbies"><ArrowLeft size={16} /> Back to portfolio</a>
      </header>
      <main id="puzzle-main" className="puzzle-main">
        <div className="puzzle-intro">
          <div><div className="eyebrow"><Gamepad2 size={16} /> A LITTLE BREAK BETWEEN BUILDS</div><h1>One tile <span>at a time.</span></h1><p>Pick your Pokémon. Slide the pieces. Bring the picture back together.</p></div>
          <div className="puzzle-local-badge"><span /> Your browser. Your saved scores.</div>
        </div>

        <div className="puzzle-layout">
          <section className="puzzle-arena" aria-labelledby="puzzle-heading">
            <div className="puzzle-arena-heading"><div><span className="puzzle-overline">NO. {selected.number} / {size} × {size}</span><h2 id="puzzle-heading">{selected.name}</h2></div><span className={`puzzle-state ${won ? "is-complete" : ""}`}>{!ready ? "Loading" : won ? "Completed" : paused ? "Ready when you are" : "In play"}</span></div>
            <dl className="puzzle-stats"><div><dt><Move size={14} /> Moves</dt><dd>{session?.moves ?? 0}</dd></div><div><dt><Clock3 size={14} /> Time</dt><dd>{formatPuzzleTime(displayTime)}</dd></div><div><dt><Trophy size={14} /> Best time</dt><dd>{bestTime === null ? "—" : formatPuzzleTime(bestTime)}</dd></div></dl>

            <div className="puzzle-board-wrap">
              <div ref={board} className={`puzzle-board ${won ? "is-won" : ""}`} role="group" aria-label={`${selected.name} ${size} by ${size} sliding puzzle`} aria-describedby="puzzle-instructions" tabIndex={0} onKeyDown={keyboardMove}>
                {session ? session.tiles.map((tile, index) => {
                  const row = Math.floor(index / size);
                  const column = index % size;
                  const original = tile === 0 ? size * size - 1 : tile - 1;
                  const movable = canMoveTile(session.tiles, index, size);
                  const style: CSSProperties = {
                    width: `calc(${100 / size}% - 6px)`, height: `calc(${100 / size}% - 6px)`,
                    left: `calc(${column * 100 / size}% + 3px)`, top: `calc(${row * 100 / size}% + 3px)`,
                    backgroundImage: tile || won ? artwork : undefined,
                    backgroundSize: `${size * 100}% ${size * 100}%`,
                    backgroundPosition: `${(original % size) * 100 / (size - 1)}% ${Math.floor(original / size) * 100 / (size - 1)}%`,
                  };
                  if (tile === 0) return <div key="blank" className={`puzzle-empty ${won ? "puzzle-last-piece" : ""}`} style={style} aria-hidden="true">{!won && <span><Move size={23} /><small>EMPTY</small></span>}</div>;
                  return <button key={tile} type="button" className={`puzzle-tile ${movable ? "can-slide" : ""}`} data-tile={tile} style={style} disabled={!movable || paused || won} onClick={() => slide(index)} aria-label={`Tile ${tile}, row ${row + 1}, column ${column + 1}${movable ? ", slide into empty space" : ""}`}><span className={`puzzle-tile-number ${showNumbers || imageFailed ? "" : "visually-hidden"}`}>{tile}</span></button>;
                }) : <div className="puzzle-board-loading" role="status">Preparing your puzzle…</div>}
              </div>
              {ready && paused && !won && <div className="puzzle-pause-overlay"><div className="puzzle-pause-icon"><Gamepad2 size={28} /></div><h3>{session && (session.moves > 0 || session.elapsedMs > 0) ? "Pick up where you left off." : "Ready to piece it together?"}</h3><p>{size === 3 ? "Eight tiles. One empty space." : "Fifteen tiles. A little more challenge."}</p><button type="button" className="puzzle-primary" onClick={begin}><Play size={17} />{session && (session.moves > 0 || session.elapsedMs > 0) ? "Resume puzzle" : "Start puzzle"}</button><small>The timer runs only while you play.</small></div>}
            </div>

            {won && <div className="puzzle-result"><CheckCircle2 size={25} /><div><strong>Picture perfect!</strong><span>{session.moves} moves · {formatPuzzleTime(session.elapsedMs)}{storageUnavailable ? "" : " · Result saved"}</span></div><button type="button" onClick={() => startNew({ pokemon: selected.id, size })}>Play again <ArrowRight size={16} /></button></div>}
            <div className="puzzle-controls"><button type="button" onClick={() => requestNew({ pokemon: selected.id, size })} disabled={!ready}><Shuffle size={16} /> New shuffle</button><button type="button" onClick={() => paused ? begin() : pauseGame()} disabled={!ready || won}>{paused ? <Play size={16} /> : <Pause size={16} />}{paused ? "Resume" : "Pause"}</button><button type="button" aria-pressed={showNumbers} onClick={() => setShowNumbers(!showNumbers)}><Hash size={16} /> Numbers</button><button ref={referenceToggle} type="button" aria-expanded={showReference} aria-controls="puzzle-reference" onClick={() => setShowReference(!showReference)}>{showReference ? <EyeOff size={16} /> : <Eye size={16} />} Reference</button></div>
            <p id="puzzle-instructions" className="puzzle-instructions">Tap a tile next to the empty space to slide it. You can also focus the board and use the arrow keys to move a tile in that direction. Arrange the tiles in order, with the empty space at the bottom right.</p>
            {imageFailed && <p className="puzzle-storage-note" role="status">The artwork could not load. You can still solve the puzzle using the tile numbers.</p>}
          </section>

          <aside className="puzzle-sidebar">
            <section id="puzzle-reference" className="puzzle-panel puzzle-reference" hidden={!showReference} aria-labelledby="puzzle-reference-heading">
              <div className="puzzle-reference-heading">
                <div><span className="puzzle-overline">REFERENCE</span><h2 id="puzzle-reference-heading">{selected.name}</h2></div>
                <button type="button" className="puzzle-reference-close" aria-label="Hide reference" onClick={() => { setShowReference(false); referenceToggle.current?.focus({ preventScroll: true }); }}><X size={18} /></button>
              </div>
              <img src={image} alt={`Complete ${selected.name} picture to match`} width={475} height={475} style={{ backgroundImage: backdrop }} onError={() => setImageFailed(true)} />
            </section>
            <section className="puzzle-panel" aria-labelledby="puzzle-picker-heading"><div className="puzzle-panel-heading"><span className="puzzle-step">01</span><div><h2 id="puzzle-picker-heading">Choose your Pokémon</h2><p>Eight familiar faces. Your call.</p></div></div><div className="puzzle-picker" role="group" aria-labelledby="puzzle-picker-heading">{puzzlePokemon.map(pokemon => <button type="button" key={pokemon.id} aria-pressed={selected.id === pokemon.id} disabled={!ready} onClick={() => { if (pokemon.id !== selected.id) requestNew({ pokemon: pokemon.id, size }); }}><img src={puzzleImage(pokemon.id)} alt="" width={76} height={76} loading="lazy" /><span>{pokemon.name}</span>{selected.id === pokemon.id && <Check size={12} className="puzzle-picker-check" />}</button>)}</div></section>
            <section className="puzzle-panel" aria-labelledby="puzzle-size-heading"><div className="puzzle-panel-heading"><span className="puzzle-step">02</span><div><h2 id="puzzle-size-heading">Pick your challenge</h2><p>A quick break or a longer puzzle?</p></div></div><div className="puzzle-difficulty" role="group" aria-labelledby="puzzle-size-heading">{([3, 4] as const).map(grid => <button type="button" key={grid} aria-pressed={size === grid} disabled={!ready} onClick={() => { if (grid !== size) requestNew({ pokemon: selected.id, size: grid }); }}><span className="puzzle-grid-icon" style={{ gridTemplateColumns: `repeat(${grid}, 1fr)` }} aria-hidden="true">{Array.from({ length: grid * grid }, (_, i) => <i key={i} />)}</span><span><strong>{grid} × {grid}</strong><small>{grid === 3 ? "Easygoing" : "A good challenge"}</small></span>{size === grid && <Check size={15} />}</button>)}</div></section>
            <section className="puzzle-panel puzzle-records" aria-labelledby="puzzle-records-heading"><div className="puzzle-panel-heading"><span className="puzzle-step"><Trophy size={16} /></span><div><h2 id="puzzle-records-heading">Best of your saved wins</h2><p>{selected.name} · {size} × {size}</p></div></div><dl className="puzzle-record-grid"><div><dt>Fastest time</dt><dd>{bestTime === null ? "—" : formatPuzzleTime(bestTime)}</dd></div><div><dt>Fewest moves</dt><dd>{bestMoves ?? "—"}</dd></div><div><dt>Saved wins</dt><dd>{matchingWins.length}</dd></div></dl>{matchingWins.length ? <><h3>Recent solves</h3><ol className="puzzle-history">{matchingWins.slice(0, 5).map(win => <li key={win.id}><span><CheckCircle2 size={14} /><time dateTime={win.completedAt}>{new Date(win.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</time></span><strong>{formatPuzzleTime(win.elapsedMs)}</strong><span>{win.moves} moves</span></li>)}</ol></> : <div className="puzzle-empty-record"><Trophy size={23} /><p>Your first win belongs here.<br />Finish a puzzle to set your record.</p></div>}<p className="puzzle-storage-note" role={storageUnavailable ? "status" : undefined}>{storageUnavailable ? "Browser storage is unavailable. You can play, but progress and scores will only last for this visit." : "Your progress and latest 50 wins stay on this browser. Clearing browser data removes them."}</p></section>
          </aside>
        </div>
        <p className="puzzle-announcer visually-hidden" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
        <noscript><p className="puzzle-storage-note">Enable JavaScript to play the sliding-tile puzzle.</p></noscript>
      </main>
      <footer className="puzzle-footer"><span>A small experiment by Mon.</span><span>Pokémon artwork via <a href="https://github.com/PokeAPI/sprites" target="_blank" rel="noreferrer">PokéAPI</a>. Pokémon © Nintendo / Creatures / GAME FREAK.</span></footer>
      <AlertDialog open={pendingChoice !== null} onOpenChange={open => { if (!open) setPendingChoice(null); }}><AlertDialogContent className="puzzle-confirm" onCloseAutoFocus={event => { event.preventDefault(); choiceTrigger.current?.focus(); }}><AlertDialogHeader><AlertDialogTitle>Start a new puzzle?</AlertDialogTitle><AlertDialogDescription>This replaces your current board. Your saved scores will stay.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep this puzzle</AlertDialogCancel><AlertDialogAction onClick={() => { if (pendingChoice) startNew(pendingChoice); setPendingChoice(null); }}>Start new puzzle</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}
