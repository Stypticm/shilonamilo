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
exports.onSendMessage = exports.offMessage = exports.onMessageRecieved = exports.offChatCreated = exports.onChatCreated = exports.onJoinChat = exports.initializeChatNamespace = void 0;
const socket_1 = require("../../../socket");
const chatActions_1 = require("../../../app/chats/chatActions");
const db_1 = __importDefault(require("../../../lib/prisma/db"));
const initializeChatNamespace = (io) => {
    const chatNamespace = io.of('/chat');
    chatNamespace.on('connection', (socket) => {
        console.log(`${socket.id} connected to chat namespace`);
        socket.on('subscribeToNotifications', (userId) => {
            console.log(`User subscribed to notifications: ${userId}`);
            socket.join(userId);
        });
        socket.on('joinChat', ({ chatId }) => {
            console.log(`User joined chat room: ${chatId}`);
            socket.join(chatId);
        });
        socket.on('createChat', (_a) => __awaiter(void 0, [_a], void 0, function* ({ user1Id, user2Id, lot1Id, lot2Id }) {
            try {
                const chat = yield (0, chatActions_1.createChat)(lot1Id, lot2Id, user1Id);
                const chatId = chat === null || chat === void 0 ? void 0 : chat.id;
                if (!(chat === null || chat === void 0 ? void 0 : chat.isNotificationSent)) {
                    yield db_1.default.chat.update({
                        where: { id: chatId },
                        data: {
                            isNotificationSent: true
                        }
                    });
                    chatNamespace.to(user2Id).emit('newNotification', {
                        type: 'chat',
                        data: {
                            chatId,
                            message: 'You added a new chat'
                        }
                    });
                }
                socket.emit('chatCreated', chatId);
            }
            catch (error) {
                console.error('Error creating chat:', error);
            }
        }));
        socket.on('sendMessage', (_b) => __awaiter(void 0, [_b], void 0, function* ({ chatId, senderId, content }) {
            try {
                const message = yield (0, chatActions_1.createChatMessage)(chatId, senderId, content);
                chatNamespace.to(chatId).emit('messageReceived', message);
                chatNamespace.to(chatId).emit('newNotification', {
                    type: 'message',
                    data: message
                });
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
const onJoinChat = (chatId) => {
    socket_1.chatSocket.emit('joinChat', { chatId });
};
exports.onJoinChat = onJoinChat;
const onChatCreated = (callback) => {
    socket_1.chatSocket.on('chatCreated', (chatId) => {
        callback(chatId);
    });
};
exports.onChatCreated = onChatCreated;
const offChatCreated = () => {
    socket_1.chatSocket.off('chatCreated');
};
exports.offChatCreated = offChatCreated;
const onMessageRecieved = (callback) => {
    socket_1.chatSocket.on('messageReceived', (data) => {
        callback(data);
    });
};
exports.onMessageRecieved = onMessageRecieved;
const offMessage = () => {
    socket_1.chatSocket.off('messageReceived');
};
exports.offMessage = offMessage;
const onSendMessage = (chatId, content, senderId) => {
    socket_1.chatSocket.emit('sendMessage', { chatId, content, senderId });
};
exports.onSendMessage = onSendMessage;
