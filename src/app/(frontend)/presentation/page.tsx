import type { Metadata } from 'next';
import Link from 'next/link';
import SectionNarrator from '@/components/modules/SectionNarrator';

export const metadata: Metadata = {
  title: 'Umkhandlu — Institutional Presentation',
  description:
    'The missing digital operating system between traditional authority and modern coordination.',
  robots: { index: false },
};

export default function PresentationPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      {/* Hero */}
      <header className="mb-16 text-center">
        <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
          Umkhandlu: The Missing Digital Operating System Between Traditional
          Authority and Modern Co-ordination
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          An institutional guide to digital self-determination, evidence-based
          compliance, and multi-stakeholder project tracking for Traditional
          Councils, Municipalities, and Engineering Contractors.
        </p>
      </header>

      {/* Chapter 1 */}
      <Chapter number="1" title="The Philosophy of Digital Self-Determination">
        <p>
          For decades, traditional communities across South Africa have been
          treated as passive spectators in major public and private
          infrastructure rollouts. External entities enter an area, execute
          capital projects, and report unchecked progress metrics to distant
          state offices. When communication fails or local labour allocations
          skew, communities lack the auditable proof to protect their
          development rights.
        </p>
        <p>Umkhandlu completely reframes this ecosystem.</p>
        <Blockquote>
          Umkhandlu is not a portal built for the state to monitor the
          community. It is a sovereign digital operating system built for the
          community to verify the state.
        </Blockquote>
        <p>
          By providing a structured interface that bridges the ancestral
          administrative authority of Traditional Councils with the statutory,
          technical demands of modern municipal governance, Umkhandlu ensures
          that rural and township development occurs through active local
          partnership rather than external imposition.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          The system records, preserves, organises, and presents — it never
          decides. Progress is measured by what has been certified, not what has
          been claimed.
        </p>
      </Chapter>

      {/* Chapter 2 */}
      <Chapter number="2" title="The Project Initiative & Technical KPI Layer">
        <p>
          When a multi-million Rand public infrastructure investment — such as
          the Buffalo River Abstraction Works project — enters a traditional
          area, it is transformed from a static, paper-based budget line item
          into a live <strong>Digital Project Information Board</strong>.
        </p>
        <p>
          Umkhandlu tracks development progress using a milestone-based
          verification system which mirrors the real-world operational workflows
          of civil engineering:
        </p>
        <CodeBlock>
          {`[========>..................] 40% OVERALL VERIFIED PROJECT PROGRESS

■ Weir Construction (Active concurrent phase)
  [=====>.....................] 25% Verified • Concrete Poured

■ Abstraction Tower Refurbishment
  [...........................] 0% Pending Engineering Handover

■ Borehole Drilling (Active concurrent phase)
  [=============>..............] 65% Verified • 3 of 5 Boreholes Sunk`}
        </CodeBlock>
        <h3 className="text-lg font-bold mt-6 mb-3">
          The Rules of Technical Tracking
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li>
            <strong>No Provisional Claims:</strong> Deliverables are never
            calculated as "completed" based on unverified contractor reports.
            They remain flagged as Pending until certified on-site by the
            engineer.
          </li>
          <li>
            <strong>Concurrent Realism:</strong> The system calculates progress
            across multiple overlapping engineering tasks simultaneously,
            ensuring the PMU can spot bottlenecks instantly.
          </li>
          <li>
            <strong>Milestone-Based Progress:</strong> Completion is calculated
            strictly from engineer-certified deliverables, not self-reported
            percentages. Each deliverable is a binary, auditable state —
            certified or not certified.
          </li>
          <li>
            <strong>Project Health (RAG):</strong> Every initiative carries a
            real-time health indicator — Green (On Track), Amber (At Risk), Red
            (Critical) — visible on dashboards and the public project page.
          </li>
          <li>
            <strong>Unique Reference:</strong> Each project receives a reference
            number (PRJ-YYYY-XXXX) for audit trails, correspondence, and PMU
            reporting alignment.
          </li>
          <li>
            <strong>Institutional Closure:</strong> At completion, lessons
            learned are captured — completing the lifecycle from initiation
            through to permanent institutional memory.
          </li>
        </ul>
      </Chapter>

      {/* Chapter 3 */}
      <Chapter number="3" title="The Evidence Layer (Verification Records)">
        <p>
          At the heart of the operating system is the{' '}
          <strong>Governance Audit & Evidence Preservation Layer</strong>. This
          layer manages the natural friction that occurs when multiple
          stakeholders report on the same project parameter.
        </p>
        <p>
          When a variance is discovered — such as a contractor reporting 65%
          construction completion while the consulting engineer certifies only
          40% based on site inspection — the system does not break or ignore the
          mismatch.
        </p>
        <CodeBlock>
          {`┌───────────────────────────────────┐
│      PROGRESS % DISCREPANCY        │
└───────────────────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    ▼                           ▼
┌──────────────────┐   ┌──────────────────┐
│ CONTRACTOR CLAIM │   │ ENGINEER CERTIFY │
│ 65% Complete     │   │ 40% Complete     │
└──────────────────┘   └──────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│     VERIFICATION RECORD            │
│ Reporting Value: 40% (Engineer)   │
│ Status: 🟢 Verified                 │
│ Authority: Engineer > Contractor  │
│ Evidence: Both claims preserved   │
└───────────────────────────────────┘`}
        </CodeBlock>
        <h3 className="text-lg font-bold mt-6 mb-3">How It Operates</h3>
        <ul className="space-y-3 text-gray-700">
          <li>
            <strong>Multi-Source Ingestion:</strong> Minimum two independent
            source reports are timestamped and preserved alongside original
            evidence (documents, photographs, meeting minutes).
          </li>
          <li>
            <strong>Authority Classification:</strong> Sources are classified by
            governance authority level — engineer certification (highest) down
            to field observation. The highest-authority validated source informs
            the reporting value.
          </li>
          <li>
            <strong>Sovereign Override:</strong> The public frontend surfaces a
            single, clear, governance-approved value. The full historical audit
            trail is preserved for future forensic checks.
          </li>
          <li>
            <strong>No Adjudication:</strong> The system does not decide which
            source is correct. It records, preserves, and presents. The final
            reporting value is determined by the applicable governance
            authority.
          </li>
        </ul>
      </Chapter>

      {/* Chapter 4 */}
      <Chapter number="4" title="The Compliance & Notice Pipeline">
        <p>
          Umkhandlu rigorously separates Technical Infrastructure KPIs from
          Social Opportunity Communications and Statutory Compliance Notices:
        </p>
        <div className="grid md:grid-cols-2 gap-6 my-6">
          <InfoCard
            title="Technical Campaign Ledgers"
            path="/campaigns/[slug]"
            items={[
              'Immutable project data',
              'Funding allocations (WSIG, MIG, RBIG)',
              'Contractor metadata',
              'Milestone progress tracking',
              'Verification records',
              'Data export API (JSON)',
            ]}
          />
          <InfoCard
            title="Community Notice Feeds"
            path="/notices + /development-notices"
            items={[
              'Employment opportunities (EPWP phases)',
              'SMME registration deadlines',
              'Public participation (EIA, SPLUMA)',
              'Traditional council alerts',
              'Proof of publication certificates',
              'Public comment/objection forms',
            ]}
          />
        </div>
        <h3 className="text-lg font-bold mt-6 mb-3">
          Statutory Notice Infrastructure
        </h3>
        <p>
          Every development on Trust land, municipal land, or private land
          requires public notification. The platform issues{' '}
          <strong>Proof of Publication certificates</strong> — formal,
          court-submittable documents that prove community notification
          occurred.
        </p>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 pr-4">Notice Type</th>
                <th className="text-left py-2 pr-4">Legal Mandate</th>
                <th className="text-left py-2">Retention</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <TableRow cells={['EIA', 'NEMA', 'Full project duration']} />
              <TableRow
                cells={['Rezoning / SPLUMA', 'SPLUMA', 'Min. 30 days']}
              />
              <TableRow
                cells={['Deceased Estate', 'Insolvency Act', 'Min. 3 months']}
              />
              <TableRow
                cells={['Mining Permit', 'MPRDA', 'Full project duration']}
              />
              <TableRow
                cells={[
                  'Cell Tower',
                  'NEMA + by-laws',
                  'Full project duration',
                ]}
              />
              <TableRow
                cells={[
                  'PTO Transfer',
                  'Traditional & Khoi-San Act',
                  'Permanent',
                ]}
              />
              <TableRow
                cells={[
                  'Liquor Licence',
                  'KZN Liquor Licensing Act',
                  'Min. 30 days',
                ]}
              />
            </tbody>
          </table>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm font-bold mb-2">Live Example</p>
          <p className="text-sm text-gray-600 mb-3">
            A liquor licence application notice with public comment form,
            spatial mapping, and proof of publication certificate:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/development-notices/liquor-licence-application-mndozo-2026"
              className="text-sm text-primary font-medium hover:underline"
            >
              View Notice →
            </Link>
            <Link
              href="/notices/certificate/e2d20d11-e33d-4e44-90fa-6dc354ebaec8"
              className="text-sm text-primary font-medium hover:underline"
            >
              View Proof of Publication Certificate →
            </Link>
          </div>
        </div>
        <h3 className="text-lg font-bold mt-6 mb-3">
          Public Participation & Community Feedback
        </h3>
        <p>
          Active infrastructure projects include a structured community feedback
          form — residents can report issues, ask questions, or submit
          observations. All submissions are:
        </p>
        <ul className="space-y-2 text-gray-700 mt-3">
          <li>
            <strong>Delivered</strong> to the operator via webhook (with
            personal details for follow-up)
          </li>
          <li>
            <strong>Logged</strong> in the Participation Log (date, type,
            relationship, summary — no personal data stored in CMS)
          </li>
          <li>
            <strong>Auditable</strong> — PMU reports can reference: "12 comments
            received, 3 complaints escalated, all actioned"
          </li>
          <li>
            <strong>POPIA compliant</strong> — personal details never stored in
            the public system
          </li>
        </ul>
      </Chapter>

      {/* Chapter 5 */}
      <Chapter number="5" title="Stakeholder Interface & Onboarding">
        <div className="space-y-8">
          <StakeholderCard
            icon="👑"
            title="For the Traditional Authority"
            subtitle="The Sovereign Partner"
            mandate="You hold the key to the local governance layer. The platform is gifted to your council for free by the Unami Foundation."
            utility="You maintain absolute data sovereignty over your area's records. External developers must channel their employment quotas, SMME sub-contracting packages, and local project notifications directly through your official database, protecting the economic rights of your community."
          />
          <StakeholderCard
            icon="🏢"
            title="For the Municipality & PMU"
            subtitle="The Administrative Co-ordinating Partner"
            mandate="Reduce communication friction across outlying wards."
            utility="Secure complete transparency over contractor execution, satisfy strict national grant funding reporting rules, and prevent localised infrastructure site invasions by providing a clear, fair digital tracking board for local EPWP distribution."
          />
          <StakeholderCard
            icon="🏗️"
            title="For Engineering Contractors"
            subtitle="The Implementing Agent"
            mandate="Access a streamlined, pre-vetted digital repository of compliant local subcontractors and verified residents."
            utility="Log concurrent progress milestones transparently to clear regulatory public participation audits swiftly without administrative delay. Engineer certifications become the authoritative progress record."
          />
          <StakeholderCard
            icon="⚖️"
            title="For Attorneys & Environmental Practitioners"
            subtitle="The Compliance Partner"
            mandate="Statutory notices require proof that proper notification occurred."
            utility="Publish EIA, SPLUMA, estate, and liquidation notices at a fraction of print media cost. Receive a formal Proof of Publication certificate — court-submittable, timestamped, with permanent archive."
          />
        </div>
      </Chapter>

      {/* Chapter 6 */}
      <Chapter number="6" title="System Architecture">
        <CodeBlock>
          {`UMKHANDLU — Community-Scale Institutional Memory
│
├── Community Participation Layer
├── Infrastructure Visibility Layer
├── Development Coordination Layer
├── Opportunity & Programme Layer
├── Council Oversight Layer
├── Public Notice & Compliance Layer
│
└── Governance Audit & Evidence Layer
        ├── Infrastructure Evidence (milestones, verification)
        ├── Publication Evidence (proof of publication, retention)
        ├── Participation Evidence (comments, objections)
        ├── Compliance Evidence (mandates, deadlines, certificates)
        └── Governance Evidence (decisions, resolutions, approvals)`}
        </CodeBlock>
        <h3 className="text-lg font-bold mt-6 mb-3">Platform Capabilities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          <Stat value="13" label="Document Types" />
          <Stat value="27" label="Page Builder Sections" />
          <Stat value="18" label="Frontend Routes" />
          <Stat value="7" label="System Layers" />
        </div>
        <h3 className="text-lg font-bold mt-6 mb-3">Data Export</h3>
        <p>
          Campaign data, milestone progress, employment numbers, participation
          records, and compliance evidence are exportable via authenticated API
          for PMU reporting:
        </p>
        <CodeBlock>{`GET /api/campaigns/export?token=<TOKEN>
→ Project: title, status, projectPhase, fundingSource, contractor
→ Progress: deliverablesCertified[], deliverableProgress%, progressLog[]
→ Employment: beneficiaries, localSMMEs, smmeDirectory[]
→ Participation: communityNote[], participationLog count
→ Verification: verifications[], verificationCount
→ Relations: sponsor, relatedAreas[], noticeCount, developmentNoticeCount

Filters: ?status=active  ?type=csr`}</CodeBlock>
      </Chapter>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500 mb-4">
          Built and operated by <strong>Unami Foundation</strong>
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/" className="text-sm text-primary hover:underline">
            View Live Platform →
          </Link>
          <Link
            href="/campaigns/buffalo-river-abstraction-works-ward-7"
            className="text-sm text-primary hover:underline"
          >
            Buffalo River Project →
          </Link>
        </div>
      </footer>
    </div>
  );
}

// ─── Presentation components ──────────────────────────────────────────────────

function Chapter({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  const id = `chapter-${number}`;
  return (
    <section className="mb-16" id={id}>
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-sm font-bold text-primary uppercase tracking-wide">
          Chapter {number}
        </span>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
      <SectionNarrator sectionId={id} />
      <div className="prose prose-gray max-w-none">{children}</div>
    </section>
  );
}

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

function InfoCard({
  title,
  path,
  items,
}: {
  title: string;
  path: string;
  items: string[];
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-xs text-gray-400 mb-3 font-mono">{path}</p>
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

function StakeholderCard({
  icon,
  title,
  subtitle,
  mandate,
  utility,
}: {
  icon: string;
  title: string;
  subtitle: string;
  mandate: string;
  utility: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h4 className="font-bold">{title}</h4>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-2">
        <strong>The Mandate:</strong> {mandate}
      </p>
      <p className="text-sm text-gray-700">
        <strong>The Utility:</strong> {utility}
      </p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <p className="text-2xl font-black text-primary">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
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
