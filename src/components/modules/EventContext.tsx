import type { WeatherSnapshot } from '@/lib/weather';

const conditionIcon: Record<string, string> = {
  'Clear sky': '☀️',
  'Mainly clear': '🌤',
  'Partly cloudy': '⛅',
  Overcast: '☁️',
  Foggy: '🌫',
  'Icy fog': '🌫',
  'Light drizzle': '🌦',
  Drizzle: '🌦',
  'Heavy drizzle': '🌧',
  'Light rain': '🌧',
  Rain: '🌧',
  'Heavy rain': '🌧',
  'Light snow': '🌨',
  Snow: '❄️',
  'Heavy snow': '❄️',
  'Rain showers': '🌦',
  'Heavy showers': '🌧',
  'Violent showers': '⛈',
  Thunderstorm: '⛈',
  'Thunderstorm with hail': '⛈',
  'Thunderstorm with heavy hail': '⛈',
};

function icon(condition: string) {
  return conditionIcon[condition] ?? '🌡';
}

export default function EventContext({
  weather,
  location,
  attendance,
}: {
  weather: WeatherSnapshot | null;
  location?: string | null;
  attendance?: number | null;
}) {
  if (!weather && !location && !attendance) return null;

  const isForecast = weather?.type === 'forecast';

  return (
    <div className="mt-6 mb-8 rounded-xl border border-gray-100 bg-gray-50 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
        Event Context
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {weather && (
          <>
            <div className="col-span-2 sm:col-span-3 flex items-center gap-2">
              <span className="text-2xl">{icon(weather.condition)}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {weather.condition}
                </p>
                <p className="text-[10px] text-gray-400">
                  {isForecast
                    ? '🔮 Forecast (predicted)'
                    : '✓ Recorded conditions'}
                  {' · '}
                  Open-Meteo
                  {isForecast ? ' forecast' : ' historical archive'}
                </p>
              </div>
            </div>

            <Stat
              label="Temperature"
              value={`${weather.temperatureCelsius}°C`}
              sub={`${weather.tempMinCelsius}–${weather.tempMaxCelsius}°C`}
            />
            <Stat label="Rainfall" value={`${weather.rainfallMm} mm`} />
            <Stat label="Wind" value={`${weather.windKmh} km/h`} />
            <Stat label="Humidity" value={`${weather.humidityPercent}%`} />
            <Stat label="UV Index" value={weather.uvIndex.toString()} />
          </>
        )}

        {location && (
          <div className="col-span-2 sm:col-span-3 flex items-start gap-2 pt-1 border-t border-gray-100 mt-1">
            <span className="text-base mt-0.5">📍</span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Venue
              </p>
              <p className="text-sm text-gray-700">{location}</p>
            </div>
          </div>
        )}

        {attendance != null && (
          <div className="flex items-start gap-2">
            <span className="text-base mt-0.5">👥</span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Attendance
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {attendance}
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="text-[9px] text-gray-300 mt-4 leading-relaxed">
        Environmental data is supporting context only. It does not form part of
        the official record.
        {weather &&
          ` Captured ${new Date(weather.fetchedAt).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })}.`}
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
      {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
    </div>
  );
}
