# Side-view habitat animations

The right-facing **Walk** and **Attack** rows from the [PMD SpriteCollab](https://github.com/PMDCollab/SpriteCollab) sprites, normal and shiny, for each habitat resident except Diglett, which only ever pops out of its hole. `manifest.json` keeps each animation's frame size and per-frame durations (in 1/60 s ticks) from the sprite's `AnimData.xml`; an optional `scale` overrides the size match the build script works out.

New residents are fetched with `node scripts/fetch-habitat-motion.mjs <species>:<dex> …`, which also prints their credit rows for the table below. `npm run build:sprites` then trims these to one shared cell per Pokémon and packs them into `public/sprites/pokemon/<name>-walk.png` and `<name>-attack.png`; the habitat mirrors them for left-facing travel.

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
| Piplup | [0393](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0393) | CHUNSOFT | Lovi |
| Squirtle | [0007](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0007) | CHUNSOFT | SilverDeoxys563, ShyStarryRain |
| Psyduck | [0054](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0054) | CHUNSOFT | , ShyStarryRain |
| Totodile | [0158](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0158) | CHUNSOFT | Moo |
| Vaporeon | [0134](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0134) | CHUNSOFT | Emmuffin |
| Lapras | [0131](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0131) | CHUNSOFT | RaoKurai |
| Gyarados | [0130](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0130) | CHUNSOFT | Noo, Emmuffin |
| Pelipper | [0279](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0279) | CHUNSOFT | Morei |
| Kyogre | [0382](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0382) | CHUNSOFT | lokatts |
| Manaphy | [0490](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0490) | CHUNSOFT | Emmuffin |
| Charmander | [0004](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0004) | CHUNSOFT | ShyStarryRain |
| Cyndaquil | [0155](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0155) | CHUNSOFT | lokatts |
| Vulpix | [0037](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0037) | CHUNSOFT | Lovi |
| Ponyta | [0077](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0077) | CHUNSOFT | Tacocoa, Emmuffin |
| Arcanine | [0059](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0059) | CHUNSOFT | Tacocoa, baronessfaron |
| Magmar | [0126](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0126) | CHUNSOFT | Lovi |
| Charizard | [0006](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0006) | CHUNSOFT | SilverDeoxys563, Emmuffin |
| Talonflame | [0663](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0663) | Michael12, Emmuffin | Emmuffin |
| Ho-Oh | [0250](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0250) | CHUNSOFT | El_Pangoro_Parse, Deeshura |
| Victini | [0494](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0494) | baronessfaron | baronessfaron |
| Bulbasaur | [0001](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0001) | CHUNSOFT | ShyStarryRain |
| Venusaur | [0003](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0003) | CHUNSOFT | SilverDeoxys563 |
| Chikorita | [0152](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0152) | CHUNSOFT | lokatts |
| Treecko | [0252](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0252) | CHUNSOFT | YoukaiMinori, Morei |
| Oddish | [0043](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0043) | CHUNSOFT | Tacocoa |
| Leafeon | [0470](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0470) | CHUNSOFT, baronessfaron | , baronessfaron |
| Jumpluff | [0189](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0189) | CHUNSOFT | Anonymous |
| Tropius | [0357](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0357) | CHUNSOFT | Emmuffin |
| Virizion | [0640](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0640) | baronessfaron | ShyStarryRain, Deeshura |
| Celebi | [0251](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0251) | CHUNSOFT | Emmuffin |
| Marshadow | [0802](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0802) | Dejais | Caitemis |
| Diancie | [0719](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0719) | Emmuffin | Emmuffin |
