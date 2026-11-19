"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { type Project, projectPreviewUrl } from "@/lib/projects";

type Props = {
  project: Project | null;
  onClose: () => void;
  /** Element that receives focus again when the dialog closes. */
  returnFocus?: () => HTMLElement | null;
};

export default function ProjectDialog({ project, onClose, returnFocus }: Props) {
  const [loaded, setLoaded] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const open = project !== null;

  useEffect(() => { setLoaded(false); }, [project?.id]);

  useEffect(() => {
    if (!open) return;
    // Key events inside an iframe do not reach the dialog's Escape handler.
    const closeFromPreview = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.source === frame.current?.contentWindow &&
        event.data?.type === "project-preview:close"
      ) {
        onClose();
      }
    };
    window.addEventListener("message", closeFromPreview);
    return () => window.removeEventListener("message", closeFromPreview);
  }, [open, onClose]);

  const url = project ? projectPreviewUrl(project) : "";

  return (
    <Dialog open={open} onOpenChange={next => { if (!next) onClose(); }}>
      {project && (
        <DialogContent
          className="project-dialog walkthrough-dialog"
          onCloseAutoFocus={event => {
            const target = returnFocus?.();
            if (target?.isConnected) {
              event.preventDefault();
              target.focus({ preventScroll: true });
            }
          }}
        >
          <div className="walkthrough-dialog-header">
            <DialogTitle>{project.title}</DialogTitle>
            <DialogDescription>Click through the {project.steps}-step walkthrough with the step list or the Back and Next buttons.</DialogDescription>
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
      )}
    </Dialog>
  );
}
