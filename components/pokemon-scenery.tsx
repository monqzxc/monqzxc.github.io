import type { ReactNode } from "react";
import type { PokemonTheme } from "@/lib/pokemon-roster";

type SceneryProps = { theme: PokemonTheme };

function HauntedManor() {
  return <svg className="scenery-edge scenery-edge-left scenery-manor" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" fill="none" aria-hidden="true" focusable="false">
    <path d="M0 362Q100 307 209 343T440 370V390H0Z" fill="#292037" />
    <g stroke="#443250" strokeWidth="2" strokeLinejoin="round">
      <path d="M42 321 34 194l43-46 44 54 7 119Z" fill="#221a31" />
      <path d="m21 198 51-70 58 76-16 4-40-47-37 42Z" fill="#352440" />
      <path d="m55 155 6-63 21 3 9 62" fill="#30213d" />
      <path d="m50 98 21-52 20 52Z" fill="#39264b" />
      <path d="M118 322V215l67-51 78 59v106Z" fill="#281d36" />
      <path d="m101 218 81-72 98 77-18 10-78-59-66 52Z" fill="#3c2a48" />
      <path d="m234 323 8-168 34-33 39 40-10 172Z" fill="#271c35" />
      <path d="m227 160 51-65 44 74-16-4-29-42-32 43Z" fill="#3b2850" />
      <path d="m178 163-2-50 17 1 7 47" fill="#2f223b" />
      <path d="M173 326v-46q0-19 17-20 18 2 18 20v46" fill="#140f20" />
      <path d="m45 230 73 5m-70 21 71 4m120-62 70 3m-71 49 68 2" opacity=".4" />
    </g>
    <g className="scenery-window-light" fill="#c1a075" opacity=".8">
      <path d="m66 108 9 1 1 15-10-1Zm-7 105 13 1 1 23-13-1Zm30 4 13 1 1 22-14-1ZM146 233h16v23h-16Zm65 0h16v23h-16Zm48-48 13-1-1 25-13 1Zm24-1 12 1-1 25-12-1ZM263 239h13l-1 23h-13Z" />
      <circle cx="185" cy="198" r="11" />
    </g>
    <g stroke="#49334e" strokeWidth="3"><path d="M185 188v20m-10-10h20M65 225h9m-3-11v22m188-39h13m-6-12v24" /></g>
    <path d="M180 329 147 388h87l-36-59" fill="#695064" opacity=".18" />
    <g fill="#514255" stroke="#665367" strokeWidth="2">
      <path d="m24 354-4-27q-2-16 14-18 16-1 17 15l4 29Z" />
      <path d="m327 362 5-42q2-20 21-17 17 3 15 21l-5 41Z" />
      <path d="m390 375-3-36h-10l-1-13 10-1-1-12 14-1 1 13 11-1 1 13-11 1 3 36Z" />
    </g>
    <g stroke="#99818a" strokeWidth="2" opacity=".35"><path d="m31 325 14-1m-13 6 9-1m309-8 13 2m-14 4 9 1" /></g>
    <g stroke="#46304f" strokeWidth="3"><path d="M0 349q75-18 140-3M0 368q76-18 140-3M7 340v43m22-48v43m23-47v42m24-42v43m23-40v43m24-39v43" /></g>
    <g fill="#46304f"><path d="m3 341 4-9 4 9Zm22-5 4-9 4 9Zm23-4 4-9 4 9Zm24 0 4-9 4 9Zm23 3 4-9 4 9Zm24 4 4-9 4 9Z" /></g>
    <path d="m310 371 3-16 6 12 6-17 2 18m-269 9 3-11 4 10 8-14 1 17m341 1 5-18 3 14 7-8 1 14" stroke="#67516a" strokeWidth="3" />
  </svg>;
}

