import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export interface StarItem {
  id: number;
  position: [number, number, number];
  name: string;
}

export const GAME_STARS: StarItem[] = [
  { id: 1, position: [0, 1.0, 0], name: 'Plaza Star' },
  { id: 2, position: [-10, 1.3, -8], name: 'Bridge Star' },
  { id: 3, position: [0, 1.2, -10.5], name: 'Porch Star' },
  { id: 4, position: [8, 4.2, -4], name: 'High Trampoline Star' },
  { id: 5, position: [12, 1.2, 6], name: 'Carousel Star' },
  { id: 6, position: [-12, 1.2, 8], name: 'Treehouse Star' },
  { id: 7, position: [-3.5, 0.9, 2.5], name: 'Garden Blossom Star' },
  { id: 8, position: [3.2, 1.0, -16.5], name: 'Backyard Secret Star' },
  { id: 9, position: [-7.0, 0.8, -11.0], name: 'Duck Pond Star' },
  { id: 10, position: [-6.0, 0.9, 1.5], name: 'Park Bench Star' },
  { id: 11, position: [-11.2, 3.8, 8.8], name: 'High Treehouse Star' },
  { id: 12, position: [14.0, 0.9, -1.0], name: 'Sunny Meadow Star' },
];

interface CollectiblesProps {
  collectedIds: number[];
  playerRef: React.RefObject<THREE.Group | null>;
  onCollect: (id: number) => void;
}

export const Collectibles: React.FC<CollectiblesProps> = ({
  collectedIds,
  playerRef,
  onCollect,
}) => {
  const starsGroupRef = useRef<THREE.Group>(null);

  // Animate and check distance
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const px = playerRef.current ? playerRef.current.position.x : 0;
    const py = playerRef.current ? playerRef.current.position.y : 0;
    const pz = playerRef.current ? playerRef.current.position.z : 0;

    GAME_STARS.forEach((star) => {
      if (collectedIds.includes(star.id)) return;

      const [sx, sy, sz] = star.position;
      const dx = px - sx;
      const dy = py - sy;
      const dz = pz - sz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Collect if close enough (radius 1.35)
      if (dist < 1.35) {
        onCollect(star.id);
      }
    });

    if (starsGroupRef.current) {
      starsGroupRef.current.children.forEach((child, idx) => {
        child.rotation.y = time * 2.2 + idx;
        child.rotation.x = Math.sin(time * 1.5 + idx) * 0.15;
      });
    }
  });

  return (
    <group ref={starsGroupRef}>
      {GAME_STARS.map((star, idx) => {
        if (collectedIds.includes(star.id)) return null;

        return (
          <group key={star.id} position={star.position}>
            {/* Center Star Core (Octahedron / Diamond facet) */}
            <mesh castShadow>
              <octahedronGeometry args={[0.32, 0]} />
              <meshStandardMaterial
                color="#FDE047"
                emissive="#F59E0B"
                emissiveIntensity={0.65}
                metalness={0.8}
                roughness={0.15}
              />
            </mesh>

            {/* Glowing Golden Ring halo */}
            <mesh rotation={[Math.PI / 4, 0, 0]}>
              <torusGeometry args={[0.42, 0.04, 8, 24]} />
              <meshStandardMaterial
                color="#FBBF24"
                emissive="#FBBF24"
                emissiveIntensity={0.5}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>

            {/* Sparkle Diamond Tips */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
              <mesh key={i} position={[Math.cos(ang) * 0.44, Math.sin(ang) * 0.44, 0]}>
                <sphereGeometry args={[0.065, 8, 8]} />
                <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.8} />
              </mesh>
            ))}

            {/* Point Light Glow */}
            <pointLight color="#FDE047" intensity={0.8} distance={3.5} decay={2} />
          </group>
        );
      })}
    </group>
  );
};
