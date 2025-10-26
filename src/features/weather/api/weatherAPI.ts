import { weatherApiClient, airQualityApiClient } from '../../../core/http/axiosClient';
import type { 
  CurrentWeather, 
  HourlyForecast, 
  DailyForecast, 
  AirQuality, 
  Location 
} from '../../../core/types';

// Open-Meteo API response types
interface OpenMeteoCurrentResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
  };
  current_units: {
    temperature_2m: string;
    apparent_temperature: string;
    relative_humidity_2m: string;
    surface_pressure: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
  };
}

interface OpenMeteoHourlyResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
  };
}

interface OpenMeteoDailyResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
}

interface OpenMeteoResponse extends OpenMeteoCurrentResponse, OpenMeteoHourlyResponse, OpenMeteoDailyResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
}

// OpenAQ API response types
interface OpenAQResponse {
  results: Array<{
    measurements: Array<{
      parameter: string;
      value: number;
      lastUpdated: string;
    }>;
  }>;
}

// Weather condition mapping from Open-Meteo codes
const getWeatherCondition = (code: number) => ({
  id: code,
  main: getConditionMain(code),
  description: getConditionDescription(code),
  icon: `${code}`,
});

const getConditionMain = (code: number): string => {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Clouds';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
};

const getConditionDescription = (code: number): string => {
  const descriptions: Record<number, string> = {
    0: 'Cielo despejado',
    1: 'Principalmente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Niebla con escarcha',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna intensa',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia intensa',
    71: 'Nieve ligera',
    73: 'Nieve moderada',
    75: 'Nieve intensa',
    80: 'Chubascos ligeros',
    81: 'Chubascos moderados',
    82: 'Chubascos intensos',
    95: 'Tormenta',
    96: 'Tormenta con granizo ligero',
    99: 'Tormenta con granizo intenso',
  };
  return descriptions[code] || 'Condición desconocida';
};

