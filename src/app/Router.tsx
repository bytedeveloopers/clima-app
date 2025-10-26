import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary.tsx';
import { SimpleHome } from '../features/weather/ui/pages/SimpleHome.tsx';
import { SafeHome } from '../features/weather/ui/pages/SafeHome.tsx';
// import { Home } from '../features/weather/ui/pages/Home.tsx';
// import { Settings } from '../features/weather/ui/pages/Settings.tsx';
// import { Details } from '../features/weather/ui/pages/Details.tsx';

export function AppRouter() {
  return (
    <Router basename="/clima-app">
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<SafeHome />} />
          <Route path="/settings" element={<SimpleHome />} />
          <Route path="/details/:placeId" element={<SimpleHome />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}