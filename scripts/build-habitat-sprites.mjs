// Packs each habitat Pokémon into one 88×88 sheet — columns are the two idle frames,
// rows are normal and shiny — and copies the move strips the habitat uses into public/.
// One request per Pokémon, and a shiny reroll never waits on the network.
// The side-view walk and attack strips in pokemon-motion/ are trimmed to one shared
// cell per Pokémon, packed the same way, and described in lib/pokemon-motion.ts.
//
//   node --experimental-strip-types scripts/build-habitat-sprites.mjs
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { readPng, writePng } from "./png.mjs";
import { MOVES, PORTRAITS, SPECIES, SPRITE_SIZE } from "../lib/pokemon-roster.ts";

const root = new URL("../", import.meta.url);
const spritesOut = new URL("public/sprites/pokemon/", root);
const movesOut = new URL("public/sprites/moves/", root);
mkdirSync(spritesOut, { recursive: true });
mkdirSync(movesOut, { recursive: true });

const side = SPRITE_SIZE * 2;
for (const species of [...Object.keys(SPECIES), ...PORTRAITS]) {
  const sheet = { width: side, height: side, pixels: Buffer.alloc(side * side * 4) };
  ["", "-shiny"].forEach((variant, row) => [0, 1].forEach(column => {
    const frame = readPng(new URL(`pokemon-sprites/${species}${variant}-${column}.png`, root));
    if (frame.width !== SPRITE_SIZE || frame.height !== SPRITE_SIZE) throw new Error(`${species}${variant}-${column} is not ${SPRITE_SIZE}px`);
    for (let y = 0; y < SPRITE_SIZE; y++) {
      frame.pixels.copy(sheet.pixels, ((row * SPRITE_SIZE + y) * side + column * SPRITE_SIZE) * 4, y * SPRITE_SIZE * 4, (y + 1) * SPRITE_SIZE * 4);
    }
  }));
  writePng(new URL(`${species}.png`, spritesOut), sheet);
}

// ── Side-view walk and attack strips ──────────────────────────────────────
const manifest = JSON.parse(readFileSync(new URL("pokemon-motion/manifest.json", root), "utf8"));
const TICK_MS = 1000 / 60;

function frames(species, anim, variant) {
  const { width, height, durations } = manifest[species][anim];
  const strip = readPng(new URL(`pokemon-motion/${species}-${anim}${variant}.png`, root));
  return durations.map((_, index) => ({ width, height, at: (x, y) => strip.pixels.readUInt32BE((y * strip.width + index * width + x) * 4) }));
}

/** Opaque bounds of a frame, relative to the frame centre (SpriteCollab's anchor). */
function bounds(frame) {
  let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
  for (let y = 0; y < frame.height; y++) for (let x = 0; x < frame.width; x++) {
    if ((frame.at(x, y) & 255) === 0) continue;
    left = Math.min(left, x); right = Math.max(right, x + 1); top = Math.min(top, y); bottom = Math.max(bottom, y + 1);
  }
  const cx = frame.width / 2, cy = frame.height / 2;
  return { left: left - cx, right: right - cx, top: top - cy, bottom: bottom - cy };
}

function frontHeight(species) {
  const { pixels } = readPng(new URL(`pokemon-sprites/${species}-0.png`, root));
  let top = SPRITE_SIZE, bottom = 0;
  for (let y = 0; y < SPRITE_SIZE; y++) for (let x = 0; x < SPRITE_SIZE; x++) {
    if (pixels[(y * SPRITE_SIZE + x) * 4 + 3]) { top = Math.min(top, y); bottom = Math.max(bottom, y + 1); }
  }
  return bottom - top;
}

const motion = {};
for (const species of Object.keys(manifest)) {
  const all = ["walk", "attack"].flatMap(anim => frames(species, anim, "").map(bounds));
  const box = all.reduce((a, b) => ({ left: Math.min(a.left, b.left), right: Math.max(a.right, b.right), top: Math.min(a.top, b.top), bottom: Math.max(a.bottom, b.bottom) }));
  const width = box.right - box.left, height = box.bottom - box.top;
  // Match the side view to the front sprite's height, using the attack's opening stance.
  const stance = bounds(frames(species, "attack", "")[0]);
  const scale = manifest[species].scale ?? Math.round(frontHeight(species) / (stance.bottom - stance.top) * 4) / 4;
  const feet = Math.max(...frames(species, "walk", "").map(frame => bounds(frame).bottom)) - box.top;
  const entry = { width, height, centre: -box.left, feet, scale };
  for (const anim of ["walk", "attack"]) {
    const { durations } = manifest[species][anim];
    const sheet = { width: width * durations.length, height: height * 2, pixels: Buffer.alloc(width * durations.length * height * 2 * 4) };
    ["", "-shiny"].forEach((variant, row) => frames(species, anim, variant).forEach((frame, column) => {
      const ox = frame.width / 2 + box.left, oy = frame.height / 2 + box.top;
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const sx = x + ox, sy = y + oy;
        if (sx < 0 || sy < 0 || sx >= frame.width || sy >= frame.height) continue;
        sheet.pixels.writeUInt32BE(frame.at(sx, sy) >>> 0, ((row * height + y) * sheet.width + column * width + x) * 4);
      }
    }));
    writePng(new URL(`${species}-${anim}.png`, spritesOut), sheet);
    entry[anim] = { frames: durations.length, ms: Math.round(durations.reduce((sum, ticks) => sum + ticks, 0) * TICK_MS) };
  }
  motion[species] = entry;
}
writeFileSync(new URL("lib/pokemon-motion.ts", root), `// Generated by scripts/build-habitat-sprites.mjs from pokemon-motion/. Do not edit by hand.
// Cells are in source pixels: \`centre\` and \`feet\` locate the body in the cell, \`scale\` matches the
// side view to the 44px front sprite, and \`ms\` is one full play of the strip.
import type { PokemonSpecies } from "./pokemon-roster.ts";

export type MotionStrip = { frames: number; ms: number };
export type MotionInfo = { width: number; height: number; centre: number; feet: number; scale: number; walk: MotionStrip; attack: MotionStrip };

/** Pokémon without an entry always face the viewer. */
export const MOTION: Partial<Record<PokemonSpecies, MotionInfo>> = {
${Object.entries(motion).map(([species, info]) => `  ${species}: ${JSON.stringify(info).replace(/"(\w+)":/g, "$1: ").replace(/,/g, ", ")},`).join("\n")}
};
`);

for (const move of Object.keys(MOVES)) copyFileSync(new URL(`pokemon-moves/${move}.png`, root), new URL(`${move}.png`, movesOut));
console.log(`Packed ${Object.keys(SPECIES).length + PORTRAITS.length} Pokémon sheets, their walk and attack strips, and ${Object.keys(MOVES).length} move strips.`);
