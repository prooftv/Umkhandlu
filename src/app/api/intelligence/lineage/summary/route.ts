import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';
import { authenticate } from '../../_auth';

export const dynamic = 'force-dynamic';

// Root records: no parentRecord and no originNotice
// Linked records: have either a parentRecord or originNotice reference
// Layer 5 outputs are derived — we count the source documents that produce them:
//   lineageCertificates + journeyMaps = notices that have produced records
//   proofOfPublication = developmentNotices with proofIssued == true
const q = `{
  "rootRecords":   count(*[_type == "record" && !defined(parentRecord) && !defined(originNotice)]),
  "linkedRecords": count(*[_type == "record" && (defined(parentRecord) || defined(originNotice))]),
  "noticesWithRecords": count(*[_type == "notice" && count(*[_type == "record" && originNotice._ref == ^._id]) > 0]),
  "proofOfPublication": count(*[_type == "developmentNotice" && proofIssued == true])
}`;

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  try {
    const data = await client.fetch<{
      rootRecords: number;
      linkedRecords: number;
      noticesWithRecords: number;
      proofOfPublication: number;
    }>(q);

    return NextResponse.json({
      rootRecords: data.rootRecords ?? 0,
      linkedRecords: data.linkedRecords ?? 0,
      layer5Outputs: {
        lineageCertificates: data.noticesWithRecords ?? 0,
        proofOfPublication: data.proofOfPublication ?? 0,
        journeyMaps: data.noticesWithRecords ?? 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Query failed.' }, { status: 500 });
  }
}
