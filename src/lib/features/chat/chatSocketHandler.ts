import { Server, Socket } from 'socket.io';
import prisma from '@/lib/prisma/client';

export const initializeChatNamespace = (io: Server) => {
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket: Socket) => {
    console.log(`${socket.id} connected to chat namespace`);

    socket.on('subscribeToNotifications', async (userId) => {
      console.log(`User subscribed to notifications: ${userId}`);
      socket.join(userId);
    });

    socket.on('joinChat', async ({ chatId }) => {
      console.log(`User joined chat room: ${chatId}`);
      socket.join(chatId);
    });

    socket.on('createChat', async ({ user1Id, user2Id, lot1Id, lot2Id }) => {
      try {
        const chat = await prisma.chat.create({
          data: {
            user1Id,
            user2Id,
            lot1Id,
            lot2Id,
          },
        });

        const chatId = chat.id;

        chatNamespace.to(user2Id).emit('newNotification', {
          type: 'chat',
          data: {
            chatId,
            message: 'You added a new chat',
          },
        });

        await prisma.notification.updateMany({
          where: { chatId },
          data: { status: 'read' },
        });

        socket.emit('chatCreated', chatId);
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    });

    socket.on('sendMessage', async ({ chatId, senderId, content }) => {
      try {
        const message = await prisma.message.create({
          data: {
            chatId,
            senderId,
            content,
          },
        });

        chatNamespace.to(chatId).emit('messageReceived', message);
        chatNamespace.to(chatId).emit('newNotification', {
          type: 'message',
          data: message,
        });

        // const updates = await getUpdates();

        // if (updates && updates.result.length > 0) {
        //   const chatIdTelegram = updates.result[0].message.chat.id;
        //   await sendTelegramMessage(chatIdTelegram, `New message: ${content}`);
        // } else {
        //   console.log('No updates found or updates are empty.');
        // }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('leaveChat', ({ userId }) => {
      console.log(`User left room: ${userId}`);
      socket.leave(userId);
    });
  });
};