function GhostGrove() {
  return <svg className="scenery-edge scenery-edge-right scenery-graveyard" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" fill="none" aria-hidden="true" focusable="false">
    <path d="M0 376Q154 336 233 350t187-22v62H0Z" fill="#292036" />
    <g stroke="#362a43" strokeLinecap="round" strokeLinejoin="round">
      <path d="M329 367 306 305l3-87-25-65 13-57-3-45" strokeWidth="15" />
      <path d="m310 249-55-54-27-13-12-28m42 44-13-57 9-33m34 61 55-40 20-39m-42 56 4-60-17-23m1 227 54-54 8-53m-4 34 30-26 9-30m-75-37 27-17 16-36" strokeWidth="8" />
      <path d="m231 183-38-6-18-18m72-11-22-16-2-24m117 26 22 2 19-16m-55-32 18-22m53 139 15 0m-120-107-15-21 4-29" strokeWidth="4" />
    </g>
    <g fill="#514055" stroke="#705972" strokeWidth="2">
      <path d="m164 367-6-61q-1-25 21-27 23-1 25 24l4 61Z" />
      <path d="m222 363 5-44h-12l1-16 12 1 2-18 17 1-2 18 14 1-1 16-14-1-5 44Z" />
      <path d="m69 374 1-38q1-15 16-15 17 0 17 17l-1 33Z" />
      <path d="m351 365-2-37q-1-14 14-15 15 0 16 14l3 34Z" />
    </g>
    <g stroke="#b29bb1" strokeWidth="2" opacity=".3"><path d="m171 304 21-2m-20 8 15-1m-92 28h13m-13 6h9m266-14 12-1" /></g>
    <g stroke="#493650" strokeWidth="3"><path d="M109 348q76-17 151-10m-152 29q77-17 151-10M115 337v40m23-45v40m24-43v40m24-42v40m24-40v40m24-39v40m24-38v40" /></g>
    <g fill="#493650"><path d="m111 338 4-10 4 10Zm23-5 4-10 4 10Zm24-3 4-10 4 10Zm24-2 4-10 4 10Zm24 0 4-10 4 10Zm24 1 4-10 4 10Zm24 2 4-10 4 10Z" /></g>
    <path d="m19 380 5-19 3 14 8-9 1 12m268-5 4-15 4 11 7-16 1 18m80-16 2-12 4 8 6-13" stroke="#68506c" strokeWidth="3" />
    <path d="m133 106 9-5 9 5-9-2Zm43-49 11-6 11 6-11-2Zm-44 4 7-4 7 4-7-1Z" fill="#645071" />
  </svg>;
}

function MountainCave() {
  return <svg className="scenery-edge scenery-edge-left scenery-cave" viewBox="0 0 460 390" preserveAspectRatio="xMinYMax meet" fill="none" aria-hidden="true" focusable="false">
    <path d="m0 368 0-161 45-39 43-17 50 5 58 43 32 70 55 89 55 32H0Z" fill="#514133" />
    <path d="m0 209 56-28 55-14-33 73-43 35L0 293Z" fill="#62513b" />
    <path d="m114 168 68 48 10 60 45 81-56-14-33-95-44-24Z" fill="#65523b" />
    <path d="M38 360V277l22-41 36-20 39 13 27 43 19 92Z" fill="#261f18" />
    <path d="m38 360 7-74 18-39 30-16 32 5-29 9-21 31-10 86Z" fill="#362b20" />
    <path d="M57 356h108l-25-25-26-9-32 7Z" fill="#181710" />
    <path d="m18 245 28-3 16-15m-37 86 14 9m121-62 20-15 13 3m-3 50 18 4 7 19M65 189l8 13 14 3" stroke="#9b8054" strokeWidth="3" opacity=".35" />
    <g stroke="#6d653e" strokeWidth="5" strokeLinecap="round"><path d="M34 195V97m186 178V147m46 159V206" /></g>
    <g fill="#3c4a35"><path d="m3 157 30-72 34 73H48l25 29H0l24-30Zm191 39 21-63 29 64h-15l23 28h-68l23-29Zm49 47 20-48 23 48h-11l18 23h-56l18-23Z" /></g>
    <g fill="#516043"><path d="m16 144 17-42 4 40Zm191 40 8-34 6 34Zm49 47 8-27 4 28Z" /></g>
    <path d="M0 376q110-33 219-17t241 17v14H0Z" fill="#4c442d" />
    <g fill="#786442" stroke="#a38652" strokeWidth="1.5"><path d="m170 374 6-19 21-7 18 10 4 18Zm79-6 7-16 21 1 11 14Zm-238 6 4-12 17-5 13 17Z" /><path d="m310 382 9-15 20 3 5 12Z" /></g>
    <g stroke="#7b8350" strokeWidth="3"><path d="m227 374 1-20 6 14 7-22 0 27m-190 5 4-24 5 16 8-12 0 18m274 10 6-20 3 13 8-7m-199-6 3-17 5 12 7-9" /></g>
    <g fill="#ada36b"><ellipse cx="115" cy="372" rx="7" ry="2" /><ellipse cx="281" cy="382" rx="6" ry="2" /><ellipse cx="225" cy="382" rx="3" ry="2" /></g>
  </svg>;
}

