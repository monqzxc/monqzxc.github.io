"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, Menu, X, Trophy, Code2, Building2, Layers } from "lucide-react";
import ProjectCard from "@/components/project-card";
import PuzzleTeaser from "@/components/puzzle-teaser";
import { projects } from "@/lib/projects";
import VueCraft from "@/components/vue-craft";
import Hero from "@/components/hero";
import { PokemonHabitat, ThemeSelector } from "@/components/pokemon-theme";
import { PokemonArt } from "@/components/pokemon-art";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import styles from "./portfolio.module.css";

const milestones = [
  { year: "2019", icon: Trophy, title: "WorldSkills Kazan", text: "Represented Team Philippines in Web Technologies at the 45th WorldSkills Competition in Kazan, Russia.", type: "THE GLOBAL STAGE" },
  { year: "2020", icon: Building2, title: "Building for the public sector", text: "Joined TESDA, working on the systems behind human resources and everyday agency operations.", type: "TESDA · PHILIPPINES" },
  { year: "2022", icon: Code2, title: "A more connected stack", text: "Brought Laravel, Vue, and Inertia together to build reactive interfaces on a reliable backend.", type: "STACK MODERNIZATION" },
  { year: "2024—now", icon: Layers, title: "From features to complete systems", text: "Developing performance management, recruitment, and personnel platforms for agency-wide use.", type: "ENTERPRISE ENGINEERING" },
];
export default function Portfolio() {
  const revealRef = useScrollReveal();
  const [menuOpen,setMenuOpen] = useState(false);
  const [active,setActive] = useState("about");
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(()=>{const sections=document.querySelectorAll("main section[id]");const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)setActive(entry.target.id);});},{rootMargin:"-20% 0px -60% 0px",threshold:0});sections.forEach(section=>observer.observe(section));return()=>observer.disconnect();},[]);
  useEffect(()=>{if(!menuOpen)return;const close=(e:KeyboardEvent)=>{if(e.key==="Escape"){setMenuOpen(false);menuButton.current?.focus();}};window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close);},[menuOpen]);
  const links=[["about","About"],["projects","Selected work"],["timeline","Journey"],["craft-hobbies","Beyond code"]];
  return <div className="portfolio-page"><a className="skip-link" href="#main">Skip to content</a><header className="site-header"><nav className="shell nav" aria-label="Main navigation"><a className="wordmark" href="#about" aria-label="Mon — back to top"><strong>mon<span>.</span></strong><span className="brand-caption">ANTHONY CABIGAYAN<br/>SOFTWARE ENGINEER</span></a><button className="menu-toggle" ref={menuButton} aria-label={menuOpen?"Close menu":"Open menu"} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X size={22}/>:<Menu size={22}/>}</button><div id="site-navigation" className={`nav-links ${menuOpen?"open":""}`}>{links.map(([id,label])=><a className={active===id?"active":""} key={id} href={`#${id}`} onClick={()=>setMenuOpen(false)} aria-current={active===id?"location":undefined}>{label}</a>)}<a href="/cv" onClick={()=>setMenuOpen(false)}>CV Studio</a><a className="nav-contact" href="#contact" onClick={()=>setMenuOpen(false)}>Let’s talk <ArrowUpRight size={16}/></a></div><ThemeSelector/></nav></header><PokemonHabitat/>
  <main id="main" ref={revealRef}><Hero/>
  <div className="tech-strip"><div className="shell"><span className="tech-label">TOOLS OF<br/>THE TRADE</span>{[["◇","Laravel"],["∨","Vue.js"],["↗","Inertia.js"],["⌘","React"],["N","Next.js"],["▱","Docker"]].map(([symbol,label])=><span className="tech-item" key={label}><span aria-hidden="true" className="tech-symbol">{symbol}</span>{label}</span>)}</div></div>
  <section id="projects" className="shell section"><div className="section-heading"><div><div className="eyebrow"><span className="short-line"/>01 / SELECTED WORK</div><h2>Real workflows.<br/><span>Thoughtful solutions.</span></h2></div><p>Six systems built for public service. Open a preview to explore the workflow, from the first step to the final result.</p></div><div className="project-grid">{projects.map(project=><ProjectCard key={project.id} project={project}/>)}</div></section>
  <div className="shell about-band"><div><div className="eyebrow"><span className="short-line"/>THE WAY I BUILD</div><h2>Good software starts<br/>with understanding.</h2></div><p>From the first conversation to the final deployment, I care about how a system fits into someone’s day. My focus is simple: <strong>clear interfaces, dependable foundations, and workflows that make sense.</strong> That’s the thread connecting my work across Laravel, Vue, and enterprise systems.</p></div>
  <section id="timeline" className="shell section"><div className="section-heading"><div><div className="eyebrow"><span className="short-line"/>02 / THE JOURNEY</div><h2>Always building. <span>Always learning.</span></h2></div></div><div className="timeline">{milestones.map(({year,icon:Icon,title,text,type})=><article className="timeline-row" key={year}><span className="timeline-year">{year}</span><span className="timeline-icon"><Icon/></span><div><h3>{title}</h3><p>{text}</p></div><span className="timeline-type">{type}</span></article>)}</div></section>
  <section id="craft-hobbies" className="shell section craft-section"><div className="craft-layout"><div className="craft-intro"><div className="eyebrow"><span className="short-line"/>03 / BEYOND THE TERMINAL</div><h2>Curiosity doesn't<br/>clock out.</h2><p>New places, long runs, anime, and the small experiments that keep me curious.</p></div><VueCraft/></div><PuzzleTeaser/></section>
  <section id="contact" className="shell contact-section">
    <div className="eyebrow"><span className="short-line"/>04 / THE NEXT QUEST</div>
    <div className="contact-top">
      <h2>Something in mind?<br/><span>Let’s team up.</span></h2>
      <span className={styles.pokeball} aria-hidden="true" />
    </div>
    <div className="contact-bottom">
      <p>Open to thoughtful collaborations and enterprise projects. Found me on Upwork? Send me a message there to start our next quest.</p>
      <div className="contact-links">
        <div className={styles.party}>
          <div className={styles.companions} aria-hidden="true">
            {(["gengar", "gible", "sandshrew"] as const).map(species => (
              <span className={styles.companion} key={species}><PokemonArt species={species} happy /></span>
            ))}
          </div>
          <span className={styles.partyCaption}>Ready for the next quest</span>
        </div>
        <a className="text-link" href="https://github.com/monqzxc" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16}/></a>
      </div>
    </div>
  </section></main>
  <footer className="footer"><div className="shell"><div className="footer-left"><span className="footer-mark">mon.</span><p>© {new Date().getFullYear()} Anthony Cabigayan</p></div><div className="footer-right"><span>Thoughtfully built in the Philippines.</span><a href="#about">Back to top <ArrowUp size={14}/></a></div></div></footer></div>;
}
