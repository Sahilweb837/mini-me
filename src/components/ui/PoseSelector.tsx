import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PoseType } from '../../types/character';
import { soundEngine } from '../../utils/audio';
import { AppIcon } from './AppIcon';

interface PoseSelectorProps {
  currentPose: PoseType;
  onSelectPose: (pose: PoseType) => void;
  onResetCamera: () => void;
}

const POSES: { id: PoseType; label: string; iconName: string; iconColor: string }[] = [
  { id: 'idle', label: 'Breathe', iconName: 'body', iconColor: '#6366F1' },
  { id: 'wave', label: 'Wave', iconName: 'hand-left', iconColor: '#EC4899' },
  { id: 'dance', label: 'Dance', iconName: 'musical-notes', iconColor: '#8B5CF6' },
  { id: 'cheer', label: 'Cheer', iconName: 'trophy', iconColor: '#F59E0B' },
  { id: 'sparkle', label: 'Float', iconName: 'sparkles', iconColor: '#10B981' },
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
              <AppIcon
                name={p.iconName}
                family="Ionicons"
                size={14}
                color={isActive ? p.iconColor : '#94A3B8'}
              />
              <Text style={[styles.poseText, isActive && { color: p.iconColor, fontWeight: '800' }]}>
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
          <AppIcon name="camera-reverse-outline" family="Ionicons" size={14} color="#64748B" />
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
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    gap: 4,
  },
  poseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 20,
    gap: 5,
  },
  poseBtnActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
  },
  poseText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 3,
  },
  camBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    gap: 4,
  },
  camText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
});
