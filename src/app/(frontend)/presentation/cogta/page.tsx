import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Umkhandlu — COGTA Presentation',
  description:
    'Digital governance administration platform for Traditional Councils — institutional compliance, evidence preservation, and multi-stakeholder coordination.',
  robots: { index: false },
};

export default function CogtaPresentation() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <header className="mb-16 text-center">
        <p className="text-sm font-bold text-primary uppercase tracking-wide mb-4">
          Presented to
        </p>
        <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
          Department of Cooperative Governance & Traditional Affairs
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Umkhandlu: A structured digital governance administration platform
          that gives Traditional Councils an auditable institutional presence —
          preserving governance processes as permanent, traceable records
          aligned with COGTA administrative requirements.
        </p>
      </header>

      <Chapter number="1" title="The Problem Umkhandlu Addresses">
        <p>
          Traditional Councils produce governance — meetings, resolutions,
          petitions, land allocations, dispute resolutions — but these
          activities rarely result in structured, retrievable institutional
          records. When leadership transitions occur, when boundaries are
          disputed, or when historical decisions are questioned, the evidence
          trail is often fragmented or lost entirely.
        </p>
        <p>
          Umkhandlu solves this by providing a structured digital system that
          follows the natural flow of traditional governance and preserves every
          artefact as permanent institutional memory.
        </p>
        <Blockquote>
          Every governance event produces institutional records. Those records
          generate evidence. That evidence becomes permanent institutional
          memory.
        </Blockquote>
      </Chapter>

      <Chapter number="2" title="Institutional Architecture">
        <p>
          The platform is deployed at the Traditional Council level — not at the
          Induna/headman level. This ensures institutional resilience across
          leadership changes, boundary reviews, and vacancy periods.
        </p>
        <CodeBlock>
          {`Traditional Council (Platform Owner)
        │
     Umkhandlu (Governance Operating System)
        │
────────────────────────────────────
 │         │          │          │
Isigodi   Isigodi   Isigodi   Isigodi
 │         │          │          │
Induna   Induna    (Vacant)   Acting

↕ Leadership is data — not the identity of the community
↕ Isigodi persist regardless of headman status
↕ All governance records accumulate at the council level`}
        </CodeBlock>
        <h3 className="text-lg font-bold mt-6 mb-3">Why This Matters</h3>
        <ul className="space-y-3 text-gray-700">
          <li>
            A new headmanship recognition process (e.g. KwaGudlucingo) is
            recorded from petition to COGTA decision — even though the area
            currently has no recognised Induna.
          </li>
          <li>
            When an Induna retires, is suspended, or a position is under review,
            the area&apos;s governance records remain accessible and complete.
          </li>
          <li>
            Boundary disputes produce records that persist regardless of the
            dispute outcome.
          </li>
        </ul>
      </Chapter>

      <Chapter number="3" title="The Governance Lifecycle">
        <p>
          Umkhandlu captures the natural information flow of traditional
          governance without imposing external administrative processes:
        </p>
        <CodeBlock>
          {`Community Issue
       │
       ▼
Meeting Convened (Notice)
       │
       ▼
Minutes Captured (Record)
       │
       ▼
Resolution Adopted (Record)
       │
       ▼
Petition / Submission (Record + Evidence)
       │
       ▼
Acknowledgement (Record)
       │
       ▼
Decision (Record)
       │
       ▼
Implementation
       │
       ▼
Permanent Institutional Memory`}
        </CodeBlock>
        <h3 className="text-lg font-bold mt-6 mb-3">
          How Records Link Together
        </h3>
        <p>Every governance record carries explicit lineage references:</p>
        <ul className="space-y-2 text-gray-700 mt-3">
          <li>
            <strong>Origin Notice:</strong> The meeting/announcement that
            initiated this record
          </li>
          <li>
            <strong>Parent Record:</strong> The record this was produced from
            (e.g. minutes → resolution)
          </li>
          <li>
            <strong>Evidence & Attachments:</strong> Petitions, attendance
            registers, signature pages, photographs
          </li>
          <li>
            <strong>Verification Note:</strong> How the record was verified and
            by whom
          </li>
        </ul>
        <p className="mt-4">
          This creates an auditable governance tree — not a flat document
          repository. Any record can be traced back to its originating community
          concern.
        </p>
      </Chapter>

      <Chapter
        number="4"
        title="Live Example — Headmanship Recognition Process"
      >
        <p>
          On 24 June 2026, the community of KwaGudlucingo (under Khathide
          Traditional Council) convened a meeting to petition for recognition as
          a separate Isigodi. The platform recorded:
        </p>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 my-6">
          <p className="text-xs text-amber-700 uppercase tracking-wide font-semibold mb-3">
            Governance Lineage — KwaGudlucingo Recognition
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              📢 <strong>Notice (Meeting):</strong> Community Meeting —
              KwaGudlucingo Headmanship & Safety
            </li>
            <li className="ml-6">
              └ 📄 <strong>Record (Minutes):</strong> Full discussion —
              governance, safety, infrastructure
            </li>
            <li className="ml-10">
              ├ 📄 <strong>Record (Resolution):</strong> Petition for
              headmanship recognition — signed at meeting
            </li>
            <li className="ml-10">
              └ 📄 <strong>Record (Resolution):</strong> Community whistle alert
              system (safety measure)
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-4">
            Evidence attached: signed petition, attendance register
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Future records (as process unfolds): petition submission → COGTA
            acknowledgement → assessment → recognition decision
          </p>
        </div>
        <p>
          Without this system, in five years the only evidence may be
          &quot;someone remembers a meeting.&quot; With Umkhandlu, the full
          chain from community concern to COGTA decision is preserved,
          timestamped, and traceable.
        </p>
      </Chapter>

      <Chapter number="5" title="Document Types & Governance Records">
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 pr-4">Record Type</th>
                <th className="text-left py-2 pr-4">Purpose</th>
                <th className="text-left py-2">COGTA Relevance</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <TableRow
                cells={[
                  'Meeting Minutes',
                  'Record of council/community meetings',
                  'Governance process evidence',
                ]}
              />
              <TableRow
                cells={[
                  'Resolution',
                  'Formal decisions adopted',
                  'Council decision-making audit',
                ]}
              />
              <TableRow
                cells={[
                  'Community Decision',
                  'Community-level resolutions',
                  'Participation evidence',
                ]}
              />
              <TableRow
                cells={[
                  'Land Allocation',
                  'PTO and land decisions',
                  'Land administration records',
                ]}
              />
              <TableRow
                cells={[
                  'Dispute Resolution',
                  'Conflict outcomes',
                  'Traditional court function evidence',
                ]}
              />
              <TableRow
                cells={[
                  'Policy',
                  'Council policies adopted',
                  'Governance maturity indicator',
                ]}
              />
              <TableRow
                cells={[
                  'Report',
                  'Council reports and submissions',
                  'Administrative output',
                ]}
              />
              <TableRow
                cells={[
                  'External Resource',
                  'COGTA/ITB/DLA documents referenced',
                  'Cross-reference with state records',
                ]}
              />
            </tbody>
          </table>
        </div>
        <p>
          Each record carries: date, summary, full content, evidence
          attachments, related area (Isigodi), verification note, and lineage
          references. Records are publicly accessible — no login required for
          viewing.
        </p>
      </Chapter>

      <Chapter number="6" title="Additional Platform Capabilities">
        <div className="grid md:grid-cols-2 gap-4 my-6">
          <Card
            title="Statutory Compliance"
            items={[
              'Development notices (EIA, SPLUMA, mining)',
              'Public comment periods with forms',
              'Proof of Publication certificates',
              'Comment deadline tracking',
              'Legal mandate & fee tracking',
            ]}
          />
          <Card
            title="Infrastructure Oversight"
            items={[
              'Project progress (engineer-certified)',
              'Multi-source verification records',
              'Local SMME & EPWP tracking',
              'Funding source transparency',
              'Data export API for PMU reporting',
            ]}
          />
          <Card
            title="Community Administration"
            items={[
              'Area pages per Isigodi',
              'Leadership profiles (Induna/headman)',
              'Community directory (schools, clinics)',
              'Interactive mapping (OpenStreetMap)',
              'Programs, events, opportunities',
            ]}
          />
          <Card
            title="Institutional Resilience"
            items={[
              'Multi-council deployment (same codebase)',
              'CMS-driven (no code changes for content)',
              'Bilingual (English / isiZulu)',
              'Mobile-first responsive design',
              'Webhook integration for notifications',
            ]}
          />
        </div>
      </Chapter>

      <Chapter number="7" title="Deployment Model">
        <p>
          One codebase serves any Traditional Council. To deploy for a new
          council:
        </p>
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 pr-4">What Changes</th>
                <th className="text-left py-2">Where</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <TableRow cells={['Site name & description', 'CMS Settings']} />
              <TableRow cells={['Brand colors', 'CMS Settings → Branding']} />
              <TableRow cells={['Content (all documents)', 'CMS Studio']} />
              <TableRow cells={['Domain', 'Hosting configuration']} />
              <TableRow
                cells={['Council-specific code', 'Zero — nothing in code']}
              />
            </tbody>
          </table>
        </div>
        <p>
          This means COGTA could facilitate deployment across multiple
          Traditional Councils with minimal per-council effort. The system
          scales through content, not code.
        </p>
      </Chapter>

      <Chapter number="8" title="What This Means for COGTA">
        <div className="space-y-4 my-6">
          <Benefit
            title="Structured Governance Evidence"
            description="Traditional Council activities become retrievable institutional records — not scattered paper or memory-dependent processes."
          />
          <Benefit
            title="Recognition Process Audit Trail"
            description="Headmanship petitions, boundary reviews, and COGTA submissions are preserved with full lineage from community meeting to decision."
          />
          <Benefit
            title="Compliance Monitoring"
            description="Statutory notices, public participation, and development compliance are published with proof of publication and deadline tracking."
          />
          <Benefit
            title="Infrastructure Accountability"
            description="Municipal projects on traditional land carry engineer-certified milestones, verification records, and community participation logs."
          />
          <Benefit
            title="Scalable Across Councils"
            description="Same platform, different content. Each council gets its own institutional presence without per-council development cost."
          />
          <Benefit
            title="No Administrative Burden on Council"
            description="The Unami Foundation operates the platform on behalf of the council. The council's only obligation is to produce governance — which it already does."
          />
        </div>
      </Chapter>

      <Chapter number="9" title="Current Status">
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 pr-4">Item</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <TableRow cells={['Platform', 'Live — production deployment']} />
              <TableRow
                cells={[
                  'First council',
                  'Mndozo area (Khathide Traditional Council)',
                ]}
              />
              <TableRow
                cells={[
                  'Infrastructure project',
                  'Buffalo River Abstraction Works (Ward 7, Newcastle LM)',
                ]}
              />
              <TableRow
                cells={[
                  'Governance records',
                  'Active — KwaGudlucingo headmanship process recording',
                ]}
              />
              <TableRow
                cells={['Statutory notices', 'Active — liquor licence, EIA']}
              />
              <TableRow
                cells={[
                  'Operator',
                  'Unami Foundation (community technology partner)',
                ]}
              />
            </tbody>
          </table>
        </div>
      </Chapter>

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
            Full Technical Presentation →
          </Link>
          <Link
            href="/presentation/khathide"
            className="text-sm text-primary hover:underline"
          >
            Council Presentation →
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Chapter({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <span className="text-sm font-bold text-primary uppercase tracking-wide">
        {number}
      </span>
      <h2 className="text-2xl md:text-3xl font-bold mb-4 mt-1">{title}</h2>
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

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
      <h4 className="font-bold mb-3">{title}</h4>
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

function Benefit({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 bg-green-50 rounded-xl border border-green-100">
      <p className="font-bold text-sm text-green-800">{title}</p>
      <p className="text-sm text-green-700 mt-1">{description}</p>
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
