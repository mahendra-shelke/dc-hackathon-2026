import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useStory } from '../../hooks/useStory';

export default function StoryPanel() {
  const {
    isOpen, activeChapter, activeAnnotation, chapters, currentAnnotations,
    closePanel, goToChapter, nextAnnotation, prevAnnotation,
  } = useStory();

  return (
    <AnimatePresence>
      {isOpen && (
          <motion.aside
            key="story-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-40 flex flex-col overflow-hidden"
            style={{
              width: 320,
              backgroundColor: '#151518',
              borderLeft: '2px solid rgba(255,255,255,0.08)',
              boxShadow: '-12px 0 40px rgba(0,0,0,0.6), -2px 0 8px rgba(0,0,0,0.4)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-5"
              style={{ borderBottom: '1px solid var(--theme-sidebar-border)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
                >
                  <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--theme-text)' }} />
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>
                    Guided Tour
                  </div>
                  <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--theme-text-muted)' }}>
                    Step-by-step walkthrough
                  </div>
                </div>
              </div>
              <button
                onClick={closePanel}
                className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:bg-white/10"
                style={{ color: 'var(--theme-text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chapter List */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1.5">
              {chapters.map((chapter) => {
                const isActive = chapter.id === activeChapter;
                return (
                  <button
                    key={chapter.id}
                    onClick={() => goToChapter(chapter.id)}
                    className="w-full text-left rounded-xl p-3.5 transition-all group"
                    style={{
                      backgroundColor: isActive ? 'var(--theme-card)' : 'transparent',
                      border: isActive
                        ? '1px solid var(--theme-card-border)'
                        : '1px solid transparent',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Chapter number */}
                      <div
                        className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold mt-0.5"
                        style={{
                          backgroundColor: isActive ? 'var(--theme-text)' : 'var(--theme-card)',
                          color: isActive ? 'var(--theme-bg)' : 'var(--theme-text-muted)',
                          border: isActive ? 'none' : '1px solid var(--theme-card-border)',
                        }}
                      >
                        {chapter.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-sm font-semibold leading-tight mb-1"
                          style={{ color: isActive ? 'var(--theme-text)' : 'var(--theme-text-secondary)' }}
                        >
                          {chapter.title}
                        </div>
                        <div
                          className="text-xs leading-relaxed"
                          style={{ color: 'var(--theme-text-muted)' }}
                        >
                          {chapter.tagline}
                        </div>
                      </div>
                    </div>

                    {/* Expanded detail for active chapter */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="mt-3 pt-3 text-xs leading-relaxed"
                            style={{
                              color: 'var(--theme-text-secondary)',
                              borderTop: '1px solid var(--theme-card-border)',
                            }}
                          >
                            {chapter.detail}
                          </div>

                          {/* Current annotation callout */}
                          {currentAnnotations.length > 0 && currentAnnotations[activeAnnotation] && (
                            <div
                              className="mt-3 rounded-lg p-3"
                              style={{
                                backgroundColor: 'var(--theme-card-inner)',
                                border: '1px solid var(--theme-card-border)',
                              }}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span
                                  className="text-[10px] uppercase tracking-widest font-semibold"
                                  style={{ color: 'var(--theme-text-muted)' }}
                                >
                                  Focus {activeAnnotation + 1}/{currentAnnotations.length}
                                </span>
                              </div>
                              <div className="text-xs font-bold mb-1" style={{ color: 'var(--theme-text)' }}>
                                {currentAnnotations[activeAnnotation].title}
                              </div>
                              <div className="text-[11px] leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                                {currentAnnotations[activeAnnotation].description}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>

            {/* Navigation Footer */}
            <div
              className="p-4 space-y-3"
              style={{ borderTop: '1px solid var(--theme-sidebar-border)' }}
            >
              {/* Progress */}
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                <span>
                  Chapter {activeChapter} of {chapters.length}
                </span>
                {currentAnnotations.length > 0 && (
                  <span style={{ color: 'var(--theme-text-secondary)' }}>
                    Focus {activeAnnotation + 1}/{currentAnnotations.length}
                  </span>
                )}
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--theme-bar-bg)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: 'var(--theme-text-secondary)' }}
                  animate={{ width: `${(activeChapter / chapters.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Prev / Next */}
              <div className="flex gap-2">
                <button
                  onClick={prevAnnotation}
                  disabled={activeChapter === 1 && activeAnnotation === 0}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30"
                  style={{
                    backgroundColor: 'var(--theme-card)',
                    color: 'var(--theme-text-secondary)',
                    border: '1px solid var(--theme-card-border)',
                  }}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  onClick={nextAnnotation}
                  disabled={activeChapter === chapters.length && activeAnnotation >= currentAnnotations.length - 1}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
                  style={{
                    backgroundColor: 'var(--theme-text)',
                    color: 'var(--theme-bg)',
                  }}
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.aside>
      )}
    </AnimatePresence>
  );
}
