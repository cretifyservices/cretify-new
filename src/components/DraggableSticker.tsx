import React, { useState, useRef } from 'react';
import { useSound } from '../context/SoundContext';

interface DraggableStickerProps {
  text: string;
  bgColor?: string;
  textColor?: string;
  initialRotate?: number;
  className?: string;
  icon?: React.ReactNode;
}

export const DraggableSticker: React.FC<DraggableStickerProps> = ({
  text,
  bgColor = '#FFC72C',
  textColor = '#14110F',
  initialRotate = 0,
  className = '',
  icon
}) => {
  const { playPop } = useSound();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag on primary click / touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.stopPropagation();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    dragStartRef.current = {
      x: e.clientX - currentPosRef.current.x,
      y: e.clientY - currentPosRef.current.y
    };
    setIsDragging(true);
    playPop();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.stopPropagation();

    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;

    currentPosRef.current = { x: newX, y: newY };
    setPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      data-cursor="drag"
      data-cursor-text="DRAG"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${initialRotate + (isDragging ? 4 : 0)}deg) scale(${isDragging ? 1.08 : 1})`,
        backgroundColor: bgColor,
        color: textColor,
        touchAction: 'none'
      }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#14110F] shadow-brutal font-display font-black text-xs sm:text-sm uppercase tracking-wider select-none cursor-grab active:cursor-grabbing transition-shadow hover:shadow-brutal-lg z-30 transition-transform duration-75 ${className}`}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <span>{text}</span>
    </div>
  );
};
