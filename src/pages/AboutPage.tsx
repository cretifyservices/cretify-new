import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, RotateCw, MapPin, Heart, Sparkles } from 'lucide-react';
import { DraggableSticker } from '../components/DraggableSticker';
import { useSound } from '../context/SoundContext';
import { useStartProjectModal } from '../context/StartProjectModalContext';

export const AboutPage: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { playPop, playSnap } = useSound();
  const { openStartProjectModal } = useStartProjectModal();

  const handleFlip = () => {
    playPop();
    setIsFlipped(!isFlipped);
  };

  const milestones = [
    { year: '2023', title: 'The Spark', desc: 'Founded in Ranchi, Jharkhand with a simple philosophy: build modern web applications that do not feel like boring corporate templates.' },
    { year: '2024', title: 'Global Footprint', desc: 'Shipped high-conversion storefronts, fintech portals, and architecture portfolios for clients across 6 countries.' },
    { year: '2025', title: 'Automation & 3D Web', desc: 'Integrated real-time WebGL experiences, custom automation engines, and sub-second Next.js web applications.' }
  ];

  return (
    <div className="relative z-10 pt-32 pb-24 px-6 sm:px-12 bg-[#FFF4E6] text-[#14110F]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-bold">
            BEHIND THE BRAND
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-black text-[#14110F] tracking-tight mt-2">
            Independent by design.{' '}
            <span className="font-serif-accent font-normal italic text-[#27E3A4]">
              Relentless on craft.
            </span>
          </h1>
          <p className="font-space text-base sm:text-lg text-[#14110F]/75 mt-4 max-w-xl mx-auto">
            We are a tight-knit digital studio that combines engineering rigour with playful aesthetic taste. No account managers, no bureaucratic telephone game.
          </p>
        </div>

        {/* Values as interactive stickers row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <DraggableSticker text="🔥 ZERO AI SLOP" bgColor="#FF5A00" textColor="#FFF4E6" initialRotate={-3} />
          <DraggableSticker text="⚡ SUB-SECOND SPEED" bgColor="#6B4DFF" textColor="#FFF4E6" initialRotate={4} />
          <DraggableSticker text="🎯 DIRECT FOUNDER CONTACT" bgColor="#FFC72C" textColor="#14110F" initialRotate={-2} />
          <DraggableSticker text="🇮🇳 PROUDLY CRAFTED IN INDIA" bgColor="#27E3A4" textColor="#14110F" initialRotate={5} />
        </div>

        {/* Story & Interactive Team Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 items-center">
          {/* Left: Founder Story [EDIT] placeholder */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#14110F]">
              Why we started Cretify
            </h2>
            <p className="font-space text-base text-[#14110F]/80 leading-relaxed">
              Most agency websites look like they were pulled from the exact same cookie-cutter starter template: dark grey backgrounds, meaningless buzzwords, and sluggish page loads that test your patience.
            </p>
            <p className="font-space text-base text-[#14110F]/80 leading-relaxed">
              We started Cretify to prove that enterprise-grade web applications can also be warm, tactile, and visually thrilling. When a visitor lands on your site, they shouldn't just read about your product — they should feel your energy and want to stick around.
            </p>

            <div className="p-5 rounded-2xl bg-white border-2 border-[#14110F] shadow-brutal-sm flex items-center gap-4">
              <MapPin size={24} className="text-[#FF5A00] flex-shrink-0" />
              <div>
                <span className="font-display font-bold text-sm text-[#14110F] block">
                  Studio Base: Ranchi, Jharkhand, India
                </span>
                <span className="font-mono text-xs text-[#14110F]/60">
                  Collaborating across Indian Standard Time, UTC, and US Pacific.
                </span>
              </div>
            </div>
          </div>

          {/* Right: Team Card with Interactive Drag-Flip Effect */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm h-96 [perspective:1000px] cursor-pointer" onClick={handleFlip}>
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', damping: 20 }}
                className="w-full h-full relative [transform-style:preserve-3d]"
              >
                {/* Front of Card */}
                <div className="absolute inset-0 rounded-[32px] bg-[#14110F] text-[#FFF4E6] p-8 border-3 border-[#14110F] shadow-brutal flex flex-col justify-between [backface-visibility:hidden]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#FF5A00] font-bold">CRETIFY CORE TEAM</span>
                    <RotateCw size={16} className="text-white/60 animate-spin" />
                  </div>

                  <div className="text-center my-auto">
                    <div className="w-20 h-20 rounded-2xl bg-[#FF5A00] mx-auto mb-4 flex items-center justify-center font-display font-black text-3xl text-white shadow-brutal-sm">
                      C✦
                    </div>
                    <h3 className="font-display text-2xl font-black text-white">The Engineering & Design Guild</h3>
                    <p className="font-mono text-xs text-white/70 mt-1">Creative Coders & System Architects</p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-white/60 border-t border-white/10 pt-3">
                    <span>Click to flip card</span>
                    <span className="text-[#27E3A4]">● Active In Studio</span>
                  </div>
                </div>

                {/* Back of Card */}
                <div className="absolute inset-0 rounded-[32px] bg-[#FF5A00] text-white p-8 border-3 border-[#14110F] shadow-brutal flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-white/80 block mb-2">
                      OUR CODE OF CONDUCT
                    </span>
                    <h4 className="font-display text-2xl font-black">No layers. Just makers.</h4>
                    <ul className="mt-4 flex flex-col gap-2 font-space text-xs sm:text-sm text-white/90">
                      <li>• You talk directly with the engineer building your site.</li>
                      <li>• Weekly milestones delivered like clockwork.</li>
                      <li>• We care about every single millisecond of load time.</li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/20 pt-3 text-xs font-mono">
                    <span>Click to flip back</span>
                    <Heart size={14} className="fill-white" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#14110F] mb-8 text-center">
            Our Journey So Far
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {milestones.map((item) => (
              <div key={item.year} className="p-6 rounded-2xl bg-white border-2 border-[#14110F] shadow-brutal-sm">
                <span className="font-display font-black text-3xl text-[#FF5A00] block mb-2">
                  {item.year}
                </span>
                <h3 className="font-display font-bold text-lg text-[#14110F] mb-1">
                  {item.title}
                </h3>
                <p className="font-space text-sm text-[#14110F]/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              playPop();
              openStartProjectModal();
            }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#14110F] text-[#FFF4E6] font-display font-bold text-sm uppercase tracking-wide shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] transition-all cursor-pointer"
          >
            <span>Work with us</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
