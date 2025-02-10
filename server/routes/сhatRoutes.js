import express from 'express'
import chatController from '../controllers/chatController'

const router = express.Router()

router.get('/chat', chatController.getChatbyUserIdChatId)
router.get('/mychats', chatController.getAllmyChats)
router.post('/create-chat', chatController.createChat)
router.post(
  '/create-chat-message',
  chatController.createChatMessage
)
router.get('/partner-obj', chatController.getPartnerUserObj)

export default router
