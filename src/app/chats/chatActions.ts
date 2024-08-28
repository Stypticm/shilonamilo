'use server'

import prisma from '@/lib/prisma/db';
import { unstable_noStore as noStore } from 'next/cache'

export const createChat = async (myLotId: string, partnerLotId: string, userId: string) => {
    noStore();

    let lot1Id = myLotId
    let lot2Id = partnerLotId

    try {
        // check availability of chat
        let chat = await prisma.chat.findFirst({
            where: {
                OR: [
                    {
                        lot1Id,
                        lot2Id
                    },
                    {
                        lot1Id: partnerLotId,
                        lot2Id: myLotId
                    }
                ]
            }
        });

        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    lot1Id,
                    lot2Id,
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
            });
        }

        return chat

    } catch (error) {
        console.error('Error creating chat:', error);
    }
}

export const getChatbyUserIdChatId = async (chatId: string) => {
    noStore();
    try {
        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId,
            },
            include: {
                messages: true
            }
        })
        return chat
    } catch (error) {
        console.error('Error getting chat:', error);
    }
}

export const getAllMyChats = async (userId: string) => {
    noStore();
    try {

        const userLots = await prisma.lot.findMany({
            where: {
                userId: userId,
            },
            select: {
                id: true,
            },
        });

        const lotIds = userLots.map(lot => lot.id);

        const chats = await prisma.chat.findMany({
            where: {
                OR: [
                    {
                        lot1Id: {
                            in: lotIds,
                        },
                    },
                    {
                        lot2Id: {
                            in: lotIds,
                        },
                    }
                ]
            },
        })
        return chats
    } catch (error) {
        console.error('Error getting chat:', error);
    }
}


export const getParnerUserObj = async (userId: string) => {
    try {
        const data = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                firstname: true,
                photoURL: true,
                email: true
            }
        })

        return data
    } catch (error) {
        console.error('Error getting chat:', error);
    }
}