'use server';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { redirect } from 'next/navigation';
import { storage } from '@/lib/firebase/firebase';
import { ILot } from '@/lib/interfaces';

export const getAllLots = async (userId?: string) => {
  try {
    let url = `http://localhost:8080/api/lots`;
    if (userId) {
      url += `?userId=${userId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lots');
      }

      const data = await response.json();

      return data.message || [];
    } else {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lots');
      }

      const data = await response.json();

      return data.message || [];
    }
  } catch (error) {
    throw new Error(`Failed to fetch all lots: ${error}`);
  }
};

export const getMyLots = async (userId: string) => {
  try {
    let url = `http://localhost:8080/api/lots/my-lots?userId=${userId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch my lots');
    }

    const data = await response.json();

    return data.message || [];
  } catch (error) {
    throw new Error(`Failed to fetch my lots: ${error}`);
  }
};

export const createNewLot = async (userId: string) => {
  try {
    const url = 'http://localhost:8080/api/lots/create-lot';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create lot');
    }

    const data = await response.json();

    if (data.redirect) {
      window.location.href = data.redirect;
    }
  } catch (error) {
    throw new Error(`Failed to create lot: ${error}`);
  }
};

export async function updateLot(formData: FormData, lotId: string) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const photoLotFile = formData.get('photoLotFile') as File;
  const photoLotURL = formData.get('photoLotURL') as string;
  const exchangeOffer = formData.get('exchangeOffer') as string;

  try {
    const currentData = await prisma.lot.findUnique({
      where: { id: lotId },
    });

    const currentName = currentData?.name;
    const currentDescription = currentData?.description;
    const currentPhotoURL = currentData?.photolot;
    const currentExchangeOffer = currentData?.exchangeOffer;

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
          name: name,
          description: description,
          photolot: photoURL,
          exchangeOffer: exchangeOffer,
          addeddescription: true,
        },
      });
      return { success: true, redirect: true };
    }
  } catch (error) {
    console.log(error);
    return { error: 'Error uploading photo' };
  }
}

export const deleteLot = async (id: string) => {
  try {
    await prisma.lot.delete({
      where: {
        id: id,
      },
    });

    return true;
  } catch (error) {
    console.error('Error deleting thing:', error);
  }
};

export const getLotById = async (lotId: string): Promise<ILot | null> => {
  try {
    const lot = await prisma.lot.findUnique({
      where: {
        id: lotId,
      },
      include: {
        Proposal: true,
        Offers: true,
      },
    });

    return lot as ILot;
  } catch (error) {
    console.error('Error fetching thing:', error);
    return null;
  }
};

export const getLotsByUserId = async (userId: string) => {
  try {
    const lots = await prisma.lot.findMany({
      where: {
        userId: userId,
        AND: [
          { name: { not: null } },
          { category: { not: null } },
          { description: { not: null } },
          { exchangeOffer: { not: null } },
          { photolot: { not: null } },
          { country: { not: null } },
          { city: { not: null } },
        ],
      },
      include: {
        Proposal: true,
        Offers: true,
      },
    });

    const lotsWithoutProposals = lots.filter((lot) => {
      return lot.Offers.length === 0;
    });

    return lotsWithoutProposals;
  } catch (error) {
    console.error('Error fetching lots by userId', error);
  }
};

export const findLotByUserIdAndLotId = async (userId: string, lotId: string) => {
  try {
    const data = await prisma.lot.findFirst({
      where: {
        id: lotId,
        userId: userId,
      },
    });

    return data !== null;
  } catch (error) {
    console.error('Error finding lot:', error);
    return false;
  }
};
