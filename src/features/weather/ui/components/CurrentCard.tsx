import { Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { useCurrentWeather } from '../../store/weatherStore.ts';
import { useTemperatureUnit, useWindSpeedUnit } from '../../../places/placesStore.ts';
import { temperature, windSpeed, weatherConditions } from '../../../../core/utils/temp.ts';
import { useI18n } from '../../../../core/hooks/useI18n.ts';

export function CurrentCard() {
  const current = useCurrentWeather();
  const temperatureUnit = useTemperatureUnit();
  const windSpeedUnit = useWindSpeedUnit();
  const { t } = useI18n();

  if (!current) {
    return (
      <div className="card p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          {t('weather.noData')}
        </div>
      </div>
    );
  }

  const tempValue = temperature.convert(current.temperature, 'celsius', temperatureUnit);
  const feelsLikeValue = temperature.convert(current.feelsLike, 'celsius', temperatureUnit);
  const windSpeedValue = windSpeed.convert(current.windSpeed, 'kmh', windSpeedUnit);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 text-white shadow-2xl">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/5 rounded-full"></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
      
      <div className="relative p-8">
        {/* Location and time */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{current.location.name}</h1>
          <p className="text-blue-100 text-lg opacity-90 flex items-center">
            <div className="w-1 h-1 bg-blue-200 rounded-full mr-2"></div>
            {new Date(current.timestamp * 1000).toLocaleString('es-ES', {
              weekday: 'long',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Main temperature and condition */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex-1">
            <div className="text-7xl font-thin mb-3 tracking-tight">
              {temperature.format(tempValue, temperatureUnit)}
            </div>
            <div className="text-xl text-blue-100 mb-2">
              {t('weather.feelsLike')} {temperature.format(feelsLikeValue, temperatureUnit)}
            </div>
            <div className="text-xl font-medium text-blue-50">
              {weatherConditions.getDescription(current.condition.id)}
            </div>
          </div>
          
          {/* Weather icon */}
          <div className="text-8xl opacity-90 ml-4">
            {getWeatherIcon(current.condition.id)}
          </div>
        </div>

        {/* Weather details grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-3">
              <Droplets className="w-6 h-6 text-blue-100" />
            </div>
            <div className="text-sm text-blue-200 mb-1">{t('weather.humidity')}</div>
            <div className="text-2xl font-bold">{current.humidity}%</div>
          </div>
          
          <div className="text-center bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-3">
              <Wind className="w-6 h-6 text-blue-100" />
            </div>
            <div className="text-sm text-blue-200 mb-1">{t('weather.wind')}</div>
            <div className="text-2xl font-bold">
              {windSpeed.format(windSpeedValue, windSpeedUnit)}
            </div>
          </div>
          
          <div className="text-center bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-3">
              <Eye className="w-6 h-6 text-blue-100" />
            </div>
            <div className="text-sm text-blue-200 mb-1">{t('weather.visibility')}</div>
            <div className="text-2xl font-bold">{Math.round(current.visibility / 1000)} km</div>
          </div>
        </div>

        {/* Additional details */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center bg-white/5 rounded-xl p-4">
            <div className="bg-white/20 rounded-full p-2 mr-4">
              <Thermometer className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-blue-200">{t('weather.pressure')}</div>
              <div className="text-lg font-semibold">{current.pressure} hPa</div>
            </div>
          </div>
          
          <div className="flex items-center bg-white/5 rounded-xl p-4">
            <div className="bg-white/20 rounded-full p-2 mr-4 text-lg">
              ☀️
            </div>
            <div>
              <div className="text-sm text-blue-200">{t('weather.uvIndex')}</div>
              <div className="text-lg font-semibold">{current.uvIndex || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
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