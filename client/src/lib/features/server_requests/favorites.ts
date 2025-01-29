'use server';

import prisma from '../../prisma/db';
import { revalidatePath } from 'next/cache';

export const getFavorites = async (userId: string) => {
  try {
    const data = await prisma.favorite.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        userId: true,
        lotId: true,
        createdAt: true,
        Lot: {
          select: {
            id: true,
            name: true,
            description: true,
            country: true,
            city: true,
            photolot: true,
            exchangeOffer: true,
            Favorite: true,
          },
        },
      },
    });

    return data;
  } catch (error) {
    throw new Error(`Failed to fetch favorites: ${error}`);
  }
};

export async function addToFavorite(lotId: string, userId: string, pathName: string) {
  try {
    await prisma.favorite.create({
      data: {
        lotId: lotId,
        userId: userId,
      },
    });
  } catch (error) {
    console.log(error);
    return { error: 'Error adding to favorite' };
  }
  revalidatePath(pathName);
}

export async function removeFromFavorite(lotId: string, userId: string, pathName: string) {
  try {
    await prisma.favorite.deleteMany({
      where: {
        lotId: lotId,
        userId: userId,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: 'Error removing from favorite',
    };
  }
  revalidatePath(pathName);
}
