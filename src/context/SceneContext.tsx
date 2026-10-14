import React, { createContext, useContext, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

export type SceneSection = 'hero' | 'services' | 'work' | 'configurator' | 'process' | 'testimonials' | 'cta';

const SPARK_COLORS = ['#FF5A00', '#6B4DFF', '#27E3A4', '#FF5DA2', '#38B6FF', '#FFC72C'];

interface SceneContextType {
  activeSection: SceneSection;
  setActiveSection: (section: SceneSection) => void;
  sparkColor: string;
  colorIndex: number;
  cycleSparkColor: (e?: React.MouseEvent | MouseEvent) => void;
  clickCount: number;
  isSpinning: boolean;
  triggerSpin: () => void;
  configuratorType: 'Business site' | 'Online store' | 'Web app';
  setConfiguratorType: (type: 'Business site' | 'Online store' | 'Web app') => void;
  squashScale: number;
  triggerSquash: () => void;
}

const SceneContext = createContext<SceneContextType>({
  activeSection: 'hero',
  setActiveSection: () => {},
  sparkColor: '#FF5A00',
  colorIndex: 0,
  cycleSparkColor: () => {},
  clickCount: 0,
  isSpinning: false,
  triggerSpin: () => {},
  configuratorType: 'Business site',
  setConfiguratorType: () => {},
  squashScale: 1,
  triggerSquash: () => {}
});

export const SceneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<SceneSection>('hero');
  const [colorIndex, setColorIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [configuratorType, setConfiguratorType] = useState<'Business site' | 'Online store' | 'Web app'>('Business site');
  const [squashScale, setSquashScale] = useState(1);

  const sparkColor = SPARK_COLORS[colorIndex];

  const triggerSquash = useCallback(() => {
    setSquashScale(0.78);
    setTimeout(() => {
      setSquashScale(1.18);
      setTimeout(() => {
        setSquashScale(1);
      }, 180);
    }, 120);
  }, []);

  const cycleSparkColor = useCallback((e?: React.MouseEvent | MouseEvent) => {
    setColorIndex((prev) => (prev + 1) % SPARK_COLORS.length);
    setClickCount((prev) => prev + 1);
    triggerSquash();

    // Trigger colorful confetti burst
    const x = e ? e.clientX / window.innerWidth : 0.75;
    const y = e ? e.clientY / window.innerHeight : 0.45;

    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { x, y },
        colors: ['#FF5A00', '#6B4DFF', '#27E3A4', '#FF5DA2', '#38B6FF', '#FFC72C'],
        disableForReducedMotion: true
      });
    } catch {}
  }, [triggerSquash]);

  const triggerSpin = useCallback(() => {
    setIsSpinning(true);
    try {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FF5A00', '#6B4DFF', '#27E3A4', '#FF5DA2', '#38B6FF'],
        disableForReducedMotion: true
      });
    } catch {}
    setTimeout(() => {
      setIsSpinning(false);
    }, 2800);
  }, []);

  return (
    <SceneContext.Provider
      value={{
        activeSection,
        setActiveSection,
        sparkColor,
        colorIndex,
        cycleSparkColor,
        clickCount,
        isSpinning,
        triggerSpin,
        configuratorType,
        setConfiguratorType,
        squashScale,
        triggerSquash
      }}
    >
      {children}
    </SceneContext.Provider>
  );
};

export const useScene = () => useContext(SceneContext);
