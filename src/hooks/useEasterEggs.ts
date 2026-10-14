import { useEffect, useState } from 'react';
import { useScene } from '../context/SceneContext';
import { useSound } from '../context/SoundContext';

export function useEasterEggs() {
  const { triggerSpin } = useScene();
  const { playSuccess, playPop } = useSound();
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  useEffect(() => {
    // Konami code sequence
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let konamiIndex = 0;

    // "hi" key buffer
    let keyBuffer = '';

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing into input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      // Check Konami Code
      if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          triggerSpin();
          playSuccess();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }

      // Check "hi" typing
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > 5) {
        keyBuffer = keyBuffer.slice(-5);
      }
      if (keyBuffer.endsWith('hi')) {
        playPop();
        setShowSpeechBubble(true);
        setTimeout(() => setShowSpeechBubble(false), 4500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerSpin, playSuccess, playPop]);

  return { showSpeechBubble, hideSpeechBubble: () => setShowSpeechBubble(false) };
}
