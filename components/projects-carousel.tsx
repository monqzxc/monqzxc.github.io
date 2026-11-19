"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import ProjectDialog from "@/components/project-dialog";
import { type Project, projectCoverUrl, projectPreviewUrl, showcase } from "@/lib/projects";
import styles from "./projects-carousel.module.css";

const COUNT = showcase.length;
const AUTOPLAY_MS = 5000;
/** Extra scale per slot away from the centre: the middle card is the smallest. */
const GROWTH = 0.3;
const TILT_PER_SLOT = 16;
const MAX_TILT = 42;
/** Seconds for the position to close ~63% of the gap; an exponential ease-out. */
const SETTLE = 0.15;
const ENTRANCE = 0.32;

const mod = (value: number, n: number) => ((value % n) + n) % n;
/** Signed distance folded into [-COUNT/2, COUNT/2) so the ring loops. */
const fold = (d: number) => mod(d + COUNT / 2, COUNT) - COUNT / 2;

export default function ProjectsCarousel() {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const pos = useRef(0);
  const target = useRef(0);
  const spread = useRef(0);
  const metrics = useRef({ base: 150, gap: 18 });
  const frame = useRef(0);
  const last = useRef(0);
  const drag = useRef<{ id: number; x: number; start: number; moved: boolean; vx: number; t: number; lastX: number } | null>(null);
  const suppressClick = useRef(false);
  const reduced = useRef(false);
  const inView = useRef(false);

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState<Project | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeDialog = useCallback(() => setOpen(null), []);
  const focusOpener = useCallback(() => opener.current, []);

  const paint = useCallback(() => {
    const { base, gap } = metrics.current;
    const unit = base + gap;
    const e = spread.current;
    for (let i = 0; i < COUNT; i++) {
      const el = cards.current[i];
      if (!el) continue;
      const d = fold(i - pos.current);
      const a = Math.abs(d);
      const sign = Math.sign(d);
      const scale = 1 + GROWTH * a * e;
      const x = sign * unit * (a + (GROWTH / 2) * a * a) * 0.93 * e;
      const tilt = -sign * Math.min(a * TILT_PER_SLOT, MAX_TILT) * e;
      // Fade the card that wraps from one end of the ring to the other.
      const edge = Math.min(1, Math.max(0, (COUNT / 2 - a) / 0.7));
      el.style.transform = `translate3d(${x.toFixed(2)}px,0,0) scale(${scale.toFixed(4)}) rotateY(${tilt.toFixed(2)}deg)`;
      el.style.opacity = String(edge * (e < 1 ? Math.min(1, 0.25 + e) : 1));
      el.style.zIndex = String(e < 1 ? 100 - Math.round(a * 10) : Math.round(a * 10));
      el.dataset.near = a < 0.5 ? "true" : "false";
    }
    const next = mod(Math.round(pos.current), COUNT);
    setActive(prev => (prev === next ? prev : next));
  }, []);

  const tick = useCallback((now: number) => {
    const dt = Math.min(0.05, (now - (last.current || now)) / 1000);
    last.current = now;
    if (!drag.current) {
      const k = reduced.current ? 1 : 1 - Math.exp(-dt / SETTLE);
      pos.current += (target.current - pos.current) * k;
    }
    if (inView.current || spread.current > 0) {
      const k = reduced.current ? 1 : 1 - Math.exp(-dt / ENTRANCE);
      spread.current += (1 - spread.current) * k;
    }
    paint();
    // The ring waits stacked until it is first seen, then fans out once.
    const spreadGoal = inView.current || spread.current > 0 ? 1 : 0;
    const settled = Math.abs(target.current - pos.current) < 0.0005 && Math.abs(spreadGoal - spread.current) < 0.0005;
    if (settled && !drag.current) {
      pos.current = target.current;
      spread.current = spreadGoal;
      paint();
      frame.current = 0;
      last.current = 0;
      return;
    }
    frame.current = requestAnimationFrame(tick);
  }, [paint]);

  const kick = useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(tick);
  }, [tick]);

  const go = useCallback((step: number) => {
    target.current = Math.round(target.current) + step;
    kick();
  }, [kick]);

  const goTo = useCallback((index: number) => {
    const current = Math.round(target.current);
    target.current = current + fold(index - mod(current, COUNT));
    kick();
  }, [kick]);

  // Sizing follows the stage width, so the ring fills phones and wide screens alike.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) setPlaying(false);
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const base = Math.round(Math.min(156, Math.max(92, width * (width < 600 ? 0.27 : 0.1))));
      metrics.current = { base, gap: Math.round(base * 0.12) };
      el.style.setProperty("--card-w", `${base}px`);
      paint();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [paint]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
      setVisible(entry.isIntersecting);
    }, { threshold: 0.35 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => { kick(); }, [visible, kick]);
  useEffect(() => () => { cancelAnimationFrame(frame.current); frame.current = 0; }, []);

  // Horizontal wheel or trackpad swipes scrub the ring; vertical scrolling is left alone.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let snap = 0;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      const { base, gap } = metrics.current;
      target.current += event.deltaX / ((base + gap) * 1.4);
      window.clearTimeout(snap);
      snap = window.setTimeout(() => { target.current = Math.round(target.current); kick(); }, 140);
      kick();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("wheel", onWheel); window.clearTimeout(snap); };
  }, [kick]);

  const autoplay = playing && !hovered && !focused && visible && !open;
  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(() => { if (!document.hidden) go(1); }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [autoplay, active, go]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    drag.current = { id: event.pointerId, x: event.clientX, start: pos.current, moved: false, vx: 0, t: performance.now(), lastX: event.clientX };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || state.id !== event.pointerId) return;
    const dx = event.clientX - state.x;
    if (!state.moved && Math.abs(dx) < 6) return;
    if (!state.moved) {
      state.moved = true;
      stage.current?.setPointerCapture(event.pointerId);
    }
    const { base, gap } = metrics.current;
    const unit = (base + gap) * 1.15;
    const now = performance.now();
    const elapsed = Math.max(1, now - state.t);
    state.vx = 0.8 * ((event.clientX - state.lastX) / elapsed) + 0.2 * state.vx;
    state.t = now;
    state.lastX = event.clientX;
    pos.current = state.start - dx / unit;
    target.current = pos.current;
    kick();
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || state.id !== event.pointerId) return;
    drag.current = null;
    if (state.moved) {
      // Swallow the click a drag may end with, but never a later one.
      suppressClick.current = true;
      window.setTimeout(() => { suppressClick.current = false; }, 0);
      const { base, gap } = metrics.current;
      const fling = (-state.vx * 1000 / ((base + gap) * 1.15)) * 0.22;
      target.current = Math.round(pos.current + Math.max(-2, Math.min(2, fling)));
      kick();
    }
  }

  function onCardClick(index: number, event: MouseEvent<HTMLButtonElement>) {
    if (suppressClick.current) { suppressClick.current = false; return; }
    if (index === active) {
      opener.current = event.currentTarget;
      setOpen(showcase[index].project);
    } else {
      goTo(index);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    go(moves[event.key]);
    const next = mod(Math.round(target.current), COUNT);
    requestAnimationFrame(() => cards.current[next]?.focus({ preventScroll: true }));
  }

  const { project, personal } = showcase[active];
  const url = projectPreviewUrl(project);
  const position = `${String(active + 1).padStart(2, "0")} / ${String(COUNT).padStart(2, "0")}`;

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects"
      onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false); }}
    >
      <div
        ref={stage}
        className={styles.stage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        {showcase.map(({ project: item }, index) => (
          <button
            key={item.id}
            ref={el => { cards.current[index] = el; }}
            type="button"
            className={styles.card}
            tabIndex={index === active ? 0 : -1}
            aria-label={index === active ? `Open the ${item.title} walkthrough` : `Show ${item.title}, ${index + 1} of ${COUNT}`}
            aria-current={index === active ? "true" : undefined}
            onClick={event => onCardClick(index, event)}
          >
            <img src={projectCoverUrl(item)} alt="" width={600} height={800} draggable={false} loading={index < 4 || index > COUNT - 3 ? "eager" : "lazy"} decoding="async" />
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.control} onClick={() => go(-1)} aria-label="Previous project"><ArrowLeft size={18} aria-hidden="true" /></button>
        <span className={styles.position} aria-hidden="true">{position}</span>
        <button type="button" className={styles.control} onClick={() => go(1)} aria-label="Next project"><ArrowRight size={18} aria-hidden="true" /></button>
        <button type="button" className={`${styles.control} ${styles.toggle}`} onClick={() => setPlaying(value => !value)} aria-pressed={!playing} aria-label={playing ? "Pause rotation" : "Resume rotation"}>
          {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
        </button>
      </div>

      <div className={styles.details} aria-live={autoplay ? "off" : "polite"}>
        <div key={project.id} className={styles.detailsInner}>
          <div className={styles.identity}>
            <h3>{project.title}</h3>
            <p className={styles.meta}>{project.category}{personal ? " · after hours" : ""}</p>
          </div>
          <div className={styles.body}>
            <p className={styles.summary}>{project.summary}</p>
            <p className={styles.stack}>{project.tags.join("  ·  ")}</p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primary}
                onClick={event => { opener.current = event.currentTarget; setOpen(project); }}
              >
                <Play size={15} aria-hidden="true" /> Try the walkthrough
              </button>
              <a className={styles.secondary} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} in a new tab`}>
                Open in new tab <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <ProjectDialog project={open} onClose={closeDialog} returnFocus={focusOpener} />
    </div>
  );
}
