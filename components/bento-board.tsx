"use client";

import { useState } from "react";
import { ArrowLeft, FileText, Mail, Play, Sparkles } from "lucide-react";
import ContactModal from "@/components/contact-modal";
import { PokemonArt } from "@/components/pokemon-art";
import { PokemonHabitat, ThemeSelector } from "@/components/pokemon-theme";
import { GAMES_HREF, games } from "@/lib/games";
import { personalProjects, projects } from "@/lib/projects";
import styles from "./bento-board.module.css";

const projectCount = projects.length + personalProjects.length;

const railLinks = [
  { href: "/#projects", label: "Work" },
  { href: "/#timeline", label: "Journey" },
  { href: GAMES_HREF, label: "Games" },
  { href: "/cv", label: "CV" },
] as const;

function PortfolioSeal() {
  return (
    <svg className={styles.seal} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <defs>
        <path id="bento-seal-path" d="M60 60m-41 0a41 41 0 1 1 82 0a41 41 0 1 1-82 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeOpacity=".35" />
      <circle cx="60" cy="60" r="52" fill="var(--seal-bg)" />
      <g className={styles.sealText}>
        <text fill="var(--seal-fg)" fontSize="10.5" fontWeight="600" letterSpacing="3.4">
          <textPath href="#bento-seal-path">{`${new Date().getFullYear()} · MON · DEV PORTFOLIO ·`}</textPath>
        </text>
      </g>
      <path d="M30 60h60" stroke="var(--seal-fg)" strokeOpacity=".3" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="12" fill="var(--seal-bg)" stroke="var(--seal-fg)" strokeOpacity=".3" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="7" fill="var(--seal-fg)" />
    </svg>
  );
}

export default function BentoBoard() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className={styles.page}>
      <PokemonHabitat />
      <header className={styles.topbar}>
        <a className={styles.back} href="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Full portfolio
        </a>
        <ThemeSelector />
      </header>

      <main className={styles.board}>
        <nav className={styles.rail} aria-label="Portfolio sections">
          {railLinks.map(({ href, label }) => (
            <a key={label} href={href}>{label}</a>
          ))}
        </nav>

        <section className={`${styles.card} ${styles.profile}`} aria-labelledby="bento-name">
          <p className={styles.profileTab}>
            <Sparkles size={15} aria-hidden="true" />
            Trainer Card
          </p>
          <div className={styles.profileBody}>
            <div className={styles.portrait} aria-hidden="true">
              <span className={styles.portraitDisc} />
              <PokemonArt species="gengar" happy className={`${styles.partner} ${styles.partnerGengar}`} />
              <PokemonArt species="gible" happy className={`${styles.partner} ${styles.partnerGible}`} />
            </div>
            <h1 id="bento-name" className={styles.name}>
              <span className={styles.nameIntro}>I’m,</span>
              Anthony
              <br />
              Cabigayan
            </h1>
            <p className={styles.role}>Software Engineer · call me Mon</p>
            <div className={styles.profileFoot}>
              <button
                type="button"
                className={styles.contact}
                aria-haspopup="dialog"
                onClick={event => {
                  event.currentTarget.focus({ preventScroll: true });
                  setContactOpen(true);
                }}
              >
                Send me a message
                <Mail size={16} aria-hidden="true" />
              </button>
              <PortfolioSeal />
            </div>
          </div>
        </section>

        <div className={styles.showcase}>
          <p className={styles.title} aria-hidden="true">Portfolio</p>

          <div className={styles.grid}>
            <a className={`${styles.card} ${styles.tile} ${styles.media}`} href="/#projects">
              <img src="/images/mon-pokemon-hero.png" alt="" width="1254" height="1254" />
              <span className={styles.play} aria-hidden="true"><Play size={20} fill="currentColor" /></span>
              <span className={styles.mediaCaption}>
                <strong>Selected work</strong>
                <span>Step-by-step walkthroughs of real systems</span>
              </span>
            </a>

            <div className={styles.stats}>
              <a className={`${styles.card} ${styles.tile} ${styles.stat} ${styles.statTop}`} href="/#projects">
                <strong>{projectCount}</strong>
                <span>Projects</span>
              </a>
              <a className={`${styles.card} ${styles.tile} ${styles.stat} ${styles.statBottom}`} href="/#timeline">
                <strong>7+</strong>
                <span>Years building</span>
              </a>
            </div>

            <a className={`${styles.card} ${styles.tile} ${styles.cv}`} href="/cv">
              <FileText size={34} strokeWidth={1.6} aria-hidden="true" />
              <span>CV Studio</span>
            </a>

            <div className={`${styles.card} ${styles.split}`}>
              <a className={`${styles.tile} ${styles.splitArt}`} href={GAMES_HREF} aria-label={`Play ${games.length} Pokémon mini-games`}>
                <img src="/images/puzzle/gengar.png" alt="" width="475" height="475" loading="lazy" />
                <span className={styles.splitTag}><Play size={11} fill="currentColor" aria-hidden="true" />{games.length} mini-games</span>
              </a>
              <a className={`${styles.tile} ${styles.splitInfo}`} href="/#timeline">
                <strong>2019</strong>
                <span>WorldSkills Kazan<br /><b>Team Philippines.</b></span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
