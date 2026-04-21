import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/theme';

const SECTIONS = [
  {
    label: '8 Weeks Out',
    items: ['Choose a theme', 'Set your budget', 'Book the venue', 'Create guest list'],
  },
  {
    label: '6 Weeks Out',
    items: ['Send invitations', 'Book entertainment', 'Order the cake', 'Plan the menu'],
  },
  {
    label: '2 Weeks Out',
    items: ['Confirm RSVPs', 'Buy party supplies', 'Plan party games', 'Confirm all bookings'],
  },
  {
    label: 'Week Of',
    items: ['Prepare goodie bags', 'Buy food & drinks', 'Venue walkthrough', 'Charge camera'],
  },
];

const ALL_ITEMS = SECTIONS.flatMap(s => s.items);

export default function ChecklistScreen() {
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (item: string) => {
    setChecked(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const doneCount = Object.values(checked).filter(Boolean).length;
  const progress = ALL_ITEMS.length > 0 ? doneCount / ALL_ITEMS.length : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Party Checklist</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressMeta}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressValue}>{doneCount}/{ALL_ITEMS.length} done</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {SECTIONS.map(section => (
          <View key={section.label} style={styles.section}>
            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>{section.label}</Text>
            </View>
            {section.items.map(item => (
              <TouchableOpacity key={item} style={styles.checkItem} onPress={() => toggle(item)}>
                <View style={[styles.checkbox, checked[item] && styles.checkboxChecked]}>
                  {checked[item] && <Text style={{ fontSize: 11, color: colors.white }}>✓</Text>}
                </View>
                <Text style={[styles.checkText, checked[item] && styles.checkTextDone]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18, paddingVertical: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 20, color: colors.black },
  content: { padding: 18, gap: 16 },
  progressSection: { backgroundColor: colors.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 12, fontWeight: '600', color: colors.text },
  progressValue: { fontSize: 12, fontWeight: '700', color: colors.orange },
  progressTrack: { backgroundColor: colors.border, borderRadius: 10, height: 6 },
  progressFill: { backgroundColor: colors.orange, borderRadius: 10, height: 6 },
  section: { backgroundColor: colors.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  sectionLabel: { backgroundColor: colors.black, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 5, alignSelf: 'flex-start', marginBottom: 10 },
  sectionLabelText: { fontSize: 10, fontWeight: '700', color: colors.white, letterSpacing: 0.5 },
  checkItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 11, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  checkbox: { width: 21, height: 21, borderRadius: 6, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxChecked: { backgroundColor: colors.orange, borderColor: colors.orange },
  checkText: { fontSize: 13, fontWeight: '500', color: colors.text, lineHeight: 18, flex: 1 },
  checkTextDone: { textDecorationLine: 'line-through', color: '#BBB' },
});
