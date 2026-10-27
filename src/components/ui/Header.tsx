import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { soundEngine } from '../../utils/audio';
import { AppIcon } from './AppIcon';

interface HeaderProps {
  onRandomize: () => void;
  onOpenGallery: () => void;
  onOpenSaveModal: () => void;
  onReset: () => void;
  onPlayGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRandomize,
  onOpenGallery,
  onOpenSaveModal,
  onReset,
  onPlayGame,
}) => {
  const [soundOn, setSoundOn] = useState(true);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundEngine.setEnabled(next);
    if (next) soundEngine.playPop(520);
  };

  const handleRandomize = () => {
    soundEngine.playDiceRoll();
    onRandomize();
  };

  const handleSave = () => {
    soundEngine.playChime();
    onOpenSaveModal();
  };

  const handleGallery = () => {
    soundEngine.playPop(480);
    onOpenGallery();
  };

  const handlePlayGame = () => {
    soundEngine.playVictory();
    onPlayGame();
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.brandRow}>
        <View style={styles.titleBadge}>
          <AppIcon name="sparkles" size={24} color="#F59E0B" badgeBg="#FEF3C7" badgeSize={38} />
          <View>
            <Text style={styles.appTitle}>MiniMe 3D</Text>
            <Text style={styles.appSubtitle}>Kids Life-Sim Avatar Studio</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          {/* Play in 3D Game World Button */}
          <TouchableOpacity
            style={styles.playGameButton}
            onPress={handlePlayGame}
            activeOpacity={0.8}
          >
            <AppIcon name="game-controller-outline" size={17} color="#FFFFFF" />
            <Text style={styles.playGameText}>Play in World</Text>
          </TouchableOpacity>

          {/* Sound Toggle */}
          <TouchableOpacity
            style={[styles.iconButton, !soundOn && styles.iconButtonDisabled]}
            onPress={toggleSound}
            activeOpacity={0.7}
          >
            <AppIcon
              name={soundOn ? 'volume-high-outline' : 'volume-mute-outline'}
              size={18}
              color={soundOn ? '#0284C7' : '#94A3B8'}
            />
          </TouchableOpacity>

          {/* Randomizer Dice */}
          <TouchableOpacity
            style={styles.randomButton}
            onPress={handleRandomize}
            activeOpacity={0.75}
          >
            <AppIcon name="dice-outline" size={16} color="#B45309" />
            <Text style={styles.randomText}>Surprise!</Text>
          </TouchableOpacity>

          {/* Gallery Button */}
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={handleGallery}
            activeOpacity={0.75}
          >
            <AppIcon name="images-outline" size={16} color="#6D28D9" />
            <Text style={styles.galleryText}>Gallery</Text>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <AppIcon name="bookmark-outline" size={16} color="#FFFFFF" />
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    zIndex: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeEmoji: {
    fontSize: 28,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: -2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  iconButtonDisabled: {
    backgroundColor: '#E2E8F0',
    opacity: 0.6,
  },
  buttonEmoji: {
    fontSize: 18,
  },
  randomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F59E0B',
    gap: 6,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  randomEmoji: {
    fontSize: 18,
  },
  randomText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    gap: 6,
  },
  galleryEmoji: {
    fontSize: 16,
  },
  galleryText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6D28D9',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#059669',
    gap: 6,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  saveEmoji: {
    fontSize: 16,
  },
  saveText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  playGameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2563EB',
    gap: 6,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  playGameEmoji: {
    fontSize: 18,
  },
  playGameText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
