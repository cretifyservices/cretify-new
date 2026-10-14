import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { PROJECTS as STATIC_PROJECTS } from '../data/projects';
import { Project } from '../types';
import { useScene } from '../context/SceneContext';
import { useSound } from '../context/SoundContext';
import { useStartProjectModal } from '../context/StartProjectModalContext';

// Procedural Desktop View Mockup Window
const DesktopViewMockup: React.FC<{ project: Project }> = ({ project }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const sampleUrl = project.liveUrl?.replace('https://', '').replace('http://', '') || `${project.id}.cretify.in`;

  return (
    <div className="w-full rounded-2xl bg-[#14110F] border-2 border-[#14110F] overflow-hidden shadow-brutal flex flex-col group-hover:scale-[1.01] transition-transform duration-300">
      {/* Browser Desktop Window Header Bar */}
      <div className="h-8 bg-[#1e1b18] px-3.5 flex items-center justify-between border-b border-white/10 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        {/* URL Pill */}
        <div className="px-3 py-0.5 rounded-full bg-white/10 text-[11px] font-mono text-white/60 truncate max-w-[200px] border border-white/5">
          {sampleUrl}
        </div>
        <div className="w-10" />
      </div>

      {/* Desktop Screenshot View */}
      <div className="relative w-full aspect-[16/10] bg-[#14110F] overflow-hidden">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={`${project.name} Desktop View`}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover object-top transition-opacity duration-500 group-hover:scale-105 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null}

        {/* Fallback gradient if image still loading or not set */}
        {!imgLoaded && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${project.gradient} p-6 flex flex-col justify-between`}
          >
            <span className="font-mono text-xs text-white/60 uppercase">{project.category}</span>
            <div className="text-center my-auto">
              <span className="font-display font-black text-3xl text-white drop-shadow-md">
                {project.name}
              </span>
            </div>
            <span className="font-mono text-xs text-white/80">{project.tagline}</span>
          </div>
        )}

        {/* Live Badge Overlay */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#14110F]/85 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-[#FF5A00] flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00] animate-ping" />
          LIVE DESKTOP
        </div>
      </div>
    </div>
  );
};

export const SelectedWorkSection: React.FC = () => {
  const { setActiveSection } = useScene();
  const { playSnap, playPop } = useSound();
  const { openStartProjectModal } = useStartProjectModal();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  const [projects, setProjects] = useState<Project[]>(STATIC_PROJECTS);

  // Fetch updated projects from server
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(() => {
        // Fallback to static
      });
  }, []);

  useEffect(() => {
    if (isInView) {
      setActiveSection('work');
    }
  }, [isInView, setActiveSection]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -460, behavior: 'smooth' });
      playSnap();
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 460, behavior: 'smooth' });
      playSnap();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative py-28 px-6 sm:px-12 bg-[#14110F] text-[#FFF4E6] overflow-hidden"
    >
      <div className="absolute inset-0 bg-mesh-dark pointer-events-none" />
      <div className="absolute inset-0 dot-grid-pattern-dark pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/10">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-bold">
              PROVEN TRACK RECORD
            </span>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-[#FFF4E6] tracking-tight mt-2">
              Selected{' '}
              <span className="font-serif-accent font-normal italic text-[#38B6FF]">
                Creations.
              </span>
            </h2>
          </div>

          {/* Controls: Nav buttons + Link to all work */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleScrollLeft}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 active:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer"
                aria-label="Previous work project"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleScrollRight}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 active:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer"
                aria-label="Next work project"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <Link
              to="/work"
              onClick={playPop}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#FF5A00] text-white font-display font-bold text-xs sm:text-sm tracking-wide shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] transition-all"
            >
              <span>See all work</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Horizontal Scroll Gallery of Adjusted Desktop Boxes */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory overscroll-x-contain touch-pan-x w-full max-w-full"
        >
          {projects.map((project) => (
            <Link
              key={project.id}
              to="/work"
              data-cursor="view"
              data-cursor-text="VIEW"
              className="w-[82vw] max-w-[310px] sm:w-[350px] md:w-[380px] lg:w-[390px] flex-shrink-0 snap-start rounded-[24px] sm:rounded-[32px] bg-white/5 border-2 border-white/15 p-4 sm:p-6 hover:bg-white/10 hover:border-[#FF5A00]/60 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="flex flex-col gap-3.5">
                <DesktopViewMockup project={project} />

                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#FFF4E6]/60 mb-1">
                    <span>{project.client}</span>
                    <span className="font-bold text-[#FF5A00]">{project.year}</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-[#FFF4E6] group-hover:text-[#FF5A00] transition-colors flex items-center justify-between">
                    <span>{project.name}</span>
                    <ArrowUpRight
                      size={18}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    />
                  </h3>
                  <p className="font-space text-xs sm:text-sm text-[#FFF4E6]/75 mt-1.5 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-white/10 text-[11px] font-mono text-[#FFF4E6]/50">
                {project.tags.slice(0, 3).map((t, idx) => (
                  <span key={t}>
                    {t} {idx < 2 ? '·' : ''}
                  </span>
                ))}
              </div>
            </Link>
          ))}

          {/* "Your brand here" invitation card */}
          <div
            onClick={() => {
              playPop();
              openStartProjectModal();
            }}
            className="w-[82vw] max-w-[310px] sm:w-[350px] md:w-[380px] lg:w-[390px] flex-shrink-0 snap-start rounded-[24px] sm:rounded-[32px] border-3 border-dashed border-[#FF5A00]/60 p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-4 bg-[#FF5A00]/5 hover:bg-[#FF5A00]/15 transition-all group cursor-pointer"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FF5A00] text-white flex items-center justify-center font-display font-black text-2xl group-hover:scale-110 transition-transform shadow-brutal">
              ✦
            </div>
            <div>
              <h4 className="font-display text-xl sm:text-2xl font-black text-[#FFF4E6]">
                Your brand here.
              </h4>
              <p className="font-space text-xs sm:text-sm text-[#FFF4E6]/70 mt-1 max-w-xs">
                This spot is reserved for your next breakout launch. Let's build something unforgettable.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 font-display font-bold text-xs sm:text-sm text-[#FF5A00] group-hover:text-white transition-colors cursor-pointer"
            >
              <span>Start project now</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
