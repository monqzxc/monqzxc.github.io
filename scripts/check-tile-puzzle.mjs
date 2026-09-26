import assert from "node:assert/strict";
import test from "node:test";
import { STORAGE_KEY, addPuzzleWin, canMoveTile, createPuzzle, isSolved, moveTile, parsePuzzleSave } from "../lib/tile-puzzle.ts";

const solved = size => Array.from({ length: size * size }, (_, index) => (index + 1) % (size * size));
const session = (overrides = {}) => ({ id: "test-game", pokemon: "gengar", size: 3, tiles: [1, 2, 3, 4, 5, 6, 7, 0, 8], moves: 12, elapsedMs: 12400, status: "playing", ...overrides });
const win = (overrides = {}) => ({ id: "test-win", pokemon: "pikachu", size: 3, moves: 24, elapsedMs: 12345, completedAt: "2026-09-26T08:00:00.000Z", ...overrides });
const readSession = candidate => parsePuzzleSave(JSON.stringify({ version: 1, session: candidate, wins: [] })).session;

function seededRandom(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

// Independent inversion count: odd grids need even numbered-tile parity;
// even grids additionally depend on the blank row, counted from the bottom.
function solvable(tiles, size) {
  const numbered = tiles.filter(Boolean);
  let inversions = 0;
  for (let i = 0; i < numbered.length; i++) {
    inversions += numbered.slice(i + 1).filter(value => value < numbered[i]).length;
  }
  return size === 3 ? inversions % 2 === 0 : (inversions + size - Math.floor(tiles.indexOf(0) / size)) % 2 === 1;
}

function distance(tiles, size) {
  return tiles.reduce((sum, tile, index) => tile === 0 ? sum : sum + Math.abs(Math.floor(index / size) - Math.floor((tile - 1) / size)) + Math.abs(index % size - (tile - 1) % size), 0);
}

test("scrambles are complete, nontrivial, solvable permutations with unique sessions", () => {
  const originalRandom = Math.random;
  const ids = new Set();
  try {
    for (const size of [3, 4]) {
      for (let seed = 1; seed <= 100; seed++) {
        Math.random = seededRandom(seed);
        const puzzle = createPuzzle("gengar", size);
        assert.deepEqual([...puzzle.tiles].sort((a, b) => a - b), Array.from({ length: size * size }, (_, i) => i));
        assert.equal(solvable(puzzle.tiles, size), true);
        assert.equal(isSolved(puzzle.tiles), false);
        assert.ok(distance(puzzle.tiles, size) >= size * 3, "shuffle should not start only a move or two from solved");
        assert.equal(puzzle.moves, 0);
        assert.equal(puzzle.elapsedMs, 0);
        assert.equal(puzzle.status, "playing");
        assert.equal(ids.has(puzzle.id), false);
        ids.add(puzzle.id);
        assert.deepEqual(readSession(puzzle), puzzle, "new games survive a storage round trip");
      }
    }
  } finally {
    Math.random = originalRandom;
  }
});

test("every offered Pokemon supports both grid sizes", () => {
  for (const pokemon of ["gengar", "charizard", "pikachu", "ho-oh", "rayquaza", "bidoof", "mew", "mewtwo"]) {
    for (const size of [3, 4]) assert.equal(readSession(createPuzzle(pokemon, size)).pokemon, pokemon);
  }
});

test("legal moves swap with the blank without mutating the previous board", () => {
  const tiles = Object.freeze([1, 2, 3, 4, 0, 5, 6, 7, 8]);
  for (const index of [1, 3, 5, 7]) {
    assert.equal(canMoveTile(tiles, index, 3), true);
    const moved = moveTile(tiles, index, 3);
    assert.notEqual(moved, tiles);
    assert.equal(moved[index], 0);
    assert.equal(moved[4], tiles[index]);
    assert.deepEqual(moveTile(moved, 4, 3), tiles, "reverse move recovers the original board");
  }
  for (const index of [0, 2, 4, 6, 8, -1, 9, 1.5, NaN]) {
    assert.equal(canMoveTile(tiles, index, 3), false);
    assert.equal(moveTile(tiles, index, 3), tiles);
  }
});

test("adjacent array indices cannot wrap across a row edge", () => {
  for (const size of [3, 4]) {
    const tiles = solved(size);
    [tiles[size - 1], tiles[tiles.length - 1]] = [tiles[tiles.length - 1], tiles[size - 1]];
    assert.equal(canMoveTile(tiles, size, size), false);
    assert.equal(moveTile(tiles, size, size), tiles);
    assert.equal(canMoveTile(tiles, size - 2, size), true);
  }
});

test("solved detection requires a complete correctly ordered supported board", () => {
  for (const size of [3, 4]) {
    const tiles = solved(size);
    assert.equal(isSolved(tiles), true);
    const playing = moveTile(tiles, tiles.length - 2, size);
    assert.equal(isSolved(playing), false);
    assert.equal(isSolved(moveTile(playing, tiles.length - 1, size)), true);
  }
  for (const tiles of [[], [0], [1, 2, 0], [0, 1, 2, 3, 4, 5, 6, 7, 8], [1, 2, 3, 4, 5, 6, 7, 8, 8]]) assert.equal(isSolved(tiles), false);
});

test("malformed storage returns a fresh safe default", () => {
  const empty = { version: 1, session: null, wins: [] };
  for (const raw of [null, "", "{", "null", "[]", "true", "{}", '{"version":2}', " ".repeat(250001)]) assert.deepEqual(parsePuzzleSave(raw), empty);
  const first = parsePuzzleSave(null);
  first.wins.push(win());
  assert.deepEqual(parsePuzzleSave(null), empty, "defaults must not share mutable arrays");
  assert.equal(STORAGE_KEY, "mon-tile-puzzle-v1");
});

test("tampered session fields, tile permutations, and status mismatches are discarded", () => {
  for (const changes of [
    { id: "" }, { id: "x".repeat(101) }, { pokemon: "unknown" }, { size: 5 },
    { moves: -1 }, { moves: 1.5 }, { moves: 1000001 }, { moves: "12" },
    { elapsedMs: -1 }, { elapsedMs: null }, { elapsedMs: 400 * 86400000 },
    { status: "paused" }, { status: "won" }, { tiles: solved(3) },
    { tiles: [] }, { tiles: [1, 2, 3, 4, 5, 6, 7, 0, 0] },
    { tiles: [1, 2, 3, 4, 5, 6, 7, 0, 9] }, { tiles: [1, 2, 3, 4, 5, 6, 7, 0, 8.5] },
  ]) assert.equal(readSession(session(changes)), null, JSON.stringify(changes));
  assert.deepEqual(readSession(session({ status: "won", tiles: solved(3) })), session({ status: "won", tiles: solved(3) }));
  assert.equal(readSession(session({ status: "won", tiles: solved(3), moves: 0 })), null);
});

test("both grid sizes reject impossible parity while accepting legal blank-row changes", () => {
  for (const size of [3, 4]) {
    const legitimate = moveTile(solved(size), size * size - 1 - size, size);
    assert.notEqual(readSession(session({ size, tiles: legitimate })), null);
    [legitimate[0], legitimate[1]] = [legitimate[1], legitimate[0]];
    assert.equal(readSession(session({ size, tiles: legitimate })), null);
  }
});

test("a broken session does not erase valid history; invalid wins are removed", () => {
  const saved = parsePuzzleSave(JSON.stringify({ version: 1, session: session({ tiles: [] }), wins: [win(), win({ id: "bad-date", completedAt: "yesterday" }), win({ id: "bad-calendar", completedAt: "2026-02-31T08:00:00.000Z" }), win({ id: "bad-moves", moves: 0 }), win({ id: "bad-species", pokemon: "unknown" }), null] }));
  assert.equal(saved.session, null);
  assert.deepEqual(saved.wins, [win()]);
  assert.deepEqual(parsePuzzleSave(JSON.stringify({ version: 1, session: session(), wins: "invalid" })).session, session());
});

test("history is newest-first, deduplicated, bounded, and safe on repeated completion", () => {
  const wins = Array.from({ length: 65 }, (_, index) => win({ id: `win-${index}`, completedAt: new Date(Date.UTC(2026, 8, 1, 0, index)).toISOString() }));
  const saved = parsePuzzleSave(JSON.stringify({ version: 1, session: null, wins: [...wins, wins[64]] }));
  assert.equal(saved.wins.length, 50);
  assert.equal(saved.wins[0].id, "win-64");
  assert.equal(saved.wins.at(-1).id, "win-15");
  const duplicate = { ...saved.wins[0], moves: 1, completedAt: "2026-09-30T00:00:00.000Z" };
  assert.deepEqual(addPuzzleWin(saved.wins, duplicate), saved.wins, "replaying completion preserves the original score");
  const newest = win({ id: "latest" });
  const updated = addPuzzleWin(saved.wins, newest);
  assert.equal(updated.length, 50);
  assert.deepEqual(updated[0], newest);
  assert.equal(saved.wins[0].id, "win-64", "adding a win must not mutate prior history");
  assert.equal(addPuzzleWin(updated, win({ id: "old", completedAt: "2020-01-01T00:00:00.000Z" })).some(record => record.id === "old"), false);
});
