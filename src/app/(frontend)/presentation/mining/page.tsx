import type { Metadata } from 'next';
import Link from 'next/link';
import SectionNarrator from '@/components/modules/SectionNarrator';

export const metadata: Metadata = {
  title: 'Umkhandlu — Mining & Community Governance',
  description:
    'Community governance interface for mining operations — preserving engagement, consultation, and development as permanent institutional memory.',
  robots: { index: false },
};

export default function MiningPresentation() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <header className="mb-16 text-center" id="mining-hero">
        <p className="text-sm font-bold text-primary uppercase tracking-wide mb-4">
          Community Governance Interface
        </p>
        <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
          Mining & Community Governance
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Mining companies invest significantly in community engagement,
          infrastructure development, SMME programmes and stakeholder
          consultation. Over time, these governance interactions become
          fragmented across reports, meeting minutes and individual departments.
          Umkhandlu preserves them as permanent institutional memory.
        </p>
        <SectionNarrator sectionId="mining-hero" />
      </header>

      <Chapter number="1" title="The Community Governance Challenge">
        <p>
          Mining operations generate governance interactions with communities at
          every stage — from exploration through to closure. Community
          consultations, infrastructure commitments, Social and Labour Plan
          initiatives, local procurement programmes and development projects all
          produce institutional artefacts.
        </p>
        <p>
          The challenge is not whether these engagements happen. It is whether
          they can be reconstructed five, ten, or twenty years later.
        </p>
        <Blockquote>
          How are community engagements preserved as permanent institutional
          memory? Not: did they happen. Rather: can anyone reconstruct the
          complete governance history?
        </Blockquote>
        <p>
          Current approaches — spreadsheets, PDFs, quarterly reports, individual
          departments — create operational records. But they do not create
          traceable governance lineage that communities, Traditional Councils,
          municipalities, and regulators can independently verify.
        </p>
      </Chapter>

      <Chapter number="2" title="Where Mining Meets Traditional Governance">
        <p>
          Mining companies do not operate in isolation. Every significant
          community interaction involves multiple governance stakeholders:
        </p>
        <CodeBlock>
          {`Mining Company
        │
        │  Community engagement, SLP, CSR, infrastructure
        │
Traditional Council
        │
        │  Governance oversight, community representation
        │
     UMKHANDLU
        │
        │  Institutional memory, governance lineage
        │
────────────────────────────────────────
 │           │            │           │
Community   Municipality   COGTA    Regulators`}
        </CodeBlock>
        <p>
          The mine does not own the platform. The Traditional Council does not
          operate the mine. Each stakeholder contributes institutional records
          relevant to their role. Umkhandlu preserves the governance
          relationships between them.
        </p>
        <h3 className="text-lg font-bold mt-6 mb-3">
          What Umkhandlu Does Not Do
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li>Does not replace operational mining systems</li>
          <li>Does not manage production, finance, or HR</li>
          <li>Does not compete with compliance reporting platforms</li>
          <li>Does not require the mine to change internal processes</li>
        </ul>
        <h3 className="text-lg font-bold mt-6 mb-3">What Umkhandlu Does</h3>
        <ul className="space-y-2 text-gray-700">
          <li>
            Preserves community engagement as traceable institutional records
          </li>
          <li>
            Links notices, meetings, resolutions, and outcomes into governance
            lineage
          </li>
          <li>
            Provides communities with transparent access to governance history
          </li>
          <li>
            Creates permanent evidence of consultation, commitment, and delivery
          </li>
        </ul>
      </Chapter>

      <Chapter number="3" title="Governance Record Lineage">
        <p>
          Every community governance interaction follows the same information
          transformation pattern — regardless of whether the stakeholder is a
          municipality, a mining company, or a Traditional Council:
        </p>
        <CodeBlock>
          {`Community Engagement Notice
        │
        ▼
Community Meeting
        │
        ▼
Meeting Minutes (Record)
        │
        ▼
Community Concerns Raised (Record)
        │
        ▼
Company Response (Record)
        │
        ▼
Community Resolution (Record)
        │
        ▼
Project / Commitment (Record)
        │
        ▼
Progress Updates (Record)
        │
        ▼
Completion & Verification (Record)
        │
        ▼
Permanent Institutional Memory`}
        </CodeBlock>
        <p>
          This is not theoretical. It is already operational. The platform
          currently records governance processes for the Khathide Traditional
          Council and tracks a live municipal infrastructure project (Buffalo
          River Abstraction Works, Ward 7, Newcastle).
        </p>
        <h3 className="text-lg font-bold mt-6 mb-3">
          The Lineage Builds Itself
        </h3>
        <p>
          When a new institutional record is created and linked to its parent,
          the governance lineage extends automatically. No manual assembly. No
          retrospective documentation. The system follows governance as it
          happens.
        </p>
      </Chapter>

      <Chapter number="4" title="Mining Use Cases">
        <div className="space-y-6 my-6">
          <UseCase
            title="Community Consultation"
            flow={[
              'Consultation Notice published',
              'Community meeting convened',
              'Minutes recorded',
              'Community concerns documented',
              'Company response recorded',
              'Resolution adopted',
              'Permanent institutional record',
            ]}
          />
          <UseCase
            title="Infrastructure Development"
            flow={[
              'Project announcement (Notice)',
              'Community engagement meeting',
              'Project Information Board (live tracking)',
              'Milestone progress (engineer-certified)',
              'Community feedback captured',
              'Completion verification',
              'Institutional memory',
            ]}
          />
          <UseCase
            title="Social & Labour Plan (SLP)"
            flow={[
              'SLP commitment recorded',
              'Community consultation',
              'Implementation notices',
              'Progress tracking',
              'Monitoring records',
              'Completion evidence',
              'Governance lineage preserved',
            ]}
          />
          <UseCase
            title="CSR & Community Programmes"
            flow={[
              'Programme notice',
              'Community meeting',
              'Resolution of support',
              'Implementation',
              'Progress updates',
              'Outcome verification',
              'Permanent record',
            ]}
          />
          <UseCase
            title="Local Procurement & SMME Development"
            flow={[
              'Opportunity notice published',
              'Applications received',
              'Selection recorded',
              'Training & mentorship tracked',
              'Business directory updated',
              'Outcomes documented',
              'Community economic record',
            ]}
          />
          <UseCase
            title="Environmental & Statutory Compliance"
            flow={[
              'EIA / Mining notice published',
              'Public comment period opened',
              'Community objections/support captured',
              'Proof of Publication certificate issued',
              'Decision recorded',
              'Compliance evidence preserved',
              'Permanent institutional record',
            ]}
          />
        </div>
      </Chapter>

      <Chapter number="5" title="Stakeholder Architecture">
        <p>
          Umkhandlu serves multiple stakeholders through a single platform. Each
          stakeholder interacts with the system according to their governance
          role:
        </p>
        <div className="space-y-4 my-6">
          <Stakeholder
            icon="⛏️"
            title="Mining Company"
            description="Publishes engagement notices, infrastructure commitments, SLP updates, procurement opportunities. Governance interactions become permanent institutional records."
          />
          <Stakeholder
            icon="👑"
            title="Traditional Council"
            description="Platform owner. Governance oversight, community representation, meeting records, resolutions. All institutional memory accumulates under the council."
          />
          <Stakeholder
            icon="🏢"
            title="Municipality"
            description="Infrastructure coordination, ward-level planning, IDP alignment. Project tracking with engineer-certified milestones."
          />
          <Stakeholder
            icon="⚖️"
            title="COGTA"
            description="Governance administration oversight. Audit trail for recognition processes, boundary reviews, institutional compliance."
          />
          <Stakeholder
            icon="🏘️"
            title="Community"
            description="Access to notices, records, opportunities. Public comment forms. Transparent governance history. No login required."
          />
          <Stakeholder
            icon="📋"
            title="Regulators (DMR, DFFE)"
            description="Statutory notice publication, proof of publication certificates, public participation evidence, compliance records."
          />
        </div>
      </Chapter>

      <Chapter number="6" title="What Already Exists">
        <p>
          Umkhandlu is not a concept. It is a production platform currently
          deployed and recording live governance processes:
        </p>
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 pr-4">Capability</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <TableRow cells={['Platform', 'Live — production deployment']} />
              <TableRow
                cells={[
                  'Governance Record Lineage',
                  'Active — auto-generated from references',
                ]}
              />
              <TableRow
                cells={[
                  'Infrastructure Project Tracking',
                  'Live — Buffalo River Abstraction Works',
                ]}
              />
              <TableRow
                cells={[
                  'Community Notices & Meetings',
                  'Active — KwaGudlucingo governance process',
                ]}
              />
              <TableRow
                cells={[
                  'Statutory Notices & Proof of Publication',
                  'Active — EIA, liquor licence, development notices',
                ]}
              />
              <TableRow
                cells={[
                  'Community Directory & Mapping',
                  'Active — schools, clinics, businesses',
                ]}
              />
              <TableRow
                cells={[
                  'Data Export API',
                  'Active — JSON export for campaigns and governance lineage',
                ]}
              />
              <TableRow
                cells={[
                  'Traditional Council',
                  'Khathide Traditional Council (Mndozo area)',
                ]}
              />
              <TableRow
                cells={[
                  'Municipal engagement',
                  'Newcastle LM ICT — MOU submitted',
                ]}
              />
              <TableRow
                cells={['COGTA presentation', 'Prepared — awaiting engagement']}
              />
            </tbody>
          </table>
        </div>
      </Chapter>

      <Chapter number="7" title="Invitation">
        <Blockquote>
          Mining companies already generate governance interactions with
          communities — consultations, commitments, infrastructure, procurement,
          development. Umkhandlu preserves those interactions as permanent,
          traceable institutional records that strengthen transparency,
          continuity and trust.
        </Blockquote>
        <p>
          We invite an exploratory conversation to discuss whether Umkhandlu
          could complement existing community engagement processes by providing
          a structured governance layer that preserves institutional memory
          across all stakeholders.
        </p>
        <p>
          No operational systems are replaced. No internal processes change. The
          platform simply ensures that governance interactions between mining
          operations and communities are preserved as permanent, traceable
          institutional records — accessible to all parties, indefinitely.
        </p>
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
    <section className="mb-16" id={`mining-${number}`}>
      <span className="text-sm font-bold text-primary uppercase tracking-wide">
        {number}
      </span>
      <h2 className="text-2xl md:text-3xl font-bold mb-4 mt-1">{title}</h2>
      <SectionNarrator sectionId={`mining-${number}`} />
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

function UseCase({ title, flow }: { title: string; flow: string[] }) {
  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
      <h4 className="font-bold mb-3">{title}</h4>
      <ol className="space-y-1.5">
        {flow.map((step, i) => (
          <li
            key={step}
            className="text-sm text-gray-700 flex items-start gap-2"
          >
            <span className="text-primary font-mono text-xs mt-0.5">
              {i + 1}.
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Stakeholder({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <p className="font-bold text-sm">{title}</p>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
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
