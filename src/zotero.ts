// Minimal Zotero 7+ global type declarations

interface ZoteroProgressWindow {
  changeHeadline(text: string): void;
  show(): void;
  close(): void;
}

interface ZoteroPane {
  getSelectedItems(): ZoteroItem[];
}

interface ZoteroItem {
  isRegularItem(): boolean;
  getField(field: string): string;
  setField(field: string, value: string): void;
  saveTx(): Promise<void>;
}

interface ZoteroColumnOptions {
  dataKey: string;
  label: string;
  pluginID: string;
  dataProvider: (item: ZoteroItem, dataKey: string) => string | number;
  sortReverse?: boolean;
}

declare const Zotero: {
  debug(msg: string): void;
  initializationPromise: Promise<void>;
  getMainWindow(): (Window & typeof globalThis & {
    document: Document & { createXULElement(tag: string): Element };
    alert(msg: string): void;
  }) | null;
  getActiveZoteroPane(): ZoteroPane;
  ItemTreeManager: {
    registerColumn(opts: ZoteroColumnOptions): Promise<void>;
    unregisterColumn(key: string): Promise<void>;
  };
  ProgressWindow: new (opts?: { closeOnClick?: boolean }) => ZoteroProgressWindow;
  alert(win: Window | null, title: string, msg: string): void;
};

declare const Services: {
  scriptloader: {
    loadSubScript(url: string): void;
  };
};
