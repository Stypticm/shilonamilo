'use server'

import prisma from '@/lib/prisma/db';
import { unstable_noStore as noStore } from 'next/cache'

export const getDataOffers = async (userId: string) => {
    noStore();

    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    // try {
    //     const data = await prisma.proposal.findMany({
    //         where: {

    //         }
    //     })
    // } catch (error) {
        
    // }
}