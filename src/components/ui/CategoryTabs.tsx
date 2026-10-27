import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { soundEngine } from '../../utils/audio';

export type CategoryId = 'body' | 'hair' | 'outfit' | 'shoes' | 'accessories' | 'mood' | 'theme';

interface CategoryTabsProps {
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

const CATEGORIES: { id: CategoryId; label: string; icon: string; color: string }[] = [
  { id: 'body', label: 'Face & Skin', icon: '🧬', color: '#F472B6' },
  { id: 'hair', label: 'Hair Style', icon: '💇', color: '#F59E0B' },
  { id: 'outfit', label: 'Outfits', icon: '👕', color: '#3B82F6' },
  { id: 'shoes', label: 'Shoes', icon: '👟', color: '#10B981' },
  { id: 'accessories', label: 'Accessories', icon: '👓', color: '#8B5CF6' },
  { id: 'mood', label: 'Mood & Dream', icon: '🎭', color: '#EC4899' },
  { id: 'theme', label: 'Stage Theme', icon: '🌈', color: '#06B6D4' },
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
                  transform: [{ scale: 1.04 }],
                },
              ]}
              onPress={() => handleSelect(cat.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.tabIcon}>{cat.icon}</Text>
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
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
    alignItems: 'center',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
