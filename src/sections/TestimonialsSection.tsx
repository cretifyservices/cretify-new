import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { MessageCircle, CheckCheck, Star, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS as STATIC_TESTIMONIALS } from '../data/testimonials';
import { Testimonial } from '../types';
import { useScene } from '../context/SceneContext';
import { useSound } from '../context/SoundContext';
import { useStartProjectModal } from '../context/StartProjectModalContext';

export const TestimonialsSection: React.FC = () => {
  const { setActiveSection } = useScene();
  const { playPop, playSnap } = useSound();
  const { openStartProjectModal } = useStartProjectModal();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  const [reviews, setReviews] = useState<Testimonial[]>(STATIC_TESTIMONIALS);

  // Sync reviews with live server database
  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch reviews');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isInView) {
      setActiveSection('testimonials');
    }
  }, [isInView, setActiveSection]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
      playSnap();
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
      playSnap();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="proof"
      className="relative py-28 px-6 sm:px-12 bg-[#FF5A00] text-[#14110F] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b-2 border-[#14110F]/20">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-white font-bold bg-[#14110F] px-3 py-1 rounded-full shadow-brutal-sm inline-block">
              UNFILTERED PROOF
            </span>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-[#14110F] tracking-tight mt-3">
              Straight from{' '}
              <span className="font-serif-accent font-normal italic text-[#FFF4E6]">
                the DMs.
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <p className="max-w-md font-space text-sm sm:text-base text-[#14110F]/85 leading-relaxed font-medium">
              Real reactions from founders, CTOs, and brand owners right after launching their new digital presence with Cretify.
            </p>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleScrollLeft}
                className="w-10 h-10 rounded-full border-2 border-[#14110F] bg-white hover:bg-[#FFF4E6] flex items-center justify-center text-[#14110F] shadow-brutal-sm active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleScrollRight}
                className="w-10 h-10 rounded-full border-2 border-[#14110F] bg-white hover:bg-[#FFF4E6] flex items-center justify-center text-[#14110F] shadow-brutal-sm active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Swipe / Drag Row of DM Screenshot Look Cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory overscroll-x-contain touch-pan-x w-full max-w-full"
        >
          {reviews.map((t) => (
            <div
              key={t.id}
              className="w-[84vw] max-w-[310px] sm:w-[350px] md:w-[380px] flex-shrink-0 snap-start rounded-[24px] sm:rounded-[28px] bg-[#FFF4E6] border-3 border-[#14110F] p-5 sm:p-6 shadow-brutal flex flex-col justify-between"
            >
              <div>
                {/* Chat header: Avatar, Name, Channel */}
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#14110F]/10">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-display font-black text-xs text-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: t.avatarColor || '#FF5A00' }}
                    >
                      {t.clientName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs sm:text-sm text-[#14110F]">
                        {t.clientName}
                      </h4>
                      <span className="font-mono text-[10px] text-[#14110F]/60 block">
                        {t.role} · {t.company}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#14110F]/10 text-[#14110F]">
                    {t.channel}
                  </span>
                </div>

                {/* Chat Bubble Message */}
                <div className="relative p-3.5 sm:p-4 rounded-2xl bg-white border border-[#14110F]/10 shadow-sm text-xs sm:text-sm font-space text-[#14110F] leading-relaxed">
                  <p>"{t.message}"</p>
                  <div className="flex items-center justify-end gap-1.5 mt-2 font-mono text-[9px] text-[#14110F]/50">
                    <span>{t.time}</span>
                    <CheckCheck size={11} className="text-[#38B6FF]" />
                  </div>
                </div>
              </div>

              {/* 5-Star Rating */}
              <div className="flex items-center gap-1 pt-3 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-[#FF5A00] text-[#FF5A00]" />
                ))}
                <span className="font-mono text-[11px] text-[#14110F]/60 ml-2 font-semibold">
                  5.0 Verified Review
                </span>
              </div>
            </div>
          ))}

          {/* "Your brand could be on this row" placeholder card */}
          <div
            onClick={() => {
              playPop();
              openStartProjectModal();
            }}
            className="w-[84vw] max-w-[310px] sm:w-[350px] md:w-[380px] flex-shrink-0 snap-start rounded-[24px] sm:rounded-[28px] border-3 border-dashed border-[#14110F] p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-4 bg-white/30 hover:bg-white/50 transition-all group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#14110F] text-[#FFF4E6] flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-brutal-sm">
              💬
            </div>
            <div>
              <h4 className="font-display text-xl sm:text-2xl font-black text-[#14110F]">
                Your brand here.
              </h4>
              <p className="font-space text-xs text-[#14110F]/75 mt-1 max-w-xs">
                Launch your next big milestone with us and share your victory story.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 font-display font-bold text-xs uppercase tracking-wider text-[#14110F] group-hover:underline cursor-pointer"
            >
              <span>Start project now</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
