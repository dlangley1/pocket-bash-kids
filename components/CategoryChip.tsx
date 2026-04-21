import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
  variant?: 'category' | 'age';
}

export function CategoryChip({ label, active, onPress, variant = 'category' }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        variant === 'age' && styles.ageChip,
        active && styles.active,
        active && variant === 'age' && styles.ageActive,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, active && styles.activeText, variant === 'age' && styles.ageText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#999999',
    backgroundColor: '#F0F0F0',
  },
  ageChip: {
    borderColor: colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.white,
  },
  active: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  ageActive: {
    backgroundColor: colors.orange,
  },
  text: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  ageText: { fontSize: 11, fontWeight: '700', color: colors.orange },
  activeText: { color: colors.white },
});