function PineGrove() {
  return <svg className="scenery-edge scenery-edge-right scenery-pines" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" fill="none" aria-hidden="true" focusable="false">
    <path d="m177 379 34-45 51-19 39 10 44-9 75 41v33H145Z" fill="#524731" />
    <g fill="#3a4530"><path d="m222 271 25-56 29 57h-14l26 32h-76l26-32ZM99 323l24-58 27 58h-13l23 26H86l24-26Z" /></g>
    <g stroke="#776044" strokeWidth="7" strokeLinecap="round"><path d="M327 364V92m-67 265V179m113 153V163m-250 194v-65" /></g>
    <path d="m272 211 54-131 62 132h-32l46 48h-45l51 56H247l49-56h-41l43-49Z" fill="#41513b" />
    <path d="m231 256 29-79 36 79h-18l29 34h-83l22-34Zm112-24 28-78 37 78h-16l28 36h-88l28-36Z" fill="#495c41" />
    <path d="m295 193 31-93 9 91Zm-19 51 48-41 11 40Zm-5 56 52-42 12 41m-92-55 17-50 5 50m91-26 16-47 7 47" fill="#66754b" opacity=".45" />
    <path d="M0 382q100-33 194-9t226-25v42H0Z" fill="#4c442d" />
    <g fill="#746245" stroke="#99815b" strokeWidth="2"><path d="m204 374 12-30 30-11 32 14 8 24-43 8Zm87-12 10-21 24-2 26 20-12 13Zm65 1 9-10 18 1 12 10Z" /></g>
    <path d="m218 347 24 8 25-6m-24 6-1 20m66-30 13 12 13 1" stroke="#ae9361" strokeWidth="2" opacity=".4" />
    <g stroke="#79844f" strokeWidth="3"><path d="m184 380 4-25 5 16 10-18-2 23m155-4 3-20 7 15 9-18-2 19m-284 19 4-18 3 12 9-16m-71 25 5-19 4 16 8-10" /></g>
    <g fill="#9aab73"><ellipse cx="168" cy="377" rx="4" ry="2" /><ellipse cx="313" cy="380" rx="6" ry="2" /><ellipse cx="390" cy="372" rx="5" ry="2" /></g>
  </svg>;
}

function LighthouseCove() {
  return <svg className="scenery-edge scenery-edge-left scenery-lighthouse" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" fill="none" aria-hidden="true" focusable="false">
    <path d="M0 370V250l38-30 52 8 44 40 30 58 46 30 40 14H0Z" fill="#1b2c40" />
    <path d="m0 262 40-26 48 6-26 30-38 8L0 296Z" fill="#24405a" />
    <path d="m88 242 42 34 26 52-38-18-20-38Z" fill="#203952" />
    <g stroke="#3d6688" strokeWidth="2" opacity=".5"><path d="m14 268 22-10 18 6m40 8 18 14 10 22M30 318l20 6" /></g>
    <path d="M58 236 68 92h40l10 144Z" fill="#7d93a8" opacity=".62" />
    <g fill="#8c4256" opacity=".7"><path d="M66 120h44l1.6 22H64.6ZM63 172h50l1.7 24H61.3Z" /></g>
    <path d="M62 94h52l-4-10H66Z" fill="#253b52" />
    <path d="M70 84V62h36v22Z" fill="#203347" stroke="#4d7899" strokeWidth="2" />
    <path className="scenery-beacon-core" d="M76 66h24v16H76Z" fill="#ffe8a3" />
    <path d="m64 62 24-20 24 20Z" fill="#c4566a" />
    <path d="M88 42v-8" stroke="#4d7899" strokeWidth="3" />
    <path className="scenery-beacon" d="M100 74 440 30v90L100 76Z" fill="url(#beacon-fade)" />
    <path d="M78 236v-24q0-10 10-10t10 10v24" fill="#14273a" />
    <defs><linearGradient id="beacon-fade" x1="100" x2="440" y1="0" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#ffe8a3" stopOpacity=".32" /><stop offset="1" stopColor="#ffe8a3" stopOpacity="0" /></linearGradient></defs>
    <path className="scenery-wave" d="M0 352q28-12 56 0t56 0 56 0 56 0 56 0 56 0 56 0 52 0v38H0Z" fill="#1d4b6b" opacity=".75" />
    <path className="scenery-wave scenery-wave-late" d="M0 370q30-10 60 0t60 0 60 0 60 0 60 0 60 0 60 0 40 0v20H0Z" fill="#256489" opacity=".7" />
    <g stroke="#8fd0ef" strokeWidth="2" opacity=".35" strokeLinecap="round"><path d="M26 349q14-5 28 0m110 2q14-5 28 0m94-1q12-5 24 0m-180 18q12-4 24 0" /></g>
    <g fill="#e9d7b4" opacity=".55"><ellipse cx="236" cy="381" rx="16" ry="3" /><ellipse cx="330" cy="384" rx="11" ry="2.5" /></g>
  </svg>;
}

