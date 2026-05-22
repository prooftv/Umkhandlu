type Props = {
  title: string;
  campaignType?: string;
  sponsor?: string;
  fundingSource?: string | null;
  contractor?: string | null;
  projectPhase?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  beneficiaries?: number | null;
  localSMMEs?: number | null;
  ward?: string;
};

const phaseLabels: Record<string, string> = {
  planning: 'Planning',
  procurement: 'Procurement',
  construction: 'Construction',
  commissioning: 'Commissioning',
  operational: 'Operational',
};

export default function ProjectInfoBoard({
  title,
  campaignType,
  sponsor,
  fundingSource,
  contractor,
  projectPhase,
  startDate,
  endDate,
  beneficiaries,
  localSMMEs,
  ward,
}: Props) {
  if (campaignType !== 'csr') return null;
  const rows = [
    sponsor && { label: 'Implementing Agency', value: sponsor },
    fundingSource && { label: 'Funding Source', value: fundingSource },
    contractor && { label: 'Contractor', value: contractor },
    projectPhase && {
      label: 'Project Phase',
      value: phaseLabels[projectPhase] || projectPhase,
    },
    startDate && {
      label: 'Commencement',
      value: new Date(startDate).toLocaleDateString(),
    },
    endDate && {
      label: 'Target Completion',
      value: new Date(endDate).toLocaleDateString(),
    },
    beneficiaries && {
      label: 'Employment Created',
      value: `${beneficiaries} local residents`,
    },
    localSMMEs && {
      label: 'Local SMMEs',
      value: `${localSMMEs} businesses`,
    },
    ward && { label: 'Ward / Area', value: ward },
  ].filter(Boolean) as { label: string; value: string }[];

  if (rows.length === 0) return null;

  return (
    <div className="mb-8 border-2 border-primary/20 rounded-xl overflow-hidden">
      <div className="bg-primary px-5 py-3">
        <p className="text-xs text-white/80 uppercase tracking-wide font-medium">
          Project Information
        </p>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between items-center px-5 py-3"
          >
            <span className="text-sm text-gray-500 font-medium">
              {row.label}
            </span>
            <span className="text-sm font-semibold text-gray-900 text-right">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
