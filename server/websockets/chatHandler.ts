import { Server, Socket } from 'socket.io'

// import { getUpdates, sendTelegramMessage } from '../bot/telegram';

export const initializeChatNamespace = (io: Server) => {
  const chatNamespace = io.of('/chat')

  chatNamespace.on('connection', (socket: Socket) => {
    console.log(`${socket.id} connected to chat namespace`)

    socket.on('subscribeToNotifications', (userId) => {
      console.log(
        `User subscribed to notifications: ${userId}`
      )
      socket.join(userId)
    })

    socket.on('joinChat', ({ chatId }) => {
      console.log(`User joined chat room: ${chatId}`)
      socket.join(chatId)
    })

    socket.on(
      'createChat',
      async ({ user1Id, user2Id, lot1Id, lot2Id }) => {
        try {
          const response = await fetch(
            'http://localhost:8080/api/create-chat',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user1Id,
                user2Id,
                lot1Id,
                lot2Id,
              }),
            }
          )

          if (!response.ok) {
            throw new Error('Failed to create chat')
          }

          const chat = await response.json()

          const chatId = chat?.id

          chatNamespace
            .to(user2Id)
            .emit('newNotification', {
              type: 'chat',
              data: {
                chatId,
                message: 'You added a new chat',
              },
            })

          const updateResponse = await fetch(
            'http://localhost:8080/api/update-notification-status',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                chatId,
              }),
            }
          )

          if (!updateResponse.ok) {
            throw new Error(
              'Failed to update notification status'
            )
          }

          socket.emit('chatCreated', chatId)
        } catch (error) {
          console.error('Error creating chat:', error)
        }
      }
    )

    socket.on(
      'sendMessage',
      async ({ chatId, senderId, content }) => {
        try {
          const response = await fetch(
            'http://localhost:8080/api/create-chat-message',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                chatId,
                senderId,
                content,
              }),
            }
          )

          if (!response.ok) {
            throw new Error('Failed to send message')
          }

          const message = await response.json()

          chatNamespace
            .to(chatId)
            .emit('messageReceived', message)

          chatNamespace.to(chatId).emit('newNotification', {
            type: 'message',
            data: message,
          })

          // const updates = await getUpdates();

          // if (updates && updates.result.length > 0) {
          //   const chatIdTelegram = updates.result[0].message.chat.id;
          //   await sendTelegramMessage(chatIdTelegram, `New message: ${content}`);
          // } else {
          //   console.log('No updates found or updates are empty.');
          // }
        } catch (error) {
          console.error('Error sending message:', error)
        }
      }
    )

    socket.on('leaveChat', ({ userId }) => {
      console.log(`User left room: ${userId}`)
      socket.leave(userId)
    })
  })
}
