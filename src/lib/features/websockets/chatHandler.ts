import { Server, Socket } from 'socket.io';
import { chatSocket } from '../../../socket'
import { createChat, createChatMessage, getChatbyUserIdChatId } from '../../../app/chats/chatActions';
import prisma from '../../../lib/prisma/db';

export const initializeChatNamespace = (io: Server) => {
    const chatNamespace = io.of('/chat');

    chatNamespace.on('connection', (socket: Socket) => {
        console.log(`${socket.id} connected to chat namespace`);

        socket.on('subscribeToNotifications', (userId) => {
            console.log(`User subscribed to notifications: ${userId}`);
            socket.join(userId);
        })

        socket.on('joinChat', ({ chatId }) => {
            console.log(`User joined chat room: ${chatId}`);
            socket.join(chatId);
        })

        socket.on('createChat', async ({ user1Id, user2Id, lot1Id, lot2Id }) => {
            try {
                const chat = await createChat(lot1Id, lot2Id, user1Id);
                const chatId = chat?.id;

                if (!chat?.isNotificationSent) {
                    await prisma.chat.update({
                        where: { id: chatId },
                        data: {
                            isNotificationSent: true
                        }
                    })

                    chatNamespace.to(user2Id).emit('newNotification', {
                        type: 'chat',
                        data: {
                            chatId,
                            message: 'You added a new chat'
                        }
                    });
                }
                
                socket.emit('chatCreated', chatId);
            } catch (error) {
                console.error('Error creating chat:', error);
            }
        })


        socket.on('sendMessage', async ({ chatId, senderId, content }) => {
            try {
                const message = await createChatMessage(chatId, senderId, content);

                chatNamespace.to(chatId).emit('messageReceived', message);

                chatNamespace.to(chatId).emit('newNotification', {
                    type: 'message',
                    data: message
                });

            } catch (error) {
                console.error('Error sending message:', error);
            }
        })


        socket.on('leaveChat', ({ userId }) => {
            console.log(`User left room: ${userId}`);
            socket.leave(userId);
        })
    })
}

export const onJoinChat = (chatId: string) => {
    chatSocket.emit('joinChat', { chatId });
}

export const onChatCreated = (callback: (chatId: string) => void) => {
    chatSocket.on('chatCreated', (chatId: string) => {
        callback(chatId);
    });
};

export const offChatCreated = () => {
    chatSocket.off('chatCreated');
};

export const onMessageRecieved = (callback: (data: any) => void) => {
    chatSocket.on('messageReceived', (data: any) => {
        callback(data)
    })
}

export const offMessage = () => {
    chatSocket.off('messageReceived')
}

export const onSendMessage = (chatId: string, content: string, senderId: string) => {
    chatSocket.emit('sendMessage', { chatId, content, senderId })
}

