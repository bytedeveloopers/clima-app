export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Current weather skeleton */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="skeleton h-6 w-32"></div>
          <div className="skeleton h-8 w-8 rounded-full"></div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="skeleton h-16 w-24 mb-2"></div>
            <div className="skeleton h-4 w-20"></div>
          </div>
          <div className="skeleton h-20 w-20 rounded-full"></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="skeleton h-4 w-12 mx-auto mb-1"></div>
            <div className="skeleton h-6 w-16 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="skeleton h-4 w-12 mx-auto mb-1"></div>
            <div className="skeleton h-6 w-16 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="skeleton h-4 w-12 mx-auto mb-1"></div>
            <div className="skeleton h-6 w-16 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* AQI skeleton */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="skeleton h-4 w-24 mb-1"></div>
            <div className="skeleton h-6 w-16"></div>
          </div>
          <div className="skeleton h-8 w-20 rounded-full"></div>
        </div>
      </div>

      {/* Hourly forecast skeleton */}
      <div className="card p-4">
        <div className="skeleton h-6 w-40 mb-4"></div>
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 text-center">
              <div className="skeleton h-4 w-12 mb-2 mx-auto"></div>
              <div className="skeleton h-8 w-8 rounded-full mb-2 mx-auto"></div>
              <div className="skeleton h-6 w-10 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily forecast skeleton */}
      <div className="card p-4">
        <div className="skeleton h-6 w-32 mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="skeleton h-5 w-20"></div>
              <div className="flex items-center space-x-3">
                <div className="skeleton h-6 w-6 rounded-full"></div>
                <div className="skeleton h-5 w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}