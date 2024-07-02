import prisma from '../prisma/db';
import { unstable_noStore as noStore } from 'next/cache'

export const getThing = async (thingId: string) => {
    noStore();
    const data = await prisma.thing.findUnique({
        where: {
            id: thingId
        },
        select: {
            id: true,
            userid: true,
            name: true,
            description: true,
            category: true,
            country: true,
            city: true,
            photothing: true,
            youneed: true,
            photoyouneed: true
        }
    })

    return data
}