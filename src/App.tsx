import { BrowserRouter, Routes, Route } from 'react-router';
import { ThemeProvider } from './hooks/useTheme';
import { SimulationProvider } from './hooks/useSimulation';
import { DiscoveryProvider } from './hooks/useDiscovery';
import { StoryProvider } from './hooks/useStory';
import AppShell from './components/layout/AppShell';
import LandingPage from './pages/LandingPage';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import HndlRiskPage from './pages/HndlRiskPage';
import FleetHeatmapPage from './pages/FleetHeatmapPage';
import CertificatePage from './pages/CertificatePage';
import MigrationPage from './pages/MigrationPage';
import DiscoveryPage from './pages/DiscoveryPage';
import BlueprintPage from './pages/BlueprintPage';
import SdkSolutionsPage from './pages/SdkSolutionsPage';
import ResultsPage from './pages/ResultsPage';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SimulationProvider>
          <DiscoveryProvider>
            <StoryProvider>
              <Routes>
                <Route element={<AppShell />}>
                  <Route index element={<LandingPage />} />
                  <Route path="sdk-solutions" element={<SdkSolutionsPage />} />
                  <Route path="executive" element={<ExecutiveDashboard />} />
                  <Route path="discovery" element={<DiscoveryPage />} />
                  <Route path="hndl" element={<HndlRiskPage />} />
                  <Route path="fleet" element={<FleetHeatmapPage />} />
                  <Route path="certificates" element={<CertificatePage />} />
                  <Route path="migration" element={<MigrationPage />} />
                  <Route path="blueprint" element={<BlueprintPage />} />
                  <Route path="results" element={<ResultsPage />} />
                </Route>
              </Routes>
            </StoryProvider>
          </DiscoveryProvider>
        </SimulationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
