"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Mesh, PerspectiveCamera } from "three";

const ORANGE = "#c3622a";
const LIGHT = "#eba070";
const BLUE = "#4f86ad";
const DEPTH = 58;

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Dust({ count }: { count: number }) {
  const positions = useMemo(() => {
    const r = rng(7);
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (r() - 0.5) * 30;
      a[i * 3 + 1] = 6 - r() * (DEPTH + 12);
      a[i * 3 + 2] = (r() - 0.5) * 18 - 3;
    }
    return a;
  }, [count]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color={ORANGE} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

type Kind = "ico" | "torus" | "octa" | "knot" | "box";
const SHAPES: { kind: Kind; x: number; y: number; z: number; s: number; c: string }[] = [
  { kind: "ico", x: 7.4, y: -4, z: -1, s: 1.5, c: ORANGE },
  { kind: "torus", x: -7.8, y: -12, z: 0, s: 1.6, c: BLUE },
  { kind: "octa", x: 7, y: -20, z: -2, s: 1.3, c: LIGHT },
  { kind: "knot", x: -7.4, y: -28, z: 0, s: 0.9, c: ORANGE },
  { kind: "box", x: 7.6, y: -36, z: -1, s: 1.4, c: BLUE },
  { kind: "ico", x: -7.8, y: -44, z: -2, s: 1.7, c: LIGHT },
  { kind: "torus", x: 7.2, y: -52, z: 0, s: 1.4, c: ORANGE },
];

function Shape({ item, narrow, scrollV }: { item: (typeof SHAPES)[number]; narrow: boolean; scrollV: React.RefObject<number> }) {
  const mesh = useRef<Mesh>(null);
  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    const boost = scrollV.current * 0.35;
    m.rotation.x += dt * 0.25 + boost;
    m.rotation.y += dt * 0.35 + boost * 0.6;
  });
  const k = item.kind;
  return (
    <mesh ref={mesh} position={[narrow ? item.x * 0.4 : item.x, item.y, item.z]} scale={narrow ? item.s * 0.7 : item.s}>
      {k === "ico" && <icosahedronGeometry args={[1, 1]} />}
      {k === "torus" && <torusGeometry args={[1, 0.28, 12, 40]} />}
      {k === "octa" && <octahedronGeometry args={[1, 0]} />}
      {k === "knot" && <torusKnotGeometry args={[0.8, 0.22, 90, 10]} />}
      {k === "box" && <boxGeometry args={[1.4, 1.4, 1.4]} />}
      <meshBasicMaterial color={item.c} wireframe transparent opacity={0.34} />
    </mesh>
  );
}

function Rig({ narrow }: { narrow: boolean }) {
  const group = useRef<Group>(null);
  const scrollV = useRef(0);
  const smooth = useRef(0);
  const last = useRef(0);

  useFrame((state, dt) => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / max));
    smooth.current += (p - smooth.current) * Math.min(1, dt * 4);
    scrollV.current += ((smooth.current - last.current) * 40 - scrollV.current) * Math.min(1, dt * 6);
    last.current = smooth.current;

    const cam = state.camera as PerspectiveCamera;
    cam.position.y = -smooth.current * DEPTH;
    cam.position.x += (Math.sin(smooth.current * 9) * 1.1 + state.pointer.x * 0.6 - cam.position.x) * Math.min(1, dt * 2);
    cam.rotation.z = Math.sin(smooth.current * 5) * 0.05;
    if (group.current) group.current.rotation.y = smooth.current * 1.4;
  });

  return (
    <group ref={group}>
      <Dust count={narrow ? 260 : 620} />
      {SHAPES.map((s, i) => (
        <Shape key={i} item={s} narrow={narrow} scrollV={scrollV} />
      ))}
    </group>
  );
}

/** Fixed, page-long WebGL backdrop: the camera descends through floating wire shapes as you scroll. */
export default function ScrollScene({ narrow }: { narrow: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas dpr={[1, narrow ? 1 : 1.5]} camera={{ position: [0, 0, 10], fov: 50 }} gl={{ antialias: !narrow, alpha: true, powerPreference: "low-power" }}>
        <Rig narrow={narrow} />
      </Canvas>
    </div>
  );
}
