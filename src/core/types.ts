// Tipos comunes de la aplicación
export interface Location {
  lat: number;
  lon: number;
  name: string;
  country: string;
  region?: string;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  location: Location;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex: number;
  condition: WeatherCondition;
  timestamp: number;
}

export interface HourlyForecast {
  timestamp: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitationProbability: number;
  precipitationAmount: number;
  windSpeed: number;
  windDirection: number;
  condition: WeatherCondition;
}

export interface DailyForecast {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  humidity: number;
  precipitationProbability: number;
  precipitationAmount: number;
  windSpeed: number;
  uvIndex: number;
  condition: WeatherCondition;
  sunrise: number;
  sunset: number;
}

export interface AirQuality {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  co: number;
  so2: number;
  timestamp: number;
}

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  start: number;
  end: number;
  areas: string[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  airQuality?: AirQuality;
  alerts: WeatherAlert[];
}

// Tipos de configuración
export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms';
export type TimeFormat = '12h' | '24h';
export type Theme = 'light' | 'dark' | 'system';
export type Language = 'es' | 'en';

export interface UserSettings {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  timeFormat: TimeFormat;
  theme: Theme;
  language: Language;
}

// Tipos de error
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

// Estados de carga
export type LoadingState = 'idle' | 'loading' | 'success' | 'error' | 'stale';

export interface AsyncState<T> {
  data?: T;
  error?: AppError;
  status: LoadingState;
  lastUpdated?: number;
}