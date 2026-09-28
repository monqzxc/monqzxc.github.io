"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Peer, { type DataConnection } from "peerjs";
import { applyShot, createBattle, skipTurn, type ShotInput, type Side } from "@/lib/raft-battle";
import { RECONNECT_GRACE_MS, TURN_DURATION_MS, shotDuration, type OnlinePlayer, type RaftPokemon, type RoomSnapshot, type RoomEvent } from "@/lib/raft-online";

type Connection = "checking" | "idle" | "connecting" | "connected" | "reconnecting" | "disconnected" | "unavailable";
type Action =
  | { type: "choose"; pokemon: RaftPokemon }
  | { type: "ready" }
  | { type: "aim"; turnId: number; angle: number; power: number; kind: ShotInput["kind"] }
  | { type: "fire"; turnId: number; angle: number; power: number; kind: ShotInput["kind"] }
  | { type: "rematch" }
  | { type: "taunt"; turnId: number }
  | { type: "leave" };
type PeerMessage = { type: "hello"; pokemon: RaftPokemon } | { type: "snapshot"; side: Side; snapshot: RoomSnapshot } | Action;
type Runtime = {
  code: string;
  snapshot: RoomSnapshot;
  guest: DataConnection | null;
  turnTimer: ReturnType<typeof setTimeout> | null;
  shotTimer: ReturnType<typeof setTimeout> | null;
  emoteTimer: ReturnType<typeof setTimeout> | null;
  graceTimer: ReturnType<typeof setTimeout> | null;
  eventId: number;
};

const HOST_ID_PREFIX = "poke-raft-v2-";
function hostPeerId(code: string) { return `${HOST_ID_PREFIX}${code}`; }
function randomRoomCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
}
function peerOptions() { return { secure: window.location.protocol === "https:", debug: 0 } as const; }
function setRoomUrl(code?: string) {
  const url = new URL(window.location.href);
  if (code) url.searchParams.set("room", code); else url.searchParams.delete("room");
  window.history.replaceState(window.history.state, "", url);
}
function player(pokemon: RaftPokemon, connected: boolean): OnlinePlayer { return { pokemon, connected, ready: false, rematch: false }; }

