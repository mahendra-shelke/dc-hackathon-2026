import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import type { StoryChapter, TourAnnotation } from '../types';

export const storyChapters: StoryChapter[] = [
  {
    id: 1,
    title: 'The Unknown Fleet',
    tagline: 'Thousands of devices. Most are cryptographic blind spots.',
    detail:
      'Your fleet spans medical, industrial, automotive, and enterprise devices. You don\'t know which use weak algorithms or have no cryptographic identity.',
    route: '/',
    annotations: [
      { target: 'landing-deadline', title: 'CNSA 2.0 Deadline', description: 'The countdown to January 2027 — when NIST requires all federal systems to use post-quantum cryptography. Every week counts.', position: 'bottom' },
      { target: 'landing-hero', title: 'Q-Shield Platform', description: 'DigiCert Q-Shield discovers, assesses, and migrates your entire IoT fleet to PQC — including brownfield devices that can\'t run a full agent.', position: 'bottom' },
      { target: 'landing-steps', title: 'Three-Step Workflow', description: 'Discovery → Blueprint → Results. Connect your platforms, assess risk, and track migration progress in three simple steps.', position: 'top' },
      { target: 'landing-cta', title: 'Get Started', description: 'Click "Start Discovery" to connect your IoT platforms and scan your fleet. The entire process takes under a minute.', position: 'top' },
    ],
  },
  {
    id: 2,
    title: 'Two SDKs, Every Device',
    tagline: 'TrustEdge for greenfield, TrustEdge Light for brownfield.',
    detail:
      'TrustEdge manages capable devices end-to-end. TrustEdge Light uses kernel hooks to reach constrained brownfield hardware with as little as 8 KB RAM.',
    route: '/sdk-solutions',
    annotations: [
      { target: 'sdk-trustedge', title: 'TrustEdge SDK', description: 'Full-featured SDK for greenfield devices — EST/SCEP enrollment, MQTT 5.0 over TLS, auto-renewal via Device Trust Manager.', position: 'right' },
      { target: 'sdk-light', title: 'TrustEdge Light', description: 'Kernel-level module for brownfield/constrained devices. Runs on as little as 8 KB RAM — probes certs, reports telemetry, no full agent needed.', position: 'left' },
      { target: 'sdk-comparison', title: 'Side-by-Side Comparison', description: 'Compare capabilities: TrustEdge for new deployments, TrustEdge Light for existing legacy hardware. Both support 8+ languages.', position: 'top' },
    ],
  },
  {
    id: 3,
    title: 'Discover Your Fleet',
    tagline: 'Connect platforms, scan devices, see every risk.',
    detail:
      'Connect Azure IoT Hub, AWS IoT Core, Azure Event Grid, TrustEdge Light, or custom APIs. Scan every device — surfacing algorithms, risk scores, and PQC recommendations.',
    route: '/discovery',
    annotations: [
      { target: 'discovery-connectors', title: 'Platform Connectors', description: 'Connect Azure IoT Hub, AWS IoT Core, Azure Event Grid, TrustEdge Light, or custom APIs. Toggle each connector to include it in the scan.', position: 'bottom' },
      { target: 'discovery-scan', title: 'Fleet Scan', description: 'Click "Scan Fleet" to discover every device across connected platforms — algorithms, risk scores, and PQC recommendations appear in real time.', position: 'left' },
      { target: 'discovery-devices', title: 'Discovered Devices', description: 'Every device found during the scan with its current algorithm, risk level, and recommended PQC migration path.', position: 'top' },
    ],
  },
  {
    id: 4,
    title: 'Readiness Blueprint',
    tagline: 'See the issues. Get recommendations. Run the assessment.',
    detail:
      'Weak crypto, missing identities, non-updatable firmware — all laid bare. Hit "Run Assessment" to project your readiness against the CNSA 2.0 deadline.',
    route: '/blueprint',
    annotations: [
      { target: 'blueprint-summary', title: 'Fleet Summary', description: 'At-a-glance metrics: total devices, weak crypto count, devices with no PKI identity, and weeks remaining until the CNSA 2.0 deadline.', position: 'bottom' },
      { target: 'blueprint-projection', title: 'Deadline Projection', description: 'Based on migration velocity, this arc shows whether your fleet will meet the January 2027 deadline — On Track, At Risk, or Will Miss.', position: 'right' },
      { target: 'blueprint-recommendations', title: 'Action Items', description: 'Prioritized recommendations grouped by algorithm. Each row tells you exactly what to migrate and how — TrustEdge, TrustEdge Light, or gateway proxy.', position: 'top' },
      { target: 'blueprint-apply', title: 'Run Assessment', description: 'Click "Run Assessment" to project your fleet\'s PQC readiness and see whether you\'ll meet the January 2027 deadline.', position: 'bottom' },
    ],
  },
  {
    id: 5,
    title: 'Results & Timeline',
    tagline: 'Readiness score, risk breakdown, and deprecation timeline.',
    detail:
      'See your fleet\'s PQC readiness score, vulnerability breakdown, algorithm deprecation timeline, and whether you\'ll meet the January 2027 deadline.',
    route: '/results',
    annotations: [
      { target: 'results-readiness', title: 'PQC Readiness Score', description: 'Your fleet\'s overall post-quantum readiness. 0% means no devices have PQC certificates; 100% means full CNSA 2.0 compliance.', position: 'bottom' },
      { target: 'results-risk', title: 'Risk & Algorithm Breakdown', description: 'See how many devices are critical, high, medium, or low risk — and which classical algorithms are most prevalent in your fleet.', position: 'top' },
      { target: 'results-timeline', title: 'Deprecation Timeline', description: 'NIST deprecation schedule for classical algorithms. The vertical markers show today\'s date and the 2027 deadline — any algorithm past its marker is overdue.', position: 'top' },
    ],
  },
];

