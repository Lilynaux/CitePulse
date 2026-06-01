# CitePulse

A Zotero 9 plugin that fetches citation counts from [OpenAlex](https://openalex.org) and displays them as a sortable column in your library.

## Demo

[![Watch the demo](https://img.youtube.com/vi/0GfBq66LNM4/maxresdefault.jpg)](https://youtu.be/0GfBq66LNM4)

---

## Features

- Fetches live citation counts from OpenAlex via DOI
- Displays counts in a dedicated **OpenAlex Citations** column
- Sortable numerically — find your most-cited papers instantly
- Stores data in the item's Extra field — persists across sync, export, and backups
- Batch update multiple selected items at once
- Progress indicator during updates
- Non-destructive — preserves all existing Extra field content

---

## Installation

1. Download `CitePulse.xpi` from the [Releases](https://github.com/Lilynaux/CitePulse/releases) page
2. In Zotero: **Tools → Add-ons → gear icon → Install Add-on From File…**
3. Select `CitePulse.xpi` and restart Zotero

---

## Usage

1. Select one or more items in your Zotero library
2. Right-click → **CitePulse: Update Citation Count**
3. Citation counts appear in the **OpenAlex Citations** column

Items without a DOI, or DOIs not found in OpenAlex, are skipped automatically.

---

## How Data Is Stored

Citation data is written to the item's **Extra** field:

```text
OpenAlex Citations: 5321
OpenAlex Updated: 2026-06-01
OpenAlex Work ID: https://openalex.org/W123456789
```

Existing Extra field content (e.g. PMID, Impact Factor) is preserved.

---

## Development

### Requirements

- [conda](https://docs.conda.io) with the `CitePulse` environment (Node.js)
- Or any Node.js ≥ 18

### Setup

```bash
conda activate CitePulse
npm install
```

### Build

```bash
npm run build        # compile TypeScript → addon/content/main.js
npm run package      # build + zip → build/CitePulse.xpi
npm run watch        # rebuild on file change
```

### Project Structure

```text
addon/
  bootstrap.js       # plugin entry point loaded by Zotero
  manifest.json      # plugin metadata and version range
  content/
    main.js          # compiled bundle (build output, gitignored)
src/
  main.ts            # wires everything together
  openalex.ts        # OpenAlex API client
  extraField.ts      # Extra field read/write
  column.ts          # sortable column registration
  menu.ts            # right-click menu item
  batch.ts           # multi-item update loop
  notifications.ts   # progress window and summary dialog
  utils.ts           # DOI normalization, date, sleep
  zotero.ts          # Zotero global type declarations
scripts/
  build.js           # esbuild + XPI packaging script
```

---

## Compatibility

| Platform | Status |
| --- | --- |
| Zotero 7 – 9 | Supported |
| macOS | Supported |
| Windows | Should work |
| Linux | Should work |

---

## Privacy

- No account or API key required
- No telemetry or analytics
- Only contacts `https://api.openalex.org`

---
