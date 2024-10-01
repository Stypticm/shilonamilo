'use client'

import { io } from "socket.io-client";


export const chatSocket = io('http://localhost:4000/chat', {
    withCredentials: true,
    transports: ['websocket'],
})

export const proposalSocket = io('http://localhost:4000/proposal', {
    withCredentials: true,
    transports: ['websocket'],
})

export const notificationSocket = io('http://localhost:4000/notification', {
    withCredentials: true,
    transports: ['websocket'],
})