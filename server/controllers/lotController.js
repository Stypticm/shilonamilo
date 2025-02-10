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

module.exports = {
  getAllLots,
  getMyLots,
  createNewLot,
}
