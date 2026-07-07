# Pashudhan Kartavya

**The Digital Mission Execution Platform — Animal Husbandry Department, Government of Uttarakhand.**
Duty · Discipline · Delivery.

A lightweight, installable **Progressive Web App (PWA)** for tracking departmental tasks, milestones,
responsible officers, deadlines and performance across every workstream of the Animal Husbandry
Department. It uses **Google Sheets (via Google Apps Script)** as a free, shared database so all
officers and staff see one live task list — with a full offline fallback.

This app is adapted from the Skill Development Department's *Kaushal Kartavya* platform; the app
engine, dashboard and export tooling are the same, while the **workstreams**, **officer designations**
and **branding** have been tailored to Animal Husbandry.

---

## Features

- **Task & milestone tracking** — priority (Critical → Info), status, due dates, responsible officer, sub-tasks.
- **Workstream taxonomy** built for Animal Husbandry — Governance, Livestock Health & Veterinary Services,
  Livestock Development & Breeding, Dairy Development, Schemes & Missions, Extension & Farmer Welfare,
  Technology, Finance, Communication and Miscellaneous.
- **Views** — Due Today, Overdue, This Week, Completed, and filters by priority, officer and workstream.
- **Performance Dashboard** (Chart.js) — KPIs, priority × urgency, due-window, officer load, workstream
  and status breakdowns.
- **Exports** — CSV, Google Sheets, Google Docs table, and print / PDF reports; plus weekly / monthly
  officer performance reports.
- **Offline-first PWA** — installable on Android / desktop, works with no connection; live sync when
  connected to the shared Google Sheet backend.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The entire single-page app (UI + logic). |
| `manifest.json` | PWA manifest (name, icons, theme). |
| `service-worker.js` | Offline caching + network-first HTML updates. |
| `Code.gs` | Google Apps Script backend — shared database over a Google Sheet (narrow `spreadsheets.currentonly` scope). |
| `Code-NoScope.gs` | Alternate backend — stores data in the script's own storage; **requests no scopes at all**. Use if Google shows "this app is blocked / sensitive info". |
| `appsscript.json` | Apps Script manifest — pins the narrow OAuth scope (for `Code.gs`). |
| `icon-192.png`, `icon-512.png` | App icons. |

## Setup (one-time, admin only)

The backend is a **container-bound** script — it lives inside one Google Sheet and only touches that
sheet. This keeps the permission request to the narrow, non-sensitive `spreadsheets.currentonly` scope,
so Google does **not** show a *“This app is blocked / tried to access sensitive info”* error.

1. Create a blank spreadsheet at **[sheets.new](https://sheets.new)** (this sheet becomes your database).
2. In that sheet: **Extensions → Apps Script**.
3. Delete the default code, paste the contents of **`Code.gs`**, and **Save**.
4. **Deploy → New Deployment → Web App** — *Execute as:* **Me**, *Who has access:* **Anyone**.
5. **Authorize** (approve the prompt), then copy the **Web App URL** (ends in `/exec`).
6. Open the app, paste the URL on the setup screen, and click **Connect**.

Tasks are stored on a tab named **`Tasks`** inside that spreadsheet.

### Still seeing “This app is blocked / tried to access sensitive info”?

That message means Google is still being asked for a **sensitive scope**, or your account **policy blocks
unverified apps outright** (common on government `@*.gov.in` / managed domains). Fix it with any one of these:

1. **Use the zero-scope backend `Code-NoScope.gs`.** It stores data in the script's own private storage
   (`PropertiesService`) and touches **no** Google user data, so there is **no sensitive scope to block**.
   Paste it into a new `script.google.com` project and deploy as above. *(This removes the exact reason
   Google states — try this first.)*
2. **Use a personal `@gmail.com` account** for the Apps Script step. Your data isn't sensitive to Google —
   the block is about the *account policy*, not the tasks. The resulting Web App URL works for everyone.
3. Ask your **Workspace admin** to allow it: *Admin console → Security → API controls → App access control →
   “Trust internal, domain-owned apps.”*
4. If using the Sheet backend (`Code.gs`), make sure it was created via **Extensions → Apps Script from
   inside a Sheet** (a *bound* script) — **not** a standalone “New Project.” A standalone script forces the
   broad, sensitive Sheets scope.

### Optional: pin the scope explicitly

`appsscript.json` already pins the narrow scope. To use it, in the Apps Script editor open
**Project Settings (⚙) → “Show ‘appsscript.json’ manifest file”**, then paste the contents of
`appsscript.json`. This is optional — the bound `Code.gs` auto-requests the same narrow scope anyway.

### No backend needed to try it

Click **“Use offline”** on the setup screen — data is stored in your browser only (no sharing).

## Hosting

Because it is fully static, host `index.html` and its assets anywhere — GitHub Pages, Google Sites,
Netlify, Vercel, or any static file server.

## Notes

- The department name (*Government of Uttarakhand*) mirrors the source project. Edit the strings in
  `index.html`, `manifest.json` and `Code.gs` if deploying for another state or department.
- Officer designations and workstreams live near the top of the `<script>` block in `index.html`
  (`ALL_WS`, `WS_LABELS`, `OFFICERS`) and in the sidebar / modal markup — adjust to match your setup.

---

*Your Duty Today → A Farmer's Prosperity Tomorrow.*
