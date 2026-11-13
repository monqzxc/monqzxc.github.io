import assert from "node:assert/strict";
import test from "node:test";
import { CAST_SIZE, COMPACT_CAST_SIZE, compactPatch, createCast, createPokemonRoutine, isEntranceActivity, isHiddenActivity, isSpecial, LEGEND_HIDDEN_MS, LEGEND_VISIBLE_MS, nextPokemonRoutine, recast, SHINY_ODDS } from "../lib/pokemon-behavior.ts";
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

test("each theme has ten residents of its type, at most five on stage", () => {
  assert.equal(new Set(everyone).size, everyone.length, "nobody lives in two habitats");
  for (const theme of THEME_ORDER) {
    assert.ok(THEMES[theme].habitat);
    assert.equal(RESIDENTS[theme].length, 10);
    assert.equal(new Set(RESIDENTS[theme]).size, 10);
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
      assert.equal(seen.size, 10, "the whole roster takes a turn");
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
