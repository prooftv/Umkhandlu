import { clientEnv } from '@/env/clientEnv';
import { fetchWeather } from '@/lib/weather';

type GeoInput =
  | { _type?: string; lat: unknown; lng: unknown }
  | null
  | undefined;

function isFiniteCoord(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export async function resolveWeatherLine(notice: {
  _id: string;
  date: string | null | undefined;
  weatherContext?: unknown;
  relatedArea?: { geopoint?: GeoInput } | null;
}): Promise<string | null> {
  const geo = notice.relatedArea?.geopoint;
  if (!notice.date || !isFiniteCoord(geo?.lat) || !isFiniteCoord(geo?.lng)) {
    return null;
  }
  const w = await fetchWeather(notice.date, geo.lat, geo.lng);
  if (!w) return null;
  if (!notice.weatherContext) {
    fetch(`${clientEnv.NEXT_PUBLIC_SITE_URL}/api/weather-patch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: notice._id,
        date: notice.date,
        lat: geo.lat,
        lng: geo.lng,
        coordinateRole: 'area-reference',
        coordinateSource: 'Sanity relatedArea.geopoint',
      }),
    }).catch(() => null);
  }
  return `${w.temperatureCelsius}°C · ${w.condition}${w.type === 'forecast' ? ' (forecast)' : ' (recorded)'}`;
}
