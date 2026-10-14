import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight, Sparkles, ChevronRight } from 'lucide-react';
import { DraggableSticker } from '../components/DraggableSticker';
import { useScene } from '../context/SceneContext';
import { useSound } from '../context/SoundContext';
import { useStartProjectModal } from '../context/StartProjectModalContext';

export const HeroSection: React.FC = () => {
  const { setActiveSection } = useScene();
  const { playPop, playSnap } = useSound();
  const { openStartProjectModal } = useStartProjectModal();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.4 });

  useEffect(() => {
    if (isInView) {
      setActiveSection('hero');
    }
  }, [isInView, setActiveSection]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-16 px-6 sm:px-12 bg-[#FFF4E6] overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-mesh-glow pointer-events-none" />

      {/* Scattered Draggable Stickers in hero */}
      <div className="absolute top-28 right-8 sm:right-24 z-20 hidden md:block">
        <DraggableSticker
          text="WEB APPS"
          bgColor="#38B6FF"
          textColor="#14110F"
          initialRotate={-6}
        />
      </div>
      <div className="absolute top-44 left-4 sm:left-12 z-20 hidden sm:block">
        <DraggableSticker
          text="E-COMMERCE"
          bgColor="#FF5DA2"
          textColor="#14110F"
          initialRotate={5}
        />
      </div>
      <div className="absolute bottom-36 left-12 sm:left-28 z-20 hidden md:block">
        <DraggableSticker
          text="✨ SHIPPED FAST"
          bgColor="#27E3A4"
          textColor="#14110F"
          initialRotate={-3}
        />
      </div>
      <div className="absolute bottom-28 right-12 sm:right-32 z-20 hidden lg:block">
        <DraggableSticker
          text="MADE IN INDIA"
          bgColor="#FFC72C"
          textColor="#14110F"
          initialRotate={7}
        />
      </div>

      {/* Main hero typography & CTAs */}
      <div className="relative max-w-5xl mx-auto w-full z-10 flex flex-col items-start gap-6 mt-6 sm:mt-12">
        {/* Live status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/80 border border-[#14110F]/15 backdrop-blur-md shadow-brutal-sm"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5A00] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF5A00]" />
          </span>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#14110F]">
            Taking new projects
          </span>
          <span className="text-[#14110F]/30">·</span>
          <span className="font-mono text-xs text-[#14110F]/70">Replies within 24 hrs</span>
        </motion.div>

        {/* Giant Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[104px] font-black tracking-tight leading-[0.95] text-[#14110F]"
        >
          We build websites that people{' '}
          <span className="font-serif-accent font-normal italic bg-gradient-to-r from-[#FF5A00] via-[#FF5DA2] to-[#6B4DFF] bg-clip-text text-transparent px-1">
            love
          </span>{' '}
          to{' '}
          <span className="text-outline-ink hover:text-[#14110F] transition-colors cursor-default">
            stay
          </span>{' '}
          on.
        </motion.h1>

        {/* Sub-positioning line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="max-w-2xl font-space text-lg sm:text-xl text-[#14110F]/80 leading-relaxed"
        >
          An independent digital agency crafting modern web applications, digital presence, and automated systems for companies reaching further than before.
        </motion.p>

        {/* Primary Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <button
            type="button"
            onClick={() => {
              playPop();
              openStartProjectModal();
            }}
            className="group flex items-center gap-3 px-8 py-4 rounded-full bg-[#FF5A00] text-white font-display font-bold text-base sm:text-lg shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
          >
            <span>Start a project</span>
            <ArrowUpRight
              size={20}
              className="transition-transform group-hover:rotate-45"
            />
          </button>

          <Link
            to="/work"
            onMouseEnter={playSnap}
            className="group flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#14110F] font-display font-bold text-base sm:text-lg border-2 border-[#14110F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <span>See our work</span>
            <ChevronRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>

      {/* Service offerings pill strip at bottom of hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative max-w-5xl mx-auto w-full z-10 pt-16 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-mono text-[#14110F]/70 border-t border-[#14110F]/15"
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-medium">
          <span>Websites</span>
          <span>•</span>
          <span>E-commerce</span>
          <span>•</span>
          <span>Web Apps</span>
          <span>•</span>
          <span>Maintenance</span>
          <span>•</span>
          <span>Video Motion</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#14110F]/60">
          <span>Ranchi, IN / Remote worldwide</span>
        </div>
      </motion.div>
    </section>
  );
};
