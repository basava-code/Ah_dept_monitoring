/**
 * ============================================================
 *  Pashudhan Kartavya — Google Apps Script Backend (Code.gs)
 *  Animal Husbandry Department, Government of Uttarakhand
 * ------------------------------------------------------------
 *  Acts as the shared database for the PWA using a Google Sheet.
 *  Each task (with its milestones/subtasks) is stored as one row
 *  of JSON, keyed by task id.
 *
 *  SETUP
 *   1. Go to script.google.com → New Project
 *   2. Delete the default code, paste this whole file
 *   3. Deploy → New Deployment → Web App
 *        Execute as: Me   |   Who has access: Anyone
 *   4. Authorize, copy the Web App URL (…/exec)
 *   5. Paste that URL into the app's setup screen → Connect
 *
 *  The first request auto-creates a spreadsheet named
 *  "Pashudhan Kartavya DB" in your Google Drive.
 * ============================================================
 */

var DB_NAME    = 'Pashudhan Kartavya DB';
var SHEET_NAME = 'Tasks';
var PROP_KEY   = 'PK_SPREADSHEET_ID';

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

// POST is supported too (in case the client is changed to POST later).
function doPost(e) {
  return doGet(e);
}

// ── Sheet helpers ─────────────────────────────────────────────
function getSheet() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(PROP_KEY);
  var ss;
  if (id) {
    try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; }
  }
  if (!ss) {
    ss = SpreadsheetApp.create(DB_NAME);
    props.setProperty(PROP_KEY, ss.getId());
  }
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['id', 'json', 'updated']);
  }
  return sh;
}

function getTasks() {
  var sh = getSheet();
  var last = sh.getLastRow();
  if (last < 2) return [];
  var values = sh.getRange(2, 1, last - 1, 2).getValues();
  var out = [];
  for (var i = 0; i < values.length; i++) {
    var raw = values[i][1];
    if (!raw) continue;
    try { out.push(JSON.parse(raw)); } catch (e) { /* skip corrupt row */ }
  }
  return out;
}

function findRow(sh, id) {
  var last = sh.getLastRow();
  if (last < 2) return -1;
  var ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function saveTask(payload) {
  var task = JSON.parse(payload);
  if (!task.id) task.id = Utilities.getUuid();
  var sh = getSheet();
  var row = findRow(sh, task.id);
  var stamp = new Date();
  if (row === -1) {
    sh.appendRow([task.id, JSON.stringify(task), stamp]);
  } else {
    sh.getRange(row, 1, 1, 3).setValues([[task.id, JSON.stringify(task), stamp]]);
  }
  return task;
}

function deleteTask(id) {
  var sh = getSheet();
  var row = findRow(sh, id);
  if (row !== -1) sh.deleteRow(row);
  return id;
}

// ── Response helper (CORS-friendly JSON) ──────────────────────
function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
