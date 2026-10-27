import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

import { 
  CharacterConfig, 
  PoseType, 
  CategoryId,
  CharacterGender
} from './src/types/character';
import { AppIcon } from './src/components/ui/AppIcon';
import { 
  DEFAULT_CHARACTER,
  SKIN_TONES, 
  EYE_COLORS, 
  HAIR_COLORS, 
  OUTFIT_PALETTES,
  HAIRSTYLE_OPTIONS,
  OUTFIT_OPTIONS,
  SHOES_OPTIONS,
  HEAD_ACCESSORY_OPTIONS,
  GLASSES_OPTIONS,
  BACK_ITEM_OPTIONS,
  HAND_ITEM_OPTIONS,
  EXPRESSION_OPTIONS,
  THEME_OPTIONS,
  PERSONALITY_TRAITS,
  LIFE_DREAMS
} from './src/constants/presets';
import { 
  loadSavedCharacters, 
  saveCurrentCharacter, 
  deleteCharacterFromStorage 
} from './src/utils/storage';
import { soundEngine } from './src/utils/audio';

import { AvatarModel } from './src/components/character3d/AvatarModel';
import { CharacterStage } from './src/components/character3d/CharacterStage';
import { Header } from './src/components/ui/Header';
import { CategoryTabs } from './src/components/ui/CategoryTabs';
import { ColorPalette } from './src/components/ui/ColorPalette';
import { ItemPicker } from './src/components/ui/ItemPicker';
import { PoseSelector } from './src/components/ui/PoseSelector';
import { CharacterPassportModal } from './src/components/ui/CharacterPassportModal';
import { GalleryModal } from './src/components/ui/GalleryModal';
import { GameWorld } from './src/components/game/GameWorld';

const CHARACTER_TYPES: { id: CharacterGender; label: string; iconName: string; activeColor: string }[] = [
  { id: 'boy', label: 'Boy Hero', iconName: 'man', activeColor: '#3B82F6' },
  { id: 'girl', label: 'Girl Hero', iconName: 'woman', activeColor: '#EC4899' },
  { id: 'neutral', label: 'Explorer', iconName: 'happy', activeColor: '#10B981' },
  { id: 'villain', label: 'Dark Lord', iconName: 'skull', activeColor: '#7C3AED' },
  { id: 'shadow_imp', label: 'Shadow Imp', iconName: 'moon', activeColor: '#4338CA' },
  { id: 'cyber_rebel', label: 'Cyber Rebel', iconName: 'hardware-chip', activeColor: '#0891B2' },
];

