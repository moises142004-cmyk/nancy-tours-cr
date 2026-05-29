# Interest-driven marketplace + Nancy's admin console

**Status:** approved design, ready for implementation plan
**Date:** 2026-05-28
**Owner:** Moisés Villalobos / Dream[OS]

## Problem

The current public site sells tours as if they had fixed departures and open spots — a traditional booking marketplace. Nancy doesn't operate that way. She proposes a tour, opens it to interest, and only launches when enough people commit. Today she'd have to maintain the `cupo: "6/10"` string in `js/tours-data.js` by hand, which she can't and won't do.

The site has to reflect her actual operating model and let her run the business without touching code or spreadsheets.

## Goals

1. **Public site** communicates the right model: visitors *express interest*, not *reserve*. Reservation only appears once a tour is confirmed.
2. **Admin console** so Nancy creates, edits, confirms and manages tours from a friendly UI. She never touches code, never opens a spreadsheet.
3. **Backend** is invisible to Nancy. Google Sheet + Apps Script as the data layer, callable from both the public site and the admin.
4. Implementation stays simple: no framework, no build step, consistent with the existing static-site philosophy documented in `CLAUDE.md`.

## Non-goals

- Real payment processing on the site (still WhatsApp → SINPE / bank transfer flow once confirmed).
- Multi-user admin (Nancy is the only operator).
- Multilingual admin (admin is Spanish-only; public site stays ES/EN).
- Mobile-first admin UI (responsive, but desktop-primary; Nancy works on her laptop).
- Real-time updates with WebSockets — 60s cache is enough for this use case.

## Tour lifecycle — the new model

Five states:

| State | Trigger | Visitor sees | CTA |
|---|---|---|---|
| `searching` | Tour created, fewer than `threshold * 0.7` interested | "Buscando interesados" badge, progress bar | "Me interesa →" |
| `near-threshold` | `interested ≥ threshold * 0.7` | "Casi se confirma · faltan N" badge, pulsing dot | "Sumarme →" |
| `confirmed` | Nancy clicks Confirm in admin | "✓ Confirmado · [fecha]" badge, green progress full | "Reservar →" |
| `postponed` | Nancy clicks Postpone in admin + sets new tentative date | "Pospuesto · nueva fecha" badge | "Me sumo en esta fecha →" |
| `completed` | Nancy clicks Complete after tour happens | Hidden from main catalog, only in "Tours pasados" history section | (no CTA) |

State transitions:
- `searching` → `near-threshold` is **automatic** (computed from `interested` count vs `threshold`).
- `near-threshold` → `confirmed` and `postponed` are **manual** decisions in the admin.
- `confirmed` → `completed` is **manual** after the tour date passes.
- Any state → `postponed` is allowed if Nancy needs to push the date back.

## System overview

```
┌──────────────────────┐         ┌────────────────────┐
│ Public site          │         │ Admin console      │
│ (nancytourscr.com)   │         │ (/admin)           │
└──────────┬───────────┘         └─────────┬──────────┘
           │  GET tours, POST lead          │ GET/POST/PUT/DELETE (auth)
           │                                │
           ▼                                ▼
        ┌──────────────────────────────────────┐
        │  Google Apps Script (Web App)        │
        │  • Public read endpoint              │
        │  • Auth-gated write endpoints        │
        │  • Image upload proxy → Cloudinary   │
        │  • Daily summary email via Gmail     │
        └─────────────────┬────────────────────┘
                          │
                          ▼
           ┌──────────────────────────────┐
           │  Google Sheet (3 tabs)       │
           │  • tours_status              │
           │  • leads                     │
           │  • config (secrets)          │
           └──────────────────────────────┘
```

Three deployables: the public Vercel site (already live), the admin console (new, also on Vercel under `/admin`), and the Apps Script Web App (deployed as `Execute as: me`, `Access: anyone`).

## Data model

### `js/tours-data.js` (deprecated)

Removed entirely. All tour content moves to the Sheet. The site fetches everything at runtime and caches it.

### Google Sheet — `tours_status` tab

One row per tour. Columns:

