# CONCEPT NOTE

## Community Consultation Infrastructure for Rural Liquor Licensing Decisions

### Submitted to: KZN Liquor Authority
### Submitted by: Unami Foundation (Platform Operator — Umkhandlu)

---

**Date:** ___________________
**Reference:** CN/KZNLA/2026/___

---

## 1. Problem Statement

Rural liquor licence applications in areas governed by traditional councils present three systemic challenges for the KZN Liquor Authority:

### A. Weak Site Verification

Applications from informal settlements and traditional authority areas lack precise addressing. GPS coordinates are unreliable without local spatial context. The Authority cannot physically verify every proposed site against proximity restrictions (schools, churches, crèches within 500m) without field capacity that does not exist at scale.

### B. Consultation Gaps

The public participation process depends on community stakeholders seeing, understanding, and responding to provincial notices within statutory deadlines (21–28 days). In rural areas north of Osizweni and around Mndozo Farm:

- Notices are published in media channels communities do not access
- Traditional councils are not systematically informed
- Objections arrive late, unstructured, or undocumented
- The Authority receives no structured community input — only silence or ad-hoc complaints

### C. Legal Defensibility Risk

When licensing decisions are challenged, the Authority must demonstrate that adequate public participation occurred. Without structured evidence of community notification and response, decisions are vulnerable to review — particularly in areas where traditional authority consent is a prerequisite.

---

## 2. Proposed Solution

### Community Consultation Evidence Layer

The Unami Foundation operates **Umkhandlu** — a community-scale governance platform deployed under traditional council mandate. The platform already manages statutory notice publication, public comment capture, and proof of publication certificates for EIA, SPLUMA, and land transfer processes.

We propose extending the same proven infrastructure to support the KZN Liquor Authority's public participation requirements in traditional authority areas.

### What This Is

A **consultation evidence layer** that sits between the provincial licensing process and the rural community — ensuring that:

1. Communities are systematically notified of applications affecting their area
2. Traditional councils receive structured alerts with deadline information
3. Community responses (objections, support, comments) are captured in auditable format
4. Spatial context is provided (proximity to schools, churches, existing outlets)
5. The Authority receives a structured consultation pack — not silence

### What This Is NOT

- Not a replacement for the KZN Liquor Authority's licensing system
- Not an approval or rejection mechanism
- Not an enforcement tool
- Not a competing authority
- Not a technology integration requiring system changes at the Authority

---

## 3. How It Works (Existing Capability)

The platform already supports the `liquor` notice type as a `developmentNotice` document. The following workflow requires no new system development:

| Step | Action | Output |
|---|---|---|
| 1 | Liquor application received (manual notification or public notice) | Notice logged in system |
| 2 | Operator creates `developmentNotice` (type: liquor) | Public notice page live |
| 3 | GPS coordinates plotted on community map | Spatial context visible |
| 4 | Community notified (platform + WhatsApp) | Traditional council alerted |
| 5 | Public comment form opens (structured: comment/objection/support/question) | Participation captured |
| 6 | Deadline tracked (countdown visible) | No missed windows |
| 7 | Comment period closes | Submissions compiled |
| 8 | Proof of Publication certificate generated | Evidence preserved |
| 9 | Structured Consultation Pack exported | Delivered to Authority |

### Outputs for the Authority

| Deliverable | Format |
|---|---|
| Proof of Publication Certificate | Printable PDF (date-stamped, legally defensible) |
| Structured Objection Summary | Categorised by type (objection/support/comment/question) |
| Spatial Context Report | Map with application site + 500m radius overlay (schools, churches, existing outlets) |
| Consultation Evidence Pack | Combined PDF for file attachment |

---

## 4. Stakeholder Positioning

| Actor | Role | System Relationship |
|---|---|---|
| KZN Liquor Authority | Decision authority | Receives advisory outputs (read-only) |
| Traditional Council (Umkhandlu) | Local legitimacy + verification | Mandates platform operation |
| Municipality | Planning authority | Provides spatial reference data |
| Community | Input source | Submits comments/objections |
| Applicant | Notice subject | Application details published |
| Unami Foundation | Platform operator | Neutral documentation layer |

### Critical Boundary

> Umkhandlu does NOT approve or reject liquor licence applications. The platform documents, structures, contextualises, and surfaces risk. The Authority retains full decision-making power.

---

## 5. Value to the Authority

| Authority Challenge | Platform Contribution |
|---|---|
| Cannot verify every rural site | Geo-located application with proximity context |
| Community objections arrive late or unstructured | Structured capture with deadline enforcement |
| Consultation evidence is weak in rural areas | Proof of publication + timestamped participation log |
| Traditional council consent difficult to verify | Platform operates under council mandate — council sees every application |
| Decisions challenged for inadequate participation | Structured evidence pack for legal defensibility |

---

## 6. Pilot Scope (Proposed)

| Parameter | Detail |
|---|---|
| Geography | Ward 7, Newcastle — Mndozo / North Osizweni traditional authority area |
| Traditional Council | Khathide Traditional Council |
| Application type | New liquor licence applications only |
| Duration | 6 months |
| Data flow | Manual (Authority publishes notice → Operator logs → Community responds) |
| Cost to Authority | None during pilot |
| Deliverable | 3–5 structured Consultation Evidence Packs |

---

## 7. About Umkhandlu

Umkhandlu is a community-scale institutional memory platform — the missing operating system between traditional authority and modern coordination. Currently piloted on the Buffalo River Abstraction Works (Ward 7, Newcastle Municipality) under Khathide Traditional Council mandate.

**Existing statutory notice types supported:**
- Environmental Impact Assessment (NEMA)
- Rezoning / SPLUMA
- Mining / Excavation (MPRDA)
- Cell Tower (NEMA + by-laws)
- Deceased Estates (Insolvency Act)
- Liquidation / Insolvency
- PTO / Land Transfer
- **Liquor Licence (Liquor Act)**

**Live platform:** umkhandlu.vercel.app

---

## 8. Next Steps

| Step | Action | Party |
|---|---|---|
| 1 | Introductory meeting (non-technical) | Unami → KZNLA |
| 2 | Authority confirms interest in pilot | KZNLA |
| 3 | Pilot MOU drafted (lightweight, non-binding) | Joint |
| 4 | First application logged and tracked | Unami |
| 5 | First Consultation Evidence Pack delivered | Unami → KZNLA |
| 6 | Pilot review (3 months) | Joint |

---

## 9. Contact

**Unami Foundation**
Bhekithemba Simelane — Platform Architect & Operator

---

*This concept note establishes intent for collaboration. It does not constitute a binding agreement or procurement commitment.*
