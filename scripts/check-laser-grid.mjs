import test from 'node:test';
import assert from 'node:assert/strict';
import { createLevel, shiftTiles, traceLaser, pointAlongPath } from '../lib/laser-grid.ts';

test('all generated levels start unsolved and have a reversible solution', () => {
  for (let level = 1; level <= 250; level++) {
    const puzzle = createLevel(level);
    assert.equal(traceLaser(puzzle.board).won, false, `level ${level}`);
    let solved = puzzle.board;
    for (const move of puzzle.scramble.toReversed()) solved = shiftTiles(solved, { ...move, direction: -move.direction });
    assert.equal(traceLaser(solved).won, true, `solution ${level}`);
  }
});
test('rows and columns wrap in both directions without mutating input', () => {
  const board = Array.from({ length: 25 }, (_, i) => i);
  for (const axis of ['row', 'column']) for (let index = 0; index < 5; index++) for (const direction of [-1, 1]) {
    let shifted = board;
    for (let i = 0; i < 5; i++) shifted = shiftTiles(shifted, { axis, index, direction });
    assert.deepEqual(shifted, board);
    assert.notEqual(shifted, board);
  }
});
test('first level teaches one right shift and reaches the fixed portal', () => {
  const board = shiftTiles(createLevel(1).board, { axis: 'row', index: 0, direction: 1 });
  const beam = traceLaser(board);
  assert.equal(beam.won, true);
  assert.deepEqual(beam.points.at(-1), { x: 4.5, y: 4.5 });
  assert.deepEqual(pointAlongPath(beam.points, 0), { x: .5, y: .5 });
  assert.deepEqual(pointAlongPath(beam.points, 1), { x: 4.5, y: 4.5 });
  assert.deepEqual(pointAlongPath(beam.points, .5), { x: 4.5, y: .5 });
});
test('beam exits safely and endpoint mirrors are bypassed', () => {
  const board = Array(25).fill(null); board[0] = '/';
  const beam = traceLaser(board);
  assert.equal(beam.won, false);
  assert.deepEqual(beam.points.at(-1), { x: 5, y: .5 });
});
test('slash mirrors reflect an upward beam right toward the portal', () => {
  const board = Array(25).fill(null);
  board[2] = '\\'; // Right to down.
  board[17] = '/'; // Down to left.
  board[16] = '\\'; // Left to up.
  board[6] = '/'; // Up to right.
  board[9] = '\\'; // Right to down into portal.
  assert.equal(traceLaser(board).won, true);
});
