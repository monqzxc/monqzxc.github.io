"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ShotInput, Side } from "@/lib/raft-battle";
import type { ClientMessage, RaftPokemon, RoomSnapshot, ServerMessage } from "@/lib/raft-online";

type Connection = "checking" | "idle" | "connecting" | "connected" | "reconnecting" | "disconnected" | "unavailable";
type Session = { code: string; token: string };
type StartMessage = Extract<ClientMessage, { type: "create" | "join" | "resume" }>;
type Transport = {
  start: (message: StartMessage) => void;
  send: (message: ClientMessage) => boolean;
  reconnect: () => void;
  leave: () => void;
};
const LAST_ROOM_KEY = "poke-raft:last-room";
const roomKey = (code: string) => `poke-raft:room:${code}`;

function storedSession(code?: string): Session | null {
  try {
    const savedCode = code || sessionStorage.getItem(LAST_ROOM_KEY);
    if (!savedCode || !/^[A-Z]{6}$/.test(savedCode)) return null;
    const token = sessionStorage.getItem(roomKey(savedCode));
    return token ? { code: savedCode, token } : null;
  } catch { return null; }
}

function rememberSession(session: Session | null, previousCode?: string) {
  try {
    if (session) {
      sessionStorage.setItem(roomKey(session.code), session.token);
      sessionStorage.setItem(LAST_ROOM_KEY, session.code);
    } else {
      if (previousCode) sessionStorage.removeItem(roomKey(previousCode));
      sessionStorage.removeItem(LAST_ROOM_KEY);
    }
  } catch { /* A room can still be played when browser storage is unavailable. */ }
}

