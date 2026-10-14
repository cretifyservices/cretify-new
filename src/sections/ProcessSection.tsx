import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { Rocket, FileText, Code2, CheckCheck } from 'lucide-react';
import { useScene } from '../context/SceneContext';

export const ProcessSection: React.FC = () => {
  const { setActiveSection } = useScene();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      setActiveSection('process');
    }
  }, [isInView, setActiveSection]);

  const steps = [
    {
      num: '01',
      title: 'BRIEF',
      lead: 'Tell us what you need.',
      desc: 'We hop on a casual 20-minute call or WhatsApp thread. We map your audience, define key metrics, gather existing assets, and agree on a crisp, fixed sprint scope.',
      badge: 'Discovery & Direction',
      color: '#FF5A00',
      icon: FileText
    },
    {
      num: '02',
      title: 'BUILD',
      lead: 'Design, code and automation in sync.',
      desc: 'No black-box radio silence. You receive private staging links every 72 hours. We polish interactive prototypes, write pristine TypeScript, and hook up automation workflows.',
      badge: 'Iterative Sprints',
      color: '#6B4DFF',
      icon: Code2
    },
    {
      num: '03',
      title: 'LAUNCH',
      lead: 'You go live, we stay for orbit.',
      desc: 'Flawless DNS handover, search console indexing, and analytics verification. Once live, we stick around to handle upgrades, speed optimization, and ongoing maintenance.',
      badge: 'Orbit & Evolution',
      color: '#27E3A4',
      icon: Rocket
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative py-28 px-6 sm:px-12 bg-[#FFF4E6] text-[#14110F] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b-2 border-[#14110F]/15">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-bold">
              HOW WE WORK
            </span>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-[#14110F] tracking-tight mt-2">
              No drama.{' '}
              <span className="font-serif-accent font-normal italic text-[#6B4DFF]">
                Just delivery.
              </span>
            </h2>
          </div>
          <p className="max-w-md font-space text-base text-[#14110F]/75 leading-relaxed">
            Eliminating agency bureaucracy. You work directly with senior creative engineers who actually write the code and design every pixel.
          </p>
        </div>

        {/* 3 Giant Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="rounded-[32px] bg-white border-3 border-[#14110F] p-8 shadow-brutal flex flex-col justify-between relative group hover:shadow-brutal-lg transition-all"
              >
                <div>
                  {/* Top Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="font-display font-black text-4xl"
                      style={{ color: step.color }}
                    >
                      {step.num}
                    </span>
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-[#14110F]"
                      style={{ backgroundColor: `${step.color}20`, color: step.color }}
                    >
                      <Icon size={24} />
                    </div>
                  </div>

                  <span className="font-mono text-xs uppercase tracking-wider text-[#14110F]/50 block mb-1">
                    {step.badge}
                  </span>

                  <h3 className="font-display text-3xl font-extrabold text-[#14110F] tracking-tight mb-2">
                    {step.title}
                  </h3>

                  <p className="font-space font-semibold text-base text-[#14110F] mb-3">
                    {step.lead}
                  </p>

                  <p className="font-space text-sm text-[#14110F]/70 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom line status */}
                <div className="pt-6 mt-6 border-t border-[#14110F]/10 flex items-center gap-2 text-xs font-mono text-[#14110F]/60">
                  <CheckCheck size={14} className="text-[#27E3A4]" />
                  <span>Sprint-verified milestone</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
