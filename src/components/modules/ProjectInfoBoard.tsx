import Image from 'next/image';

type Props = {
  title: string;
  campaignType?: string;
  sponsor?: string;
  sponsorLogos?: { url: string; name: string; website?: string }[];
  fundingSource?: string | null;
  contractor?: string | null;
  contractNumber?: string | null;
  consultingEngineer?: string | null;
  projectPhase?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  beneficiaries?: number | null;
  localSMMEs?: number | null;
  ward?: string;
};

const phaseLabels: Record<string, string> = {
  planning: 'PLANNING PHASE',
  procurement: 'PROCUREMENT PHASE',
  construction: 'CONSTRUCTION PHASE',
  commissioning: 'COMMISSIONING PHASE',
  operational: 'OPERATIONAL',
};

function BoardRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline px-5 py-2.5 gap-4">
      <span className="text-xs font-bold text-gray-600 uppercase tracking-wide shrink-0">
        {label}:
      </span>
      <span className="text-sm font-bold text-gray-900 uppercase text-right">
        {value}
      </span>
    </div>
  );
}

function BoardDivider() {
  return <div className="border-t-2 border-gray-300" />;
}

function BoardHeader({ text }: { text: string }) {
  return (
    <div className="bg-gray-900 px-5 py-2.5 text-center">
      <p className="text-xs font-bold text-white uppercase tracking-widest">
        {text}
      </p>
    </div>
  );
}

function formatDate(date: string): string {
  return new Date(date)
    .toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .toUpperCase();
}

function ProjectSection({
  rows,
}: {
  rows: { label: string; value: string }[];
}) {
  if (rows.length === 0) return null;
  return (
    <div className="bg-white">
      {rows.map((row) => (
        <BoardRow key={row.label} label={row.label} value={row.value} />
      ))}
    </div>
  );
}

function buildSections(props: Props) {
  const section1 = [
    props.sponsor && { label: 'Employer', value: props.sponsor },
    props.fundingSource && {
      label: 'Funding Programme',
      value: props.fundingSource,
    },
  ].filter(Boolean) as { label: string; value: string }[];

  const section2 = [
    props.contractNumber && {
      label: 'Contract No',
      value: props.contractNumber,
    },
    props.contractor && { label: 'Main Contractor', value: props.contractor },
    props.consultingEngineer && {
      label: 'Consulting Engineer',
      value: props.consultingEngineer,
    },
    props.projectPhase && {
      label: 'Project Phase',
      value:
        phaseLabels[props.projectPhase] || props.projectPhase.toUpperCase(),
    },
  ].filter(Boolean) as { label: string; value: string }[];

  const section3 = [
    props.startDate && {
      label: 'Commencement Date',
      value: formatDate(props.startDate),
    },
    props.endDate && {
      label: 'Target Completion',
      value: formatDate(props.endDate),
    },
    props.ward && { label: 'Location', value: props.ward.toUpperCase() },
  ].filter(Boolean) as { label: string; value: string }[];

  const section4 = [
    props.beneficiaries && {
      label: 'Local Labour',
      value: `${props.beneficiaries} LOCAL RESIDENTS EMPLOYED`,
    },
    props.localSMMEs && {
      label: 'SMME Allocation',
      value: `${props.localSMMEs} LOCAL SMMES APPOINTED`,
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return { section1, section2, section3, section4 };
}

export default function ProjectInfoBoard(props: Props) {
  if (props.campaignType !== 'csr') return null;

  const { section1, section2, section3, section4 } = buildSections(props);

  if ([...section1, ...section2, ...section3, ...section4].length === 0)
    return null;

  return (
    <div className="mb-8 border-2 border-gray-800 rounded-lg overflow-hidden">
      <div className="bg-primary px-5 py-4 text-center">
        <p className="text-[10px] font-bold text-white/80 uppercase tracking-[0.2em] mb-1">
          Digital Project Information Board
        </p>
        <h3 className="text-lg font-black text-white uppercase tracking-wide">
          {props.title}
        </h3>
      </div>

      <ProjectSection rows={section1} />
      {section1.length > 0 && section2.length > 0 && <BoardDivider />}
      <ProjectSection rows={section2} />
      {section2.length > 0 && section3.length > 0 && <BoardDivider />}
      <ProjectSection rows={section3} />
      {section4.length > 0 && (
        <BoardHeader text="Socio-Economic Targets (EPWP)" />
      )}
      <ProjectSection rows={section4} />

      {props.sponsorLogos && props.sponsorLogos.length > 0 && (
        <div className="bg-gray-50 px-5 py-4 flex items-center justify-center gap-8 border-t-2 border-gray-300">
          {props.sponsorLogos.map((logo) =>
            logo.website ? (
              <a
                key={logo.name}
                href={logo.website}
                target="_blank"
                rel="noopener noreferrer"
                title={logo.name}
              >
                <Image
                  src={logo.url}
                  alt={logo.name}
                  width={120}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              </a>
            ) : (
              <Image
                key={logo.name}
                src={logo.url}
                alt={logo.name}
                width={120}
                height={48}
                className="h-12 w-auto object-contain"
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
