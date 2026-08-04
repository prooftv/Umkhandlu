import { type NextRequest, NextResponse } from 'next/server';
import { authenticate } from '../_auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  return NextResponse.json({
    id: 'umkhandlu-khathide-001',
    name: 'Umkhandlu — Khathide Traditional Council',
    authority: 'Khathide Traditional Council',
    location: 'Nquthu, KwaZulu-Natal, South Africa',
    version: '1.0.0',
    contractVersion: '1.0',
    capabilities: [
      'health',
      'governance',
      'participation',
      'evidence',
      'commercial',
      'tcrs',
      'institutional-memory',
    ],
    timezone: 'Africa/Johannesburg',
    description:
      'Community digital platform for traditional councils, youth programs, and local governance. Serves Khathide Traditional Council and surrounding areas.',
    website: process.env.NEXT_PUBLIC_SITE_URL ?? null,
  });
}
