"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { BookOpen } from "lucide-react";
import { PokemonSprite } from "@/components/pokemon-sprite";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RESIDENTS, SPECIES, THEME_ORDER, THEMES, type PokemonTheme } from "@/lib/pokemon-roster";
import type { CapturedPokemon, PokemonReleaseResult } from "@/lib/pokemon-collection";
import { clampPokemonCapturePoint, getPokemonCaptureBoltPoints, POKEMON_CAPTURE_END_EVENT, POKEMON_CAPTURE_START_EVENT, type PokemonCapturePoint } from "@/lib/pokemon-capture-animation";

type CaptureBeam = { id: number; origin: PokemonCapturePoint; target: PokemonCapturePoint; points: PokemonCapturePoint[] };
type ReleaseBurst = { id: number; species: CapturedPokemon["species"]; shiny: boolean; origin: PokemonCapturePoint; sprites: { dx: number; dy: number; delay: number }[] };

const RELEASE_SPRITES = 9;
const RELEASE_MS = 1200;
const RELEASE_CONFIRM_MS = 3000;

/** Small copies scatter evenly around the circle, each landing somewhere on screen. */
function scatterRelease(origin: PokemonCapturePoint, width: number, height: number): ReleaseBurst["sprites"] {
  const reach = Math.max(width, height);
  return Array.from({ length: RELEASE_SPRITES }, (_, index) => {
    const angle = (index / RELEASE_SPRITES) * Math.PI * 2 + (Math.random() - .5) * .5;
    const distance = reach * (.22 + Math.random() * .2);
    const x = Math.min(width - 24, Math.max(24, origin.x + Math.cos(angle) * distance));
    const y = Math.min(height - 24, Math.max(24, origin.y + Math.sin(angle) * distance));
    return { dx: x - origin.x, dy: y - origin.y, delay: index * 22 };
  });
}

