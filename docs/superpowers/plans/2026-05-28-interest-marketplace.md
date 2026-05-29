# Interest-Driven Marketplace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static "reserve a tour" model with an interest-driven marketplace where visitors signal intent, tours confirm when they hit a threshold, and Nancy manages everything from an admin console — without touching code or spreadsheets.

**Architecture:** Three integrated parts on top of the existing static Vercel site. (1) A Google Sheet stores all tour data and leads. (2) A Google Apps Script Web App exposes a single REST-like JSON API to read tour data from the public site and to read/write everything from the admin. (3) A new `admin/` folder mirrors the public site structure (HTML + CSS + vanilla JS) and is the only place Nancy interacts with. `js/tours-data.js` is deleted after migration.

**Tech Stack:** Static HTML/CSS/vanilla JS (no build, no framework — matches `CLAUDE.md` philosophy) · Google Apps Script (V8 runtime, single `code.gs` file) · Google Sheets as DB · Cloudinary free tier for image hosting · HMAC-signed session tokens for admin auth.

**Verification approach:** No JS test runner in this stack. Each task ends with a concrete verification step — usually `curl` against the Apps Script endpoint, a Chrome DevTools MCP screenshot at a real viewport, or a `node` script that asserts data shape. Each verification has expected output written out so a fresh engineer knows exactly what "passing" looks like.

---

## Pre-flight (one-time, before Task 1)

- [ ] Create a Google account for the project (or use Moisés's). All shared admin gear lives in this account.
- [ ] Open a new Google Sheet titled `Nancy Tours — Backend`. Note the spreadsheet ID from the URL (`docs.google.com/spreadsheets/d/<ID>/edit`).
- [ ] Create a Cloudinary free account at https://cloudinary.com. Note `cloud_name`, `api_key`, `api_secret` from the dashboard.
- [ ] Decide on Nancy's admin password (12+ chars, store in a password manager). Compute its SHA-256 hex:
  ```bash
  echo -n "the-password-here" | shasum -a 256 | awk '{print $1}'
  ```
- [ ] Open `https://script.google.com` in the same Google account. You will create the Apps Script bound to the Sheet in Task 2.

---

## Phase 1 — Backend (Sheet + Apps Script)

**Phase goal:** A working Apps Script Web App URL that the rest of the project can hit. After Phase 1, the public site is unchanged and Nancy has no admin yet, but the backend is fully functional and testable with `curl`.

---

### Task 1: Initialize the Google Sheet schema

**Files:**
- No repo files. This is all Google Sheets UI work.
- Create: `docs/superpowers/setup/sheet-schema.md` — handoff doc documenting the columns

- [ ] **Step 1: Create the three tabs**

In the Sheet:
- Rename `Sheet1` → `tours_status`.
- Add a new tab named `leads`.
- Add a new tab named `config`.

- [ ] **Step 2: Add headers to `tours_status` tab**

Paste this row into row 1 of `tours_status` (one column per header):

```
slug | title | tag | loc | elev | hero | state | threshold | maxCapacity | duration | diff | minAge | price | tentativeDate | confirmedDate | lead | blurb | itinerary | incl | excl | bring | faq | related | createdAt | updatedAt
```

Use the Sheets menu `Data → Data validation` on column G (state) to enforce a dropdown with values: `searching`, `near-threshold`, `confirmed`, `postponed`, `completed`.

Freeze row 1 (`View → Freeze → 1 row`).

- [ ] **Step 3: Add headers to `leads` tab**

Paste into row 1:

```
id | timestamp | slug | name | whatsapp | numPeople | contacted | contactedAt | notes
```

Set column G (contacted) to checkbox: select column G → `Insert → Checkbox`. Freeze row 1.

- [ ] **Step 4: Add headers and seed rows to `config` tab**

Paste into rows 1–8:

```
key                      | value
adminPasswordHash        | <paste the SHA-256 from pre-flight here>
cloudinaryCloudName      | <your cloud_name>
cloudinaryApiKey         | <your api_key>
cloudinaryApiSecret      | <your api_secret>
notificationEmail        | <Nancy's email>
dailySummaryEnabled      | TRUE
jwtSecret                | <run: openssl rand -hex 32>
```

Hide the `config` tab: right-click the tab → `Hide sheet`.

- [ ] **Step 5: Write the handoff doc**

Create `docs/superpowers/setup/sheet-schema.md` with the column descriptions from the spec's "Data model" section. Future engineers need this if they ever look at the Sheet structure.

- [ ] **Step 6: Commit the handoff doc**

```bash
git add docs/superpowers/setup/sheet-schema.md
git commit -m "docs: document Google Sheet schema for backend"
```

- [ ] **Step 7: Verify**

Open the Sheet. All 3 tabs visible (`config` hidden). Headers in row 1 of each visible tab. Column G of `tours_status` has the state dropdown when you click a cell. Column G of `leads` shows checkboxes.

---

### Task 2: Apps Script — skeleton + public `GET ?action=tours`

**Files:**
- Apps Script (Google-hosted, not in repo): `Code.gs`
- Create: `docs/superpowers/setup/apps-script-code.md` — mirror of the deployed Apps Script so future engineers can re-deploy

- [ ] **Step 1: Bind a new Apps Script to the Sheet**

In the Sheet: `Extensions → Apps Script`. Rename the project to `Nancy Tours API`. This creates a script bound to the spreadsheet so `SpreadsheetApp.getActiveSpreadsheet()` returns this Sheet automatically.

- [ ] **Step 2: Replace `Code.gs` with the skeleton**

Paste this exact code:

```javascript
/**
 * Nancy Tours API — Apps Script Web App
 * Single endpoint that handles all GET/POST/PUT/PATCH/DELETE via ?action= param.
 */
const SHEET = SpreadsheetApp.getActiveSpreadsheet();
const TOURS = SHEET.getSheetByName('tours_status');
const LEADS = SHEET.getSheetByName('leads');
const CONFIG = SHEET.getSheetByName('config');
const JSON_ARRAY_FIELDS = ['itinerary', 'incl', 'excl', 'bring', 'faq', 'related'];

function doGet(e) {
  const action = (e.parameter.action || '').trim();
  try {
    if (action === 'tours') return jsonResponse(getAllTours());
    if (action === 'tour') return jsonResponse(getTour(e.parameter.slug));
    return jsonResponse({ error: 'unknown action' }, 400);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function jsonResponse(data, status) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function rowsToObjects(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    JSON_ARRAY_FIELDS.forEach((f) => {
      if (obj[f]) { try { obj[f] = JSON.parse(obj[f]); } catch (e) { obj[f] = []; } }
      else obj[f] = [];
    });
    return obj;
  });
}

function getAllTours() {
  const tours = rowsToObjects(TOURS);
  const leads = rowsToObjects(LEADS);
  const counts = {};
  leads.forEach((l) => { counts[l.slug] = (counts[l.slug] || 0) + Number(l.numPeople || 1); });
  return tours
    .filter((t) => t.state !== 'completed')
    .map((t) => ({
      ...t,
      interested: counts[t.slug] || 0,
      derivedState: deriveState(t.state, counts[t.slug] || 0, t.threshold),
    }));
}

function getTour(slug) {
  if (!slug) throw new Error('slug required');
  const tours = rowsToObjects(TOURS);
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) throw new Error('tour not found');
  const leads = rowsToObjects(LEADS).filter((l) => l.slug === slug);
  const interested = leads.reduce((sum, l) => sum + Number(l.numPeople || 1), 0);
  return {
    ...tour,
    interested,
    derivedState: deriveState(tour.state, interested, tour.threshold),
  };
}

function deriveState(manualState, interested, threshold) {
  if (manualState === 'confirmed' || manualState === 'postponed' || manualState === 'completed') {
    return manualState;
  }
  const t = Number(threshold) || 0;
  if (t && interested >= t * 0.7) return 'near-threshold';
  return 'searching';
}
```

- [ ] **Step 3: Save the script**

`Ctrl/Cmd + S`. First save will ask to authorize access to the Sheet — accept.

- [ ] **Step 4: Deploy as Web App**

In the Apps Script editor: `Deploy → New deployment → Type: Web app`.
- Description: `v1 initial`
- Execute as: `Me`
- Who has access: `Anyone`

Click `Deploy`. Copy the resulting `/exec` URL — it looks like `https://script.google.com/macros/s/AKfycb.../exec`. **Save this URL** to the Sheet config tab as a new row:

```
appsScriptUrl | https://script.google.com/macros/s/AKfycb.../exec
```

- [ ] **Step 5: Verify with curl**

In a terminal:

```bash
APPS=https://script.google.com/macros/s/AKfycb.../exec
curl -s "$APPS?action=tours" | python3 -m json.tool
```

Expected: `[]` (empty array, since no tours yet). If you get a Google login page or "Access denied", check the `Who has access` setting on the deployment.

- [ ] **Step 6: Mirror the code in the repo for traceability**

Create `docs/superpowers/setup/apps-script-code.md` with the entire `Code.gs` content inside a `javascript` code block, plus deploy instructions. Future engineers need to re-deploy from this.

- [ ] **Step 7: Commit**

```bash
git add docs/superpowers/setup/apps-script-code.md
git commit -m "feat(backend): Apps Script skeleton + public GET ?action=tours"
```

---

### Task 3: Apps Script — `POST action=interest` (public write)

**Files:**
- Apps Script: edit `Code.gs`
- Modify: `docs/superpowers/setup/apps-script-code.md`

- [ ] **Step 1: Add `doPost` and the interest handler**

In the Apps Script editor, append below `doGet`:

```javascript
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    if (action === 'interest') return jsonResponse(addInterest(body));
    return jsonResponse({ error: 'unknown action' }, 400);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function addInterest({ slug, name, whatsapp, numPeople }) {
  if (!slug || !name || !whatsapp) throw new Error('slug, name, whatsapp required');
  const num = Math.max(1, Math.min(10, Number(numPeople) || 1));

  // Validate slug exists
  const tour = rowsToObjects(TOURS).find((t) => t.slug === slug);
  if (!tour) throw new Error('tour not found');

  // Append to leads
  const id = Utilities.getUuid();
  LEADS.appendRow([
    id,
    new Date().toISOString(),
    slug,
    String(name).trim(),
    String(whatsapp).trim(),
    num,
    false,                                  // contacted
    '',                                     // contactedAt
    '',                                     // notes
  ]);

  // Recompute count
  const allLeads = rowsToObjects(LEADS).filter((l) => l.slug === slug);
  const newCount = allLeads.reduce((s, l) => s + Number(l.numPeople || 1), 0);
  return {
    ok: true,
    newCount,
    threshold: Number(tour.threshold) || 0,
    derivedState: deriveState(tour.state, newCount, tour.threshold),
  };
}
```

Save. **Redeploy:** `Deploy → Manage deployments → ✏️ (pencil) → New version → Deploy`. The `/exec` URL stays the same.

- [ ] **Step 2: Verify with curl**

First seed a tour manually in the Sheet so we have something to test against. In `tours_status` row 2, add:

```
slug         | title           | ... | state     | threshold | ... | tentativeDate
chirripo     | Cerro Chirripó  | ... | searching | 6         | ... | 13–15 jun
```

(You can leave most columns blank for now — only `slug`, `title`, `state`, `threshold` matter for this test.)

Now POST an interest:

```bash
curl -s -X POST "$APPS" \
  -H 'Content-Type: application/json' \
  -d '{"action":"interest","slug":"chirripo","name":"Test User","whatsapp":"88887777","numPeople":2}' \
  | python3 -m json.tool
```

Expected:

```json
{
  "ok": true,
  "newCount": 2,
  "threshold": 6,
  "derivedState": "searching"
}
```

Open the Sheet → `leads` tab. A new row should be visible with `slug=chirripo`, `name=Test User`, `numPeople=2`, `contacted=FALSE`.

- [ ] **Step 3: Re-fetch and verify `interested` is now 2**

```bash
curl -s "$APPS?action=tour&slug=chirripo" | python3 -m json.tool | grep -E 'interested|derivedState'
```

Expected: `"interested": 2,` and `"derivedState": "searching",` (because 2 < 6 * 0.7 = 4.2, still searching).

- [ ] **Step 4: Trigger the near-threshold transition by adding more**

```bash
for i in 1 2 3; do
  curl -s -X POST "$APPS" \
    -H 'Content-Type: application/json' \
    -d "{\"action\":\"interest\",\"slug\":\"chirripo\",\"name\":\"User $i\",\"whatsapp\":\"8888777$i\",\"numPeople\":1}" >/dev/null
done
curl -s "$APPS?action=tour&slug=chirripo" | python3 -m json.tool | grep -E 'interested|derivedState'
```

Expected: `"interested": 5,` and `"derivedState": "near-threshold",` (5 >= 6 * 0.7 = 4.2).

- [ ] **Step 5: Update repo mirror**

Edit `docs/superpowers/setup/apps-script-code.md` to include the new `doPost` + `addInterest` code.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/setup/apps-script-code.md
git commit -m "feat(backend): POST action=interest endpoint"
```

---

### Task 4: Apps Script — admin auth + `setState` + `markContacted`

**Files:**
- Apps Script: edit `Code.gs`
- Modify: `docs/superpowers/setup/apps-script-code.md`

- [ ] **Step 1: Add auth helpers and login endpoint**

Append to `Code.gs`:

```javascript
function getConfig(key) {
  const rows = CONFIG.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === key) return rows[i][1];
  }
  return null;
}

function setConfig(key, value) {
  const rows = CONFIG.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === key) {
      CONFIG.getRange(i + 1, 2).setValue(value);
      return;
    }
  }
  CONFIG.appendRow([key, value]);
}

function sha256Hex(s) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s);
  return bytes.map((b) => (b < 0 ? b + 256 : b).toString(16).padStart(2, '0')).join('');
}

function hmacHex(secret, message) {
  const bytes = Utilities.computeHmacSha256Signature(message, secret);
  return bytes.map((b) => (b < 0 ? b + 256 : b).toString(16).padStart(2, '0')).join('');
}

function issueToken() {
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `nancy.${expires}`;
  const sig = hmacHex(getConfig('jwtSecret'), payload);
  return { token: `${payload}.${sig}`, expiresAt: expires };
}

function verifyToken(token) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [user, expiresStr, sig] = parts;
  if (user !== 'nancy') return false;
  const expires = Number(expiresStr);
  if (!expires || expires < Date.now()) return false;
  const expectedSig = hmacHex(getConfig('jwtSecret'), `${user}.${expiresStr}`);
  return sig === expectedSig;
}

function requireAuth(body) {
  if (!verifyToken(body.token)) {
    throw new Error('unauthorized');
  }
}

function handleLogin({ password }) {
  if (!password) throw new Error('password required');
  const expected = getConfig('adminPasswordHash');
  if (!expected) throw new Error('admin password not configured');
  if (sha256Hex(password) !== expected) throw new Error('invalid password');
  return issueToken();
}
```

- [ ] **Step 2: Add state transition + contacted endpoints**

Append:

```javascript
function setState({ slug, state, dateOverride }) {
  const validStates = ['searching', 'near-threshold', 'confirmed', 'postponed', 'completed'];
  if (!validStates.includes(state)) throw new Error('invalid state');
  const data = TOURS.getDataRange().getValues();
  const headers = data[0];
  const slugCol = headers.indexOf('slug');
  const stateCol = headers.indexOf('state');
  const tentativeCol = headers.indexOf('tentativeDate');
  const confirmedCol = headers.indexOf('confirmedDate');
  const updatedCol = headers.indexOf('updatedAt');
  for (let i = 1; i < data.length; i++) {
    if (data[i][slugCol] === slug) {
      TOURS.getRange(i + 1, stateCol + 1).setValue(state);
      if (state === 'confirmed' && dateOverride) {
        TOURS.getRange(i + 1, confirmedCol + 1).setValue(dateOverride);
      }
      if (state === 'postponed' && dateOverride) {
        TOURS.getRange(i + 1, tentativeCol + 1).setValue(dateOverride);
      }
      TOURS.getRange(i + 1, updatedCol + 1).setValue(new Date().toISOString());
      return { ok: true, slug, state };
    }
  }
  throw new Error('tour not found');
}

function markContacted({ leadId, value }) {
  const data = LEADS.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf('id');
  const contactedCol = headers.indexOf('contacted');
  const contactedAtCol = headers.indexOf('contactedAt');
  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === leadId) {
      LEADS.getRange(i + 1, contactedCol + 1).setValue(!!value);
      LEADS.getRange(i + 1, contactedAtCol + 1).setValue(value ? new Date().toISOString() : '');
      return { ok: true };
    }
  }
  throw new Error('lead not found');
}

