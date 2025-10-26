import { useHourlyForecast } from '../../store/weatherStore.ts';
import { useTemperatureUnit } from '../../../places/placesStore.ts';
import { temperature } from '../../../../core/utils/temp.ts';

export function HourlyStrip() {
  const hourly = useHourlyForecast();
  const temperatureUnit = useTemperatureUnit();

  if (!hourly.length) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        No hay datos de pronóstico por horas disponibles
      </div>
    );
  }

  return (
    <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-4">
      {hourly.slice(0, 24).map((hour, index) => {
        const tempValue = temperature.convert(hour.temperature, 'celsius', temperatureUnit);
        const time = new Date(hour.timestamp * 1000);
        const isCurrentHour = index === 0;

        return (
          <div
            key={hour.timestamp}
            className={`flex-shrink-0 text-center p-4 rounded-2xl min-w-[90px] transition-all duration-300 ${
              isCurrentHour
                ? 'bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-xl scale-105'
                : 'bg-white/60 dark:bg-slate-700/50 backdrop-blur-sm border border-white/30 hover:bg-gradient-to-b hover:from-white/80 hover:to-blue-50/80 dark:hover:bg-slate-600/60 hover:scale-102 hover:shadow-lg'
            }`}
          >
            {/* Time */}
            <div className={`text-sm mb-3 font-medium ${
              isCurrentHour ? 'text-blue-100' : 'text-slate-600 dark:text-slate-300'
            }`}>
              {isCurrentHour ? 'Ahora' : time.toLocaleTimeString('es-ES', {
                hour: 'numeric',
              })}
            </div>

            {/* Weather icon */}
            <div className="text-3xl mb-3 filter drop-shadow-sm">
              {getWeatherIcon(hour.condition.id)}
            </div>

            {/* Temperature */}
            <div className={`font-bold text-lg mb-2 ${
              isCurrentHour ? 'text-white' : 'text-slate-800 dark:text-slate-100'
            }`}>
              {temperature.format(tempValue, temperatureUnit)}
            </div>

            {/* Precipitation probability */}
            {hour.precipitationProbability > 0 && (
              <div className={`text-xs flex items-center justify-center ${
                isCurrentHour ? 'text-blue-200' : 'text-blue-600 dark:text-blue-400'
              }`}>
                <span className="mr-1">💧</span>
                {hour.precipitationProbability}%
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getWeatherIcon(conditionId: number): string {
  // Simple emoji icons based on condition
  if (conditionId === 800) return '☀️';
  if (conditionId <= 804) return '☁️';
  if (conditionId >= 500 && conditionId < 600) return '🌧️';
  if (conditionId >= 600 && conditionId < 700) return '❄️';
  if (conditionId >= 200 && conditionId < 300) return '⛈️';
  if (conditionId >= 700 && conditionId < 800) return '🌫️';
  return '☀️';
}