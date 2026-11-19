"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Code2, Star, Trophy, Users, type LucideIcon } from "lucide-react";
import styles from "./journey-path.module.css";

export type Milestone = { year: string; title: string; text: string; link?: string };

const ICONS: LucideIcon[] = [Trophy, Star, Users, Code2];

/**
 * A winding road between floating platforms. The road is drawn from the platforms' measured
 * centres, so it follows whatever layout CSS settles on at each breakpoint.
 */
export default function JourneyPath({ milestones }: { milestones: Milestone[] }) {
  const root = useRef<HTMLOListElement>(null);
  const pads = useRef<(HTMLDivElement | null)[]>([]);
  const [road, setRoad] = useState({ d: "", w: 0, h: 0, length: 0 });
  const [drawn, setDrawn] = useState(false);
  const measureRef = useRef<SVGPathElement>(null);

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
    const box = { width: list.offsetWidth, height: list.offsetHeight };
    const points = pads.current.filter(Boolean).map(pad => {
      const { x, y } = offset(pad!);
      // The road enters and leaves through the platform's top disc, not its rocky underside.
      return { x: x + pad!.offsetWidth / 2, y: y + pad!.offsetHeight * 0.42 };
    });
    if (points.length < 2) return;
    let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const k = (b.y - a.y) * 0.62;
      d += ` C${a.x.toFixed(1)} ${(a.y + k).toFixed(1)} ${b.x.toFixed(1)} ${(b.y - k).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }
    setRoad(prev => (prev.d === d ? prev : { d, w: box.width, h: box.height, length: 0 }));
  }, []);

  useEffect(() => {
    const list = root.current;
    if (!list) return;
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(list);
    document.fonts?.ready.then(measure).catch(() => {});
    const seen = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setDrawn(true); seen.disconnect(); }
    }, { threshold: 0.15 });
    seen.observe(list);
    return () => { resize.disconnect(); seen.disconnect(); };
  }, [measure]);

  useEffect(() => {
    const length = measureRef.current?.getTotalLength() ?? 0;
    if (length && length !== road.length) setRoad(prev => ({ ...prev, length }));
  }, [road.d, road.length]);

  const last = milestones.length - 1;

  return (
    <ol ref={root} className={styles.journey} data-drawn={drawn}>
      {road.d && (
        <svg className={styles.road} width={road.w} height={road.h} viewBox={`0 0 ${road.w} ${road.h}`} aria-hidden="true" style={{ "--road-length": road.length || 4000 } as React.CSSProperties}>
          <path ref={measureRef} className={styles.roadGlow} d={road.d} />
          <path className={styles.roadBed} d={road.d} />
          <path className={styles.roadLine} d={road.d} />
        </svg>
      )}
      {milestones.map(({ year, title, text, link }, index) => {
        const Icon = ICONS[index % ICONS.length];
        const portal = index === last;
        return (
          <li className={styles.stop} key={year} data-reveal style={{ "--i": index } as React.CSSProperties}>
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
