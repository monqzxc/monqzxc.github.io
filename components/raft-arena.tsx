"use client";

import { useEffect, useRef } from "react";
import type { Point, ShotResult } from "@/lib/raft-battle";
import { RAFT_SPRITES, raftSpriteFrame, raftPortraitPose, type RaftPose, type RaftElement } from "@/lib/raft-sprites";

type RaftArenaProps = {
  pokemon: [string, string];
  health: [number, number];
  turn: 0 | 1;
  preview: Point[];
  flight: { shot: ShotResult; startedAt: number; duration: number; shooter?: 0 | 1 } | null;
  impact: { point: Point; damage: number; color: string } | null;
  active: boolean;
  emote?: { side: 0 | 1; startedAt: number } | null;
};

const WIDTH = 1000;
const HEIGHT = 500;
const TEAM_COLORS = ["#caafff", "#f5cf73"];
type SpriteImages = { sheet: HTMLImageElement; fallback: HTMLImageElement };
type SpriteAnimation = { pose: RaftPose; elapsed: number };

function ellipse(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, fill: string) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  const sky = ctx.createLinearGradient(0, 0, 0, 395);
  sky.addColorStop(0, "#201a38");
  sky.addColorStop(0.62, "#655071");
  sky.addColorStop(1, "#b48c9a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Fixed star positions keep the landscape calm as aim controls change.
  for (let i = 0; i < 37; i++) {
    const x = (i * 173 + 43) % WIDTH;
    const y = (i * 59 + 21) % 225;
    ellipse(ctx, x, y, i % 5 === 0 ? 1.7 : 1, i % 5 === 0 ? 1.7 : 1, i % 3 === 0 ? "#ead8cf" : "#a999c2");
  }

  ctx.save();
  ctx.translate(754, 88);
  ctx.rotate(-0.3);
  ctx.fillStyle = "#f9e9cb";
  ctx.beginPath();
  ctx.arc(0, 0, 28, Math.PI * 0.23, Math.PI * 1.77);
  ctx.bezierCurveTo(-3, -22, -3, 22, 21, 18);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#a58ba7";
  ctx.globalAlpha = 0.15;
  ellipse(ctx, 210, 175, 117, 8, "#bba0b9");
  ellipse(ctx, 555, 244, 176, 9, "#bba0b9");
  ellipse(ctx, 877, 215, 88, 5, "#bba0b9");
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#6c617e";
  ctx.beginPath();
  ctx.moveTo(0, 363);
  ctx.bezierCurveTo(115, 339, 121, 350, 160, 319);
  ctx.bezierCurveTo(202, 284, 213, 320, 255, 337);
  ctx.bezierCurveTo(299, 347, 310, 352, 341, 361);
  ctx.bezierCurveTo(494, 375, 514, 321, 560, 336);
  ctx.bezierCurveTo(610, 349, 629, 286, 680, 314);
  ctx.bezierCurveTo(751, 356, 781, 336, 816, 348);
  ctx.bezierCurveTo(913, 355, 958, 326, 1000, 343);
  ctx.lineTo(1000, 390);
  ctx.lineTo(0, 390);
  ctx.fill();

  ctx.fillStyle = "#4c4b69";
  ctx.beginPath();
  ctx.moveTo(331, 374);
  ctx.bezierCurveTo(366, 349, 400, 346, 427, 349);
  ctx.bezierCurveTo(451, 352, 456, 366, 491, 374);
  ctx.fill();
  ctx.strokeStyle = "#4c4b69";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(399, 354);
  ctx.quadraticCurveTo(406, 322, 400, 300);
  ctx.stroke();
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(400, 304);
  ctx.quadraticCurveTo(382, 283, 365, 302);
  ctx.moveTo(400, 304);
  ctx.quadraticCurveTo(414, 285, 437, 306);
  ctx.moveTo(400, 304);
  ctx.quadraticCurveTo(382, 301, 377, 318);
  ctx.moveTo(400, 304);
  ctx.quadraticCurveTo(421, 303, 425, 323);
  ctx.stroke();

  const water = ctx.createLinearGradient(0, 365, 0, HEIGHT);
  water.addColorStop(0, "#4e627b");
  water.addColorStop(0.28, "#344d69");
  water.addColorStop(1, "#172b44");
  ctx.fillStyle = water;
  ctx.fillRect(0, 375, WIDTH, HEIGHT - 375);

  // A broken reflection grounds the moon in the same water as the rafts.
  for (let i = 0; i < 7; i++) {
    const y = 380 + i * 10;
    ellipse(ctx, 754 + Math.sin(i * 4) * 10, y, 8 + i * 6, 0.7, "#bbafb043");
  }
}

