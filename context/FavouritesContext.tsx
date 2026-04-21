import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getFavourites, toggleFavourite as toggleFav } from '../services/favourites';

interface FavouritesContextValue {
  favouriteIds: string[];
  toggleFavourite: (id: string) => Promise<void>;
  isFavourite: (id: string) => boolean;
}

const FavouritesContext = createContext<FavouritesContextValue>({
  favouriteIds: [],
  toggleFavourite: async () => {},
  isFavourite: () => false,
});

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);

  useEffect(() => {
    getFavourites().then(setFavouriteIds).catch(() => {});
  }, []);

  const toggleFavourite = async (id: string) => {
    const updated = await toggleFav(id);
    setFavouriteIds(updated);
  };

  const isFavourite = (id: string) => favouriteIds.includes(id);

  return (
    <FavouritesContext.Provider value={{ favouriteIds, toggleFavourite, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  return useContext(FavouritesContext);
}
