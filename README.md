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
| `Code.gs` | Google Apps Script backend — the shared database over a Google Sheet. |
| `appsscript.json` | Apps Script manifest — pins the narrow, non-sensitive OAuth scope. |
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

### Still seeing “This app is blocked”?

That is Google **Workspace / organization policy** (common on government `@*.gov.in` domains), not a bug —
the admin has blocked unverified third-party apps. Options, in order of ease:

- **Use a personal `@gmail.com` account** for the Apps Script step (the sheet can still be shared with the team).
- Ask your **Workspace admin** to allow the app: *Admin console → Security → API controls → App access control → “Trust internal, domain-owned apps”* (or add the app’s OAuth client ID to the trusted list).
- Confirm you used **Extensions → Apps Script from inside a Sheet** (bound script), **not** a standalone
  “New Project” — the bound script requests a much narrower scope and is far less likely to be blocked.

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