function TidePools() {
  return <svg className="scenery-edge scenery-edge-right scenery-tidepools" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" fill="none" aria-hidden="true" focusable="false">
    <path d="M150 390q20-38 70-46t96-34 104-12v92Z" fill="#1a2b3f" />
    <g stroke="#6a5a3e" strokeWidth="9" strokeLinecap="round"><path d="M332 336q-6-90 22-180" /></g>
    <g fill="#2d6a52"><path d="M354 156q-56-14-92 20 46-10 92-20Zm0 0q-24-50-80-56 44 22 80 56Zm0 0q30-46 84-46-52 18-84 46Zm0 0q52-6 82 30-40-24-82-30Zm0 0q-6-56 26-92-14 46-26 92Z" /></g>
    <g fill="#3f8a67" opacity=".7"><path d="M354 156q-40-6-66 8 34-2 66-8Zm0 0q22-28 56-30-30 12-56 30Z" /></g>
    <path d="M196 390q8-40 44-48t50 8 26 40Z" fill="#24405a" />
    <path d="m254 352 22-18 30 8" stroke="#3d6688" strokeWidth="2" opacity=".5" />
    <g fill="#e07b8f" opacity=".75"><path d="m226 364 5-12 5 12-5-3Zm16 6 4-9 4 9-4-2Zm-30 4 3-8 3 8-3-2Z" /></g>
    <path d="m380 374 10-7 10 7-4 9h-12Z" fill="#f2a65a" opacity=".8" />
    <path className="scenery-wave" d="M120 366q26-10 52 0t52 0 52 0 52 0 52 0 40 0v24H120Z" fill="#1d4b6b" opacity=".75" />
    <path className="scenery-wave scenery-wave-late" d="M80 378q28-8 56 0t56 0 56 0 56 0 56 0 60 0v12H80Z" fill="#256489" opacity=".7" />
    <g stroke="#8fd0ef" strokeWidth="2" opacity=".35" strokeLinecap="round"><path d="M150 364q12-4 24 0m80 1q12-4 24 0m70-2q12-4 24 0" /></g>
  </svg>;
}

