import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { CharacterConfig, PoseType } from '../../types/character';
import { AvatarModel } from '../character3d/AvatarModel';
import { TownEnvironment } from './TownEnvironment';
import { GamePets } from './GamePets';
import { Collectibles, GAME_STARS } from './Collectibles';
import { GameHUD } from './GameHUD';
import { useKeyboardControls } from './useKeyboardControls';
import { soundEngine } from '../../utils/audio';

interface GameWorldProps {
  character: CharacterConfig;
  onExit: () => void;
}

// Sub-component that runs inside the Three.js Canvas loop
function PlayerAndWorldScene({
  character,
  timeOfDay,
  collectedStarIds,
  onCollectStar,
  isPuppyExcited,
  onPuppyNear,
  onCatNear,
  joystickInput,
  isSprinting,
  jumpTrigger,
  emoteTrigger,
  camOrbitAngle,
  onUpdatePlayerPos,
}: {
  character: CharacterConfig;
  timeOfDay: 'day' | 'sunset' | 'night';
  collectedStarIds: number[];
  onCollectStar: (id: number) => void;
  isPuppyExcited: boolean;
  onPuppyNear: (near: boolean) => void;
  onCatNear: (near: boolean) => void;
  joystickInput: { x: number; y: number };
  isSprinting: boolean;
  jumpTrigger: number;
  emoteTrigger: { type: PoseType; count: number };
  camOrbitAngle: number;
  onUpdatePlayerPos: (pos: [number, number, number]) => void;
}) {
  const playerGroupRef = useRef<THREE.Group>(null);
  const keys = useKeyboardControls();

  // Physics state
  const posRef = useRef<[number, number, number]>([0, 0, 0]);
  const velYRef = useRef<number>(0);
  const rotationYRef = useRef<number>(0);
  const [currentPose, setCurrentPose] = useState<PoseType>('idle');

  // Handle jump triggers
  const lastJumpTriggerRef = useRef(jumpTrigger);
  useEffect(() => {
    if (jumpTrigger !== lastJumpTriggerRef.current) {
      lastJumpTriggerRef.current = jumpTrigger;
      // Only jump if on or near ground
      if (posRef.current[1] <= 0.15) {
        velYRef.current = 8.5;
      }
    }
  }, [jumpTrigger]);

  // Handle keyboard jump
  const prevKeyJumpRef = useRef(keys.jump);
  useEffect(() => {
    if (keys.jump && !prevKeyJumpRef.current) {
      if (posRef.current[1] <= 0.15) {
        soundEngine.playJump();
        velYRef.current = 8.5;
      }
    }
    prevKeyJumpRef.current = keys.jump;
  }, [keys.jump]);

  // Handle action emote triggers
  const emoteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEmoteCountRef = useRef(emoteTrigger.count);
  useEffect(() => {
    if (emoteTrigger.count !== lastEmoteCountRef.current) {
      lastEmoteCountRef.current = emoteTrigger.count;
      setCurrentPose(emoteTrigger.type);
      if (emoteTimeoutRef.current) clearTimeout(emoteTimeoutRef.current);
      emoteTimeoutRef.current = setTimeout(() => {
        setCurrentPose('idle');
      }, 3500);
    }
  }, [emoteTrigger]);

  // Main 60FPS Game Physics & Camera Loop
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1); // Clamp to avoid tunneling on lag spikes

    // 1. Calculate Combined Input
    let inputX = joystickInput.x;
    let inputZ = joystickInput.y;

    if (keys.left) inputX -= 1;
    if (keys.right) inputX += 1;
    if (keys.forward) inputZ -= 1;
    if (keys.backward) inputZ += 1;

    // Clamp input vector length to 1.0
    const inputMagnitude = Math.sqrt(inputX * inputX + inputZ * inputZ);
    if (inputMagnitude > 1.0) {
      inputX /= inputMagnitude;
      inputZ /= inputMagnitude;
    }

    const isMoving = inputMagnitude > 0.05;
    const effectiveSprint = isSprinting || keys.sprint;
    const moveSpeed = effectiveSprint ? 7.5 : 4.2;

    // Camera relative direction: align movement relative to camera orbit
    const forwardX = -Math.sin(camOrbitAngle);
    const forwardZ = -Math.cos(camOrbitAngle);
    const rightX = Math.cos(camOrbitAngle);
    const rightZ = -Math.sin(camOrbitAngle);

    const worldMoveX = rightX * inputX + forwardX * (-inputZ);
    const worldMoveZ = rightZ * inputX + forwardZ * (-inputZ);

    // Apply horizontal translation
    posRef.current[0] += worldMoveX * moveSpeed * dt;
    posRef.current[2] += worldMoveZ * moveSpeed * dt;

    // Clamp inside town fences
    posRef.current[0] = Math.max(-20.5, Math.min(20.5, posRef.current[0]));
    posRef.current[2] = Math.max(-20.5, Math.min(20.5, posRef.current[2]));

    // 2. Vertical Physics & Trampoline
    const gravity = 22.0;
    velYRef.current -= gravity * dt;
    posRef.current[1] += velYRef.current * dt;

    // Check Trampoline Collision: center [8, 0, -4], radius 1.95
    const dxTramp = posRef.current[0] - 8.0;
    const dzTramp = posRef.current[2] - (-4.0);
    const distToTramp = Math.sqrt(dxTramp * dxTramp + dzTramp * dzTramp);

    if (distToTramp < 1.95 && posRef.current[1] <= 0.75 && velYRef.current <= 0) {
      // High Trampoline Bounce!
      velYRef.current = 15.5;
      soundEngine.playTrampoline();
    }

    // Ground & Bridge Clamping
    let groundHeight = 0;
    // Check if on wooden bridge: [-10, 0.35, -8], radius ~2.2
    const dxBridge = posRef.current[0] - (-10);
    const dzBridge = posRef.current[2] - (-8);
    if (Math.sqrt(dxBridge * dxBridge + dzBridge * dzBridge) < 2.3) {
      groundHeight = 0.35;
    }

    if (posRef.current[1] <= groundHeight) {
      posRef.current[1] = groundHeight;
      velYRef.current = 0;
    }

    // 3. Rotation to face movement direction
    if (isMoving) {
      const targetAngle = Math.atan2(worldMoveX, worldMoveZ);
      // Smooth angular interpolation
      let angleDiff = targetAngle - rotationYRef.current;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      rotationYRef.current += angleDiff * 14 * dt;
    }

    // Update Player 3D Mesh Transform
    if (playerGroupRef.current) {
      playerGroupRef.current.position.set(posRef.current[0], posRef.current[1], posRef.current[2]);
      playerGroupRef.current.rotation.y = rotationYRef.current;
    }

    // 4. Locomotion Pose Determination
    if (posRef.current[1] > 0.18) {
      setCurrentPose('jump');
    } else if (isMoving) {
      setCurrentPose(effectiveSprint ? 'run' : 'walk');
    } else {
      // Return to idle if not playing a dance/cheer emote
      if (['walk', 'run', 'jump'].includes(currentPose)) {
        setCurrentPose('idle');
      }
    }

    // 5. Smooth Third-Person Camera Follow
    const camDist = 6.8;
    const camHeight = 3.6;
    const targetCamX = posRef.current[0] + Math.sin(camOrbitAngle) * camDist;
    const targetCamZ = posRef.current[2] + Math.cos(camOrbitAngle) * camDist;
    const targetCamY = posRef.current[1] + camHeight;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX, 0.08);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, 0.08);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, 0.08);

    state.camera.lookAt(posRef.current[0], posRef.current[1] + 1.15, posRef.current[2]);

    // Send updated position to HUD for radar
    onUpdatePlayerPos([posRef.current[0], posRef.current[1], posRef.current[2]]);
  });

  return (
    <>
      {/* Dynamic Sunlight / Moonlight */}
      {timeOfDay === 'day' && (
        <>
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[16, 24, 16]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={60}
            shadow-camera-left={-25}
            shadow-camera-right={25}
            shadow-camera-top={25}
            shadow-camera-bottom={-25}
          />
          <hemisphereLight groundColor="#68D391" color="#BAE6FD" intensity={0.5} />
        </>
      )}

      {timeOfDay === 'sunset' && (
        <>
          <ambientLight intensity={0.5} color="#FED7AA" />
          <directionalLight
            position={[24, 12, 10]}
            intensity={1.5}
            color="#FB923C"
            castShadow
          />
          <hemisphereLight groundColor="#78350F" color="#FDBA74" intensity={0.6} />
        </>
      )}

      {timeOfDay === 'night' && (
        <>
          <ambientLight intensity={0.25} color="#1E293B" />
          <directionalLight
            position={[-12, 18, -12]}
            intensity={0.4}
            color="#93C5FD"
            castShadow
          />
          <hemisphereLight groundColor="#0F172A" color="#334155" intensity={0.3} />
        </>
      )}

      {/* Town Environment Meshes */}
      <TownEnvironment timeOfDay={timeOfDay} />

      {/* Playable Custom Character */}
      <group ref={playerGroupRef} position={[0, 0, 0]}>
        <AvatarModel config={character} pose={currentPose} />
      </group>

      {/* Interactive Pets */}
      <GamePets
        playerRef={playerGroupRef}
        isPuppyExcited={isPuppyExcited}
        onPuppyNear={onPuppyNear}
        onCatNear={onCatNear}
      />

      {/* 12 Collectible Stars */}
      <Collectibles
        collectedIds={collectedStarIds}
        playerRef={playerGroupRef}
        onCollect={onCollectStar}
      />
    </>
  );
}

