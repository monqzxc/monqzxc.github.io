# Side-view habitat animations

The right-facing **Walk** and **Attack** rows from the [PMD SpriteCollab](https://github.com/PMDCollab/SpriteCollab) sprites, normal and shiny, for most habitat residents. Diglett and Dugtrio only ever pop out of their holes, and some newer Pokémon (Zarude, Miraidon, Koraidon, Chien-Pao, Ting-Lu, Okidogi, Pecharunt, Iron Boulder, Gimmighoul and a few others) have no Walk or Attack animation on SpriteCollab yet; Pokémon without strips always face the viewer. `manifest.json` keeps each animation's frame size and per-frame durations (in 1/60 s ticks) from the sprite's `AnimData.xml`; an optional `scale` overrides the size match the build script works out.

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
| Eevee | [0133](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0133) | CHUNSOFT | Lovi, baronessfaron |
| Snorlax | [0143](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0143) | CHUNSOFT | El_Pangoro_Parse |
| Meowth | [0052](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0052) | CHUNSOFT | El_Pangoro_Parse |
| Jigglypuff | [0039](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0039) | CHUNSOFT | Emmuffin |
| Chansey | [0113](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0113) | CHUNSOFT | Tacocoa |
| Kangaskhan | [0115](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0115) | CHUNSOFT | Emmuffin |
| Tauros | [0128](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0128) | CHUNSOFT | El_Pangoro_Parse |
| Ditto | [0132](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0132) | CHUNSOFT | ShyStarryRain |
| Porygon | [0137](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0137) | CHUNSOFT | Tacocoa |
| Sentret | [0161](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0161) | CHUNSOFT | Lovi |
| Aipom | [0190](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0190) | CHUNSOFT | Prismatic, Noo |
| Dunsparce | [0206](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0206) | CHUNSOFT | Chi, G〜 |
| Teddiursa | [0216](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0216) | CHUNSOFT | El_Pangoro_Parse |
| Miltank | [0241](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0241) | CHUNSOFT | Lovi |
| Zigzagoon | [0263](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0263) | CHUNSOFT | Reppamon |
| Slakoth | [0287](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0287) | CHUNSOFT | Moo |
| Skitty | [0300](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0300) | CHUNSOFT | lokatts |
| Buneary | [0427](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0427) | CHUNSOFT | Lovi, ShyStarryRain |
| Lillipup | [0506](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0506) | baronessfaron | Morei |
| Minccino | [0572](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0572) | baronessfaron | Noo, NeonCityRain |
| Wooloo | [0831](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0831) | Emmuffin | Emmuffin, Emboarger |
| Lechonk | [0915](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0915) | Emboarger | ShyStarryRain |
| Smeargle | [0235](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0235) | CHUNSOFT | Tacocoa, Emmuffin |
| Regigigas | [0486](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0486) | CHUNSOFT | Morei |
| Terapagos | [1024](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/1024) | G〜 | G〜 |
| Type: Null | [0772](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0772) | Top_Kec | Top_Kec |
| Silvally | [0773](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0773) | Top_Kec | Top_Kec |
| Arceus | [0493](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0493) | JFain, baronessfaron, Emboarger | Morei, baronessfaron |
| Pikachu | [0025](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0025) | CHUNSOFT | SilverDeoxys563 |
| Raichu | [0026](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0026) | CHUNSOFT | G〜 |
| Pichu | [0172](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0172) | CHUNSOFT | Lovi |
| Voltorb | [0100](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0100) | CHUNSOFT | Tacocoa, Emboarger, Emmuffin |
| Electabuzz | [0125](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0125) | CHUNSOFT | Scizivire |
| Jolteon | [0135](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0135) | CHUNSOFT, dmDash | Lovi |
| Mareep | [0179](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0179) | CHUNSOFT, Emmuffin | Anonymous, Emmuffin |
| Ampharos | [0181](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0181) | CHUNSOFT | Anonymous, Noo |
| Electrike | [0309](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0309) | CHUNSOFT | Tacocoa |
| Manectric | [0310](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0310) | CHUNSOFT | PixlHoopa, Hemlock |
| Plusle | [0311](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0311) | CHUNSOFT | Emmuffin |
| Minun | [0312](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0312) | CHUNSOFT | El_Pangoro_Parse |
| Shinx | [0403](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0403) | CHUNSOFT | Reppamon |
| Luxray | [0405](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0405) | CHUNSOFT | Reppamon, G〜 |
| Pachirisu | [0417](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0417) | CHUNSOFT | Prismatic |
| Emolga | [0587](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0587) | JFain, baronessfaron | Noo |
| Magnemite | [0081](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0081) | CHUNSOFT | El_Pangoro_Parse |
| Tynamo | [0602](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0602) | mosscoated | baronessfaron |
| Dedenne | [0702](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0702) | Inv3rse, baronessfaron | rhys |
| Yamper | [0835](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0835) | RelicCipher, baronessfaron, Emmuffin | Emmuffin |
| Pawmi | [0921](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0921) | ShyStarryRain, JFain | ShyStarryRain, JFain |
| Rotom | [0479](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0479) | CHUNSOFT | Audino |
| Helioptile | [0694](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0694) | Emmuffin, Leif | Emmuffin, Leif |
| Raikou | [0243](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0243) | CHUNSOFT | Emmuffin |
| Zekrom | [0644](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0644) | Top_Kec | Top_Kec |
| Regieleki | [0894](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0894) | JFain, baronessfaron | Ichor, Caitemis |
| Zeraora | [0807](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0807) | Emmuffin | Emmuffin, Caitemis |
| Snorunt | [0361](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0361) | CHUNSOFT | Emmuffin |
| Glalie | [0362](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0362) | CHUNSOFT | Tacocoa |
| Sneasel | [0215](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0215) | CHUNSOFT | ShyStarryRain |
| Weavile | [0461](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0461) | CHUNSOFT | Emmuffin |
| Delibird | [0225](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0225) | CHUNSOFT | G〜 |
| Smoochum | [0238](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0238) | CHUNSOFT | Lovi, baronessfaron |
| Jynx | [0124](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0124) | CHUNSOFT | Audino, ShyStarryRain |
| Spheal | [0363](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0363) | CHUNSOFT | Tacocoa |
| Walrein | [0365](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0365) | CHUNSOFT | Emmuffin |
| Snover | [0459](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0459) | CHUNSOFT | Scizivire |
| Abomasnow | [0460](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0460) | CHUNSOFT | Scizivire |
| Glaceon | [0471](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0471) | CHUNSOFT, JFain | , baronessfaron |
| Vanillite | [0582](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0582) | JFain, baronessfaron | JFain, Emmuffin |
| Vanilluxe | [0584](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0584) | baronessfaron | Keldaan |
| Cubchoo | [0613](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0613) | Emboarger | Morei, ShyStarryRain |
| Beartic | [0614](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0614) | baronessfaron | Emmuffin |
| Cryogonal | [0615](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0615) | baronessfaron | baronessfaron |
| Bergmite | [0712](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0712) | baronessfaron | baronessfaron |
| Avalugg | [0713](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0713) | baronessfaron | Emmuffin |
| Snom | [0872](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0872) | JFain, ◥θ┴θ◤ | ShyStarryRain, ◥θ┴θ◤, G〜 |
| Frosmoth | [0873](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0873) | Jhony-Rex, Caitemis, Emmuffin | Emmuffin |
| Eiscue | [0875](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0875) | baronessfaron | Emmuffin |
| Cetoddle | [0974](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0974) | pi3.14, DeltaL | DeltaL |
| Articuno | [0144](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0144) | CHUNSOFT | El_Pangoro_Parse, Emmuffin |
| Kyurem | [0646](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0646) | Emmuffin | Emmuffin |
| Regice | [0378](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0378) | CHUNSOFT | Tacocoa |
| Riolu | [0447](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0447) | CHUNSOFT | Anonymous |
| Lucario | [0448](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0448) | CHUNSOFT | Scizivire, Emmuffin |
| Machop | [0066](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0066) | CHUNSOFT | Tacocoa, Morei |
| Machamp | [0068](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0068) | CHUNSOFT | Tacocoa |
| Mankey | [0056](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0056) | CHUNSOFT | El_Pangoro_Parse |
| Primeape | [0057](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0057) | CHUNSOFT | El_Pangoro_Parse, G〜 |
| Hitmonlee | [0106](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0106) | CHUNSOFT | Tacocoa |
| Hitmonchan | [0107](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0107) | CHUNSOFT | Tacocoa |
| Hitmontop | [0237](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0237) | CHUNSOFT | Prismatic |
| Tyrogue | [0236](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0236) | CHUNSOFT | Prismatic, Emmuffin |
| Makuhita | [0296](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0296) | CHUNSOFT | Emmuffin |
| Hariyama | [0297](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0297) | CHUNSOFT | Moo |
| Meditite | [0307](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0307) | CHUNSOFT | Anonymous |
| Timburr | [0532](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0532) | Katach314 | G〜 |
| Conkeldurr | [0534](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0534) | Soulja | Emmuffin |
| Sawk | [0539](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0539) | Emmuffin | Emmuffin |
| Mienfoo | [0619](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0619) | JFain | Noo |
| Scraggy | [0559](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0559) | JFain, Soulja | ShyStarryRain, G〜 |
| Pancham | [0674](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0674) | baronessfaron | G〜 |
| Hawlucha | [0701](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0701) | Emmuffin | Emmuffin |
| Stufful | [0759](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0759) | JFain | ShyStarryRain |
| Passimian | [0766](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0766) | baronessfaron | Emmuffin |
| Zamazenta | [0889](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0889) | FerMrack, DeltaL | DeltaL |
| Urshifu | [0892](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0892) | baronessfaron | Deeshura |
| Kubfu | [0891](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0891) | Top_Kec | Top_Kec |
| Meloetta | [0648](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0648) | baronessfaron, Ariakyu | Morei, baronessfaron, Ariakyu |
| Grimer | [0088](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0088) | CHUNSOFT | Emmuffin |
| Muk | [0089](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0089) | CHUNSOFT | G〜 |
| Ekans | [0023](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0023) | CHUNSOFT | Emmuffin |
| Arbok | [0024](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0024) | CHUNSOFT | Morei |
| Nidoran♀ | [0029](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0029) | CHUNSOFT | lokatts |
| Nidoran♂ | [0032](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0032) | CHUNSOFT | Tacocoa |
| Nidoking | [0034](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0034) | CHUNSOFT | Tacocoa |
| Nidoqueen | [0031](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0031) | CHUNSOFT | Emmuffin |
| Zubat | [0041](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0041) | CHUNSOFT | Tacocoa |
| Crobat | [0169](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0169) | CHUNSOFT | Chi |
| Koffing | [0109](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0109) | CHUNSOFT | Tacocoa |
| Weezing | [0110](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0110) | CHUNSOFT | El_Pangoro_Parse |
| Gulpin | [0316](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0316) | CHUNSOFT | Emmuffin |
| Swalot | [0317](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0317) | CHUNSOFT | Emmuffin |
| Seviper | [0336](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0336) | CHUNSOFT | Emmuffin |
| Stunky | [0434](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0434) | CHUNSOFT | Audino, Caitemis |
| Croagunk | [0453](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0453) | CHUNSOFT | Emmuffin |
| Toxicroak | [0454](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0454) | CHUNSOFT | Moo |
| Trubbish | [0568](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0568) | powercristal, cyboy_bit | Caitemis |
| Garbodor | [0569](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0569) | baronessfaron | G〜 |
| Salandit | [0757](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0757) | baronessfaron, Soulja | Caitemis, Emmuffin |
| Mareanie | [0747](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0747) | baronessfaron | ShyStarryRain |
| Eternatus | [0890](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0890) | Soulja | Emmuffin |
| Munkidori | [1015](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/1015) | JFain | Pokejavi. |
| Fezandipiti | [1016](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/1016) | Emmuffin | Emmuffin |
| Pidgey | [0016](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0016) | CHUNSOFT | SilverDeoxys563, Some_Shinx |
| Pidgeotto | [0017](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0017) | CHUNSOFT | Moo, bwappi |
| Pidgeot | [0018](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0018) | CHUNSOFT | SilverDeoxys563 |
| Spearow | [0021](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0021) | CHUNSOFT | SilverDeoxys563 |
| Fearow | [0022](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0022) | CHUNSOFT | SilverDeoxys563 |
| Farfetch’d | [0083](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0083) | CHUNSOFT | Lovi |
| Doduo | [0084](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0084) | CHUNSOFT | Anonymous |
| Hoothoot | [0163](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0163) | CHUNSOFT | Lovi, Noo |
| Noctowl | [0164](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0164) | CHUNSOFT | Pencil, Noo, Emmuffin |
| Taillow | [0276](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0276) | CHUNSOFT | Moo, Morei |
| Swellow | [0277](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0277) | CHUNSOFT | Moo, Morei |
| Swablu | [0333](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0333) | CHUNSOFT | Emmuffin |
| Altaria | [0334](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0334) | CHUNSOFT | Emmuffin |
| Starly | [0396](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0396) | CHUNSOFT | Lovi, Emmuffin |
| Staraptor | [0398](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0398) | CHUNSOFT | Lovi, Emmuffin, Morei |
| Chatot | [0441](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0441) | CHUNSOFT | Tacocoa, Emmuffin |
| Pidove | [0519](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0519) | powercristal, Caitemis | Caitemis |
| Ducklett | [0580](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0580) | baronessfaron | Emmuffin |
| Rufflet | [0627](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0627) | baronessfaron | baronessfaron, Emmuffin |
| Braviary | [0628](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0628) | Caitemis | Caitemis |
| Pikipek | [0731](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0731) | FlowerSnek | Emmuffin |
| Rookidee | [0821](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0821) | Michael12, Soulja | G〜 |
| Tornadus | [0641](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0641) | JFain, Top_Kec | Caitemis, Top_Kec |
| Thundurus | [0642](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0642) | Top_Kec | Top_Kec |
| Zapdos | [0145](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0145) | CHUNSOFT | Emmuffin |
| Rayquaza | [0384](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0384) | CHUNSOFT | lokatts |
| Enamorus | [0905](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0905) | baronessfaron | G〜 |
| Ralts | [0280](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0280) | CHUNSOFT | Moo, Morei |
| Kirlia | [0281](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0281) | CHUNSOFT | Moo, Morei |
| Gardevoir | [0282](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0282) | CHUNSOFT | Morei |
| Abra | [0063](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0063) | CHUNSOFT | Tacocoa, 3Monika4 |
| Alakazam | [0065](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0065) | CHUNSOFT | Morei, Emmuffin |
| Drowzee | [0096](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0096) | CHUNSOFT | El_Pangoro_Parse |
| Hypno | [0097](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0097) | CHUNSOFT | Lovi |
| Mr. Mime | [0122](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0122) | CHUNSOFT | Lovi |
| Natu | [0177](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0177) | CHUNSOFT | El_Pangoro_Parse |
| Xatu | [0178](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0178) | CHUNSOFT | Morei |
| Espeon | [0196](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0196) | CHUNSOFT | Lovi, Noo, baronessfaron |
| Wobbuffet | [0202](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0202) | CHUNSOFT | Tacocoa, Noo |
| Spoink | [0325](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0325) | CHUNSOFT | Prismatic |
| Chimecho | [0358](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0358) | CHUNSOFT | lokatts |
| Munna | [0517](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0517) | baronessfaron, ShyStarryRain | Caitemis |
| Musharna | [0518](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0518) | baronessfaron | Caitemis |
| Woobat | [0527](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0527) | NeroIntruder, ShyStarryRain | Caitemis |
| Sigilyph | [0561](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0561) | Soulja | baronessfaron |
| Gothita | [0574](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0574) | baronessfaron | ShyStarryRain |
| Solosis | [0577](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0577) | ◥θ┴θ◤, Uni | ◥θ┴θ◤, Emmuffin, Uni |
| Elgyem | [0605](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0605) | Limomon | Limomon, baronessfaron |
| Espurr | [0677](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0677) | NeroIntruder | Noo |
| Hatenna | [0856](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0856) | baronessfaron | Emboarger |
| Mewtwo | [0150](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0150) | CHUNSOFT, JFain | El_Pangoro_Parse |
| Cresselia | [0488](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0488) | CHUNSOFT | ShyStarryRain, El_Pangoro_Parse |
| Azelf | [0482](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0482) | CHUNSOFT | Anonymous |
| Mew | [0151](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0151) | CHUNSOFT | Anonymous, Emboarger |
| Deoxys | [0386](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0386) | CHUNSOFT | Chi, Sonikku_A |
| Caterpie | [0010](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0010) | CHUNSOFT | SilverDeoxys563 |
| Metapod | [0011](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0011) | CHUNSOFT | SilverDeoxys563 |
| Butterfree | [0012](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0012) | CHUNSOFT | Emmuffin |
| Weedle | [0013](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0013) | CHUNSOFT | ShyStarryRain |
| Beedrill | [0015](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0015) | CHUNSOFT | SilverDeoxys563 |
| Paras | [0046](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0046) | CHUNSOFT | Tacocoa |
| Venonat | [0048](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0048) | CHUNSOFT | Tacocoa, Emmuffin |
| Scyther | [0123](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0123) | CHUNSOFT | Tacocoa |
| Pinsir | [0127](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0127) | CHUNSOFT | El_Pangoro_Parse |
| Ledyba | [0165](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0165) | CHUNSOFT | Pokejavi. |
| Spinarak | [0167](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0167) | CHUNSOFT | Emmuffin |
| Yanma | [0193](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0193) | CHUNSOFT | Moo |
| Heracross | [0214](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0214) | CHUNSOFT | Prismatic |
| Wurmple | [0265](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0265) | CHUNSOFT | Avery |
| Volbeat | [0313](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0313) | CHUNSOFT | Reppamon, G〜 |
| Illumise | [0314](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0314) | CHUNSOFT | Emmuffin |
| Combee | [0415](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0415) | CHUNSOFT | Tacocoa |
| Sewaddle | [0540](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0540) | Emboarger | Caitemis |
| Grubbin | [0736](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0736) | Soulja | Emmuffin |
| Cutiefly | [0742](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0742) | baronessfaron, Emmuffin | Caitemis, Emmuffin |
| Scatterbug | [0664](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0664) | Riodise, baronessfaron | Emmuffin |
| Genesect | [0649](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0649) | Emboarger | Emboarger |
| Buzzwole | [0794](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0794) | Top_Kec, Soulja | Top_Kec |
| Pheromosa | [0795](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0795) | JFain, baronessfaron | Morei |
| Slither Wing | [0988](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0988) | baronessfaron | baronessfaron |
| Iron Moth | [0994](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0994) | pi3.14, Soulja | Emmuffin |
| Geodude | [0074](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0074) | CHUNSOFT | El_Pangoro_Parse |
| Graveler | [0075](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0075) | CHUNSOFT | Emmuffin |
| Golem | [0076](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0076) | CHUNSOFT | El_Pangoro_Parse, Emmuffin |
| Onix | [0095](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0095) | CHUNSOFT | El_Pangoro_Parse |
| Aerodactyl | [0142](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0142) | CHUNSOFT | El_Pangoro_Parse |
| Omanyte | [0138](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0138) | CHUNSOFT | Tacocoa |
| Kabuto | [0140](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0140) | CHUNSOFT | Emmuffin |
| Sudowoodo | [0185](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0185) | CHUNSOFT | Prismatic, Noo |
| Larvitar | [0246](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0246) | CHUNSOFT, JFain | Lovi |
| Tyranitar | [0248](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0248) | CHUNSOFT | Prismatic |
| Shuckle | [0213](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0213) | CHUNSOFT | Anonymous, Noo |
| Nosepass | [0299](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0299) | CHUNSOFT | Moo |
| Lunatone | [0337](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0337) | CHUNSOFT | Chesyon |
| Solrock | [0338](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0338) | CHUNSOFT | El_Pangoro_Parse |
| Lileep | [0345](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0345) | CHUNSOFT | Anonymous |
| Anorith | [0347](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0347) | CHUNSOFT | Moo |
| Cranidos | [0408](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0408) | CHUNSOFT | Lovi, ShyStarryRain |
| Shieldon | [0410](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0410) | CHUNSOFT | Tacocoa |
| Bonsly | [0438](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0438) | CHUNSOFT | Lovi |
| Roggenrola | [0524](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0524) | powercristal | Caitemis |
| Rockruff | [0744](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0744) | JFain, baronessfaron | Vendily, ShyStarryRain, baronessfaron |
| Carbink | [0703](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0703) | Caitemis | Caitemis, ShyStarryRain |
| Nacli | [0932](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0932) | DavKriz, baronessfaron | Emmuffin |
| Terrakion | [0639](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0639) | Emmuffin | Emmuffin |
| Nihilego | [0793](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0793) | Emmuffin | Emmuffin |
| Stakataka | [0805](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0805) | Top_Kec | Top_Kec |
| Iron Thorns | [0995](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0995) | Soulja | G〜 |
| Dratini | [0147](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0147) | CHUNSOFT | Pencil |
| Dragonair | [0148](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0148) | CHUNSOFT | Lovi |
| Dragonite | [0149](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0149) | CHUNSOFT | Deeshura |
| Bagon | [0371](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0371) | CHUNSOFT | Pokejavi. |
| Shelgon | [0372](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0372) | CHUNSOFT | Tacocoa |
| Salamence | [0373](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0373) | CHUNSOFT | Emmuffin |
| Axew | [0610](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0610) | JFain, baronessfaron | Caitemis, G〜 |
| Haxorus | [0612](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0612) | Pink_no_tori, baronessfaron, Deeshura | baronessfaron, Deeshura |
| Deino | [0633](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0633) | Jhony-Rex, Emboarger, Uni | Caitemis, Uni |
| Hydreigon | [0635](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0635) | Top_Kec | Top_Kec, Deeshura |
| Goomy | [0704](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0704) | Emmuffin | Emmuffin |
| Goodra | [0706](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0706) | Emmuffin | Emmuffin |
| Jangmo-o | [0782](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0782) | Top_Kec, Soulja | Emmuffin |
| Kommo-o | [0784](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0784) | Top_Kec | Top_Kec |
| Dreepy | [0885](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0885) | Jhony-Rex, Caitemis | Caitemis |
| Dragapult | [0887](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0887) | Emmuffin | Emmuffin |
| Noibat | [0714](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0714) | JFain, Emboarger, G〜, baronessfaron | Noo, G〜, Caitemis, baronessfaron |
| Noivern | [0715](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0715) | Soulja, Top_Kec | Top_Kec |
| Druddigon | [0621](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0621) | baronessfaron | Deeshura |
| Applin | [0840](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0840) | JFain, Emmuffin | Emboarger, Emmuffin |
| Cyclizar | [0967](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0967) | baronessfaron | lokatts |
| Frigibax | [0996](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0996) | Soulja, pi3.14, Inv3rse | Emmuffin |
| Drampa | [0780](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0780) | Emmuffin | Emmuffin |
| Reshiram | [0643](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0643) | Top_Kec | Top_Kec |
| Latias | [0380](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0380) | CHUNSOFT | Emmuffin |
| Latios | [0381](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0381) | CHUNSOFT | Reppamon |
| Regidrago | [0895](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0895) | JFain, baronessfaron | Ichor, ShyStarryRain |
| Palkia | [0484](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0484) | CHUNSOFT | Morei |
| Umbreon | [0197](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0197) | CHUNSOFT, JFain, Emmuffin | Emmuffin |
| Poochyena | [0261](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0261) | CHUNSOFT | Anonymous, Morei |
| Mightyena | [0262](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0262) | CHUNSOFT, KCN015 | Anonymous, Emboarger |
| Murkrow | [0198](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0198) | CHUNSOFT | Scizivire, Caitemis |
| Honchkrow | [0430](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0430) | CHUNSOFT | Scizivire |
| Absol | [0359](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0359) | CHUNSOFT | Top_Kec, Noo |
| Zorua | [0570](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0570) | Emmuffin, baronessfaron | Emmuffin |
| Zoroark | [0571](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0571) | baronessfaron | Morei, G〜 |
| Purrloin | [0509](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0509) | baronessfaron | Morei, ShyStarryRain |
| Liepard | [0510](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0510) | LightBlueBlaze | ShyStarryRain |
| Pawniard | [0624](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0624) | AikoMaiko, baronessfaron | Caitemis |
| Bisharp | [0625](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0625) | Emmuffin | Emmuffin |
| Kingambit | [0983](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0983) | Top_Kec | Top_Kec |
| Vullaby | [0629](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0629) | baronessfaron | Emmuffin |
| Mandibuzz | [0630](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0630) | powercristal | Caitemis |
| Inkay | [0686](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0686) | baronessfaron | Emmuffin |
| Malamar | [0687](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0687) | Soulja, pi3.14, JFain | Emmuffin |
| Nickit | [0827](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0827) | Top_Kec | Top_Kec |
| Thievul | [0828](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0828) | Smalusion | Caitemis |
| Impidimp | [0859](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0859) | baronessfaron | lokatts |
| Grimmsnarl | [0861](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0861) | baronessfaron | baronessfaron |
| Obstagoon | [0862](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0862) | baronessfaron | Emmuffin |
| Yveltal | [0717](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0717) | Deleca7755, Top_Kec | Top_Kec |
| Darkrai | [0491](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0491) | CHUNSOFT | ShyStarryRain |
| Chi-Yu | [1004](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/1004) | pi3.14, DeltaL | baronessfaron |
| Guzzlord | [0799](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0799) | Top_Kec | Top_Kec |
| Aron | [0304](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0304) | CHUNSOFT | Reppamon, Morei |
| Lairon | [0305](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0305) | CHUNSOFT | Emmuffin |
| Aggron | [0306](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0306) | CHUNSOFT | Morei |
| Steelix | [0208](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0208) | CHUNSOFT | Lovi |
| Scizor | [0212](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0212) | CHUNSOFT | Anonymous |
| Skarmory | [0227](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0227) | CHUNSOFT | Morei |
| Forretress | [0205](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0205) | CHUNSOFT | Tacocoa, G〜 |
| Mawile | [0303](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0303) | CHUNSOFT | Emmuffin |
| Beldum | [0374](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0374) | CHUNSOFT | Audino |
| Metang | [0375](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0375) | CHUNSOFT | Audino |
| Metagross | [0376](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0376) | CHUNSOFT | Audino, Noo |
| Bronzor | [0436](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0436) | CHUNSOFT | Lovi |
| Bronzong | [0437](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0437) | CHUNSOFT | Lovi, ShyStarryRain |
| Probopass | [0476](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0476) | CHUNSOFT | Anonymous |
| Klink | [0599](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0599) | baronessfaron, stressparticles | Emmuffin |
| Klinklang | [0601](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0601) | baronessfaron | Emmuffin |
| Ferroseed | [0597](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0597) | G〜 | G〜 |
| Ferrothorn | [0598](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0598) | Top_Kec | Shitpost_Sunkern |
| Durant | [0632](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0632) | baronessfaron | Gust |
| Cufant | [0878](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0878) | Emmuffin | Emmuffin |
| Corviknight | [0823](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0823) | nataniel-sama, ◥θ┴θ◤, G〜, Soulja | ◥θ┴θ◤, G〜, Emmuffin |
| Dialga | [0483](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0483) | CHUNSOFT | ShyStarryRain |
| Registeel | [0379](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0379) | CHUNSOFT | Audino |
| Cobalion | [0638](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0638) | powercristal, Noo | Caitemis |
| Heatran | [0485](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0485) | CHUNSOFT | Anonymous |
| Jirachi | [0385](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0385) | CHUNSOFT | Morei, Emmuffin |
| Togepi | [0175](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0175) | CHUNSOFT | RaoKurai |
| Togetic | [0176](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0176) | CHUNSOFT, Emmuffin | Emmuffin |
| Togekiss | [0468](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0468) | CHUNSOFT | RaoKurai |
| Clefairy | [0035](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0035) | CHUNSOFT | Tacocoa |
| Clefable | [0036](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0036) | CHUNSOFT | Tacocoa |
| Cleffa | [0173](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0173) | CHUNSOFT | Anonymous |
| Snubbull | [0209](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0209) | CHUNSOFT | Emmuffin |
| Granbull | [0210](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0210) | CHUNSOFT | Chi |
| Flabébé | [0669](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0669) | baronessfaron | Morei |
| Floette | [0670](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0670) | baronessfaron | Morei, baronessfaron |
| Florges | [0671](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0671) | baronessfaron | Morei |
| Spritzee | [0682](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0682) | baronessfaron | Caitemis |
| Swirlix | [0684](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0684) | baronessfaron, mixy:3 | ◥θ┴θ◤, mixy:3 |
| Slurpuff | [0685](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0685) | mixy:3 | baronessfaron |
| Sylveon | [0700](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0700) | baronessfaron | Lovi, Mond |
| Klefki | [0707](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0707) | ◥θ┴θ◤ | ◥θ┴θ◤, Emmuffin |
| Comfey | [0764](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0764) | baronessfaron | baronessfaron |
| Hatterene | [0858](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0858) | JFain, baronessfaron | ShyStarryRain |
| Tinkatink | [0957](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0957) | JFain | ShyStarryRain |
| Tinkaton | [0959](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0959) | Emmuffin | Emmuffin |
| Fidough | [0926](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0926) | Emmuffin | Emmuffin |
| Xerneas | [0716](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0716) | baronessfaron | ShyStarryRain |
| Zacian | [0888](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0888) | baronessfaron | G〜 |
| Tapu Lele | [0786](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0786) | baronessfaron | Caitemis |
| Tapu Fini | [0788](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0788) | JFain, baronessfaron | ShyStarryRain, baronessfaron |
| Magearna | [0801](https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0801) | baronessfaron | Caitemis |
