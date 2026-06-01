# PRD — Zotero 9 OpenAlex Citation Counter Plugin

Version: 1.0  
Target Platform: Zotero 9  
Primary OS: macOS  
Language: TypeScript  
Package Format: .xpi

---

# 1. Product Overview

## 1.1 Product Name

OpenAlex Citation Counter for Zotero

---

## 1.2 Goal

Build a lightweight Zotero 9 plugin that:

- Reads DOI metadata from Zotero items
- Fetches citation counts from OpenAlex
- Stores citation data locally inside Zotero
- Displays citation counts in a dedicated sortable custom column

The plugin is designed to provide a fast and frictionless citation visibility workflow entirely inside Zotero.

---

## 1.3 Core Value

Researchers currently need to:

- manually search Google Scholar
- open OpenAlex webpages
- check citation counts one-by-one

This plugin eliminates that workflow.

Users can directly:

- select papers
- click update
- instantly view citation counts inside Zotero

---

# 2. User Stories

## 2.1 Single Paper Update

As a Zotero user,  
I want to update citation counts for selected papers,  
so that I can quickly evaluate paper influence.

---

## 2.2 Batch Update

As a researcher,  
I want to update many papers simultaneously,  
so that my library remains current.

---

## 2.3 Sort by Citation Count

As a literature reviewer,  
I want to sort papers by citation count,  
so that I can quickly identify influential works.

---

## 2.4 Persistent Storage

As a Zotero user,  
I want citation data stored inside item metadata,  
so that data persists across sync/export/backups.

---

# 3. Scope

# 3.1 MVP Features

## Included

- Zotero 9 compatibility
- Right-click menu action
- DOI extraction
- OpenAlex API integration
- Citation count retrieval
- Extra field persistence
- Custom sortable column
- Batch updates
- Progress notification
- Error handling

---

## Excluded (Future Versions)

- Scheduled auto-update
- Citation history tracking
- Trend visualization
- Multi-source aggregation
- Google Scholar scraping
- Scopus integration
- Semantic Scholar integration
- Cloud sync service
- Recommendation system

---

# 4. Functional Requirements

# 4.1 Context Menu Integration

## Requirement

Add a context menu item when users right-click selected Zotero items.

Menu label:

text Update OpenAlex Citation Count

---

## Trigger Behavior

When clicked:

1. Get selected items
2. Extract DOI
3. Query OpenAlex
4. Save results
5. Refresh UI column
6. Show summary popup

---

# 4.2 DOI Extraction

## Source Field

Read DOI from Zotero DOI metadata field.

Example:

text 10.1038/nature12373

---

## DOI Normalization

The plugin must normalize DOI values before requests.

### Remove Prefixes

Supported cleanup:

text <https://doi.org/> <http://doi.org/> doi: DOI:

---

### Trim Spaces

Remove:

- leading spaces
- trailing spaces
- line breaks

---

### Example

Input:

text <https://doi.org/10.1038/nature12373>

Normalized:

text 10.1038/nature12373

---

# 4.3 OpenAlex API Integration

## Endpoint

text GET <https://api.openalex.org/works/https://doi.org/{doi}>

---

## Example

text GET <https://api.openalex.org/works/https://doi.org/10.1038/nature12373>

---

## Expected Response

json {   "id": "<https://openalex.org/W123456789>",   "doi": "<https://doi.org/10.1038/nature12373>",   "cited_by_count": 5321 }

---

## Required Fields

| Field | Purpose |
|---|---|
| id | OpenAlex work ID |
| cited_by_count | citation count |
| doi | validation |

---

# 4.4 Citation Storage

# Storage Strategy

Citation data must be stored in Zotero item metadata.

Use:

text Extra field

---

## Storage Format

text OpenAlex Citations: 5321 OpenAlex Updated: 2026-06-01 OpenAlex Work ID: <https://openalex.org/W123456789>

---

## Update Logic

If lines already exist:

- replace old values
- do NOT append duplicates

---

## Existing Metadata Preservation

The plugin must preserve all unrelated Extra field content.

Example:

Before:

text PMID: 123456 Impact Factor: 15.3

After:

text PMID: 123456 Impact Factor: 15.3 OpenAlex Citations: 5321 OpenAlex Updated: 2026-06-01 OpenAlex Work ID: <https://openalex.org/W123456789>

---

# 4.5 Custom Column

# Requirement

The plugin must create a custom Zotero item-tree column.

---

## Column Name

text OpenAlex Citations

---

## Column Key

ts openalexCitations

---

## Column Behavior

| Feature | Requirement |
|---|---|
| Visible | Yes |
| Sortable | Yes |
| Refreshable | Yes |
| Editable | No |
| Empty state | blank |
| Data source | Extra field |

---

## Display Logic

Display only integer citation count.

Example:

text 5321

NOT:

text OpenAlex Citations: 5321

---

## Official API

Use:

ts Zotero.ItemTreeManager.registerColumn()

---

## Example Implementation

ts await Zotero.ItemTreeManager.registerColumn({   dataKey: "openalexCitations",   label: "OpenAlex Citations",   pluginID: "<zotero-openalex@example.com>",    dataProvider: (item, dataKey) => {     const extra = item.getField("extra") || "";      const match = extra.match(       /OpenAlex Citations:\s*(\d+)/     );      return match ? Number(match[1]) : "";   } });

