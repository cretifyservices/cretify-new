import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useScene } from '../../context/SceneContext';
import { useSound } from '../../context/SoundContext';

// Procedural 3D "C" geometry with rounded extrusion
function createCretifyCShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const outerR = 1.5;
  const innerR = 0.85;
  const startAngle = 0.72; // leaves opening on the right
  const endAngle = Math.PI * 2 - 0.72;

  // Outer arc
  shape.absarc(0, 0, outerR, startAngle, endAngle, false);

  // Top cap rounded point
  const topX = Math.cos(endAngle) * innerR;
  const topY = Math.sin(endAngle) * innerR;
  shape.lineTo(topX, topY);

  // Inner arc (backwards)
  shape.absarc(0, 0, innerR, endAngle, startAngle, true);

  // Bottom cap
  const bottomX = Math.cos(startAngle) * outerR;
  const bottomY = Math.sin(startAngle) * outerR;
  shape.lineTo(bottomX, bottomY);

  return shape;
}

// 3D Cretify Spark Hero Component
const CretifySparkMesh: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const sparkDotRef = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const morphMeshRef = useRef<THREE.Mesh>(null);

  const {
    sparkColor,
    cycleSparkColor,
    isSpinning,
    squashScale,
    activeSection,
    configuratorType
  } = useScene();
  const { playPop } = useSound();

  const [hovered, setHovered] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  // Extrude settings for high-polish bevelled shape
  const cGeometry = useMemo(() => {
    const shape = createCretifyCShape();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.42,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.12,
      bevelThickness: 0.12
    });
  }, []);

  // Material properties for glossy ceramic / physical iridescent sheen
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(sparkColor),
      metalness: 0.12,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      ior: 1.55,
      reflectivity: 0.9,
      transmission: 0.08
    });
  }, [sparkColor]);

  // Accent glass material for orbiters
  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFF4E6'),
      metalness: 0.05,
      roughness: 0.1,
      transmission: 0.85,
      ior: 1.5,
      thickness: 0.5
    });
  }, []);

  // Mouse move listener for smooth magnetic parallax
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Frame animation loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Determine target transform based on active section
    let targetX = 2.1;
    let targetY = 0.2;
    let targetZ = 0;
    let targetRotY = mousePos.current.x * 0.45;
    let targetRotX = -mousePos.current.y * 0.35;
    let targetScale = 1.05 * squashScale;

    if (activeSection === 'services') {
      targetX = -2.4;
      targetY = 0.3;
      targetZ = -0.5;
      targetRotY += Math.PI * 0.25;
      targetScale = 0.9 * squashScale;
    } else if (activeSection === 'work') {
      targetX = 2.4;
      targetY = -0.4;
      targetZ = -0.8;
      targetScale = 0.75 * squashScale;
    } else if (activeSection === 'configurator') {
      targetX = 1.6;
      targetY = 0.4;
      targetZ = 0.2;
      targetScale = 1.15 * squashScale;
      // live rotation tilt
      targetRotY += Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
    } else if (activeSection === 'process') {
      targetX = 0;
      targetY = 0.8;
      targetZ = -0.2;
      targetScale = 0.85 * squashScale;
      targetRotX += -0.4; // Rocket point upwards
    } else if (activeSection === 'testimonials') {
      targetX = -2.1;
      targetY = -0.2;
      targetScale = 0.8 * squashScale;
    } else if (activeSection === 'cta') {
      targetX = 0;
      targetY = 0.2;
      targetZ = 0.5;
      targetScale = 1.25 * squashScale;
      targetRotY += Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }

    // Konami spin mode
    if (isSpinning) {
      targetRotY += state.clock.elapsedTime * 8;
      targetRotX += Math.sin(state.clock.elapsedTime * 6) * 0.8;
      targetScale = 1.35 * squashScale;
    }

    // Smooth spring interpolation (lerp)
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.06);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.06);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.06);

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.08);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.08);
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.15));

    // Orbiting particles rotation
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += delta * 0.6;
      orbitGroupRef.current.rotation.x += delta * 0.3;
    }

    // Spark dot breathing animation
    if (sparkDotRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 3) * 0.12 + 1;
      sparkDotRef.current.scale.setScalar(breathe);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    playPop();
    cycleSparkColor(e.nativeEvent);
  };

  return (
    <group
      ref={meshRef}
      position={[2.1, 0.2, 0]}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={handleClick}
    >
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.5}>
        {/* Main 3D Extruded C */}
        <mesh geometry={cGeometry} material={material} castShadow receiveShadow />

        {/* The Spark Tittle (the glowing dot) */}
        <mesh ref={sparkDotRef} position={[1.45, 1.2, 0.2]} castShadow>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshPhysicalMaterial
            color={sparkColor}
            emissive={sparkColor}
            emissiveIntensity={0.6}
            roughness={0.1}
            clearcoat={1}
          />
        </mesh>

        {/* Orbiting playful shapes */}
        <group ref={orbitGroupRef}>
          {/* Violet glass orb */}
          <mesh position={[2.2, 0.8, 1.1]} material={glassMaterial}>
            <sphereGeometry args={[0.22, 24, 24]} />
          </mesh>

          {/* Mint rounded cube */}
          <mesh position={[-1.8, 1.4, -0.8]}>
            <boxGeometry args={[0.32, 0.32, 0.32]} />
            <meshStandardMaterial color="#27E3A4" roughness={0.2} metalness={0.1} />
          </mesh>

          {/* Candy pink sphere */}
          <mesh position={[-1.5, -1.6, 0.9]}>
            <sphereGeometry args={[0.26, 24, 24]} />
            <meshStandardMaterial color="#FF5DA2" roughness={0.2} metalness={0.2} />
          </mesh>

          {/* Sky blue disc */}
          <mesh position={[1.9, -1.2, -0.6]} rotation={[0.4, 0.6, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.1, 24]} />
            <meshStandardMaterial color="#38B6FF" roughness={0.2} metalness={0.1} />
          </mesh>

          {/* Sunny yellow mini torus */}
          <mesh position={[0.2, -2.1, 0.4]} rotation={[1.1, 0.2, 0.5]}>
            <torusGeometry args={[0.22, 0.08, 16, 24]} />
            <meshStandardMaterial color="#FFC72C" roughness={0.2} />
          </mesh>
        </group>
      </Float>
    </group>
  );
};

