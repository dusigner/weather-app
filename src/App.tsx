// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ForecastsPage from './pages/ForecastsPage';
import AddForecastPage from './pages/AddForecastPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Certifique-se de passar um array de locations vazio como propriedade para ForecastsPage */}
        <Route path="/forecasts" element={<ForecastsPage locations={[]} />} />
        <Route path="/add-forecast" element={<AddForecastPage />} />
        {/* Adicione uma rota de redirecionamento para /add-forecast */}
        <Route path="/" element={<Navigate to="/add-forecast" />} />
      </Routes>
    </Router>
  );
};

export default App;
