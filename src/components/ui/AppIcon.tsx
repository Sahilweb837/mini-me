import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
} from '@expo/vector-icons';

export type IconFamily = 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5' | 'Feather';

interface AppIconProps {
  name: string;
  family?: IconFamily;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  badgeBg?: string;
  badgeSize?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  family = 'Ionicons',
  size = 20,
  color = '#1E293B',
  style,
  badgeBg,
  badgeSize,
}) => {
  const renderIcon = () => {
    switch (family) {
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={name as any} size={size} color={color} />;
      case 'Feather':
        return <Feather name={name as any} size={size} color={color} />;
      case 'Ionicons':
      default:
        return <Ionicons name={name as any} size={size} color={color} />;
    }
  };

  if (badgeBg) {
    const bSize = badgeSize || size + 14;
    return (
      <View
        style={[
          styles.badge,
          {
            width: bSize,
            height: bSize,
            borderRadius: bSize / 2,
            backgroundColor: badgeBg,
          },
          style,
        ]}
      >
        {renderIcon()}
      </View>
    );
  }

  return <View style={style}>{renderIcon()}</View>;
};

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
