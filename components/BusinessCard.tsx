import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Business } from '../services/airtable';
import { colors, shadow } from '../constants/theme';
import { CATEGORIES } from '../constants/categories';
import { VerifiedBadge } from './VerifiedBadge';
import { SpecialOfferBadge } from './SpecialOfferBadge';

interface Props {
  business: Business;
  isFavourite?: boolean;
  onFavouritePress?: () => void;
  showFavourite?: boolean;
}

function getCategoryEmoji(category: string): string {
  return CATEGORIES.find(c => c.name === category)?.emoji || '🎉';
}

export function BusinessCard({ business, isFavourite = false, onFavouritePress, showFavourite = true }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.card, business.status === 'Premium' && styles.premiumCard]}
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
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{getCategoryEmoji(business.category)}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <View style={styles.badgeRow}>
          {business.status === 'Premium' ? (
            <LinearGradient colors={['#E8751A', '#C5601A']} style={styles.tierBadge}>
              <Text style={styles.tierTextWhite}>⭐ Premium</Text>
            </LinearGradient>
          ) : business.status === 'Featured' ? (
            <View style={[styles.tierBadge, styles.featBadge]}>
              <Text style={[styles.tierTextWhite, styles.featText]}>Featured</Text>
            </View>
          ) : (
            <View style={[styles.tierBadge, styles.freeBadge]}>
              <Text style={[styles.tierTextWhite, styles.freeText]}>Free</Text>
            </View>
          )}
          {business.status === 'Premium' && <VerifiedBadge />}
          {business.specialOffer ? <SpecialOfferBadge /> : null}
        </View>
        <Text style={styles.name} numberOfLines={1}>{business.name}</Text>
        <Text style={styles.cat}>{business.category}{business.area ? ` · ${business.area}` : ''}</Text>
        {business.status !== 'Premium' && business.phone ? (
          <Text style={styles.phone}>{business.phone}</Text>
        ) : null}
      </View>
      <View style={styles.right}>
        {showFavourite && (
          <TouchableOpacity onPress={onFavouritePress} style={styles.favBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name={isFavourite ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isFavourite ? colors.orange : '#CCC'}
            />
          </TouchableOpacity>
        )}
        <Ionicons name="chevron-forward" size={18} color="#CCC" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 13,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  premiumCard: { borderLeftWidth: 3, borderLeftColor: colors.orange },
  imgContainer: {
    width: 46,
    height: 46,
    borderRadius: 11,
    overflow: 'hidden',
    flexShrink: 0,
  },
  img: { width: '100%', height: '100%' },
  emojiContainer: {
    width: 46,
    height: 46,
    borderRadius: 11,
    backgroundColor: colors.orangePale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 22 },
  info: { flex: 1 },
  badgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', alignItems: 'center' },
  tierBadge: { borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 },
  tierTextWhite: { fontSize: 9, fontWeight: '700', color: colors.white, letterSpacing: 0.5, textTransform: 'uppercase' },
  featBadge: { backgroundColor: '#EEF4FF' },
  featText: { color: '#1565C0' },
  freeBadge: { backgroundColor: colors.orangePale },
  freeText: { color: colors.orangeDark },
  name: { fontWeight: '700', fontSize: 13, color: colors.black, marginTop: 4 },
  cat: { fontSize: 11, color: colors.muted, fontWeight: '500', marginTop: 2 },
  phone: { fontSize: 11, color: colors.orange, fontWeight: '600', marginTop: 5 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  favBtn: { padding: 2 },
});
