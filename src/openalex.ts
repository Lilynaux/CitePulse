import "./zotero";
import { normalizeDOI, sleep } from "./utils";

export interface OpenAlexWork {
  id: string;
  doi: string;
  cited_by_count: number;
}

export interface FetchResult {
  success: boolean;
  work?: OpenAlexWork;
  error?: string;
}

export async function fetchCitations(rawDOI: string): Promise<FetchResult> {
  const doi = normalizeDOI(rawDOI);
  if (!doi) return { success: false, error: "Invalid DOI format" };

  const url = `https://api.openalex.org/works/https://doi.org/${encodeURIComponent(doi)}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "ZoteroOpenAlexPlugin/1.0 (mailto:user@example.com)",
        },
      });

      if (response.status === 404) {
        return { success: false, error: "DOI not found in OpenAlex" };
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        work: {
          id: data.id,
          doi: data.doi,
          cited_by_count: data.cited_by_count,
        },
      };
    } catch (err) {
      Zotero.debug(`[OpenAlexCitations] Fetch attempt ${attempt + 1} failed: ${err}`);
      if (attempt === 0) await sleep(500);
    }
  }

  return { success: false, error: "Network error" };
}
