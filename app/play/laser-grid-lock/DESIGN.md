---
name: Laser Grid Lock
description: A standalone neon cyberpunk slate puzzle console.
colors:
  laser-cyan: "#6fffe3"
  laser-muted: "#a6b8cf"
  slate-page: "#0f172a"
  slate-console: "#111d32"
  slate-board: "#0a1222"
  text-bright: "#edf6ff"
  console-border: "#34465f"
  divider: "#29364c"
  portal-red: "#ff577b"
  mirror-silver: "#d6e4ff"
  beam-core: "#90ffe8"
  beam-glow: "#2afaca"
typography:
  display:
    fontFamily: "Laser Manrope, sans-serif"
    fontSize: "clamp(34px, 4.5vw, 54px)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Laser Manrope, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-.03em"
  body:
    fontFamily: "Laser Manrope, sans-serif"
    fontSize: "14px"
    lineHeight: 1.8
  hud-value:
    fontFamily: "var(--font-mono)"
    fontSize: "26px"
    fontWeight: 500
    lineHeight: 1.2
  label:
    fontFamily: "Laser Manrope, sans-serif"
    fontSize: "10px"
    letterSpacing: ".12em"
rounded:
  console: "16px"
  reset: "6px"
  board-control: "5px"
  mirror: "2px"
spacing:
  page-gutter: "36px"
  desktop-columns: "64px"
  console-inset: "25px"
  board-gap: "6px"
components:
  console:
    backgroundColor: "{colors.slate-console}"
    rounded: "{rounded.console}"
    padding: "0 25px"
  shift-button:
    backgroundColor: "transparent"
    textColor: "#8aa7c8"
    rounded: "{rounded.board-control}"
  shift-button-hover:
    backgroundColor: "#233e50"
    textColor: "{colors.laser-cyan}"
  reset-button:
    backgroundColor: "transparent"
    textColor: "#b9c9df"
    rounded: "{rounded.reset}"
    padding: "10px"
---

# Design System: Laser Grid Lock

## Overview

**Creative North Star: "Neon cyberpunk slate game console"**

This document applies only to `/play/laser-grid-lock/`. The user-pinned direction combines a deep slate console, cyan laser, red black hole, and pixel-rendered Deoxys sprite. A compact HUD and framed square puzzle give the game a legible instrument-panel character.

This is a source-derived record of `laser-grid-lock.css` and `components/laser-grid-lock.tsx`, not a portfolio-wide design system. No PRODUCT.md or rendered browser QA was available for this documentation pass. Values describe the implementation; browser appearance, contrast, touch ergonomics, and animation quality remain unverified here.

**Key Characteristics:**

- Cyan light against layered slate surfaces.
- A square 5 by 5 board with controls outside all four edges.
- Bold sans-serif headings, small utility labels, and tabular monospace counters.
- Pixel sprite travel and a glowing portal communicate a solved route.

## Colors

### Primary

Laser cyan marks the title accent, level counter, status dot, focus outlines, and active control feedback. The beam uses a separate bright core and blurred glow.

### Secondary

Portal red identifies the destination and its legend marker. The portal changes to mint/cyan on success. Mirror silver separates reflective surfaces from both the beam and the board.

### Neutral

Slate page, console, and board surfaces establish three tonal layers. Bright text carries headings; muted text carries instructions and metadata. Fine blue-slate borders separate the grid, HUD, and console edges.

**The Signal Color Rule.** Preserve cyan for the light and connection feedback, and red for the unsolved portal, so the puzzle remains readable at a glance.

## Typography

The route loads local Manrope as `Laser Manrope` from `/fonts/manrope-latin.woff2`, with sans-serif fallback. The HUD and coordinates inherit the project's `--font-mono` variable; that variable is an external dependency rather than a route-owned font definition.

The display role is the page title; the headline role belongs to the desktop briefing. Body copy is relaxed within a narrow 295px measure. HUD labels are uppercase, while counters use tabular figures. Instruction text is 13px with 1.65 line height. Sector metadata is 11px; tile coordinates are 8px, reduced to 7px on mobile. These small annotations supplement the board rather than provide its only explanation.

