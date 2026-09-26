"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BriefcaseBusiness, Compass, FileUser, Gamepad2, House, Mail, MessageCircle, Route, X } from "lucide-react";
import ContactModal from "@/components/contact-modal";
import { portfolioSections } from "@/lib/navigation";
import styles from "./floating-menu.module.css";

const sectionIcons = [House, BriefcaseBusiness, Route, Compass];
const shortcuts = [
  ...portfolioSections.map((section, index) => ({
    ...section,
    href: `#${section.id}`,
    icon: sectionIcons[index],
  })),
  { id: "cv", label: "CV Studio", href: "/cv/", icon: FileUser },
  { id: "contact", label: "Let’s talk", href: "#contact", icon: MessageCircle },
  { id: "play", label: "Game", href: "/play/", icon: Gamepad2 },
];

// Five destinations on the outer arc, three actions on the inner arc.
const positions = [
  [0, -1], [-0.383, -0.924], [-0.707, -0.707], [-0.924, -0.383], [-1, 0],
  [0, -0.52], [-0.368, -0.368], [-0.52, 0],
];

function itemStyle(index: number): CSSProperties {
  return {
    "--x": positions[index][0],
    "--y": positions[index][1],
    "--delay": `${index * 25}ms`,
  } as CSSProperties;
}

export default function FloatingMenu({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <>
      <div
        ref={container}
        className={styles.floatingMenu}
        data-open={open}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
      >
        <button
          ref={trigger}
          type="button"
          className={styles.trigger}
          aria-label={open ? "Close quick navigation" : "Open quick navigation"}
          aria-expanded={open}
          aria-controls="floating-navigation"
          onClick={() => setOpen(value => !value)}
        >
          <span className={styles.pokeball} aria-hidden="true" />
          <X className={styles.closeIcon} size={30} aria-hidden="true" />
          <span className={styles.triggerLabel} aria-hidden="true">Explore</span>
        </button>
        <nav id="floating-navigation" className={styles.shortcuts} aria-label="Quick navigation" aria-hidden={!open} inert={!open}>
          {shortcuts.map(({ id, label, href, icon: Icon }, index) => (
            <a
              key={id}
              href={href}
              className={styles.shortcut}
              style={itemStyle(index)}
              aria-current={active === id ? "location" : undefined}
              onClick={closeMenu}
            >
              <span className={styles.bubble}><Icon size={21} aria-hidden="true" /></span>
              <span className={styles.label}>{label}</span>
            </a>
          ))}
          <button
            type="button"
            className={`${styles.shortcut} ${styles.email}`}
            style={itemStyle(7)}
            aria-haspopup="dialog"
            onClick={() => {
              closeMenu();
              setContactOpen(true);
            }}
          >
            <span className={styles.bubble}><Mail size={21} aria-hidden="true" /></span>
            <span className={styles.label}>Email</span>
          </button>
        </nav>
        <div className={styles.glow} aria-hidden="true" />
      </div>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
