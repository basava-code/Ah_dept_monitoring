/**
 * ============================================================
 *  Pashudhan Kartavya — Backend, ZERO-SCOPE variant
 *  (use this if "This app is blocked / sensitive info" appears)
 * ------------------------------------------------------------
 *  Stores tasks in the script's own private storage
 *  (PropertiesService) instead of a Google Sheet. It touches
 *  NO Google user data — no Sheets, Drive, Gmail, anything —
 *  so there is NO sensitive OAuth scope for Google to block.
 *
 *  Trade-off vs the Sheet version (Code.gs): data lives inside
 *  the script (not a visible spreadsheet) and total storage is
 *  ~500 KB (roughly a few hundred tasks). Plenty for day-to-day
 *  use; archive/delete completed tasks periodically.
 *
 *  SETUP
 *   1. Go to  https://script.google.com  ->  New Project
 *   2. Delete the default code, paste this whole file, Save
 *   3. Deploy -> New Deployment -> Web App
 *        Execute as: Me   |   Who has access: Anyone
 *   4. Authorize, copy the Web App URL (…/exec)
 *   5. Paste that URL into the app's setup screen -> Connect
 *
 *  (A standalone "New Project" is fine here — there is no sheet
 *   to bind to, and no sensitive scope is requested.)
 * ============================================================
 */

var PREFIX = 'task_';

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'ping';
  try {
    switch (action) {
      case 'ping':       return json({ ok: true, app: 'Pashudhan Kartavya' });
      case 'getTasks':   return json({ ok: true, tasks: getTasks() });
      case 'saveTask':   return json({ ok: true, task: saveTask(e.parameter.payload) });
      case 'deleteTask': return json({ ok: true, id: deleteTask(e.parameter.id) });
      default:           return json({ error: 'unknown action: ' + action });
    }
  } catch (err) {
    return json({ error: String(err && err.message ? err.message : err) });
  }
}

function doPost(e) { return doGet(e); }

// ── Store (PropertiesService — no OAuth scope required) ────────
function store() { return PropertiesService.getScriptProperties(); }

function getTasks() {
  var all = store().getProperties();
  var out = [];
  for (var k in all) {
    if (k.indexOf(PREFIX) === 0) {
      try { out.push(JSON.parse(all[k])); } catch (e) { /* skip corrupt */ }
    }
  }
  return out;
}

function saveTask(payload) {
  var task = JSON.parse(payload);
  if (!task.id) task.id = Utilities.getUuid();
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    store().setProperty(PREFIX + task.id, JSON.stringify(task));
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
  return task;
}

function deleteTask(id) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    store().deleteProperty(PREFIX + id);
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
  return id;
}

// ── Response helper ───────────────────────────────────────────
function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
