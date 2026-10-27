"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import type { Group, Mesh } from "three";

/** Hero 3D: a living orb with orbiting wire-shapes that reacts to the pointer and to scroll. Paused offscreen. */
function Orb({ small }: { small: boolean }) {
  const group = useRef<Group>(null);
  const ring = useRef<Mesh>(null);
  const knot = useRef<Mesh>(null);

  useFrame((state, dt) => {
    const s = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    const g = group.current;
    if (g) {
      const k = Math.min(1, dt * 2.2);
      g.rotation.y += (state.pointer.x * 0.6 + s * Math.PI * 1.2 - g.rotation.y) * k;
      g.rotation.x += (-state.pointer.y * 0.4 + s * 0.6 - g.rotation.x) * k;
      g.position.y += (s * 1.4 - g.position.y) * k;
      const sc = 1 - s * 0.3;
      g.scale.setScalar(sc * (small ? 0.82 : 1));
    }
    if (ring.current) ring.current.rotation.z += dt * (0.25 + s * 2);
    if (knot.current) {
      knot.current.rotation.x += dt * 0.4;
      knot.current.rotation.y += dt * 0.3;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.1}>
        <mesh>
          <icosahedronGeometry args={[1.45, small ? 14 : 24]} />
          <MeshDistortMaterial color="#c3622a" distort={0.42} speed={1.8} roughness={0.2} metalness={0.3} />
        </mesh>
      </Float>
      <mesh ref={ring} rotation={[1.2, 0.2, 0]}>
        <torusGeometry args={[2.25, 0.02, 16, 160]} />
        <meshBasicMaterial color="#eba070" />
      </mesh>
      <Float speed={2.4} floatIntensity={1.6}>
        <mesh ref={knot} position={[2.1, 1.1, -0.4]} scale={0.38}>
          <torusKnotGeometry args={[1, 0.28, 120, 16]} />
          <meshStandardMaterial color="#173851" roughness={0.3} metalness={0.6} />
        </mesh>
      </Float>
      <Float speed={2} floatIntensity={1.2}>
        <mesh position={[-2.2, -1.1, 0.3]} scale={0.5}>
          <octahedronGeometry args={[1]} />
          <meshStandardMaterial color="#4f86ad" wireframe />
        </mesh>
      </Float>
      <Sparkles count={small ? 24 : 50} scale={6} size={3} speed={0.5} color="#eba070" />
    </group>
  );
}

export default function HeroScene({ active, small = false }: { active: boolean; small?: boolean }) {
  return (
    <Canvas
      dpr={[1, small ? 1.2 : 1.6]}
      camera={{ position: [0, 0, 7.6], fov: 42 }}
      gl={{ antialias: !small, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      aria-hidden
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-5, -3, 2]} intensity={30} color="#eba070" />
      <pointLight position={[4, -2, -3]} intensity={26} color="#4f86ad" />
      <Orb small={small} />
    </Canvas>
  );
}
