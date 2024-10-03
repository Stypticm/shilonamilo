"use strict";
'use server';
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
exports.createChatMessage = exports.getParnerUserObj = exports.getAllMyChats = exports.getChatbyUserIdChatId = exports.createChat = void 0;
const db_1 = __importDefault(require("../../lib/prisma/db"));
const createChat = (myLotId, partnerLotId, user1Id) => __awaiter(void 0, void 0, void 0, function* () {
    let lot1Id = myLotId;
    let lot2Id = partnerLotId;
    try {
        // check availability of chat
        let chat = yield db_1.default.chat.findFirst({
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
            chat = yield db_1.default.chat.create({
                data: {
                    lot1Id,
                    lot2Id,
                    messages: {
                        create: {
                            content: "Chat started",
                            senderId: user1Id
                        }
                    },
                    isNotificationSent: false
                },
                include: {
                    messages: true
                }
            });
        }
        return chat;
    }
    catch (error) {
        console.error('Error creating chat:', error);
    }
});
exports.createChat = createChat;
const getChatbyUserIdChatId = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield db_1.default.chat.findUnique({
            where: {
                id: chatId,
            },
            include: {
                messages: true
            }
        });
        return chat;
    }
    catch (error) {
        console.error('Error getting chat:', error);
    }
});
exports.getChatbyUserIdChatId = getChatbyUserIdChatId;
const getAllMyChats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userLots = yield db_1.default.lot.findMany({
            where: { userId: userId },
            select: { id: true },
        });
        console.log(userLots);
        const lotIds = userLots.map(lot => lot.id);
        const chats = yield db_1.default.chat.findMany({
            where: {
                OR: [
                    { lot1Id: { in: lotIds } },
                    { lot2Id: { in: lotIds } }
                ]
            },
        });
        return chats;
    }
    catch (error) {
        console.error('Error getting chats:', error);
        return null;
    }
});
exports.getAllMyChats = getAllMyChats;
const getParnerUserObj = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield db_1.default.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                firstname: true,
                photoURL: true,
                email: true
            }
        });
        return data;
    }
    catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
});
exports.getParnerUserObj = getParnerUserObj;
const createChatMessage = (chatId, userId, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield db_1.default.message.create({
            data: {
                chatId,
                senderId: userId,
                content
            }
        });
        return message;
    }
    catch (error) {
        console.error('Error creating message:', error);
        return null;
    }
});
exports.createChatMessage = createChatMessage;
