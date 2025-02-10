"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationSocket = exports.proposalSocket = exports.chatSocket = void 0;
const socket_io_client_1 = require("socket.io-client");
exports.chatSocket = (0, socket_io_client_1.io)('http://localhost:4000/chat', {
    withCredentials: true,
    transports: ['websocket'],
});
exports.proposalSocket = (0, socket_io_client_1.io)('http://localhost:4000/proposal', {
    withCredentials: true,
    transports: ['websocket'],
});
exports.notificationSocket = (0, socket_io_client_1.io)('http://localhost:4000/notification', {
    withCredentials: true,
    transports: ['websocket'],
});
