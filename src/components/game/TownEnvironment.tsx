import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface TownEnvironmentProps {
  timeOfDay: 'day' | 'sunset' | 'night';
}

export const TownEnvironment: React.FC<TownEnvironmentProps> = ({ timeOfDay }) => {
  const carouselRef = useRef<THREE.Group>(null);
  const ducksRef = useRef<THREE.Group>(null);
  const chimneySmokeRef = useRef<THREE.Group>(null);

  // Materials based on time of day
  const grassColor = timeOfDay === 'night' ? '#1E3A2F' : (timeOfDay === 'sunset' ? '#5A7836' : '#68D391');
  const pathColor = timeOfDay === 'night' ? '#475569' : '#E2E8F0';
  const lanternGlowColor = timeOfDay === 'night' ? '#FCD34D' : '#FDE68A';

  // Animation frame for moving world elements
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate playground carousel
    if (carouselRef.current) {
      carouselRef.current.rotation.y = time * 0.45;
    }

    // Bob duckies in the pond
    if (ducksRef.current) {
      ducksRef.current.children.forEach((duck, idx) => {
        duck.position.y = 0.05 + Math.sin(time * 2.2 + idx * 1.5) * 0.04;
        duck.rotation.y = Math.sin(time * 0.8 + idx) * 0.2;
      });
    }

    // Chimney smoke puffs rising
    if (chimneySmokeRef.current) {
      chimneySmokeRef.current.children.forEach((puff, idx) => {
        const offsetTime = (time * 0.8 + idx * 0.7) % 2.5;
        puff.position.y = 3.6 + offsetTime * 0.8;
        puff.position.x = Math.sin(offsetTime * 2 + idx) * 0.15;
        const scale = 0.15 + (offsetTime / 2.5) * 0.25;
        puff.scale.set(scale, scale, scale);
      });
    }
  });

  return (
    <group>
      {/* ================= 1. GROUND & ROLLING TERRAIN ================= */}
      {/* Main Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color={grassColor} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Raised soft hillocks / mounds around borders */}
      <mesh position={[-20, -0.2, -20]} receiveShadow>
        <sphereGeometry args={[12, 16, 16]} />
        <meshStandardMaterial color={grassColor} roughness={0.85} />
      </mesh>
      <mesh position={[22, -0.3, -18]} receiveShadow>
        <sphereGeometry args={[14, 16, 16]} />
        <meshStandardMaterial color={grassColor} roughness={0.85} />
      </mesh>
      <mesh position={[24, -0.3, 18]} receiveShadow>
        <sphereGeometry args={[11, 16, 16]} />
        <meshStandardMaterial color={grassColor} roughness={0.85} />
      </mesh>
      <mesh position={[-22, -0.3, 20]} receiveShadow>
        <sphereGeometry args={[13, 16, 16]} />
        <meshStandardMaterial color={grassColor} roughness={0.85} />
      </mesh>

      {/* ================= 2. COBBLESTONE PATHWAYS ================= */}
      {/* Central Plaza / Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <ringGeometry args={[0, 4.5, 32]} />
        <meshStandardMaterial color={pathColor} roughness={0.7} />
      </mesh>
      {/* Path to House */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -7]} receiveShadow>
        <planeGeometry args={[3.2, 10]} />
        <meshStandardMaterial color={pathColor} roughness={0.7} />
      </mesh>
      {/* Path to Pond & Bridge */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[-6.5, 0.01, -4.5]} receiveShadow>
        <planeGeometry args={[2.5, 9]} />
        <meshStandardMaterial color={pathColor} roughness={0.7} />
      </mesh>
      {/* Path to Trampoline */}
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 5]} position={[5.5, 0.01, -3]} receiveShadow>
        <planeGeometry args={[2.4, 8]} />
        <meshStandardMaterial color={pathColor} roughness={0.7} />
      </mesh>
      {/* Path to Carousel & Park */}
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 3]} position={[7.5, 0.01, 4.5]} receiveShadow>
        <planeGeometry args={[2.5, 9]} />
        <meshStandardMaterial color={pathColor} roughness={0.7} />
      </mesh>
      {/* Path to Treehouse */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 3]} position={[-7.5, 0.01, 5.5]} receiveShadow>
        <planeGeometry args={[2.5, 9]} />
        <meshStandardMaterial color={pathColor} roughness={0.7} />
      </mesh>

      {/* ================= 3. COZY PLAYER HOUSE ================= */}
      <group position={[0, 0, -14]}>
        {/* House Foundation / Porch */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.5, 0.5, 6]} />
          <meshStandardMaterial color="#B45309" roughness={0.7} />
        </mesh>
        {/* Main Walls (warm yellow/cream) */}
        <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.8, 3.2, 5.2]} />
          <meshStandardMaterial color="#FEF3C7" roughness={0.6} />
        </mesh>
        {/* Terracotta / Coral Roof */}
        <mesh position={[0, 4.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[5.4, 2.2, 4]} />
          <meshStandardMaterial color="#EA580C" roughness={0.5} />
        </mesh>
        {/* Chimney */}
        <mesh position={[2.0, 4.2, -1.0]} castShadow>
          <boxGeometry args={[0.7, 2.0, 0.7]} />
          <meshStandardMaterial color="#9A3412" roughness={0.8} />
        </mesh>
        {/* Chimney Smoke Group */}
        <group ref={chimneySmokeRef} position={[2.0, 1.2, -1.0]}>
          {[0, 1, 2, 3].map(i => (
            <mesh key={i}>
              <sphereGeometry args={[0.3, 10, 10]} />
              <meshStandardMaterial color="#E2E8F0" transparent opacity={0.65} />
            </mesh>
          ))}
        </group>

        {/* Front Door */}
        <mesh position={[0, 1.3, 2.65]} castShadow>
          <boxGeometry args={[1.3, 2.1, 0.1]} />
          <meshStandardMaterial color="#0284C7" roughness={0.5} />
        </mesh>
        {/* Door Knob */}
        <mesh position={[0.45, 1.3, 2.73]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Welcome Mat */}
        <mesh position={[0, 0.52, 3.2]}>
          <boxGeometry args={[1.8, 0.04, 0.9]} />
          <meshStandardMaterial color="#D97706" />
        </mesh>

        {/* Cozy Glowing Windows */}
        {[-2.0, 2.0].map((x, idx) => (
          <group key={idx} position={[x, 2.1, 2.64]}>
            <mesh>
              <boxGeometry args={[1.1, 1.1, 0.08]} />
              <meshStandardMaterial
                color={timeOfDay === 'night' ? '#FCD34D' : '#BAE6FD'}
                emissive={timeOfDay === 'night' ? '#F59E0B' : '#000000'}
                emissiveIntensity={timeOfDay === 'night' ? 0.6 : 0}
                roughness={0.2}
              />
            </mesh>
            {/* Window Frame Cross */}
            <mesh position={[0, 0, 0.05]}>
              <boxGeometry args={[1.15, 0.08, 0.04]} />
              <meshStandardMaterial color="#92400E" />
            </mesh>
            <mesh position={[0, 0, 0.05]}>
              <boxGeometry args={[0.08, 1.15, 0.04]} />
              <meshStandardMaterial color="#92400E" />
            </mesh>
            {/* Window Flower Box */}
            <mesh position={[0, -0.65, 0.12]} castShadow>
              <boxGeometry args={[1.3, 0.25, 0.3]} />
              <meshStandardMaterial color="#78350F" />
            </mesh>
            {/* Window Flowers */}
            <mesh position={[-0.35, -0.45, 0.15]}>
              <sphereGeometry args={[0.14, 8, 8]} />
              <meshStandardMaterial color="#EC4899" />
            </mesh>
            <mesh position={[0, -0.42, 0.15]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color="#FBBF24" />
            </mesh>
            <mesh position={[0.35, -0.45, 0.15]}>
              <sphereGeometry args={[0.14, 8, 8]} />
              <meshStandardMaterial color="#8B5CF6" />
            </mesh>
          </group>
        ))}

        {/* Mailbox */}
        <group position={[3.2, 0, 3.5]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1.2, 10]} />
            <meshStandardMaterial color="#78350F" />
          </mesh>
          <mesh position={[0, 1.25, 0]} castShadow>
            <boxGeometry args={[0.4, 0.3, 0.6]} />
            <meshStandardMaterial color="#DC2626" />
          </mesh>
          <mesh position={[0.22, 1.35, 0.1]}>
            <boxGeometry args={[0.04, 0.2, 0.05]} />
            <meshStandardMaterial color="#FBBF24" />
          </mesh>
        </group>
      </group>

      {/* ================= 4. SUPER BOUNCY TRAMPOLINE ================= */}
      <group position={[8, 0, -4]}>
        {/* Trampoline Frame Ring */}
        <mesh position={[0, 0.65, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[2.0, 0.12, 16, 32]} />
          <meshStandardMaterial color="#2563EB" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Blue Soft Safety Padding */}
        <mesh position={[0, 0.67, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.65, 2.05, 32]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.4} />
        </mesh>
        {/* Yellow Bouncy Mat */}
        <mesh position={[0, 0.65, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.65, 32]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.6} />
        </mesh>
        {/* Trampoline Target Star in Center */}
        <mesh position={[0, 0.66, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.5, 5]} />
          <meshStandardMaterial color="#FBBF24" />
        </mesh>
        {/* Trampoline Legs (6 curved legs) */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * 1.95;
          const z = Math.sin(angle) * 1.95;
          return (
            <mesh key={i} position={[x, 0.33, z]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.66, 10]} />
              <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
            </mesh>
          );
        })}
        {/* Floating Indicator Banner */}
        <group position={[0, 1.8, 0]}>
          <mesh>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={0.5} />
          </mesh>
        </group>
      </group>

      {/* ================= 5. DUCK POND & ARMORED BRIDGE ================= */}
      <group position={[-10, 0, -8]}>
        {/* Water Surface */}
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[4.2, 36]} />
          <meshStandardMaterial
            color="#38BDF8"
            roughness={0.1}
            metalness={0.15}
            transparent
            opacity={0.82}
          />
        </mesh>
        {/* Pond Bed / Stone Border */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.1, 4.6, 36]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.9} />
        </mesh>

        {/* Water Lily Pads */}
        {[
          { x: 1.5, z: 1.2, r: 0.4 },
          { x: -2.1, z: 0.8, r: 0.35 },
          { x: -1.2, z: -2.2, r: 0.42 },
          { x: 2.2, z: -1.5, r: 0.38 },
        ].map((pad, idx) => (
          <group key={idx} position={[pad.x, 0.05, pad.z]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[pad.r, 16]} />
              <meshStandardMaterial color="#15803D" roughness={0.6} />
            </mesh>
            {/* Lotus Blossom */}
            <mesh position={[0, 0.06, 0]}>
              <sphereGeometry args={[pad.r * 0.35, 8, 8]} />
              <meshStandardMaterial color="#F472B6" />
            </mesh>
          </group>
        ))}

        {/* Swimming Yellow Rubber Ducks */}
        <group ref={ducksRef}>
          {/* Duck 1 */}
          <group position={[1.2, 0.05, -0.6]}>
            <mesh position={[0, 0.12, 0]}>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshStandardMaterial color="#FACC15" roughness={0.3} />
            </mesh>
            <mesh position={[0.15, 0.24, 0]}>
              <sphereGeometry args={[0.14, 12, 12]} />
              <meshStandardMaterial color="#FACC15" roughness={0.3} />
            </mesh>
            {/* Orange Bill */}
            <mesh position={[0.28, 0.22, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.06, 0.14, 10]} />
              <meshStandardMaterial color="#EA580C" />
            </mesh>
          </group>
          {/* Duck 2 (baby duck) */}
          <group position={[1.6, 0.05, -0.3]}>
            <mesh position={[0, 0.08, 0]}>
              <sphereGeometry args={[0.14, 10, 10]} />
              <meshStandardMaterial color="#FDE047" roughness={0.3} />
            </mesh>
            <mesh position={[0.1, 0.16, 0]}>
              <sphereGeometry args={[0.09, 10, 10]} />
              <meshStandardMaterial color="#FDE047" roughness={0.3} />
            </mesh>
            <mesh position={[0.18, 0.14, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.04, 0.08, 8]} />
              <meshStandardMaterial color="#EA580C" />
            </mesh>
          </group>
        </group>

        {/* Wooden Arched Footbridge over Pond */}
        <group position={[0, 0, 0]} rotation={[0, -Math.PI / 6, 0]}>
          {/* Bridge Deck Planks */}
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.15, 5.2]} />
            <meshStandardMaterial color="#B45309" roughness={0.7} />
          </mesh>
          {/* Railing Left */}
          <mesh position={[-0.85, 0.75, 0]} castShadow>
            <boxGeometry args={[0.08, 0.65, 5.2]} />
            <meshStandardMaterial color="#78350F" />
          </mesh>
          {/* Railing Right */}
          <mesh position={[0.85, 0.75, 0]} castShadow>
            <boxGeometry args={[0.08, 0.65, 5.2]} />
            <meshStandardMaterial color="#78350F" />
          </mesh>
        </group>
      </group>

      {/* ================= 6. PLAYGROUND CAROUSEL ================= */}
      <group position={[12, 0, 6]}>
        {/* Base Platform Ring */}
        <mesh position={[0, 0.15, 0]} receiveShadow>
          <cylinderGeometry args={[3.2, 3.4, 0.3, 24]} />
          <meshStandardMaterial color="#EC4899" roughness={0.4} />
        </mesh>
        {/* Rotating Carousel Carousel Top & Poles */}
        <group ref={carouselRef}>
          {/* Center Pole */}
          <mesh position={[0, 1.6, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 2.8, 16]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Canopy Roof */}
          <mesh position={[0, 3.0, 0]} castShadow>
            <coneGeometry args={[3.4, 1.2, 16]} />
            <meshStandardMaterial color="#38BDF8" roughness={0.3} />
          </mesh>
          <mesh position={[0, 3.65, 0]}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.9} />
          </mesh>

          {/* 4 Outer Ride Seats / Poles */}
          {[0, 1, 2, 3].map((i) => {
            const angle = (i * Math.PI) / 2;
            const x = Math.cos(angle) * 2.2;
            const z = Math.sin(angle) * 2.2;
            const colors = ['#F59E0B', '#10B981', '#8B5CF6', '#EF4444'];
            return (
              <group key={i} position={[x, 0, z]}>
                {/* Brass Pole */}
                <mesh position={[0, 1.5, 0]} castShadow>
                  <cylinderGeometry args={[0.05, 0.05, 2.6, 10]} />
                  <meshStandardMaterial color="#FBBF24" metalness={0.85} roughness={0.2} />
                </mesh>
                {/* Cute Rocking Seat/Rocket */}
                <mesh position={[0, 0.85, 0]} castShadow>
                  <boxGeometry args={[0.5, 0.35, 0.8]} />
                  <meshStandardMaterial color={colors[i]} roughness={0.4} />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>

      {/* ================= 7. TREEHOUSE & BIG OAK TREE ================= */}
      <group position={[-12, 0, 8]}>
        {/* Tree Trunk */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.8, 1.2, 5.0, 12]} />
          <meshStandardMaterial color="#78350F" roughness={0.9} />
        </mesh>
        {/* Tree Foliage / Canopy Clouds */}
        <mesh position={[0, 5.4, 0]} castShadow>
          <sphereGeometry args={[2.8, 14, 14]} />
          <meshStandardMaterial color="#22C55E" roughness={0.7} />
        </mesh>
        <mesh position={[-1.4, 4.8, 0.8]} castShadow>
          <sphereGeometry args={[1.9, 12, 12]} />
          <meshStandardMaterial color="#16A34A" roughness={0.7} />
        </mesh>
        <mesh position={[1.4, 5.0, -0.6]} castShadow>
          <sphereGeometry args={[2.0, 12, 12]} />
          <meshStandardMaterial color="#4ADE80" roughness={0.7} />
        </mesh>

        {/* Elevated Treehouse Cabin */}
        <group position={[0.8, 2.8, 0.8]}>
          {/* Wooden Platform */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.8, 0.2, 2.8]} />
            <meshStandardMaterial color="#B45309" roughness={0.8} />
          </mesh>
          {/* Cabin Walls */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[2.0, 1.6, 2.0]} />
            <meshStandardMaterial color="#D97706" roughness={0.7} />
          </mesh>
          {/* Cabin Roof */}
          <mesh position={[0, 2.0, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[1.8, 0.9, 4]} />
            <meshStandardMaterial color="#DC2626" />
          </mesh>
          {/* Rope Ladder */}
          <mesh position={[-1.2, -1.3, 0]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.1, 2.6, 0.6]} />
            <meshStandardMaterial color="#92400E" />
          </mesh>
        </group>
      </group>

      {/* ================= 8. FLOWER PATCHES & NATURE ================= */}
      {[
        { x: -3.5, z: 2.5, color: '#EC4899' },
        { x: 3.8, z: 3.2, color: '#F59E0B' },
        { x: -2.8, z: -5.5, color: '#8B5CF6' },
        { x: 4.2, z: -8.5, color: '#EF4444' },
        { x: -6.5, z: 12.0, color: '#38BDF8' },
        { x: 8.5, z: 13.0, color: '#F43F5E' },
      ].map((flower, idx) => (
        <group key={idx} position={[flower.x, 0, flower.z]}>
          {/* Flower Center Stem */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color="#16A34A" />
          </mesh>
          {/* Blossom */}
          <mesh position={[0, 0.32, 0]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial color={flower.color} roughness={0.3} />
          </mesh>
          {/* Yellow Petal Center */}
          <mesh position={[0, 0.34, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#FBBF24" />
          </mesh>
        </group>
      ))}

      {/* ================= 9. PARK BENCH ================= */}
      <group position={[-5, 0, 2]} rotation={[0, Math.PI / 3, 0]}>
        {/* Bench Planks */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.6, 0.08, 0.5]} />
          <meshStandardMaterial color="#92400E" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.75, -0.22]} rotation={[-0.15, 0, 0]} castShadow>
          <boxGeometry args={[1.6, 0.5, 0.08]} />
          <meshStandardMaterial color="#92400E" roughness={0.7} />
        </mesh>
        {/* Bench Iron Legs */}
        {[-0.7, 0.7].map((x, idx) => (
          <mesh key={idx} position={[x, 0.22, 0]} castShadow>
            <boxGeometry args={[0.06, 0.44, 0.45]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ================= 10. STREET LANTERNS WITH WARM LIGHTS ================= */}
      {[
        { x: -3.5, z: -1.5 },
        { x: 3.5, z: -1.5 },
        { x: -4.0, z: -10.5 },
        { x: 4.0, z: -10.5 },
        { x: 6.0, z: 8.5 },
        { x: -6.0, z: 8.5 },
      ].map((lamp, idx) => (
        <group key={idx} position={[lamp.x, 0, lamp.z]}>
          {/* Metal Post */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 2.8, 10]} />
            <meshStandardMaterial color="#1E293B" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Lantern Head */}
          <mesh position={[0, 2.9, 0]} castShadow>
            <octahedronGeometry args={[0.26]} />
            <meshStandardMaterial
              color={lanternGlowColor}
              emissive={timeOfDay === 'night' ? '#F59E0B' : '#FEF08A'}
              emissiveIntensity={timeOfDay === 'night' ? 1.0 : 0.4}
              roughness={0.1}
            />
          </mesh>
          {/* Lantern Cap */}
          <mesh position={[0, 3.15, 0]}>
            <coneGeometry args={[0.3, 0.18, 4]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          {/* Point Light Source */}
          <pointLight
            position={[0, 2.9, 0]}
            color={lanternGlowColor}
            intensity={timeOfDay === 'night' ? 1.4 : 0.4}
            distance={7.5}
            decay={2}
          />
        </group>
      ))}

      {/* ================= 11. BORDER WHITE PICKET FENCES ================= */}
      {/* North Fences (House area) */}
      <group position={[0, 0, -22]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[44, 0.8, 0.12]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.4} />
        </mesh>
      </group>
      {/* South Fences */}
      <group position={[0, 0, 22]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[44, 0.8, 0.12]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.4} />
        </mesh>
      </group>
      {/* West Fences */}
      <group position={[-22, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[44, 0.8, 0.12]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.4} />
        </mesh>
      </group>
      {/* East Fences */}
      <group position={[22, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[44, 0.8, 0.12]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};
