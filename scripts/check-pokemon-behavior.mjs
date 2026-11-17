import assert from "node:assert/strict";
import test from "node:test";
import { CAST_SIZE, COMPACT_CAST_SIZE, compactPatch, createCast, createPokemonRoutine, isEntranceActivity, isHiddenActivity, isSpecial, LEGEND_HIDDEN_MS, LEGEND_VISIBLE_MS, nextPokemonRoutine, recast, SHINY_ODDS } from "../lib/pokemon-behavior.ts";
import * as pokemonBehavior from "../lib/pokemon-behavior.ts";
import * as pokemonCollection from "../lib/pokemon-collection.ts";
import { POKEMON_COLLECTION_STORAGE_KEY, parsePokemonCollection, recordPokemonCapture, releaseAllPokemonCaptures, releasePokemonCapture } from "../lib/pokemon-collection.ts";
import { RESIDENTS, SPECIES, THEME_ORDER, THEMES } from "../lib/pokemon-roster.ts";
import { nextTheme, ROTATION_INTERVALS } from "../lib/theme-rotation.ts";

const everyone = THEME_ORDER.flatMap(theme => RESIDENTS[theme]);
function seededRandom(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
function run(species, slot, compact, steps, random) {
  const routines = [createPokemonRoutine(species, slot, compact)];
  for (let step = 0; step < steps; step++) routines.push(nextPokemonRoutine(species, slot, compact, routines.at(-1), random));
  return routines;
}

test("routines stay in bounds and only relocate or turn shiny while invisible", () => {
  for (const theme of THEME_ORDER) {
    for (const compact of [false, true]) {
      // Every resident can take any stage slot.
      for (const [index, species] of RESIDENTS[theme].entries()) {
        const slot = index % (compact ? COMPACT_CAST_SIZE : CAST_SIZE);
        const routines = run(species, slot, compact, 300, seededRandom(slot + 27));
        for (const [step, next] of routines.slice(1).entries()) {
          const previous = routines[step];
          for (const point of [next.from, next.to]) {
            assert.ok(Number.isFinite(point.x) && point.x >= 0 && point.x <= 100);
            assert.ok(Number.isFinite(point.y) && point.y >= 0 && point.y <= 100);
            if (compact) {
              const patch = compactPatch(slot, SPECIES[species].movement === "air");
              assert.ok(point.x >= patch.left && point.x <= patch.right, `${species} stays in its own phone patch`);
            }
          }
          assert.ok(next.duration > 0 && Number.isFinite(next.duration));
          assert.equal(next.cycle, previous.cycle + 1);
          if (isHiddenActivity(next.activity)) {
            assert.ok(previous.activity === "vanish" || previous.activity === "burrow");
            assert.deepEqual(next.from, next.to, "relocation happens inside the hidden phase");
          } else {
            assert.deepEqual(next.from, previous.to, `${species}: visible motion continues from its previous endpoint`);
          }
          if (next.shiny !== previous.shiny) assert.ok(isEntranceActivity(next.activity), "shiny form only changes while reappearing");
          if (next.to.x !== next.from.x) assert.equal(next.facing, next.to.x > next.from.x ? 1 : -1);
        }
      }
    }
  }
});

test("every regular performs its repertoire, then leaves and comes back", () => {
  const expected = {
    gengar: ["walk", "run", "jump", "smile", "attack", "vanish", "appear"],
    haunter: ["float", "fly", "attack", "vanish", "appear"],
    gastly: ["float", "fly", "smile", "vanish", "appear"],
    mismagius: ["float", "fly", "smile", "attack", "vanish", "appear"],
    drifblim: ["float", "fly", "attack", "vanish", "appear"],
    chandelure: ["float", "fly", "roar", "attack", "vanish", "appear"],
    dusknoir: ["walk", "roar", "attack", "vanish", "appear"],
    sableye: ["walk", "run", "jump", "smile", "attack", "vanish", "appear"],
    mimikyu: ["walk", "jump", "smile", "attack", "vanish", "appear"],
    gible: ["walk", "run", "jump", "roar", "smile", "attack", "burrow", "emerge"],
    flygon: ["fly", "float", "attack", "vanish", "appear"],
    diglett: ["idle", "smile", "attack", "burrow", "emerge"],
    donphan: ["walk", "run", "roar", "attack", "vanish", "appear"],
    garchomp: ["walk", "run", "jump", "roar", "attack", "burrow", "emerge"],
    cubone: ["walk", "run", "jump", "smile", "attack", "vanish", "appear"],
    sandslash: ["walk", "run", "attack", "burrow", "emerge"],
    hippowdon: ["walk", "roar", "attack", "burrow", "emerge"],
    gliscor: ["fly", "float", "attack", "vanish", "appear"],
  };
  for (const [species, activities] of Object.entries(expected)) {
    const seen = new Set(run(species, 0, false, 400, seededRandom(9)).map(routine => routine.activity));
    for (const activity of activities) assert.ok(seen.has(activity), `${species} should ${activity}`);
  }
  const diglett = new Set(run("diglett", 0, false, 400, seededRandom(3)).map(routine => routine.activity));
  assert.ok(!diglett.has("walk") && !diglett.has("run"), "Diglett tunnels rather than walking");
});

test("legendaries and mythicals hold the stage for exactly five seconds, then stay away for five", () => {
  for (const species of everyone.filter(name => isSpecial(SPECIES[name]))) {
    const routines = run(species, 0, false, 60, seededRandom(4));
    assert.ok(isHiddenActivity(routines[0].activity), "legendaries start offstage");
    let visible = 0;
    let checked = 0;
    for (const routine of routines.slice(1)) {
      if (isHiddenActivity(routine.activity)) assert.equal(routine.duration, LEGEND_HIDDEN_MS);
      if (isEntranceActivity(routine.activity)) visible = 0;
      else if (["roar", "smile", "attack", "float", "idle"].includes(routine.activity)) visible += routine.duration;
      else if (routine.activity === "vanish" || routine.activity === "burrow") {
        assert.equal(visible, LEGEND_VISIBLE_MS);
        checked++;
      }
    }
    assert.ok(checked >= 5);
  }
});

test("roughly one reappearance in twenty is shiny", () => {
  let entrances = 0;
  let shinies = 0;
  for (const species of everyone) {
    for (const routine of run(species, 0, false, 4000, seededRandom(species.length * 101))) {
      if (!isEntranceActivity(routine.activity)) continue;
      entrances++;
      if (routine.shiny) shinies++;
    }
  }
  const rate = shinies / entrances;
  assert.ok(entrances > 1000);
  assert.ok(rate > .6 / SHINY_ODDS && rate < 1.4 / SHINY_ODDS, `shiny rate ${rate}`);
});

test("flyers and ghosts reappear in a new sky zone even with repeated random values", () => {
  for (const random of [() => 0, () => .5, () => .999999]) {
    for (const species of everyone.filter(name => SPECIES[name].movement === "air")) {
      const routines = run(species, 0, false, 40, random);
      for (const [step, next] of routines.slice(1).entries()) {
        if (next.activity === "hidden") assert.notEqual(next.zone, routines[step].zone);
      }
    }
    for (const species of ["gible", "diglett"]) {
      const routines = run(species, 0, false, 40, random);
      for (const [step, next] of routines.slice(1).entries()) {
        if (next.activity === "underground") assert.notDeepEqual(next.to, routines[step].to);
      }
    }
  }
});

test("initial positions are stable before randomness begins", () => {
  for (const species of everyone) {
    assert.deepEqual(createPokemonRoutine(species, 0, false), createPokemonRoutine(species, 0, false));
    assert.equal(createPokemonRoutine(species, 0, false).shiny, false);
  }
});

test("mythicals greet with a smile, legendaries with a roar", () => {
  for (const species of everyone.filter(name => isSpecial(SPECIES[name]))) {
    const activities = new Set(run(species, 0, false, 30, seededRandom(9)).map(routine => routine.activity));
    assert.ok(activities.has(SPECIES[species].mythical ? "smile" : "roar"), species);
    assert.ok(!activities.has(SPECIES[species].mythical ? "roar" : "smile"), species);
  }
});

test("special catches use a 50% roll while ordinary catches are guaranteed", () => {
  const { rollPokemonCatch } = pokemonBehavior;
  assert.equal(typeof rollPokemonCatch, "function");
  let randomCalls = 0;
  assert.equal(rollPokemonCatch(false, () => { randomCalls++; return 0.99; }), true);
  assert.equal(randomCalls, 0, "ordinary catches do not consume randomness");
  assert.equal(rollPokemonCatch(true, () => 0), true);
  assert.equal(rollPokemonCatch(true, () => 0.499999), true);
  assert.equal(rollPokemonCatch(true, () => 0.5), false);
  assert.equal(rollPokemonCatch(true, () => 0.999999), false);
});

test("each theme has fifteen residents of its type, at most five on stage", () => {
  const additions = {
    gengar: ["duskull", "drifloon", "litwick", "phantump", "pumpkaboo"],
    gible: ["sandshrew", "trapinch", "rhyhorn", "drilbur", "numel"],
    piplup: ["mudkip", "buizel", "poliwag", "clamperl", "finneon"],
    charmander: ["torchic", "fennekin", "litten", "fuecoco", "charcadet"],
    bulbasaur: ["snivy", "turtwig", "seedot", "petilil", "smoliv"],
  };
  assert.equal(new Set(everyone).size, everyone.length, "nobody lives in two habitats");
  for (const theme of THEME_ORDER) {
    assert.ok(THEMES[theme].habitat);
    assert.equal(RESIDENTS[theme].length, 15);
    assert.deepEqual(RESIDENTS[theme].slice(-5), additions[theme], "the five new residents match their habitat");
    assert.equal(new Set(RESIDENTS[theme]).size, 15);
    assert.equal(RESIDENTS[theme].filter(species => SPECIES[species].legendary).length, 1);
    assert.equal(RESIDENTS[theme].filter(species => SPECIES[species].mythical).length, 1);
    assert.ok(!RESIDENTS[theme].some(species => SPECIES[species].legendary && SPECIES[species].mythical));
    assert.equal(RESIDENTS[theme][0], theme, "the theme's partner leads its roster");
    if (theme === "gengar") assert.ok(RESIDENTS[theme].every(species => SPECIES[species].ghost), "the graveyard is all Ghost types");
    for (const compact of [false, true]) {
      const random = seededRandom(compact ? 5 : 6);
      let cast = createCast(theme, compact, random);
      const seen = new Set(cast.map(member => member.species));
      for (let step = 0; step < 600; step++) {
        assert.equal(cast.length, compact ? COMPACT_CAST_SIZE : CAST_SIZE);
        assert.equal(cast[0].species, theme, "the partner never leaves");
        assert.equal(new Set(cast.map(member => member.species)).size, cast.length, "nobody is on stage twice");
        assert.ok(cast.filter(member => isSpecial(SPECIES[member.species])).length <= 1, "one legendary or mythical at a time");
        for (const member of cast) assert.ok(RESIDENTS[theme].includes(member.species));
        const slot = 1 + Math.floor(random() * (cast.length - 1));
        const next = recast(cast, slot, theme, random);
        assert.ok(next[slot].species !== cast[slot].species && next[slot].entering, "a newcomer makes an entrance");
        cast = next;
        cast.forEach(member => seen.add(member.species));
      }
      assert.equal(seen.size, 15, "the whole roster takes a turn");
      assert.deepEqual(recast(cast, 0, theme, random), cast);
    }
  }
});

test("newcomers start offstage and enter on their next step", () => {
  for (const species of everyone) {
    const routine = createPokemonRoutine(species, 2, false, 1, true);
    assert.ok(isHiddenActivity(routine.activity));
    assert.ok(isEntranceActivity(nextPokemonRoutine(species, 2, false, routine, seededRandom(1)).activity));
  }
});

test("in-order rotation visits every habitat once per lap", () => {
  let theme = THEME_ORDER[2];
  const visited = [];
  for (let step = 0; step < THEME_ORDER.length; step++) visited.push(theme = nextTheme(theme, "order"));
  assert.deepEqual(new Set(visited), new Set(THEME_ORDER));
  assert.equal(visited.at(-1), THEME_ORDER[2], "a full lap comes home");
});

test("shuffle always moves to a different habitat and reaches them all", () => {
  for (const random of [() => 0, () => .5, () => .999999, seededRandom(3)]) {
    let theme = "gengar";
    for (let step = 0; step < 200; step++) {
      const next = nextTheme(theme, "shuffle", random);
      assert.notEqual(next, theme);
      assert.ok(THEME_ORDER.includes(next));
      theme = next;
    }
  }
  const random = seededRandom(11);
  const seen = new Set();
  let theme = "gible";
  for (let step = 0; step < 100; step++) seen.add(theme = nextTheme(theme, "shuffle", random));
  assert.equal(seen.size, THEME_ORDER.length);
});

test("rotation intervals are sensible", () => {
  for (const { ms } of ROTATION_INTERVALS) assert.ok(ms === null || ms >= 10_000);
});

test("malformed or missing collection data returns an empty collection", () => {
  assert.deepEqual(parsePokemonCollection(null), []);
  assert.deepEqual(parsePokemonCollection("not-json"), []);
});

test("collection data ignores unknown species and invalid shiny flags", () => {
  assert.deepEqual(parsePokemonCollection(JSON.stringify([
    { species: "missingno", shiny: false },
    { species: "gengar", shiny: "yes" },
    { species: "gengar", shiny: false },
  ])), [{ species: "gengar", shiny: false }]);
});

test("collection data deduplicates captured forms", () => {
  assert.deepEqual(parsePokemonCollection(JSON.stringify([
    { species: "piplup", shiny: true },
    { species: "piplup", shiny: true },
  ])), [{ species: "piplup", shiny: true }]);
});

test("recording a capture persists it and keeps normal and shiny forms distinct", () => {
  const saved = new Map();
  const storage = { setItem: (key, value) => saved.set(key, value) };
  const normal = recordPokemonCapture(storage, [], { species: "piplup", shiny: false });
  const shiny = recordPokemonCapture(storage, normal.collection, { species: "piplup", shiny: true });

  assert.equal(normal.result, "captured");
  assert.equal(shiny.result, "captured");
  assert.deepEqual(shiny.collection, [
    { species: "piplup", shiny: false },
    { species: "piplup", shiny: true },
  ]);
  assert.deepEqual(JSON.parse(saved.get(POKEMON_COLLECTION_STORAGE_KEY)), shiny.collection);
});

test("recording a duplicate capture does not write it again", () => {
  let writes = 0;
  const collection = [{ species: "gengar", shiny: false }];
  const result = recordPokemonCapture({ setItem: () => { writes++; } }, collection, collection[0]);

  assert.equal(result.result, "already-captured");
  assert.equal(result.collection, collection);
  assert.equal(writes, 0);
});

test("a failed storage write does not report or add a capture", () => {
  const collection = [{ species: "gengar", shiny: false }];
  const result = recordPokemonCapture({ setItem: () => { throw new Error("quota exceeded"); } }, collection, { species: "piplup", shiny: false });

  assert.equal(result.result, "storage-error");
  assert.equal(result.collection, collection);
  assert.deepEqual(collection, [{ species: "gengar", shiny: false }]);
});

test("only successful captures animate when reduced motion is off", () => {
  const { shouldAnimatePokemonCapture } = pokemonCollection;
  assert.equal(typeof shouldAnimatePokemonCapture, "function");
  assert.equal(shouldAnimatePokemonCapture("captured", false), true);
  assert.equal(shouldAnimatePokemonCapture("captured", true), false);
  assert.equal(shouldAnimatePokemonCapture("already-captured", false), false);
  assert.equal(shouldAnimatePokemonCapture("storage-error", false), false);
});

test("only the capture-pull animation completes a capture", async () => {
  const { isPokemonCaptureAnimation } = await import("../lib/pokemon-capture-animation.ts");
  assert.equal(typeof isPokemonCaptureAnimation, "function");
  assert.equal(isPokemonCaptureAnimation("pokemon-happy"), false);
  assert.equal(isPokemonCaptureAnimation("pokemon-capture-pull"), true);
});

test("capture bolt connects its endpoints with two finite zig-zag points", async () => {
  const captureAnimation = await import("../lib/pokemon-capture-animation.ts").catch(error => {
    if (error?.code === "ERR_MODULE_NOT_FOUND") return {};
    throw error;
  });
  assert.equal(typeof captureAnimation.getPokemonCaptureBoltPoints, "function");
  const start = { x: 20, y: 30 };
  const end = { x: 180, y: 110 };
  const points = captureAnimation.getPokemonCaptureBoltPoints(start, end);
  assert.deepEqual(points[0], start);
  assert.deepEqual(points.at(-1), end);
  assert.equal(points.length, 4);
  assert.ok(points.slice(1, -1).every(point => Number.isFinite(point.x) && Number.isFinite(point.y)));
  const signedOffsets = points.slice(1, -1).map(point => (end.x - start.x) * (point.y - start.y) - (end.y - start.y) * (point.x - start.x));
  assert.ok(signedOffsets[0] * signedOffsets[1] < 0, "interior points zig-zag to opposite sides of the beam");

  const equalPoints = captureAnimation.getPokemonCaptureBoltPoints(start, start);
  assert.deepEqual(equalPoints[0], start);
  assert.deepEqual(equalPoints.at(-1), start);
  assert.ok(equalPoints.every(point => Number.isFinite(point.x) && Number.isFinite(point.y)));
});

test("capturing the habitat partner replaces that on-stage appearance", () => {
  const { recastCapturedResident } = pokemonBehavior;
  assert.equal(typeof recastCapturedResident, "function");
  const cast = createCast("gengar", false, seededRandom(12));
  const next = recastCapturedResident(cast, 0, "gengar", seededRandom(14));

  assert.equal(next.length, cast.length);
  assert.notEqual(next[0].species, "gengar");
  assert.ok(RESIDENTS.gengar.includes(next[0].species));
  assert.equal(next[0].entering, true);
  assert.deepEqual(next.slice(1), cast.slice(1));
  assert.equal(new Set(next.map(member => member.species)).size, next.length);
});

test("releasing frees only that form and persists the smaller collection", () => {
  const saved = new Map();
  const storage = { setItem: (key, value) => saved.set(key, value) };
  const collection = [{ species: "piplup", shiny: false }, { species: "piplup", shiny: true }];
  const result = releasePokemonCapture(storage, collection, { species: "piplup", shiny: true });

  assert.equal(result.result, "released");
  assert.deepEqual(result.collection, [{ species: "piplup", shiny: false }]);
  assert.deepEqual(JSON.parse(saved.get(POKEMON_COLLECTION_STORAGE_KEY)), result.collection);
  assert.equal(recordPokemonCapture(storage, result.collection, { species: "piplup", shiny: true }).result, "captured");
});

test("releasing an uncaught form or failing to save leaves the collection unchanged", () => {
  const collection = [{ species: "piplup", shiny: false }];
  let writes = 0;
  const missing = releasePokemonCapture({ setItem: () => { writes++; } }, collection, { species: "gengar", shiny: false });
  assert.equal(missing.result, "not-captured");
  assert.equal(missing.collection, collection);
  assert.equal(writes, 0);

  const failed = releasePokemonCapture({ setItem: () => { throw new Error("quota exceeded"); } }, collection, collection[0]);
  assert.equal(failed.result, "storage-error");
  assert.equal(failed.collection, collection);
});

test("releasing all empties the saved Pokédex, and keeps it on a failed write", () => {
  const saved = new Map();
  const storage = { setItem: (key, value) => saved.set(key, value) };
  const collection = [{ species: "piplup", shiny: false }, { species: "gengar", shiny: true }];
  const result = releaseAllPokemonCaptures(storage, collection);
  assert.equal(result.result, "released");
  assert.deepEqual(result.collection, []);
  assert.deepEqual(JSON.parse(saved.get(POKEMON_COLLECTION_STORAGE_KEY)), []);

  assert.equal(releaseAllPokemonCaptures(storage, []).result, "not-captured");
  const failed = releaseAllPokemonCaptures({ setItem: () => { throw new Error("quota exceeded"); } }, collection);
  assert.equal(failed.result, "storage-error");
  assert.equal(failed.collection, collection);
});
