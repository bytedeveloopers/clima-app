import { useEffect, useState } from 'react';
import { CurrentCard } from '../components/CurrentCard.tsx';
import { HourlyStrip } from '../components/HourlyStrip.tsx';
import { DailyList } from '../components/DailyList.tsx';
import { AqiBadge } from '../components/AqiBadge.tsx';
import { AlertBanner } from '../components/AlertBanner.tsx';
import { useWeatherStore } from '../../store/weatherStore.ts';
import { geolocation } from '../../../../core/utils/temp.ts';
import { useI18n } from '../../../../core/hooks/useI18n.ts';
import { LanguageToggle } from '../../../../shared/ui/components/LanguageToggle.tsx';
// import { LoadingSkeleton } from '../components/LoadingSkeleton.tsx';

export function SafeHome() {
  const [loading, setLoading] = useState(false);
  const { fetchByCoords } = useWeatherStore();
  const { t } = useI18n();

  const loadWeatherData = async () => {
    setLoading(true);
    try {
      console.log('Loading weather data for Madrid...');
      // Use Madrid coordinates as default
      await fetchByCoords(40.4168, -3.7038);
      console.log('Weather data loaded successfully');
    } catch (error) {
      console.error('Failed to load weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentLocationWeather = async () => {
    setLoading(true);
    try {
      const position = await geolocation.getCurrentPosition();
      await fetchByCoords(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      console.error('Failed to get current location:', error);
      // Fallback to default location
      await loadWeatherData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-50 to-cyan-100 dark:from-blue-900 dark:via-indigo-800 dark:to-purple-900">
      <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-white/70 via-blue-50/80 to-cyan-50/70 dark:from-slate-800/80 dark:to-indigo-800/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/30">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {t('appName')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            {t('weather.subtitle', 'Tu pronóstico personalizado')}
          </p>
        </div>
        <div className="flex gap-3">
          <LanguageToggle />
          <button 
            className="btn btn-primary btn-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={loadWeatherData}
            disabled={loading}
          >
            🔄 {loading ? t('loading') : t('refresh')}
          </button>
          <button 
            className="btn btn-secondary btn-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={loadCurrentLocationWeather}
            disabled={loading}
          >
            📍 {t('location')}
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      <AlertBanner />

      {/* Current Weather */}
      <CurrentCard />

      {/* Air Quality */}
      <AqiBadge />

      {/* Hourly Forecast */}
      <div className="bg-gradient-to-r from-white/80 via-blue-50/60 to-cyan-50/80 dark:bg-gradient-to-r dark:from-slate-800/70 dark:via-indigo-800/60 dark:to-purple-800/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/40">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
          <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full mr-4 shadow-lg"></div>
          {t('weather.hourlyForecast')}
        </h2>
        <HourlyStrip />
      </div>

      {/* Daily Forecast */}
      <div className="bg-gradient-to-r from-white/80 via-purple-50/60 to-pink-50/80 dark:bg-gradient-to-r dark:from-slate-800/70 dark:via-purple-800/60 dark:to-indigo-800/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/40">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full mr-4 shadow-lg"></div>
          {t('weather.dailyForecast')}
        </h2>
        <DailyList />
      </div>
      </div>
    </div>
  );
}