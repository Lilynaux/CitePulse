import "./zotero";

const COLUMN_KEY = "openalexCitations";
const PLUGIN_ID = "zotero-openalex@example.com";

export async function registerColumn(): Promise<void> {
  await Zotero.ItemTreeManager.registerColumn({
    dataKey: COLUMN_KEY,
    label: "OpenAlex Citations",
    pluginID: PLUGIN_ID,
    sortReverse: true,
    dataProvider: (item: ZoteroItem, _dataKey: string) => {
      const extra = item.getField("extra") || "";
      const match = extra.match(/OpenAlex Citations:\s*(\d+)/);
      return match ? Number(match[1]) : "";
    },
  });
}

export async function unregisterColumn(): Promise<void> {
  try {
    await Zotero.ItemTreeManager.unregisterColumn(COLUMN_KEY);
  } catch {
    // column may not be registered
  }
}
