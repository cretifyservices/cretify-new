import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';
import { DraggableSticker } from '../components/DraggableSticker';
import { useSound } from '../context/SoundContext';

export const NotFoundPage: React.FC = () => {
  const { playPop } = useSound();

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-28 pb-16 px-6 bg-[#FFF4E6] text-[#14110F] text-center select-none overflow-hidden">
      <div className="flex flex-wrap gap-4 items-center justify-center mb-8">
        <DraggableSticker text="🌴 404 CODE" bgColor="#38B6FF" textColor="#14110F" initialRotate={-4} />
        <DraggableSticker text="WHERE DID IT GO?" bgColor="#FF5DA2" textColor="#14110F" initialRotate={6} />
      </div>

      <motion.div
        drag
        dragElastic={0.3}
        whileDrag={{ scale: 1.15, rotate: 15 }}
        whileHover={{ scale: 1.05 }}
        className="w-36 h-36 rounded-3xl bg-[#FF5A00] text-white flex items-center justify-center font-display font-black text-7xl border-4 border-[#14110F] shadow-brutal cursor-grab active:cursor-grabbing mb-8"
      >
        <span>C</span>
        <span className="w-4 h-4 rounded-full bg-[#FFF4E6] ml-1 -mt-8" />
      </motion.div>

      <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-bold">
        LOST IN THE MATRIX
      </span>

      <h1 className="font-display text-5xl sm:text-7xl font-black text-[#14110F] tracking-tight mt-2 max-w-xl">
        This page went on{' '}
        <span className="font-serif-accent font-normal italic text-[#6B4DFF]">
          vacation.
        </span>
      </h1>

      <p className="font-space text-base text-[#14110F]/70 mt-4 max-w-md">
        The link you followed took a detour to a tropical island. Grab the big 3D 'C' above and toss it around, or head back to safety.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Link
          to="/"
          onClick={playPop}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#14110F] text-[#FFF4E6] font-display font-bold text-sm uppercase tracking-wide shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <Home size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};
