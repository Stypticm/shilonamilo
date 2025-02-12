const { query } = require('express')
const db = require('../config/db')

const getAllLots = async (req, res) => {
  try {
    const { userId } = req.query

    if (!userId) {
      let query = `
        SELECT * FROM "Lot"
        WHERE "addedcategory" = true 
        AND "addeddescription" = true 
        AND "addedlocation" = true
        `
      const result = await db.query(query)
      res.json({ message: result.rows })
    } else {
      let query = `
        SELECT * FROM "Lot"
        WHERE "addedcategory" = true 
        AND "addeddescription" = true 
        AND "addedlocation" = true
        `
      let values = []

      if (userId) {
        query += 'AND "userId" != $1'
        values.push(userId)
      }

      const result = await db.query(query, values)
      res.json({ message: result.rows })
    }
  } catch (error) {
    console.log('Error in getAllLots', error)
    res.status(500).json({
      message: 'Error fetching lots from database.',
    })
  }
}

const getMyLots = async (req, res) => {
  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required.',
      })
    }

    const query = `
      SELECT 
        "id", 
        "name", 
        "category", 
        "description", 
        "exchangeOffer", 
        "photolot", 
        "country", 
        "city", 
        "createdAt",
        "Proposal"."id" AS "proposalId", 
        "Proposal"."status" AS "proposalStatus"
      FROM "Lot"
      LEFT JOIN "Proposal" ON "Lot"."id" = "Proposal"."lotId"
      WHERE "Lot"."userId" = $1
        AND "Lot"."name" IS NOT NULL
        AND "Lot"."category" IS NOT NULL
        AND "Lot"."description" IS NOT NULL
        AND "Lot"."exchangeOffer" IS NOT NULL
        AND "Lot"."photolot" IS NOT NULL
        AND "Lot"."country" IS NOT NULL
        AND "Lot"."city" IS NOT NULL;
    `

    const values = [userId]
    const result = await db.query(query, values)

    res.json({ message: result.rows })
  } catch (error) {
    console.error('Error in getMyLots:', error)
    res.status(500).json({
      message: 'Error fetching lots from the database.',
    })
  }
}

const createNewLot = async (req, res) => {
  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required.',
      })
    }

    const query = `
      SELECT * FROM "Lot"
      WHERE "userId" = $1
      ORDER BY "createdAt" DESC
      LIMIT 1;
    `
    const values = [userId]

    const result = await db.query(query, values)

    let lot = result.rows[0]

    if (!lot) {
      const createQuery = `
        INSERT INTO "Lot" ("userId")
        VALUES ($1)
        RETURNING *;
      `
      const createResult = await db.query(createQuery, [
        userId,
      ])
      lot = createResult.rows[0]
    }

    if (
      !lot.addedcategory &&
      !lot.addeddescription &&
      !lot.addedlocation
    ) {
      return res.json({
        redirect: `/create/${lot.id}/structure`,
      })
    } else if (
      lot.addedcategory &&
      !lot.addeddescription &&
      !lot.addedlocation
    ) {
      return res.json({
        redirect: `/create/${lot.id}/description`,
      })
    } else if (
      !lot.addedcategory &&
      lot.addeddescription &&
      !lot.addedlocation
    ) {
      return res.json({
        redirect: `/create/${lot.id}/location`,
      })
    } else if (
      lot.addedcategory &&
      lot.addeddescription &&
      lot.addedlocation
    ) {
      const createQuery = `
        INSERT INTO "Lot" ("userId")
        VALUES ($1)
        RETURNING *;
      `

      const createResult = await db.query(createQuery, [
        userId,
      ])
      lot = createResult.rows[0]
      return res.json({
        redirect: `/create/${lot.id}/structure`,
      })
    }
  } catch (error) {
    console.error('Error in createNewLot:', error)
    res.status(500).json({
      message: 'Error creating new lot.',
    })
  }
}

const getLotById = async (req, res) => {
  try {
    const { lotId } = req.params

    if (!lotId) {
      return res.status(400).json({
        message: 'Lot ID is required.',
      })
    }

    const query = `
      SELECT l.*, 
      json_agg(DISTINCT p.*) AS "Proposal",
      json_agg(DISTINCT o.*) AS "Offers"
      FROM "Lot" l
      LEFT JOIN "Proposal" p ON l."id" = p."lotId"
      LEFT JOIN "Offers" o ON l."id" = o."lotId"
      WHERE l."id" = $1
      GROUP BY l."id";
      `

    const values = [lotId]
    const result = await db.query(query, values)

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Lot not found.',
      })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error in getLotById:', error)
    res.status(500).json({
      message: 'Error getting lot.',
    })
  }
}

