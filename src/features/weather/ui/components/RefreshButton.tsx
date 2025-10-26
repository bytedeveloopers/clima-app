import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading?: boolean;
}

export function RefreshButton({ onRefresh, isLoading = false }: RefreshButtonProps) {
  return (
    <button
      onClick={onRefresh}
      disabled={isLoading}
      className="btn btn-ghost btn-sm"
      aria-label="Actualizar datos del clima"
    >
      <RefreshCw 
        className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} 
      />
    </button>
  );
}