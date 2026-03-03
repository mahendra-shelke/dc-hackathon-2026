import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import PageTransition from './PageTransition';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
