"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const proposalHandler_1 = require("../src/lib/features/websockets/proposalHandler");
const chatHandler_1 = require("../src/lib/features/websockets/chatHandler");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const corsObj = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
};
app.use((0, cors_1.default)(corsObj));
app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});
const io = new socket_io_1.Server(server, { cors: corsObj });
(0, chatHandler_1.initializeChatNamespace)(io);
(0, proposalHandler_1.initializeProposalNamespace)(io);
server.listen(4000, () => console.log('Server running on port 4000'));
