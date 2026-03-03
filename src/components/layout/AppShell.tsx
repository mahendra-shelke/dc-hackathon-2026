import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import PageTransition from './PageTransition';
import { useTheme } from '../../hooks/useTheme';

export default function AppShell() {
  const { theme } = useTheme();
  const hasGradient = theme === 'charcoal-gradient';

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: 'var(--theme-bg)',
        backgroundImage: hasGradient ? 'var(--theme-bg-gradient)' : 'none',
        color: 'var(--theme-text)',
      }}
    >
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
