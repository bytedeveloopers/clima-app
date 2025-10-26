import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traducciones
const resources = {
  es: {
    translation: {
      // App general
      appName: 'Clima App',
      loading: 'Cargando...',
      error: 'Error',
      retry: 'Reintentar',
      refresh: 'Actualizar',
      location: 'Ubicación',
      subtitle: 'Tu pronóstico personalizado',
      
      // Clima
      weather: {
        current: 'Clima actual',
        hourly: 'Pronóstico por horas',
        hourlyForecast: 'Pronóstico por horas',
        daily: 'Pronóstico de 7 días',
        dailyForecast: 'Pronóstico de 7 días',
        temperature: 'Temperatura',
        feelsLike: 'Sensación térmica',
        humidity: 'Humedad',
        pressure: 'Presión',
        windSpeed: 'Velocidad del viento',
        windDirection: 'Dirección del viento',
        visibility: 'Visibilidad',
        uvIndex: 'Índice UV',
        sunrise: 'Amanecer',
        sunset: 'Atardecer',
        precipitation: 'Precipitación',
        
        // Condiciones del clima
        conditions: {
          clear: 'Despejado',
          partlyCloudy: 'Parcialmente nublado',
          cloudy: 'Nublado',
          overcast: 'Nublado',
          fog: 'Niebla',
          drizzle: 'Llovizna',
          rain: 'Lluvia',
          snow: 'Nieve',
          thunderstorm: 'Tormenta',
          unknown: 'Condición desconocida'
        }
      },
      
      // Calidad del aire
      airQuality: {
        title: 'Calidad del aire',
        good: 'Bueno',
        moderate: 'Moderado',
        unhealthy: 'Insalubre',
        description: {
          good: 'Calidad del aire buena',
          moderate: 'Calidad del aire aceptable',
          unhealthy: 'Calidad del aire mala'
        }
      },
      
      // Alertas
      alerts: {
        highTemperature: 'Alerta por temperatura alta',
        temperatureWarning: 'Se esperan temperaturas superiores a {{temp}}°C durante las próximas horas.',
        validUntil: 'Válida hasta {{time}}'
      },
      
      // Configuración
      settings: {
        title: 'Configuración',
        theme: 'Tema',
        language: 'Idioma',
        units: 'Unidades',
        temperature: 'Temperatura',
        windSpeed: 'Velocidad del viento',
        timeFormat: 'Formato de hora',
        
        // Opciones de tema
        themes: {
          system: 'Sistema',
          light: 'Claro',
          dark: 'Oscuro'
        },
        
        // Opciones de idioma
        languages: {
          es: 'Español',
          en: 'English'
        },
        
        // Unidades de temperatura
        temperatureUnits: {
          celsius: 'Celsius (°C)',
          fahrenheit: 'Fahrenheit (°F)'
        },
        
        // Unidades de velocidad del viento
        windSpeedUnits: {
          kmh: 'km/h',
          mph: 'mph',
          ms: 'm/s'
        },
        
        // Formato de tiempo
        timeFormats: {
          '12h': '12 horas',
          '24h': '24 horas'
        }
      },
      
      // Errores
      errors: {
        weatherUnavailable: 'No hay datos de clima disponibles',
        locationDenied: 'Acceso a la ubicación denegado',
        networkError: 'Error de conexión',
        unknownError: 'Error desconocido'
      },
      
      // Navegación
      navigation: {
        home: 'Inicio',
        settings: 'Configuración',
        details: 'Detalles'
      }
    }
  },
  en: {
    translation: {
      // App general
      appName: 'Weather App',
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      refresh: 'Refresh',
      location: 'Location',
      subtitle: 'Your personalized forecast',
      
      // Weather
      weather: {
        current: 'Current Weather',
        hourly: 'Hourly Forecast',
        hourlyForecast: 'Hourly Forecast',
        daily: '7-Day Forecast',
        dailyForecast: '7-Day Forecast',
        temperature: 'Temperature',
        feelsLike: 'Feels like',
        humidity: 'Humidity',
        pressure: 'Pressure',
        windSpeed: 'Wind Speed',
        windDirection: 'Wind Direction',
        visibility: 'Visibility',
        uvIndex: 'UV Index',
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        precipitation: 'Precipitation',
        
        // Weather conditions
        conditions: {
          clear: 'Clear',
          partlyCloudy: 'Partly Cloudy',
          cloudy: 'Cloudy',
          overcast: 'Overcast',
          fog: 'Fog',
          drizzle: 'Drizzle',
          rain: 'Rain',
          snow: 'Snow',
          thunderstorm: 'Thunderstorm',
          unknown: 'Unknown condition'
        }
      },
      
      // Air quality
      airQuality: {
        title: 'Air Quality',
        good: 'Good',
        moderate: 'Moderate',
        unhealthy: 'Unhealthy',
        description: {
          good: 'Good air quality',
          moderate: 'Acceptable air quality',
          unhealthy: 'Poor air quality'
        }
      },
      
      // Alerts
      alerts: {
        highTemperature: 'High Temperature Alert',
        temperatureWarning: 'Temperatures above {{temp}}°C are expected in the coming hours.',
        validUntil: 'Valid until {{time}}'
      },
      
      // Settings
      settings: {
        title: 'Settings',
        theme: 'Theme',
        language: 'Language',
        units: 'Units',
        temperature: 'Temperature',
        windSpeed: 'Wind Speed',
        timeFormat: 'Time Format',
        
        // Theme options
        themes: {
          system: 'System',
          light: 'Light',
          dark: 'Dark'
        },
        
        // Language options
        languages: {
          es: 'Español',
          en: 'English'
        },
        
        // Temperature units
        temperatureUnits: {
          celsius: 'Celsius (°C)',
          fahrenheit: 'Fahrenheit (°F)'
        },
        
        // Wind speed units
        windSpeedUnits: {
          kmh: 'km/h',
          mph: 'mph',
          ms: 'm/s'
        },
        
        // Time formats
        timeFormats: {
          '12h': '12 hours',
          '24h': '24 hours'
        }
      },
      
      // Errors
      errors: {
        weatherUnavailable: 'No weather data available',
        locationDenied: 'Location access denied',
        networkError: 'Network error',
        unknownError: 'Unknown error'
      },
      
      // Navigation
      navigation: {
        home: 'Home',
        settings: 'Settings',
        details: 'Details'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;