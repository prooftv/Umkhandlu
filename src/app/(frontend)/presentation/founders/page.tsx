import type { Metadata } from 'next';
import Link from 'next/link';
import CollapsibleChapter from '@/components/modules/CollapsibleChapter';
import SectionNarrator from '@/components/modules/SectionNarrator';

export const metadata: Metadata = {
  title: 'Unami Foundation — Founders Briefing',
  description:
    'The Amajuba District deployment model: who we are, who pays, who benefits, and how the shared infrastructure model works across Traditional Councils, municipalities, and commercial stakeholders.',
  robots: { index: false },
};

export default function FoundersPresentation() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <header className="mb-16 text-center" id="founders-hero">
        <p className="text-sm font-bold text-primary uppercase tracking-wide mb-4">
          Founders Briefing — Confidential
        </p>
        <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
          Unami Foundation
          <br />
          Amajuba District Deployment
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Who we are. Who pays. Who benefits. How the model works across
          Traditional Councils, municipalities, mines, contractors, and
          commercial stakeholders — and why it is replicable across every
          district in South Africa.
        </p>
        <SectionNarrator sectionId="founders-hero" />
      </header>

      {/* Chapter 1 — What Unami Foundation Is */}
      <CollapsibleChapter
        number="1"
        title="What Unami Foundation Is"
        defaultOpen
      >
        <p>
          Unami Foundation is a registered NPO and NPC — a non-profit company
          with a public benefit mandate. This is the social enterprise model: we
          generate sustainable revenue from institutions and commercial
          stakeholders who can pay, and use that revenue to serve communities
          who cannot.
        </p>
        <Blockquote>
          We are not a charity that depends on donations. We are not a
          commercial company that optimises for profit. We are a social
          enterprise that builds digital infrastructure for communities — and
          charges the institutions and commercial parties that benefit from that
          infrastructure.
        </Blockquote>
        <p>The NPO/NPC structure matters for three reasons:</p>
        <div className="grid md:grid-cols-3 gap-4 my-6">
          <InfoCard
            title="Public Benefit Mandate"
            items={[
              'Surplus revenue is reinvested into platform development',
              'Community access is never dependent on ability to pay',
              'Data belongs to the institution — not to us',
            ]}
          />
          <InfoCard
            title="Legal Standing"
            items={[
              'Can enter contracts with municipalities and government',
              'Can employ staff and operate commercially',
              'Can receive grants and donor funding',
            ]}
          />
          <InfoCard
            title="Institutional Trust"
            items={[
              'Traditional Councils trust an NPO over a commercial vendor',
              'COGTA engages NPOs differently than commercial companies',
              'Communities retain sovereignty — we are a partner, not an owner',
            ]}
          />
        </div>
        <p className="text-sm text-gray-500">
          The Technology for Good programme contains three operating
          partnerships: Unami Schools, Unami Sports, and Umkhandlu. Each is a
          distinct operating model. Umkhandlu is the governance infrastructure
          partnership — the most commercially significant of the three.
        </p>
      </CollapsibleChapter>

      {/* Chapter 2 — The Self-Determination Philosophy */}
      <CollapsibleChapter number="2" title="The Self-Determination Philosophy">
        <Blockquote>
          Umkhandlu is not a portal built for the state to monitor the
          community. It is a sovereign digital operating system built for the
          community to verify the state.
        </Blockquote>
        <p>
          The dominant model of digital governance tools is extractive: a vendor
          builds a platform, institutions pay forever, the vendor owns the data,
          and the community is dependent on the vendor&apos;s continued
          existence and goodwill.
        </p>
        <p>
          Unami Foundation rejects this model. Three principles are
          non-negotiable:
        </p>
        <div className="grid md:grid-cols-3 gap-4 my-6">
          <InfoCard
            title="Data Sovereignty"
            items={[
              'Every institution owns its own data',
              'We never aggregate, sell, or retain data beyond what is needed to operate',
              'If we cease to exist, the institution keeps its records',
            ]}
          />
          <InfoCard
            title="Operational Independence"
            items={[
              'Platforms are built so institutions can operate them without us',
              'We train, we document, we hand over',
              'The council retains full governance authority over all published content',
            ]}
          />
          <InfoCard
            title="Community Governance"
            items={[
              'The platform serves the governance structure of the community',
              'It does not impose a governance structure on them',
              'We record, preserve, organise, and present — we never decide',
            ]}
          />
        </div>
        <p className="text-sm text-gray-500">
          This is not idealism. It is the commercial model. Institutions that
          retain sovereignty over their data are more likely to adopt the
          platform, more likely to pay for it, and more likely to recommend it
          to neighbouring councils.
        </p>
      </CollapsibleChapter>

      {/* Chapter 3 — The Amajuba District Opportunity */}
      <CollapsibleChapter number="3" title="The Amajuba District Opportunity">
        <p>
          Amajuba District Municipality covers three local municipalities —
          Newcastle, Emadlangeni, and eMadlangeni — and a significant number of
          Traditional Councils across Ward 7 and surrounding areas. The district
          is the deployment target for the first multi-council rollout of
          Umkhandlu.
        </p>
        <CodeBlock>{`AMAJUBA DISTRICT MUNICIPALITY
        │
        ├── Newcastle Local Municipality
        │       │
        │       ├── Ward 7 — Mndozo Traditional Authority (Khathide TC — LIVE)
        │       ├── Ward 8 — [next deployment]
        │       └── [additional wards]
        │
        ├── Emadlangeni Local Municipality
        │       └── [Traditional Councils]
        │
        └── eMadlangeni Local Municipality
                └── [Traditional Councils]

COMMERCIAL STAKEHOLDERS IN THE DISTRICT
        │
        ├── Newcastle PMU — infrastructure project coordination
        ├── Mining operations — community engagement, SLP, CSR
        ├── Engineering contractors — EPWP, SMME, milestone reporting
        ├── Attorneys & environmental practitioners — statutory notices
        └── Corporate CSR sponsors — verified community impact`}</CodeBlock>
        <p>
          The Khathide Traditional Council (Mndozo area, Ward 7) is the live
          pilot. It proves the model. Every subsequent council deployment in
          Amajuba District uses the same platform, the same codebase, and the
          same commercial structure — with different content, different
          branding, and different governance records.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          The district-level opportunity: a single agreement with Amajuba
          District Municipality or a district-level COGTA programme could
          facilitate deployment across all Traditional Councils in the district
          simultaneously. This is the scale model.
        </p>
      </CollapsibleChapter>

      {/* Chapter 4 — The Four Roles */}
      <CollapsibleChapter number="4" title="Who Pays, Who Uses, Who Benefits">
        <p>
          The most important commercial insight in the Unami model is this: the
          institution using the platform is not always the institution paying
          for it. Understanding the four roles is essential to understanding the
          business model.
        </p>
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 pr-4">Role</th>
                <th className="text-left py-2 pr-4">Who They Are</th>
                <th className="text-left py-2">In Amajuba</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <TableRow
                cells={[
                  '1. Buyer / Payer',
                  'The organisation that finances the service',
                  'Municipality, mine, contractor, CSR sponsor, COGTA programme',
                ]}
              />
              <TableRow
                cells={[
                  '2. Customer / Contracting Partner',
                  'The organisation that enters the arrangement with Unami',
                  'Traditional Council, municipality, attorney, engineering firm',
                ]}
              />
              <TableRow
                cells={[
                  '3. Users / Operating Partners',
                  'The people who use the platform daily',
                  'Council secretary, Induna, community liaison officer, operator',
                ]}
              />
              <TableRow
                cells={[
                  '4. Beneficiaries',
                  'The people who gain from improved governance',
                  'Community members, residents, SMME owners, job seekers',
                ]}
              />
            </tbody>
          </table>
        </div>
        <Blockquote>
          A Traditional Council may be the customer and operating partner, while
          a municipality, mine, or contractor pays for a specific reporting or
          coordination service that the council&apos;s activities support.
        </Blockquote>
        <p>
          This means one council relationship can produce several distinct
          commercial opportunities — each with a different buyer, a different
          service, and a different commercial arrangement.
        </p>
      </CollapsibleChapter>

      {/* Chapter 5 — The Shared Infrastructure Model */}
      <CollapsibleChapter number="5" title="The Shared Infrastructure Model">
        <p>
          This is the core of the Umkhandlu commercial model. It is what makes
          it replicable and sustainable. The council gets a governance operating
          system at no cost. Unami operates the commercial layers on top of that
          system.
        </p>
        <CodeBlock>{`SHARED INFRASTRUCTURE MODEL
─────────────────────────────────────────────────────

TRADITIONAL COUNCIL (Platform Owner)
  ├── Governance records (minutes, resolutions, decisions)
  ├── Community notices and alerts
  ├── Area pages (Izigodi)
  ├── Community directory
  └── Institutional memory
  
  → Council controls all of this. Council owns all of this.
  → Council pays nothing for platform access or operation.

─────────────────────────────────────────────────────

UNAMI FOUNDATION (Platform Operator)
  ├── Development notices (EIA, SPLUMA, mining, liquor)
  │       → Attorneys and developers pay per notice
  ├── Infrastructure project tracking
  │       → Municipality / PMU / contractor pays for coordination service
  ├── CSR campaign management
  │       → Corporate sponsors pay for verified impact reporting
  ├── SMME and EPWP coordination
  │       → Contractor pays for pre-vetted local supplier access
  └── Statutory compliance notices
          → Regulators and developers pay for proof of publication

─────────────────────────────────────────────────────

REVENUE FLOWS TO UNAMI — NOT TO THE COUNCIL
The council retains governance authority.
Unami operates the commercial coordination layer.
External stakeholders pay for defined services.`}</CodeBlock>
        <p>
          This is not a theoretical model. It is already operational. The
          Khathide Traditional Council resolution (adopted at a duly constituted
          council meeting) formally establishes this arrangement:
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-6">
          <p className="text-xs text-amber-700 uppercase tracking-wide font-semibold mb-3">
            Khathide Traditional Council Resolution — Key Clauses
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <strong>§2 Operational Authority:</strong> The Council retains
              full governance authority over all published content. The platform
              operates under Council mandate, not independently. All data
              belongs to the Council. The Council pays no fees for platform
              access or operation.
            </li>
            <li>
              <strong>§2 Revenue:</strong> Revenue from external parties
              (developers, attorneys, businesses) flows to Unami Foundation as
              the platform operator.
            </li>
            <li>
              <strong>§5 Independence:</strong> The platform operator does not
              make governance decisions, does not adjudicate disputes, does not
              represent any contractor, municipality, or political party.
              Records, preserves, organises, and presents information only.
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            This resolution is the constitutional document for every subsequent
            council deployment. The same structure applies to every Traditional
            Council in Amajuba District.
          </p>
        </div>
      </CollapsibleChapter>

      {/* Chapter 6 — Revenue Streams */}
      <CollapsibleChapter number="6" title="Revenue Streams — Amajuba District">
        <p>
          The commercial model has two layers. Layer 1 is the operating
          partnership with the institution. Layer 2 is the services Unami
          operates on behalf of the institution for external stakeholders.
        </p>
        <h3 className="text-lg font-bold mt-6 mb-3">
          Layer 1 — Operating Partnership Services
        </h3>
        <div className="grid md:grid-cols-2 gap-4 my-4">
          <InfoCard
            title="Council Onboarding"
            items={[
              'Initial setup, configuration, content migration',
              'Operator training (council secretary / youth rep)',
              'Once-off: R5,000–R15,000 per council',
              'Buyer: council, municipality, or COGTA programme',
            ]}
          />
          <InfoCard
            title="Ongoing Support & Maintenance"
            items={[
              'Technical support, platform updates, content assistance',
              'Monthly: R800–R2,500 per council',
              'Buyer: council, municipality, or district-level agreement',
              'Free tier available for pilot councils',
            ]}
          />
        </div>
        <h3 className="text-lg font-bold mt-6 mb-3">
          Layer 2 — Commercial Coordination Services
        </h3>
        <div className="grid md:grid-cols-2 gap-4 my-4">
          <InfoCard
            title="Statutory Notices"
            items={[
              'EIA, SPLUMA, mining, liquor licence, estate notices',
              'Proof of Publication certificate (court-submittable)',
              'Per notice: R800–R3,500 depending on type',
              'Buyer: attorneys, environmental practitioners, developers',
            ]}
          />
          <InfoCard
            title="Infrastructure Project Coordination"
            items={[
              'Project Information Board, milestone tracking, EPWP/SMME',
              'Community feedback, verification records, data export',
              'Monthly: R2,000–R8,000 per active project',
              'Buyer: Newcastle PMU, engineering contractors',
            ]}
          />
          <InfoCard
            title="CSR Campaign Management"
            items={[
              'Verified community impact reporting',
              'Certified deliverables, beneficiary tracking, audit trail',
              'Per campaign: R15,000–R80,000',
              'Buyer: mines, corporate CSR departments',
            ]}
          />
          <InfoCard
            title="District-Level Agreement"
            items={[
              'Platform deployment across all councils in the district',
              'Centralised reporting for COGTA / district municipality',
              'Annual: R200,000–R800,000 for district-wide deployment',
              'Buyer: Amajuba District Municipality or COGTA programme',
            ]}
          />
        </div>
        <p className="text-sm text-gray-500 mt-4">
          These are indicative ranges. Actual pricing depends on scope, number
          of councils, project complexity, and procurement route. Municipal
          procurement requires formal quotation or tender process.
        </p>
      </CollapsibleChapter>

      {/* Chapter 7 — Who Are the Economic Buyers */}
      <CollapsibleChapter
        number="7"
        title="Who Are the Economic Buyers in Amajuba?"
      >
        <p>
          The economic buyer is the person or organisation with the budget and
          authority to approve expenditure. In Amajuba District, there are five
          distinct economic buyer categories — each with a different procurement
          route and a different service need.
        </p>
        <div className="space-y-4 my-6">
          <Buyer
            icon="🏛️"
            title="Amajuba District Municipality"
            service="District-level platform deployment, COGTA reporting, cross-council coordination"
            route="Formal procurement — quotation or tender. Budget: IDP, COGTA grant, or district operational budget."
            contact="Municipal Manager, ICT Director, or Community Services Director"
          />
          <Buyer
            icon="🏢"
            title="Newcastle Local Municipality / PMU"
            service="Infrastructure project coordination, EPWP tracking, community engagement for capital projects"
            route="Service level agreement or project-specific contract. Budget: MIG, WSIG, RBIG project budgets."
            contact="Newcastle PMU — existing relationship established"
          />
          <Buyer
            icon="⛏️"
            title="Mining Operations"
            service="Community consultation records, SLP governance, CSR campaign management, statutory notices"
            route="Direct commercial agreement. Budget: SLP budget, CSR budget, community development fund."
            contact="Community Relations Manager, SLP Manager, or CSR Director"
          />
          <Buyer
            icon="⚖️"
            title="Attorneys & Environmental Practitioners"
            service="Statutory notice publication, proof of publication certificates, public comment management"
            route="Per-notice commercial arrangement. Budget: client disbursements."
            contact="Conveyancing attorneys, environmental consultants, town planners"
          />
          <Buyer
            icon="🏗️"
            title="Engineering Contractors"
            service="SMME pre-vetting, EPWP coordination, milestone reporting, community feedback"
            route="Project-specific service agreement. Budget: project preliminaries or community liaison budget."
            contact="Project Manager, Community Liaison Officer, or SMME coordinator"
          />
        </div>
        <p className="text-sm text-gray-500">
          The Traditional Council is the customer and operating partner in all
          cases — not the economic buyer. The council&apos;s governance
          authority is what makes the platform credible to all other
          stakeholders. Without the council, there is no platform. Without the
          platform, the council has no digital institutional presence.
        </p>
      </CollapsibleChapter>

      {/* Chapter 8 — The Replicable Model */}
      <CollapsibleChapter number="8" title="Why This Model Is Replicable">
        <p>
          The Amajuba District deployment is not a one-off project. It is the
          proof of concept for a model that can be replicated across every
          district in South Africa with a significant Traditional Council
          presence.
        </p>
        <CodeBlock>{`REPLICATION MODEL
─────────────────────────────────────────────────────

WHAT CHANGES PER COUNCIL:
  ├── Site name and description (CMS Settings)
  ├── Brand colours (CMS Settings → Branding)
  ├── Content — all governance records (CMS Studio)
  └── Domain (hosting configuration)

WHAT DOES NOT CHANGE:
  ├── Platform codebase (zero per-council development)
  ├── Commercial structure (same operating agreement)
  ├── Revenue model (same Layer 1 + Layer 2 structure)
  ├── Governance architecture (same five-layer model)
  └── Operator training (same programme)

─────────────────────────────────────────────────────

SCALE ECONOMICS:
  1 council  → proof of concept (Khathide — LIVE)
  5 councils → Amajuba District pilot
  15 councils → KZN district programme
  50+ councils → national programme`}</CodeBlock>
        <p>
          The platform scales through content, not code. Each new council adds
          governance records, community notices, and commercial activity —
          without any engineering work. The Unami Foundation&apos;s cost per
          additional council is training, onboarding, and ongoing support — not
          development.
        </p>
        <h3 className="text-lg font-bold mt-6 mb-3">
          The Sustainability Model
        </h3>
        <p>
          The Foundation&apos;s sustainability does not depend on treating every
          community member as an individual software subscriber. It combines:
        </p>
        <ul className="space-y-2 text-gray-700 mt-3">
          <li>
            <strong>Institutional service agreements</strong> — deployment,
            training, support, maintenance
          </li>
          <li>
            <strong>Commissioned services</strong> — statutory notices, project
            coordination, CSR campaigns
          </li>
          <li>
            <strong>Sponsored access</strong> — where the direct customer lacks
            funds, a sponsor pays
          </li>
          <li>
            <strong>District or provincial programmes</strong> — COGTA or
            district municipality funds multi-council deployment
          </li>
          <li>
            <strong>Grants and partnerships</strong> — for shared infrastructure
            and early-stage community programmes
          </li>
        </ul>
        <p className="text-sm text-gray-500 mt-4">
          A deployed pilot or free-tier service is not evidence that its ongoing
          delivery costs are zero. The commercial quotations must account for
          the real cost of delivery: platform subscriptions, infrastructure,
          deployment, training, support, maintenance, data, integration, and
          operational overhead — with contingency.
        </p>
      </CollapsibleChapter>

      {/* Chapter 9 — Unami Foundation Portfolio */}
      <CollapsibleChapter number="9" title="The Unami Foundation Portfolio">
        <p>
          Umkhandlu is one of three operating partnerships in the Technology for
          Good programme. The other portfolio activities are distinct — they
          have different buyers, different commercial models, and different
          operational readiness levels.
        </p>
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 pr-4">Activity</th>
                <th className="text-left py-2 pr-4">Status</th>
                <th className="text-left py-2">Economic Buyer</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <TableRow
                cells={[
                  'Umkhandlu (COP)',
                  'Live pilot — Khathide TC',
                  'Municipality, mine, contractor, attorney',
                ]}
              />
              <TableRow
                cells={[
                  'Unami Schools (SOP)',
                  'Demonstration — no formal agreement',
                  'School, sponsor, education body',
                ]}
              />
              <TableRow
                cells={[
                  'Unami Sports (CSOP)',
                  'Demonstration — no formal agreement',
                  'Academy, sponsor, development programme',
                ]}
              />
              <TableRow
                cells={[
                  'Moments',
                  'Live — pending reactivation',
                  'Community org, institution, sponsor',
                ]}
              />
              <TableRow
                cells={[
                  'UNCIP',
                  'Live — constitutional work pending',
                  'Institutional partner, sponsor',
                ]}
              />
              <TableRow
                cells={[
                  'Unami Drones',
                  'Training programme',
                  'Learner, sponsor, commissioning org',
                ]}
              />
              <TableRow
                cells={[
                  'Unami Timber',
                  'Planned — site required',
                  'Timber business, contractor, builder',
                ]}
              />
              <TableRow
                cells={[
                  'BeatsChain',
                  'In development',
                  'Artist, label, distributor',
                ]}
              />
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500">
          Demonstrations and engagements are not proof of paying customers. Each
          activity requires a clear service, a responsible contracting party,
          and an agreed commercial arrangement before it generates revenue. The
          commercial status of each activity must be stated accurately — not
          conflated with operational readiness or platform capability.
        </p>
      </CollapsibleChapter>

      {/* Chapter 10 — What Founders Need to Know */}
      <CollapsibleChapter number="10" title="What Founders Need to Know">
        <p>
          The questions founders most commonly ask — and the honest answers:
        </p>
        <div className="space-y-4 my-6">
          <QA
            q="Is the platform real?"
            a="Yes. Umkhandlu is live at umkhandlu.unamifoundation.org. It is recording live governance processes for the Khathide Traditional Council. The Buffalo River Abstraction Works project is tracked in real time. Statutory notices are published with proof of publication certificates."
          />
          <QA
            q="Do we have paying customers?"
            a="Not yet at commercial scale. The Khathide Traditional Council is a live pilot on a free tier. The commercial model is proven in structure — the Khathide resolution establishes the operating agreement — but revenue-generating contracts with municipalities, mines, and contractors are the next step."
          />
          <QA
            q="Why does the council get it for free?"
            a="Because the council's governance authority is what makes the platform credible to every other stakeholder. Without the council, there is no platform. The council's participation is the asset. The commercial revenue comes from the stakeholders who need access to that asset — not from the council itself."
          />
          <QA
            q="What is the path to revenue?"
            a="Three parallel tracks: (1) Newcastle PMU service agreement for infrastructure project coordination. (2) Statutory notice service for attorneys and developers in the district. (3) District-level agreement with Amajuba District Municipality for multi-council deployment. Any one of these generates meaningful revenue."
          />
          <QA
            q="What is the risk?"
            a="The main risk is adoption speed — traditional governance moves slowly, and municipal procurement takes time. The mitigation is the free-tier pilot model: councils adopt without financial risk, which removes the primary adoption barrier. Revenue follows adoption."
          />
          <QA
            q="What does Unami Foundation own?"
            a="The platform technology, the operating model, and the commercial relationships with external stakeholders. We do not own the governance records — those belong to the council. We do not own the community — that belongs to itself. We own the infrastructure that makes governance visible."
          />
          <QA
            q="How does this connect to unamifoundation.org?"
            a="unamifoundation.org is the public face of the Foundation — the entry point for potential clients, funders, and partners. It communicates our mission, our products, and our impact. Every council deployment strengthens the case made on that site."
          />
        </div>
      </CollapsibleChapter>

      <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500 mb-4">
          Built and operated by <strong>Unami Foundation</strong>
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/" className="text-sm text-primary hover:underline">
            View Live Platform →
          </Link>
          <Link
            href="/presentation"
            className="text-sm text-primary hover:underline"
          >
            Technical Presentation →
          </Link>
          <Link
            href="/presentation/cogta"
            className="text-sm text-primary hover:underline"
          >
            COGTA Presentation →
          </Link>
          <Link
            href="/presentation/mining"
            className="text-sm text-primary hover:underline"
          >
            Mining Presentation →
          </Link>
        </div>
      </footer>
    </div>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────

function Blockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-4 border-primary pl-4 my-6 text-lg font-medium text-gray-800 italic">
      {children}
    </blockquote>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto text-xs leading-relaxed my-6 font-mono">
      {children}
    </pre>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
      <h4 className="font-bold mb-3 text-sm">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="text-sm text-gray-700 flex items-start gap-2"
          >
            <span className="text-primary mt-0.5">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Buyer({
  icon,
  title,
  service,
  route,
  contact,
}: {
  icon: string;
  title: string;
  service: string;
  route: string;
  contact: string;
}) {
  return (
    <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <p className="font-bold">{title}</p>
      </div>
      <p className="text-sm text-gray-700 mb-1">
        <strong>Service need:</strong> {service}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        <strong>Procurement route:</strong> {route}
      </p>
      <p className="text-sm text-gray-500">
        <strong>Contact:</strong> {contact}
      </p>
    </div>
  );
}

function QA({ q, a }: { q: string; a: string }) {
  return (
    <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
      <p className="font-bold text-sm mb-2">{q}</p>
      <p className="text-sm text-gray-700">{a}</p>
    </div>
  );
}

function TableRow({ cells }: { cells: string[] }) {
  return (
    <tr className="border-b border-gray-100">
      {cells.map((cell) => (
        <td key={cell} className="py-2 pr-4">
          {cell}
        </td>
      ))}
    </tr>
  );
}
