export type PokemonSpecies = "gengar" | "gastly" | "haunter" | "gible" | "sandshrew" | "diglett";

type ArtProps = { species: PokemonSpecies; happy?: boolean; className?: string };

function Eyes({ happy, y = 48, color = "#2c203c" }: { happy: boolean; y?: number; color?: string }) {
  return happy ? (
    <g fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round">
      <path d={`M40 ${y + 2}q6-9 12 0M68 ${y + 2}q6-9 12 0`} />
    </g>
  ) : (
    <g fill="#fff8ea" stroke={color} strokeWidth="2">
      <ellipse cx="46" cy={y} rx="7" ry="9" /><ellipse cx="74" cy={y} rx="7" ry="9" />
      <g fill={color} stroke="none"><ellipse cx="48" cy={y + 1} rx="3" ry="5" /><ellipse cx="72" cy={y + 1} rx="3" ry="5" /></g>
    </g>
  );
}

function Smile({ happy, y = 64, teeth = false }: { happy: boolean; y?: number; teeth?: boolean }) {
  return <g stroke="#302238" strokeWidth="2.2" strokeLinejoin="round">
    <path d={happy ? `M38 ${y}q22 9 44 0q-3 25-22 25T38 ${y}` : `M40 ${y}q20 9 40 0q-5 18-20 18T40 ${y}`} fill={teeth ? "#fff5df" : "#652e4e"} />
    {teeth ? <path d={`M51 ${y + 5}v11m10-10v13m10-15v12`} fill="none" strokeWidth="1.6" /> : <path d={`M49 ${y + 17}q11-9 22 0q-11 10-22 0`} fill="#ed8b9e" stroke="none" />}
  </g>;
}

function Gengar({ happy }: { happy: boolean }) {
  return <g stroke="#39224f" strokeWidth="2.5" strokeLinejoin="round">
    <g className="pokemon-leg-left" style={{ transformOrigin: "39px 87px", transformBox: "view-box" }}><path d="M33 87l-11 15q8 9 23 0" fill="#725199" /></g>
    <g className="pokemon-leg-right" style={{ transformOrigin: "81px 87px", transformBox: "view-box" }}><path d="M74 100q16 12 25 2L85 86" fill="#725199" /></g>
    {happy ? <g className="pokemon-wave-hand" style={{ transformOrigin: "29px 66px" }}><path d="M31 76Q17 70 15 55L7 49l4-6 7 4-4-12 6-2 6 14 2-10 6 2-1 16 8 11Z" fill="#9870bd" /></g> : <path d="M30 57 13 68l3 10 15-3m58-18 18 11-3 10-15-3" fill="#8960ac" />}
    <path d="m25 36-4-22 23 15 9-12 10 9 13-9 4 13 20-12-5 29q12 20 6 36-7 22-40 23-35-1-42-24-5-20 6-36Z" fill="#8d62b3" />
    <path d="m28 37-2-14 15 12m44 1 9-9-3 16" fill="#b58bd5" stroke="none" />
    <path d="M27 70q-1 25 31 29 29 0 36-20-19 13-37 8-20-4-30-17" fill="#765098" stroke="none" />
    {happy ? <Eyes happy y={50} color="#342142" /> : <g><path d="m34 42 20 8-15 8Zm52 0-20 8 15 8Z" fill="#f07891" /><path d="m44 47 1 6m30-6-1 6" fill="none" stroke="#351b3e" /></g>}
    <Smile happy={happy} y={64} teeth />
    {happy && <g fill="#df94bd" stroke="none" opacity=".65"><ellipse cx="33" cy="63" rx="6" ry="3" /><ellipse cx="87" cy="63" rx="6" ry="3" /></g>}
  </g>;
}

