import { randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocket, WebSocketServer } from "ws";
import { applyShot, createBattle, SHOT_LIMITS, skipTurn } from "../lib/raft-battle.ts";
import { POKEMON_IDS, RECONNECT_GRACE_MS, shotDuration, TURN_DURATION_MS } from "../lib/raft-online.ts";

const DEFAULT_ORIGINS = [
  "http://localhost:3000", "http://localhost:3100",
  "http://127.0.0.1:3000", "http://127.0.0.1:3100",
  "https://monqzxc.github.io",
];
const DEFAULT_AIM = { angle: 45, power: 75, kind: "normal" };
const MESSAGE_FIELDS = {
  create: ["type", "pokemon"], join: ["type", "code", "pokemon"],
  resume: ["type", "code", "token"], choose: ["type", "pokemon"],
  ready: ["type"], rematch: ["type"], leave: ["type"], sync: ["type"], taunt: ["type", "turnId"],
  aim: ["type", "turnId", "angle", "power", "kind"],
  fire: ["type", "turnId", "angle", "power", "kind"],
};

function validMessage(message) {
  if (!message || typeof message !== "object" || Array.isArray(message) || typeof message.type !== "string") return false;
  const fields = Object.hasOwn(MESSAGE_FIELDS, message.type) && MESSAGE_FIELDS[message.type];
  if (!fields || Object.keys(message).length !== fields.length || !fields.every((key) => Object.hasOwn(message, key))) return false;
  if ("pokemon" in message && !POKEMON_IDS.includes(message.pokemon)) return false;
  if ("code" in message && (typeof message.code !== "string" || !/^[A-Z]{6}$/.test(message.code))) return false;
  if ("token" in message && (typeof message.token !== "string" || !/^[a-f0-9]{64}$/.test(message.token))) return false;
  if (message.type === "taunt") return Number.isSafeInteger(message.turnId) && message.turnId > 0;
  if (message.type === "aim" || message.type === "fire") {
    return Number.isSafeInteger(message.turnId) && message.turnId > 0 &&
      Number.isInteger(message.angle) && message.angle >= SHOT_LIMITS.minAngle && message.angle <= SHOT_LIMITS.maxAngle &&
      Number.isInteger(message.power) && message.power >= SHOT_LIMITS.minPower && message.power <= SHOT_LIMITS.maxPower &&
      (message.kind === "normal" || message.kind === "special");
  }
  return true;
}

