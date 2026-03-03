import { BrowserRouter, Routes, Route } from 'react-router';
import { SimulationProvider } from './hooks/useSimulation';
import { DiscoveryProvider } from './hooks/useDiscovery';
import AppShell from './components/layout/AppShell';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import HndlRiskPage from './pages/HndlRiskPage';
import FleetHeatmapPage from './pages/FleetHeatmapPage';
import AlgorithmPage from './pages/AlgorithmPage';
import CertificatePage from './pages/CertificatePage';
import MigrationPage from './pages/MigrationPage';
import DiscoveryPage from './pages/DiscoveryPage';

export default function App() {
  return (
    <BrowserRouter>
      <SimulationProvider>
        <DiscoveryProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<ExecutiveDashboard />} />
              <Route path="discovery" element={<DiscoveryPage />} />
              <Route path="hndl" element={<HndlRiskPage />} />
              <Route path="fleet" element={<FleetHeatmapPage />} />
              <Route path="algorithms" element={<AlgorithmPage />} />
              <Route path="certificates" element={<CertificatePage />} />
              <Route path="migration" element={<MigrationPage />} />
            </Route>
          </Routes>
        </DiscoveryProvider>
      </SimulationProvider>
    </BrowserRouter>
  );
}
