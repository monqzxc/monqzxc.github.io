"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ExternalLink, Maximize2, Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type Project, projectPreviewUrl } from "@/lib/projects";

function ProjectThumbnail({ project }: { project: Project }) {
  const viewport = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / 960);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={viewport} className="project-thumbnail" aria-hidden="true" inert>
      <iframe
        src={`${projectPreviewUrl(project)}?preview=thumbnail`}
        title={`${project.title} thumbnail`}
        tabIndex={-1}
        loading="lazy"
        style={{ transform: `scale(${scale})` }}
      />
    </span>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const previewButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const url = projectPreviewUrl(project);

  useEffect(() => {
    if (!open) return;
    // Key events inside an iframe do not reach the dialog's Escape handler.
    const closeFromPreview = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.source === frame.current?.contentWindow &&
        event.data?.type === "project-preview:close"
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("message", closeFromPreview);
    return () => window.removeEventListener("message", closeFromPreview);
  }, [open]);

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setLoaded(false);
    }
    setOpen(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <article className="project-card walkthrough-card">
        <DialogTrigger asChild>
          <button type="button" className={`project-visual walkthrough-visual ${project.tone}`} aria-label={`Preview ${project.title}`}>
            <span className="visual-top">
              <span className="visual-label"><span className="project-index">{project.number}</span>{project.category}</span>
              <Maximize2 size={16} aria-hidden="true" />
            </span>
            <ProjectThumbnail project={project} />
            <span className="thumbnail-caption"><span><Play size={13} aria-hidden="true" /> Interactive walkthrough</span><span>{project.steps} steps <ArrowUpRight size={14} aria-hidden="true" /></span></span>
          </button>
        </DialogTrigger>
        <div className="project-info">
          <div>
            <div className="project-category">{project.category}</div>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
          </div>
        </div>
        <div className="project-tags">{project.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>
        <div className="project-actions">
          <DialogTrigger asChild>
            <button ref={previewButton} type="button" className="project-preview-button" aria-label={`Preview project: ${project.title}`}>
              <Play size={15} aria-hidden="true" /> Preview project
            </button>
          </DialogTrigger>
          <a className="project-open-link" href={url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} in a new tab`}>Open in new tab <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </article>
      <DialogContent
        className="project-dialog walkthrough-dialog"
        onCloseAutoFocus={event => {
          event.preventDefault();
          (opener.current?.isConnected ? opener.current : previewButton.current)?.focus();
        }}
      >
        <div className="walkthrough-dialog-header">
          <div className="dialog-kicker">Selected work / {project.number} <span>Interactive preview</span></div>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>Explore the {project.steps}-step walkthrough using the step list or the Back and Next buttons.</DialogDescription>
        </div>
        <div className="walkthrough-frame-wrap" aria-busy={!loaded}>
          {!loaded && <p className="preview-loading" role="status">Loading preview…</p>}
          <iframe
            ref={frame}
            className="walkthrough-frame"
            src={`${url}?preview=embed`}
            title={`${project.title} interactive walkthrough`}
            onLoad={() => setLoaded(true)}
          />
        </div>
        <div className="walkthrough-dialog-footer">
          <p>Simplified screens with sample data.</p>
          <a href={url} target="_blank" rel="noopener noreferrer">Open in new tab <ExternalLink size={15} aria-hidden="true" /></a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
