"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Code2, Star, Trophy, Users, type LucideIcon } from "lucide-react";
import styles from "./journey-path.module.css";

export type Milestone = { year: string; title: string; text: string; link?: string };

const ICONS: LucideIcon[] = [Trophy, Star, Users, Code2];

/** Where on screen the "lantern" sits: the road is lit down to this line as you scroll. */
const LIGHT_LINE = 0.62;
/** Seconds for the light to close ~63% of the gap to the scroll position: smooths wheel steps. */
const FOLLOW = 0.09;

/**
 * A winding road between floating platforms. It starts unlit (grey) and lights up down to the
 * point you have scrolled to; scrolling back up turns the lights off again. The road is built
 * from the platforms' measured layout, so it follows every breakpoint.
 */
export default function JourneyPath({ milestones }: { milestones: Milestone[] }) {
  const root = useRef<HTMLOListElement>(null);
  const pads = useRef<(HTMLDivElement | null)[]>([]);
  const stops = useRef<(HTMLLIElement | null)[]>([]);
  const litGlow = useRef<SVGPathElement>(null);
  const litBed = useRef<SVGPathElement>(null);
  const [road, setRoad] = useState({ d: "", w: 0, h: 0 });
  // Path length at sampled heights, and each platform's height, both in list coordinates.
  const geometry = useRef({ length: 0, samples: [] as { y: number; at: number }[], padY: [] as number[] });
  const lit = useRef({ current: 0, target: 0, frame: 0, last: 0 });

  const measure = useCallback(() => {
    const list = root.current;
    if (!list) return;
    // Layout offsets, not client rects: the scroll reveal and the platforms' bobbing both use
    // transforms, which would otherwise bend the road toward wherever an animation happens to be.
    const offset = (el: HTMLElement) => {
      let x = 0, y = 0;
      for (let node: HTMLElement | null = el; node && node !== list; node = node.offsetParent as HTMLElement | null) {
        x += node.offsetLeft; y += node.offsetTop;
      }
      return { x, y };
    };
    const points = pads.current.filter(Boolean).map(pad => {
      const { x, y } = offset(pad!);
      // The road enters and leaves through the platform's top disc, not its rocky underside.
      return { x: x + pad!.offsetWidth / 2, y: y + pad!.offsetHeight * 0.42 };
    });
    if (points.length < 2) return;
    geometry.current.padY = points.map(point => point.y);
    let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const k = (b.y - a.y) * 0.62;
      d += ` C${a.x.toFixed(1)} ${(a.y + k).toFixed(1)} ${b.x.toFixed(1)} ${(b.y - k).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }
    setRoad(prev => (prev.d === d && prev.w === list.offsetWidth && prev.h === list.offsetHeight ? prev : { d, w: list.offsetWidth, h: list.offsetHeight }));
  }, []);

  /** Paint the lit stretch and switch each platform on or off. Runs only while the light moves. */
  const paint = useCallback(() => {
    const { length, samples, padY } = geometry.current;
    const state = lit.current;
    if (!length) return;
    const offsetValue = String(Math.max(0, length - state.current));
    litGlow.current?.setAttribute("stroke-dashoffset", offsetValue);
    litBed.current?.setAttribute("stroke-dashoffset", offsetValue);
    // A platform lights once the road's light reaches the height of its disc.
    let reached = 0;
    for (const sample of samples) { if (sample.at <= state.current) reached = sample.y; else break; }
    stops.current.forEach((stop, index) => {
      if (!stop) return;
      const on = state.current > 0 && reached >= padY[index] - 1;
      if ((stop.dataset.lit === "true") !== on) stop.dataset.lit = String(on);
    });
  }, []);

  const tick = useCallback((now: number) => {
    const state = lit.current;
    const dt = Math.min(0.05, (now - (state.last || now)) / 1000);
    state.last = now;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    state.current += (state.target - state.current) * (reduced ? 1 : 1 - Math.exp(-dt / FOLLOW));
    if (Math.abs(state.target - state.current) < 0.5) state.current = state.target;
    paint();
    if (state.current !== state.target) state.frame = requestAnimationFrame(tick);
    else { state.frame = 0; state.last = 0; }
  }, [paint]);

  /** Turn the scroll position into a target length along the road. */
  const aim = useCallback(() => {
    const list = root.current;
    const { length, samples, padY } = geometry.current;
    if (!list || !length) return;
    const lightY = window.innerHeight * LIGHT_LINE - list.getBoundingClientRect().top;
    let target = 0;
    if (lightY >= padY[0]) {
      target = length;
      for (let i = 1; i < samples.length; i++) {
        if (samples[i].y >= lightY) {
          const a = samples[i - 1], b = samples[i];
          const t = b.y === a.y ? 1 : (lightY - a.y) / (b.y - a.y);
          target = a.at + (b.at - a.at) * t;
          break;
        }
      }
      // Light the first platform as soon as the light reaches it, even before the road moves.
      target = Math.max(target, 0.01);
    }
    const state = lit.current;
    if (target === state.target) return;
    state.target = target;
    if (!state.frame) state.frame = requestAnimationFrame(tick);
  }, [tick]);

  // Sample the freshly drawn road so scrolling never has to query the SVG.
  useEffect(() => {
    const path = litBed.current;
    if (!path || !road.d) return;
    const length = path.getTotalLength();
    const samples: { y: number; at: number }[] = [];
    let maxY = -Infinity;
    for (let i = 0; i <= 240; i++) {
      const at = (length * i) / 240;
      maxY = Math.max(maxY, path.getPointAtLength(at).y);
      samples.push({ y: maxY, at });
    }
    geometry.current = { ...geometry.current, length, samples };
    for (const el of [litGlow.current, litBed.current]) el?.setAttribute("stroke-dasharray", `${length} ${length}`);
    lit.current.current = Math.min(lit.current.current, length);
    paint();
    aim();
  }, [road.d, paint, aim]);

  useEffect(() => {
    const list = root.current;
    if (!list) return;
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(list);
    document.fonts?.ready.then(measure).catch(() => {});
    // Only listen to scrolling while the journey is anywhere near the screen.
    let listening = false;
    const onScroll = () => aim();
    const near = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !listening) { listening = true; window.addEventListener("scroll", onScroll, { passive: true }); aim(); }
      if (!entry.isIntersecting && listening) { listening = false; window.removeEventListener("scroll", onScroll); aim(); }
    }, { rootMargin: "50% 0px 50% 0px" });
    near.observe(list);
    window.addEventListener("resize", onScroll);
    return () => {
      resize.disconnect();
      near.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(lit.current.frame);
      lit.current.frame = 0;
    };
  }, [measure, aim]);

  const last = milestones.length - 1;

  return (
    <ol ref={root} className={styles.journey}>
      {road.d && (
        <svg className={styles.road} width={road.w} height={road.h} viewBox={`0 0 ${road.w} ${road.h}`} aria-hidden="true">
          <path className={styles.roadBed} d={road.d} />
          {/* Fully hidden until the first paint sets a real dash length. */}
          <path ref={litGlow} className={styles.litGlow} d={road.d} strokeDasharray="0 1e6" />
          <path ref={litBed} className={styles.litBed} d={road.d} strokeDasharray="0 1e6" />
          <path className={styles.roadLine} d={road.d} />
        </svg>
      )}
      {milestones.map(({ year, title, text, link }, index) => {
        const Icon = ICONS[index % ICONS.length];
        const portal = index === last;
        return (
          <li className={styles.stop} key={year} ref={el => { stops.current[index] = el; }} data-lit="false" data-reveal style={{ "--i": index } as React.CSSProperties}>
            <div className={styles.pad} ref={el => { pads.current[index] = el; }} aria-hidden="true">
              <span className={styles.flag} />
              {portal ? <span className={styles.portal} /> : <span className={styles.badge}><Icon size={26} strokeWidth={2.2} /></span>}
              <span className={styles.disc} />
              <span className={styles.rock} />
            </div>
            <div className={styles.card}>
              <span className={styles.year}>{year}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              {link && <a className={styles.verify} href={link} target="_blank" rel="noopener noreferrer" aria-label={`Verify ${title} on Credly (opens in a new tab)`}>Verify on Credly <ArrowUpRight size={14} aria-hidden="true" /></a>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
