export type WeatherSnapshot = {
  type: 'forecast' | 'historical';
  condition: string;
  temperatureCelsius: number;
  tempMinCelsius: number;
  tempMaxCelsius: number;
  rainfallMm: number;
  windKmh: number;
  humidityPercent: number;
  uvIndex: number;
  fetchedAt: string;
};

// WMO weather interpretation codes → human label
const WMO_LABELS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Icy fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Heavy showers',
  82: 'Violent showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
};

function wmoLabel(code: number): string {
  return WMO_LABELS[code] ?? 'Unknown';
}

export async function fetchWeather(
  date: string,
  lat: number,
  lng: number
): Promise<WeatherSnapshot | null> {
  try {
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isFuture = eventDate >= today;

    const dateStr = eventDate.toISOString().split('T')[0];
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lng.toString(),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'wind_speed_10m_max',
        'uv_index_max',
      ].join(','),
      hourly: 'relative_humidity_2m',
      timezone: 'Africa/Johannesburg',
      start_date: dateStr,
      end_date: dateStr,
    });

    const base = isFuture
      ? 'https://api.open-meteo.com/v1/forecast'
      : 'https://archive-api.open-meteo.com/v1/archive';

    const res = await fetch(`${base}?${params}`, {
      next: { revalidate: isFuture ? 3600 : 0 }, // forecast: 1h cache; historical: no revalidate
    });

    if (!res.ok) return null;
    const json = await res.json();

    const d = json.daily;
    if (!d?.weather_code?.[0] === undefined) return null;

    // median hourly humidity for the day
    const hourly: number[] = json.hourly?.relative_humidity_2m ?? [];
    const humidity =
      hourly.length > 0
        ? Math.round(
            hourly.reduce((a: number, b: number) => a + b, 0) / hourly.length
          )
        : 0;

    return {
      type: isFuture ? 'forecast' : 'historical',
      condition: wmoLabel(d.weather_code[0]),
      temperatureCelsius: Math.round(
        (d.temperature_2m_max[0] + d.temperature_2m_min[0]) / 2
      ),
      tempMinCelsius: Math.round(d.temperature_2m_min[0]),
      tempMaxCelsius: Math.round(d.temperature_2m_max[0]),
      rainfallMm: Math.round((d.precipitation_sum[0] ?? 0) * 10) / 10,
      windKmh: Math.round(d.wind_speed_10m_max[0] ?? 0),
      humidityPercent: humidity,
      uvIndex: Math.round(d.uv_index_max?.[0] ?? 0),
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
