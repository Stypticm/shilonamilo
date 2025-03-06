import { chatSocket } from '../../../lib/socket';

export const onJoinChat = (chatId: string) => {
  chatSocket.emit('joinChat', { chatId });
};

export const onChatCreated = (callback: (chatId: string) => void) => {
  chatSocket.on('chatCreated', (chatId: string) => {
    callback(chatId);
  });
};

export const offChatCreated = () => {
  chatSocket.off('chatCreated');
};

export const onMessageReceived = (callback: (data: any) => void) => {
  chatSocket.on('messageReceived', (data: any) => {
    console.log('data onMessageReceived: ', data);
    callback(data);
  });
};

export const offMessage = () => {
  chatSocket.off('messageReceived');
};

export const onSendMessage = (chatId: string, content: string, senderId: string) => {
  chatSocket.emit('sendMessage', {
    chatId,
    content,
    senderId,
  });
};
