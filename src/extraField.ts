import "./zotero";
import { formatDate } from "./utils";
import type { OpenAlexWork } from "./openalex";

const FIELD_CITATIONS = "OpenAlex Citations";
const FIELD_UPDATED = "OpenAlex Updated";
const FIELD_WORK_ID = "OpenAlex Work ID";

export function updateExtraField(item: ZoteroItem, work: OpenAlexWork): void {
  let extra = item.getField("extra") || "";
  extra = setLine(extra, FIELD_CITATIONS, String(work.cited_by_count));
  extra = setLine(extra, FIELD_UPDATED, formatDate());
  extra = setLine(extra, FIELD_WORK_ID, work.id);
  item.setField("extra", extra);
}

function setLine(extra: string, key: string, value: string): string {
  const pattern = new RegExp(`^${key}:.*$`, "m");
  const line = `${key}: ${value}`;
  if (pattern.test(extra)) {
    return extra.replace(pattern, line);
  }
  return extra ? `${extra.trimEnd()}\n${line}` : line;
}
