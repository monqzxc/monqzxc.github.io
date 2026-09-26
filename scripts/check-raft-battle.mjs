import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_HEALTH, SPECIAL_CHARGES, TARGETS, TARGET_RADIUS, WATER_Y, WORLD_WIDTH,
  applyShot, chooseAiShot, createBattle, simulateShot,
} from "../lib/raft-battle.ts";

function seededRandom(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

const fresh = (overrides = {}) => ({ ...createBattle(() => 0.5), ...overrides });
const miss = { angle: 45, power: 20, kind: "normal" };
const close = (actual, expected, tolerance = 0.000001) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} differs from ${expected}`);

test("new battles have independent equal teams and bounded, reproducible wind", () => {
  const left = createBattle(() => 0);
  const right = createBattle(() => 1);
  assert.deepEqual(left.health, [MAX_HEALTH, MAX_HEALTH]);
  assert.deepEqual(left.specials, [SPECIAL_CHARGES, SPECIAL_CHARGES]);
  assert.equal(left.turn, 0);
  assert.equal(left.round, 1);
  assert.equal(left.winner, null);
  assert.equal(left.wind, -5);
  assert.equal(right.wind, 5);
  assert.notEqual(left.health, right.health);
  assert.notEqual(left.specials, right.specials);
  assert.deepEqual(createBattle(seededRandom(42)), createBattle(seededRandom(42)));
});

test("opposite shots mirror exactly when the wind direction is reversed", () => {
  for (const wind of [-5, -2, 0, 3, 5]) {
    for (const input of [miss, { angle: 46, power: 82, kind: "special" }, { angle: 77, power: 100, kind: "normal" }]) {
      const left = simulateShot(0, input, wind);
      const right = simulateShot(1, input, -wind);
      assert.equal(left.points.length, right.points.length);
      assert.equal(left.damage, right.damage);
      assert.equal(left.direct, right.direct);
      assert.equal(right.hit, left.hit === null ? null : 1 - left.hit);
      left.points.forEach((point, index) => {
        close(point.x + right.points[index].x, WORLD_WIDTH);
        close(point.y, right.points[index].y);
      });
    }
  }
});

test("wind alters travel in its world direction and splash stops at the water surface", () => {
  const against = simulateShot(0, miss, -5);
  const calm = simulateShot(0, miss, 0);
  const behind = simulateShot(0, miss, 5);
  assert.ok(against.impact.x < calm.impact.x && calm.impact.x < behind.impact.x);
  for (const shot of [against, calm, behind]) {
    close(shot.impact.y, WATER_Y);
    assert.deepEqual(shot.points.at(-1), shot.impact);
    assert.equal(shot.hit, null);
    assert.equal(shot.damage, 0);
  }
});

test("direct collision terminates the trajectory at the creature, with stronger specials", () => {
  const state = fresh();
  const input = chooseAiShot(state, "hard");
  const normal = simulateShot(0, { ...input, kind: "normal" }, 0);
  const special = simulateShot(0, { ...input, kind: "special" }, 0);
  assert.equal(normal.hit, 1);
  assert.equal(normal.direct, true);
  assert.equal(normal.damage, 28);
  assert.equal(special.damage, 42);
  assert.deepEqual(normal.points, special.points);
  close(Math.hypot(normal.impact.x - TARGETS[1].x, normal.impact.y - TARGETS[1].y), TARGET_RADIUS);
  assert.ok(normal.points.every(point => point.y < WATER_Y));
});

test("nearby water impacts cause weaker splash damage and clear misses cause none", () => {
  const shots = Array.from({ length: 81 }, (_, i) => simulateShot(0, { angle: 42, power: 20 + i, kind: "normal" }, 0));
  const splash = shots.find(shot => shot.hit === 1 && !shot.direct);
  assert.ok(splash, "at least one near miss splashes the opposing raft");
  assert.ok(splash.damage > 0 && splash.damage < 28);
  close(splash.impact.y, WATER_Y);
  assert.ok(shots.some(shot => shot.hit === null && shot.damage === 0));
});

test("shots alternate turns, keep wind for both players, and update each full round", () => {
  const original = fresh();
  Object.freeze(original.health);
  Object.freeze(original.specials);
  Object.freeze(original);
  let draws = 0;
  const random = () => { draws++; return 1; };
  const first = applyShot(original, miss, random).state;
  assert.equal(first.turn, 1);
  assert.equal(first.round, 1);
  assert.equal(first.wind, 0);
  assert.equal(draws, 0);
  const second = applyShot(first, miss, random).state;
  assert.equal(second.turn, 0);
  assert.equal(second.round, 2);
  assert.equal(second.wind, 5);
  assert.equal(draws, 1);
  assert.deepEqual(original, fresh());
});

test("special charges belong to their shooter and exhausted specials become normal shots", () => {
  let state = fresh();
  for (let round = 0; round < SPECIAL_CHARGES; round++) {
    state = applyShot(state, { ...miss, kind: "special" }, () => 0.5).state;
    assert.deepEqual(state.specials, [SPECIAL_CHARGES - round - 1, SPECIAL_CHARGES]);
    state = applyShot(state, miss, () => 0.5).state;
  }
  const input = chooseAiShot(state, "hard");
  const exhausted = applyShot(state, { ...input, kind: "special" });
  assert.equal(exhausted.shot.kind, "normal");
  assert.equal(exhausted.shot.damage, 28);
  assert.deepEqual(exhausted.state.specials, [0, SPECIAL_CHARGES]);
});

test("lethal hits clamp health, declare the surviving winner, and stop all later turns", () => {
  for (const turn of [0, 1]) {
    const health = turn === 0 ? [100, 12] : [12, 100];
    const state = fresh({ turn, health });
    const input = chooseAiShot(state, "hard");
    const result = applyShot(state, input, () => { throw Error("a winning shot must not advance the weather"); });
    assert.equal(result.state.winner, turn);
    assert.equal(result.state.turn, turn);
    assert.equal(result.state.health[1 - turn], 0);
    assert.equal(result.state.health[turn], 100);
    const later = applyShot(result.state, { ...miss, kind: "special" }, () => { throw Error("battle already finished"); });
    assert.equal(later.state, result.state);
    assert.equal(later.shot.damage, 0);
    assert.equal(later.shot.hit, null);
    assert.equal(later.shot.points.length, 1);
  }
});

test("hard AI directly hits from either raft in every allowed wind, using normal rules", () => {
  for (const turn of [0, 1]) {
    for (let wind = -5; wind <= 5; wind++) {
      const state = fresh({ turn, wind, specials: [0, 0] });
      const before = structuredClone(state);
      const input = chooseAiShot(state, "hard");
      assert.deepEqual(state, before, "choosing an aim does not alter health or ammo");
      const shot = simulateShot(turn, input, wind);
      assert.equal(shot.hit, 1 - turn, `side ${turn}, wind ${wind}`);
      assert.equal(shot.direct, true);
      assert.equal(shot.damage, 28);
      const result = applyShot(state, input, () => 0.5);
      assert.deepEqual(result.shot, shot);
      assert.equal(result.state.health[1 - turn], 72);
      assert.equal(result.state.health[turn], 100);
    }
  }
});

test("easy AI is less accurate, remains legal, and still lands useful shots", () => {
  let directHits = 0;
  let damagingHits = 0;
  const samples = 220;
  for (let seed = 1; seed <= samples; seed++) {
    const state = fresh({ turn: seed % 2, wind: seed % 11 - 5, specials: [0, 0] });
    const input = chooseAiShot(state, "easy", seededRandom(seed));
    assert.ok(input.angle >= 10 && input.angle <= 80);
    assert.ok(input.power >= 20 && input.power <= 100);
    assert.equal(input.kind, "normal");
    const shot = simulateShot(state.turn, input, state.wind);
    if (shot.hit === 1 - state.turn) {
      if (shot.direct) directHits++;
      damagingHits++;
    }
  }
  assert.ok(directHits > samples * 0.1 && directHits < samples * 0.65, `${directHits}/${samples} easy direct hits`);
  assert.ok(damagingHits > samples * 0.25, `${damagingHits}/${samples} easy damaging hits`);
});

test("finite fallback values and clamped controls keep trajectories safe", () => {
  for (const turn of [0, 1]) {
    for (const input of [
      { angle: NaN, power: Infinity, kind: "normal" },
      { angle: -100, power: -900, kind: "special" },
      { angle: 9000, power: 9000, kind: "normal" },
    ]) {
      const shot = simulateShot(turn, input, NaN);
      assert.ok(shot.points.length > 1 && shot.points.length <= 481);
      assert.ok(shot.points.every(point => Number.isFinite(point.x) && Number.isFinite(point.y)));
      assert.ok(shot.damage >= 0 && shot.damage <= 42);
    }
  }
});
