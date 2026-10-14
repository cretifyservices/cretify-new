import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../data/services';
import { useScene } from '../context/SceneContext';
import { useSound } from '../context/SoundContext';

// Mini micro-animations per card
const MicroAnimation: React.FC<{ type: string; color: string }> = ({ type }) => {
  if (type === 'web-development') {
    return (
      <div className="w-full h-28 sm:h-32 rounded-2xl bg-[#14110F] p-3.5 flex flex-col justify-between font-mono text-[11px] text-white/80 overflow-hidden shadow-inner">
        <div className="flex items-center gap-1.5 pb-2 border-b border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="text-[10px] text-white/40 ml-2 font-mono">cretify.in/performance</span>
        </div>
        <div className="flex flex-col gap-1.5 font-mono text-emerald-400">
          <div className="flex items-center gap-2">
            <span className="text-[#FF5A00]">const</span>
            <span className="text-white">vitals</span> = <span className="text-emerald-300">&#123; speed: 99, seo: 100 &#125;;</span>
          </div>
          <div className="text-white/60 text-[10px] flex items-center justify-between">
            <span>✓ Core Web Vitals Passed</span>
            <span className="text-emerald-300 font-bold">0.3s</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-0.5">
            <div className="bg-[#FF5A00] h-full w-[98%] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'ecommerce-stores') {
    return (
      <div className="w-full h-28 sm:h-32 rounded-2xl bg-[#14110F] p-3.5 flex items-center justify-around font-mono text-xs text-white overflow-hidden shadow-inner relative">
        <div className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#6B4DFF]/30 border border-[#6B4DFF] flex items-center justify-center text-xl">
            ☕
          </div>
          <span className="text-[10px] text-white/60">Cart Item</span>
        </div>
        <motion.div
          animate={{ x: [0, 4, 0], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="flex flex-col items-center gap-0.5 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
        >
          <span className="font-bold text-[#27E3A4] text-xs sm:text-sm">+ ₹4,850</span>
          <span className="text-[9px] text-white/70">1-Click Checkout</span>
        </motion.div>
      </div>
    );
  }

  if (type === 'web-apps') {
    return (
      <div className="w-full h-28 sm:h-32 rounded-2xl bg-[#14110F] p-3.5 flex flex-col justify-between font-mono text-xs text-white overflow-hidden shadow-inner">
        <div className="flex items-center justify-between text-[10px] text-white/60">
          <span className="tracking-wider">PORTAL ACTIVE</span>
          <span className="text-[#38B6FF] flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38B6FF] animate-ping" />
            LIVE
          </span>
        </div>
        {/* Animated bar chart */}
        <div className="flex items-end gap-1.5 sm:gap-2 h-12 pt-1">
          {[40, 75, 55, 95, 60, 85, 100].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 10 }}
              animate={{ height: `${h}%` }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 + i * 0.2 }}
              className="flex-1 bg-gradient-to-t from-[#38B6FF]/40 to-[#38B6FF] rounded-t-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'maintenance-support') {
    return (
      <div className="w-full h-28 sm:h-32 rounded-2xl bg-[#14110F] p-3.5 flex flex-col justify-around font-mono text-xs text-white overflow-hidden shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-[#27E3A4] font-bold text-xs sm:text-sm">99.99% UPTIME</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#27E3A4]/20 text-[#27E3A4] font-bold">
            ACTIVE SHIELD
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-white/80">
          <div className="w-2 h-2 rounded-full bg-[#27E3A4]" />
          <span>Continuous Security & Speed Audits</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-white/50">
          <span>Automated snapshot backup verified</span>
        </div>
      </div>
    );
  }

  // video-motion
  return (
    <div className="w-full h-28 sm:h-32 rounded-2xl bg-[#14110F] p-3.5 flex flex-col justify-between font-mono text-xs text-white overflow-hidden shadow-inner">
      <div className="flex items-center justify-between text-[10px] text-white/60">
        <span className="text-[#FF5DA2] font-bold">60 FPS TIMELINE</span>
        <span>00:15:24</span>
      </div>
      {/* Audio waveform */}
      <div className="flex items-center gap-1 h-9 py-1">
        {[20, 60, 40, 80, 100, 35, 70, 90, 45, 65, 85, 30, 95, 50].map((h, idx) => (
          <motion.div
            key={idx}
            animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: idx * 0.06 }}
            className="flex-1 bg-gradient-to-t from-[#FF5DA2]/40 to-[#FF5DA2] rounded-full"
          />
        ))}
      </div>
      <div className="text-[10px] text-white/50 flex justify-between">
        <span>Kinetic Reel Export</span>
        <span className="text-white/80 font-bold">4K ProRes</span>
      </div>
    </div>
  );
};