function Caldera() {
  return <svg className="scenery-edge scenery-edge-left scenery-caldera" viewBox="0 0 460 390" preserveAspectRatio="xMinYMax meet" fill="none" aria-hidden="true" focusable="false">
    <path d="M0 390V230l64-82 40-30h52l40 34 70 110 60 74 60 54Z" fill="#2a1714" />
    <path d="m104 118 52 0-14 20h-26Z" fill="#ff7a3c" opacity=".55" />
    <path className="scenery-lava-glow" d="M104 118h52l-6 8h-40Z" fill="#ffc35c" />
    <path d="m0 240 60-76 34 6-42 70-52 34Z" fill="#3a1f19" />
    <path d="m160 150 40 30 54 92 40 62-38-20-46-80-34-40Z" fill="#371d18" />
    <path className="scenery-lava-flow" d="m130 136 8 38-14 40 22 44-6 46 28 40 30 46" stroke="#ff6a2a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity=".7" />
    <path d="m130 136 8 38-14 40 22 44-6 46 28 40 30 46" stroke="#ffd36b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".55" />
    <g stroke="#ff8a4c" strokeWidth="2" opacity=".4"><path d="m30 270 22 10 10 22m130-44 18 6m-120 70 16 10" /></g>
    <g className="scenery-smoke" fill="#4a3330" opacity=".5"><circle cx="122" cy="92" r="16" /><circle cx="140" cy="70" r="20" /><circle cx="118" cy="46" r="24" /></g>
    <path d="M0 378q90-22 180-10t160 4 120 6v12H0Z" fill="#1d100d" />
    <g fill="#3b2420" stroke="#5c3a2c" strokeWidth="2"><path d="m206 376 10-24 26-6 18 14 4 16Zm-180 2 8-16 20-2 12 18Z" /></g>
    <g stroke="#ff7a3c" strokeWidth="2" opacity=".55"><path d="m214 368 12-8 10 2m-188 6 10-6" /></g>
  </svg>;
}

function ObsidianSpires() {
  return <svg className="scenery-edge scenery-edge-right scenery-spires" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" fill="none" aria-hidden="true" focusable="false">
    <path d="M150 390q40-40 100-44t170-28v72Z" fill="#241412" />
    <g fill="#2f1a17" stroke="#4d2c22" strokeWidth="2" strokeLinejoin="round">
      <path d="m300 352 18-200 22-26 18 30 10 196Z" />
      <path d="m240 360 14-120 18-16 14 20 6 116Z" />
      <path d="m364 352 8-136 16-14 14 18 18 132Z" />
    </g>
    <g className="scenery-lava-glow" stroke="#ff7a3c" strokeWidth="2.5" strokeLinecap="round" opacity=".7"><path d="m326 180 4 40-6 30 8 34m-62-32 2 30-4 22m120-54-4 34 6 26" /></g>
    <path d="m318 152 22-26 18 30-20-14Z" fill="#5c3a2c" />
    <path d="M178 390q20-26 60-28t80 0 102-10v38Z" fill="#1d100d" />
    <path className="scenery-lava-pool" d="M206 382q40-12 88-6t60 6q-60 8-148 0Z" fill="#ff6a2a" opacity=".55" />
    <path d="M226 380q30-6 64-2" stroke="#ffd36b" strokeWidth="2" strokeLinecap="round" opacity=".6" />
    <g stroke="#6b4a3a" strokeWidth="3"><path d="m196 372 3-14 4 10 6-12 1 16m180-8 4-16 4 12" /></g>
  </svg>;
}

function GreatTree() {
  return <svg className="scenery-edge scenery-edge-left scenery-greattree" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" fill="none" aria-hidden="true" focusable="false">
    <path d="M0 390V300q60-26 130-14t140 40 120 64Z" fill="#172a1c" />
    <path d="M62 372q10-74 6-150-2-40 14-70h44q14 30 10 72-4 78 14 148Z" fill="#2c2418" />
    <path d="M86 372q4-50 0-92-3-30 12-50" stroke="#3b301f" strokeWidth="6" strokeLinecap="round" />
    <path d="M82 372q8-30 20-38t22 6 10 32Z" fill="#120f0a" />
    <g fill="#1f3d27"><circle cx="40" cy="132" r="64" /><circle cx="118" cy="96" r="74" /><circle cx="196" cy="142" r="58" /><circle cx="96" cy="170" r="50" /></g>
    <g fill="#2a5233"><circle cx="70" cy="110" r="44" /><circle cx="140" cy="76" r="48" /><circle cx="196" cy="128" r="34" /></g>
    <g fill="#3b6e40" opacity=".6"><circle cx="128" cy="62" r="22" /><circle cx="70" cy="96" r="18" /><circle cx="196" cy="116" r="14" /></g>
    <g stroke="#3b301f" strokeWidth="7" strokeLinecap="round"><path d="M68 360q-30 6-52 24m110-20q26 2 44 22" /></g>
    <g fill="#d96b6b"><path d="M150 382q0-14 12-14t12 14Z" /><path d="M186 384q0-10 9-10t9 10Z" /></g>
    <g fill="#f2e3c6"><circle cx="157" cy="375" r="2" /><circle cx="166" cy="372" r="1.6" /><circle cx="194" cy="378" r="1.5" /></g>
    <g stroke="#e9dfc4" strokeWidth="3"><path d="M162 382v8m33-6v6" /></g>
    <g stroke="#4f8a4a" strokeWidth="3" strokeLinecap="round"><path d="m226 384 4-20 5 14 7-18 1 24m-210 0 3-16 4 10 6-14" /></g>
  </svg>;
}

