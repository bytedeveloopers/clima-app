import { useTranslation } from 'react-i18next';
import { useSettingsStore, useLanguage, useTemperatureUnit, useWindSpeedUnit } from '../../features/places/placesStore.ts';
import { useEffect } from 'react';
import type { Language } from '../types.ts';

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  const { updateSettings } = useSettingsStore();
  const currentLanguage = useLanguage();
  
  // Sync i18n language with store
  useEffect(() => {
    if (currentLanguage !== i18n.language) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const changeLanguage = (language: Language) => {
    updateSettings({ language });
    i18n.changeLanguage(language);
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
  };
};

// Hook específico para formatear temperaturas con traducción
export const useTemperatureFormat = () => {
  const temperatureUnit = useTemperatureUnit();
  
  const formatTemperature = (temp: number, showUnit = true) => {
    const convertedTemp = temperatureUnit === 'fahrenheit' 
      ? (temp * 9/5) + 32 
      : temp;
    
    const rounded = Math.round(convertedTemp);
    const unit = temperatureUnit === 'fahrenheit' ? '°F' : '°C';
    
    return showUnit ? `${rounded}${unit}` : rounded.toString();
  };
  
  return { formatTemperature };
};

// Hook para formatear velocidad del viento
export const useWindSpeedFormat = () => {
  const windSpeedUnit = useWindSpeedUnit();
  
  const formatWindSpeed = (speed: number, showUnit = true) => {
    let convertedSpeed = speed;
    let unit = 'm/s';
    
    switch (windSpeedUnit) {
      case 'kmh':
        convertedSpeed = speed * 3.6;
        unit = 'km/h';
        break;
      case 'mph':
        convertedSpeed = speed * 2.237;
        unit = 'mph';
        break;
      default:
        convertedSpeed = speed;
        unit = 'm/s';
    }
    
    const rounded = Math.round(convertedSpeed);
    return showUnit ? `${rounded} ${unit}` : rounded.toString();
  };
  
  return { formatWindSpeed };
};