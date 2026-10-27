import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface GamePetsProps {
  playerRef: React.RefObject<THREE.Group | null>;
  isPuppyExcited: boolean;
  onPuppyNear: (isNear: boolean) => void;
  onCatNear: (isNear: boolean) => void;
}

export const GamePets: React.FC<GamePetsProps> = ({
  playerRef,
  isPuppyExcited,
  onPuppyNear,
  onCatNear,
}) => {
  const puppyRef = useRef<THREE.Group>(null);
  const puppyTailRef = useRef<THREE.Mesh>(null);
  const puppyEarsRef = useRef<THREE.Group>(null);
  const puppyHeartRef = useRef<THREE.Group>(null);

  const catRef = useRef<THREE.Group>(null);
  const catTailRef = useRef<THREE.Mesh>(null);

  // AI loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const px = playerRef.current ? playerRef.current.position.x : 0;
    const pz = playerRef.current ? playerRef.current.position.z : 0;

    // 1. Puppy behavior
    if (puppyRef.current) {
      const pupPos = puppyRef.current.position;
      const dx = px - pupPos.x;
      const dz = pz - pupPos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      // Report proximity to HUD
      onPuppyNear(dist < 3.2);

      // Wag tail constantly, faster when player is near
      if (puppyTailRef.current) {
        const wagSpeed = dist < 5.0 ? 18 : 8;
        puppyTailRef.current.rotation.y = Math.sin(time * wagSpeed) * 0.45;
      }

      // Ears flop
      if (puppyEarsRef.current) {
        puppyEarsRef.current.rotation.z = Math.sin(time * 6) * 0.08;
      }

      // If player is close, face player and follow gently
      if (dist < 7.0 && dist > 1.8) {
        const targetAngle = Math.atan2(dx, dz);
        puppyRef.current.rotation.y = THREE.MathUtils.lerp(
          puppyRef.current.rotation.y,
          targetAngle,
          0.08
        );

        // Trot toward player
        const speed = 0.035;
        puppyRef.current.position.x += Math.sin(targetAngle) * speed;
        puppyRef.current.position.z += Math.cos(targetAngle) * speed;

        // Bob up and down while trotting
        puppyRef.current.position.y = Math.abs(Math.sin(time * 10)) * 0.06;
      } else {
        // Idle breathing bob
        puppyRef.current.position.y = Math.sin(time * 2.5) * 0.02;
      }

      // Excited spin/jump animation when player pets him!
      if (isPuppyExcited) {
        puppyRef.current.rotation.y += 0.25;
        puppyRef.current.position.y = 0.35 + Math.abs(Math.sin(time * 12)) * 0.25;
        if (puppyHeartRef.current) {
          puppyHeartRef.current.scale.set(1.4, 1.4, 1.4);
          puppyHeartRef.current.position.y = 1.2 + Math.sin(time * 4) * 0.1;
        }
      } else if (puppyHeartRef.current) {
        puppyHeartRef.current.scale.set(0.001, 0.001, 0.001);
      }
    }

    // 2. Cat behavior (sitting on park bench)
    if (catRef.current) {
      const catPos = catRef.current.position;
      const dx = px - catPos.x;
      const dz = pz - catPos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      onCatNear(dist < 2.5);

      if (catTailRef.current) {
        catTailRef.current.rotation.z = Math.sin(time * 2.5) * 0.25;
      }
    }
  });

  return (
    <group>
      {/* ================= 1. BARNABY THE PUPPY ================= */}
      <group ref={puppyRef} position={[-4.5, 0, 3]}>
        {/* Puppy Body */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <capsuleGeometry args={[0.22, 0.35, 8, 16]} />
          <meshStandardMaterial color="#EAB308" roughness={0.7} />
        </mesh>

        {/* Puppy Head */}
        <group position={[0, 0.62, 0.22]}>
          <mesh castShadow>
            <sphereGeometry args={[0.25, 14, 14]} />
            <meshStandardMaterial color="#EAB308" roughness={0.7} />
          </mesh>
          {/* Brown Snout */}
          <mesh position={[0, -0.06, 0.2]} castShadow>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshStandardMaterial color="#CA8A04" roughness={0.6} />
          </mesh>
          {/* Black Nose */}
          <mesh position={[0, -0.02, 0.31]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#0F172A" roughness={0.2} />
          </mesh>
          {/* Shiny Puppy Eyes */}
          {[-0.1, 0.1].map((x, idx) => (
            <mesh key={idx} position={[x, 0.06, 0.21]}>
              <sphereGeometry args={[0.042, 8, 8]} />
              <meshStandardMaterial color="#1E293B" roughness={0.1} />
            </mesh>
          ))}
          {/* Floppy Ears */}
          <group ref={puppyEarsRef}>
            {[-0.22, 0.22].map((x, idx) => (
              <mesh key={idx} position={[x, 0.05, -0.02]} rotation={[0.4, 0, x > 0 ? -0.4 : 0.4]}>
                <capsuleGeometry args={[0.065, 0.22, 6, 8]} />
                <meshStandardMaterial color="#A16207" roughness={0.7} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Red Collar with Golden Tag */}
        <mesh position={[0, 0.5, 0.14]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[0.18, 0.035, 8, 16]} />
          <meshStandardMaterial color="#DC2626" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.38, 0.24]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* 4 Little Paws */}
        {[
          { x: -0.15, z: 0.18 },
          { x: 0.15, z: 0.18 },
          { x: -0.15, z: -0.18 },
          { x: 0.15, z: -0.18 },
        ].map((paw, idx) => (
          <mesh key={idx} position={[paw.x, 0.1, paw.z]} castShadow>
            <cylinderGeometry args={[0.06, 0.07, 0.2, 8]} />
            <meshStandardMaterial color="#FEF08A" roughness={0.8} />
          </mesh>
        ))}

        {/* Wagging Puppy Tail */}
        <mesh ref={puppyTailRef} position={[0, 0.45, -0.26]} rotation={[0.6, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.05, 0.28, 8]} />
          <meshStandardMaterial color="#EAB308" />
        </mesh>

        {/* Floating Heart Effect */}
        <group ref={puppyHeartRef} position={[0, 1.1, 0]} scale={[0.001, 0.001, 0.001]}>
          <mesh>
            <sphereGeometry args={[0.18, 10, 10]} />
            <meshStandardMaterial color="#EC4899" emissive="#DB2777" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>

      {/* ================= 2. MOCHI THE CALICO CAT ================= */}
      <group ref={catRef} position={[-5, 0.52, 2]} rotation={[0, Math.PI / 3, 0]}>
        {/* Cat Body (curled lounging) */}
        <mesh position={[0, 0.14, 0]} castShadow>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.6} />
        </mesh>
        {/* Ginger Patches on Back */}
        <mesh position={[0.08, 0.22, -0.05]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#EA580C" />
        </mesh>
        {/* Cat Head */}
        <mesh position={[0.18, 0.22, 0.08]} castShadow>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.6} />
        </mesh>
        {/* Cat Ears */}
        {[-0.06, 0.06].map((offset, idx) => (
          <mesh key={idx} position={[0.18 + offset, 0.34, 0.06]} rotation={[0, 0, offset > 0 ? -0.2 : 0.2]}>
            <coneGeometry args={[0.045, 0.1, 4]} />
            <meshStandardMaterial color="#EA580C" />
          </mesh>
        ))}
        {/* Cat Tail */}
        <mesh ref={catTailRef} position={[-0.18, 0.14, -0.08]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.025, 0.035, 0.3, 8]} />
          <meshStandardMaterial color="#EA580C" />
        </mesh>
      </group>
    </group>
  );
};
