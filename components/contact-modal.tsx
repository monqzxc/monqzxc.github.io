"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, Mail, Send, X } from "lucide-react";
import { Dialog } from "radix-ui";
import styles from "./contact-modal.module.css";

const FORM_ENDPOINT = "https://formspree.io/f/xvkgbwbr";
const EMAIL_ADDRESS = "suppmon27@gmail.com";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const fieldId = useId();
  const emailInput = useRef<HTMLInputElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const submitting = useRef(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const data = new FormData(event.currentTarget);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    submitting.current = true;
    setStatus("sending");

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Message submission failed");

      setEmail("");
      setMessage("");
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
      submitting.current = false;
    }
  }

  function updateDraft(update: () => void) {
    update();
    if (status === "success") setStatus("idle");
  }

  return (
    <Dialog.Root open={open} onOpenChange={nextOpen => { if (!nextOpen) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.dialog}
          onOpenAutoFocus={event => {
            event.preventDefault();
            opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            const initialFocus = emailInput.current?.disabled ? closeButton.current : emailInput.current;
            initialFocus?.focus({ preventScroll: true });
          }}
          onCloseAutoFocus={event => {
            event.preventDefault();
            if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
          }}
        >
          <Dialog.Close ref={closeButton} className={styles.close} aria-label="Close email dialog">
            <X size={20} aria-hidden="true" />
          </Dialog.Close>

          <div className={styles.badge} aria-hidden="true"><Mail size={25} /></div>
          <p className={styles.eyebrow}>THE NEXT QUEST</p>
          <Dialog.Title className={styles.title}>Let’s team up.</Dialog.Title>
          <Dialog.Description className={styles.description}>
            Have a project in mind, or just want to say hello? Leave me a message.
          </Dialog.Description>

          <form className={styles.form} action={FORM_ENDPOINT} method="POST" onSubmit={sendMessage} aria-busy={status === "sending"}>
            <input type="hidden" name="_subject" value="New message from mon. portfolio" />
            <div className={styles.field}>
              <label htmlFor={`${fieldId}-email`}>Your email</label>
              <input
                ref={emailInput}
                id={`${fieldId}-email`}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={event => updateDraft(() => setEmail(event.target.value))}
                disabled={status === "sending"}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor={`${fieldId}-message`}>Message</label>
              <textarea
                id={`${fieldId}-message`}
                name="message"
                rows={5}
                placeholder="Tell me a little about what you have in mind…"
                value={message}
                onChange={event => updateDraft(() => setMessage(event.target.value))}
                disabled={status === "sending"}
                required
              />
            </div>

            <div aria-live="polite" aria-atomic="true">
              {status === "success" && (
                <p className={styles.success}><CheckCircle2 size={18} aria-hidden="true" /><span>Message sent. Thanks for reaching out!</span></p>
              )}
              {status === "error" && (
                <p className={styles.error}>Your message couldn’t be sent. Please try again, or email me directly below. Your draft is still here.</p>
              )}
            </div>

            <button className={styles.submit} type="submit" disabled={status === "sending"}>
              {status === "sending" ? <LoaderCircle className={styles.spinner} size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
          </form>

          <p className={styles.direct}>Prefer your email app? <a href={`mailto:${EMAIL_ADDRESS}`}>Email me directly</a></p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
