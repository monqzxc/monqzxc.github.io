import type { PokemonTheme } from "@/lib/pokemon-roster";
import type { Scene } from "./pokemon-scenery";

// Edge scenes for the thirteen habitats added after the original five. Left scenes sit in a
// 440×390 box anchored bottom-left, right scenes in 420×390 anchored bottom-right, like the
// originals in pokemon-scenery.tsx. Colours stay dim: the page reads on top of them.

const svgProps = { fill: "none", "aria-hidden": true, focusable: false } as const;

// ── Normal: Sunny pasture ────────────────────────────────────────────────
function Windmill() {
  return <svg className="scenery-edge scenery-edge-left scenery-windmill" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" {...svgProps}>
    <path d="M0 390V300q90-40 200-26t240 70v46Z" fill="#3a3326" />
    <path d="M70 330 86 160h44l16 170Z" fill="#5c4f3d" stroke="#776650" strokeWidth="2" />
    <path d="m80 162 28-32 28 32Z" fill="#6d4a3a" />
    <path d="M100 330v-34q0-10 8-10t8 10v34" fill="#2a241b" />
    <g className="scenery-sails" stroke="#8a7a62" strokeWidth="3" strokeLinecap="round">
      <path d="M108 160 52 104m56 56 56-56m-56 56-56 56m56-56 56 56" />
      <g fill="#c9b994" opacity=".55" stroke="none"><path d="m60 98 18-6 30 30-12 16Zm96-6 18 6-34 40-12-12ZM56 222l-6-18 46-30 12 12Zm112-12-6 18-40-34 12-12Z" /></g>
    </g>
    <circle cx="108" cy="160" r="6" fill="#4a3f30" />
    <path d="M180 340v-46l40-30 40 30v46Z" fill="#4a3f30" stroke="#6b5c46" strokeWidth="2" />
    <path d="m172 296 48-40 48 40" stroke="#8a4a3a" strokeWidth="7" strokeLinejoin="round" />
    <path d="M206 310h14v16h-14Zm24 0h14v16h-14Z" className="scenery-window-light" fill="#e8c88a" opacity=".6" />
    <g stroke="#6b5c46" strokeWidth="3"><path d="M270 352h150M276 340v20m30-20v20m30-20v20m30-20v20m30-20v20" /></g>
    <g stroke="#7c8f52" strokeWidth="3" strokeLinecap="round"><path d="m30 384 3-14 4 10 6-12 1 16m240-2 4-16 5 12 6-10" /></g>
    <g fill="#f2e3c6"><circle cx="150" cy="362" r="2.5" /><circle cx="330" cy="374" r="2" /><circle cx="60" cy="368" r="2" /></g>
  </svg>;
}

function HayField() {
  return <svg className="scenery-edge scenery-edge-right scenery-hayfield" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" {...svgProps}>
    <path d="M110 390q60-56 160-60t150-20v80Z" fill="#3a3326" />
    <path d="M330 320q-4-80 8-140" stroke="#4f3f2c" strokeWidth="12" strokeLinecap="round" />
    <g fill="#3f5a32"><circle cx="338" cy="160" r="52" /><circle cx="298" cy="190" r="36" /><circle cx="378" cy="196" r="38" /></g>
    <g fill="#51703c" opacity=".7"><circle cx="330" cy="146" r="28" /><circle cx="374" cy="180" r="18" /></g>
    <path d="M180 360q0-46 40-48t40 48Z" fill="#a8894f" opacity=".75" />
    <path d="M188 340q32-6 64 0m-60-14q28-6 56 0" stroke="#c9ab6a" strokeWidth="2" opacity=".6" />
    <path d="M250 368q0-30 26-32t26 32Z" fill="#9c7f48" opacity=".7" />
    <g stroke="#5c4f3d" strokeWidth="3"><path d="M120 360h110M128 346v26m34-26v26m34-26v26" /></g>
    <g stroke="#7c8f52" strokeWidth="3" strokeLinecap="round"><path d="m150 384 4-18 4 12 6-14 1 20m200-4 3-14 5 10" /></g>
  </svg>;
}

// ── Electric: Thunder plateau ───────────────────────────────────────────
function Pylon() {
  return <svg className="scenery-edge scenery-edge-left scenery-pylon" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" {...svgProps}>
    <path d="M0 390V280l60-20 70 14 50 40 70 20 190 56Z" fill="#2c2a1c" />
    <g stroke="#5f5a3c" strokeWidth="3" strokeLinejoin="round">
      <path d="M70 330 104 70h12l34 260M84 220h52M78 270h64M92 160h36M98 112h24" />
      <path d="m84 220 52 50m-52 0 52-50m-44-60 36 60m-36 0 36-60m-30-48 24 48m-24 0 24-48" opacity=".7" />
      <path d="M62 112h96M70 160h80" />
    </g>
    <path d="M62 112q120 40 378 30M158 112q120 50 282 60M70 160q140 50 370 70" stroke="#7a7350" strokeWidth="1.5" opacity=".6" />
    <path className="scenery-bolt" d="m214 18-20 46h16l-24 50 40-60h-16l20-36Z" fill="#ffe36b" opacity="0" />
    <g fill="#3a3624" stroke="#5f5a3c" strokeWidth="2"><path d="m180 380 14-40 34-10 22 30 6 20Zm-150 4 10-24 26-4 14 28Z" /></g>
    <g stroke="#8f8a4a" strokeWidth="3" strokeLinecap="round"><path d="m280 384 4-16 4 12 6-12 1 16m-170 0 3-12 4 8" /></g>
  </svg>;
}

