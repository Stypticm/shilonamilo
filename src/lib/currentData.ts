'use server'

import prisma from './prisma/db'
import countryList from 'react-select-country-list'
import { City } from 'country-state-city'
import { unstable_noStore as noStore } from 'next/cache'

export const allCategories = async () => {
    const data = await prisma.categories.findMany()
    return data
}

export const choosedCategory = async (id: string) => {
    const data = await prisma.thing.findUnique({
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
    const data = await prisma.thing.findUnique({
        where: {
            id
        },
        select: {
            name: true,
            description: true,
            photothing: true
        }
    })
    return data
}

export const choosedIneed = async (id: string) => {
    const data = await prisma.thing.findUnique({
        where: {
            id
        },
        select: {
            youneed: true,
            photoyouneed: true
        }
    })
    return data
}

export const allCountries = async () => {
    const data = countryList().getData()
    return data.map(country => ({ value: country.value, label: country.label }))
}

export const citiesOfCountry = async (countryCode: string) => {
    const data = City.getCitiesOfCountry(countryCode)
    return data?.map(city => ({ value: city.name, label: city.name }))
}

export const getAllThings = async (userId?: string) => {
    noStore();
    try {
        const allThings = await prisma.thing.findMany({
            where: {
                addedcategory: true,
                addeddescription: true,
                addedlocation: true,
                addedyouneed: true,
            },
            include: {
                Favorite: {
                    where: {
                        userid: userId ?? undefined
                    },
                    select: {
                        id: true,
                        userid: true,
                        thingid: true,
                    }
                }
            }
        });

        const mappedThings = allThings.map(thing => ({
            ...thing,
            isInFavoriteList: thing.Favorite.length > 0
        }));

        return mappedThings

    } catch (error) {
        throw new Error(`Failed to fetch all things: ${error}`);
    }
}

export const getFavorites = async (userId: string) => {
    noStore();
    try {
        const data = await prisma.favorite.findMany({
            where: {
                userid: userId
            },
            select: {
                id: true,
                userid: true,
                thingid: true,
                createdat: true,
                Thing: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        country: true,
                        city: true,
                        photothing: true,
                        youneed: true,
                        photoyouneed: true,
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