export default function App() {
  const [character, setCharacter] = useState<CharacterConfig>(DEFAULT_CHARACTER);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('body');
  const [currentPose, setCurrentPose] = useState<PoseType>('idle');
  const [savedCharacters, setSavedCharacters] = useState<CharacterConfig[]>(() => loadSavedCharacters());
  const [appMode, setAppMode] = useState<'studio' | 'game'>('studio');
  
  const [passportModalVisible, setPassportModalVisible] = useState(false);
  const [galleryModalVisible, setGalleryModalVisible] = useState(false);

  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  // Background color mapping
  const currentBgColor = THEME_OPTIONS.find(t => t.id === character.backgroundTheme)?.bg || '#BEE3F8';

  const updateCharacter = useCallback((updates: Partial<CharacterConfig>) => {
    setCharacter(prev => ({ ...prev, ...updates }));
  }, []);

  // Camera reset to front view
  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Surprise Randomizer
  const handleRandomize = () => {
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].color;
    const randomEye = EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)].color;
    const randomHair = HAIRSTYLE_OPTIONS[Math.floor(Math.random() * HAIRSTYLE_OPTIONS.length)].id;
    const randomHairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].color;
    const randomOutfit = OUTFIT_OPTIONS[Math.floor(Math.random() * OUTFIT_OPTIONS.length)].id;
    const randomPalette = OUTFIT_PALETTES[Math.floor(Math.random() * OUTFIT_PALETTES.length)];
    const randomShoes = SHOES_OPTIONS[Math.floor(Math.random() * SHOES_OPTIONS.length)].id;
    const randomShoesColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].color;
    const randomHead = HEAD_ACCESSORY_OPTIONS[Math.floor(Math.random() * HEAD_ACCESSORY_OPTIONS.length)].id;
    const randomGlasses = GLASSES_OPTIONS[Math.floor(Math.random() * GLASSES_OPTIONS.length)].id;
    const randomBack = BACK_ITEM_OPTIONS[Math.floor(Math.random() * BACK_ITEM_OPTIONS.length)].id;
    const randomHand = HAND_ITEM_OPTIONS[Math.floor(Math.random() * HAND_ITEM_OPTIONS.length)].id;
    const randomExpr = EXPRESSION_OPTIONS[Math.floor(Math.random() * EXPRESSION_OPTIONS.length)].id;
    const randomTheme = THEME_OPTIONS[Math.floor(Math.random() * THEME_OPTIONS.length)].id;
    const randomTrait = PERSONALITY_TRAITS[Math.floor(Math.random() * PERSONALITY_TRAITS.length)];
    const randomDream = LIFE_DREAMS[Math.floor(Math.random() * LIFE_DREAMS.length)];

    setCharacter(prev => ({
      ...prev,
      skinColor: randomSkin,
      eyeColor: randomEye,
      hairstyle: randomHair,
      hairColor: randomHairColor,
      outfit: randomOutfit,
      outfitPrimaryColor: randomPalette.primary,
      outfitSecondaryColor: randomPalette.secondary,
      shoes: randomShoes,
      shoesColor: randomShoesColor,
      headAccessory: randomHead,
      glasses: randomGlasses,
      backItem: randomBack,
      handItem: randomHand,
      expression: randomExpr,
      backgroundTheme: randomTheme,
      personality: randomTrait,
      lifeDream: randomDream,
    }));
  };

  const handleSaveCharacter = (saved: CharacterConfig) => {
    const updatedList = saveCurrentCharacter(saved);
    setSavedCharacters(updatedList);
    setCharacter(saved);
  };

  const handleDeleteCharacter = (id: string) => {
    const updatedList = deleteCharacterFromStorage(id);
    setSavedCharacters(updatedList);
  };

  const handleSelectCharacterFromGallery = (char: CharacterConfig) => {
    setCharacter(char);
  };

  // 3D Game World Mode
  if (appMode === 'game') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <GameWorld
          character={character}
          onExit={() => setAppMode('studio')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Top Header */}
      <Header
        onRandomize={handleRandomize}
        onOpenGallery={() => setGalleryModalVisible(true)}
        onOpenSaveModal={() => setPassportModalVisible(true)}
        onReset={() => setCharacter(DEFAULT_CHARACTER)}
        onPlayGame={() => setAppMode('game')}
      />

      {/* Main Container */}
      <View style={styles.contentContainer}>
        {/* ================= 3D VIEWPORT ================= */}
        <View style={[styles.viewport3D, { backgroundColor: currentBgColor }]}>
          {/* Floating Pose Selector Overlay */}
          <PoseSelector
            currentPose={currentPose}
            onSelectPose={setCurrentPose}
            onResetCamera={handleResetCamera}
          />

          {/* Floating Play in World Badge */}
          <TouchableOpacity
            style={styles.floatingPlayBtn}
            onPress={() => {
              soundEngine.playVictory();
              setAppMode('game');
            }}
            activeOpacity={0.85}
          >
            <AppIcon name="game-controller" size={16} color="#FFFFFF" />
            <Text style={styles.floatingPlayText}>Play in 3D World</Text>
          </TouchableOpacity>

          {/* Three.js / R3F Canvas */}
          <Canvas
            shadows
            camera={{ position: [0, 1.25, 3.4], fov: 42 }}
            style={styles.canvas}
          >
            <OrbitControls
              ref={controlsRef}
              makeDefault
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.85}
              minDistance={1.8}
              maxDistance={5.5}
              target={[0, 0.9, 0]}
              enableDamping
              dampingFactor={0.08}
            />

            {/* Themed Stage Environment & Pedestal */}
            <CharacterStage theme={character.backgroundTheme} />

            {/* 3D Modular Child Character */}
            <AvatarModel config={character} pose={currentPose} />
          </Canvas>

          {/* Touch Interaction Hint */}
          <View style={styles.dragHint}>
            <AppIcon name="finger-print-outline" size={12} color="#FFFFFF" />
            <Text style={styles.dragHintText}>Drag to rotate 360° • Pinch to zoom</Text>
          </View>
        </View>

        {/* ================= CUSTOMIZATION PANEL ================= */}
        <View style={styles.customizerPanel}>
          {/* Category Tabs */}
          <CategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Tab Content Drawer */}
          <ScrollView
            style={styles.optionsDrawer}
            contentContainerStyle={styles.optionsDrawerContent}
            showsVerticalScrollIndicator={false}
          >
            {/* TAB: BODY & FACE */}
            {activeCategory === 'body' && (
              <View>
                {/* Character Archetype Pills */}
                <View style={styles.genderRow}>
                  <Text style={styles.sectionHeader}>Character Archetype</Text>
                  <View style={styles.genderPills}>
                    {CHARACTER_TYPES.map(g => {
                      const isActive = character.gender === g.id;
                      return (
                        <TouchableOpacity
                          key={g.id}
                          style={[
                            styles.genderPill,
                            isActive && { backgroundColor: `${g.activeColor}15`, borderColor: g.activeColor },
                          ]}
                          onPress={() => {
                            if (g.id === 'villain') soundEngine.playEvilLaugh();
                            else if (g.id === 'shadow_imp') soundEngine.playMagicSpell();
                            else if (g.id === 'cyber_rebel') soundEngine.playLaserSlash();
                            else soundEngine.playPop(520);
                            updateCharacter({ gender: g.id });
                          }}
                          activeOpacity={0.75}
                        >
                          <AppIcon
                            name={g.iconName}
                            size={14}
                            color={isActive ? g.activeColor : '#64748B'}
                          />
                          <Text style={[styles.genderText, isActive && { color: g.activeColor, fontWeight: '800' }]}>
                            {g.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Skin Tone Palette */}
                <ColorPalette
                  title="Skin Tone"
                  colors={SKIN_TONES}
                  selectedColor={character.skinColor}
                  onSelectColor={(color) => updateCharacter({ skinColor: color })}
                />

                {/* Eye Color Palette */}
                <ColorPalette
                  title="Eye Iris Color"
                  colors={EYE_COLORS}
                  selectedColor={character.eyeColor}
                  onSelectColor={(color) => updateCharacter({ eyeColor: color })}
                />

                {/* Rosy Blush Toggle */}
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Rosy Cheeks (Blush)</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      character.blushEnabled && styles.toggleButtonActive,
                    ]}
                    onPress={() => {
                      soundEngine.playPop(500);
                      updateCharacter({ blushEnabled: !character.blushEnabled });
                    }}
                  >
                    <View style={styles.toggleInner}>
                      {character.blushEnabled && (
                        <AppIcon name="sparkles" size={12} color="#FFFFFF" />
                      )}
                      <Text style={styles.toggleButtonText}>
                        {character.blushEnabled ? 'ON' : 'OFF'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* TAB: HAIR */}
            {activeCategory === 'hair' && (
              <View>
                <ItemPicker
                  title="Choose Hairstyle"
                  options={HAIRSTYLE_OPTIONS}
                  selectedId={character.hairstyle}
                  onSelect={(id) => updateCharacter({ hairstyle: id })}
                  colorTheme="#F59E0B"
                />

                <ColorPalette
                  title="Hair Color"
                  colors={HAIR_COLORS}
                  selectedColor={character.hairColor}
                  onSelectColor={(color) => updateCharacter({ hairColor: color })}
                />
              </View>
            )}

            {/* TAB: OUTFIT */}
            {activeCategory === 'outfit' && (
              <View>
                <ItemPicker
                  title="Costumes & Outfits"
                  options={OUTFIT_OPTIONS}
                  selectedId={character.outfit}
                  onSelect={(id) => updateCharacter({ outfit: id })}
                  colorTheme="#3B82F6"
                />

                {/* Preset Outfit Color Palettes */}
                <Text style={styles.sectionHeader}>Theme Color Schemes</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.palettesRow}>
                  {OUTFIT_PALETTES.map((p, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.paletteCard,
                        character.outfitPrimaryColor === p.primary && character.outfitSecondaryColor === p.secondary && styles.paletteCardSelected,
                      ]}
                      onPress={() => {
                        soundEngine.playPop(580);
                        updateCharacter({ outfitPrimaryColor: p.primary, outfitSecondaryColor: p.secondary });
                      }}
                    >
                      <View style={styles.paletteSplits}>
                        <View style={[styles.paletteHalf, { backgroundColor: p.primary }]} />
                        <View style={[styles.paletteHalf, { backgroundColor: p.secondary }]} />
                      </View>
                      <Text style={styles.paletteName}>{p.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <ColorPalette
                  title="Primary Color"
                  colors={HAIR_COLORS}
                  selectedColor={character.outfitPrimaryColor}
                  onSelectColor={(color) => updateCharacter({ outfitPrimaryColor: color })}
                />

                <ColorPalette
                  title="Secondary Color"
                  colors={HAIR_COLORS}
                  selectedColor={character.outfitSecondaryColor}
                  onSelectColor={(color) => updateCharacter({ outfitSecondaryColor: color })}
                />
              </View>
            )}

            {/* TAB: SHOES */}
            {activeCategory === 'shoes' && (
              <View>
                <ItemPicker
                  title="Footwear & Shoes"
                  options={SHOES_OPTIONS}
                  selectedId={character.shoes}
                  onSelect={(id) => updateCharacter({ shoes: id })}
                  colorTheme="#10B981"
                />

                <ColorPalette
                  title="Shoes Color"
                  colors={HAIR_COLORS}
                  selectedColor={character.shoesColor}
                  onSelectColor={(color) => updateCharacter({ shoesColor: color })}
                />
              </View>
            )}

            {/* TAB: ACCESSORIES */}
            {activeCategory === 'accessories' && (
              <View>
                <ItemPicker
                  title="Glasses & Shades"
                  options={GLASSES_OPTIONS}
                  selectedId={character.glasses}
                  onSelect={(id) => updateCharacter({ glasses: id })}
                  colorTheme="#8B5CF6"
                />

                <ItemPicker
                  title="Headwear & Hats"
                  options={HEAD_ACCESSORY_OPTIONS}
                  selectedId={character.headAccessory}
                  onSelect={(id) => updateCharacter({ headAccessory: id })}
                  colorTheme="#EC4899"
                />

                <ItemPicker
                  title="Back Items & Wings"
                  options={BACK_ITEM_OPTIONS}
                  selectedId={character.backItem}
                  onSelect={(id) => updateCharacter({ backItem: id })}
                  colorTheme="#06B6D4"
                />

                <ItemPicker
                  title="Hand Held Companion / Toy"
                  options={HAND_ITEM_OPTIONS}
                  selectedId={character.handItem}
                  onSelect={(id) => updateCharacter({ handItem: id })}
                  colorTheme="#F59E0B"
                />
              </View>
            )}

            {/* TAB: MOOD & DREAM */}
            {activeCategory === 'mood' && (
              <View>
                <ItemPicker
                  title="Facial Expression"
                  options={EXPRESSION_OPTIONS}
                  selectedId={character.expression}
                  onSelect={(id) => updateCharacter({ expression: id })}
                  colorTheme="#EC4899"
                />

                <Text style={styles.sectionHeader}>Personality Trait</Text>
                <View style={styles.chipsWrap}>
                  {PERSONALITY_TRAITS.map(trait => (
                    <TouchableOpacity
                      key={trait}
                      style={[
                        styles.traitChip,
                        character.personality === trait && styles.traitChipSelected,
                      ]}
                      onPress={() => {
                        soundEngine.playPop(550);
                        updateCharacter({ personality: trait });
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <AppIcon name="star" size={11} color={character.personality === trait ? '#BE185D' : '#F59E0B'} />
                        <Text style={[styles.traitText, character.personality === trait && styles.traitTextSelected]}>
                          {trait}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.sectionHeader}>Childhood Life Dream</Text>
                <View style={styles.chipsWrap}>
                  {LIFE_DREAMS.map(dream => (
                    <TouchableOpacity
                      key={dream}
                      style={[
                        styles.traitChip,
                        character.lifeDream === dream && styles.traitChipSelected,
                      ]}
                      onPress={() => {
                        soundEngine.playPop(550);
                        updateCharacter({ lifeDream: dream });
                      }}
                    >
                      <Text style={[styles.traitText, character.lifeDream === dream && styles.traitTextSelected]}>
                        {dream}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* TAB: STAGE THEME */}
            {activeCategory === 'theme' && (
              <View>
                <ItemPicker
                  title="Stage & Background Theme"
                  options={THEME_OPTIONS}
                  selectedId={character.backgroundTheme}
                  onSelect={(id) => updateCharacter({ backgroundTheme: id })}
                  colorTheme="#06B6D4"
                />
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Passport & Save Modal */}
      <CharacterPassportModal
        visible={passportModalVisible}
        character={character}
        onClose={() => setPassportModalVisible(false)}
        onSave={handleSaveCharacter}
        onPlayNow={(char) => {
          setCharacter(char);
          setAppMode('game');
        }}
      />

      {/* Gallery Modal */}
      <GalleryModal
        visible={galleryModalVisible}
        characters={savedCharacters}
        onClose={() => setGalleryModalVisible(false)}
        onSelectCharacter={handleSelectCharacterFromGallery}
        onDeleteCharacter={handleDeleteCharacter}
        onPlayCharacter={(char) => {
          setCharacter(char);
          setAppMode('game');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  viewport3D: {
    flex: 1.15,
    position: 'relative',
    overflow: 'hidden',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  dragHint: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  dragHintText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  floatingPlayBtn: {
    position: 'absolute',
    bottom: 10,
    right: 14,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#60A5FA',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  floatingPlayEmoji: {
    fontSize: 16,
  },
  floatingPlayText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  customizerPanel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  optionsDrawer: {
    flex: 1,
  },
  optionsDrawerContent: {
    padding: 14,
    paddingBottom: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 8,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  genderRow: {
    marginBottom: 10,
  },
  genderPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  genderPill: {
    width: '31%',
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 5,
  },
  genderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  toggleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  toggleButton: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  toggleButtonActive: {
    backgroundColor: '#EC4899',
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  palettesRow: {
    gap: 8,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  paletteCard: {
    width: 80,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    padding: 6,
    alignItems: 'center',
    gap: 4,
  },
  paletteCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  paletteSplits: {
    flexDirection: 'row',
    width: 48,
    height: 24,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  paletteHalf: {
    flex: 1,
  },
  paletteName: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  traitChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  traitChipSelected: {
    backgroundColor: '#FDF2F8',
    borderColor: '#EC4899',
  },
  traitText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  traitTextSelected: {
    color: '#BE185D',
    fontWeight: '900',
  },
});
