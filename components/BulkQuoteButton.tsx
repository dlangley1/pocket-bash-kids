import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../constants/theme';
import { getCognitoUrl } from '../constants/cognitoForms';
import { useSubscription } from '../context/SubscriptionContext';

interface Props {
  category: string;
  ageGroup?: string;
}

export function BulkQuoteButton({ category, ageGroup }: Props) {
  const url = getCognitoUrl(category, ageGroup);
  const { isSubscribed } = useSubscription();
  const router = useRouter();

  if (!url) return null;

  const handlePress = async () => {
    if (!isSubscribed) {
      router.push('/paywall');
      return;
    }
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch (e) {
      console.warn('Cannot open URL:', url);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View>
        <Text style={styles.main}>📩 Get Bulk Quotes</Text>
        <Text style={styles.sub}>Send one enquiry to multiple vendors</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    backgroundColor: colors.orangePale,
    borderRadius: 12,
    padding: 13,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.orangeLight,
  },
  main: { fontSize: 13, fontWeight: '700', color: colors.orangeDark },
  sub: { fontSize: 10, color: colors.muted, marginTop: 2 },
  arrow: { fontSize: 20, color: colors.orange, fontWeight: '700' },
});
