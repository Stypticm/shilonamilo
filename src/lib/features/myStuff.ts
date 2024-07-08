'use server'

import prisma from '../prisma/db'

export const getMyStuff = (id: string) => {
    const data = prisma.lot.findMany({
        where: {
            userId: id
        }
    })

    return data
}

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

export const deleteLot = async (id: string) => {
    try {
        await prisma.lot.delete({
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
        const data = await prisma.lot.findUnique({
            where: {
                id: id
            }
        })

        return data
    } catch (error) {
        console.error('Error fetching thing:', error);
    }

}