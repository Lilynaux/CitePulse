/* global Services, Zotero */
/* jshint esversion: 11 */

var addon = null;

function log(msg) {
  Zotero.debug("[OpenAlexCitations] " + msg);
}

async function startup(data) {
  log("Starting v" + data.version);
  await Zotero.initializationPromise;
  Services.scriptloader.loadSubScript(data.rootURI + "content/main.js");
  await addon.startup(data);
}

function shutdown(data) {
  log("Shutting down");
  if (addon) {
    addon.shutdown(data);
    addon = null;
  }
}

function install(data) {
  log("Installed v" + data.version);
}

function uninstall(data) {
  log("Uninstalled");
}
