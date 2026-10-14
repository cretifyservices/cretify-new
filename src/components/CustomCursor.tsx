import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export type CursorMode = 'default' | 'view' | 'drag' | 'play';

export const CustomCursor: React.FC = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Snappy spring tracking
  const springConfig = { damping: 30, stiffness: 450 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = (e.target as HTMLElement).closest('[data-cursor]');
      if (target) {
        const mode = target.getAttribute('data-cursor') as CursorMode;
        const text = target.getAttribute('data-cursor-text') || '';
        setCursorMode(mode || 'default');
        setCursorText(text || (mode ? mode.toUpperCase() : ''));
        setIsHovered(true);
      } else {
        const isClickable = (e.target as HTMLElement).closest('button, a, input, select, textarea, [role="button"]');
        if (isClickable) {
          setCursorMode('default');
          setCursorText('');
          setIsHovered(true);
        } else {
          setCursorMode('default');
          setCursorText('');
          setIsHovered(false);
        }
      }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      <motion.div
        style={{
          x: smoothX,
          y: smoothY
        }}
        className="fixed top-0 left-0"
      >
        {/* Solid royal orange custom cursor arrow matching reference video */}
        <motion.div
          animate={{
            scale: isPressed ? 0.88 : isHovered ? 1.15 : 1,
            rotate: isPressed ? -6 : 0
          }}
          transition={{ duration: 0.12 }}
          className="relative -ml-[3px] -mt-[2px] filter drop-shadow-[2px_3px_0px_rgba(20,17,15,0.8)]"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Arrowhead body */}
            <path
              d="M3 3L11.5 24.5L15.2 15.2L24.5 11.5L3 3Z"
              fill="#FF5A00"
              stroke="#14110F"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Center spark accent */}
            <circle cx="9.5" cy="9.5" r="1.5" fill="#FFF4E6" />
          </svg>

          {/* Contextual badge (e.g. VIEW / DRAG) */}
          {cursorText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: 0 }}
              animate={{ opacity: 1, scale: 1, x: 16 }}
              className="absolute left-4 top-2 px-2.5 py-0.5 rounded-full bg-[#14110F] text-[#FFF4E6] border border-white/20 font-display font-black text-[10px] tracking-wider uppercase whitespace-nowrap shadow-brutal-sm"
            >
              {cursorText}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
