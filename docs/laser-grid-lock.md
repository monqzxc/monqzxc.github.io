# Laser Grid Lock

Play at `/play/laser-grid-lock/`. Deoxys follows a completed beam path into the portal before the next level starts. The game is fully client-side and included in the static export.

| Tier | Levels | Mechanics |
| --- | --- | --- |
| Beginner | 1–3 | Mirrors and one fixed portal |
| Intermediate | 4–6 | Anchored steel terrain |
| Advanced | 7–9 | Patrolling, clockwise-rotating deflectors |
| Expert | 10–12 | Split-Jaw, cyan/amber beams, Beam Eaters, prism and sequential targets |
| Master | 13 onward | Combined mechanics; portal rail advances every two player shifts |

The difficulty selector jumps to the first level of a tier. Further Master levels use new deterministic scrambles. Every generated puzzle is validated by replaying its solution through the full turn simulation, including monster movement and EMP.

## Turn rules

1. Shift the selected row or column. Steel stays at its coordinates; only the remaining slots wrap. Steel absorbs the normal laser.
2. Deflectors move one tile along their marked patrol and rotate their outgoing direction 90° clockwise. The visible arrow shows their current outgoing beam direction. Other monsters remain anchored.
3. Every second shift, the Master portal moves one tile along its rail. This is based on turns, not wall-clock time.
4. Trace all laser branches from the new snapshot. Mirrors turn light by 90°. Split-Jaw emits two perpendicular branches: cyan counterclockwise and amber clockwise relative to the incoming direction.
5. Check targets simultaneously. The amber core accepts only amber. Prism portals need both colors from two distinct incoming angles; Master level 14 introduces a second splitter and requires three angles. Hits never accumulate between turns. Sequential nodes must be visited in numeric order on one continuous branch, with a mirror between consecutive nodes; a complete sequence must reach the portal.
6. Beam Eaters absorb the beam and gain one charge per shift hit, even if several branches hit them. A missed turn clears the streak. On the fourth consecutive hit, EMP restores the initial board with all column shifts replayed in their original order, discarding row shifts. Entity positions keep their current turn; Eater charges clear. Completing the circuit takes priority over EMP.

Devices and monsters take precedence over movable mirrors beneath them. Mirrors under the emitter, targets, or entities are dimmed. Mirrors still move through those coordinates when a line is shifted.

Undo restores a complete snapshot: board, patrol phase, portal rail phase, charges, EMP state, and column baseline. Undo counts toward Moves but rewinds Turn. Reset restarts the current level and timer. Reduced-motion settings replace Deoxys's travel with an immediate portal placement.

## Development

- `lib/laser-grid.ts`: shared wrapping and path interpolation; original basic puzzles.
- `lib/laser-campaign.ts`: tier layouts, branch tracing, full turn transitions, validated generation.
- `components/laser-grid-lock.tsx`: interactive game, HUD, entities, guide, solve animation.
- `scripts/check-laser-grid.mjs`: terrain, patrols, EMP, prisms, sequence, rail, cycle and solvability tests.

Run `npm run test:laser`, `npm run typecheck`, and `npm run build`. On memory-constrained Windows hosts, `$env:CIRCLE_NODE_TOTAL='1'; npm.cmd run build` limits Next.js static generation to one worker without changing deployment settings.
