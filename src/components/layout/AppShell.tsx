import { useState, useCallback } from 'react';
import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import PageTransition from './PageTransition';
import StoryPanel from '../story/StoryPanel';
import SpotlightOverlay from '../story/SpotlightOverlay';
import DemoBar, { DemoContext } from '../story/DemoBar';
import { useStory } from '../../hooks/useStory';

export default function AppShell() {
  const { isOpen } = useStory();
  const [demoActive, setDemoActive] = useState(false);
  const startDemo = useCallback(() => setDemoActive(true), []);
  const stopDemo = useCallback(() => setDemoActive(false), []);

  return (
    <DemoContext.Provider value={{ active: demoActive, startDemo, stopDemo }}>
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
          style={{ marginRight: isOpen ? '320px' : '0px' }}
        >
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <StoryPanel />
        <SpotlightOverlay />
        <DemoBar />
      </div>
    </DemoContext.Provider>
  );
}
