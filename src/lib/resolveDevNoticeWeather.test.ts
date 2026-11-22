import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  fetchWeather: vi.fn(),
  fetch: vi.fn(),
}));

vi.mock('@/lib/weather', () => ({ fetchWeather: mocks.fetchWeather }));
vi.mock('@/env/clientEnv', () => ({
  clientEnv: { NEXT_PUBLIC_SITE_URL: 'https://example.com' },
}));

vi.stubGlobal('fetch', mocks.fetch);

import { resolveDevNoticeWeather } from './resolveDevNoticeWeather';

const WEATHER = {
  type: 'historical' as const,
  condition: 'Clear sky',
  temperatureCelsius: 22,
  tempMinCelsius: 15,
  tempMaxCelsius: 28,
  rainfallMm: 0,
  windKmh: 10,
  humidityPercent: 45,
  uvIndex: 6,
  fetchedAt: '2026-01-01T00:00:00Z',
};

function makeNotice(overrides: {
  publishDate?: string | null;
  commentDeadline?: string | null;
  weatherContext?: unknown;
  geopoint?: { lat: unknown; lng: unknown } | null;
  areaGeopoint?: { lat: unknown; lng: unknown } | null;
}) {
  return {
    _id: 'dev-notice-1',
    publishDate:
      'publishDate' in overrides ? overrides.publishDate : '2026-01-01',
    commentDeadline: overrides.commentDeadline ?? null,
    weatherContext: overrides.weatherContext ?? null,
    geopoint: overrides.geopoint ?? null,
    relatedArea:
      overrides.areaGeopoint !== undefined
        ? { geopoint: overrides.areaGeopoint }
        : null,
  };
}

describe('resolveDevNoticeWeather (Phase 2.3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.fetch.mockResolvedValue({ ok: true });
  });

  it('uses site geopoint when valid — role is site', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER);
    const result = await resolveDevNoticeWeather(
      makeNotice({ geopoint: { lat: -27.756, lng: 29.931 } })
    );
    expect(result).not.toBeNull();
    expect(result?.coordinateRole).toBe('site');
    expect(result?.coordinateSource).toBe('Sanity developmentNotice.geopoint');
    expect(mocks.fetchWeather).toHaveBeenCalledWith(
      '2026-01-01',
      -27.756,
      29.931
    );
  });

  it('falls back to area geopoint when site geopoint absent — role is area-reference', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER);
    const result = await resolveDevNoticeWeather(
      makeNotice({ geopoint: null, areaGeopoint: { lat: -27.8, lng: 30.0 } })
    );
    expect(result?.coordinateRole).toBe('area-reference');
    expect(result?.coordinateSource).toBe('Sanity relatedArea.geopoint');
    expect(mocks.fetchWeather).toHaveBeenCalledWith('2026-01-01', -27.8, 30.0);
  });

  it('site geopoint takes precedence over area geopoint', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER);
    const result = await resolveDevNoticeWeather(
      makeNotice({
        geopoint: { lat: -27.756, lng: 29.931 },
        areaGeopoint: { lat: -27.8, lng: 30.0 },
      })
    );
    expect(result?.coordinateRole).toBe('site');
    expect(mocks.fetchWeather).toHaveBeenCalledWith(
      '2026-01-01',
      -27.756,
      29.931
    );
  });

  it('returns null when neither geopoint is valid', async () => {
    const result = await resolveDevNoticeWeather(
      makeNotice({ geopoint: null, areaGeopoint: null })
    );
    expect(result).toBeNull();
    expect(mocks.fetchWeather).not.toHaveBeenCalled();
  });

  it('returns null when date is missing', async () => {
    const result = await resolveDevNoticeWeather(
      makeNotice({
        publishDate: null,
        commentDeadline: null,
        geopoint: { lat: -27.756, lng: 29.931 },
      })
    );
    expect(result).toBeNull();
    expect(mocks.fetchWeather).not.toHaveBeenCalled();
  });

  it('uses commentDeadline as fallback date when publishDate is null', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER);
    await resolveDevNoticeWeather(
      makeNotice({
        publishDate: null,
        commentDeadline: '2026-03-01',
        geopoint: { lat: -27.756, lng: 29.931 },
      })
    );
    expect(mocks.fetchWeather).toHaveBeenCalledWith(
      '2026-03-01',
      -27.756,
      29.931
    );
  });

  it('accepts zero coordinates as valid (lat=0)', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER);
    const result = await resolveDevNoticeWeather(
      makeNotice({ geopoint: { lat: 0, lng: 29.931 } })
    );
    expect(result?.coordinateRole).toBe('site');
    expect(mocks.fetchWeather).toHaveBeenCalledWith('2026-01-01', 0, 29.931);
  });

  it('accepts zero coordinates as valid (lng=0)', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER);
    const result = await resolveDevNoticeWeather(
      makeNotice({ geopoint: { lat: -27.756, lng: 0 } })
    );
    expect(result?.coordinateRole).toBe('site');
    expect(mocks.fetchWeather).toHaveBeenCalledWith('2026-01-01', -27.756, 0);
  });

  it('rejects NaN site geopoint and falls back to area', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER);
    const result = await resolveDevNoticeWeather(
      makeNotice({
        geopoint: { lat: NaN, lng: 29.931 },
        areaGeopoint: { lat: -27.8, lng: 30.0 },
      })
    );
    expect(result?.coordinateRole).toBe('area-reference');
    expect(mocks.fetchWeather).toHaveBeenCalledWith('2026-01-01', -27.8, 30.0);
  });

  it('returns null when fetchWeather fails', async () => {
    mocks.fetchWeather.mockResolvedValue(null);
    const result = await resolveDevNoticeWeather(
      makeNotice({ geopoint: { lat: -27.756, lng: 29.931 } })
    );
    expect(result).toBeNull();
  });

  it('fires weather-patch when weatherContext not yet stored', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER);
    await resolveDevNoticeWeather(
      makeNotice({ geopoint: { lat: -27.756, lng: 29.931 } })
    );
    expect(mocks.fetch).toHaveBeenCalledWith(
      'https://example.com/api/weather-patch',
      expect.objectContaining({ method: 'POST' })
    );
    const body = JSON.parse(
      (mocks.fetch.mock.calls[0][1] as { body: string }).body
    );
    expect(body.coordinateRole).toBe('site');
    expect(body.coordinateSource).toBe('Sanity developmentNotice.geopoint');
  });

  it('does not fire weather-patch when weatherContext already stored', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER);
    await resolveDevNoticeWeather(
      makeNotice({
        geopoint: { lat: -27.756, lng: 29.931 },
        weatherContext: { fetchedAt: '2026-01-01T00:00:00Z' },
      })
    );
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it('weather-patch includes area-reference role when area fallback used', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER);
    await resolveDevNoticeWeather(
      makeNotice({ geopoint: null, areaGeopoint: { lat: -27.8, lng: 30.0 } })
    );
    const body = JSON.parse(
      (mocks.fetch.mock.calls[0][1] as { body: string }).body
    );
    expect(body.coordinateRole).toBe('area-reference');
    expect(body.coordinateSource).toBe('Sanity relatedArea.geopoint');
  });
});
