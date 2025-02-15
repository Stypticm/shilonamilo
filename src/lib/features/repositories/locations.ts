'use server';

import prisma from '@/lib/prisma/client';
import countryList from 'react-select-country-list';
import { City } from 'country-state-city';

export const getAllCountries = async () => {
  const data = countryList().getData();
  return data.map((country) => ({
    value: country.value,
    label: country.label,
  }));
};

export const citiesOfCountry = async (countryCode: string) => {
  const data = City.getCitiesOfCountry(countryCode);
  return data?.map((city) => ({
    value: city.name,
    label: city.name,
  }));
};

export async function createLocation(formData: FormData) {
  const lotId = formData.get('lotId') as string;
  const country = formData.get('country') as string;
  const city = formData.get('city') as string;

  if (!country && !city) {
    return {
      error: 'Country and city fields must be filled',
    };
  }

  try {
    const currentData = await prisma.lot.findUnique({
      where: { id: lotId },
    });

    const currentCountry = currentData?.country;
    const currentCity = currentData?.city;

    if (currentCountry === country && currentCity === city) {
      return {
        success: true,
        text: 'Nothing changed',
      };
    } else if (currentCountry !== country || currentCity !== city) {
      await prisma.lot.update({
        where: {
          id: lotId,
        },
        data: {
          country: country,
          city: city,
          addedlocation: true,
        },
      });
      return { success: true, redirect: true };
    }
  } catch (error) {
    console.log(error);
    return { error: 'Wrong country or city' };
  }
}
