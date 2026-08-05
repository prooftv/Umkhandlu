import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';
import { authenticate } from '../../_auth';

export const dynamic = 'force-dynamic';

const q = `{
  "total": count(*[_type == "campaign"]),
  "byStatus": {
    "draft":     count(*[_type == "campaign" && status == "draft"]),
    "approved":  count(*[_type == "campaign" && status == "approved"]),
    "active":    count(*[_type == "campaign" && status == "active"]),
    "completed": count(*[_type == "campaign" && status == "completed"]),
    "reported":  count(*[_type == "campaign" && status == "reported"])
  },
  "byHealth": {
    "green": count(*[_type == "campaign" && projectHealth == "green"]),
    "amber": count(*[_type == "campaign" && projectHealth == "amber"]),
    "red":   count(*[_type == "campaign" && projectHealth == "red"])
  },
  "byPhase": {
    "planning":      count(*[_type == "campaign" && projectPhase == "planning"]),
    "procurement":   count(*[_type == "campaign" && projectPhase == "procurement"]),
    "construction":  count(*[_type == "campaign" && projectPhase == "construction"]),
    "commissioning": count(*[_type == "campaign" && projectPhase == "commissioning"]),
    "operational":   count(*[_type == "campaign" && projectPhase == "operational"])
  },
  "activeBudgets": *[_type == "campaign" && status == "active" && defined(budget)] { budget },
  "activeBeneficiaries": *[_type == "campaign" && status == "active" && defined(beneficiaries)] { beneficiaries },
  "sponsorTotal": count(*[_type == "sponsor"]),
  "sponsorsWithActiveCampaigns": count(*[_type == "sponsor" && count(*[_type == "campaign" && status == "active" && sponsor._ref == ^._id]) > 0]),
  "recent": *[_type == "campaign"] | order(_updatedAt desc) [0...10] {
    "id": _id,
    title,
    "type": campaignType,
    status,
    "health": projectHealth,
    "updatedAt": _updatedAt
  }
}`;

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  try {
    const data = await client.fetch(q);

    const totalBudget = (data.activeBudgets ?? []).reduce(
      (s: number, c: { budget: number }) => s + (c.budget ?? 0),
      0
    );
    const totalBeneficiaries = (data.activeBeneficiaries ?? []).reduce(
      (s: number, c: { beneficiaries: number }) => s + (c.beneficiaries ?? 0),
      0
    );

    return NextResponse.json({
      projects: {
        total: data.total ?? 0,
        byStatus: data.byStatus,
        byHealth: data.byHealth,
        byPhase: data.byPhase,
        totalBudget,
        totalBeneficiaries,
      },
      sponsors: {
        total: data.sponsorTotal ?? 0,
        active: data.sponsorsWithActiveCampaigns ?? 0,
      },
      recent: data.recent ?? [],
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Query failed.' }, { status: 500 });
  }
}
