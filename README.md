# Mon — Anthony Cabigayan

A responsive portfolio with a dark Pokémon-inspired theme, Gengar purple and Gible blue accents, frosted glass surfaces, Manrope headings, DM Sans body text, custom artwork, project detail dialogs, a career timeline, and a Vue-powered interests section.

## Run locally

Use Node.js 22.18 or newer (Node.js 24 recommended). In this folder run:

```sh
npm install
npm run dev
```

Open http://localhost:3000. For a production build:

```sh
npm run build
npm start
```

A pnpm lockfile is also included if you prefer pnpm.

## How the frameworks fit together

- **Next.js** provides the App Router, page metadata, pre-rendering, and production build.
- **React** renders the portfolio and handles navigation, project dialogs, and the email form.
- **Vue 3** powers the interactive Beyond the Terminal section. It is loaded dynamically and mounts into a dedicated DOM node. React never renders inside that node, and the Vue app is unmounted when its React wrapper is removed.

The hosted preview uses the same application components with the Sites Vinext adapter. This download runs directly on Next.js and has been checked with a native Next.js production build.

## Where to edit

| Content | File |
| --- | --- |
| Hero introduction and artwork | `components/hero.tsx` |
| Contact and timeline | `components/portfolio.tsx` |
| Floating Pokéball menu and shared section links | `components/floating-menu.tsx`, `lib/navigation.ts` |
| Habitat dock (bottom-left picker with countdown ring and pause) and the Pokédex button | `HabitatDock` and `PokedexButton` in `components/pokemon-theme.tsx` |
| Email modal and Formspree endpoint | `components/contact-modal.tsx` |
| Selected work titles, descriptions, and preview paths | `lib/projects.ts` |
| Project cards and interactive preview dialogs | `components/project-card.tsx` |
| Preview card and dialog styles | `app/project-previews.css` |
| Supplied HTML walkthroughs and shared embed styles | `public/project-previews/` |
| Base layout and responsive rules | `app/globals.css` |
| Glass surfaces, typography, and visual refinements | `app/glass-theme.css` |
| Illustrated hero layout and responsive rules | `app/hero.css` |
| Final purple/blue palette, panels, buttons, and character labels | `app/pokemon-theme.css` |
| Gible (Ground) palette | `app/ground-theme.css` |
| Palettes for every habitat except Gengar and Gible, built from a few tokens each (the trainer card and handheld derive theirs from the same tokens for the newer types) | `app/elemental-theme.css` |
| Edge scenery for the thirteen newer habitats | `components/type-scenery.tsx` |
| National Pokédex numbers and types for every resident, generated from PokeAPI data by `scripts/build-pokedex.mjs` | `lib/pokemon-dex.ts` |
| Habitat rosters (18 habitats, one per type; 28 per habitat: 23 regulars and 5 rare visitors), and theme metadata | `lib/pokemon-roster.ts` |
| Automatic habitat changes (shuffled every 30 s from the start of each visit; in order or off from the picker) | `lib/theme-rotation.ts` |
| Side-view sprite download from PMD SpriteCollab | `scripts/fetch-habitat-motion.mjs` |
| Grumpy residents: odds, cooldown, shot timing, cursor knock-out | `lib/pokemon-ambush.ts`, `components/cursor-ambush.tsx` |
| Self-hosted fonts and their OFL licenses | `public/fonts/` |
| Vue interests and tab behavior | `components/craft-app.ts` |
| React/Vue lifecycle boundary | `components/vue-craft.tsx` |
| Page title and description | `app/layout.tsx` |
| MON, Gengar, and Gible hero artwork | `public/images/mon-pokemon-hero.png` |
| Favicon | `public/favicon.svg` |

Selected work includes TESDA-TRACK, Application Exam Management, HRIS Process, Job Application, PCR Management, PDS Generation, and ARTA Client Survey. A separate Personal projects group shows Zepimon (`personalProjects` in `lib/projects.ts`). Each card shows its supplied HTML walkthrough and opens an interactive preview with working step navigation. A separate link opens the complete walkthrough in a new tab. The previews use simplified screens and sample data. The email and GitHub links come from your supplied HTML; placeholder social-profile links were omitted.

The walkthroughs are bundled under `public/project-previews/` so GitHub Pages exports include their HTML, CSS, and JavaScript. Original source folders remain separate. The shared `embed.js` and `embed.css` adapt the same HTML for thumbnails and dialogs; opening a page without a preview parameter shows the full original introduction. Walkthrough fonts request Google Fonts with local system fallbacks.

