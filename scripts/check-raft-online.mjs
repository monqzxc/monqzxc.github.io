import assert from "node:assert/strict";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import test from "node:test";
import WebSocket from "../server/node_modules/ws/wrapper.mjs";
import { applyShot, chooseAiShot } from "../lib/raft-battle.ts";
import { createRaftServer } from "../server/raft-server.mjs";

const ORIGIN = "http://localhost:3100";
const TEST_TIMEOUT = 5000;

async function harness(t, options = {}) {
  const raft = createRaftServer({ turnDurationMs: 5000, shotAnimationMs: 20, random: () => 0.5, ...options });
  const address = await raft.listen();
  const url = `ws://127.0.0.1:${address.port}/raft`;
  const clients = [];
  t.after(async () => {
    for (const client of clients) client.socket.terminate();
    await raft.close();
  });
  async function connect() {
    const socket = new WebSocket(url, { origin: ORIGIN });
    const messages = [];
    const waiters = new Set();
    socket.on("error", () => {});
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      const waiter = [...waiters].find((pending) => pending.matches(message));
      if (waiter) { waiters.delete(waiter); clearTimeout(waiter.timer); waiter.resolve(message); }
      else messages.push(message);
    });
    const client = {
      socket, messages,
      send: (message) => socket.send(JSON.stringify(message)),
      next(matches, timeout = 2000) {
        const index = messages.findIndex(matches);
        if (index >= 0) return Promise.resolve(messages.splice(index, 1)[0]);
        return new Promise((resolve, reject) => {
          const waiter = { matches, resolve, timer: null };
          waiter.timer = setTimeout(() => { waiters.delete(waiter); reject(new Error(`No matching server message; inbox: ${JSON.stringify(messages)}`)); }, timeout);
          waiters.add(waiter);
        });
      },
      state: (matches = () => true) => client.next((message) => message.type === "state" && matches(message.snapshot)).then((message) => message.snapshot),
      error: (code) => client.next((message) => message.type === "error" && message.code === code),
    };
    clients.push(client);
    await once(socket, "open");
    return client;
  }
  async function pair(start = true) {
    const a = await connect();
    const b = await connect();
    a.send({ type: "create", pokemon: "pikachu" });
    const first = await a.next((message) => message.type === "welcome");
    b.send({ type: "join", code: first.code, pokemon: "bidoof" });
    const second = await b.next((message) => message.type === "welcome");
    if (!start) return { a, b, first, second };
    a.send({ type: "ready" });
    b.send({ type: "ready" });
    const state = await a.state((snapshot) => snapshot.phase === "playing");
    await b.state((snapshot) => snapshot.phase === "playing");
    return { a, b, first, second, state };
  }
  return { raft, connect, pair, url, httpUrl: `http://127.0.0.1:${address.port}` };
}

test("rooms synchronize two players, protect tokens, and require both ready", { timeout: TEST_TIMEOUT }, async (t) => {
  const h = await harness(t);
  const { a, b, first, second } = await h.pair(false);
  assert.match(first.code, /^[A-Z]{6}$/);
  assert.equal(first.side, 0);
  assert.equal(second.side, 1);
  assert.equal(first.token.length, 64);
  assert.notEqual(first.token, second.token);
  assert.equal(JSON.stringify(second.snapshot).includes(first.token), false);
  const third = await h.connect();
  third.send({ type: "join", code: first.code, pokemon: "gengar" });
  await third.error("room_full");
  a.send({ type: "choose", pokemon: "charizard" });
  await b.state((state) => state.players[0]?.pokemon === "charizard");
  a.send({ type: "ready" });
  const waiting = await b.state((state) => state.players[0]?.ready);
  assert.equal(waiting.phase, "waiting");
  assert.equal(waiting.turnDeadline, null);
  b.send({ type: "ready" });
  const [left, right] = await Promise.all([a.state((state) => state.phase === "playing"), b.state((state) => state.phase === "playing")]);
  assert.deepEqual(left, right);
  assert.equal(left.turnId, 1);
  assert.ok(left.turnDeadline - left.serverNow > 4900);
  assert.equal(JSON.stringify(a.messages).includes(second.token), false);
  a.send({ type: "choose", pokemon: "bidoof" });
  await a.error("battle_started");
});

