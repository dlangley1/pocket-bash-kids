import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, ScrollView, FlatList, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet, Dimensions, Modal, Pressable, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { fetchAllBusinesses, Business } from '../../services/airtable';
import { colors, shadow } from '../../constants/theme';
import { CATEGORIES } from '../../constants/categories';
import { FeaturedCard } from '../../components/FeaturedCard';
import { BusinessCard } from '../../components/BusinessCard';
import { useFavourites } from '../../context/FavouritesContext';
import { useSubscription } from '../../context/SubscriptionContext';

const FEAT_FILTER_CHIPS = ['All', 'Venues', 'Cakes', 'Entertainment'];
const CHIP_MAP: Record<string, string> = {
  Venues: 'Party Venues',
  Cakes: 'Party Cakes',
  Entertainment: 'Party Entertainment',
};

export default function HomeScreen() {
  const router = useRouter();
  const { isSubscribed } = useSubscription();
  const { isFavourite, toggleFavourite } = useFavourites();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [featFilter, setFeatFilter] = useState('All');
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

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

  const specialOffers = useMemo(
    () => businesses.filter(b => b.specialOffer),
    [businesses]
  );

  const premiumBusinesses = useMemo(() => {
    const list = businesses.filter(b => b.status === 'Premium');
    if (featFilter === 'All') return list;
    const cat = CHIP_MAP[featFilter];
    return list.filter(b => b.categories.includes(cat));
  }, [businesses, featFilter]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of businesses) {
      for (const cat of b.categories) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    }
    return counts;
  }, [businesses]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return businesses.filter(
      b =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
    );
  }, [businesses, search]);

  const handleFavourite = (business: Business) => {
    if (!isSubscribed) {
      router.push('/paywall');
      return;
    }
    toggleFavourite(business.id);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.orange} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Couldn't load listings</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={load}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const premiumCount = businesses.filter(b => b.status === 'Premium').length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.logoSub}>KIDS PARTIES · PRETORIA</Text>
            <View style={styles.logoRow}>
              <Text style={styles.logoMain}>Pocket Bash </Text>
              <Text style={styles.logoItalic}>Kids</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellBtn}>
              <Text style={{ fontSize: 16 }}>🔔</Text>
            </TouchableOpacity>
            <LinearGradient colors={['#E8751A', '#C5601A']} style={styles.avatar}>
              <Ionicons name="person" size={18} color={colors.white} />
            </LinearGradient>
          </View>
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
      </View>

      {/* Search Results */}
      {search.trim().length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.searchResults}
          ListEmptyComponent={
            <Text style={styles.noResults}>No results for "{search}"</Text>
          }
          renderItem={({ item }) => (
            <BusinessCard
              business={item}
              isFavourite={isFavourite(item.id)}
              onFavouritePress={() => handleFavourite(item)}
            />
          )}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <LinearGradient colors={['#E8751A', '#C5601A']} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.heroTag}>PRETORIA · KIDS PARTIES</Text>
            <Text style={styles.heroTitle}>Plan Your Kids Party in 5 Minutes</Text>
            <Text style={styles.heroBody}>Venues, cakes, entertainment and more — all vetted and local.</Text>
            <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/(tabs)/listings')}>
              <Text style={styles.heroBtnText}>Browse Listings →</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Stats */}
          <View style={styles.stats}>
            <TouchableOpacity style={styles.stat} onPress={() => router.push('/(tabs)/listings')}>
              <Text style={styles.statNum}>{businesses.length}</Text>
              <Text style={styles.statLabel}>Businesses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.stat, styles.statBorder]} onPress={() => setShowCategoriesModal(true)}>
              <Text style={styles.statNum}>13</Text>
              <Text style={styles.statLabel}>Categories</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stat} onPress={() => setShowPremiumModal(true)}>
              <Text style={styles.statNum}>⭐ {premiumCount}</Text>
              <Text style={styles.statLabel}>Premium</Text>
            </TouchableOpacity>
          </View>

          {/* Special Offers */}
          {specialOffers.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔥 Special Offers</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/listings')}>
                  <Text style={styles.sectionLink}>View all →</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                data={specialOffers}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.hScroll}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <FeaturedCard business={item} showSpecialOffer />}
              />
            </>
          )}

          {/* Featured Listings */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Listings</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/listings')}>
              <Text style={styles.sectionLink}>View all →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {FEAT_FILTER_CHIPS.map(chip => (
              <TouchableOpacity
                key={chip}
                style={[styles.chip, featFilter === chip && styles.chipActive]}
                onPress={() => setFeatFilter(chip)}
              >
                <Text style={[styles.chipText, featFilter === chip && styles.chipTextActive]}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <FlatList
            horizontal
            data={premiumBusinesses}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.hScroll}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <FeaturedCard business={item} />}
          />

          {/* Browse by Category */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse by Category</Text>
          </View>
          <View style={styles.catGrid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.name}
                style={styles.catCard}
                onPress={() => router.push({ pathname: '/(tabs)/listings', params: { category: cat.name } })}
              >
                <View style={styles.catIcon}>
                  <Text style={{ fontSize: 18 }}>{cat.emoji}</Text>
                </View>
                <Text style={styles.catName}>{cat.name}</Text>
                <Text style={styles.catCount}>{categoryCounts[cat.name] || 0} listings</Text>
                <Text style={styles.catArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Premium Modal */}
      <Modal visible={showPremiumModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowPremiumModal(false)}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>⭐ Premium Listings</Text>
              <TouchableOpacity onPress={() => setShowPremiumModal(false)}>
                <Ionicons name="close" size={22} color={colors.muted} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={businesses.filter(b => b.status === 'Premium')}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={styles.premiumGrid}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16, paddingTop: 8 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.premiumCard}
                  onPress={() => { setShowPremiumModal(false); router.push(`/business/${item.id}`); }}
                >
                  {item.primaryImage ? (
                    <Image source={{ uri: item.primaryImage }} style={styles.premiumImg} resizeMode="cover" />
                  ) : (
                    <View style={[styles.premiumImg, styles.premiumImgFallback]}>
                      <Text style={{ fontSize: 22 }}>{CATEGORIES.find(c => c.name === item.category)?.emoji || '🎉'}</Text>
                    </View>
                  )}
                  <Text style={styles.premiumCardName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.premiumCardCat} numberOfLines={1}>{item.category}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Categories Modal */}
      <Modal visible={showCategoriesModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowCategoriesModal(false)}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>All Categories</Text>
              <TouchableOpacity onPress={() => setShowCategoriesModal(false)}>
                <Ionicons name="close" size={22} color={colors.muted} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.name}
                  style={styles.modalRow}
                  onPress={() => {
                    setShowCategoriesModal(false);
                    router.push({ pathname: '/(tabs)/listings', params: { category: cat.name } });
                  }}
                >
                  <View style={styles.modalRowIcon}>
                    <Text style={{ fontSize: 18 }}>{cat.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalRowName}>{cat.name}</Text>
                    <Text style={styles.modalRowCount}>{categoryCounts[cat.name] || 0} listings</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  errorText: { fontSize: 14, color: colors.muted, marginBottom: 12 },
  retryBtn: { backgroundColor: colors.orange, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  retryText: { color: colors.white, fontWeight: '700' },
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 18,
    paddingTop: 13,
    paddingBottom: 11,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoSub: { fontSize: 9, fontWeight: '700', letterSpacing: 3, textTransform: 'uppercase', color: colors.muted },
  logoRow: { flexDirection: 'row', alignItems: 'baseline' },
  logoMain: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 17, color: colors.black, lineHeight: 22 },
  logoItalic: { fontFamily: 'PlayfairDisplay_700Bold_Italic', fontSize: 17, color: colors.orange },
  headerRight: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  bellBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: colors.orangePale, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  searchWrap: {
    marginTop: 11,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 10,
  },
  searchIcon: { fontSize: 14, marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 13, color: colors.text, fontFamily: 'Inter_400Regular' },
  searchResults: { padding: 16, gap: 10 },
  noResults: { textAlign: 'center', color: colors.muted, marginTop: 40, fontSize: 13 },
  hero: { margin: 16, marginTop: 16, borderRadius: 16, padding: 26, paddingHorizontal: 22 },
  heroTag: { fontSize: 9, fontWeight: '700', letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 10 },
  heroTitle: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 21, color: colors.white, lineHeight: 26, maxWidth: 220 },
  heroBody: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 8, lineHeight: 19, maxWidth: 235 },
  heroBtn: { marginTop: 16, backgroundColor: colors.white, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 7, alignSelf: 'flex-start' },
  heroBtnText: { fontWeight: '700', fontSize: 12, color: colors.orangeDark },
  stats: { flexDirection: 'row', marginHorizontal: 16, marginTop: 14, backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  stat: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border },
  statNum: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 20, color: colors.orange },
  statLabel: { fontSize: 10, fontWeight: '600', color: colors.muted, marginTop: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },
  sectionTitle: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 16, color: colors.black },
  sectionLink: { fontSize: 12, fontWeight: '700', color: colors.orange },
  chips: { paddingHorizontal: 16, gap: 8 },
  chip: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white },
  chipActive: { backgroundColor: colors.orange, borderColor: colors.orange },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.muted },
  chipTextActive: { color: colors.white },
  hScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 13 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingBottom: 24, gap: 10 },
  catCard: { width: (Dimensions.get('window').width - 42) / 2, backgroundColor: colors.white, borderRadius: 13, padding: 14, borderWidth: 1, borderColor: colors.border, gap: 8, ...shadow },
  catIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.orangePale, alignItems: 'center', justifyContent: 'center' },
  catName: { fontWeight: '700', fontSize: 13, color: colors.black, lineHeight: 17 },
  catCount: { fontSize: 11, color: colors.muted, fontWeight: '500' },
  catArrow: { fontSize: 14, color: colors.orange, fontWeight: '700' },
  premiumGrid: { gap: 10, marginBottom: 10 },
  premiumCard: { flex: 1, backgroundColor: colors.white, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  premiumImg: { width: '100%', height: 100 },
  premiumImgFallback: { backgroundColor: colors.orangePale, alignItems: 'center', justifyContent: 'center' },
  premiumCardName: { fontSize: 12, fontWeight: '700', color: colors.black, paddingHorizontal: 8, paddingTop: 7 },
  premiumCardCat: { fontSize: 10, color: colors.muted, paddingHorizontal: 8, paddingBottom: 8, marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20, paddingBottom: 32, paddingTop: 8, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 4 },
  modalTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 17, color: colors.black },
  modalRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalRowIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: colors.orangePale, alignItems: 'center', justifyContent: 'center' },
  modalRowName: { fontSize: 14, fontWeight: '700', color: colors.black },
  modalRowCount: { fontSize: 11, color: colors.muted, marginTop: 1 },
});
