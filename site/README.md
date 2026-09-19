# FGCU DeepTech — website

Static site. No build step, no dependencies, no framework. Five HTML pages that share
one stylesheet and one script. Open `index.html` in a browser and it works.

```
site/
├── index.html        Mission (home)
├── vehicles.html     AQ-1 spec, flight profile, roadmap, Vertex research
├── divisions.html    The seven divisions in detail
├── join.html         Recruiting, onboarding track, logistics, FAQ
├── partners.html     Sponsorship tiers and in-kind asks
└── assets/
    ├── css/main.css  Everything visual. Numbered sections, top to bottom.
    ├── js/main.js    Starfield, countdown, nav, reveals, division console.
    └── img/          hero-launch.webp, favicon.svg
```

## Running it locally

Double-clicking `index.html` works for everything except nothing — there are no fetches.
If you prefer a server:

```bash
cd site
python -m http.server 8000     # then open http://localhost:8000
```

## Things you need to change before this goes live

These are the placeholders. Nothing else is fabricated, but **verify the engineering
numbers against your own OpenRocket file before publishing them** — they are plausible
starting values, not your design.

| What | Where | Current value |
|---|---|---|
| **Launch date** (drives every countdown) | `assets/js/main.js`, `LAUNCH_ISO` at the top | `2026-11-14T13:00:00-05:00` |
| Launch date shown as text | `index.html`, in the countdown footer | `14 Nov 2026 · 13:00 ET` |
| Email address | all five pages, search `deeptech@fgcu.edu` | placeholder |
| Discord / Eagle Link / Instagram links | `join.html`, search `data-todo=` | `href="#"` |
| Meeting days, rooms, dues | `join.html`, the Logistics tables | "Confirm on Eagle Link" |
| Sponsor logos | `index.html` + `partners.html`, `.plot` blocks | "Partner slot 01–06" |
| Sponsorship amounts | `partners.html`, the `.tiers` block | $500 / $1.5k / $5k / $10k |
| AQ-1 specifications | `vehicles.html` + `index.html`, `.spec` tables | preliminary estimates |

The four `data-todo="..."` attributes in `join.html` mark every dead link. Search for
`data-todo` to find them all, then delete the attribute once you have a real URL.

### Hero image

`assets/img/hero-launch.webp` is the reference image from `site_references/`. It works,
but **swap it for a photo of your own vehicle as soon as you have one** — both because a
real photo is better and because the provenance of that file is unknown. Replace the file
in place, keep the name, and nothing else needs to change.

The reference screenshot of another company's site was deliberately *not* used as page
content. The `Fig. 01` slot on the home page is an original SVG elevation drawing of AQ-1
instead (`index.html`, search `class="vdiag"`).

## Design system

Brand colors are FGCU's, defined once at the top of `main.css`:

- `--cobalt: #002D72` — deep atmospheric base, used in the backdrop and gradients
- `--emerald: #007749` — button fills and rules
- `--signal: #2EE08C` — a brightened emerald for text and indicators, because `#007749`
  does not meet contrast on a near-black background. Same hue family, readable.
- `--amber: #E8A33D` — "in development" status only

Everything else is grayscale hairlines. Two typefaces: **JetBrains Mono** for headings,
labels and all numbers; **Archivo** for body copy. Both from Google Fonts.

The visual language is flight-ops instrumentation — corner brackets instead of cards,
1px hairlines instead of shadows, square corners, telemetry readouts, monospace numerals.
If you add a section, reuse `.split` (sticky numbered rail + content), `.frame` (corner
brackets), `.chip`, `.spec` (data tables) and `.dlist` (bulleted lists) rather than
inventing new components.

## How the JavaScript is organised

`main.js` is one IIFE with nine independent modules. Each one returns immediately if its
markup is absent, so you can delete any section from any page without breaking others.

1. `starfield()` — canvas. Three parallax star layers plus drifting nebula lobes in the
   brand hues. Reacts to pointer and scroll. Pauses in a background tab.
2. `countdown()` — feeds the hero clock and the status strip from `LAUNCH_ISO`. Counts up
   ("T+") after the date passes rather than breaking.
3. `chrome()` — sticky header state and the mobile drawer.
4. `reveal()` — IntersectionObserver scroll reveals via `data-rv`.
5. `telemetry()` — the right-hand rail that reads scroll depth as an altitude gauge.
6. `divisions()` — the interactive division console on the home page.
7. `decode()` — one-pass glyph scramble on the hero headline.
8. `trajectory()` — the flight-profile diagram inks itself in on scroll.
9. `coords()` — the lat/long readout in the status strip.

### Accessibility and graceful degradation

- Every animation is disabled under `prefers-reduced-motion`, including the starfield,
  which renders a single static frame instead.
- Reveal animations are scoped to `.js`, set by an inline script in each `<head>`. With
  JavaScript off, all content renders visible — it is never trapped at `opacity: 0`.
- Without JavaScript the division console degrades to all seven panels stacked and
  readable, rather than showing nothing.
- Skip link, focus-visible outlines, `aria-current` on the active nav item, real
  `<button>` elements in the console, and labelled SVG diagrams.

Verified with a scripted audit: no horizontal overflow on any of the five pages at
360 / 390 / 600 / 768 / 1024 / 1280 px.

## Deploying to GitHub Pages

The `site/` directory is the site root. Either point Pages at this folder on the default
branch, or push its contents to a `gh-pages` branch:

```bash
git subtree push --prefix site origin gh-pages
```

All internal links are relative, so it works from a subpath
(`username.github.io/repo/`) without changes.
