import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import confetti from 'canvas-confetti';
import { CharacterConfig, PersonalityTrait, LifeDream } from '../../types/character';
import { PERSONALITY_TRAITS, LIFE_DREAMS } from '../../constants/presets';
import { soundEngine } from '../../utils/audio';

interface CharacterPassportModalProps {
  visible: boolean;
  character: CharacterConfig;
  onClose: () => void;
  onSave: (updated: CharacterConfig) => void;
  onPlayNow?: (updated: CharacterConfig) => void;
}

const FUN_FIRST_NAMES = [
  'Leo', 'Pip', 'Stella', 'Oliver', 'Mia', 'Milo', 'Luna', 'Jasper', 'Chloe', 
  'Finn', 'Ruby', 'Toby', 'Nova', 'Felix', 'Penny', 'Archie', 'Lily', 'Sammy'
];

const FUN_TITLES = [
  'the Brave', 'Sparkle', 'the Explorer', 'Starlight', 'the Swift', 'Sunbeam',
  'the Curious', 'Moonhopper', 'the Joyful', 'Whizkid', 'the Great', 'Wonder'
];

export const CharacterPassportModal: React.FC<CharacterPassportModalProps> = ({
  visible,
  character,
  onClose,
  onSave,
  onPlayNow,
}) => {
  const [name, setName] = useState(character.name);
  const [personality, setPersonality] = useState<PersonalityTrait>(character.personality);
  const [lifeDream, setLifeDream] = useState<LifeDream>(character.lifeDream);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleRandomName = () => {
    soundEngine.playPop(650);
    const first = FUN_FIRST_NAMES[Math.floor(Math.random() * FUN_FIRST_NAMES.length)];
    const title = FUN_TITLES[Math.floor(Math.random() * FUN_TITLES.length)];
    setName(`${first} ${title}`);
  };

  const handleConfirmSave = () => {
    // Sound & Confetti
    soundEngine.playVictory();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#EC4899', '#3B82F6', '#10B981', '#8B5CF6'],
      });
    } catch {
      // Confetti not available on native
    }

    const updatedConfig: CharacterConfig = {
      ...character,
      name: name.trim() || 'My MiniMe',
      personality,
      lifeDream,
    };

    setSavedSuccess(true);
    setTimeout(() => {
      onSave(updatedConfig);
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.cardContainer}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.sealBadge}>
              <Text style={styles.sealText}>PASSPORT</Text>
            </View>
            <Text style={styles.headerTitle}>MiniMe Citizen Card</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.bodyScroll} showsVerticalScrollIndicator={false}>
            {/* Character Portrait Representation Banner */}
            <View style={[styles.avatarBanner, { borderColor: character.outfitPrimaryColor }]}>
              <View style={[styles.avatarCircle, { backgroundColor: character.skinColor }]}>
                <Text style={styles.avatarEmoji}>
                  {character.gender === 'girl' ? '👧' : (character.gender === 'boy' ? '👦' : '🧒')}
                </Text>
              </View>
              <View style={styles.bannerInfo}>
                <Text style={styles.bannerSubtitle}>CITIZEN OF</Text>
                <Text style={styles.bannerWorld}>
                  {character.backgroundTheme.replace('_', ' ').toUpperCase()}
                </Text>
                <View style={styles.tagRow}>
                  <View style={[styles.tag, { backgroundColor: character.hairColor }]}>
                    <Text style={styles.tagTextLight}>Hair</Text>
                  </View>
                  <View style={[styles.tag, { backgroundColor: character.outfitPrimaryColor }]}>
                    <Text style={styles.tagTextLight}>Outfit</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Name Input */}
            <View style={styles.inputSection}>
              <Text style={styles.fieldLabel}>Character Name</Text>
              <View style={styles.nameRow}>
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter name..."
                  placeholderTextColor="#94A3B8"
                  maxLength={24}
                />
                <TouchableOpacity
                  style={styles.randomNameBtn}
                  onPress={handleRandomName}
                  activeOpacity={0.7}
                >
                  <Text style={styles.randomNameIcon}>✨</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Life Dream Selector */}
            <View style={styles.inputSection}>
              <Text style={styles.fieldLabel}>Life Dream & Goal</Text>
              <View style={styles.chipsWrap}>
                {LIFE_DREAMS.map((dream) => {
                  const isSelected = lifeDream === dream;
                  return (
                    <TouchableOpacity
                      key={dream}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => {
                        soundEngine.playPop(520);
                        setLifeDream(dream);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {dream}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Personality Selector */}
            <View style={styles.inputSection}>
              <Text style={styles.fieldLabel}>Personality Trait</Text>
              <View style={styles.chipsWrap}>
                {PERSONALITY_TRAITS.map((trait) => {
                  const isSelected = personality === trait;
                  return (
                    <TouchableOpacity
                      key={trait}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => {
                        soundEngine.playPop(520);
                        setPersonality(trait);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        ⭐ {trait}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer Save & Play Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.saveConfirmBtn, savedSuccess && styles.saveConfirmBtnSuccess]}
              onPress={handleConfirmSave}
              activeOpacity={0.85}
              disabled={savedSuccess}
            >
              <Text style={styles.saveConfirmEmoji}>{savedSuccess ? '🎉' : '💾'}</Text>
              <Text style={styles.saveConfirmText}>
                {savedSuccess ? 'Saved to Gallery!' : 'Save & Issue Passport'}
              </Text>
            </TouchableOpacity>

            {onPlayNow && (
              <TouchableOpacity
                style={styles.playNowBtn}
                onPress={() => {
                  const updatedConfig: CharacterConfig = {
                    ...character,
                    name: name.trim() || 'My MiniMe',
                    personality,
                    lifeDream,
                  };
                  onSave(updatedConfig);
                  onClose();
                  onPlayNow(updatedConfig);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.playNowEmoji}>🎮</Text>
                <Text style={styles.playNowText}>Save & Play in 3D World</Text>
              </TouchableOpacity>
            )}
          </View>
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
    maxWidth: 440,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#FDE68A',
  },
  sealBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  sealText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#92400E',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 14,
    fontWeight: '900',
    color: '#92400E',
  },
  bodyScroll: {
    padding: 16,
  },
  avatarBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 2,
    padding: 12,
    marginBottom: 16,
    gap: 14,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  bannerWorld: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 4,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagTextLight: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  inputSection: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 8,
  },
  textInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  randomNameBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  randomNameIcon: {
    fontSize: 18,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  chipSelected: {
    backgroundColor: '#EDE9FE',
    borderColor: '#8B5CF6',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  chipTextSelected: {
    color: '#6D28D9',
    fontWeight: '900',
  },
  footer: {
    padding: 14,
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  saveConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#059669',
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  saveConfirmBtnSuccess: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  saveConfirmEmoji: {
    fontSize: 20,
  },
  saveConfirmText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  playNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2563EB',
    gap: 8,
    marginTop: 10,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  playNowEmoji: {
    fontSize: 20,
  },
  playNowText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
