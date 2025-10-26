import type { TemperatureUnit, WindSpeedUnit } from '../types';

/**
 * Temperature conversion utilities
 */
export const temperature = {
  celsiusToFahrenheit: (celsius: number): number => (celsius * 9) / 5 + 32,
  fahrenheitToCelsius: (fahrenheit: number): number => ((fahrenheit - 32) * 5) / 9,
  
  format: (temp: number, unit: TemperatureUnit): string => {
    const symbol = unit === 'celsius' ? '°C' : '°F';
    return `${Math.round(temp)}${symbol}`;
  },

  convert: (temp: number, from: TemperatureUnit, to: TemperatureUnit): number => {
    if (from === to) return temp;
    
    if (from === 'celsius' && to === 'fahrenheit') {
      return temperature.celsiusToFahrenheit(temp);
    }
    
    if (from === 'fahrenheit' && to === 'celsius') {
      return temperature.fahrenheitToCelsius(temp);
    }
    
    return temp;
  },
};

/**
 * Wind speed conversion utilities
 */
export const windSpeed = {
  // km/h to other units
  kmhToMph: (kmh: number): number => kmh * 0.621371,
  kmhToMs: (kmh: number): number => kmh / 3.6,
  
  // mph to other units
  mphToKmh: (mph: number): number => mph / 0.621371,
  mphToMs: (mph: number): number => mph * 0.44704,
  
  // m/s to other units
  msToKmh: (ms: number): number => ms * 3.6,
  msToMph: (ms: number): number => ms / 0.44704,

  format: (speed: number, unit: WindSpeedUnit): string => {
    const unitMap = {
      kmh: 'km/h',
      mph: 'mph',
      ms: 'm/s',
    };
    return `${Math.round(speed)} ${unitMap[unit]}`;
  },

  convert: (speed: number, from: WindSpeedUnit, to: WindSpeedUnit): number => {
    if (from === to) return speed;

    // Convert to km/h first, then to target unit
    let kmh = speed;
    if (from === 'mph') kmh = windSpeed.mphToKmh(speed);
    if (from === 'ms') kmh = windSpeed.msToKmh(speed);

    if (to === 'kmh') return kmh;
    if (to === 'mph') return windSpeed.kmhToMph(kmh);
    if (to === 'ms') return windSpeed.kmhToMs(kmh);

    return speed;
  },
};

/**
 * Date and time utilities
 */
export const dateTime = {
  formatTime: (timestamp: number, format: '12h' | '24h' = '24h'): string => {
    const date = new Date(timestamp * 1000);
    
    if (format === '12h') {
      return date.toLocaleTimeString('es-ES', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  },

  formatDate: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  },

  formatRelativeTime: (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'ahora';
    if (minutes < 60) return `hace ${minutes}min`;
    if (hours < 24) return `hace ${hours}h`;
    return `hace ${days}d`;
  },

  isToday: (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  },

  isTomorrow: (dateString: string): boolean => {
    const date = new Date(dateString);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      date.getFullYear() === tomorrow.getFullYear() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getDate() === tomorrow.getDate()
    );
  },
};

/**
 * Weather condition utilities
 */