/** A standalone, authoritative room server. No Next.js server is required. */
export function createRaftServer(options = {}) {
  const origins = new Set(options.allowedOrigins ?? (process.env.RAFT_ALLOWED_ORIGINS
    ? process.env.RAFT_ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
    : DEFAULT_ORIGINS));
  const turnDurationMs = options.turnDurationMs ?? TURN_DURATION_MS;
  const reconnectGraceMs = options.reconnectGraceMs ?? RECONNECT_GRACE_MS;
  const roomTtlMs = options.roomTtlMs ?? 2 * 60 * 60 * 1000;
  const maxRooms = options.maxRooms ?? 1000;
  const maxConnections = options.maxConnections ?? maxRooms * 3 + 32;
  const random = options.random ?? Math.random;
  const rooms = new Map();
  let closing = false;

  const server = createServer((request, response) => {
    response.setHeader("Cache-Control", "no-store");
    if (request.method === "GET" && request.url === "/health") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ ok: true, rooms: rooms.size }));
    } else {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Not found");
    }
  });
  const wss = new WebSocketServer({ noServer: true, maxPayload: 2048, perMessageDeflate: false });

  function send(socket, message) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    if (socket.bufferedAmount > 512 * 1024) return socket.terminate();
    socket.send(JSON.stringify(message));
  }
  function fail(socket, code, message) {
    send(socket, { type: "error", code, message });
  }
  function snapshot(room) {
    return {
      code: room.code, phase: room.phase,
      players: room.players.map((player) => player ? {
        pokemon: player.pokemon, connected: player.socket?.readyState === WebSocket.OPEN,
        ready: player.ready, rematch: player.rematch,
      } : null),
      battle: room.battle, aims: room.aims, turnId: room.turnId,
      turnDeadline: room.turnDeadline, serverNow: Date.now(), shot: room.shot, emote: room.emote,
      tauntReadyAt: room.lastTaunts.map((time) => Number.isFinite(time) ? time + 5000 : 0),
      lastEvent: room.lastEvent, finishReason: room.finishReason,
    };
  }
  function broadcast(room) {
    const message = { type: "state", snapshot: snapshot(room) };
    for (const player of room.players) send(player?.socket, message);
  }
  function event(room, kind, side, extra = {}) {
    room.lastEvent = { id: ++room.eventId, kind, side, ...extra };
    room.updatedAt = Date.now();
  }
  function clearMatchTimers(room) {
    clearTimeout(room.turnTimer);
    clearTimeout(room.shotTimer);
    clearTimeout(room.aimTimer);
    room.turnTimer = room.shotTimer = room.aimTimer = null;
    clearEmote(room);
  }
  function clearEmote(room) {
    clearTimeout(room.emoteTimer);
    room.emoteTimer = null;
    room.emote = null;
  }
  function removeRoom(room, reason = "Room expired. Create a new room to play again.") {
    clearMatchTimers(room);
    rooms.delete(room.code);
    for (const player of room.players) {
      if (!player) continue;
      clearTimeout(player.graceTimer);
      if (player.socket) {
        player.socket.room = null;
        player.socket.side = null;
        fail(player.socket, "room_expired", reason);
        player.socket.close(1000, "Room expired");
      }
    }
  }
  function deadline(room) {
    clearTimeout(room.turnTimer);
    room.turnDeadline = Date.now() + turnDurationMs;
    const turnId = room.turnId;
    const check = () => {
      if (room.turnId !== turnId || room.turnDeadline === null) return;
      const remaining = room.turnDeadline - Date.now();
      if (remaining > 0) room.turnTimer = setTimeout(check, remaining);
      else expireTurn(room);
    };
    room.turnTimer = setTimeout(check, turnDurationMs);
  }
  function expireTurn(room) {
    if (room.phase !== "playing" || room.shot || room.turnDeadline === null || Date.now() < room.turnDeadline) return;
    const side = room.battle.turn;
    clearEmote(room);
    room.battle = skipTurn(room.battle, random);
    room.turnId++;
    event(room, "timeout", side);
    deadline(room);
    broadcast(room);
  }
  function start(room, isRematch = false) {
    clearMatchTimers(room);
    room.phase = "playing";
    room.battle = createBattle(random);
    room.aims = [{ ...DEFAULT_AIM }, { ...DEFAULT_AIM }];
    room.shot = null;
    room.finishReason = null;
    room.lastTaunts = [-Infinity, -Infinity];
    room.turnId++;
    for (const player of room.players) player.rematch = false;
    event(room, isRematch ? "rematch" : "start", 0);
    deadline(room);
  }
  function forfeit(room, side, reason) {
    if (room.phase !== "playing") return;
    clearMatchTimers(room);
    room.phase = "finished";
    room.battle = { ...room.battle, winner: side === 0 ? 1 : 0 };
    room.turnDeadline = null;
    room.shot = null;
    room.finishReason = reason;
    event(room, "forfeit", side);
  }
  function expirePlayer(room, side, player) {
    if (!rooms.has(room.code) || room.players[side] !== player || player.socket) return;
    clearTimeout(player.graceTimer);
    forfeit(room, side, "disconnect");
    player.token = null;
    room.players[side] = null;
    if (room.players.every((entry) => !entry)) removeRoom(room);
    else broadcast(room);
  }
  function attach(socket, room, side, player) {
    const previousSocket = player.socket;
    if (previousSocket && previousSocket !== socket) {
      previousSocket.room = null;
      previousSocket.side = null;
      previousSocket.close(1000, "Session resumed elsewhere");
    }
    clearTimeout(player.graceTimer);
    clearTimeout(socket.idleTimer);
    player.socket = socket;
    player.disconnectedAt = null;
    socket.room = room;
    socket.side = side;
    if (room.phase === "waiting" && room.players.every((entry) => entry?.ready && entry.socket?.readyState === WebSocket.OPEN)) start(room);
    send(socket, { type: "welcome", code: room.code, token: player.token, side, snapshot: snapshot(room) });
    broadcast(room);
  }
  function newPlayer(pokemon) {
    return { pokemon, ready: false, rematch: false, socket: null, token: randomBytes(32).toString("hex"), graceTimer: null, disconnectedAt: null };
  }
  function onMessage(socket, data, isBinary) {
    const now = Date.now();
    socket.credits = Math.min(60, socket.credits + (now - socket.creditAt) * 0.03);
    socket.creditAt = now;
    if (socket.credits < 1) return socket.close(1008, "Too many messages");
    socket.credits--;
    let message;
    try { message = isBinary ? null : JSON.parse(data.toString()); } catch { /* Invalid JSON is rejected below. */ }
    if (!validMessage(message)) return fail(socket, "invalid_message", "Send a valid game action.");

    if (["create", "join", "resume"].includes(message.type)) {
      if (socket.room) return fail(socket, "already_joined", "Leave your current room first.");
      if (message.type === "create") {
        if (rooms.size >= maxRooms) return fail(socket, "server_full", "The server is full. Please try again soon.");
        let code;
        do { code = Array.from({ length: 6 }, () => String.fromCharCode(65 + randomInt(26))).join(""); } while (rooms.has(code));
        const room = {
          code, phase: "waiting", players: [newPlayer(message.pokemon), null],
          battle: createBattle(random), aims: [{ ...DEFAULT_AIM }, { ...DEFAULT_AIM }],
          turnId: 0, turnDeadline: null, shot: null, emote: null, emoteTimer: null, emoteId: 0,
          lastTaunts: [-Infinity, -Infinity], lastEvent: null, finishReason: null,
          eventId: 0, updatedAt: now, turnTimer: null, shotTimer: null, aimTimer: null,
          lastAimBroadcastAt: 0,
        };
        rooms.set(code, room);
        return attach(socket, room, 0, room.players[0]);
      }
      const room = rooms.get(message.code);
      if (!room) return fail(socket, "room_missing", "That room does not exist or has expired.");
      if (now - room.updatedAt >= roomTtlMs) {
        removeRoom(room);
        return fail(socket, "room_missing", "That room has expired.");
      }
      expireTurn(room);
      if (message.type === "resume") {
        const side = room.players.findIndex((player) => player?.token && timingSafeEqual(Buffer.from(player.token), Buffer.from(message.token)));
        if (side < 0) return fail(socket, "resume_failed", "This room session has ended. Create or join a new room.");
        const player = room.players[side];
        if (player.disconnectedAt !== null && now - player.disconnectedAt >= reconnectGraceMs) {
          expirePlayer(room, side, player);
          return fail(socket, "resume_failed", "The reconnect time has expired.");
        }
        return attach(socket, room, side, player);
      }
      if (room.phase !== "waiting") return fail(socket, "room_started", "That battle has already started.");
      const side = room.players.findIndex((player) => player === null);
      if (side < 0) return fail(socket, "room_full", "This room already has two players.");
      room.players[side] = newPlayer(message.pokemon);
      room.updatedAt = now;
      return attach(socket, room, side, room.players[side]);
    }

    const room = socket.room;
    const side = socket.side;
    if (!room || !rooms.has(room.code) || room.players[side]?.socket !== socket) return fail(socket, "not_joined", "Create or join a room first.");
    expireTurn(room);
    const player = room.players[side];
    if (message.type === "leave") {
      clearTimeout(player.graceTimer);
      player.token = null;
      player.socket = null;
      socket.room = null;
      socket.side = null;
      forfeit(room, side, "left");
      room.players[side] = null;
      send(socket, { type: "left" });
      if (room.players.every((entry) => !entry)) removeRoom(room);
      else broadcast(room);
      return;
    }
    if (message.type === "sync") return send(socket, { type: "state", snapshot: snapshot(room) });
    if (message.type === "choose" || message.type === "ready") {
      if (room.phase !== "waiting") return fail(socket, "battle_started", "Your Pokémon is locked for this battle.");
      if (message.type === "choose") { player.pokemon = message.pokemon; player.ready = false; }
      else player.ready = true;
      room.updatedAt = now;
      if (room.players.every((entry) => entry?.ready && entry.socket?.readyState === WebSocket.OPEN)) start(room);
      return broadcast(room);
    }
    if (message.type === "rematch") {
      if (room.phase !== "finished") return fail(socket, "battle_active", "Finish this battle before a rematch.");
      if (!room.players.every((entry) => entry?.socket?.readyState === WebSocket.OPEN)) return fail(socket, "opponent_missing", "Both players must be connected for a rematch.");
      player.rematch = true;
      room.updatedAt = now;
      if (room.players.every((entry) => entry.rematch)) start(room, true);
      return broadcast(room);
    }
    if (room.phase !== "playing" || room.shot || room.battle.turn !== side || message.turnId !== room.turnId) {
      return fail(socket, "not_your_turn", "Wait for your current turn before aiming or firing.");
    }
    if (message.type === "taunt") {
      if (now - room.lastTaunts[side] < 5000) return fail(socket, "taunt_cooldown", "Wait a moment before taunting again.");
      clearEmote(room);
      room.lastTaunts[side] = now;
      room.emote = { id: ++room.emoteId, side, startedAt: now, endsAt: now + 1200 };
      room.emoteTimer = setTimeout(() => { clearEmote(room); broadcast(room); }, 1200);
      return broadcast(room);
    }
    if (message.kind === "special" && room.battle.specials[side] === 0) return fail(socket, "no_specials", "You have no special attacks left.");
    const input = { angle: message.angle, power: message.power, kind: message.kind };
    room.aims[side] = input;
    if (message.type === "aim") {
      if (!room.aimTimer) {
        const delay = Math.max(0, 50 - (now - room.lastAimBroadcastAt));
        room.aimTimer = setTimeout(() => {
          room.aimTimer = null;
          room.lastAimBroadcastAt = Date.now();
          broadcast(room);
        }, delay);
      }
      return;
    }
    const resolution = applyShot(room.battle, input, random);
    clearMatchTimers(room);
    room.turnDeadline = null;
    const animationMs = typeof options.shotAnimationMs === "function" ? options.shotAnimationMs(resolution.shot)
      : options.shotAnimationMs ?? shotDuration(resolution.shot);
    room.shot = {
      id: room.turnId, shooter: side, input, wind: room.battle.wind,
      startedAt: now, endsAt: now + animationMs, result: resolution.shot,
    };
    event(room, "shot", side, { damage: resolution.shot.damage, hit: resolution.shot.hit });
    broadcast(room);
    room.shotTimer = setTimeout(() => {
      room.shotTimer = null;
      if (room.phase !== "playing") return;
      room.battle = resolution.state;
      room.aims = room.aims.map((aim, player) => room.battle.specials[player] === 0 ? { ...aim, kind: "normal" } : aim);
      room.shot = null;
      room.turnId++;
      room.updatedAt = Date.now();
      if (room.battle.winner !== null) {
        room.phase = "finished";
        room.finishReason = "knockout";
      } else deadline(room);
      broadcast(room);
    }, animationMs);
  }

  server.on("upgrade", (request, socket, head) => {
    socket.on("error", () => {});
    const status = request.url?.split("?")[0] !== "/raft" ? "404 Not Found"
      : !origins.has(request.headers.origin) ? "403 Forbidden"
        : closing || wss.clients.size >= maxConnections ? "503 Service Unavailable" : null;
    if (status) { socket.end(`HTTP/1.1 ${status}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`); return; }
    wss.handleUpgrade(request, socket, head, (client) => wss.emit("connection", client));
  });
  wss.on("connection", (socket) => {
    socket.alive = true;
    socket.credits = 60;
    socket.creditAt = Date.now();
    socket.room = null;
    socket.side = null;
    socket.idleTimer = setTimeout(() => { if (!socket.room) socket.close(1000, "Join a room to play"); }, 30_000);
    socket.on("error", () => {});
    socket.on("pong", () => { socket.alive = true; });
    socket.on("message", (data, isBinary) => onMessage(socket, data, isBinary));
    socket.on("close", () => {
      clearTimeout(socket.idleTimer);
      const room = socket.room;
      const side = socket.side;
      if (closing || !room || !rooms.has(room.code)) return;
      const player = room.players[side];
      if (player?.socket !== socket) return;
      player.socket = null;
      player.disconnectedAt = Date.now();
      player.graceTimer = setTimeout(() => expirePlayer(room, side, player), reconnectGraceMs);
      broadcast(room);
    });
  });
  const heartbeat = setInterval(() => {
    for (const socket of wss.clients) {
      if (!socket.alive) { socket.terminate(); continue; }
      socket.alive = false;
      socket.ping();
    }
  }, options.heartbeatMs ?? 15_000);
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const room of rooms.values()) if (now - room.updatedAt >= roomTtlMs) removeRoom(room);
  }, options.cleanupIntervalMs ?? 60_000);
  heartbeat.unref();
  cleanup.unref();

  return {
    server,
    address: () => server.address(),
    listen: (port = 0, host = "127.0.0.1") => new Promise((resolveListen, reject) => {
      const onError = (error) => reject(error);
      server.once("error", onError);
      server.listen(port, host, () => {
        server.off("error", onError);
        resolveListen(server.address());
      });
    }),
    close: async () => {
      closing = true;
      clearInterval(heartbeat);
      clearInterval(cleanup);
      for (const room of rooms.values()) {
        clearMatchTimers(room);
        for (const player of room.players) clearTimeout(player?.graceTimer);
      }
      rooms.clear();
      for (const socket of wss.clients) { clearTimeout(socket.idleTimer); socket.terminate(); }
      await new Promise((done) => wss.close(done));
      if (server.listening) await new Promise((done, reject) => server.close((error) => error ? reject(error) : done()));
    },
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 8787);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be between 1 and 65535.");
  const raft = createRaftServer();
  const address = await raft.listen(port, process.env.HOST ?? "0.0.0.0");
  console.log(`Poké Raft server listening on ${address.address}:${address.port}/raft`);
  for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, async () => { await raft.close(); process.exit(0); });
}
