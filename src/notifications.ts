import "./zotero";

export class ProgressManager {
  private progressWin: ZoteroProgressWindow;
  private total = 0;
  private completed = 0;

  constructor() {
    this.progressWin = new Zotero.ProgressWindow({ closeOnClick: false });
  }

  start(total: number): void {
    this.total = total;
    this.completed = 0;
    this.progressWin.changeHeadline(`Updating citations... 0 / ${total}`);
    this.progressWin.show();
  }

  tick(): void {
    this.completed++;
    this.progressWin.changeHeadline(
      `Updating citations... ${this.completed} / ${this.total}`
    );
  }

  finish(updated: number, skipped: number, failed: number): void {
    this.progressWin.close();
    const summary = `Update Complete\n\nUpdated: ${updated}\nSkipped: ${skipped}\nFailed: ${failed}`;
    Zotero.alert(Zotero.getMainWindow(), "OpenAlex Citations", summary);
  }
}
