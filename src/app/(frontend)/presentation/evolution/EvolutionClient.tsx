'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  NarratorToggle,
  ScrollNarratorEngine,
} from '@/components/modules/ScrollNarrator';

// ─── Print styles ─────────────────────────────────────────────────────────────
const PRINT_STYLES = `
  @media print {
    @page { size: A4 portrait; margin: 1.5cm; }
    * { animation: none !important; transition: none !important; }
  }
`;

// ─── Detect print ─────────────────────────────────────────────────────────────

function usePrint() {
  const [printing, setPrinting] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('print');
    const handler = (e: MediaQueryListEvent) => setPrinting(e.matches);
    mq.addEventListener('change', handler);
    window.addEventListener('beforeprint', () => setPrinting(true));
    window.addEventListener('afterprint', () => setPrinting(false));
    return () => {
      mq.removeEventListener('change', handler);
    };
  }, []);
  return printing;
}

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className,
  printing = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  printing?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  if (printing) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Word-by-word hook sentence ───────────────────────────────────────────────

function HookLine({
  text,
  baseDelay = 0,
}: {
  text: string;
  baseDelay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  // Build stable keys from cumulative character offset — avoids index key lint
  const words = text.split(' ');
  let offset = 0;
  const keyed = words.map((word) => {
    const key = `${offset}`;
    offset += word.length + 1;
    return { word, key };
  });
  return (
    <span ref={ref} className="inline">
      {keyed.map(({ word, key }, i) => (
        <motion.span
          key={key}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.4,
            delay: baseDelay + i * 0.07,
            ease: 'easeOut',
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Act divider ──────────────────────────────────────────────────────────────

function ActLabel({
  number,
  title,
  printing = false,
}: {
  number: string;
  title: string;
  printing?: boolean;
}) {
  return (
    <Reveal printing={printing} className="flex items-center gap-4 mb-10 mt-20">
      <span className="text-xs font-bold text-primary uppercase tracking-widest shrink-0">
        Act {number}
      </span>
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs text-gray-400 uppercase tracking-wide shrink-0">
        {title}
      </span>
    </Reveal>
  );
}

// ─── Field-by-field record card ───────────────────────────────────────────────

function RecordCard() {
  const fields = [
    { label: 'Type', value: 'Community Meeting' },
    { label: 'Date', value: '27 June 2026' },
    { label: 'Location', value: 'Soccer Ground, opposite Izazi High School' },
    { label: 'Weather', value: '☁ Overcast · 14°C · Wind NW 12 km/h' },
    { label: 'Attendance', value: '47 community members' },
    { label: 'Area', value: 'KwaGudlucingo, Khathide Traditional Council' },
  ];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div
      ref={ref}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm max-w-lg mx-auto"
    >
      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">
        Governance Record
      </p>
      <div className="space-y-3">
        {fields.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.4,
              delay: 0.1 + i * 0.12,
              ease: 'easeOut',
            }}
            className="flex gap-3 text-sm"
          >
            <span className="text-gray-400 w-24 shrink-0">{f.label}</span>
            <span className="text-gray-900 font-medium">{f.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Lineage tree ─────────────────────────────────────────────────────────────

function LineageTree() {
  const nodes = [
    {
      id: 'notice',
      label: 'Community Meeting Notice',
      sub: '27 Jun 2026',
      depth: 0,
    },
    { id: 'minutes', label: 'Meeting Minutes', sub: 'Adopted', depth: 1 },
    {
      id: 'r1',
      label: 'Resolution — Petition for Recognition',
      sub: 'Adopted',
      depth: 2,
    },
    {
      id: 'r2',
      label: 'Resolution — Safety Whistle System',
      sub: 'Adopted',
      depth: 2,
    },
    {
      id: 'r3',
      label: 'Infrastructure Record — Apollo Lighting',
      sub: 'Open',
      depth: 2,
    },
  ];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} className="max-w-lg mx-auto space-y-2">
      {nodes.map((n, i) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: i * 0.15, ease: 'easeOut' }}
          style={{ marginLeft: `${n.depth * 1.5}rem` }}
          className="flex items-start gap-3"
        >
          <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">{n.label}</p>
            <p className="text-xs text-gray-400">{n.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Output cards (certificates / maps) ──────────────────────────────────────

function OutputCards() {
  const cards = [
    {
      icon: '📜',
      title: 'Lineage Certificate',
      sub: 'Printable A4 · Full audit chain',
      href: '/notices/lineage/community-meeting-kwagudlucingo-governance-community-safety-and-infrastructure',
    },
    {
      icon: '🗺️',
      title: 'Journey Map',
      sub: 'A4 Landscape · Visual governance flow',
      href: '/notices/journey/community-meeting-kwagudlucingo-governance-community-safety-and-infrastructure',
    },
    {
      icon: '✅',
      title: 'Proof of Publication',
      sub: 'Court-submittable certificate',
      href: '/notices/certificate/e2d20d11-e33d-4e44-90fa-6dc354ebaec8',
    },
  ];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: i * 0.15, ease: 'easeOut' }}
        >
          <Link
            href={c.href}
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-primary transition-colors"
          >
            <span className="text-2xl block mb-2">{c.icon}</span>
            <p className="text-sm font-bold text-gray-900">{c.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({
  label,
  pct,
  certified,
  delay = 0,
}: {
  label: string;
  pct: number;
  certified: boolean;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span
          className={
            certified ? 'text-green-600 font-bold' : 'text-amber-600 font-bold'
          }
        >
          {pct}% {certified ? '✓ Certified' : '⚠ Claimed'}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          className={`h-full rounded-full ${certified ? 'bg-green-500' : 'bg-amber-400'}`}
        />
      </div>
    </div>
  );
}

// ─── Verification record card ─────────────────────────────────────────────────

function VerificationCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md mx-auto shadow-sm"
    >
      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">
        Verification Record
      </p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Contractor claim</span>
          <span className="text-amber-600 font-bold">65%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Engineer certified</span>
          <span className="text-green-600 font-bold">40%</span>
        </div>
        <div className="h-px bg-gray-100 my-2" />
        <div className="flex justify-between">
          <span className="text-gray-400">Reporting value</span>
          <span className="text-gray-900 font-bold">40% (Engineer)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Authority</span>
          <span className="text-gray-700">Engineer &gt; Contractor</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Both claims</span>
          <span className="text-gray-700">Preserved in audit trail</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Layer stack ──────────────────────────────────────────────────────────────

function LayerStack() {
  const layers = [
    {
      n: '1',
      label: 'Community Communication',
      sub: 'Notices · Meetings · Alerts',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      n: '2',
      label: 'Governance Records',
      sub: 'Minutes · Resolutions · Policies',
      color: 'bg-indigo-50 border-indigo-200',
    },
    {
      n: '3',
      label: 'Evidence Preservation',
      sub: 'Attachments · Comments · Conflict Logs',
      color: 'bg-violet-50 border-violet-200',
    },
    {
      n: '4',
      label: 'Institutional Memory',
      sub: 'Lineage · Provenance · History',
      color: 'bg-purple-50 border-purple-200',
    },
    {
      n: '5',
      label: 'Governance Evidence',
      sub: 'Certificates · Audit Packages · Derived Output',
      color: 'bg-primary/5 border-primary/20',
    },
  ];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} className="max-w-lg mx-auto space-y-2">
      {layers.map((l, i) => (
        <motion.div
          key={l.n}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: i * 0.12, ease: 'easeOut' }}
          className={`border rounded-xl px-4 py-3 flex items-center gap-4 ${l.color}`}
        >
          <span className="text-xs font-black text-gray-400 w-4 shrink-0">
            {l.n}
          </span>
          <div>
            <p className="text-sm font-bold text-gray-900">{l.label}</p>
            <p className="text-xs text-gray-500">{l.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Act inView sentinel ─────────────────────────────────────────────────────

function useActRef() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  return { ref, inView };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EvolutionPage() {
  const [narrating, setNarrating] = useState(false);
  const printing = usePrint();

  const act0 = useActRef();
  const act1 = useActRef();
  const act2 = useActRef();
  const act3 = useActRef();
  const act4 = useActRef();
  const act5 = useActRef();
  const act6 = useActRef();

  const cues = [
    {
      inView: act0.inView,
      script:
        'Communities already create history. Umkhandlu ensures it is never lost.',
    },
    {
      inView: act1.inView,
      script:
        'Act one. The Record. A meeting happens and every detail is captured — date, location, weather, attendance — not as a form, but as permanent institutional context.',
    },
    {
      inView: act2.inView,
      script:
        'Act two. The Journey. One meeting, and a governance tree grows. Minutes produce resolutions. Resolutions produce petitions. Each record links to its parent — the trail builds itself. Three printable governance outputs are generated automatically.',
    },
    {
      inView: act3.inView,
      script:
        'Act three. The Project. A forty million Rand infrastructure project, tracked to the milestone. Buffalo River Abstraction Works, Ward 7, Newcastle. Progress is only what the engineer certifies. When contractor and engineer disagree, the system records both.',
    },
    {
      inView: act4.inView,
      script:
        'Act four. The Compliance. Statutory notices — E I A, SPLUMA, mining, cell towers, estate notices — published with comment deadlines, map pins, and public comment forms. Every notice produces a court-submittable proof of publication.',
    },
    {
      inView: act5.inView,
      script:
        'Act five. The Community. Every Isigodi gets its own digital presence. Area pages auto-assemble from content references — Induna, listings, notices, programs, opportunities. Bilingual in English and isiZulu.',
    },
    {
      inView: act6.inView,
      script:
        'Act six. The Architecture. One codebase. Any council. Any domain. Brand colors, content, and domain change per council. Zero council-specific code. The meeting was never the destination. It was the beginning.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: print styles */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />
      <ScrollNarratorEngine cues={cues} enabled={narrating} />
      <div className="print:hidden">
        <NarratorToggle
          enabled={narrating}
          onToggle={() => setNarrating((v) => !v)}
        />
      </div>

      {/* ── Act 0: Hook ── */}
      <section
        ref={act0.ref}
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gray-950 print:min-h-0 print:bg-white print:py-8 print:mb-4"
      >
        <div className="max-w-3xl">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-8">
            The Evolution of Umkhandlu
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 print:text-gray-900 print:text-3xl">
            <HookLine text="Communities already create history." />
          </h1>
          <h2 className="text-2xl md:text-4xl font-black text-gray-300 leading-tight print:text-gray-600 print:text-2xl">
            <HookLine
              text="Umkhandlu ensures it is never lost."
              baseDelay={0.6}
            />
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="text-gray-500 mt-10 text-sm print:hidden"
          >
            Scroll to follow the journey ↓
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto max-w-3xl px-6 py-20">
        {/* ── Act 1: The Record ── */}
        <div ref={act1.ref} className="print:break-before-page">
          <ActLabel number="1" title="The Record" printing={printing} />
        </div>

        <Reveal printing={printing} className="text-center mb-10">
          <p className="text-2xl md:text-3xl font-black text-gray-900 leading-snug">
            A meeting happens.
            <br />
            <span className="text-primary">Every detail is captured.</span>
          </p>
        </Reveal>

        <Reveal printing={printing} delay={0.1} className="mb-6">
          <p className="text-gray-500 text-center text-sm max-w-md mx-auto">
            Date, location, weather, attendance — not as a form, but as
            permanent institutional context.
          </p>
        </Reveal>

        <Reveal printing={printing} delay={0.2} className="mb-16">
          <RecordCard />
        </Reveal>

        <Reveal printing={printing} className="mb-10 text-center">
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            Weather is captured automatically at the time of the meeting — a
            timestamped environmental witness.
          </p>
        </Reveal>

        {/* ── Act 2: The Journey ── */}
        <div ref={act2.ref} className="print:break-before-page">
          <ActLabel number="2" title="The Journey" printing={printing} />
        </div>

        <Reveal printing={printing} className="text-center mb-10">
          <p className="text-2xl md:text-3xl font-black text-gray-900 leading-snug">
            One meeting.
            <br />
            <span className="text-primary">A governance tree grows.</span>
          </p>
        </Reveal>

        <Reveal printing={printing} delay={0.1} className="mb-6">
          <p className="text-gray-500 text-center text-sm max-w-md mx-auto">
            Minutes produce resolutions. Resolutions produce petitions. Each
            record links to its parent — the trail builds itself.
          </p>
        </Reveal>

        <Reveal printing={printing} delay={0.2} className="mb-12">
          <LineageTree />
        </Reveal>

        <Reveal printing={printing} className="mb-4 text-center">
          <p className="text-sm font-bold text-gray-700">
            Three printable governance outputs — generated automatically:
          </p>
        </Reveal>

        <Reveal printing={printing} delay={0.1} className="mb-16">
          <OutputCards />
        </Reveal>

        {/* ── Act 3: The Project ── */}
        <div ref={act3.ref} className="print:break-before-page">
          <ActLabel number="3" title="The Project" printing={printing} />
        </div>

        <Reveal printing={printing} className="text-center mb-10">
          <p className="text-2xl md:text-3xl font-black text-gray-900 leading-snug">
            A R40M infrastructure project.
            <br />
            <span className="text-primary">Tracked to the milestone.</span>
          </p>
        </Reveal>

        <Reveal printing={printing} delay={0.1} className="mb-4">
          <p className="text-gray-500 text-center text-sm max-w-md mx-auto">
            Buffalo River Abstraction Works — Ward 7, Newcastle LM. Progress is
            only what the engineer certifies.
          </p>
        </Reveal>

        <Reveal
          printing={printing}
          delay={0.2}
          className="bg-white border border-gray-200 rounded-2xl p-6 max-w-lg mx-auto mb-8 shadow-sm"
        >
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-5">
            Project Progress Board
          </p>
          <div className="space-y-4">
            <ProgressBar
              label="Weir Construction"
              pct={25}
              certified
              delay={0}
            />
            <ProgressBar
              label="Borehole Drilling"
              pct={65}
              certified={false}
              delay={0.15}
            />
            <ProgressBar
              label="Abstraction Tower"
              pct={0}
              certified
              delay={0.3}
            />
            <div className="h-px bg-gray-100 my-2" />
            <ProgressBar
              label="Overall Verified Progress"
              pct={40}
              certified
              delay={0.45}
            />
          </div>
        </Reveal>

        <Reveal printing={printing} delay={0.1} className="mb-6 text-center">
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            When contractor and engineer disagree, the system doesn't break — it
            records both.
          </p>
        </Reveal>

        <Reveal printing={printing} delay={0.2} className="mb-10">
          <VerificationCard />
        </Reveal>

        <Reveal printing={printing} className="mb-16">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-w-md mx-auto text-sm font-mono text-gray-600">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Export API
            </p>
            <p>GET /api/campaigns/export?token=&lt;TOKEN&gt;</p>
            <p className="text-gray-400 mt-1">
              → milestones · employment · verification · participation
            </p>
          </div>
        </Reveal>

        {/* ── Act 4: The Compliance ── */}
        <div ref={act4.ref} className="print:break-before-page">
          <ActLabel number="4" title="The Compliance" printing={printing} />
        </div>

        <Reveal printing={printing} className="text-center mb-10">
          <p className="text-2xl md:text-3xl font-black text-gray-900 leading-snug">
            Statutory notices.
            <br />
            <span className="text-primary">Court-submittable proof.</span>
          </p>
        </Reveal>

        <Reveal printing={printing} delay={0.1} className="mb-8">
          <p className="text-gray-500 text-center text-sm max-w-md mx-auto">
            EIA, SPLUMA, mining, cell towers, estate notices — published with
            comment deadlines, map pins, and public comment forms.
          </p>
        </Reveal>

        <Reveal printing={printing} delay={0.2} className="mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-lg mx-auto shadow-sm space-y-3 text-sm">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Development Notice
            </p>
            <div className="flex justify-between">
              <span className="text-gray-400">Type</span>
              <span className="font-medium">Liquor Licence Application</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Legal mandate</span>
              <span className="font-medium">KZN Liquor Licensing Act</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Comment deadline</span>
              <span className="font-medium text-red-600">31 July 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Map pin</span>
              <span className="font-medium">📍 Mndozo area</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Public comments</span>
              <span className="font-medium">
                Structured form · POPIA compliant
              </span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between">
              <span className="text-gray-400">Output</span>
              <Link
                href="/notices/certificate/e2d20d11-e33d-4e44-90fa-6dc354ebaec8"
                className="text-primary font-medium hover:underline"
              >
                Proof of Publication →
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal printing={printing} className="mb-16 text-center">
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Personal details are never stored in the CMS — delivered via webhook
            only.
          </p>
        </Reveal>

        {/* ── Act 5: The Community ── */}
        <div ref={act5.ref} className="print:break-before-page">
          <ActLabel number="5" title="The Community" printing={printing} />
        </div>

        <Reveal printing={printing} className="text-center mb-10">
          <p className="text-2xl md:text-3xl font-black text-gray-900 leading-snug">
            Every Isigodi.
            <br />
            <span className="text-primary">Its own digital presence.</span>
          </p>
        </Reveal>

        <Reveal printing={printing} delay={0.1} className="mb-8">
          <p className="text-gray-500 text-center text-sm max-w-md mx-auto">
            Area pages auto-assemble from content references — Induna, listings,
            notices, programs, opportunities.
          </p>
        </Reveal>

        <Reveal
          printing={printing}
          delay={0.2}
          className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-16"
        >
          {[
            {
              icon: '📍',
              label: 'Area Pages',
              sub: '/areas/[slug] — auto-assembled',
            },
            {
              icon: '🏫',
              label: 'Community Directory',
              sub: 'Schools · Clinics · Businesses',
            },
            {
              icon: '💼',
              label: 'Opportunities',
              sub: 'Jobs · Bursaries · Training',
            },
            {
              icon: '🎯',
              label: 'Programs & Events',
              sub: 'Youth · Skills · Collaborations',
            },
            {
              icon: '🗺️',
              label: 'Interactive Map',
              sub: 'Leaflet / OpenStreetMap',
            },
            { icon: '🌐', label: 'Bilingual', sub: 'English / isiZulu toggle' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3"
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </Reveal>

        {/* ── Act 6: The Architecture ── */}
        <div ref={act6.ref} className="print:break-before-page">
          <ActLabel number="6" title="The Architecture" printing={printing} />
        </div>

        <Reveal printing={printing} className="text-center mb-10">
          <p className="text-2xl md:text-3xl font-black text-gray-900 leading-snug">
            One codebase.
            <br />
            <span className="text-primary">Any council. Any domain.</span>
          </p>
        </Reveal>

        <Reveal printing={printing} delay={0.1} className="mb-8">
          <p className="text-gray-500 text-center text-sm max-w-md mx-auto">
            Brand colors, content, and domain change per council. Zero
            council-specific code.
          </p>
        </Reveal>

        <Reveal printing={printing} delay={0.2} className="mb-12">
          <LayerStack />
        </Reveal>

        <Reveal printing={printing} className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-center">
            {[
              { v: '13', l: 'Document Types' },
              { v: '27', l: 'Page Sections' },
              { v: '26', l: 'Frontend Routes' },
              { v: '5', l: 'Architecture Layers' },
            ].map((s) => (
              <div
                key={s.l}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4"
              >
                <p className="text-2xl font-black text-primary">{s.v}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Closing ── */}
        <Reveal printing={printing} className="text-center mt-24 mb-16">
          <p className="text-3xl md:text-4xl font-black text-gray-900 leading-snug max-w-xl mx-auto">
            The meeting was never the destination.
          </p>
          <p className="text-3xl md:text-4xl font-black text-primary leading-snug max-w-xl mx-auto mt-2">
            It was the beginning.
          </p>
        </Reveal>

        <Reveal
          printing={printing}
          delay={0.2}
          className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap pb-20"
        >
          <Link
            href="/notices/community-meeting-kwagudlucingo-governance-community-safety-and-infrastructure"
            className="text-sm text-primary font-medium hover:underline text-center"
          >
            KwaGudlucingo Notice →
          </Link>
          <Link
            href="/campaigns/buffalo-river-abstraction-works-ward-7"
            className="text-sm text-primary font-medium hover:underline text-center"
          >
            Buffalo River Project →
          </Link>
          <Link
            href="/presentation"
            className="text-sm text-primary font-medium hover:underline text-center"
          >
            Full Technical Presentation →
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:underline text-center"
          >
            View Live Platform →
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