| Column | Type | Source | Notes |
|---|---|---|---|
| `slug` | string | Apps Script generates from title | Primary key. URL-safe kebab-case. |
| `title` | string | Admin | "Cerro Chirripó" |
| `tag` | string | Admin | "AVENTURA · 3 DÍAS" |
| `loc` | string | Admin | "Pérez Zeledón · 3.820 m" |
| `elev` | string | Admin | "3.820 m" |
| `hero` | string (URL) | Admin upload → Cloudinary URL | Full https:// URL |
| `state` | enum | Admin / auto | `searching` \| `near-threshold` \| `confirmed` \| `postponed` \| `completed` |
| `threshold` | int | Admin | Minimum people for confirmation |
| `maxCapacity` | int | Admin | Hard cap (after confirmed) |
| `duration` | string | Admin | "3 días · 2 noches" |
| `diff` | string | Admin | "Alta" |
| `minAge` | string | Admin | "14 años" |
| `price` | string | Admin | "$340" |
| `tentativeDate` | string | Admin | "13–15 jun · vie a dom" |
| `confirmedDate` | string | Admin | Set when state → confirmed |
| `lead` | string (markdown) | Admin | One-sentence description |
| `blurb` | string (markdown) | Admin | Long description |
| `itinerary` | JSON string | Admin | `[{"d":"DÍA 1","items":["..."]}, ...]` |
| `incl` | JSON array string | Admin | `["Transporte","Almuerzo",...]` |
| `excl` | JSON array string | Admin | `["Bebidas alcohólicas",...]` |
| `bring` | JSON array string | Admin | `["Botas",...]` |
| `faq` | JSON array string | Admin | `[["Pregunta","Respuesta"],...]` |
| `related` | JSON array string | Admin | `["bajos-toro","tortuguero"]` |
| `createdAt` | timestamp | Apps Script | Auto on creation |
| `updatedAt` | timestamp | Apps Script | Auto on every write |

### Google Sheet — `leads` tab

| Column | Source |
|---|---|
| `id` | Apps Script (UUID) |
| `timestamp` | Apps Script |
| `slug` | Public form |
| `name` | Public form |
| `whatsapp` | Public form |
| `numPeople` | Public form (default 1) |
| `contacted` | Admin checkbox (default false) |
| `contactedAt` | Auto when contacted flipped to true |
| `notes` | Admin text field |

### Google Sheet — `config` tab (hidden)

| Key | Value | Notes |
|---|---|---|
| `adminPasswordHash` | SHA-256 hash | For login |
| `cloudinaryApiKey` | string | For uploads |
| `cloudinarySecret` | string | For signed uploads |
| `notificationEmail` | string | Where the daily summary goes |
| `dailySummaryEnabled` | bool | Nancy can toggle |

## Apps Script API

Single Web App URL. All endpoints accept `application/json`. Public endpoints have no auth; private endpoints require an `X-Admin-Token` header containing a session JWT (issued at login).

### Public

- `GET /api?action=tours` → returns array of all tours with `interested` count computed. Cache 60s.
- `GET /api?action=tour&slug=chirripo` → single tour with all detail fields.
- `POST /api` with `{action:"interest", slug, name, whatsapp, numPeople}` → adds lead, returns `{ok, newCount, nextThreshold}`.

### Admin (auth required)

- `POST /api` with `{action:"login", password}` → returns `{token, expiresAt}`. Token is HMAC-signed string with 7-day expiry. Stored in localStorage.
- `POST /api` with `{action:"createTour", ...fields}` → creates row, returns `{slug}`.
- `PUT /api` with `{action:"updateTour", slug, ...fields}` → updates row.
- `DELETE /api` with `{action:"deleteTour", slug}` → removes row + cascade delete leads.
- `POST /api` with `{action:"setState", slug, state, dateOverride}` → state transition.
- `GET /api?action=leads&slug=chirripo` (auth) → all leads for tour.
- `PATCH /api` with `{action:"markContacted", leadId}` → flips contacted flag.
- `POST /api` with `{action:"uploadImage", base64, filename}` → proxies to Cloudinary signed upload, returns final URL.
- `POST /api` with `{action:"updateConfig", key, value}` → updates config.

### Daily summary (cron)

Apps Script time-trigger runs every morning at 7am CR. Builds a summary email:

> **Buenos días Nancy ☀️**
>
> Ayer hubo **3 personas nuevas interesadas**.
>
> **🟠 Listos para confirmar (1):**
> - Bajos del Toro · 8/8 interesados · fecha tentativa 14 jun
>
> **🟡 Buscando (4):**
> - Chirripó (4/6) · Tortuguero (2/8) · ...
>
> **Personas sin contactar (5):**
> - María Solís (Chirripó · +506 8888-7777)
> - ...
>
> [Abrir admin →]

Email sent via `GmailApp.sendEmail`. Free, no quota issue.

## Public site changes

### `tours.html`

