import test from 'node:test';
import assert from 'node:assert/strict';
import { createLevel, shiftTiles, traceLaser, pointAlongPath } from '../lib/laser-grid.ts';
import { createCampaignLevel, initialState, advanceCampaign, traceCampaign, monsterAt, monsterFacing, targetAt, rayquazaStatus, MONSTER_PROFILES } from '../lib/laser-campaign.ts';

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

function fixture(overrides = {}) {
  return { number: 1, tier: 1, name: 'Fixture', briefing: '', board: Array(25).fill(null), immovable: [], monsters: [], nodes: [], solution: [],
    targets: [{ id: 'portal', kind: 'PORTAL', route: [24], offset: 0, every: 2, angles: 1, colors: 1 }], ...overrides };
}
function solvedCampaign(number) {
  const level = createCampaignLevel(number);
  let state = initialState(level);
  for (const move of level.solution) state = advanceCampaign(level, state, move);
  return { level, state };
}
const harmless = { axis: 'row', index: 3, direction: 1 };

test('terrain stays at its coordinates while free slots wrap in either axis', () => {
  const board = Array.from({ length: 25 }, (_, i) => i);
  const row = shiftTiles(board, { axis: 'row', index: 0, direction: 1 }, [1, 3]);
  assert.deepEqual(row.slice(0, 5), [4, 1, 0, 3, 2]);
  assert.deepEqual(shiftTiles(row, { axis: 'row', index: 0, direction: -1 }, [1, 3]), board);
  const col = shiftTiles(board, { axis: 'column', index: 0, direction: -1 }, [5, 15]);
  assert.deepEqual([0, 5, 10, 15, 20].map(i => col[i]), [10, 5, 20, 15, 0]);
  assert.deepEqual(shiftTiles(board, harmless, [15, 16, 17, 18, 19]), board);
  assert.deepEqual(shiftTiles(board, harmless, [15, 16, 17, 18]), board);
});
test('steel absorbs the beam before any mirror beneath it', () => {
  const level = fixture({ immovable: [4] }); level.board[4] = '\\';
  const result = traceCampaign(level, initialState(level));
  assert.equal(result.won, false);
  assert.deepEqual(result.paths[0].points.at(-1), { x: 4.5, y: .5 });
});
test('deflectors patrol one tile and rotate clockwise on each player shift', () => {
  const monster = { id: 'guard', kind: 'DEFLECTOR', route: [3, 8], offset: 0, facing: 1 };
  const level = fixture({ monsters: [monster] }); level.board[18] = '\\'; level.board[19] = '\\';
  assert.equal(traceCampaign(level, initialState(level)).won, true);
  for (let turn = 0; turn < 8; turn++) {
    assert.equal(monsterAt(monster, turn), turn % 2 ? 8 : 3);
    assert.equal(monsterFacing(monster, turn), (1 + turn) % 4);
  }
  const shifted = advanceCampaign(level, initialState(level), { axis: 'row', index: 1, direction: 1 });
  assert.equal(shifted.turn, 1);
  assert.equal(traceCampaign(level, shifted).won, false);
});
test('Eater EMP occurs on hit four, removes row shifts and preserves column shifts', () => {
  const level = fixture({ monsters: [{ id: 'eater', kind: 'BEAM_EATER', route: [1], offset: 0, facing: 0 }] });
  level.board[6] = '\\';
  const column = { axis: 'column', index: 2, direction: 1 };
  const actions = [{ axis: 'row', index: 1, direction: 1 }, column, harmless, { axis: 'row', index: 4, direction: -1 }];
  let state = initialState(level);
  const before = structuredClone(state);
  for (let i = 0; i < actions.length; i++) {
    state = advanceCampaign(level, state, actions[i]);
    if (i < 3) { assert.equal(state.charges.eater, i + 1); assert.equal(state.emp, false); }
  }
  assert.equal(state.emp, true); assert.equal(state.empCount, 1); assert.equal(state.turn, 4);
  assert.deepEqual(state.charges, {});
  assert.deepEqual(state.board, shiftTiles(level.board, column));
  assert.deepEqual(initialState(level), before);
});
test('missing an Eater clears its consecutive hit streak', () => {
  const level = fixture({ monsters: [{ id: 'eater', kind: 'BEAM_EATER', route: [3], offset: 0, facing: 0 }] });
  let state = advanceCampaign(level, initialState(level), harmless);
  state = advanceCampaign(level, state, harmless);
  assert.equal(state.charges.eater, 2);
  state = { ...state, board: [...state.board] }; state.board[2] = '\\';
  assert.equal(advanceCampaign(level, state, harmless).charges.eater, 0);
});
test('a complete circuit wins before a fourth-hit EMP', () => {
  const level = fixture({ monsters: [
    { id: 'split', kind: 'SPLIT_JAW', route: [7], offset: 0, facing: 0 },
    { id: 'eater', kind: 'BEAM_EATER', route: [8], offset: 0, facing: 0 },
  ] });
  level.board[2] = '\\'; level.board[5] = '/'; level.board[20] = '\\';
  const next = advanceCampaign(level, { ...initialState(level), charges: { eater: 3 } }, harmless);
  assert.equal(next.charges.eater, 4); assert.equal(next.emp, false);
  assert.equal(traceCampaign(level, next).won, true);
});
test('split branches keep their colors and require simultaneous distinct prism angles', () => {
  const { level, state } = solvedCampaign(11);
  const result = traceCampaign(level, state);
  assert.equal(result.won, true);
  assert.deepEqual(result.targets.find(t => t.id === 'portal'), { id: 'portal', angles: 2, colors: 2, active: true });
  assert.deepEqual(result.paths.find(p => p.color === 'amber').points[0], { x: 2.5, y: 2.5 });
  const leftMissing = { ...state, board: [...state.board] }; leftMissing.board[10] = null;
  const rightMissing = { ...state, board: [...state.board] }; rightMissing.board[14] = null;
  for (const partial of [leftMissing, rightMissing, leftMissing]) {
    const beam = traceCampaign(level, partial);
    assert.equal(beam.won, false); assert.equal(beam.targets.find(t => t.id === 'portal').angles, 1);
  }
  const wrongColor = { ...level, targets: level.targets.map(t => t.id === 'core' ? { ...t, color: 'cyan' } : t) };
  assert.equal(traceCampaign(wrongColor, state).won, false);
});
test('sequential nodes require one continuous branch and a mirror between visits', () => {
  const { level, state } = solvedCampaign(12);
  const beam = traceCampaign(level, state);
  assert.equal(beam.won, true); assert.equal(beam.sequenceReached, 3);
  const cells = beam.points.map(p => Math.floor(p.y) * 5 + Math.floor(p.x));
  assert.ok(cells.indexOf(11) < cells.indexOf(15) && cells.indexOf(15) < cells.indexOf(22));
  assert.equal(traceCampaign({ ...level, nodes: [11, 10, 15] }, state).won, false, 'no mirror between first two nodes');
  assert.equal(traceCampaign({ ...level, nodes: [11, 22, 15] }, state).won, false, 'wrong order');
  assert.equal(traceCampaign({ ...level, nodes: [13, 15] }, state).won, false, 'nodes on different branches');
});
test('three-angle Master prism requires all three incoming branches at once', () => {
  const { level, state } = solvedCampaign(14);
  const beam = traceCampaign(level, state);
  assert.equal(beam.won, true);
  assert.deepEqual(beam.targets.find(t => t.id === 'portal'), { id: 'portal', angles: 3, colors: 2, active: true });
  for (const cell of [3, 18, 24]) {
    const board = [...state.board]; board[cell] = null;
    assert.equal(traceCampaign(level, { ...state, board }).won, false, `missing branch via ${cell}`);
  }
});
test('moving portal advances every two shifts, with undo snapshots restoring its phase', () => {
  const level = createCampaignLevel(13);
  const portal = level.targets[0];
  const first = initialState(level);
  const second = advanceCampaign(level, first, harmless);
  const third = advanceCampaign(level, second, harmless);
  assert.equal(targetAt(portal, first.turn), targetAt(portal, second.turn));
  assert.notEqual(targetAt(portal, first.turn), targetAt(portal, third.turn));
  assert.equal(first.turn, 0); assert.deepEqual(first.charges, {});
  assert.deepEqual(traceCampaign(level, initialState(level)), traceCampaign(level, first));
});
test('branching reflection cycles terminate without infinite rays', () => {
  const level = fixture({ monsters: [{ id: 'split', kind: 'SPLIT_JAW', route: [12], offset: 0, facing: 0 }], targets: [{ id: 'portal', kind: 'PORTAL', route: [4], offset: 0, every: 2, angles: 1, colors: 1 }] });
  level.board[2] = '\\'; level.board[14] = '\\'; level.board[24] = '/'; level.board[22] = '\\';
  const beam = traceCampaign(level, initialState(level));
  assert.equal(beam.won, false); assert.equal(beam.loop, true); assert.ok(beam.paths.length < 20);
});
test('all five tiers and 250 campaign levels have replay-verified dynamic solutions', () => {
  for (let n = 1; n <= 250; n++) {
    const level = createCampaignLevel(n);
    assert.equal(level.tier, Math.min(5, Math.ceil(n / 3)));
    let state = initialState(level);
    assert.equal(traceCampaign(level, state).won, false, `initial level ${n}`);
    for (const move of level.solution) state = advanceCampaign(level, state, move);
    assert.equal(traceCampaign(level, state).won, true, `solved level ${n}`);
    if (n >= 15) assert.equal(rayquazaStatus(level, state.turn).exposed, true, `boss opening ${n}`);
    assert.deepEqual(createCampaignLevel(n), level, `deterministic level ${n}`);
  }
});

