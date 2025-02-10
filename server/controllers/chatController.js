const db = require('../config/db')

const getAllmyChats = async (req, res) => {
  const { userId } = req.query
  try {
    const userLotsQuery = `
      SELECT id from "Lot"
      WHERE "userId" = $1
    `
    const userLotsResult = await db.query(userLotsQuery, [
      userId,
    ])

    const lotIds = userLotsResult.rows.map((lot) => lot.id)

    const chatsQuery = `
      SELECT * FROM "Chat"
      WHERE "lot1Id" IN ($1) OR "lot2Id" IN ($1)
    `
    const chatsResult = await db.query(chatsQuery, [lotIds])

    const chatIds = chatsResult.rows.map((chat) => chat.id)

    const messageQuery = `
      SELECT * FROM "Message"
      WHERE "chatId" IN ($1)
    `
    const messagesResult = await db.query(messageQuery, [
      chatIds,
    ])

    const chatsWithCompanionLotId = await Promise.all(
      chatsResult.rows.map(async (chat) => {
        const companionLotId =
          chat.lot1Id === userId ? chat.lot2Id : chat.lot1Id
        const companionLotQuery = `
          SELECT * FROM "Lot" WHERE "id" = $1 LIMIT 1
        `
        const companionLotResult = await db.query(
          companionLotQuery,
          [companionLotId]
        )
        const companionLotById = companionLotResult.rows[0]

        const companionUserQuery = `
          SELECT * FROM "User" WHERE "id" = $1 LIMIT 1
        `
        const companionUserResult = await db.query(
          companionUserQuery,
          [companionLotById.userId]
        )
        const companionObj = companionUserResult.rows[0]

        const messagesByChatId = messagesResult.rows.filter(
          (message) => message.chatId === chat.id
        )

        return {
          ...chat,
          companionLotById,
          companionObj,
          lastMessage: messagesByChatId.at(-1)?.content,
        }
      })
    )
    return res.status(200).json(chatsWithCompanionLotId)
  } catch (error) {
    console.error('Error fetching chats:', error)
    return res.status(500).json({ message: error.message })
  }
}

const createChat = async (req, res) => {
  const { myLotId, partnerLotId, user1Id } = req.body

  let lot1Id = myLotId
  let lot2Id = partnerLotId

  try {
    const chatCheckQuery = `
        SELECT * FROM "Chat"
        WHERE ("lot1Id" = $1 AND "lot2Id" = $2)
        OR ("lot1Id" = $3 AND "lot2Id" = $4)
        LIMIT 1
    `

    const chatCheckValues = [
      lot1Id,
      lot2Id,
      partnerLotId,
      myLotId,
    ]

    const chatCheckResult = await db.query(
      chatCheckQuery,
      chatCheckValues
    )

    if (chatCheckResult.rows.length === 0) {
      const chatCreateQuery = `
      INSERT INTO "Chat" ("lot1Id", "lot2Id", "isNotificationSent")
      VALUES ($1, $2, $3)
      RETURNING "id"
      `
      const createChatValues = [lot1Id, lot2Id, false]
      const chatCreateResult = await db.query(
        chatCreateQuery,
        createChatValues
      )
      const chatId = chatCreateResult.rows[0].id

      const createMessageQuery = `
      INSERT INTO "Message" ("chatId", "content", "senderId")
      VALUES ($1, $2, $3)
      RETURNING * 
      `
      const createMessageValues = [
        chatId,
        'Chat started',
        user1Id,
      ]
      await db.query(
        createMessageQuery,
        createMessageValues
      )

      const getChatResult = await db.query(
        chatCheckQuery,
        chatCheckValues
      )
      return res.status(201).json(getChatResult.rows[0])
    } else {
      return res.status(200).json(chatCheckResult.rows[0])
    }
  } catch (error) {
    console.error('Error creating chat:', error)
    return res
      .status(500)
      .json({ message: 'Error creating chat' })
  }
}

const getChatbyUserIdChatId = async (req, res) => {
  try {
    const { chatId } = req.query

    const chatQuery = `
        SELECT * FROM "Chat"
        WHERE "id" = $1
        LIMIT 1
    `
    const chatValues = [chatId]
    const chatResult = await db.query(chatQuery, chatValues)

    if (!chatResult.rows.length) {
      return res
        .status(404)
        .json({ message: 'Chat not found' })
    }

    const messageQuery = `
      SELECT * FROM "Message"
      WHERE "chatId" = $1
      ORDER BY "createdAt" ASC
    `
    const messagesResult = await db.query(
      messageQuery,
      chatValues
    )

    return res.status(200).json({
      chat: chatResult.rows[0],
      messages: messagesResult.rows,
    })
  } catch (error) {
    console.error('Error getting chat:', error)
    return res
      .status(500)
      .json({ message: 'Error fetching chat' })
  }
}

const getPartnerUserObj = async (req, res) => {
  const { userId } = req.query
  try {
    const userQuery = `
      SELECT id, firstname, "photoUrl", email FROM "User"
      WHERE "id" = $1
      LIMIT 1
    `
    const userResult = await db.query(userQuery, [userId])

    if (userResult.rows.length > 0) {
      return res.status(200).json(userResult.rows[0])
    } else {
      return res
        .status(404)
        .json({ message: 'User not found' })
    }
  } catch (error) {
    console.error('Error getting partner user:', error)
    return res
      .status(500)
      .json({ message: 'Error fetching partner user' })
  }
}

const createChatMessage = async (req, res) => {
  const { chatId, userId, content } = req.body
  try {
    const query = `
      INSERT INTO "Message" ("chatId", "content", "senderId")
      VALUES ($1, $2, $3)
      RETURNING *
    `
    const result = await db.query(query, [
      chatId,
      content,
      userId,
    ])
    return res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating message:', error)
    return res
      .status(500)
      .json({ message: 'Error creating message' })
  }
}

const updateNotificationStatus = async (req, res) => {
  const { chatId } = req.body
  try {
    const query = `
      UPDATE "Chat"
      SET "isNotificationSent" = true
      WHERE "id" = $1
      RETURNING *
    `

    const result = await db.query(query, [chatId])
    const updatedChat = result.rows[0]

    if (!updatedChat) {
      return res
        .status(404)
        .json({ message: 'Chat not found' })
    }

    return res.status(200).json(updatedChat)
  } catch (error) {
    console.error(
      'Error updating notification status:',
      error
    )
    return res.status(500).json({
      message: 'Error updating notification status',
    })
  }
}

module.exports = {
  createChat,
  getChatbyUserIdChatId,
  getAllmyChats,
  getPartnerUserObj,
  createChatMessage,
  updateNotificationStatus,
}
