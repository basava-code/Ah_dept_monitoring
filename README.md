# Pashudhan Kartavya

**The Digital Mission Execution Platform — Animal Husbandry Department, Government of Uttarakhand.**
Duty · Discipline · Delivery.

A lightweight, installable **Progressive Web App (PWA)** for tracking departmental tasks, milestones,
responsible officers, deadlines and performance across every workstream of the Animal Husbandry
Department. It uses a **self-hosted PocketBase backend** for a real database with **officer logins**
(every edit attributed to a named officer), an **admin dashboard**, and automatic backups — with a full
offline fallback. A legacy Google Apps Script backend is also included for a zero-server option.

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
  signed in to the shared backend.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The entire single-page app (UI + logic). |
| `config.js` | **Admin edits this** — points the app at your PocketBase server URL. |
| `manifest.json` | PWA manifest (name, icons, theme). |
| `service-worker.js` | Offline caching + network-first HTML updates. |
| `pocketbase/SETUP.md` | **Full VPS deployment guide** — PocketBase + nginx + HTTPS + officer accounts. |
| `pocketbase/nginx-ahdept.conf` | Ready-to-use nginx config (serves the app + proxies PocketBase). |
| `pocketbase/pocketbase.service` | systemd unit to run PocketBase as a service. |
| `Code.gs`, `Code-NoScope.gs`, `appsscript.json` | *Legacy* Google Apps Script backend (zero-server alternative). |
| `icon-192.png`, `icon-512.png` | App icons. |

## Setup — PocketBase backend (recommended)

This gives a real database, **officer logins with an audit trail**, an admin dashboard and backups,
all on your own server. Full step-by-step (Hostinger VPS or any Ubuntu/Debian box) is in
**[`pocketbase/SETUP.md`](pocketbase/SETUP.md)**. In brief:

1. On the VPS: install nginx + PocketBase; run PocketBase as a service (`pocketbase/pocketbase.service`).
2. Serve this repo's files with nginx and proxy PocketBase on a `pb.` subdomain (`pocketbase/nginx-ahdept.conf`),
   then enable HTTPS with `certbot`.
3. Set your backend URL in **`config.js`**: `window.POCKETBASE_URL = 'https://pb.yourdomain.com';`
4. In the PocketBase admin dashboard (`https://pb.yourdomain.com/_/`): create the **`tasks`** collection
   (`taskId` text, `payload` JSON, `updatedBy` text), set API rules to `@request.auth.id != ""`, and add
   an **officer account** (in `users`) for each staff member.

Officers then open `https://ah.yourdomain.com`, **sign in**, and share one live task list — every edit
attributed to a named officer. You manage accounts, data and backups from the admin dashboard.

### Try it with no backend

Click **“Use offline”** on the sign-in screen — data is stored in that browser only (no sharing).

### Legacy: Google Apps Script backend

The `Code.gs` / `Code-NoScope.gs` files are a zero-server alternative that stores data in Google
(a Sheet, or the script's own storage). Kept for reference; the PocketBase path above is recommended for
a department tool because it adds real logins and accountability. (These have no officer logins.)

## Hosting

The front-end is fully static, so `index.html` and its assets can be served by nginx on your VPS
(recommended, alongside PocketBase) or any static host. HTTPS is required for the PWA to install.

## Notes

- The department name (*Government of Uttarakhand*) mirrors the source project. Edit the strings in
  `index.html`, `manifest.json` and `Code.gs` if deploying for another state or department.
- Officer designations and workstreams live near the top of the `<script>` block in `index.html`
  (`ALL_WS`, `WS_LABELS`, `OFFICERS`) and in the sidebar / modal markup — adjust to match your setup.

---

*Your Duty Today → A Farmer's Prosperity Tomorrow.*

<!-- auto-deploy test: webhook-check -->
