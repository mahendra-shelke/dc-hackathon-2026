import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import PageTransition from './PageTransition';
import StoryPanel from '../story/StoryPanel';
import TrustEdgePanel from '../trustedge/TrustEdgePanel';
import { useStory } from '../../hooks/useStory';
import { useTrustEdge } from '../../hooks/useTrustEdge';

export default function AppShell() {
  const { isOpen } = useStory();
  const { isOpen: isTrustEdgeOpen } = useTrustEdge();

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: 'var(--theme-bg)',
        color: 'var(--theme-text)',
      }}
    >
      <Sidebar />
      <main
        className="ml-64 min-h-screen overflow-x-hidden transition-[margin] duration-300 ease-out"
        style={{ marginRight: isOpen ? '320px' : isTrustEdgeOpen ? '340px' : '0px' }}
      >
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <StoryPanel />
      <TrustEdgePanel />
    </div>
  );
}
