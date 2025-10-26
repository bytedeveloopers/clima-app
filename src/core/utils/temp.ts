// Temporary implementations - these need proper implementation

import type { TemperatureUnit, WindSpeedUnit } from '../types';

export const temperature = {
  celsiusToFahrenheit: (celsius: number): number => (celsius * 9) / 5 + 32,
  fahrenheitToCelsius: (fahrenheit: number): number => ((fahrenheit - 32) * 5) / 9,
  
  format: (temp: number, unit: TemperatureUnit): string => {
    const symbol = unit === 'celsius' ? '°C' : '°F';
    return `${Math.round(temp)}${symbol}`;
  },

  convert: (temp: number, from: TemperatureUnit, to: TemperatureUnit): number => {
    if (from === to) return temp;
    if (from === 'celsius' && to === 'fahrenheit') return temperature.celsiusToFahrenheit(temp);
    if (from === 'fahrenheit' && to === 'celsius') return temperature.fahrenheitToCelsius(temp);
    return temp;
  },
};

export const windSpeed = {
  format: (speed: number, unit: WindSpeedUnit): string => {
    const unitMap = { kmh: 'km/h', mph: 'mph', ms: 'm/s' };
    return `${Math.round(speed)} ${unitMap[unit]}`;
  },
  
  convert: (speed: number, from: WindSpeedUnit, to: WindSpeedUnit): number => {
    if (from === to) return speed;
    
    // Convert to m/s first
    let speedInMs = speed;
    if (from === 'kmh') speedInMs = speed / 3.6;
    else if (from === 'mph') speedInMs = speed / 2.237;
    
    // Convert from m/s to target unit
    if (to === 'kmh') return speedInMs * 3.6;
    if (to === 'mph') return speedInMs * 2.237;
    return speedInMs;
  },
};

export const dateTime = {
  formatDate: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  },
};

export const weatherConditions = {
  getDescription: (conditionId: number): string => {
    const descriptions: Record<number, string> = {
      800: 'Despejado',
      801: 'Pocas nubes',
      802: 'Nubes dispersas',
      803: 'Nubes rotas',
      804: 'Nublado',
    };
    return descriptions[conditionId] || 'Desconocido';
  },
};

export const airQuality = {
  getAQILevel: (aqi: number) => {
    if (aqi <= 50) return { level: 'Bueno', color: 'green', description: 'Calidad del aire buena' };
    if (aqi <= 100) return { level: 'Moderado', color: 'yellow', description: 'Calidad del aire aceptable' };
    return { level: 'Insalubre', color: 'red', description: 'Calidad del aire mala' };
  },
};

export const geolocation = {
  getCurrentPosition: (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      });
    });
  },
};