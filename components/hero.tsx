import { ArrowDown, ArrowUpRight, Building2, Code2, Download, FileText, Ghost, Hexagon, MapPin, MousePointer2, Trophy } from "lucide-react";

export default function Hero() {
  return (
    <section id="about" className="shell hero illustrated-hero">
      <div className="hero-main">
        <div className="hero-copy entrance">
          <div className="eyebrow hero-role"><span className="short-line" />SOFTWARE ENGINEER</div>
          <h1><span>Anthony</span><span>Cabigayan<span className="name-period">.</span></span></h1>
          <p className="hero-moniker">You can call me <strong>Mon.</strong></p>
          <p className="hero-description">I turn complex workflows into thoughtful digital experiences. Built with care. Made to work.</p>
          <p className="hero-personality">Serious about systems. Soft spot for Pokémon.</p>
          <p className="habitat-hint"><MousePointer2 aria-hidden="true" />Tap a wandering Pokémon to say hello.</p>
          <div className="hero-actions">
            <a className="button-primary" href="#projects">Explore my work <ArrowDown size={17} /></a>
            <a className="text-link" href="https://github.com/monqzxc" target="_blank" rel="noreferrer"><Code2 size={17} />GitHub <ArrowUpRight size={14} /></a>
          </div>
          <div className="hero-cv-links"><a href="/cv/Anthony-Cabigayan-CV.pdf" download><Download size={15} />Download CV</a><a href="/cv"><FileText size={15} />Create your own CV <ArrowUpRight size={13} /></a></div>
          <span className="hero-location"><MapPin size={14} />Manila, Philippines</span>
        </div>
        <figure className="hero-diorama entrance">
          <div className="diorama-glow" aria-hidden="true" />
          <img
            src="/images/mon-pokemon-hero.png"
            alt="Isometric MON lettering above Gengar and Gible on a miniature architectural platform"
            width="1254"
            height="1254"
            fetchPriority="high"
          />
          <figcaption className="companion-strip">
            <span className="companion gengar"><Ghost size={21} aria-hidden="true" /><span><strong>Gengar</strong><small>Ghost / Poison</small></span></span>
            <span className="companion gible"><Hexagon size={21} aria-hidden="true" /><span><strong>Gible</strong><small>Dragon / Ground</small></span></span>
          </figcaption>
        </figure>
      </div>
      <div className="hero-bottom">
        <div className="credentials">
          <div className="credential"><Code2 /><strong>7+ years</strong><span>crafting digital systems</span></div>
          <div className="credential"><Trophy /><strong>WorldSkills</strong><span>Philippines · 2019</span></div>
          <div className="credential"><Building2 /><strong>TESDA</strong><span>Enterprise solutions</span></div>
        </div>
        <a className="scroll-link" href="#projects">SCROLL TO EXPLORE <ArrowDown size={14} /></a>
      </div>
    </section>
  );
}
