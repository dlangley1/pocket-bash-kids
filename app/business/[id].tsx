import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchAllBusinesses, Business } from '../../services/airtable';
import { colors, shadow } from '../../constants/theme';
import { VerifiedBadge } from '../../components/VerifiedBadge';
import { SpecialOfferBadge } from '../../components/SpecialOfferBadge';
import { LockedOverlay } from '../../components/LockedOverlay';
import { useFavourites } from '../../context/FavouritesContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { CATEGORIES } from '../../constants/categories';
import { restorePurchases } from '../../services/revenuecat';

function getCategoryEmoji(category: string): string {
  return CATEGORIES.find(c => c.name === category)?.emoji || '🎉';
}

async function openUrl(url: string) {
  if (!url) return;
  const safe = url.startsWith('http') ? url : `https://${url}`;
  try {
    const canOpen = await Linking.canOpenURL(safe);
    if (canOpen) await Linking.openURL(safe);
  } catch {}
}

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isSubscribed, refresh } = useSubscription();
  const { isFavourite, toggleFavourite } = useFavourites();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllBusinesses()
      .then(all => setBusiness(all.find(b => b.id === id) || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleRestore = async () => {
    const success = await restorePurchases();
    if (success) { await refresh(); }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.orange} />
      </SafeAreaView>
    );
  }

  if (!business) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.notFound}>Business not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const fav = isFavourite(business.id);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Fixed overlay buttons — outside ScrollView so they don't scroll away */}
      <SafeAreaView style={styles.overlayButtons} edges={['top']} pointerEvents="box-none">
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => {
            if (!isSubscribed) { router.push('/paywall'); return; }
            toggleFavourite(business.id);
          }}
          >
          <Ionicons name={isFavourite(business.id) ? 'bookmark' : 'bookmark-outline'} size={20} color={isFavourite(business.id) ? colors.orange : colors.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          {business.primaryImage ? (
            <Image source={{ uri: business.primaryImage }} style={styles.heroImg} resizeMode="cover" />
          ) : (
            <LinearGradient colors={['#E8751A', '#C5601A']} style={styles.heroImg}>
              <Text style={{ fontSize: 60 }}>{getCategoryEmoji(business.category)}</Text>
            </LinearGradient>
          )}
        </View>

        <View style={styles.body}>
          {/* Badges */}
          <View style={styles.badgeRow}>
            {business.status === 'Premium' ? (
              <LinearGradient colors={['#E8751A', '#C5601A']} style={styles.tierBadge}>
                <Text style={styles.tierTextW}>⭐ Premium</Text>
              </LinearGradient>
            ) : business.status === 'Featured' ? (
              <View style={[styles.tierBadge, styles.featBadge]}>
                <Text style={[styles.tierTextW, styles.featText]}>Featured</Text>
              </View>
            ) : (
              <View style={[styles.tierBadge, styles.freeBadge]}>
                <Text style={[styles.tierTextW, styles.freeText]}>Free</Text>
              </View>
            )}
            {business.status === 'Premium' && <VerifiedBadge />}
            {business.specialOffer ? <SpecialOfferBadge /> : null}
          </View>

          <Text style={styles.name}>{business.name}</Text>
          <Text style={styles.catText}>
            {business.category}
            {business.address ? ` · ${business.address}` : ''}
          </Text>

          <View style={styles.divider} />

          {/* Special Offer Banner */}
          {business.specialOffer ? (
            <View style={styles.promoBanner}>
              <Text style={styles.promoBadgeText}>🔥 SPECIAL OFFER</Text>
              <Text style={styles.promoDesc}>{business.specialOfferDetails || business.specialOffer}</Text>
            </View>
          ) : null}

          {/* Phone / Address always visible */}
          {business.phone ? (
            <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`tel:${business.phone}`)}>
              <Text style={styles.infoIcon}>📞</Text>
              <Text style={[styles.infoText, styles.link]}>{business.phone}</Text>
            </TouchableOpacity>
          ) : null}
          {business.address ? (
            business.status !== 'Free' ? (
              <TouchableOpacity
                style={styles.infoRow}
                onPress={() => openUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`)}>
                <Text style={styles.infoIcon}>📍</Text>
                <Text style={[styles.infoText, styles.link]}>{business.address}</Text>
                <Ionicons name="map-outline" size={16} color={colors.orange} />
              </TouchableOpacity>
            ) : (
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📍</Text>
                <Text style={styles.infoText}>{business.address}</Text>
              </View>
            )
          ) : null}

          {/* Free listing locked */}
          {business.status === 'Free' && (
            <>
              <View style={styles.divider} />
              <LockedOverlay
                onSubscribe={() => router.push('/paywall')}
                onRestore={handleRestore}
              />
            </>
          )}

          {/* Subscribed + Premium/Featured */}
          {isSubscribed && business.status !== 'Free' && (
            <>
              {business.description ? (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.sectionLabel}>ABOUT</Text>
                  <Text style={styles.desc}>{business.description}</Text>
                </>
              ) : null}

              {business.additionalImages.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
                  {business.additionalImages.map((img, i) => (
                    <Image key={i} source={{ uri: img }} style={styles.thumb} resizeMode="cover" />
                  ))}
                </ScrollView>
              )}

              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>CONTACT & INFO</Text>

              {business.whatsapp ? (
                <TouchableOpacity style={styles.infoRow} onPress={() => openUrl(`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`)}>
                  <Text style={styles.infoIcon}>💬</Text>
                  <Text style={[styles.infoText, styles.link]}>WhatsApp</Text>
                </TouchableOpacity>
              ) : null}

              {business.status === 'Premium' && business.email ? (
                <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`mailto:${business.email}`)}>
                  <Text style={styles.infoIcon}>✉️</Text>
                  <Text style={[styles.infoText, styles.link]}>{business.email}</Text>
                </TouchableOpacity>
              ) : null}

              {business.status === 'Premium' && business.website ? (
                <TouchableOpacity style={styles.infoRow} onPress={() => openUrl(business.website)}>
                  <Text style={styles.infoIcon}>🌐</Text>
                  <Text style={[styles.infoText, styles.link]}>{business.website}</Text>
                </TouchableOpacity>
              ) : null}

              {business.status === 'Premium' && business.instagram ? (
                <TouchableOpacity style={styles.infoRow} onPress={() => openUrl(`https://instagram.com/${business.instagram.replace('@', '')}`)}>
                  <Text style={styles.infoIcon}>📷</Text>
                  <Text style={[styles.infoText, styles.link]}>@{business.instagram.replace('@', '')}</Text>
                </TouchableOpacity>
              ) : null}

              {business.status === 'Premium' && business.packages ? (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.sectionLabel}>PARTY PACKAGES</Text>
                  <View style={styles.pkgCard}>
                    <Text style={styles.pkgDesc}>{business.packages}</Text>
                  </View>
                </>
              ) : null}
            </>
          )}

          {/* Not subscribed + Premium/Featured */}
          {!isSubscribed && business.status !== 'Free' && (
            <>
              <View style={styles.divider} />
              <LockedOverlay
                onSubscribe={() => router.push('/paywall')}
                onRestore={handleRestore}
              />
            </>
          )}

          {/* CTAs */}
          <View style={styles.divider} />
          <View style={styles.ctaRow}>
            {business.email ? (
              <TouchableOpacity
                style={styles.ctaBtn}
                onPress={() => Linking.openURL(`mailto:${business.email}`)}
              >
                <LinearGradient colors={['#E8751A', '#C5601A']} style={styles.ctaGradient}>
                  <Text style={styles.ctaText}>📩 Enquire Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : null}
            {business.phone ? (
              <TouchableOpacity
                style={[styles.ctaBtn, styles.ctaOutline]}
                onPress={() => Linking.openURL(`tel:${business.phone}`)}
              >
                <Text style={styles.ctaOutlineText}>📞 Call {business.name}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  notFound: { fontSize: 14, color: colors.muted },
  backLink: { color: colors.orange, marginTop: 8, fontWeight: '600' },
  hero: { height: 220, position: 'relative' },
  heroImg: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  overlayButtons: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 14 },
  backBtn: { backgroundColor: colors.orange, width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', ...shadow },
  favBtn: { backgroundColor: colors.white, width: 36, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center', ...shadow },
  body: { padding: 18, paddingBottom: 40 },
  badgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', alignItems: 'center' },
  tierBadge: { borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 },
  tierTextW: { fontSize: 9, fontWeight: '700', color: colors.white, letterSpacing: 0.5, textTransform: 'uppercase' },
  featBadge: { backgroundColor: '#EEF4FF' },
  featText: { color: '#1565C0' },
  freeBadge: { backgroundColor: colors.orangePale },
  freeText: { color: colors.orangeDark },
  name: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 24, color: colors.black, lineHeight: 29, marginTop: 10 },
  catText: { fontSize: 13, color: colors.muted, fontWeight: '500', marginTop: 4 },
  divider: { borderTopWidth: 1, borderTopColor: colors.border, marginVertical: 16 },
  promoBanner: { backgroundColor: '#FFF8E1', borderWidth: 1, borderColor: '#FFD700', borderRadius: 11, padding: 12, paddingHorizontal: 15, marginBottom: 12 },
  promoBadgeText: { fontSize: 10, fontWeight: '700', color: '#7A5000', letterSpacing: 0.5, textTransform: 'uppercase' },
  promoDesc: { fontSize: 12, color: colors.text, marginTop: 4, lineHeight: 19 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoIcon: { fontSize: 15, width: 26, textAlign: 'center' },
  infoText: { fontSize: 13, color: colors.text, fontWeight: '600', flex: 1 },
  link: { color: colors.orange },
  sectionLabel: { fontWeight: '700', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: colors.muted, marginBottom: 10 },
  desc: { fontSize: 13, color: colors.muted, lineHeight: 22 },
  gallery: { marginTop: 12 },
  thumb: { width: 72, height: 72, borderRadius: 10, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  pkgCard: { borderWidth: 1, borderColor: colors.border, borderRadius: 11, padding: 13, paddingHorizontal: 15, backgroundColor: colors.orangeXPale, marginBottom: 9 },
  pkgDesc: { fontSize: 12, color: colors.muted, lineHeight: 19 },
  ctaRow: { gap: 8 },
  ctaBtn: { borderRadius: 10, overflow: 'hidden' },
  ctaGradient: { paddingVertical: 14, alignItems: 'center' },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  ctaOutline: { borderWidth: 2, borderColor: colors.orange, paddingVertical: 13, alignItems: 'center' },
  ctaOutlineText: { color: colors.orange, fontWeight: '700', fontSize: 14 },
});