function Gastly({ happy }: { happy: boolean }) {
  return <g strokeLinejoin="round">
    <g className="pokemon-mist pokemon-mist-outer" style={{ transformOrigin: "60px 59px", transformBox: "view-box" }}><path d="M20 32Q6 19 29 19 26 3 45 13 56 1 66 13 90 0 88 23 112 17 102 39 119 52 104 64 115 84 95 85 97 105 78 99 66 118 54 102 31 114 30 96 8 100 16 78 0 67 17 54 3 42 20 32Z" fill="#a071bd" opacity=".48" /></g>
    <g className="pokemon-mist pokemon-mist-inner" style={{ transformOrigin: "60px 59px", transformBox: "view-box" }}><path d="M25 32Q24 19 44 25 58 10 72 26 94 22 92 41 108 53 95 68 105 83 85 90 79 107 61 96 40 108 33 89 15 87 25 68 12 51 25 32Z" fill="#b188d1" opacity=".58" /></g>
    <circle cx="60" cy="59" r="33" fill="#48354f" stroke="#34223c" strokeWidth="2.5" />
    <path d="M32 60q7 26 33 25 19-2 25-16-5 26-31 24-26-1-27-33" fill="#34273e" />
    {happy ? <Eyes happy y={49} color="#f2cceb" /> : <g fill="#fff8ea" stroke="#302238" strokeWidth="2"><path d="m34 40 22 9-10 12q-15-3-12-21Zm52 0-22 9 10 12q15-3 12-21Z" /><path d="M46 47v7m28-7v7" strokeWidth="3" /></g>}
    <Smile happy={happy} y={62} />
    {!happy && <path d="m42 65 7 2-3 9Zm36 0-7 2 3 9Z" fill="#fff9e8" />}
    {happy && <g className="pokemon-wave-hand" style={{ transformOrigin: "26px 66px" }} fill="#bf91dc" stroke="#755091" strokeWidth="2"><path d="M26 70Q10 63 11 53L5 48l4-5 7 6-3-12 5-2 6 15 3-8 5 2-2 12 4 9Z" /><circle cx="23" cy="77" r="3" opacity=".65" /></g>}
  </g>;
}

function Haunter({ happy }: { happy: boolean }) {
  return <g fill="#9670bc" stroke="#422b5c" strokeWidth="2.5" strokeLinejoin="round">
    <path d="m27 34-9-17 27 11 13-13 12 13 28-11-7 21 17 8-10 10 3 13-15 6-2 18-21-8-13 9-12-13-16-2 5-14-13-8 12-8Z" />
    <path d="m28 37 17 0-20-14m53 14 12 0 3-12" fill="#b58ed5" stroke="none" />
    {happy ? <Eyes happy y={46} color="#392341" /> : <g fill="#fff5e9"><path d="m33 39 23 10-13 8Zm52 0-20 10 13 8Z" /><path d="m45 46 1 6m29-6-1 6" fill="none" stroke="#ef7c92" strokeWidth="3" /></g>}
    <Smile happy={happy} y={59} teeth />
    <g className={happy ? "pokemon-wave-hand" : "pokemon-idle-hand pokemon-arm-left"} style={{ transformOrigin: "23px 73px", transformBox: "view-box" }}>
      <path d={happy ? "M26 77Q10 71 10 58L3 50l4-5 9 8-4-16 6-1 6 17 4-10 5 3-4 16 6 8Z" : "m22 71-14 9 1 10 6-3 1 9 6-5 5 5 6-10-2-12Z"} />
    </g>
    <g className={happy ? undefined : "pokemon-idle-hand pokemon-arm-right"} style={{ transformOrigin: "96px 75px", transformBox: "view-box" }}><path d="m93 72 15 7 4 10-7-2-1 10-7-6-5 6-7-11 1-11Z" /></g>
  </g>;
}

