import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

interface Props {
  onSubscribe: () => void;
  onRestore: () => void;
}

export function LockedOverlay({ onSubscribe, onRestore }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.lock}>🔒</Text>
      <Text style={styles.title}>Full Profile Locked</Text>
      <Text style={styles.sub}>
        Subscribe to see full contact details, packages, and more.
      </Text>
      <TouchableOpacity style={styles.cta} onPress={onSubscribe}>
        <Text style={styles.ctaText}>Subscribe from R49/month →</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.restore} onPress={onRestore}>
        <Text style={styles.restoreText}>Restore Purchase</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 12,
    padding: 22,
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  lock: { fontSize: 28, marginBottom: 8 },
  title: { fontSize: 14, fontWeight: '700', color: colors.muted },
  sub: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
    lineHeight: 19,
    textAlign: 'center',
  },
  cta: {
    backgroundColor: colors.orange,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  restore: { marginTop: 10 },
  restoreText: { color: colors.orange, fontSize: 13, fontWeight: '600' },
});
