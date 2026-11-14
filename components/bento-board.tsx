"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, FileText, Play, Sparkles } from "lucide-react";
import { PixelConsole } from "@/components/pixel-console";
import { PixelStage } from "@/components/pixel-stage";
import { PokemonHabitat, ThemeSelector } from "@/components/pokemon-theme";
import { GAMES_HREF, PORTFOLIO_HREF } from "@/lib/navigation";
import { personalProjects, projects } from "@/lib/projects";
import styles from "./bento-board.module.css";

const projectCount = projects.length + personalProjects.length;

// Developer work began with freelance projects in April 2022 (see lib/cv-data.ts).
const DEV_SINCE = new Date(2022, 3, 1);

function yearsSince(start: Date, now = new Date()) {
  const months = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
  return Math.max(1, Math.floor(months / 12));
}
const rotatingTitles = ["Full-Stack Developer", "Pokémon Trainer", "Distance Runner", "Anime Fan", "Gamer"] as const;

const railLinks = [
  { href: `${PORTFOLIO_HREF}#projects`, label: "Work" },
  { href: `${PORTFOLIO_HREF}#timeline`, label: "Journey" },
  { href: GAMES_HREF, label: "Games" },
  { href: "/cv", label: "CV" },
  { href: `${PORTFOLIO_HREF}#contact`, label: "Contact" },
] as const;

function PortfolioSeal() {
  return (
    <svg className={styles.seal} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <defs>
        <path id="bento-seal-path" d="M60 60m-41 0a41 41 0 1 1 82 0a41 41 0 1 1-82 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeOpacity=".72" />
      <circle cx="60" cy="60" r="52" fill="var(--seal-bg)" stroke="var(--seal-accent)" strokeOpacity=".58" />
      <path d="M22 60h23 M75 60h23" fill="none" stroke="var(--seal-red)" strokeWidth="3" strokeLinecap="round" />
      <path d="M25 64h19 M76 64h19" fill="none" stroke="var(--seal-accent)" strokeOpacity=".5" strokeWidth="1.25" strokeLinecap="round" />
      <g className={styles.sealText}>
        <text fill="var(--seal-fg)" fontSize="10.5" fontWeight="600" letterSpacing="3.4">
          <textPath href="#bento-seal-path">{`${new Date().getFullYear()} · MON · DEV PORTFOLIO ·`}</textPath>
        </text>
      </g>
      <circle cx="60" cy="60" r="13" fill="var(--seal-bg)" stroke="var(--seal-red)" strokeWidth="2.25" />
      <circle cx="60" cy="60" r="6.5" fill="var(--seal-red)" />
      <circle cx="58" cy="57.5" r="1.6" fill="var(--seal-bg)" opacity=".9" />
    </svg>
  );
}

export default function BentoBoard() {
  const [titleIndex, setTitleIndex] = useState(0);

  return (
    <div className={styles.page}>
      <PokemonHabitat />

      <main className={styles.board}>
        <nav className={styles.rail} aria-label="Portfolio navigation">
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
              <span className={styles.portraitRing} />
              <span className={styles.portraitDisc} />
              <span className={styles.portraitCutout}>
                <Image
                  className={styles.partner}
                  src="/images/anthony-portrait-cutout.png"
                  width={768}
                  height={768}
                  sizes="(max-width: 760px) 80vw, 360px"
                  alt=""
                  preload
                />
              </span>
            </div>
            <div className={styles.profileFoot}>
              <h1 id="bento-name" className={styles.name}>
                {/* Stretched over the whole card: the trainer card opens the full portfolio. */}
                <a className={styles.profileLink} href={PORTFOLIO_HREF}>
                  <span className={styles.namePrimary}>
                    <span className={styles.nameIntro}>I’m</span> Mon,
                    <ArrowUpRight className={styles.profileArrow} size={26} aria-hidden="true" />
                  </span>
                  <span className={styles.nameReal}>Anthony Cabigayan</span>
                  <span className="sr-only"> — open the full portfolio</span>
                </a>
              </h1>
              <div className={styles.identity}>
                <p className={styles.role}>Software engineer, Manila.</p>
              </div>
              <PortfolioSeal />
            </div>
          </div>
        </section>

        <div className={styles.showcase}>
          <p className={styles.title} aria-hidden="true">
            <span className={styles.titleMeasure}>
              Full-Stack Developer<span className={styles.titleArrow} />
            </span>
            <span
              key={rotatingTitles[titleIndex]}
              className={styles.titleText}
              onAnimationEnd={() => setTitleIndex(index => (index + 1) % rotatingTitles.length)}
            >
              {rotatingTitles[titleIndex]}<span className={styles.titleArrow} />
            </span>
          </p>

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
              <a className={`${styles.card} ${styles.tile} ${styles.stat} ${styles.statBottom}`} href={`${PORTFOLIO_HREF}#timeline`}>
                {/* Counted at render; a build from before an anniversary may differ by a year. */}
                <strong suppressHydrationWarning>{yearsSince(DEV_SINCE)}+</strong>
                <span>Years as a developer</span>
              </a>
            </div>

            <a className={`${styles.card} ${styles.tile} ${styles.cv}`} href="/cv">
              <FileText size={34} strokeWidth={1.6} aria-hidden="true" />
              <span>CV Studio</span>
            </a>

            <div className={`${styles.card} ${styles.split}`}>
              <a className={`${styles.tile} ${styles.splitArt}`} href={GAMES_HREF} aria-label="Explore 10+ games on Raro">
                <PixelConsole />
                <span className={styles.splitTag}><ArrowUpRight size={11} aria-hidden="true" />10+ games</span>
              </a>
              <a className={`${styles.tile} ${styles.splitInfo}`} href={`${PORTFOLIO_HREF}#timeline`}>
                <strong>2019</strong>
                <span>WorldSkills Kazan<br /><b>Team Philippines.</b></span>
              </a>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
