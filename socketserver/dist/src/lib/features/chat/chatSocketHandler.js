"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeChatNamespace = void 0;
const client_1 = __importDefault(require("@/lib/prisma/client"));
const initializeChatNamespace = (io) => {
    const chatNamespace = io.of('/chat');
    chatNamespace.on('connection', (socket) => {
        console.log(`${socket.id} connected to chat namespace`);
        socket.on('subscribeToNotifications', (userId) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`User subscribed to notifications: ${userId}`);
            socket.join(userId);
        }));
        socket.on('joinChat', (_a) => __awaiter(void 0, [_a], void 0, function* ({ chatId }) {
            console.log(`User joined chat room: ${chatId}`);
            socket.join(chatId);
        }));
        socket.on('createChat', (_a) => __awaiter(void 0, [_a], void 0, function* ({ user1Id, user2Id, lot1Id, lot2Id }) {
            try {
                const chat = yield client_1.default.chat.create({
                    data: {
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
                // await prisma.notification.updateMany({
                //   where: { chatId },
                //   data: { status: 'read' },
                // });
                socket.emit('chatCreated', chatId);
            }
            catch (error) {
                console.error('Error creating chat:', error);
            }
        }));
        socket.on('sendMessage', (_a) => __awaiter(void 0, [_a], void 0, function* ({ chatId, senderId, content }) {
            try {
                const message = yield client_1.default.message.create({
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
            }
            catch (error) {
                console.error('Error sending message:', error);
            }
        }));
        socket.on('leaveChat', ({ userId }) => {
            console.log(`User left room: ${userId}`);
            socket.leave(userId);
        });
    });
};
exports.initializeChatNamespace = initializeChatNamespace;
