import "./zotero";
import { fetchCitations } from "./openalex";
import { updateExtraField } from "./extraField";
import { ProgressManager } from "./notifications";
import { sleep } from "./utils";

export async function processBatch(items: ZoteroItem[]): Promise<void> {
  const eligible: ZoteroItem[] = [];
  let skipped = 0;

  for (const item of items) {
    if (!item.isRegularItem() || !item.getField("DOI")) {
      skipped++;
    } else {
      eligible.push(item);
    }
  }

  const progress = new ProgressManager();
  progress.start(eligible.length);

  let updated = 0;
  let failed = 0;

  for (const item of eligible) {
    const doi = item.getField("DOI");
    const result = await fetchCitations(doi);

    if (result.success && result.work) {
      try {
        updateExtraField(item, result.work);
        await item.saveTx();
        updated++;
      } catch (err) {
        Zotero.debug(`[OpenAlexCitations] Save failed: ${err}`);
        failed++;
      }
    } else {
      Zotero.debug(
        `[OpenAlexCitations] Skipped "${item.getField("title")}": ${result.error}`
      );
      failed++;
    }

    progress.tick();
    await sleep(100);
  }

  progress.finish(updated, skipped, failed);
}
