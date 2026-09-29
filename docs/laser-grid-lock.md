# Laser Grid Lock

Play at `/play/laser-grid-lock/`. Deoxys follows a completed beam path into the portal before the next level starts. The game is fully client-side and included in the static export.

| Tier | Levels | Mechanics |
| --- | --- | --- |
| Beginner | 1–3 | Mirrors and one fixed portal |
| Intermediate | 4–6 | Anchored steel terrain |
| Advanced | 7–9 | Solrock: patrolling, clockwise-rotating deflector |
| Expert | 10–12 | Minior: splitter; Lunatone: absorber; prism and sequential targets |
| Master | 13 onward | Combined mechanics; moving portal; Rayquaza boss from level 15 |

The difficulty selector jumps to the first level of a tier. Further Master levels use new deterministic scrambles. Every generated puzzle is validated by replaying its solution through the full turn simulation, including monster movement and EMP.

## Pokémon encounters

- **Solrock — Solar Deflector:** patrols one tile after each shift and rotates its outgoing beam direction clockwise. The arrow badge shows its current direction.
- **Lunatone — Lunar Absorber:** absorbs beams and charges once per consecutive shift hit. The fourth hit triggers EMP unless the circuit is complete. The charge badge shows progress; a missed hit clears it.
- **Minior — Prism Splitter:** turns incoming light into perpendicular cyan and amber branches. Both branches can be required to light the circuit simultaneously.
- **Rayquaza — Delta Stream Guardian:** appears at level 15 and beyond. Its three shielded phases seal the portal and lock rows 2, 3, then 4 in turn. The fourth phase drops the shield and releases every row for one turn. Complete the full circuit on arrival at that opening. Column shifts remain legal throughout; a locked-row attempt changes nothing and consumes no turn. Any beam hitting Rayquaza's body is absorbed, even during the opening.

The boss panel shows the current phase, locked row, and shifts until the opening. The portal carries a lock while sealed, and a dashed band marks the wind-locked row. Initial storm phase varies with the puzzle; the four-phase cycle is deterministic. **Challenge Rayquaza** jumps directly to level 15. Undo restores the storm phase along with all other state. These abilities are custom rules for this fan game.

## Turn rules

1. Shift the selected row or column. Steel stays at its coordinates; only the remaining slots wrap. Steel absorbs the normal laser.
2. Solrock moves one tile along its marked patrol and rotates its outgoing direction 90° clockwise. The visible arrow shows its current outgoing beam direction. Other Pokémon remain anchored. Rayquaza advances its storm phase once per successful shift.
3. Every second shift, the Master portal moves one tile along its rail. This is based on turns, not wall-clock time.
4. Trace all laser branches from the new snapshot. Mirrors turn light by 90°. Minior emits two perpendicular branches: cyan counterclockwise and amber clockwise relative to the incoming direction. Rayquaza's sealed portal rejects all hits until its exposed phase.
5. Check targets simultaneously. The amber core accepts only amber. Prism portals need both colors from two distinct incoming angles; Master level 14 introduces a second splitter and requires three angles. Hits never accumulate between turns. Sequential nodes must be visited in numeric order on one continuous branch, with a mirror between consecutive nodes; a complete sequence must reach the portal.
6. Lunatone absorbs the beam and gains one charge per shift hit, even if several branches hit it. A missed turn clears the streak. On the fourth consecutive hit, EMP restores the initial board with all column shifts replayed in their original order, discarding row shifts. Entity positions and the storm keep their current turn; charges clear. Completing the circuit takes priority over EMP.

Devices and monsters take precedence over movable mirrors beneath them. Mirrors under the emitter, targets, or entities are dimmed. Mirrors still move through those coordinates when a line is shifted.

Undo restores a complete snapshot: board, patrol phase, portal rail phase, charges, EMP state, and column baseline. Undo counts toward Moves but rewinds Turn. Reset restarts the current level and timer. Reduced-motion settings replace Deoxys's travel with an immediate portal placement.

## Development

- `lib/laser-grid.ts`: shared wrapping and path interpolation; original basic puzzles.
- `lib/laser-campaign.ts`: tier layouts, branch tracing, full turn transitions, validated generation.
- `components/laser-grid-lock.tsx`: interactive game, HUD, entities, guide, solve animation.
- `scripts/check-laser-grid.mjs`: terrain, patrols, EMP, prisms, sequence, rail, cycle and solvability tests.

Run `npm run test:laser`, `npm run typecheck`, and `npm run build`. On memory-constrained Windows hosts, `$env:CIRCLE_NODE_TOTAL='1'; npm.cmd run build` limits Next.js static generation to one worker without changing deployment settings.
