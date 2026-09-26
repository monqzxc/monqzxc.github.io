"use client";

import { useEffect, useRef, useState } from "react";
/** Vue exclusively owns this empty mount node; React owns its wrapper. */
export default function VueCraft() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let disposed = false;
    let unmount: (() => void) | undefined;
    import("@/components/craft-app").then(({
      mountCraft
    }) => {
      if (disposed || !host.current) return;
      unmount = mountCraft(host.current);
      setReady(true);
    }).catch(() => {/* Readable server-rendered content stays visible. */});
    return () => {
      disposed = true;
      unmount?.();
    };
  }, []);
  return <div className="vue-craft"><div ref={host} data-framework="vue" />{!ready && <div className="craft-detail"><span className="craft-kicker">Beyond code</span><h3>Endurance. Exploration. New perspectives.</h3><p>Traveling, running, watching anime, and experimenting with technology keep me curious beyond the screen.</p></div>}</div>;
}
