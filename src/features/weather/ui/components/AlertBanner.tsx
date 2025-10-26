import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '../../../../core/hooks/useI18n.ts';

// Mock alerts for now - in real app this would come from weather store
const mockAlerts = [
  {
    id: '1',
    title: 'Aviso por temperaturas altas',
    description: 'Se esperan temperaturas superiores a 35°C durante las próximas horas.',
    severity: 'moderate' as const,
    start: Date.now(),
    end: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
    areas: ['Ciudad actual'],
  },
];

export function AlertBanner() {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const { t } = useI18n();
  
  // Filter out dismissed alerts
  const activeAlerts = mockAlerts.filter(alert => !dismissedAlerts.includes(alert.id));

  if (activeAlerts.length === 0) {
    return null;
  }

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'minor':
        return 'bg-blue-100 border-blue-200 dark:bg-blue-900 dark:border-blue-800';
      case 'moderate':
        return 'bg-yellow-100 border-yellow-200 dark:bg-yellow-900 dark:border-yellow-800';
      case 'severe':
        return 'bg-orange-100 border-orange-200 dark:bg-orange-900 dark:border-orange-800';
      case 'extreme':
        return 'bg-red-100 border-red-200 dark:bg-red-900 dark:border-red-800';
      default:
        return 'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const getSeverityIconColor = (severity: string) => {
    switch (severity) {
      case 'minor':
        return 'text-blue-600 dark:text-blue-400';
      case 'moderate':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'severe':
        return 'text-orange-600 dark:text-orange-400';
      case 'extreme':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="mx-4 mb-4 space-y-3">
      {activeAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`border rounded-lg p-4 ${getSeverityStyles(alert.severity)}`}
        >
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${getSeverityIconColor(alert.severity)}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {alert.title}
                </h3>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={t('alerts.close')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {alert.description}
              </p>
              
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                <span>{t('alerts.validUntil')}: </span>
                <span>
                  {new Date(alert.end).toLocaleString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}