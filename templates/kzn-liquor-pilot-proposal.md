# PILOT PROPOSAL

## Ward 7 Liquor Licensing Community Consultation Pilot

### KZN Liquor Authority × Umkhandlu (Unami Foundation)

---

**Date:** ___________________
**Reference:** PP/KZNLA/W7/2026/___

---

## 1. Pilot Summary

| Field | Detail |
|---|---|
| Title | Community Consultation Intelligence Pilot — Rural Liquor Licensing |
| Geography | Ward 7, Newcastle Municipality (Mndozo, North Osizweni, Manzana, Dicks) |
| Traditional Authority | Khathide Traditional Council |
| Scope | New liquor licence applications within the pilot area |
| Duration | 6 months from signature |
| Cost to Authority | Zero (Unami Foundation absorbs all operational costs) |
| Objective | Demonstrate that structured community consultation improves licensing decision quality |

---

## 2. Problem This Pilot Addresses

In the pilot area, existing liquor licensing processes face:

1. **No systematic community notification** — residents and traditional council are not reliably informed of pending applications
2. **No structured objection mechanism** — concerns are expressed verbally or not at all
3. **No spatial verification** — proximity to schools, churches, and crèches cannot be confirmed without field visits
4. **No consultation evidence** — the Authority's file contains no proof that community participation occurred
5. **Traditional council consent uncertainty** — applicants may bypass the council or present unverified letters

---

## 3. What the Pilot Delivers

### Per Application (3–5 expected during pilot period)

| Deliverable | Description | Format |
|---|---|---|
| Community Notice Page | Public-facing notice with applicant details, site description, map pin, comment deadline | Live web page |
| Spatial Context Map | Application site plotted with 500m radius — showing schools, churches, crèches, existing outlets within buffer | Map screenshot + data |
| Public Comment Capture | Structured form (name, contact, relationship to site, type: objection/support/comment/question) | Database entries |
| Traditional Council Alert | Notification to Induna with deadline and action required | WhatsApp + platform alert |
| Proof of Publication | Date-stamped certificate confirming notice was published and accessible | Printable PDF |
| Consultation Evidence Pack | Combined report: notice details + spatial context + comments received + proof of publication | PDF bundle |

### Pilot-Level Outputs (End of 6 Months)

| Deliverable | Description |
|---|---|
| Pilot Summary Report | Number of applications tracked, objections captured, spatial conflicts identified |
| Process Recommendation | Proposed standard workflow for ongoing collaboration |
| Scalability Assessment | Feasibility of extending to additional wards/districts |

---

## 4. Workflow (Simple, Manual, No Integration Required)

