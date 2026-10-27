import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PoseType } from '../../types/character';
import { soundEngine } from '../../utils/audio';

interface PoseSelectorProps {
  currentPose: PoseType;
  onSelectPose: (pose: PoseType) => void;
  onResetCamera: () => void;
}

const POSES: { id: PoseType; label: string; icon: string }[] = [
  { id: 'idle', label: 'Breathe', icon: '🧍' },
  { id: 'wave', label: 'Wave', icon: '🖐️' },
  { id: 'dance', label: 'Dance', icon: '💃' },
  { id: 'cheer', label: 'Cheer', icon: '🎉' },
  { id: 'sparkle', label: 'Float', icon: '✨' },
];

export const PoseSelector: React.FC<PoseSelectorProps> = ({
  currentPose,
  onSelectPose,
  onResetCamera,
}) => {
  const handlePose = (pose: PoseType) => {
    soundEngine.playBoing();
    onSelectPose(pose);
  };

  const handleResetCam = () => {
    soundEngine.playPop(500);
    onResetCamera();
  };

  return (
    <View style={styles.floatingContainer}>
      <View style={styles.pillBar}>
        {POSES.map((p) => {
          const isActive = currentPose === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.poseBtn,
                isActive && styles.poseBtnActive,
              ]}
              onPress={() => handlePose(p.id)}
              activeOpacity={0.75}
            >
              <Text style={styles.poseIcon}>{p.icon}</Text>
              <Text style={[styles.poseText, isActive && styles.poseTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.camBtn}
          onPress={handleResetCam}
          activeOpacity={0.75}
        >
          <Text style={styles.camIcon}>🔄</Text>
          <Text style={styles.camText}>Front</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    zIndex: 5,
  },
  pillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    gap: 4,
  },
  poseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 4,
  },
  poseBtnActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#6366F1',
  },
  poseIcon: {
    fontSize: 15,
  },
  poseText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  poseTextActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 2,
  },
  camBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    gap: 4,
  },
  camIcon: {
    fontSize: 13,
  },
  camText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
});
