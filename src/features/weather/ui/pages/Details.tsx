import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Details() {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();

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
              Detalles del clima
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="card p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Vista detallada
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Esta vista mostrará información detallada del clima para la ubicación seleccionada.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ID de lugar: {placeId}
          </p>
          <div className="mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              🚧 Esta funcionalidad se implementará en una próxima versión
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}