export function PokemonCollection({ capturedPokemon, storageError, onRelease }: {
  capturedPokemon: CapturedPokemon[];
  storageError: string | null;
  onRelease: (release: CapturedPokemon) => PokemonReleaseResult;
}) {
  const count = capturedPokemon.length;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const captureId = useRef(0);
  const [ping, setPing] = useState(0);
  const [beam, setBeam] = useState<CaptureBeam | null>(null);
  const [bursts, setBursts] = useState<ReleaseBurst[]>([]);
  const [releaseNote, setReleaseNote] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  function release(capture: CapturedPokemon, from: HTMLElement) {
    const rect = from.getBoundingClientRect();
    if (onRelease(capture) !== "released") return;
    setReleaseNote(`${capture.shiny ? "Shiny " : ""}${SPECIES[capture.species].name} was released and can be caught again.`);
    // The released row unmounts with its button; keep keyboard focus inside the Pokédex.
    requestAnimationFrame(() => {
      const next = listRef.current?.querySelector<HTMLElement>(".pokemon-collection-release") ?? dialogRef.current;
      next?.focus({ preventScroll: true });
    });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const burst = { id: ++captureId.current, ...capture, origin, sprites: scatterRelease(origin, window.innerWidth, window.innerHeight) };
    setBursts(current => [...current, burst]);
    window.setTimeout(() => setBursts(current => current.filter(entry => entry.id !== burst.id)), RELEASE_MS + RELEASE_SPRITES * 22 + 100);
  }

  useEffect(() => {
    const onCapture = (event: Event) => {
      const { target } = (event as CustomEvent<{ target: PokemonCapturePoint }>).detail;
      const trigger = triggerRef.current?.getBoundingClientRect();
      // A hidden Pokédex has no box to fire from; the habitat's fallback timer ends the capture.
      if (!trigger || trigger.width === 0) return;

      const origin = clampPokemonCapturePoint({ x: trigger.left + trigger.width / 2, y: trigger.top + trigger.height / 2 }, window.innerWidth, window.innerHeight);
      setBeam({ id: ++captureId.current, origin, target, points: getPokemonCaptureBoltPoints(origin, target) });
    };
    window.addEventListener(POKEMON_CAPTURE_START_EVENT, onCapture);
    return () => window.removeEventListener(POKEMON_CAPTURE_START_EVENT, onCapture);
  }, []);

  return (
    <>
      {storageError && <p className="pokemon-collection-error" role="alert">{storageError}</p>}
      <Dialog>
        <DialogTrigger asChild>
          <button ref={triggerRef} type="button" className="pokemon-collection-trigger">
            <BookOpen size={16} aria-hidden="true" />
            <span>Pokédex</span>
            <span key={ping} className={`pokemon-collection-count ${ping ? "is-pinging" : ""}`} aria-label={`${count} Pokémon captured`}>{count}</span>
            {ping > 0 && <span key={`ping-${ping}`} className="pokemon-collection-ping" aria-hidden="true" />}
          </button>
        </DialogTrigger>
        <DialogContent ref={dialogRef} className="pokemon-collection-dialog">
          <DialogTitle>Pokédex</DialogTitle>
          <DialogDescription>Your captures are saved in this browser and stay on this device.</DialogDescription>
          {storageError && <p className="pokemon-collection-dialog-error" role="alert">{storageError}</p>}
          <p className="sr-only" role="status">{releaseNote}</p>
          {count === 0 ? <p className="pokemon-collection-empty">No Pokémon captured yet. Say hello to a visitor and choose Catch!</p> : (
            <div ref={listRef} className="pokemon-collection-groups">
              {THEME_ORDER.map(theme => {
                const captures = capturedPokemon.filter(({ species }) => RESIDENTS[theme].includes(species));
                if (captures.length === 0) return null;
                return (
                  <section key={theme} className="pokemon-collection-group" aria-labelledby={`pokedex-${theme}`}>
                    <h3 id={`pokedex-${theme}`}>{THEMES[theme].habitat}</h3>
                    <ul className="pokemon-collection-list">
                      {captures.map(({ species, shiny }) => <CapturedEntry key={`${species}-${shiny}`} species={species} shiny={shiny} theme={theme} onRelease={from => release({ species, shiny }, from)} />)}
                    </ul>
                  </section>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Portalled to <body>: the sticky header's backdrop-filter would otherwise become the
          containing block for this fixed layer and shift the beam away from the Pokémon. */}
      {beam && createPortal(
        <PokemonCaptureBeam
          key={beam.id}
          beam={beam}
          onArrive={() => setPing(beam.id)}
          onDone={() => {
            setBeam(current => current?.id === beam.id ? null : current);
            window.dispatchEvent(new Event(POKEMON_CAPTURE_END_EVENT));
          }}
        />,
        document.body,
      )}
      {bursts.length > 0 && createPortal(bursts.map(burst => <PokemonReleaseBurst key={burst.id} burst={burst} />), document.body)}
    </>
  );
}

/**
 * Pokédex → Pokémon recall beam: the beam strikes, the Pokémon dissolves into red energy,
 * and that energy rides the retracting beam back into the Pokédex. One shared duration keeps
 * the keyframe percentages of every part in sync.
 */
function PokemonCaptureBeam({ beam, onArrive, onDone }: { beam: CaptureBeam; onArrive: () => void; onDone: () => void }) {
  const { origin, target, points } = beam;
  const polyline = points.map(point => `${point.x},${point.y}`).join(" ");
  const style = {
    "--origin-x": `${origin.x}px`,
    "--origin-y": `${origin.y}px`,
    "--target-x": `${target.x}px`,
    "--target-y": `${target.y}px`,
    "--return-x": `${origin.x - target.x}px`,
    "--return-y": `${origin.y - target.y}px`,
  } as CSSProperties;
  return (
    <div className="pokemon-capture-layer" style={style} aria-hidden="true">
      <svg className="pokemon-capture-overlay" focusable="false">
        <polyline className="pokemon-capture-beam is-glow" points={polyline} pathLength="1" />
        <polyline className="pokemon-capture-beam is-ray" points={polyline} pathLength="1" />
        <polyline className="pokemon-capture-beam is-core" points={polyline} pathLength="1" onAnimationEnd={event => { if (event.target === event.currentTarget) onDone(); }} />
      </svg>
      <span className="pokemon-capture-beacon" />
      <span className="pokemon-capture-impact" />
      <span className="pokemon-capture-orb" onAnimationEnd={event => { if (event.target === event.currentTarget) onArrive(); }} />
    </div>
  );
}

/** Freed: small copies hop out across the page and fade, as if heading home. */
function PokemonReleaseBurst({ burst }: { burst: ReleaseBurst }) {
  return (
    <div className="pokemon-release-layer" style={{ "--origin-x": `${burst.origin.x}px`, "--origin-y": `${burst.origin.y}px` } as CSSProperties} aria-hidden="true">
      <span className="pokemon-release-flash" />
      {burst.sprites.map(({ dx, dy, delay }, index) => (
        <span key={index} className="pokemon-release-sprite" style={{ "--dx": `${dx}px`, "--dy": `${dy}px`, "--delay": `${delay}ms`, "--release-ms": `${RELEASE_MS}ms` } as CSSProperties}>
          <PokemonSprite species={burst.species} shiny={burst.shiny} />
        </span>
      ))}
    </div>
  );
}

function CapturedEntry({ species, shiny, theme, onRelease }: { species: CapturedPokemon["species"]; shiny: boolean; theme: PokemonTheme; onRelease: (from: HTMLElement) => void }) {
  const name = `${shiny ? "Shiny " : ""}${SPECIES[species].name}`;
  const spriteRef = useRef<HTMLSpanElement>(null);
  const [confirming, setConfirming] = useState(false);
  useEffect(() => {
    if (!confirming) return;
    const timeout = window.setTimeout(() => setConfirming(false), RELEASE_CONFIRM_MS);
    return () => window.clearTimeout(timeout);
  }, [confirming]);
  return (
    <li className="pokemon-collection-entry" style={{ "--collection-accent": THEMES[theme].swatch } as React.CSSProperties}>
      <span ref={spriteRef} className="pokemon-collection-sprite-wrap"><PokemonSprite species={species} shiny={shiny} className="pokemon-collection-sprite" /></span>
      <span className="pokemon-collection-entry-name">{SPECIES[species].name}</span>
      {shiny && <span className="pokemon-collection-shiny">Shiny</span>}
      {/* Two taps, so a rare shiny isn't lost to a stray click. */}
      <button type="button" className={`pokemon-collection-release ${confirming ? "is-confirming" : ""}`}
        aria-label={confirming ? `Confirm releasing ${name}` : `Release ${name}`}
        onClick={event => {
          if (!confirming) { setConfirming(true); return; }
          onRelease(spriteRef.current ?? event.currentTarget);
        }}
        onBlur={() => setConfirming(false)}>
        {confirming ? "Release?" : "Release"}
      </button>
    </li>
  );
}