## Layout

The top and bottom bars have a 1240px maximum width. Main content has a 1100px maximum width and 46px top padding. Desktop uses a briefing column of at least 220px and a game column capped at 590px. The board stays square; its five equal rows and columns sit inside a three-by-three frame, with four external arrow banks. Desktop arrow tracks are 36px.

At 1500px and above, main vertical padding becomes 64px and the column gap becomes 85px. At 850px and below, the briefing becomes 210px wide, the gap becomes 26px, console padding becomes 16px, and the reset text hides. At 660px and below, the briefing hides, the console stacks beneath the title, and a short mobile instruction appears. The console is full width up to 530px with 12px horizontal padding; reset text returns. Mobile arrow tracks are 32px at the sides and 38px above/below, with 3px gaps and a 32px minimum control height.

At 380px and below, HUD spacing contracts to 18px, reset becomes icon-only again, and legend/mobile instructions become 9px. The mobile instruction explains wrapping, mirror deflection toward the destination, and fixed endpoints.

## Elevation & Depth

Depth comes mainly from tonal surfaces and fine borders. Glow is reserved for the laser and portal; sprite and mirror shadows separate small pieces from the grid. The console itself has no box shadow. The beam combines a 10-unit translucent stroke blurred by 5px with a 2.5-unit crisp core in the 500 by 500 SVG coordinate system. The sprite occupies the highest board layer, above the portal, beam, and mirrors.

## Shapes

The console has the broadest rounded corners. The board and arrow buttons use tighter corners, reset is slightly softer, and mirrors are short rounded bars rotated by 45 degrees. The portal and its tilted orbit are circular/elliptical. Grid cells retain square internal geometry with one-pixel separators.

## Components

### Puzzle console and HUD

The HUD groups Level, Moves, and Time with reset aligned to the right. Dividers separate the HUD, board status, and legend. Reset uses a thin outline, transparent resting background, and a lighter slate hover fill. Undo is a text action with an icon and becomes dimmed when unavailable.

### External shift controls

Twenty arrow buttons shift rows or columns with wrapping behavior. Controls name axis, index, and direction for assistive technology. Hover adds a slate-teal fill and cyan icon; active adds a brighter fill. Solved state disables shift controls at 0.3 opacity. Keyboard focus receives a 2px cyan outline with 4px offset. Small-screen target dimensions are implementation facts, not a claim of touch-target compliance.

### Board, beam, and fixed endpoints

The Deoxys origin is row 1, column 1; the black-hole destination is row 5, column 5. Endpoints remain fixed while mirror tiles shift. Mirrors beneath endpoints are dimmed. The board exposes a textual description of mirror locations; the SVG beam and decorative portal are hidden from assistive technology. The sprite uses pixelated image rendering and the local `/images/laser/deoxys.png` asset.

### Status and solve sequence

A live status region describes guidance, loops, connection, and portal entry. On solve, the sprite begins moving after 450ms and travels for 2600ms, then fades and scales into the portal over 500ms. The next sector loads after the travel duration plus 1400ms. Reduced-motion CSS removes transitions and animations; JavaScript snaps the sprite to the endpoint after 450ms, with the next sector loading after 1550ms. These timings are source observations and have not been visually verified.

### Navigation and attribution

A compact top bar links back to Playground and identifies the arcade. The bottom bar includes sprite attribution and fan-game copyright text. The page uses the shared skip-link treatment from outside this route.

## Do's and Don'ts

- **Do** preserve the square board, external arrow banks, fixed endpoints, and visible HUD.
- **Do** keep the sprite crisp and reserve luminous effects for game signals.
- **Do** retain textual control labels, focus outlines, live status, and reduced-motion handling.
- **Don't** apply this route's palette or typography to the global portfolio by inference.
- **Don't** replace the pinned cyan laser, red portal, or Deoxys identity with unrelated decoration.
- **Don't** treat this source record as proof of rendered, accessibility, or gameplay QA.
