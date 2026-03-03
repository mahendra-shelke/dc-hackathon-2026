import { BrowserRouter, Routes, Route } from 'react-router';
import { SimulationProvider } from './hooks/useSimulation';
import AppShell from './components/layout/AppShell';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import HndlRiskPage from './pages/HndlRiskPage';
import FleetHeatmapPage from './pages/FleetHeatmapPage';
import AlgorithmPage from './pages/AlgorithmPage';
import CertificatePage from './pages/CertificatePage';
import MigrationPage from './pages/MigrationPage';

export default function App() {
  return (
    <BrowserRouter>
      <SimulationProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<ExecutiveDashboard />} />
            <Route path="hndl" element={<HndlRiskPage />} />
            <Route path="fleet" element={<FleetHeatmapPage />} />
            <Route path="algorithms" element={<AlgorithmPage />} />
            <Route path="certificates" element={<CertificatePage />} />
            <Route path="migration" element={<MigrationPage />} />
          </Route>
        </Routes>
      </SimulationProvider>
    </BrowserRouter>
  );
}
