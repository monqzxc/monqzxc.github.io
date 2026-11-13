// Downloads the right-facing Walk and Attack rows (normal and shiny) from PMD SpriteCollab
// into pokemon-motion/, records their frame timings in manifest.json, and prints a credits
// table for pokemon-motion/README.md. Run `npm run build:sprites` afterwards.
//
//   node scripts/fetch-habitat-motion.mjs piplup:393 kyogre:382 ...
import { readFileSync, writeFileSync } from "node:fs";
import { readPng, writePng } from "./png.mjs";

const root = new URL("../", import.meta.url);
const BASE = "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master";
/** SpriteCollab sheets hold eight facing rows; row 2 faces right. */
const RIGHT = 2;

async function get(url, kind = "buffer", attempts = 3) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      if (response.status === 404) throw Object.assign(new Error(`404 for ${url}`), { final: true });
      if (!response.ok) throw new Error(`${response.status} for ${url}`);
      return kind === "text" ? await response.text() : Buffer.from(await response.arrayBuffer());
    } catch (error) {
      if (error.final || attempt >= attempts) throw error;
    }
  }
}

/** Frame size and durations of one animation, following CopyOf aliases. */
function animation(xml, name) {
  const block = xml.match(new RegExp(`<Anim>\\s*<Name>${name}</Name>([\\s\\S]*?)</Anim>`))?.[1];
  if (!block) throw new Error(`no ${name} animation`);
  const copy = block.match(/<CopyOf>(\w+)<\/CopyOf>/)?.[1];
  if (copy) return animation(xml, copy);
  const number = tag => Number(block.match(new RegExp(`<${tag}>(\\d+)</${tag}>`))[1]);
  return { name, width: number("FrameWidth"), height: number("FrameHeight"), durations: [...block.matchAll(/<Duration>(\d+)<\/Duration>/g)].map(match => Number(match[1])) };
}

function rightRow(png, width, height) {
  const row = { width: png.width, height, pixels: Buffer.alloc(png.width * height * 4) };
  png.pixels.copy(row.pixels, 0, RIGHT * height * png.width * 4, (RIGHT + 1) * height * png.width * 4);
  if (png.width % width) throw new Error("sheet width is not a whole number of frames");
  return row;
}

/** Contributors whose credited animations include Walk or Attack. */
function contributors(credits, names) {
  const people = new Set();
  for (const line of credits.trim().split("\n")) {
    const [, who, , , anims = ""] = line.split("\t");
    if (/\b(Walk|Attack)\b/.test(anims)) people.add(names.get(who) ?? who);
  }
  return [...people].join(", ");
}

const pairs = process.argv.slice(2).map(arg => arg.split(":"));
if (!pairs.length) throw new Error("usage: fetch-habitat-motion.mjs <species>:<dex> ...");
const manifestUrl = new URL("pokemon-motion/manifest.json", root);
const manifest = JSON.parse(readFileSync(manifestUrl, "utf8"));
const names = new Map((await get(`${BASE}/credit_names.txt`, "text")).trim().split("\n").slice(1).map(line => {
  const [name, discord] = line.split("\t");
  return [discord, name];
}));

async function fetchSpecies([species, dex]) {
  const id = dex.padStart(4, "0");
  try {
    const xml = await get(`${BASE}/sprite/${id}/AnimData.xml`, "text");
    const entry = {};
    for (const anim of ["Walk", "Attack"]) {
      const info = animation(xml, anim);
      for (const [folder, suffix] of [["", ""], ["0000/0001/", "-shiny"]]) {
        const sheet = readPng(await get(`${BASE}/sprite/${id}/${folder}${info.name}-Anim.png`));
        writePng(new URL(`pokemon-motion/${species}-${anim.toLowerCase()}${suffix}.png`, root), rightRow(sheet, info.width, info.height));
      }
      entry[anim.toLowerCase()] = { width: info.width, height: info.height, durations: info.durations };
    }
    manifest[species] = { ...manifest[species], ...entry };
    const [sprite, shiny] = await Promise.all([`${BASE}/sprite/${id}/credits.txt`, `${BASE}/sprite/${id}/0000/0001/credits.txt`].map(url => get(url, "text").catch(() => "")));
    const title = species.replace(/_/g, "-").replace(/(^|-)\w/g, letter => letter.toUpperCase());
    return `| ${title} | [${id}](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/${id}) | ${contributors(sprite, names)} | ${contributors(shiny, names)} |`;
  } catch (error) {
    console.error(`✗ ${species}: ${error.message} — it will always face the viewer`);
    return null;
  }
}

// A few at a time; results keep the order they were asked for.
const rows = new Array(pairs.length);
let cursor = 0;
await Promise.all(Array.from({ length: 5 }, async () => {
  while (cursor < pairs.length) {
    const index = cursor++;
    rows[index] = await fetchSpecies(pairs[index]);
    if (rows[index]) console.error(`✓ ${pairs[index][0]}`);
  }
}));
// Keep the manifest in roster order rather than completion order.
for (const [species] of pairs) if (manifest[species]) { const entry = manifest[species]; delete manifest[species]; manifest[species] = entry; }
writeFileSync(manifestUrl, `${JSON.stringify(manifest, null, 1)}\n`);
console.log(rows.filter(Boolean).join("\n"));