function FlowerMeadow() {
  return <svg className="scenery-edge scenery-edge-right scenery-meadow" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" fill="none" aria-hidden="true" focusable="false">
    <path d="M120 390q60-50 150-56t150-30v86Z" fill="#172a1c" />
    <g fill="#1f3d27"><path d="m300 330 34-120 36 120Zm-70 20 26-90 28 90Zm150-20 20-80 20 80Z" /></g>
    <g fill="#2a5233"><path d="m316 290 18-70 20 70Zm-74 30 14-50 16 50Z" /></g>
    <g stroke="#3f7a44" strokeWidth="3" strokeLinecap="round">
      <path d="M180 384q-2-30 10-52m30 52q4-26-6-46m-62 46q0-22-12-38m200 38q2-28-8-48m40 48q-2-18 8-34" />
    </g>
    <g fill="#4f9a52"><path d="M186 350q-18-8-24 4 14 2 24-4Zm28 6q16-12 26-2-14 6-26 2Zm154-6q-14-10-22 2 12 2 22-2Z" /></g>
    <g className="scenery-flowers">
      <g fill="#f2c94c"><circle cx="190" cy="330" r="6" /><circle cx="340" cy="334" r="5" /></g>
      <g fill="#f28fb1"><circle cx="214" cy="336" r="5" /><circle cx="148" cy="344" r="4.5" /><circle cx="382" cy="348" r="4.5" /></g>
      <g fill="#fff6e0"><circle cx="190" cy="330" r="2" /><circle cx="214" cy="336" r="1.8" /><circle cx="340" cy="334" r="1.8" /><circle cx="148" cy="344" r="1.6" /><circle cx="382" cy="348" r="1.6" /></g>
    </g>
    <path d="M100 390q80-20 170-16t150-8v24Z" fill="#12210f" />
  </svg>;
}

type Scene = {
  /** Distant layers, drawn across the full width behind the edge scenes. */
  distance: ReactNode;
  celestial: { glow: string; core: string; coreOpacity: string; kind: "moon" | "sun" };
  edges: ReactNode;
  particle: "firefly" | "dust" | "bubble" | "ember" | "leaf";
};