interface StoryContextType {
  isOpen: boolean;
  activeChapter: number;
  activeAnnotation: number;
  spotlightEnabled: boolean;
  chapters: StoryChapter[];
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  goToChapter: (id: number) => void;
  nextChapter: () => void;
  prevChapter: () => void;
  nextAnnotation: () => void;
  prevAnnotation: () => void;
  toggleSpotlight: () => void;
  currentAnnotations: TourAnnotation[];
  activeTabHint: string | undefined;
}

const StoryContext = createContext<StoryContextType | null>(null);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(1);
  const [activeAnnotation, setActiveAnnotation] = useState(0);
  const [spotlightEnabled, setSpotlightEnabled] = useState(true);
  const navigate = useNavigate();

  const goToChapter = useCallback(
    (id: number) => {
      const chapter = storyChapters.find((c) => c.id === id);
      if (!chapter) return;
      setActiveChapter(id);
      setActiveAnnotation(0);
      navigate(chapter.route);
    },
    [navigate],
  );

  const currentAnnotations = storyChapters.find((c) => c.id === activeChapter)?.annotations ?? [];

  const nextAnnotation = useCallback(() => {
    if (activeAnnotation < currentAnnotations.length - 1) {
      setActiveAnnotation((a) => a + 1);
    } else {
      // Advance to next chapter when annotations exhausted
      const next = Math.min(activeChapter + 1, storyChapters.length);
      if (next !== activeChapter) goToChapter(next);
    }
  }, [activeAnnotation, currentAnnotations.length, activeChapter, goToChapter]);

  const prevAnnotation = useCallback(() => {
    if (activeAnnotation > 0) {
      setActiveAnnotation((a) => a - 1);
    } else {
      // Go to previous chapter's last annotation
      const prev = Math.max(activeChapter - 1, 1);
      if (prev !== activeChapter) {
        const prevChapterData = storyChapters.find((c) => c.id === prev);
        setActiveChapter(prev);
        setActiveAnnotation((prevChapterData?.annotations?.length ?? 1) - 1);
        navigate(prevChapterData!.route);
      }
    }
  }, [activeAnnotation, activeChapter, navigate]);

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
        activeAnnotation,
        spotlightEnabled,
        chapters: storyChapters,
        togglePanel: () => setIsOpen((v) => !v),
        openPanel: () => setIsOpen(true),
        closePanel: () => setIsOpen(false),
        goToChapter,
        nextChapter,
        prevChapter,
        nextAnnotation,
        prevAnnotation,
        toggleSpotlight: () => setSpotlightEnabled((v) => !v),
        currentAnnotations,
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
