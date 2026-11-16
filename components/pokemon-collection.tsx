"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen } from "lucide-react";
import { PokemonSprite } from "@/components/pokemon-sprite";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RESIDENTS, SPECIES, THEME_ORDER, THEMES, type PokemonTheme } from "@/lib/pokemon-roster";
import type { CapturedPokemon } from "@/lib/pokemon-collection";
import { getPokemonCaptureBoltPoints, type PokemonCapturePoint } from "@/lib/pokemon-capture-animation";

export function PokemonCollection({ capturedPokemon, storageError }: { capturedPokemon: CapturedPokemon[]; storageError: string | null }) {
  const count = capturedPokemon.length;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const captureId = useRef(0);
  const [ping, setPing] = useState(0);
  const [bolt, setBolt] = useState<{ id: number; points: PokemonCapturePoint[]; width: number; height: number } | null>(null);

  useEffect(() => {
    const onCapture = (event: Event) => {
      const { target } = (event as CustomEvent<{ target: PokemonCapturePoint }>).detail;
      const trigger = triggerRef.current?.getBoundingClientRect();
      if (!trigger) return;

      const id = ++captureId.current;
      const start = { x: trigger.left + trigger.width / 2, y: trigger.top + trigger.height / 2 };
      setPing(id);
      setBolt({
        id,
        points: getPokemonCaptureBoltPoints(start, target),
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("pokemon-capture-start", onCapture);
    return () => window.removeEventListener("pokemon-capture-start", onCapture);
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
      {bolt && <svg className="pokemon-capture-overlay" viewBox={`0 0 ${bolt.width} ${bolt.height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <polyline
          key={bolt.id}
          className="pokemon-capture-bolt"
          points={bolt.points.map(point => `${point.x},${point.y}`).join(" ")}
          pathLength="1"
          onAnimationEnd={event => {
            if (event.target !== event.currentTarget) return;
            setBolt(current => current?.id === bolt.id ? null : current);
          }}
        />
      </svg>}
    </>
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
