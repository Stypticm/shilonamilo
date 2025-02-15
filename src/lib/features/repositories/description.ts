'use server';

import { storage } from '../../firebase/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { prisma } from '@/lib/prisma/client';

export const getDescriptionByLotId = async (id: string) => {
  const data = await prisma.lot.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      description: true,
      photolot: true,
    },
  });
  return data;
};

export async function createDescription(formData: FormData) {
  const lotId = formData.get('lotId') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const photoLotFile = formData.get('photoLotFile') as File;
  const photoLotURL = formData.get('photoLotURL') as string;
  const exchange = formData.get('exchange') as string;

  if (!name || !description) {
    return {
      error: 'Name and description fields must be filled',
    };
  }

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
      currentExchangeOffer === exchange
    ) {
      return {
        success: true,
        text: 'Nothing changed',
      };
    } else if (
      currentName !== name ||
      currentDescription !== description ||
      currentPhotoURL !== currentPhotoURL ||
      currentExchangeOffer !== exchange
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
          exchangeOffer: exchange,
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
