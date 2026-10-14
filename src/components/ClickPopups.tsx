import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PopItem {
  id: number;
  text: string;
  x: number;
  y: number;
  rotate: number;
  bgColor: string;
  textColor: string;
}

const PHRASES = [
  'CRAFT! ✨',
  'LIGHTNING FAST ⚡',
  'SUB-SECOND 🚀',
  'NO AI SLOP 🚫',
  'CONVERT 📈',
  'SHIPPED! 📦',
  'PURE CODE 💻',
  'WORLD-CLASS 🌍',
  'AWESOME! 💥',
  'TAKING PROJECTS 🟢',
  'HIGH CONVERSION 💰',
  'PIXEL PERFECT 🎯',
  'ZERO DRAMA 🤝',
  'BOLD! 🔥',
  'LET\'S BUILD 🚀'
];

const STICKER_COLORS = [
  { bg: '#FF5A00', text: '#FFF4E6' },
  { bg: '#FFC72C', text: '#14110F' },
  { bg: '#27E3A4', text: '#14110F' },
  { bg: '#6B4DFF', text: '#FFF4E6' },
  { bg: '#38B6FF', text: '#14110F' },
  { bg: '#FF5DA2', text: '#FFF4E6' }
];

export const ClickPopups: React.FC = () => {
  const [popups, setPopups] = useState<PopItem[]>([]);

  const handleGlobalClick = useCallback((e: MouseEvent) => {
    // Ignore clicks on interactive controls
    const target = e.target as HTMLElement;
    if (
      target.closest('button, a, input, textarea, select, label, [role="button"], [data-cursor="drag"]')
    ) {
      return;
    }

    const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    const color = STICKER_COLORS[Math.floor(Math.random() * STICKER_COLORS.length)];
    const rotate = (Math.random() * 24) - 12; // -12deg to +12deg

    const newPop: PopItem = {
      id: Date.now() + Math.random(),
      text: phrase,
      x: e.clientX,
      y: e.clientY,
      rotate,
      bgColor: color.bg,
      textColor: color.text
    };

    setPopups((prev) => [...prev.slice(-12), newPop]);

    // Auto remove after 1.2s
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== newPop.id));
    }, 1200);
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [handleGlobalClick]);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden select-none">
      <AnimatePresence>
        {popups.map((pop) => (
          <motion.div
            key={pop.id}
            initial={{ opacity: 0, scale: 0.4, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: -45 }}
            exit={{ opacity: 0, scale: 0.8, y: -70 }}
            transition={{ duration: 0.65, ease: [0.175, 0.885, 0.32, 1.275] }}
            style={{
              left: `${pop.x}px`,
              top: `${pop.y}px`,
              transform: `translate(-50%, -50%) rotate(${pop.rotate}deg)`,
              backgroundColor: pop.bgColor,
              color: pop.textColor
            }}
            className="fixed px-3.5 py-1.5 rounded-full border-2 border-[#14110F] shadow-brutal font-display font-black text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap"
          >
            {pop.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
