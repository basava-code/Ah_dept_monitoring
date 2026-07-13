# Deploying Pashudhan Kartavya on your Hostinger VPS (PocketBase backend)

This gives you: the app + a **real database** + **officer logins** + an **admin dashboard** — all on
your own server. Officers just visit the app URL and sign in.

**Architecture**
```
Officer's phone ─https─► ah.yourdomain.com   → nginx → static app (this repo)
                              │  (login + task edits)
                              ▼
                        pb.yourdomain.com     → nginx → PocketBase (127.0.0.1:8090) → SQLite DB
```

Assumes an **Ubuntu/Debian** VPS. On AlmaLinux/CentOS swap `apt` for `dnf`.
You need **two DNS records** (in Hostinger hPanel → Domains → DNS), both pointing to your VPS IP:
`ah` (the app) and `pb` (the backend) — or pick any two names you like.

---

## 1. Install nginx + certbot
```bash
ssh root@YOUR_VPS_IP
apt update && apt install -y nginx git certbot python3-certbot-nginx unzip
ufw allow 'Nginx Full'      # if the firewall is on
```

## 2. Install PocketBase
Grab the latest Linux build from https://github.com/pocketbase/pocketbase/releases
(copy the `linux_amd64` .zip URL), then:
```bash
mkdir -p /opt/pocketbase && cd /opt/pocketbase
curl -L -o pb.zip "PASTE_THE_LINUX_AMD64_ZIP_URL_HERE"
unzip pb.zip && rm pb.zip
chown -R www-data:www-data /opt/pocketbase
```

## 3. Run PocketBase as a service
```bash
# from your cloned repo folder:
cp pocketbase/pocketbase.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now pocketbase
systemctl status pocketbase        # should say "active (running)"
```

## 4. Deploy the app files
Use a **read-only deploy key** so nothing secret sits in shell history:
```bash
ssh-keygen -t ed25519 -f ~/.ssh/ahdept_deploy -N ""
cat ~/.ssh/ahdept_deploy.pub
```
Add that public key to GitHub → repo **Settings → Deploy keys → Add** (leave write access OFF). Then:
```bash
GIT_SSH_COMMAND='ssh -i ~/.ssh/ahdept_deploy -o IdentitiesOnly=yes' \
  git clone git@github.com:basava-code/Ah_dept_monitoring.git /var/www/ahdept
```

## 5. Configure nginx
```bash
cp /var/www/ahdept/pocketbase/nginx-ahdept.conf /etc/nginx/sites-available/ahdept
# edit the file: replace ah.yourdomain.com and pb.yourdomain.com with your real names
nano /etc/nginx/sites-available/ahdept
ln -s /etc/nginx/sites-available/ahdept /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

## 6. Turn on HTTPS (required for the PWA)
```bash
certbot --nginx -d ah.yourdomain.com -d pb.yourdomain.com
```
Choose "redirect HTTP → HTTPS". Certbot auto-renews.

## 7. Point the app at the backend
Edit `/var/www/ahdept/config.js` and set your PocketBase URL:
```js
window.POCKETBASE_URL = 'https://pb.yourdomain.com';
```
(That's the only line to change. Officers never touch this.)

## 8. Create the database collection + your admin account
1. Open **https://pb.yourdomain.com/_/** — create the **superuser (admin)** account (this is you / HOD).
2. Go to **Collections → New collection**, name it exactly **`tasks`**, type **Base**, add three fields:
   | Field | Type | Notes |
   |-------|------|-------|
   | `taskId` | Text | the app's task id (add a **Unique** index on it) |
   | `payload` | JSON | the whole task object |
   | `updatedBy` | Text | who last edited it |
3. Open the `tasks` collection → **API Rules**, and set **all five rules** (List, View, Create, Update, Delete) to:
   ```
   @request.auth.id != ""
   ```
   (= any signed-in officer. Leave them empty/locked to restrict further later.)

## 9. Create officer accounts
1. In the admin dashboard → **Collections → `users`** → **New record**.
2. Set **email**, **password**, and **name** (the name shows in the app's audit trail).
3. Repeat for each officer. Give them the app URL (`https://ah.yourdomain.com`) + their email/password.
4. **Lock signups:** `users` collection → **API Rules** → set the **Create rule** to empty (only you add accounts).

Done. Officers open `https://ah.yourdomain.com`, sign in, and share one live task list — every edit
attributed to a named officer. You manage everything (accounts, data, exports, backups) from the admin
dashboard.

---

### Updating the app later
When new changes are pushed to the repo:
```bash
cd /var/www/ahdept && GIT_SSH_COMMAND='ssh -i ~/.ssh/ahdept_deploy -o IdentitiesOnly=yes' git pull
```
(The service worker is network-first, so officers get the new version on next open.)

### Backups
Your whole database is the folder `/opt/pocketbase/pb_data`. Back it up with:
```bash
tar czf ~/pb_backup_$(date +%F).tar.gz -C /opt/pocketbase pb_data
```
PocketBase can also do scheduled backups (incl. to S3) from **admin dashboard → Settings → Backups**.
