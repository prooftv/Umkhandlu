import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';
import { NODE_NAME } from '@/lib/siteConfig';

const printQuery = `*[_type == "campaign" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  campaignType,
  status,
  projectPhase,
  projectReference,
  projectHealth,
  description,
  startDate,
  endDate,
  fundingSource,
  contractor,
  contractNumber,
  consultingEngineer,
  beneficiaries,
  localSMMEs,
  impactSummary,
  deliverablesCertified[] { task, status, percentageComplete, certifiedBy, certificationDate },
  totalDeliverables,
  communityNote[] { date, issuedBy, message, location, attendance, weatherContext },
  progressLog[] { date, update },
  "sponsor": sponsor->{ name, sponsorType },
  "contactPerson": contactPerson->{ firstName, lastName, role },
  "relatedAreas": relatedAreas[]->{ name }
}`;

const allPrintQuery = `*[_type == "campaign"] | order(startDate desc) {
  title,
  "slug": slug.current,
  campaignType,
  status,
  projectPhase,
  projectReference,
  projectHealth,
  description,
  startDate,
  endDate,
  fundingSource,
  contractor,
  contractNumber,
  consultingEngineer,
  beneficiaries,
  localSMMEs,
  impactSummary,
  deliverablesCertified[] { task, status, percentageComplete, certifiedBy, certificationDate },
  totalDeliverables,
  communityNote[] { date, issuedBy, message, location, attendance, weatherContext },
  progressLog[] { date, update },
  "sponsor": sponsor->{ name, sponsorType },
  "contactPerson": contactPerson->{ firstName, lastName, role },
  "relatedAreas": relatedAreas[]->{ name }
}`;

type WeatherContext = {
  condition?: string;
  temperatureCelsius?: number;
  rainfallMm?: number;
};

type CommunityNote = {
  date?: string;
  issuedBy?: string;
  message?: string;
  location?: string;
  attendance?: number;
  weatherContext?: WeatherContext;
};

type Deliverable = {
  task?: string;
  status?: string;
  percentageComplete?: number;
  certifiedBy?: string;
  certificationDate?: string;
};

type ProgressEntry = { date?: string; update?: string };

type Campaign = {
  title?: string;
  slug?: string;
  campaignType?: string;
  status?: string;
  projectPhase?: string;
  projectReference?: string;
  projectHealth?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  fundingSource?: string;
  contractor?: string;
  contractNumber?: string;
  consultingEngineer?: string;
  beneficiaries?: number;
  localSMMEs?: number;
  impactSummary?: string;
  deliverablesCertified?: Deliverable[];
  totalDeliverables?: number;
  communityNote?: CommunityNote[];
  progressLog?: ProgressEntry[];
  sponsor?: { name?: string; sponsorType?: string };
  contactPerson?: { firstName?: string; lastName?: string; role?: string };
  relatedAreas?: { name?: string }[];
};

