import { chatSocket } from '@/socket'

export const joinChat = (chatId: string) => {
    chatSocket.emit('joinChat', chatId)
}

export const onMessageRecieved = (callback: (data: any) => void) => {
    chatSocket.on('messageReceived', (data: any) => {
        callback(data)
    })
}

export const offMessage = () => {
    chatSocket.off('messageReceived')
}

export const onSendMessage = (chatId: string, content: string, senderId: string) => {
    chatSocket.emit('sendMessage', { chatId, content, senderId })
}

export const onChatCreated = (callback: (chatId: string) => void) => {
    chatSocket.on('chatCreated', (chatId: string) => {
        callback(chatId);
    });
};

export const offChatCreated = () => {
    chatSocket.off('chatCreated');
};