function StormMesa() {
  return <svg className="scenery-edge scenery-edge-right scenery-stormmesa" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" {...svgProps}>
    <path d="M140 390q40-40 110-44t170-20v64Z" fill="#2c2a1c" />
    <path d="M250 352 270 200h120l30 152Z" fill="#3a3624" stroke="#5f5a3c" strokeWidth="2" />
    <path d="M262 260h146M256 304h158" stroke="#5f5a3c" strokeWidth="2" opacity=".6" />
    <path d="M330 200v-60" stroke="#6f6a48" strokeWidth="4" />
    <circle className="scenery-beacon-core" cx="330" cy="136" r="5" fill="#ffe36b" />
    <g className="scenery-storm" fill="#3b3a30" opacity=".75"><circle cx="300" cy="70" r="30" /><circle cx="340" cy="56" r="38" /><circle cx="384" cy="74" r="30" /><path d="M270 80h150v24H270Z" /></g>
    <path className="scenery-bolt scenery-bolt-late" d="m352 104-14 34h12l-18 40 32-48h-12l14-26Z" fill="#ffe36b" opacity="0" />
    <g fill="#3a3624" stroke="#5f5a3c" strokeWidth="2"><path d="m170 380 10-22 24-4 16 26Z" /></g>
    <g stroke="#8f8a4a" strokeWidth="3" strokeLinecap="round"><path d="m214 384 4-16 4 12 6-12 1 16m150-4 3-12 4 8" /></g>
  </svg>;
}

// ── Ice: Aurora tundra ──────────────────────────────────────────────────
function Glacier() {
  return <svg className="scenery-edge scenery-edge-left scenery-glacier" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" {...svgProps}>
    <path d="M0 390V170l40-60 50 30 40-50 60 90 40 100 70 60 140 50Z" fill="#1d3442" />
    <path d="m40 110 50 30 40-50 18 28-30 6-28 30-36-16-26 40-28-10Z" fill="#cfeef7" opacity=".55" />
    <path d="m130 90 60 90-30-20-28 10Z" fill="#9fd6e8" opacity=".4" />
    <path d="M20 210 60 200l20 40m40-60 30 50 10 50m-130 20 50-10" stroke="#5aa6c4" strokeWidth="2" opacity=".5" />
    <path d="M60 330q40-50 90-40t60 50Z" fill="#14262f" />
    <path d="M0 360q120-30 240-10t200 30v10H0Z" fill="#d6eef5" opacity=".35" />
    <g fill="#e9f8fc" opacity=".5"><path d="m200 320 8-22 8 22Zm24 6 6-16 6 16Z" /></g>
    <g stroke="#bfe6f2" strokeWidth="2" opacity=".5"><path d="M90 168v28m-8-14h16M160 210v20m-6-10h12" /></g>
  </svg>;
}

function SnowPines() {
  return <svg className="scenery-edge scenery-edge-right scenery-snowpines" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" {...svgProps}>
    <path d="M120 390q60-50 150-54t150-26v80Z" fill="#1d3442" />
    <g fill="#244657"><path d="m300 330 36-170 40 170Zm-80 20 26-110 30 110Zm150-10 24-110 26 110Z" /></g>
    <g fill="#d6eef5" opacity=".55"><path d="m320 230 16-70 18 70-18-12Zm-90 50 16-40 14 40-14-8Zm150 0 14-40 16 40-16-8Zm-70-2 12 6 16-6m-100 40 10 4 14-4" /></g>
    <path d="M180 372q0-44 44-44t44 44Z" fill="#cfe8f0" opacity=".5" />
    <path d="M214 372v-16q0-10 10-10t10 10v16" fill="#14262f" />
    <path d="M196 352q28-6 56 0m-50-12q22-6 44 0" stroke="#8fc6d8" strokeWidth="1.5" opacity=".6" />
    <path d="M100 390q100-24 200-20t120-10v30Z" fill="#e2f3f8" opacity=".3" />
  </svg>;
}

// ── Fighting: Mountain dojo ─────────────────────────────────────────────
function Dojo() {
  return <svg className="scenery-edge scenery-edge-left scenery-dojo" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" {...svgProps}>
    <path d="M0 390V310q100-30 220-18t220 60v38Z" fill="#2e1d1a" />
    <path d="M40 320h220v-70H40Z" fill="#3e2722" stroke="#5c3a30" strokeWidth="2" />
    <path d="m14 252 136-58 136 58-20 6-116-46-116 46Z" fill="#6a2c26" />
    <path d="m60 200 90-50 90 50-16 4-74-38-74 38Z" fill="#7a332b" />
    <path d="m120 160 30-26 30 26" stroke="#7a332b" strokeWidth="6" />
    <path d="M52 250v70m196-70v70M100 250v70m100-70v70" stroke="#5c3a30" strokeWidth="5" />
    <path d="M128 320v-48h44v48" fill="#1c1210" />
    <path d="M60 266h30v24H60Zm150 0h30v24h-30Z" className="scenery-window-light" fill="#e8b36b" opacity=".55" />
    <path d="M134 224h32v18h-32Z" fill="#e8d8b0" opacity=".5" />
    <g stroke="#5c3a30" strokeWidth="4"><path d="M290 352h120M300 330h100M310 330v30m80-30v30" /></g>
    <g stroke="#7c8f52" strokeWidth="3" strokeLinecap="round"><path d="m20 384 3-14 4 10 6-12 1 16m260-2 4-14 4 10" /></g>
  </svg>;
}

