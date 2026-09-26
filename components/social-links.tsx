"use client";

import { ArrowUpRight, Code2, Mail } from "lucide-react";
import styles from "./social-links.module.css";

export default function SocialLinks({ onContact }: { onContact: () => void }) {
  return (
    <div className={styles.links}>
      <a className="text-link" href="https://github.com/monqzxc" target="_blank" rel="noreferrer">
        <Code2 size={17} aria-hidden="true" />GitHub <ArrowUpRight size={14} aria-hidden="true" />
      </a>
      <button
        type="button"
        className={styles.email}
        aria-label="Send me an email"
        aria-haspopup="dialog"
        title="Send me an email"
        onClick={event => {
          event.currentTarget.focus({ preventScroll: true });
          onContact();
        }}
      >
        <Mail size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
