import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { SoundProvider } from './context/SoundContext';
import { SceneProvider } from './context/SceneContext';
import { StartProjectModalProvider } from './context/StartProjectModalContext';
import { SparkCanvas } from './components/three/SparkCanvas';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { SpeechBubbleEasterEgg } from './components/SpeechBubbleEasterEgg';
import { ClickPopups } from './components/ClickPopups';
import { StartProjectModal } from './components/StartProjectModal';
import { ScrollToTop } from './components/ScrollToTop';
import { useEasterEggs } from './hooks/useEasterEggs';

import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Inner app component with router context
const AppContent: React.FC = () => {
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  const location = useLocation();
  const { showSpeechBubble, hideSpeechBubble } = useEasterEggs();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen bg-[#FFF4E6] text-[#14110F] selection:bg-[#FF5A00] selection:text-white overflow-x-hidden w-full max-w-full">
      <ScrollToTop />
      {/* Preloader on initial visit */}
      {!preloaderFinished && !isAdmin && (
        <Preloader onComplete={() => setPreloaderFinished(true)} />
      )}

      {/* Consistent rigid dots pattern overlay across all pages */}
      <div className="fixed inset-0 dot-grid-pattern pointer-events-none z-0 opacity-40" />

      {/* Persistent 3D Three.js canvas behind all page content */}
      {!isAdmin && <SparkCanvas />}

      {/* Custom solid orange pointer arrow cursor */}
      <CustomCursor />

      {/* Interactive click sticker popups */}
      <ClickPopups />

      {/* Floating navigation bar */}
      <Navbar />

      {/* 4-Step Start A Project Modal */}
      <StartProjectModal />

      {/* Easter egg speech bubble ("hi" greeting) */}
      <SpeechBubbleEasterEgg visible={showSpeechBubble} onClose={hideSpeechBubble} />

      {/* Floating WhatsApp trigger button with 8s wobble */}
      {!isAdmin && <FloatingWhatsApp />}

      {/* Animated route transitions */}
      <main className="relative z-10 min-h-screen overflow-x-hidden w-full max-w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Site Footer with Matter.js physics toy */}
      {!isAdmin && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <SoundProvider>
      <SceneProvider>
        <StartProjectModalProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </StartProjectModalProvider>
      </SceneProvider>
    </SoundProvider>
  );
}
