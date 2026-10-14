import React from 'react';
import { motion } from 'motion/react';
import { AGENCY_STATS } from '../data/testimonials';

export const StatsSection: React.FC = () => {
  return (
    <section className="py-20 px-6 sm:px-12 bg-[#FFF4E6] border-y-2 border-[#14110F]/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {AGENCY_STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex flex-col items-start gap-1"
            >
              <span className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#14110F] tracking-tight">
                {stat.value}
              </span>
              <span className="font-display font-bold text-sm sm:text-base text-[#FF5A00]">
                {stat.label}
              </span>
              <span className="font-mono text-xs text-[#14110F]/60">
                {stat.caption}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
