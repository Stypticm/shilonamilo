'use server'

import prisma from '@/lib/prisma/db';
import { unstable_noStore as noStore } from 'next/cache'

export const createChat = async (myLotId: string, partnerLotId: string, userId: string) => {
    noStore();
    try {
        const chat = await prisma.chat.create({
            data: {
                myLotId,
                partnerLotId,
                messages: {
                    create: {
                        content: "Chat started",
                        senderId: userId
                    }
                }
            },
            include: {
                messages: true
            }
        })

        return chat
    } catch (error) {
        console.error('Error creating chat:', error);
    }
}