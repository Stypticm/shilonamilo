'use server'

import prisma from './prisma/db'
import countryList from 'react-select-country-list'
import { City } from 'country-state-city'
import { auth } from './firebase/firebase'
import { onAuthStateChanged } from '@firebase/auth'

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

export const getAllThings = async () => {
    const data = await prisma.thing.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            category: true,
            country: true,
            city: true,
            photothing: true,
            youneed: true,
            photoyouneed: true,
            addedlocation: true,
            addedyouneed: true,
            addeddescription: true,
            addedcategory: true
        }
    })

    const filteredData = data.filter(thing => thing.addedlocation && thing.addedyouneed && thing.addeddescription && thing.addedcategory)
    return { filteredData }
}