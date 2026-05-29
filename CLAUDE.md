# Nancy Tours Costa Rica — repo context for AI assistants

Client project. Static website for Nancy Villalobos's guided-tour business in Costa Rica. Shipped Spanish-first (ES); English version coming later — for now the EN button shows a notice and points users to WhatsApp.

## Stack: static HTML, no build

Vanilla HTML + CSS + JS. No bundler, no framework, no npm. Open the file or serve with `python3 -m http.server`. The repo deploys directly to Vercel — `vercel.json` enables clean URLs.

**Do NOT introduce a build step, framework, or bundler unless the client asks for it.** This is intentionally low-tech so it's maintainable by anyone who can edit a `.html` file.

## Repo layout

```
.
├── index.html, tours.html, sobre-nancy.html, contacto.html, tour-detail.html  ← root for clean URLs
├── css/
│   ├── tokens.css      ← CSS custom properties only (palette, type)
│   ├── chrome.css      ← shared chrome (loaded on every page)
│   └── <page>.css      ← one per page, prefixed class names
├── js/
│   ├── chrome.js       ← shared chrome (loaded on every page)
│   ├── <page>.js       ← per-page interactives where needed
│   └── tours-data.js   ← window.TOURS (consumed by tour-detail.js)
├── img/                ← production media
├── design/             ← brand exploration, NOT deployed (.vercelignore)
├── vercel.json, .editorconfig, .vercelignore, .gitignore
├── README.md, CLAUDE.md
```

CSS load order (every page): `css/tokens.css` → `css/chrome.css` → `css/<page>.css`. JS load order: `js/chrome.js` first, then page-specific scripts.

## CSS architecture

Three layers:

1. **`css/tokens.css`** — design tokens only (palette, type variables). Keep slim. Don't add component styles here.
2. **`css/chrome.css`** — anything that appears on EVERY page (nav, footer, buttons, mobile menu, tour cards, WhatsApp float, eyebrow + h2 base styles, marquee).
3. **`css/<page>.css`** — page-specific styles, prefixed with a 2-letter page code:
   - `css/home.css` → no prefix (paired with `index.html`; the home page file is `index.html` for `/` routing, but its styles + JS keep the semantic `home` name)
   - `css/tours.css` → `.tp-*` (Tours Page)
   - `css/nancy.css` → `.np-*` (Nancy Page)
   - `css/contacto.css` → `.cp-*` (Contact Page)
   - `css/tour-detail.css` → `.td-*` (Tour Detail)

When adding shared elements, put them in `css/chrome.css`. When a class only appears on one page, keep it page-local. **Never put visual styles in `tokens.css`** — it's tokens-only by design (we hit a scroll-lock bug from leftover layout rules there).

## JS architecture

- `js/chrome.js` — mobile menu toggle (with focus trap) + ES/EN language switcher. Loaded on every page.
- `js/home.js` — hero video crossfade, value-card 3D tilt with mouse-tracked specular highlight, jungle audio chip (procedural birds + filtered noise via Web Audio).
- `js/contacto.js` — form submit handler that opens WhatsApp with a pre-filled message.
- `js/tour-detail.js` + `js/tours-data.js` — reads `?id=<slug>` from URL, looks up `window.TOURS[slug]` from `tours-data.js`, populates `[data-td="<field>"]` and `[data-td-slot="<list>"]` placeholders. Falls back to `TOURS.default` if the slug is missing.

## Cache-busting

Shared files (`css/tokens.css`, `css/chrome.css`, `js/chrome.js`) carry a `?v=N` query in HTML refs. When you change one, bump the version in every HTML page that references it. Per-page files don't need versions since they change with their HTML and the browser revalidates.

## Adding a new tour

1. Add the entry to `js/tours-data.js` (one object per slug, fields: `title, loc, elev, tag, hero, nextDate, duration, diff, cupo, minAge, price, lead, blurb, itinerary, incl, excl, bring, faq, related`).
2. Add a card to `tours.html` under the appropriate category section (`<h2 class="tp-category-h">`).
3. Link to `tour-detail.html?id=<slug>` everywhere.

## `design/` folder

Brand exploration — kept for history, NOT deployed (excluded via `.vercelignore`):

- `Nancy Tours Costa Rica.html` — the original canvas index page that showed all three "directions" (A serif editorial, B cinematic wild, C modern geo) side by side. Direction B was chosen.
- `direction-a.jsx`, `direction-b.jsx`, `direction-c.jsx` — React+Babel-in-browser components that produced the original design. `direction-b.jsx` is the source the production HTML was ported from.
- `design-canvas.jsx`, `tweaks-panel.jsx`, `palette-card.jsx`, `logo-wood.jsx`, `logo-concepts.jsx`, `shared-chrome.jsx` — supporting design system components.
- `tours-page.jsx`, `nancy-page.jsx`, `contact-page.jsx`, `tour-detail.jsx` — original React component for each page; ported to static HTML.
- `uploads/` — client brief docx, original Nancy photos, WhatsApp references, generated brand imagery. Useful for context; not production assets.

If you need to revise the design, work in static HTML/CSS at the root. The JSX in `design/` is the historical source, not the live spec.

## Brand voice + content rules

- **Tone:** confident, warm, practical. Like a guide talking to a friend, not corporate. "Tours guiados por Nancy" not "Servicios de turismo".
- **First person:** "yo me encargo del resto", "mi promesa", "te llevo". Singular, Nancy speaks.
- **Costa Rican voice:** "vos" (not "tú"), "ticismos" where they fit ("a medida", "salida", "gallo pinto"). Don't over-do it.
- **No padding language.** "Tours guiados por toda Costa Rica" beats "Una amplia gama de experiencias turísticas...".
- **Numbers concrete:** "15 años", "47 destinos", "+506 8878-7370". Specific beats vague.

## Brand visual rules

- **Palette:** terracotta `#b5532e` (primary accent), forest `#1f3a2b` (deep section bg), cream `#faf5e7` (paper bg + light text on dark), ochre `#c99a3f` (secondary), ink `#1a160e` (text on cream).
- **Fonts:** Bricolage Grotesque for display + headings (loaded from Google), Inter for body, JetBrains Mono for meta/eyebrow labels.
- **Eyebrows:** ALL CAPS, letter-spacing 0.18–0.22em, 11px, terracotta. Used to label every section ("01 / TOURS ABIERTOS").
- **Tour card meta:** "FECHA / DURACIÓN / NIVEL / CUPO" grid with key in 9px JetBrains-Mono-feel uppercase and value in 13–14px Inter.
- **Iridescent value cards** (home only): platinum pearl gradient base, 8 animated colored bands as a CSS mix-blend overlay, mouse-tracked radial specular highlight, 3D tilt on hover. The featured "15 años" card uses a copper-foil version instead.

## Vercel deployment

- Project linked to GitHub repo (`moises142004-cmyk/nancy-tours-cr`). Auto-deploys on push to `main`.
- `vercel.json` sets clean URLs — visit `/tours` not `/tours.html`.
- `.vercelignore` excludes `design/` from the deployed bundle.
- The `nt-lang` localStorage key persists ES/EN preference — clear it to reset.

## Contact for client

- WhatsApp: +506 8878-7370 (Nancy)
- Email: hola@nancytourscr.com
- All billing on Moises personally during launch phase. Move to Nancy once ICT sello arrives.