function socketAddress() {
  const configured = process.env.NEXT_PUBLIC_RAFT_WS_URL?.trim();
  const address = configured || (["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? `ws://${window.location.hostname}:8787/raft` : null);
  if (!address) return null;
  try {
    const url = new URL(address);
    if (!["ws:", "wss:"].includes(url.protocol) || (location.protocol === "https:" && url.protocol !== "wss:")) return null;
    return url.href;
  } catch { return null; }
}

export function useRaftOnline(initialCode?: string) {
  const [connection, setConnection] = useState<Connection>("checking");
  const [snapshot, setSnapshot] = useState<RoomSnapshot | null>(null);
  const [side, setSide] = useState<Side | null>(null);
  const [error, setError] = useState("");
  const [clockOffset, setClockOffset] = useState(0);
  const [firePending, setFirePending] = useState(false);
  const transport = useRef<Transport | null>(null);
  const currentSnapshot = useRef<RoomSnapshot | null>(null);
  const currentSide = useRef<Side | null>(null);
  const offset = useRef(0);
  const firedTurn = useRef<number | null>(null);
  const aimTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAim = useRef<Extract<ClientMessage, { type: "aim" }> | null>(null);
  const lastAimSent = useRef(0);
  const clearAim = useCallback(() => {
    if (aimTimer.current !== null) clearTimeout(aimTimer.current);
    aimTimer.current = null;
    pendingAim.current = null;
  }, []);

  useEffect(() => {
    const address = socketAddress();
    if (!address) { setConnection("unavailable"); return; }
    let disposed = false;
    let socket: WebSocket | null = null;
    let session = storedSession(initialCode?.toUpperCase());
    let intent: StartMessage | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let handshakeTimer: ReturnType<typeof setTimeout> | null = null;
    let attempts = 0;
    let intentionalClose = false;

    const cancelTimers = () => {
      if (retryTimer !== null) clearTimeout(retryTimer);
      if (handshakeTimer !== null) clearTimeout(handshakeTimer);
      retryTimer = handshakeTimer = null;
    };
    const send = (message: ClientMessage) => {
      if (!socket || socket.readyState !== WebSocket.OPEN || disposed) return false;
      try { socket.send(JSON.stringify(message)); return true; }
      catch { return false; }
    };
    const acceptSnapshot = (next: RoomSnapshot) => {
      if (currentSnapshot.current?.turnId !== next.turnId || next.phase !== "playing" || next.shot) clearAim();
      if (firedTurn.current !== next.turnId || next.shot || next.phase !== "playing") {
        firedTurn.current = null;
        setFirePending(false);
      }
      currentSnapshot.current = next;
      offset.current = next.serverNow - Date.now();
      setClockOffset(offset.current);
      setSnapshot(next);
    };
    const closeSocket = () => {
      const previous = socket;
      socket = null;
      previous?.close();
    };
    const open = () => {
      if (disposed || intentionalClose) return;
      cancelTimers();
      closeSocket();
      clearAim();
      setConnection(session ? "reconnecting" : "connecting");
      const message: StartMessage | null = session ? { type: "resume", ...session } : intent;
      if (!message) { setConnection("idle"); return; }
      let next: WebSocket;
      try { next = new WebSocket(address); }
      catch {
        setConnection("disconnected");
        setError("We couldn't connect to the lagoon. Try connecting again.");
        return;
      }
      socket = next;
      const active = () => !disposed && socket === next && !intentionalClose;
      handshakeTimer = setTimeout(() => { if (active()) next.close(); }, 8000);
      next.onopen = () => { if (active()) send(message); };
      next.onmessage = event => {
        if (!active() || typeof event.data !== "string") return;
        let incoming: ServerMessage;
        try { incoming = JSON.parse(event.data) as ServerMessage; } catch { return; }
        if (incoming.type === "welcome") {
          cancelTimers();
          attempts = 0;
          session = { code: incoming.code, token: incoming.token };
          rememberSession(session);
          currentSide.current = incoming.side;
          setSide(incoming.side);
          acceptSnapshot(incoming.snapshot);
          setConnection("connected");
          setError("");
          const url = new URL(window.location.href);
          url.searchParams.set("room", incoming.code);
          window.history.replaceState(window.history.state, "", url);
          send({ type: "sync" });
        } else if (incoming.type === "state") {
          acceptSnapshot(incoming.snapshot);
        } else if (incoming.type === "error") {
          setError(incoming.message || "That action couldn't be completed. Please try again.");
          // A handshake rejection is final. Retrying the same expired token or full room cannot help.
          if (handshakeTimer !== null) {
            cancelTimers();
            rememberSession(null, session?.code);
            session = null;
            intent = null;
            intentionalClose = true;
            closeSocket();
            currentSnapshot.current = null;
            currentSide.current = null;
            setSnapshot(null);
            setSide(null);
            setConnection("idle");
          } else send({ type: "sync" });
        } else if (incoming.type === "left") {
          intentionalClose = true;
          cancelTimers();
          rememberSession(null, session?.code);
          session = null;
          closeSocket();
          setConnection("idle");
          setSnapshot(null);
          setSide(null);
        }
      };
      next.onerror = () => { /* The close event owns retries, so an error cannot start two sockets. */ };
      next.onclose = () => {
        if (!active()) return;
        socket = null;
        cancelTimers();
        clearAim();
        if (session && attempts < 6) {
          setConnection("reconnecting");
          setError("");
          retryTimer = setTimeout(open, Math.min(500 * 2 ** attempts++, 4000));
        } else {
          setConnection("disconnected");
          setError(session ? "Connection lost. Reconnect to return to your raft." : "The lagoon couldn't be reached. Try connecting again.");
        }
      };
    };

    const leave = () => {
      intentionalClose = true;
      cancelTimers();
      clearAim();
      send({ type: "leave" });
      closeSocket();
      rememberSession(null, session?.code);
      session = null;
      intent = null;
      currentSnapshot.current = null;
      currentSide.current = null;
      firedTurn.current = null;
      setSnapshot(null);
      setSide(null);
      setFirePending(false);
      setError("");
      setConnection("idle");
      const url = new URL(window.location.href);
      url.searchParams.delete("room");
      window.history.replaceState(window.history.state, "", url);
    };
    transport.current = {
      send,
      leave,
      start(message) {
        if (socket || retryTimer !== null) return;
        intentionalClose = false;
        attempts = 0;
        intent = message;
        setError("");
        open();
      },
      reconnect() {
        intentionalClose = false;
        attempts = 0;
        setError("");
        open();
      },
    };
    const sync = () => {
      if (document.hidden) return;
      if (socket?.readyState === WebSocket.OPEN) send({ type: "sync" });
      else if (session && !intentionalClose && retryTimer === null && (!socket || socket.readyState === WebSocket.CLOSED)) open();
    };
    const protectBattle = (event: BeforeUnloadEvent) => {
      if (currentSnapshot.current?.phase !== "playing") return;
      event.preventDefault();
      event.returnValue = "";
    };
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("online", sync);
    window.addEventListener("beforeunload", protectBattle);
    if (session) open();
    else setConnection("idle");
    return () => {
      disposed = true;
      cancelTimers();
      clearAim();
      closeSocket();
      transport.current = null;
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("online", sync);
      window.removeEventListener("beforeunload", protectBattle);
    };
  }, [clearAim, initialCode]);

  const canAct = useCallback(() => {
    const room = currentSnapshot.current;
    return !!room && room.phase === "playing" && room.battle.turn === currentSide.current && !room.shot
      && firedTurn.current !== room.turnId && room.turnDeadline !== null && room.turnDeadline > Date.now() + offset.current;
  }, []);
  const updateAim = useCallback((input: ShotInput) => {
    if (!canAct()) return;
    const turnId = currentSnapshot.current!.turnId;
    pendingAim.current = { type: "aim", turnId, ...input };
    if (aimTimer.current !== null) return;
    const flush = () => {
      aimTimer.current = null;
      const aim = pendingAim.current;
      pendingAim.current = null;
      if (aim && canAct() && currentSnapshot.current?.turnId === aim.turnId) {
        if (transport.current?.send(aim)) lastAimSent.current = Date.now();
      }
    };
    aimTimer.current = setTimeout(flush, Math.max(0, 100 - (Date.now() - lastAimSent.current)));
  }, [canAct]);
  const fire = useCallback((input: ShotInput) => {
    if (!canAct()) return;
    clearAim();
    const turnId = currentSnapshot.current!.turnId;
    if (transport.current?.send({ type: "fire", turnId, ...input })) {
      firedTurn.current = turnId;
      setFirePending(true);
    }
  }, [canAct, clearAim]);

  return {
    connection, snapshot, side, error, clockOffset, firePending, updateAim, fire,
    create: (pokemon: RaftPokemon) => transport.current?.start({ type: "create", pokemon }),
    join: (code: string, pokemon: RaftPokemon) => transport.current?.start({ type: "join", code, pokemon }),
    choose: (pokemon: RaftPokemon) => transport.current?.send({ type: "choose", pokemon }),
    ready: () => transport.current?.send({ type: "ready" }),
    rematch: () => transport.current?.send({ type: "rematch" }),
    reconnect: () => transport.current?.reconnect(),
    leave: () => transport.current?.leave(),
  };
}
