import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Business } from '../services/airtable';
import { colors, shadow } from '../constants/theme';
import { CATEGORIES } from '../constants/categories';
import { VerifiedBadge } from './VerifiedBadge';
import { SpecialOfferBadge } from './SpecialOfferBadge';

interface Props {
  business: Business;
  showSpecialOffer?: boolean;
}

function getCategoryEmoji(category: string): string {
  return CATEGORIES.find(c => c.name === category)?.emoji || '🎉';
}

export function FeaturedCard({ business, showSpecialOffer = false }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/business/${business.id}`)}
    >
      <View style={styles.imgContainer}>
        {business.primaryImage ? (
          <Image
            source={{ uri: business.primaryImage }}
            style={styles.img}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient colors={['#E8751A', '#C5601A']} style={styles.img}>
            <Text style={styles.emoji}>{getCategoryEmoji(business.category)}</Text>
          </LinearGradient>
        )}
        {showSpecialOffer && business.specialOffer ? (
          <View style={styles.badgeAbs}>
            <SpecialOfferBadge />
          </View>
        ) : business.status === 'Premium' ? (
          <View style={styles.badgeAbs}>
            <View style={styles.premBadge}>
              <Text style={styles.premText}>⭐ Premium</Text>
            </View>
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{business.name}</Text>
        <Text style={styles.cat}>{business.category}</Text>
        <View style={styles.footer}>
          {business.status === 'Premium' ? (
            <LinearGradient colors={['#E8751A', '#C5601A']} style={styles.tierBadge}>
              <Text style={styles.tierText}>⭐ Premium</Text>
            </LinearGradient>
          ) : business.status === 'Featured' ? (
            <View style={[styles.tierBadge, styles.featBadge]}>
              <Text style={[styles.tierText, styles.featText]}>Featured</Text>
            </View>
          ) : null}
          {business.status === 'Premium' && <VerifiedBadge />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 185,
    backgroundColor: colors.white,
    borderRadius: 13,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  imgContainer: { height: 100, position: 'relative' },
  img: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 36 },
  badgeAbs: { position: 'absolute', top: 8, left: 8, zIndex: 2 },
  premBadge: {
    backgroundColor: '#E8751A',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  premText: { fontSize: 9, fontWeight: '700', color: colors.white },
  body: { padding: 11, paddingHorizontal: 13, paddingBottom: 13 },
  name: { fontWeight: '700', fontSize: 13, color: colors.black, lineHeight: 16 },
  cat: { fontSize: 11, color: colors.muted, marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9 },
  tierBadge: { borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 },
  tierText: { fontSize: 9, fontWeight: '700', color: colors.white, letterSpacing: 0.5, textTransform: 'uppercase' },
  featBadge: { backgroundColor: '#EEF4FF' },
  featText: { color: '#1565C0' },
});
