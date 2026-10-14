import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Menu, X, Sparkles } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { useStartProjectModal } from '../context/StartProjectModalContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { playPop, playSnap } = useSound();
  const { openStartProjectModal } = useStartProjectModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Work', path: '/work' },
    { label: 'Services', path: '/services' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-4 flex justify-center pointer-events-none transition-all">
        <nav
          className={`pointer-events-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border transition-all duration-300 ${
            isScrolled
              ? 'bg-[#FFF4E6]/85 backdrop-blur-xl border-[#14110F]/15 shadow-brutal-sm'
              : 'bg-[#FFF4E6]/95 backdrop-blur-md border-[#14110F]/10 shadow-sm'
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            onClick={playPop}
            className="flex items-center gap-2 group pr-1"
            aria-label="Cretify Home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#14110F] flex items-center justify-center text-[#FFF4E6] font-display font-black text-lg transition-transform group-hover:scale-105 shadow-brutal-sm">
              <span>C</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00] ml-0.5 -mt-2 animate-pulse" />
            </div>
            <span className="font-display font-black tracking-tight text-lg sm:text-xl text-[#14110F] uppercase">
              CRETIFY
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onMouseEnter={playSnap}
                  className={`relative py-1 text-[#14110F]/80 hover:text-[#14110F] transition-colors group ${
                    isActive ? 'font-semibold text-[#FF5A00]' : ''
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-[#FF5A00] transition-all duration-200 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Controls: Start Project CTA */}
          <div className="flex items-center gap-2.5">
            {/* Start a project primary CTA */}
            <button
              type="button"
              onClick={() => {
                playPop();
                openStartProjectModal();
              }}
              className="group flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#FF5A00] text-white font-medium text-xs sm:text-sm tracking-wide shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all cursor-pointer"
            >
              <span>Start a project</span>
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:rotate-45"
              />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => {
                playSnap();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 rounded-full border border-[#14110F]/15 bg-white/60 text-[#14110F] cursor-pointer"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#FFF4E6] flex flex-col justify-between p-8 pt-28 md:hidden"
          >
            <div className="flex flex-col gap-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#14110F]/40">
                NAVIGATION
              </span>
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => {
                      playPop();
                      setMobileMenuOpen(false);
                    }}
                    className={`font-display text-4xl font-extrabold flex items-center justify-between py-2 border-b border-[#14110F]/10 ${
                      location.pathname === link.path ? 'text-[#FF5A00]' : 'text-[#14110F]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight size={28} className="opacity-40" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t border-[#14110F]/10">
              <div className="flex items-center justify-between text-sm font-mono text-[#14110F]/70">
                <span>Ranchi, India / Global</span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Taking Projects
                </span>
              </div>
              <a
                href="https://wa.me/917061899513"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3.5 rounded-full bg-[#14110F] text-[#FFF4E6] font-display font-bold shadow-brutal"
              >
                Chat on WhatsApp (+91 70618 99513)
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