function drawWaves(ctx: CanvasRenderingContext2D, time: number) {
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  for (let row = 0; row < 6; row++) {
    ctx.strokeStyle = row < 2 ? "#c1c9d52e" : "#779ab038";
    for (let col = 0; col < 12; col++) {
      const x = col * 94 + Math.sin(time * 0.6 + row) * 9 + (row % 2) * 39 - 30;
      const y = 387 + row * 22 + Math.sin(time + col * 2 + row) * 2;
      const width = 16 + ((col * 7 + row * 13) % 29);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + width * 0.5, y + 3, x + width, y);
      ctx.stroke();
    }
  }
}

function drawRaft(ctx: CanvasRenderingContext2D, side: 0 | 1, pokemon: string, images: SpriteImages | undefined, health: number, current: boolean, animation: SpriteAnimation, time: number, reducedMotion: boolean) {
  const x = side === 0 ? 150 : 850;
  const bob = Math.sin(time * 1.4 + side * 2) * 1.6;
  const color = TEAM_COLORS[side];
  ellipse(ctx, x, 395, 81, 10, "#101c324f");
  ctx.save();
  ctx.translate(x, bob);

  // The pennant sits outboard, leaving the firing direction unobstructed.
  const pole = side === 0 ? -66 : 66;
  ctx.strokeStyle = "#c4a17a";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(pole, 377);
  ctx.lineTo(pole, 260);
  ctx.stroke();
  const flagDirection = side === 0 ? -1 : 1;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(pole, 262);
  ctx.lineTo(pole + flagDirection * 34, 267 + Math.sin(time * 1.8) * 2);
  ctx.lineTo(pole + flagDirection * 28, 278);
  ctx.lineTo(pole + flagDirection * 34, 288 + Math.sin(time * 1.8) * 2);
  ctx.lineTo(pole, 285);
  ctx.fill();

  ctx.fillStyle = "#4b332d";
  ctx.beginPath();
  ctx.roundRect(-76, 378, 152, 17, 7);
  ctx.fill();
  for (let i = 0; i < 8; i++) {
    const plankX = -76 + i * 19;
    ctx.fillStyle = i % 2 ? "#b58257" : "#ca9764";
    ctx.beginPath();
    ctx.roundRect(plankX, 369, 19, 20, 5);
    ctx.fill();
    ctx.strokeStyle = "#e2b47c";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(plankX + 5, 372);
    ctx.lineTo(plankX + 13, 372);
    ctx.stroke();
  }
  ctx.strokeStyle = "#6d4c3d";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-58, 369);
  ctx.lineTo(-58, 389);
  ctx.moveTo(58, 369);
  ctx.lineTo(58, 389);
  ctx.stroke();

  ellipse(ctx, 0, 367, 38, 5, "#422e364d");
  ctx.save();
  const sheet = images?.sheet;
  const fallback = images?.fallback;
  if (sheet?.complete && sheet.naturalWidth > 0) {
    if (health <= 0) {
      ctx.globalAlpha = 0.62;
      ctx.translate(0, 9);
    }
    const cellWidth = sheet.naturalWidth / 4;
    const cellHeight = sheet.naturalHeight / 5;
    const height = RAFT_SPRITES[pokemon]?.height ?? 150;
    const width = height * cellWidth / cellHeight;
    const { row, column } = raftSpriteFrame(animation.pose, animation.elapsed, reducedMotion, pokemon);
    const walking = animation.pose === "walking" && !reducedMotion ? Math.sin(animation.elapsed / 110) * 5 : 0;
    const hit = animation.pose === "hit" && !reducedMotion && health > 0 ? Math.sin(animation.elapsed / 45) * Math.max(0, 1 - animation.elapsed / 650) * 4 : 0;
    ctx.translate(walking + hit, 0);
    // Sprite sheets face right, so only the opposing raft is mirrored.
    ctx.scale(side === 1 ? -1 : 1, 1);
    ctx.drawImage(sheet, column * cellWidth, row * cellHeight, cellWidth, cellHeight, -width / 2, 367 - height * 0.85, width, height);
  } else if (fallback?.complete && fallback.naturalWidth > 0) {
    ctx.save();
    const pose = raftPortraitPose(animation.pose, animation.elapsed, reducedMotion, health <= 0);
    const height = (RAFT_SPRITES[pokemon]?.height ?? 150) * 0.9;
    const width = height * fallback.naturalWidth / fallback.naturalHeight;
    const direction = side === 0 ? 1 : -1;
    // Pivot the intact artwork at its feet, and direct every pose toward its rival.
    // The supplied portraits face left; unlike sheets, mirror the left team.
    ctx.translate(pose.x * direction, 369 + pose.y);
    ctx.rotate(pose.rotation * direction);
    ctx.scale(-direction * pose.scaleX, pose.scaleY);
    ctx.globalAlpha = pose.opacity;
    if (pose.saturation < 1) ctx.filter = `saturate(${pose.saturation})`;
    ctx.drawImage(fallback, -width / 2, -height, width, height);
    ctx.restore();
  } else {
    ellipse(ctx, 0, 333, 30, 30, "#f6e9d7");
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 333, 30, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#302940";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-29, 333);
    ctx.lineTo(29, 333);
    ctx.stroke();
    ellipse(ctx, 0, 333, 9, 9, "#302940");
    ellipse(ctx, 0, 333, 4.5, 4.5, "#f6e9d7");
  }
  ctx.restore();

  if (current && health > 0) {
    const spriteHeight = RAFT_SPRITES[pokemon]?.height ?? 150;
    const markerY = sheet?.complete && sheet.naturalWidth > 0 ? 353 - spriteHeight * 0.85 : 355 - spriteHeight * 0.9;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-7, markerY);
    ctx.lineTo(7, markerY);
    ctx.lineTo(0, markerY + 8);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawGuide(ctx: CanvasRenderingContext2D, points: Point[], color: string) {
  // Show only the opening arc: players still need to judge range and wind.
  const limit = Math.min(points.length, Math.max(2, Math.ceil(points.length * 0.23)));
  let last: Point | undefined;
  for (let i = 0; i < limit; i++) {
    const point = points[i];
    if (last && Math.hypot(point.x - last.x, point.y - last.y) < 15) continue;
    ctx.globalAlpha = 0.8 * (1 - i / limit) + 0.18;
    ellipse(ctx, point.x, point.y, 2.2, 2.2, color);
    last = point;
  }
  ctx.globalAlpha = 1;
}

