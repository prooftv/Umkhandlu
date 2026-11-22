import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  fetchWeather: vi.fn(),
  fetch: vi.fn(),
}));

vi.mock('@/lib/weather', () => ({ fetchWeather: mocks.fetchWeather }));
vi.mock('@/env/clientEnv', () => ({
  clientEnv: { NEXT_PUBLIC_SITE_URL: 'https://example.com' },
}));

// Stub global fetch used by the fire-and-forget weather-patch call
vi.stubGlobal('fetch', mocks.fetch);

import { resolveWeatherLine } from './resolveWeatherLine';

const WEATHER_RESULT = {
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
  date?: string | null;
  lat?: unknown;
  lng?: unknown;
  weatherContext?: unknown;
}) {
  const date = 'date' in overrides ? overrides.date : '2026-01-01';
  return {
    _id: 'notice-1',
    date,
    weatherContext: overrides.weatherContext ?? null,
    relatedArea:
      overrides.lat !== undefined || overrides.lng !== undefined
        ? { geopoint: { lat: overrides.lat, lng: overrides.lng } }
        : null,
  };
}

describe('resolveWeatherLine (D-02)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.fetch.mockResolvedValue({ ok: true });
  });

  it('returns a weather line for normal non-zero coordinates', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER_RESULT);
    const result = await resolveWeatherLine(
      makeNotice({ lat: -27.7569, lng: 29.9318 })
    );
    expect(result).toBe('22°C · Clear sky (recorded)');
    expect(mocks.fetchWeather).toHaveBeenCalledWith(
      '2026-01-01',
      -27.7569,
      29.9318
    );
  });

  it('returns a weather line when latitude is exactly 0', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER_RESULT);
    const result = await resolveWeatherLine(
      makeNotice({ lat: 0, lng: 29.9318 })
    );
    expect(result).toBe('22°C · Clear sky (recorded)');
    expect(mocks.fetchWeather).toHaveBeenCalledWith('2026-01-01', 0, 29.9318);
  });

  it('returns a weather line when longitude is exactly 0', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER_RESULT);
    const result = await resolveWeatherLine(
      makeNotice({ lat: -27.7569, lng: 0 })
    );
    expect(result).toBe('22°C · Clear sky (recorded)');
    expect(mocks.fetchWeather).toHaveBeenCalledWith('2026-01-01', -27.7569, 0);
  });

  it('returns a weather line when both coordinates are 0', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER_RESULT);
    const result = await resolveWeatherLine(makeNotice({ lat: 0, lng: 0 }));
    expect(result).toBe('22°C · Clear sky (recorded)');
    expect(mocks.fetchWeather).toHaveBeenCalledWith('2026-01-01', 0, 0);
  });

  it('returns null when date is missing', async () => {
    const result = await resolveWeatherLine(
      makeNotice({ date: null, lat: -27.7569, lng: 29.9318 })
    );
    expect(result).toBeNull();
    expect(mocks.fetchWeather).not.toHaveBeenCalled();
  });

  it('returns null when relatedArea is null', async () => {
    const result = await resolveWeatherLine({
      _id: 'notice-1',
      date: '2026-01-01',
      weatherContext: null,
      relatedArea: null,
    });
    expect(result).toBeNull();
    expect(mocks.fetchWeather).not.toHaveBeenCalled();
  });

  it('returns null when lat is null', async () => {
    const result = await resolveWeatherLine(
      makeNotice({ lat: null, lng: 29.9318 })
    );
    expect(result).toBeNull();
    expect(mocks.fetchWeather).not.toHaveBeenCalled();
  });

  it('returns null when lng is undefined', async () => {
    const result = await resolveWeatherLine(
      makeNotice({ lat: -27.7569, lng: undefined })
    );
    expect(result).toBeNull();
    expect(mocks.fetchWeather).not.toHaveBeenCalled();
  });

  it('returns null when lat is NaN', async () => {
    const result = await resolveWeatherLine(
      makeNotice({ lat: NaN, lng: 29.9318 })
    );
    expect(result).toBeNull();
    expect(mocks.fetchWeather).not.toHaveBeenCalled();
  });

  it('returns null when lat is Infinity', async () => {
    const result = await resolveWeatherLine(
      makeNotice({ lat: Infinity, lng: 29.9318 })
    );
    expect(result).toBeNull();
    expect(mocks.fetchWeather).not.toHaveBeenCalled();
  });

  it('returns null when fetchWeather returns null', async () => {
    mocks.fetchWeather.mockResolvedValue(null);
    const result = await resolveWeatherLine(
      makeNotice({ lat: -27.7569, lng: 29.9318 })
    );
    expect(result).toBeNull();
  });

  it('fires weather-patch when weatherContext is not yet stored', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER_RESULT);
    await resolveWeatherLine(makeNotice({ lat: -27.7569, lng: 29.9318 }));
    expect(mocks.fetch).toHaveBeenCalledWith(
      'https://example.com/api/weather-patch',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('does not fire weather-patch when weatherContext is already stored', async () => {
    mocks.fetchWeather.mockResolvedValue(WEATHER_RESULT);
    await resolveWeatherLine(
      makeNotice({
        lat: -27.7569,
        lng: 29.9318,
        weatherContext: { fetchedAt: '2026-01-01T00:00:00Z' },
      })
    );
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it('labels forecast type correctly', async () => {
    mocks.fetchWeather.mockResolvedValue({
      ...WEATHER_RESULT,
      type: 'forecast',
    });
    const result = await resolveWeatherLine(
      makeNotice({ lat: -27.7569, lng: 29.9318 })
    );
    expect(result).toBe('22°C · Clear sky (forecast)');
  });
});