- Remove the static "PRÓXIMA SALIDA" featured section. Featured tours come from the data (highest `interested` count in `near-threshold`).
- Remove non-functional "Categoría / Nivel / Duración" filter chips. Replace with **functional state filters**: *Todos · 🟠 Casi se confirman · 🟢 Confirmados · 🟡 Buscando · 🔴 Pospuestos*.
- Cards use the 4 visual states approved in the brainstorm mockup. Reference look per state:
  - `searching`: ochre dot + "BUSCANDO INTERESADOS" badge, progress bar 0–69%, text "N interesados · Faltan M más para confirmar"
  - `near-threshold`: pulsing ochre dot + "CASI SE CONFIRMA · FALTAN N" badge, progress bar 70–100%, "🔥" accent
  - `confirmed`: green dot + "✓ CONFIRMADO · [fecha]" badge, full green progress bar, "N personas en ruta · Quedan M cupos"
  - `postponed`: terracotta dot + "POSPUESTO · NUEVA FECHA" badge, partial progress bar, "N de la fecha anterior · Faltan M más"
- Default sort: `near-threshold` first (urgency), then `confirmed`, then `searching`, then `postponed`.
- Data fetched from `GET /api?action=tours` on page load. Cached in `sessionStorage` for back/forward navigation.

### `tour-detail.html`

- Booking card morphs by state (see Section 4 of brainstorm for exact layouts).
- For `searching` / `near-threshold` / `postponed`: primary CTA is **"Me interesa"** / **"Sumarme"** / **"Me sumo en esta fecha"** that opens a form modal. No mention of payment.
- For `confirmed`: primary CTA is **"Reservar por WhatsApp"** (current flow) + secondary **"Formulario de reserva"** that links to `contacto.html`.
- `completed`: page accessible by URL but with a "Tour completado" banner and no CTAs. Useful for SEO and social shares of past tours.

### Form modal — "Me sumo a este tour"

- Overlay modal opens above tour detail (or catalog card with delegated handler).
- 3 fields: name, WhatsApp, numPeople (1–10 dropdown).
- Consent checkbox: "Acepto que Nancy me contacte por WhatsApp".
- On submit:
  1. `POST /api` with action `interest`.
  2. Optimistic UI update: increment the local counter immediately.
  3. Show success state: *"¡Listo, María! Sos la 5ª persona interesada. Faltan 1 más para que el tour se confirme."*
  4. Optional: a follow-up message *"Mientras tanto, mirá otros tours →"* with link to `/tours`.

### `index.html`

- Add a section after the marquee: **"Tours que casi se lanzan"** — 3 cards in `near-threshold` state with their progress bars. Hidden if zero such tours exist.

## Admin console

URL: `/admin/index.html` (also clean: `/admin`). New top-level directory `admin/` parallel to `css/`, `js/`, `img/`.

### File structure

```
admin/
├── index.html              # entry: shows login or dashboard depending on auth
├── css/
│   └── admin.css           # admin-only styles (.adm-* prefix)
├── js/
│   ├── admin.js            # app bootstrap, router, auth
│   ├── views/
│   │   ├── login.js        # login screen
│   │   ├── dashboard.js    # tours grid + filters
│   │   ├── tour-editor.js  # create/edit single tour
│   │   ├── leads.js        # leads list per tour
│   │   └── settings.js     # password, email, notifications
│   └── api.js              # wraps fetch calls to Apps Script
```

No framework. Vanilla JS, hash routing (`#dashboard`, `#tours/new`, `#tours/chirripo/edit`).

### Views

#### Login
- Single password field, "Entrar" button. Stores token in `localStorage`.
- On wrong password: red shake animation, no clue about whether the password format is right.

#### Dashboard
- Header: "Hola Nancy 👋" + "Nuevo tour →" button (top right).
- Stats row: 3 cards — *Tours activos · Personas interesadas hoy · Listos para confirmar*.
- Grid of tour cards (same visual language as public, but with extra admin badges).
- Filter chips: by state.
- Click on card → tour editor.
- Click on "👥 N interesados" pill on card → opens leads side panel for that tour.

#### Tour editor (create or edit)
- One long form with logical sections that can be collapsed:
  - **Identidad**: title, tag, loc, hero photo (drag-drop upload)
  - **Operación**: threshold, max capacity, price, tentative date
  - **Descripción**: lead, blurb (textareas with markdown preview)
  - **Detalles**: duration, diff, minAge, elev
  - **Itinerario**: dynamic list of days, each with items
  - **Incluye / no incluye / qué llevar**: dynamic list editors
  - **Preguntas frecuentes**: list of Q/A pairs
  - **Relacionados**: multi-select from existing tours
- "Guardar" button persists. "Eliminar tour" button (with confirmation).
- For `state` transitions: separate buttons grouped under "Estado del tour" with confirmations:
  - "Confirmar tour" → asks for definitive date
  - "Posponer" → asks for new tentative date and optional reason
  - "Marcar como completado" → archives

