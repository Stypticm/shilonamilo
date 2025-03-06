'use server';

import { prisma } from '@/lib/prisma/client';

export const getUserChatsWithDetails = async (userId: string) => {
  try {
    const userLots = await prisma.lot.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    const lotIds = userLots.map((lot) => lot.id);

    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ lot1Id: { in: lotIds } }, { lot2Id: { in: lotIds } }],
      },
      include: {
        lot1: true,
        lot2: true,
        messages: true,
      },
    });

    const chatsWithCompanionLotId = await Promise.all(
      chats.map(async (chat) => {
        const companionLot = chat.lot1Id === userId ? chat.lot2 : chat.lot1;
        const companionUser = await prisma.user.findUnique({
          where: {
            id: companionLot?.userId as string,
          },
        });

        const lastMessage = chat.messages.length
          ? chat.messages[chat.messages.length - 1].content
          : null;

        return {
          ...chat,
          companionLot,
          companionUser,
          lastMessage,
        };
      }),
    );

    return chatsWithCompanionLotId;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw new Error('Error fetching chats');
  }
};

export const createChat = async (
  user1Id: string,
  user2Id: string,
  myLotId: string,
  partnerLotId: string,
) => {
  try {
    const existingChat = await prisma.chat.findFirst({
      where: {
        OR: [
          { lot1Id: myLotId, lot2Id: partnerLotId },
          { lot1Id: partnerLotId, lot2Id: myLotId },
        ],
      },
    });

    if (existingChat) {
      return existingChat;
    }

    const chat = await prisma.chat.create({
      data: {
        lot1Id: myLotId,
        lot2Id: partnerLotId,
        isNotificationSent: false,
        messages: {
          create: [
            {
              content: 'Chat started',
              senderId: user1Id,
            },
          ],
        },
      },
    });

    return chat;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw new Error('Error creating chat');
  }
};

export const getChatByUserIdChatId = async (chatId: string, userId: string) => {
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!chat) {
      throw new Error('Chat not found');
    }

    return {
      chat,
      messages: chat.messages,
    };
  } catch (error) {
    console.error('Error getting chat:', error);
    throw new Error('Error fetching chat');
  }
};

export const getPartnerUserObj = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstname: true,
        photoURL: true,
        email: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('Error getting partner user:', error);
    throw new Error('Error fetching partner user');
  }
};

export const createChatMessage = async (chatId: string, userId: string, content: string) => {
  try {
    const message = await prisma.message.create({
      data: {
        chatId,
        content,
        senderId: userId,
      },
    });

    return message;
  } catch (error) {
    console.error('Error creating message:', error);
    throw new Error('Error creating message');
  }
};

export const updateNotificationStatus = async (chatId: string) => {
  try {
    const chat = await prisma.chat.update({
      where: { id: chatId },
      data: { isNotificationSent: true },
    });

    if (!chat) {
      throw new Error('Chat not found');
    }

    return chat;
  } catch (error) {
    console.error('Error updating notification status:', error);
    throw new Error('Error updating notification status');
  }
};
