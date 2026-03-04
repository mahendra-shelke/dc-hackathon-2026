import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import type { StoryChapter } from '../types';

export const storyChapters: StoryChapter[] = [
  {
    id: 1,
    title: 'The Unknown Fleet',
    tagline: 'You have thousands of devices. Most are cryptographic blind spots.',
    detail:
      'Your organization runs thousands of connected devices across medical, industrial, automotive, and enterprise environments. Right now, you don\'t know which ones are using weak algorithms, which are expiring, and which have no cryptographic identity at all. The threat is already here.',
    route: '/',
  },
  {
    id: 2,
    title: 'Discovering the Truth',
    tagline: 'Our kernel module reaches devices TrustEdge can\'t.',
    detail:
      'TrustEdge handles capable devices. But brownfield IoT — old PLCs, legacy meters, early-gen sensors — can\'t run a full agent. Our lightweight kernel module sits on these devices and phones home: cert status, memory, CPU, firmware hash. Including devices with zero cryptographic identity.',
    route: '/discovery',
  },
  {
    id: 3,
    title: 'The Clock Is Ticking',
    tagline: 'RSA and ECDSA have expiry dates. Most of your fleet runs on them.',
    detail:
      'NIST has finalized the post-quantum standards. NSA\'s CNSA 2.0 disallows RSA and ECDSA for new systems in 2026, and sunsets all classical cryptography by 2030. The CNSA 2.0 deadline is January 1, 2027. You\'re running out of time.',
    route: '/algorithms',
    tabHint: 'deprecation',
  },
  {
    id: 4,
    title: 'Your Readiness Blueprint',
    tagline: 'An ordered, device-aware migration plan with a deadline tracker.',
    detail:
      'Based on your fleet composition, resource constraints, and the CNSA 2.0 deadline, we build a prioritized migration path. Start with your most capable devices, work down to constrained brownfield hardware. The Readiness Dashboard tells you if you\'ll make it — and what to do if you won\'t.',
    route: '/blueprint',
  },
  {
    id: 5,
    title: 'Pick the Right Algorithm',
    tagline: 'Not every device can run ML-DSA-87. Device Advisor picks the right fit.',
    detail:
      'A Cortex-M0+ sensor with 16KB RAM cannot run the same PQC algorithm as a cloud server. Device Advisor maps your device class to the appropriate NIST-approved algorithm — ML-KEM-512 + FN-DSA-512 for constrained devices, ML-KEM-1024 + ML-DSA-87 for servers.',
    route: '/algorithms',
    tabHint: 'advisor',
  },
  {
    id: 6,
    title: 'Prove It Works',
    tagline: 'Hybrid certs bridge the gap. The Q-Shield demo shows it live.',
    detail:
      'During the transition, hybrid certificates carry both a classical and a PQC signature — staying interoperable while proving quantum-safe capability. The Q-Shield demo shows real PQC operations (via liboqs) side-by-side with legacy traffic under simulated quantum attack.',
    route: '/certificates',
  },
];

interface StoryContextType {
  isOpen: boolean;
  activeChapter: number;
  chapters: StoryChapter[];
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  goToChapter: (id: number) => void;
  nextChapter: () => void;
  prevChapter: () => void;
  activeTabHint: string | undefined;
}

const StoryContext = createContext<StoryContextType | null>(null);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(1);
  const navigate = useNavigate();

  const goToChapter = useCallback(
    (id: number) => {
      const chapter = storyChapters.find((c) => c.id === id);
      if (!chapter) return;
      setActiveChapter(id);
      navigate(chapter.route);
    },
    [navigate],
  );

  const nextChapter = useCallback(() => {
    const next = Math.min(activeChapter + 1, storyChapters.length);
    goToChapter(next);
  }, [activeChapter, goToChapter]);

  const prevChapter = useCallback(() => {
    const prev = Math.max(activeChapter - 1, 1);
    goToChapter(prev);
  }, [activeChapter, goToChapter]);

  const activeTabHint = storyChapters.find((c) => c.id === activeChapter)?.tabHint;

  return (
    <StoryContext.Provider
      value={{
        isOpen,
        activeChapter,
        chapters: storyChapters,
        togglePanel: () => setIsOpen((v) => !v),
        openPanel: () => setIsOpen(true),
        closePanel: () => setIsOpen(false),
        goToChapter,
        nextChapter,
        prevChapter,
        activeTabHint,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error('useStory must be used within StoryProvider');
  return ctx;
}
