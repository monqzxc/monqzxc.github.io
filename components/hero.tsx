import Image from "next/image";
import { ArrowDown, Download } from "lucide-react";
import SocialLinks from "@/components/social-links";

const STACK = ["Laravel", "Vue", "Python", "React", "Next.js", "Docker"];

export default function Hero({ onContact }: { onContact: () => void }) {
  return (
    <section id="about" className="shell hero illustrated-hero">
      <div className="hero-main">
        <div className="hero-copy entrance">
          <h1><span>Anthony</span><span>Cabigayan<span className="name-period">.</span></span></h1>
          <p className="hero-moniker">Software engineer in Manila. Call me <strong>Mon.</strong></p>
          <p className="hero-description">I build the systems behind public service in the Philippines, from HR and recruitment to AI recommendations.</p>
          <div className="hero-actions">
            <a className="button-primary" href="#projects">See my work <ArrowDown size={17} aria-hidden="true" /></a>
            <SocialLinks onContact={onContact} />
          </div>
          <div className="hero-cv-links"><a href="/cv/Anthony-Cabigayan-CV.pdf" download><Download size={15} aria-hidden="true" />Download CV</a></div>
          <ul className="hero-stack" aria-label="Main tools">
            {STACK.map(tool => <li key={tool}>{tool}</li>)}
          </ul>
        </div>
        <figure className="hero-stage entrance">
          <Image
            className="hero-art"
            src="/images/mon-pokemon-hero.png"
            width={1254}
            height={1254}
            sizes="(max-width: 760px) 100vw, (max-width: 1100px) 55vw, 60vw"
            alt="Gengar and Gible standing together on a stage beneath a MON sign."
            preload
          />
        </figure>
      </div>
    </section>
  );
}
