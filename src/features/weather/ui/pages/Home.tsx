import { useEffect, useCallback } from 'react';
import { CurrentCard } from '../components/CurrentCard.tsx';
import { HourlyStrip } from '../components/HourlyStrip.tsx';
import { DailyList } from '../components/DailyList.tsx';
import { AqiBadge } from '../components/AqiBadge.tsx';
import { AlertBanner } from '../components/AlertBanner.tsx';
import { LoadingSkeleton } from '../components/LoadingSkeleton.tsx';
import { RefreshButton } from '../components/RefreshButton.tsx';
import { LocationButton } from '../components/LocationButton.tsx';
import { useWeatherStore, useWeatherStatus, useWeatherError, useWeatherIsStale } from '../../store/weatherStore.ts';
import { usePlacesStore } from '../../../places/placesStore.ts';
import { geolocation } from '../../../../core/utils/temp.ts';

export function Home() {
  const { fetchByCoords, clearError } = useWeatherStore();
  const { addToRecentSearches } = usePlacesStore();
  const status = useWeatherStatus();
  const error = useWeatherError();
  const isStale = useWeatherIsStale();

  const loadCurrentLocationWeather = useCallback(async () => {
    try {
      const position = await geolocation.getCurrentPosition();
      await fetchByCoords(position.coords.latitude, position.coords.longitude);
      
      // Add current location to recent searches
      addToRecentSearches({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: 'Ubicación actual',
        country: '',
      });
    } catch (error) {
      console.error('Failed to get current location:', error);
      // TODO: Show fallback location selector
    }
  }, [fetchByCoords, addToRecentSearches]);

  useEffect(() => {
    // Load weather for current location on mount
    loadCurrentLocationWeather();
  }, [loadCurrentLocationWeather]);

  const handleRefresh = async () => {
    try {
      clearError();
      await loadCurrentLocationWeather();
    } catch (error) {
      console.error('Failed to refresh weather:', error);
    }
  };

  const handleRetry = () => {
    handleRefresh();
  };

  if (status === 'loading' && !isStale) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
        <div className="container mx-auto px-4 py-6 safe-top">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (status === 'error' && !isStale) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
        <div className="container mx-auto px-4 py-6 safe-top">
          <div className="max-w-md mx-auto">
            <div className="card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-red-500">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No se pudo cargar el clima
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error?.message || 'Ha ocurrido un error al obtener los datos del clima.'}
              </p>
              <button
                onClick={handleRetry}
                className="btn btn-primary btn-md"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      {/* Header */}
      <div className="safe-top">
        <div className="flex items-center justify-between p-4">
          <LocationButton />
          <div className="flex items-center space-x-2">
            <RefreshButton onRefresh={handleRefresh} isLoading={status === 'loading'} />
          </div>
        </div>
      </div>

      {/* Stale data banner */}
      {isStale && (
        <div className="mx-4 mb-4">
          <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Datos desactualizados. Intenta actualizar para obtener información más reciente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weather alerts */}
      <AlertBanner />

      {/* Main content */}
      <div className="container mx-auto px-4 pb-6">
        <div className="space-y-6">
          {/* Current weather */}
          <CurrentCard />

          {/* Air quality index */}
          <AqiBadge />

          {/* Hourly forecast */}
          <div className="card p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Pronóstico por horas
            </h3>
            <HourlyStrip />
          </div>

          {/* Daily forecast */}
          <div className="card p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Próximos 7 días
            </h3>
            <DailyList />
          </div>
        </div>
      </div>
    </div>
  );
}