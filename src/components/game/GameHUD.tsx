import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Modal,
} from 'react-native';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audio';
import { AppIcon } from '../ui/AppIcon';

interface GameHUDProps {
  score: number;
  totalStars: number;
  joy: number;
  timeOfDay: 'day' | 'sunset' | 'night';
  onTimeOfDayChange: (time: 'day' | 'sunset' | 'night') => void;
  onExitToStudio: () => void;
  onJump: () => void;
  onToggleSprint: (active: boolean) => void;
  isSprinting: boolean;
  onEmote: (type: 'dance' | 'cheer' | 'wave') => void;
  onInteract: () => void;
  interactLabel: string | null;
  onJoystickMove: (x: number, y: number) => void;
  playerPosition: [number, number, number];
  uncollectedStarPositions: [number, number, number][];
  activeMessage: string | null;
}

const JOYSTICK_RADIUS = 50;

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  totalStars,
  joy,
  timeOfDay,
  onTimeOfDayChange,
  onExitToStudio,
  onJump,
  onToggleSprint,
  isSprinting,
  onEmote,
  onInteract,
  interactLabel,
  onJoystickMove,
  playerPosition,
  uncollectedStarPositions,
  activeMessage,
}) => {
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [soundOn, setSoundOn] = useState(soundEngine.isEnabled());
  const [showRadar, setShowRadar] = useState(true);
  const [dismissedVictory, setDismissedVictory] = useState(false);

  const showVictoryModal = score === totalStars && totalStars > 0 && !dismissedVictory;

  // Trigger audio & confetti if all stars collected
  useEffect(() => {
    if (score === totalStars && totalStars > 0) {
      soundEngine.playVictory();
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#FBBF24', '#F472B6', '#38BDF8', '#4ADE80', '#A855F7'],
        });
      } catch {}
    }
  }, [score, totalStars]);

  // PanResponder for Virtual Touch Joystick
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          soundEngine.playStep();
        },
        onPanResponderMove: (_, gestureState) => {
          const { dx, dy } = gestureState;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxRadius = JOYSTICK_RADIUS;

          let normalizedX = dx;
          let normalizedY = dy;

          if (dist > maxRadius) {
            normalizedX = (dx / dist) * maxRadius;
            normalizedY = (dy / dist) * maxRadius;
          }

          setKnobPos({ x: normalizedX, y: normalizedY });

          // Normalize to -1.0 to 1.0
          onJoystickMove(normalizedX / maxRadius, normalizedY / maxRadius);
        },
        onPanResponderRelease: () => {
          setKnobPos({ x: 0, y: 0 });
          onJoystickMove(0, 0);
        },
      }),
    [onJoystickMove]
  );

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundEngine.setEnabled(next);
    if (next) soundEngine.playPop(520);
  };

  const cycleTimeOfDay = () => {
    soundEngine.playPop(600);
    if (timeOfDay === 'day') onTimeOfDayChange('sunset');
    else if (timeOfDay === 'sunset') onTimeOfDayChange('night');
    else onTimeOfDayChange('day');
  };

  return (
    <View style={styles.hudOverlay} pointerEvents="box-none">
      {/* ================= TOP STATUS BAR ================= */}
      <View style={styles.topBar}>
        {/* Exit Button */}
        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => {
            soundEngine.playPop(480);
            onExitToStudio();
          }}
          activeOpacity={0.8}
        >
          <AppIcon name="color-palette-outline" size={18} color="#4F46E5" />
          <Text style={styles.exitText}>Studio</Text>
        </TouchableOpacity>

        {/* Quest & Joy Badges */}
        <View style={styles.statsCenter}>
          <View style={styles.statPill}>
            <AppIcon name="star" size={15} color="#F59E0B" />
            <Text style={styles.statText}>
              {score}/{totalStars}
            </Text>
          </View>

          <View style={styles.statPill}>
            <AppIcon name="heart" size={15} color="#EC4899" />
            <Text style={styles.statText}>{joy}%</Text>
          </View>
        </View>

        {/* Right Action Icons */}
        <View style={styles.topRightActions}>
          {/* Time of Day Button */}
          <TouchableOpacity
            style={styles.topIconButton}
            onPress={cycleTimeOfDay}
            activeOpacity={0.7}
          >
            <AppIcon
              name={timeOfDay === 'day' ? 'sunny' : timeOfDay === 'sunset' ? 'partly-sunny' : 'moon'}
              size={18}
              color="#D97706"
            />
          </TouchableOpacity>

          {/* Sound Toggle */}
          <TouchableOpacity
            style={[styles.topIconButton, !soundOn && styles.topIconDisabled]}
            onPress={toggleSound}
            activeOpacity={0.7}
          >
            <AppIcon
              name={soundOn ? 'volume-high' : 'volume-mute'}
              size={18}
              color={soundOn ? '#10B981' : '#94A3B8'}
            />
          </TouchableOpacity>

          {/* Radar Toggle */}
          <TouchableOpacity
            style={styles.topIconButton}
            onPress={() => setShowRadar(r => !r)}
            activeOpacity={0.7}
          >
            <AppIcon name="map-outline" size={18} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ================= INTERACTION MESSAGE BANNER ================= */}
      {activeMessage && (
        <View style={styles.messageBanner}>
          <Text style={styles.messageText}>{activeMessage}</Text>
        </View>
      )}

      {/* ================= MINI RADAR / MAP ================= */}
      {showRadar && (
        <View style={styles.radarCard}>
          <View style={styles.radarFrame}>
            {/* House Mark */}
            <View
              style={[
                styles.radarHouse,
                {
                  left: 35 + (0 / 25) * 28,
                  top: 35 + (-14 / 25) * 28,
                },
              ]}
            >
              <AppIcon name="home" size={12} color="#4F46E5" />
            </View>

            {/* Stars Marks */}
            {uncollectedStarPositions.map(([sx, , sz], idx) => {
              const rx = Math.max(4, Math.min(66, 35 + (sx / 25) * 28));
              const ry = Math.max(4, Math.min(66, 35 + (sz / 25) * 28));
              return (
                <View key={idx} style={[styles.radarStar, { left: rx, top: ry }]} />
              );
            })}

            {/* Player Marker in Center/Relative */}
            <View
              style={[
                styles.radarPlayer,
                {
                  left: Math.max(4, Math.min(66, 35 + (playerPosition[0] / 25) * 28)),
                  top: Math.max(4, Math.min(66, 35 + (playerPosition[2] / 25) * 28)),
                },
              ]}
            >
              <View style={styles.playerDot} />
            </View>
          </View>
          <Text style={styles.radarLabel}>Neighborhood Radar</Text>
        </View>
      )}

      {/* ================= BOTTOM CONTROLS ================= */}
      <View style={styles.bottomControls} pointerEvents="box-none">
        {/* Left: Virtual Touch Joystick */}
        <View style={styles.joystickContainer} pointerEvents="auto" {...panResponder.panHandlers}>
          <View style={styles.joystickBase}>
            <View
              style={[
                styles.joystickKnob,
                {
                  transform: [
                    { translateX: knobPos.x },
                    { translateY: knobPos.y },
                  ],
                },
              ]}
            >
              <AppIcon name="navigate" size={22} color="#6366F1" />
            </View>
          </View>
          <Text style={styles.joystickHint}>Drag to Run / Walk</Text>
        </View>

        {/* Right: Action Buttons Group */}
        <View style={styles.actionButtonsContainer} pointerEvents="box-none">
          {/* Top Row: Emote & Sprint */}
          <View style={styles.actionSubRow} pointerEvents="box-none">
            {/* Emote Button */}
            <TouchableOpacity
              style={styles.emoteButton}
              onPress={() => {
                soundEngine.playBoing();
                onEmote('dance');
              }}
              activeOpacity={0.7}
            >
              <AppIcon name="musical-notes" size={18} color="#8B5CF6" />
              <Text style={styles.buttonSubText}>Dance</Text>
            </TouchableOpacity>

            {/* Sprint Toggle Button */}
            <TouchableOpacity
              style={[styles.sprintButton, isSprinting && styles.sprintButtonActive]}
              onPress={() => {
                soundEngine.playPop(550);
                onToggleSprint(!isSprinting);
              }}
              activeOpacity={0.7}
            >
              <AppIcon name="flash" size={18} color={isSprinting ? '#D97706' : '#64748B'} />
              <Text style={styles.buttonSubText}>{isSprinting ? 'Fast!' : 'Run'}</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Row: Context Interact + Big Jump Button */}
          <View style={styles.actionMainRow} pointerEvents="box-none">
            {/* Contextual Interact Button (appears when near something) */}
            {interactLabel ? (
              <TouchableOpacity
                style={styles.interactButton}
                onPress={() => {
                  soundEngine.playVictory();
                  onInteract();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.interactText}>{interactLabel}</Text>
              </TouchableOpacity>
            ) : null}

            {/* Jump Button */}
            <TouchableOpacity
              style={styles.jumpButton}
              onPress={() => {
                soundEngine.playJump();
                onJump();
              }}
              activeOpacity={0.75}
            >
              <AppIcon name="arrow-up" size={22} color="#FFFFFF" />
              <Text style={styles.jumpText}>JUMP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ================= DESKTOP KEYBOARD HINT ================= */}
      <View style={styles.desktopControlsHint}>
        <AppIcon name="hardware-chip-outline" size={13} color="#64748B" />
        <Text style={styles.desktopControlsText}>
          WASD/Arrows: Move • Space: Jump • Shift: Sprint • E: Interact • 1: Dance
        </Text>
      </View>

      {/* ================= VICTORY MODAL ================= */}
      <Modal visible={showVictoryModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.victoryCard}>
            <AppIcon name="trophy" size={56} color="#F59E0B" />
            <Text style={styles.victoryTitle}>Sunshine Hero Trophy!</Text>
            <Text style={styles.victorySubtitle}>
              You collected all {totalStars} Golden Stars and made friends across the entire neighborhood!
            </Text>

            <TouchableOpacity
              style={styles.victoryButton}
              onPress={() => setDismissedVictory(true)}
            >
              <AppIcon name="sparkles" size={16} color="#FFFFFF" />
              <Text style={styles.victoryButtonText}>Keep Playing!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  hudOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 16,
    zIndex: 20,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFFEE',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 24,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  exitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },
  statsCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFFEE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  statText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFFEE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  topIconDisabled: {
    opacity: 0.6,
  },
  messageBanner: {
    alignSelf: 'center',
    backgroundColor: '#1E293BEE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 8,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  radarCard: {
    position: 'absolute',
    top: 106,
    right: 16,
    backgroundColor: '#FFFFFFEE',
    padding: 8,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 15,
  },
  radarFrame: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#E0F2FE',
    borderWidth: 2,
    borderColor: '#7DD3FC',
    position: 'relative',
    overflow: 'hidden',
  },
  radarHouse: {
    position: 'absolute',
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarStar: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  radarPlayer: {
    position: 'absolute',
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EC4899',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  radarLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 4,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 40,
    zIndex: 20,
  },
  joystickContainer: {
    alignItems: 'center',
    gap: 8,
  },
  joystickBase: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joystickKnob: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  joystickHint: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionButtonsContainer: {
    alignItems: 'flex-end',
    gap: 12,
  },
  actionSubRow: {
    flexDirection: 'row',
    gap: 12,
  },
  emoteButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFFEE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  sprintButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFFEE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  sprintButtonActive: {
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  buttonSubText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
    marginTop: 1,
  },
  actionMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  interactButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 28,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  interactText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  jumpButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  jumpText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  desktopControlsHint: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 6,
  },
  desktopControlsText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  victoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    maxWidth: 360,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  victoryTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  victorySubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  victoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  victoryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