function drawProjectile(ctx: CanvasRenderingContext2D, points: Point[], progress: number, element: RaftElement, color: string, special: boolean, now: number, reducedMotion: boolean) {
  if (!points.length) return;
  const position = Math.max(0, Math.min(1, progress)) * (points.length - 1);
  const index = Math.floor(position);
  const from = points[index];
  const to = points[Math.min(index + 1, points.length - 1)];
  const mix = position - index;
  const point = { x: from.x + (to.x - from.x) * mix, y: from.y + (to.y - from.y) * mix };

  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  points.slice(0, index + 1).forEach((sample, i) => {
    if (i === 0) ctx.moveTo(sample.x, sample.y);
    else ctx.lineTo(sample.x, sample.y);
  });
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
  ctx.globalAlpha = 1;

  const size = special ? 1.3 : 1;
  const start = Math.max(0, index - (element === "fire" ? 22 : 12));
  const trail = points.slice(start, index + 1);
  trail.push(point);
  const tailLength = Math.max(1, trail.length - 1);
  // Trails follow the actual simulated arc, preserving the same aiming rules.
  for (let i = 1; i < trail.length; i++) {
    const tail = i / tailLength;
    ctx.globalAlpha = tail * (element === "fire" ? 0.65 : 0.36);
    ctx.lineWidth = (element === "fire" ? 3 + tail * 14 : 2 + tail * 7) * size;
    ctx.strokeStyle = element === "fire" ? (i % 3 === 0 ? "#ffd86a" : "#fa7035") : color;
    ctx.beginPath();
    ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
    ctx.lineTo(trail[i].x, trail[i].y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  if (point.y < 12) {
    // High lobs remain trackable when their arc rises outside the viewport.
    const x = Math.max(14, Math.min(WIDTH - 14, point.x));
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, 8);
    ctx.lineTo(x - 7, 19);
    ctx.lineTo(x + 7, 19);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  }

  const previous = points[Math.max(0, index - 1)];
  const angle = Math.atan2(point.y - previous.y, point.x - previous.x);
  const motionTime = reducedMotion ? 0 : now / 1000;
  ctx.translate(point.x, point.y);
  ctx.scale(size, size);
  if (element === "shadow") {
    const sphere = ctx.createRadialGradient(-3, -3, 1, 0, 0, 14);
    sphere.addColorStop(0, "#e8d4ff");
    sphere.addColorStop(0.23, "#9655dc");
    sphere.addColorStop(0.67, "#3b1c68");
    sphere.addColorStop(1, "#8d50d800");
    ctx.fillStyle = sphere;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#c393ef";
    ctx.lineWidth = 1.4;
    ctx.rotate(motionTime * 3);
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 6, 0.6, 0, Math.PI * 1.45);
    ctx.stroke();
    ellipse(ctx, -11, 5, 2, 2, "#dbb4ff");
    ellipse(ctx, 13, -7, 1.5, 1.5, "#ac7ee2");
  } else if (element === "electric") {
    ellipse(ctx, 0, 0, 10, 10, "#edb820");
    ellipse(ctx, -1, -1, 7, 7, "#fff297");
    ellipse(ctx, -2, -2, 3, 3, "#fffce9");
    ctx.strokeStyle = "#fff1a5";
    ctx.lineWidth = 2;
    const flicker = Math.floor(motionTime * 10) % 2;
    for (let arc = 0; arc < 4; arc++) {
      ctx.save();
      ctx.rotate(arc * Math.PI / 2 + flicker * 0.18);
      ctx.beginPath();
      ctx.moveTo(8, -3);
      ctx.lineTo(15, -6);
      ctx.lineTo(12, 1);
      ctx.lineTo(19, 4);
      ctx.stroke();
      ctx.restore();
    }
  } else if (element === "fire") {
    ctx.rotate(angle);
    ctx.fillStyle = "#f67b35";
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.quadraticCurveTo(5, -14, -14, -10);
    ctx.lineTo(-27, -14);
    ctx.lineTo(-20, -3);
    ctx.lineTo(-35, 2);
    ctx.lineTo(-18, 8);
    ctx.quadraticCurveTo(3, 16, 14, 0);
    ctx.fill();
    ellipse(ctx, -1, 0, 11, 6, "#ffca59");
    ellipse(ctx, 4, 0, 6, 3, "#fff0b0");
  } else {
    ctx.rotate(motionTime * 6);
    ctx.fillStyle = "#ad8460";
    ctx.strokeStyle = "#513d32";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-11, -4);
    ctx.lineTo(-4, -11);
    ctx.lineTo(6, -10);
    ctx.lineTo(12, -2);
    ctx.lineTo(8, 9);
    ctx.lineTo(-3, 12);
    ctx.lineTo(-12, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#d6b391";
    ctx.beginPath();
    ctx.moveTo(-8, -3);
    ctx.lineTo(-2, -8);
    ctx.lineTo(5, -6);
    ctx.lineTo(1, 1);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(1, 1);
    ctx.lineTo(7, 5);
    ctx.lineTo(6, 8);
    ctx.stroke();
  }
  ctx.restore();
}