export class WeatherAPI {
  async getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    const params = {
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m',
        'apparent_temperature',
        'relative_humidity_2m',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'weather_code'
      ].join(','),
      timezone: 'auto',
    };

    const response = await weatherApiClient.get<OpenMeteoCurrentResponse>('/forecast', { params });
    const { current } = response;

    return {
      location: {
        lat,
        lon,
        name: 'Current Location', // TODO: Get from geocoding
        country: '',
      },
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      pressure: current.surface_pressure,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      visibility: 10000, // Default value, Open-Meteo doesn't provide this
      uvIndex: 0, // Will be fetched separately
      condition: getWeatherCondition(current.weather_code),
      timestamp: new Date(current.time).getTime() / 1000,
    };
  }

  async getHourlyForecast(lat: number, lon: number, hours = 24): Promise<HourlyForecast[]> {
    const params = {
      latitude: lat,
      longitude: lon,
      hourly: [
        'temperature_2m',
        'apparent_temperature',
        'relative_humidity_2m',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
        'wind_direction_10m'
      ].join(','),
      forecast_hours: hours,
      timezone: 'auto',
    };

    const response = await weatherApiClient.get<OpenMeteoHourlyResponse>('/forecast', { params });
    const { hourly } = response;

    return hourly.time.map((time: string, index: number) => ({
      timestamp: new Date(time).getTime() / 1000,
      temperature: hourly.temperature_2m[index],
      feelsLike: hourly.apparent_temperature[index],
      humidity: hourly.relative_humidity_2m[index],
      precipitationProbability: hourly.precipitation_probability[index],
      precipitationAmount: hourly.precipitation[index],
      windSpeed: hourly.wind_speed_10m[index],
      windDirection: hourly.wind_direction_10m[index],
      condition: getWeatherCondition(hourly.weather_code[index]),
    }));
  }

  async getDailyForecast(lat: number, lon: number, days = 7): Promise<DailyForecast[]> {
    const params = {
      latitude: lat,
      longitude: lon,
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'weather_code',
        'precipitation_probability_max',
        'precipitation_sum',
        'wind_speed_10m_max',
        'sunrise',
        'sunset',
        'uv_index_max'
      ].join(','),
      forecast_days: days,
      timezone: 'auto',
    };

    const response = await weatherApiClient.get<OpenMeteoDailyResponse>('/forecast', { params });
    const { daily } = response;

    return daily.time.map((time: string, index: number) => ({
      date: time,
      temperatureMax: daily.temperature_2m_max[index],
      temperatureMin: daily.temperature_2m_min[index],
      humidity: 0, // Not available in daily data
      precipitationProbability: daily.precipitation_probability_max[index],
      precipitationAmount: daily.precipitation_sum[index],
      windSpeed: daily.wind_speed_10m_max[index],
      uvIndex: daily.uv_index_max[index],
      condition: getWeatherCondition(daily.weather_code[index]),
      sunrise: new Date(daily.sunrise[index]).getTime() / 1000,
      sunset: new Date(daily.sunset[index]).getTime() / 1000,
    }));
  }

  async getCompleteWeather(lat: number, lon: number) {
    const params = {
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m',
        'apparent_temperature',
        'relative_humidity_2m',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'weather_code'
      ].join(','),
      hourly: [
        'temperature_2m',
        'apparent_temperature',
        'relative_humidity_2m',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
        'wind_direction_10m'
      ].join(','),
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'weather_code',
        'precipitation_probability_max',
        'precipitation_sum',
        'wind_speed_10m_max',
        'sunrise',
        'sunset',
        'uv_index_max'
      ].join(','),
      forecast_hours: 24,
      forecast_days: 7,
      timezone: 'auto',
    };

    const response = await weatherApiClient.get<OpenMeteoResponse>('/forecast', { params });
    
    // Current weather
    const current: CurrentWeather = {
      location: {
        lat: response.latitude,
        lon: response.longitude,
        name: 'Current Location',
        country: '',
      },
      temperature: response.current.temperature_2m,
      feelsLike: response.current.apparent_temperature,
      humidity: response.current.relative_humidity_2m,
      pressure: response.current.surface_pressure,
      windSpeed: response.current.wind_speed_10m,
      windDirection: response.current.wind_direction_10m,
      visibility: 10000,
      uvIndex: 0,
      condition: getWeatherCondition(response.current.weather_code),
      timestamp: new Date(response.current.time).getTime() / 1000,
    };

    // Hourly forecast
    const hourly: HourlyForecast[] = response.hourly.time.map((time: string, index: number) => ({
      timestamp: new Date(time).getTime() / 1000,
      temperature: response.hourly.temperature_2m[index],
      feelsLike: response.hourly.apparent_temperature[index],
      humidity: response.hourly.relative_humidity_2m[index],
      precipitationProbability: response.hourly.precipitation_probability[index],
      precipitationAmount: response.hourly.precipitation[index],
      windSpeed: response.hourly.wind_speed_10m[index],
      windDirection: response.hourly.wind_direction_10m[index],
      condition: getWeatherCondition(response.hourly.weather_code[index]),
    }));

    // Daily forecast
    const daily: DailyForecast[] = response.daily.time.map((time: string, index: number) => ({
      date: time,
      temperatureMax: response.daily.temperature_2m_max[index],
      temperatureMin: response.daily.temperature_2m_min[index],
      humidity: 0,
      precipitationProbability: response.daily.precipitation_probability_max[index],
      precipitationAmount: response.daily.precipitation_sum[index],
      windSpeed: response.daily.wind_speed_10m_max[index],
      uvIndex: response.daily.uv_index_max[index],
      condition: getWeatherCondition(response.daily.weather_code[index]),
      sunrise: new Date(response.daily.sunrise[index]).getTime() / 1000,
      sunset: new Date(response.daily.sunset[index]).getTime() / 1000,
    }));

    return {
      current,
      hourly,
      daily,
      alerts: [], // TODO: Implement alerts if available
    };
  }

  async getAirQuality(lat: number, lon: number): Promise<AirQuality | null> {
    try {
      // Note: OpenAQ API might require different endpoints or parameters
      // This is a mock implementation since OpenAQ API structure varies
      const params = {
        coordinates: `${lat},${lon}`,
        radius: 10000, // 10km radius
        limit: 1,
        order_by: 'lastUpdated',
        sort: 'desc',
      };

      const response = await airQualityApiClient.get<OpenAQResponse>('/latest', { params });
      
      if (!response.results || response.results.length === 0) {
        return null;
      }

      const measurements = response.results[0].measurements;
      const pm25 = measurements.find((m: any) => m.parameter === 'pm25')?.value || 0;
      const pm10 = measurements.find((m: any) => m.parameter === 'pm10')?.value || 0;
      const o3 = measurements.find((m: any) => m.parameter === 'o3')?.value || 0;
      const no2 = measurements.find((m: any) => m.parameter === 'no2')?.value || 0;
      const co = measurements.find((m: any) => m.parameter === 'co')?.value || 0;
      const so2 = measurements.find((m: any) => m.parameter === 'so2')?.value || 0;

      // Simple AQI calculation based on PM2.5 (US EPA standard)
      const aqi = this.calculateAQI(pm25);

      return {
        aqi,
        pm25,
        pm10,
        o3,
        no2,
        co,
        so2,
        timestamp: Date.now() / 1000,
      };
    } catch (error) {
      console.error('Failed to fetch air quality data:', error);
      return null;
    }
  }

  private calculateAQI(pm25: number): number {
    // US EPA AQI calculation for PM2.5
    const breakpoints = [
      { cLow: 0, cHigh: 12, iLow: 0, iHigh: 50 },
      { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
      { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
      { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
      { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
      { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
      { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
    ];

    for (const bp of breakpoints) {
      if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
        const iP = ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow;
        return Math.round(iP);
      }
    }

    return 500; // Hazardous
  }

  async searchLocations(query: string): Promise<Location[]> {
    try {
      const params = {
        name: query,
        count: 10,
        language: 'es',
        format: 'json',
      };

      // Using Open-Meteo's geocoding API
      const response = await weatherApiClient.get<{
        results?: Array<{
          name: string;
          country: string;
          admin1?: string;
          latitude: number;
          longitude: number;
        }>;
      }>('/geocoding/search', { params });

      if (!response.results) {
        return [];
      }

      return response.results.map((result: any) => ({
        lat: result.latitude,
        lon: result.longitude,
        name: result.name,
        country: result.country,
        region: result.admin1,
      }));
    } catch (error) {
      console.error('Failed to search locations:', error);
      return [];
    }
  }
}

export const weatherAPI = new WeatherAPI();