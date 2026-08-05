import type { Metadata } from 'next';
import Link from 'next/link';
import SectionNarrator from '@/components/modules/SectionNarrator';

export const metadata: Metadata = {
  title: 'Operator Dashboard — Umkhandlu',
  robots: { index: false },
};

export default function OperatorPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <header className="mb-12">
        <h1 className="text-3xl font-black mb-2">Operator Dashboard</h1>
        <p className="text-gray-500">
          Quick reference for all platform tools, routes, and workflows.
        </p>
      </header>

      <Section title="Studio (CMS)">
        <RouteCard
          label="Sanity Studio"
          path="/studio"
          description="Create and manage all content — campaigns, notices, records, people, listings."
        />
      </Section>

      <Section title="Public Pages">
        <RouteCard label="Homepage" path="/" description="Live public site." />
        <RouteCard
          label="Presentation"
          path="/presentation"
          description="Institutional guide — show to stakeholders, PMUs, councils."
        />
        <RouteCard
          label="Area Page"
          path="/areas/[slug]"
          description="Community digital twin — listings, notices, programs, campaigns."
        />
      </Section>

      <Section title="Infrastructure Projects">
        <RouteCard
          label="Campaign Detail"
          path="/campaigns/[slug]"
          description="Live project page — info board, deliverables, progress, community notices."
        />
      </Section>

      <Section title="Statutory Notices & Compliance">
        <RouteCard
          label="Development Notice Detail"
          path="/development-notices/[slug]"
          description="Public notice with documents, map, comment form, deadline tracking."
        />
        <RouteCard
          label="Proof of Publication Certificate"
          path="/notices/certificate/[document-id]"
          description="Court-submittable PDF. Replace [document-id] with the Sanity _id of the developmentNotice."
        />
        <HowTo
          title="How to get the certificate URL"
          steps={[
            'Open Studio → Development Notices → select the notice',
            'Copy the document _id from the URL bar (after /developmentNotice;)',
            'Certificate URL: /notices/certificate/[paste-id-here]',
            'Send this URL to the applicant — they print as PDF (Ctrl+P)',
            'Mark "Proof of Publication Issued" checkbox in Studio',
          ]}
        />
      </Section>

      <Section title="Governance Records">
        <RouteCard
          label="Record Detail"
          path="/records/[slug]"
          description="Minutes, resolutions, land allocations, project outcomes — permanent archive."
        />
      </Section>

      <Section title="Data Export (API)">
        <RouteCard
          label="Campaign Export"
          path="/api/campaigns/export?token=READ_TOKEN"
          description="JSON export of all campaigns — deliverables, progress, SMMEs, verifications."
        />
        <HowTo
          title="How to use the export API"
          steps={[
            'Replace READ_TOKEN with your SANITY_API_READ_TOKEN',
            'Filter by status: ?token=TOKEN&status=active',
            'Filter by type: ?token=TOKEN&type=csr',
            'Use for PMU monthly reports — paste into spreadsheet or reporting template',
          ]}
        />
      </Section>

      <Section title="Verification Records (TCRS)">
        <HowTo
          title="When to create a verification record"
          steps={[
            'Two or more sources report DIFFERENT values for the SAME field',
            'Example: contractor says 65% complete, engineer certifies 40%',
            'Open Studio → Verification Records → Create New',
            'Link to the project, add both source claims with dates + evidence files',
            'Set Verified Reporting Value (engineer-certified value)',
            'Upload supporting documents (IPC certificates, site photos)',
            'NEVER delete a source record — only add new ones',
          ]}
        />
        <HowTo
          title="When NOT to create a verification record"
          steps={[
            'Different scopes (e.g. 100 total jobs vs 30 in Phase 1 — not a conflict)',
            'Data is simply missing (use progress log note instead)',
            'Only one source has reported (need minimum 2 conflicting sources)',
          ]}
        />
      </Section>

      <Section title="Project Governance (Reference, Health, Closure)">
        <HowTo
          title="How to set project reference number"
          steps={[
            'Open Studio → Campaign → Details tab → Project Reference Number',
            'Format: PRJ-YYYY-XXXX (e.g. PRJ-2026-0001)',
            'Set once at project initiation — used on reports and correspondence',
            'Shows in mono font above project title on public page',
          ]}
        />
        <HowTo
          title="How to update project health (RAG status)"
          steps={[
            'Open Studio → Campaign → Details tab → Project Health (RAG)',
            'Green: On Track — milestones being met, no major issues',
            'Amber: At Risk — delays, resource issues, needs attention',
            'Red: Critical — major problems, escalation required',
            'Update whenever project status materially changes',
            'Shows as coloured badge on public page and campaign cards',
          ]}
        />
        <HowTo
          title="How to record lessons learned (project closure)"
          steps={[
            'Only visible when status is Completed or Reported',
            'Open Studio → Campaign → Tracking & Impact → Lessons Learned',
            'Write: what worked, what failed, what to do differently',
            'This becomes permanent institutional memory for future projects',
            'Completes the lifecycle: Initiation → Active → Completed → Lessons',
          ]}
        />
      </Section>

      <Section title="Deliverables (Milestone Tracking)">
        <HowTo
          title="How to certify a deliverable"
          steps={[
            'Open Studio → Campaign → Tracking & Impact → Certified Deliverables',
            'Set Progress (%) to 100',
            'Fill "Certified By" (e.g. ABC Consulting Engineers)',
            'Set Certification Date',
            'THEN change status to Certified',
            'Cannot certify unless progress is 100% and certifiedBy is filled',
            'Progress bar updates automatically on public page',
          ]}
        />
      </Section>

      <Section title="Community Notices (Hiring / SMME)">
        <HowTo
          title="How to add a new community notice"
          steps={[
            'Open Studio → Campaign → Details tab → Community Notices',
            'Click Add Item',
            'Set Date, Issued By (who is issuing — council? operator? PMU?)',
            'Write the notice message',
            'Latest notice shows as amber banner — older ones collapse into accordion',
            'NEVER edit old notices — always add a new one',
          ]}
        />
      </Section>

      <Section title="SMME Directory">
        <HowTo
          title="How to add local SMMEs"
          steps={[
            'Open Studio → Campaign → Tracking & Impact → SMME Directory',
            'Click Add Item',
            'Fill: Business Name, Service/Trade, Owner, Logo (optional)',
            'Check "Verified by Council" when the council confirms them',
            'Update the "Local SMMEs Count" number to match',
            'Section appears on public campaign page with verification badges',
          ]}
        />
      </Section>

      <Section title="Public Participation Log">
        <HowTo
          title="How to log received community feedback"
          steps={[
            'Receive comment via webhook (n8n/email)',
            'Open Studio → Campaign → Tracking & Impact → Public Participation Log',
            'Click Add Item',
            'Set: Date Received, Type (comment/objection/complaint/issue/support/question)',
            'Set: Submitter Relationship (resident/landowner/business/community)',
            'Write Summary — DO NOT include names, emails, or phone numbers (POPIA)',
            'Set: Action Taken (e.g. Forwarded to PMU, Noted, Escalated, Resolved)',
            'This creates the auditable evidence trail for PMU reporting',
          ]}
        />
        <HowTo
          title="Why not store personal details?"
          steps={[
            'POPIA compliance — personal data must not be in a public CMS',
            'Personal details stay in webhook delivery (n8n/email) only',
            'The participationLog stores: type + relationship + summary + action',
            'This is enough for audit: proves participation occurred + action was taken',
          ]}
        />
      </Section>

      <Section title="Webhook Settings">
        <HowTo
          title="How to configure webhooks"
          steps={[
            'Open Studio → Site Settings → Analytics tab',
            'Primary Webhook URL — receives all form submissions',
            'Public Comment Webhook (optional) — separate endpoint for comments',
            'Infrastructure Feedback Webhook (optional) — separate for project feedback',
            'If specific webhooks are empty, all forms use the Primary URL',
            'Operator Email — shown on certificates and escalation',
            'API Export Token — share with PMU for data access',
          ]}
        />
      </Section>

      <Section title="Project Updates (Media Events)">
        <HowTo
          title="How to add a new project event"
          steps={[
            'Open Studio → Campaign → Media & Assets → Project Updates',
            'Click Add Item',
            'Set Event Date and Title (e.g. "Phase 1 Construction Commences")',
            'Add media statement in Content field',
            'Add event photos in Photos array',
            'Add video URL if available',
            'DO NOT edit the "Project Overview (Permanent)" field — that never changes',
          ]}
        />
      </Section>

      <Section title="Print / PDF">
        <HowTo
          title="How to print any page as PDF"
          steps={[
            'Navigate to the page you want to print',
            'Press Ctrl+P (or Cmd+P on Mac)',
            'Select "Save as PDF" as destination',
            'Pages are print-optimized: no header/footer/nav, A4 margins',
            'Info Board prints on single page without splitting',
            'Rich text content starts on new page automatically',
          ]}
        />
      </Section>

      <Section title="Key Principles (Never Forget)">
        <div className="bg-gray-900 text-white rounded-xl p-6 space-y-3 text-sm">
          <p>
            • The system records, preserves, organises, presents —{' '}
            <strong>never decides</strong>
          </p>
          <p>
            • Progress is measured by what has been <strong>certified</strong>,
            not what has been claimed
          </p>
          <p>
            • Append, never overwrite — add new entries, don't edit old ones
          </p>
          <p>• Never delete source records or community notices</p>
          <p>
            • The council governs. The engineer certifies. The municipality
            authorises. <strong>You document.</strong>
          </p>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const id = `section-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  return (
    <section className="mb-10" id={id}>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <SectionNarrator sectionId={id} />
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function RouteCard({
  label,
  path,
  description,
}: {
  label: string;
  path: string;
  description: string;
}) {
  const isExternal = path.startsWith('/api');
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200">
      <div className="flex-1">
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      {path.includes('[') ? (
        <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono shrink-0">
          {path}
        </code>
      ) : isExternal ? (
        <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono shrink-0">
          {path}
        </code>
      ) : (
        <Link
          href={path}
          className="text-xs text-primary font-medium shrink-0 hover:underline"
        >
          Open →
        </Link>
      )}
    </div>
  );
}

function HowTo({ title, steps }: { title: string; steps: string[] }) {
  return (
    <details className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <summary className="p-4 cursor-pointer font-semibold text-sm text-gray-900 hover:bg-gray-50">
        {title}
      </summary>
      <ol className="px-4 pb-4 space-y-2 list-decimal list-inside text-sm text-gray-700">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </details>
  );
}
