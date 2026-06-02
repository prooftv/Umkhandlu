# Studio Editor Guide — Campaigns & Verification

This short guide explains how editors should add certified deliverables and verification records in Sanity Studio.

## Add certified deliverable to a Campaign

1. Open the Campaign document in Sanity Studio.
2. Scroll to the `deliverablesCertified` field (Deliverables section).
3. Click `Add item` and fill fields:
   - `task` (text): e.g. "Rehabilitate 2km road"
   - `status` (select): choose `pending`, `certified`, or `disputed`
   - `certifiedBy` (text): e.g. "PMU - J. Doe"
   - `certificationDate` (date): required if `status` is `certified` (Studio validator enforces this)
   - `notes` (text): optional notes

Copyable example (for reference):

{
  "task": "Rehabilitate 2km road",
  "status": "certified",
  "certifiedBy": "PMU - J. Doe",
  "certificationDate": "2026-05-12",
  "notes": "Inspected and signed off."
}

## Create a verification record (`conflictLog`)

1. In Studio, Create → Conflict Log (or equivalent collection).
2. Fill the fields:
   - `field`: which campaign field the verification concerns (e.g., "totalDeliverables")
   - `displayTruth`: short summary of verified truth (e.g., "10 deliverables completed and certified")
   - `resolutionState`: `pending` | `partial` | `resolved` | `escalated`
   - `detectedAt`: date when record was created
   - `resolvedAt`: optional
   - `claims`: add one or more claim entries with `source`, `value`, `date`, `evidence` (file/URL)

Example claim array:

[
  { "source": "Contractor report", "value": "12", "date": "2026-05-09", "evidence": "photo-001.jpg" },
  { "source": "PMU inspection", "value": "10", "date": "2026-05-11", "evidence": "inspection-report.pdf" }
]

## Notes & Best Practices

- Always add a `certificationDate` for `certified` items.
- Use `conflictLog` to preserve source traceability — include original evidence files when possible.
- The frontend prefers `deliverablesCertified` and will display certification metadata along with verification records.
- If you need help, refer to `docs/CAMPAIGN_SPEC.md` for full schema and implementation details.

***
Generated: 2026-06-02
