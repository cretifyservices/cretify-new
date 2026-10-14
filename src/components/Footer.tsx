import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { PhysicsFooterToy } from './PhysicsFooterToy';
import { DraggableSticker } from './DraggableSticker';
import { useSound } from '../context/SoundContext';

export const Footer: React.FC = () => {
  const { playPop } = useSound();

  const servicesList = [
    { label: 'Website Development', path: '/services' },
    { label: 'E-commerce Store Setup', path: '/services' },
    { label: 'Web App Development', path: '/services' },
    { label: 'Maintenance & Support', path: '/services' },
    { label: 'Video Editing & Motion', path: '/services' }
  ];

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Selected Work', path: '/work' },
    { label: 'Services', path: '/services' },
    { label: 'About Agency', path: '/about' },
    { label: 'Start Project', path: '/contact' }
  ];

  return (
    <footer className="relative bg-[#14110F] text-[#FFF4E6] pt-16 pb-12 px-6 sm:px-12 border-t-4 border-[#14110F] overflow-hidden">
      {/* Background glow and subtle film grain */}
      <div className="absolute inset-0 bg-mesh-dark pointer-events-none" />
      <div className="absolute inset-0 film-grain pointer-events-none" />

      {/* Draggable stickers & Physics toy - Desktop Only */}
      <div className="hidden md:block">
        <div className="relative max-w-7xl mx-auto mb-10 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <DraggableSticker text="🚀 SHIPPED FAST" bgColor="#FF5A00" textColor="#FFF4E6" initialRotate={-3} />
            <DraggableSticker text="🇮🇳 MADE IN INDIA" bgColor="#27E3A4" textColor="#14110F" initialRotate={4} />
            <DraggableSticker text="✨ ZERO FLUFF" bgColor="#FFC72C" textColor="#14110F" initialRotate={-2} />
          </div>
          <span className="font-mono text-xs text-[#FFF4E6]/50 tracking-widest uppercase">
            PSST: STICKERS & LETTERS ARE DRAGGABLE
          </span>
        </div>

        {/* Physics toy canvas container */}
        <div className="relative max-w-7xl mx-auto mb-16">
          <PhysicsFooterToy />
        </div>
      </div>

      {/* Main footer columns */}
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
        {/* Col 1: Brand & Positioning */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Link to="/" onClick={playPop} className="flex items-center gap-2 group w-fit">
            <div className="w-10 h-10 rounded-xl bg-[#FFF4E6] text-[#14110F] flex items-center justify-center font-display font-black text-xl shadow-brutal-sm group-hover:scale-105 transition-transform">
              <span>C</span>
              <span className="w-2 h-2 rounded-full bg-[#FF5A00] ml-0.5 -mt-2" />
            </div>
            <span className="font-display font-black tracking-tight text-3xl text-[#FFF4E6]">
              CRETIFY
            </span>
          </Link>

          <p className="font-space text-sm text-[#FFF4E6]/70 leading-relaxed max-w-md">
            An independent digital agency crafting modern web applications, digital presence, and automated systems for companies reaching further than before.
          </p>

          <div className="flex flex-col gap-2 pt-2 text-sm font-mono text-[#FFF4E6]/80">
            <a
              href="mailto:services@cretify.in"
              className="flex items-center gap-2 hover:text-[#FF5A00] transition-colors"
            >
              <Mail size={16} className="text-[#FF5A00]" />
              <span>services@cretify.in</span>
            </a>
            <a
              href="tel:+917061899513"
              className="flex items-center gap-2 hover:text-[#FF5A00] transition-colors"
            >
              <Phone size={16} className="text-[#27E3A4]" />
              <span>+91 70618 99513 / +91 74850 94642</span>
            </a>
            <div className="flex items-center gap-2 text-[#FFF4E6]/60">
              <MapPin size={16} className="text-[#38B6FF]" />
              <span>Ranchi, Jharkhand, India — Serving Globally</span>
            </div>
          </div>
        </div>

        {/* Col 2: Services */}
        <div className="flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-semibold">
            SERVICES
          </span>
          <div className="flex flex-col gap-2.5">
            {servicesList.map((srv) => (
              <Link
                key={srv.label}
                to={srv.path}
                className="text-sm text-[#FFF4E6]/75 hover:text-[#FFF4E6] transition-colors flex items-center gap-1 group"
              >
                <span>{srv.label}</span>
                <ArrowUpRight
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Col 3: Navigation */}
        <div className="flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#38B6FF] font-semibold">
            EXPLORE
          </span>
          <div className="flex flex-col gap-2.5">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-sm text-[#FFF4E6]/75 hover:text-[#FFF4E6] transition-colors flex items-center gap-1 group"
              >
                <span>{link.label}</span>
                <ArrowUpRight
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Col 4: Direct WhatsApp & Call Card */}
        <div className="flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#27E3A4] font-semibold">
            FASTEST CONTACT
          </span>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
            <span className="text-xs font-mono text-[#FFF4E6]/70">Got an urgent launch?</span>
            <a
              href="https://wa.me/917061899513?text=Hey%20Cretify!%20I'm%20interested%20in%20building%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] text-white font-display font-bold text-xs uppercase tracking-wide text-center hover:brightness-110 shadow-brutal-sm transition-all"
            >
              WhatsApp Us Direct
            </a>
            <span className="text-[11px] text-[#FFF4E6]/50 text-center font-mono">
              Usually replies in &lt; 2 hours
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#FFF4E6]/60">
        <div className="flex items-center gap-2">
          <span>Made with</span>
          <Heart size={14} className="text-[#FF5DA2] fill-[#FF5DA2] inline" />
          <span>in India, built for ambitious companies worldwide.</span>
        </div>
        <div className="flex items-center gap-6">
          <span>&copy; {new Date().getFullYear()} CRETIFY. All rights reserved.</span>
          <Link to="/admin" className="text-white/40 hover:text-[#FF5A00] transition-colors">
            Admin
          </Link>
          <span className="hover:text-white transition-colors cursor-pointer" data-cursor="heart">cretify.in</span>
        </div>
      </div>
    </footer>
  );
};
