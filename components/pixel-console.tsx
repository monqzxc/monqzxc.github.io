import { ThemePartner } from "@/components/pokemon-theme";
import styles from "./pixel-console.module.css";

/*
 * Mon's own pocket console, one character per pixel. The LCD (`l`) is where the
 * partner Pokémon plays; its box below must match the map.
 *   o outline · b body · h highlight · s shade · k bezel · x/y stripes · r power LED
 *   l LCD · m badge letter · a buttons · A button shine · d D-pad and pills · D D-pad shine
 */
const MAP = `
..oooooooooooooooooooooooooooooooo..
.ohhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhso.
.ohbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbso.
.ohssssssssssssssssssssssssssssssso.
.ohbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbso.
.ohbkkkkkkkkkkkkkkkkkkkkkkkkkkkkbso.
.ohbkkkkkkkkkkkkkkkkkkkkkkkkkkkkbso.
.ohbkkxxxxxxxxxxxxxxxxxxxxxxxxkkbso.
.ohbkkyyyyyyyyyyyyyyyyyyyyyyyykkbso.
.ohbkkkkkkkkkkkkkkkkkkkkkkkkkkkkbso.
.ohbkkkkkllllllllllllllllllllkkkbso.
.ohbkkkkkllllllllllllllllllllkkkbso.
.ohbkkkkkllllllllllllllllllllkkkbso.
.ohbkkkkkllllllllllllllllllllkkkbso.
.ohbkkkkkllllllllllllllllllllkkkbso.
.ohbkrrkkllllllllllllllllllllkkkbso.
.ohbkrrkkllllllllllllllllllllkkkbso.
.ohbkkkkkllllllllllllllllllllkkkbso.
.ohbkkkkkllllllllllllllllllllkkkbso.
.ohbkkkkkllllllllllllllllllllkkkbso.
.ohbkkkkkllllllllllllllllllllkkkbso.
.ohbkkkkkllllllllllllllllllllkkkbso.
.ohbkkkkkllllllllllllllllllllkkkbso.
.ohbkkkkkllllllllllllllllllllkkkbso.
.ohbkkkkkllllllllllllllllllllkkkbso.
.ohbkkkkkkkkkkkkkkkkkkkkkkkkkkkbbso.
.ohbkkkkkkkkkkkkkkkkkkkkkkkkkkkbbso.
.ohbkkkkkkkkkkkkkkkkkkkkkkkkkbbbbso.
.ohbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbso.
.ohbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbso.
.ohbbkkkkkkkbbbbbbbbbbbbbbbbbbbbbso.
.ohbkkmkkkmkkbbbbbbbbbbbbbbbbbbbbso.
.ohbkkmmkmmkkbbbbbbbbbbbbbbbbbbbbso.
.ohbkkmkmkmkkbxxxyyyaaabbbbbbbbbbso.
.ohbkkmkkkmkkbbbbbbbbbbbbbbbbbbbbso.
.ohbkkmkkkmkkbbbbbbbbbbbbbbbbbbbbso.
.ohbbkkkkkkkbbbbbbbbbbbbbbbbbbbbbso.
.ohbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbso.
.ohbbbbDddbbbbbbbbbbbbbbbbbbaaabbso.
.ohbbbbdddbbbbbbbbbbbbbbbbbaAaaabso.
.ohbbbbdddbbbbbbbbbbbbbbbbbaaaaabso.
.ohbDddddddddbbbbbbbbbbbbbbaaaaabso.
.ohbddddkddddbbbbbbbbaaabbbbaaabbso.
.ohbdddddddddbbbbbbbaAaaabbbbbbbbso.
.ohbbbbdddbbbbbbbbbbaaaaabbbbbbbbso.
.ohbbbbdddbbbbbbbbbbaaaaabbbbbbbbso.
.ohbbbbdddbbbbbbbbbbbaaabbbsbsbsso..
.ohbbbbbbbbbbbbbbbbbbbbbbbsbsbsbso..
.ohbbbbbbbbbbdddbbdddbbbbsbsbsbso...
.osbbbbbbbbbdddbbdddbbbbsbsbssso....
..ossssssssssssssssssssssssssoo.....
...oooooooooooooooooooooooooo.......
`.trim().split("\n");

const WIDTH = MAP[0].length;
const HEIGHT = MAP.length;
const LCD = { x: 9, y: 10, width: 20, height: 15 };

// Runs of one colour per row, so the console is ~150 crisp rectangles rather than 1,800.
const RUNS = MAP.flatMap((row, y) => {
  const runs: { x: number; y: number; width: number; tone: string }[] = [];
  for (let x = 0; x < row.length;) {
    let end = x;
    while (end < row.length && row[end] === row[x]) end++;
    if (row[x] !== ".") runs.push({ x, y, width: end - x, tone: row[x] });
    x = end;
  }
  return runs;
});

const percent = (value: number, of: number) => `${(value / of) * 100}%`;

/** A pixel-art handheld with an "M" badge; the theme's partner idles on its screen. */
export function PixelConsole() {
  return (
    <span className={styles.console} aria-hidden="true">
      <svg className={styles.shell} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} shapeRendering="crispEdges" focusable="false">
        {RUNS.map(({ x, y, width, tone }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={width} height={1} className={styles[`tone${tone}`]} />
        ))}
      </svg>
      <span className={styles.screen} style={{ left: percent(LCD.x, WIDTH), top: percent(LCD.y, HEIGHT), width: percent(LCD.width, WIDTH), height: percent(LCD.height, HEIGHT) }}>
        <ThemePartner className={styles.partner} />
      </span>
    </span>
  );
}
