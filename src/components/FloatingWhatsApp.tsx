import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, X } from 'lucide-react';
import { useSound } from '../context/SoundContext';

export const FloatingWhatsApp: React.FC = () => {
  const [wobble, setWobble] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { playPop } = useSound();

  useEffect(() => {
    // Trigger wobble every 8s
    const interval = setInterval(() => {
      setWobble(true);
      setTimeout(() => setWobble(false), 1200);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
      {/* Quick message tooltip pill */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14110F] text-[#FFF4E6] text-xs font-mono border border-white/20 shadow-brutal-sm"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Chat with us on WhatsApp</span>
        <button
          onClick={() => setIsDismissed(true)}
          className="ml-1 text-[#FFF4E6]/50 hover:text-white"
          aria-label="Dismiss WhatsApp hint"
        >
          <X size={12} />
        </button>
      </motion.div>

      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/917061899513?text=Hey%20Cretify!%20I'm%20interested%20in%20building%20a%20project."
        target="_blank"
        rel="noopener noreferrer"
        onClick={playPop}
        animate={
          wobble
            ? {
                rotate: [0, -14, 14, -10, 10, -5, 5, 0],
                scale: [1, 1.15, 1.1, 1.15, 1]
              }
            : { rotate: 0, scale: 1 }
        }
        transition={{ duration: 0.8 }}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center border-2 border-[#14110F] shadow-brutal hover:shadow-brutal-lg hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
        aria-label="Contact Cretify via WhatsApp (+91 70618 99513)"
      >
        <MessageCircle size={28} className="fill-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5A00] rounded-full border-2 border-white animate-bounce" />
      </motion.a>
    </div>
  );
};
