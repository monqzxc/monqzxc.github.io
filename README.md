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
- **React** renders the portfolio and handles navigation, project dialogs, and email copying.
- **Vue 3** powers the interactive Beyond the Terminal section. It is loaded dynamically and mounts into a dedicated DOM node. React never renders inside that node, and the Vue app is unmounted when its React wrapper is removed.

The hosted preview uses the same application components with the Sites Vinext adapter. This download runs directly on Next.js and has been checked with a native Next.js production build.

## Where to edit

| Content | File |
| --- | --- |
| Hero introduction and artwork | `components/hero.tsx` |
| Contact, projects, timeline | `components/portfolio.tsx` |
| Base layout and responsive rules | `app/globals.css` |
| Glass surfaces, typography, and visual refinements | `app/glass-theme.css` |
| Illustrated hero layout and responsive rules | `app/hero.css` |
| Final purple/blue palette, panels, buttons, and character labels | `app/pokemon-theme.css` |
| Self-hosted fonts and their OFL licenses | `public/fonts/` |
| Vue interests and tab behavior | `components/craft-app.ts` |
| React/Vue lifecycle boundary | `components/vue-craft.tsx` |
| Page title and description | `app/layout.tsx` |
| MON, Gengar, and Gible hero artwork | `public/images/mon-pokemon-hero.png` |
| Exact artwork prompt and desktop preview | `docs/hero-art-prompt.txt`, `docs/hero-preview.jpg` |
| Favicon | `public/favicon.svg` |

Project images are illustrative interface previews built from HTML/CSS, not screenshots of live TESDA records. Replace `InterfacePreview` with your own approved screenshots if desired. The email and GitHub links come from your supplied HTML; placeholder social-profile links were omitted.

The hero follows the supplied reference's composition, pairing bold name typography with an isometric MON sculpture above Gengar and Gible. Its transparent PNG was created with the built-in image generation tool and is included at 1254 × 1254 pixels. The exact prompt is included in `docs/hero-art-prompt.txt`.

The hero keeps the professional name, role, and work link prominent, with the personality line “Serious about systems. Soft spot for Pokémon.” The purple and blue theme continues through navigation, project previews, badges, the career timeline, interest tabs, and the contact panel. `app/pokemon-theme.css` loads after the base glass and hero styles.

## Scroll reveal

Sections, project cards, and timeline entries fade in and rise as they enter the viewport, once per page load. Nearby entries stagger by 75ms, capped at 225ms. The effect respects reduced-motion settings, shows keyboard-focused content immediately, and keeps content readable when JavaScript is unavailable.

Edit `hooks/use-scroll-reveal.ts` to change the targets and trigger, and `app/scroll-reveal.css` to change timing or travel distance.

## Included behavior

The interests section includes traveling, running, watching anime, infrastructure, Python and automation, and collaboration. Edit the entries in `components/craft-app.ts` to personalize the descriptions.

Manrope and DM Sans are bundled as variable WOFF2 fonts and preloaded by the page layout. Font files are served locally; the page does not depend on an external font service. Glass panels use translucent gradients, soft borders, and backdrop blur, with a solid-background fallback where blur is unsupported.

Responsive navigation; project dialogs with focus handling and Escape support; Vue tabs with arrow, Home, and End key navigation; reduced-motion support; skip navigation; email-copy feedback and a fallback if clipboard access is unavailable. There is no contact form or backend: the email links open the visitor's mail application.

The Vue build flags are configured in `next.config.ts`. The scripts use Webpack so the same explicit flags are applied in development and production.

## Verification

- Native Next.js 16 production compilation, TypeScript, and page prerendering passed.
- Hosted application TypeScript check passed.
- Desktop layout, project dialogs, Vue tab clicks and keyboard navigation were checked in a browser.
- A 390px mobile frame (375px content width with a scrollbar) had no horizontal overflow. Its menu and scrolling project dialog were checked.

## CV Studio

Open `/cv` for a client-only CV editor with an A4 preview and PDF export. Visitors can edit Mon's example or choose **Start my CV** for a blank form. Add or remove employment, education, training, and recognition entries. Blank sections are omitted, longer entries flow to additional pages, and unsupported font characters produce a clear message rather than disappearing.

The editor does not send CV input to a server or save it to browser storage. A draft stays in the current tab until refresh or navigation; export before leaving. The download is a selectable-text PDF with embedded, locally served DM Sans fonts.

- `lib/cv-data.ts`: Anthony's confirmed employment, freelance period, education, eligibility, training, and awards.
- `lib/cv-pdf.ts`: shared layout for the SVG preview and PDF, including wrapping and pagination.
- `components/cv/cv-builder.tsx`: visitor form, validation, section tabs, and download actions.
- `app/cv/cv.css`: CV Studio's responsive dark glass interface.
- `public/cv/Anthony-Cabigayan-CV.pdf`: finished one-page CV linked from the hero and editor.

After changing Mon's data, regenerate his static download with `npm run generate:cv` before building. This uses the same PDF renderer as visitor exports. No API key, account, database, or third-party document service is needed. Site sharing controls determine who can access the hosted builder.
