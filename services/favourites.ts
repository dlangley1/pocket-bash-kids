import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'pocket_bash_favourites';

export async function getFavourites(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function toggleFavourite(id: string): Promise<string[]> {
  const current = await getFavourites();
  const updated = current.includes(id)
    ? current.filter(x => x !== id)
    : [...current, id];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export async function isFavourite(id: string): Promise<boolean> {
  const current = await getFavourites();
  return current.includes(id);
}