function getLeads({ slug }) {
  return rowsToObjects(LEADS).filter((l) => !slug || l.slug === slug);
}
```

- [ ] **Step 3: Wire the new actions into `doPost` and `doGet`**

Replace the `doPost` function with:

```javascript
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    // Public
    if (action === 'interest') return jsonResponse(addInterest(body));
    if (action === 'login') return jsonResponse(handleLogin(body));
    // Auth-required
    requireAuth(body);
    if (action === 'setState') return jsonResponse(setState(body));
    if (action === 'markContacted') return jsonResponse(markContacted(body));
    return jsonResponse({ error: 'unknown action' }, 400);
  } catch (err) {
    return jsonResponse({ error: err.message }, err.message === 'unauthorized' ? 401 : 400);
  }
}
```

Replace `doGet` with:

```javascript
function doGet(e) {
  const action = (e.parameter.action || '').trim();
  try {
    if (action === 'tours') return jsonResponse(getAllTours());
    if (action === 'tour') return jsonResponse(getTour(e.parameter.slug));
    if (action === 'leads') {
      if (!verifyToken(e.parameter.token)) return jsonResponse({ error: 'unauthorized' }, 401);
      return jsonResponse(getLeads({ slug: e.parameter.slug }));
    }
    return jsonResponse({ error: 'unknown action' }, 400);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}
```

Save and redeploy (`Deploy → Manage deployments → ✏️ → New version → Deploy`).

- [ ] **Step 4: Verify login flow**

```bash
PASSWORD='<the password you set>'
RESP=$(curl -s -X POST "$APPS" -H 'Content-Type: application/json' \
  -d "{\"action\":\"login\",\"password\":\"$PASSWORD\"}")
echo "$RESP" | python3 -m json.tool
TOKEN=$(echo "$RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
echo "Token: $TOKEN"
```

Expected: a JSON object with `token` (format `nancy.<timestamp>.<hex>`) and `expiresAt` (epoch ms 7 days out).

Verify wrong password rejected:

```bash
curl -s -X POST "$APPS" -H 'Content-Type: application/json' \
  -d '{"action":"login","password":"wrong"}' | python3 -m json.tool
```

Expected: `{"error": "invalid password"}`.

- [ ] **Step 5: Verify `setState` works with auth**

```bash
curl -s -X POST "$APPS" -H 'Content-Type: application/json' \
  -d "{\"action\":\"setState\",\"slug\":\"chirripo\",\"state\":\"confirmed\",\"dateOverride\":\"13–15 jun · vie a dom\",\"token\":\"$TOKEN\"}" \
  | python3 -m json.tool
```

Expected: `{"ok": true, "slug": "chirripo", "state": "confirmed"}`.

Verify the Sheet row updated: `state` cell of `chirripo` row should now show `confirmed`.

Verify unauth rejected:

```bash
curl -s -X POST "$APPS" -H 'Content-Type: application/json' \
  -d '{"action":"setState","slug":"chirripo","state":"searching"}' | python3 -m json.tool
```

Expected: `{"error": "unauthorized"}`.

- [ ] **Step 6: Verify `markContacted` works**

```bash
LEAD_ID=$(curl -s "$APPS?action=leads&token=$TOKEN&slug=chirripo" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
curl -s -X POST "$APPS" -H 'Content-Type: application/json' \
  -d "{\"action\":\"markContacted\",\"leadId\":\"$LEAD_ID\",\"value\":true,\"token\":\"$TOKEN\"}" \
  | python3 -m json.tool
```

Expected: `{"ok": true}`. Sheet `leads` row should now show the checkbox ticked for that row.

- [ ] **Step 7: Update repo mirror + commit**

Update `docs/superpowers/setup/apps-script-code.md` with the new functions and then:

```bash
git add docs/superpowers/setup/apps-script-code.md
git commit -m "feat(backend): admin auth + setState + markContacted endpoints"
```

---

### Task 5: Apps Script — tour CRUD + image upload

**Files:**
- Apps Script: edit `Code.gs`
- Modify: `docs/superpowers/setup/apps-script-code.md`

- [ ] **Step 1: Add slug generation, `createTour`, `updateTour`, `deleteTour`**

Append to `Code.gs`:

```javascript
function slugify(s) {
  return String(s)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function uniqueSlug(base) {
  const existing = rowsToObjects(TOURS).map((t) => t.slug);
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

function createTour(body) {
  const title = String(body.title || '').trim();
  if (!title) throw new Error('title required');
  const slug = uniqueSlug(slugify(title));
  const now = new Date().toISOString();
  const headers = TOURS.getDataRange().getValues()[0];
  const row = headers.map((h) => {
    if (h === 'slug') return slug;
    if (h === 'createdAt' || h === 'updatedAt') return now;
    if (h === 'state') return body.state || 'searching';
    if (h === 'threshold') return Number(body.threshold) || 6;
    if (h === 'maxCapacity') return Number(body.maxCapacity) || 12;
    if (JSON_ARRAY_FIELDS.includes(h)) {
      return JSON.stringify(Array.isArray(body[h]) ? body[h] : []);
    }
    return body[h] != null ? body[h] : '';
  });
  TOURS.appendRow(row);
  return { ok: true, slug };
}

function updateTour(body) {
  const slug = body.slug;
  if (!slug) throw new Error('slug required');
  const data = TOURS.getDataRange().getValues();
  const headers = data[0];
  const slugCol = headers.indexOf('slug');
  for (let i = 1; i < data.length; i++) {
    if (data[i][slugCol] === slug) {
      headers.forEach((h, j) => {
        if (h === 'slug' || h === 'createdAt') return;
        if (h === 'updatedAt') { TOURS.getRange(i + 1, j + 1).setValue(new Date().toISOString()); return; }
        if (body[h] === undefined) return;
        const value = JSON_ARRAY_FIELDS.includes(h)
          ? JSON.stringify(Array.isArray(body[h]) ? body[h] : [])
          : body[h];
        TOURS.getRange(i + 1, j + 1).setValue(value);
      });
      return { ok: true, slug };
    }
  }
  throw new Error('tour not found');
}

function deleteTour({ slug }) {
  if (!slug) throw new Error('slug required');
  // Remove tour row
  const data = TOURS.getDataRange().getValues();
  const slugCol = data[0].indexOf('slug');
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][slugCol] === slug) {
      TOURS.deleteRow(i + 1);
      break;
    }
  }
  // Cascade-delete leads for this slug
  const leadsData = LEADS.getDataRange().getValues();
  const leadSlugCol = leadsData[0].indexOf('slug');
  for (let i = leadsData.length - 1; i >= 1; i--) {
    if (leadsData[i][leadSlugCol] === slug) {
      LEADS.deleteRow(i + 1);
    }
  }
  return { ok: true, slug };
}
```

- [ ] **Step 2: Add Cloudinary image upload**

Append:

```javascript
function uploadImage({ base64, filename }) {
  const cloudName = getConfig('cloudinaryCloudName');
  const apiKey = getConfig('cloudinaryApiKey');
  const apiSecret = getConfig('cloudinaryApiSecret');
  if (!cloudName || !apiKey || !apiSecret) throw new Error('cloudinary not configured');

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'nancy-tours';
  const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = sha1Hex(stringToSign);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const payload = {
    file: base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`,
    api_key: apiKey,
    timestamp: String(timestamp),
    signature,
    folder,
  };
  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    payload,
    muteHttpExceptions: true,
  });
  const result = JSON.parse(response.getContentText());
  if (result.secure_url) return { ok: true, url: result.secure_url, publicId: result.public_id };
  throw new Error(result.error?.message || 'upload failed');
}

function sha1Hex(s) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_1, s);
  return bytes.map((b) => (b < 0 ? b + 256 : b).toString(16).padStart(2, '0')).join('');
}
```

- [ ] **Step 3: Add `updateConfig`**

Append:

```javascript
function updateConfig({ key, value }) {
  const ALLOWED = ['notificationEmail', 'dailySummaryEnabled', 'adminPasswordHash'];
  if (!ALLOWED.includes(key)) throw new Error('config key not allowed');
  setConfig(key, value);
  return { ok: true };
}
```

- [ ] **Step 4: Wire all new admin actions into `doPost`**

Add these branches inside `doPost` after the existing `requireAuth(body);` line:

```javascript
    if (action === 'createTour') return jsonResponse(createTour(body));
    if (action === 'updateTour') return jsonResponse(updateTour(body));
    if (action === 'deleteTour') return jsonResponse(deleteTour(body));
    if (action === 'uploadImage') return jsonResponse(uploadImage(body));
    if (action === 'updateConfig') return jsonResponse(updateConfig(body));
```

Save and redeploy.

- [ ] **Step 5: Verify `createTour`**

```bash
curl -s -X POST "$APPS" -H 'Content-Type: application/json' \
  -d "{\"action\":\"createTour\",\"token\":\"$TOKEN\",\"title\":\"Test Tour\",\"threshold\":4,\"price\":\"\$99\"}" \
  | python3 -m json.tool
```

Expected: `{"ok": true, "slug": "test-tour"}`. Sheet `tours_status` should have a new row.

- [ ] **Step 6: Verify `updateTour`**

```bash
curl -s -X POST "$APPS" -H 'Content-Type: application/json' \
  -d "{\"action\":\"updateTour\",\"token\":\"$TOKEN\",\"slug\":\"test-tour\",\"price\":\"\$199\"}" \
  | python3 -m json.tool
```

Expected: `{"ok": true, "slug": "test-tour"}`. Sheet row should now show price `$199`.

- [ ] **Step 7: Verify `uploadImage`**

```bash
B64=$(base64 -i /Users/moisesvillalobos/Documents/clients/nancy-tours/web/img/chirripo-summit.jpg)
curl -s -X POST "$APPS" -H 'Content-Type: application/json' \
  -d "{\"action\":\"uploadImage\",\"token\":\"$TOKEN\",\"base64\":\"$B64\",\"filename\":\"test.jpg\"}" \
  | python3 -m json.tool
```

Expected: `{"ok": true, "url": "https://res.cloudinary.com/.../image/upload/.../nancy-tours/...jpg", "publicId": "..."}`. Open the URL in a browser — image should load.

- [ ] **Step 8: Verify `deleteTour` (cascades to leads)**

```bash
curl -s -X POST "$APPS" -H 'Content-Type: application/json' \
  -d "{\"action\":\"deleteTour\",\"token\":\"$TOKEN\",\"slug\":\"test-tour\"}" \
  | python3 -m json.tool
```

Expected: `{"ok": true, "slug": "test-tour"}`. Sheet should no longer have that row.

- [ ] **Step 9: Update repo mirror + commit**

Update `docs/superpowers/setup/apps-script-code.md` with the new functions:

```bash
git add docs/superpowers/setup/apps-script-code.md
git commit -m "feat(backend): tour CRUD + Cloudinary image upload"
```

---

## 🛑 Checkpoint 1 — Phase 1 review

Verify the backend is complete before moving on:

- [ ] All 9 endpoints work via curl (tours, tour, interest, login, setState, markContacted, createTour, updateTour, deleteTour, uploadImage, updateConfig, leads).
- [ ] Auth fails with no token / wrong token (401).
- [ ] Auth succeeds with valid token from `login`.
- [ ] Sheet `config` tab has all 8 keys populated.
- [ ] `docs/superpowers/setup/apps-script-code.md` mirrors what is deployed (run a diff if unsure).
- [ ] Public site is still working as before (no changes yet to repo files except docs).

If anything fails, fix before continuing to Phase 2.

---

## Phase 2 — Public site reads from API

**Phase goal:** Visitors see tours fetched from the Sheet via the API. The `tours-data.js` static file is gone. Cards show state badges and progress bars. Tour detail booking card morphs by state. Interest form modal works end to end.

---

### Task 6: Create `js/tours-api.js` (API wrapper)

**Files:**
- Create: `js/tours-api.js`
- Create: `js/config.js` — stores the Apps Script URL as a constant

- [ ] **Step 1: Create `js/config.js`**

```javascript
// Nancy Tours — runtime config (not secrets, just URLs).
// The Apps Script URL is public; auth tokens are session-scoped client-side.
window.NT_CONFIG = {
  apiUrl: 'https://script.google.com/macros/s/AKfycb.../exec', // ← paste the /exec URL from Phase 1
  cacheTtlMs: 60 * 1000,
};
```

Replace the placeholder with the real `/exec` URL from Phase 1.

- [ ] **Step 2: Create `js/tours-api.js`**

```javascript
// Wraps Apps Script API calls with session-cached reads and explicit error reporting.
(function () {
  'use strict';
  const URL = window.NT_CONFIG.apiUrl;
  const TTL = window.NT_CONFIG.cacheTtlMs;

  function cacheGet(key) {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      const { value, expires } = JSON.parse(raw);
      if (Date.now() > expires) return null;
      return value;
    } catch (e) { return null; }
  }

  function cacheSet(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify({ value, expires: Date.now() + TTL })); } catch (e) {}
  }

  async function getTours({ noCache } = {}) {
    const key = 'nt:tours';
    if (!noCache) {
      const cached = cacheGet(key);
      if (cached) return cached;
    }
    const res = await fetch(`${URL}?action=tours&_=${Date.now()}`);
    if (!res.ok) throw new Error(`getTours ${res.status}`);
    const data = await res.json();
    cacheSet(key, data);
    return data;
  }

  async function getTour(slug, { noCache } = {}) {
    const key = `nt:tour:${slug}`;
    if (!noCache) {
      const cached = cacheGet(key);
      if (cached) return cached;
    }
    const res = await fetch(`${URL}?action=tour&slug=${encodeURIComponent(slug)}&_=${Date.now()}`);
    if (!res.ok) throw new Error(`getTour ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    cacheSet(key, data);
    return data;
  }

  async function postInterest({ slug, name, whatsapp, numPeople }) {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },  // Apps Script quirk: avoids CORS preflight
      body: JSON.stringify({ action: 'interest', slug, name, whatsapp, numPeople }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    // Invalidate cached list + this tour so other tabs see the update
    sessionStorage.removeItem('nt:tours');
    sessionStorage.removeItem(`nt:tour:${slug}`);
    return data;
  }

  window.NT_API = { getTours, getTour, postInterest };
})();
```

- [ ] **Step 3: Verify in browser console**

Spin up the local server and open the console on any page:

```bash
cd /Users/moisesvillalobos/Documents/clients/nancy-tours/web
python3 -m http.server 8765 &
```

Add a temp `<script src="js/config.js"></script><script src="js/tours-api.js"></script>` to `index.html` head (just for testing) and reload.

In the browser console:

```javascript
await NT_API.getTours()
```

Expected: returns an array of tour objects, each with `slug`, `title`, `state`, `interested`, `derivedState`.

```javascript
await NT_API.getTour('chirripo')
```

Expected: returns the chirripo tour with the same shape.

- [ ] **Step 4: Remove the temp scripts from `index.html`** — they'll be added properly in later tasks.

- [ ] **Step 5: Commit**

```bash
git add js/config.js js/tours-api.js
git commit -m "feat(site): add tours-api.js wrapper with session cache"
```

---

### Task 7: Migrate the 13 existing tours into the Sheet

**Files:**
- Create: `scripts/migrate-tours-to-sheet.mjs`

- [ ] **Step 1: Write the migration script**

Create `scripts/migrate-tours-to-sheet.mjs`:

```javascript
// One-time migration: read js/tours-data.js, push each tour into the Sheet via the createTour API.
// Run: node scripts/migrate-tours-to-sheet.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CONFIG_URL = process.env.APPS_URL;
const PASSWORD = process.env.ADMIN_PASSWORD;

if (!CONFIG_URL || !PASSWORD) {
  console.error('Usage: APPS_URL=... ADMIN_PASSWORD=... node scripts/migrate-tours-to-sheet.mjs');
  process.exit(1);
}

// Load tours-data.js by eval — it ends with `window.TOURS = {...}`
const code = readFileSync(resolve(ROOT, 'js/tours-data.js'), 'utf8');
const globalThis_ = {};
eval(code.replace('window.TOURS', 'globalThis_.TOURS'));
const TOURS = globalThis_.TOURS;

// Map old shape to new shape (cupo "6/10" → threshold 6, maxCapacity 10)
function parseCupo(cupo) {
  if (typeof cupo !== 'string') return { threshold: 6, maxCapacity: 12 };
  const m = cupo.match(/(\d+)\s*\/\s*(\d+)/);
  if (!m) return { threshold: 6, maxCapacity: 12 };
  // The old format was "interested/cap". Treat the cap as threshold for migration;
  // Nancy will tune in admin later.
  return { threshold: Number(m[2]), maxCapacity: Number(m[2]) + 4 };
}

async function login() {
  const res = await fetch(CONFIG_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'login', password: PASSWORD }),
  });
  const data = await res.json();
  if (!data.token) throw new Error(`login failed: ${JSON.stringify(data)}`);
  return data.token;
}