test('Pokémon identities map to the expected puzzle abilities', () => {
  assert.equal(MONSTER_PROFILES.DEFLECTOR.name, 'Solrock');
  assert.equal(MONSTER_PROFILES.BEAM_EATER.name, 'Lunatone');
  assert.equal(MONSTER_PROFILES.SPLIT_JAW.name, 'Minior');
  assert.equal(MONSTER_PROFILES.RAYQUAZA.name, 'Rayquaza');
  assert.equal(createCampaignLevel(14).monsters.some(m => m.kind === 'RAYQUAZA'), false);
  assert.equal(createCampaignLevel(15).monsters.some(m => m.kind === 'RAYQUAZA'), true);
});
test('Rayquaza seals an otherwise complete circuit for three phases and opens on the fourth', () => {
  const level = fixture({ monsters: [{ id: 'rayquaza', kind: 'RAYQUAZA', route: [6], offset: 0, facing: 0, cycleOffset: 0 }] });
  level.board[4] = '\\';
  for (let turn = 0; turn < 8; turn++) {
    const beam = traceCampaign(level, { ...initialState(level), turn });
    assert.equal(beam.won, turn % 4 === 3, `turn ${turn}`);
    assert.equal(beam.targets[0].active, turn % 4 === 3);
    assert.equal(rayquazaStatus(level, turn).shiftsUntilExposed, 3 - turn % 4);
  }
  const exposed = { ...initialState(level), turn: 3 };
  const bodyBlocking = { ...level, monsters: [{ ...level.monsters[0], route: [4] }] };
  assert.equal(traceCampaign(bodyBlocking, exposed).won, false, 'Rayquaza itself always absorbs beams');
});
test('Delta Stream rejects the locked row without advancing any state; columns remain legal', () => {
  const level = fixture({ monsters: [{ id: 'rayquaza', kind: 'RAYQUAZA', route: [6], offset: 0, facing: 0, cycleOffset: 0 }] });
  const before = initialState(level);
  assert.equal(rayquazaStatus(level, 0).lockedRow, 1);
  assert.equal(advanceCampaign(level, before, { axis: 'row', index: 1, direction: 1 }), before);
  let state = advanceCampaign(level, before, { axis: 'column', index: 1, direction: 1 });
  assert.equal(state.turn, 1); assert.equal(rayquazaStatus(level, state.turn).lockedRow, 2);
  state = advanceCampaign(level, state, { axis: 'row', index: 0, direction: 1 });
  assert.equal(rayquazaStatus(level, state.turn).lockedRow, 3);
  state = advanceCampaign(level, state, { axis: 'column', index: 1, direction: 1 });
  assert.equal(rayquazaStatus(level, state.turn).lockedRow, null);
  state = advanceCampaign(level, state, { axis: 'row', index: 1, direction: 1 });
  assert.equal(rayquazaStatus(level, state.turn).lockedRow, 1);
  assert.deepEqual(before, initialState(level), 'undo snapshot and storm phase are unchanged');
});