---

# 4.6 Batch Processing

## Requirement

Support updating multiple selected items simultaneously.

---

## Workflow

For each selected item:

1. Read DOI
2. Validate DOI
3. Query OpenAlex
4. Save metadata
5. Continue to next item

---

## Failure Isolation

A single failed item must NOT stop the batch.

---

# 4.7 Progress Notification

## During Processing

Display progress popup or progress window.

Example:

text Updating citations... 12 / 57 completed

---

## Final Summary

Example:

text Update Complete  Updated: 48 Skipped: 6 Failed: 3

---

# 5. Error Handling

# 5.1 Missing DOI

## Behavior

Skip item.

---

## Reason

text No DOI

---

# 5.2 Invalid DOI

## Behavior

Skip item.

---

## Reason

text Invalid DOI format

---

# 5.3 OpenAlex Not Found

## Behavior

Skip item.

---

## Reason

text DOI not found in OpenAlex

---

# 5.4 Network Error

## Behavior

Retry once.

If retry fails:

- skip item
- continue batch

---

# 5.5 API Rate Limit

## Strategy

Use:

text Sequential requests

NOT:

text massive parallel requests

---

## Optional Delay

ts await sleep(100)

between requests.

---

# 6. Technical Architecture

# 6.1 Tech Stack

| Component | Technology |
|---|---|
| Language | TypeScript |
| Runtime | Zotero Plugin API |
| Packaging | XPI |
| Build Tool | Vite / esbuild |
| HTTP | fetch |
| UI | Zotero native APIs |

---

# 6.2 File Structure

text zotero-openalex-citations/ │ ├── manifest.json ├── bootstrap.js ├── package.json ├── tsconfig.json │ ├── src/ │   ├── main.ts │   ├── openalex.ts │   ├── zotero.ts │   ├── extraField.ts │   ├── column.ts │   ├── menu.ts │   ├── batch.ts │   ├── notifications.ts │   └── utils.ts │ └── README.md

---

# 6.3 Core Modules

# openalex.ts

Responsibilities:

- API requests
- DOI lookup
- response parsing

---

# extraField.ts

Responsibilities:

- parse Extra field
- insert/update citation lines
- preserve unrelated metadata

---

# column.ts

Responsibilities:

- register custom column
- provide sortable citation values
- refresh UI

---

# batch.ts

Responsibilities:

- iterate selected items
- execute update workflow
- aggregate results

---

# menu.ts

Responsibilities:

- register right-click menu
- bind update action

---

# 7. Data Flow

text User selects papers         ↓ Right click         ↓ Update OpenAlex Citation Count         ↓ Read DOI         ↓ Normalize DOI         ↓ Query OpenAlex         ↓ Extract cited_by_count         ↓ Write Extra field         ↓ Refresh column         ↓ Show summary

---

# 8. Performance Requirements

| Metric | Target |
|---|---|
| Single paper update | < 1s |
| 100 paper batch | < 2 min |
| UI freeze | none |
| Memory overhead | minimal |

---

# 9. Compatibility Requirements

# Supported

| Platform | Status |
|---|---|
| Zotero 9 | required |
| macOS | required |
| Windows | optional |
| Linux | optional |

---

# Unsupported

- Zotero 6
- Zotero mobile

---

# 10. Security & Privacy

# Requirements

- No user account
- No telemetry
- No analytics
- No cloud storage
- No API key required

---

# Network Scope

Only allow requests to:

text <https://api.openalex.org>

---

# 11. Future Roadmap

# V1.1

- Auto-update selected collections
- Toolbar button
- Better progress UI

---

# V1.2

- Citation trend history
- Last-update filtering
- Export citation table

---

# V2.0

- Multi-source citation aggregation
- Semantic Scholar support
- Crossref support
- Scopus support
- Web of Science support

---

# 12. Acceptance Criteria

# Installation

- .xpi installs successfully in Zotero 9

---

# Column

- Custom column appears in item table

---

# Update

- Citation counts successfully retrieved

---

# Persistence

- Citation data saved in Extra field

---

# Sorting

- Column sortable numerically

---

# Stability

- Batch failures do not crash Zotero

---

# UX

- User receives completion summary

---

# 13. Example Workflow

## Before Update

| Title | DOI | OpenAlex Citations |
|---|---|---|
| Paper A | valid | empty |
| Paper B | missing | empty |

---

## After Update

| Title | DOI | OpenAlex Citations |
|---|---|---|
| Paper A | valid | 5321 |
| Paper B | missing | empty |

---

## Extra Field Example

text OpenAlex Citations: 5321 OpenAlex Updated: 2026-06-01 OpenAlex Work ID: <https://openalex.org/W123456789>

---

# 14. Recommended Development Order

## Phase 1

- Plugin scaffold
- Menu integration

---

## Phase 2

- DOI extraction
- OpenAlex requests

---

## Phase 3

- Extra field writing

---

## Phase 4

- Custom column

---

## Phase 5

- Batch processing

---

## Phase 6

- Error handling
- polish
- packaging

---

# 15. Recommended Open Source License

Recommended:

text MIT License

Reason:

- simple
- permissive
- compatible with Zotero ecosystem
