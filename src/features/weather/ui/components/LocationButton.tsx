import { MapPin } from 'lucide-react';
import { useCurrentLocation } from '../../store/weatherStore';

export function LocationButton() {
  const currentLocation = useCurrentLocation();

  return (
    <button className="btn btn-ghost btn-sm">
      <MapPin className="w-4 h-4 mr-1" />
      <span className="text-sm font-medium">
        {currentLocation?.name || 'Ubicación'}
      </span>
    </button>
  );
}