```
KZN Liquor Authority publishes notice (Government Gazette / local paper / website)
        ↓
Umkhandlu operator identifies application in pilot area
        ↓
developmentNotice created (type: liquor)
  - Applicant name + reference number
  - Proposed site description + GPS coordinates
  - Comment deadline (from Authority notice)
  - Supporting documents (if public)
        ↓
Community notification
  - Platform notice page goes live
  - WhatsApp alert to Induna + Council Admin
  - Deadline countdown visible
        ↓
Public comment period (21–28 days)
  - Structured form captures: name, contact, type, comment
  - All submissions timestamped
        ↓
Comment period closes
  - Form disabled automatically at deadline
  - Proof of Publication certificate generated
        ↓
Consultation Evidence Pack compiled
  - Notice details
  - Spatial context (proximity report)
  - Comments received (categorised)
  - Proof of publication
        ↓
Pack delivered to KZN Liquor Authority (email / hand-delivery)
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| Manual data flow (not API) | No system changes required at the Authority |
| Operator-initiated (not automated) | Pilot tests value before investing in automation |
| Advisory output only | Authority retains all decision-making power |
| Zero cost to Authority | Removes procurement barrier during pilot |

---

## 5. Spatial Context Methodology

The platform maintains a registry of community infrastructure (schools, clinics, churches, crèches) with GPS coordinates. When a liquor application is logged:

1. Application site coordinates entered
2. Platform maps all registered sensitive sites within 500m radius
3. Visual output: map with application pin + buffer zone + flagged facilities
4. Data output: list of facilities within buffer, with distances

**Current registry coverage (pilot area):**

| Facility Type | Status |
|---|---|
| Schools | Mapped (from listing directory) |
| Churches | Mapped (from listing directory) |
| Crèches | Partial — to be completed during pilot setup |
| Existing outlets | To be mapped from municipal/Authority records |

**Note:** The spatial analysis is advisory. It does not constitute a formal survey or legal determination. The Authority's own verification processes remain authoritative.

---

## 6. Roles & Responsibilities

| Party | Responsibility |
|---|---|
| **KZN Liquor Authority** | Publish notices as normal; receive Consultation Evidence Packs; provide feedback on output quality |
| **Unami Foundation** | Operate platform; create notices; capture comments; compile packs; deliver to Authority |
| **Khathide Traditional Council** | Mandate platform operation in area; review applications flagged by operator; submit formal objections where appropriate |
| **Community** | View notices; submit comments/objections via structured form |

---

## 7. Success Criteria

The pilot is considered successful if:

| Criterion | Measure |
|---|---|
| Applications tracked | ≥ 3 applications documented during pilot period |
| Community comments captured | ≥ 1 structured comment/objection per application |
| Spatial conflicts identified | Any proximity conflicts flagged before hearing |
| Evidence packs delivered | All tracked applications produce a consultation pack |
| Deadline compliance | Zero missed comment windows |
| Authority feedback | Positive assessment of output quality and usefulness |

---

## 8. Risk Mitigation

| Risk | Mitigation |
|---|---|
| No applications filed in pilot area during period | Extend pilot by 3 months OR include adjacent ward |
| Community does not engage with comment form | WhatsApp outreach + Induna mobilisation + physical notice |
| Authority does not use outputs | Deliver regardless; value demonstrated through evidence quality |
| Political resistance (applicant objects to notice) | All published information is already public record; platform mirrors Authority's own notice |
| Scope creep (requests for enforcement features) | Firm boundary: observe, structure, notify, document — never enforce |

---

## 9. What This Is NOT

| ❌ Not This | ✅ This Instead |
|---|---|
| Replacement for Authority's systems | Advisory intelligence layer |
| Automated decision-making | Structured human review support |
| Enforcement mechanism | Documentation and evidence |
| Anti-liquor campaign | Neutral consultation infrastructure |
| Commercial service to Authority | Zero-cost pilot (sustainability model defined post-pilot) |
| Binding agreement | Collaborative framework |

---

## 10. Post-Pilot Sustainability

If the pilot demonstrates value, a sustainable model would involve:

| Option | Description | Cost |
|---|---|---|
| A — Applicant-funded | Applicants pay notice hosting fee (R1,500–R2,000) as part of application costs | Zero to Authority |
| B — Authority subscription | Monthly intelligence subscription for pilot area | R1,500–R3,000/month |
| C — Expanded geography | Scale to additional wards with blended funding | Per-ward pricing |

The preferred model is **Option A** — applicant-funded. This aligns with existing practice where applicants pay for notice publication in print media. Digital publication via Umkhandlu replaces or supplements that requirement at lower cost with better evidence.

---

## 11. Existing Platform Credentials

| Credential | Detail |
|---|---|
| Live deployment | Buffalo River Abstraction Works (Ward 7, Newcastle Municipality) |
| Traditional council mandate | Khathide Traditional Council (pending formal resolution) |
| Municipal engagement | Newcastle Municipality ICT Department MOU (in process) |
| Statutory notice types | 8 types supported (EIA, SPLUMA, mining, cell tower, estate, liquidation, PTO, liquor) |
| Proof of Publication | Printable certificates with date-stamp and unique ID |
| Public comment system | POPIA-compliant structured capture (name, type, relationship, comment) |
| Spatial mapping | Interactive community map (Leaflet/OpenStreetMap, filterable by type) |

---

## 12. Signatories (If MOU Required)

| Role | Name | Signature | Date |
|---|---|---|---|
| KZN Liquor Authority Representative | ___________________ | ___________________ | ___________ |
| Unami Foundation — Platform Operator | Bhekithemba Simelane | ___________________ | ___________ |
| Khathide Traditional Council — Induna | ___________________ | ___________________ | ___________ |

---

## 13. Contact

**Unami Foundation**
Bhekithemba Simelane — Platform Architect & Operator

**Platform:** umkhandlu.vercel.app

---

*This pilot proposal establishes a collaborative framework. It does not constitute a binding legal contract or procurement commitment.*
