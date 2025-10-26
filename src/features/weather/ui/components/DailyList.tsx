import { useDailyForecast } from '../../store/weatherStore.ts';
import { useTemperatureUnit } from '../../../places/placesStore.ts';
import { temperature, dateTime } from '../../../../core/utils/temp.ts';

export function DailyList() {
  const daily = useDailyForecast();
  const temperatureUnit = useTemperatureUnit();

  if (!daily.length) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        No hay datos de pronóstico diario disponibles
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {daily.map((day, index) => {
        const maxTemp = temperature.convert(day.temperatureMax, 'celsius', temperatureUnit);
        const minTemp = temperature.convert(day.temperatureMin, 'celsius', temperatureUnit);
        const isToday = index === 0;
        const isTomorrow = index === 1;

        let dayLabel = '';
        if (isToday) {
          dayLabel = 'Hoy';
        } else if (isTomorrow) {
          dayLabel = 'Mañana';
        } else {
          dayLabel = dateTime.formatDate(day.date);
        }

        return (
          <div
            key={day.date}
            className={`flex items-center justify-between p-5 rounded-2xl transition-all duration-300 ${
              isToday 
                ? 'bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 border-2 border-cyan-400/40 shadow-lg'
                : 'bg-white/50 dark:bg-slate-700/40 backdrop-blur-sm border border-white/30 hover:bg-gradient-to-r hover:from-white/70 hover:to-blue-50/70 dark:hover:bg-slate-600/50 hover:shadow-lg'
            }`}
          >
            {/* Day and condition */}
            <div className="flex items-center flex-1">
              <div className="flex-1">
                <div className={`font-bold text-lg ${
                  isToday ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-100'
                }`}>
                  {dayLabel}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {getConditionDescription(day.condition.id)}
                </div>
              </div>
            </div>

            {/* Weather details */}
            <div className="flex items-center space-x-6">
              {/* Precipitation */}
              {day.precipitationProbability > 0 && (
                <div className="flex items-center text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/50 px-3 py-1 rounded-full">
                  <span className="text-base mr-1">💧</span>
                  <span className="text-sm font-semibold">
                    {day.precipitationProbability}%
                  </span>
                </div>
              )}

              {/* Weather icon */}
              <div className="text-4xl filter drop-shadow-sm">
                {getWeatherIcon(day.condition.id)}
              </div>

              {/* Temperature range */}
              <div className="flex items-center space-x-3 min-w-[120px] justify-end">
                <span className="font-bold text-xl text-slate-800 dark:text-slate-100">
                  {temperature.format(maxTemp, temperatureUnit)}
                </span>
                <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full"></div>
                <span className="font-semibold text-lg text-slate-600 dark:text-slate-300">
                  {temperature.format(minTemp, temperatureUnit)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getWeatherIcon(conditionId: number): string {
  if (conditionId === 800) return '☀️';
  if (conditionId <= 804) return '☁️';
  if (conditionId >= 500 && conditionId < 600) return '🌧️';
  if (conditionId >= 600 && conditionId < 700) return '❄️';
  if (conditionId >= 200 && conditionId < 300) return '⛈️';
  if (conditionId >= 700 && conditionId < 800) return '🌫️';
  return '☀️';
}

function getConditionDescription(conditionId: number): string {
  const descriptions: Record<number, string> = {
    800: 'Despejado',
    801: 'Pocas nubes',
    802: 'Nubes dispersas',
    803: 'Nubes rotas',
    804: 'Nublado',
    500: 'Lluvia ligera',
    501: 'Lluvia moderada',
    502: 'Lluvia intensa',
    600: 'Nieve ligera',
    601: 'Nieve',
    602: 'Nieve intensa',
    200: 'Tormenta',
    701: 'Neblina',
    741: 'Niebla',
  };
  return descriptions[conditionId] || 'Desconocido';
}