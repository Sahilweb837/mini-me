import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CharacterConfig, PoseType } from '../../types/character';

interface AvatarModelProps {
  config: CharacterConfig;
  pose: PoseType;
}

export const AvatarModel: React.FC<AvatarModelProps> = ({ config, pose }) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftEyelidRef = useRef<THREE.Mesh>(null);
  const rightEyelidRef = useRef<THREE.Mesh>(null);
  const wingsRef = useRef<THREE.Group>(null);
  const capeRef = useRef<THREE.Group>(null);
  const magicOrbRef = useRef<THREE.Group>(null);

  // Materials & Colors memoized
  const skinMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.skinColor,
    roughness: 0.6,
    metalness: 0.05,
  }), [config.skinColor]);

  const hairMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.hairColor,
    roughness: 0.45,
    metalness: 0.1,
  }), [config.hairColor]);

  const eyeColorMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.eyeColor,
    roughness: 0.2,
  }), [config.eyeColor]);

  const outfitPrimaryMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.outfitPrimaryColor,
    roughness: 0.5,
  }), [config.outfitPrimaryColor]);

  const outfitSecondaryMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.outfitSecondaryColor,
    roughness: 0.5,
  }), [config.outfitSecondaryColor]);

  const shoesMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.shoesColor,
    roughness: 0.4,
  }), [config.shoesColor]);

  const goldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FBBF24',
    metalness: 0.85,
    roughness: 0.2,
  }), []);

  const silverMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#E2E8F0',
    metalness: 0.9,
    roughness: 0.2,
  }), []);

  const whiteMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FFFFFF',
    roughness: 0.3,
  }), []);

  const blackMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1E293B',
    roughness: 0.4,
  }), []);

  const darkMetalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0F172A',
    roughness: 0.3,
    metalness: 0.6,
  }), []);

  const purpleMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#7C3AED',
    roughness: 0.35,
    metalness: 0.3,
  }), []);

  const crimsonMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#DC2626',
    roughness: 0.35,
    metalness: 0.2,
  }), []);

  const neonCyanMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#06B6D4',
    roughness: 0.2,
    metalness: 0.6,
    emissive: new THREE.Color('#0891B2'),
    emissiveIntensity: 0.6,
  }), []);

  const poisonGreenMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#10B981',
    roughness: 0.25,
    metalness: 0.2,
    emissive: new THREE.Color('#059669'),
    emissiveIntensity: 0.5,
  }), []);

  const glassMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#E0F2FE',
    roughness: 0.1,
    transparent: true,
    opacity: 0.55,
  }), []);

  const blushMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: config.blushColor || '#FF6B8B',
    transparent: true,
    opacity: config.blushEnabled ? 0.45 : 0.0,
  }), [config.blushColor, config.blushEnabled]);

  // Animation frame loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Natural blinking: blink for ~0.15s every 3.5 seconds
    const blinkCycle = time % 3.5;
    const isBlinking = blinkCycle > 3.35 && blinkCycle < 3.5;
    const isNarrowed = config.expression === 'shadow_stare' || config.expression === 'villain_smirk';
    const defaultScaleY = isNarrowed ? 0.45 : 0.01;
    const blinkScaleY = isBlinking ? 1.0 : (config.expression === 'sleepy' ? 0.9 : (config.expression === 'wink' ? 0.0 : defaultScaleY));
    const rightBlinkScaleY = isBlinking ? 1.0 : (config.expression === 'sleepy' ? 0.9 : (config.expression === 'wink' ? 0.95 : defaultScaleY));

    if (leftEyelidRef.current) {
      leftEyelidRef.current.scale.y = THREE.MathUtils.lerp(leftEyelidRef.current.scale.y, blinkScaleY, 0.4);
    }
    if (rightEyelidRef.current) {
      rightEyelidRef.current.scale.y = THREE.MathUtils.lerp(rightEyelidRef.current.scale.y, rightBlinkScaleY, 0.4);
    }

    // Wing flutter animation (for fairy wings or demon bat wings)
    if (wingsRef.current) {
      wingsRef.current.children.forEach((wing, idx) => {
        const sign = idx === 0 ? 1 : -1;
        wing.rotation.y = sign * Math.sin(time * 12) * 0.35;
      });
    }

    // Cape flutter animation
    if (capeRef.current) {
      capeRef.current.rotation.x = 0.25 + Math.sin(time * 5) * 0.08;
    }

    // Dark magic orb spin and floating animation
    if (magicOrbRef.current) {
      magicOrbRef.current.rotation.y = time * 2.5;
      magicOrbRef.current.position.y = 0.12 + Math.sin(time * 4) * 0.04;
    }

    // Pose animations
    if (pose === 'idle') {
      // Gentle breathing bob
      if (groupRef.current) {
        groupRef.current.position.y = Math.sin(time * 2.5) * 0.04;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 1.2) * 0.05;
        headRef.current.rotation.z = Math.sin(time * 1.5) * 0.02;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = 0.2 + Math.sin(time * 2.5) * 0.04;
        leftArmRef.current.rotation.x = 0;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -0.2 - Math.sin(time * 2.5) * 0.04;
        rightArmRef.current.rotation.x = 0;
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;

    } else if (pose === 'wave') {
      // Waving hand
      if (groupRef.current) {
        groupRef.current.position.y = Math.sin(time * 3) * 0.03;
      }
      if (headRef.current) {
        headRef.current.rotation.z = -0.08;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -2.4 + Math.sin(time * 8) * 0.35;
        rightArmRef.current.rotation.x = 0.2;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = 0.3;
        leftArmRef.current.rotation.x = 0;
      }

    } else if (pose === 'dance') {
      // Joyful dance: side to side tilt + bouncy jump
      const danceBeat = time * 6;
      if (groupRef.current) {
        groupRef.current.position.y = Math.abs(Math.sin(danceBeat)) * 0.12;
        groupRef.current.rotation.y = Math.sin(danceBeat * 0.5) * 0.25;
      }
      if (headRef.current) {
        headRef.current.rotation.z = Math.sin(danceBeat * 0.5) * 0.15;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = 1.0 + Math.sin(danceBeat) * 0.4;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -1.0 - Math.cos(danceBeat) * 0.4;
      }
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(danceBeat) * 0.3;
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = -Math.sin(danceBeat) * 0.3;
      }

    } else if (pose === 'cheer') {
      // Hands high in air, celebrating!
      const jumpTime = time * 5;
      if (groupRef.current) {
        groupRef.current.position.y = Math.abs(Math.sin(jumpTime)) * 0.18;
      }
      if (headRef.current) {
        headRef.current.rotation.x = -0.15;
        headRef.current.rotation.z = Math.sin(jumpTime) * 0.05;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = 2.6 + Math.sin(jumpTime) * 0.15;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -2.6 - Math.sin(jumpTime) * 0.15;
      }

    } else if (pose === 'sparkle') {
      // Slow magical float & gentle spin
      if (groupRef.current) {
        groupRef.current.position.y = 0.08 + Math.sin(time * 3) * 0.08;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 2) * 0.1;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = 0.8 + Math.sin(time * 3) * 0.1;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -0.8 - Math.sin(time * 3) * 0.1;
      }

    } else if (pose === 'walk') {
      // Natural lively walk cycle with alternating arms and legs
      const walkTime = time * 8;
      if (groupRef.current) {
        groupRef.current.position.y = Math.abs(Math.sin(walkTime)) * 0.04;
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(walkTime) * 0.55;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(walkTime) * 0.55;
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(walkTime) * 0.45;
        leftArmRef.current.rotation.z = 0.2;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = Math.sin(walkTime) * 0.45;
        rightArmRef.current.rotation.z = -0.2;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(walkTime * 0.5) * 0.04;
        headRef.current.rotation.z = Math.sin(walkTime * 0.5) * 0.02;
        headRef.current.rotation.x = 0;
      }

    } else if (pose === 'run') {
      // Fast, enthusiastic sprint with forward tilt
      const runTime = time * 13;
      if (groupRef.current) {
        groupRef.current.position.y = Math.abs(Math.sin(runTime)) * 0.08;
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(runTime) * 0.85;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(runTime) * 0.85;
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(runTime) * 0.75;
        leftArmRef.current.rotation.z = 0.25;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = Math.sin(runTime) * 0.75;
        rightArmRef.current.rotation.z = -0.25;
      }
      if (headRef.current) {
        headRef.current.rotation.x = 0.12;
        headRef.current.rotation.z = Math.sin(runTime * 0.5) * 0.04;
      }

    } else if (pose === 'jump') {
      // In-air leap with raised arms and bent legs
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = 2.4;
        leftArmRef.current.rotation.x = 0.2;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -2.4;
        rightArmRef.current.rotation.x = 0.2;
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0.4;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -0.35;
      if (headRef.current) headRef.current.rotation.x = -0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* ================= TORSO & OUTFIT ================= */}
      <group position={[0, 1.05, 0]}>
        {/* Main Torso */}
        <mesh castShadow receiveShadow material={outfitPrimaryMaterial}>
          <cylinderGeometry args={[0.34, 0.38, 0.65, 24]} />
        </mesh>

        {/* Outfit Specific Details */}
        {config.outfit === 'everyday_casual' && (
          <group>
            {/* Denim Overalls Bib */}
            <mesh position={[0, 0.04, 0.19]} castShadow material={outfitSecondaryMaterial}>
              <boxGeometry args={[0.42, 0.38, 0.04]} />
            </mesh>
            {/* Overalls Straps */}
            <mesh position={[-0.14, 0.18, 0.12]} rotation={[0.2, 0, 0]} material={outfitSecondaryMaterial}>
              <boxGeometry args={[0.07, 0.36, 0.05]} />
            </mesh>
            <mesh position={[0.14, 0.18, 0.12]} rotation={[0.2, 0, 0]} material={outfitSecondaryMaterial}>
              <boxGeometry args={[0.07, 0.36, 0.05]} />
            </mesh>
            {/* Golden Buckle Buttons */}
            <mesh position={[-0.14, 0.18, 0.22]} rotation={[Math.PI / 2, 0, 0]} material={goldMaterial}>
              <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
            </mesh>
            <mesh position={[0.14, 0.18, 0.22]} rotation={[Math.PI / 2, 0, 0]} material={goldMaterial}>
              <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
            </mesh>
            {/* Cute Chest Pocket */}
            <mesh position={[0, -0.02, 0.22]} material={outfitPrimaryMaterial}>
              <boxGeometry args={[0.18, 0.14, 0.02]} />
            </mesh>
          </group>
        )}

        {config.outfit === 'space_astronaut' && (
          <group>
            {/* Life Support Chest Pack */}
            <mesh position={[0, 0.06, 0.21]} castShadow material={outfitSecondaryMaterial}>
              <boxGeometry args={[0.36, 0.32, 0.08]} />
            </mesh>
            {/* Status Gauges */}
            <mesh position={[-0.09, 0.08, 0.26]} rotation={[Math.PI / 2, 0, 0]} material={goldMaterial}>
              <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
            </mesh>
            <mesh position={[0.09, 0.08, 0.26]} rotation={[Math.PI / 2, 0, 0]} material={neonCyanMaterial}>
              <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
            </mesh>
            {/* Tech Oxygen Tubes */}
            <mesh position={[0, -0.06, 0.26]} material={whiteMaterial}>
              <boxGeometry args={[0.24, 0.04, 0.02]} />
            </mesh>
          </group>
        )}

        {config.outfit === 'dino_hoodie' && (
          <group>
            {/* Kangaroo Pouch */}
            <mesh position={[0, -0.12, 0.21]} material={outfitSecondaryMaterial}>
              <boxGeometry args={[0.36, 0.18, 0.04]} />
            </mesh>
            {/* Dino Spine Ridges on Back */}
            {[-0.15, 0.0, 0.15].map((yOffset, i) => (
              <mesh key={i} position={[0, yOffset, -0.22]} rotation={[Math.PI / 2, 0, 0]} material={outfitSecondaryMaterial}>
                <coneGeometry args={[0.06, 0.12, 4]} />
              </mesh>
            ))}
          </group>
        )}

        {config.outfit === 'royal_prince' && (
          <group>
            {/* Golden Epaulets (Shoulder Pads) */}
            <mesh position={[-0.34, 0.28, 0]} material={goldMaterial}>
              <boxGeometry args={[0.14, 0.06, 0.22]} />
            </mesh>
            <mesh position={[0.34, 0.28, 0]} material={goldMaterial}>
              <boxGeometry args={[0.14, 0.06, 0.22]} />
            </mesh>
            {/* Royal Sash */}
            <mesh position={[0, 0.04, 0.2]} rotation={[0, 0, -0.45]} material={goldMaterial}>
              <boxGeometry args={[0.1, 0.65, 0.02]} />
            </mesh>
          </group>
        )}

        {config.outfit === 'superhero_cape' && (
          <group>
            {/* Chest Star Emblem */}
            <mesh position={[0, 0.1, 0.2]} material={goldMaterial}>
              <octahedronGeometry args={[0.11]} />
            </mesh>
            {/* Hero Belt */}
            <mesh position={[0, -0.28, 0.02]} material={goldMaterial}>
              <cylinderGeometry args={[0.38, 0.39, 0.08, 24]} />
            </mesh>
          </group>
        )}

        {config.outfit === 'cozy_pajamas' && (
          <group>
            {/* Fluffy Collar */}
            <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} material={whiteMaterial}>
              <torusGeometry args={[0.26, 0.06, 12, 24]} />
            </mesh>
            {/* Pajama Buttons */}
            {[0.14, 0.0, -0.14].map((y, idx) => (
              <mesh key={idx} position={[0, y, 0.2]} material={goldMaterial}>
                <sphereGeometry args={[0.025, 12, 12]} />
              </mesh>
            ))}
          </group>
        )}

        {config.outfit === 'dark_lord_cape' && (
          <group>
            {/* Obsidian Breastplate */}
            <mesh position={[0, 0.06, 0.2]} castShadow material={darkMetalMaterial}>
              <boxGeometry args={[0.42, 0.42, 0.06]} />
            </mesh>
            {/* Spiked Pauldrons */}
            <mesh position={[-0.36, 0.3, 0]} rotation={[0, 0, 0.4]} material={darkMetalMaterial}>
              <coneGeometry args={[0.12, 0.22, 6]} />
            </mesh>
            <mesh position={[0.36, 0.3, 0]} rotation={[0, 0, -0.4]} material={darkMetalMaterial}>
              <coneGeometry args={[0.12, 0.22, 6]} />
            </mesh>
            {/* Central Glowing Void Gem */}
            <mesh position={[0, 0.1, 0.24]} material={purpleMaterial}>
              <octahedronGeometry args={[0.09]} />
            </mesh>
            {/* Heavy Dark Belt with Spikes */}
            <mesh position={[0, -0.26, 0.04]} material={darkMetalMaterial}>
              <cylinderGeometry args={[0.39, 0.4, 0.08, 24]} />
            </mesh>
          </group>
        )}

        {config.outfit === 'cyber_shadow' && (
          <group>
            {/* Glowing Tech Core Reactor */}
            <mesh position={[0, 0.08, 0.2]} material={neonCyanMaterial}>
              <cylinderGeometry args={[0.1, 0.1, 0.03, 16]} />
            </mesh>
            {/* Circuit Line Accents */}
            <mesh position={[-0.14, -0.08, 0.2]} rotation={[0, 0, 0.5]} material={neonCyanMaterial}>
              <boxGeometry args={[0.03, 0.22, 0.02]} />
            </mesh>
            <mesh position={[0.14, -0.08, 0.2]} rotation={[0, 0, -0.5]} material={neonCyanMaterial}>
              <boxGeometry args={[0.03, 0.22, 0.02]} />
            </mesh>
            {/* Futuristic Shoulder Plating */}
            <mesh position={[-0.36, 0.25, 0]} rotation={[0, 0, 0.3]} material={darkMetalMaterial}>
              <boxGeometry args={[0.15, 0.08, 0.22]} />
            </mesh>
            <mesh position={[0.36, 0.25, 0]} rotation={[0, 0, -0.3]} material={darkMetalMaterial}>
              <boxGeometry args={[0.15, 0.08, 0.22]} />
            </mesh>
          </group>
        )}

        {config.outfit === 'vampire_count' && (
          <group>
            {/* Gothic Double-breasted Vest */}
            <mesh position={[0, 0.02, 0.19]} material={crimsonMaterial}>
              <boxGeometry args={[0.4, 0.46, 0.04]} />
            </mesh>
            {/* High Victorian Standing Collar */}
            <mesh position={[0, 0.36, -0.08]} rotation={[-0.2, 0, 0]} material={crimsonMaterial}>
              <cylinderGeometry args={[0.28, 0.24, 0.22, 16, 1, true, -Math.PI * 0.75, Math.PI * 1.5]} />
            </mesh>
            {/* Golden Cravat Brooch */}
            <mesh position={[0, 0.2, 0.22]} material={goldMaterial}>
              <sphereGeometry args={[0.04, 12, 12]} />
            </mesh>
            {/* Gold Buttons */}
            {[-0.08, 0.08].map((x, xi) => (
              [0.08, -0.04, -0.16].map((y, yi) => (
                <mesh key={`${xi}-${yi}`} position={[x, y, 0.22]} material={goldMaterial}>
                  <sphereGeometry args={[0.02, 8, 8]} />
                </mesh>
              ))
            ))}
          </group>
        )}

        {config.outfit === 'mischief_ninja' && (
          <group>
            {/* Crossed Chest Sash */}
            <mesh position={[0, 0.04, 0.2]} rotation={[0, 0, 0.7]} material={outfitSecondaryMaterial}>
              <boxGeometry args={[0.1, 0.7, 0.03]} />
            </mesh>
            <mesh position={[0, 0.04, 0.19]} rotation={[0, 0, -0.7]} material={outfitSecondaryMaterial}>
              <boxGeometry args={[0.1, 0.7, 0.03]} />
            </mesh>
            {/* Throwing Star Brooch */}
            <mesh position={[0, 0.05, 0.22]} rotation={[0, 0, Math.PI / 4]} material={silverMaterial}>
              <boxGeometry args={[0.08, 0.08, 0.02]} />
            </mesh>
          </group>
        )}

        {config.outfit === 'fire_demon' && (
          <group>
            {/* Molten Lava Center Vent */}
            <mesh position={[0, 0.06, 0.21]} material={crimsonMaterial}>
              <coneGeometry args={[0.14, 0.35, 3]} />
            </mesh>
            <mesh position={[0, 0.06, 0.22]} material={goldMaterial}>
              <coneGeometry args={[0.08, 0.22, 3]} />
            </mesh>
            {/* Flame Horn Pauldrons */}
            <mesh position={[-0.34, 0.28, 0]} rotation={[0.4, 0, 0.6]} material={crimsonMaterial}>
              <coneGeometry args={[0.1, 0.24, 6]} />
            </mesh>
            <mesh position={[0.34, 0.28, 0]} rotation={[0.4, 0, -0.6]} material={crimsonMaterial}>
              <coneGeometry args={[0.1, 0.24, 6]} />
            </mesh>
          </group>
        )}

        {config.outfit === 'candy_witch' && (
          <group>
            {/* Whimsical Collar */}
            <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]} material={purpleMaterial}>
              <torusGeometry args={[0.26, 0.06, 8, 24]} />
            </mesh>
            {/* Potion Vial Belt */}
            <mesh position={[0, -0.26, 0.02]} material={darkMetalMaterial}>
              <cylinderGeometry args={[0.38, 0.39, 0.07, 24]} />
            </mesh>
            {/* Little Glowing Potion Flask on Belt */}
            <mesh position={[-0.18, -0.26, 0.24]} material={poisonGreenMaterial}>
              <sphereGeometry args={[0.05, 12, 12]} />
            </mesh>
            <mesh position={[0.18, -0.26, 0.24]} material={crimsonMaterial}>
              <sphereGeometry args={[0.05, 12, 12]} />
            </mesh>
          </group>
        )}
      </group>

      {/* ================= HEAD & FACE ================= */}
      <group ref={headRef} position={[0, 1.75, 0]}>
        {/* Head Base Sphere */}
        <mesh castShadow receiveShadow material={skinMaterial}>
          <sphereGeometry args={[0.54, 32, 32]} />
        </mesh>

        {/* Cute Rounded Ears */}
        <mesh position={[-0.53, 0, 0]} rotation={[0, 0.3, 0]} material={skinMaterial}>
          <sphereGeometry args={[0.12, 16, 16]} />
        </mesh>
        <mesh position={[0.53, 0, 0]} rotation={[0, -0.3, 0]} material={skinMaterial}>
          <sphereGeometry args={[0.12, 16, 16]} />
        </mesh>

        {/* Cute Button Nose */}
        <mesh position={[0, -0.04, 0.52]} material={skinMaterial}>
          <sphereGeometry args={[0.05, 16, 16]} />
        </mesh>

        {/* Rosy Cheeks */}
        <mesh position={[-0.28, -0.12, 0.44]} rotation={[0, -0.4, 0]} material={blushMaterial}>
          <circleGeometry args={[0.1, 24]} />
        </mesh>
        <mesh position={[0.28, -0.12, 0.44]} rotation={[0, 0.4, 0]} material={blushMaterial}>
          <circleGeometry args={[0.1, 24]} />
        </mesh>

        {/* Eyes (Left & Right) */}
        <group position={[-0.18, 0.06, 0.46]} rotation={[0, -0.15, 0]}>
          <mesh material={whiteMaterial}>
            <sphereGeometry args={[0.11, 24, 24]} />
          </mesh>
          <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} material={eyeColorMaterial}>
            <cylinderGeometry args={[0.065, 0.065, 0.02, 24]} />
          </mesh>
          <mesh position={[0, 0, 0.095]} rotation={[Math.PI / 2, 0, 0]} material={blackMaterial}>
            <cylinderGeometry args={[0.04, 0.04, 0.015, 24]} />
          </mesh>
          <mesh position={[0.02, 0.025, 0.105]} material={whiteMaterial}>
            <sphereGeometry args={[0.02, 12, 12]} />
          </mesh>
          <mesh position={[-0.015, -0.02, 0.105]} material={whiteMaterial}>
            <sphereGeometry args={[0.01, 12, 12]} />
          </mesh>
          <mesh ref={leftEyelidRef} position={[0, 0.04, 0.07]} material={skinMaterial}>
            <boxGeometry args={[0.22, 0.14, 0.1]} />
          </mesh>
        </group>

        <group position={[0.18, 0.06, 0.46]} rotation={[0, 0.15, 0]}>
          <mesh material={whiteMaterial}>
            <sphereGeometry args={[0.11, 24, 24]} />
          </mesh>
          <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} material={eyeColorMaterial}>
            <cylinderGeometry args={[0.065, 0.065, 0.02, 24]} />
          </mesh>
          <mesh position={[0, 0, 0.095]} rotation={[Math.PI / 2, 0, 0]} material={blackMaterial}>
            <cylinderGeometry args={[0.04, 0.04, 0.015, 24]} />
          </mesh>
          <mesh position={[0.02, 0.025, 0.105]} material={whiteMaterial}>
            <sphereGeometry args={[0.02, 12, 12]} />
          </mesh>
          <mesh position={[-0.015, -0.02, 0.105]} material={whiteMaterial}>
            <sphereGeometry args={[0.01, 12, 12]} />
          </mesh>
          <mesh ref={rightEyelidRef} position={[0, 0.04, 0.07]} material={skinMaterial}>
            <boxGeometry args={[0.22, 0.14, 0.1]} />
          </mesh>
        </group>

        {/* Eyebrows */}
        <group
          position={[-0.18, 0.22, 0.47]}
          rotation={[0, 0, config.expression === 'evil_grin' ? -0.3 : config.expression === 'villain_smirk' ? 0.3 : config.expression === 'silly' ? 0.25 : config.expression === 'excited' ? -0.15 : 0.05]}
        >
          <mesh material={hairMaterial}>
            <boxGeometry args={[0.12, 0.035, 0.04]} />
          </mesh>
        </group>
        <group
          position={[0.18, 0.22, 0.47]}
          rotation={[0, 0, config.expression === 'evil_grin' ? 0.3 : config.expression === 'villain_smirk' ? -0.4 : config.expression === 'silly' ? -0.2 : config.expression === 'excited' ? 0.15 : -0.05]}
        >
          <mesh material={hairMaterial}>
            <boxGeometry args={[0.12, 0.035, 0.04]} />
          </mesh>
        </group>

        {/* Mouth with Expressions */}
        {config.expression === 'happy' && (
          <mesh position={[0, -0.2, 0.48]} rotation={[Math.PI, 0, 0]} material={blackMaterial}>
            <torusGeometry args={[0.08, 0.022, 12, 24, Math.PI]} />
          </mesh>
        )}
        {config.expression === 'excited' && (
          <group position={[0, -0.22, 0.48]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={blackMaterial}>
              <cylinderGeometry args={[0.08, 0.08, 0.02, 18]} />
            </mesh>
            <mesh position={[0, -0.03, 0.015]} material={blushMaterial}>
              <sphereGeometry args={[0.045, 12, 12]} />
            </mesh>
          </group>
        )}
        {config.expression === 'silly' && (
          <group position={[0, -0.2, 0.48]}>
            <mesh rotation={[Math.PI, 0, 0]} material={blackMaterial}>
              <torusGeometry args={[0.08, 0.02, 12, 24, Math.PI]} />
            </mesh>
            <mesh position={[0.02, -0.06, 0.03]} rotation={[0.4, 0, 0]} material={blushMaterial}>
              <boxGeometry args={[0.06, 0.09, 0.03]} />
            </mesh>
          </group>
        )}
        {config.expression === 'cool' && (
          <mesh position={[0.03, -0.2, 0.48]} rotation={[Math.PI, 0, -0.25]} material={blackMaterial}>
            <torusGeometry args={[0.08, 0.02, 12, 24, Math.PI * 0.7]} />
          </mesh>
        )}
        {(config.expression === 'wink' || config.expression === 'sleepy') && (
          <mesh position={[0, -0.2, 0.48]} rotation={[Math.PI, 0, 0]} material={blackMaterial}>
            <torusGeometry args={[0.07, 0.02, 12, 24, Math.PI]} />
          </mesh>
        )}
        {config.expression === 'evil_grin' && (
          <group position={[0, -0.2, 0.48]}>
            <mesh rotation={[Math.PI, 0, 0]} material={blackMaterial}>
              <torusGeometry args={[0.11, 0.025, 12, 24, Math.PI * 1.1]} />
            </mesh>
            {/* Little sharp teeth */}
            <mesh position={[-0.05, 0.02, 0.01]} rotation={[Math.PI, 0, 0]} material={whiteMaterial}>
              <coneGeometry args={[0.02, 0.04, 4]} />
            </mesh>
            <mesh position={[0.05, 0.02, 0.01]} rotation={[Math.PI, 0, 0]} material={whiteMaterial}>
              <coneGeometry args={[0.02, 0.04, 4]} />
            </mesh>
          </group>
        )}
        {config.expression === 'villain_smirk' && (
          <mesh position={[0.05, -0.19, 0.48]} rotation={[Math.PI, 0, -0.45]} material={blackMaterial}>
            <torusGeometry args={[0.09, 0.022, 12, 24, Math.PI * 0.8]} />
          </mesh>
        )}
        {config.expression === 'shadow_stare' && (
          <mesh position={[0, -0.21, 0.49]} material={blackMaterial}>
            <boxGeometry args={[0.14, 0.025, 0.02]} />
          </mesh>
        )}
        {config.expression === 'playful_vampire' && (
          <group position={[0, -0.2, 0.48]}>
            <mesh rotation={[Math.PI, 0, 0]} material={blackMaterial}>
              <torusGeometry args={[0.09, 0.022, 12, 24, Math.PI]} />
            </mesh>
            {/* Cute Vampire Fangs */}
            <mesh position={[-0.05, -0.01, 0.02]} rotation={[Math.PI, 0, 0]} material={whiteMaterial}>
              <coneGeometry args={[0.02, 0.05, 4]} />
            </mesh>
            <mesh position={[0.05, -0.01, 0.02]} rotation={[Math.PI, 0, 0]} material={whiteMaterial}>
              <coneGeometry args={[0.02, 0.05, 4]} />
            </mesh>
          </group>
        )}

        {/* ================= HAIRSTYLES (19 Procedural 3D Styles) ================= */}
        {config.hairstyle === 'bouncy_bob' && (
          <group position={[0, 0.05, 0]}>
            <mesh position={[0, 0.08, -0.04]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.57, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
            </mesh>
            <mesh position={[-0.42, -0.15, 0.05]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.25, 16, 16]} />
            </mesh>
            <mesh position={[0.42, -0.15, 0.05]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.25, 16, 16]} />
            </mesh>
            <mesh position={[0, 0.35, 0.42]} rotation={[0.4, 0, 0]} material={hairMaterial}>
              <boxGeometry args={[0.48, 0.18, 0.12]} />
            </mesh>
          </group>
        )}

        {config.hairstyle === 'fluffy_curls' && (
          <group position={[0, 0.05, 0]}>
            {[
              [0, 0.45, 0, 0.32],
              [-0.28, 0.38, 0.1, 0.28],
              [0.28, 0.38, 0.1, 0.28],
              [-0.38, 0.2, 0.25, 0.24],
              [0.38, 0.2, 0.25, 0.24],
              [-0.42, 0.05, 0.1, 0.25],
              [0.42, 0.05, 0.1, 0.25],
              [0, 0.25, -0.38, 0.35],
              [-0.25, 0.1, -0.35, 0.3],
              [0.25, 0.1, -0.35, 0.3],
            ].map(([x, y, z, r], idx) => (
              <mesh key={idx} position={[x, y, z]} castShadow material={hairMaterial}>
                <sphereGeometry args={[r, 16, 16]} />
              </mesh>
            ))}
          </group>
        )}

        {config.hairstyle === 'high_ponytail' && (
          <group position={[0, 0.05, 0]}>
            <mesh position={[0, 0.1, -0.05]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.56, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
            </mesh>
            <mesh position={[0, 0.34, 0.4]} rotation={[0.35, 0, 0]} material={hairMaterial}>
              <boxGeometry args={[0.42, 0.15, 0.1]} />
            </mesh>
            <mesh position={[0, 0.48, -0.32]} rotation={[Math.PI / 4, 0, 0]} material={goldMaterial}>
              <torusGeometry args={[0.1, 0.04, 12, 24]} />
            </mesh>
            <mesh position={[0, 0.25, -0.58]} rotation={[-0.6, 0, 0]} castShadow material={hairMaterial}>
              <cylinderGeometry args={[0.16, 0.08, 0.55, 16]} />
            </mesh>
          </group>
        )}

        {config.hairstyle === 'spiky_pixie' && (
          <group position={[0, 0.05, 0]}>
            <mesh position={[0, 0.12, -0.04]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.56, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
            </mesh>
            {[
              [0, 0.58, 0.1, [0.3, 0, 0], 0.14, 0.32],
              [-0.2, 0.54, 0.05, [0.2, 0, 0.3], 0.13, 0.28],
              [0.2, 0.54, 0.05, [0.2, 0, -0.3], 0.13, 0.28],
              [-0.32, 0.4, 0.2, [0.4, 0, 0.4], 0.12, 0.24],
              [0.32, 0.4, 0.2, [0.4, 0, -0.4], 0.12, 0.24],
              [0, 0.52, -0.22, [-0.4, 0, 0], 0.14, 0.28],
            ].map(([x, y, z, rot, rad, h], idx) => (
              <mesh key={idx} position={[x as number, y as number, z as number]} rotation={rot as [number, number, number]} castShadow material={hairMaterial}>
                <coneGeometry args={[rad as number, h as number, 8]} />
              </mesh>
            ))}
          </group>
        )}

        {config.hairstyle === 'space_buns' && (
          <group position={[0, 0.05, 0]}>
            <mesh position={[0, 0.1, -0.04]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.56, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
            </mesh>
            <mesh position={[-0.42, 0.52, -0.05]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.26, 20, 20]} />
            </mesh>
            <mesh position={[-0.42, 0.36, -0.05]} rotation={[Math.PI / 2, 0, 0]} material={outfitSecondaryMaterial}>
              <torusGeometry args={[0.12, 0.04, 12, 24]} />
            </mesh>
            <mesh position={[0.42, 0.52, -0.05]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.26, 20, 20]} />
            </mesh>
            <mesh position={[0.42, 0.36, -0.05]} rotation={[Math.PI / 2, 0, 0]} material={outfitSecondaryMaterial}>
              <torusGeometry args={[0.12, 0.04, 12, 24]} />
            </mesh>
          </group>
        )}

        {config.hairstyle === 'explorer_cap' && (
          <group position={[0, 0.15, 0]}>
            <mesh position={[0, 0.25, -0.05]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.56, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            </mesh>
            <mesh position={[0, 0.22, 0.52]} rotation={[0.25, 0, 0]} material={hairMaterial}>
              <cylinderGeometry args={[0.48, 0.52, 0.05, 24, 1, false, 0, Math.PI]} />
            </mesh>
            <mesh position={[0, 0.44, 0.36]} rotation={[Math.PI / 3, 0, 0]} material={goldMaterial}>
              <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
            </mesh>
          </group>
        )}

        {config.hairstyle === 'shaggy_cut' && (
          <group position={[0, 0.05, 0]}>
            <mesh position={[0, 0.12, -0.04]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.57, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
            </mesh>
            <mesh position={[-0.45, -0.05, 0.15]} rotation={[0, 0, -0.2]} material={hairMaterial}>
              <capsuleGeometry args={[0.1, 0.35, 8, 16]} />
            </mesh>
            <mesh position={[0.45, -0.05, 0.15]} rotation={[0, 0, 0.2]} material={hairMaterial}>
              <capsuleGeometry args={[0.1, 0.35, 8, 16]} />
            </mesh>
          </group>
        )}

        {config.hairstyle === 'anime_spikes' && (
          <group position={[0, 0.05, 0]}>
            <mesh position={[0, 0.12, -0.04]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.56, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.68]} />
            </mesh>
            {/* Dramatic Sweeping Spikes */}
            {[
              [0, 0.65, 0.15, [0.3, 0, 0], 0.18, 0.45],
              [-0.24, 0.6, 0.08, [0.25, 0, 0.4], 0.16, 0.4],
              [0.24, 0.6, 0.08, [0.25, 0, -0.4], 0.16, 0.4],
              [-0.4, 0.42, 0.2, [0.35, 0, 0.6], 0.14, 0.38],
              [0.4, 0.42, 0.2, [0.35, 0, -0.6], 0.14, 0.38],
              [0, 0.62, -0.25, [-0.5, 0, 0], 0.18, 0.42],
              [-0.25, 0.52, -0.25, [-0.4, 0, 0.3], 0.15, 0.36],
              [0.25, 0.52, -0.25, [-0.4, 0, -0.3], 0.15, 0.36],
            ].map(([x, y, z, rot, rad, h], idx) => (
              <mesh key={idx} position={[x as number, y as number, z as number]} rotation={rot as [number, number, number]} castShadow material={hairMaterial}>
                <coneGeometry args={[rad as number, h as number, 6]} />
              </mesh>
            ))}
          </group>
        )}

        {config.hairstyle === 'dreadlocks_fade' && (
          <group position={[0, 0.05, 0]}>
            <mesh position={[0, 0.14, -0.04]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.56, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
            </mesh>
            {/* Hanging Dreadlock Cylinders */}
            {[-0.35, -0.2, 0, 0.2, 0.35].map((x, i) => (
              <group key={i}>
                <mesh position={[x, -0.15, -0.38]} rotation={[0.2, 0, x * 0.4]} material={hairMaterial}>
                  <capsuleGeometry args={[0.065, 0.5, 6, 12]} />
                </mesh>
                <mesh position={[x * 1.3, -0.1, -0.15]} rotation={[0, 0, x * 0.6]} material={hairMaterial}>
                  <capsuleGeometry args={[0.06, 0.45, 6, 12]} />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {config.hairstyle === 'demon_horns_hair' && (
          <group position={[0, 0.05, 0]}>
            <mesh position={[0, 0.12, -0.04]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.57, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
            </mesh>
            {/* Horn Shaped Swept Hair Bunches */}
            <mesh position={[-0.32, 0.62, 0.05]} rotation={[-0.2, 0, 0.35]} castShadow material={hairMaterial}>
              <coneGeometry args={[0.16, 0.45, 8]} />
            </mesh>
            <mesh position={[0.32, 0.62, 0.05]} rotation={[-0.2, 0, -0.35]} castShadow material={hairMaterial}>
              <coneGeometry args={[0.16, 0.45, 8]} />
            </mesh>
            {/* Widow's Peak Hairline */}
            <mesh position={[0, 0.32, 0.48]} rotation={[0.4, 0, 0]} material={hairMaterial}>
              <coneGeometry args={[0.12, 0.2, 4]} />
            </mesh>
          </group>
        )}

        {config.hairstyle === 'cyber_mohawk' && (
          <group position={[0, 0.05, 0]}>
            {/* Tight base cap */}
            <mesh position={[0, 0.08, -0.04]} material={hairMaterial}>
              <sphereGeometry args={[0.55, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            </mesh>
            {/* Center Razor Crest Mohawk */}
            {[-0.3, -0.15, 0, 0.15, 0.3].map((z, idx) => (
              <mesh key={idx} position={[0, 0.6 - Math.abs(z) * 0.25, z]} rotation={[-z * 0.8, 0, 0]} castShadow material={hairMaterial}>
                <boxGeometry args={[0.12, 0.32, 0.14]} />
              </mesh>
            ))}
          </group>
        )}

        {config.hairstyle === 'twin_braids' && (
          <group position={[0, 0.05, 0]}>
            <mesh position={[0, 0.12, -0.04]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.56, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
            </mesh>
            {/* Left Braid Segments */}
            {[-0.05, -0.2, -0.35].map((y, idx) => (
              <mesh key={`lb-${idx}`} position={[-0.45, y, 0.25 - idx * 0.05]} material={hairMaterial}>
                <sphereGeometry args={[0.12 - idx * 0.015, 12, 12]} />
              </mesh>
            ))}
            <mesh position={[-0.45, -0.42, 0.15]} material={goldMaterial}>
              <torusGeometry args={[0.07, 0.03, 8, 16]} />
            </mesh>
            {/* Right Braid Segments */}
            {[-0.05, -0.2, -0.35].map((y, idx) => (
              <mesh key={`rb-${idx}`} position={[0.45, y, 0.25 - idx * 0.05]} material={hairMaterial}>
                <sphereGeometry args={[0.12 - idx * 0.015, 12, 12]} />
              </mesh>
            ))}
            <mesh position={[0.45, -0.42, 0.15]} material={goldMaterial}>
              <torusGeometry args={[0.07, 0.03, 8, 16]} />
            </mesh>
          </group>
        )}

        {config.hairstyle === 'afro_puff_crown' && (
          <group position={[0, 0.18, -0.05]}>
            {/* Magnificent Large Rounded Afro Volume */}
            <mesh castShadow material={hairMaterial}>
              <sphereGeometry args={[0.68, 24, 24]} />
            </mesh>
            {/* Micro Clustered Texture Spheres */}
            {[
              [0, 0.5, 0.2, 0.25],
              [-0.35, 0.35, 0.25, 0.22],
              [0.35, 0.35, 0.25, 0.22],
              [-0.45, 0, 0.25, 0.24],
              [0.45, 0, 0.25, 0.24],
            ].map(([x, y, z, r], idx) => (
              <mesh key={idx} position={[x, y, z]} material={hairMaterial}>
                <sphereGeometry args={[r, 12, 12]} />
              </mesh>
            ))}
          </group>
        )}

        {config.hairstyle === 'vampire_slick' && (
          <group position={[0, 0.06, 0]}>
            <mesh position={[0, 0.12, -0.06]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.57, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
            </mesh>
            {/* Widow's Peak Accent */}
            <mesh position={[0, 0.28, 0.49]} rotation={[0.4, 0, 0]} material={hairMaterial}>
              <coneGeometry args={[0.1, 0.18, 4]} />
            </mesh>
            {/* Sharp Pointed Sideburns */}
            <mesh position={[-0.48, -0.08, 0.2]} rotation={[0.2, 0, 0.1]} material={hairMaterial}>
              <coneGeometry args={[0.06, 0.24, 4]} />
            </mesh>
            <mesh position={[0.48, -0.08, 0.2]} rotation={[0.2, 0, -0.1]} material={hairMaterial}>
              <coneGeometry args={[0.06, 0.24, 4]} />
            </mesh>
          </group>
        )}

        {config.hairstyle === 'wizard_long_flow' && (
          <group position={[0, 0.05, 0]}>
            <mesh position={[0, 0.12, -0.04]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.57, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
            </mesh>
            {/* Long Back Flowing Locks */}
            <mesh position={[0, -0.3, -0.38]} rotation={[0.1, 0, 0]} castShadow material={hairMaterial}>
              <capsuleGeometry args={[0.25, 0.8, 8, 16]} />
            </mesh>
            {/* Left and Right Shoulder Drape */}
            <mesh position={[-0.42, -0.22, 0.1]} rotation={[0, 0, -0.15]} material={hairMaterial}>
              <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
            </mesh>
            <mesh position={[0.42, -0.22, 0.1]} rotation={[0, 0, 0.15]} material={hairMaterial}>
              <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
            </mesh>
          </group>
        )}

        {config.hairstyle === 'messy_bedhead' && (
          <group position={[0, 0.05, 0]}>
            <mesh position={[0, 0.12, -0.04]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.56, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
            </mesh>
            {/* Tousled Organic Clumps */}
            {[
              [-0.2, 0.55, 0.15, [0.4, 0.2, 0.3], 0.16, 0.28],
              [0.22, 0.52, 0.12, [0.35, -0.2, -0.3], 0.16, 0.3],
              [-0.35, 0.42, -0.1, [0.1, 0.4, 0.6], 0.14, 0.26],
              [0.35, 0.44, -0.1, [0.1, -0.4, -0.6], 0.14, 0.26],
              [0.05, 0.58, -0.2, [-0.5, 0.2, 0], 0.17, 0.32],
            ].map(([x, y, z, rot, rad, h], idx) => (
              <mesh key={idx} position={[x as number, y as number, z as number]} rotation={rot as [number, number, number]} material={hairMaterial}>
                <coneGeometry args={[rad as number, h as number, 6]} />
              </mesh>
            ))}
          </group>
        )}

        {config.hairstyle === 'undercut_quiff' && (
          <group position={[0, 0.05, 0]}>
            <mesh position={[0, 0.1, -0.04]} material={hairMaterial}>
              <sphereGeometry args={[0.55, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            </mesh>
            {/* Voluminous Pompadour Quiff on Front */}
            <mesh position={[0, 0.52, 0.2]} rotation={[0.4, 0, 0]} castShadow material={hairMaterial}>
              <capsuleGeometry args={[0.22, 0.4, 8, 16]} />
            </mesh>
          </group>
        )}

        {config.hairstyle === 'wolf_cut' && (
          <group position={[0, 0.05, 0]}>
            <mesh position={[0, 0.12, -0.04]} castShadow material={hairMaterial}>
              <sphereGeometry args={[0.57, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
            </mesh>
            {/* Shaggy Flared Layers */}
            {[-0.45, 0.45].map((x, idx) => (
              <mesh key={idx} position={[x, -0.08, 0.15]} rotation={[0, 0, idx === 0 ? -0.4 : 0.4]} material={hairMaterial}>
                <coneGeometry args={[0.15, 0.4, 6]} />
              </mesh>
            ))}
            <mesh position={[0, -0.22, -0.4]} rotation={[-0.3, 0, 0]} material={hairMaterial}>
              <coneGeometry args={[0.22, 0.45, 6]} />
            </mesh>
          </group>
        )}

        {config.hairstyle === 'cloud_bob' && (
          <group position={[0, 0.05, 0]}>
            {[
              [0, 0.42, -0.05, 0.35],
              [-0.38, 0.28, 0.05, 0.28],
              [0.38, 0.28, 0.05, 0.28],
              [-0.44, 0, 0.12, 0.26],
              [0.44, 0, 0.12, 0.26],
              [-0.36, -0.15, 0.18, 0.22],
              [0.36, -0.15, 0.18, 0.22],
            ].map(([x, y, z, r], idx) => (
              <mesh key={idx} position={[x, y, z]} castShadow material={hairMaterial}>
                <sphereGeometry args={[r, 16, 16]} />
              </mesh>
            ))}
          </group>
        )}

        {/* ================= GLASSES ================= */}
        {config.glasses === 'round_frames' && (
          <group position={[0, 0.06, 0.54]}>
            <mesh position={[-0.19, 0, 0]} material={blackMaterial}>
              <torusGeometry args={[0.13, 0.02, 12, 24]} />
            </mesh>
            <mesh position={[0.19, 0, 0]} material={blackMaterial}>
              <torusGeometry args={[0.13, 0.02, 12, 24]} />
            </mesh>
            <mesh position={[0, 0.02, 0]} material={blackMaterial}>
              <boxGeometry args={[0.12, 0.02, 0.02]} />
            </mesh>
          </group>
        )}

        {config.glasses === 'star_shades' && (
          <group position={[0, 0.06, 0.54]}>
            <mesh position={[-0.19, 0, 0]} rotation={[Math.PI / 2, 0, 0.3]} material={goldMaterial}>
              <cylinderGeometry args={[0.13, 0.13, 0.02, 5]} />
            </mesh>
            <mesh position={[0.19, 0, 0]} rotation={[Math.PI / 2, 0, -0.3]} material={goldMaterial}>
              <cylinderGeometry args={[0.13, 0.13, 0.02, 5]} />
            </mesh>
            <mesh position={[0, 0.02, 0]} material={goldMaterial}>
              <boxGeometry args={[0.12, 0.025, 0.02]} />
            </mesh>
          </group>
        )}

        {config.glasses === 'cool_sunglasses' && (
          <group position={[0, 0.06, 0.54]}>
            <mesh material={blackMaterial}>
              <boxGeometry args={[0.56, 0.16, 0.04]} />
            </mesh>
          </group>
        )}

        {config.glasses === 'cyber_monocle' && (
          <group position={[0.19, 0.06, 0.54]}>
            {/* Glowing Tech Monocle Lens over Right Eye */}
            <mesh material={neonCyanMaterial}>
              <torusGeometry args={[0.12, 0.02, 12, 24]} />
            </mesh>
            <mesh position={[0, 0, 0.01]} material={glassMaterial}>
              <circleGeometry args={[0.11, 24]} />
            </mesh>
            {/* Wire to Ear */}
            <mesh position={[0.14, -0.04, -0.15]} rotation={[0, 0.8, 0]} material={silverMaterial}>
              <cylinderGeometry args={[0.01, 0.01, 0.32, 8]} />
            </mesh>
          </group>
        )}

        {config.glasses === 'villain_goggles' && (
          <group position={[0, 0.28, 0.46]} rotation={[-0.2, 0, 0]}>
            {/* Brass Double Steampunk Goggles on Forehead */}
            <mesh position={[-0.19, 0, 0]} material={goldMaterial}>
              <torusGeometry args={[0.13, 0.03, 12, 24]} />
            </mesh>
            <mesh position={[0.19, 0, 0]} material={goldMaterial}>
              <torusGeometry args={[0.13, 0.03, 12, 24]} />
            </mesh>
            <mesh position={[-0.19, 0, 0]} material={crimsonMaterial}>
              <circleGeometry args={[0.1, 16]} />
            </mesh>
            <mesh position={[0.19, 0, 0]} material={crimsonMaterial}>
              <circleGeometry args={[0.1, 16]} />
            </mesh>
            {/* Leather Strap */}
            <mesh position={[0, 0, -0.1]} material={blackMaterial}>
              <torusGeometry args={[0.54, 0.025, 8, 32]} />
            </mesh>
          </group>
        )}

        {/* ================= HEAD ACCESSORIES ================= */}
        {config.headAccessory === 'golden_tiara' && (
          <group position={[0, 0.55, 0.1]} rotation={[-0.1, 0, 0]}>
            <mesh material={goldMaterial}>
              <cylinderGeometry args={[0.3, 0.33, 0.08, 24, 1, true]} />
            </mesh>
            {[-0.2, -0.1, 0, 0.1, 0.2].map((x, idx) => (
              <mesh key={idx} position={[x, 0.1 + (idx === 2 ? 0.08 : 0), 0.28]} material={goldMaterial}>
                <coneGeometry args={[0.04, 0.12 + (idx === 2 ? 0.08 : 0), 8]} />
              </mesh>
            ))}
          </group>
        )}

        {config.headAccessory === 'bear_ears' && (
          <group position={[0, 0.46, 0]}>
            <mesh position={[-0.42, 0.15, 0]} material={hairMaterial}>
              <sphereGeometry args={[0.18, 16, 16]} />
            </mesh>
            <mesh position={[-0.42, 0.15, 0.06]} material={blushMaterial}>
              <sphereGeometry args={[0.1, 16, 16]} />
            </mesh>
            <mesh position={[0.42, 0.15, 0]} material={hairMaterial}>
              <sphereGeometry args={[0.18, 16, 16]} />
            </mesh>
            <mesh position={[0.42, 0.15, 0.06]} material={blushMaterial}>
              <sphereGeometry args={[0.1, 16, 16]} />
            </mesh>
          </group>
        )}

        {config.headAccessory === 'dino_spikes' && (
          <group position={[0, 0.45, 0.2]}>
            {[
              [0, 0.18, 0.15, 0.08, 0.18],
              [0, 0.24, -0.05, 0.09, 0.2],
              [0, 0.22, -0.25, 0.08, 0.18],
            ].map(([x, y, z, rad, h], idx) => (
              <mesh key={idx} position={[x, y, z]} material={goldMaterial}>
                <coneGeometry args={[rad, h, 8]} />
              </mesh>
            ))}
          </group>
        )}

        {config.headAccessory === 'party_hat' && (
          <group position={[0, 0.58, 0.05]} rotation={[-0.1, 0, 0.15]}>
            <mesh material={outfitSecondaryMaterial}>
              <coneGeometry args={[0.2, 0.45, 16]} />
            </mesh>
            <mesh position={[0, 0.25, 0]} material={goldMaterial}>
              <sphereGeometry args={[0.06, 12, 12]} />
            </mesh>
          </group>
        )}

        {config.headAccessory === 'flower_crown' && (
          <group position={[0, 0.45, 0.1]} rotation={[-0.15, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={outfitSecondaryMaterial}>
              <torusGeometry args={[0.48, 0.04, 12, 32]} />
            </mesh>
            {[-0.35, -0.18, 0, 0.18, 0.35].map((x, idx) => (
              <mesh key={idx} position={[x, 0.02, 0.45]} material={blushMaterial}>
                <sphereGeometry args={[0.06, 12, 12]} />
              </mesh>
            ))}
          </group>
        )}

        {config.headAccessory === 'demon_horns' && (
          <group position={[0, 0.5, 0.05]}>
            {/* Curved Crimson Horns */}
            <mesh position={[-0.32, 0.2, 0]} rotation={[-0.3, 0, 0.45]} castShadow material={crimsonMaterial}>
              <coneGeometry args={[0.1, 0.42, 12]} />
            </mesh>
            <mesh position={[0.32, 0.2, 0]} rotation={[-0.3, 0, -0.45]} castShadow material={crimsonMaterial}>
              <coneGeometry args={[0.1, 0.42, 12]} />
            </mesh>
          </group>
        )}

        {config.headAccessory === 'shadow_halo' && (
          <group position={[0, 0.75, 0]} rotation={[0.2, 0, 0]}>
            {/* Dark Floating Obsidian Halo */}
            <mesh material={darkMetalMaterial}>
              <torusGeometry args={[0.36, 0.04, 12, 32]} />
            </mesh>
            {/* Spikes on Halo */}
            {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
              <mesh
                key={idx}
                position={[Math.cos(angle) * 0.36, 0.05, Math.sin(angle) * 0.36]}
                rotation={[0, 0, 0]}
                material={purpleMaterial}
              >
                <coneGeometry args={[0.03, 0.12, 4]} />
              </mesh>
            ))}
          </group>
        )}

        {config.headAccessory === 'cyber_visor' && (
          <group position={[0, 0.08, 0.48]}>
            <mesh rotation={[0.1, 0, 0]} material={neonCyanMaterial}>
              <cylinderGeometry args={[0.52, 0.52, 0.12, 24, 1, false, -Math.PI * 0.35, Math.PI * 0.7]} />
            </mesh>
          </group>
        )}

        {config.headAccessory === 'vampire_bat_ears' && (
          <group position={[0, 0.52, 0]}>
            <mesh position={[-0.38, 0.15, 0]} rotation={[0, 0, 0.35]} material={darkMetalMaterial}>
              <coneGeometry args={[0.14, 0.36, 4]} />
            </mesh>
            <mesh position={[-0.38, 0.15, 0.04]} rotation={[0, 0, 0.35]} material={crimsonMaterial}>
              <coneGeometry args={[0.08, 0.24, 4]} />
            </mesh>
            <mesh position={[0.38, 0.15, 0]} rotation={[0, 0, -0.35]} material={darkMetalMaterial}>
              <coneGeometry args={[0.14, 0.36, 4]} />
            </mesh>
            <mesh position={[0.38, 0.15, 0.04]} rotation={[0, 0, -0.35]} material={crimsonMaterial}>
              <coneGeometry args={[0.08, 0.24, 4]} />
            </mesh>
          </group>
        )}

        {config.headAccessory === 'glitch_crown' && (
          <group position={[0, 0.72, 0]}>
            {/* Floating Shard Crystals */}
            {[-0.24, -0.12, 0, 0.12, 0.24].map((x, idx) => (
              <mesh key={idx} position={[x, Math.abs(x) * 0.2, 0.1]} material={neonCyanMaterial}>
                <octahedronGeometry args={[0.065]} />
              </mesh>
            ))}
          </group>
        )}

        {config.headAccessory === 'pirate_eyepatch' && (
          <group position={[-0.18, 0.07, 0.49]}>
            {/* Eye Patch Skull Patch */}
            <mesh material={blackMaterial}>
              <sphereGeometry args={[0.12, 16, 16]} />
            </mesh>
            {/* Diagonal Strap */}
            <mesh position={[0.18, 0.05, -0.1]} rotation={[0.4, 0, -0.3]} material={blackMaterial}>
              <torusGeometry args={[0.54, 0.02, 8, 32]} />
            </mesh>
          </group>
        )}
      </group>

      {/* ================= ARMS & HANDS ================= */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.42, 1.25, 0]}>
        <mesh position={[0, -0.15, 0]} material={outfitPrimaryMaterial}>
          <capsuleGeometry args={[0.11, 0.25, 8, 16]} />
        </mesh>
        <mesh position={[0, -0.38, 0]} material={skinMaterial}>
          <capsuleGeometry args={[0.09, 0.2, 8, 16]} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.42, 1.25, 0]}>
        <mesh position={[0, -0.15, 0]} material={outfitPrimaryMaterial}>
          <capsuleGeometry args={[0.11, 0.25, 8, 16]} />
        </mesh>
        <mesh position={[0, -0.38, 0]} material={skinMaterial}>
          <capsuleGeometry args={[0.09, 0.2, 8, 16]} />
        </mesh>

        {/* Hand Held Prop (attached to right hand) */}
        {config.handItem === 'magic_wand' && (
          <group position={[0, -0.5, 0.1]} rotation={[0.4, 0, 0]}>
            <mesh material={goldMaterial}>
              <cylinderGeometry args={[0.02, 0.02, 0.45, 12]} />
            </mesh>
            <mesh position={[0, 0.24, 0]} material={goldMaterial}>
              <octahedronGeometry args={[0.08]} />
            </mesh>
          </group>
        )}

        {config.handItem === 'teddy_bear' && (
          <group position={[0.12, -0.35, 0.18]} rotation={[0, -0.4, 0.2]}>
            <mesh material={hairMaterial}>
              <sphereGeometry args={[0.14, 16, 16]} />
            </mesh>
            <mesh position={[0, 0.18, 0]} material={hairMaterial}>
              <sphereGeometry args={[0.12, 16, 16]} />
            </mesh>
            <mesh position={[-0.09, 0.28, 0]} material={hairMaterial}>
              <sphereGeometry args={[0.045, 12, 12]} />
            </mesh>
            <mesh position={[0.09, 0.28, 0]} material={hairMaterial}>
              <sphereGeometry args={[0.045, 12, 12]} />
            </mesh>
            <mesh position={[0, 0.16, 0.1]} material={skinMaterial}>
              <sphereGeometry args={[0.04, 12, 12]} />
            </mesh>
          </group>
        )}

        {config.handItem === 'swirl_icecream' && (
          <group position={[0, -0.48, 0.12]} rotation={[0.3, 0, 0]}>
            <mesh rotation={[Math.PI, 0, 0]} material={goldMaterial}>
              <coneGeometry args={[0.08, 0.24, 12]} />
            </mesh>
            <mesh position={[0, 0.14, 0]} material={blushMaterial}>
              <sphereGeometry args={[0.09, 16, 16]} />
            </mesh>
            <mesh position={[0, 0.24, 0]} material={whiteMaterial}>
              <sphereGeometry args={[0.07, 16, 16]} />
            </mesh>
          </group>
        )}

        {config.handItem === 'star_balloon' && (
          <group position={[0, -0.3, 0.1]}>
            <mesh position={[0, 0.45, 0]} material={whiteMaterial}>
              <cylinderGeometry args={[0.006, 0.006, 0.9, 8]} />
            </mesh>
            <mesh position={[0, 1.0, 0]} material={goldMaterial}>
              <octahedronGeometry args={[0.22]} />
            </mesh>
          </group>
        )}

        {config.handItem === 'dark_magic_orb' && (
          <group ref={magicOrbRef} position={[0.08, -0.48, 0.18]}>
            {/* Glowing Dark Violet Core */}
            <mesh material={purpleMaterial}>
              <sphereGeometry args={[0.13, 20, 20]} />
            </mesh>
            {/* Orbiting Shadow Micro-spheres */}
            {[0, 2.1, 4.2].map((angle, idx) => (
              <mesh key={idx} position={[Math.cos(angle) * 0.22, Math.sin(angle) * 0.12, Math.sin(angle) * 0.22]} material={darkMetalMaterial}>
                <sphereGeometry args={[0.04, 10, 10]} />
              </mesh>
            ))}
          </group>
        )}

        {config.handItem === 'cyber_laser_blade' && (
          <group position={[0, -0.48, 0.12]} rotation={[0.4, 0, 0]}>
            {/* Metallic Hilt */}
            <mesh material={darkMetalMaterial}>
              <cylinderGeometry args={[0.03, 0.035, 0.2, 12]} />
            </mesh>
            {/* Neon Cyan Energy Blade */}
            <mesh position={[0, 0.35, 0]} material={neonCyanMaterial}>
              <capsuleGeometry args={[0.025, 0.65, 8, 16]} />
            </mesh>
          </group>
        )}

        {config.handItem === 'poison_potion' && (
          <group position={[0, -0.46, 0.12]}>
            {/* Glass Bottle Body */}
            <mesh material={glassMaterial}>
              <sphereGeometry args={[0.11, 16, 16]} />
            </mesh>
            {/* Bubbling Poison Liquid inside */}
            <mesh material={poisonGreenMaterial}>
              <sphereGeometry args={[0.085, 12, 12]} />
            </mesh>
            {/* Bottle Neck and Cork */}
            <mesh position={[0, 0.11, 0]} material={glassMaterial}>
              <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
            </mesh>
            <mesh position={[0, 0.16, 0]} material={goldMaterial}>
              <cylinderGeometry args={[0.042, 0.036, 0.05, 10]} />
            </mesh>
          </group>
        )}

        {config.handItem === 'dragon_egg' && (
          <group position={[0.08, -0.44, 0.12]}>
            <mesh material={crimsonMaterial}>
              <sphereGeometry args={[0.13, 16, 16]} />
            </mesh>
            {/* Golden Scale Accents */}
            {[
              [0, 0.08, 0.09],
              [-0.07, -0.02, 0.09],
              [0.07, -0.02, 0.09],
            ].map(([x, y, z], idx) => (
              <mesh key={idx} position={[x, y, z]} material={goldMaterial}>
                <octahedronGeometry args={[0.04]} />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* ================= LEGS & FEET ================= */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.18, 0.65, 0]}>
        <mesh position={[0, -0.22, 0]} material={outfitSecondaryMaterial}>
          <capsuleGeometry args={[0.11, 0.35, 8, 16]} />
        </mesh>
        {/* Left Shoe */}
        <group position={[0, -0.48, 0.05]}>
          <mesh material={shoesMaterial} castShadow>
            <boxGeometry args={[0.18, 0.15, 0.32]} />
          </mesh>
          {config.shoes === 'bunny_slippers' && (
            <group position={[0, 0.1, 0.12]}>
              <mesh position={[-0.05, 0.08, 0]} rotation={[0.2, 0, -0.1]} material={whiteMaterial}>
                <capsuleGeometry args={[0.03, 0.12, 6, 12]} />
              </mesh>
              <mesh position={[0.05, 0.08, 0]} rotation={[0.2, 0, 0.1]} material={whiteMaterial}>
                <capsuleGeometry args={[0.03, 0.12, 6, 12]} />
              </mesh>
            </group>
          )}
          {config.shoes === 'roller_skates' && (
            <group position={[0, -0.1, 0]}>
              {[-0.1, 0.1].map((x) =>
                [-0.08, 0.08].map((z) => (
                  <mesh key={`${x}-${z}`} position={[x, 0, z]} rotation={[0, 0, Math.PI / 2]} material={goldMaterial}>
                    <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
                  </mesh>
                ))
              )}
            </group>
          )}
          {config.shoes === 'lightup_sneakers' && (
            <group position={[0, -0.06, 0]}>
              {[-0.1, 0.1].map((x) =>
                [-0.08, 0, 0.08].map((z) => (
                  <mesh key={`led-${x}-${z}`} position={[x, 0, z]} material={neonCyanMaterial}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                  </mesh>
                ))
              )}
            </group>
          )}
          {config.shoes === 'royal_boots' && (
            <mesh position={[0, 0.1, 0]} material={goldMaterial}>
              <cylinderGeometry args={[0.12, 0.11, 0.06, 16]} />
            </mesh>
          )}
          {config.shoes === 'shadow_spikes' && (
            <group position={[0, 0, 0.15]}>
              <mesh material={silverMaterial}>
                <coneGeometry args={[0.04, 0.1, 6]} />
              </mesh>
            </group>
          )}
          {config.shoes === 'cyber_boots' && (
            <group position={[0, -0.04, -0.14]}>
              <mesh material={neonCyanMaterial}>
                <boxGeometry args={[0.16, 0.04, 0.04]} />
              </mesh>
            </group>
          )}
        </group>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.18, 0.65, 0]}>
        <mesh position={[0, -0.22, 0]} material={outfitSecondaryMaterial}>
          <capsuleGeometry args={[0.11, 0.35, 8, 16]} />
        </mesh>
        {/* Right Shoe */}
        <group position={[0, -0.48, 0.05]}>
          <mesh material={shoesMaterial} castShadow>
            <boxGeometry args={[0.18, 0.15, 0.32]} />
          </mesh>
          {config.shoes === 'bunny_slippers' && (
            <group position={[0, 0.1, 0.12]}>
              <mesh position={[-0.05, 0.08, 0]} rotation={[0.2, 0, -0.1]} material={whiteMaterial}>
                <capsuleGeometry args={[0.03, 0.12, 6, 12]} />
              </mesh>
              <mesh position={[0.05, 0.08, 0]} rotation={[0.2, 0, 0.1]} material={whiteMaterial}>
                <capsuleGeometry args={[0.03, 0.12, 6, 12]} />
              </mesh>
            </group>
          )}
          {config.shoes === 'roller_skates' && (
            <group position={[0, -0.1, 0]}>
              {[-0.1, 0.1].map((x) =>
                [-0.08, 0.08].map((z) => (
                  <mesh key={`${x}-${z}`} position={[x, 0, z]} rotation={[0, 0, Math.PI / 2]} material={goldMaterial}>
                    <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
                  </mesh>
                ))
              )}
            </group>
          )}
          {config.shoes === 'lightup_sneakers' && (
            <group position={[0, -0.06, 0]}>
              {[-0.1, 0.1].map((x) =>
                [-0.08, 0, 0.08].map((z) => (
                  <mesh key={`rled-${x}-${z}`} position={[x, 0, z]} material={neonCyanMaterial}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                  </mesh>
                ))
              )}
            </group>
          )}
          {config.shoes === 'royal_boots' && (
            <mesh position={[0, 0.1, 0]} material={goldMaterial}>
              <cylinderGeometry args={[0.12, 0.11, 0.06, 16]} />
            </mesh>
          )}
          {config.shoes === 'shadow_spikes' && (
            <group position={[0, 0, 0.15]}>
              <mesh material={silverMaterial}>
                <coneGeometry args={[0.04, 0.1, 6]} />
              </mesh>
            </group>
          )}
          {config.shoes === 'cyber_boots' && (
            <group position={[0, -0.04, -0.14]}>
              <mesh material={neonCyanMaterial}>
                <boxGeometry args={[0.16, 0.04, 0.04]} />
              </mesh>
            </group>
          )}
        </group>
      </group>

      {/* ================= BACK ITEMS ================= */}
      {config.backItem === 'fairy_wings' && (
        <group ref={wingsRef} position={[0, 1.15, -0.25]}>
          <mesh position={[-0.32, 0.12, 0]} rotation={[0, -0.2, 0.4]} material={blushMaterial}>
            <circleGeometry args={[0.34, 24]} />
          </mesh>
          <mesh position={[0.32, 0.12, 0]} rotation={[0, 0.2, -0.4]} material={blushMaterial}>
            <circleGeometry args={[0.34, 24]} />
          </mesh>
        </group>
      )}

      {config.backItem === 'demon_bat_wings' && (
        <group ref={wingsRef} position={[0, 1.18, -0.25]}>
          {/* Gothic Spiked Bat Wings */}
          <group position={[-0.38, 0.15, 0]} rotation={[0, -0.2, 0.4]}>
            <mesh material={darkMetalMaterial}>
              <circleGeometry args={[0.42, 6, 0, Math.PI]} />
            </mesh>
            <mesh position={[-0.2, 0.2, 0]} material={crimsonMaterial}>
              <coneGeometry args={[0.04, 0.14, 4]} />
            </mesh>
          </group>
          <group position={[0.38, 0.15, 0]} rotation={[0, 0.2, -0.4]}>
            <mesh material={darkMetalMaterial}>
              <circleGeometry args={[0.42, 6, 0, Math.PI]} />
            </mesh>
            <mesh position={[0.2, 0.2, 0]} material={crimsonMaterial}>
              <coneGeometry args={[0.04, 0.14, 4]} />
            </mesh>
          </group>
        </group>
      )}

      {config.backItem === 'shadow_tentacles' && (
        <group position={[0, 1.15, -0.25]}>
          {/* 4 Ethereal Curving Shadow Tentacles */}
          {[
            [-0.25, 0.3, 0.5],
            [0.25, 0.3, -0.5],
            [-0.35, -0.15, 1.1],
            [0.35, -0.15, -1.1],
          ].map(([x, y, rotZ], idx) => (
            <mesh key={idx} position={[x, y, -0.1]} rotation={[0.4, 0, rotZ]} material={purpleMaterial}>
              <capsuleGeometry args={[0.05, 0.45, 6, 12]} />
            </mesh>
          ))}
        </group>
      )}

      {config.backItem === 'cyber_thrusters' && (
        <group position={[0, 1.15, -0.28]}>
          {/* Dual Sci-Fi Turbine Units */}
          {[-0.18, 0.18].map((x, idx) => (
            <group key={idx} position={[x, 0, 0]}>
              <mesh material={darkMetalMaterial}>
                <cylinderGeometry args={[0.09, 0.08, 0.38, 16]} />
              </mesh>
              {/* Cyan Exhaust Glow */}
              <mesh position={[0, -0.22, 0]} material={neonCyanMaterial}>
                <coneGeometry args={[0.08, 0.18, 12]} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {config.backItem === 'dark_scythe_holster' && (
        <group position={[0, 1.15, -0.28]} rotation={[0, 0, -0.65]}>
          {/* Scythe Shaft */}
          <mesh material={darkMetalMaterial}>
            <cylinderGeometry args={[0.025, 0.025, 0.95, 12]} />
          </mesh>
          {/* Curved Scythe Blade */}
          <mesh position={[0.18, 0.42, 0]} rotation={[0, 0, 0.8]} material={silverMaterial}>
            <coneGeometry args={[0.08, 0.45, 4]} />
          </mesh>
        </group>
      )}

      {config.backItem === 'rocket_jetpack' && (
        <group position={[0, 1.1, -0.3]}>
          <mesh position={[-0.15, 0, 0]} material={whiteMaterial}>
            <cylinderGeometry args={[0.09, 0.09, 0.45, 16]} />
          </mesh>
          <mesh position={[-0.15, 0.26, 0]} material={outfitPrimaryMaterial}>
            <coneGeometry args={[0.09, 0.18, 16]} />
          </mesh>
          <mesh position={[0.15, 0, 0]} material={whiteMaterial}>
            <cylinderGeometry args={[0.09, 0.09, 0.45, 16]} />
          </mesh>
          <mesh position={[0.15, 0.26, 0]} material={outfitPrimaryMaterial}>
            <coneGeometry args={[0.09, 0.18, 16]} />
          </mesh>
          <mesh position={[-0.15, -0.32, 0]} rotation={[Math.PI, 0, 0]} material={goldMaterial}>
            <coneGeometry args={[0.07, 0.2, 12]} />
          </mesh>
          <mesh position={[0.15, -0.32, 0]} rotation={[Math.PI, 0, 0]} material={goldMaterial}>
            <coneGeometry args={[0.07, 0.2, 12]} />
          </mesh>
        </group>
      )}

      {config.backItem === 'school_backpack' && (
        <group position={[0, 1.05, -0.28]}>
          <mesh material={outfitPrimaryMaterial} castShadow>
            <boxGeometry args={[0.38, 0.42, 0.18]} />
          </mesh>
          <mesh position={[0, 0.26, 0]} rotation={[0, 0, Math.PI / 2]} material={outfitSecondaryMaterial}>
            <cylinderGeometry args={[0.09, 0.09, 0.38, 16]} />
          </mesh>
        </group>
      )}

      {config.backItem === 'hero_cape' && (
        <group ref={capeRef} position={[0, 1.35, -0.24]}>
          <mesh material={outfitPrimaryMaterial} castShadow>
            <boxGeometry args={[0.55, 0.85, 0.03]} />
          </mesh>
        </group>
      )}
    </group>
  );
};
