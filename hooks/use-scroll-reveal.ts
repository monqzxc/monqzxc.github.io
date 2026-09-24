"use client";

import { useEffect, useRef } from "react";

/** Progressively enhance offscreen content; the server-rendered page stays visible. */
export function useScrollReveal() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = root.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!container || motion.matches || !("IntersectionObserver" in window)) return;

    const targets = Array.from(container.querySelectorAll<HTMLElement>([
      ".tech-strip", ".section-heading", ".project-card", ".about-band > *",
      ".timeline-row", ".craft-intro", ".vue-craft", ".contact-section > *",
    ].join(",")));

    const observer = new IntersectionObserver((entries) => {
      let stagger = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        element.style.setProperty("--reveal-delay", `${Math.min(stagger++, 3) * 75}ms`);
        element.dataset.revealState = "visible";
        observer.unobserve(element); // Reveal once, without replaying on scroll back.
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -32px 0px" });

    targets.forEach((element) => {
      // Preserve the initial viewport and restored scroll positions without a flash.
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.dataset.scrollReveal = "";
      element.dataset.revealState = "pending";
      observer.observe(element);
    });

    const showImmediately = (element: HTMLElement) => {
      element.style.setProperty("--reveal-delay", "0ms");
      element.dataset.revealState = "visible";
      observer.unobserve(element);
    };
    const onFocus = (event: FocusEvent) => {
      const element = (event.target as HTMLElement).closest<HTMLElement>("[data-scroll-reveal]");
      if (element) showImmediately(element);
    };
    const onMotionChange = () => {
      if (!motion.matches) return;
      observer.disconnect();
      targets.forEach(showImmediately);
    };
    container.addEventListener("focusin", onFocus);
    motion.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      container.removeEventListener("focusin", onFocus);
      motion.removeEventListener("change", onMotionChange);
      targets.forEach((element) => {
        delete element.dataset.scrollReveal;
        delete element.dataset.revealState;
        element.style.removeProperty("--reveal-delay");
      });
    };
  }, []);

  return root;
}