export const GameWorld: React.FC<GameWorldProps> = ({ character, onExit }) => {
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const [collectedStarIds, setCollectedStarIds] = useState<number[]>([]);
  const [joy, setJoy] = useState(60);
  const [isSprinting, setIsSprinting] = useState(false);
  const [jumpTrigger, setJumpTrigger] = useState(0);
  const [emoteTrigger, setEmoteTrigger] = useState<{ type: PoseType; count: number }>({
    type: 'idle',
    count: 0,
  });

  const [joystickInput, setJoystickInput] = useState({ x: 0, y: 0 });
  const [camOrbitAngle, setCamOrbitAngle] = useState(0);

  const [isPuppyNear, setIsPuppyNear] = useState(false);
  const [isPuppyExcited, setIsPuppyExcited] = useState(false);
  const [isCatNear, setIsCatNear] = useState(false);
  const [activeMessage, setActiveMessage] = useState<string | null>(
    'Welcome to Sunshine Town! Explore & collect Golden Stars! ⭐'
  );

  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 0]);

  // Temporary message dismissal
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showMessage = useCallback((msg: string, durationMs: number = 3200) => {
    setActiveMessage(msg);
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    messageTimerRef.current = setTimeout(() => {
      setActiveMessage(null);
    }, durationMs);
  }, []);

  // Collect Star handler
  const handleCollectStar = useCallback(
    (id: number) => {
      soundEngine.playCollectStar();
      setCollectedStarIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        const star = GAME_STARS.find((s) => s.id === id);
        showMessage(`⭐ Got ${star?.name || 'Golden Star'}! (${next.length}/${GAME_STARS.length})`);
        setJoy((j) => Math.min(100, j + 8));
        return next;
      });
    },
    [showMessage]
  );

  // Pan gesture for touch-to-rotate camera angle
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
        onPanResponderMove: (_, gesture) => {
          setCamOrbitAngle((prev) => prev - gesture.dx * 0.003);
        },
      }),
    []
  );

  // Compute contextual interact button text
  let interactLabel: string | null = null;
  if (isPuppyNear) {
    interactLabel = '🐾 Pet Barnaby!';
  } else if (isCatNear) {
    interactLabel = '🐱 Pet Mochi!';
  }

  // Handle interaction button press
  const handleInteract = () => {
    if (isPuppyNear) {
      soundEngine.playPetBark();
      setIsPuppyExcited(true);
      setJoy((j) => Math.min(100, j + 15));
      showMessage('Barnaby does a backflip! He loves you so much! 🐶❤️');
      setTimeout(() => setIsPuppyExcited(false), 2500);
    } else if (isCatNear) {
      soundEngine.playChime();
      setJoy((j) => Math.min(100, j + 10));
      showMessage('Mochi purrs warmly in the sunshine! 🐱✨');
    }
  };

  // Sky background color
  const skyBgColor =
    timeOfDay === 'night' ? '#090D16' : timeOfDay === 'sunset' ? '#F97316' : '#7DD3FC';

  // Compute uncollected star coordinates for mini radar
  const uncollectedStarPositions = GAME_STARS.filter(
    (s) => !collectedStarIds.includes(s.id)
  ).map((s) => s.position);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* 3D Game Canvas */}
      <Canvas
        shadows
        style={{ flex: 1, width: '100%', height: '100%', backgroundColor: skyBgColor }}
        camera={{ position: [0, 4, 7], fov: 46 }}
      >
        <PlayerAndWorldScene
          character={character}
          timeOfDay={timeOfDay}
          collectedStarIds={collectedStarIds}
          onCollectStar={handleCollectStar}
          isPuppyExcited={isPuppyExcited}
          onPuppyNear={setIsPuppyNear}
          onCatNear={setIsCatNear}
          joystickInput={joystickInput}
          isSprinting={isSprinting}
          jumpTrigger={jumpTrigger}
          emoteTrigger={emoteTrigger}
          camOrbitAngle={camOrbitAngle}
          onUpdatePlayerPos={setPlayerPosition}
        />
      </Canvas>

      {/* Game HUD Overlay (Controls, Radar, Objectives) */}
      <GameHUD
        score={collectedStarIds.length}
        totalStars={GAME_STARS.length}
        joy={joy}
        timeOfDay={timeOfDay}
        onTimeOfDayChange={setTimeOfDay}
        onExitToStudio={onExit}
        onJump={() => setJumpTrigger((n) => n + 1)}
        onToggleSprint={setIsSprinting}
        isSprinting={isSprinting}
        onEmote={(type) =>
          setEmoteTrigger((prev) => ({ type, count: prev.count + 1 }))
        }
        onInteract={handleInteract}
        interactLabel={interactLabel}
        onJoystickMove={(x, y) => setJoystickInput({ x, y })}
        playerPosition={playerPosition}
        uncollectedStarPositions={uncollectedStarPositions}
        activeMessage={activeMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
