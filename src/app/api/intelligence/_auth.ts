import 'server-only';
import { type NextRequest, NextResponse } from 'next/server';
import { serverEnv } from '@/env/serverEnv';

export function authenticate(request: NextRequest): NextResponse | null {
  const header = request.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const key = serverEnv.INTELLIGENCE_API_KEY;

  if (!key) {
    // No key configured — node is not connected to Control Centre
    return NextResponse.json(
      { error: 'Intelligence API not configured.' },
      { status: 503 }
    );
  }
  if (!token || token !== key) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  return null; // authenticated
}
