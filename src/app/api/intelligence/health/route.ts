import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';
import { authenticate } from '../_auth';

export const dynamic = 'force-dynamic';

const healthQuery = `{
  "recordCount": count(*[_type == "record"]),
  "noticeCount": count(*[_type == "notice"])
}`;

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  try {
    const data = await client.fetch<{
      recordCount: number;
      noticeCount: number;
    }>(healthQuery);
    return NextResponse.json({
      status: 'healthy',
      lastUpdated: new Date().toISOString(),
      recordCount: data.recordCount ?? 0,
      noticeCount: data.noticeCount ?? 0,
      version: '1.0.0',
    });
  } catch {
    return NextResponse.json(
      {
        status: 'degraded',
        lastUpdated: new Date().toISOString(),
        version: '1.0.0',
      },
      { status: 500 }
    );
  }
}
