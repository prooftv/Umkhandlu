import { clientEnv } from '@/env/clientEnv';
import { fetchWeather } from '@/lib/weather';

type GeoInput = { lat: unknown; lng: unknown } | null | undefined;

/**
 * Returns true only when value is a finite number.
 * Correctly handles 0, rejects null/undefined/NaN/Infinity.
 */
function isFiniteCoord(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Resolve a weather summary line for a notice lineage/journey print page.
 *
 * Uses relatedArea.geopoint when both coordinates are finite numbers.
 * Returns null (no weather line) when date is absent or coordinates are
 * missing or non-finite — including when lat or lng is exactly 0.
 *
 * D-02 fix: replaced falsy guards (!geo?.lat, !geo?.lng) with
 * Number.isFinite() checks so that valid zero coordinates are not rejected.
 */
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
      }),
    }).catch(() => null);
  }
  return `${w.temperatureCelsius}°C · ${w.condition}${w.type === 'forecast' ? ' (forecast)' : ' (recorded)'}`;
}
