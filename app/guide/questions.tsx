import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/theme';

const QUESTIONS = [
  { q: 'What is included in your party package?', why: 'Avoid surprise extras.' },
  { q: 'What is your cancellation and refund policy?', why: 'Life happens. Be protected.' },
  { q: 'How many children can you accommodate?', why: 'Critical for safety.' },
  { q: 'Is there parking available for guests?', why: 'Easy to overlook.' },
  { q: 'Do you handle setup and cleanup?', why: 'Saves hours of stress.' },
  { q: 'Can we bring our own cake and catering?', why: 'Watch for corkage fees.' },
  { q: 'Are there noise restrictions or a curfew?', why: 'Important for music plans.' },
  { q: 'What happens if it rains?', why: 'Always have a Plan B.' },
  { q: 'Do you have first aid and supervision staff?', why: 'Essential for play equipment.' },
  { q: 'Can I see photos of previous parties?', why: 'Real photos tell the truth.' },
];

export default function QuestionsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Questions to Ask</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {QUESTIONS.map((item, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.num}>{String(i + 1).padStart(2, '0')}</Text>
            <Text style={styles.question}>{item.q}</Text>
            <View style={styles.whyRow}>
              <Text style={styles.whyLabel}>Why it matters: </Text>
              <Text style={styles.whyText}>{item.why}</Text>
            </View>
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
  content: { padding: 16, gap: 10 },
  card: { backgroundColor: colors.white, borderRadius: 12, padding: 15, paddingHorizontal: 17, borderWidth: 1, borderColor: colors.border },
  num: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 28, color: colors.border, lineHeight: 34 },
  question: { fontSize: 13, fontWeight: '700', color: colors.black, marginTop: 3, lineHeight: 19 },
  whyRow: { flexDirection: 'row', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border, flexWrap: 'wrap' },
  whyLabel: { fontSize: 12, color: colors.orange, fontWeight: '700' },
  whyText: { fontSize: 12, color: colors.muted, lineHeight: 18, flex: 1 },
});
