import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/theme';
import { useSubscription } from '../../context/SubscriptionContext';
import { restorePurchases } from '../../services/revenuecat';

export default function ProfileScreen() {
  const router = useRouter();
  const { isSubscribed, refresh } = useSubscription();

  const handleRestore = async () => {
    await restorePurchases();
    await refresh();
  };

  const handleManageSubscription = async () => {
    const url = 'https://apps.apple.com/account/subscriptions';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerSub}>ACCOUNT</Text>
        <View style={styles.titleRow}>
          <Text style={styles.headerTitle}>Your </Text>
          <Text style={styles.headerItalic}>Profile</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <LinearGradient colors={['#E8751A', '#C5601A']} style={styles.avatar}>
          <Ionicons name="person" size={36} color={colors.white} />
        </LinearGradient>

        {!isSubscribed ? (
          <>
            <Text style={styles.name}>Guest User</Text>
            <Text style={styles.subText}>Subscribe to unlock all features</Text>
            <TouchableOpacity onPress={() => router.push('/paywall')}>
              <LinearGradient colors={['#E8751A', '#C5601A']} style={styles.cta}>
                <Text style={styles.ctaText}>Subscribe Now →</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineBtn} onPress={handleRestore}>
              <Text style={styles.outlineBtnText}>Restore Purchase</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.name}>Pocket Bash Member</Text>
            <Text style={styles.premiumText}>Premium subscriber</Text>
            <TouchableOpacity style={styles.menuRow} onPress={handleManageSubscription}>
              <Text style={styles.menuText}>Manage Subscription</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.menuRow} onPress={handleRestore}>
              <Text style={styles.menuText}>Restore Purchases</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </TouchableOpacity>
          </>
        )}

        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Pocket Bash Kids v1.0.0</Text>
          <Text style={styles.appInfoText}>A Discover Pretoria East product</Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:info@discoverpretoriaeast.co.za')}>
            <Text style={[styles.appInfoText, styles.emailLink]}>info@discoverpretoriaeast.co.za</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.getListedInfo}>
          <Text style={styles.appInfoText}>Want to get listed?</Text>
          <TouchableOpacity onPress={() => Linking.openURL('tel:0833103747')}>
            <Text style={[styles.appInfoText, styles.emailLink]}>083 310 3747</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/27615837180')}>
            <Text style={[styles.appInfoText, { color: '#25D366' }]}>061 583 7180 (WhatsApp)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 18, paddingTop: 13, paddingBottom: 13 },
  headerSub: { fontSize: 9, fontWeight: '700', letterSpacing: 3, textTransform: 'uppercase', color: colors.muted },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 2 },
  headerTitle: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 20, color: colors.black },
  headerItalic: { fontFamily: 'PlayfairDisplay_700Bold_Italic', fontSize: 20, color: colors.orange },
  content: { alignItems: 'center', padding: 24 },
  avatar: { width: 80, height: 80, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  name: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 22, color: colors.black, textAlign: 'center' },
  subText: { fontSize: 13, color: colors.muted, marginTop: 4 },
  premiumText: { fontSize: 13, color: colors.orange, fontWeight: '700', marginTop: 4 },
  cta: { borderRadius: 10, paddingVertical: 14, paddingHorizontal: 32, marginTop: 20 },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  outlineBtn: { borderWidth: 2, borderColor: colors.orange, borderRadius: 10, paddingVertical: 13, paddingHorizontal: 32, marginTop: 10 },
  outlineBtnText: { color: colors.orange, fontWeight: '700', fontSize: 14 },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, width: '100%' },
  menuText: { fontSize: 14, color: colors.text },
  divider: { width: '100%', height: 1, backgroundColor: colors.border },
  appInfo: { marginTop: 48, alignItems: 'center', gap: 4 },
  appInfoText: { fontSize: 12, color: colors.muted, textAlign: 'center' },
  emailLink: { color: colors.orange },
  getListedInfo: { marginTop: 16, alignItems: 'center', gap: 4 },
});
