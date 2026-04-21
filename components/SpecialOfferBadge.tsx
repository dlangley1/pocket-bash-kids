import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function SpecialOfferBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>🔥 Special Offer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FFD700',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  text: {
    fontSize: 9,
    fontWeight: '700',
    color: '#7A5000',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