function TrainingGround() {
  return <svg className="scenery-edge scenery-edge-right scenery-training" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" {...svgProps}>
    <path d="M140 390q50-44 130-48t150-24v72Z" fill="#2e1d1a" />
    <path d="M250 350V170m120 180V170" stroke="#5c3a30" strokeWidth="10" strokeLinecap="round" />
    <path d="M226 172h170m-160 26h150" stroke="#7a332b" strokeWidth="9" strokeLinecap="round" />
    <path d="M296 198v20h28v-20" fill="#e8d8b0" opacity=".4" />
    <path d="M190 360v-70" stroke="#5c3a30" strokeWidth="9" strokeLinecap="round" />
    <path d="M178 300h24m-26 24h28" stroke="#8a5a40" strokeWidth="6" strokeLinecap="round" />
    <g className="scenery-flowers" fill="#e89aa8" opacity=".55"><circle cx="352" cy="120" r="4" /><circle cx="372" cy="104" r="3" /><circle cx="338" cy="96" r="3" /></g>
    <path d="M400 70q-30 20-46 50m18-30q-16 6-30 4" stroke="#4a3028" strokeWidth="4" strokeLinecap="round" />
    <g stroke="#7c8f52" strokeWidth="3" strokeLinecap="round"><path d="m160 384 4-16 4 12 6-12 1 16m170-4 3-12 4 8" /></g>
  </svg>;
}

// ── Poison: Toxic marsh ─────────────────────────────────────────────────
function SludgeWorks() {
  return <svg className="scenery-edge scenery-edge-left scenery-sludgeworks" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" {...svgProps}>
    <path d="M0 390V300q90-30 190-20t250 80v30Z" fill="#231829" />
    <path d="M70 340q-6-120 10-200" stroke="#34253a" strokeWidth="14" strokeLinecap="round" />
    <path d="m78 220-40-40-10-30m50 20 36-50 6-30M80 170l-28-56" stroke="#34253a" strokeWidth="6" strokeLinecap="round" />
    <path d="M150 300v-90h40v-30h50" stroke="#4a3a52" strokeWidth="14" strokeLinejoin="round" />
    <path d="M226 168h28v24h-28Z" fill="#4a3a52" />
    <path className="scenery-drip" d="M184 300q0 18 6 26 6-8 6-26Z" fill="#9ae06a" opacity=".55" />
    <path className="scenery-lava-pool" d="M110 360q60-18 140-8t60 10q-80 14-200-2Z" fill="#7fbf4a" opacity=".2" />
    <g className="scenery-bubbles" stroke="#b4f08a" strokeWidth="1.5" opacity=".5"><circle cx="160" cy="352" r="5" /><circle cx="210" cy="348" r="3.5" /><circle cx="250" cy="356" r="4" /></g>
    <g fill="#6a3f7a"><path d="M30 372q0-12 12-12t12 12Zm280 6q0-10 10-10t10 10Z" /></g>
    <g fill="#c9a6e0" opacity=".5"><circle cx="38" cy="366" r="1.5" /><circle cx="46" cy="364" r="1.5" /><circle cx="320" cy="373" r="1.4" /></g>
  </svg>;
}

function Bog() {
  return <svg className="scenery-edge scenery-edge-right scenery-bog" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" {...svgProps}>
    <path d="M130 390q50-40 130-44t160-30v74Z" fill="#231829" />
    <path className="scenery-lava-pool" d="M180 380q70-20 160-14t70 14q-110 12-230 0Z" fill="#9a4fd0" opacity=".3" />
    <g className="scenery-bubbles" stroke="#d4a6f0" strokeWidth="1.5" opacity=".5"><circle cx="240" cy="374" r="5" /><circle cx="300" cy="370" r="3.5" /><circle cx="350" cy="376" r="4" /></g>
    <g stroke="#4a5a32" strokeWidth="3" strokeLinecap="round"><path d="M380 370q-4-60 6-110m-30 110q2-50-6-90m50 90q4-40 16-70m-140 70q-2-40 8-64" /></g>
    <g fill="#5c3a28"><rect x="381" y="250" width="10" height="26" rx="5" /><rect x="345" y="272" width="9" height="22" rx="4.5" /></g>
    <g fill="#7a3f8a"><path d="M196 352q0-22 22-22t22 22Z" /><path d="M256 360q0-14 14-14t14 14Z" /></g>
    <path d="M214 352v20m56-12v14" stroke="#c9b8a0" strokeWidth="5" />
    <g fill="#e9c8ff" opacity=".55"><circle cx="210" cy="340" r="2.5" /><circle cx="226" cy="338" r="2" /><circle cx="268" cy="352" r="1.8" /></g>
  </svg>;
}

// ── Flying: Cloud cliffs ────────────────────────────────────────────────
function NestCliff() {
  return <svg className="scenery-edge scenery-edge-left scenery-nestcliff" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" {...svgProps}>
    <path d="M0 390V120l50-30 50 20 30 60-10 80 30 60 40 80Z" fill="#26324a" />
    <path d="m50 90 50 20 30 60-26-40-34-14Z" fill="#33415c" />
    <path d="M20 180 60 170l30 30M30 260l40-6 30 40" stroke="#475a7a" strokeWidth="2" opacity=".6" />
    <path d="M100 116q-4-30 30-60" stroke="#3a3428" strokeWidth="5" strokeLinecap="round" />
    <path d="M78 118q22-12 46 0-4 12-24 12t-22-12Z" fill="#7a6040" />
    <path d="M82 116q20 6 38 0" stroke="#a88a5c" strokeWidth="2" />
    <g className="scenery-clouds" fill="#dfe8ff" opacity=".18"><ellipse cx="260" cy="300" rx="90" ry="22" /><ellipse cx="200" cy="320" rx="60" ry="16" /><ellipse cx="340" cy="330" rx="80" ry="18" /></g>
    <path d="M0 390q80-14 200-8t240 0v8Z" fill="#dfe8ff" opacity=".12" />
  </svg>;
}

