import "./zotero";
import { registerColumn, unregisterColumn } from "./column";
import { registerMenu, unregisterMenu } from "./menu";
import { processBatch } from "./batch";

interface StartupData {
  id: string;
  version: string;
  rootURI: string;
}

// Exposed to bootstrap.js via loadSubScript global scope
const addon = {
  async startup(_data: StartupData): Promise<void> {
    await registerColumn();
    registerMenu((items) => {
      processBatch(items).catch((err) => {
        Zotero.debug(`[OpenAlexCitations] Unhandled error: ${err}`);
      });
    });
  },

  shutdown(_data: unknown): void {
    unregisterMenu();
    unregisterColumn();
  },
};

// Make available to bootstrap.js after loadSubScript
(globalThis as Record<string, unknown>).addon = addon;
