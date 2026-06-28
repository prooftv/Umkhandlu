import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Umkhandlu — Khathide Traditional Council',
  description:
    'Digital governance operating system for the Khathide Traditional Council.',
  robots: { index: false },
};

export default function KhathidePresentation() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <header className="mb-16 text-center">
        <p className="text-sm font-bold text-primary uppercase tracking-wide mb-4">
          Presented to
        </p>
        <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
          Khathide Traditional Council
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Umkhandlu: A digital governance operating system that serves the
          Traditional Council as an institution — preserving decisions,
          coordinating Izigodi, and building permanent institutional memory.
        </p>
      </header>

      <Chapter number="1" title="What Umkhandlu Is">
        <p>
          Umkhandlu is the digital operating system for your Traditional
          Council. It is not a website. It is an institutional memory system
          that records, preserves, and presents the governance activities of the
          council across all Izigodi.
        </p>
        <Blockquote>
          The platform belongs to the Traditional Council — not to any single
          Induna. Every Isigodi participates. Leadership changes. The
          institution endures.
        </Blockquote>
        <p>
          It is gifted to the council by the Unami Foundation at no cost. The
          council owns its data. The council controls its content.
        </p>
      </Chapter>

      <Chapter number="2" title="Why the Traditional Council — Not the Induna">
        <p>
          Individual Izinduna manage operational areas. But governance processes
          cross boundaries, leadership changes, and some areas may not yet have
          a recognised headman.
        </p>
        <CodeBlock>
          {`Traditional Council (Permanent Institution)
        │
     Umkhandlu (Digital Operating System)
        │
────────────────────────────────
 │        │         │        │
Isigodi  Isigodi  Isigodi  Isigodi
 │        │         │        │
Induna  Induna   (Vacant)  Induna`}
        </CodeBlock>
        <p>
          The platform remains operational even when an Isigodi has no
          recognised Induna, has an acting headman, or is under COGTA review.
          The geographic community still exists. Its records still accumulate.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Example: KwaGudlucingo currently has no recognised headman — yet the
          community meeting of 24 June 2026, its minutes, resolutions, and
          petition are all recorded in the system under Khathide Traditional
          Council.
        </p>
      </Chapter>

      <Chapter number="3" title="The Governance Lifecycle">
        <p>
          Every governance action follows a natural flow. Umkhandlu captures
          this flow without asking anyone to do extra work:
        </p>
        <CodeBlock>
          {`Notice (Meeting Called)
    │
    ▼
Record (Minutes)
    │
    ▼
Record (Resolution / Decision)
    │
    ▼
Record (Submission / Petition)
    │
    ▼
Record (Acknowledgement)
    │
    ▼
Record (Outcome / Decision)
    │
    ▼
Permanent Institutional Memory`}
        </CodeBlock>
        <p>
          Nothing is lost. Nothing depends on who remembers. Every record links
          to its origin — the meeting that produced it, the resolution it came
          from, the decision that followed.
        </p>
        <h3 className="text-lg font-bold mt-6 mb-3">
          Today&apos;s Example: KwaGudlucingo
        </h3>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-amber-800 mb-3">
            Governance Lineage — Live in the System
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              📢 <strong>Notice:</strong> Community Meeting — KwaGudlucingo
              Headmanship & Safety
            </li>
            <li className="ml-6">
              └ 📄 <strong>Minutes:</strong> Full record of discussion —
              headmanship, crime, infrastructure
            </li>
            <li className="ml-10">
              ├ 📄 <strong>Resolution:</strong> Petition for headmanship
              recognition
            </li>
            <li className="ml-10">
              └ 📄 <strong>Resolution:</strong> Community whistle alert system
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            Evidence attached: petition (signed), attendance register
          </p>
        </div>
        <p>
          In five years, if someone asks &quot;Why does KwaGudlucingo have its
          own headman?&quot; — the answer is not a memory. It is a traceable
          chain from community concern to COGTA recognition.
        </p>
      </Chapter>

      <Chapter number="4" title="What the Platform Does for the Council">
        <div className="grid md:grid-cols-2 gap-4 my-6">
          <Card
            title="Community Notices"
            items={[
              'Meeting announcements',
              'Resolutions & alerts',
              'Employment opportunities',
              'SMME procurement notices',
              'Project updates to community',
            ]}
          />
          <Card
            title="Documents & Records"
            items={[
              'Meeting minutes with evidence',
              'Community resolutions',
              'Land allocation decisions',
              'Dispute resolutions',
              'Policies & reports',
            ]}
          />
          <Card
            title="Area Pages (Izigodi)"
            items={[
              'Each area auto-assembles its content',
              'Induna profile (or vacancy noted)',
              'Listings: schools, clinics, businesses',
              'Area-specific notices & records',
              'Programs & opportunities for that area',
            ]}
          />
          <Card
            title="Infrastructure Tracking"
            items={[
              'Project progress (engineer-certified)',
              'Local SMME & EPWP tracking',
              'Community feedback forms',
              'Verification records',
              'Data export for PMU reporting',
            ]}
          />
          <Card
            title="Statutory Compliance"
            items={[
              'Development notices (EIA, SPLUMA)',
              'Public comment periods',
              'Proof of Publication certificates',
              'Liquor licence applications',
              'Mining & cell tower notices',
            ]}
          />
          <Card
            title="Community Directory"
            items={[
              'Schools, clinics, churches',
              'Businesses & accommodation',
              'Community map (OpenStreetMap)',
              'Verified by Induna / Council',
              'Contact details & operating hours',
            ]}
          />
        </div>
      </Chapter>

      <Chapter number="5" title="Who Uses It">
        <div className="space-y-4 my-6">
          <Role
            title="Inkosi & Council Administration"
            description="Approve content, manage institutional records, oversee all Izigodi. The council is the platform owner."
          />
          <Role
            title="Izinduna"
            description="Manage their area's listings, verify local businesses, receive area-specific content. Operational users within the system."
          />
          <Role
            title="Community Members"
            description="View notices, access opportunities, submit public comments, find local services. No login required."
          />
          <Role
            title="Unami Foundation (Operator)"
            description="Maintains the platform, provides training, adds content on behalf of the council. Does not own the data."
          />
          <Role
            title="Government & Developers"
            description="Submit statutory notices, track project compliance, export data for reporting. Transparent interface with the council."
          />
        </div>
      </Chapter>

      <Chapter number="6" title="What the Council Needs to Do">
        <p>Nothing technical. The council&apos;s role is governance:</p>
        <ol className="space-y-3 text-gray-700 mt-4 list-decimal list-inside">
          <li>
            <strong>Endorse the platform</strong> as the council&apos;s official
            digital presence
          </li>
          <li>
            <strong>Designate a content liaison</strong> (or allow the Unami
            Foundation to operate on the council&apos;s behalf)
          </li>
          <li>
            <strong>Provide governance records</strong> as they are produced —
            minutes, resolutions, decisions
          </li>
          <li>
            <strong>Review listings</strong> for verification (Induna-verified
            or Council-approved status)
          </li>
        </ol>
        <p className="mt-6">
          Brand colors, site name, contact details, and all content are
          controlled from the CMS. No code changes required for any council
          activity.
        </p>
      </Chapter>

      <Chapter number="7" title="The Institutional Memory Proposition">
        <Blockquote>
          Umkhandlu does not create governance. It follows governance. Every
          meeting, resolution, petition, and decision becomes a permanent,
          traceable institutional record.
        </Blockquote>
        <p>
          When leadership changes, when boundaries are redrawn, when Izinduna
          retire or new ones are appointed — the institutional memory remains.
          The Traditional Council endures beyond any individual office bearer.
        </p>
        <p>
          This is what distinguishes Umkhandlu from a website: it is not a
          brochure. It is a governance operating system that grows with every
          council meeting, every community decision, every infrastructure
          project.
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

function Role({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
      <p className="font-bold text-sm">{title}</p>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  );
}
