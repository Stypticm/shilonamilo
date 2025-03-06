import { Server } from 'socket.io';
import http from 'http';
import 'module-alias/register';
import { initializeChatNamespace } from '@/lib/features/chat/chatSocketHandler';
import { initializeProposalNamespace } from '@/lib/features/proposal/proposalSocketHandler';

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

initializeChatNamespace(io);
initializeProposalNamespace(io);

server.listen(4000, () => {
  console.log('WebSocket server running on ws://localhost:4000');
});
