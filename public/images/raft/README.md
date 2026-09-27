# Poké Raft sprites

`bidoof-sheet.png` is a generated transparent PNG, created with the imagegen tool on September 27, 2026. Its exact generation prompt is saved in `bidoof-sheet.prompt.txt`. The image is 1122 × 1402 pixels and is sliced into four columns and five rows, in this order:

1. Breathing
2. Walking in place
3. Rock Throw windup and release
4. Taunting
5. Getting hit

Frames face right; the opposing player's frames are mirrored in the renderer. The canvas scales the sheet cells without modifying the original image.

Generation was also attempted for Gengar, Pikachu, and Charizard. The image tool rejected those outputs without a specific explanation. Their `*-sheet.prompt.txt` files record attempted prompts; there are no generated sheets for them. The game uses their existing transparent portraits from `../puzzle/`, with procedural breathing, stepping, attack, taunt, and recoil poses. Original artwork attribution is in [the puzzle artwork README](../puzzle/README.md).

`lib/raft-sprites.ts` defines sheet frames, portrait poses, sizes, and attack elements. `components/raft-arena.tsx` draws Shadow Ball, Electro Ball, Flame Thrower, and Rock Throw along the shared projectile path. The animation respects reduced-motion preferences.