#### Leads view (slide-in panel from right edge)
- Title: "{N} personas interesadas en {tour}"
- Sortable table: Fecha · Nombre · WhatsApp · Personas · ☐ Ya hablé · Notas
- WhatsApp column is a `wa.me/` link that opens the chat with a pre-filled message: *"Hola María, soy Nancy. El tour de Chirripó ya está confirmado para el 13–15 de junio. ¿Confirmás tu cupo?"*
- Checkbox flips `contacted` flag via PATCH.
- Bulk action: "Copiar todos los WhatsApp" → clipboard with formatted list.

#### Settings
- Change password
- Toggle daily email
- Email destination
- View deployment info (deploy date, version)

### Image upload flow

1. User drops or selects image in tour editor.
2. JS reads as base64 (or just FormData blob).
3. Calls `POST /api?action=uploadImage` with the file.
4. Apps Script generates signed Cloudinary upload params, returns the public URL.
5. Editor stores the URL in the `hero` field.
6. Cloudinary auto-optimizes (webp, lazy, responsive variants).

Cloudinary free tier: 25 GB storage, 25 GB monthly bandwidth — plenty.

## Migration plan

### Phase 1 — Backend ready (1.5h)
- Create Google Sheet with the 3 tabs.
- Create Cloudinary free account, add API key to Sheet config tab.
- Write Apps Script with all endpoints, deploy as Web App.
- Test endpoints with curl. No site changes yet.

### Phase 2 — Public site reads from Sheet (2h)
- Add `js/tours-api.js` that wraps API calls.
- Update `tour-detail.js` to fetch tour from `GET /api?action=tour&slug=…` instead of `window.TOURS`.
- Update `tours.html` to fetch list and render cards.
- Build the form modal for "Me interesa".
- Add the state-based booking card morph in tour detail.
- Migrate the 13 existing tours from `js/tours-data.js` into the Sheet (one-time script).

### Phase 3 — Admin console (3–4h)
- Build `admin/index.html` + JS + CSS.
- Implement login, dashboard, tour editor, leads view.
- Image upload via Cloudinary.
- Deploy to same Vercel project. `/admin` URL.

### Phase 4 — Notifications + polish (1h)
- Apps Script time-trigger for daily summary email.
- Settings view in admin to toggle.
- QA on mobile + desktop.

Total estimate: **~8 hours of focused work**.

## Operational rules (for future Claude sessions)

- **`js/tours-data.js` is being removed.** Future tour data lives in the Google Sheet. The `tours-api.js` module is the only way the site reads tour data.
- **Cache invalidation:** the public API has 60s cache. Admin writes call a `cacheBust=1` flag that bypasses the cache for the next read. For UX, optimistic updates in the UI are encouraged.
- **Sheet schema changes:** never break columns. Add new columns at the right; never delete or rename. If a column needs to be retired, mark it deprecated in config.
- **Password rotation:** Nancy can do it from Settings. The hash in `config` tab is the source of truth; old tokens immediately invalidated.
- **Admin URL:** `/admin/*` is deployed (not in `.vercelignore`), but blocked in `robots.txt` (`Disallow: /admin/`) and excluded from `sitemap.xml` so it doesn't get indexed.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Apps Script rate limits (20k requests/day, 6 min runtime) | 60s cache on the public site; admin is single-user; daily summary is one cron run. Well below limits. |
| Apps Script cold start latency (1–3s on first request) | Public site fetches data on page load with a skeleton state. Admin shows loading spinners. |
| Sheet corruption (Nancy or someone deletes rows) | Daily auto-backup via Apps Script trigger to a `backup_YYYY-MM-DD` sheet. |
| Password compromise | One-click rotation from settings; tokens stored client-side expire in 7 days. |
| Cloudinary plan limits hit | Switch to Vercel Blob (also free tier) or upgrade Cloudinary (paid). Both paths covered. |
| Apps Script Web App URL changes on redeploy | Use `/exec` URL (stable across deploys) — only `/dev` URL changes. |
| Spam form submissions | Honeypot field + simple rate limit (max 5 interests per IP per hour, tracked in a Sheet column). |

## Open questions to revisit later

- **English admin** — Nancy is OK with Spanish-only for now. If she gets help with English content, the admin can be translated.
- **Multi-tour bulk operations** — e.g. "confirm all 3 tours that hit threshold today". Not in v1.
- **Analytics on admin actions** — track which tours Nancy spends most time editing. Not in v1.
- **Photo gallery** — currently only one hero photo per tour. Could become a gallery later.
- **Public profile of Nancy as guide** — already on `sobre-nancy.html`. No admin needed yet.