test("server validates commands and resolves the same shot for both players after flight", { timeout: TEST_TIMEOUT }, async (t) => {
  const h = await harness(t, { shotAnimationMs: 100 });
  const { a, b, state } = await h.pair();
  const input = chooseAiShot(state.battle, "hard", () => 0.5);
  const fire = { type: "fire", turnId: state.turnId, ...input };
  b.send(fire);
  await b.error("not_your_turn");
  a.send({ ...fire, damage: 100 });
  await a.error("invalid_message");
  for (const invalid of [{ angle: 45.5 }, { power: 999 }, { kind: "hacked" }, { turnId: 0 }, { angle: null }]) {
    a.send({ ...fire, ...invalid });
    await a.error("invalid_message");
  }
  a.socket.send("not json");
  await a.error("invalid_message");
  a.send({ type: { toString: {} } });
  await a.error("invalid_message");
  a.send({ type: "choose", pokemon: "missing" });
  await a.error("invalid_message");
  a.send({ ...fire, type: "aim" });
  const aimed = await b.state((snapshot) => snapshot.aims[0].angle === input.angle && snapshot.aims[0].power === input.power);
  assert.deepEqual(aimed.aims[0], input);
  a.send(fire);
  const [flyingA, flyingB] = await Promise.all([a.state((snapshot) => snapshot.shot !== null), b.state((snapshot) => snapshot.shot !== null)]);
  assert.deepEqual(flyingA, flyingB);
  assert.deepEqual(flyingA.battle.health, [100, 100]);
  assert.equal(flyingA.turnDeadline, null);
  assert.equal(flyingA.shot.endsAt - flyingA.shot.startedAt, 100);
  a.send(fire);
  await a.error("not_your_turn");
  const [landedA, landedB] = await Promise.all([a.state((snapshot) => snapshot.turnId === 2), b.state((snapshot) => snapshot.turnId === 2)]);
  assert.deepEqual(landedA, landedB);
  assert.deepEqual(landedA.battle, applyShot(state.battle, input, () => 0.5).state);
  assert.ok(landedA.battle.health[1] < 100);
  assert.equal(landedA.shot, null);
  assert.ok(landedA.turnDeadline - landedA.serverNow > 4900);
  a.send(fire);
  await a.error("not_your_turn");
});

test("deadline skips turns without a client message and rejects a late shot", { timeout: TEST_TIMEOUT }, async (t) => {
  const h = await harness(t, { turnDurationMs: 100 });
  const { a, b, state } = await h.pair();
  const timedOut = await b.state((snapshot) => snapshot.lastEvent?.kind === "timeout" && snapshot.turnId === 2);
  assert.equal(timedOut.battle.turn, 1);
  assert.deepEqual(timedOut.battle.health, [100, 100]);
  assert.deepEqual(timedOut.battle.specials, [3, 3]);
  a.send({ type: "fire", turnId: state.turnId, angle: 45, power: 75, kind: "normal" });
  await a.error("not_your_turn");
  const secondTimeout = await a.state((snapshot) => snapshot.lastEvent?.kind === "timeout" && snapshot.turnId === 3);
  assert.equal(secondTimeout.battle.turn, 0);
  assert.equal(secondTimeout.battle.round, 2);
});

test("reconnecting preserves the deadline and grace expiry forfeits", { timeout: TEST_TIMEOUT }, async (t) => {
  const h = await harness(t, { reconnectGraceMs: 150, turnDurationMs: 2000 });
  const { a, b, first, state } = await h.pair();
  a.socket.terminate();
  await b.state((snapshot) => snapshot.players[0]?.connected === false);
  const resumed = await h.connect();
  resumed.send({ type: "resume", code: first.code, token: first.token });
  const welcome = await resumed.next((message) => message.type === "welcome");
  assert.equal(welcome.side, 0);
  assert.equal(welcome.snapshot.turnDeadline, state.turnDeadline);
  assert.equal(welcome.snapshot.turnId, state.turnId);
  assert.equal(welcome.token, first.token);
  const stranger = await h.connect();
  stranger.send({ type: "resume", code: first.code, token: "a".repeat(64) });
  await stranger.error("resume_failed");
  resumed.socket.terminate();
  const finished = await b.state((snapshot) => snapshot.phase === "finished");
  assert.equal(finished.battle.winner, 1);
  assert.equal(finished.finishReason, "disconnect");
  assert.equal(finished.turnDeadline, null);
  stranger.send({ type: "resume", code: first.code, token: first.token });
  await stranger.error("resume_failed");
});

test("leaving immediately forfeits and invalidates the former player token", { timeout: TEST_TIMEOUT }, async (t) => {
  const h = await harness(t);
  const { a, b, first } = await h.pair();
  a.send({ type: "leave" });
  await a.next((message) => message.type === "left");
  const finished = await b.state((snapshot) => snapshot.phase === "finished");
  assert.equal(finished.battle.winner, 1);
  assert.equal(finished.finishReason, "left");
  a.send({ type: "resume", code: first.code, token: first.token });
  await a.error("resume_failed");
  b.send({ type: "rematch" });
  await b.error("opponent_missing");
});

test("a ready player resuming starts a room once both players are ready", { timeout: TEST_TIMEOUT }, async (t) => {
  const h = await harness(t);
  const { a, b, first } = await h.pair(false);
  a.send({ type: "ready" });
  await b.state((snapshot) => snapshot.players[0]?.ready);
  a.socket.terminate();
  await b.state((snapshot) => snapshot.players[0]?.connected === false);
  b.send({ type: "ready" });
  await b.state((snapshot) => snapshot.players[1]?.ready);
  const resumed = await h.connect();
  resumed.send({ type: "resume", code: first.code, token: first.token });
  const welcome = await resumed.next((message) => message.type === "welcome");
  assert.equal(welcome.snapshot.phase, "playing");
  assert.equal(welcome.snapshot.turnId, 1);
  await b.state((snapshot) => snapshot.phase === "playing");
});

