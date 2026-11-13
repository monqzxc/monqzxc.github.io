"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, FileText, Mail, Play, Sparkles } from "lucide-react";
import ContactModal from "@/components/contact-modal";
import { PixelConsole } from "@/components/pixel-console";
import { PixelStage } from "@/components/pixel-stage";
import { PokemonHabitat, ThemeSelector } from "@/components/pokemon-theme";
import { GAMES_HREF, games } from "@/lib/games";
import { PORTFOLIO_HREF } from "@/lib/navigation";
import { googleCertificates } from "@/lib/cv-data";
import { personalProjects, projects } from "@/lib/projects";
import styles from "./bento-board.module.css";

const projectCount = projects.length + personalProjects.length;

const railLinks = [
  { href: `${PORTFOLIO_HREF}#projects`, label: "Work" },
  { href: `${PORTFOLIO_HREF}#timeline`, label: "Journey" },
  { href: GAMES_HREF, label: "Games" },
  { href: "/cv", label: "CV" },
] as const;

function PortfolioSeal() {
  return (
    <svg className={styles.seal} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <defs>
        <path id="bento-seal-path" d="M60 60m-41 0a41 41 0 1 1 82 0a41 41 0 1 1-82 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeOpacity=".72" />
      <circle cx="60" cy="60" r="52" fill="var(--seal-bg)" stroke="var(--seal-accent)" strokeOpacity=".58" />
      <path d="M24 60h25 M71 60h25" fill="none" stroke="var(--seal-accent)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M27 64h18 M75 64h18" fill="none" stroke="var(--seal-fg)" strokeOpacity=".3" strokeWidth=".75" />
      <g className={styles.sealText}>
        <text fill="var(--seal-fg)" fontSize="10.5" fontWeight="600" letterSpacing="3.4">
          <textPath href="#bento-seal-path">{`${new Date().getFullYear()} · MON · DEV PORTFOLIO ·`}</textPath>
        </text>
      </g>
      <circle cx="60" cy="60" r="13" fill="var(--seal-bg)" stroke="var(--seal-accent)" strokeWidth="2" />
      <circle cx="60" cy="60" r="6.5" fill="var(--seal-button)" />
      <circle cx="58" cy="57.5" r="1.6" fill="var(--seal-fg)" opacity=".72" />
    </svg>
  );
}

export default function BentoBoard() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className={styles.page}>
      <PokemonHabitat />

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
            <div className={styles.themePick}>
              <ThemeSelector />
            </div>
            <div className={styles.portrait} aria-hidden="true">
              <span className={styles.portraitDisc} />
              <Image
                className={styles.partner}
                src="/images/anthony-portrait-cutout.png"
                width={768}
                height={768}
                sizes="(max-width: 760px) 58vw, 260px"
                alt=""
                preload
              />
            </div>
            <h1 id="bento-name" className={styles.name}>
              {/* Stretched over the whole card: the trainer card opens the full portfolio. */}
              <a className={styles.profileLink} href={PORTFOLIO_HREF}>
                <span className={styles.nameIntro}>I’m,</span>
                Anthony
                <br />
                Cabigayan
                <span className="sr-only"> — open the full portfolio</span>
              </a>
              <ArrowUpRight className={styles.profileArrow} size={26} aria-hidden="true" />
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
            <a className={`${styles.card} ${styles.tile} ${styles.media}`} href={`${PORTFOLIO_HREF}#craft-hobbies`}>
              <PixelStage className={styles.mediaStage} />
              <span className={styles.play} aria-hidden="true"><Play size={20} fill="currentColor" /></span>
              <span className={styles.mediaCaption}>
                <strong>Off the clock</strong>
                <span>Runs, anime, new places, and a walking game where 5 km hatches an egg</span>
              </span>
            </a>

            <div className={styles.stats}>
              <a className={`${styles.card} ${styles.tile} ${styles.stat} ${styles.statTop}`} href={`${PORTFOLIO_HREF}#projects`}>
                <strong>{projectCount}</strong>
                <span>Projects</span>
              </a>
              <a className={`${styles.card} ${styles.tile} ${styles.stat} ${styles.statBottom}`} href={`${PORTFOLIO_HREF}#certifications`}>
                <strong>{googleCertificates.length}</strong>
                <span>Certifications</span>
              </a>
            </div>

            <a className={`${styles.card} ${styles.tile} ${styles.cv}`} href="/cv">
              <FileText size={34} strokeWidth={1.6} aria-hidden="true" />
              <span>CV Studio</span>
            </a>

            <div className={`${styles.card} ${styles.split}`}>
              <a className={`${styles.tile} ${styles.splitArt}`} href={GAMES_HREF} aria-label={`Play ${games.length} Pokémon mini-games`}>
                <PixelConsole />
                <span className={styles.splitTag}><Play size={11} fill="currentColor" aria-hidden="true" />{games.length} mini-games</span>
              </a>
              <a className={`${styles.tile} ${styles.splitInfo}`} href={`${PORTFOLIO_HREF}#timeline`}>
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