function fmt(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function weatherLine(wx?: WeatherContext): string {
  if (!wx) return '';
  return [
    wx.condition,
    wx.temperatureCelsius != null ? `${wx.temperatureCelsius}°C` : null,
    wx.rainfallMm ? `${wx.rainfallMm}mm rain` : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

const healthLabel: Record<string, string> = {
  green: '🟢 On Track',
  amber: '🟡 At Risk',
  red: '🔴 Critical',
};

const phaseLabel: Record<string, string> = {
  planning: 'Planning',
  procurement: 'Procurement',
  construction: 'Construction',
  commissioning: 'Commissioning',
  operational: 'Operational',
};

function renderDeliverables(
  deliverables: Deliverable[],
  total: number
): string {
  if (deliverables.length === 0) return '';
  const certified = deliverables.filter((d) => d.status === 'certified').length;
  const progress = total > 0 ? Math.round((certified / total) * 100) : null;
  return `
    <h3>Deliverables ${progress !== null ? `<span class="progress-label">${progress}% certified</span>` : ''}</h3>
    <table class="deliverables-table">
      <thead><tr><th>Task</th><th>Status</th><th>%</th><th>Certified By</th><th>Date</th></tr></thead>
      <tbody>
        ${deliverables
          .map(
            (d) => `
          <tr class="status-${d.status}">
            <td>${d.task ?? ''}</td>
            <td>${d.status ?? ''}</td>
            <td>${d.percentageComplete ?? 0}%</td>
            <td>${d.certifiedBy ?? '\u2014'}</td>
            <td>${fmt(d.certificationDate)}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>`;
}

function renderNotes(notes: CommunityNote[]): string {
  if (notes.length === 0) return '';
  return `
    <h3>Community Notices (${notes.length})</h3>
    ${notes
      .map(
        (n) => `
      <div class="notice-entry">
        <div class="notice-meta">
          <span>${fmt(n.date)}</span>
          ${n.issuedBy ? `<span>\u2014 ${n.issuedBy}</span>` : ''}
          ${n.location ? `<span>\ud83d\udccd ${n.location}</span>` : ''}
          ${n.attendance ? `<span>\ud83d\udc65 ${n.attendance} attendees</span>` : ''}
          ${weatherLine(n.weatherContext) ? `<span>\ud83c\udf24\ufe0f ${weatherLine(n.weatherContext)}</span>` : ''}
        </div>
        <p>${n.message ?? ''}</p>
      </div>`
      )
      .join('')}`;
}

function renderLog(log: ProgressEntry[]): string {
  if (log.length === 0) return '';
  return `
    <h3>Progress Log</h3>
    <div class="log">
      ${log.map((e) => `<div class="log-entry"><span class="log-date">${fmt(e.date)}</span><span>${e.update ?? ''}</span></div>`).join('')}
    </div>`;
}

function renderInfoTable(c: Campaign): string {
  const rows = [
    c.sponsor?.name
      ? `<tr><td>Sponsor / Employer</td><td>${c.sponsor.name}</td></tr>`
      : '',
    c.fundingSource
      ? `<tr><td>Funding Programme</td><td>${c.fundingSource}</td></tr>`
      : '',
    c.contractNumber
      ? `<tr><td>Contract No</td><td>${c.contractNumber}</td></tr>`
      : '',
    c.contractor
      ? `<tr><td>Main Contractor</td><td>${c.contractor}</td></tr>`
      : '',
    c.consultingEngineer
      ? `<tr><td>Consulting Engineer</td><td>${c.consultingEngineer}</td></tr>`
      : '',
    c.startDate
      ? `<tr><td>Commencement</td><td>${fmt(c.startDate)}</td></tr>`
      : '',
    c.endDate
      ? `<tr><td>Target Completion</td><td>${fmt(c.endDate)}</td></tr>`
      : '',
    c.relatedAreas?.length
      ? `<tr><td>Areas</td><td>${c.relatedAreas.map((a) => a.name).join(', ')}</td></tr>`
      : '',
    c.beneficiaries
      ? `<tr><td>Local Labour</td><td>${c.beneficiaries} residents</td></tr>`
      : '',
    c.localSMMEs ? `<tr><td>Local SMMEs</td><td>${c.localSMMEs}</td></tr>` : '',
    c.contactPerson
      ? `<tr><td>Contact</td><td>${c.contactPerson.firstName} ${c.contactPerson.lastName}${c.contactPerson.role ? ` \u2014 ${c.contactPerson.role}` : ''}</td></tr>`
      : '',
  ]
    .filter(Boolean)
    .join('');
  return `<table class="info-table">${rows}</table>`;
}

function renderCampaign(c: Campaign): string {
  const notes = (c.communityNote ?? [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime()
    );
  const deliverables = c.deliverablesCertified ?? [];
  const total = c.totalDeliverables ?? deliverables.length;
  const log = (c.progressLog ?? [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime()
    );
  const health = c.projectHealth
    ? `<span class="badge health-${c.projectHealth}">${healthLabel[c.projectHealth] ?? c.projectHealth}</span>`
    : '';
  const phase = c.projectPhase
    ? `<span class="badge">${phaseLabel[c.projectPhase] ?? c.projectPhase}</span>`
    : '';

  return `
    <div class="campaign">
      <div class="campaign-header">
        <div class="campaign-meta">
          ${c.projectReference ? `<span class="ref">${c.projectReference}</span>` : ''}
          <span class="badge">${c.campaignType ?? ''}</span>
          <span class="badge">${c.status ?? ''}</span>
          ${health}${phase}
        </div>
        <h2>${c.title ?? 'Untitled'}</h2>
        ${c.description ? `<p class="desc">${c.description}</p>` : ''}
      </div>
      ${renderInfoTable(c)}
      ${renderDeliverables(deliverables, total)}
      ${renderNotes(notes)}
      ${renderLog(log)}
      ${c.impactSummary ? `<div class="impact"><strong>Impact:</strong> ${c.impactSummary}</div>` : ''}
    </div>`;
}

function buildHtml(campaigns: Campaign[], generatedAt: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Campaign Report — ${NODE_NAME}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, serif; font-size: 11pt; color: #111; background: #fff; padding: 20mm; }
  h1 { font-size: 16pt; margin-bottom: 2mm; }
  h2 { font-size: 13pt; margin-bottom: 3mm; }
  h3 { font-size: 10pt; text-transform: uppercase; letter-spacing: 0.05em; color: #555; margin: 6mm 0 3mm; border-bottom: 1px solid #ddd; padding-bottom: 1mm; }
  .doc-header { border-bottom: 2px solid #111; padding-bottom: 4mm; margin-bottom-8mm; }
  .doc-meta { font-size: 9pt; color: #666; margin-top: 1mm; }
  .campaign { margin-top: 10mm; padding-top: 8mm; border-top: 2px solid #111; page-break-inside: avoid; }
  .campaign-header { margin-bottom: 4mm; }
  .campaign-meta { display: flex; flex-wrap: wrap; gap: 2mm; margin-bottom: 2mm; }
  .ref { font-family: monospace; font-size: 9pt; color: #888; }
  .badge { font-size: 8pt; border: 1px solid #ccc; padding: 0.5mm 2mm; border-radius: 2mm; text-transform: uppercase; letter-spacing: 0.04em; }
  .health-green { border-color: #16a34a; color: #16a34a; }
  .health-amber { border-color: #d97706; color: #d97706; }
  .health-red { border-color: #dc2626; color: #dc2626; }
  .desc { font-size: 10pt; color: #444; margin-top: 2mm; }
  .info-table { width: 100%; border-collapse: collapse; margin-top: 3mm; font-size: 10pt; }
  .info-table td { padding: 1.5mm 2mm; border-bottom: 1px solid #eee; }
  .info-table td:first-child { font-weight: bold; width: 38%; color: #555; }
  .deliverables-table { width: 100%; border-collapse: collapse; font-size: 9pt; }
  .deliverables-table th { text-align: left; padding: 1.5mm 2mm; background: #f5f5f5; border-bottom: 1px solid #ccc; }
  .deliverables-table td { padding: 1.5mm 2mm; border-bottom: 1px solid #eee; }
  .status-certified td:nth-child(2) { color: #16a34a; font-weight: bold; }
  .status-disputed td:nth-child(2) { color: #dc2626; font-weight: bold; }
  .progress-label { font-size: 9pt; font-weight: normal; color: #16a34a; margin-left: 3mm; }
  .notice-entry { margin-bottom: 3mm; padding: 2mm 3mm; border-left: 3px solid #d97706; background: #fffbeb; }
  .notice-meta { font-size: 9pt; color: #92400e; display: flex; flex-wrap: wrap; gap: 3mm; margin-bottom: 1mm; }
  .notice-entry p { font-size: 10pt; }
  .log { font-size: 10pt; }
  .log-entry { display: flex; gap: 4mm; padding: 1.5mm 0; border-bottom: 1px solid #f0f0f0; }
  .log-date { color: #888; white-space: nowrap; min-width: 30mm; }
  .impact { margin-top: 4mm; padding: 3mm 4mm; background: #f0fdf4; border-left: 3px solid #16a34a; font-size: 10pt; }
  @media print {
    body { padding: 0; }
    .no-print { display: none; }
    .campaign { page-break-before: auto; }
  }
</style>
</head>
<body>
  <div class="doc-header">
    <h1>Campaign Field Report</h1>
    <p class="doc-meta">${NODE_NAME} &nbsp;·&nbsp; Generated ${new Date(generatedAt).toLocaleString('en-ZA')} &nbsp;·&nbsp; ${campaigns.length} campaign${campaigns.length !== 1 ? 's' : ''}</p>
  </div>
  <div class="no-print" style="margin:4mm 0;font-size:9pt;color:#888;">
    Press <strong>Ctrl+P</strong> (or Cmd+P) → Save as PDF
  </div>
  ${campaigns.map(renderCampaign).join('')}
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get('token');

  if (!token || token !== process.env.SANITY_API_READ_TOKEN) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const slug = searchParams.get('slug');
  const statusFilter = searchParams.get('status');
  const typeFilter = searchParams.get('type');

  let campaigns: Campaign[];

  if (slug) {
    const single = await client.fetch<Campaign | null>(printQuery, { slug });
    campaigns = single ? [single] : [];
  } else {
    let all = await client.fetch<Campaign[]>(allPrintQuery);
    if (statusFilter) all = all.filter((c) => c.status === statusFilter);
    if (typeFilter) all = all.filter((c) => c.campaignType === typeFilter);
    campaigns = all;
  }

  if (campaigns.length === 0) {
    return new NextResponse('No campaigns found', { status: 404 });
  }

  const generatedAt = new Date().toISOString();
  const html = buildHtml(campaigns, generatedAt);

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
