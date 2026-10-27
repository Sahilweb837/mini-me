import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { soundEngine } from '../../utils/audio';

export interface PickerOption<T = string> {
  id: T;
  label: string;
  icon: string;
  badge?: string;
}

interface ItemPickerProps<T = string> {
  title: string;
  options: PickerOption<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
  colorTheme?: string;
}

export function ItemPicker<T extends string>({
  title,
  options,
  selectedId,
  onSelect,
  colorTheme = '#3B82F6',
}: ItemPickerProps<T>) {
  const handleSelect = (id: T) => {
    soundEngine.playChime();
    onSelect(id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.itemCard,
                isSelected && {
                  borderColor: colorTheme,
                  backgroundColor: '#FFFFFF',
                  transform: [{ scale: 1.05 }],
                  shadowColor: colorTheme,
                  shadowOpacity: 0.35,
                },
              ]}
              onPress={() => handleSelect(opt.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.itemIcon}>{opt.icon}</Text>
              <Text
                style={[
                  styles.itemLabel,
                  isSelected && { color: colorTheme, fontWeight: '900' },
                ]}
                numberOfLines={1}
              >
                {opt.label}
              </Text>
              {isSelected && (
                <View style={[styles.activeDot, { backgroundColor: colorTheme }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  scrollContent: {
    gap: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  itemCard: {
    width: 90,
    height: 82,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  itemIcon: {
    fontSize: 30,
    marginBottom: 4,
  },
  itemLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 3,
  },
});
