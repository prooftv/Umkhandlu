import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';

const exportQuery = `*[_type == "campaign"] | order(startDate desc) {
  title,
  "slug": slug.current,
  campaignType,
  status,
  description,
  targetAudience,
  tags,
  startDate,
  endDate,
  budget,
  beneficiaries,
  impactSummary,
  deliverables,
  "sponsor": sponsor->{ name, sponsorType, website, contactEmail },
  "contactPerson": contactPerson->{ firstName, lastName, role },
  "relatedAreas": relatedAreas[]->{ name, "slug": slug.current },
  "relatedProgram": relatedProgram->{ title, "slug": slug.current },
  "noticeCount": count(*[_type == "notice" && references(^._id)]),
  "photoCount": count(gallery)
}`;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
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
    totalBudget: filtered.reduce(
      (sum: number, c: { budget?: number }) => sum + (c.budget || 0),
      0
    ),
    totalBeneficiaries: filtered.reduce(
      (sum: number, c: { beneficiaries?: number }) =>
        sum + (c.beneficiaries || 0),
      0
    ),
    byStatus: Object.groupBy(filtered, (c: { status: string }) => c.status),
    byType: Object.groupBy(
      filtered,
      (c: { campaignType: string }) => c.campaignType
    ),
  };

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
