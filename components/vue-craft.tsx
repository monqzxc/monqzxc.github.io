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
  return <div className="vue-craft"><div ref={host} data-framework="vue" />{!ready && <div className="craft-detail"><h3>A different kind of progress.</h3><p>Long runs are my reset. Patience, one kilometre at a time.</p></div>}</div>;
}
