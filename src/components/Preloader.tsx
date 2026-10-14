import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSound } from '../context/SoundContext';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [lettersVisible, setLettersVisible] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const { playSnap, playSuccess } = useSound();

  const letters = ['C', 'R', 'E', 'T', 'I', 'F', 'Y'];

  useEffect(() => {
    // Check if user already saw preloader this session
    const hasSeen = sessionStorage.getItem('cretify_preloader_seen');
    if (hasSeen === 'true') {
      onComplete();
      return;
    }

    // Rapid counter from 0 to 100 in ~1.1s
    const start = Date.now();
    const duration = 1100;

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setCount(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setLettersVisible(true);
        playSuccess();

        // Hold briefly, then wipe exit
        setTimeout(() => {
          setIsWiping(true);
          sessionStorage.setItem('cretify_preloader_seen', 'true');
          setTimeout(() => {
            onComplete();
          }, 650);
        }, 600);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete, playSuccess]);

  const handleSkip = () => {
    sessionStorage.setItem('cretify_preloader_seen', 'true');
    playSnap();
    setIsWiping(true);
    setTimeout(onComplete, 400);
  };

  return (
    <AnimatePresence>
      {!isWiping ? (
        <motion.div
          key="loader-curtain"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#14110F] text-[#FFF4E6] select-none"
        >
          {/* Subtle noise/grain */}
          <div className="absolute inset-0 pointer-events-none film-grain" />

          {/* Skip button in top right */}
          <button
            onClick={handleSkip}
            className="absolute top-6 right-8 text-xs font-mono uppercase tracking-widest text-[#FFF4E6]/60 hover:text-[#FF5A00] transition-colors cursor-pointer py-1 px-3 rounded border border-white/10 hover:border-[#FF5A00]"
          >
            Skip [ESC]
          </button>

          <div className="flex flex-col items-center gap-8 relative z-10">
            {/* Pill Counter */}
            <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A00] animate-ping" />
              <span className="font-mono text-sm tracking-widest text-[#FFF4E6]/70">
                IGNITING CREATIVITY
              </span>
              <span className="font-mono font-bold text-base text-[#FF5A00] min-w-[42px] text-right">
                {count}%
              </span>
            </div>

            {/* CRETIFY dropping letters */}
            <div className="flex items-center gap-1 sm:gap-2">
              {letters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ y: -60, opacity: 0, rotate: index % 2 === 0 ? -12 : 12 }}
                  animate={
                    lettersVisible
                      ? { y: 0, opacity: 1, rotate: 0 }
                      : { y: -20, opacity: 0.15 }
                  }
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 20,
                    delay: index * 0.05
                  }}
                  className={`text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tighter ${
                    char === 'I' ? 'text-[#FF5A00]' : 'text-[#FFF4E6]'
                  }`}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={lettersVisible ? { opacity: 1 } : { opacity: 0 }}
              className="text-xs sm:text-sm font-space text-[#FFF4E6]/50 tracking-wide text-center"
            >
              Crafting modern digital presence & automated systems
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
