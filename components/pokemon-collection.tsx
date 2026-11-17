"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { BookOpen } from "lucide-react";
import { PokemonSprite } from "@/components/pokemon-sprite";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RESIDENTS, SPECIES, THEME_ORDER, THEMES, type PokemonTheme } from "@/lib/pokemon-roster";
import type { CapturedPokemon } from "@/lib/pokemon-collection";
import { clampPokemonCapturePoint, getPokemonCaptureBoltPoints, POKEMON_CAPTURE_END_EVENT, POKEMON_CAPTURE_START_EVENT, type PokemonCapturePoint } from "@/lib/pokemon-capture-animation";

type CaptureBeam = { id: number; origin: PokemonCapturePoint; target: PokemonCapturePoint; points: PokemonCapturePoint[] };

export function PokemonCollection({ capturedPokemon, storageError }: { capturedPokemon: CapturedPokemon[]; storageError: string | null }) {
  const count = capturedPokemon.length;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const captureId = useRef(0);
  const [ping, setPing] = useState(0);
  const [beam, setBeam] = useState<CaptureBeam | null>(null);

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
        <DialogContent className="pokemon-collection-dialog">
          <DialogTitle>Pokédex</DialogTitle>
          <DialogDescription>Your captures are saved in this browser and stay on this device.</DialogDescription>
          {storageError && <p className="pokemon-collection-dialog-error" role="alert">{storageError}</p>}
          {count === 0 ? <p className="pokemon-collection-empty">No Pokémon captured yet. Say hello to a visitor and choose Catch!</p> : (
            <div className="pokemon-collection-groups">
              {THEME_ORDER.map(theme => {
                const captures = capturedPokemon.filter(({ species }) => RESIDENTS[theme].includes(species));
                if (captures.length === 0) return null;
                return (
                  <section key={theme} className="pokemon-collection-group" aria-labelledby={`pokedex-${theme}`}>
                    <h3 id={`pokedex-${theme}`}>{THEMES[theme].habitat}</h3>
                    <ul className="pokemon-collection-list">
                      {captures.map(({ species, shiny }) => <CapturedEntry key={`${species}-${shiny}`} species={species} shiny={shiny} theme={theme} />)}
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

function CapturedEntry({ species, shiny, theme }: { species: CapturedPokemon["species"]; shiny: boolean; theme: PokemonTheme }) {
  return (
    <li className="pokemon-collection-entry" style={{ "--collection-accent": THEMES[theme].swatch } as React.CSSProperties}>
      <PokemonSprite species={species} shiny={shiny} className="pokemon-collection-sprite" />
      <span className="pokemon-collection-entry-name">{shiny ? "Shiny " : ""}{SPECIES[species].name}</span>
      {shiny && <span className="pokemon-collection-shiny">Shiny</span>}
    </li>
  );
}
