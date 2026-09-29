import { shiftTiles, type Point, type Shift, type Tile } from "./laser-grid.ts";

export type Direction = 0 | 1 | 2 | 3; // right, down, left, up
export type BeamColor = "cyan" | "amber";
export type Monster = {
  id: string;
  kind: "DEFLECTOR" | "BEAM_EATER" | "SPLIT_JAW";
  route: number[];
  offset: number;
  facing: Direction;
};
export type Target = {
  id: string;
  kind: "PORTAL" | "PRISM";
  route: number[];
  offset: number;
  every: number;
  angles: number;
  colors: number;
  color?: BeamColor;
};
export type CampaignLevel = {
  number: number;
  tier: number;
  name: string;
  briefing: string;
  board: Tile[];
  immovable: number[];
  monsters: Monster[];
  targets: Target[];
  nodes: number[];
  solution: Shift[];
};
export type CampaignState = {
  board: Tile[];
  columnBaseline: Tile[];
  turn: number;
  charges: Record<string, number>;
  empCount: number;
  emp: boolean;
};
export type BeamPath = { points: Point[]; color: BeamColor };
export const TIERS = ["Beginner", "Intermediate", "Advanced", "Expert", "Master"] as const;
const vectors = [[1, 0], [0, 1], [-1, 0], [0, -1]] as const;
const modulo = (n: number, by: number) => ((n % by) + by) % by;
const center = (cell: number): Point => ({ x: cell % 5 + .5, y: Math.floor(cell / 5) + .5 });

export function monsterAt(monster: Monster, turn: number) {
  return monster.route[modulo(monster.offset + (monster.kind === "DEFLECTOR" ? turn : 0), monster.route.length)];
}
export function monsterFacing(monster: Monster, turn: number): Direction {
  return modulo(monster.facing + turn, 4) as Direction;
}
export function targetAt(target: Target, turn: number) {
  return target.route[modulo(target.offset + Math.floor(turn / target.every), target.route.length)];
}
export function initialState(level: CampaignLevel): CampaignState {
  return { board: [...level.board], columnBaseline: [...level.board], turn: 0, charges: {}, empCount: 0, emp: false };
}

/** Trace all branches from one snapshot, so prism hits are simultaneous, never accumulated. */
export function traceCampaign(level: CampaignLevel, state: CampaignState) {
  type Ray = BeamPath & { cell: number; direction: Direction; node: number; mirrored: boolean; seen: Set<string>; segmentStart: number };
  const rays: Ray[] = [{ cell: 0, direction: 0, color: "cyan", points: [center(0)], node: 0, mirrored: false, seen: new Set(), segmentStart: 0 }];
  const paths: BeamPath[] = [];
  const finish = (ray: Ray) => paths.push({ points: ray.points.slice(ray.segmentStart), color: ray.color });
  const portalPaths: Point[][] = [];
  const hits = new Map(level.targets.map(target => [target.id, { angles: new Set<Direction>(), colors: new Set<BeamColor>() }]));
  const eaters = new Set<string>();
  const explored = new Set<string>();
  let loop = false;
  let sequenceReached = 0;
  while (rays.length) {
    const ray = rays.pop()!;
    while (true) {
      const key = `${ray.cell}:${ray.direction}:${ray.color}:${ray.node}:${ray.mirrored}`;
      if (ray.seen.has(key)) { loop = true; finish(ray); break; }
      if (explored.has(key)) { finish(ray); break; }
      ray.seen.add(key); explored.add(key);
      const [dx, dy] = vectors[ray.direction];
      const x = ray.cell % 5 + dx, y = Math.floor(ray.cell / 5) + dy;
      if (x < 0 || x > 4 || y < 0 || y > 4) {
        const p = center(ray.cell);
        ray.points.push({ x: p.x + dx * .5, y: p.y + dy * .5 });
        finish(ray); break;
      }
      ray.cell = y * 5 + x; ray.points.push(center(ray.cell));
      if (level.immovable.includes(ray.cell)) { finish(ray); break; }
      const nodeIndex = level.nodes.indexOf(ray.cell);
      if (nodeIndex >= 0) {
        if (nodeIndex !== ray.node || (ray.node > 0 && !ray.mirrored)) { finish(ray); break; }
        ray.node++; ray.mirrored = false; sequenceReached = Math.max(sequenceReached, ray.node);
      }
      const target = level.targets.find(item => targetAt(item, state.turn) === ray.cell);
      if (target) {
        if (!target.color || target.color === ray.color) {
          hits.get(target.id)!.angles.add(ray.direction); hits.get(target.id)!.colors.add(ray.color);
        }
        if (target.kind === "PORTAL") {
          if (ray.node === level.nodes.length) portalPaths.push(ray.points);
          finish(ray); break;
        }
        continue; // Transparent targets take precedence over mirrors underneath.
      }
      const monster = level.monsters.find(item => monsterAt(item, state.turn) === ray.cell);
      if (monster?.kind === "BEAM_EATER") { eaters.add(monster.id); finish(ray); break; }
      if (monster?.kind === "DEFLECTOR") { ray.direction = monsterFacing(monster, state.turn); continue; }
      if (monster?.kind === "SPLIT_JAW") {
        finish(ray);
        for (const [turn, color] of [[-1, "cyan"], [1, "amber"]] as const) {
          rays.push({ ...ray, points: [...ray.points], seen: new Set(ray.seen), direction: modulo(ray.direction + turn, 4) as Direction, color, segmentStart: ray.points.length - 1 });
        }
        break;
      }
      if (ray.cell === 0) continue;
      const mirror = state.board[ray.cell];
      if (mirror === "/") { ray.direction = [3, 2, 1, 0][ray.direction] as Direction; ray.mirrored = true; }
      if (mirror === "\\") { ray.direction = [1, 0, 3, 2][ray.direction] as Direction; ray.mirrored = true; }
    }
  }
  const targets = level.targets.map(target => {
    const hit = hits.get(target.id)!;
    return { id: target.id, angles: hit.angles.size, colors: hit.colors.size, active: hit.angles.size >= target.angles && hit.colors.size >= target.colors };
  });
  return { paths, points: portalPaths[0] ?? paths[0]?.points ?? [center(0)], won: portalPaths.length > 0 && targets.every(target => target.active), targets, eaters: [...eaters], loop, sequenceReached };
}