export function useRaftOnline(initialCode?: string) {
  const [connection, setConnection] = useState<Connection>("idle");
  const [snapshot, setSnapshot] = useState<RoomSnapshot | null>(null);
  const [side, setSide] = useState<Side | null>(null);
  const [error, setError] = useState("");
  const [clockOffset, setClockOffset] = useState(0);
  const [firePending, setFirePending] = useState(false);
  const peerRef = useRef<Peer | null>(null);
  const connectionRef = useRef<DataConnection | null>(null);
  const runtimeRef = useRef<Runtime | null>(null);
  const hostRef = useRef(false);
  const sideRef = useRef<Side | null>(null);
  const currentSnapshot = useRef<RoomSnapshot | null>(null);
  const offset = useRef(0);
  const firedTurn = useRef<number | null>(null);
  const pendingAim = useRef<Extract<Action, { type: "aim" }> | null>(null);
  const aimTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAimSent = useRef(0);
  const disposedRef = useRef(false);
  const initialCodeRef = useRef(initialCode?.toUpperCase());
  const transportRef = useRef<{
    send: (action: Action) => boolean;
    startCreate: (pokemon: RaftPokemon) => void;
    startJoin: (code: string, pokemon: RaftPokemon) => void;
    reconnect: () => void;
    leave: () => void;
  } | null>(null);

  const clearAim = useCallback(() => {
    if (aimTimer.current !== null) clearTimeout(aimTimer.current);
    aimTimer.current = null;
    pendingAim.current = null;
  }, []);

  const acceptSnapshot = useCallback((next: RoomSnapshot, nextSide: Side) => {
    if (currentSnapshot.current?.turnId !== next.turnId || next.phase !== "playing" || next.shot) clearAim();
    if (firedTurn.current !== next.turnId || next.shot || next.phase !== "playing") {
      firedTurn.current = null;
      setFirePending(false);
    }
    currentSnapshot.current = next;
    sideRef.current = nextSide;
    offset.current = next.serverNow - Date.now();
    setClockOffset(offset.current);
    setSide(nextSide);
    setSnapshot(next);
  }, [clearAim]);

  const destroyPeer = useCallback(() => {
    connectionRef.current?.close();
    connectionRef.current = null;
    peerRef.current?.destroy();
    peerRef.current = null;
  }, []);

  useEffect(() => {
    disposedRef.current = false;
    initialCodeRef.current = initialCode?.toUpperCase();
    if (typeof RTCPeerConnection === "undefined") {
      setConnection("unavailable");
      setError("This browser does not support peer-to-peer connections.");
    }
    return () => {
      disposedRef.current = true;
      clearAim();
      const runtime = runtimeRef.current;
      if (runtime) {
        if (runtime.turnTimer) clearTimeout(runtime.turnTimer);
        if (runtime.shotTimer) clearTimeout(runtime.shotTimer);
        if (runtime.emoteTimer) clearTimeout(runtime.emoteTimer);
        if (runtime.graceTimer) clearTimeout(runtime.graceTimer);
      }
      connectionRef.current?.close();
      peerRef.current?.destroy();
      connectionRef.current = null;
      peerRef.current = null;
      runtimeRef.current = null;
    };
  }, [clearAim, initialCode]);

  useEffect(() => {
    const publish = (next: RoomSnapshot) => {
      const runtime = runtimeRef.current;
      if (!runtime) return;
      const stamped = { ...next, serverNow: Date.now() };
      runtime.snapshot = stamped;
      acceptSnapshot(stamped, 0);
      if (runtime.guest?.open) runtime.guest.send({ type: "snapshot", side: 1, snapshot: stamped } satisfies PeerMessage);
    };
    const sendToPeer = (message: PeerMessage) => {
      const conn = connectionRef.current;
      if (!conn || !conn.open || disposedRef.current) return false;
      try { conn.send(message); return true; } catch { return false; }
    };
    const clearRuntimeTimers = (runtime: Runtime) => {
      if (runtime.turnTimer) clearTimeout(runtime.turnTimer);
      if (runtime.shotTimer) clearTimeout(runtime.shotTimer);
      if (runtime.emoteTimer) clearTimeout(runtime.emoteTimer);
      runtime.turnTimer = runtime.shotTimer = runtime.emoteTimer = null;
    };
    const event = (runtime: Runtime, kind: RoomEvent["kind"], eventSide: Side, extra: Partial<RoomEvent> = {}) => {
      runtime.eventId += 1;
      runtime.snapshot = { ...runtime.snapshot, lastEvent: { id: runtime.eventId, kind, side: eventSide, ...extra } };
    };
    const scheduleDeadline = (runtime: Runtime) => {
      if (runtime.turnTimer) clearTimeout(runtime.turnTimer);
      const turnId = runtime.snapshot.turnId;
      runtime.turnTimer = setTimeout(() => {
        const current = runtimeRef.current;
        if (!current || current !== runtime || current.snapshot.phase !== "playing" || current.snapshot.turnId !== turnId || current.snapshot.shot || !current.snapshot.turnDeadline || Date.now() < current.snapshot.turnDeadline) return;
        const turnSide = current.snapshot.battle.turn;
        current.snapshot = { ...current.snapshot, battle: skipTurn(current.snapshot.battle), turnId: current.snapshot.turnId + 1, turnDeadline: Date.now() + TURN_DURATION_MS };
        event(current, "timeout", turnSide);
        publish(current.snapshot);
        scheduleDeadline(current);
      }, TURN_DURATION_MS + 50);
    };
    const startMatch = (runtime: Runtime, rematch = false) => {
      clearRuntimeTimers(runtime);
      runtime.snapshot = {
        ...runtime.snapshot, phase: "playing", battle: createBattle(),
        aims: [{ angle: 45, power: 75, kind: "normal" }, { angle: 45, power: 75, kind: "normal" }],
        turnId: runtime.snapshot.turnId + 1, turnDeadline: Date.now() + TURN_DURATION_MS, shot: null, emote: null,
        tauntReadyAt: [0, 0], finishReason: null,
        players: runtime.snapshot.players.map(entry => entry ? { ...entry, ready: false, rematch: false } : null) as RoomSnapshot["players"],
      };
      event(runtime, rematch ? "rematch" : "start", 0);
      publish(runtime.snapshot);
      scheduleDeadline(runtime);
    };
    const finishForfeit = (runtime: Runtime, eventSide: Side, reason: "left" | "disconnect") => {
      clearRuntimeTimers(runtime);
      runtime.snapshot = { ...runtime.snapshot, phase: "finished", battle: { ...runtime.snapshot.battle, winner: eventSide === 0 ? 1 : 0 }, turnDeadline: null, shot: null, finishReason: reason };
      event(runtime, "forfeit", eventSide);
      publish(runtime.snapshot);
    };
    const finishGuestDisconnect = (runtime: Runtime) => {
      const existing = runtime.snapshot.players[1];
      if (!existing) return;
      runtime.snapshot = { ...runtime.snapshot, players: [runtime.snapshot.players[0], { ...existing, connected: false }] };
      publish(runtime.snapshot);
      if (runtime.snapshot.phase === "playing") {
        if (runtime.graceTimer) clearTimeout(runtime.graceTimer);
        runtime.graceTimer = setTimeout(() => {
          if (runtimeRef.current === runtime && !runtime.guest) finishForfeit(runtime, 1, "disconnect");
        }, RECONNECT_GRACE_MS);
      }
    };
    const handleAction = (action: Action, actionSide: Side) => {
      const runtime = runtimeRef.current;
      if (!runtime || disposedRef.current) return;
      const snap = runtime.snapshot;
      if (action.type === "leave") {
        if (actionSide === 1) {
          if (snap.phase === "playing") finishForfeit(runtime, 1, "left");
          runtime.snapshot = { ...runtime.snapshot, players: [runtime.snapshot.players[0], null] };
          publish(runtime.snapshot); connectionRef.current?.close();
        }
        return;
      }
      if (action.type === "choose" || action.type === "ready") {
        if (snap.phase !== "waiting") return;
        const entry = snap.players[actionSide];
        if (!entry) return;
        const nextPlayer = action.type === "choose" ? { ...entry, pokemon: action.pokemon, ready: false } : { ...entry, ready: true };
        runtime.snapshot = { ...snap, players: snap.players.map((item, index) => index === actionSide ? nextPlayer : item) as RoomSnapshot["players"] };
        if (runtime.snapshot.players.every(item => item?.ready && item.connected)) startMatch(runtime); else publish(runtime.snapshot);
        return;
      }
      if (action.type === "rematch") {
        if (snap.phase !== "finished" || !snap.players.every(item => item?.connected)) return;
        runtime.snapshot = { ...snap, players: snap.players.map((item, index) => index === actionSide ? { ...item!, rematch: true } : item) as RoomSnapshot["players"] };
        if (runtime.snapshot.players.every(item => item?.rematch && item.connected)) startMatch(runtime, true); else publish(runtime.snapshot);
        return;
      }
      if (snap.phase !== "playing" || snap.shot || snap.battle.turn !== actionSide || action.turnId !== snap.turnId) return;
      if (action.type === "aim") {
        runtime.snapshot = { ...snap, aims: snap.aims.map((aim, index) => index === actionSide ? { angle: action.angle, power: action.power, kind: action.kind } : aim) as RoomSnapshot["aims"] };
        publish(runtime.snapshot); return;
      }
      if (action.type === "taunt") {
        if (Date.now() < snap.tauntReadyAt[actionSide]) return;
        if (runtime.emoteTimer) clearTimeout(runtime.emoteTimer);
        const now = Date.now();
        runtime.snapshot = { ...snap, emote: { id: runtime.eventId + 1, side: actionSide, startedAt: now, endsAt: now + 1200 }, tauntReadyAt: snap.tauntReadyAt.map((time, index) => index === actionSide ? now + 5000 : time) as [number, number] };
        publish(runtime.snapshot);
        runtime.emoteTimer = setTimeout(() => { if (runtimeRef.current !== runtime) return; runtime.snapshot = { ...runtime.snapshot, emote: null }; publish(runtime.snapshot); }, 1200); return;
      }
      const input: ShotInput = { angle: action.angle, power: action.power, kind: action.kind };
      const resolution = applyShot(snap.battle, input);
      clearRuntimeTimers(runtime);
      const startedAt = Date.now(); const animationMs = shotDuration(resolution.shot);
      runtime.snapshot = { ...snap, turnDeadline: null, shot: { id: snap.turnId, shooter: actionSide, input, wind: snap.battle.wind, startedAt, endsAt: startedAt + animationMs, result: resolution.shot } };
      event(runtime, "shot", actionSide, { damage: resolution.shot.damage, hit: resolution.shot.hit }); publish(runtime.snapshot);
      runtime.shotTimer = setTimeout(() => {
        if (runtimeRef.current !== runtime || runtime.snapshot.phase !== "playing") return;
        runtime.snapshot = { ...runtime.snapshot, battle: resolution.state, aims: runtime.snapshot.aims.map((aim, index) => resolution.state.specials[index] === 0 ? { ...aim, kind: "normal" } : aim) as RoomSnapshot["aims"], shot: null, turnId: runtime.snapshot.turnId + 1 };
        if (resolution.state.winner !== null) { runtime.snapshot = { ...runtime.snapshot, phase: "finished", finishReason: "knockout", turnDeadline: null }; publish(runtime.snapshot); }
        else { runtime.snapshot = { ...runtime.snapshot, turnDeadline: Date.now() + TURN_DURATION_MS }; publish(runtime.snapshot); scheduleDeadline(runtime); }
      }, animationMs);
    };
    const attachHostConnection = (conn: DataConnection) => {
      const runtime = runtimeRef.current;
      if (!runtime || runtime.guest) { conn.close(); return; }
      runtime.guest = conn; connectionRef.current = conn;
      conn.on("data", data => {
        const message = data as PeerMessage;
        if (runtimeRef.current !== runtime) return;
        if (message?.type === "hello") {
          const existing = runtime.snapshot.players[1];
          runtime.snapshot = { ...runtime.snapshot, players: [runtime.snapshot.players[0], existing ? { ...existing, pokemon: message.pokemon, connected: true } : player(message.pokemon, true)] };
          if (runtime.graceTimer) clearTimeout(runtime.graceTimer); runtime.graceTimer = null; publish(runtime.snapshot);
        } else if (message && message.type !== "snapshot") handleAction(message, 1);
      });
      conn.on("close", () => { if (runtimeRef.current !== runtime || runtime.guest !== conn) return; runtime.guest = null; connectionRef.current = null; finishGuestDisconnect(runtime); });
      conn.on("error", () => { /* close owns the visible disconnect state */ });
    };
    const attachGuestConnection = (conn: DataConnection, code: string, pokemon: RaftPokemon) => {
      connectionRef.current = conn;
      conn.on("open", () => { if (!disposedRef.current) conn.send({ type: "hello", pokemon } satisfies PeerMessage); });
      conn.on("data", data => {
        if (disposedRef.current) return;
        const message = data as PeerMessage;
        if (message?.type === "snapshot") { acceptSnapshot(message.snapshot, 1); setConnection("connected"); setError(""); setRoomUrl(code); }
        else if (message?.type === "leave") { destroyPeer(); currentSnapshot.current = null; setSnapshot(null); setSide(null); setConnection("idle"); setError("The host closed this room. Create or join a new room to play again."); setRoomUrl(); }
      });
      conn.on("close", () => { if (connectionRef.current !== conn || disposedRef.current) return; connectionRef.current = null; setConnection("disconnected"); setError("Your rival connection ended. Try reconnecting while the room is still open."); });
      conn.on("error", () => setError("PeerJS could not establish the direct connection. Check both browsers' network access and try again."));
    };
    const installPeerError = (peer: Peer) => {
      peer.on("error", error => {
        if (disposedRef.current) return;
        setConnection("disconnected"); setError(error.message || "PeerJS could not connect the two browsers.");
        if (peerRef.current === peer && !runtimeRef.current) { peerRef.current = null; try { peer.destroy(); } catch { /* already closed */ } }
      });
      peer.on("disconnected", () => { if (!disposedRef.current && !connectionRef.current) setError("The PeerJS signaling service disconnected. Try again."); });
    };
    const startCreate = (pokemon: RaftPokemon) => {
      if (peerRef.current || disposedRef.current) return;
      const code = randomRoomCode(); setConnection("connecting"); setError(""); hostRef.current = true; sideRef.current = 0;
      const peer = new Peer(hostPeerId(code), peerOptions()); peerRef.current = peer; installPeerError(peer);
      peer.on("open", () => {
        const initial: RoomSnapshot = { code, phase: "waiting", players: [player(pokemon, true), null], battle: createBattle(), aims: [{ angle: 45, power: 75, kind: "normal" }, { angle: 45, power: 75, kind: "normal" }], turnId: 0, turnDeadline: null, serverNow: Date.now(), shot: null, emote: null, tauntReadyAt: [0, 0], lastEvent: null, finishReason: null };
        runtimeRef.current = { code, snapshot: initial, guest: null, turnTimer: null, shotTimer: null, emoteTimer: null, graceTimer: null, eventId: 0 };
        peer.on("connection", attachHostConnection); acceptSnapshot(initial, 0); setConnection("connected"); setRoomUrl(code);
      });
    };
    const startJoin = (code: string, pokemon: RaftPokemon) => {
      if (peerRef.current || disposedRef.current || !/^[A-Z]{6}$/.test(code)) return;
      setConnection("connecting"); setError(""); hostRef.current = false; sideRef.current = 1;
      const peer = new Peer(peerOptions()); peerRef.current = peer; installPeerError(peer);
      peer.on("open", () => attachGuestConnection(peer.connect(hostPeerId(code), { reliable: true, serialization: "json" }), code, pokemon));
    };
    const send = (action: Action) => { if (hostRef.current) { handleAction(action, 0); return true; } return sendToPeer(action); };
    const leave = () => {
      const runtime = runtimeRef.current;
      if (hostRef.current && runtime?.guest?.open) runtime.guest.send({ type: "leave" } satisfies PeerMessage); else if (connectionRef.current?.open) connectionRef.current.send({ type: "leave" } satisfies PeerMessage);
      destroyPeer(); if (runtime) clearRuntimeTimers(runtime); runtimeRef.current = null; hostRef.current = false; sideRef.current = null; currentSnapshot.current = null;
      setSnapshot(null); setSide(null); setConnection("idle"); setError(""); setFirePending(false); setRoomUrl();
    };
    transportRef.current = { send, startCreate, startJoin, reconnect: () => {
      const code = currentSnapshot.current?.code || initialCodeRef.current; const selected = currentSnapshot.current?.players[1]?.pokemon || "pikachu";
      destroyPeer(); if (code && sideRef.current === 1) startJoin(code, selected); else setError("The host raft must stay open for a peer-to-peer rematch.");
    }, leave };
    return () => { transportRef.current = null; };
  }, [acceptSnapshot, destroyPeer, initialCode]);

  const canAct = useCallback(() => {
    const room = currentSnapshot.current;
    return !!room && room.phase === "playing" && room.battle.turn === sideRef.current && !room.shot && firedTurn.current !== room.turnId && room.turnDeadline !== null && room.turnDeadline > Date.now() + offset.current;
  }, []);
  const updateAim = useCallback((input: ShotInput) => {
    if (!canAct()) return;
    const turnId = currentSnapshot.current!.turnId; pendingAim.current = { type: "aim", turnId, ...input };
    if (aimTimer.current !== null) return;
    const flush = () => { aimTimer.current = null; const aim = pendingAim.current; pendingAim.current = null; if (aim && canAct() && currentSnapshot.current?.turnId === aim.turnId && transportRef.current?.send(aim)) lastAimSent.current = Date.now(); };
    aimTimer.current = setTimeout(flush, Math.max(0, 70 - (Date.now() - lastAimSent.current)));
  }, [canAct]);
  const fire = useCallback((input: ShotInput) => {
    if (!canAct()) return; clearAim(); const turnId = currentSnapshot.current!.turnId;
    if (transportRef.current?.send({ type: "fire", turnId, ...input })) { firedTurn.current = turnId; setFirePending(true); }
  }, [canAct, clearAim]);

  return {
    connection, snapshot, side, error, clockOffset, firePending, updateAim, fire,
    create: (pokemon: RaftPokemon) => transportRef.current?.startCreate(pokemon),
    join: (code: string, pokemon: RaftPokemon) => transportRef.current?.startJoin(code, pokemon),
    choose: (pokemon: RaftPokemon) => transportRef.current?.send({ type: "choose", pokemon }),
    ready: () => transportRef.current?.send({ type: "ready" }),
    rematch: () => transportRef.current?.send({ type: "rematch" }),
    taunt: () => { if (canAct()) transportRef.current?.send({ type: "taunt", turnId: currentSnapshot.current!.turnId }); },
    reconnect: () => transportRef.current?.reconnect(),
    leave: () => transportRef.current?.leave(),
  };
}