async function createTour(token, slug, t) {
  const { threshold, maxCapacity } = parseCupo(t.cupo);
  const body = {
    action: 'createTour',
    token,
    title: t.title,
    tag: t.tag,
    loc: t.loc,
    elev: t.elev,
    hero: `https://nancy-tours-cr.vercel.app/${t.hero}`,  // points at existing repo image temporarily
    state: 'searching',
    threshold,
    maxCapacity,
    duration: t.duration,
    diff: t.diff,
    minAge: t.minAge,
    price: t.price,
    tentativeDate: t.nextDate,
    lead: t.lead,
    blurb: t.blurb,
    itinerary: t.itinerary || [],
    incl: t.incl || [],
    excl: t.excl || [],
    bring: t.bring || [],
    faq: t.faq || [],
    related: t.related || [],
  };
  const res = await fetch(CONFIG_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (data.error) throw new Error(`createTour ${slug}: ${data.error}`);
  return data;
}

async function main() {
  const token = await login();
  console.log('logged in');
  for (const [slug, t] of Object.entries(TOURS)) {
    if (slug === 'default') continue;
    try {
      const r = await createTour(token, slug, t);
      console.log(`✓ ${slug} → ${r.slug}`);
    } catch (e) {
      console.error(`✗ ${slug}: ${e.message}`);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Empty the Sheet of test data**

Open the Sheet → `tours_status` tab. Delete the test rows (`chirripo`, `test-tour`) you added in Phase 1. Also delete the test leads from the `leads` tab. Keep row 1 (headers) only.

- [ ] **Step 3: Run the migration**

```bash
cd /Users/moisesvillalobos/Documents/clients/nancy-tours/web
APPS_URL='https://script.google.com/macros/s/AKfycb.../exec' \
ADMIN_PASSWORD='<the password>' \
node scripts/migrate-tours-to-sheet.mjs
```

Expected output:

```
logged in
✓ chirripo → chirripo
✓ bajos-toro → bajos-toro
✓ tortuguero → tortuguero
... (10 more)
```

- [ ] **Step 4: Verify the Sheet now has 13 tours**

```bash
curl -s "$APPS?action=tours" | python3 -c "import sys,json; tours=json.load(sys.stdin); print(f'{len(tours)} tours, slugs: {[t[\"slug\"] for t in tours]}')"
```

Expected: `13 tours, slugs: ['chirripo', 'bajos-toro', 'tortuguero', ...]`.

- [ ] **Step 5: Commit the script (the script stays for future re-migration if needed)**

```bash
git add scripts/migrate-tours-to-sheet.mjs
git commit -m "scripts: migrate tours-data.js into Sheet (one-time)"
```

---

### Task 8: Add state badge + progress bar styles to `css/chrome.css`

**Files:**
- Modify: `css/chrome.css`

- [ ] **Step 1: Append state styles to `css/chrome.css`**

Add at the end of the file:

```css
/* ── Tour state badges + progress bars (interest-driven model) ─── */
.nt-state-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(13,13,10,0.85);
  color: #faf5e7;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
  padding: 7px 12px;
  text-transform: uppercase;
  font-family: 'Bricolage Grotesque', sans-serif;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  border-radius: 4px;
  z-index: 2;
}
.nt-state-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.nt-state--searching .nt-state-dot { background: #c99a3f; }
.nt-state--near-threshold .nt-state-dot {
  background: #c99a3f;
  animation: nt-state-pulse 1.6s ease-in-out infinite;
}
.nt-state--confirmed .nt-state-dot { background: #4ade80; }
.nt-state--postponed .nt-state-dot { background: #b5532e; }

@keyframes nt-state-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(1.45); }
}
@media (prefers-reduced-motion: reduce) {
  .nt-state--near-threshold .nt-state-dot { animation: none; }
}

.nt-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.nt-progress-bar {
  height: 6px;
  background: rgba(31,58,43,0.1);
  border-radius: 99px;
  overflow: hidden;
}
.nt-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #c99a3f, #b5532e);
  border-radius: 99px;
  transition: width .6s cubic-bezier(.2,.7,.2,1);
}
.nt-state--confirmed .nt-progress-fill { background: #16a34a; }

.nt-progress-text {
  font-size: 12px;
  color: #6b6256;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.nt-progress-text strong { color: #1a160e; font-weight: 700; }
.nt-progress-text .nt-progress-accent { color: #b5532e; font-weight: 700; }
.nt-state--confirmed .nt-progress-text .nt-progress-accent { color: #16a34a; }

/* Tentative vs confirmed date treatment */
.nt-date-tentative { color: #6b6256; font-size: 14px; font-weight: 600; }
.nt-date-tentative .nt-date-num {
  color: #1a160e;
  text-decoration: underline dashed #6b6256;
  text-underline-offset: 4px;
}
.nt-date-confirmed { color: #1a160e; font-size: 14px; font-weight: 700; }
.nt-date-confirmed::before { content: '✓ '; color: #16a34a; }
```

- [ ] **Step 2: Bump the shared CSS cache version**

```bash
cd /Users/moisesvillalobos/Documents/clients/nancy-tours/web
for f in *.html; do
  /usr/bin/sed -i '' 's|chrome\.css?v=8|chrome.css?v=9|g' "$f"
done
grep -h 'chrome.css?v' index.html | head -1
```

Expected: `<link rel="stylesheet" href="css/chrome.css?v=9" />`.

- [ ] **Step 3: Commit**

```bash
git add css/chrome.css *.html
git commit -m "feat(site): state badge + progress bar styles in chrome.css"
```

---

### Task 9: Render the catalog from the API (`tours.html` + `js/tours.js`)

**Files:**
- Create: `js/tours.js` — catalog renderer
- Modify: `tours.html` — load API + remove static cards + state filters
- Modify: `css/tours.css` — adjustments for state filter chips

- [ ] **Step 1: Replace the static card grid in `tours.html`**

Open `tours.html`. Find the `<section class="tp-grid-section">` element and replace its entire contents with:

```html
<section class="tp-grid-section">
  <div class="tp-state-filters" role="tablist" aria-label="Filtrar por estado">
    <button type="button" class="tp-state-filter is-active" data-filter="all">Todos</button>
    <button type="button" class="tp-state-filter" data-filter="near-threshold">🟠 Casi se confirman</button>
    <button type="button" class="tp-state-filter" data-filter="confirmed">🟢 Confirmados</button>
    <button type="button" class="tp-state-filter" data-filter="searching">🟡 Buscando</button>
    <button type="button" class="tp-state-filter" data-filter="postponed">🔴 Pospuestos</button>
  </div>

  <div id="tp-grid" class="tp-grid" aria-live="polite" aria-busy="true">
    <p class="tp-loading">Cargando tours…</p>
  </div>
</section>
```

Also remove the entire `<section class="tp-featured">…</section>` block (the static "PRÓXIMA SALIDA · 14 JUN" card) and the now-broken static filter chips (the `tp-filters` section at the top), keeping only the hero and the grid section.

- [ ] **Step 2: Add the API + renderer scripts at the bottom of `tours.html`**

Just before `</body>` add (after the existing `chrome.js`):

```html
<script src="js/config.js" defer></script>
<script src="js/tours-api.js" defer></script>
<script src="js/tours.js" defer></script>
```

- [ ] **Step 3: Create `js/tours.js`**

```javascript
// Catalog renderer — fetches tours via NT_API and renders cards with state filtering.
(function () {
  'use strict';

  const STATE_ORDER = ['near-threshold', 'confirmed', 'searching', 'postponed'];
  const STATE_LABELS = {
    'searching': 'BUSCANDO INTERESADOS',
    'near-threshold': 'CASI SE CONFIRMA',
    'confirmed': '✓ CONFIRMADO',
    'postponed': 'POSPUESTO · NUEVA FECHA',
  };

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  function ctaLabel(state) {
    if (state === 'confirmed') return 'Reservar →';
    if (state === 'postponed') return 'Me sumo en esta fecha →';
    if (state === 'near-threshold') return 'Sumarme →';
    return 'Me interesa →';
  }

  function progressText(tour) {
    const state = tour.derivedState;
    const n = tour.interested || 0;
    const t = tour.threshold || 0;
    if (state === 'confirmed') {
      const remaining = Math.max(0, (tour.maxCapacity || t) - n);
      return `<span><strong>${n}</strong> personas en ruta</span>
              <span class="nt-progress-accent">${remaining > 0 ? `Quedan ${remaining} cupos` : 'Tour lleno'}</span>`;
    }
    const remaining = Math.max(0, t - n);
    const accent = state === 'near-threshold' && remaining > 0 ? '🔥' : '';
    return `<span><strong>${n}</strong> interesados</span>
            <span class="nt-progress-accent">Faltan ${remaining} más ${accent}</span>`;
  }

  function progressPercent(tour) {
    const n = tour.interested || 0;
    const t = tour.threshold || 1;
    if (tour.derivedState === 'confirmed') return 100;
    return Math.min(100, Math.round((n / t) * 100));
  }

  function dateBlock(tour) {
    if (tour.derivedState === 'confirmed') {
      return `<div class="nt-date-confirmed"><span class="nt-date-num">${escapeHtml(tour.confirmedDate || tour.tentativeDate)}</span></div>`;
    }
    const label = tour.derivedState === 'postponed' ? 'Nueva fecha tentativa:' : 'Fecha tentativa:';
    return `<div class="nt-date-tentative"><span>📅 ${label}</span> <span class="nt-date-num">${escapeHtml(tour.tentativeDate)}</span></div>`;
  }

  function renderCard(tour) {
    const state = tour.derivedState;
    const stateClass = `nt-state--${state}`;
    const badge = STATE_LABELS[state] + (state === 'near-threshold' ? ` · FALTAN ${Math.max(0, tour.threshold - tour.interested)}` : '');
    return `
      <a href="tour-detail.html?id=${encodeURIComponent(tour.slug)}" class="nt-tour-card ${stateClass}">
        <div class="nt-tour-photo" style="background-image: url('${escapeHtml(tour.hero || '')}')">
          <span class="nt-state-badge"><span class="nt-state-dot"></span>${escapeHtml(badge)}</span>
        </div>
        <div class="nt-tour-body">
          <div>
            <h3 class="nt-tour-title">${escapeHtml(tour.title)}</h3>
            <div class="nt-tour-loc">${escapeHtml(tour.loc || '')}</div>
          </div>
          ${dateBlock(tour)}
          <div class="nt-progress">
            <div class="nt-progress-bar"><div class="nt-progress-fill" style="width: ${progressPercent(tour)}%"></div></div>
            <div class="nt-progress-text">${progressText(tour)}</div>
          </div>
          <div class="nt-tour-foot">
            <div><span class="nt-meta-k">DESDE</span><strong class="nt-tour-price">${escapeHtml(tour.price || '')}</strong></div>
            <span class="nt-tour-cta">${escapeHtml(ctaLabel(state))}</span>
          </div>
        </div>
      </a>
    `;
  }

  function sortTours(tours) {
    return [...tours].sort((a, b) => STATE_ORDER.indexOf(a.derivedState) - STATE_ORDER.indexOf(b.derivedState));
  }

  function render(tours, filter) {
    const grid = document.getElementById('tp-grid');
    if (!grid) return;
    const filtered = filter === 'all' ? tours : tours.filter((t) => t.derivedState === filter);
    const sorted = sortTours(filtered);
    if (sorted.length === 0) {
      grid.innerHTML = `<p class="tp-empty">No hay tours en este estado por ahora.</p>`;
    } else {
      grid.innerHTML = sorted.map(renderCard).join('');
    }
    grid.setAttribute('aria-busy', 'false');
  }

  function wireFilters(tours) {
    const buttons = document.querySelectorAll('.tp-state-filter');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
        render(tours, btn.dataset.filter);
      });
    });
  }

  async function main() {
    try {
      const tours = await window.NT_API.getTours();
      render(tours, 'all');
      wireFilters(tours);
    } catch (e) {
      const grid = document.getElementById('tp-grid');
      if (grid) grid.innerHTML = `<p class="tp-error">No pudimos cargar los tours. Refrescá la página o probá en unos minutos.</p>`;
      console.error('tours.js:', e);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
  else main();
})();
```

- [ ] **Step 4: Add styles for the filter chips and loading state to `css/tours.css`**

Append:

```css
.tp-state-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}
.tp-state-filter {
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  background: #fff;
  color: #1a160e;
  border: 1px solid rgba(31,58,43,0.15);
  cursor: pointer;
  font-family: inherit;
  border-radius: 4px;
  transition: background .15s, color .15s, border-color .15s;
}
.tp-state-filter.is-active {
  background: #1f3a2b;
  color: #faf5e7;
  border-color: #1f3a2b;
}
.tp-loading, .tp-empty, .tp-error {
  grid-column: 1 / -1;
  text-align: center;
  padding: 64px 24px;
  color: #6b6256;
  font-style: italic;
}
.tp-error { color: #b5532e; }
```

Bump cache: `css/tours.css?v=2` → `?v=3` in `tours.html`.

- [ ] **Step 5: Verify locally**

```bash
cd /Users/moisesvillalobos/Documents/clients/nancy-tours/web
python3 -m http.server 8765 &
```

Open `http://127.0.0.1:8765/tours.html` in the browser. Expected:
- Brief "Cargando tours…" message.
- Then 13 cards appear, each with a state badge in the upper-left of the photo, a progress bar, and a "Me interesa →" / "Sumarme →" / "Reservar →" CTA depending on state.
- Click "🟡 Buscando" filter — only `searching` tours remain. Click "Todos" — all return.

Use Chrome DevTools MCP to capture a screenshot at viewport 390×844 for the mobile case.

- [ ] **Step 6: Commit**

```bash
git add js/tours.js tours.html css/tours.css
git commit -m "feat(site): render tours catalog from API with state filters"
```

---

### Task 10: Refactor `tour-detail.html` + `js/tour-detail.js` to use the API and morph by state

**Files:**
- Modify: `js/tour-detail.js`
- Modify: `tour-detail.html` (small DOM additions for the state-driven booking card)
- Modify: `css/tour-detail.css` (additions for state variants)

- [ ] **Step 1: In `tour-detail.html`, replace the static booking card with morphable slots**

Find `<aside class="td-book">…</aside>` and replace its entire contents with:

```html
<aside class="td-book" data-td-state="searching">
  <div class="td-book-state">
    <span class="nt-state-dot"></span>
    <span data-td="stateBadge">BUSCANDO INTERESADOS</span>
  </div>

  <div class="td-book-date-block">
    <span class="td-book-date-label" data-td="dateLabel">Fecha tentativa</span>
    <div class="td-book-date" data-td="dateValue">—</div>
    <small class="td-book-date-note" data-td="dateNote">(sujeta a confirmación de cupo)</small>
  </div>

  <div class="td-book-progress nt-progress">
    <div class="nt-progress-bar"><div class="nt-progress-fill" data-td="progressFill" style="width:0%"></div></div>
    <div class="nt-progress-text" data-td="progressText">—</div>
  </div>

  <div class="td-book-meta">
    <div><span class="td-meta-k">DURACIÓN</span><span class="td-meta-v" data-td="duration"></span></div>
    <div><span class="td-meta-k">NIVEL</span><span class="td-meta-v" data-td="diff"></span></div>
    <div><span class="td-meta-k">EDAD MÍN.</span><span class="td-meta-v" data-td="minAge"></span></div>
    <div><span class="td-meta-k">CUPO MÁX.</span><span class="td-meta-v" data-td="maxCapacity"></span></div>
  </div>

  <div class="td-price-block">
    <span class="td-meta-k" data-td="priceLabel">ESTIMADO POR PERSONA</span>
    <strong class="td-price" data-td="price"></strong>
  </div>

  <div class="td-book-actions" data-td-actions></div>

  <div class="td-book-hint" data-td="hint">Sin compromiso de pago. Nancy te contacta cuando el tour se confirma.</div>
</aside>
```

- [ ] **Step 2: Rewrite `js/tour-detail.js` to fetch from API and morph the booking card**

Replace the entire file with:

```javascript
// Reads ?id= from URL, fetches the tour via NT_API, populates [data-td] slots,
// and morphs the booking card based on the tour state.
(function () {
  'use strict';

  const STATE_LABELS = {
    'searching': 'BUSCANDO INTERESADOS',
    'near-threshold': 'CASI SE CONFIRMA',
    'confirmed': '✓ CONFIRMADO',
    'postponed': 'POSPUESTO · NUEVA FECHA',
    'completed': '🏁 TOUR COMPLETADO',
  };

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }
  function escapeCssUrl(s) {
    return String(s ?? '').replace(/[\\"'() <>]/g, (c) => '\\' + c);
  }

  function getTourId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'chirripo';
  }

  function setText(key, value) {
    document.querySelectorAll(`[data-td="${key}"]`).forEach((el) => { el.textContent = value || ''; });
  }

  function actionsHtml(tour) {
    const wa = window.NT?.contact?.waMsg || ((msg) => `https://wa.me/50688787370?text=${encodeURIComponent(msg)}`);
    if (tour.derivedState === 'confirmed') {
      const msg = `¡Hola Nancy! Quiero reservar el tour de ${tour.title} (${tour.confirmedDate || tour.tentativeDate}).`;
      return `
        <a href="${wa(msg)}" target="_blank" rel="noopener noreferrer" class="nt-btn nt-btn-wa td-book-btn">
          <span class="nt-wa-icon">w</span>Reservar por WhatsApp
        </a>
        <a href="contacto.html" class="nt-btn nt-btn-ghost td-book-btn">Formulario de reserva →</a>
      `;
    }
    if (tour.derivedState === 'completed') {
      return `<a href="tours.html" class="nt-btn nt-btn-ghost td-book-btn">Ver tours abiertos →</a>`;
    }
    const cta = tour.derivedState === 'near-threshold' ? 'Sumarme al tour'
              : tour.derivedState === 'postponed' ? 'Me sumo en esta fecha'
              : 'Me interesa';
    return `<button type="button" class="nt-btn nt-btn-primary td-book-btn" data-open-interest>${cta} →</button>`;
  }

  function renderBookingCard(tour) {
    const aside = document.querySelector('.td-book');
    if (!aside) return;
    const state = tour.derivedState;
    aside.dataset.tdState = state;
    aside.classList.remove('nt-state--searching','nt-state--near-threshold','nt-state--confirmed','nt-state--postponed','nt-state--completed');
    aside.classList.add(`nt-state--${state}`);

    // Badge
    setText('stateBadge', STATE_LABELS[state] + (state === 'near-threshold' ? ` · FALTAN ${Math.max(0, tour.threshold - tour.interested)}` : ''));

    // Date
    const isConfirmed = state === 'confirmed';
    const dateLabel = isConfirmed ? 'Fecha definitiva' : (state === 'postponed' ? 'Nueva fecha tentativa' : 'Fecha tentativa');
    setText('dateLabel', dateLabel);
    setText('dateValue', isConfirmed ? (tour.confirmedDate || tour.tentativeDate) : tour.tentativeDate || '—');
    const noteEl = document.querySelector('[data-td="dateNote"]');
    if (noteEl) noteEl.style.display = isConfirmed ? 'none' : '';

    // Progress
    const n = tour.interested || 0;
    const t = tour.threshold || 1;
    const fill = document.querySelector('[data-td="progressFill"]');
    if (fill) fill.style.width = (isConfirmed ? 100 : Math.min(100, Math.round((n / t) * 100))) + '%';
    const text = document.querySelector('[data-td="progressText"]');
    if (text) {
      const max = tour.maxCapacity || t;
      const remaining = Math.max(0, max - n);
      if (isConfirmed) {
        text.innerHTML = `<span><strong>${n}</strong> personas en ruta</span><span class="nt-progress-accent">${remaining > 0 ? `Quedan ${remaining} cupos` : 'Tour lleno'}</span>`;
      } else if (state === 'completed') {
        text.innerHTML = `<span><strong>${n}</strong> personas hicieron este tour</span>`;
      } else {
        text.innerHTML = `<span><strong>${n}</strong> de ${t} interesados</span><span class="nt-progress-accent">Faltan ${Math.max(0, t - n)} más ${state === 'near-threshold' ? '🔥' : ''}</span>`;
      }
    }

    // Meta
    setText('duration', tour.duration);
    setText('diff', tour.diff);
    setText('minAge', tour.minAge);
    setText('maxCapacity', tour.maxCapacity || '—');

    // Price label
    setText('priceLabel', isConfirmed ? 'POR PERSONA' : 'ESTIMADO POR PERSONA');
    setText('price', tour.price);

    // Actions
    const actions = document.querySelector('[data-td-actions]');
    if (actions) actions.innerHTML = actionsHtml(tour);

    // Hint
    const hintMap = {
      'searching': 'Sin compromiso de pago. Nancy te contacta cuando el tour se confirma.',
      'near-threshold': 'Casi se lanza. Sumate y Nancy te confirma por WhatsApp.',
      'confirmed': 'Apartá 50% con SINPE para asegurar tu lugar.',
      'postponed': 'Si no llegamos al cupo, buscamos otra fecha juntos.',
      'completed': 'Este tour ya pasó. Mirá los abiertos →',
    };
    setText('hint', hintMap[state] || '');

    // Wire the interest button if present
    const openBtn = aside.querySelector('[data-open-interest]');
    if (openBtn && window.NT_INTEREST_MODAL) {
      openBtn.addEventListener('click', () => window.NT_INTEREST_MODAL.open(tour));
    }
  }

  function renderHero(tour) {
    document.title = `${tour.title} · Nancy Tours Costa Rica`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', tour.lead || '');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', `${tour.title} · Nancy Tours Costa Rica`);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', tour.lead || '');
    const heroBg = document.querySelector('[data-td="hero-bg"]');
    if (heroBg && tour.hero) heroBg.style.backgroundImage = `url("${escapeCssUrl(tour.hero)}")`;
    ['title', 'tag', 'loc', 'elev', 'lead', 'blurb'].forEach((k) => setText(k, tour[k]));
  }

  function renderItinerary(tour) {
    const slot = document.querySelector('[data-td-slot="itinerary"]');
    const block = document.querySelector('[data-td-block="itinerary"]');
    if (!slot || !block) return;
    if (!Array.isArray(tour.itinerary) || !tour.itinerary.length) return;
    slot.innerHTML = tour.itinerary.map((day) => `
      <div class="td-day-block">
        <div class="td-day-label">${escapeHtml(day.d)}</div>
        <ul class="td-day-list">${day.items.map((it) => `<li>${escapeHtml(it)}</li>`).join('')}</ul>
      </div>
    `).join('');
    block.hidden = false;
  }

  function renderLists(tour) {
    const inclBlock = document.querySelector('[data-td-block="includes"]');
    if (inclBlock && ((tour.incl?.length) || (tour.excl?.length))) {
      document.querySelector('[data-td-slot="incl"]').innerHTML = (tour.incl || []).map((x) => `<li>${escapeHtml(x)}</li>`).join('');
      document.querySelector('[data-td-slot="excl"]').innerHTML = (tour.excl || []).map((x) => `<li>${escapeHtml(x)}</li>`).join('');
      inclBlock.hidden = false;
    }
    const bringSlot = document.querySelector('[data-td-slot="bring"]');
    const bringBlock = document.querySelector('[data-td-block="bring"]');
    if (bringSlot && bringBlock && (tour.bring?.length)) {
      bringSlot.innerHTML = tour.bring.map((x) => `<li>${escapeHtml(x)}</li>`).join('');
      bringBlock.hidden = false;
    }
    const faqSlot = document.querySelector('[data-td-slot="faq"]');
    const faqBlock = document.querySelector('[data-td-block="faq"]');
    if (faqSlot && faqBlock && (tour.faq?.length)) {
      faqSlot.innerHTML = tour.faq.map(([q, a]) => `
        <div class="td-faq-item"><h3 class="td-faq-q">${escapeHtml(q)}</h3><p class="td-faq-a">${escapeHtml(a)}</p></div>
      `).join('');
      faqBlock.hidden = false;
    }
  }

  async function main() {
    const slug = getTourId();
    try {
      const tour = await window.NT_API.getTour(slug);
      renderHero(tour);
      renderItinerary(tour);
      renderLists(tour);
      renderBookingCard(tour);
    } catch (e) {
      console.error('tour-detail.js:', e);
      const main = document.querySelector('main');
      if (main) main.innerHTML = `<section style="padding:96px 24px;text-align:center"><h1>Tour no encontrado</h1><p><a href="tours.html">← Ver todos los tours</a></p></section>`;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
  else main();
})();
```

- [ ] **Step 3: Update `tour-detail.html` script loading**

Find the script block at the bottom and replace the static `tours-data.js` line with the API + new detail script:

```html
<script src="js/config.js" defer></script>
<script src="js/tours-api.js" defer></script>
<script src="js/interest-modal.js" defer></script>
<script src="js/tour-detail.js" defer></script>
```

(`interest-modal.js` is added in Task 11.)

- [ ] **Step 4: Add booking-card state styles to `css/tour-detail.css`**

Append:

```css
.td-book-state {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  margin-bottom: 18px;
  background: rgba(13,13,10,0.08);
}
.td-book[data-td-state="confirmed"] .td-book-state { background: rgba(22,163,74,0.12); color: #16a34a; }
.td-book[data-td-state="confirmed"] .nt-state-dot { background: #16a34a; }
.td-book[data-td-state="near-threshold"] .td-book-state { background: rgba(201,154,63,0.16); color: #8e3d20; }
.td-book[data-td-state="near-threshold"] .nt-state-dot { background: #c99a3f; animation: nt-state-pulse 1.6s ease-in-out infinite; }
.td-book[data-td-state="postponed"] .td-book-state { background: rgba(181,83,46,0.12); color: #b5532e; }
.td-book[data-td-state="postponed"] .nt-state-dot { background: #b5532e; }
.td-book[data-td-state="searching"] .nt-state-dot { background: #c99a3f; }

.td-book-date-block { margin-bottom: 18px; }
.td-book-date-label { font-size: 11px; letter-spacing: 0.18em; font-weight: 700; color: #6b6256; font-family: 'Bricolage Grotesque', sans-serif; }
.td-book-date { font-family: 'Bricolage Grotesque', sans-serif; font-size: 22px; font-weight: 800; color: #1a160e; margin-top: 4px; }
.td-book-date-note { color: #6b6256; font-size: 12px; }

.td-book-progress { margin-bottom: 18px; }

.td-book-actions .td-book-btn { width: 100%; justify-content: center; margin-bottom: 10px; }

.td-book-hint { font-size: 12px; color: #6b6256; line-height: 1.5; margin-top: 12px; }
```

Bump cache: `css/tour-detail.css?v=2` → `?v=3` in `tour-detail.html`.

- [ ] **Step 5: Verify locally**

Open `http://127.0.0.1:8765/tour-detail.html?id=chirripo`.

Expected:
- Title `Cerro Chirripó`, hero photo from Cloudinary URL.
- Booking card on the right showing **🟡 BUSCANDO INTERESADOS** badge, "Fecha tentativa" with the seeded value, a 0% progress bar, the **"Me interesa →"** button, and the hint about no payment.
- The itinerary, includes/excludes, qué llevar, and FAQ sections render from the Sheet data.

Open with a slug that doesn't exist:
`http://127.0.0.1:8765/tour-detail.html?id=does-not-exist` → expected: "Tour no encontrado" fallback page.

- [ ] **Step 6: Commit**

```bash
git add js/tour-detail.js tour-detail.html css/tour-detail.css
git commit -m "feat(site): tour-detail fetches from API and morphs booking card by state"
```

---

### Task 11: Build the interest modal (`js/interest-modal.js` + `css/interest-modal.css`)

**Files:**
- Create: `js/interest-modal.js`
- Create: `css/interest-modal.css`
- Modify: `tour-detail.html` (add the CSS link)
- Modify: `tours.html` (same — interest modal can also be triggered from catalog cards in the future)

- [ ] **Step 1: Create `css/interest-modal.css`**

```css
.nt-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(13,13,10,0.7);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  opacity: 0;
  transition: opacity .2s ease;
}
.nt-modal-overlay.is-open { opacity: 1; }
.nt-modal {
  background: #faf5e7;
  max-width: 480px;
  width: 100%;
  padding: 32px;
  border-radius: 4px;
  transform: translateY(12px);
  transition: transform .25s cubic-bezier(.2,.7,.2,1);
  max-height: 90vh;
  overflow-y: auto;
}
.nt-modal-overlay.is-open .nt-modal { transform: translateY(0); }
.nt-modal-close {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b6256;
  float: right;
  padding: 0;
  line-height: 1;
}
.nt-modal-eyebrow {
  font-size: 11px;
  letter-spacing: 0.22em;
  font-weight: 700;
  color: #b5532e;
  margin-bottom: 8px;
}
.nt-modal h2 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 18px;
  line-height: 1.1;
}
.nt-modal .nt-modal-tour { font-weight: 700; color: #1a160e; }

.nt-modal-form { display: flex; flex-direction: column; gap: 14px; }
.nt-modal-field { display: flex; flex-direction: column; gap: 6px; }
.nt-modal-field label {
  font-size: 11px;
  letter-spacing: 0.16em;
  font-weight: 700;
  color: #6b6256;
  font-family: 'Bricolage Grotesque', sans-serif;
}
.nt-modal-field input, .nt-modal-field select {
  padding: 12px 14px;
  font-size: 14px;
  border: 1px solid rgba(31,58,43,0.2);
  background: #fff;
  font-family: inherit;
  border-radius: 0;
}
.nt-modal-field input:focus, .nt-modal-field select:focus { outline: 3px solid #b5532e; outline-offset: 2px; }
.nt-modal-field.is-invalid input,
.nt-modal-field.is-invalid select { border-color: #b5532e; background: rgba(181,83,46,0.04); }
.nt-modal-error { color: #b5532e; font-size: 12px; font-weight: 600; }

.nt-modal-check { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #3a3328; }
.nt-modal-submit { background: #0d7565; color: #fff; padding: 14px; font-weight: 700; border: none; cursor: pointer; font-size: 14px; }
.nt-modal-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.nt-modal-foot { font-size: 12px; color: #6b6256; line-height: 1.5; margin-top: 8px; }

.nt-modal-success { text-align: center; padding: 24px 0; }
.nt-modal-success-icon { font-size: 56px; line-height: 1; margin-bottom: 18px; }
.nt-modal-success h2 { margin: 0 0 12px; }
.nt-modal-success p { font-size: 16px; line-height: 1.5; color: #3a3328; }
```

- [ ] **Step 2: Create `js/interest-modal.js`**

```javascript
// Modal for "Me interesa" / "Sumarme" / etc. Builds itself once on first open.
(function () {
  'use strict';

  let overlay = null;
  let currentTour = null;

  function ensureDom() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'nt-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'nt-modal-title');
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="nt-modal">
        <button type="button" class="nt-modal-close" aria-label="Cerrar">✕</button>
        <div class="nt-modal-form-wrap">
          <div class="nt-modal-eyebrow">🌿 SUMATE AL TOUR</div>
          <h2 id="nt-modal-title">Sumate a <span class="nt-modal-tour"></span></h2>
          <form class="nt-modal-form" novalidate>
            <div class="nt-modal-field" data-field="name">
              <label for="nt-modal-name">TU NOMBRE</label>
              <input id="nt-modal-name" name="name" type="text" placeholder="María Solís" />
            </div>
            <div class="nt-modal-field" data-field="whatsapp">
              <label for="nt-modal-whatsapp">TU WHATSAPP</label>
              <input id="nt-modal-whatsapp" name="whatsapp" type="tel" placeholder="+506 ____ ____" />
            </div>
            <div class="nt-modal-field" data-field="numPeople">
              <label for="nt-modal-num">¿CUÁNTAS PERSONAS?</label>
              <select id="nt-modal-num" name="numPeople">
                ${Array.from({ length: 10 }, (_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}
              </select>
            </div>
            <label class="nt-modal-check">
              <input type="checkbox" name="consent" />
              <span>Acepto que Nancy me contacte por WhatsApp</span>
            </label>
            <button type="submit" class="nt-modal-submit">Sumarme al tour →</button>
            <p class="nt-modal-foot">Sin pago ahora. Nancy te avisa cuando el tour se confirma.</p>
          </form>
        </div>
        <div class="nt-modal-success" hidden>
          <div class="nt-modal-success-icon">🎉</div>
          <h2 class="nt-modal-success-title">¡Listo!</h2>
          <p class="nt-modal-success-msg"></p>
          <button type="button" class="nt-btn nt-btn-ghost" style="margin-top:18px" data-close>Cerrar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('.nt-modal-close').addEventListener('click', close);
    overlay.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    overlay.querySelector('form').addEventListener('submit', submit);
  }

  function setError(field, message) {
    const wrap = overlay.querySelector(`[data-field="${field}"]`);
    if (!wrap) return;
    wrap.classList.add('is-invalid');
    let err = wrap.querySelector('.nt-modal-error');
    if (!err) {
      err = document.createElement('div');
      err.className = 'nt-modal-error';
      wrap.appendChild(err);
    }
    err.textContent = message;
  }

  function clearErrors() {
    overlay.querySelectorAll('.nt-modal-field').forEach((w) => w.classList.remove('is-invalid'));
    overlay.querySelectorAll('.nt-modal-error').forEach((e) => e.remove());
  }

  async function submit(e) {
    e.preventDefault();
    clearErrors();
    const form = e.currentTarget;
    const name = form.elements.name.value.trim();
    const whatsapp = form.elements.whatsapp.value.trim();
    const numPeople = Number(form.elements.numPeople.value);
    const consent = form.elements.consent.checked;
    let firstError = null;
    if (!name || name.length < 2) { setError('name', 'Necesito tu nombre.'); firstError ||= 'name'; }
    if (!/^[+\d][\d\s().-]{6,}$/.test(whatsapp)) { setError('whatsapp', 'Número inválido. Ej: +506 8888-8888'); firstError ||= 'whatsapp'; }
    if (!consent) { setError('numPeople', 'Confirmá el consentimiento abajo.'); firstError ||= 'numPeople'; }
    if (firstError) {
      const el = overlay.querySelector(`[data-field="${firstError}"] input, [data-field="${firstError}"] select`);
      if (el) el.focus();
      return;
    }
    const btn = form.querySelector('.nt-modal-submit');
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    try {
      const result = await window.NT_API.postInterest({ slug: currentTour.slug, name, whatsapp, numPeople });
      showSuccess(name, result);
    } catch (err) {
      console.error(err);
      btn.disabled = false;
      btn.textContent = 'Sumarme al tour →';
      setError('numPeople', 'Algo salió mal. Probá de nuevo o WhatsApp a Nancy.');
    }
  }

  function showSuccess(name, result) {
    overlay.querySelector('.nt-modal-form-wrap').hidden = true;
    const succ = overlay.querySelector('.nt-modal-success');
    succ.hidden = false;
    const remaining = Math.max(0, (result.threshold || 0) - (result.newCount || 0));
    const msg = remaining > 0
      ? `${name}, sos parte del tour. Faltan ${remaining} más para que se confirme. Te aviso por WhatsApp.`
      : `${name}, ya llegamos al cupo. Te contacto pronto para confirmar la fecha.`;
    succ.querySelector('.nt-modal-success-msg').textContent = msg;
  }

  function open(tour) {
    ensureDom();
    currentTour = tour;
    clearErrors();
    overlay.querySelector('.nt-modal-form-wrap').hidden = false;
    overlay.querySelector('.nt-modal-success').hidden = true;
    overlay.querySelector('form').reset();
    const submitBtn = overlay.querySelector('.nt-modal-submit');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sumarme al tour →';
    overlay.querySelector('.nt-modal-tour').textContent = tour.title || 'este tour';
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    setTimeout(() => overlay.querySelector('#nt-modal-name').focus(), 200);
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { overlay.hidden = true; }, 200);
  }

  window.NT_INTEREST_MODAL = { open, close };
})();
```

- [ ] **Step 3: Add the CSS link + script tag to `tour-detail.html` and `tours.html`**

In both files, in the `<head>`:

```html
<link rel="stylesheet" href="css/interest-modal.css?v=1" />
```

In `tours.html` script tags at the bottom, add before `js/tours.js`:

```html
<script src="js/interest-modal.js" defer></script>
```

(`tour-detail.html` already has it from Task 10 Step 3.)

- [ ] **Step 4: Verify locally**

Reload `tour-detail.html?id=chirripo`. Click **"Me interesa →"**.

Expected:
- Modal opens with title "Sumate a Cerro Chirripó", 3 fields, consent checkbox, submit button.
- Empty submit: errors appear under each required field. The name field focuses.
- Fill the fields, check consent, submit.
- Success screen: "🎉 ¡Listo! María Solís, sos parte del tour. Faltan N más para que se confirme."

Open the Sheet → `leads` tab — a new row should be visible with the submitted data.

Re-open the same tour page: the booking card should show one more interested person (cache invalidated by `postInterest`).

- [ ] **Step 5: Commit**

```bash
git add css/interest-modal.css js/interest-modal.js tour-detail.html tours.html
git commit -m "feat(site): interest modal + integration into tour detail"
```

---

### Task 12: "Tours que casi se lanzan" section on the home page

**Files:**
- Modify: `index.html` (add new section in markup)
- Modify: `css/home.css` (styles for the new section)
- Create: `js/home-near-threshold.js` (fetches and renders)

- [ ] **Step 1: Add the section markup to `index.html`**

Find `<!-- ── Intro de Nancy ────────────────────── -->` and add this just BEFORE it (i.e., between the marquee and the intro):

```html
<!-- ── Tours que casi se lanzan ─────────────────── -->
<section class="nt-soonish" id="nt-soonish" hidden aria-labelledby="soonish-h">
  <div class="nt-soonish-inner">
    <div class="nt-soonish-head">
      <div>
        <div class="nt-eyebrow-dark" data-i18n="soonish.eyebrow">★ TOURS QUE CASI SE LANZAN</div>
        <h2 id="soonish-h" class="nt-h2" data-i18n="soonish.h2">Faltan pocos para que estos salgan.</h2>
      </div>
      <a href="tours.html" class="nt-view-all" data-i18n="soonish.viewAll">Ver todos →</a>
    </div>
    <div id="nt-soonish-grid" class="nt-tour-grid"></div>
  </div>
</section>
```

- [ ] **Step 2: Append i18n keys**

Edit `js/i18n.js`. In both `es` and `en` dictionaries, add:

```javascript
// Inside es:
'soonish.eyebrow': '★ TOURS QUE CASI SE LANZAN',
'soonish.h2': 'Faltan pocos para que estos salgan.',
'soonish.viewAll': 'Ver todos →',

// Inside en:
'soonish.eyebrow': '★ TOURS ABOUT TO LAUNCH',
'soonish.h2': 'A few more and these are happening.',
'soonish.viewAll': 'See all →',
```

- [ ] **Step 3: Append styles to `css/home.css`**

```css
.nt-soonish {
  background: #faf5e7;
  padding: 96px 48px;
}
.nt-soonish-inner { max-width: 1280px; margin: 0 auto; }
.nt-soonish-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; gap: 24px; flex-wrap: wrap; }
@media (max-width: 720px) {
  .nt-soonish { padding: 56px 20px; }
}
```

Bump `css/home.css?v=4` → `?v=5` in all HTMLs.

- [ ] **Step 4: Create `js/home-near-threshold.js`**

```javascript
// Renders up to 3 tours in near-threshold state into the home page section.
// Hidden entirely if zero such tours exist.
(function () {
  'use strict';
  async function main() {
    const section = document.getElementById('nt-soonish');
    const grid = document.getElementById('nt-soonish-grid');
    if (!section || !grid || !window.NT_API) return;
    try {
      const tours = await window.NT_API.getTours();
      const near = tours.filter((t) => t.derivedState === 'near-threshold').slice(0, 3);
      if (!near.length) return;  // stays hidden
      section.hidden = false;
      grid.innerHTML = near.map(renderCard).join('');
    } catch (e) {
      console.error('home-near-threshold:', e);
    }
  }
  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }
  function renderCard(t) {
    const remaining = Math.max(0, (t.threshold || 0) - (t.interested || 0));
    return `
      <a href="tour-detail.html?id=${encodeURIComponent(t.slug)}" class="nt-tour-card nt-state--near-threshold">
        <div class="nt-tour-photo" style="background-image:url('${escapeHtml(t.hero || '')}')">
          <span class="nt-state-badge"><span class="nt-state-dot"></span>FALTAN ${remaining}</span>
        </div>
        <div class="nt-tour-body">
          <h3 class="nt-tour-title">${escapeHtml(t.title)}</h3>
          <div class="nt-tour-loc">${escapeHtml(t.loc || '')}</div>
          <div class="nt-progress">
            <div class="nt-progress-bar"><div class="nt-progress-fill" style="width:${Math.min(100, Math.round((t.interested/t.threshold)*100))}%"></div></div>
            <div class="nt-progress-text"><span><strong>${t.interested}</strong>/${t.threshold} interesados</span><span class="nt-progress-accent">🔥</span></div>
          </div>
          <div class="nt-tour-foot"><strong class="nt-tour-price">${escapeHtml(t.price || '')}</strong><span class="nt-tour-cta">Sumarme →</span></div>
        </div>
      </a>
    `;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
  else main();
})();
```

- [ ] **Step 5: Load the script + API on `index.html`**

In `index.html` script tags at the bottom, add before `js/home.js`:

```html
<script src="js/config.js" defer></script>
<script src="js/tours-api.js" defer></script>
<script src="js/home-near-threshold.js" defer></script>
```

- [ ] **Step 6: Verify**

Mark a tour as near-threshold by hitting it with enough interest via curl (use Task 3's loop). Reload `index.html`. The new section should appear with the tour card; if no near-threshold tours, the section stays hidden.

- [ ] **Step 7: Commit**

```bash
git add index.html css/home.css js/home-near-threshold.js js/i18n.js
git commit -m "feat(site): 'tours que casi se lanzan' section on home"
```

---

### Task 13: Robots + sitemap + delete `js/tours-data.js`

**Files:**
- Modify: `robots.txt`
- Modify: `sitemap.xml`
- Delete: `js/tours-data.js`
- Modify: every HTML that referenced it (remove the script tag)

- [ ] **Step 1: Add `Disallow: /admin/` to `robots.txt`**

Edit `robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /design/

Sitemap: https://nancy-tours-cr.vercel.app/sitemap.xml
```

- [ ] **Step 2: Update `sitemap.xml`** — remove the static `/tour-detail?id=…` URLs since slugs may change. Keep only the four main pages.

Replace the entire content with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://nancy-tours-cr.vercel.app/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://nancy-tours-cr.vercel.app/tours</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://nancy-tours-cr.vercel.app/sobre-nancy</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://nancy-tours-cr.vercel.app/contacto</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>
```

A future task can add a dynamic sitemap that includes current tour slugs by hitting `?action=tours` at build time; out of scope for v1.

- [ ] **Step 3: Delete `js/tours-data.js`**

```bash
git rm js/tours-data.js
```

- [ ] **Step 4: Remove `<script src="js/tours-data.js">` from any HTML that still references it**

```bash
grep -l 'tours-data.js' *.html
for f in $(grep -l 'tours-data.js' *.html); do
  /usr/bin/sed -i '' '/tours-data\.js/d' "$f"
done
grep -l 'tours-data.js' *.html || echo '✓ no references left'
```

- [ ] **Step 5: Verify everything still loads**

Open all 5 pages locally. Use Chrome DevTools console — should be zero errors related to `TOURS` or `tours-data.js`.

- [ ] **Step 6: Commit**

```bash
git add robots.txt sitemap.xml *.html
git commit -m "chore: remove tours-data.js (Sheet is canonical) + admin in robots"
```

---

## 🛑 Checkpoint 2 — Phase 2 review

- [ ] Visit `tours.html` on local server. The 13 tours render from the API. State filter chips work. No console errors.
- [ ] Visit `tour-detail.html?id=chirripo`. Booking card shows the right state badge, progress bar, CTA. Click *Me interesa* → modal opens, validation works, submission appends to the Sheet.
- [ ] Visit `index.html`. If any tour is near-threshold, the "Tours que casi se lanzan" section appears.
- [ ] `js/tours-data.js` is deleted. `grep -r 'tours-data' .` returns nothing.
- [ ] Deploy to Vercel and confirm `tours.html` on https://nancy-tours-cr.vercel.app/tours loads. Run a single curl-driven `interest` POST to confirm CORS is OK with the production origin.

Fix any failures before Phase 3.

---

## Phase 3 — Admin console

**Phase goal:** Nancy can log in at `/admin`, see her dashboard, create/edit/delete tours, drag-drop hero photos, change state, and review/contact leads. All from a polished UI; she never touches the Sheet.

---

### Task 14: `admin/` skeleton + router + auth bootstrap

**Files:**
- Create: `admin/index.html`
- Create: `admin/css/admin.css`
- Create: `admin/js/admin.js`
- Create: `admin/js/api.js`
- Modify: `vercel.json` (cache headers for `/admin/*`)

- [ ] **Step 1: Create `admin/index.html`**

```html
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<title>Admin · Nancy Tours</title>
<link rel="icon" type="image/png" href="/img/logo-nancy-mark-transparent.png" />

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@10..48,400..800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

<link rel="stylesheet" href="/css/tokens.css?v=5" />
<link rel="stylesheet" href="css/admin.css?v=1" />
</head>
<body class="adm-body">
  <main id="adm-app" aria-live="polite"><p class="adm-loading">Cargando…</p></main>
  <script src="/js/config.js" defer></script>
  <script src="js/api.js" defer></script>
  <script src="js/views/login.js" defer></script>
  <script src="js/views/dashboard.js" defer></script>
  <script src="js/views/tour-editor.js" defer></script>
  <script src="js/views/leads.js" defer></script>
  <script src="js/views/settings.js" defer></script>
  <script src="js/admin.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Create `admin/css/admin.css` (initial skeleton)**

```css
:root {
  --adm-bg: #f6f1e3;
  --adm-paper: #fff;
  --adm-ink: #1a160e;
  --adm-muted: #6b6256;
  --adm-accent: #b5532e;
  --adm-good: #16a34a;
  --adm-warn: #c99a3f;
  --adm-bad: #b5532e;
  --adm-shadow: 0 12px 32px -16px rgba(0,0,0,0.18);
}
* { box-sizing: border-box; }
.adm-body {
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--adm-bg);
  color: var(--adm-ink);
  min-height: 100vh;
}
.adm-loading { text-align: center; padding: 96px; color: var(--adm-muted); font-style: italic; }
button { cursor: pointer; font-family: inherit; }
.adm-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 4px;
  font-weight: 700;
  border: 1px solid transparent;
  text-decoration: none;
  font-size: 14px;
  background: var(--adm-accent);
  color: #fff;
}
.adm-btn--ghost { background: transparent; color: var(--adm-ink); border-color: var(--adm-ink); }
.adm-btn--danger { background: var(--adm-bad); }
.adm-btn:disabled { opacity: 0.5; cursor: not-allowed; }
```

- [ ] **Step 3: Create `admin/js/api.js`**

```javascript
// Admin API wrapper. Holds auth token in localStorage.
(function () {
  'use strict';
  const URL = window.NT_CONFIG.apiUrl;
  const TOKEN_KEY = 'nt-admin-token';
  const EXP_KEY = 'nt-admin-expires';

  function getToken() {
    const t = localStorage.getItem(TOKEN_KEY);
    const e = Number(localStorage.getItem(EXP_KEY) || 0);
    if (!t || !e || e < Date.now()) return null;
    return t;
  }

  function setToken(token, expiresAt) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXP_KEY, String(expiresAt));
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXP_KEY);
  }

  async function post(action, payload = {}) {
    const body = JSON.stringify({ action, ...payload, token: getToken() });
    const res = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body });
    const data = await res.json();
    if (data.error === 'unauthorized') { clearToken(); throw new Error('unauthorized'); }
    if (data.error) throw new Error(data.error);
    return data;
  }

  async function getPublic(qs) {
    const res = await fetch(`${URL}?${qs}&_=${Date.now()}`);
    if (!res.ok) throw new Error(`${qs} ${res.status}`);
    return res.json();
  }

  async function getAuth(qs) {
    const res = await fetch(`${URL}?${qs}&token=${encodeURIComponent(getToken() || '')}&_=${Date.now()}`);
    if (!res.ok) throw new Error(`${qs} ${res.status}`);
    const data = await res.json();
    if (data.error === 'unauthorized') { clearToken(); throw new Error('unauthorized'); }
    if (data.error) throw new Error(data.error);
    return data;
  }

  window.ADM_API = {
    getToken, clearToken,
    async login(password) {
      const data = await post('login', { password });
      setToken(data.token, data.expiresAt);
      return data;
    },
    listTours: () => getPublic('action=tours'),
    getTour: (slug) => getPublic(`action=tour&slug=${encodeURIComponent(slug)}`),
    createTour: (fields) => post('createTour', fields),
    updateTour: (slug, fields) => post('updateTour', { slug, ...fields }),
    deleteTour: (slug) => post('deleteTour', { slug }),
    setState: (slug, state, dateOverride) => post('setState', { slug, state, dateOverride }),
    listLeads: (slug) => getAuth(`action=leads&slug=${encodeURIComponent(slug)}`),
    markContacted: (leadId, value) => post('markContacted', { leadId, value }),
    uploadImage: (base64, filename) => post('uploadImage', { base64, filename }),
    updateConfig: (key, value) => post('updateConfig', { key, value }),
  };
})();
```

- [ ] **Step 4: Create `admin/js/admin.js` (router + bootstrap)**

```javascript
// App bootstrap. Hash router: #login | #dashboard | #tours/new | #tours/<slug>/edit | #tours/<slug>/leads | #settings
(function () {
  'use strict';

  const VIEWS = {};
  window.ADM_REGISTER_VIEW = (name, render) => { VIEWS[name] = render; };

  async function route() {
    const app = document.getElementById('adm-app');
    if (!window.ADM_API.getToken() && location.hash !== '#login') {
      location.hash = '#login';
      return;
    }
    const hash = location.hash || '#dashboard';
    const m = hash.match(/^#([^/]+)(?:\/(.+))?$/);
    const view = m ? m[1] : 'dashboard';
    const param = m ? m[2] : '';
    const renderer = VIEWS[view];
    if (!renderer) {
      app.innerHTML = `<p class="adm-loading">Vista no encontrada: ${view}. <a href="#dashboard">Volver →</a></p>`;
      return;
    }
    try {
      app.setAttribute('aria-busy', 'true');
      await renderer(app, param);
      app.setAttribute('aria-busy', 'false');
    } catch (e) {
      console.error(e);
      if (e.message === 'unauthorized') {
        location.hash = '#login';
      } else {
        app.innerHTML = `<p class="adm-loading">Error: ${e.message}. <a href="#dashboard">Reintentar →</a></p>`;
      }
    }
  }

  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', route);
})();
```

- [ ] **Step 5: Stubs for all views (will be filled in next tasks)**

Create `admin/js/views/login.js`:

```javascript
ADM_REGISTER_VIEW('login', async (app) => { app.innerHTML = '<p class="adm-loading">[login coming in Task 15]</p>'; });
```

`admin/js/views/dashboard.js`:

```javascript
ADM_REGISTER_VIEW('dashboard', async (app) => { app.innerHTML = '<p class="adm-loading">[dashboard coming in Task 16]</p>'; });
```

`admin/js/views/tour-editor.js`:

```javascript
ADM_REGISTER_VIEW('tours', async (app, param) => { app.innerHTML = `<p class="adm-loading">[tour editor coming in Task 17–18] · param: ${param}</p>`; });
```

`admin/js/views/leads.js`:

```javascript
ADM_REGISTER_VIEW('leads', async (app, param) => { app.innerHTML = `<p class="adm-loading">[leads coming in Task 19] · param: ${param}</p>`; });
```

`admin/js/views/settings.js`:

```javascript
ADM_REGISTER_VIEW('settings', async (app) => { app.innerHTML = '<p class="adm-loading">[settings coming in Task 20]</p>'; });
```

- [ ] **Step 6: Add admin cache headers to `vercel.json`**

In the existing `headers` array, add:

```json
{
  "source": "/admin/(.*)",
  "headers": [
    { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" },
    { "key": "X-Robots-Tag", "value": "noindex, nofollow" }
  ]
}
```

- [ ] **Step 7: Verify locally**

Open `http://127.0.0.1:8765/admin/`. Expected:
- Page loads with title "Admin · Nancy Tours".
- Hash automatically becomes `#login`. Login stub shows.
- Manually navigate to `#dashboard` → redirects back to `#login` because no token.

- [ ] **Step 8: Commit**

```bash
git add admin/ vercel.json
git commit -m "feat(admin): scaffold admin app shell + router + API client"
```

---

### Task 15: Login view

**Files:**
- Modify: `admin/js/views/login.js`
- Modify: `admin/css/admin.css`

- [ ] **Step 1: Implement the login view**

Replace `admin/js/views/login.js`:

```javascript
ADM_REGISTER_VIEW('login', async (app) => {
  app.innerHTML = `
    <div class="adm-login">
      <div class="adm-login-card">
        <h1>Nancy Tours · Admin</h1>
        <p class="adm-muted">Entrá con tu password.</p>
        <form id="adm-login-form" novalidate>
          <input id="adm-pw" name="password" type="password" autocomplete="current-password" placeholder="Password" />
          <button type="submit" class="adm-btn">Entrar →</button>
          <p id="adm-login-err" class="adm-login-err" hidden></p>
        </form>
      </div>
    </div>
  `;
  const form = document.getElementById('adm-login-form');
  const pw = document.getElementById('adm-pw');
  const err = document.getElementById('adm-login-err');
  pw.focus();
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.hidden = true;
    const password = pw.value;
    if (!password) { err.textContent = 'Escribí el password.'; err.hidden = false; return; }
    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Entrando…';
    try {
      await window.ADM_API.login(password);
      location.hash = '#dashboard';
    } catch (e2) {
      err.textContent = 'Password incorrecto.';
      err.hidden = false;
      pw.value = '';
      pw.focus();
      const card = document.querySelector('.adm-login-card');
      card.classList.add('adm-shake');
      setTimeout(() => card.classList.remove('adm-shake'), 400);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Entrar →';
    }
  });
});
```

- [ ] **Step 2: Add login styles to `admin/css/admin.css`**

Append:

```css
.adm-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.adm-login-card {
  background: var(--adm-paper);
  padding: 40px 32px;
  border-radius: 6px;
  box-shadow: var(--adm-shadow);
  max-width: 360px;
  width: 100%;
}
.adm-login-card h1 {
  font-family: 'Bricolage Grotesque', sans-serif;
  margin: 0 0 8px;
  font-size: 24px;
}
.adm-muted { color: var(--adm-muted); margin: 0 0 24px; font-size: 14px; }
.adm-login-card input {
  width: 100%;
  padding: 12px 14px;
  font-size: 16px;
  border: 1px solid rgba(31,58,43,0.2);
  border-radius: 4px;
  margin-bottom: 12px;
  font-family: inherit;
}
.adm-login-card input:focus { outline: 3px solid var(--adm-accent); outline-offset: 2px; }
.adm-login-card button { width: 100%; justify-content: center; }
.adm-login-err { color: var(--adm-bad); font-size: 13px; margin: 12px 0 0; font-weight: 600; }

@keyframes adm-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
.adm-shake { animation: adm-shake .35s ease-in-out; }
```

- [ ] **Step 3: Verify**

Open `http://127.0.0.1:8765/admin/`. Type the wrong password → shake animation, error message. Type the right password → redirects to `#dashboard` (which shows its placeholder for now).

Refresh the page after logging in → goes straight to `#dashboard` (token persisted).

- [ ] **Step 4: Commit**

```bash
git add admin/css/admin.css admin/js/views/login.js
git commit -m "feat(admin): login view with shake-on-error"
```

---

### Task 16: Dashboard view

**Files:**
- Modify: `admin/js/views/dashboard.js`
- Modify: `admin/css/admin.css`

- [ ] **Step 1: Implement the dashboard**

Replace `admin/js/views/dashboard.js`:

```javascript
ADM_REGISTER_VIEW('dashboard', async (app) => {
  app.innerHTML = `<p class="adm-loading">Cargando tus tours…</p>`;
  const tours = await window.ADM_API.listTours();
  const today = new Date();
  today.setHours(0,0,0,0);

  const totalActive = tours.length;
  const totalNear = tours.filter((t) => t.derivedState === 'near-threshold').length;
  const totalInterested = tours.reduce((s, t) => s + (t.interested || 0), 0);

  app.innerHTML = `
    <header class="adm-header">
      <div>
        <h1>Hola Nancy 👋</h1>
        <p class="adm-muted">${tours.length} tours activos · ${totalInterested} personas interesadas hoy</p>
      </div>
      <div class="adm-header-actions">
        <a href="#settings" class="adm-btn adm-btn--ghost">⚙ Ajustes</a>
        <a href="#tours/new" class="adm-btn">+ Nuevo tour</a>
      </div>
    </header>
    <section class="adm-stats">
      <div class="adm-stat"><div class="adm-stat-num">${totalActive}</div><div class="adm-stat-label">Tours activos</div></div>
      <div class="adm-stat"><div class="adm-stat-num">${totalNear}</div><div class="adm-stat-label">🟠 Listos para confirmar</div></div>
      <div class="adm-stat"><div class="adm-stat-num">${totalInterested}</div><div class="adm-stat-label">Personas interesadas</div></div>
    </section>
    <section class="adm-tour-grid">
      ${tours.map(renderTourCard).join('')}
    </section>
  `;
});

function renderTourCard(t) {
  const state = t.derivedState || t.state || 'searching';
  const ready = state === 'near-threshold';
  return `
    <article class="adm-card adm-state--${state}">
      <a href="#tours/${encodeURIComponent(t.slug)}/edit" class="adm-card-link">
        <div class="adm-card-photo" style="background-image:url('${(t.hero||'').replace(/'/g,"\\'")}')">
          <span class="adm-state-pill">${stateLabel(state)}</span>
          ${ready ? '<span class="adm-card-ready">⚡ LISTO PARA CONFIRMAR</span>' : ''}
        </div>
        <div class="adm-card-body">
          <h3>${escapeHtml(t.title)}</h3>
          <div class="adm-card-meta">${escapeHtml(t.tentativeDate || '—')}</div>
          <div class="adm-progress">
            <div class="adm-progress-bar"><div style="width:${pct(t)}%"></div></div>
            <div class="adm-progress-text">${t.interested || 0} de ${t.threshold || '?'} interesados</div>
          </div>
        </div>
      </a>
      <a href="#tours/${encodeURIComponent(t.slug)}/leads" class="adm-card-leads">👥 ${t.interested || 0} interesados →</a>
    </article>
  `;
}
function stateLabel(s) { return ({searching:'🟡 Buscando','near-threshold':'🟠 Casi confirmado',confirmed:'🟢 Confirmado',postponed:'🔴 Pospuesto',completed:'⚪ Completado'})[s] || s; }
function pct(t) { if (t.derivedState === 'confirmed') return 100; return Math.min(100, Math.round(((t.interested||0)/(t.threshold||1))*100)); }
function escapeHtml(s) { return String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
```

- [ ] **Step 2: Add dashboard styles to `admin/css/admin.css`**

Append:

```css
.adm-header { display: flex; justify-content: space-between; align-items: flex-end; padding: 32px 40px; gap: 16px; flex-wrap: wrap; }
.adm-header h1 { font-family: 'Bricolage Grotesque', sans-serif; font-size: 32px; margin: 0; }
.adm-header-actions { display: flex; gap: 10px; }
.adm-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; padding: 0 40px 32px; }
.adm-stat { background: var(--adm-paper); padding: 24px; border-radius: 6px; box-shadow: var(--adm-shadow); }
.adm-stat-num { font-family: 'Bricolage Grotesque', sans-serif; font-size: 42px; font-weight: 800; line-height: 1; }
.adm-stat-label { color: var(--adm-muted); font-size: 14px; margin-top: 6px; }

.adm-tour-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; padding: 0 40px 64px; }
.adm-card { background: var(--adm-paper); border-radius: 6px; overflow: hidden; box-shadow: var(--adm-shadow); transition: transform .15s; }
.adm-card:hover { transform: translateY(-2px); }
.adm-card-link { display: block; text-decoration: none; color: inherit; }
.adm-card-photo { height: 160px; background-size: cover; background-position: center; position: relative; background-color: #eee; }
.adm-state-pill { position: absolute; top: 12px; left: 12px; padding: 4px 10px; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; background: rgba(13,13,10,0.85); color: #fff; border-radius: 999px; backdrop-filter: blur(4px); }
.adm-card-ready { position: absolute; top: 12px; right: 12px; padding: 4px 8px; font-size: 10px; font-weight: 800; background: var(--adm-warn); color: #fff; border-radius: 4px; letter-spacing: 0.1em; }
.adm-card-body { padding: 18px; }
.adm-card-body h3 { font-family: 'Bricolage Grotesque', sans-serif; margin: 0 0 4px; font-size: 18px; }
.adm-card-meta { color: var(--adm-muted); font-size: 13px; margin-bottom: 12px; }
.adm-progress-bar { height: 5px; background: rgba(31,58,43,0.1); border-radius: 99px; overflow: hidden; }
.adm-progress-bar > div { height: 100%; background: var(--adm-warn); transition: width .6s; }
.adm-state--confirmed .adm-progress-bar > div { background: var(--adm-good); }
.adm-progress-text { font-size: 12px; color: var(--adm-muted); margin-top: 6px; }
.adm-card-leads { display: block; padding: 12px 18px; text-decoration: none; font-size: 13px; color: var(--adm-accent); border-top: 1px solid rgba(31,58,43,0.08); font-weight: 600; }
.adm-card-leads:hover { background: rgba(181,83,46,0.05); }
```

- [ ] **Step 3: Verify**

Log in. Dashboard now shows: header with stats, then a grid of all 13 tours fetched from the Sheet, each with its current state and progress. Click any card → goes to `#tours/<slug>/edit` (which shows the Task-17 stub for now).

- [ ] **Step 4: Commit**

```bash
git add admin/js/views/dashboard.js admin/css/admin.css
git commit -m "feat(admin): dashboard view with stats + tour cards"
```

---

### Task 17: Tour editor — identity + operation + descriptions

**Files:**
- Modify: `admin/js/views/tour-editor.js`
- Modify: `admin/css/admin.css`

- [ ] **Step 1: Implement the editor (identity + operation + descriptions sections only — others in Task 18)**

Replace `admin/js/views/tour-editor.js`:

```javascript
ADM_REGISTER_VIEW('tours', async (app, param) => {
  // param can be: 'new' OR '<slug>/edit' OR '<slug>/leads'
  if (!param) { location.hash = '#dashboard'; return; }

  // /leads is handled by the leads view via a hash like #tours/slug/leads — re-route:
  if (param.endsWith('/leads')) {
    const slug = param.replace(/\/leads$/, '');
    location.hash = `#leads/${slug}`;
    return;
  }

  const isNew = param === 'new';
  const slug = isNew ? null : param.replace(/\/edit$/, '');
  app.innerHTML = `<p class="adm-loading">${isNew ? 'Nuevo tour…' : 'Cargando tour…'}</p>`;

  const tour = isNew ? blankTour() : await window.ADM_API.getTour(slug);
  app.innerHTML = renderEditor(tour, isNew);
  wireEditor(tour, isNew);
});

function blankTour() {
  return {
    slug: '', title: '', tag: '', loc: '', elev: '', hero: '',
    state: 'searching', threshold: 6, maxCapacity: 12,
    duration: '', diff: '', minAge: '', price: '',
    tentativeDate: '', confirmedDate: '',
    lead: '', blurb: '',
    itinerary: [], incl: [], excl: [], bring: [], faq: [], related: [],
  };
}

function renderEditor(t, isNew) {
  return `
    <div class="adm-editor">
      <header class="adm-editor-head">
        <a href="#dashboard" class="adm-back">← Tours</a>
        <h1>${isNew ? 'Nuevo tour' : `Editando: ${escapeHtml(t.title)}`}</h1>
        <div class="adm-editor-actions">
          ${!isNew ? `<button type="button" class="adm-btn adm-btn--danger" data-act="delete">Eliminar</button>` : ''}
          <button type="button" class="adm-btn" data-act="save">Guardar</button>
        </div>
      </header>

      <details open class="adm-section">
        <summary><h2>Identidad</h2></summary>
        <div class="adm-grid-2">
          <div class="adm-field"><label>Título</label><input data-f="title" value="${escapeHtml(t.title)}" placeholder="Cerro Chirripó" /></div>
          <div class="adm-field"><label>Etiqueta</label><input data-f="tag" value="${escapeHtml(t.tag)}" placeholder="AVENTURA · 3 DÍAS" /></div>
          <div class="adm-field"><label>Ubicación</label><input data-f="loc" value="${escapeHtml(t.loc)}" placeholder="Pérez Zeledón · 3.820 m" /></div>
          <div class="adm-field"><label>Elevación / referencia</label><input data-f="elev" value="${escapeHtml(t.elev)}" placeholder="3.820 m" /></div>
        </div>
        <div class="adm-field">
          <label>Foto principal</label>
          <div class="adm-photo-drop" data-act="dropzone">
            <img data-f="heroPreview" src="${escapeHtml(t.hero)}" alt="" ${t.hero ? '' : 'hidden'} />
            <p>Arrastrá una imagen o clic para elegir.</p>
            <input type="file" accept="image/*" data-f="heroFile" hidden />
          </div>
          <input type="hidden" data-f="hero" value="${escapeHtml(t.hero)}" />
        </div>
      </details>

      <details class="adm-section">
        <summary><h2>Operación</h2></summary>
        <div class="adm-grid-2">
          <div class="adm-field"><label>Cupo mínimo (threshold)</label><input data-f="threshold" type="number" value="${t.threshold || 6}" min="1" /></div>
          <div class="adm-field"><label>Cupo máximo</label><input data-f="maxCapacity" type="number" value="${t.maxCapacity || 12}" min="1" /></div>
          <div class="adm-field"><label>Precio</label><input data-f="price" value="${escapeHtml(t.price)}" placeholder="$340" /></div>
          <div class="adm-field"><label>Fecha tentativa</label><input data-f="tentativeDate" value="${escapeHtml(t.tentativeDate)}" placeholder="13–15 jun · vie a dom" /></div>
        </div>
        <div class="adm-state-controls">
          <div class="adm-field"><label>Estado actual</label><div class="adm-state-current">${stateLabel(t.state)}</div></div>
          <div class="adm-state-btns">
            ${t.state !== 'confirmed' ? '<button type="button" class="adm-btn" data-act="confirm">✓ Confirmar tour</button>' : ''}
            ${t.state !== 'postponed' ? '<button type="button" class="adm-btn adm-btn--ghost" data-act="postpone">Posponer</button>' : ''}
            ${t.state !== 'completed' ? '<button type="button" class="adm-btn adm-btn--ghost" data-act="complete">Marcar completado</button>' : ''}
            ${t.state !== 'searching' ? '<button type="button" class="adm-btn adm-btn--ghost" data-act="reopen">Reabrir como buscando</button>' : ''}
          </div>
        </div>
      </details>

      <details class="adm-section">
        <summary><h2>Descripción</h2></summary>
        <div class="adm-field"><label>Lead (1 frase corta)</label><textarea data-f="lead" rows="2" placeholder="El techo de Costa Rica…">${escapeHtml(t.lead)}</textarea></div>
        <div class="adm-field"><label>Blurb (descripción larga)</label><textarea data-f="blurb" rows="6">${escapeHtml(t.blurb)}</textarea></div>
      </details>

      <details class="adm-section">
        <summary><h2>Detalles</h2></summary>
        <div class="adm-grid-2">
          <div class="adm-field"><label>Duración</label><input data-f="duration" value="${escapeHtml(t.duration)}" placeholder="3 días · 2 noches" /></div>
          <div class="adm-field"><label>Nivel</label><input data-f="diff" value="${escapeHtml(t.diff)}" placeholder="Alta" /></div>
          <div class="adm-field"><label>Edad mínima</label><input data-f="minAge" value="${escapeHtml(t.minAge)}" placeholder="14 años" /></div>
        </div>
      </details>

      <div id="adm-editor-listsmount"></div>
    </div>
  `;
}

function wireEditor(tour, isNew) {
  const root = document.querySelector('.adm-editor');
  if (!root) return;

  // Mount the list editors (itinerary, incl, excl, bring, faq, related) — implemented in Task 18
  if (window.ADM_LISTS_MOUNT) window.ADM_LISTS_MOUNT(document.getElementById('adm-editor-listsmount'), tour);

  // Photo upload
  const dz = root.querySelector('[data-act="dropzone"]');
  const file = root.querySelector('[data-f="heroFile"]');
  const heroHidden = root.querySelector('[data-f="hero"]');
  const preview = root.querySelector('[data-f="heroPreview"]');
  if (dz && file) {
    dz.addEventListener('click', () => file.click());
    dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('is-drop'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('is-drop'));
    dz.addEventListener('drop', (e) => { e.preventDefault(); dz.classList.remove('is-drop'); if (e.dataTransfer.files[0]) uploadFile(e.dataTransfer.files[0]); });
    file.addEventListener('change', () => { if (file.files[0]) uploadFile(file.files[0]); });
  }
  async function uploadFile(f) {
    const overlay = document.createElement('div'); overlay.className = 'adm-upload-overlay'; overlay.textContent = 'Subiendo foto…'; root.appendChild(overlay);
    try {
      const b64 = await fileToBase64(f);
      const res = await window.ADM_API.uploadImage(b64, f.name);
      heroHidden.value = res.url;
      preview.src = res.url; preview.hidden = false;
    } catch (e) { alert('No pude subir la foto: ' + e.message); }
    finally { overlay.remove(); }
  }

  // Save
  root.querySelector('[data-act="save"]').addEventListener('click', async (e) => {
    e.target.disabled = true; e.target.textContent = 'Guardando…';
    try {
      const fields = collect(root);
      if (window.ADM_LISTS_COLLECT) Object.assign(fields, window.ADM_LISTS_COLLECT());
      if (isNew) {
        const res = await window.ADM_API.createTour(fields);
        location.hash = `#tours/${encodeURIComponent(res.slug)}/edit`;
      } else {
        await window.ADM_API.updateTour(tour.slug, fields);
      }
      flash('Guardado ✓');
    } catch (err) { alert('No se pudo guardar: ' + err.message); }
    finally { e.target.disabled = false; e.target.textContent = 'Guardar'; }
  });

  // Delete
  const del = root.querySelector('[data-act="delete"]');
  if (del) del.addEventListener('click', async () => {
    if (!confirm(`¿Eliminar "${tour.title}"? Esto borra el tour y los interesados.`)) return;
    await window.ADM_API.deleteTour(tour.slug);
    location.hash = '#dashboard';
  });

  // State transitions
  root.querySelector('[data-act="confirm"]')?.addEventListener('click', async () => {
    const date = prompt('Fecha definitiva del tour:', tour.tentativeDate || '');
    if (date == null) return;
    await window.ADM_API.setState(tour.slug, 'confirmed', date);
    flash('Tour confirmado ✓'); reload();
  });
  root.querySelector('[data-act="postpone"]')?.addEventListener('click', async () => {
    const date = prompt('Nueva fecha tentativa:', tour.tentativeDate || '');
    if (date == null) return;
    await window.ADM_API.setState(tour.slug, 'postponed', date);
    flash('Tour pospuesto'); reload();
  });
  root.querySelector('[data-act="complete"]')?.addEventListener('click', async () => {
    if (!confirm('¿Marcar este tour como completado? Desaparecerá del catálogo público.')) return;
    await window.ADM_API.setState(tour.slug, 'completed');
    flash('Tour completado'); reload();
  });
  root.querySelector('[data-act="reopen"]')?.addEventListener('click', async () => {
    await window.ADM_API.setState(tour.slug, 'searching');
    flash('Tour reabierto'); reload();
  });

  function reload() { setTimeout(() => location.reload(), 600); }
}

function collect(root) {
  const out = {};
  root.querySelectorAll('[data-f]').forEach((el) => {
    if (el.type === 'file') return;
    if (el.tagName === 'INPUT' && el.type === 'number') out[el.dataset.f] = Number(el.value);
    else if ('value' in el) out[el.dataset.f] = el.value;
  });
  delete out.heroFile;
  delete out.heroPreview;
  return out;
}

function fileToBase64(f) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); });
}

function flash(msg) {
  const f = document.createElement('div'); f.className = 'adm-flash'; f.textContent = msg; document.body.appendChild(f);
  setTimeout(() => f.remove(), 1800);
}

function stateLabel(s) { return ({searching:'🟡 Buscando','near-threshold':'🟠 Casi confirmado',confirmed:'🟢 Confirmado',postponed:'🔴 Pospuesto',completed:'⚪ Completado'})[s] || s; }
function escapeHtml(s) { return String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
```

- [ ] **Step 2: Add editor styles to `admin/css/admin.css`**

```css
.adm-editor { padding: 24px 40px 64px; max-width: 980px; margin: 0 auto; }
.adm-editor-head { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
.adm-editor-head h1 { flex: 1; font-family: 'Bricolage Grotesque', sans-serif; font-size: 24px; margin: 0; }
.adm-editor-actions { display: flex; gap: 10px; }
.adm-back { color: var(--adm-muted); text-decoration: none; font-size: 14px; }
.adm-back:hover { color: var(--adm-ink); }

.adm-section { background: var(--adm-paper); border-radius: 6px; box-shadow: var(--adm-shadow); padding: 20px 24px; margin-bottom: 16px; }
.adm-section[open] summary { margin-bottom: 16px; }
.adm-section summary { list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; }
.adm-section summary::after { content: '⌃'; transform: rotate(180deg); transition: transform .2s; font-size: 18px; color: var(--adm-muted); }
.adm-section[open] summary::after { transform: rotate(0deg); }
.adm-section h2 { font-family: 'Bricolage Grotesque', sans-serif; font-size: 18px; margin: 0; }

.adm-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; }
.adm-field label { font-size: 11px; letter-spacing: 0.12em; font-weight: 700; color: var(--adm-muted); text-transform: uppercase; }
.adm-field input, .adm-field textarea, .adm-field select { padding: 10px 12px; font-size: 14px; border: 1px solid rgba(31,58,43,0.18); border-radius: 4px; font-family: inherit; background: #fff; }
.adm-field input:focus, .adm-field textarea:focus, .adm-field select:focus { outline: 3px solid var(--adm-accent); outline-offset: 1px; }
.adm-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
@media (max-width: 720px) { .adm-grid-2 { grid-template-columns: 1fr; } }

.adm-photo-drop { border: 2px dashed rgba(31,58,43,0.25); border-radius: 6px; padding: 24px; text-align: center; color: var(--adm-muted); cursor: pointer; }
.adm-photo-drop.is-drop { border-color: var(--adm-accent); background: rgba(181,83,46,0.05); }
.adm-photo-drop img { max-width: 100%; max-height: 200px; margin-bottom: 12px; border-radius: 4px; }
.adm-upload-overlay { position: fixed; inset: 0; background: rgba(13,13,10,0.6); color: #fff; display: flex; align-items: center; justify-content: center; z-index: 9000; }

.adm-state-controls { display: grid; grid-template-columns: 240px 1fr; gap: 24px; align-items: center; padding-top: 16px; border-top: 1px solid rgba(31,58,43,0.1); margin-top: 16px; }
.adm-state-current { font-family: 'Bricolage Grotesque', sans-serif; font-size: 18px; font-weight: 700; }
.adm-state-btns { display: flex; flex-wrap: wrap; gap: 8px; }
@media (max-width: 720px) { .adm-state-controls { grid-template-columns: 1fr; } }

.adm-flash { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: var(--adm-good); color: #fff; padding: 10px 18px; border-radius: 4px; font-weight: 700; box-shadow: var(--adm-shadow); z-index: 9000; }
```

- [ ] **Step 3: Verify**

In the admin, click any tour → editor opens with all 4 sections (Identity, Operación, Descripción, Detalles). Try changing the title, click "Guardar" → flash "Guardado ✓". Reload — change persisted. Drag a JPG onto the photo dropzone → it uploads to Cloudinary and the preview updates. Click "Confirmar tour" → prompt asks for definitive date → after save, the state badge on the dashboard updates. Click "Eliminar" → after confirm, the tour disappears.

- [ ] **Step 4: Commit**

```bash
git add admin/js/views/tour-editor.js admin/css/admin.css
git commit -m "feat(admin): tour editor — identity/operation/descriptions + photo upload + state transitions"
```

---

### Task 18: Tour editor — list editors (itinerary, incl/excl/bring, FAQ, related)

**Files:**
- Create: `admin/js/views/lists.js`
- Modify: `admin/index.html` (load it)
- Modify: `admin/css/admin.css`

- [ ] **Step 1: Create `admin/js/views/lists.js`**

```javascript
// Mounts dynamic list editors inside the tour editor. Exposes window.ADM_LISTS_MOUNT and ADM_LISTS_COLLECT.
(function () {
  'use strict';
  let state = { tour: null };

  function mount(rootEl, tour) {
    state.tour = JSON.parse(JSON.stringify(tour));
    rootEl.innerHTML = `
      <details open class="adm-section">
        <summary><h2>Itinerario</h2></summary>
        <div id="adm-iti"></div>
        <button type="button" class="adm-btn adm-btn--ghost" data-add-day>+ Agregar día</button>
      </details>
      <details class="adm-section">
        <summary><h2>Qué incluye</h2></summary>
        <div id="adm-incl"></div>
        <button type="button" class="adm-btn adm-btn--ghost" data-add-incl>+ Agregar ítem</button>
      </details>
      <details class="adm-section">
        <summary><h2>Qué no incluye</h2></summary>
        <div id="adm-excl"></div>
        <button type="button" class="adm-btn adm-btn--ghost" data-add-excl>+ Agregar ítem</button>
      </details>
      <details class="adm-section">
        <summary><h2>Qué llevar</h2></summary>
        <div id="adm-bring"></div>
        <button type="button" class="adm-btn adm-btn--ghost" data-add-bring>+ Agregar ítem</button>
      </details>
      <details class="adm-section">
        <summary><h2>Preguntas frecuentes</h2></summary>
        <div id="adm-faq"></div>
        <button type="button" class="adm-btn adm-btn--ghost" data-add-faq>+ Agregar pregunta</button>
      </details>
      <details class="adm-section">
        <summary><h2>Tours relacionados</h2></summary>
        <div class="adm-field"><label>Slugs separados por coma</label><input id="adm-related" value="${(state.tour.related || []).join(', ')}" placeholder="chirripo, bajos-toro" /></div>
      </details>
    `;
    renderItinerary();
    renderSimpleList('adm-incl', 'incl');
    renderSimpleList('adm-excl', 'excl');
    renderSimpleList('adm-bring', 'bring');
    renderFaq();

    rootEl.querySelector('[data-add-day]').addEventListener('click', () => { state.tour.itinerary.push({ d: 'NUEVO DÍA', items: [''] }); renderItinerary(); });
    rootEl.querySelector('[data-add-incl]').addEventListener('click', () => { state.tour.incl.push(''); renderSimpleList('adm-incl', 'incl'); });
    rootEl.querySelector('[data-add-excl]').addEventListener('click', () => { state.tour.excl.push(''); renderSimpleList('adm-excl', 'excl'); });
    rootEl.querySelector('[data-add-bring]').addEventListener('click', () => { state.tour.bring.push(''); renderSimpleList('adm-bring', 'bring'); });
    rootEl.querySelector('[data-add-faq]').addEventListener('click', () => { state.tour.faq.push(['', '']); renderFaq(); });
  }

  function renderItinerary() {
    const el = document.getElementById('adm-iti');
    el.innerHTML = (state.tour.itinerary || []).map((d, i) => `
      <div class="adm-list-row">
        <div class="adm-field"><label>Etiqueta del día</label><input data-iti-d="${i}" value="${esc(d.d)}" /></div>
        <div class="adm-field"><label>Pasos (uno por línea)</label><textarea data-iti-items="${i}" rows="${Math.max(3, (d.items||[]).length)}">${(d.items||[]).map(esc).join('\n')}</textarea></div>
        <button type="button" class="adm-btn adm-btn--ghost adm-row-del" data-iti-del="${i}">Eliminar día</button>
      </div>
    `).join('');
    el.querySelectorAll('[data-iti-d]').forEach((inp) => inp.addEventListener('input', (e) => { state.tour.itinerary[Number(e.target.dataset.itiD)].d = e.target.value; }));
    el.querySelectorAll('[data-iti-items]').forEach((ta) => ta.addEventListener('input', (e) => { state.tour.itinerary[Number(e.target.dataset.itiItems)].items = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean); }));
    el.querySelectorAll('[data-iti-del]').forEach((b) => b.addEventListener('click', (e) => { state.tour.itinerary.splice(Number(e.target.dataset.itiDel), 1); renderItinerary(); }));
  }

  function renderSimpleList(elId, field) {
    const el = document.getElementById(elId);
    el.innerHTML = (state.tour[field] || []).map((v, i) => `
      <div class="adm-list-row adm-list-row--inline">
        <input data-l="${field}" data-i="${i}" value="${esc(v)}" />
        <button type="button" class="adm-btn adm-btn--ghost adm-row-del" data-l-del="${field}|${i}">×</button>
      </div>
    `).join('');
    el.querySelectorAll('input[data-l]').forEach((inp) => inp.addEventListener('input', (e) => { state.tour[e.target.dataset.l][Number(e.target.dataset.i)] = e.target.value; }));
    el.querySelectorAll('[data-l-del]').forEach((b) => b.addEventListener('click', (e) => { const [f, i] = e.target.dataset.lDel.split('|'); state.tour[f].splice(Number(i), 1); renderSimpleList(elId, f); }));
  }

  function renderFaq() {
    const el = document.getElementById('adm-faq');
    el.innerHTML = (state.tour.faq || []).map(([q, a], i) => `
      <div class="adm-list-row">
        <div class="adm-field"><label>Pregunta</label><input data-faq-q="${i}" value="${esc(q)}" /></div>
        <div class="adm-field"><label>Respuesta</label><textarea data-faq-a="${i}" rows="3">${esc(a)}</textarea></div>
        <button type="button" class="adm-btn adm-btn--ghost adm-row-del" data-faq-del="${i}">Eliminar</button>
      </div>
    `).join('');
    el.querySelectorAll('[data-faq-q]').forEach((inp) => inp.addEventListener('input', (e) => { state.tour.faq[Number(e.target.dataset.faqQ)][0] = e.target.value; }));
    el.querySelectorAll('[data-faq-a]').forEach((ta) => ta.addEventListener('input', (e) => { state.tour.faq[Number(e.target.dataset.faqA)][1] = e.target.value; }));
    el.querySelectorAll('[data-faq-del]').forEach((b) => b.addEventListener('click', (e) => { state.tour.faq.splice(Number(e.target.dataset.faqDel), 1); renderFaq(); }));
  }

  function collect() {
    return {
      itinerary: state.tour.itinerary || [],
      incl: state.tour.incl || [],
      excl: state.tour.excl || [],
      bring: state.tour.bring || [],
      faq: state.tour.faq || [],
      related: (document.getElementById('adm-related')?.value || '').split(',').map((s) => s.trim()).filter(Boolean),
    };
  }

  function esc(s) { return String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

  window.ADM_LISTS_MOUNT = mount;
  window.ADM_LISTS_COLLECT = collect;
})();
```

- [ ] **Step 2: Load it in `admin/index.html`**

Add before `tour-editor.js`:

```html
<script src="js/views/lists.js" defer></script>
```

- [ ] **Step 3: Add list styles to `admin/css/admin.css`**

```css
.adm-list-row { background: rgba(31,58,43,0.04); border-radius: 4px; padding: 14px; margin-bottom: 10px; position: relative; }
.adm-list-row--inline { display: flex; gap: 8px; align-items: center; padding: 6px 10px; }
.adm-list-row--inline input { flex: 1; padding: 8px 10px; font-size: 14px; border: 1px solid rgba(31,58,43,0.18); border-radius: 4px; }
.adm-row-del { font-size: 12px; padding: 4px 10px; }
```

- [ ] **Step 4: Verify**

In the editor, expand "Itinerario" → "+ Agregar día" → fill day label + steps. "+ Agregar ítem" in incl/excl/bring. "+ Agregar pregunta" in FAQ. Save. Reload — everything persists. Check the Sheet `tours_status` row for that slug — the `itinerary`, `incl`, `excl`, `bring`, `faq`, `related` columns should now contain JSON arrays.

Visit the public tour-detail page — the itinerary and lists render exactly as edited.

- [ ] **Step 5: Commit**

```bash
git add admin/js/views/lists.js admin/index.html admin/css/admin.css
git commit -m "feat(admin): dynamic list editors for itinerary, incl/excl/bring, FAQ, related"
```

---

### Task 19: Leads view (slide-in panel)

**Files:**
- Modify: `admin/js/views/leads.js`
- Modify: `admin/css/admin.css`

- [ ] **Step 1: Implement leads**

Replace `admin/js/views/leads.js`:

```javascript
ADM_REGISTER_VIEW('leads', async (app, param) => {
  if (!param) { location.hash = '#dashboard'; return; }
  const slug = param;
  app.innerHTML = `<p class="adm-loading">Cargando interesados…</p>`;
  const [tour, leads] = await Promise.all([
    window.ADM_API.getTour(slug),
    window.ADM_API.listLeads(slug),
  ]);
  leads.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  app.innerHTML = `
    <div class="adm-leads">
      <header class="adm-editor-head">
        <a href="#tours/${encodeURIComponent(slug)}/edit" class="adm-back">← Editar tour</a>
        <h1>${leads.reduce((s, l) => s + Number(l.numPeople||1), 0)} personas interesadas en ${escapeHtml(tour.title)}</h1>
        <button type="button" class="adm-btn adm-btn--ghost" data-act="copy">Copiar todos los WhatsApp</button>
      </header>
      <table class="adm-leads-table">
        <thead><tr>
          <th>Fecha</th><th>Nombre</th><th>WhatsApp</th><th>Personas</th><th>¿Ya hablé?</th><th>Notas</th>
        </tr></thead>
        <tbody>
          ${leads.map((l) => `
            <tr>
              <td>${new Date(l.timestamp).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}</td>
              <td>${escapeHtml(l.name)}</td>
              <td><a href="https://wa.me/506${(l.whatsapp||'').replace(/\D/g,'').slice(-8)}?text=${encodeURIComponent(waMessage(tour, l))}" target="_blank" rel="noopener">${escapeHtml(l.whatsapp)}</a></td>
              <td>${l.numPeople}</td>
              <td><input type="checkbox" data-lead-id="${l.id}" ${l.contacted ? 'checked' : ''} /></td>
              <td>${escapeHtml(l.notes || '')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  app.querySelectorAll('input[type="checkbox"][data-lead-id]').forEach((cb) => {
    cb.addEventListener('change', async (e) => {
      const id = e.target.dataset.leadId;
      try { await window.ADM_API.markContacted(id, e.target.checked); flash(e.target.checked ? 'Marcado como contactado' : 'Desmarcado'); }
      catch (err) { alert('No pude marcar: ' + err.message); e.target.checked = !e.target.checked; }
    });
  });

  app.querySelector('[data-act="copy"]').addEventListener('click', () => {
    const list = leads.map((l) => `${l.name}: +506 ${l.whatsapp}`).join('\n');
    navigator.clipboard.writeText(list).then(() => flash('WhatsApp copiados ✓'));
  });
});

function waMessage(tour, lead) {
  if (tour.derivedState === 'confirmed') {
    return `Hola ${lead.name}, soy Nancy. El tour de ${tour.title} ya está confirmado para el ${tour.confirmedDate || tour.tentativeDate}. ¿Confirmás tu cupo?`;
  }
  return `Hola ${lead.name}, soy Nancy. Te escribo por tu interés en el tour de ${tour.title}.`;
}
function flash(msg) { const f = document.createElement('div'); f.className = 'adm-flash'; f.textContent = msg; document.body.appendChild(f); setTimeout(() => f.remove(), 1800); }
function escapeHtml(s) { return String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
```

- [ ] **Step 2: Add leads styles**

```css
.adm-leads { padding: 24px 40px 64px; max-width: 1200px; margin: 0 auto; }
.adm-leads-table { width: 100%; border-collapse: collapse; background: var(--adm-paper); box-shadow: var(--adm-shadow); border-radius: 6px; overflow: hidden; }
.adm-leads-table th, .adm-leads-table td { padding: 12px 16px; text-align: left; font-size: 14px; border-bottom: 1px solid rgba(31,58,43,0.06); }
.adm-leads-table th { background: rgba(31,58,43,0.05); font-family: 'Bricolage Grotesque', sans-serif; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--adm-muted); }
.adm-leads-table a { color: var(--adm-accent); }
.adm-leads-table input[type="checkbox"] { transform: scale(1.3); cursor: pointer; }
```

- [ ] **Step 3: Verify**

Click "👥 N interesados →" on a dashboard card → leads page renders. Click a WhatsApp link → opens `wa.me/506…` with the pre-filled message. Tick a checkbox → flash + Sheet `leads` row's `contacted` column updates. Click "Copiar todos los WhatsApp" → list copied to clipboard.

- [ ] **Step 4: Commit**

```bash
git add admin/js/views/leads.js admin/css/admin.css
git commit -m "feat(admin): leads view with contact-tracking checkboxes"
```

---

### Task 20: Settings view

**Files:**
- Modify: `admin/js/views/settings.js`
- Modify: `admin/css/admin.css`

- [ ] **Step 1: Implement settings**

Replace `admin/js/views/settings.js`:

```javascript
ADM_REGISTER_VIEW('settings', async (app) => {
  app.innerHTML = `
    <div class="adm-editor" style="max-width: 640px">
      <header class="adm-editor-head">
        <a href="#dashboard" class="adm-back">← Tablero</a>
        <h1>Ajustes</h1>
      </header>
      <details open class="adm-section">
        <summary><h2>Cambiar password</h2></summary>
        <div class="adm-field"><label>Password nuevo</label><input id="set-pw" type="password" /></div>
        <button type="button" class="adm-btn" id="set-pw-save">Guardar</button>
      </details>
      <details open class="adm-section">
        <summary><h2>Notificación diaria por email</h2></summary>
        <p class="adm-muted">Cada mañana a las 7am te llega un resumen de tu día.</p>
        <div class="adm-field"><label>Email destino</label><input id="set-email" type="email" placeholder="hola@nancytourscr.com" /></div>
        <label class="adm-modal-check"><input type="checkbox" id="set-daily" /> <span>Enviar resumen diario</span></label>
        <button type="button" class="adm-btn" id="set-email-save" style="margin-top:12px">Guardar</button>
      </details>
      <details class="adm-section">
        <summary><h2>Sesión</h2></summary>
        <button type="button" class="adm-btn adm-btn--ghost" id="set-logout">Cerrar sesión</button>
      </details>
    </div>
  `;

  document.getElementById('set-logout').addEventListener('click', () => {
    window.ADM_API.clearToken();
    location.hash = '#login';
  });

  document.getElementById('set-pw-save').addEventListener('click', async (e) => {
    const pw = document.getElementById('set-pw').value;
    if (!pw || pw.length < 8) { alert('Mínimo 8 caracteres.'); return; }
    e.target.disabled = true;
    try {
      const hash = await sha256Hex(pw);
      await window.ADM_API.updateConfig('adminPasswordHash', hash);
      alert('Password actualizado. La próxima vez entrá con el nuevo.');
      document.getElementById('set-pw').value = '';
    } catch (err) { alert('No pude actualizar: ' + err.message); }
    finally { e.target.disabled = false; }
  });

  document.getElementById('set-email-save').addEventListener('click', async (e) => {
    e.target.disabled = true;
    try {
      await window.ADM_API.updateConfig('notificationEmail', document.getElementById('set-email').value);
      await window.ADM_API.updateConfig('dailySummaryEnabled', document.getElementById('set-daily').checked);
      alert('Listo.');
    } catch (err) { alert('No pude actualizar: ' + err.message); }
    finally { e.target.disabled = false; }
  });
});

async function sha256Hex(s) {
  const buf = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
```

- [ ] **Step 2: Verify**

Navigate to `#settings`. Change password → next login uses new password. Set email + check "Enviar resumen diario" → save. Sheet `config` tab shows updated values.

- [ ] **Step 3: Commit**

```bash
git add admin/js/views/settings.js
git commit -m "feat(admin): settings view (password rotation, email, daily summary toggle)"
```

---

## 🛑 Checkpoint 3 — Phase 3 review

- [ ] Login works with password from pre-flight.
- [ ] Dashboard shows all 13 migrated tours with state badges, counts, "ready" labels where applicable.
- [ ] Tour editor opens for each tour; all fields editable; "Guardar" persists; "Eliminar" cascades.
- [ ] Photo drag-drop uploads to Cloudinary; the new URL appears in the Sheet.
- [ ] State transition buttons work: Confirmar / Posponer / Completado / Reabrir.
- [ ] Dynamic list editors work: itinerary, incl/excl/bring, FAQ, related.
- [ ] Leads view shows interested people; WhatsApp link opens correct message; checkboxes flip `contacted`.
- [ ] Settings: password rotation works (verify by logging out and back in); email + daily flag persist.
- [ ] Push to Vercel: `vercel deploy --yes`. `/admin` URL works on prod. `/admin` not in sitemap, robots blocks indexing.

Fix any failures before Phase 4.

---

## Phase 4 — Daily summary cron + final polish

**Phase goal:** The daily email summary works. The whole system passes a final QA on mobile + desktop and is shipped.

---

### Task 21: Apps Script — daily summary cron

**Files:**
- Apps Script: edit `Code.gs`
- Modify: `docs/superpowers/setup/apps-script-code.md`

- [ ] **Step 1: Add the summary function to Apps Script**

Append to `Code.gs`:

```javascript
function sendDailySummary() {
  if (getConfig('dailySummaryEnabled') !== true && getConfig('dailySummaryEnabled') !== 'TRUE') return;
  const to = getConfig('notificationEmail');
  if (!to) return;

  const tours = rowsToObjects(TOURS).filter((t) => t.state !== 'completed');
  const leads = rowsToObjects(LEADS);
  const counts = {};
  leads.forEach((l) => { counts[l.slug] = (counts[l.slug] || 0) + Number(l.numPeople || 1); });

  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); yesterday.setHours(0,0,0,0);
  const newLeadsCount = leads.filter((l) => new Date(l.timestamp) >= yesterday).reduce((s, l) => s + Number(l.numPeople || 1), 0);

  const ready = tours.filter((t) => {
    const n = counts[t.slug] || 0;
    return t.state !== 'confirmed' && t.state !== 'postponed' && t.threshold && n >= t.threshold;
  });
  const searching = tours.filter((t) => t.state === 'searching' || (counts[t.slug] || 0) < t.threshold);
  const uncontactedLeads = leads.filter((l) => !l.contacted);

  const lines = [
    'Buenos días Nancy ☀️',
    '',
    `Ayer hubo ${newLeadsCount} personas nuevas interesadas.`,
    '',
    `🟠 LISTOS PARA CONFIRMAR (${ready.length}):`,
    ...ready.map((t) => `  • ${t.title} · ${counts[t.slug] || 0}/${t.threshold} · ${t.tentativeDate}`),
    '',
    `🟡 BUSCANDO (${searching.length}):`,
    ...searching.slice(0, 5).map((t) => `  • ${t.title} (${counts[t.slug] || 0}/${t.threshold})`),
    '',
    `📩 PERSONAS SIN CONTACTAR (${uncontactedLeads.length}):`,
    ...uncontactedLeads.slice(0, 10).map((l) => `  • ${l.name} (${l.slug} · +506 ${l.whatsapp})`),
    '',
    `Abrir admin: https://nancy-tours-cr.vercel.app/admin`,
  ];
  GmailApp.sendEmail(to, `Nancy Tours · resumen del día`, lines.join('\n'));
}
```

- [ ] **Step 2: Add a time trigger**

In the Apps Script editor: clock icon (Triggers) → `+ Add Trigger`.
- Choose which function: `sendDailySummary`
- Deployment: `Head`
- Event source: `Time-driven`
- Type: `Day timer`
- Time of day: `7am to 8am`
- Timezone: Costa Rica (UTC-6)

Save.

- [ ] **Step 3: Test the function manually**

In Apps Script editor → select `sendDailySummary` from the function dropdown → click Run.

Expected: Nancy receives an email at the configured address with the summary text.

- [ ] **Step 4: Update repo mirror + commit**

```bash
git add docs/superpowers/setup/apps-script-code.md
git commit -m "feat(backend): daily summary email cron"
```

---

### Task 22: Final QA + deploy + handoff

- [ ] **Step 1: Run the full QA checklist on desktop (1440px)**

Open https://nancy-tours-cr.vercel.app/ in a fresh tab.

- [ ] Home loads. "Tours que casi se lanzan" section appears if any tour is near-threshold.
- [ ] `/tours` loads 13 cards. Filter chips work. Card states match the Sheet.
- [ ] `/tour-detail?id=chirripo` loads. Booking card matches current state.
- [ ] Click "Me interesa" → modal opens → submit a fake interest → success state shows correct count.
- [ ] Refresh after submitting — the counter on tour detail and dashboard reflects the new lead.

- [ ] **Step 2: Run QA on mobile (390×844 via Chrome DevTools)**

- [ ] Hero, intro, tours, value cards, about, CTA, footer all responsive.
- [ ] Interest modal usable in mobile — 3 fields stack vertically, submit button visible.
- [ ] Tour card states clearly readable on small viewport.

- [ ] **Step 3: Run Lighthouse audit at https://nancy-tours-cr.vercel.app/tours (mobile)**

Expected: Accessibility ≥95, Best Practices ≥95, SEO ≥95. Fix any new regressions.

- [ ] **Step 4: Run Lighthouse against the admin (note: signed-in only)**

Log into admin, run audit at `#dashboard`. Expected: ≥85 (admin has heavier JS, lower bar is acceptable since it's a private tool).

- [ ] **Step 5: Verify admin is blocked from indexing**

```bash
curl -sI https://nancy-tours-cr.vercel.app/admin/ | grep -i robots
curl -s https://nancy-tours-cr.vercel.app/robots.txt | grep admin
```

Expected: header `X-Robots-Tag: noindex, nofollow`. `robots.txt` contains `Disallow: /admin/`.

- [ ] **Step 6: Write handoff notes for Nancy**

Create `docs/superpowers/setup/nancy-handoff.md`:

```markdown
# Cómo usar tu admin · 2 minutos

1. Abrí https://nancy-tours-cr.vercel.app/admin/
2. Entrá con tu password (la que te di aparte).
3. Tu tablero muestra todos los tours, sus estados y cuánta gente está interesada.

## Crear un tour nuevo
- Botón "+ Nuevo tour" arriba a la derecha.
- Llená título, foto (arrastrala), descripción, cupo mínimo, precio, fecha tentativa.
- Guardar.

## Confirmar o posponer un tour
- Clic en el tour → en la sección "Operación" usá los botones:
  - **✓ Confirmar tour** → ponele la fecha definitiva
  - **Posponer** → ponele la nueva fecha tentativa
  - **Marcar completado** → cuando ya pasó

## Ver quién está interesado
- Clic en "👥 N interesados →" debajo del tour.
- WhatsApp es link clickeable — abre tu chat con un mensaje listo.
- Tachá la casilla cuando ya hablaste con esa persona.

## Cambiar tu password o el email del resumen diario
- Botón ⚙ Ajustes arriba.

## Si algo se rompe
- Llamá a Moisés.
```

```bash
git add docs/superpowers/setup/nancy-handoff.md
git commit -m "docs: handoff notes for Nancy"
```

- [ ] **Step 7: Deploy + smoke test**

```bash
git push origin main
vercel deploy --yes
```

After deploy, hit:
- `/` (home)
- `/tours`
- `/tour-detail?id=chirripo`
- `/admin/` (login)
- `/admin/#dashboard` (after login)

All should respond 200, no console errors.

- [ ] **Step 8: Update memory (Claude session continuity)**

Add a memory note via Write tool documenting the new architecture so future sessions know:
- `js/tours-data.js` is deleted; data lives in the Sheet
- Admin lives in `admin/`
- Apps Script URL is in `js/config.js`
- The mirror of the Apps Script code lives in `docs/superpowers/setup/apps-script-code.md`

- [ ] **Step 9: Final commit + tag**

```bash
git tag -a v2.0.0-interest-marketplace -m "Interest-driven marketplace + admin console"
git push --tags
```

---

## Self-review summary

Coverage check (spec ↔ plan):

- **Goal 1 — Public site interest model:** Tasks 8, 9, 10, 11, 12 ✓
- **Goal 2 — Admin console:** Tasks 14, 15, 16, 17, 18, 19, 20 ✓
- **Goal 3 — Invisible Sheet+Apps Script backend:** Tasks 1, 2, 3, 4, 5, 21 ✓
- **Goal 4 — No build, no framework:** entire plan uses vanilla HTML/CSS/JS ✓

Spec sections individually covered:

- **Tour lifecycle (5 states):** Task 4 (`setState`), Task 9 (catalog), Task 10 (detail), Task 17 (admin) ✓
- **`tours_status` schema:** Task 1 + 5 + 17 ✓
- **`leads` schema:** Task 1 + 3 + 19 ✓
- **`config` schema:** Task 1 + 4 + 5 + 20 ✓
- **Public endpoints:** Tasks 2 + 3 ✓
- **Admin endpoints:** Tasks 4 + 5 ✓
- **Daily summary email:** Task 21 ✓
- **`tours.html` changes:** Task 9 ✓
- **`tour-detail.html` changes:** Task 10 ✓
- **Interest form modal:** Task 11 ✓
- **`index.html` new section:** Task 12 ✓
- **Admin file structure:** Task 14 ✓
- **Admin views (login/dashboard/editor/leads/settings):** Tasks 15–20 ✓
- **Image upload flow:** Task 5 (backend) + Task 17 (admin UI) ✓
- **Migration plan phases:** mirrored as Phase 1–4 with checkpoints ✓
- **Risks (rate limit, cold start, sheet corruption, password compromise, Cloudinary limits, deploy URL, spam):** addressed via 60s caching (Task 6), skeleton states (Tasks 9, 16), config-driven secrets, password rotation in settings (Task 20), and using the stable `/exec` URL — sheet backup script and honeypot field not implemented in v1 (documented as future work below)

Placeholder scan: no "TBD", "TODO", "fill in" — every step shows the actual code.

Type consistency: `slug`, `state`, `threshold`, `maxCapacity`, `interested`, `derivedState`, `tentativeDate`, `confirmedDate` — used identically across backend, API wrapper, public site, admin. `Code.gs` headers match the Sheet headers from Task 1.

**Items deferred from spec (not in this plan, captured for future):**

- Sheet auto-backup trigger (mentioned in risks; can be added as 10 lines of Apps Script later)
- Honeypot field + IP rate limit (mentioned in risks; both are 1-task additions when needed)
- Bulk admin operations
- Public photo gallery per tour

These do not block the v1 ship and can be added when the operational need shows up.
