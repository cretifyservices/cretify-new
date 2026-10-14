import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SpeechBubbleEasterEggProps {
  visible: boolean;
  onClose: () => void;
}

export const SpeechBubbleEasterEgg: React.FC<SpeechBubbleEasterEggProps> = ({ visible, onClose }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 30, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: -2 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 15 }}
          className="fixed bottom-24 left-8 sm:left-12 z-50 max-w-xs bg-[#FF5A00] text-white p-5 rounded-3xl border-3 border-[#14110F] shadow-brutal"
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white/70 hover:text-white p-1"
            aria-label="Close message"
          >
            <X size={16} />
          </button>
          <div className="flex items-start gap-3">
            <span className="text-3xl">👋</span>
            <div>
              <h4 className="font-display font-black text-lg tracking-tight">hey friend!</h4>
              <p className="text-xs text-white/90 mt-1 leading-relaxed">
                You found the secret greeting! Want to turn that bright idea of yours into a world-class website?
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#14110F] text-[#FFF4E6] rounded-full text-xs font-mono font-bold shadow-brutal-sm"
                >
                  <Sparkles size={12} className="text-[#FFC72C]" />
                  <span>Let's talk</span>
                </Link>
                <span className="text-[10px] text-white/70 font-mono">Tip: try Konami code!</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
