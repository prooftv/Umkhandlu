# Campaign Spec — Umkhandlu

This document describes the Campaign data model, Studio editor expectations, frontend contract, query fragments, and export fields introduced in the recent updates (certified deliverables + verification surfacing).

## 1. Purpose

- Make certified deliverables explicit in the Campaign document so public pages can distinguish verified completion from claims.
- Surface verification / TCRS records (`conflictLog`) on campaign pages to increase traceability and public accountability.

## 2. Sanity schema (Campaign)

- Field: `deliverablesCertified` (array of objects)
  - Type: array of objects
  - Object fields:
    - `task` (string) — short, human-friendly description of the deliverable (required)
    - `status` (string enum) — `pending` | `certified` | `disputed` (required)
    - `percentageComplete` (number, 0–100) — engineer-verified completion percentage for this specific deliverable. Allows concurrent tracking of overlapping phases. Default 0.
    - `weightage` (number, 0–100) — optional relative weight of this deliverable in the overall project scope. If any item has weightage, the master progress bar uses weighted average; otherwise flat average.
    - `certifiedBy` (string) — verifier name or unit (optional; recommended when certified)
    - `certificationDate` (date) — required when `status === 'certified'` (validator enforced)
    - `notes` (text) — optional contextual notes

- Validation:
  - custom validator ensures that when `status` is `certified`, `certificationDate` must be present.

- Preview (Studio list view): show count of certified items in the campaign list and surface a short badge if any certified items exist.

## 3. Verification records (`conflictLog`)

- Existing document used to record conflicting claims and verified truths.
- Fields surfaced on campaign pages include:
  - `_id`, `field`, `displayTruth`, `resolutionState`, `detectedAt`, `resolvedAt`, `claims[]` (each claim: `source`, `value`, `date`, `evidence`).

## 4. GROQ fragment contract

The `campaignFragment` includes (relevant subset):

- `deliverablesCertified[] { _key, task, status, percentageComplete, weightage, certifiedBy, certificationDate, notes }`
- `verificationRecords` synthetic field (server side fragment):
  - query: `*[_type == "conflictLog" && references(^._id)] | order(detectedAt desc)[0...5] { _id, field, displayTruth, resolutionState, detectedAt, resolvedAt, claims }`

Consumers should assume these fields may be undefined or empty arrays.

## 5. Frontend contract

- Types (TS):
  - `CertifiedDeliverable` { _key: string; task: string; status: 'pending'|'certified'|'disputed'; percentageComplete?: number; weightage?: number; certifiedBy?: string; certificationDate?: string; notes?: string }
  - `VerificationRecord` { _id: string; field: string; displayTruth?: string; resolutionState: 'pending'|'partial'|'resolved'|'escalated'; detectedAt: string; resolvedAt?: string; claims?: { source: string; value: string; date?: string; evidence?: string }[] }

- Components:
  - `DeliverablesList` (src/components/modules/DeliverablesList.tsx)
    - Props: `deliverables?: string[]`, `deliverablesCertified?: CertifiedDeliverable[]`, `total?: number | null`
    - Renders overall progress bar (weighted or simple average of per-item `percentageComplete`), and individual deliverable rows each with their own progress bar, status pill, and verifier info. Falls back to milestone count if no `percentageComplete` data exists.
  - `VerificationRecords` (src/components/modules/VerificationRecords.tsx)
    - Props: `records: VerificationRecord[]`
    - Renders a compact list of verification records and claims.

## 6. API/export

- `src/app/api/campaigns/export/route.ts` updated to include `deliverablesCertified`, `projectPhase`, and compute `deliverableProgress` by coalescing certified items with plain deliverables.
- The export route also provides campaign-level compliance summary counts: `noticeCount`, `opportunityCount`, `developmentNoticeCount`, `verificationCount`, `communityNoteCount`, and `photoCount`.
- This endpoint is campaign-focused. Detailed evidence records remain stored in `conflictLog` documents and are surfaced on the campaign page via `verificationRecords`.

- The export also includes short lists of `relatedOpportunities` and `relatedDevelopmentNotices` (limited to the first 10 items) with minimal metadata for compliance reporting. Detailed opportunity and notice content should be fetched from the respective endpoints if needed.
- The export also includes redacted verification summaries in `verifications` (up to 10), containing `field`, `displayTruth`, `resolutionState`, `detectedAt`, `resolvedAt`, a truncated `resolutionNote` (first 200 chars) and `claims[].evidenceSummary` (first 200 chars) to aid compliance reviews without exposing PII.

## 7. Related project content

- `relatedOpportunities` and `relatedDevelopmentNotices` are synthetic relationships that resolve from `opportunity` and `developmentNotice` documents referencing the campaign.

## 7. Studio editor guidance (copyable)

- Add a `deliverablesCertified` entry:

  Example JSON for one item (Studio field editor):

  {
    "task": "Rehabilitate 2km road",
    "status": "certified",
    "certifiedBy": "PMU - J. Doe",
    "certificationDate": "2026-05-12",
    "notes": "Inspected and signed off."
  }

- Create a `conflictLog` document when surfacing evidence or resolving disputes. Include `claims[]` entries to retain source traceability.

## 8. Testing & verification

- Run `npx biome check` and `npm run typecheck` — components and schema validator must pass lint and types.
- Manual verification (Studio):
  1. Open a Campaign document.
  2. Add a `deliverablesCertified` item with `status=certified` and ensure Studio validation requires `certificationDate`.
  3. Create a `conflictLog` referencing the campaign and observe it appearing in the campaign page frontend when published.

## 9. Migration notes

- Existing `deliverables` (string array) remain supported as fallback.
- Editors should migrate verified deliverables into `deliverablesCertified` objects to benefit from certification metadata.

## 10. Implementation notes

- The frontend now prefers `deliverablesCertified` when present; otherwise it falls back to `deliverables`.
- Keep the `certificationDate` format ISO (YYYY-MM-DD) for portability and consistent parsing.

---
Generated on: 2026-06-02
