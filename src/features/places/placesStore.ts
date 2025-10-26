import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useEffect } from 'react';
import { weatherAPI } from '../weather/api/weatherAPI';
import type { 
  Location, 
  UserSettings, 
  TemperatureUnit, 
  WindSpeedUnit, 
  TimeFormat, 
  Theme, 
  Language,
  AppError,
  LoadingState 
} from '../../core/types';

interface PlacesStore {
  // State
  favorites: Location[];
  recentSearches: Location[];
  searchResults: Location[];
  searchStatus: LoadingState;
  searchError: AppError | null;

  // Actions
  searchPlaces: (query: string) => Promise<void>;
  addToFavorites: (location: Location) => void;
  removeFromFavorites: (location: Location) => void;
  addToRecentSearches: (location: Location) => void;
  clearSearchResults: () => void;
  clearSearchError: () => void;
  toggleFavorite: (location: Location) => void;
  isFavorite: (location: Location) => boolean;
}

interface SettingsStore {
  // State
  settings: UserSettings;

  // Actions
  updateSettings: (settings: Partial<UserSettings>) => void;
  changeTemperatureUnit: (unit: TemperatureUnit) => void;
  changeWindSpeedUnit: (unit: WindSpeedUnit) => void;
  changeTimeFormat: (format: TimeFormat) => void;
  changeTheme: (theme: Theme) => void;
  changeLanguage: (language: Language) => void;
  resetToDefaults: () => void;
}

const MAX_FAVORITES = 10;
const MAX_RECENT_SEARCHES = 5;

const defaultSettings: UserSettings = {
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kmh',
  timeFormat: '24h',
  theme: 'system',
  language: 'es',
};

// Places Store
export const usePlacesStore = create<PlacesStore>()(
  devtools(
    persist(
      (set, get) => ({
        favorites: [],
        recentSearches: [],
        searchResults: [],
        searchStatus: 'idle',
        searchError: null,

        searchPlaces: async (query: string) => {
          if (!query.trim()) {
            set({ searchResults: [], searchStatus: 'idle' });
            return;
          }

          try {
            set({ searchStatus: 'loading', searchError: null });
            
            const results = await weatherAPI.searchLocations(query);
            
            set({ 
              searchResults: results,
              searchStatus: 'success',
            });
          } catch (error) {
            console.error('Failed to search places:', error);
            set({
              searchStatus: 'error',
              searchError: {
                code: 'SEARCH_PLACES_ERROR',
                message: 'No se pudo buscar ubicaciones',
                details: error,
              },
              searchResults: [],
            });
          }
        },

        addToFavorites: (location: Location) => {
          const { favorites } = get();
          
          // Check if already in favorites
          if (favorites.some(fav => 
            fav.lat === location.lat && fav.lon === location.lon
          )) {
            return;
          }

          // Limit favorites to MAX_FAVORITES
          const newFavorites = [location, ...favorites].slice(0, MAX_FAVORITES);
          
          set({ favorites: newFavorites });
        },

        removeFromFavorites: (location: Location) => {
          const { favorites } = get();
          const newFavorites = favorites.filter(fav => 
            !(fav.lat === location.lat && fav.lon === location.lon)
          );
          set({ favorites: newFavorites });
        },

        addToRecentSearches: (location: Location) => {
          const { recentSearches } = get();
          
          // Remove if already exists to avoid duplicates
          const filteredRecent = recentSearches.filter(recent => 
            !(recent.lat === location.lat && recent.lon === location.lon)
          );
          
          // Add to beginning and limit to MAX_RECENT_SEARCHES
          const newRecentSearches = [location, ...filteredRecent].slice(0, MAX_RECENT_SEARCHES);
          
          set({ recentSearches: newRecentSearches });
        },

        clearSearchResults: () => {
          set({ searchResults: [], searchStatus: 'idle' });
        },

        clearSearchError: () => {
          set({ searchError: null });
        },

        toggleFavorite: (location: Location) => {
          const { isFavorite, addToFavorites, removeFromFavorites } = get();
          
          if (isFavorite(location)) {
            removeFromFavorites(location);
          } else {
            addToFavorites(location);
          }
        },

        isFavorite: (location: Location) => {
          const { favorites } = get();
          return favorites.some(fav => 
            fav.lat === location.lat && fav.lon === location.lon
          );
        },
      }),
      {
        name: 'places-storage',
        partialize: (state) => ({
          favorites: state.favorites,
          recentSearches: state.recentSearches,
        }),
      }
    ),
    { name: 'places-store' }
  )
);

// Settings Store
export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set, get) => ({
        settings: defaultSettings,

        updateSettings: (newSettings: Partial<UserSettings>) => {
          const { settings } = get();
          set({
            settings: { ...settings, ...newSettings }
          });
        },

        changeTemperatureUnit: (unit: TemperatureUnit) => {
          get().updateSettings({ temperatureUnit: unit });
        },

        changeWindSpeedUnit: (unit: WindSpeedUnit) => {
          get().updateSettings({ windSpeedUnit: unit });
        },

        changeTimeFormat: (format: TimeFormat) => {
          get().updateSettings({ timeFormat: format });
        },

        changeTheme: (theme: Theme) => {
          get().updateSettings({ theme });
          
          // Apply theme to document
          const root = document.documentElement;
          
          if (theme === 'dark') {
            root.classList.add('dark');
          } else if (theme === 'light') {
            root.classList.remove('dark');
          } else {
            // System theme
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
              root.classList.add('dark');
            } else {
              root.classList.remove('dark');
            }
          }
        },

        changeLanguage: (language: Language) => {
          get().updateSettings({ language });
          
          // TODO: Update i18n language
          // This will be implemented when we set up i18next
        },

        resetToDefaults: () => {
          set({ settings: { ...defaultSettings } });
          
          // Apply default theme
          get().changeTheme(defaultSettings.theme);
        },
      }),
      {
        name: 'settings-storage',
        onRehydrateStorage: () => (state) => {
          // Apply theme on app load
          if (state?.settings?.theme) {
            const settingsStore = useSettingsStore.getState();
            settingsStore.changeTheme(state.settings.theme);
          }
        },
      }
    ),
    { name: 'settings-store' }
  )
);

// Selectors for common access patterns
export const useFavorites = () => usePlacesStore(state => state.favorites);
export const useRecentSearches = () => usePlacesStore(state => state.recentSearches);
export const useSearchResults = () => usePlacesStore(state => ({
  results: state.searchResults,
  status: state.searchStatus,
  error: state.searchError,
}));

export const useUserSettings = () => useSettingsStore(state => state.settings);
export const useTemperatureUnit = () => useSettingsStore(state => state.settings.temperatureUnit);
export const useWindSpeedUnit = () => useSettingsStore(state => state.settings.windSpeedUnit);
export const useTimeFormat = () => useSettingsStore(state => state.settings.timeFormat);
export const useTheme = () => useSettingsStore(state => state.settings.theme);
export const useLanguage = () => useSettingsStore(state => state.settings.language);

// Theme effect hook - should be called once in main app component
export const useThemeEffect = () => {
  const theme = useTheme();
  
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      
      // Set initial state
      if (mediaQuery.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      // Listen for changes
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme]);
};