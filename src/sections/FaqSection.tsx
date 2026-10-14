import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { FAQS } from '../data/testimonials';
import { useSound } from '../context/SoundContext';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { playPop } = useSound();

  const toggleAccordion = (index: number) => {
    playPop();
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-28 px-6 sm:px-12 bg-[#FFF4E6] text-[#14110F]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-bold">
            COMMON QUESTIONS
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-black text-[#14110F] tracking-tight mt-2">
            Answers before{' '}
            <span className="font-serif-accent font-normal italic text-[#6B4DFF]">
              you ask.
            </span>
          </h2>
          <p className="font-space text-sm sm:text-base text-[#14110F]/70 mt-3">
            Quick, honest facts about how we operate, build, and deliver your project.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border-2 border-[#14110F] bg-white transition-all overflow-hidden shadow-brutal-sm hover:shadow-brutal"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-lg sm:text-xl text-[#14110F]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border border-[#14110F] flex items-center justify-center flex-shrink-0 transition-colors ${
                      isOpen ? 'bg-[#FF5A00] text-white' : 'bg-[#FFF4E6] text-[#14110F]'
                    }`}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-1 font-space text-sm sm:text-base text-[#14110F]/80 leading-relaxed border-t border-[#14110F]/10">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