function WindTree() {
  return <svg className="scenery-edge scenery-edge-right scenery-windtree" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" {...svgProps}>
    <path d="M200 390q30-40 100-60t120-30v90Z" fill="#26324a" />
    <path d="M360 310q-20-60-80-100" stroke="#3a3428" strokeWidth="10" strokeLinecap="round" />
    <path d="M300 226q-30-6-50-30m66 10q-6-26 6-50" stroke="#3a3428" strokeWidth="5" strokeLinecap="round" />
    <g fill="#3d5a52"><ellipse cx="248" cy="186" rx="44" ry="22" /><ellipse cx="300" cy="150" rx="40" ry="20" /><ellipse cx="210" cy="206" rx="30" ry="14" /></g>
    <g fill="#4f7468" opacity=".7"><ellipse cx="240" cy="180" rx="24" ry="10" /><ellipse cx="300" cy="144" rx="20" ry="8" /></g>
    <path d="M390 300v-80" stroke="#5c6a84" strokeWidth="3" />
    <path className="scenery-flowers" d="m390 222 -34 6 2 8 32-4Z" fill="#e8806a" opacity=".6" />
    <g className="scenery-clouds" fill="#dfe8ff" opacity=".18"><ellipse cx="160" cy="330" rx="100" ry="22" /><ellipse cx="260" cy="350" rx="80" ry="16" /></g>
  </svg>;
}

// ── Psychic: Astral garden ──────────────────────────────────────────────
function CrystalTemple() {
  return <svg className="scenery-edge scenery-edge-left scenery-temple" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" {...svgProps}>
    <path d="M0 390V320q120-26 240-14t200 54v30Z" fill="#251526" />
    <path d="M30 330h240v-14H30Zm10-14h220v-10H40Z" fill="#3a2440" />
    <path d="M60 306V170m60 136V170m60 136V170m60 136V170" stroke="#4e3256" strokeWidth="16" />
    <path d="M30 170h240l-120-56Z" fill="#432a4b" stroke="#6a4472" strokeWidth="2" />
    <circle cx="150" cy="150" r="10" fill="#ff86ba" opacity=".45" className="scenery-window-light" />
    <g className="scenery-crystals" fill="#c9a6ff" opacity=".45"><path d="m320 300 12-40 12 40-12 10Zm40 20 8-28 8 28-8 6Z" /></g>
    <g fill="#ff9ac8" opacity=".55"><path d="M90 360q14-16 28 0-14 8-28 0Zm110 6q12-14 24 0-12 7-24 0Z" /></g>
    <g stroke="#7a5a8a" strokeWidth="2" opacity=".4"><path d="M60 200v60m60-60v60m60-60v60m60-60v60" /></g>
  </svg>;
}

function FloatingCrystals() {
  return <svg className="scenery-edge scenery-edge-right scenery-floatcrystals" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" {...svgProps}>
    <path d="M150 390q50-40 130-44t140-26v70Z" fill="#251526" />
    <g className="scenery-crystals">
      <path d="m320 150 22-50 22 50-22 30Z" fill="#b8a4ff" opacity=".45" />
      <path d="m250 210 14-32 14 32-14 20Z" fill="#ff86ba" opacity=".4" />
      <path d="m370 230 10-24 10 24-10 14Z" fill="#8fe3a8" opacity=".35" />
    </g>
    <path d="M300 340q-2-30 12-46l20 0q14 16 12 46Z" fill="#3a2440" />
    <g fill="#ff9ac8" opacity=".5"><path d="M322 294q-20-20 0-40 20 20 0 40Z" /><path d="M322 294q-30-6-34-26 22 0 34 26Zm0 0q30-6 34-26-22 0-34 26Z" /></g>
    <g fill="#f6e6ff" opacity=".6"><circle cx="210" cy="120" r="1.5" /><circle cx="390" cy="90" r="2" /><circle cx="280" cy="70" r="1.5" /></g>
  </svg>;
}

// ── Bug: Bramble thicket ────────────────────────────────────────────────
function HollowLog() {
  return <svg className="scenery-edge scenery-edge-left scenery-hollowlog" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" {...svgProps}>
    <path d="M0 390V320q100-30 230-20t210 60v30Z" fill="#1c2312" />
    <path d="M0 360V290q120-30 220-10l10 70q-120-10-230 10Z" fill="#4a3a24" />
    <ellipse cx="225" cy="315" rx="22" ry="36" fill="#5c4a2e" />
    <ellipse cx="225" cy="315" rx="14" ry="26" fill="#1a140c" />
    <path d="M20 300q60-10 120-6m-120 30q70-8 150-4" stroke="#6a5434" strokeWidth="2" opacity=".6" />
    <g fill="#5f7a32"><path d="M40 292q20-16 40 0Zm80-6q16-12 32 0Z" /></g>
    <g fill="#d9604e"><path d="M120 382q0-16 14-16t14 16Zm40 2q0-10 10-10t10 10Z" /></g>
    <path d="M134 382v8m36-6v6" stroke="#e8d8b0" strokeWidth="4" />
    <g fill="#f2e3c6" opacity=".7"><circle cx="128" cy="374" r="1.8" /><circle cx="140" cy="372" r="1.4" /></g>
    <path d="M60 220q-30 50 0 100m40-120q40 40 20 100" stroke="#4f6a2a" strokeWidth="4" strokeLinecap="round" />
    <g fill="#6f8f3a"><path d="M52 250q-14-6-18-18 12 2 18 18Zm62-10q14-8 16-20-12 4-16 20Z" /></g>
  </svg>;
}

function GiantGrass() {
  return <svg className="scenery-edge scenery-edge-right scenery-giantgrass" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" {...svgProps}>
    <path d="M140 390q50-46 130-50t150-28v78Z" fill="#1c2312" />
    <g className="scenery-flowers" stroke="#4f6a2a" strokeWidth="6" strokeLinecap="round"><path d="M260 380q-10-120 30-220m40 220q10-140-20-260m70 260q0-90 30-150m-200 150q-20-70 10-120" /></g>
    <circle cx="288" cy="156" r="18" fill="#ffb35c" opacity=".55" />
    <circle cx="288" cy="156" r="7" fill="#7a5a28" />
    <path d="M320 140q30-30 60-20m-56 30q34-10 56 6m-54 6q30 10 44 30M350 120l12 40" stroke="#dfe6c8" strokeWidth="1" opacity=".35" />
    <g fill="#9ac84a" opacity=".5"><path d="M232 300q-20-10-24-28 18 6 24 28Zm140 30q18-12 20-30-16 8-20 30Z" /></g>
  </svg>;
}

