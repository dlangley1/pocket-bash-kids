import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  ActivityIndicator, StyleSheet, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { fetchAllBusinesses, Business } from '../../services/airtable';
import { colors } from '../../constants/theme';
import { CATEGORIES, AGE_GROUPS } from '../../constants/categories';
import { BusinessCard } from '../../components/BusinessCard';
import { BulkQuoteButton } from '../../components/BulkQuoteButton';
import { useFavourites } from '../../context/FavouritesContext';
import { useSubscription } from '../../context/SubscriptionContext';

export default function ListingsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { isSubscribed } = useSubscription();
  const { isFavourite, toggleFavourite } = useFavourites();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAge, setSelectedAge] = useState<string>('All Ages');
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const AGE_CATEGORIES = ['Party Venues', 'Party Entertainment'];
  const showAgeFilter = AGE_CATEGORIES.includes(selectedCategory);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchAllBusinesses();
      setBusinesses(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useFocusEffect(
    useCallback(() => {
      setSelectedCategory(params.category || 'All');
      setSelectedAge('All Ages');
    }, [params.category])
  );

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedAge('All Ages');
  };

  const filtered = useMemo(() => {
    let list = businesses;
    if (selectedCategory !== 'All') {
      list = list.filter(b => b.categories.includes(selectedCategory));
    }
    if (showAgeFilter && selectedAge !== 'All Ages') {
      list = list.filter(b => b.ageGroups.length === 0 || b.ageGroups.includes(selectedAge));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.categories.some(c => c.toLowerCase().includes(q)) ||
        b.description.toLowerCase().includes(q) ||
        b.area.toLowerCase().includes(q)
      );
    }
    return list;
  }, [businesses, search, selectedCategory, selectedAge, showAgeFilter]);

  const handleFavourite = (business: Business) => {
    if (!isSubscribed) { router.push('/paywall'); return; }
    toggleFavourite(business.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSub}>DIRECTORY</Text>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Find a </Text>
          <Text style={styles.headerTitleItalic}>Vendor</Text>
        </View>
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search venues, cakes, entertainment…"
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.catDropdown} onPress={() => setShowCategoryPicker(true)}>
          <View style={styles.catDropdownLeft}>
            <Text style={styles.catDropdownLabel}>PARTY CATEGORY</Text>
            <Text style={styles.catDropdownValue}>
              {selectedCategory === 'All' ? 'All Categories' : `${CATEGORIES.find(c => c.name === selectedCategory)?.emoji} ${selectedCategory}`}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={18} color={colors.orange} />
        </TouchableOpacity>
      </View>

      {/* Age filter — only for Party Venues and Party Entertainment */}
      {showAgeFilter && (
        <View style={styles.ageSection}>
          <View style={styles.ageInstructionRow}>
            <Ionicons name="information-circle-outline" size={15} color={colors.orangeDark} />
            <Text style={styles.ageInstruction}>Choose your child's age group to filter listings</Text>
          </View>
          <TouchableOpacity style={styles.ageDropdown} onPress={() => setShowAgePicker(true)}>
            <View>
              <Text style={styles.ageDropdownLabel}>AGE GROUP</Text>
              <Text style={styles.ageDropdownValue}>{selectedAge}</Text>
            </View>
            <Ionicons name="chevron-down" size={18} color={colors.orange} />
          </TouchableOpacity>
        </View>
      )}

      <BulkQuoteButton category={selectedCategory} ageGroup={selectedAge} />

      <Modal visible={showCategoryPicker} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowCategoryPicker(false)}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Party Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                <Ionicons name="close" size={22} color={colors.muted} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => { handleCategorySelect('All'); setShowCategoryPicker(false); }}
            >
              <Text style={[styles.modalOptionText, selectedCategory === 'All' && styles.modalOptionActive]}>All Categories</Text>
              {selectedCategory === 'All' && <Ionicons name="checkmark" size={18} color={colors.orange} />}
            </TouchableOpacity>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.name}
                style={styles.modalOption}
                onPress={() => { handleCategorySelect(cat.name); setShowCategoryPicker(false); }}
              >
                <Text style={[styles.modalOptionText, selectedCategory === cat.name && styles.modalOptionActive]}>
                  {cat.emoji} {cat.name}
                </Text>
                {selectedCategory === cat.name && <Ionicons name="checkmark" size={18} color={colors.orange} />}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal visible={showAgePicker} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowAgePicker(false)}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Age Group</Text>
              <TouchableOpacity onPress={() => setShowAgePicker(false)}>
                <Ionicons name="close" size={22} color={colors.muted} />
              </TouchableOpacity>
            </View>
            {AGE_GROUPS.map(ag => (
              <TouchableOpacity
                key={ag}
                style={styles.modalOption}
                onPress={() => { setSelectedAge(ag); setShowAgePicker(false); }}
              >
                <Text style={[styles.modalOptionText, selectedAge === ag && styles.modalOptionActive]}>{ag}</Text>
                {selectedAge === ag && <Ionicons name="checkmark" size={18} color={colors.orange} />}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.orange} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Couldn't load listings</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={load}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.count}>{filtered.length} listings</Text>
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <BusinessCard
                business={item}
                isFavourite={isFavourite(item.id)}
                onFavouritePress={() => handleFavourite(item)}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>No listings found</Text>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 14, color: colors.muted, marginBottom: 12 },
  retryBtn: { backgroundColor: colors.orange, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  retryText: { color: colors.white, fontWeight: '700' },
  header: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 18, paddingTop: 13, paddingBottom: 13 },
  headerSub: { fontSize: 9, fontWeight: '700', letterSpacing: 3, textTransform: 'uppercase', color: colors.muted },
  headerTitleRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 2 },
  headerTitle: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 20, color: colors.black },
  headerTitleItalic: { fontFamily: 'PlayfairDisplay_700Bold_Italic', fontSize: 20, color: colors.orange },
  searchWrap: { marginTop: 11, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, borderRadius: 8, borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: 10 },
  searchIcon: { fontSize: 14, marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 13, color: colors.text, fontFamily: 'Inter_400Regular' },
  catDropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, backgroundColor: colors.bg, borderRadius: 10, borderWidth: 1.5, borderColor: colors.orange, paddingHorizontal: 14, paddingVertical: 12 },
  catDropdownLeft: { flex: 1 },
  catDropdownLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: colors.muted, marginBottom: 2 },
  catDropdownValue: { fontSize: 14, fontWeight: '700', color: colors.black },
  ageSection: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12 },
  ageInstructionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  ageInstruction: { fontSize: 12, color: colors.orangeDark, fontWeight: '600', flex: 1 },
  ageDropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bg, borderRadius: 10, borderWidth: 1.5, borderColor: colors.orange, paddingHorizontal: 14, paddingVertical: 12 },
  ageDropdownLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: colors.muted, marginBottom: 2 },
  ageDropdownValue: { fontSize: 14, fontWeight: '700', color: colors.black },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20, paddingBottom: 32, paddingTop: 8 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 4 },
  modalTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 17, color: colors.black },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalOptionText: { fontSize: 15, color: colors.text },
  modalOptionActive: { color: colors.orange, fontWeight: '700' },
  count: { fontSize: 11, color: colors.muted, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, fontFamily: 'Inter_500Medium' },
  list: { paddingHorizontal: 16, paddingBottom: 24, gap: 10 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40, fontSize: 13 },
});
