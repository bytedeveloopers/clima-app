
import { ArrowLeft, Sun, Moon, Smartphone, Thermometer, Wind, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  useSettingsStore, 
  useUserSettings,
  useTheme 
} from '../../../places/placesStore.ts';
import type { TemperatureUnit, WindSpeedUnit, TimeFormat, Theme, Language } from '../../../../core/types.ts';

export function Settings() {
  const navigate = useNavigate();
  const settings = useUserSettings();
  const currentTheme = useTheme();
  const { updateSettings, changeTheme } = useSettingsStore();

  const handleTemperatureUnitChange = (unit: TemperatureUnit) => {
    updateSettings({ temperatureUnit: unit });
  };

  const handleWindSpeedUnitChange = (unit: WindSpeedUnit) => {
    updateSettings({ windSpeedUnit: unit });
  };

  const handleTimeFormatChange = (format: TimeFormat) => {
    updateSettings({ timeFormat: format });
  };

  const handleThemeChange = (theme: Theme) => {
    changeTheme(theme);
  };

  const handleLanguageChange = (language: Language) => {
    updateSettings({ language });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 safe-top">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-ghost btn-sm mr-3"
              aria-label="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Configuración
            </h1>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          
          {/* Temperature Unit */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <Thermometer className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Unidad de temperatura
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleTemperatureUnitChange('celsius')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  settings.temperatureUnit === 'celsius'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="font-medium">Celsius</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">°C</div>
              </button>
              <button
                onClick={() => handleTemperatureUnitChange('fahrenheit')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  settings.temperatureUnit === 'fahrenheit'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="font-medium">Fahrenheit</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">°F</div>
              </button>
            </div>
          </div>

          {/* Wind Speed Unit */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <Wind className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Unidad de velocidad del viento
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleWindSpeedUnitChange('kmh')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  settings.windSpeedUnit === 'kmh'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="font-medium">km/h</div>
              </button>
              <button
                onClick={() => handleWindSpeedUnitChange('mph')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  settings.windSpeedUnit === 'mph'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="font-medium">mph</div>
              </button>
              <button
                onClick={() => handleWindSpeedUnitChange('ms')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  settings.windSpeedUnit === 'ms'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="font-medium">m/s</div>
              </button>
            </div>
          </div>

          {/* Time Format */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Formato de hora
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleTimeFormatChange('24h')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  settings.timeFormat === '24h'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="font-medium">24 horas</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">13:30</div>
              </button>
              <button
                onClick={() => handleTimeFormatChange('12h')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  settings.timeFormat === '12h'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="font-medium">12 horas</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">1:30 PM</div>
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Tema
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  currentTheme === 'light'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Sun className="w-6 h-6 mx-auto mb-1" />
                <div className="font-medium">Claro</div>
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  currentTheme === 'dark'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Moon className="w-6 h-6 mx-auto mb-1" />
                <div className="font-medium">Oscuro</div>
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  currentTheme === 'system'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Smartphone className="w-6 h-6 mx-auto mb-1" />
                <div className="font-medium">Sistema</div>
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3">🌐</div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Idioma
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleLanguageChange('es')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  settings.language === 'es'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="font-medium">Español</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">ES</div>
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  settings.language === 'en'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="font-medium">English</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">EN</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}