function Gible({ happy }: { happy: boolean }) {
  return <g stroke="#25465a" strokeWidth="2.5" strokeLinejoin="round">
    <g className="pokemon-tail" style={{ transformOrigin: "84px 83px", transformBox: "view-box" }}><path d="m84 83 24 7-17-21" fill="#497b96" /></g>
    <g className="pokemon-leg-left" style={{ transformOrigin: "44px 91px", transformBox: "view-box" }}>
      <path d="m39 88-13 14 2 7 21-1 8-13" fill="#5993ab" />
      <path d="m31 105 4-6 4 6 4-5 3 6" fill="#faf0d7" strokeWidth="1.5" />
    </g>
    <g className="pokemon-leg-right" style={{ transformOrigin: "76px 91px", transformBox: "view-box" }}>
      <path d="m78 88 17 14-3 7-22-1-8-13" fill="#5993ab" />
      <path d="m76 106 4-6 4 6 4-5 3 6" fill="#faf0d7" strokeWidth="1.5" />
    </g>
    {happy ? <g className="pokemon-wave-hand" style={{ transformOrigin: "30px 70px" }}><path d="M32 80Q13 72 13 51l6-5 7 5 1 10 11 7Z" fill="#6ca1b6" /><path d="m14 51 0-8 5 5 3-8 4 11" fill="#fff1d8" strokeWidth="1.5" /></g> : <g className="pokemon-arm-left pokemon-dig-arm" style={{ transformOrigin: "31px 68px", transformBox: "view-box" }}><path d="m31 67-16 14 5 10 16-8" fill="#6096af" /></g>}
    <g className={happy ? undefined : "pokemon-arm-right pokemon-dig-arm"} style={{ transformOrigin: "82px 70px", transformBox: "view-box" }}><path d="m81 69 20 12-5 10-14-8" fill="#6096af" /></g>
    <path d="m48 28 5-19 20 20" fill="#54829f" />
    <path d="M32 37 13 27l5 22 12 7m56-19 20-10-4 22-13 7" fill="#74a8bd" />
    <path d="M29 48q3-26 30-26 29 0 34 28l-2 35q-5 20-31 20-29 0-34-23Z" fill="#70a3b8" />
    <path d="M32 73q28-14 56 0l-2 14q-7 15-26 15-23 0-28-19Z" fill="#d98276" stroke="none" />
    <Eyes happy={happy} y={47} color="#213f50" />
    <path d={happy ? "M34 62q26 10 52 0-2 28-26 28T34 62" : "M34 63q26 5 52 0-3 25-26 25T34 63"} fill="#6c3a46" stroke="#294555" />
    <path d="m40 65 6 2-3 10Zm39 0-6 2 3 10Z" fill="#fff8df" stroke="none" />
    <path d="M48 81q12-8 24 0-12 10-24 0" fill="#ec9b99" stroke="none" />
    {happy && <g fill="#e9b297" stroke="none"><ellipse cx="33" cy="57" rx="5" ry="3" /><ellipse cx="87" cy="57" rx="5" ry="3" /></g>}
  </g>;
}

function Sandshrew({ happy }: { happy: boolean }) {
  return <g stroke="#80602f" strokeWidth="2.3" strokeLinejoin="round">
    <g className="pokemon-tail" style={{ transformOrigin: "82px 82px", transformBox: "view-box" }}><path d="M82 78q24 4 24 20-12 2-23-9" fill="#cda658" /></g>
    <g className="pokemon-leg-left" style={{ transformOrigin: "40px 92px", transformBox: "view-box" }}>
      <path d="m37 91-12 14q9 9 25 0" fill="#dbb665" />
      <path d="m27 106 4-6 4 7 4-6 3 7" fill="#fff3d6" strokeWidth="1.5" />
    </g>
    <g className="pokemon-leg-right" style={{ transformOrigin: "76px 92px", transformBox: "view-box" }}>
      <path d="m73 91 19 14q-7 10-23 0" fill="#dbb665" />
      <path d="m74 108 4-7 3 7 4-6 4 6" fill="#fff3d6" strokeWidth="1.5" />
    </g>
    {happy ? <g className="pokemon-wave-hand" style={{ transformOrigin: "31px 71px" }}><path d="M35 80Q18 74 15 55l9-8 7 9-1 8 9 6Z" fill="#dfbb6d" /><path d="m15 56-2-11 6 5 3-10 4 10 5-7 0 13" fill="#fff1cc" strokeWidth="1.5" /></g> : <g className="pokemon-arm-left pokemon-dig-arm" style={{ transformOrigin: "33px 69px", transformBox: "view-box" }}><path d="m32 68-17 15 7 10 16-9" fill="#d6ad5c" /></g>}
    <g className={happy ? undefined : "pokemon-arm-right pokemon-dig-arm"} style={{ transformOrigin: "80px 69px", transformBox: "view-box" }}><path d="m80 67 17 16-7 10-15-9" fill="#d6ad5c" /></g>
    <path d="M28 49 27 18q12-5 20 15 14-6 28 1 7-20 19-14l-5 33 1 30q-2 22-30 22-29 0-32-21Z" fill="#dfb969" />
    <path d="m32 25 2 20 8-9Zm55 1-3 18-6-8Z" fill="#a88953" stroke="none" />
    <path d="M39 72q22-16 42 0l-2 20q-20 17-39 0Z" fill="#f4e4b4" stroke="none" />
    <path d="M48 33v9m16-13v11m15-7-2 11M32 42l15 1 17-3 22 4M30 54l7 2m-8 12 9 3m-6 11 7 2m45-28 6-3m-7 19 8-4m-9 15 8-3M47 79l1 18m13-21v26m13-21-1 16M41 88h38" fill="none" stroke="#b48b40" strokeWidth="1.6" />
    <Eyes happy={happy} y={51} color="#4c3d2c" />
    <ellipse cx="60" cy="63" rx="4" ry="3" fill="#665034" stroke="none" />
    {happy ? <path d="M49 69q11 5 22 0-1 12-11 12T49 69" fill="#744737" /> : <path d="M51 71q9 7 18 0" fill="none" strokeLinecap="round" />}
    {happy && <path d="M55 77q5-4 10 0" fill="none" stroke="#e49b86" strokeWidth="4" strokeLinecap="round" />}
  </g>;
}

