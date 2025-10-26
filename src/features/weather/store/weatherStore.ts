import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { cache } from '../../../core/cache/db';
import { weatherAPI } from '../api/weatherAPI';
import type { 
  WeatherData, 
  CurrentWeather, 
  HourlyForecast, 
  DailyForecast, 
  AirQuality,
  Location,
  LoadingState,
  AppError 
} from '../../../core/types';

interface WeatherStore {
  // State
  current: CurrentWeather | null;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  airQuality: AirQuality | null;
  currentLocation: Location | null;
  status: LoadingState;
  error: AppError | null;
  lastUpdated: number | null;
  isStale: boolean;

  // Actions
  fetchByCoords: (lat: number, lon: number) => Promise<void>;
  fetchByPlace: (location: Location) => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
  
  // Private methods
  fetchFreshData: (lat: number, lon: number, cacheKey: string) => Promise<void>;
}

const CACHE_TTL_MINUTES = 10;
const CACHE_KEY_PREFIX = 'weather_';

const createCacheKey = (lat: number, lon: number) => 
  `${CACHE_KEY_PREFIX}${lat.toFixed(4)}_${lon.toFixed(4)}`;

const initialState = {
  current: null,
  hourly: [],
  daily: [],
  airQuality: null,
  currentLocation: null,
  status: 'idle' as LoadingState,
  error: null,
  lastUpdated: null,
  isStale: false,
};

export const useWeatherStore = create<WeatherStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchByCoords: async (lat: number, lon: number) => {
        const cacheKey = createCacheKey(lat, lon);
        
        try {
          // Set loading state
          set({ status: 'loading', error: null });

          // Try cache first (Cache-then-Network strategy)
          const cachedResult = await cache.getFresh<WeatherData>(cacheKey);
          
          if (cachedResult.data && !cachedResult.stale) {
            // Use fresh cached data
            set({
              current: cachedResult.data.current,
              hourly: cachedResult.data.hourly,
              daily: cachedResult.data.daily,
              airQuality: cachedResult.data.airQuality || null,
              currentLocation: cachedResult.data.current.location,
              status: 'success',
              lastUpdated: cachedResult.data.current.timestamp * 1000,
              isStale: false,
            });

            // Still fetch fresh data in background if cache is getting old
            if (cachedResult.ageMs > (CACHE_TTL_MINUTES / 2) * 60 * 1000) {
              get().fetchFreshData(lat, lon, cacheKey);
            }
            return;
          }

          // If we have stale data, show it while fetching fresh
          if (cachedResult.data && cachedResult.stale) {
            set({
              current: cachedResult.data.current,
              hourly: cachedResult.data.hourly,
              daily: cachedResult.data.daily,
              airQuality: cachedResult.data.airQuality || null,
              currentLocation: cachedResult.data.current.location,
              status: 'stale',
              lastUpdated: cachedResult.data.current.timestamp * 1000,
              isStale: true,
            });
          }

          // Fetch fresh data
          await get().fetchFreshData(lat, lon, cacheKey);

        } catch (error) {
          console.error('Failed to fetch weather by coords:', error);
          set({
            status: 'error',
            error: {
              code: 'FETCH_WEATHER_ERROR',
              message: 'No se pudo obtener el clima para la ubicación especificada',
              details: error,
            },
          });
        }
      },

      fetchByPlace: async (location: Location) => {
        await get().fetchByCoords(location.lat, location.lon);
      },

      refresh: async () => {
        const { currentLocation } = get();
        if (!currentLocation) {
          throw new Error('No hay ubicación actual para actualizar');
        }
        
        // Clear cache for current location to force fresh data
        const cacheKey = createCacheKey(currentLocation.lat, currentLocation.lon);
        await cache.remove(cacheKey);
        
        await get().fetchByCoords(currentLocation.lat, currentLocation.lon);
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },

      // Private method for fetching fresh data
      fetchFreshData: async (lat: number, lon: number, cacheKey: string) => {
        try {
          // Fetch weather data
          const weatherData = await weatherAPI.getCompleteWeather(lat, lon);
          
          // Fetch air quality separately (can fail independently)
          let airQuality: AirQuality | null = null;
          try {
            airQuality = await weatherAPI.getAirQuality(lat, lon);
          } catch (airError) {
            console.warn('Failed to fetch air quality:', airError);
          }

          const completeData: WeatherData = {
            current: weatherData.current,
            hourly: weatherData.hourly,
            daily: weatherData.daily,
            airQuality: airQuality || undefined,
            alerts: weatherData.alerts,
          };

          // Cache the data
          await cache.set(cacheKey, completeData, CACHE_TTL_MINUTES);

          // Update state
          set({
            current: completeData.current,
            hourly: completeData.hourly,
            daily: completeData.daily,
            airQuality: completeData.airQuality,
            currentLocation: completeData.current.location,
            status: 'success',
            lastUpdated: Date.now(),
            isStale: false,
            error: null,
          });

        } catch (error) {
          console.error('Failed to fetch fresh weather data:', error);
          
          // If we don't have any data, set error state
          const currentState = get();
          if (!currentState.current) {
            set({
              status: 'error',
              error: {
                code: 'FETCH_WEATHER_ERROR',
                message: 'No se pudo obtener los datos del clima',
                details: error,
              },
            });
          } else {
            // Keep existing data but mark as stale
            set({
              status: 'stale',
              isStale: true,
            });
          }
        }
      },
    }),
    {
      name: 'weather-store',
    }
  )
);

// Selectors for common data access patterns
export const useCurrentWeather = () => useWeatherStore(state => state.current);
export const useHourlyForecast = () => useWeatherStore(state => state.hourly);
export const useDailyForecast = () => useWeatherStore(state => state.daily);
export const useAirQuality = () => useWeatherStore(state => state.airQuality);
export const useWeatherStatus = () => useWeatherStore(state => state.status);
export const useWeatherError = () => useWeatherStore(state => state.error);
export const useWeatherIsStale = () => useWeatherStore(state => state.isStale);
export const useWeatherLastUpdated = () => useWeatherStore(state => state.lastUpdated);
export const useCurrentLocation = () => useWeatherStore(state => state.currentLocation);