const SCENES: Record<PokemonTheme, Scene> = {
  gengar: {
    distance: <>
      <path d="M0 669Q180 590 352 673t352 35 380-9 516-77v278H0Z" fill="#251d36" opacity=".45" />
      <path d="M0 783Q142 720 321 769t375 20 453-8 451-42v161H0Z" fill="#32223f" opacity=".4" />
    </>,
    celestial: { glow: "#b9a2d9", core: "#cbbddd", coreOpacity: ".38", kind: "moon" },
    edges: <><HauntedManor /><GhostGrove /></>,
    particle: "firefly",
  },
  gible: {
    distance: <>
      <path d="m0 640 186-322 172 292 186-227 189 290 194-236 163 176 175-325 335 363v249H0Z" fill="#64503b" opacity=".35" />
      <path d="m127 420 59-102 61 105-46-29-21 20-13-26Zm363 28 54-65 54 82-48-31-20 9Zm701-46 74-114 92 99-58-25-33-28-34 56Z" fill="#c8b089" opacity=".1" />
      <path d="m0 755 116-167 154 179 217-165 209 159 231-128 255 131 194-222 224 183v175H0Z" fill="#48503b" opacity=".4" />
      <path d="M0 831Q300 766 535 837t521-3 544-36v102H0Z" fill="#665331" opacity=".4" />
    </>,
    celestial: { glow: "#deb568", core: "#c49a56", coreOpacity: ".2", kind: "sun" },
    edges: <><MountainCave /><PineGrove /></>,
    particle: "dust",
  },
  piplup: {
    distance: <>
      <path d="M0 640h1600v260H0Z" fill="#163650" opacity=".35" />
      <path d="M0 640q200-8 400 0t400 0 400 0 400 0" stroke="#7fc4ea" strokeWidth="2" opacity=".18" />
      <path d="M0 700q120-18 240 0t240 0 240 0 240 0 240 0 240 0 160 0v200H0Z" fill="#1a4361" opacity=".4" />
      <path d="M0 790q100-16 200 0t200 0 200 0 200 0 200 0 200 0 200 0 200 0v110H0Z" fill="#1f5378" opacity=".35" />
      <path d="M560 646h480" stroke="#e7f3ff" strokeWidth="3" opacity=".08" />
    </>,
    celestial: { glow: "#9fd4f2", core: "#d9eefb", coreOpacity: ".34", kind: "moon" },
    edges: <><LighthouseCove /><TidePools /></>,
    particle: "bubble",
  },
  charmander: {
    distance: <>
      <path d="m0 650 140-180 120 120 160-230 170 220 150-140 190 210 170-260 200 240 300-130v400H0Z" fill="#3a1a14" opacity=".55" />
      <path d="m420 360 20 30 22-10m490-100 24 34 20-14" stroke="#ff7a3c" strokeWidth="4" opacity=".25" />
      <path d="m0 770 200-90 220 110 240-120 260 120 220-90 260 100 200-60v160H0Z" fill="#2a1410" opacity=".55" />
      <path d="M0 860q400-40 800 0t800 0v40H0Z" fill="#ff6a2a" opacity=".08" />
    </>,
    celestial: { glow: "#ff8a4c", core: "#ff6a3a", coreOpacity: ".3", kind: "sun" },
    edges: <><Caldera /><ObsidianSpires /></>,
    particle: "ember",
  },
  bulbasaur: {
    distance: <>
      <path d="M0 640q200-80 400-30t400-20 400 10 400-40v340H0Z" fill="#1e3a24" opacity=".45" />
      <g fill="#1a3320" opacity=".55"><path d="m180 620 24-80 26 80Zm60 6 18-60 20 60Zm900-30 26-90 28 90Zm70 10 20-64 22 64Zm-560 20 20-70 22 70Z" /></g>
      <path d="M0 770q160-50 360-10t420-10 420 20 400-30v160H0Z" fill="#244a2b" opacity=".45" />
      <path d="M0 850q300-30 600 0t600 0 400-10v60H0Z" fill="#2f5d33" opacity=".35" />
    </>,
    celestial: { glow: "#ffe6a0", core: "#fff1c4", coreOpacity: ".22", kind: "sun" },
    edges: <><GreatTree /><FlowerMeadow /></>,
    particle: "leaf",
  },
};

const PARTICLES = [[4, 39], [8, 72], [13, 91], [91, 35], [95, 65], [88, 87], [35, 95], [73, 93]];

export function PokemonScenery({ theme }: SceneryProps) {
  const { distance, celestial, edges, particle } = SCENES[theme];
  return <div className={`habitat-scenery scenery-${theme}`} aria-hidden="true">
    <svg className="scenery-distance" viewBox="0 0 1600 900" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">{distance}</svg>
    <svg className={`scenery-celestial scenery-${celestial.kind}`} viewBox="0 0 160 160" fill="none" aria-hidden="true" focusable="false">
      <circle cx="80" cy="80" r="79" fill={celestial.glow} opacity=".035" />
      <circle cx="80" cy="80" r="64" fill={celestial.glow} opacity=".055" />
      <circle cx="80" cy="80" r="43" fill={celestial.core} opacity={celestial.coreOpacity} />
      {theme === "gengar" && <g fill="#8d79a8" opacity=".28"><circle cx="65" cy="65" r="10" /><circle cx="90" cy="95" r="12" /><circle cx="95" cy="59" r="5" /></g>}
      {theme === "piplup" && <g fill="#9cc4de" opacity=".3"><circle cx="66" cy="70" r="8" /><circle cx="94" cy="92" r="6" /></g>}
    </svg>
    {edges}
    <div className="scenery-ground-line" />
    <div className="scenery-mist scenery-mist-first" /><div className="scenery-mist scenery-mist-second" />
    {PARTICLES.map(([left, top], i) => <i key={i} className={`scenery-${particle}`} style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${-i * 1.7}s`, animationDuration: `${7 + i % 4 * 2}s` }} />)}
  </div>;
}
