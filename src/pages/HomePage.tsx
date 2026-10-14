import React from 'react';
import { HeroSection } from '../sections/HeroSection';
import { MarqueeSection } from '../sections/MarqueeSection';
import { ServicesSection } from '../sections/ServicesSection';
import { SelectedWorkSection } from '../sections/SelectedWorkSection';
import { ProcessSection } from '../sections/ProcessSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { StatsSection } from '../sections/StatsSection';
import { FaqSection } from '../sections/FaqSection';
import { CtaSection } from '../sections/CtaSection';

export const HomePage: React.FC = () => {
  return (
    <div className="relative z-10">
      <HeroSection />
      <MarqueeSection />
      <ServicesSection />
      <SelectedWorkSection />
      <ProcessSection />
      <TestimonialsSection />
      <StatsSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
};
