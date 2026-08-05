import { type NextRequest, NextResponse } from 'next/server';
import {
  NODE_ID,
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
    location: { province: NODE_PROVINCE, municipality: NODE_MUNICIPALITY },
    contractVersion: '1.0',
    capabilities: [
      'records',
      'notices',
      'participation',
      'evidence',
      'commercial',
      'tcrs',
      'lineage',
    ],
    timestamp: new Date().toISOString(),
  });
}
