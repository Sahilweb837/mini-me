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
          <Text style={styles.exitIcon}>🎨</Text>
          <Text style={styles.exitText}>Studio</Text>
        </TouchableOpacity>

        {/* Quest & Joy Badges */}
        <View style={styles.statsCenter}>
          <View style={styles.statPill}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statText}>
              {score}/{totalStars}
            </Text>
          </View>

          <View style={styles.statPill}>
            <Text style={styles.statEmoji}>💖</Text>
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
            <Text style={styles.topIconEmoji}>
              {timeOfDay === 'day' ? '☀️' : timeOfDay === 'sunset' ? '🌅' : '🌙'}
            </Text>
          </TouchableOpacity>

          {/* Sound Toggle */}
          <TouchableOpacity
            style={[styles.topIconButton, !soundOn && styles.topIconDisabled]}
            onPress={toggleSound}
            activeOpacity={0.7}
          >
            <Text style={styles.topIconEmoji}>{soundOn ? '🔊' : '🔇'}</Text>
          </TouchableOpacity>

          {/* Radar Toggle */}
          <TouchableOpacity
            style={styles.topIconButton}
            onPress={() => setShowRadar(r => !r)}
            activeOpacity={0.7}
          >
            <Text style={styles.topIconEmoji}>🗺️</Text>
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
              <Text style={styles.radarIcon}>🏠</Text>
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
              <Text style={styles.knobHand}>👟</Text>
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
              <Text style={styles.buttonEmoji}>💃</Text>
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
              <Text style={styles.buttonEmoji}>⚡</Text>
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
              <Text style={styles.jumpEmoji}>🦘</Text>
              <Text style={styles.jumpText}>JUMP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ================= DESKTOP KEYBOARD HINT ================= */}
      <View style={styles.desktopControlsHint}>
        <Text style={styles.desktopControlsText}>
          ⌨️ PC Keys: WASD/Arrows: Move • Space: Jump • Shift: Sprint • E: Interact • 1: Dance
        </Text>
      </View>

      {/* ================= VICTORY MODAL ================= */}
      <Modal visible={showVictoryModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.victoryCard}>
            <Text style={styles.trophyEmoji}>🏆</Text>
            <Text style={styles.victoryTitle}>Sunshine Hero Trophy!</Text>
            <Text style={styles.victorySubtitle}>
              You collected all {totalStars} Golden Stars and made friends across the entire neighborhood!
            </Text>

            <TouchableOpacity
              style={styles.victoryButton}
              onPress={() => setDismissedVictory(true)}
            >
              <Text style={styles.victoryButtonText}>Keep Playing! 🎈</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  exitIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  exitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  statsCenter: {
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFFEE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  statEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  topRightActions: {
    flexDirection: 'row',
    gap: 6,
  },
  topIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFFEE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  topIconDisabled: {
    opacity: 0.5,
  },
  topIconEmoji: {
    fontSize: 18,
  },
  messageBanner: {
    alignSelf: 'center',
    marginTop: 12,
    backgroundColor: '#0F172ACC',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#38BDF888',
  },
  messageText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  radarCard: {
    position: 'absolute',
    top: 100,
    right: 16,
    backgroundColor: '#FFFFFFDD',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  radarFrame: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: '#94A3B8',
    position: 'relative',
    overflow: 'hidden',
  },
  radarHouse: {
    position: 'absolute',
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  radarIcon: {
    fontSize: 12,
  },
  radarStar: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
    transform: [{ translateX: -3 }, { translateY: -3 }],
  },
  radarPlayer: {
    position: 'absolute',
    transform: [{ translateX: -5 }, { translateY: -5 }],
  },
  playerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  radarLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
    marginTop: 4,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  joystickContainer: {
    alignItems: 'center',
  },
  joystickBase: {
    width: JOYSTICK_RADIUS * 2,
    height: JOYSTICK_RADIUS * 2,
    borderRadius: JOYSTICK_RADIUS,
    backgroundColor: '#FFFFFFCC',
    borderWidth: 3,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  joystickKnob: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0284C7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  knobHand: {
    fontSize: 20,
  },
  joystickHint: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    backgroundColor: '#FFFFFFEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
  },
  actionButtonsContainer: {
    alignItems: 'flex-end',
    gap: 12,
  },
  actionSubRow: {
    flexDirection: 'row',
    gap: 10,
  },
  emoteButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFFEE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  sprintButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFFEE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  sprintButtonActive: {
    backgroundColor: '#FBBF24',
    borderWidth: 2,
    borderColor: '#D97706',
  },
  buttonEmoji: {
    fontSize: 20,
  },
  buttonSubText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#334155',
    marginTop: 1,
  },
  actionMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  interactButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#6EE7B7',
  },
  interactText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  jumpButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#3B82F6',
    borderWidth: 3,
    borderColor: '#93C5FD',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  jumpEmoji: {
    fontSize: 26,
  },
  jumpText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    marginTop: 1,
  },
  desktopControlsHint: {
    alignSelf: 'center',
    backgroundColor: '#0F172ACC',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  desktopControlsText: {
    fontSize: 11,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  victoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    maxWidth: 360,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  trophyEmoji: {
    fontSize: 54,
    marginBottom: 12,
  },
  victoryTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  victorySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  victoryButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  victoryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
});
