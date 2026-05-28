# Nancy Tours Costa Rica

Sitio web de Nancy Villalobos — Licenciada en Turismo, guía profesional con 15 años recorriendo Costa Rica.

**Direction:** "Cinematic Wild" — full-bleed video hero, postcard tour cards, iridescent value cards, jungle audio chip.

## Stack

Static HTML, CSS, vanilla JS. No build step, no framework. Ships as-is.

- **HTML at root** — 5 pages so URLs stay clean on Vercel (`/`, `/tours`, `/sobre-nancy`, `/contacto`, `/tour-detail?id=…`)
- **`css/`** — design tokens + shared chrome + one stylesheet per page
- **`js/`** — shared chrome JS + per-page interactives + tour data
- **`img/`** — production images, hero video, icons, logos
- **`design/`** — brand exploration (kept for history; excluded from Vercel)

## Run locally

```bash
python3 -m http.server 8765
# open http://127.0.0.1:8765/
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
├── index.html              # home (Cinematic Wild)
├── tours.html              # catalog with filter bar
├── sobre-nancy.html        # bio + credentials + gallery
├── contacto.html           # form + payment methods + FAQ
├── tour-detail.html        # template; populated from ?id=<slug>
│
├── css/
│   ├── tokens.css          # CSS custom properties (palette, type)
│   ├── chrome.css          # shared nav, footer, buttons, tour cards, marquee, wa-float
│   ├── home.css            # home-only sections (hero, value cards, audio chip, about, CTA)
│   ├── tours.css           # tours catalog                       — .tp-* prefix
│   ├── nancy.css           # sobre-nancy                          — .np-* prefix
│   ├── contacto.css        # contacto                             — .cp-* prefix
│   └── tour-detail.css     # tour detail                          — .td-* prefix
│
├── js/
│   ├── chrome.js           # mobile menu, ES/EN language switcher
│   ├── home.js             # hero video crossfade, value-card tilt, jungle audio
│   ├── contacto.js         # form → WhatsApp prefill
│   ├── tour-detail.js      # reads ?id= and populates [data-td] slots
│   └── tours-data.js       # window.TOURS = { slug: { ...fields }, default: {...} }
│
├── img/                    # logos, hero-loop.mp4, tour photos, icons
├── design/                 # brand exploration — NOT deployed (.vercelignore)
│   ├── *.jsx               # React+Babel preview canvas, directions A/B/C, palette/logo concepts
│   ├── Nancy Tours Costa Rica.html
│   └── uploads/            # client brief, WhatsApp references, AI-generated images
│
├── vercel.json             # cleanUrls, cache headers
├── .editorconfig           # editor consistency
├── .vercelignore
├── .gitignore
├── CLAUDE.md               # context for AI assistants working on the repo
└── README.md
```

CSS load order (every page): `tokens.css` → `chrome.css` → `<page>.css`. JS load order: `chrome.js` first, then page-specific scripts.

## Adding a new tour

1. Add an entry to `js/tours-data.js` keyed by slug (e.g. `'volcan-poas'`)
2. Add a card to `tours.html` (under the appropriate category section)
3. Link to `tour-detail.html?id=<slug>` — the detail page reads the data via JS

## Cache-busting CSS or JS

When you change a shared file (`css/tokens.css`, `css/chrome.css`, `js/chrome.js`), bump the `?v=N` query in every HTML page's reference to force browsers off the cached copy.

```html
<link rel="stylesheet" href="css/chrome.css?v=4" />
```

Per-page files don't need versions — they change with their HTML and the browser revalidates.

## Brand

- **Palette:** terracotta `#b5532e`, forest `#1f3a2b`, cream `#faf5e7`, ochre `#c99a3f`, ink `#1a160e`
- **Type:** Bricolage Grotesque (display) + Inter (body) + JetBrains Mono (meta)
- **Voice:** confident, warm, practical. Spanish-first. English coming.

## Contact

- WhatsApp: +506 8949-4655
- Email: hola@nancytourscr.com
- Heredia, Mercedes Norte · Costa Rica

---

© 2026 Nancy Tours Costa Rica · All rights reserved.
Diseño y desarrollo: [Dream[OS]](https://dreamos.dev)
