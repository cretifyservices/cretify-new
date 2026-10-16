import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ExternalLink, X, CheckCircle2, Sparkles } from 'lucide-react';
import { PROJECTS as STATIC_PROJECTS } from '../data/projects';
import { Project } from '../types';
import { useSound } from '../context/SoundContext';
import { useStartProjectModal } from '../context/StartProjectModalContext';

export const WorkPage: React.FC = () => {
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(STATIC_PROJECTS);
  const { playPop, playSnap } = useSound();
  const { openStartProjectModal } = useStartProjectModal();

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Fetch failed');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(() => {});
  }, []);

  const openProjectModal = (proj: Project) => {
    playPop();
    setActiveModalProject(proj);
  };

  const closeModal = () => {
    playSnap();
    setActiveModalProject(null);
  };

  return (
    <div className="relative z-10 pt-32 pb-24 px-6 sm:px-12 min-h-screen bg-[#FFF4E6] text-[#14110F]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-bold">
            CASE STUDIES & CRAFT
          </span>
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black text-[#14110F] tracking-tight mt-2">
            Proof,{' '}
            <span className="font-serif-accent font-normal italic text-[#6B4DFF]">
              not promises.
            </span>
          </h1>
          <p className="font-space text-base sm:text-lg text-[#14110F]/75 mt-4 max-w-xl mx-auto">
            Explore real products, high-conversion ecommerce experiences, and automated platforms we have engineered for clients around the globe.
          </p>
        </div>

        {/* Projects Grid: Adjusted desktop aspect ratio */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {projects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => openProjectModal(project)}
                data-cursor="view"
                data-cursor-text="VIEW"
                className="rounded-[32px] bg-white border-3 border-[#14110F] p-6 shadow-brutal hover:shadow-brutal-lg transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Browser Desktop Window Box */}
                  <div className="w-full rounded-2xl bg-[#14110F] border-2 border-[#14110F] overflow-hidden shadow-brutal mb-5 group-hover:scale-[1.01] transition-transform">
                    {/* Top chrome bar */}
                    <div className="h-7 bg-[#25221f] px-3 flex items-center justify-between border-b border-white/10 select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                        <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                        <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
                      </div>
                      <span className="text-[10px] font-mono text-white/50 truncate max-w-[150px]">
                        {project.liveUrl?.replace('https://', '') || `${project.id}.cretify.in`}
                      </span>
                      <div className="w-6" />
                    </div>

                    {/* Screenshot image container */}
                    <div className="relative aspect-[16/10] bg-[#14110F] overflow-hidden">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${project.gradient} p-4 flex items-center justify-center`}>
                          <span className="font-display font-black text-xl text-white">{project.name}</span>
                        </div>
                      )}
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#14110F]/80 backdrop-blur-sm text-[9px] font-mono text-[#FF5A00] font-bold border border-white/20">
                        LIVE ●
                      </div>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs text-[#14110F]/60 block mb-1">
                        {project.client ? `${project.client} · ` : ''}{project.category}
                      </span>
                      <h3 className="font-display text-2xl font-black text-[#14110F] group-hover:text-[#FF5A00] transition-colors">
                        {project.name}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-[#14110F] bg-[#FFF4E6] flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF5A00] group-hover:text-white transition-colors">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  <p className="font-space text-sm text-[#14110F]/80 mt-3 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Footer tags */}
                <div className="pt-4 mt-4 border-t border-[#14110F]/10 flex flex-wrap items-center gap-2 text-xs font-mono text-[#14110F]/60">
                  {project.tags.slice(0, 3).map((tag, idx) => (
                    <span key={tag}>
                      {tag} {idx < 2 ? '·' : ''}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* "Your brand here" Last Card */}
            <motion.div
              layout
              onClick={() => {
                playPop();
                openStartProjectModal();
              }}
              className="rounded-[32px] border-3 border-dashed border-[#14110F] bg-white/40 p-8 flex flex-col items-center justify-center text-center gap-4 group cursor-pointer hover:bg-white/70 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-[#FF5A00] text-white flex items-center justify-center text-2xl font-black shadow-brutal group-hover:scale-105 transition-transform">
                ✦
              </div>
              <h3 className="font-display text-2xl font-black text-[#14110F]">
                Your brand here.
              </h3>
              <p className="font-space text-sm text-[#14110F]/70 max-w-xs">
                This spot isn't taken yet. Partner with Cretify and launch your dream website this month.
              </p>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#14110F] text-[#FFF4E6] font-display font-bold text-xs uppercase tracking-wide shadow-brutal-sm hover:shadow-brutal transition-all"
              >
                <span>Start a project</span>
                <ArrowUpRight size={14} />
              </button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Case Study Full Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-[#14110F]/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[36px] bg-[#FFF4E6] border-4 border-[#14110F] p-6 sm:p-10 shadow-2xl z-10"
            >
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 w-12 h-12 rounded-full border-2 border-[#14110F] bg-white hover:bg-[#FF5A00] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-brutal-sm"
                aria-label="Close case study details"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#14110F]/60 mb-2">
                    {activeModalProject.client && (
                      <>
                        <span>{activeModalProject.client}</span>
                        <span>·</span>
                      </>
                    )}
                    <span className="font-bold text-[#FF5A00]">{activeModalProject.category}</span>
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl font-black text-[#14110F] tracking-tight">
                    {activeModalProject.name}
                  </h2>
                  <p className="font-space font-medium text-lg text-[#14110F]/80 mt-2">
                    {activeModalProject.tagline}
                  </p>
                </div>

                {/* Hero Desktop Mockup */}
                <div className="w-full rounded-3xl bg-[#14110F] border-3 border-[#14110F] overflow-hidden shadow-brutal flex flex-col">
                  <div className="h-8 bg-[#25221f] px-4 flex items-center justify-between border-b border-white/10 select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="text-xs font-mono text-white/60">
                      {activeModalProject.liveUrl || 'https://cretify.in'}
                    </span>
                    <div className="w-12" />
                  </div>
                  <div className="relative aspect-[16/9] w-full bg-[#14110F]">
                    {activeModalProject.imageUrl ? (
                      <img
                        src={activeModalProject.imageUrl}
                        alt={activeModalProject.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : null}
                  </div>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-white border-2 border-[#14110F] shadow-brutal-sm">
                  {activeModalProject.metrics.map((m, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <span className="font-display font-black text-2xl sm:text-3xl text-[#FF5A00]">
                        {m.value}
                      </span>
                      <span className="font-mono text-xs text-[#14110F]/70 mt-0.5">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Deep Dive */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-white border-2 border-[#14110F]">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#FF5A00] font-bold block mb-2">
                      01 / THE CHALLENGE
                    </span>
                    <p className="font-space text-sm text-[#14110F]/80 leading-relaxed">
                      {activeModalProject.challenge}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border-2 border-[#14110F]">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#6B4DFF] font-bold block mb-2">
                      02 / THE SOLUTION
                    </span>
                    <p className="font-space text-sm text-[#14110F]/80 leading-relaxed">
                      {activeModalProject.solution}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border-2 border-[#14110F]">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#27E3A4] font-bold block mb-2">
                      03 / THE OUTCOME
                    </span>
                    <p className="font-space text-sm text-[#14110F]/80 leading-relaxed">
                      {activeModalProject.result}
                    </p>
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <h4 className="font-display font-bold text-lg text-[#14110F] mb-3">
                    Deliverables & Engineering Stack
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeModalProject.deliverables.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#14110F]/15 font-mono text-xs"
                      >
                        <CheckCircle2 size={16} className="text-[#27E3A4] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#14110F]/15">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#14110F]/60">
                    <span>Stack:</span>
                    {activeModalProject.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-[#14110F]/5 text-[#14110F]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {activeModalProject.liveUrl && (
                      <a
                        href={activeModalProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-[#14110F] font-display font-bold text-xs uppercase tracking-wider shadow-brutal-sm hover:shadow-brutal transition-all"
                      >
                        <span>Visit live site</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        closeModal();
                        openStartProjectModal();
                      }}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF5A00] text-white font-display font-bold text-xs uppercase tracking-wider shadow-brutal hover:shadow-brutal-sm transition-all cursor-pointer"
                    >
                      <span>Build similar project</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
