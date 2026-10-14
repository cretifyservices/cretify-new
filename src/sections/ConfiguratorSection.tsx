import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Sparkles, MessageCircle, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useScene } from '../context/SceneContext';
import { useSound } from '../context/SoundContext';

export const ConfiguratorSection: React.FC = () => {
  const { setActiveSection, setConfiguratorType, cycleSparkColor } = useScene();
  const { playPop, playSnap } = useSound();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  const [projectType, setProjectType] = useState<'Business site' | 'Online store' | 'Web app'>('Business site');
  const [vibe, setVibe] = useState<'Bold' | 'Minimal' | 'Playful'>('Playful');
  const [addOns, setAddOns] = useState<string[]>(['Interactive 3D / Animations', 'CMS / Blog Setup']);

  useEffect(() => {
    if (isInView) {
      setActiveSection('configurator');
    }
  }, [isInView, setActiveSection]);

  const toggleAddon = (item: string) => {
    playSnap();
    if (addOns.includes(item)) {
      setAddOns(addOns.filter((i) => i !== item));
    } else {
      setAddOns([...addOns, item]);
    }
  };

  const handleTypeChange = (type: 'Business site' | 'Online store' | 'Web app') => {
    playPop();
    setProjectType(type);
    setConfiguratorType(type);
    cycleSparkColor();
  };

  // Timeline calculation
  const getTimeline = () => {
    let base = 2;
    if (projectType === 'Online store') base = 3;
    if (projectType === 'Web app') base = 4;
    if (addOns.length >= 3) base += 1;
    return `${base} – ${base + 1} Weeks`;
  };

  // WhatsApp prefilled message
  const getWhatsAppMessage = () => {
    const text = `Hey Cretify! I used your website configurator:
• Project: ${projectType}
• Vibe: ${vibe}
• Features: ${addOns.join(', ')}
• Target Timeline: ${getTimeline()}

I'd love to chat about bringing this to life!`;
    return encodeURIComponent(text);
  };

  const allAddOns = [
    'Interactive 3D / Animations',
    'CMS / Blog Setup',
    'Payment Gateways (Razorpay/Stripe)',
    'Admin & Analytics Portal',
    'Automated WhatsApp/Email Alerts',
    'Custom SEO & Speed Hardening'
  ];

  return (
    <section
      ref={sectionRef}
      id="configurator"
      className="relative py-28 px-6 sm:px-12 bg-gradient-to-br from-[#6B4DFF]/90 via-[#38B6FF]/80 to-[#27E3A4]/75 text-white overflow-hidden"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-mono tracking-widest uppercase border border-white/30 backdrop-blur-md">
            <Sparkles size={12} className="text-[#FFC72C]" />
            <span>Interactive Project Estimator</span>
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight mt-3">
            Build your project in 30 seconds.
          </h2>
          <p className="font-space text-sm sm:text-base text-white/80 mt-2">
            Pick your format, aesthetic vibe, and superpower add-ons. Watch the 3D spark adapt in real time!
          </p>
        </div>

        {/* The Glass Configurator Card */}
        <div className="rounded-[32px] bg-[#14110F]/85 backdrop-blur-2xl border-2 border-white/20 p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Choices */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              {/* Step 1: Project Type */}
              <div className="flex flex-col gap-3">
                <label className="font-mono text-xs uppercase tracking-wider text-white/60">
                  1. Choose Your Project Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['Business site', 'Online store', 'Web app'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeChange(type)}
                      className={`py-3 px-4 rounded-2xl font-display font-bold text-xs uppercase tracking-wide border-2 transition-all cursor-pointer text-center ${
                        projectType === type
                          ? 'bg-[#FF5A00] text-white border-[#FF5A00] shadow-brutal-sm'
                          : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Aesthetic Vibe */}
              <div className="flex flex-col gap-3">
                <label className="font-mono text-xs uppercase tracking-wider text-white/60">
                  2. Select Aesthetic Vibe
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Playful', 'Bold', 'Minimal'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        playSnap();
                        setVibe(v);
                      }}
                      className={`py-2.5 px-3 rounded-2xl font-display font-bold text-xs uppercase tracking-wide border-2 transition-all cursor-pointer text-center ${
                        vibe === v
                          ? 'bg-[#38B6FF] text-[#14110F] border-[#38B6FF] shadow-brutal-sm'
                          : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Add-on Capabilities */}
              <div className="flex flex-col gap-3">
                <label className="font-mono text-xs uppercase tracking-wider text-white/60">
                  3. Supercharge With Add-ons
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {allAddOns.map((item) => {
                    const isSelected = addOns.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAddon(item)}
                        className={`p-3 rounded-xl border text-left text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#27E3A4]/15 border-[#27E3A4] text-[#27E3A4]'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <span>{item}</span>
                        {isSelected ? (
                          <CheckCircle2 size={14} className="text-[#27E3A4] flex-shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Estimate & WhatsApp CTA */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/15">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="font-mono text-xs text-white/60 uppercase">Specification</span>
                  <span className="font-mono text-xs text-[#27E3A4] font-semibold">Active Scope</span>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-white/50 block">PROJECT TYPE</span>
                    <span className="font-display font-bold text-xl text-white">{projectType}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-white/50 block">AESTHETIC VIBE</span>
                    <span className="font-display font-bold text-lg text-[#38B6FF]">{vibe} Direction</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-white/50 block">SELECTED MODULES</span>
                    <span className="font-mono text-xs text-white/80">{addOns.length} capabilities selected</span>
                  </div>
                </div>

                {/* Delivery Timeline Pill */}
                <div className="p-4 rounded-2xl bg-[#FF5A00]/15 border border-[#FF5A00]/30 flex items-center gap-3">
                  <Clock size={20} className="text-[#FF5A00]" />
                  <div>
                    <span className="font-mono text-[10px] text-white/60 block uppercase">
                      Estimated Sprint Time
                    </span>
                    <span className="font-display font-black text-lg text-white">
                      {getTimeline()}
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Action Button */}
              <div className="pt-6">
                <a
                  href={`https://wa.me/917061899513?text=${getWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playPop}
                  className="w-full py-4 px-6 rounded-full bg-[#25D366] text-white font-display font-extrabold text-sm uppercase tracking-wide flex items-center justify-center gap-3 shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  <MessageCircle size={18} className="fill-white" />
                  <span>Send to Cretify on WhatsApp</span>
                </a>
                <span className="block text-[11px] font-mono text-white/50 text-center mt-2">
                  Pre-fills all your selections with zero commitment.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
