export function normalizeDOI(raw: string): string | null {
  let doi = raw.trim();
  doi = doi.replace(/^https?:\/\/doi\.org\//i, "");
  doi = doi.replace(/^doi:\s*/i, "");
  doi = doi.trim();
  if (!/^10\.\d{4,}\//.test(doi)) return null;
  return doi;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatDate(): string {
  return new Date().toISOString().split("T")[0];
}
