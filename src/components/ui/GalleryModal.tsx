import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { CharacterConfig } from '../../types/character';
import { soundEngine } from '../../utils/audio';
import { AppIcon } from './AppIcon';

interface GalleryModalProps {
  visible: boolean;
  characters: CharacterConfig[];
  onClose: () => void;
  onSelectCharacter: (char: CharacterConfig) => void;
  onDeleteCharacter: (id: string) => void;
  onPlayCharacter?: (char: CharacterConfig) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  visible,
  characters,
  onClose,
  onSelectCharacter,
  onDeleteCharacter,
  onPlayCharacter,
}) => {
  const handleSelect = (char: CharacterConfig) => {
    soundEngine.playVictory();
    onSelectCharacter(char);
    onClose();
  };

  const handleDelete = (id: string) => {
    soundEngine.playPop(350);
    onDeleteCharacter(id);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.cardContainer}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.titleRow}>
              <AppIcon name="folder-open" size={20} color="#7C3AED" />
              <Text style={styles.headerTitle}>My Character Gallery</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <AppIcon name="close" size={18} color="#6D28D9" />
            </TouchableOpacity>
          </View>

          {/* Character List */}
          <ScrollView style={styles.bodyScroll} showsVerticalScrollIndicator={false}>
            {characters.length === 0 ? (
              <View style={styles.emptyContainer}>
                <AppIcon name="sparkles" size={44} color="#C4B5FD" />
                <Text style={styles.emptyTitle}>No Avatars Saved Yet!</Text>
                <Text style={styles.emptySubtitle}>
                  Customize your 3D character and tap Save to store them here!
                </Text>
              </View>
            ) : (
              <View style={styles.cardsGrid}>
                {characters.map((char) => (
                  <View key={char.id} style={styles.characterCard}>
                    {/* Top Row */}
                    <View style={styles.cardTop}>
                      <View style={[styles.avatarCircle, { backgroundColor: char.skinColor }]}>
                        <AppIcon
                          name={
                            char.gender === 'villain' || char.gender === 'shadow_imp'
                              ? 'skull-outline'
                              : char.gender === 'cyber_rebel'
                              ? 'hardware-chip-outline'
                              : 'happy'
                          }
                          size={24}
                          color={char.gender === 'villain' ? '#1E293B' : '#FFFFFF'}
                        />
                      </View>
                      <View style={styles.cardDetails}>
                        <Text style={styles.cardName}>{char.name}</Text>
                        <Text style={styles.cardDream}>{char.lifeDream}</Text>
                        <View style={styles.traitRow}>
                          <AppIcon name="star" size={11} color="#F59E0B" />
                          <Text style={styles.cardTrait}>{char.personality}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Color Swatch Preview */}
                    <View style={styles.swatchesRow}>
                      <View style={[styles.swatchMini, { backgroundColor: char.hairColor }]} />
                      <View style={[styles.swatchMini, { backgroundColor: char.outfitPrimaryColor }]} />
                      <View style={[styles.swatchMini, { backgroundColor: char.outfitSecondaryColor }]} />
                      <View style={[styles.swatchMini, { backgroundColor: char.shoesColor }]} />
                    </View>

                    {/* Actions */}
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.loadBtn}
                        onPress={() => handleSelect(char)}
                        activeOpacity={0.8}
                      >
                        <AppIcon name="color-palette-outline" size={14} color="#FFFFFF" />
                        <Text style={styles.loadText}>Studio</Text>
                      </TouchableOpacity>

                      {onPlayCharacter && (
                        <TouchableOpacity
                          style={styles.playCardBtn}
                          onPress={() => {
                            soundEngine.playVictory();
                            onPlayCharacter(char);
                            onClose();
                          }}
                          activeOpacity={0.8}
                        >
                          <AppIcon name="game-controller-outline" size={14} color="#FFFFFF" />
                          <Text style={styles.playCardText}>Play</Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDelete(char.id)}
                        activeOpacity={0.7}
                      >
                        <AppIcon name="trash-outline" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#8B5CF6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#DDD6FE',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#6D28D9',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyScroll: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E293B',
  },
  emptySubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 240,
  },
  cardsGrid: {
    gap: 12,
  },
  characterCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    padding: 12,
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  cardDetails: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E293B',
  },
  cardDream: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
    marginTop: 1,
  },
  traitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  cardTrait: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  swatchesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  swatchMini: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  loadText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  playCardBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  playCardText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
