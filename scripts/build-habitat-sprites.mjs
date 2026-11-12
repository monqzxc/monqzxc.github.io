// Packs each habitat Pokémon into one 88×88 sheet — columns are the two idle frames,
// rows are normal and shiny — and copies the move strips the habitat uses into public/.
// One request per Pokémon, and a shiny reroll never waits on the network.
// The side-view walk and attack strips in pokemon-motion/ are trimmed to one shared
// cell per Pokémon, packed the same way, and described in lib/pokemon-motion.ts.
//
//   node --experimental-strip-types scripts/build-habitat-sprites.mjs
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { crc32, deflateSync, inflateSync } from "node:zlib";
import { MOVES, PORTRAITS, SPECIES, SPRITE_SIZE } from "../lib/pokemon-roster.ts";

const root = new URL("../", import.meta.url);
const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function readPng(file) {
  const data = readFileSync(file);
  if (!data.subarray(0, 8).equals(SIGNATURE)) throw new Error(`${file} is not a PNG`);
  let width = 0, height = 0;
  const idat = [];
  for (let offset = 8; offset < data.length;) {
    const length = data.readUInt32BE(offset);
    const type = data.toString("latin1", offset + 4, offset + 8);
    const body = data.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      if (body[8] !== 8 || body[9] !== 6 || body[12] !== 0) throw new Error(`${file}: expected 8-bit, non-interlaced RGBA`);
    } else if (type === "IDAT") idat.push(body);
    offset += length + 12;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const pixels = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const left = x >= 4 ? pixels[y * stride + x - 4] : 0;
      const up = y ? pixels[(y - 1) * stride + x] : 0;
      const corner = x >= 4 && y ? pixels[(y - 1) * stride + x - 4] : 0;
      const p = left + up - corner;
      const paeth = Math.abs(p - left) <= Math.abs(p - up) && Math.abs(p - left) <= Math.abs(p - corner) ? left : Math.abs(p - up) <= Math.abs(p - corner) ? up : corner;
      const predictor = [0, left, up, (left + up) >> 1, paeth][filter];
      pixels[y * stride + x] = (line[x] + predictor) & 255;
    }
  }
  return { width, height, pixels };
}

function chunk(type, body) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(body.length);
  head.write(type, 4, "latin1");
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), body])));
  return Buffer.concat([head, body, tail]);
}

function writePng(file, { width, height, pixels }) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width);
  header.writeUInt32BE(height, 4);
  header.set([8, 6, 0, 0, 0], 8);
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) pixels.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  writeFileSync(file, Buffer.concat([SIGNATURE, chunk("IHDR", header), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]));
}

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
