import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/theme';

export default function BudgetScreen() {
  const router = useRouter();
  const [guests, setGuests] = useState(20);
  const [perChild, setPerChild] = useState(150);

  const total = guests * perChild;
  const venue = Math.round(total * 0.40);
  const catering = Math.round(total * 0.25);
  const entertainment = Math.round(total * 0.20);
  const decor = Math.round(total * 0.15);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Budget Calculator</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Guests */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderLabel}>
            <Text style={styles.labelText}>Number of Guests</Text>
            <Text style={styles.labelValue}>{guests}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={60}
            step={1}
            value={guests}
            onValueChange={v => setGuests(Math.round(v))}
            minimumTrackTintColor={colors.orange}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.orange}
          />
        </View>

        {/* Per Child */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderLabel}>
            <Text style={styles.labelText}>Budget per Child</Text>
            <Text style={styles.labelValue}>R{perChild}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={50}
            maximumValue={500}
            step={10}
            value={perChild}
            onValueChange={v => setPerChild(Math.round(v / 10) * 10)}
            minimumTrackTintColor={colors.orange}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.orange}
          />
        </View>

        {/* Breakdown */}
        <View style={styles.breakdownBox}>
          <Text style={styles.boxTag}>ESTIMATED TOTAL</Text>
          <Text style={styles.boxTotal}>R{total.toLocaleString()}</Text>
          <Text style={styles.boxSub}>{guests} guests @ R{perChild}/child</Text>
          <View style={styles.boxDivider} />
          <BudgetRow label="Venue (40%)" amount={venue} />
          <BudgetRow label="Catering (25%)" amount={catering} />
          <BudgetRow label="Entertainment (20%)" amount={entertainment} />
          <BudgetRow label="Décor & Extras (15%)" amount={decor} />
        </View>

        {/* Tip */}
        <View style={styles.tip}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            Book your venue first — it sets the date and guest limit for everything else.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BudgetRow({ label, amount }: { label: string; amount: number }) {
  return (
    <View style={styles.budgetRow}>
      <Text style={styles.budgetRowLabel}>{label}</Text>
      <Text style={styles.budgetRowAmount}>R{amount.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18, paddingVertical: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 20, color: colors.black },
  content: { padding: 18, gap: 20 },
  sliderSection: { backgroundColor: colors.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  sliderLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  labelText: { fontSize: 13, fontWeight: '600', color: colors.text },
  labelValue: { fontSize: 15, fontWeight: '700', color: colors.orange },
  slider: { width: '100%', height: 30 },
  breakdownBox: { backgroundColor: colors.black, borderRadius: 14, padding: 20 },
  boxTag: { fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' },
  boxTotal: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 38, color: colors.white, marginTop: 4 },
  boxSub: { fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  boxDivider: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', marginVertical: 14 },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  budgetRowLabel: { fontSize: 12, color: 'rgba(255,255,255,0.55)' },
  budgetRowAmount: { fontSize: 12, fontWeight: '700', color: colors.white },
  tip: { backgroundColor: colors.orangePale, borderRadius: 10, padding: 12, paddingHorizontal: 14, flexDirection: 'row', gap: 10 },
  tipIcon: { fontSize: 16 },
  tipText: { fontSize: 12, color: colors.orangeDark, fontWeight: '600', lineHeight: 19, flex: 1 },
});
