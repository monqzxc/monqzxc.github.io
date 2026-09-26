"use client";

import { useEffect, useRef } from "react";
import type { Point, ShotResult } from "@/lib/raft-battle";

type RaftArenaProps = {
  pokemon: [string, string];
  health: [number, number];
  turn: 0 | 1;
  preview: Point[];
  flight: { shot: ShotResult; startedAt: number; duration: number } | null;
  impact: { point: Point; damage: number; color: string } | null;
  active: boolean;
};

const WIDTH = 1000;
const HEIGHT = 500;
const TEAM_COLORS = ["#caafff", "#f5cf73"];
const SPRITES = ["gengar", "pikachu", "charizard", "mew"];

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

function drawRaft(ctx: CanvasRenderingContext2D, side: 0 | 1, sprite: HTMLImageElement | undefined, health: number, current: boolean, time: number) {
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
  if (health <= 0) {
    ctx.globalAlpha = 0.48;
    ctx.translate(0, 9);
  }
  if (sprite?.complete && sprite.naturalWidth > 0) {
    ctx.save();
    // The source portraits face left. Mirror the left team toward its rival.
    ctx.scale(side === 0 ? -1 : 1, 1);
    ctx.drawImage(sprite, -56, 257, 112, 112);
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
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-7, 235);
    ctx.lineTo(7, 235);
    ctx.lineTo(0, 243);
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

function drawProjectile(ctx: CanvasRenderingContext2D, points: Point[], progress: number, color: string) {
  if (!points.length) return;
  const position = Math.max(0, Math.min(1, progress)) * (points.length - 1);
  const index = Math.floor(position);
  const from = points[index];
  const to = points[Math.min(index + 1, points.length - 1)];
  const mix = position - index;
  const point = { x: from.x + (to.x - from.x) * mix, y: from.y + (to.y - from.y) * mix };

  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.slice(0, index + 1).forEach((sample, i) => {
    if (i === 0) ctx.moveTo(sample.x, sample.y);
    else ctx.lineTo(sample.x, sample.y);
  });
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
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
  } else {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ellipse(ctx, point.x, point.y, 7, 7, color);
    ellipse(ctx, point.x - 1, point.y - 1, 3, 3, "#fff9eb");
    ctx.restore();
  }
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
    const sprites = new Map<string, HTMLImageElement>();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let frame: number | null = null;
    let disposed = false;

    const draw = (now: number) => {
      frame = null;
      if (disposed || document.hidden) return;
      const scene = sceneRef.current;
      const time = reducedMotion ? 0 : now / 1000;
      ctx.setTransform(canvas.width / WIDTH, 0, 0, canvas.height / HEIGHT, 0, 0);
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      if (backgroundCtx) ctx.drawImage(background, 0, 0, WIDTH, HEIGHT);
      else drawBackground(ctx);
      drawWaves(ctx, time);
      drawRaft(ctx, 0, sprites.get(scene.pokemon[0]), scene.health[0], scene.active && scene.turn === 0, time);
      drawRaft(ctx, 1, sprites.get(scene.pokemon[1]), scene.health[1], scene.active && scene.turn === 1, time);
      if (scene.active && !scene.flight) drawGuide(ctx, scene.preview, TEAM_COLORS[scene.turn]);
      if (scene.flight) {
        const progress = (now - scene.flight.startedAt) / Math.max(1, scene.flight.duration);
        drawProjectile(ctx, scene.flight.shot.points, progress, TEAM_COLORS[scene.turn]);
      }
      if (scene.impact) drawImpact(ctx, scene.impact);
      if (!reducedMotion || (scene.flight && now < scene.flight.startedAt + scene.flight.duration)) {
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

    for (const name of SPRITES) {
      const sprite = new Image();
      sprite.onload = requestDraw;
      sprite.onerror = requestDraw;
      sprite.src = `/images/puzzle/${name}.png`;
      sprites.set(name, sprite);
    }

    const onMotionChange = () => {
      reducedMotion = motionQuery.matches;
      requestDraw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    motionQuery.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", requestDraw);
    resize();

    return () => {
      disposed = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
      observer.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", requestDraw);
      redrawRef.current = null;
      for (const sprite of sprites.values()) {
        sprite.onload = null;
        sprite.onerror = null;
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
