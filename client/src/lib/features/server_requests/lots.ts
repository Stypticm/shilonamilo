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

export const getLotById = async (lotId: string) => {
  try {
    const url = `http://localhost:8080/api/lots/${lotId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lot');
    }

    const lot = await response.json();

    return lot as ILot;
  } catch (error) {
    console.error('Error fetching thing:', error);
    return null;
  }
};

export const getLotByUserIdLotId = async (userId: string, lotId: string) => {
  try {
    const url = `http://localhost:8080/api/lots/lot-by-user-id-and-lot-id?userId=${userId}&lotId=${lotId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lot');
    }

    const data = await response.json();
    return data !== null;
  } catch (error) {
    console.error('Error getting lot:', error);
    return false;
  }
};

export async function updateLot(formData: FormData, lotId: string) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const photoLotFile = formData.get('photoLotFile') as File;
  const photoLotURL = formData.get('photoLotURL') as string;
  const exchangeOffer = formData.get('exchangeOffer') as string;

  try {
    const currentData = `http://localhost:8080/api/lots/${lotId}`;
    const response = await fetch(currentData, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lot');
    }

    const data = await response.json();

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

      const updateUrl = `http://localhost:8080/api/lot/${lotId}`;

      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          photoURL,
          exchangeOffer,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update lot');
      }

      return { success: true, redirect: true };
    }
  } catch (error) {
    console.log(error);
    return { error: 'Error uploading photo' };
  }
}

export const deleteLot = async (id: string) => {
  try {
    const url = `http://localhost:8080/api/lot/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      redirect('/');
      return { success: true };
    }
  } catch (error) {
    console.error('Error deleting thing:', error);
  }
};
