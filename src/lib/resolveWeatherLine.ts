import { clientEnv } from '@/env/clientEnv';
import { fetchWeather } from '@/lib/weather';

function isFiniteCoord(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function extractCoords(
  relatedArea: unknown
): { lat: number; lng: number } | null {
  if (!relatedArea || typeof relatedArea !== 'object') return null;
  const area = relatedArea as Record<string, unknown>;
  const geo = area.geopoint;
  if (!geo || typeof geo !== 'object') return null;
  const g = geo as Record<string, unknown>;
  if (!isFiniteCoord(g.lat) || !isFiniteCoord(g.lng)) return null;
  return { lat: g.lat, lng: g.lng };
}

export async function resolveWeatherLine(notice: {
  _id: string;
  date: string | null | undefined;
  weatherContext?: unknown;
  relatedArea?: unknown;
}): Promise<string | null> {
  if (!notice.date) return null;
  const coords = extractCoords(notice.relatedArea);
  if (!coords) return null;
  const w = await fetchWeather(notice.date, coords.lat, coords.lng);
  if (!w) return null;
  if (!notice.weatherContext) {
    fetch(`${clientEnv.NEXT_PUBLIC_SITE_URL}/api/weather-patch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: notice._id,
        date: notice.date,
        lat: coords.lat,
        lng: coords.lng,
        coordinateRole: 'area-reference',
        coordinateSource: 'Sanity relatedArea.geopoint',
      }),
    }).catch(() => null);
  }
  return `${w.temperatureCelsius}°C · ${w.condition}${w.type === 'forecast' ? ' (forecast)' : ' (recorded)'}`;
}
