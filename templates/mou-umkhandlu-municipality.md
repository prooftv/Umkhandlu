# MEMORANDUM OF UNDERSTANDING (MOU)

## Umkhandlu — The Missing Digital Operating System Between Traditional Authority and Modern Coordination

### Between Newcastle Local Municipality and Unami Foundation

---

**Date:** ___________________
**Reference:** MOU/COM/2026/___

---

## 1. PARTIES

**Party A:** Newcastle Local Municipality
Represented by: ___________________
Position: ___________________

**Party B:** Unami Foundation
Represented by: Bhekithemba Simelane
Position: Platform Architect & Operator

---

## 2. PURPOSE

This Memorandum of Understanding establishes a framework for the deployment and operation of **Umkhandlu** — the missing digital operating system between traditional authority and modern coordination — as the official governance, transparency, and public participation layer for municipal infrastructure projects within traditional authority areas under Newcastle Municipality's jurisdiction.

---

## 3. BACKGROUND

Newcastle Municipality implements infrastructure projects (water, roads, sanitation, electrification) in areas governed by traditional councils. These projects require:

- Community transparency on progress, employment, and deliverables
- Public participation and feedback mechanisms
- Statutory notice publication (EIA, SPLUMA, public comment periods)
- Audit-ready evidence of community engagement
- Traditional council coordination and oversight visibility

The Unami Foundation has developed **Umkhandlu** — the missing digital operating system between traditional authority and modern coordination. The platform provides community-scale institutional memory: managing the public record surrounding projects, participation, governance, opportunity, and compliance. The platform is currently piloting on the Buffalo River Abstraction Works (Ward 7) in coordination with the Khathide Traditional Council area.

**Live platform:** umkhandlu.vercel.app

---

## 4. WHAT UMKHANDLU PROVIDES

| Capability | Description |
|---|---|
| Infrastructure Project Information Board | DPWI/CIDB format — employer, funding, contractor, phase, EPWP targets |
| Milestone-Based Progress Tracking | Engineer-certified deliverables — auditable, not self-reported |
| Community Notices | Hiring phases, SMME opportunities, project updates — timestamped, attributed |
| SMME Directory | Local subcontractor profiles with compliance data (CIPC, tax, B-BBEE) |
| Public Participation | Structured comment/objection forms — POPIA compliant |
| Statutory Notice Publication | EIA, SPLUMA, estate notices with proof of publication certificates |
| Evidence Preservation | Verification records when sources disagree — full audit trail |
| Community Map | Interactive map of infrastructure, schools, clinics, businesses |
| Data Export API | Authenticated JSON export for PMU reporting |
| Print/PDF | All pages print-optimized for physical filing |

---

## 5. WHAT UNAMI FOUNDATION EXPECTS

### 5.1 Recognition

- The Municipality recognises Umkhandlu as an official community engagement channel for infrastructure projects in traditional authority areas
- The Municipality provides a letter of support or endorsement that the Unami Foundation can present to traditional councils during onboarding

### 5.2 Data Cooperation

- PMU and project teams provide public-facing project information to the platform operator:
  - Project name, employer, funding source, phase
  - EPWP employment targets and confirmed numbers
  - Milestone completions (as certified by engineer)
  - Media statements and public announcements
- This is information that is already public — no confidential or budget data required

### 5.3 Pilot Support

- The Municipality supports the Buffalo River Abstraction Works as the first pilot project
- The Municipality facilitates introductions to relevant PMU contacts and CLOs
- The Municipality provides feedback on reporting alignment (what format they need for SDBIP/PMS)

### 5.4 Traditional Council Coordination

- The Municipality acknowledges that the platform operates under traditional council mandate in each deployment area
- The Municipality does not require the platform to bypass or override traditional authority structures
- Joint engagement with the Khathide Traditional Council is facilitated for the pilot

### 5.5 Commercial Arrangement

- Infrastructure documentation and community engagement services are billable under the municipality's existing communication/PMU reporting budget
- Pricing aligned with industry benchmarks (see rate card):
  - Tier 2: Active Monitoring & Community Engagement — R1,500–R3,000/month
  - Tier 3: Full Infrastructure Documentation Package — R12,000–R18,000 per project
  - Statutory notices: R650–R1,200 per notice (paid by applicant, not municipality)
- Revenue from external parties (developers, attorneys, businesses) flows to Unami Foundation independently
- Specific pricing per project to be agreed in a Service Level Agreement (SLA)

---

## 6. WHAT THE MUNICIPALITY RECEIVES

| Benefit | Detail |
|---|---|
| Community transparency | Residents see project progress without querying the municipality |
| Reduced community conflict | Employment information published proactively — prevents misinformation |
| Public participation compliance | Structured comment capture with proof of publication certificates |
| Traditional council alignment | Platform operates under council mandate — council is the partner, not the obstacle |
| Audit-ready evidence | Timestamped publication records, milestone verification, participation logs |
| Cost saving | Replaces print media notices (R6,000–R12,000 per ad) with permanent digital publication |
| SDBIP/PMS support | Data export API provides structured project data for reporting |