// Normal Scrolling Service Card Component (No sticky overlapping)
const ServiceCard: React.FC<{ service: typeof SERVICES[0]; index: number }> = ({ service, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const { playSnap } = useSound();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = -((y - centerY) / centerY) * 5;
    const rotY = ((x - centerX) / centerX) * 5;
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={playSnap}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.18s ease-out'
      }}
      className="rounded-[24px] sm:rounded-[32px] border-3 border-[#14110F] bg-white p-5 sm:p-8 md:p-10 shadow-brutal hover:shadow-brutal-lg transition-all"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left: Number, Title, Tagline, Tags */}
        <div className="lg:col-span-7 flex flex-col gap-3.5 sm:gap-4">
          <div className="flex items-center gap-4">
            <span
              className="font-display font-black text-4xl sm:text-5xl"
              style={{ color: service.accentColor }}
            >
              {service.number}
            </span>
            <span className="h-6 w-[2px] bg-[#14110F]/15" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#14110F]/60 font-semibold">
              {service.timeframe}
            </span>
          </div>

          <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-[#14110F] tracking-tight">
            {service.title}
          </h3>

          <p className="font-space text-sm sm:text-base text-[#14110F]/80 leading-relaxed">
            {service.description}
          </p>

          {/* Clean unboxed tags with typographic separator */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-[#14110F]/70">
            {service.tags.map((tag, i) => (
              <React.Fragment key={tag}>
                <span className="font-semibold text-[#14110F]">{tag}</span>
                {i < service.tags.length - 1 && <span className="text-[#14110F]/30">/</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-display font-bold text-[#FF5A00] hover:text-[#14110F] transition-colors group"
            >
              <span>Explore full service deliverables</span>
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:rotate-45"
              />
            </Link>
          </div>
        </div>

        {/* Right: Micro Animation & Key Deliverable Preview */}
        <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-4">
          <MicroAnimation type={service.id} color={service.accentColor} />
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FFF4E6] border border-[#14110F]/10 flex flex-col gap-0.5 sm:gap-1 text-xs font-mono">
            <span className="font-bold text-[#14110F]">Key Deliverable</span>
            <span className="text-[#14110F]/70 text-[11px] sm:text-xs">{service.deliverables[0]}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ServicesSection: React.FC = () => {
  const { setActiveSection } = useScene();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      setActiveSection('services');
    }
  }, [isInView, setActiveSection]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-20 sm:py-28 px-4 sm:px-8 md:px-12 bg-[#FFF4E6]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b-2 border-[#14110F]/15">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-bold">
              OUR CAPABILITIES
            </span>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-[#14110F] tracking-tight mt-2">
              Five things.{' '}
              <span className="font-serif-accent font-normal italic text-[#FF5A00]">
                Done right.
              </span>
            </h2>
          </div>
          <p className="max-w-md font-space text-sm sm:text-base text-[#14110F]/75 leading-relaxed">
            We do not dilute our focus across fifty buzzword services. We master the five disciplines that directly turn visitors into paying customers.
          </p>
        </div>

        {/* Normal scrolling cards one by one (No overlapping) */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
