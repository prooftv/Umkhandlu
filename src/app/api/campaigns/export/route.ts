import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';

const exportQuery = `*[_type == "campaign"] | order(startDate desc) {
  title,
  "slug": slug.current,
  campaignType,
  status,
  projectPhase,
  description,
  targetAudience,
  tags,
  startDate,
  endDate,
  beneficiaries,
  impactSummary,
  deliverables,
  deliverablesCertified,
  totalDeliverables,
  "deliverableProgress": select(
    defined(totalDeliverables) && totalDeliverables > 0 => round((count(coalesce(deliverablesCertified, deliverables)) / totalDeliverables) * 100),
    null
  ),
  "sponsor": sponsor->{ name, sponsorType, website },
  "contactPerson": contactPerson->{ firstName, lastName, role },
  "relatedAreas": relatedAreas[]->{ name, "slug": slug.current },
  "relatedProgram": relatedProgram->{ title, "slug": slug.current },
  "noticeCount": count(*[_type == "notice" && references(^._id)]),
  "opportunityCount": count(*[_type == "opportunity" && references(^._id)]),
  "developmentNoticeCount": count(*[_type == "developmentNotice" && references(^._id)]),
  "relatedOpportunities": *[_type == "opportunity" && references(^._id) && (deadline > now() || !defined(deadline))] | order(featured desc, deadline asc) [0...10] {
    title,
    "slug": slug.current,
    opportunityType,
    organization,
    deadline
  },
  "relatedDevelopmentNotices": *[_type == "developmentNotice" && references(^._id) && status in ["open", "closed"]] | order(commentDeadline asc) [0...10] {
    title,
    "slug": slug.current,
    status,
    commentDeadline
  },
  "verifications": *[_type == "conflictLog" && references(^._id)] | order(detectedAt desc) [0...10] {
    _id,
    field,
    displayTruth,
    resolutionNote,
    resolutionState,
    detectedAt,
    resolvedAt,
    "claims": claims[]{ source, value, date, evidence }
  },
  "verificationCount": count(*[_type == "conflictLog" && references(^._id)]),
  "communityNoteCount": count(communityNote),
  "photoCount": count(gallery)
}`;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get('token');
  const expectedToken = process.env.SANITY_API_READ_TOKEN;

  if (!token || token !== expectedToken) {
    return NextResponse.json(
      { error: 'Unauthorized. Pass ?token=<SANITY_API_READ_TOKEN>' },
      { status: 401 }
    );
  }

  const status = searchParams.get('status');
  const type = searchParams.get('type');

  const allCampaigns = await client.fetch(exportQuery);

  let filtered = allCampaigns;
  if (status) {
    filtered = filtered.filter((c: { status: string }) => c.status === status);
  }
  if (type) {
    filtered = filtered.filter(
      (c: { campaignType: string }) => c.campaignType === type
    );
  }

  const summary = {
    total: filtered.length,
    totalBeneficiaries: filtered.reduce(
      (sum: number, c: { beneficiaries?: number }) =>
        sum + (c.beneficiaries || 0),
      0
    ),
  };

  // Redact and truncate sensitive fields for export (in-place)
  type Claim = {
    source?: string;
    value?: string;
    date?: string;
    evidence?: unknown;
  };
  type Verification = {
    _id?: string;
    field?: string;
    displayTruth?: string;
    resolutionNote?: unknown;
    resolutionState?: string;
    detectedAt?: string;
    resolvedAt?: string;
    claims?: Claim[];
    [k: string]: unknown;
  };
  type CampaignExport = {
    verifications?: Verification[];
    [k: string]: unknown;
  };

  filtered.forEach((c: CampaignExport) => {
    if (Array.isArray(c.verifications)) {
      c.verifications = c.verifications.map((v) => {
        const redactedV: Verification = { ...v };
        if (redactedV.resolutionNote) {
          redactedV.resolutionNote = String(redactedV.resolutionNote).slice(
            0,
            200
          );
        }
        if (Array.isArray(redactedV.claims)) {
          redactedV.claims = redactedV.claims.map(
            (cl) =>
              ({
                source: cl.source,
                value: cl.value,
                date: cl.date,
                evidenceSummary: cl.evidence
                  ? String(cl.evidence).slice(0, 200)
                  : undefined,
              }) as unknown as Claim
          );
        }
        return redactedV;
      });
    }
  });

  return NextResponse.json(
    { exportedAt: new Date().toISOString(), summary, campaigns: filtered },
    {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Disposition': 'inline; filename="campaigns-export.json"',
      },
    }
  );
}