### 6.1 Data Sharing & API Endpoints

The platform provides authenticated API access for any authorised stakeholder (PMU, auditors, partners):

| Endpoint | Purpose |
|---|---|
| `GET /api/campaigns/export?token=<TOKEN>` | Full project data export (JSON) |
| `GET /api/campaigns/export?token=<TOKEN>&status=active` | Filter by project status |
| `GET /api/campaigns/export?token=<TOKEN>&type=csr` | Filter by project type |

**Export includes:**
- Project metadata (title, phase, funding source, contractor, engineer)
- Certified deliverables with progress percentage
- SMME directory (names, compliance status, B-BBEE, CIPC)
- Employment numbers (beneficiaries, local SMMEs count)
- Community notices issued (timestamped, attributed)
- Participation log (comment count, types, actions taken)
- Verification records (variances documented, resolution status)
- Progress log (timestamped technical updates)

**Access:** Token-authenticated. Municipality and PMU receive read access tokens. Data is shareable with any interested party (auditors, sponsors, oversight bodies) at the municipality's discretion.

**Public pages (no authentication required):**

| Route | Content |
|---|---|
| `/campaigns/[slug]` | Live project page — info board, deliverables, notices, SMMEs |
| `/development-notices/[slug]` | Statutory notice + public comment form |
| `/notices/certificate/[id]` | Proof of publication certificate (printable) |
| `/records/[slug]` | Governance record detail |
| `/areas/[slug]` | Community digital twin — all content for an area |
| `/presentation` | Institutional overview of the platform |
| `/api/campaigns/export` | Authenticated data export |

---

## 7. PILOT PROJECT

**Project:** Buffalo River Abstraction Works — Ward 7 Water Infrastructure
**Funder:** WSIG (Water Services Infrastructure Grant)
**Traditional Area:** Mndozo (Khathide Traditional Council)
**Status:** Active — platform already live and documenting

**Pilot Objectives:**
1. Demonstrate community engagement through digital platform
2. Test data flow from PMU → operator → public page
3. Capture community feedback and demonstrate audit trail
4. Issue proof of publication for any statutory notices
5. Produce monthly summary export for PMU reporting alignment
6. Coordinate with Khathide Traditional Council for formal endorsement

**Pilot Duration:** 6 months from date of signature

---

## 8. TRADITIONAL COUNCIL ENGAGEMENT

The Unami Foundation is in the process of engaging the Khathide Traditional Council for formal platform adoption. This MOU supports that engagement by:

- Providing municipal recognition that strengthens the council's confidence
- Demonstrating that the municipality supports (not opposes) the platform
- Creating a three-way coordination framework: Municipality ↔ Unami ↔ Traditional Council

**Note:** The traditional council has not yet formally endorsed the platform. The pilot period includes securing this endorsement. Municipal support materially assists this process.

---

## 9. DATA PROTECTION (POPIA)

- The platform does not store personal data of community members
- Public participation comments are delivered to the operator via webhook only
- The CMS stores anonymised participation summaries (type, date, action taken)
- No personal data is shared between municipal systems and the platform without consent
- The platform operator (Unami Foundation) is responsible for POPIA compliance on the external layer

---

## 10. INTELLECTUAL PROPERTY

| Asset | Ownership |
|---|---|
| Umkhandlu platform (codebase) | Unami Foundation |
| Community content (notices, records, project data) | Traditional Council + Municipality (as applicable) |
| Statutory notice content | Applicant (published via platform) |

The platform codebase remains the intellectual property of the Unami Foundation. Community data published on the platform is jointly owned by the traditional council and the municipality as applicable to each document type.

---

## 11. DURATION AND REVIEW

- Effective from date of signature
- Initial pilot period: 6 months
- Full MOU period: 12 months (renewable)
- Quarterly review meetings between both parties
- Either party may terminate with 30 days written notice
- All community data remains accessible to the traditional council regardless of MOU status

---

## 12. NOT A PROCUREMENT CONTRACT

This MOU:
- Establishes a collaborative framework, not a procurement relationship
- Does not commit the municipality to expenditure
- Does not replace formal procurement processes where services are invoiced
- Any paid services (infrastructure documentation, ITPMS collaboration) will be governed by separate agreements

---

## 13. SIGNATORIES

| Role | Name | Signature | Date |
|---|---|---|---|
| Municipal Representative (Party A) | ___________________ | ___________________ | ___________ |
| ICT Representative (Party A) | ___________________ | ___________________ | ___________ |
| Platform Architect (Party B) | Bhekithemba Simelane | ___________________ | ___________ |

---

## ANNEXURES

- **Annexure A:** Umkhandlu Platform Presentation (/presentation page printout)
- **Annexure B:** Buffalo River Abstraction Works — Live Project Page (printout)
- **Annexure C:** Khathide Traditional Council Resolution (pending — to be attached upon endorsement)
- **Annexure D:** Data Export API Sample Output

---

*This Memorandum of Understanding establishes intent and framework. It does not constitute a binding legal contract or procurement commitment.*
