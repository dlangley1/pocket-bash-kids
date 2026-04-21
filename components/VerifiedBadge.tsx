import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function VerifiedBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>✓ Verified</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  text: {
    fontSize: 9,
    fontWeight: '700',
    color: '#2E7D32',
    letterSpacing: 0.5,
  },
});
