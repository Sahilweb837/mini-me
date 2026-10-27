import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { BackgroundThemeType } from '../../types/character';

interface CharacterStageProps {
  theme: BackgroundThemeType;
}

export const CharacterStage: React.FC<CharacterStageProps> = ({ theme }) => {
  const cloudsRef = useRef<THREE.Group>(null);
  const starsRef = useRef<THREE.Group>(null);
  const leavesRef = useRef<THREE.Group>(null);

  // Pedestal materials based on theme
  const pedestalMaterial = useMemo(() => {
    switch (theme) {
      case 'sunny_park':
        return new THREE.MeshStandardMaterial({ color: '#86EFAC', roughness: 0.6 });
      case 'candyland':
        return new THREE.MeshStandardMaterial({ color: '#F472B6', roughness: 0.4 });
      case 'cosmic_space':
        return new THREE.MeshStandardMaterial({ color: '#312E81', roughness: 0.5, metalness: 0.2 });
      case 'treehouse':
        return new THREE.MeshStandardMaterial({ color: '#B45309', roughness: 0.7 });
      case 'pastel_cloud':
        return new THREE.MeshStandardMaterial({ color: '#DDD6FE', roughness: 0.5 });
      default:
        return new THREE.MeshStandardMaterial({ color: '#CBD5E1', roughness: 0.6 });
    }
  }, [theme]);

  const pedestalRimMaterial = useMemo(() => {
    switch (theme) {
      case 'sunny_park':
        return new THREE.MeshStandardMaterial({ color: '#FDE047', roughness: 0.4 });
      case 'candyland':
        return new THREE.MeshStandardMaterial({ color: '#FBCFE8', roughness: 0.3 });
      case 'cosmic_space':
        return new THREE.MeshStandardMaterial({ color: '#818CF8', metalness: 0.5, roughness: 0.3 });
      case 'treehouse':
        return new THREE.MeshStandardMaterial({ color: '#F59E0B', roughness: 0.5 });
      case 'pastel_cloud':
        return new THREE.MeshStandardMaterial({ color: '#FDF4FF', roughness: 0.3 });
      default:
        return new THREE.MeshStandardMaterial({ color: '#94A3B8', roughness: 0.4 });
    }
  }, [theme]);

  // Animated elements loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.05;
    }
    if (starsRef.current) {
      starsRef.current.rotation.y = -time * 0.04;
      starsRef.current.rotation.x = Math.sin(time * 0.2) * 0.05;
    }
    if (leavesRef.current) {
      leavesRef.current.children.forEach((leaf, idx) => {
        leaf.position.y -= 0.005;
        leaf.rotation.z += 0.02;
        if (leaf.position.y < -0.6) {
          leaf.position.y = 2.5;
        }
      });
    }
  });

  return (
    <group>
      {/* ================= LIGHTING ================= */}
      {/* Vibrant Ambient Light */}
      <ambientLight intensity={theme === 'cosmic_space' ? 1.0 : 1.3} color={theme === 'candyland' ? '#FFE4E6' : '#FFFFFF'} />

      {/* Main Key Sun Light */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={15}
        shadow-camera-left={-2.5}
        shadow-camera-right={2.5}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-1.5}
      />

      {/* Rim / Backlight for vibrant silhouette pop */}
      <directionalLight
        position={[-3, 3, -3]}
        intensity={theme === 'cosmic_space' ? 2.0 : 1.0}
        color={theme === 'cosmic_space' ? '#C084FC' : '#FEF08A'}
      />

      {/* Soft Ground Fill Light */}
      <pointLight position={[0, -0.2, 1.5]} intensity={0.5} color="#FFFFFF" />

      {/* ================= FLOATING PEDESTAL ISLAND ================= */}
      <group position={[0, -0.6, 0]}>
        {/* Main Cylinder Stage */}
        <mesh receiveShadow position={[0, -0.1, 0]} material={pedestalMaterial}>
          <cylinderGeometry args={[1.5, 1.6, 0.2, 36]} />
        </mesh>

        {/* Decorative Rim Ring */}
        <mesh position={[0, -0.01, 0]} rotation={[Math.PI / 2, 0, 0]} material={pedestalRimMaterial}>
          <torusGeometry args={[1.48, 0.04, 12, 36]} />
        </mesh>

        {/* Soft Contact Shadow beneath Character */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={0.25}
          />
        </mesh>

        {/* Pedestal Under-Island Core */}
        <mesh position={[0, -0.35, 0]} rotation={[Math.PI, 0, 0]} material={pedestalRimMaterial}>
          <coneGeometry args={[1.55, 0.45, 12]} />
        </mesh>

        {/* Floating Mini Gems / Daisies on Stage */}
        {theme === 'sunny_park' && (
          <group>
            {[
              [-0.8, 0.02, 0.6],
              [0.9, 0.02, 0.5],
              [-0.9, 0.02, -0.5],
              [0.85, 0.02, -0.6],
            ].map(([x, y, z], idx) => (
              <group key={idx} position={[x, y, z]}>
                <mesh material={pedestalRimMaterial}>
                  <cylinderGeometry args={[0.08, 0.08, 0.02, 12]} />
                </mesh>
                <mesh position={[0, 0.02, 0]}>
                  <sphereGeometry args={[0.04, 8, 8]} />
                  <meshStandardMaterial color="#FFFFFF" />
                </mesh>
              </group>
            ))}
          </group>
        )}
      </group>

      {/* ================= THEME BACKGROUND ELEMENTS ================= */}
      {theme === 'sunny_park' && (
        <group ref={cloudsRef} position={[0, 1.2, 0]}>
          {/* Drifting Clouds */}
          {[
            [2.8, 1.2, -2.5, 0.6],
            [-3.0, 1.6, -2.0, 0.7],
            [1.5, 2.2, -3.2, 0.5],
            [-2.2, 0.8, -3.0, 0.55],
          ].map(([x, y, z, s], idx) => (
            <group key={idx} position={[x, y, z]} scale={[s, s, s]}>
              <mesh>
                <sphereGeometry args={[0.6, 12, 12]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
              </mesh>
              <mesh position={[0.45, -0.1, 0]}>
                <sphereGeometry args={[0.45, 12, 12]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
              </mesh>
              <mesh position={[-0.45, -0.1, 0]}>
                <sphereGeometry args={[0.45, 12, 12]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {theme === 'candyland' && (
        <group ref={cloudsRef} position={[0, 1.2, 0]}>
          {/* Floating Candy Treats */}
          {[
            [2.5, 0.8, -1.8, '#F43F5E'],
            [-2.4, 1.5, -2.0, '#38BDF8'],
            [1.8, 2.0, -2.5, '#FACC15'],
            [-1.9, 0.6, -2.2, '#A855F7'],
          ].map(([x, y, z, c], idx) => (
            <mesh key={idx} position={[x as number, y as number, z as number]}>
              <octahedronGeometry args={[0.22]} />
              <meshStandardMaterial color={c as string} roughness={0.2} metalness={0.1} />
            </mesh>
          ))}
        </group>
      )}

      {theme === 'cosmic_space' && (
        <group ref={starsRef} position={[0, 1.0, 0]}>
          {/* Distant Planet */}
          <group position={[2.6, 1.8, -3.5]}>
            <mesh>
              <sphereGeometry args={[0.65, 24, 24]} />
              <meshStandardMaterial color="#C084FC" roughness={0.4} />
            </mesh>
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <ringGeometry args={[0.85, 1.2, 32]} />
              <meshBasicMaterial color="#E879F9" side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* Floating Orbiting Stars */}
          {[
            [-2.2, 1.8, -1.5, 0.12],
            [1.8, 0.5, -2.2, 0.16],
            [-1.5, 2.4, -2.0, 0.1],
            [2.4, 2.2, -1.8, 0.14],
            [-2.8, 0.6, -2.6, 0.15],
            [0.5, 2.6, -2.8, 0.11],
          ].map(([x, y, z, s], idx) => (
            <mesh key={idx} position={[x, y, z]}>
              <octahedronGeometry args={[s]} />
              <meshStandardMaterial color="#FDE047" emissive="#FDE047" emissiveIntensity={0.6} />
            </mesh>
          ))}
        </group>
      )}

      {theme === 'treehouse' && (
        <group ref={leavesRef} position={[0, 1.0, 0]}>
          {[
            [-1.5, 2.0, -1.2, '#22C55E'],
            [1.6, 2.4, -1.5, '#F59E0B'],
            [-0.8, 2.2, -2.0, '#EAB308'],
            [1.2, 1.8, -1.8, '#16A34A'],
          ].map(([x, y, z, c], idx) => (
            <mesh key={idx} position={[x as number, y as number, z as number]} rotation={[0.4, 0.2, 0.5]}>
              <boxGeometry args={[0.15, 0.22, 0.02]} />
              <meshStandardMaterial color={c as string} roughness={0.5} />
            </mesh>
          ))}
        </group>
      )}

      {theme === 'pastel_cloud' && (
        <group position={[0, 1.8, -3.5]}>
          {/* Dreamy Pastel Rainbow Arch */}
          {['#FDA4AF', '#FDE047', '#86EFAC', '#93C5FD', '#C4B5FD'].map((color, idx) => (
            <mesh key={idx} rotation={[0, 0, 0]}>
              <torusGeometry args={[2.5 - idx * 0.12, 0.05, 12, 48, Math.PI]} />
              <meshBasicMaterial color={color} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