// ── Rock: Boulder canyon ────────────────────────────────────────────────
function CanyonArch() {
  return <svg className="scenery-edge scenery-edge-left scenery-canyonarch" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" {...svgProps}>
    <path d="M0 390V140h70l10 40h50l20 80 30 40 20 90Z" fill="#4a3b2c" />
    <path d="M0 180h76m-76 60h110m-110 60h150" stroke="#6a563e" strokeWidth="6" opacity=".6" />
    <path d="M150 360V230q0-50 70-56t80 56v130h-30V250q-4-36-50-36t-46 36v110Z" fill="#5a4834" stroke="#7a6448" strokeWidth="2" />
    <path d="M150 260h150m-150 40h30m90 0h30" stroke="#7a6448" strokeWidth="3" opacity=".5" />
    <g fill="#6a563e" stroke="#8a7254" strokeWidth="2"><path d="m320 380 10-30 30-8 20 20 4 18Zm-300 0 8-20 22-4 12 24Z" /></g>
    <g stroke="#8a8a52" strokeWidth="3" strokeLinecap="round"><path d="m230 384 3-12 4 8 5-10 1 14" /></g>
  </svg>;
}

function Hoodoos() {
  return <svg className="scenery-edge scenery-edge-right scenery-hoodoos" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" {...svgProps}>
    <path d="M150 390q40-40 110-44t160-26v70Z" fill="#4a3b2c" />
    <path d="M300 350 290 180h40l-6 170Z" fill="#5a4834" />
    <ellipse cx="310" cy="176" rx="34" ry="16" fill="#6a563e" />
    <path d="M370 350 362 230h30l-2 120Z" fill="#5a4834" />
    <ellipse cx="377" cy="226" rx="26" ry="12" fill="#6a563e" />
    <path d="M296 220h30m-32 40h34m40 0h24" stroke="#7a6448" strokeWidth="3" opacity=".5" />
    <g fill="#6a563e" stroke="#8a7254" strokeWidth="2"><circle cx="230" cy="352" r="22" /><circle cx="256" cy="362" r="14" /><circle cx="208" cy="366" r="12" /></g>
    <path d="m220 340 10 6m16 12 8 2" stroke="#9a8262" strokeWidth="2" opacity=".6" />
  </svg>;
}

// ── Dragon: Waterfall shrine ────────────────────────────────────────────
function WaterfallCliff() {
  return <svg className="scenery-edge scenery-edge-left scenery-waterfall" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" {...svgProps}>
    <path d="M0 390V100l60-30 60 20 20 60-10 200 40 40Z" fill="#1d2140" />
    <path d="M120 120h60v240h-60Z" fill="#2c3570" opacity=".7" />
    <g className="scenery-falls" stroke="#9fe6f2" strokeWidth="3" opacity=".45"><path d="M130 120v240m16-240v240m16-240v240m12-240v240" strokeDasharray="18 14" /></g>
    <path d="M180 120h0l20 40 0 200h-20Z" fill="#1d2140" />
    <path d="M200 160q30 20 40 200H180Z" fill="#232850" />
    <path d="M60 370q80-26 180-14t90 34H60Z" fill="#2f4a7a" opacity=".6" />
    <g fill="#dff6ff" opacity=".35"><ellipse cx="150" cy="362" rx="40" ry="8" /></g>
    <path d="M20 140 50 130l20 30M20 240l40-10 20 30" stroke="#3c4680" strokeWidth="2" opacity=".6" />
  </svg>;
}

function ShrineGate() {
  return <svg className="scenery-edge scenery-edge-right scenery-shrinegate" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" {...svgProps}>
    <path d="M140 390q50-40 130-44t150-24v68Z" fill="#1d2140" />
    <path d="M260 350V200m110 150V200" stroke="#9a3a3a" strokeWidth="12" />
    <path d="M232 196q84-16 166 0l6-16q-88-18-178 0Z" fill="#a84444" />
    <path d="M250 226h130" stroke="#9a3a3a" strokeWidth="8" />
    <path d="M300 226v-26h30v26" fill="#e8d8a0" opacity=".35" />
    <g className="scenery-window-light"><path d="M190 340v-30m-8 0h16l-4-16h-8Z" stroke="#4a4a6a" strokeWidth="3" /><rect x="183" y="296" width="14" height="12" fill="#f2c46b" opacity=".6" /></g>
    <g fill="#3c4680" opacity=".6"><path d="M200 362h40v8h-40Zm140 0h40v8h-40Z" /></g>
  </svg>;
}

// ── Dark: Midnight ruins ────────────────────────────────────────────────
function BrokenColonnade() {
  return <svg className="scenery-edge scenery-edge-left scenery-colonnade" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" {...svgProps}>
    <path d="M0 390V320q110-24 230-14t210 54v30Z" fill="#14161f" />
    <path d="M40 330V160m70 170V200m70 130V140m70 190V250" stroke="#2a2d3c" strokeWidth="22" />
    <path d="M24 160h80l-6-14H30Zm140-20h80l-6-14h-68Zm-80 60h52" fill="#33374a" />
    <path d="M24 156h88m126-20h84" stroke="#3c4157" strokeWidth="6" />
    <path d="m240 250 22-12 6 14-20 8Z" fill="#33374a" />
    <path d="M40 200v100m70-60v80m70-150v150" stroke="#3c4157" strokeWidth="2" opacity=".5" />
    <g fill="#33374a" stroke="#3c4157" strokeWidth="2"><path d="m280 372 10-20 24-4 14 24Zm-200 6 14-16h22l6 18Z" /></g>
    <path d="m60 240 6 20m60 40 8 18" stroke="#f2c45c" strokeWidth="1" opacity=".25" />
    <g stroke="#3a4a32" strokeWidth="3" strokeLinecap="round"><path d="m200 384 3-12 4 8 5-10 1 14" /></g>
  </svg>;
}