const getLotIds = async (req, res) => {
  try {
    const { chat, userId } = req.query

    if (!chat || !userId) {
      return res.status(400).json({
        message: 'Chat and user ID are required.',
      })
    }

    const isUserOwnerOfLot = async (lotId) => {
      try {
        const lot = await getLotById(
          {
            query: { lotId },
          },
          { json: (data) => data }
        )
        return lot?.userId === userId
      } catch (error) {
        console.error('Error in isUserOwnerOfLot:', error)
        return false
      }
    }

    const isUserLot1Owner = isUserOwnerOfLot(chat.lot1Id)
    const isUserLot2Owner = isUserOwnerOfLot(chat.lot2Id)

    let myLotId = null
    let partnerLotId = null

    if (isUserLot1Owner) {
      myLotId = chat.lot1Id
      partnerLotId = chat.lot2Id
    } else if (isUserLot2Owner) {
      myLotId = chat.lot2Id
      partnerLotId = chat.lot1Id
    }

    return { myLotId, partnerLotId }
  } catch (error) {
    console.error('Error in getLotsIds:', error)
    res.status(500).json({
      message: 'Error getting lots.',
    })
  }
}

const getLotOwner = async (req, res) => {
  try {
    const { lotId, ownerIdOfTheLot } = req.query

    const query = `
      SELECT * FROM "Proposal"
      WHERE "lotId" = $1
      AND "ownerIdOfTheLot" = $2
      LIMIT 1
    `
    const values = [lotId, ownerIdOfTheLot]

    const result = await db.query(query, values)

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Lot not found',
      })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error getting lot owner:', error)
    res.status(500).json({
      message: 'Error getting lot owner',
    })
  }
}

const getLotByUserIdLotId = async (req, res) => {
  try {
    const { userId, lotId } = req.query
    const query = `
      SELECT * FROM "Lot"
      WHERE "userId" = $1
      AND "id" = $2
      LIMIT 1
    `
    const values = [userId, lotId]
    const result = await db.query(query, values)

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Lot not found',
      })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(
      'Error getting lot by userId and lotId:',
      error
    )
    res.status(500).json({
      message: 'Error getting lot by userId and lotId',
    })
  }
}

const deleteLot = async (req, res) => {
  try {
    const { lotId } = req.params
    const query = `DELETE FROM "Lot" WHERE "id" = $1`
    const values = [lotId]

    const result = await db.query(query, values)

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Lot not found',
      })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error deleting lot:', error)
    res.status(500).json({
      message: 'Error deleting lot',
    })
  }
}

const updateLot = async (req, res) => {
  try {
    const { lotId } = req.params
    const {
      name,
      description,
      photoLotUrl,
      exchangeOffer,
    } = req.body

    if (!lotId) {
      return res.status(400).json({
        message: 'Lot id is required',
      })
    }

    const checkQuery = `SELECT * FROM "Lot" WHERE "id" = $1`
    const checkResult = await db.query(checkQuery, [lotId])

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Lot not found',
      })
    }

    const updateQuery = `
      UPDATE "Lot"
      SET "name" = $1, "description" = $2, "photolot" = $3, "exchangeOffer" = $4, "addeddescription" = $5
      WHERE "id" = $6
      RETURNING *
    `

    const values = [
      name,
      description,
      photoLotUrl,
      exchangeOffer,
      true,
      lotId,
    ]
    const result = await db.query(updateQuery, values)

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Lot not found',
      })
    }

    res.json({
      success: true,
      updatedLot: updateResult.rows[0],
    })
  } catch (error) {
    console.error('Error updating lot:', error)
    res.status(500).json({
      message: 'Error updating lot',
    })
  }
}

module.exports = {
  getAllLots,
  getMyLots,
  createNewLot,
  getLotById,
  getLotIds,
  getLotOwner,
  getLotByUserIdLotId,
  deleteLot,
  updateLot,
}
