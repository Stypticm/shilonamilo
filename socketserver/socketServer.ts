import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { IChatMessage } from '@/lib/interfaces';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', async ({ chatId, senderId, content }: IChatMessage) => {
        try {
            const message = await prisma.message.create({
                data: {
                    chatId,
                    senderId,
                    content
                }
            });

            io.to(chatId).emit('message', message)
        } catch (error) {
            console.error('Error sending message:', error);
        }
    })

    socket.on('joinChat', (chatId: string) => {
        socket.join(chatId)
        console.log(`User joined chat: ${chatId}`);
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    })
})

server.listen(4000, () => console.log('Server running on port 4000'));