export function advanceCampaign(level: CampaignLevel, state: CampaignState, move: Shift): CampaignState {
  const board = shiftTiles(state.board, move, level.immovable);
  const columnBaseline = move.axis === "column" ? shiftTiles(state.columnBaseline, move, level.immovable) : state.columnBaseline;
  const next: CampaignState = { ...state, board, columnBaseline, turn: state.turn + 1, charges: {}, emp: false };
  const beam = traceCampaign(level, next);
  for (const monster of level.monsters.filter(item => item.kind === "BEAM_EATER")) {
    next.charges[monster.id] = beam.eaters.includes(monster.id) ? (state.charges[monster.id] ?? 0) + 1 : 0;
  }
  if (!beam.won && Object.values(next.charges).some(charge => charge > 3)) {
    next.board = [...columnBaseline]; next.charges = {}; next.emp = true; next.empCount++;
  }
  return next;
}

function layout(number: number, solutionLength: number): CampaignLevel {
  const tier = Math.min(5, Math.ceil(number / 3));
  const board: Tile[] = Array(25).fill(null);
  const level: CampaignLevel = {
    number, tier, name: "First contact", briefing: "Shift the mirrors to connect Deoxys to the black hole.", board, immovable: [], monsters: [], nodes: [], solution: [],
    targets: [{ id: "portal", kind: "PORTAL", route: [24], offset: 0, every: 2, angles: 1, colors: 1 }],
  };
  if (tier === 1) {
    if (number === 1) board[4] = "\\";
    else { for (const cell of [1, 11, 13, 23]) board[cell] = "\\"; board[8] = "/"; board[16] = "/"; }
    level.name = ["First contact", "A bend in space", "Orbital drift"][number - 1];
  } else if (tier === 2) {
    for (const cell of [1, 11, 13, 23]) board[cell] = "\\";
    board[8] = "/";
    level.immovable = [3, 7, 17, 20];
    level.name = ["Bedrock belt", "Steel corridor", "Around the debris"][number - 4];
    level.briefing = "Steel blocks stay anchored and stop the beam. Only the free tiles in a shifted line wrap around them.";
  } else if (tier === 3) {
    board[18] = "\\"; board[19] = "\\"; board[12] = "/";
    level.immovable = [6, 11, 16];
    level.monsters = [{ id: "guard", kind: "DEFLECTOR", route: [3, 8], offset: modulo(-solutionLength, 2), facing: modulo(1 - solutionLength, 4) as Direction }];
    level.name = ["Armor patrol", "Quarter turn", "Intercept course"][number - 7];
    level.briefing = "The armored deflector patrols one tile and rotates its outgoing beam clockwise after every shift. Its arrow shows the current direction.";
  } else {
    board[2] = "\\"; board[10] = "/"; board[14] = "\\"; board[20] = "\\";
    level.immovable = [6, 16];
    level.monsters = [
      { id: "split", kind: "SPLIT_JAW", route: [12], offset: 0, facing: 0 },
      { id: "eater", kind: "BEAM_EATER", route: [8], offset: 0, facing: 0 },
    ];
    level.targets.push({ id: "core", kind: "PRISM", route: [21], offset: 0, every: 2, angles: 1, colors: 1, color: "amber" });
    if (number >= 11) { level.targets[0].angles = 2; level.targets[0].colors = 2; }
    if (number === 12 || number >= 15) level.nodes = [11, 15, 22];
    if (tier === 5) {
      level.monsters.push({ id: "guard", kind: "DEFLECTOR", route: [13, 18], offset: modulo(-solutionLength, 2), facing: modulo(-solutionLength, 4) as Direction });
      level.targets[0].route = [24, 19];
      level.targets[0].offset = modulo(-Math.floor(solutionLength / 2), 2);
    }
    if (number === 14) {
      // A second splitter feeds the rail portal from above, below, and the left.
      level.board = Array(25).fill(null);
      for (const cell of [2, 4, 18, 20]) level.board[cell] = "\\";
      for (const cell of [3, 10, 24]) level.board[cell] = "/";
      level.monsters = [
        { id: "split", kind: "SPLIT_JAW", route: [12], offset: 0, facing: 0 },
        { id: "split-two", kind: "SPLIT_JAW", route: [13], offset: 0, facing: 0 },
        { id: "eater", kind: "BEAM_EATER", route: [17], offset: 0, facing: 0 },
        { id: "guard", kind: "DEFLECTOR", route: [9, 8], offset: modulo(-solutionLength, 2), facing: modulo(1 - solutionLength, 4) as Direction },
      ];
      level.targets[0].route = [19, 14]; level.targets[0].angles = 3;
    }
    level.name = tier === 4 ? ["Split the light", "Prism convergence", "Ordered orbit"][number - 10] : ["Rail runner", "Guarded spectrum", "Grid lock"][Math.min(number - 13, 2)];
    level.briefing = `${tier === 5 ? "The portal moves along its rail every 2 shifts. Time the guard and both beam colors. " : "Split-Jaw turns the beam into cyan and amber branches. Light the amber core and the portal together. "}${number >= 11 ? `The portal needs both colors from ${level.targets[0].angles === 3 ? "three" : "two"} angles. ` : ""}${level.nodes.length ? "Visit nodes 1 → 2 → 3 on one branch, with a mirror between each. " : ""}A fourth consecutive hit on the Eater causes EMP: row shifts reset; column shifts remain.`;
  }
  return level;
}

