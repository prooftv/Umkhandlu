import { clientEnv } from '@/env/clientEnv';
import { fetchWeather, type WeatherSnapshot } from '@/lib/weather';

type GeoInput = { lat: unknown; lng: unknown } | null | undefined;

function isFiniteCoord(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export type DevNoticeWeatherResult = WeatherSnapshot & {
  coordinateRole: 'site' | 'area-reference';
  coordinateSource: string;
};

/**
 * Resolve weather for a development notice using the Phase 2.2-A resolution order:
 * 1. developmentNotice.geopoint (role: site)
 * 2. relatedArea.geopoint (role: area-reference)
 * 3. Neither valid → return null, do not patch
 *
 * coordinateRole and coordinateSource are stored alongside the snapshot.
 * An area-reference coordinate is never labelled as the exact site location.
 */
export async function resolveDevNoticeWeather(notice: {
  _id: string;
  publishDate?: string | null;
  commentDeadline?: string | null;
  weatherContext?: unknown;
  geopoint?: GeoInput;
  relatedArea?: { geopoint?: GeoInput } | null;
}): Promise<DevNoticeWeatherResult | null> {
  // Use publishDate as the reference date; fall back to commentDeadline
  const date = notice.publishDate ?? notice.commentDeadline ?? null;
  if (!date) return null;

  let lat: number;
  let lng: number;
  let coordinateRole: 'site' | 'area-reference';
  let coordinateSource: string;

  const siteGeo = notice.geopoint;
  if (isFiniteCoord(siteGeo?.lat) && isFiniteCoord(siteGeo?.lng)) {
    lat = siteGeo.lat as number;
    lng = siteGeo.lng as number;
    coordinateRole = 'site';
    coordinateSource = 'Sanity developmentNotice.geopoint';
  } else {
    const areaGeo = notice.relatedArea?.geopoint;
    if (isFiniteCoord(areaGeo?.lat) && isFiniteCoord(areaGeo?.lng)) {
      lat = areaGeo.lat as number;
      lng = areaGeo.lng as number;
      coordinateRole = 'area-reference';
      coordinateSource = 'Sanity relatedArea.geopoint';
    } else {
      return null;
    }
  }

  const weather = await fetchWeather(date, lat, lng);
  if (!weather) return null;

  if (!notice.weatherContext) {
    fetch(`${clientEnv.NEXT_PUBLIC_SITE_URL}/api/weather-patch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: notice._id,
        date,
        lat,
        lng,
        coordinateRole,
        coordinateSource,
      }),
    }).catch(() => null);
  }

  return { ...weather, coordinateRole, coordinateSource };
}
