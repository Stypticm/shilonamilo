'use server';

import prisma from '../../lib/prisma/db';
import { User } from '../../lib/interfaces';
import { getLotById } from '@/lib/features/server_requests/lots';
import { getUserByUid } from '@/lib/features/server_requests/user';

export const createChat = async (myLotId: string, partnerLotId: string, user1Id: string) => {
  let lot1Id = myLotId;
  let lot2Id = partnerLotId;

  try {
    // check availability of chat
    let chat = await prisma.chat.findFirst({
      where: {
        OR: [
          {
            lot1Id,
            lot2Id,
          },
          {
            lot1Id: partnerLotId,
            lot2Id: myLotId,
          },
        ],
      },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          lot1Id,
          lot2Id,
          messages: {
            create: {
              content: 'Chat started',
              senderId: user1Id,
            },
          },
          isNotificationSent: false,
        },
        include: {
          messages: true,
        },
      });
    }

    return chat;
  } catch (error) {
    console.error('Error creating chat:', error);
  }
};

export const getChatbyUserIdChatId = async (chatId: string) => {
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: true,
      },
    });
    return chat;
  } catch (error) {
    console.error('Error getting chat:', error);
  }
};

export const getAllMyChats = async (userId: string) => {
  try {
    const userLots = await prisma.lot.findMany({
      where: { userId: userId },
      select: { id: true },
    });

    const lotIds = userLots.map((lot) => lot.id);

    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ lot1Id: { in: lotIds } }, { lot2Id: { in: lotIds } }],
      },
    });

    const messages = await prisma.message.findMany({
      where: {
        chatId: {
          in: chats.map((chat) => chat.id),
        },
      },
    });

    const chatsWithCompanionLotId = chats.map(async (chat) => {
      const companionLotId = chat.lot1Id === userId ? chat.lot2Id : chat.lot1Id;
      const companionLotById = await getLotById(companionLotId as string);
      const companionObj = await getUserByUid(companionLotById?.userId as string);
      const messagesByChatId = messages.filter((message) => message.chatId === chat.id);

      return {
        ...chat,
        companionLotById,
        companionObj,
        lastMessage: messagesByChatId.at(-1)?.content,
      };
    });

    return Promise.all(chatsWithCompanionLotId);
  } catch (error) {
    console.error('Error getting chats:', error);
    return null;
  }
};

export const getParnerUserObj = async (userId: string): Promise<User | null> => {
  try {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstname: true,
        photoURL: true,
        email: true,
      },
    });

    return data as User;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const createChatMessage = async (chatId: string, userId: string, content: string) => {
  try {
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId: userId,
        content,
      },
    });

    return message;
  } catch (error) {
    console.error('Error creating message:', error);
    return null;
  }
};
