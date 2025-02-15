'use client';

import { User as CurrentUser, ILot } from '@/lib/interfaces';
import {
  addToFavorite,
  getFavorites,
  removeFromFavorite,
} from '@/lib/features/repositories/favorites';

export const fetchFavorites = async (
  user: Pick<CurrentUser, 'uid'>,
  setFavorites: React.Dispatch<React.SetStateAction<ILot[]>>,
) => {
  try {
    const data = await getFavorites(user?.uid as string);
    setFavorites(data as ILot[]);
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
  }
};

export const handleFavoriteToggle = async (
  isFavorite: boolean,
  id: string,
  userId: string,
  pathName: string,
  setIsFavorite: React.Dispatch<React.SetStateAction<boolean>>,
  updateFavorites?: () => void,
) => {
  try {
    if (isFavorite) {
      await removeFromFavorite(id, userId, pathName);
    } else {
      await addToFavorite(id, userId, pathName);
    }
    setIsFavorite(!isFavorite);
    updateFavorites?.();
  } catch (error) {
    console.error(
      isFavorite ? 'Failed to remove from favorite' : 'Failed to add to favorite:',
      error,
    );
  }
};
