import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/theme';
import { useSubscription } from '../../context/SubscriptionContext';

const TOOLS = [
  { emoji: '💰', title: 'Budget Calculator', sub: 'Plan your party budget', route: '/guide/budget' },
  { emoji: '✅', title: 'Party Planning Checklist', sub: '16 tasks, 4 weeks out', route: '/guide/checklist' },
  { emoji: '❓', title: 'Questions to Ask Vendors', sub: '10 essential questions', route: '/guide/questions' },
];

export default function GuideScreen() {
  const router = useRouter();
  const { isSubscribed } = useSubscription();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerSub}>PARTY PLANNING</Text>
        <View style={styles.titleRow}>
          <Text style={styles.headerTitle}>Your </Text>
          <Text style={styles.headerItalic}>Guide</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Guide Hero */}
        <View style={styles.guideHero}>
          <Text style={styles.heroTag}>FREE PLANNING TOOLS</Text>
          <Text style={styles.heroTitle}>Everything you need to plan an epic kids party</Text>
          <Text style={styles.heroBody}>Budgets, checklists, vendor questions and more — all in one place.</Text>
          <Text style={styles.heroDecor}>🎉</Text>
        </View>

        <View style={styles.toolsList}>
          {TOOLS.map(tool => (
            <TouchableOpacity
              key={tool.route}
              style={[styles.toolCard, !isSubscribed && styles.toolCardLocked]}
              onPress={() => isSubscribed ? router.push(tool.route as any) : router.push('/paywall')}
            >
              <View style={styles.toolIcon}>
                <Text style={{ fontSize: 20 }}>{tool.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolSub}>{tool.sub}</Text>
              </View>
              {isSubscribed ? (
                <Text style={styles.arrow}>›</Text>
              ) : (
                <View style={styles.lockBadge}>
                  <Text style={{ fontSize: 14 }}>🔒</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Coming soon */}
          <View style={[styles.toolCard, styles.dimmed]}>
            <View style={styles.toolIcon}>
              <Text style={{ fontSize: 20 }}>🎨</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.toolTitle}>Theme Inspiration</Text>
              <Text style={styles.toolSub}>Coming soon</Text>
            </View>
          </View>
        </View>

        {!isSubscribed && (
          <TouchableOpacity style={styles.unlockBanner} onPress={() => router.push('/paywall')}>
            <Text style={styles.unlockText}>🔓 Subscribe to unlock all planning tools</Text>
          </TouchableOpacity>
        )}
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
  guideHero: { margin: 16, backgroundColor: colors.black, borderRadius: 16, padding: 26, paddingHorizontal: 22, position: 'relative', overflow: 'hidden' },
  heroTag: { fontSize: 9, fontWeight: '700', letterSpacing: 2.5, textTransform: 'uppercase', color: colors.orange, marginBottom: 10 },
  heroTitle: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 20, color: colors.white, lineHeight: 25 },
  heroBody: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 7, lineHeight: 19 },
  heroDecor: { position: 'absolute', right: 16, bottom: 10, fontSize: 64, opacity: 0.12 },
  toolsList: { paddingHorizontal: 16, gap: 10, paddingBottom: 24 },
  toolCard: { backgroundColor: colors.white, borderRadius: 12, padding: 15, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: colors.border },
  toolCardLocked: { opacity: 0.75 },
  toolIcon: { width: 44, height: 44, borderRadius: 11, backgroundColor: colors.orangePale, alignItems: 'center', justifyContent: 'center' },
  toolTitle: { fontWeight: '700', fontSize: 13, color: colors.black },
  toolSub: { fontSize: 11, color: colors.muted, marginTop: 2 },
  arrow: { color: '#CCC', fontSize: 22, fontWeight: '700' },
  lockBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.orangePale, alignItems: 'center', justifyContent: 'center' },
  dimmed: { opacity: 0.45 },
  unlockBanner: { marginHorizontal: 16, marginBottom: 24, backgroundColor: colors.orangePale, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.orangeLight },
  unlockText: { fontSize: 13, fontWeight: '700', color: colors.orangeDark },
});
