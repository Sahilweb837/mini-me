import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { soundEngine } from '../../utils/audio';
import { AppIcon } from './AppIcon';

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
          const isVectorIcon = typeof opt.icon === 'string' && (opt.icon.includes('-') || opt.icon.length > 2);

          return (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.itemCard,
                isSelected && {
                  borderColor: colorTheme,
                  backgroundColor: '#FFFFFF',
                  transform: [{ scale: 1.04 }],
                  shadowColor: colorTheme,
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                },
              ]}
              onPress={() => handleSelect(opt.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: isSelected ? `${colorTheme}18` : '#F1F5F9',
                  },
                ]}
              >
                {isVectorIcon ? (
                  <AppIcon
                    name={opt.icon}
                    size={22}
                    color={isSelected ? colorTheme : '#64748B'}
                  />
                ) : (
                  <Text style={styles.itemEmoji}>{opt.icon}</Text>
                )}
              </View>

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
    marginVertical: 8,
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
    paddingVertical: 2,
  },
  itemCard: {
    width: 96,
    height: 88,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemEmoji: {
    fontSize: 22,
  },
  itemLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    width: '100%',
  },
  activeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