function DeadTreeArch() {
  return <svg className="scenery-edge scenery-edge-right scenery-deadarch" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" {...svgProps}>
    <path d="M140 390q50-40 130-44t150-24v68Z" fill="#14161f" />
    <path d="M220 360V230q0-50 50-50t50 50v130h-22V240q-2-36-28-36t-28 36v120Z" fill="#2a2d3c" />
    <path d="M226 260h20m48 0h20" stroke="#3c4157" strokeWidth="3" />
    <path d="M380 350q-10-90 0-170" stroke="#22242f" strokeWidth="10" strokeLinecap="round" />
    <path d="m382 230-34-30-8-26m44 10 22-40m-24 100-30-10" stroke="#22242f" strokeWidth="5" strokeLinecap="round" />
    <g fill="#f2c45c" opacity=".5"><circle cx="352" cy="190" r="2" /><circle cx="360" cy="190" r="2" /></g>
    <g fill="#ff6b7a" opacity=".55"><circle cx="262" cy="232" r="1.6" /><circle cx="272" cy="232" r="1.6" /></g>
  </svg>;
}

// ── Steel: Iron foundry ─────────────────────────────────────────────────
function Foundry() {
  return <svg className="scenery-edge scenery-edge-left scenery-foundry" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" {...svgProps}>
    <path d="M0 390V330q120-20 240-10t200 40v30Z" fill="#1a1f23" />
    <path d="M20 330V210l60-30v30l60-30v30l60-30v150Z" fill="#2a3238" stroke="#3c464e" strokeWidth="2" />
    <path d="M220 330V120h30v210Zm40 0V150h24v180Z" fill="#2a3238" stroke="#3c464e" strokeWidth="2" />
    <g className="scenery-smoke" fill="#3c464e" opacity=".5"><circle cx="236" cy="100" r="14" /><circle cx="248" cy="78" r="18" /><circle cx="272" cy="134" r="10" /></g>
    <g className="scenery-window-light" fill="#f28a5c" opacity=".55"><path d="M40 240h20v24H40Zm40 0h20v24H80Zm40 0h20v24h-20Zm40 0h20v24h-20Z" /></g>
    <path d="M90 330v-40h40v40" fill="#121618" />
    <path className="scenery-lava-glow" d="M96 330v-30h28v30" fill="#f28a5c" opacity=".35" />
    <g stroke="#3c464e" strokeWidth="3"><path d="M300 340h130M310 340v-30h40v30" /></g>
  </svg>;
}

function Girders() {
  return <svg className="scenery-edge scenery-edge-right scenery-girders" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" {...svgProps}>
    <path d="M140 390q50-40 130-44t150-24v68Z" fill="#1a1f23" />
    <g stroke="#3c464e" strokeWidth="6"><path d="M300 350V140m80 210V140M300 180h80m-80 60h80m-80 60h80" /></g>
    <g stroke="#3c464e" strokeWidth="2.5" opacity=".7"><path d="m300 180 80 60m-80 0 80-60m-80 60 80 60m-80 0 80-60" /></g>
    <g className="scenery-gear"><circle cx="232" cy="300" r="34" fill="none" stroke="#4a565f" strokeWidth="10" strokeDasharray="10 8" /><circle cx="232" cy="300" r="22" fill="#2a3238" /><circle cx="232" cy="300" r="7" fill="#4a565f" /></g>
    <path d="M300 140h80" stroke="#6fb8e8" strokeWidth="2" opacity=".3" />
    <circle className="scenery-beacon-core" cx="340" cy="132" r="4" fill="#ff6b5a" />
  </svg>;
}

// ── Fairy: Candy garden ─────────────────────────────────────────────────
function MushroomCottage() {
  return <svg className="scenery-edge scenery-edge-left scenery-cottage" viewBox="0 0 440 390" preserveAspectRatio="xMinYMax meet" {...svgProps}>
    <path d="M0 390V320q110-28 230-16t210 56v30Z" fill="#2a1c28" />
    <path d="M80 330V230h120v100Z" fill="#e8d8c8" opacity=".35" />
    <path d="M40 240q0-110 100-110t100 110Z" fill="#c45a8a" opacity=".7" />
    <g fill="#fff0f6" opacity=".6"><circle cx="100" cy="180" r="12" /><circle cx="160" cy="166" r="9" /><circle cx="200" cy="210" r="8" /><circle cx="70" cy="220" r="7" /></g>
    <path d="M124 330v-36q0-14 16-14t16 14v36" fill="#2a1c28" />
    <circle cx="106" cy="268" r="10" className="scenery-window-light" fill="#ffe08a" opacity=".5" />
    <g className="scenery-flowers"><g fill="#9fd0ff" opacity=".6"><circle cx="250" cy="352" r="5" /><circle cx="300" cy="360" r="4" /></g><g fill="#ffb3dc" opacity=".6"><circle cx="270" cy="346" r="4.5" /><circle cx="30" cy="366" r="4" /></g></g>
    <g stroke="#6a8a5a" strokeWidth="3" strokeLinecap="round"><path d="m250 384 1-30m20 30 1-36m28 36 1-24" /></g>
  </svg>;
}

