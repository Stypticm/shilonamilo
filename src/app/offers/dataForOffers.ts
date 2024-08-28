'use server'

import prisma from '@/lib/prisma/db';
import { unstable_noStore as noStore } from 'next/cache'

export const getLotsWithOffers = async (userId: string) => {
    noStore();

    try {
        const lots = await prisma.lot.findMany({
            where: {
                userId: userId
            },
            include: {
                Proposal: {
                    include: {
                        offeredLot: true
                    }
                }
            }
        })

        const lotsWithOffers = lots.filter((lot) => lot.Proposal.length > 0);

        return lotsWithOffers
    } catch (error) {
        throw new Error(`Failed to fetch favorites: ${error}`)
    }
}