export const weatherConditions = {
  getIconName: (conditionId: number, isDay = true): string => {
    // Mapping based on OpenWeatherMap condition codes
    const conditionMap: Record<number, { day: string; night: string }> = {
      800: { day: 'sun', night: 'moon' },
      801: { day: 'cloud-sun', night: 'cloud-moon' },
      802: { day: 'cloud-sun', night: 'cloud-moon' },
      803: { day: 'cloud', night: 'cloud' },
      804: { day: 'cloud', night: 'cloud' },
      // Rain
      500: { day: 'cloud-rain', night: 'cloud-rain' },
      501: { day: 'cloud-rain', night: 'cloud-rain' },
      502: { day: 'cloud-rain', night: 'cloud-rain' },
      503: { day: 'cloud-rain', night: 'cloud-rain' },
      504: { day: 'cloud-rain', night: 'cloud-rain' },
      // Thunderstorm
      200: { day: 'zap', night: 'zap' },
      201: { day: 'zap', night: 'zap' },
      202: { day: 'zap', night: 'zap' },
      // Snow
      600: { day: 'snowflake', night: 'snowflake' },
      601: { day: 'snowflake', night: 'snowflake' },
      602: { day: 'snowflake', night: 'snowflake' },
      // Atmosphere
      701: { day: 'eye-off', night: 'eye-off' }, // mist
      711: { day: 'eye-off', night: 'eye-off' }, // smoke
      721: { day: 'eye-off', night: 'eye-off' }, // haze
      731: { day: 'wind', night: 'wind' }, // dust
      741: { day: 'eye-off', night: 'eye-off' }, // fog
      751: { day: 'wind', night: 'wind' }, // sand
      761: { day: 'wind', night: 'wind' }, // dust
      762: { day: 'wind', night: 'wind' }, // ash
      771: { day: 'wind', night: 'wind' }, // squall
      781: { day: 'tornado', night: 'tornado' }, // tornado
    };

    const condition = conditionMap[conditionId];
    if (!condition) return isDay ? 'sun' : 'moon';
    
    return isDay ? condition.day : condition.night;
  },

  getDescription: (conditionId: number): string => {
    const descriptions: Record<number, string> = {
      800: 'Despejado',
      801: 'Pocas nubes',
      802: 'Nubes dispersas',
      803: 'Nubes rotas',
      804: 'Nublado',
      500: 'Lluvia ligera',
      501: 'Lluvia moderada',
      502: 'Lluvia intensa',
      503: 'Lluvia muy intensa',
      504: 'Lluvia extrema',
      200: 'Tormenta con lluvia ligera',
      201: 'Tormenta',
      202: 'Tormenta intensa',
      600: 'Nieve ligera',
      601: 'Nieve',
      602: 'Nieve intensa',
      701: 'Neblina',
      711: 'Humo',
      721: 'Calima',
      731: 'Torbellinos de polvo',
      741: 'Niebla',
      751: 'Arena',
      761: 'Polvo',
      762: 'Ceniza volcánica',
      771: 'Chubascos',
      781: 'Tornado',
    };

    return descriptions[conditionId] || 'Desconocido';
  },
};

/**
 * Air quality utilities
 */
export const airQuality = {
  getAQILevel: (aqi: number): {
    level: string;
    color: string;
    description: string;
  } => {
    if (aqi <= 50) {
      return {
        level: 'Bueno',
        color: 'green',
        description: 'La calidad del aire es buena',
      };
    }
    if (aqi <= 100) {
      return {
        level: 'Moderado',
        color: 'yellow',
        description: 'Calidad del aire aceptable',
      };
    }
    if (aqi <= 150) {
      return {
        level: 'Insalubre para grupos sensibles',
        color: 'orange',
        description: 'Los grupos sensibles pueden experimentar problemas de salud',
      };
    }
    if (aqi <= 200) {
      return {
        level: 'Insalubre',
        color: 'red',
        description: 'Todos pueden experimentar problemas de salud',
      };
    }
    if (aqi <= 300) {
      return {
        level: 'Muy insalubre',
        color: 'purple',
        description: 'Advertencia de salud: todos pueden experimentar efectos más graves',
      };
    }
    return {
      level: 'Peligroso',
      color: 'red',
      description: 'Alerta de salud: todos pueden experimentar efectos graves',
    };
  },
};

/**
 * Geolocation utilities
 */
export const geolocation = {
  getCurrentPosition: (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5 * 60 * 1000, // 5 minutes
        }
      );
    });
  },

  calculateDistance: (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },
};

/**
 * Debounce utility
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number | undefined;
  return (...args: Parameters<T>) => {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait) as unknown as number;
  };
};

/**
 * Throttle utility
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};