function LollipopTrees() {
  return <svg className="scenery-edge scenery-edge-right scenery-lollipops" viewBox="0 0 420 390" preserveAspectRatio="xMaxYMax meet" {...svgProps}>
    <path d="M140 390q50-40 130-44t150-24v68Z" fill="#2a1c28" />
    <path d="M330 350V190m-80 160V250" stroke="#e8d8c8" strokeWidth="6" opacity=".45" />
    <circle cx="330" cy="170" r="40" fill="#ff8fc4" opacity=".55" />
    <path d="M330 170m-28 0a28 28 0 1 1 28 28 18 18 0 1 1-18-18 10 10 0 1 1 10 10" stroke="#fff0f6" strokeWidth="4" opacity=".5" />
    <circle cx="250" cy="236" r="26" fill="#9fd0ff" opacity=".5" />
    <path d="M250 236m-16 0a16 16 0 1 1 16 16 10 10 0 1 1-10-10" stroke="#f6fbff" strokeWidth="3" opacity=".5" />
    <g className="scenery-flowers"><g fill="#ffe08a" opacity=".6"><circle cx="200" cy="356" r="5" /><circle cx="380" cy="350" r="4" /></g><g fill="#ffb3dc" opacity=".6"><circle cx="220" cy="362" r="4" /><circle cx="360" cy="360" r="4.5" /></g></g>
  </svg>;
}

type TypeTheme = Exclude<PokemonTheme, "gengar" | "gible" | "piplup" | "charmander" | "bulbasaur">;

