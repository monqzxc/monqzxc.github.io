export type RaftPose = "breathing" | "walking" | "attacking" | "taunting" | "hit";
export type RaftElement = "shadow" | "electric" | "fire" | "rock";

export const RAFT_POSES: Record<RaftPose, { row: number; frameMs: number; loop: boolean }> = {
  breathing: { row: 0, frameMs: 280, loop: true },
  walking: { row: 1, frameMs: 150, loop: true },
  attacking: { row: 2, frameMs: 160, loop: false },
  taunting: { row: 3, frameMs: 300, loop: false },
  hit: { row: 4, frameMs: 160, loop: false },
};

export const RAFT_SPRITES: Record<string, { sheet?: string; fallback: string; height: number; element: RaftElement; color: string }> = {
  gengar: { sheet: "/images/raft/gengar-sheet.png", fallback: "/images/puzzle/gengar.png", height: 150, element: "shadow", color: "#be8cff" },
  pikachu: { sheet: "/images/raft/pikachu-sheet.png", fallback: "/images/puzzle/pikachu.png", height: 148, element: "electric", color: "#ffe579" },
  charizard: { fallback: "/images/puzzle/charizard.png", height: 164, element: "fire", color: "#ffad64" },
  bidoof: { sheet: "/images/raft/bidoof-sheet.png", fallback: "/images/puzzle/bidoof.png", height: 142, element: "rock", color: "#cfad82" },
};

// The supplied sheets mix expressions across some rows and have effects at cell edges.
const SPRITE_FRAME_OVERRIDES: Record<string, Partial<Record<RaftPose, readonly (readonly [number, number])[]>>> = {
  gengar: {
    attacking: [[2, 0], [2, 1], [2, 2], [2, 2]],
    taunting: [[3, 1], [3, 2], [4, 1], [3, 2]],
    hit: [[3, 0], [3, 3], [4, 3], [4, 2]],
  },
  pikachu: {
    breathing: [[2, 0], [0, 2], [4, 0], [4, 3]],
    attacking: [[2, 0], [2, 1], [2, 2], [2, 2]],
    taunting: [[4, 1], [4, 2], [3, 2], [4, 2]],
    hit: [[3, 0], [3, 1], [3, 0], [3, 1]],
  },
};

export function raftSpriteFrame(pose: RaftPose, elapsed: number, reducedMotion: boolean, pokemon?: string): { row: number; column: number } {
  const animation = RAFT_POSES[pose];
  const frame = Math.max(0, Math.floor(elapsed / animation.frameMs));
  // Keep the action readable without recurring spatial motion.
  const column = reducedMotion ? (pose === "breathing" || pose === "walking" ? 0 : pose === "hit" ? 3 : 2)
    : animation.loop ? frame % 4 : Math.min(3, frame);
  const mappedFrame = SPRITE_FRAME_OVERRIDES[pokemon ?? ""]?.[pose]?.[column];
  if (mappedFrame) {
    const [row, mappedColumn] = mappedFrame;
    return { row, column: mappedColumn };
  }
  return { row: animation.row, column };
}

export type RaftPortraitPose = { x: number; y: number; rotation: number; scaleX: number; scaleY: number; opacity: number; saturation: number };

/** Grounded whole-art poses for creatures without a generated frame sheet. */
export function raftPortraitPose(pose: RaftPose, elapsed: number, reducedMotion: boolean, knockedOut = false): RaftPortraitPose {
  const rest: RaftPortraitPose = { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, saturation: 1 };
  const time = Math.max(0, Number.isFinite(elapsed) ? elapsed : 0);
  if (knockedOut) {
    const settle = reducedMotion ? 1 : 1 - (1 - Math.min(1, time / 650)) ** 3;
    return { ...rest, x: -9 + settle * 2, y: settle * 5, rotation: -0.13 - settle * 0.07, scaleX: 1.04 + settle * 0.04, scaleY: 0.92 - settle * 0.06, opacity: 1 - settle * 0.38, saturation: 0.35 - settle * 0.05 };
  }
  if (reducedMotion) {
    if (pose === "attacking") return { ...rest, rotation: 0.07, scaleY: 1.02 };
    if (pose === "taunting") return { ...rest, rotation: -0.06, scaleX: 1.03 };
    if (pose === "hit") return { ...rest, rotation: -0.08, scaleY: 0.94, saturation: 0.6 };
    return rest;
  }
  if (pose === "breathing") {
    const breath = Math.sin(time / 440);
    return { ...rest, scaleX: 1 - breath * 0.012, scaleY: 1 + breath * 0.02 };
  }
  if (pose === "walking") {
    const step = Math.sin(time / 95);
    const settle = Math.min(1, time / 110, Math.max(0, (900 - time) / 150));
    return { ...rest, x: step * 5 * settle, y: -Math.abs(step) * 3 * settle, rotation: step * 0.045 * settle, scaleY: 1 - Math.abs(step) * 0.02 * settle };
  }
  if (pose === "attacking") {
    if (time < 160) {
      const windup = time / 160;
      return { ...rest, x: -windup * 7, rotation: -windup * 0.1, scaleX: 1 + windup * 0.025, scaleY: 1 - windup * 0.045 };
    }
    if (time < 250) {
      const launch = 1 - (1 - (time - 160) / 90) ** 3;
      return { ...rest, x: -7 + launch * 18, rotation: -0.1 + launch * 0.22, scaleX: 1.025 - launch * 0.05, scaleY: 0.955 + launch * 0.085 };
    }
    const release = Math.max(0, 1 - (time - 250) / 400) ** 2;
    return { ...rest, x: release * 11, rotation: release * 0.12, scaleX: 1 - release * 0.025, scaleY: 1 + release * 0.04 };
  }
  if (pose === "taunting") {
    const envelope = Math.sin(Math.min(1, time / 1200) * Math.PI);
    const bounce = Math.sin(time / 95);
    return { ...rest, x: -3 * envelope, y: -Math.max(0, bounce) * 5 * envelope, rotation: -0.1 * envelope + bounce * 0.025 * envelope, scaleX: 1 + 0.05 * envelope, scaleY: 1 - 0.035 * envelope + bounce * 0.018 * envelope };
  }
  const recoil = Math.max(0, 1 - time / 650);
  return { ...rest, x: (-9 + Math.sin(time / 27) * 3) * recoil, y: -Math.sin(Math.min(1, time / 650) * Math.PI) * 3, rotation: -0.13 * recoil, scaleX: 1 + recoil * 0.04, scaleY: 1 - recoil * 0.08, saturation: 1 - recoil * 0.65 };
}
