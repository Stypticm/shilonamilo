"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
require("module-alias/register");
const chatSocketHandler_1 = require("@/lib/features/chat/chatSocketHandler");
const proposalSocketHandler_1 = require("@/lib/features/proposal/proposalSocketHandler");
const server = http_1.default.createServer();
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
(0, chatSocketHandler_1.initializeChatNamespace)(io);
(0, proposalSocketHandler_1.initializeProposalNamespace)(io);
server.listen(4000, () => {
    console.log('WebSocket server running on ws://localhost:4000');
});
