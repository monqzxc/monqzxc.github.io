# Side-view habitat animations

The right-facing **Walk** and **Attack** rows from the [PMD SpriteCollab](https://github.com/PMDCollab/SpriteCollab) sprites, normal and shiny, for each habitat resident except Diglett, which only ever pops out of its hole. `manifest.json` keeps each animation's frame size and per-frame durations (in 1/60 s ticks) from the sprite's `AnimData.xml`; an optional `scale` overrides the size match the build script works out.

`npm run build:sprites` trims these to one shared cell per Pokémon and packs them into `public/sprites/pokemon/<name>-walk.png` and `<name>-attack.png`; the habitat mirrors them for left-facing travel.

SpriteCollab sprites are licensed [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/): non-commercial use with credit. Pokémon is © Nintendo / Creatures / GAME FREAK.

| Pokémon | Source | Sprite credits | Shiny credits |
| --- | --- | --- | --- |
| Gengar | [0094](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0094) | CHUNSOFT, Emboarger | Tacocoa, Emboarger |
| Haunter | [0093](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0093) | CHUNSOFT | Tacocoa |
| Gastly | [0092](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0092) | CHUNSOFT | El_Pangoro_Parse, ShyStarryRain |
| Giratina | [0487](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0487) | CHUNSOFT | G〜, Emmuffin |
| Mismagius | [0429](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0429) | CHUNSOFT | Lovi |
| Drifblim | [0426](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0426) | CHUNSOFT | Scizivire |
| Chandelure | [0609](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0609) | baronessfaron | Caitemis |
| Dusknoir | [0477](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0477) | CHUNSOFT, Caitemis | Emmuffin |
| Sableye | [0302](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0302) | CHUNSOFT | Morei |
| Mimikyu | [0778](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0778) | JFain, G〜, baronessfaron | ShyStarryRain |
| Gible | [0443](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0443) | CHUNSOFT | Lovi |
| Garchomp | [0445](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0445) | CHUNSOFT | Prismatic, ◥θ┴θ◤ |
| Flygon | [0330](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0330) | CHUNSOFT | El_Pangoro_Parse, Deeshura |
| Donphan | [0232](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0232) | CHUNSOFT, Emmuffin | Lovi, Emmuffin |
| Groudon | [0383](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0383) | CHUNSOFT | lokatts |
| Cubone | [0104](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0104) | CHUNSOFT, Emmuffin, Sceptile, Some_Shinx | Emmuffin, Sceptile, Some_Shinx |
| Sandslash | [0028](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0028) | CHUNSOFT, Emmuffin, XModxGodX | SilverDeoxys563, XModxGodX, Emmuffin |
| Hippowdon | [0450](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0450) | CHUNSOFT | Lovi |
| Gliscor | [0472](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0472) | CHUNSOFT | G〜 |
