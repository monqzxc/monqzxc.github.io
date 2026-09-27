import type { BattleState, ShotInput, ShotResult, Side } from "./raft-battle";

export const TURN_DURATION_MS = 120_000;
export const RECONNECT_GRACE_MS = 30_000;
export const POKEMON_IDS = ["pikachu", "gengar", "charizard", "bidoof"] as const;
export type RaftPokemon = typeof POKEMON_IDS[number];

export function shotDuration(shot: ShotResult) {
  return Math.min(2100, Math.max(900, shot.points.length * 9)) + 200;
}

export function remainingTurnSeconds(deadline: number | null, now = Date.now()) {
  return deadline === null ? 0 : Math.max(0, Math.ceil((deadline - now) / 1000));
}

export function formatTurnTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export type OnlinePlayer = {
  pokemon: RaftPokemon;
  connected: boolean;
  ready: boolean;
  rematch: boolean;
};
export type OnlineShot = {
  id: number;
  shooter: Side;
  input: ShotInput;
  wind: number;
  startedAt: number;
  endsAt: number;
  result: ShotResult;
};
export type RoomEvent = {
  id: number;
  kind: "start" | "shot" | "timeout" | "forfeit" | "rematch";
  side: Side;
  damage?: number;
  hit?: Side | null;
};
export type RoomSnapshot = {
  code: string;
  phase: "waiting" | "playing" | "finished";
  players: [OnlinePlayer | null, OnlinePlayer | null];
  battle: BattleState;
  aims: [ShotInput, ShotInput];
  turnId: number;
  turnDeadline: number | null;
  serverNow: number;
  shot: OnlineShot | null;
  emote: { id: number; side: Side; startedAt: number; endsAt: number } | null;
  lastEvent: RoomEvent | null;
  finishReason: "knockout" | "disconnect" | "left" | null;
};

export type ClientMessage =
  | { type: "create"; pokemon: RaftPokemon }
  | { type: "join"; code: string; pokemon: RaftPokemon }
  | { type: "resume"; code: string; token: string }
  | { type: "choose"; pokemon: RaftPokemon }
  | { type: "ready" }
  | { type: "aim"; turnId: number; angle: number; power: number; kind: ShotInput["kind"] }
  | { type: "fire"; turnId: number; angle: number; power: number; kind: ShotInput["kind"] }
  | { type: "rematch" }
  | { type: "taunt"; turnId: number }
  | { type: "leave" }
  | { type: "sync" };

export type ServerMessage =
  | { type: "welcome"; code: string; token: string; side: Side; snapshot: RoomSnapshot }
  | { type: "state"; snapshot: RoomSnapshot }
  | { type: "error"; code: string; message: string }
  | { type: "left" };
