import { useAirQuality } from '../../store/weatherStore.ts';
import { airQuality } from '../../../../core/utils/temp.ts';

export function AqiBadge() {
  const aqiData = useAirQuality();

  if (!aqiData) {
    return null;
  }

  const { level, color, description } = airQuality.getAQILevel(aqiData.aqi);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'aqi-good';
      case 'yellow':
        return 'aqi-moderate';
      case 'orange':
        return 'aqi-unhealthy-sensitive';
      case 'red':
        return 'aqi-unhealthy';
      case 'purple':
        return 'aqi-very-unhealthy';
      default:
        return 'aqi-hazardous';
    }
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Calidad del aire
          </h3>
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {aqiData.aqi}
            </div>
            <div>
              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getColorClasses(color)}`}>
                {level}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </div>
            </div>
          </div>
        </div>

        {/* Air quality details */}
        <div className="text-right">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            {aqiData.pm25 > 0 && (
              <div>PM2.5: {aqiData.pm25.toFixed(1)} μg/m³</div>
            )}
            {aqiData.pm10 > 0 && (
              <div>PM10: {aqiData.pm10.toFixed(1)} μg/m³</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}