import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { fetchAllBusinesses, Business } from '../../services/airtable';
import { colors } from '../../constants/theme';
import { BusinessCard } from '../../components/BusinessCard';
import { useFavourites } from '../../context/FavouritesContext';
import { useSubscription } from '../../context/SubscriptionContext';

export default function SavedScreen() {
  const router = useRouter();
  const { isSubscribed } = useSubscription();
  const { favouriteIds, toggleFavourite } = useFavourites();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllBusinesses().then(setBusinesses).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const saved = businesses.filter(b => favouriteIds.includes(b.id));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerSub}>MY FAVOURITES</Text>
        <Text style={styles.headerTitle}>Saved Listings</Text>
      </View>

      {!isSubscribed ? (
        <View style={styles.gatedContainer}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.gatedTitle}>Subscribe to Save Favourites</Text>
          <Text style={styles.gatedSub}>Save your favourite party vendors and access them anytime.</Text>
          <TouchableOpacity onPress={() => router.push('/paywall')}>
            <LinearGradient colors={['#E8751A', '#C5601A']} style={styles.cta}>
              <Text style={styles.ctaText}>Subscribe from R49/month →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.orange} />
        </View>
      ) : saved.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔖</Text>
          <Text style={styles.emptyTitle}>No Saved Listings Yet</Text>
          <Text style={styles.emptySub}>Tap the bookmark icon on any listing to save it here.</Text>
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <BusinessCard
              business={item}
              isFavourite={true}
              onFavouritePress={() => toggleFavourite(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 18, paddingTop: 13, paddingBottom: 13 },
  headerSub: { fontSize: 9, fontWeight: '700', letterSpacing: 3, textTransform: 'uppercase', color: colors.muted },
  headerTitle: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 20, color: colors.black, marginTop: 2 },
  gatedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  lockIcon: { fontSize: 48, marginBottom: 16 },
  gatedTitle: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 20, color: colors.black, textAlign: 'center', marginBottom: 8 },
  gatedSub: { fontSize: 13, color: colors.muted, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  cta: { borderRadius: 10, paddingVertical: 14, paddingHorizontal: 24 },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontFamily: 'PlayfairDisplay_800ExtraBold', fontSize: 20, color: colors.black, marginBottom: 8 },
  emptySub: { fontSize: 13, color: colors.muted, textAlign: 'center', lineHeight: 20 },
  list: { padding: 16, gap: 10 },
});
