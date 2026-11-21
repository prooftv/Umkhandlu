import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';
import { authenticate } from '../_auth';

export const dynamic = 'force-dynamic';

// noticeCount includes both community notices (_type=="notice") and
// statutory development notices (_type=="developmentNotice").
const healthQuery = `{
  "recordCount": count(*[_type == "record"]),
  "noticeCount": count(*[_type == "notice"]) + count(*[_type == "developmentNotice"])
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
      version: '1.0',
      recordCount: data.recordCount ?? 0,
      noticeCount: data.noticeCount ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: 'degraded',
        version: '1.0',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
