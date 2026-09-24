import assert from "node:assert/strict";
import test from "node:test";
import { createPokemonRoutine, nextPokemonRoutine } from "../lib/pokemon-behavior.ts";

const species = ["gengar", "gastly", "haunter", "gible", "sandshrew", "diglett"];
function seededRandom(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

test("random routines stay in bounds and only relocate while invisible", () => {
  for (const compact of [false, true]) {
    for (const [index, pokemon] of species.entries()) {
      const random = seededRandom(index + 27);
      let routine = createPokemonRoutine(pokemon, index, compact);
      for (let step = 0; step < 150; step++) {
        const next = nextPokemonRoutine(pokemon, index, compact, routine, random);
        for (const point of [next.from, next.to]) {
          assert.ok(Number.isFinite(point.x) && point.x >= 0 && point.x <= 100);
          assert.ok(Number.isFinite(point.y) && point.y >= 0 && point.y <= 100);
          if (compact) {
            const left = (index % 3) * 42 + 1;
            assert.ok(point.x >= left && point.x <= left + 14, "mobile residents stay in separate patches");
          }
        }
        assert.ok(next.duration > 0 && Number.isFinite(next.duration));
        assert.equal(next.cycle, routine.cycle + 1);
        if (next.activity !== "hidden" && next.activity !== "underground") {
          assert.deepEqual(next.from, routine.to, "visible motion must continue from its previous endpoint");
        } else {
          assert.ok(routine.activity === "vanish" || routine.activity === "burrow");
          assert.deepEqual(next.from, next.to, "relocation happens inside the hidden phase");
        }
        if (next.to.x !== next.from.x) assert.equal(next.facing, next.to.x > next.from.x ? 1 : -1);
        routine = next;
      }
    }
  }
});

test("ground residents perform distinct walking, digging, and tunnelling routines", () => {
  const activities = {};
  for (const pokemon of ["gible", "sandshrew", "diglett"]) {
    let routine = createPokemonRoutine(pokemon, 0, false);
    activities[pokemon] = new Set();
    for (let step = 0; step < 30; step++) {
      activities[pokemon].add(routine.activity);
      routine = nextPokemonRoutine(pokemon, 0, false, routine, () => .5);
    }
  }
  assert.ok(activities.gible.has("walk") && activities.gible.has("look"));
  assert.ok(activities.sandshrew.has("walk") && activities.sandshrew.has("dig") && activities.sandshrew.has("emerge"));
  assert.ok(activities.diglett.has("underground") && activities.diglett.has("emerge"));
  assert.ok(!activities.diglett.has("walk"), "Diglett tunnels rather than walking above ground");
});

test("ghosts choose new desktop zones after fading; tunnellers change spots even with repeated random values", () => {
  for (const random of [() => 0, () => .5, () => .999999]) {
    for (const pokemon of ["gengar", "gastly", "haunter", "sandshrew", "diglett"]) {
      let routine = createPokemonRoutine(pokemon, 0, false);
      for (let step = 0; step < 25; step++) {
        const next = nextPokemonRoutine(pokemon, 0, false, routine, random);
        if (next.activity === "hidden") assert.notEqual(next.zone, routine.zone);
        if (next.activity === "underground") assert.notDeepEqual(next.to, routine.to);
        routine = next;
      }
    }
  }
});

test("initial positions are stable before randomness begins", () => {
  for (const pokemon of species) {
    assert.deepEqual(createPokemonRoutine(pokemon, 0, false), createPokemonRoutine(pokemon, 0, false));
  }
});