function drawImpact(ctx: CanvasRenderingContext2D, impact: NonNullable<RaftArenaProps["impact"]>) {
  const { point, damage, color } = impact;
  const x = Math.max(22, Math.min(WIDTH - 22, point.x));
  const y = Math.max(35, Math.min(HEIGHT - 20, point.y));
  ctx.save();
  ctx.strokeStyle = damage ? color : "#cee5ed";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  for (let i = 0; i < 10; i++) {
    const angle = i / 10 * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * 14, y + Math.sin(angle) * 14);
    ctx.lineTo(x + Math.cos(angle) * (i % 2 ? 29 : 36), y + Math.sin(angle) * (i % 2 ? 29 : 36));
    ctx.stroke();
  }
  if (damage > 0) {
    ctx.font = "700 27px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#282239";
    ctx.strokeText(`−${damage}`, x, y - 38);
    ctx.fillStyle = "#fff5dc";
    ctx.fillText(`−${damage}`, x, y - 38);
  }
  ctx.restore();
}

export default function RaftArena(props: RaftArenaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef(props);
  const redrawRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    sceneRef.current = props;
    redrawRef.current?.();
  }, [props]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const background = document.createElement("canvas");
    const backgroundCtx = background.getContext("2d");
    const sprites = new Map<string, SpriteImages>();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let frame: number | null = null;
    let disposed = false;
    let onScreen = true;
    let previousHealth: [number, number] = [...sceneRef.current.health];
    let previousPokemon: [string, string] = [...sceneRef.current.pokemon];
    let previousTurn = sceneRef.current.turn;
    let previouslyActive = false;
    let previousImpact: RaftArenaProps["impact"] = null;
    const hitStarted: [number, number] = [-Infinity, -Infinity];
    const walkStarted: [number, number] = [-Infinity, -Infinity];

    const shooterFor = (flight: NonNullable<RaftArenaProps["flight"]>): 0 | 1 =>
      flight.shooter ?? ((flight.shot.points[0]?.x ?? 175) < WIDTH / 2 ? 0 : 1);

    const updateAnimations = (scene: RaftArenaProps, now: number) => {
      for (const side of [0, 1] as const) {
        if (scene.health[side] < previousHealth[side]) hitStarted[side] = now;
        if (scene.health[side] > previousHealth[side] || scene.pokemon[side] !== previousPokemon[side]) {
          hitStarted[side] = -Infinity;
          walkStarted[side] = -Infinity;
        }
      }
      if (scene.impact && scene.impact !== previousImpact && scene.impact.damage > 0) {
        const target = scene.impact.point.x < WIDTH / 2 ? 0 : 1;
        hitStarted[target] = now;
      }
      if (scene.active && !previouslyActive) {
        walkStarted[0] = now;
        walkStarted[1] = now;
      } else if (scene.active && scene.turn !== previousTurn) {
        walkStarted[scene.turn] = now;
      }
      previousHealth = [...scene.health];
      previousPokemon = [...scene.pokemon];
      previousTurn = scene.turn;
      previouslyActive = scene.active;
      previousImpact = scene.impact;
    };

    const animationFor = (scene: RaftArenaProps, side: 0 | 1, now: number): SpriteAnimation => {
      if (scene.health[side] <= 0 || now - hitStarted[side] < 650) {
        return { pose: "hit", elapsed: Math.min(1000, now - hitStarted[side]) };
      }
      if (scene.flight && shooterFor(scene.flight) === side && now - scene.flight.startedAt < 650) {
        return { pose: "attacking", elapsed: now - scene.flight.startedAt };
      }
      if (scene.emote?.side === side && now - scene.emote.startedAt < 1200) {
        return { pose: "taunting", elapsed: now - scene.emote.startedAt };
      }
      if (now - walkStarted[side] < 900) return { pose: "walking", elapsed: now - walkStarted[side] };
      return { pose: "breathing", elapsed: now + side * 280 };
    };

    const draw = (now: number) => {
      frame = null;
      if (disposed || document.hidden || !onScreen) return;
      const scene = sceneRef.current;
      updateAnimations(scene, now);
      const time = reducedMotion ? 0 : now / 1000;
      ctx.setTransform(canvas.width / WIDTH, 0, 0, canvas.height / HEIGHT, 0, 0);
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      if (backgroundCtx) ctx.drawImage(background, 0, 0, WIDTH, HEIGHT);
      else drawBackground(ctx);
      drawWaves(ctx, time);
      drawRaft(ctx, 0, scene.pokemon[0], sprites.get(scene.pokemon[0]), scene.health[0], scene.active && scene.turn === 0, animationFor(scene, 0, now), time, reducedMotion);
      drawRaft(ctx, 1, scene.pokemon[1], sprites.get(scene.pokemon[1]), scene.health[1], scene.active && scene.turn === 1, animationFor(scene, 1, now), time, reducedMotion);
      if (scene.active && !scene.flight) drawGuide(ctx, scene.preview, TEAM_COLORS[scene.turn]);
      if (scene.flight) {
        const windup = reducedMotion ? 0 : Math.min(160, scene.flight.duration * 0.2);
        const progress = (now - scene.flight.startedAt - windup) / Math.max(1, scene.flight.duration - windup);
        const shooter = shooterFor(scene.flight);
        const pokemon = RAFT_SPRITES[scene.pokemon[shooter]];
        drawProjectile(ctx, scene.flight.shot.points, progress, pokemon?.element ?? "shadow", pokemon?.color ?? TEAM_COLORS[shooter], scene.flight.shot.kind === "special", now, reducedMotion);
      }
      if (scene.impact) drawImpact(ctx, scene.impact);
      const actionUntil = Math.max(hitStarted[0] + 650, hitStarted[1] + 650, walkStarted[0] + 900, walkStarted[1] + 900,
        scene.emote ? scene.emote.startedAt + 1200 : 0, scene.flight ? scene.flight.startedAt + Math.max(650, scene.flight.duration) : 0);
      if (!reducedMotion || now < actionUntil) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    const requestDraw = () => {
      if (!disposed && frame === null) frame = window.requestAnimationFrame(draw);
    };
    redrawRef.current = requestDraw;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(bounds.width * ratio));
      const height = Math.max(1, Math.round(width / 2));
      canvas.width = width;
      canvas.height = height;
      background.width = width;
      background.height = height;
      if (backgroundCtx) {
        backgroundCtx.setTransform(width / WIDTH, 0, 0, height / HEIGHT, 0, 0);
        drawBackground(backgroundCtx);
      }
      requestDraw();
    };

    for (const name of new Set([...Object.keys(RAFT_SPRITES), ...sceneRef.current.pokemon])) {
      const sheet = new Image();
      const fallback = new Image();
      for (const sprite of [sheet, fallback]) {
        sprite.onload = requestDraw;
        sprite.onerror = requestDraw;
      }
      const source = RAFT_SPRITES[name];
      if (source?.sheet) sheet.src = source.sheet;
      fallback.src = source?.fallback ?? `/images/puzzle/${name}.png`;
      sprites.set(name, { sheet, fallback });
    }

    const onMotionChange = () => {
      reducedMotion = motionQuery.matches;
      requestDraw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) requestDraw();
    });
    visibilityObserver.observe(canvas);
    motionQuery.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", requestDraw);
    resize();

    return () => {
      disposed = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
      observer.disconnect();
      visibilityObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", requestDraw);
      redrawRef.current = null;
      for (const images of sprites.values()) {
        for (const sprite of [images.sheet, images.fallback]) {
          sprite.onload = null;
          sprite.onerror = null;
        }
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="raft-canvas"
      width={WIDTH}
      height={HEIGHT}
      role="img"
      aria-label={`${props.pokemon[0]} and ${props.pokemon[1]} face each other on wooden rafts in a moonlit bay. ${props.active ? `Player ${props.turn + 1} is aiming.` : "The bay is ready for a battle."}`}
      style={{ display: "block", width: "100%", aspectRatio: "2 / 1" }}
    >
      Two Pokémon battle across a moonlit bay. Use the angle, power, and fire controls below the arena to take your turn.
    </canvas>
  );
}