The hero pairs bold name typography with the supplied MON, Gengar, and Gible artwork. The original image is used unchanged, with a soft purple-and-blue glow behind the characters.

The hero keeps the professional name, role, and work link prominent, with the personality line “Serious about systems. Soft spot for Pokémon.” The purple and blue theme continues through navigation, project previews, badges, the career timeline, interest tabs, and the contact panel. `app/pokemon-theme.css` loads after the base glass and hero styles.

## Habitat rotation

The habitat picker lives in a small dock at the bottom-left of the screen, away from the trainer card and the Pokédex: the partner Pokémon in a circle whose rim counts down to the next habitat, a badge showing the mode, and a pause button (inside the picker on phones, where the dock is just the circle). Every visit opens in a shuffled habitat (any of the eighteen on a first visit, never the one you saw last time) and keeps shuffling to a new habitat and cast every 30 seconds. Picking a habitat in the picker turns that off for the rest of the visit, so it stays where you put it; you can also switch to "In order", change the interval (30 s, 1 min or 5 min) or pause. None of this is saved: the next visit starts shuffling every 30 seconds again. Only the last habitat is remembered, so the next visit can open somewhere else. The pre-paint script in `app/layout.tsx` picks the first habitat before the first frame. Each open tab rotates on its own; only the Pokédex is shared between tabs. Change `DEFAULT_ROTATION` in `lib/theme-rotation.ts` for a different starting rotation.

## Grumpy Pokémon

Not every resident wants to be bothered. Hovering a regular with a mouse has a 1 in 5 chance of an ambush: it turns to face the cursor, says “Hmph!”, and fires its signature move at the pointer, then dashes away from where it stood and goes back to roaming. A lock-on ring shows where the shot will land. A quick flick dodges the shot (“It missed!”). If the cursor is still there, the move's element decides what happens to it:

| Status | Moves | What happens to the cursor |
| --- | --- | --- |
| Fainted | Claw, Bite, Hit, Punch, Swift | Shatters into shards |
| Burned | Ember, Fire Plume, Dragon Flame/Plume | Catches fire, chars, crumbles to ash |
| Soaked | Water Gun, Water Splash | Wobbles, drips, slides into a puddle |
| Frozen solid | Ice Chunk | Encased in ice that cracks and breaks |
| Tangled up | Razor Leaf, Growth | Vines wrap it and drag it down |
| Badly poisoned | Sludge | Melts into a bubbling puddle |
| Possessed | Shadow Ball | Shudders, darkens, its spirit drifts off |
| Confused | Spiral | Spins with stars circling it |
| Blown away | Gust, Air Cutter | Tumbles off downwind |
| Crushed | Rock | Flattened by a falling rock |
| Fell in love | Fairy Sparkle | Heart pounds, floats off in hearts |

The status lasts 3 s, with the affected cursor drawn at twice its size while the real one is hidden, and the cursor is out of action: clicks and hovers do nothing until it reforms (scrolling and the keyboard still work). Frozen, crushed, tangled, melted and shattered cursors are pinned where they were hit; a burning cursor sticks to the pointer, soaked, possessed and charmed ones trail sluggishly behind it, a blown-away one tumbles off and drifts back, and a confused one moves the opposite way. Then it reassembles wherever the pointer is. The mappings are `MOVE_STATUS` and `STATUS_MOTION` in `lib/pokemon-ambush.ts`.

There is one habitat per type, eighteen in all, each led by its partner: Gengar (Ghost), Gible (Ground), Piplup (Water), Charmander (Fire), Bulbasaur (Grass), Eevee (Normal), Pikachu (Electric), Snorunt (Ice), Riolu (Fighting), Grimer (Poison), Pidgey (Flying), Ralts (Psychic), Caterpie (Bug), Geodude (Rock), Dratini (Dragon), Umbreon (Dark), Aron (Steel) and Togepi (Fairy). Each has 28 residents: 23 regulars and 5 legendaries or mythicals. Rock, Bug and Dark don't have enough legendaries to go round, so some of their rare visitors are Ultra Beasts or Paradox Pokémon. The habitat picker only counts the regulars and never names the rare visitors, so who turns up is a surprise. Only one legendary or mythical is ever on stage at a time.

