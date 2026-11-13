"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, BadgeCheck, Building2, Code2, Home, Layers, Menu, Trophy, X } from "lucide-react";
import ProjectCard from "@/components/project-card";
import GamesTeaser from "@/components/games-teaser";
import FloatingMenu from "@/components/floating-menu";
import ContactModal from "@/components/contact-modal";
import SocialLinks from "@/components/social-links";
import { portfolioSections } from "@/lib/navigation";
import { personalProjects, projects } from "@/lib/projects";
import { googleCertificates, monCv } from "@/lib/cv-data";
import VueCraft from "@/components/vue-craft";
import Hero from "@/components/hero";
import { PokemonHabitat, ThemeSelector } from "@/components/pokemon-theme";
import { PokemonSprite } from "@/components/pokemon-sprite";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import styles from "./portfolio.module.css";

const milestones = [
  { year: "2018", icon: Trophy, title: "ASEAN Skills Competition, Bangkok", text: "Medallion for Excellence." },
  { year: "2019", icon: Trophy, title: "WorldSkills Kazan", text: "Represented the Philippines in IT Software Solutions for Business.", link: monCv.awards.find(award => award.title === "WorldSkills Kazan")?.url },
  { year: "2020", icon: Building2, title: "Joined TESDA", text: "Started building HR and operations systems for the public sector." },
  { year: "2022", icon: Code2, title: "Laravel, Vue and Inertia", text: "Moved our apps to reactive interfaces on a dependable backend." },
  { year: "2024—now", icon: Layers, title: "Full-stack, Laravel to AI", text: "Performance, recruitment and personnel platforms, plus TESDA-TRACK, an AI recommender in Python." },
];

export default function Portfolio() {
  const revealRef = useScrollReveal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [active, setActive] = useState("about");
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-20% 0px -60% 0px", threshold: 0 });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  const openContact = () => setContactOpen(true);

  return (
    <div className="portfolio-page">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <nav className="shell nav" aria-label="Main navigation">
          {/* The wordmark leads home to the trainer card. */}
          <a className="wordmark" href="/" aria-label="Mon — back to the trainer card"><strong>mon<span>.</span></strong><span className="brand-caption">ANTHONY CABIGAYAN<br />SOFTWARE ENGINEER</span></a>
          <button className="menu-toggle" ref={menuButton} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <div id="site-navigation" className={`nav-links ${menuOpen ? "open" : ""}`}>
            {portfolioSections.map(({ id, label }) => <a className={active === id ? "active" : ""} key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} aria-current={active === id ? "location" : undefined}>{label}</a>)}
            <a href="/cv" onClick={() => setMenuOpen(false)}>CV Studio</a>
            <button className={`nav-contact ${styles.navContact}`} type="button" aria-haspopup="dialog" onClick={event => { (menuOpen ? menuButton.current : event.currentTarget)?.focus({ preventScroll: true }); setMenuOpen(false); openContact(); }}>Let’s talk <ArrowUpRight size={16} aria-hidden="true" /></button>
          </div>
          <ThemeSelector />
        </nav>
      </header>
      <PokemonHabitat />

      <main id="main" ref={revealRef}>
        <Hero onContact={openContact} />

        <section id="projects" className="shell section">
          <div className="section-heading">
            <h2>Selected work</h2>
            <p>Seven systems built for public service, and one for fun. Open any to click through it.</p>
          </div>
          <div className="project-grid">
            {projects.map(project => <ProjectCard key={project.id} project={project} />)}
            {personalProjects.map(project => <ProjectCard key={project.id} project={project} group="After hours" />)}
          </div>
        </section>

        <section id="timeline" className="shell section">
          <div className="section-heading"><h2>Journey</h2></div>
          <ol className="timeline">
            {milestones.map(({ year, icon: Icon, title, text, link }) => (
              <li className="timeline-row" key={year}>
                <span className="timeline-year">{year}</span>
                <span className="timeline-icon" aria-hidden="true"><Icon /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  {link && <a className={styles.verifyLink} href={link} target="_blank" rel="noopener noreferrer" aria-label={`Verify ${title} on Credly (opens in a new tab)`}>Verify on Credly <ArrowUpRight size={14} aria-hidden="true" /></a>}
                </div>
              </li>
            ))}
          </ol>
          <div id="certifications" className={styles.certifications}>
            <div className={styles.certHeading}><h3 id="certifications-heading">Certifications</h3></div>
            <ul className={styles.certGrid} aria-labelledby="certifications-heading">
              {googleCertificates.map(({ title, issuer, issued, coursera, credly }) => (
                <li className={styles.certCard} key={title} data-reveal>
                  <span className={styles.certIcon} aria-hidden="true"><BadgeCheck /></span>
                  <div>
                    <h4>{title}</h4>
                    <p>{issuer} · {issued}</p>
                    <div className={styles.certLinks}>
                      {credly && <a className={styles.verifyLink} href={credly} target="_blank" rel="noopener noreferrer" aria-label={`Verify ${title} on Credly (opens in a new tab)`}>Credly <ArrowUpRight size={14} aria-hidden="true" /></a>}
                      <a className={styles.verifyLink} href={coursera} target="_blank" rel="noopener noreferrer" aria-label={`View ${title} certificate on Coursera (opens in a new tab)`}>Coursera <ArrowUpRight size={14} aria-hidden="true" /></a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="craft-hobbies" className="shell section craft-section">
          <div className="craft-layout">
            <div className="craft-intro">
              <h2>Off the clock</h2>
              <p>Long runs, new places, anime, and small experiments.</p>
            </div>
            <VueCraft />
          </div>
          <GamesTeaser />
        </section>

        <section id="contact" className="shell contact-section">
          <div className="contact-top"><h2>Let’s build something.</h2></div>
          <div className="contact-bottom">
            <p>Open to collaborations and enterprise projects, here or on Upwork.</p>
            <div className="contact-links">
              <div className={styles.companions} aria-hidden="true">
                {(["gengar", "gible", "flygon"] as const).map(species => (
                  <span className={styles.companion} key={species}><PokemonSprite species={species} /></span>
                ))}
              </div>
              <SocialLinks onContact={openContact} />
            </div>
          </div>
        </section>
      </main>

      <footer className={`footer ${styles.pageFooter}`}>
        <div className="shell">
          <div className="footer-left"><a className="footer-mark" href="/" aria-label="Mon — back to the trainer card">mon.</a><p>© {new Date().getFullYear()} Anthony Cabigayan</p></div>
          <div className="footer-right"><a href="/"><Home size={14} aria-hidden="true" /> Trainer card</a><a href="#about">Back to top <ArrowUp size={14} aria-hidden="true" /></a></div>
        </div>
      </footer>
      <FloatingMenu active={active} onContact={openContact} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
