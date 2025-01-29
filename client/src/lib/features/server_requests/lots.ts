'use server';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import prisma from '@/lib/prisma/db';
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

export const getMyLots = async (id: string) => {
  const data = await prisma.lot.findMany({
    where: {
      userId: id,
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
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      exchangeOffer: true,
      photolot: true,
      country: true,
      city: true,
      createdAt: true,
      Proposal: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  return data;
};

export async function createNewLot({ userId }: { userId: string }) {
  const data = await prisma.lot.findFirst({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (data === null) {
    const data = await prisma.lot.create({
      data: {
        userId: userId,
      },
    });

    return redirect(`/create/${data.id}/structure`);
  } else if (!data.addedcategory && !data.addeddescription && !data.addedlocation) {
    return redirect(`/create/${data.id}/structure`);
  } else if (data.addedcategory && !data.addeddescription && !data.addedlocation) {
    return redirect(`/create/${data.id}/description`);
  } else if (!data.addedcategory && data.addeddescription && !data.addedlocation) {
    return redirect(`/create/${data.id}/location`);
  } else if (data.addedcategory && data.addeddescription && data.addedlocation) {
    const data = await prisma.lot.create({
      data: {
        userId: userId,
      },
    });
    return redirect(`/create/${data.id}/structure`);
  }
}

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

export const addProposal = async (lotId: string, myLotId: string) => {
  let logginedUserId;
  let itemUserId;

  try {
    logginedUserId = await prisma.lot.findUnique({
      where: {
        id: myLotId,
      },
    });
    itemUserId = await prisma.lot.findUnique({
      where: {
        id: lotId,
      },
    });
  } catch (error) {
    console.error('Error finding user:', error);
  }

  try {
    const data = await prisma.proposal.create({
      data: {
        lotId,
        offeredLotId: myLotId,
        status: 'pending',
        ownerIdOfTheLot: itemUserId?.userId,
        userIdOfferedLot: logginedUserId?.userId,
      },
    });

    await prisma.lot.update({
      where: {
        id: lotId,
      },
      data: {
        Proposal: {
          connect: {
            id: data.id,
          },
        },
      },
    });

    return data;
  } catch (error) {
    console.error('Error adding proposal:', error);
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