test("taunts synchronize without spending a turn and enforce actor, cooldown, and clearing", { timeout: TEST_TIMEOUT }, async (t) => {
  const h = await harness(t);
  const { a, b, state } = await h.pair();
  const taunt = { type: "taunt", turnId: state.turnId };
  b.send(taunt);
  await b.error("not_your_turn");
  a.send(taunt);
  const [left, right] = await Promise.all([a.state((snapshot) => snapshot.emote !== null), b.state((snapshot) => snapshot.emote !== null)]);
  assert.deepEqual(left, right);
  assert.equal(left.emote.side, 0);
  assert.equal(left.emote.endsAt - left.emote.startedAt, 1200);
  assert.equal(left.turnId, state.turnId);
  assert.equal(left.turnDeadline, state.turnDeadline);
  assert.deepEqual(left.battle, state.battle);
  a.send(taunt);
  await a.error("taunt_cooldown");
  a.send({ type: "fire", turnId: state.turnId, angle: 45, power: 75, kind: "normal" });
  const fired = await b.state((snapshot) => snapshot.shot !== null);
  assert.equal(fired.emote, null);
});

test("a rematch needs both votes and invalidates every earlier turn id", { timeout: TEST_TIMEOUT }, async (t) => {
  const h = await harness(t);
  const { a, b, state: initial } = await h.pair();
  let state = initial;
  let shots = 0;
  while (state.phase === "playing" && shots++ < 10) {
    const shooter = state.battle.turn === 0 ? a : b;
    const input = chooseAiShot(state.battle, "hard", () => 0.5);
    shooter.send({ type: "fire", turnId: state.turnId, ...input });
    state = await a.state((snapshot) => snapshot.turnId > state.turnId);
  }
  assert.equal(state.phase, "finished");
  assert.equal(state.finishReason, "knockout");
  assert.equal(state.battle.winner, 0);
  a.send({ type: "rematch" });
  const oneVote = await b.state((snapshot) => snapshot.players[0]?.rematch);
  assert.equal(oneVote.phase, "finished");
  b.send({ type: "rematch" });
  const rematch = await a.state((snapshot) => snapshot.lastEvent?.kind === "rematch");
  assert.equal(rematch.phase, "playing");
  assert.deepEqual(rematch.battle.health, [100, 100]);
  assert.deepEqual(rematch.battle.specials, [3, 3]);
  assert.ok(rematch.turnId > state.turnId);
  assert.equal(rematch.players[0].rematch, false);
  a.send({ type: "fire", turnId: initial.turnId, angle: 45, power: 75, kind: "normal" });
  await a.error("not_your_turn");
});

test("room capacity and stale waiting-room cleanup release bounded server space", { timeout: TEST_TIMEOUT }, async (t) => {
  const h = await harness(t, { maxRooms: 1, roomTtlMs: 80, cleanupIntervalMs: 10 });
  const a = await h.connect();
  a.send({ type: "create", pokemon: "pikachu" });
  const first = await a.next((message) => message.type === "welcome");
  const b = await h.connect();
  b.send({ type: "create", pokemon: "bidoof" });
  await b.error("server_full");
  await a.error("room_expired");
  b.send({ type: "join", code: first.code, pokemon: "bidoof" });
  await b.error("room_missing");
  b.send({ type: "create", pokemon: "bidoof" });
  const next = await b.next((message) => message.type === "welcome");
  assert.notEqual(next.code, first.code);
});

test("health endpoint, origin checks, path checks, payload and message limits", { timeout: TEST_TIMEOUT }, async (t) => {
  const h = await harness(t, { allowedOrigins: [ORIGIN] });
  const health = await fetch(`${h.httpUrl}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { ok: true, rooms: 0 });
  assert.equal((await fetch(`${h.httpUrl}/missing`)).status, 404);
  async function rejected(url, origin, status) {
    const socket = new WebSocket(url, { origin });
    socket.on("error", () => {});
    const [, response] = await once(socket, "unexpected-response");
    assert.equal(response.statusCode, status);
    response.resume();
    socket.terminate();
  }
  await rejected(h.url, "https://untrusted.example", 403);
  await rejected(h.url.replace("/raft", "/other"), ORIGIN, 404);
  const oversized = await h.connect();
  const closed = once(oversized.socket, "close");
  oversized.socket.send("x".repeat(4096));
  assert.equal((await closed)[0], 1009);
  const flood = await h.connect();
  const limited = once(flood.socket, "close");
  for (let i = 0; i < 100; i++) flood.send({ type: "sync" });
  assert.equal((await limited)[0], 1008);
  await delay(5);
});
