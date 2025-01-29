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

module.exports = {
  getAllLots,
}
