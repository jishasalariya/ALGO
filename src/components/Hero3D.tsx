"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Center, Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function RotatingText() {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      // Slowly rotate the text around the Y axis
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
      textRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <Center>
        <Text3D
          ref={textRef}
          font="/fonts/helvetiker_bold.typeface.json"
          size={2.5}
          height={0.5}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          letterSpacing={0.1}
        >
          KYU?
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.8} />
        </Text3D>
      </Center>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
      
      {/* Black and White Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center grayscale mix-blend-luminosity opacity-40"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618354691229-88d47f2a9937?q=80&w=2000&auto=format&fit=crop')" }}
      />
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} />
          <pointLight position={[-10, -10, -5]} intensity={1} color="#555555" />
          
          <Suspense fallback={null}>
            <RotatingText />
            <Environment preset="city" />
            <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={15} blur={2} far={4} />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating Tagline */}
      <div className="absolute bottom-12 z-20 w-full text-center px-4">
        <p className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-white/80">
          Life runs on bad decisions & broken algorithms
        </p>
      </div>
    </div>
  );
}
