# Side-view habitat animations

The right-facing **Walk** and **Attack** rows from the [PMD SpriteCollab](https://github.com/PMDCollab/SpriteCollab) sprites, normal and shiny, for most habitat residents. Diglett and Dugtrio only ever pop out of their holes, and Zarude has no SpriteCollab sprite yet; Pokémon without strips always face the viewer. `manifest.json` keeps each animation's frame size and per-frame durations (in 1/60 s ticks) from the sprite's `AnimData.xml`; an optional `scale` overrides the size match the build script works out.

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
| Misdreavus | [0200](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0200) | CHUNSOFT | Emmuffin |
| Shuppet | [0353](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0353) | CHUNSOFT | Pokejavi. |
| Banette | [0354](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0354) | CHUNSOFT | Anonymous |
| Dusclops | [0356](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0356) | CHUNSOFT | G〜 |
| Spiritomb | [0442](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0442) | CHUNSOFT | Anonymous |
| Froslass | [0478](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0478) | CHUNSOFT | Anonymous |
| Golett | [0622](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0622) | Soulja | G〜 |
| Honedge | [0679](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0679) | JFain, G〜, Emmuffin | Noo, Emmuffin |
| Sinistea | [0854](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0854) | JFain, baronessfaron | Caitemis, ShyStarryRain |
| Greavard | [0971](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0971) | pi3.14, baronessfaron | baronessfaron |
| Lunala | [0792](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0792) | baronessfaron | baronessfaron |
| Spectrier | [0897](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0897) | baronessfaron | ShyStarryRain |
| Hoopa | [0720](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0720) | programmedsleepstate | Morei |
| Phanpy | [0231](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0231) | CHUNSOFT | Prismatic, ShyStarryRain |
| Swinub | [0220](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0220) | CHUNSOFT | Tacocoa |
| Hippopotas | [0449](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0449) | CHUNSOFT | Lovi |
| Gligar | [0207](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0207) | CHUNSOFT | Prismatic, JFain |
| Sandile | [0551](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0551) | Noivern, baronessfaron | Morei, Emmuffin |
| Mudbray | [0749](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0749) | Ichor, bwappi | ShyStarryRain, bwappi |
| Wooper | [0194](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0194) | CHUNSOFT | Prismatic |
| Baltoy | [0343](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0343) | CHUNSOFT | Lovi, Caitemis |
| Marowak | [0105](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0105) | CHUNSOFT | El_Pangoro_Parse |
| Landorus | [0645](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0645) | Top_Kec | Top_Kec |
| Zygarde | [0718](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0718) | Soulja, Emmuffin, Deeshura, DeltaL | Emmuffin, DeltaL |
| Regirock | [0377](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0377) | CHUNSOFT | Chi |
| Marill | [0183](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0183) | CHUNSOFT | Tacocoa |
| Horsea | [0116](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0116) | CHUNSOFT | Reppamon |
| Staryu | [0120](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0120) | CHUNSOFT | Adrian |
| Corphish | [0341](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0341) | CHUNSOFT | Morei |
| Slowpoke | [0079](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0079) | CHUNSOFT | ShyStarryRain |
| Seel | [0086](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0086) | CHUNSOFT | Tacocoa |
| Wingull | [0278](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0278) | CHUNSOFT | Tacocoa |
| Froakie | [0656](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0656) | Emmuffin | Emmuffin |
| Popplio | [0728](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0728) | ◥θ┴θ◤ | ◥θ┴θ◤ |
| Sobble | [0816](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0816) | JFain, G〜, baronessfaron | G〜, baronessfaron |
| Lugia | [0249](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0249) | CHUNSOFT | Audino |
| Suicune | [0245](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0245) | CHUNSOFT | Lovi |
| Keldeo | [0647](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0647) | baronessfaron | Morei |
| Growlithe | [0058](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0058) | CHUNSOFT | Audino |
| Houndour | [0228](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0228) | CHUNSOFT, JFain | Anonymous |
| Slugma | [0218](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0218) | CHUNSOFT | Chi, ShyStarryRain |
| Torkoal | [0324](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0324) | CHUNSOFT | Reppamon |
| Chimchar | [0390](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0390) | CHUNSOFT | Lovi |
| Tepig | [0498](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0498) | NeroIntruder, Emboarger, NikolaP | Emboarger, NikolaP |
| Scorbunny | [0813](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0813) | NeroIntruder, Emmuffin | Caitemis, Emmuffin |
| Litleo | [0667](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0667) | Caitemis | Caitemis |
| Fletchinder | [0662](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0662) | Emmuffin | Emmuffin |
| Larvesta | [0636](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0636) | baronessfaron | baronessfaron |
| Moltres | [0146](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0146) | CHUNSOFT | Emmuffin |
| Entei | [0244](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0244) | CHUNSOFT | El_Pangoro_Parse, Emmuffin |
| Volcanion | [0721](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0721) | Dejais | ShyStarryRain |
| Hoppip | [0187](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0187) | CHUNSOFT | Reppamon, bwappi |
| Sunkern | [0191](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0191) | CHUNSOFT | Tacocoa |
| Budew | [0406](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0406) | CHUNSOFT | RaoKurai |
| Shroomish | [0285](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0285) | CHUNSOFT | Tacocoa |
| Cherubi | [0420](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0420) | CHUNSOFT |  |
| Rowlet | [0722](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0722) | Reimu\_needs\_$$$, Emmuffin | XModxGodX, Emmuffin |
| Grookey | [0810](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0810) | bwappi | bwappi |
| Sprigatito | [0906](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0906) | Emmuffin, baronessfaron | Emmuffin, baronessfaron |
| Chespin | [0650](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0650) | Emmuffin, G〜 | Emmuffin, ◥θ┴θ◤ |
| Bounsweet | [0761](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0761) | baronessfaron | ◥θ┴θ◤ |
| Tapu-Bulu | [0787](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0787) | JFain | ShyStarryRain |
| Shaymin | [0492](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0492) | CHUNSOFT | Audino, Emmuffin |
