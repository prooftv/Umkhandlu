import { type NextRequest, NextResponse } from 'next/server';
import { authenticate } from '../_auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  return NextResponse.json({
    id: 'umkhandlu-khathide-001',
    name: 'Umkhandlu — KwaGudlucingo Traditional Council',
    authority: 'Traditional Council',
    location: { province: 'KwaZulu-Natal', municipality: 'Nquthu' },
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
