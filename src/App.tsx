import { AppRouter } from './app/Router';
import { useThemeEffect } from './features/places/placesStore';
import './core/i18n/index.ts';

function App() {
  // Apply theme effects
  useThemeEffect();

  return <AppRouter />;
}

export default App;
