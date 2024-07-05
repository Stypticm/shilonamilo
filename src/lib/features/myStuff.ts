'use server'

import prisma from '../prisma/db'

export const getMyStuff = (id: string) => {
    const data = prisma.thing.findMany({
        where: {
            userid: id
        }
    })

    return data
}

export const findThingByUserIdAndThingId = async (userId: string, thingId: string) => {
    try {
        const data = await prisma.thing.findFirst({
            where: {
                id: thingId,
                userid: userId,
            },
        });

        return data !== null;
    } catch (error) {
        console.error('Error finding thing:', error);
        return false;
    }
};

export const deleteThing = async (id: string) => {
    try {
        await prisma.thing.delete({
            where: {
                id: id
            }
        })

        return true
    } catch (error) {
        console.error('Error deleting thing:', error);
    }
}

export const getThingById = async (id: string) => {
    try {
        const data = await prisma.thing.findUnique({
            where: {
                id: id
            }
        })

        return data
    } catch (error) {
        console.error('Error fetching thing:', error);
    }

}