'use server'

import prisma from './prisma/db'

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