export const TYPE_SCENES: Record<TypeTheme, Scene> = {
  eevee: {
    distance: <>
      <path d="M0 660q200-60 400-20t400-10 400 10 400-40v300H0Z" fill="#3a3326" opacity=".45" />
      <path d="M0 780q220-50 460-10t480-10 400 10 260-20v150H0Z" fill="#4a5a32" opacity=".35" />
      <g fill="#dfe8ff" opacity=".06"><ellipse cx="420" cy="260" rx="120" ry="26" /><ellipse cx="1120" cy="200" rx="150" ry="30" /></g>
    </>,
    celestial: { glow: "#ffe0a0", core: "#fff1c8", coreOpacity: ".22", kind: "sun" },
    edges: <><Windmill /><HayField /></>,
    particle: "pollen",
  },
  pikachu: {
    distance: <>
      <path d="m0 650 160-30 40-80h220l40 90 200-20 60-110h260l50 120 260 20 310-30v330H0Z" fill="#2c2a1c" opacity=".55" />
      <g fill="#3b3a30" opacity=".5"><ellipse cx="380" cy="160" rx="240" ry="50" /><ellipse cx="1200" cy="130" rx="300" ry="60" /></g>
      <path className="scenery-bolt" d="m1180 170-30 80h24l-36 90 60-110h-24l30-60Z" fill="#ffe36b" opacity="0" />
      <path d="M0 800q300-30 600 0t600 0 400-20v120H0Z" fill="#3a3624" opacity=".45" />
    </>,
    celestial: { glow: "#f7d84a", core: "#fff2a8", coreOpacity: ".2", kind: "moon" },
    edges: <><Pylon /><StormMesa /></>,
    particle: "spark",
  },
  snorunt: {
    distance: <>
      <g className="scenery-aurora"><path d="M0 220q300-120 600-20t600-40 400 30" stroke="#7ff0c8" strokeWidth="40" opacity=".08" /><path d="M0 280q340-100 640-10t560-60 400 40" stroke="#b8a4ff" strokeWidth="30" opacity=".07" /></g>
      <path d="m0 680 180-160 140 110 200-180 220 190 180-120 200 150 240-170 240 200v200H0Z" fill="#1d3442" opacity=".5" />
      <path d="m180 520 40 34-26-6m280-118 60 50-40-10m500 30 50 40-36-8" stroke="#d6eef5" strokeWidth="4" opacity=".2" />
      <path d="M0 800q300-40 600 0t600 0 400-10v110H0Z" fill="#d6eef5" opacity=".08" />
    </>,
    celestial: { glow: "#bfefff", core: "#e8fbff", coreOpacity: ".34", kind: "moon" },
    edges: <><Glacier /><SnowPines /></>,
    particle: "snow",
  },
  riolu: {
    distance: <>
      <path d="m0 680 200-260 140 160 180-280 200 260 160-140 220 240 240-300 260 320v220H0Z" fill="#2e1d1a" opacity=".5" />
      <path d="m520 300 40 50-30-8m700 4 50 60-40-10" stroke="#e8d8c8" strokeWidth="5" opacity=".15" />
      <path d="M0 640q400-40 800 0t800-10v40H0Z" fill="#e8d8c8" opacity=".05" />
      <path d="M0 790q260-40 560 0t560-20 480 10v120H0Z" fill="#3e2722" opacity=".45" />
    </>,
    celestial: { glow: "#ff8a6a", core: "#ff9a7a", coreOpacity: ".26", kind: "sun" },
    edges: <><Dojo /><TrainingGround /></>,
    particle: "petal",
  },
  grimer: {
    distance: <>
      <path d="M0 680q160-80 360-40t420-30 420 30 400-50v310H0Z" fill="#231829" opacity=".5" />
      <path d="M0 780q260-30 560 10t580-20 460 0v130H0Z" fill="#2a3a24" opacity=".4" />
      <path className="scenery-lava-pool" d="M300 820q300-20 600 0t300 0q-400 20-900 0Z" fill="#7fbf4a" opacity=".12" />
    </>,
    celestial: { glow: "#b4f08a", core: "#d4f8b8", coreOpacity: ".18", kind: "moon" },
    edges: <><SludgeWorks /><Bog /></>,
    particle: "bubble",
  },
  pidgey: {
    distance: <>
      <g className="scenery-clouds" fill="#dfe8ff" opacity=".07"><ellipse cx="300" cy="300" rx="260" ry="40" /><ellipse cx="1100" cy="240" rx="320" ry="50" /><ellipse cx="760" cy="520" rx="360" ry="40" /></g>
      <path d="m0 740 160-140 120 90 200-160 200 160 260-100 240 140 220-120 200 130v160H0Z" fill="#26324a" opacity=".5" />
      <path d="M0 840q400-40 800 0t800 0v60H0Z" fill="#dfe8ff" opacity=".07" />
    </>,
    celestial: { glow: "#ffe6a0", core: "#fff4d0", coreOpacity: ".24", kind: "sun" },
    edges: <><NestCliff /><WindTree /></>,
    particle: "feather",
  },
  ralts: {
    distance: <>
      <path d="M0 700q240-80 480-20t520-40 600 20v240H0Z" fill="#251526" opacity=".5" />
      <g fill="#f6e6ff" opacity=".35"><circle cx="200" cy="140" r="1.5" /><circle cx="520" cy="90" r="2" /><circle cx="880" cy="160" r="1.5" /><circle cx="1260" cy="80" r="2" /><circle cx="1420" cy="200" r="1.5" /><circle cx="700" cy="240" r="1.2" /></g>
      <path d="M0 820q300-30 600 0t600-10 400 10v80H0Z" fill="#3a2440" opacity=".4" />
    </>,
    celestial: { glow: "#ff9ac8", core: "#ffd0e6", coreOpacity: ".26", kind: "moon", detail: <ellipse cx="80" cy="80" rx="70" ry="14" stroke="#b8a4ff" strokeWidth="3" opacity=".35" transform="rotate(-18 80 80)" /> },
    edges: <><CrystalTemple /><FloatingCrystals /></>,
    particle: "mote",
  },
  caterpie: {
    distance: <>
      <g fill="#1c2312" opacity=".55"><path d="m100 700 20-200 24 200Zm160 0 14-140 18 140Zm640 0 20-220 22 220Zm200 0 16-160 18 160Zm300 0 18-180 20 180Z" /></g>
      <path d="M0 720q200-40 400-10t400-20 400 10 400-20v220H0Z" fill="#26301a" opacity=".5" />
      <path d="M0 830q300-30 600 0t600 0 400-10v80H0Z" fill="#3a4a24" opacity=".4" />
    </>,
    celestial: { glow: "#ffe6a0", core: "#fff1c4", coreOpacity: ".2", kind: "sun" },
    edges: <><HollowLog /><GiantGrass /></>,
    particle: "firefly",
  },
  geodude: {
    distance: <>
      <path d="M0 640h180v-80h220v80h260v-120h200v120h300v-60h240v60h200v260H0Z" fill="#4a3b2c" opacity=".4" />
      <path d="M180 600h220m60-60h200m300 80h240" stroke="#6a563e" strokeWidth="6" opacity=".35" />
      <path d="M0 780q260-30 560 0t560-10 480 10v120H0Z" fill="#5a4834" opacity=".4" />
    </>,
    celestial: { glow: "#f2c48a", core: "#e8b070", coreOpacity: ".22", kind: "sun" },
    edges: <><CanyonArch /><Hoodoos /></>,
    particle: "dust",
  },
  dratini: {
    distance: <>
      <path d="m0 660 200-240 160 160 200-280 220 260 180-160 220 220 220-260 200 240v300H0Z" fill="#1d2140" opacity=".55" />
      <path d="M0 640q400-30 800 0t800 0" stroke="#7ee0e8" strokeWidth="2" opacity=".12" />
      <path d="M0 790q260-30 560 0t560-10 480 10v110H0Z" fill="#232850" opacity=".5" />
    </>,
    celestial: { glow: "#b8c0ff", core: "#dfe2ff", coreOpacity: ".3", kind: "moon" },
    edges: <><WaterfallCliff /><ShrineGate /></>,
    particle: "mote",
  },
  umbreon: {
    distance: <>
      <path d="M0 700h120v-120h60v-60h40v180h140v-90h80v90h200v-160h50v40h60v120h160v-100h100v100h200v-80h80v80h310v200H0Z" fill="#14161f" opacity=".6" />
      <path d="M0 820q400-30 800 0t800 0v80H0Z" fill="#22242f" opacity=".5" />
    </>,
    celestial: { glow: "#f2c45c", core: "#ffe6a0", coreOpacity: ".3", kind: "moon", detail: <circle cx="80" cy="80" r="52" stroke="#f2c45c" strokeWidth="4" opacity=".3" /> },
    edges: <><BrokenColonnade /><DeadTreeArch /></>,
    particle: "firefly",
  },
  aron: {
    distance: <>
      <path d="M0 700h100v-160h40v-60h30v220h160v-120h120v120h200v-200h30v-40h30v240h220v-140h100v140h200v-100h60v100h300v200H0Z" fill="#1a1f23" opacity=".6" />
      <g className="scenery-window-light" fill="#f28a5c" opacity=".2"><path d="M110 600h12v14h-12Zm260 30h12v14h-12Zm460-60h12v14h-12Zm400 50h12v14h-12Z" /></g>
      <path d="M0 820q400-30 800 0t800 0v80H0Z" fill="#2a3238" opacity=".5" />
    </>,
    celestial: { glow: "#c3cfd9", core: "#e6eef4", coreOpacity: ".26", kind: "moon" },
    edges: <><Foundry /><Girders /></>,
    particle: "ember",
  },
  togepi: {
    distance: <>
      <path d="M0 680q200-80 400-30t400-20 400 10 400-40v300H0Z" fill="#3a2436" opacity=".45" />
      <path d="M0 790q200-50 420-10t440-10 420 20 320-20v130H0Z" fill="#4a2c44" opacity=".4" />
      <g fill="#ffe08a" opacity=".25"><path d="m300 200 4 10 10 2-8 6 2 10-8-6-8 6 2-10-8-6 10-2Zm900-60 3 8 8 1-6 5 2 8-7-5-7 5 2-8-6-5 8-1Z" /></g>
    </>,
    celestial: { glow: "#ffd0ea", core: "#fff0f8", coreOpacity: ".28", kind: "moon" },
    edges: <><MushroomCottage /><LollipopTrees /></>,
    particle: "petal",
  },
};
