// Packs each habitat Pokémon into one 88×88 sheet — columns are the two idle frames,
// rows are normal and shiny — and copies the move strips the habitat uses into public/.
// One request per Pokémon, and a shiny reroll never waits on the network.
//
//   node --experimental-strip-types scripts/build-habitat-sprites.mjs
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { crc32, deflateSync, inflateSync } from "node:zlib";
import { MOVES, SPECIES, SPRITE_SIZE } from "../lib/pokemon-roster.ts";

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
for (const species of Object.keys(SPECIES)) {
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

for (const move of Object.keys(MOVES)) copyFileSync(new URL(`pokemon-moves/${move}.png`, root), new URL(`${move}.png`, movesOut));
console.log(`Packed ${Object.keys(SPECIES).length} Pokémon sheets and ${Object.keys(MOVES).length} move strips.`);
