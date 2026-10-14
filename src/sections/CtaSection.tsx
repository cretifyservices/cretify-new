import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight, MessageCircle, Mail } from 'lucide-react';
import { useScene } from '../context/SceneContext';
import { useSound } from '../context/SoundContext';
import { useStartProjectModal } from '../context/StartProjectModalContext';

export const CtaSection: React.FC = () => {
  const { setActiveSection } = useScene();
  const { playPop } = useSound();
  const { openStartProjectModal } = useStartProjectModal();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      setActiveSection('cta');
    }
  }, [isInView, setActiveSection]);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 sm:px-12 bg-[#14110F] text-[#FFF4E6] overflow-hidden"
    >
      <div className="absolute inset-0 bg-mesh-dark pointer-events-none" />
      <div className="absolute inset-0 film-grain pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center flex flex-col items-center gap-8">
        <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-bold border border-[#FF5A00]/40 px-4 py-1.5 rounded-full bg-[#FF5A00]/10 backdrop-blur-md">
          NEXT SPRINT STARTS MONDAY
        </span>

        <h2 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#FFF4E6] tracking-tighter leading-[0.95]">
          Got an idea?{' '}
          <span className="font-serif-accent font-normal italic bg-gradient-to-r from-[#FF5A00] via-[#FF5DA2] to-[#38B6FF] bg-clip-text text-transparent">
            Let's build it.
          </span>
        </h2>

        <p className="max-w-2xl font-space text-base sm:text-xl text-[#FFF4E6]/75 leading-relaxed">
          From concept to high-speed production launch. We handle design, custom engineering, and automation so you can focus on leading your market.
        </p>

        {/* Big Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              playPop();
              openStartProjectModal();
            }}
            className="group flex items-center gap-3 px-8 py-4 rounded-full bg-[#FF5A00] text-white font-display font-extrabold text-lg shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
          >
            <span>Start a project</span>
            <ArrowUpRight
              size={22}
              className="transition-transform group-hover:rotate-45"
            />
          </button>

          <a
            href="https://wa.me/917061899513?text=Hey%20Cretify!%20Let's%20discuss%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            onClick={playPop}
            className="group flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-display font-extrabold text-lg shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <MessageCircle size={22} className="fill-white" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href="mailto:services@cretify.in"
            className="group flex items-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF4E6] font-display font-bold text-base border border-white/20 transition-all"
          >
            <Mail size={18} />
            <span>services@cretify.in</span>
          </a>
        </div>
      </div>
    </section>
  );
};