function Diglett({ happy }: { happy: boolean }) {
  return <g stroke="#694832" strokeWidth="2.5" strokeLinejoin="round">
    <ellipse cx="60" cy="99" rx="43" ry="11" fill="#6e5940" />
    <path d="M35 93V49q0-25 25-25t25 25v45q-23 12-50-1Z" fill="#b7875a" />
    <path d="M73 29q10 11 7 35v29l-9 5q19-2 14-7V47q-1-15-12-18" fill="#967047" stroke="none" />
    <path d="M42 48q0-15 10-17" fill="none" stroke="#d6ae7c" strokeWidth="5" strokeLinecap="round" />
    {happy ? <g fill="none" stroke="#392b27" strokeWidth="3" strokeLinecap="round"><path d="M44 54q5-7 10 0m12 0q5-7 10 0" /></g> : <g fill="#332b28" stroke="none"><ellipse cx="48" cy="52" rx="3.5" ry="8" /><ellipse cx="72" cy="52" rx="3.5" ry="8" /><g fill="#fff6e1"><circle cx="49" cy="49" r="1.3" /><circle cx="73" cy="49" r="1.3" /></g></g>}
    <ellipse cx="60" cy="66" rx="13" ry="8" fill="#d69393" stroke="#976168" strokeWidth="2" />
    <ellipse cx="56" cy="64" rx="5" ry="2" fill="#edb6af" stroke="none" />
    {happy ? <path d="M49 78q11 4 22 0-2 12-11 12T49 78" fill="#6f403b" /> : <path d="M55 80q5 4 10 0" fill="none" strokeLinecap="round" />}
    {happy && <g className="pokemon-wave-hand" style={{ transformOrigin: "27px 88px" }}><path d="M31 96Q18 92 18 78l-7-9 5-5 7 8-1-13 6 1 4 15 4-6 4 3-3 12 1 8Z" fill="#b18a59" /><path d="m20 87 10-2m-5-9 7 1" fill="none" stroke="#8e693e" strokeWidth="1.6" /></g>}
    <g fill="#a88b5f" stroke="#69523a" strokeWidth="2"><path d="m18 98 7-9 10 4 5 11-15 2Zm64 7 4-12 10-3 8 10-9 6Z" /><path d="m43 105 5-7 11 3 3 7Zm23 0 3-5 7 1 4 6Z" /></g>
  </g>;
}

export function PokemonArt({ species, happy = false, className }: ArtProps) {
  const illustrations = { gengar: Gengar, gastly: Gastly, haunter: Haunter, gible: Gible, sandshrew: Sandshrew, diglett: Diglett };
  const Illustration = illustrations[species];
  return <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><Illustration happy={happy} /></svg>;
}
