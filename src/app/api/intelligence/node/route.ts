import { type NextRequest, NextResponse } from 'next/server';
import {
  NODE_DISTRICT,
  NODE_ID,
  NODE_LOCALITY,
  NODE_MUNICIPALITY,
  NODE_NAME,
  NODE_PROVINCE,
} from '@/lib/siteConfig';
import { authenticate } from '../_auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  return NextResponse.json({
    id: NODE_ID,
    name: NODE_NAME,
    authority: 'Traditional Council',
    location: {
      province: NODE_PROVINCE,
      district: NODE_DISTRICT,
      municipality: NODE_MUNICIPALITY,
      locality: NODE_LOCALITY,
    },
    contractVersion: '1.0',
    capabilities: [
      'governance',
      'participation',
      'evidence',
      'commercial',
      'tcrs',
      'institutional-memory',
      'health',
      'operators',
    ],
    timestamp: new Date().toISOString(),
  });
}
