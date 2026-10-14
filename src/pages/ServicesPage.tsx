import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, Check, Clock, Sparkles } from 'lucide-react';
import { SERVICES } from '../data/services';
import { useSound } from '../context/SoundContext';
import { useStartProjectModal } from '../context/StartProjectModalContext';

export const ServicesPage: React.FC = () => {
  const { playPop } = useSound();
  const { openStartProjectModal } = useStartProjectModal();

  return (
    <div className="relative z-10 pt-32 pb-24 px-6 sm:px-12 bg-[#FFF4E6] text-[#14110F]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-bold">
            DETAILED SPECS
          </span>
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black text-[#14110F] tracking-tight mt-2">
            Our full{' '}
            <span className="font-serif-accent font-normal italic text-[#FF5A00]">
              repertoire.
            </span>
          </h1>
          <p className="font-space text-base sm:text-lg text-[#14110F]/75 mt-4 max-w-xl mx-auto">
            Everything we design and engineer is created in-house with zero bloatware or outsourced middlemen. Here is exactly what is included in each engagement.
          </p>
        </div>

        {/* Full-Height Service Chapters */}
        <div className="flex flex-col gap-16">
          {SERVICES.map((service, index) => (
            <motion.section
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="rounded-[28px] sm:rounded-[36px] border-3 sm:border-4 border-[#14110F] bg-white p-5 sm:p-10 md:p-12 shadow-brutal hover:shadow-brutal-lg transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left Chapter Header */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="font-display font-black text-5xl sm:text-6xl"
                      style={{ color: service.accentColor }}
                    >
                      {service.number}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-[#14110F]/20 bg-[#FFF4E6]">
                      Chapter {index + 1}
                    </span>
                  </div>

                  <h2 className="font-display text-3xl sm:text-4xl font-black text-[#14110F] tracking-tight">
                    {service.title}
                  </h2>

                  <p className="font-space font-semibold text-lg" style={{ color: service.accentColor }}>
                    {service.tagline}
                  </p>

                  <p className="font-space text-base text-[#14110F]/80 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="p-4 rounded-2xl bg-[#FFF4E6] border-2 border-[#14110F] flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#14110F]">
                      <Clock size={16} className="text-[#FF5A00]" />
                      <span>Typical Sprint:</span>
                    </div>
                    <span className="font-display font-black text-sm text-[#14110F]">
                      {service.timeframe}
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        playPop();
                        openStartProjectModal();
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#14110F] text-[#FFF4E6] font-display font-bold text-xs uppercase tracking-wider shadow-brutal-sm hover:shadow-brutal transition-all cursor-pointer"
                    >
                      <span>Inquire about {service.title}</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Right Chapter Checklist */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF4E6] border-2 border-[#14110F]">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#14110F]/60 font-bold block mb-4">
                      WHAT YOU GET & DELIVERABLES
                    </span>

                    <div className="flex flex-col gap-4">
                      {service.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: service.accentColor, color: '#FFF' }}
                          >
                            <Check size={14} strokeWidth={3} />
                          </div>
                          <span className="font-space text-sm sm:text-base text-[#14110F]/90 font-medium">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Core Tech Stack */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-[#14110F]/50 mr-2">TECH & TOOLS:</span>
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-lg border border-[#14110F]/20 bg-white font-mono text-xs text-[#14110F]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};
