# Poké Raft sprites

`bidoof-sheet.png` is a generated transparent PNG, created with the imagegen tool on September 27, 2026. Its exact generation prompt is saved in `bidoof-sheet.prompt.txt`. The image is 1122 × 1402 pixels and is sliced into four columns and five rows, in this order:

1. Breathing
2. Walking in place
3. Rock Throw windup and release
4. Taunting
5. Getting hit

Frames face right; the opposing player's frames are mirrored in the renderer. The canvas scales the sheet cells without modifying the original image.

`gengar-sheet.png` is a user-provided transparent PNG (820 by 1024 pixels) used for Gengar. The renderer selects its taunt and hit frames individually so the hit ends on the collapsed pose; it repeats the charged Shadow Ball frame instead of showing the clipped final orb at the sheet edge. The `gengar-sheet.prompt.txt` file records an earlier, unsuccessful generation attempt, not the source of this sheet.

`pikachu-sheet.png` is a user-provided transparent PNG (820 by 1024 pixels) used for Pikachu. Its rows mix idle, attack, taunt, and hit poses, so the renderer selects frames individually. Idle avoids the electric effect bleeding into the first row's second cell, and the attack ends on the electric burst. Some effects still reach cell edges and may appear cropped. The `pikachu-sheet.prompt.txt` file records an earlier, unsuccessful generation attempt, not the source of this sheet.

Generation was also attempted for Charizard. The image tool rejected that output without a specific explanation. `charizard-sheet.prompt.txt` records the attempted prompt; there is no generated sheet for it. The game uses its existing transparent portrait from `../puzzle/`, with procedural breathing, stepping, attack, taunt, and recoil poses. Original artwork attribution is in [the puzzle artwork README](../puzzle/README.md).

`lib/raft-sprites.ts` defines sheet frames, portrait poses, sizes, and attack elements. `components/raft-arena.tsx` draws Shadow Ball, Electro Ball, Flame Thrower, and Rock Throw along the shared projectile path. The animation respects reduced-motion preferences.
