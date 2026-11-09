// Shared label maps, status config and formatters for governance content.
// Import from here — never redefine inline in page files.

export const RECORD_TYPE_LABELS: Record<string, string> = {
  agenda: 'Agenda',
  minutes: 'Meeting Minutes',
  resolution: 'Resolution',
  'land-allocation': 'Land Allocation',
  'dispute-resolution': 'Dispute Resolution',
  'public-notice': 'Public Notice',
  policy: 'Policy',
  report: 'Report',
  'infrastructure-concern': 'Infrastructure Concern',
  'project-outcome': 'Project Outcome',
  'community-decision': 'Community Decision',
  'external-resource': 'External Resource',
};

export const RECORD_STATUS_VARIANTS: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  adopted: 'default',
  approved: 'default',
  pending: 'outline',
  open: 'secondary',
  rejected: 'destructive',
  resolved: 'secondary',
};

export const DEV_NOTICE_TYPE_LABELS: Record<string, string> = {
  eia: 'Environmental Impact Assessment',
  rezoning: 'Rezoning (SPLUMA)',
  'land-use': 'Land Use Change (SPLUMA)',
  township: 'Township Establishment (SPLUMA)',
  building: 'Building Plan Approval',
  mining: 'Mining / Excavation',
  liquor: 'Liquor License',
  telecom: 'Cell Tower / Mast',
  estate: 'Deceased Estate',
  liquidation: 'Liquidation / Insolvency',
  pto: 'PTO / Land Transfer',
  other: 'Public Notice',
};

export const AREA_LEVEL_LABELS: Record<string, string> = {
  district: 'District Municipality',
  municipality: 'Local Municipality',
  ward: 'Ward',
  'traditional-authority': 'Traditional Authority',
  isigodi: 'Isigodi',
  settlement: 'Settlement',
};

export const MUNICIPALITY_LABELS: Record<string, string> = {
  newcastle: 'Newcastle LM',
  dannhauser: 'Dannhauser LM',
  emadlangeni: 'eMadlangeni LM',
  amajuba: 'Amajuba District',
};

export function formatDateZA(date: string): string {
  return new Date(date).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateZALong(date: string): string {
  return new Date(date).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
