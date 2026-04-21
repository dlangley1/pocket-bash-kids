import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../constants/theme';
import { getOfferings, purchasePackage, restorePurchases } from '../services/revenuecat';
import { useSubscription } from '../context/SubscriptionContext';
import { PurchasesPackage } from 'react-native-purchases';

const FEATURES = [
  'Full contact details for all businesses',
  'WhatsApp links to vendors',
  'Party packages and pricing',
  'Website and Instagram links',
  'Get Bulk Quotes from multiple vendors',
  'Save unlimited favourites',
  'Budget calculator and planning tools',
  'Party checklist and vendor questions guide',
];

export default function PaywallScreen() {
  const router = useRouter();
  const { refresh } = useSubscription();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    getOfferings().then(setPackages).catch(() => {});
  }, []);

  const handlePurchase = async () => {
    if (!packages[selectedIdx]) return;
    setPurchasing(true);
    const success = await purchasePackage(packages[selectedIdx]);
    if (success) { await refresh(); router.back(); }
    setPurchasing(false);
  };

  const handleRestore = async () => {
    setRestoring(true);
    const success = await restorePurchases();
    if (success) { await refresh(); router.back(); }
    setRestoring(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color={colors.white} />
        </TouchableOpacity>

        {/* Hero */}
        <LinearGradient colors={['#E8751A', '#C5601A']} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.heroEmoji}>🎉</Text>
          <Text style={styles.heroTitle}>Unlock Every Party Vendor in Pretoria</Text>
        </LinearGradient>

        {/* Features */}
        <View style={styles.features}>
          {FEATURES.map(f => (
            <View key={f} style={styles.featureRow}>
              <Text style={styles.featureCheck}>✅</Text>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Launch Banner */}
        <View style={styles.launchBanner}>
          <Text style={styles.launchText}>🎉 First month free for early subscribers</Text>
        </View>

        {/* Pricing Cards */}
        <View style={styles.pricingRow}>
          <TouchableOpacity
            style={[styles.priceCard, selectedIdx === 0 && styles.priceCardActive]}
            onPress={() => setSelectedIdx(0)}
          >
            <Text style={styles.priceTitle}>Monthly</Text>
            <Text style={styles.priceAmount}>R49</Text>
            <Text style={styles.pricePer}>/month</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.priceCard, styles.priceCardBest, selectedIdx === 1 && styles.priceCardActive]}
            onPress={() => setSelectedIdx(1)}
          >
            <View style={styles.bestBadge}><Text style={styles.bestText}>BEST VALUE</Text></View>
            <Text style={styles.priceTitle}>Annual</Text>
            <Text style={styles.priceAmount}>R399</Text>
            <Text style={styles.pricePer}>/year</Text>
            <Text style={styles.priceSave}>Save R189</Text>
          </TouchableOpacity>
        </View>

        {/* CTAs */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity onPress={handlePurchase} disabled={purchasing || packages.length === 0}>
            <LinearGradient colors={['#E8751A', '#C5601A']} style={styles.cta}>
              {purchasing ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.ctaText}>Start Free Trial →</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore} disabled={restoring}>
            <Text style={styles.restoreText}>{restoring ? 'Restoring…' : 'Restore Purchase'}</Text>
          </TouchableOpacity>

          <Text style={styles.legal}>
            Cancel anytime. Billed via Apple/Google. Price in South African Rand.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  closeBtn: { position: 'absolute', top: 16, left: 16, zIndex: 10, width: 42, height: 42, borderRadius: 12, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
  hero: { paddingTop: 60, paddingBottom: 32, paddingHorizontal: 24, alignItems: 'center' },
  heroEmoji: { fontSize: 48, marginBottom: 16 },
  heroTitle: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 24, color: colors.white, textAlign: 'center', lineHeight: 30 },
  features: { padding: 24, gap: 12 },
  featureRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  featureCheck: { fontSize: 14 },
  featureText: { fontSize: 14, color: colors.text, flex: 1, fontFamily: 'Inter_500Medium', lineHeight: 20 },
  launchBanner: { marginHorizontal: 24, backgroundColor: '#FFF8E1', borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#FFD700' },
  launchText: { fontSize: 13, fontWeight: '700', color: '#7A5000' },
  pricingRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginTop: 20 },
  priceCard: { flex: 1, backgroundColor: colors.bg, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 2, borderColor: colors.border, position: 'relative' },
  priceCardBest: { borderColor: colors.orange },
  priceCardActive: { borderColor: colors.orange, backgroundColor: colors.orangePale },
  bestBadge: { position: 'absolute', top: -10, backgroundColor: colors.orange, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  bestText: { fontSize: 9, fontWeight: '700', color: colors.white, letterSpacing: 0.5 },
  priceTitle: { fontSize: 12, fontWeight: '700', color: colors.muted, marginBottom: 4 },
  priceAmount: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 28, color: colors.orange },
  pricePer: { fontSize: 11, color: colors.muted },
  priceSave: { marginTop: 4, fontSize: 11, fontWeight: '700', color: colors.orangeDark },
  ctaContainer: { padding: 24, gap: 0 },
  cta: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 8 },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  restoreBtn: { paddingVertical: 14, alignItems: 'center' },
  restoreText: { color: colors.orange, fontWeight: '600', fontSize: 14 },
  legal: { fontSize: 11, color: colors.muted, textAlign: 'center', lineHeight: 17, marginTop: 8 },
});