export const SparkCanvas: React.FC = () => {
  const { sparkColor, cycleSparkColor } = useScene();
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    // Check mobile or prefers-reduced-motion
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || prefersReducedMotion) {
      setIsLowPower(true);
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        dpr={[1, 1.75]} // Cap DPR at 1.75 as per performance guidelines
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true
        }}
        className="w-full h-full pointer-events-auto"
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[6, 8, 5]} intensity={1.8} castShadow />
        <directionalLight position={[-6, -4, -4]} intensity={0.6} color="#38B6FF" />
        <pointLight position={[0, 4, 3]} intensity={1.2} color="#FFF4E6" />
        <pointLight position={[2, -3, 2]} intensity={0.8} color={sparkColor} />

        <CretifySparkMesh />

        <ContactShadows
          position={[0, -2.6, 0]}
          opacity={0.35}
          scale={10}
          blur={2.2}
          far={4.5}
        />
      </Canvas>

      {/* Floating subtle interactive hint badge */}
      <button
        onClick={(e) => cycleSparkColor(e.nativeEvent)}
        className="pointer-events-auto absolute bottom-8 left-8 sm:bottom-10 sm:left-10 px-3.5 py-1.5 bg-white/80 backdrop-blur-md border border-[#14110F]/15 rounded-full text-xs font-mono font-medium text-[#14110F] shadow-brutal-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
        aria-label="Click to morph the 3D Cretify Spark color"
      >
        <span
          className="w-2.5 h-2.5 rounded-full inline-block animate-pulse transition-colors"
          style={{ backgroundColor: sparkColor }}
        />
        <span>psst, click 3D spark to morph</span>
        <span className="text-[10px] text-[#14110F]/50 group-hover:text-[#FF5A00] transition-colors">✨</span>
      </button>
    </div>
  );
};
