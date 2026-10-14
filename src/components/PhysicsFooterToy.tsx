import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { RotateCcw, Sparkles } from 'lucide-react';
import { useSound } from '../context/SoundContext';

export const PhysicsFooterToy: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const { playPop } = useSound();
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!sceneRef.current || !canvasRef.current) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;

    const width = sceneRef.current.clientWidth || 800;
    const height = 360;

    // Create engine
    const engine = Engine.create({
      gravity: { x: 0, y: 1.1 }
    });
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent',
        showAngleIndicator: false
      }
    });
    renderRef.current = render;

    // Wall boundaries
    const wallOptions: Matter.IChamferableBodyDefinition = {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    };

    const ground = Bodies.rectangle(width / 2, height + 30, width * 2, 60, wallOptions);
    const leftWall = Bodies.rectangle(-30, height / 2, 60, height * 2, wallOptions);
    const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height * 2, wallOptions);

    // Letter blocks and shapes
    const colors = ['#FF5A00', '#6B4DFF', '#27E3A4', '#FF5DA2', '#38B6FF', '#FFC72C'];
    const blocks: Matter.Body[] = [];

    // The primary letters of "LET'S TALK"
    const letterData = [
      { char: 'L', color: '#FF5A00', w: 55, h: 55 },
      { char: 'E', color: '#6B4DFF', w: 55, h: 55 },
      { char: 'T', color: '#38B6FF', w: 55, h: 55 },
      { char: "'", color: '#FFC72C', w: 35, h: 55 },
      { char: 'S', color: '#27E3A4', w: 55, h: 55 },
      { char: 'T', color: '#FF5DA2', w: 55, h: 55 },
      { char: 'A', color: '#FF5A00', w: 55, h: 55 },
      { char: 'L', color: '#6B4DFF', w: 55, h: 55 },
      { char: 'K', color: '#38B6FF', w: 55, h: 55 }
    ];

    letterData.forEach((item, idx) => {
      const x = (width * 0.2) + (idx * 55) % (width * 0.6);
      const y = -40 - (idx * 30);
      const body = Bodies.rectangle(x, y, item.w, item.h, {
        chamfer: { radius: 12 },
        restitution: 0.7,
        friction: 0.1,
        render: {
          fillStyle: item.color,
          strokeStyle: '#14110F',
          lineWidth: 3
        }
      });
      // Store text metadata for custom canvas rendering
      (body as any).customText = item.char;
      (body as any).textColor = '#FFF4E6';
      blocks.push(body);
    });

    // Extra colourful balls and cubes to pile up
    for (let i = 0; i < 8; i++) {
      const radius = 22 + Math.random() * 14;
      const x = Math.random() * (width - 100) + 50;
      const y = -100 - i * 40;
      const color = colors[i % colors.length];

      if (i % 2 === 0) {
        const circle = Bodies.circle(x, y, radius, {
          restitution: 0.8,
          friction: 0.1,
          render: {
            fillStyle: color,
            strokeStyle: '#14110F',
            lineWidth: 3
          }
        });
        blocks.push(circle);
      } else {
        const box = Bodies.rectangle(x, y, radius * 1.8, radius * 1.8, {
          chamfer: { radius: 10 },
          restitution: 0.65,
          friction: 0.2,
          render: {
            fillStyle: color,
            strokeStyle: '#14110F',
            lineWidth: 3
          }
        });
        blocks.push(box);
      }
    }

    Composite.add(engine.world, [ground, leftWall, rightWall, ...blocks]);

    // Mouse control for grabbing and throwing
    const mouse = Mouse.create(canvasRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    Composite.add(engine.world, mouseConstraint);

    // Custom text rendering over the physics bodies
    Matter.Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      if (!ctx) return;

      blocks.forEach((body) => {
        const customText = (body as any).customText;
        if (customText) {
          const { x, y } = body.position;
          const angle = body.angle;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.font = 'bold 24px "Bricolage Grotesque", sans-serif';
          ctx.fillStyle = '#FFF4E6';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(customText, 0, 0);
          ctx.restore();
        }
      });
    });

    // Run engine and renderer
    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [resetKey]);

  const handleReset = () => {
    playPop();
    setResetKey((k) => k + 1);
  };

  return (
    <div
      ref={sceneRef}
      className="relative w-full rounded-3xl bg-[#14110F]/60 border-2 border-white/10 backdrop-blur-md overflow-hidden p-2 select-none shadow-inner"
    >
      <div className="absolute top-4 left-6 z-10 flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#FFF4E6]/80 border border-white/10">
          <Sparkles size={12} className="text-[#FF5A00]" />
          <span>Grab & throw the letters!</span>
        </span>
      </div>

      <div className="absolute top-4 right-6 z-10">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF4E6] text-xs font-mono border border-white/15 transition-all cursor-pointer"
          title="Drop shapes again"
        >
          <RotateCcw size={12} />
          <span>Drop again</span>
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-[360px] cursor-grab active:cursor-grabbing block"
      />
    </div>
  );
};
