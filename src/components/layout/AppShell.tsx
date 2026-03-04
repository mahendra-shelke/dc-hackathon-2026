import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import PageTransition from './PageTransition';
import StoryPanel from '../story/StoryPanel';

export default function AppShell() {
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: 'var(--theme-bg)',
        color: 'var(--theme-text)',
      }}
    >
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <StoryPanel />
    </div>
  );
}
