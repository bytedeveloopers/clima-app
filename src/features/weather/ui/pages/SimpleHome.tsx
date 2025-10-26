// Componente temporal para debugging

export function SimpleHome() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Clima App</h1>
      <div className="card p-6">
        <p>Aplicación funcionando correctamente</p>
        <p className="text-gray-600 dark:text-gray-400">
          Esta es una versión simplificada para debuggear el problema.
        </p>
      </div>
    </div>
  );
}