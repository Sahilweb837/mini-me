import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { soundEngine } from '../../utils/audio';
import { AppIcon } from './AppIcon';
import { CategoryId } from '../../types/character';

interface CategoryTabsProps {
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

const CATEGORIES: { id: CategoryId; label: string; icon: string; color: string }[] = [
  { id: 'body', label: 'Face & Skin', icon: 'person-circle-outline', color: '#EC4899' },
  { id: 'hair', label: 'Hair Studio', icon: 'cut-outline', color: '#F59E0B' },
  { id: 'outfit', label: 'Outfits', icon: 'shirt-outline', color: '#3B82F6' },
  { id: 'shoes', label: 'Footwear', icon: 'footsteps-outline', color: '#10B981' },
  { id: 'accessories', label: 'Gear & Wings', icon: 'glasses-outline', color: '#8B5CF6' },
  { id: 'mood', label: 'Mood & Dream', icon: 'happy-outline', color: '#F43F5E' },
  { id: 'theme', label: 'Stage Realm', icon: 'sparkles-outline', color: '#06B6D4' },
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const handleSelect = (id: CategoryId) => {
    soundEngine.playPop(560);
    onSelectCategory(id);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.tabButton,
                isActive && {
                  backgroundColor: cat.color,
                  borderColor: cat.color,
                  transform: [{ scale: 1.05 }],
                  shadowColor: cat.color,
                  shadowOpacity: 0.35,
                },
              ]}
              onPress={() => handleSelect(cat.id)}
              activeOpacity={0.8}
            >
              <AppIcon
                name={cat.icon}
                size={18}
                color={isActive ? '#FFFFFF' : cat.color}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
    alignItems: 'center',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },
});