Legendaries and mythicals are harder to catch. Each visit they slip the cursor 1–3 times (a shiny one more) before tiring enough to let you say hello: most teleport, squeezing to a sliver of light and reappearing in another part of the habitat with a taunt, while Ghost types usually phase instead, flickering intangibly so the cursor passes through them for 1.5 s. A failed catch (50%) makes them break free and get away again. About 40% of those escapes are an attack instead: the legendary or mythical calls out its signature move with its battle cry (“GRAAAH! Shadow Force!”), fires it at the cursor with a gold lock-on, and teleports away. A hit is a critical hit: a white flash, and the cursor is out of action for 3.5 s instead of 3 s (`LEGEND_KO_MS` and `LEGEND_ATTACK_ODDS` in `lib/pokemon-ambush.ts`). Their attacks share the one-every-7-seconds cooldown with everyone else. With reduced motion they say “Dodged!” instead of moving.

Only one ambush can happen every 7 seconds across the whole habitat. Ambushes are off for touch input, while the habitat is paused, and when reduced motion is preferred. To tune it, change `AMBUSH_ODDS`, `AMBUSH_COOLDOWN_MS`, `CURSOR_KO_MS` (3 s) and `CURSOR_HIT_RADIUS` in `lib/pokemon-ambush.ts`.

## Scroll reveal

Sections, project cards, and timeline entries fade in and rise as they enter the viewport, once per page load. Nearby entries stagger by 75ms, capped at 225ms. The effect respects reduced-motion settings, shows keyboard-focused content immediately, and keeps content readable when JavaScript is unavailable.

Edit `hooks/use-scroll-reveal.ts` to change the targets and trigger, and `app/scroll-reveal.css` to change timing or travel distance.

## Included behavior

The interests section includes traveling, running, watching anime, infrastructure, Python and automation, and collaboration. Edit the entries in `components/craft-app.ts` to personalize the descriptions.

Manrope and DM Sans are bundled as variable WOFF2 fonts and preloaded by the page layout. Font files are served locally; the page does not depend on an external font service. Glass panels use translucent gradients, soft borders, and backdrop blur, with a solid-background fallback where blur is unsupported.

Responsive navigation; project dialogs with focus handling and Escape support; Vue tabs with arrow, Home, and End key navigation; reduced-motion support; and skip navigation. A floating Pokéball with the theme's contrasting accent color opens circular shortcuts for the page destinations, the games hub, and a single **Let’s talk** action. It closes on Escape, outside clicks, or leaving the menu with the keyboard.

**Let’s talk** in either navigation menu and the email icons beside GitHub open the same modal with required email and message fields. Drafts stay available when switching between these entry points. The form posts to `https://formspree.io/f/xvkgbwbr`, shows sending/success/error feedback, and keeps the draft after a failed request. Formspree handles delivery to the recipient configured for that form, so the GitHub Pages site needs no server. Visitors can also open their email app using the direct email link.

The Vue build flags are configured in `next.config.ts`. The scripts use Webpack so the same explicit flags are applied in development and production.

## Verification

- Native Next.js 16 production compilation, TypeScript, and page prerendering passed.
- Hosted application TypeScript check passed.
- Desktop layout, project dialogs, Vue tab clicks and keyboard navigation were checked in a browser.
- A 390px mobile frame (375px content width with a scrollbar) had no horizontal overflow. Its menu and scrolling project dialog were checked.

## CV Studio

Open `/cv` for a client-only CV editor with an A4 preview and PDF export. Visitors can edit Mon's example or choose **Start my CV** for a blank form. Add or remove employment, project, education, certification, training, and recognition entries. Blank sections are omitted, longer entries flow to additional pages, and unsupported font characters produce a clear message rather than disappearing.

The editor does not send CV input to a server or save it to browser storage. A draft stays in the current tab until refresh or navigation; export before leaving. The download is a selectable-text PDF with embedded, locally served DM Sans fonts.

- `lib/cv-data.ts`: Anthony's confirmed employment, freelance period, education, certifications, eligibility, training, and awards. CV projects are derived from `lib/projects.ts`, and certifications also appear on the homepage's Journey section. An entry's optional `url` (e.g. a Credly badge) becomes a clickable "Verify on Credly" link in the PDF and on the site.
- `lib/cv-pdf.ts`: shared layout for the SVG preview and PDF, including wrapping and pagination.
- `components/cv/cv-builder.tsx`: visitor form, validation, section tabs, and download actions.
- `app/cv/cv.css`: CV Studio's responsive dark glass interface.
- `public/cv/Anthony-Cabigayan-CV.pdf`: finished two-page CV linked from the hero and editor.

After changing Mon's data, regenerate his static download with `npm run generate:cv` before building. This uses the same PDF renderer as visitor exports. No API key, account, database, or third-party document service is needed. Site sharing controls determine who can access the hosted builder.

## Mini-games

The 10+ mini-games live in the separate [Raro games site](https://monqzxc.github.io/raro/). The Games links on the homepage and full portfolio open it directly.
