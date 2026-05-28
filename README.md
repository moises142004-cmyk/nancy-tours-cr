# Nancy Tours Costa Rica

Sitio web de Nancy Villalobos — Licenciada en Turismo, guía profesional con 15 años recorriendo Costa Rica.

**Direction:** "Cinematic Wild" — full-bleed video hero, postcard tour cards, iridescent value cards, jungle audio chip.

## Stack

Static HTML, CSS, vanilla JS. No build step, no framework. Ships as-is.

- 5 pages: `home.html`, `tours.html`, `sobre-nancy.html`, `contacto.html`, `tour-detail.html`
- Shared chrome (nav, footer, buttons, tour cards): `chrome.css` + `chrome.js`
- Design tokens: `styles.css`
- Per-page CSS: `home.css`, `tours.css`, `nancy.css`, `contacto.css`, `tour-detail.css`
- Per-page JS where needed: `home.js` (hero video crossfade, value-card tilt, jungle audio), `contacto.js` (form → WhatsApp), `tour-detail.js` + `tours-data.js` (reads `?id=` from URL)

## Run locally

```bash
python3 -m http.server 8765
# open http://127.0.0.1:8765/home.html
```

Any static file server works (`npx serve`, `caddy file-server`, etc.). No npm install, no build.

## Deploy

The repo is Vercel-ready. `vercel.json` enables clean URLs (`/tours` instead of `/tours.html`).

```bash
vercel deploy           # preview
vercel promote <url>    # promote preview to production
```

`design/` is excluded from deploys via `.vercelignore`.

## Repo layout

```
.
├── home.html, tours.html, sobre-nancy.html, contacto.html, tour-detail.html
├── styles.css           # design tokens (paleta, tipografía)
├── chrome.css/.js       # shared nav, footer, mobile menu, lang switcher, buttons, tour cards
├── home.css/.js         # home-only sections (hero, value cards, audio chip, about, CTA)
├── tours.css            # tours catalog
├── nancy.css            # sobre-nancy
├── contacto.css/.js     # contacto + form-to-WhatsApp
├── tour-detail.css/.js  # detail template, reads ?id= from URL
├── tours-data.js        # tour data (slug → fields)
├── img/                 # production images (logos, hero video, tour photos)
├── design/              # brand exploration — NOT deployed
│   ├── *.jsx            # React+Babel preview canvas, direction A/B/C, palette/logo concepts
│   ├── Nancy Tours Costa Rica.html  # canvas index page
│   └── uploads/         # client brief, WhatsApp photos, AI-generated references
├── vercel.json
├── .vercelignore
├── .gitignore
├── CLAUDE.md            # context for AI assistants working on the repo
└── README.md
```

## Adding a new tour

1. Add an entry to `tours-data.js` keyed by slug (e.g. `'volcan-poas'`)
2. Add a card to `tours.html` (under the appropriate category section)
3. Link to `tour-detail.html?id=<slug>` — the detail page reads the data via JS

## Brand

- **Palette:** terracotta `#b5532e`, forest `#1f3a2b`, cream `#faf5e7`, ochre `#c99a3f`, ink `#1a160e`
- **Type:** Bricolage Grotesque (display) + Inter (body) + JetBrains Mono (meta)
- **Voice:** confident, warm, practical. Spanish-first. English coming.

## Contact

- WhatsApp: +506 8949-4655
- Email: hola@nancytourscr.com
- Heredia, Mercedes Norte · Costa Rica

---

Diseño y desarrollo: [Dream[OS]](https://dreamos.dev)
