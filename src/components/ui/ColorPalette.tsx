import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { soundEngine } from '../../utils/audio';

interface ColorOption {
  id?: string;
  name?: string;
  color: string;
}

interface ColorPaletteProps {
  title: string;
  colors: ColorOption[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  title,
  colors,
  selectedColor,
  onSelectColor,
}) => {
  const handleSelect = (color: string) => {
    soundEngine.playPop(620);
    onSelectColor(color);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {colors.map((c, index) => {
          const isSelected = selectedColor.toLowerCase() === c.color.toLowerCase();
          return (
            <TouchableOpacity
              key={c.id || index}
              style={[
                styles.swatchWrap,
                isSelected && styles.swatchWrapSelected,
              ]}
              onPress={() => handleSelect(c.color)}
              activeOpacity={0.8}
            >
              <View style={[styles.swatch, { backgroundColor: c.color }]}>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
              {c.name && (
                <Text style={[styles.colorName, isSelected && styles.colorNameSelected]}>
                  {c.name}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

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
  swatchWrap: {
    alignItems: 'center',
    padding: 3,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: 'transparent',
  },
  swatchWrapSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  colorName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 3,
    maxWidth: 60,
    textAlign: 'center',
  },
  colorNameSelected: {
    color: '#2563EB',
    fontWeight: '800',
  },
});
