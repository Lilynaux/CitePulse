import "./zotero";

const MENU_ITEM_ID = "citepulse-update";
const SEPARATOR_ID = "citepulse-separator";

export function registerMenu(onUpdate: (items: ZoteroItem[]) => void): void {
  const win = Zotero.getMainWindow();
  if (!win) return;

  const doc = win.document;
  const menu = doc.getElementById("zotero-itemmenu");
  if (!menu) return;

  // Remove any stale entries from a previous load before re-registering
  doc.getElementById(MENU_ITEM_ID)?.remove();
  doc.getElementById(SEPARATOR_ID)?.remove();

  const separator = doc.createXULElement("menuseparator");
  separator.id = SEPARATOR_ID;

  const menuItem = doc.createXULElement("menuitem");
  menuItem.id = MENU_ITEM_ID;
  menuItem.setAttribute("label", "CitePulse: Update Citation Count");
  menuItem.addEventListener("command", () => {
    const items = Zotero.getActiveZoteroPane().getSelectedItems();
    onUpdate(items);
  });

  menu.appendChild(separator);
  menu.appendChild(menuItem);
}

export function unregisterMenu(): void {
  const win = Zotero.getMainWindow();
  if (!win) return;

  const doc = win.document;
  doc.getElementById(MENU_ITEM_ID)?.remove();
  doc.getElementById(SEPARATOR_ID)?.remove();
}
