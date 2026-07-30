import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { clientEnv } from '@/env/clientEnv';
import { serverEnv } from '@/env/serverEnv';
import { fetchWeather } from '@/lib/weather';

export async function POST(req: NextRequest) {
  const writeToken = serverEnv.SANITY_API_WRITE_TOKEN;
  if (!writeToken) {
    return NextResponse.json({ error: 'No write token' }, { status: 503 });
  }

  const body = await req.json();
  const { _id, date, lat, lng } = body as {
    _id: string;
    date: string;
    lat: number;
    lng: number;
  };

  if (!_id || !date || lat == null || lng == null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const weather = await fetchWeather(date, lat, lng);
  if (!weather) {
    return NextResponse.json(
      { error: 'Weather fetch failed' },
      { status: 502 }
    );
  }

  const writeClient = createClient({
    projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: clientEnv.NEXT_PUBLIC_SANITY_API_VERSION,
    useCdn: false,
    token: writeToken,
  });

  await writeClient
    .patch(_id)
    .set({ weatherContext: weather })
    .commit({ autoGenerateArrayKeys: true });

  return NextResponse.json({ ok: true, type: weather.type });
}