/** Scramble a solved layout, then validate its complete dynamic replay, including EMP. */
export function createCampaignLevel(number: number): CampaignLevel {
  number = Math.max(1, Math.floor(number));
  let seed = number * 7919;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let attempt = 0; attempt < 150; attempt++) {
    const length = number === 1 ? 1 : attempt === 149 ? 1 : Math.min(2 + number % 3 + Math.floor(number / 6), 9);
    const level = layout(number, length);
    const scramble: Shift[] = [];
    for (let i = 0; i < length; i++) {
      const move: Shift = number === 1 ? { axis: "row", index: 0, direction: -1 } : { axis: random() < .5 ? "row" : "column", index: Math.floor(random() * 5), direction: random() < .5 ? -1 : 1 };
      level.board = shiftTiles(level.board, move, level.immovable); scramble.push(move);
    }
    level.solution = scramble.reverse().map(move => ({ ...move, direction: -move.direction as 1 | -1 }));
    let state = initialState(level);
    if (traceCampaign(level, state).won) continue;
    for (let i = 0; i < level.solution.length; i++) {
      state = advanceCampaign(level, state, level.solution[i]);
      if (traceCampaign(level, state).won) { level.solution = level.solution.slice(0, i + 1); return level; }
    }
  }
  throw new Error(`Unable to create a solvable level ${number}`);
}
