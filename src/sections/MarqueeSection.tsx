import React from 'react';

export const MarqueeSection: React.FC = () => {
  const line1 = 'DESIGN • BUILD • ANIMATE • LAUNCH • REPEAT • DESIGN • BUILD • ANIMATE • LAUNCH • REPEAT • ';
  const line2 = 'WEBSITE DEVELOPMENT • E-COMMERCE STORES • CUSTOM WEB APPS • AUTOMATION ENGINES • VIDEO EDITING • ';

  return (
    <div className="w-full max-w-full overflow-hidden">
      <section className="relative overflow-hidden py-4 bg-[#FF5A00] border-y-3 border-[#14110F] text-[#14110F] select-none rotate-[-1deg] scale-[1.02] my-6 z-20 max-w-full">
        {/* Top band: Design Build Animate */}
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="animate-marquee-left flex items-center font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-tighter uppercase py-1">
            <span className="mr-4">{line1}</span>
            <span className="mr-4">{line1}</span>
          </div>
        </div>

        {/* Bottom band: Services */}
        <div className="flex whitespace-nowrap overflow-hidden pt-1 border-t border-[#14110F]/20">
          <div className="animate-marquee-right flex items-center font-space font-bold text-sm sm:text-base md:text-lg tracking-wider uppercase text-[#14110F]/90 py-1">
            <span className="mr-4">{line2}</span>
            <span className="mr-4">{line2}</span>
          </div>
        </div>
      </section>
    </div>
  );
};
