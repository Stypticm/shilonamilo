'use server'

import prisma from './prisma/db'
import countryList from 'react-select-country-list'
import { City } from 'country-state-city'

export const allCategories = async () => {
    const data = await prisma.category.findMany()
    return data
}

export const choosedCategory = async (id: string) => {
    const data = await prisma.lot.findUnique({
        where: {
            id
        },
        select: {
            category: true
        }
    })
    return data?.category
}

export const choosedDescription = async (id: string) => {
    const data = await prisma.lot.findUnique({
        where: {
            id
        },
        select: {
            name: true,
            description: true,
            photolot: true
        }
    })
    return data
}

// export const choosedIneed = async (id: string) => {
//     const data = await prisma.lot.findUnique({
//         where: {
//             id
//         },
//         select: {

//             photoyouneed: true
//         }
//     })
//     return data
// }

export const allCountries = async () => {
    const data = countryList().getData()
    return data.map(country => ({ value: country.value, label: country.label }))
}

export const citiesOfCountry = async (countryCode: string) => {
    const data = City.getCitiesOfCountry(countryCode)
    return data?.map(city => ({ value: city.name, label: city.name }))
}

export const getAllLots = async (userId?: string) => {
    try {
        if (userId) {
            const currentLots = await prisma.lot.findMany({
                where: {
                    userId: {
                        not: userId
                    },
                    addedcategory: true,
                    addeddescription: true,
                    addedlocation: true,
                }

                // include: {
                //     Favorite: {
                //         where: {
                //             userId: userId ?? undefined
                //         },
                //         select: {
                //             id: true,
                //             userId: true,
                //             lotId: true,
                //         }
                //     }
                // }
            });

            // const mappedThings = allLots.map(lot => ({
            //     ...lot,
            //     isInFavoriteList: lot.Favorite.length > 0
            // }));

            return currentLots;
        } else {
            const allLots = await prisma.lot.findMany({
                where: {
                    addedcategory: true,
                    addeddescription: true,
                    addedlocation: true,
                }
            });
            return allLots
        }

    } catch (error) {
        throw new Error(`Failed to fetch all lots: ${error}`);
    }
}

export const getFavorites = async (userId: string) => {
    try {
        const data = await prisma.favorite.findMany({
            where: {
                userId: userId
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
                        Favorite: true
                    }
                }
            }
        })

        return data
    } catch (error) {
        throw new Error(`Failed to fetch favorites: ${error}`)
    }
}