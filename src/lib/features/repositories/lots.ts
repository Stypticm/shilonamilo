'use server';

import { prisma } from '@/lib/prisma/client';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { redirect } from 'next/navigation';
import { storage } from '@/lib/firebase/firebase';
import { IChat, ILot } from '@/lib/interfaces';
import { toast } from '@/lib/hooks/use-toast';
import { Router } from 'next/router';

export const getAllLots = async (userId?: string): Promise<ILot[]> => {
  try {
    if (userId) {
      const lots = await prisma.lot.findMany({
        where: {
          userId: {
            not: userId,
          },
        },
      });
      return lots;
    } else {
      const lots = await prisma.lot.findMany();
      return lots;
    }
  } catch (error) {
    throw new Error(`Failed to fetch all lots: ${error}`);
  }
};

export const getMyLots = async (userId: string): Promise<ILot[]> => {
  try {
    const lots = await prisma.lot.findMany({
      where: {
        userId,
      },
    });
    return lots;
  } catch (error) {
    throw new Error(`Failed to fetch my lots: ${error}`);
  }
};

export const createNewLot = async (formData: FormData) => {
  const userId = formData.get('lotId') as string;

  try {
    await prisma.lot.create({
      data: {
        userId,
      },
    });

    return { success: true, redirect: true };
  } catch (error) {
    throw new Error(`Failed to create lot: ${error}`);
  }
};

export const getLotById = async (lotId: string): Promise<ILot | null> => {
  try {
    const lot = await prisma.lot.findUnique({
      where: {
        id: lotId,
      },
    });
    return lot;
  } catch (error) {
    console.error('Error fetching lot:', error);
    return null;
  }
};

export const getLotByUserIdLotId = async (userId: string, lotId: string): Promise<boolean> => {
  try {
    const lot = await prisma.lot.findFirst({
      where: {
        userId,
        id: lotId,
      },
    });
    return lot !== null;
  } catch (error) {
    console.error('Error getting lot:', error);
    return false;
  }
};

export const updateLot = async (formData: FormData, lotId: string) => {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const photoLotFile = formData.get('photoLotFile') as File;
  const photoLotURL = formData.get('photoLotURL') as string;
  const exchangeOffer = formData.get('exchangeOffer') as string;

  try {
    const data = await prisma.lot.findUnique({
      where: { id: lotId },
      select: {
        name: true,
        description: true,
        photolot: true,
        exchangeOffer: true,
      },
    });

    const currentName = data?.name;
    const currentDescription = data?.description;
    const currentPhotoURL = data?.photolot;
    const currentExchangeOffer = data?.exchangeOffer;

    if (
      currentName === name &&
      currentDescription === description &&
      currentPhotoURL === currentPhotoURL &&
      currentExchangeOffer === exchangeOffer
    ) {
      return {
        success: true,
        text: 'Nothing changed',
      };
    } else if (
      currentName !== name ||
      currentDescription !== description ||
      currentPhotoURL !== currentPhotoURL ||
      currentExchangeOffer !== exchangeOffer
    ) {
      let photoURL = currentPhotoURL;

      if (photoLotFile) {
        if (photoLotFile && !currentPhotoURL) {
          const mountainsRef = ref(storage, `${lotId}/${photoLotFile.name}`);
          await uploadBytes(mountainsRef, photoLotFile);
          photoURL = await getDownloadURL(mountainsRef);
        }
      } else if (photoLotURL) {
        try {
          const response = await fetch(photoLotURL);
          const blob = await response.blob();
          const fileName = `externam-photo.${blob.type.split('/')[1]}`;
          const urlRef = ref(storage, `${lotId}/${fileName}`);
          await uploadBytes(urlRef, blob);
          photoURL = await getDownloadURL(urlRef);
        } catch (error) {
          console.log(error);
          return {
            error: 'Error uploading photo',
          };
        }
      }

      await prisma.lot.update({
        where: {
          id: lotId,
        },
        data: {
          name,
          description,
          photolot: photoURL,
          exchangeOffer,
        },
      });

      return { success: true, redirect: true };
    }
  } catch (error) {
    console.log(error);
    return { error: 'Error uploading photo' };
  }
};

export const deleteLot = async (id: string) => {
  try {
    await prisma.lot.delete({
      where: {
        id,
      },
    });
    return true;
  } catch (error) {
    console.error('Error deleting thing:', error);
  }
};

export const updateLotAction = async (formData: FormData, lotId: string, router: Router) => {
  formData.append('lotId', lotId);

  const result = await updateLot(formData, lotId);

  if (result?.error) {
    toast({
      description: result.error,
      title: 'Error',
      variant: 'destructive',
    });
  } else if (result?.text === 'Nothing changed') {
    router.push(`/lot/${lotId}`);
  } else if (result?.redirect) {
    router.push(`/lot/${lotId}`);
  }
};

export const getLotIds = async (chat: IChat, userId: string) => {
  try {
    if (!chat || !userId) {
      return { error: 'Chat and user ID are required.' };
    }

    const isUserOwnerOfLot = async (lotId: string) => {
      try {
        const lot = await prisma.lot.findUnique({
          where: { id: lotId },
        });
        return lot?.userId === userId;
      } catch (error) {
        console.error('Error in isUserOwnerOfLot:', error);
        return false;
      }
    };

    const isUserLot1Owner = await isUserOwnerOfLot(chat.lot1Id);
    const isUserLot2Owner = await isUserOwnerOfLot(chat.lot2Id);

    let myLotId = null;
    let partnerLotId = null;

    if (isUserLot1Owner) {
      myLotId = chat.lot1Id;
      partnerLotId = chat.lot2Id;
    } else if (isUserLot2Owner) {
      myLotId = chat.lot2Id;
      partnerLotId = chat.lot1Id;
    }

    return { myLotId, partnerLotId };
  } catch (error) {
    console.error('Error in getLotIds:', error);
    return { error: 'Error getting lots.' };
  }
};
